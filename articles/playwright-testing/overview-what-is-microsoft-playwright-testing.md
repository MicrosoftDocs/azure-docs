---
title: What is Microsoft Playwright Testing?
description: 'Microsoft Playwright Testing is a fully managed end-to-end testing service. Run Playwright tests across multiple operating systems and browser configurations at scale in the cloud, regardless of where the application is hosted.'
services: playwright-testing
ms.service: playwright-testing
ms.topic: overview
ms.author: nicktrog
author: ntrogh
ms.date: 07/06/2022
---

# What is Microsoft Playwright Testing Preview?

Microsoft Playwright Testing Preview is a fully managed service for running Playwright tests at scale, regardless of where your application is hosted. [Playwright](https://playwright.dev) is an open-source framework for running end-to-end tests to validate your app runs correctly for multiple browser configurations. Developers and testers can use Microsoft Playwright Testing to:

- Run end-to-end tests to validate application user scenarios.
- Speed up test completion by scaling across parallel workers.
- Help diagnose failing tests by using rich test results.
- Help identify flaky tests.
- Help continuously improve app quality and stability.
- Help identify app user interface regressions.

Microsoft Playwright Testing:

- Supports [running existing Playwright tests](./how-to-run-with-playwright-testing.md) without changes to the test specifications.
- Supports [running tests across multiple operating systems](./how-to-cross-platform-tests.md) and browser configurations.
- Works for apps hosted [on-premises, hybrid, or on any public cloud](./how-to-test-private-endpoints.md).
- Integrates with CI/CD solutions for [continuous end-to-end testing](./tutorial-automate-end-to-end-testing-with-github-actions.md).
- Integrates with the Playwright Test runner and the Playwright Visual Studio Code extension.
- Uses Azure Active Directory and Azure role-based access for enterprise security.

Get started with [running end-to-end tests at scale with Microsoft Playwright Testing](./quickstart-run-end-to-end-tests.md).

:::image type="content" source="./media/overview-what-is-microsoft-playwright-testing/microsoft-playwright-testing-architecture.png" alt-text="Diagram that shows the Microsoft Playwright Testing architecture.":::

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Run end-to-end tests at scale across multiple platforms

With end-to-end testing, you can verify the correctness of end-to-end user scenarios for your application. You can use [Playwright](https://playwright.dev) to create tests across different browser configurations. Quickly configure your Playwright tests to run in the cloud, without any code changes, and then use the Playwright command-line interface (CLI) or use the [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) to initiate the tests.

Get feedback early and often from your tests by scaling out across many parallel workers. Microsoft Playwright Testing abstracts the complexity to run Playwright tests at scale.

You can use the cloud-based infrastructure to test both publicly and privately accessible applications without exposing inbound connections on your firewall. During the development phase, use Microsoft Playwright Testing to run tests on localhost.

Microsoft Playwright Testing provides *workers* for multiple operating systems. Workers are responsible for running your tests for a specific browser and device configuration. Run platform-specific tests on multiple operating systems, or perform last-mile testing for an OS before deploying in production.

You can integrate Microsoft Playwright Testing in your CI/CD pipeline to implement continuous end-to-end testing and get feedback with every application build. To reduce the time to complete your tests, scale out many parallel workers.

## Troubleshoot issues with rich test results

After your tests finish, you can [use the unified Microsoft Playwright dashboard](./tutorial-identify-issues-with-end-to-end-web-tests.md) to explore the test results and troubleshoot issues. The dashboard shows rich test results to help diagnose failing tests:

- Use error details to identify where in the test an error occurred, and what the expected and actual state was.
- Use application screenshots and video recordings for a visual representation of the application during the test run.
- Use test traces in the web-based Trace Viewer, to interactively step through the timeline of the test and inspect the application state at any point during the test.

## Gain actionable insights

Microsoft Playwright Testing tracks the history of your test runs in the dashboard. You can explore the test run history to analyze application quality and performance trends over time in the dashboard.

Compare test runs over time and across different browser configurations. For example, to analyze if a given user scenario is performing badly for a given device-browser-OS combination.

Identify test and application stability issues by quickly identifying *flaky tests*. Flaky tests fail on the first run, but pass when retried without any change to the test code.

## How does Microsoft Playwright Testing work?

Microsoft Playwright Testing enables you to run Playwright end-to-end tests in a managed service. Microsoft Playwright Testing workers abstract the cloud infrastructure for operating the remote browsers that run the test steps. The workers support [multiple operating systems](./how-to-cross-platform-tests.md) and multiple browsers.

Playwright runs on the client machine and interacts with Microsoft Playwright Testing to run the tests on the remote browsers. The client machine can be your developer workstation or a CI/CD agent machine if you run your tests as part of your CI/CD pipeline. Playwright uses the test specification file to determine which steps must be run to perform the web UI test.

After a test run completes, Playwright uploads the test results and test artifacts to the service for you to view in the dashboard. Microsoft Playwright Testing stores the history of your test runs.

The Playwright configuration file contains the settings to connect with Microsoft Playwright Testing. To authorize with the service, you [generate an access key](./how-to-manage-access-keys.md) and add it to the Playwright configuration.

Running existing tests with Microsoft Playwright Testing requires no changes to your test specifications. After you update the Playwright configuration file, you can continue to run your tests using the Playwright command-line interface, the Visual Studio Code extension, or integrate them in your CI/CD pipeline.

To test applications that aren't publicly accessible, you can add a configuration setting to enable Microsoft Playwright Testing to communicate with the application over an outbound connection.

## Next steps

Start using Microsoft Playwright Testing.

- [Quickstart: Run end-to-end tests at scale](./quickstart-run-end-to-end-tests.md).
- [Tutorial: Identify issues with end-to-end tests](./tutorial-identify-issues-with-end-to-end-web-tests.md).
- [Tutorial: Automate end-to-end testing with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).
