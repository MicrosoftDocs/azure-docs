---
title: What is Microsoft Playwright Testing?
description: 'Microsoft Playwright Testing is a fully managed end-to-end testing service.'
services: playwright-testing
ms.service: playwright-testing
ms.topic: overview
ms.author: nicktrog
author: ntrogh
ms.date: 06/07/2022
---

# What is Microsoft Playwright Testing Preview?

Microsoft Playwright Testing Preview is a fully managed load-testing service that enables you to generate high-scale load. The service simulates traffic for your applications, regardless of where they're hosted. Developers, testers, and quality assurance (QA) engineers can use it to optimize application performance, scalability, or capacity. 

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Identify performance bottlenecks by using high-scale load tests

Performance problems often remain undetected until an application is under load. You can start a high-scale load test in the Azure portal to learn sooner how your application behaves under stress. While the test is running, the Azure Load Testing dashboard provides a live update of the client and server-side metrics.

After the load test finishes, you can use the dashboard to analyze the test results and identify performance bottlenecks. For Azure-hosted applications, the dashboard shows detailed resource metrics of the Azure application components.

## Enable automated load testing

You can integrate Azure Load Testing in your CI/CD pipeline at meaningful points during the development lifecycle. For example, you could automatically run a load test at the end of each sprint or in a staging environment to validate a release candidate build.

Azure Load Testing will automatically stop an automated load test in response to specific error conditions. You can also use the AutoStop listener in your Apache JMeter script. Automatically stopping safeguards you against failing tests further incurring costs, for example, because of an incorrectly configured endpoint URL.

You can trigger Azure Load Testing from Azure Pipelines or GitHub Actions workflows.

## How does Azure Load Testing work?

Azure Load Testing test engines abstract the required infrastructure for running a high-scale load test. The test engines run the Apache JMeter script to simulate a large number of virtual users simultaneously accessing your application endpoints. When you create a load test based on a URL, Azure Load Testing automatically generates a JMeter test script for you. To scale out the load test, you can configure the number of test engines.

The application can be hosted anywhere: in Azure, on-premises, or in other clouds. During the load test, the service collects the following resource metrics and displays them in a dashboard:

- *Client-side metrics* give you details reported by the test engine. These details include the number of virtual users, the request response time, or the number of requests per second.

- *Server-side metrics* provide information about your Azure application components. Azure Load Testing integrates with Azure Monitor, including Application Insights and Container insights, to capture details from the Azure services. Depending on the type of service, different metrics are available. For example, metrics can be for the number of database reads, the type of HTTP responses, or container resource consumption.

Azure Load Testing automatically incorporates best practices for Azure networking to help make sure that your tests run securely and reliably. Load tests are automatically stopped if the application endpoints or Azure components start throttling requests.

Data stored in your Azure Load Testing resource is automatically encrypted with keys managed by Microsoft (service-managed keys). This data includes, for example, your Apache JMeter script.

:::image type="content" source="./media/overview-what-is-microsoft-playwright-testing/azure-load-testing-architecture.svg" lightbox="./media/overview-what-is-microsoft-playwright-testing/azure-load-testing-architecture.svg" alt-text="Diagram that shows the Microsoft Playwright Testing architecture.":::

## Next steps

Start using Microsoft Playwright Testing.

- [Get started with running end-to-end web tests](./quickstart-run-end-to-end-tests.md).
