# Microsoft Azure Documentation

Welcome to the open-source documentation repository for Microsoft Azure.

This repository contains the source files that power the Azure documentation published on Microsoft Learn. Whether you're fixing a typo, improving technical accuracy, updating examples, or contributing entirely new content, your contributions help improve the experience for millions of Azure users worldwide.

## About Azure Documentation

Microsoft Azure documentation provides guidance, tutorials, conceptual content, reference material, architecture recommendations, and best practices for Azure services and solutions.

Published documentation is available on Microsoft Learn:

* https://learn.microsoft.com/azure
* https://azure.microsoft.com

## Why Contribute?

Community contributions help us:

* Improve documentation accuracy.
* Fix outdated content.
* Clarify complex technical concepts.
* Add real-world examples and best practices.
* Enhance accessibility and readability.
* Improve the overall developer experience.

Every contribution, no matter how small, is valuable.

## Ways to Contribute

You can contribute by:

### Fixing Documentation Issues

* Correcting spelling or grammar mistakes.
* Improving formatting.
* Fixing broken links.
* Updating screenshots.
* Correcting technical inaccuracies.

### Enhancing Existing Content

* Improving explanations.
* Adding examples.
* Clarifying procedures.
* Updating outdated information.
* Adding troubleshooting guidance.

### Creating New Content

* Tutorials
* Quickstarts
* How-to guides
* Conceptual articles
* Architecture guidance
* Best practice recommendations

### Reporting Issues

If you find an issue but don't want to submit a pull request, you can:

* Open a GitHub issue.
* Use the feedback controls available on Microsoft Learn pages.
* Provide suggestions for improvements.

---

# Getting Started

## Prerequisites

Before contributing, ensure you have:

* A GitHub account
* Git installed locally
* A code editor such as Visual Studio Code
* Basic familiarity with Markdown

### Create a GitHub Account

If you do not already have a GitHub account:

https://github.com

Follow the contributor onboarding guide:

https://learn.microsoft.com/contribute/get-started-setup-github

### Install Authoring Tools

Microsoft provides recommended tools for documentation contributors.

Installation instructions:

https://learn.microsoft.com/contribute/get-started-setup-tools

Recommended tools include:

* Git
* Visual Studio Code
* Docs Authoring Pack
* Markdown linting extensions

---

# Contribution Workflow

## 1. Fork the Repository

Create your own fork of the repository.

```bash
git clone https://github.com/<your-github-username>/azure-docs.git
```

## 2. Create a Branch

Create a descriptive feature branch.

```bash
git checkout -b improve-storage-account-docs
```

## 3. Make Your Changes

Examples include:

* Updating Markdown content
* Fixing links
* Adding examples
* Improving documentation structure

## 4. Validate Your Changes

Before submitting:

* Review formatting.
* Check links.
* Verify code samples.
* Preview Markdown rendering.

## 5. Commit Your Changes

```bash
git add .
git commit -m "Improve Azure Storage documentation"
```

## 6. Push Changes

```bash
git push origin improve-storage-account-docs
```

## 7. Submit a Pull Request

Open a pull request against the main repository and provide:

* A clear title
* A concise description
* Context for the changes
* Screenshots when applicable

---

# Documentation Standards

To maintain consistency across Azure documentation:

## Writing Guidelines

* Use clear and concise language.
* Prefer active voice.
* Focus on user outcomes.
* Avoid unnecessary jargon.
* Keep instructions task-oriented.

## Markdown Guidelines

* Use proper heading hierarchy.
* Include code blocks where appropriate.
* Use descriptive link text.
* Maintain consistent formatting.

## Code Samples

When adding code:

* Ensure examples are tested.
* Include prerequisites.
* Explain expected results.
* Follow language-specific conventions.

---

# Pull Request Best Practices

To improve review efficiency:

### Use Descriptive Titles

Good:

```text
Improve Azure Kubernetes Service troubleshooting guidance
```

Avoid:

```text
Update docs
```

### Keep Changes Focused

Each pull request should ideally address a single topic or issue.

### Provide Context

Explain:

* What changed
* Why it changed
* How it was validated

---

# Repository Structure

A typical documentation article may contain:

```text
articles/
├── service-name/
│   ├── overview.md
│   ├── quickstart.md
│   ├── tutorial.md
│   └── how-to-guide.md
```

Supporting files may include:

```text
images/
includes/
media/
samples/
```

---

# Reporting Documentation Issues

If you encounter issues in Azure documentation:

## Use the Feedback Widget

Most Microsoft Learn pages include a feedback control at the bottom of the article.

Use it to report:

* Typos
* Missing information
* Broken examples
* Outdated content
* Technical inaccuracies

## Open a GitHub Issue

Provide:

* Article URL
* Description of the problem
* Steps to reproduce
* Suggested improvement

---

# Licensing

This repository includes both documentation content and code samples.

For licensing information, review:

* LICENSE
* LICENSE-CODE
* ThirdPartyNotices.md

By contributing to this repository, you agree that your contributions may be used under the terms specified in these licenses.

---

# Code of Conduct

This project follows the Microsoft Open Source Code of Conduct.

We are committed to fostering a welcoming, respectful, and inclusive community for everyone.

Resources:

* Microsoft Open Source Code of Conduct
* Code of Conduct FAQ

If you have questions or concerns regarding community conduct, contact:

[opencode@microsoft.com](mailto:opencode@microsoft.com)

---

# Additional Resources

### Microsoft Learn

https://learn.microsoft.com

### Azure Documentation

https://learn.microsoft.com/azure

### Azure Architecture Center

https://learn.microsoft.com/azure/architecture

### Microsoft Contributor Guide

https://learn.microsoft.com/contribute

### GitHub Documentation

https://docs.github.com

---

# Thank You

Thank you for helping improve Microsoft Azure documentation.

Whether you're fixing a typo, enhancing a tutorial, or contributing a major documentation update, your efforts help Azure users around the world learn, build, and succeed.
