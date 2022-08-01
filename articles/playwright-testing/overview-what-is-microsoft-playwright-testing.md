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

Quickly configure your existing [Playwright](https://playwright.dev) test suite to run your tests in the cloud. Microsoft Playwright Testing abstracts the complexity and infrastructure to run tests at scale, across multiple operating systems. Run tests for cloud-hosted applications, on-premise applications, and even *localhost* development servers.

Use the unified reporting dashboard to gain actionable insights and trends across multiple test runs. Apply the rich test results, such as logs, traces, and videos, to troubleshoot test failures quickly.

To continuously monitor application quality, you can automate your end-to-end tests as part of your continuous integration and continuous deployment (CI/CD) workflow.

<!-- Key scenarios:

- Speed up test execution with high parallelism across operating systems, device and browser configurations.
- Gain actionable pass/fail insights from a unified reporting dashboard.
- Troubleshoot test issues through easy access to rich metadata like logs, traces, and video recordings. -->

:::image type="content" source="./media/overview-what-is-microsoft-playwright-testing/microsoft-playwright-testing-architecture.png" alt-text="Diagram that shows the Microsoft Playwright Testing architecture.":::

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Run tests at scale across multiple platforms

With web UI testing, you can verify the correctness of end-to-end user scenarios for your application. You can use [Playwright](https://playwright.dev) to create end-to-end tests across different browser configurations. Update the Playwright configuration to run your existing tests suites in the cloud with Microsoft Playwright Testing. You can then use the Playwright command-line interface (CLI) to initiate your tests, or use the [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright).

You can use the cloud-based infrastructure to test both publicly and privately accessible applications without exposing inbound connections on your firewall. During the development phase, use Microsoft Playwright Testing to run tests on localhost.

Microsoft Playwright Testing provides *workers* for different operating systems. Workers are responsible for running your tests for a specific browser and device configuration. Run platform-specific tests on multiple operating systems, or perform last-mile testing for an OS before deploying in production.

You can integrate Microsoft Playwright Testing in your CI/CD pipeline to implement continuous end-to-end testing and get feedback with every application build. To reduce the time to complete your tests, scale out many parallel workers.

Get feedback early and often from your tests by scaling out across many parallel workers. Microsoft Playwright Testing abstracts the complexity to run Playwright tests at scale.

## Troubleshoot issues with rich test results

After your test suite finishes, use the Microsoft Playwright dashboard to analyze the test results and identify application issues. The dashboard shows rich test results to help diagnose failing tests:

- Error logs that show where in the test an error occurred and what the expected and actual state was.
- Application screenshots and video recordings that provide a visual representation of the application during the test run.
- Test traces that enable you to use the interactive, web-based Trace Viewer to step through the timeline of the test and inspect the application state at any point.

## Gain actionable insights

Microsoft Playwright Testing tracks the history of your test runs in the dashboard. You can use this history to analyze application quality and performance trends over time in the dashboard.

Compare test runs over time and across different browser configurations. For example, is a specific user scenario performing worse for a given device-browser-OS combination?

Identify stability issues by quickly identifying *flaky tests*, which are tests that don't consistently fail or succeed upon rerunning.

## How does Microsoft Playwright Testing work?

Microsoft Playwright Testing enables you to run Playwright end-to-end tests in a managed service. Microsoft Playwright Testing workers abstract the cloud infrastructure for operating the remote browsers that run the test steps. The workers support [multiple operating systems](./how-to-cross-platform-tests.md) and multiple browsers.

Playwright runs on the client machine and interacts with Microsoft Playwright Testing to run the tests on the remote browsers. The client machine can be your developer workstation or a CI/CD agent machine if you run your tests as part of your CI/CD pipeline. Playwright uses the test specification file to determine which steps must be run to perform the web UI test.

After a test run completes, Playwright uploads the test results and test artifacts to the service for you to view in the dashboard. Microsoft Playwright Testing stores the history of your test runs.

The Playwright configuration file contains the settings to connect with Microsoft Playwright Testing. To authorize with the service, you request an access token and add it to the Playwright configuration. 

To test applications that aren't publicly accessible, you can add a configuration setting to enable Microsoft Playwright Testing to communicate with the application over an outbound connection.

## Next steps

Start using Microsoft Playwright Testing.

- [Quickstart: Run a web UI test at scale](./quickstart-run-end-to-end-tests.md).
- [Tutorial: Identify issues with end-to-end tests](./tutorial-identify-issues-with-end-to-end-web-tests.md).
- [Tutorial: Automate end-to-end testing with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).
