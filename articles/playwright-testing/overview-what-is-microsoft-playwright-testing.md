---
title: What is Microsoft Playwright Testing?
description: 'Microsoft Playwright Testing is a fully managed web UI testing service. Run Playwright tests across multiple operating systems and browser configurations at scale in the cloud, regardless of where the application is hosted.'
services: playwright-testing
ms.service: playwright-testing
ms.topic: overview
ms.author: nicktrog
author: ntrogh
ms.date: 07/06/2022
---

# What is Microsoft Playwright Testing Preview?

Microsoft Playwright Testing Preview is a fully managed web UI testing service. The service enables you to validate that your web application runs correctly
across operating systems, device and browser configurations, regardless of where the application is hosted. Developers and testers can use it to optimize application quality by testing end-to-end user scenarios.

Quickly configure your existing Playwright test suite to run your tests in the cloud. Microsoft Playwright Testing abstracts the complexity and infrastructure to run tests at scale, across multiple operating systems. Run tests for cloud-hosted applications, on-premise applications, and even *localhost* development servers.

Use the unified reporting dashboard to gain actionable insights and trends across multiple test runs. Leverage the rich test results, such as logs, traces, and videos, to troubleshoot test failures quickly.

To continuously monitor application quality, you can automate your end-to-end tests as part of your continuous integration and continuous deployment (CI/CD) workflow.

<!-- Key scenarios:

- Speed up test execution with high parallelism across operating systems, device and browser configurations.
- Gain actionable pass/fail insights from a unified reporting dashboard.
- Troubleshoot test issues through easy access to rich metadata like logs, traces, and video recordings. -->

:::image type="content" source="./media/overview-what-is-microsoft-playwright-testing/microsoft-playwright-testing-architecture.png" alt-text="Diagram that shows the Microsoft Playwright Testing architecture.":::

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Run tests at scale

- test often, immediate feedback -> run tests as fast as possible
- run tests across all supported configurations (browser, os, device) -> provision test environment
- run tests for applications regardless of where they run - no need to open up your firewall for inbound connections
- run interactively from CLI or using VS Code extension, or run automated in CI/CD

Playwright tests
Configuration change to easily run existing Playwright tests in the cloud
Configure browser-OS configuration for all tests, subset of tests
Configure number of parallel workers to run your tests at speed, without impact on your developer machine

## Gain actionable insights 

- See evolution of test quality over time
- Identify flaky tests
- Test performance over time
- Compare test results across different configs (OS, browser, ..)

## Troubleshoot test issues with rich test results

- rich test results to diagnose failing tests
- point-in-time info (screenshots, error info)
- Step through timeline of events and get test & app state (traces)
- use browser-based experience

## How does Microsoft Playwright Testing work?

Microsoft Playwright Testing provides remote workers (browsers) and unified portal to present test run results
Playwright Test Runner or library are running on client machine (developer workstation or CI/CD agent machine)
Playwright uses test spec locally to drive the test execution
Enable testing of both public endpoints, or private endpoints.

## Next steps

Start using Microsoft Playwright Testing.

- [Quickstart: Run a web UI test at scale](./quickstart-run-end-to-end-tests.md).
- [Tutorial: Identify issues with end-to-end tests](./tutorial-identify-issues-with-end-to-end-web-tests.md).
- [Tutorial: Automate end-to-end testing with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).
