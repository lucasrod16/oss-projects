package main

import (
	"context"
	"embed"
	"io/fs"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/lucasrod16/oss-projects/internal/api"
	"github.com/lucasrod16/oss-projects/internal/cache"
)

//go:embed ui/build/*
var ui embed.FS

func main() {
	fs, err := fs.Sub(ui, "ui/build")
	if err != nil {
		slog.Error("failed to load UI assets", "error", err)
		os.Exit(1)
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	c := cache.New()

	ticker := time.NewTicker(12 * time.Hour)
	defer ticker.Stop()

	go func() {
		for {
			select {
			case <-ctx.Done():
				slog.Error("", "error", ctx.Err())
				return
			case <-ticker.C:
				if err := c.RepoData(ctx); err != nil {
					slog.Error("", "error", err)
				}
			}
		}
	}()

	// initial fetch on startup
	if err := c.RepoData(ctx); err != nil {
		slog.Error("", "error", err)
		os.Exit(1)
	}

	mux := http.NewServeMux()
	mux.Handle("GET /", http.FileServer(http.FS(fs)))
	mux.Handle("GET /repos", api.GetRepos(c))

	rl := api.NewRateLimiter()
	limitedMux := rl.Limit(mux)

	server := &http.Server{
		Addr:         "0.0.0.0:8080",
		Handler:      limitedMux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 5 * time.Second,
	}

	go func() {
		slog.Info("API server listening on port 8080")
		if err := server.ListenAndServe(); err != http.ErrServerClosed {
			slog.Error("", "error", err)
			os.Exit(1)
		}
	}()

	<-ctx.Done()
	stop()
	slog.Info("Shutting down server...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		slog.Error("", "error", err)
		os.Exit(1)
	}
	slog.Info("Server gracefully shutdown")
}
