---
title: What is Azure Load Testing?
description: 'Azure Load Testing is a fully managed load testing service built for Microsoft Azure that enables developers to generate high-scale loads to optimize app performance.'
services: load-testing
ms.service: load-testing
ms.topic: overview
ms.author: nicktrog
author: ntrogh
ms.date: 10/11/2021
adobe-target: true
---

# What is Azure Load Testing?

Azure Load Testing is a fully managed load testing service built for Microsoft Azure that enables you to generate high-scale load. Developers, testers, and quality assurance (QA) engineers can use it to optimize application performance, scalability, or capacity.

You can create a load test using existing Apache JMeter scripts and identify bottlenecks in your Azure-hosted endpoints. Continuous integration and continuous deployment (CI/CD) workflows allow you to automate regression testing.

> [!IMPORTANT]
> Azure Load Testing is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## How does Azure Load Testing work?

Azure Load Testing test engines abstract the required infrastructure for running a high-scale load test. The test engines execute the Apache JMeter script to call your application endpoints. You can configure the number of test engines to scale out your load test.

During the load test execution, Azure Monitor collects the metrics of your Azure application components. The Azure Load Testing dashboard visualizes the application and test engine metrics.

:::image type="content" source="./media/overview-what-is-azure-load-testing/azure-load-testing-architecture.png" alt-text="Diagram showing the Azure Load Testing architecture overview.":::

Azure Load Balancing integrates with Azure networking to avoid load tests being mistaken for a security risk, such as a denial of service (DoS) attack. When the service detects throttling, the load test is automatically aborted.

> [!NOTE]
> This image shows how Azure Load Testing uses Azure Monitor to capture metrics for app components, and isn't a comprehensive list of supported Azure resources.

## How to identify performance bottlenecks using high-scale load tests?

Performance bottlenecks often remain undetected until the application is experiencing high load. You can create a high-scale load test to simulate large numbers of *virtual users* simultaneously accessing your application endpoints.

Azure Load Testing integrates with Azure Monitor to track performance metrics for the Azure resources across your application. These metrics allow you to identify which component is responsible for the performance problem. For example, the application service cpu percentage, the number of database requests, or the available storage.

## How to enable continuous regression testing?

You can integrate Azure Load Testing in your continuous integration and continuous deployment (CI/CD) pipeline. With each application build, you run a load test and compare the results against a baseline. This allows you to identify performance regressions early in the development cycle and implement continuous improvement.

You can run an Azure Load Testing load test from Azure Pipelines or GitHub Actions workflows.

<!-- (set pass/fail criteria for load tests) -->

## Analyze test results for insights

Azure Load Testing provides you a single, consolidated dashboard to analyze the load test results. The dashboard shows live updates of the test engine and application metrics during the load test. After the test completes, you can download the load test results to create your own customized reports for further analysis.

The test results consist of *client-side* and *server-side* metrics:

- Client-side metrics give you details about the load test engine. For example, the number of virtual users, the request response time, or the number of requests per second. The client-side metrics can help you determine the scale limits of your application.

- Server-side metrics provide you information about your application. Azure Load Testing integrates with Azure Monitor to capture details from your Azure application services. Depending on the type of service, you can view different metrics. For example, for a database you have the number of reads or writes and for a web site you view statistics of each type of HTTP request. The server-side metrics can give you insights about how load affects the different parts of your application.

## Next steps

Start using Azure Load Testing:
- [Tutorial: Run a load test in the Azure portal to identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md)
- [Run a load test in Visual Studio Code to identify performance bottlenecks](./how-to-identify-bottlenecks-vs-code.md)
