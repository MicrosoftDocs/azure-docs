---
title: What is Microsoft Playwright Testing?
description: 'Microsoft Playwright Testing is a fully managed service for end-to-end testing built on top of Playwright. Run Playwright tests across multiple operating systems and browser configurations at scale.'
services: playwright-testing
ms.service: playwright-testing
ms.topic: overview
ms.author: nicktrog
author: ntrogh
ms.date: 08/23/2022
---

# What is Microsoft Playwright Testing Preview?

Microsoft Playwright Testing Preview is a fully managed service for end-to-end testing built on top of Playwright. Test end-to-end user scenarios across multiple browsers and operating systems, regardless of where you host your application. The service dashboard helps you gain actionable insights by bringing together test logs, artifacts, metrics, and traces into one view. Microsoft Playwright Testing abstracts the complexity and infrastructure to run Playwright tests at cloud scale and reduce the time to complete your tests.

You can quickly configure your existing Playwright test suite to run in the cloud, without changing your test specifications or modifying your tooling setup. Implement continuous end-to-end testing by running your Playwright tests as part of your continuous integration and continuous deployment (CI/CD) workflow.

Get started by [running a sample Playwright test suite with Microsoft Playwright Testing](./quickstart-run-end-to-end-tests.md) or [run your existing Playwright tests in the cloud](./how-to-run-with-playwright-testing.md).

To learn more about how Playwright works, visit the [Getting started documentation](https://playwright.dev/docs/intro) on the Playwright website.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Run end-to-end tests at scale across multiple platforms

Playwright lets you run end-to-end tests across multiple browser configurations. Microsoft Playwright Testing helps you run these tests at cloud scale, and on multiple operating systems.

The service enables you to run all tests on a specific operating system version, or you can [test across multiple operating systems](./how-to-cross-platform-tests.md) with each run.

Microsoft Playwright Testing lets you scale your test run across parallel *workers*, without being limited by the processing power of your local infrastructure. These workers let you achieve a high degree of parallelism across the different test cases, browser configurations, and operating systems. This parallelization helps you shorten the overall test duration.

By reducing the test duration, you can also enable [continuous end-to-end testing](./tutorial-automate-end-to-end-testing-with-github-actions.md) and get feedback with every application build. You can integrate Microsoft Playwright Testing in any CI/CD solution by using the Playwright command-line interface (CLI).

You can use the cloud-based infrastructure to test both publicly and privately accessible applications without allowing inbound connections on your firewall. During the development phase, you can also use Microsoft Playwright Testing to run tests against a localhost development server.

## Troubleshoot issues with rich test results

After your tests finish, you can [use the unified Microsoft Playwright dashboard](./tutorial-identify-issues-with-end-to-end-tests.md) to explore the test results and troubleshoot issues. You can share dashboards with people in your organization and allow others to join in for monitoring or troubleshooting.

The dashboard shows rich test results to help diagnose failing tests:

- Use error details to identify where in the test an error occurred, and what the expected and actual state was.
- Use application screenshots and video recordings for a visual representation of the application during the test run.
- Use test traces in the web-based Trace Viewer to interactively step through the timeline of the test and inspect the application state at any point during the test.

## Gain actionable insights

Microsoft Playwright Testing tracks the history of your test runs in the dashboard. You can explore the test run history to analyze application quality and performance trends over time in the dashboard.

Compare test runs over time and across different browser configurations. For example, to analyze why a specific user scenario performs badly for a given browser and operating system configuration.

Identify test and application stability issues by quickly identifying *flaky tests*. Flaky tests fail on the first run, but pass when retried without any change to the test code.

## How does Microsoft Playwright Testing work?

Microsoft Playwright Testing enables you to run Playwright end-to-end tests in a managed service. Microsoft Playwright Testing workers abstract the cloud infrastructure for operating the remote browsers that run the test steps in your test specification. The workers support [multiple operating systems](./how-to-cross-platform-tests.md) and multiple browsers.

Playwright runs on the client machine and interacts with Microsoft Playwright Testing to run the tests on the remote browsers. The client machine can be your developer workstation or a CI/CD agent machine if you run your tests as part of your CI/CD pipeline. Playwright uses the test specification file to determine which steps must be run to perform the web UI test.

After a test run completes, Playwright uploads the test results and test artifacts to the service for you to view in the dashboard. Microsoft Playwright Testing stores the history of your test runs.

:::image type="content" source="./media/overview-what-is-microsoft-playwright-testing/microsoft-playwright-testing-architecture.png" alt-text="Diagram that shows the Microsoft Playwright Testing architecture.":::

Running existing tests with Microsoft Playwright Testing requires no changes to your test specifications. Update the Playwright configuration file to add the settings to connect and authenticate with the service. To authenticate service requests, you [generate an access key](./how-to-manage-access-keys.md).

After you update the Playwright configuration file, you can continue to run your tests using the Playwright command-line interface, the Visual Studio Code extension, or integrate them in your CI/CD pipeline.

To [test applications that aren't publicly accessible](./how-to-test-private-endpoints.md), you can add a configuration setting to enable Microsoft Playwright Testing to communicate with the application over an outbound connection.

## Next steps

Start using Microsoft Playwright Testing.

- [Quickstart: Run end-to-end tests at scale](./quickstart-run-end-to-end-tests.md).
- [Tutorial: Identify issues with end-to-end tests](./tutorial-identify-issues-with-end-to-end-tests.md).
- [Tutorial: Automate end-to-end testing with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).
