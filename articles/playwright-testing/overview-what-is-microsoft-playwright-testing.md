---
title: What is Microsoft Playwright Testing?
description: 'Microsoft Playwright Testing is a fully managed service for end-to-end testing built on top of Playwright. Run Playwright tests with high parallelization across different operating system and browser combinations simultaneously.'
ms.topic: overview
ms.date: 09/27/2023
ms.custom: playwright-testing-preview
---

# What is Microsoft Playwright Testing Preview?

Microsoft Playwright Testing Preview is a fully managed service for end-to-end testing built on top of Playwright. With Playwright, you can automate end-to-end tests to ensure your web applications work the way you expect it to, across different web browsers and operating systems. The service abstracts the complexity and infrastructure for running Playwright tests with high parallelization.

Run your Playwright test suite in the cloud, without changes to your test code or modifications to your tooling setup. Use the Playwright Test Visual Studio Code extension for a rich editor experience, or use the Playwright CLI to add automation within your continuous integration (CI) workflow.

Get started with [Quickstart: run your Playwright tests at scale with Microsoft Playwright Testing](./quickstart-run-end-to-end-tests.md).

To learn more about how Playwright works, visit the [Getting started documentation](https://playwright.dev/docs/intro) on the Playwright website.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Accelerate tests with parallel remote browsers

As your application becomes more complex, your test suite increases in size. The time to complete your test suite also grows accordingly.

Microsoft Playwright Testing enables you to distribute your tests across many parallel remote browsers, hosted on cloud infrastructure. By using cloud-hosted browsers, you can scale your test beyond the processing power of your developer workstation, local infrastructure, or continuous integration (CI) agent machines. This parallelization helps you shorten the overall test suite completion time.

Microsoft Playwright Testing supports *region affinity* to reduce the latency between your client machine and the cloud-hosted browsers. With region affinity, the service creates the hosted browsers in an Azure region that's closest to your client machine. Alternately, you can choose to run your tests on browsers in the region that's linked to your Microsoft Playwright Testing *workspace*.

## Test across multiple operating systems and browsers

Application complexity isn’t the only factor in increasing test suite size. Modern web apps need to work flawlessly across numerous browsers, operating systems, and devices. Testing across all these configurations increases the amount of time it takes to run your test suite.

With Microsoft Playwright Testing, you can run these tests simultaneously across all modern browsers on Windows, Linux, and mobile emulation of Google Chrome for Android and Mobile Safari. Microsoft Playwright Testing supports all [browsers supported by Playwright](https://playwright.dev/docs/release-notes).

## Test web applications regardless of their location

You can use Microsoft Playwright Testing for testing both publicly and privately accessible applications, without having to allow inbound connections on your firewall. During the development phase, you can also use Microsoft Playwright Testing to run tests against a localhost development server.

## How it works

Microsoft Playwright Testing instantiates cloud-hosted browsers across different operating systems. Playwright runs on the client machine and interacts with Microsoft Playwright Testing to run your Playwright tests on the hosted browsers. The client machine can be your developer workstation or a CI agent machine if you run your tests as part of your CI workflow. The Playwright test code remains on the client machine during the test run.

To run existing tests with Microsoft Playwright Testing requires no changes to your test code. Add a service configuration file to your test project, and specify your workspace settings, such as the access key and the service endpoint.

After a test run completes, Playwright sends the test run metadata to the service. The test results, trace files, and other test run files are available on the client machine. 

## In-region data residency & data at rest

Microsoft Playwright Testing doesn't store or process customer data outside the region you deploy the workspace in. When you use the regional affinity feature, the metadata is transferred from the cloud hosted browser region to the workspace region in a secure and compliant manner.

Microsoft Playwright Testing automatically encrypts all data stored in your workspace with keys managed by Microsoft (service-managed keys). For example, this data includes workspace details and Playwright test run meta data like test start and end time, test minutes, and who ran the test.

## Next step

> [!div class="nextstepaction"]
> [Run Playwright tests at scale](quickstart-run-end-to-end-tests.md)
