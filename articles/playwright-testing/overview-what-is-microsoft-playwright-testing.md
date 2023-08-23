---
title: What is Microsoft Playwright Testing?
description: 'Microsoft Playwright Testing is a fully managed service for end-to-end testing built on top of Playwright. Run Playwright tests with high parallelization across different operating system and browser combinations simultaneously.'
ms.topic: overview
ms.date: 08/23/2022
ms.custom: playwright-testing-preview
---

# What is Microsoft Playwright Testing Preview?

With Playwright, you can automate end-to-end tests to ensure your web apps work the way you expect it to, across different web browsers and operating systems. Microsoft Playwright Testing Preview is a fully managed service for end-to-end testing built on top of Playwright. The service abstracts the complexity and infrastructure for running Playwright tests with high parallelization across different operating system and browser combinations simultaneously.

Run your Playwright test suite in the cloud, without changes to your test code or modifications to your tooling setup. Use the Playwright Test Visual Studio Code extension for a rich editor experience, or use the Playwright CLI to add automation within your continuous integration (CI) workflow.

Get started by [running your Playwright tests at scale with Microsoft Playwright Testing](./quickstart-run-end-to-end-tests.md).

The following diagram shows an architecture overview of Microsoft Playwright Testing.

:::image type="content" source="./media/overview-what-is-microsoft-playwright-testing/microsoft-playwright-testing-architecture.png" alt-text="Diagram that shows the Microsoft Playwright Testing architecture.":::

To learn more about how Playwright works, visit the [Getting started documentation](https://playwright.dev/docs/intro) on the Playwright website.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Get test suite results faster

As your application becomes more complex, your test suite for comprehensive testing increases in size. The time to complete your test suite also grows accordingly.

Microsoft Playwright enables you to distribute your tests across many parallel browsers, hosted on cloud infrastructure. By using cloud-hosted browsers, you can scale your test beyond the processing power of your developer workstation, or local infrastructure. This parallelization helps you shorten the overall test suite completion time.

Microsoft Playwright Testing supports *regional affinity* to reduce the latency between your client machine and the cloud-hosted browsers. With regional affinity, the service creates the hosted browsers in an Azure region that's closest to your client machine. Alternately, you can choose to run your tests on browsers in the region that's linked to your Microsoft Playwright Testing *workspace*.

## Test across multiple operating systems and browsers

App complexity isn’t the only factor in increasing test suite size. Modern web apps need to work flawlessly across numerous browsers, operating systems, and devices. Testing across all these variables increases the amount of time it takes to run your test suite.

With Microsoft Playwright Testing, you can run these tests simultaneously across all modern browsers on Windows, Linux, and mobile emulation of Google Chrome for Android and Mobile Safari. Microsoft Playwright Testing supports all [browsers supported by Playwright](https://playwright.dev/docs/release-notes).

## Test web applications regardless of their location

You can use Microsoft Playwright Testing for testing both publicly and privately accessible applications, without having to allow inbound connections on your firewall. During the development phase, you can also use Microsoft Playwright Testing to run tests against a localhost development server.

## How it works

Microsoft Playwright Testing enables you to run Playwright end-to-end tests in a managed service. Microsoft Playwright Testing workers abstract the cloud infrastructure for operating the remote browsers that run the test steps in your test specification. The workers support [multiple operating systems](./how-to-cross-platform-tests.md) and multiple browsers.

Playwright runs on the client machine and interacts with Microsoft Playwright Testing to run the tests on the remote browsers. The client machine can be your developer workstation or a CI/CD agent machine if you run your tests as part of your CI/CD pipeline. Playwright uses the test specification file to determine which steps must be run to perform the web UI test.

After a test run completes, Playwright uploads the test results and test artifacts to the service for you to view in the dashboard. Microsoft Playwright Testing stores the history of your test runs.

Running existing tests with Microsoft Playwright Testing requires no changes to your test specifications. Update the Playwright configuration file to add the settings to connect and authenticate with the service. To authenticate service requests, you [generate an access key](./how-to-manage-access-keys.md).

After you update the Playwright configuration file, you can continue to run your tests using the Playwright command-line interface, the Visual Studio Code extension, or integrate them in your CI/CD pipeline.

To [test applications that aren't publicly accessible](./how-to-test-private-endpoints.md), you can add a configuration setting to enable Microsoft Playwright Testing to communicate with the application over an outbound connection.

## Limitations

- Only hosted browsers on Linux and Windows are supported.
- During preview, the service supports up to a maximum of 50 parallel workers.
- Only the Playwright runner and test code written in JavaScript or TypeScript are supported.

## Data at rest

Microsoft Playwright Testing automatically encrypts all data stored in your workspace with keys managed by Microsoft (service-managed keys). For example, this data includes workspace details and Playwright test run metadata, such as test start time, test duration, number of parallel workers.

## In-region data residency
Microsoft Playwright Testing doesn't store or process customer data outside the region you deploy the workspace in.

## Next step

> [!div class="nextstepaction"]
> [Run Playwright tests at scale](quickstart-run-end-to-end-tests.md)
