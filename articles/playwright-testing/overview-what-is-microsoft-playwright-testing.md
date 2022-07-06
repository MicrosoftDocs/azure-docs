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

## Run cross-platform, cross-browser tests at scale

Performance problems often remain undetected until an application is under load. You can start a high-scale load test in the Azure portal to learn sooner how your application behaves under stress. While the test is running, the Azure Load Testing dashboard provides a live update of the client and server-side metrics.

After the load test finishes, you can use the dashboard to analyze the test results and identify performance bottlenecks. For Azure-hosted applications, the dashboard shows detailed resource metrics of the Azure application components.

## Gain actionable insights 

You can integrate Azure Load Testing in your CI/CD pipeline at meaningful points during the development lifecycle. For example, you could automatically run a load test at the end of each sprint or in a staging environment to validate a release candidate build.

Azure Load Testing will automatically stop an automated load test in response to specific error conditions. You can also use the AutoStop listener in your Apache JMeter script. Automatically stopping safeguards you against failing tests further incurring costs, for example, because of an incorrectly configured endpoint URL.

You can trigger Azure Load Testing from Azure Pipelines or GitHub Actions workflows.

## Troubleshoot test issues with rich test results

## How does Microsoft Playwright Testing work?

Azure Load Testing test engines abstract the required infrastructure for running a high-scale load test. The test engines run the Apache JMeter script to simulate a large number of virtual users simultaneously accessing your application endpoints. When you create a load test based on a URL, Azure Load Testing automatically generates a JMeter test script for you. To scale out the load test, you can configure the number of test engines.

The application can be hosted anywhere: in Azure, on-premises, or in other clouds. During the load test, the service collects the following resource metrics and displays them in a dashboard:

- *Client-side metrics* give you details reported by the test engine. These details include the number of virtual users, the request response time, or the number of requests per second.

- *Server-side metrics* provide information about your Azure application components. Azure Load Testing integrates with Azure Monitor, including Application Insights and Container insights, to capture details from the Azure services. Depending on the type of service, different metrics are available. For example, metrics can be for the number of database reads, the type of HTTP responses, or container resource consumption.

Azure Load Testing automatically incorporates best practices for Azure networking to help make sure that your tests run securely and reliably. Load tests are automatically stopped if the application endpoints or Azure components start throttling requests.

Data stored in your Azure Load Testing resource is automatically encrypted with keys managed by Microsoft (service-managed keys). This data includes, for example, your Apache JMeter script.


## Next steps

Start using Microsoft Playwright Testing.

- [Quickstart: Run a web UI test at scale](./quickstart-run-end-to-end-tests.md).
- [Tutorial: Identify issues with end-to-end tests](./tutorial-identify-issues-with-end-to-end-web-tests.md).
- [Tutorial: Automate end-to-end testing with GitHub Actions](./tutorial-automate-end-to-end-testing-with-github-actions.md).
