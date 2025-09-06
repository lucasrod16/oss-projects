package main

import (
	"fmt"
	"log/slog"
	"net/smtp"
	"os"
)

type email struct {
	from     string
	to       string
	smtpHost string
	smtpPort string
	subject  string
	body     string
}

func (e email) Send(password string) error {
	msg := []byte(fmt.Sprintf(
		"To: %s\r\n"+
			"From: %s\r\n"+
			"Subject: %s\r\n"+
			"\r\n"+
			"%s\r\n",
		e.to, e.from, e.subject, e.body,
	))
	auth := smtp.PlainAuth("", e.from, password, e.smtpHost)
	return smtp.SendMail(e.smtpHost+":"+e.smtpPort, auth, e.from, []string{e.to}, msg)
}

func main() {
	password := os.Getenv("GMAIL_APP_PASSWORD")
	workflowURL := os.Getenv("WORKFLOW_URL")
	if password == "" {
		slog.Error("GMAIL_APP_PASSWORD environment variable must be set.")
		os.Exit(1)
	}
	if workflowURL == "" {
		slog.Error("WORKFLOW_URL environment variable must be set.")
		os.Exit(1)
	}
	email := email{
		from:     "lucas.rodriguez9616@gmail.com",
		to:       "lucas.rodriguez9616@gmail.com",
		smtpHost: "smtp.gmail.com",
		smtpPort: "587",
		subject:  "OSS Projects GitHub Workflow Failure",
		body: fmt.Sprintf(
			"The oss-projects cronjob workflow did not succeed. "+
				"The GitHub data in the 'https://gist.github.com/lucasrod16/dafa982abfa42982e02c75f1ddec46be' gist was not updated.\n\n"+
				"Workflow URL: %s",
			workflowURL,
		),
	}
	if err := email.Send(password); err != nil {
		slog.Error("failed to send email", "error", err)
		os.Exit(1)
	}
	slog.Info("Email sent successfully!")
}
