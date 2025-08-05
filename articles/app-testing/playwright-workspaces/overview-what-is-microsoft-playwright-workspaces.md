---
title: What is Playwright Workspaces?
titleSuffix: Playwright Workspaces
description: 'Playwright Workspaces is a fully managed service for end-to-end testing built on top of Playwright. Run Playwright tests with high parallelization across different operating system and browser combinations simultaneously.'
ms.topic: overview
ms.date: 08/07/2025
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: ninallam
ms.author: ninallam
ms.custom: playwright-workspaces-preview
---

# What is Playwright Workspaces?

Playwright Workspaces is a fully managed service for end-to-end testing built on top of Playwright. With Playwright, you can automate end-to-end tests to ensure your web applications work the way you expect it to, across different web browsers and operating systems. The service abstracts the complexity and infrastructure for running Playwright tests with high parallelization to help you ship features faster and troubleshoot easily. 

Run your Playwright test suite in the cloud, without changes to your test code or modifications to your tooling setup. Use the [Playwright Test Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) for a rich editor experience, or use the Playwright CLI to add automation within your continuous integration (CI) workflow.

Get started with [Quickstart: run your Playwright tests at scale with Playwright Workspaces](./quickstart-run-end-to-end-tests.md).

To learn more about how to create end-to-end tests with the Playwright framework, visit the [Getting started documentation](https://playwright.dev/docs/intro) on the Playwright website.

> [!IMPORTANT]
> Playwright Workspaces is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Accelerate tests with parallel remote browsers

As your application becomes more complex, your test suite increases in size. The time to complete your test suite also grows accordingly. Use parallel remote browsers to shorten the overall test suite completion time.

- Distribute your tests across many parallel browsers, hosted on cloud infrastructure.

- Scale your tests beyond the processing power of your developer workstation, local infrastructure, or CI agent machines.

- Consistent regional performance by running your tests on browsers in an Azure region that's closest to your client machine.

Learn more about how you can [configure for optimal performance](./concept-determine-optimal-configuration.md).

## Test consistently across multiple operating systems and browsers

Modern web apps need to work flawlessly across numerous browsers, operating systems, and devices.

- Run tests simultaneously across all modern browsers on Windows, Linux, and mobile emulation of Google Chrome for Android and Mobile Safari.

- Using service-managed browsers ensures consistent and reliable results for both functional and visual regression testing, whether tests are run from your team's developer workstations or CI pipeline.

- Playwright Workspaces supports all [browsers supported by Playwright](https://playwright.dev/docs/release-notes).

## Endpoint testing

Use cloud-hosted remote browsers to test web applications regardless of where they're hosted, without having to allow inbound connections on your firewall.

- Test publicly and privately hosted applications.

- During the development phase, [run tests against a localhost development server](./how-to-test-local-applications.md).

## Playwright support

Playwright Workspaces is built on top of the Playwright framework.

- Support for multiple versions of Playwright with each new Playwright release.

- Integrate your existing Playwright test suite without changing your test code.

- Use the [Playwright Test Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) for a rich editor experience.

- Continuous end-to-end testing by using the Playwright CLI to [integrate with continuous integration (CI) tools](./quickstart-automate-end-to-end-testing.md).

## How it works

Playwright Workspaces instantiates cloud-hosted browsers across different operating systems. Playwright executes tests on the client machine—either a developer workstation or a CI agent—and remotely control cloud-hosted browsers via the Playwright Workspaces service. The test code remains on the client machine throughout the test run, while browser interactions are performed in the cloud.

:::image type="content" source="./media/overview-what-is-microsoft-playwright-workspaces/playwright-workspaces-architecture-overview.png" alt-text="Diagram that shows an architecture overview of Playwright Workspaces." lightbox="./media/overview-what-is-microsoft-playwright-workspaces/playwright-workspaces-architecture-overview.png":::

After a test run completes, the test results, trace files, and other test run files are available on the client machine.

You don’t need to modify your existing test code to run it with Playwright Workspaces. Simply install the Playwright Workspaces package and specify your workspace endpoint.

Learn more about how to [determine the optimal configuration for optimizing test suite completion](./concept-determine-optimal-configuration.md).

## In-region data residency & data at rest

Playwright Workspaces doesn't store or process customer data outside the region you deploy the workspace in. When you use the regional affinity feature, the metadata is transferred from the cloud hosted browser region to the workspace region in a secure and compliant manner.

Playwright Workspaces automatically encrypts all data stored in your workspace with keys managed by Microsoft (service-managed keys). For example, this data includes workspace details, Playwright test run metadata like test start and end time, test minutes, who ran the test, and test results which are published to the service.

## Next step

> [!div class="nextstepaction"]
> [Quickstart: Run Playwright tests at scale](quickstart-run-end-to-end-tests.md)
