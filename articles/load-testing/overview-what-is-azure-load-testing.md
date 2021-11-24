---
title: What is Azure Load Testing?
description: 'Azure Load Testing is a fully managed load testing service that enables developers to generate high-scale loads to optimize app performance.'
services: load-testing
ms.service: load-testing
ms.topic: overview
ms.author: nicktrog
author: ntrogh
ms.date: 11/30/2021
adobe-target: true
---

# What is Azure Load Testing Preview?

Azure Load Testing Preview is a fully managed load testing service that enables you to generate high-scale load. The service will simulate traffic for your applications, regardless of where they're hosted. Developers, testers, and quality assurance (QA) engineers can use it to optimize application performance, scalability, or capacity. 

You can create a load test by using existing test scripts, based on Apache JMeter, a popular open-source load and performance tool. For Azure-based applications, detailed resource metrics help you identify performance bottlenecks. Continuous integration and continuous deployment (CI/CD) workflows allow you to automate regression testing.

> [!IMPORTANT]
> Azure Load Testing is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## How does Azure Load Testing work?

Azure Load Testing test engines abstract the required infrastructure for running a high-scale load test. The test engines execute the Apache JMeter script to simulate a large number of virtual users simultaneously accessing your application endpoints. To scale out the load test, you can configure the number of test engines.

The application can be hosted anywhere: in Azure, on-premises, or in other clouds. During the load test execution, detailed resource metrics are collected and displayed in a dashboard.

- *Client-side metrics* give you details reported by the test engine, such as the number of virtual users, the request response time, or the number of requests per second.

- *Server-side metrics* provide information about your Azure application components. Azure Load Testing integrates with Azure Monitor, including Application Insights and Container insights, to capture details from the Azure services. Depending on the type of service, different metrics are available. For example, the number of database reads, the type of HTTP responses, or container resource consumption.

Azure Load Testing automatically incorporates Azure networking best practices to make sure your tests run securely and reliably. Load tests are automatically aborted if the application endpoints or Azure components start throttling requests.

Data stored in your Azure Load Testing resource is automatically and seamlessly encrypted with keys managed by Microsoft (service-managed keys). This data includes for example, your Apache JMeter script.

:::image type="content" source="./media/overview-what-is-azure-load-testing/azure-load-testing-architecture.svg" alt-text="Diagram showing the Azure Load Testing architecture overview.":::

> [!NOTE]
> This image shows how Azure Load Testing uses Azure Monitor to capture metrics for app components and isn't a comprehensive list of supported Azure resources.

## How to identify performance bottlenecks by using high-scale load tests

Performance problems often remain undetected until an application is under load. You can start a high-scale load test in the Azure portal to learn sooner how your application behaves under stress. While the test is running, the Azure Load Testing dashboard provides a live update of the client and server-side metrics.

After the load test finishes, you can use the dashboard to analyze the test results and identify performance bottlenecks. For Azure-hosted applications, the dashboard shows detailed resource metrics of the Azure application components.

Azure Load Testing keeps a history of test runs and allows you to visually compare multiple runs to detect performance regressions.

You might also download the test results for analysis in a third-party tool.

## How to enable automated load testing

You can integrate Azure Load Testing in your continuous integration and continuous deployment (CI/CD) pipeline at meaningful points during the development lifecycle. For example, you could automatically run a load test at the end of each sprint or in a staging environment to validate a release candidate build.

In the test configuration, you specify pass/fail rules to catch performance regressions early in the development cycle. For example, when the average response time exceeds a given threshold, the test should fail.

Azure Load Testing will automatically abort an automated load test in response to specific error conditions. You can also use the AutoStop listener in your Apache JMeter script. Auto-aborting safeguards you against failing tests further incurring costs, for example, because of an incorrectly configured endpoint URL.

You can trigger Azure Load Testing from Azure Pipelines or GitHub Actions workflows.

## Next steps

Start using Azure Load Testing:
- [Tutorial: Use a load test to identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md)
- [Tutorial: Set up automated load testing](./tutorial-cicd-azure-pipelines.md)
