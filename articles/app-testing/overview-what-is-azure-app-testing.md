---
title: What is Azure App Testing?
description: Improve application quality and performance at scale with Azure App Testing. Run end-to-end Playwright tests and automated load tests using JMeter or Locust in the cloud.
ms.service: azure-app-testing
ms.topic: overview
ms.author: nandinim
author: nandinimurali
ms.date: 08/07/2025
adobe-target: true
---

# What is Azure App Testing?

Azure App Testing helps developers and QA teams run large-scale functional and performance tests to identify issues in applications before deployment. The service combines:

- **Playwright Workspaces** for end-to-end UI testing
- **Azure Load Testing** for large-scale performance and load testing

By using Azure App Testing, teams can spend less time managing test infrastructure and more time improving software quality with scalable and AI-assisted testing workflows.

---

## Core capabilities

Azure App Testing supports two major testing scenarios:

### Playwright Workspaces

Playwright Workspaces enables teams to run highly parallelized end-to-end tests across browsers and devices using Microsoft Playwright.

Key capabilities include:

- Cross-browser testing
- Parallel test execution
- Device simulation
- CI/CD integration
- Secure access controls
- Test insights and reporting

For more information, see:

- [What is Playwright Workspaces?](playwright-workspaces/overview-what-is-microsoft-playwright-workspaces.md)

---

### Azure Load Testing

Azure Load Testing enables you to simulate real-world traffic against applications hosted anywhere.

Supported test types include:

- Apache JMeter tests
- Locust tests
- URL-based load tests

The service helps identify bottlenecks, validate scalability, and monitor application behavior under stress.

For more information, see:

- [What is Azure Load Testing?](load-testing/overview-what-is-azure-load-testing.md)

---

## Architecture overview

The following diagram shows how Azure App Testing integrates Playwright Workspaces and Azure Load Testing:

:::image type="content" source="media/overview-what-is-azure-app-testing/azure-app-testing-overview.png" lightbox="media/overview-what-is-azure-app-testing/azure-app-testing-overview.png" alt-text="Overview diagram of Azure App Testing integrating Playwright Workspaces and Azure Load Testing.":::

---

# Usage scenarios

Azure App Testing is designed for the following scenarios.

## Load testing

Generate large-scale traffic to validate application scalability and performance under real-world conditions.

You can:

- Run JMeter or Locust scripts
- Create URL-based load tests
- Test applications hosted publicly or privately
- Simulate traffic from multiple Azure regions

---

## End-to-end UI testing

Run automated browser-based tests using Playwright Workspaces.

You can:

- Validate user workflows
- Test across multiple browsers and devices
- Execute tests in parallel
- Integrate testing into CI/CD pipelines

---

# Key features

## Azure Load Testing features

### High-scale load generation

Generate load from multiple regions to simulate realistic traffic patterns and identify performance bottlenecks.

### AI-powered test authoring and insights

Use GitHub Copilot Agent mode in Visual Studio Code to help create load tests and receive AI-driven recommendations from test results.

### Support for JMeter and Locust

Reuse existing Apache JMeter and Locust scripts without major modifications.

### Private endpoint testing

Securely test private applications hosted inside virtual networks or on-premises environments.

### Detailed performance insights

Analyze latency, throughput, failures, and resource utilization with built-in metrics and reporting.

---

## Playwright Workspaces features

### High parallelization

Run multiple end-to-end tests simultaneously across browsers and devices to reduce execution time.

### Cross-browser and cross-device testing

Validate application behavior consistently across supported browsers and device configurations.

### CI/CD integration

Integrate Playwright Workspaces into automated deployment pipelines to ensure continuous quality validation.

### Security and access control

Use managed identities, private networking, and Azure RBAC for secure and controlled access.

---

# In-region data residency and encryption

## Azure Load Testing

Azure Load Testing stores and processes customer data only within the region where the service instance is deployed.

---

## Playwright Workspaces

Playwright Workspaces stores and processes customer data only within the workspace deployment region.

When regional affinity is enabled, metadata transfers between regions occur securely and compliantly.

All workspace data is encrypted using Microsoft-managed keys. Examples of stored data include:

- Workspace configuration
- Test metadata
- Test execution details
- Test results
- Usage metrics

---

# Getting started

## Run Playwright tests

- [Run end-to-end tests with Playwright Workspaces](playwright-workspaces/quickstart-run-end-to-end-tests.md)

---

## Create a load test

- [Create and run a load test](load-testing/quickstart-create-and-run-load-test.md)
