describe("Check Page Title", () => {
	it("has title", () => {
		cy.visit("/");
		cy.title().should("eq", "oss-projects");
	});
});

describe("Navbar Link", () => {
	it("clicking navbar brand takes user to top of the page", () => {
		cy.visit("/");
		cy.scrollTo(0, 500);
		cy.contains("osscontribute.dev").click();
		cy.window().should("have.property", "scrollY", 0);
	});
});

describe("Filter Dropdown", () => {
	it("clicking each language in the filter dropdown shows at least 1 card", () => {
		cy.visit("/");
		cy.get("#language-select").click();
		cy.get('li[role="option"]').each(($language) => {
			cy.get("#language-select").click({ force: true });
			cy.wrap($language).click();
			cy.get("a.MuiCard-root").should("have.length.greaterThan", 0);
		});
	});

	it("languages should be displayed in alphabetical order", () => {
		cy.visit("/");
		cy.get("#language-select").click();

		// Get all language options except "All Languages"
		cy.get('li[role="option"]')
			.not(':contains("All Languages")')
			.then(($options) => {
				const languages = Array.from($options).map(
					(el) => el.textContent?.trim() || ""
				);
				const sortedLanguages = [...languages].sort();

				// Compare the actual order with the sorted order
				expect(languages).to.deep.equal(sortedLanguages);
			});
	});

	it("should filter repositories by selected language using data-testid", () => {
		cy.visit("/");

		// Open the filter dropdown
		cy.get('[data-testid="language-filter"]').click();

		// Click on a specific language (e.g., TypeScript if available)
		cy.get('[data-testid^="language-option-"]').first().click();

		// Verify that cards are displayed
		cy.get("a.MuiCard-root").should("have.length.greaterThan", 0);

		// Reset to "All Languages"
		cy.get('[data-testid="language-filter"]').click();
		cy.get('[data-testid="all-languages-option"]').click();

		// Verify that more cards are displayed when showing all languages
		cy.get("a.MuiCard-root").should("have.length", 20);
	});
});

describe("Pagination", () => {
	beforeEach(() => {
		cy.visit("/");
	});

	it("should navigate to the next page and show different content", () => {
		cy.get("a.MuiCard-root").should("have.length", 20);
		cy.get('button[aria-label="Go to next page"]').click();
		cy.get("a.MuiCard-root").should("have.length", 20);
	});

	it("should navigate to a specific page and show correct content", () => {
		cy.get('button[aria-label="Go to page 2"]').click();
		cy.get("a.MuiCard-root").should("have.length", 20);
	});

	it("should show the correct number of cards when filtering", () => {
		cy.get("#language-select").click({ force: true });
		cy.get('li[role="option"]').contains("TypeScript").click();
		cy.get("a.MuiCard-root").should("have.length.greaterThan", 0);

		// ensure pagination still works after filtering
		cy.get('button[aria-label="Go to next page"]').click();
		cy.get("a.MuiCard-root").should("have.length.greaterThan", 0);
	});
});
