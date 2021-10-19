---
title: What is Azure Load Testing?
description: 'Azure Load Testing is a fully managed load testing service that enables developers to generate high-scale loads to optimize app performance.'
services: load-testing
ms.service: load-testing
ms.topic: overview
ms.author: nicktrog
author: ntrogh
ms.date: 10/19/2021
adobe-target: true
---

# What is Azure Load Testing Preview?

Azure Load Testing Preview is a fully managed load testing service that enables you to generate high-scale load. The service will simulate traffic for your applications, regardless of where they're hosted. Developers, testers, and quality assurance (QA) engineers can use it to optimize application performance, scalability, or capacity. 

You can create a load test using existing test scripts, based on Apache JMeter, an open-source load and performance tool. For Azure-based applications, detailed resource metrics help you to identify performance bottlenecks. Continuous integration and continuous deployment (CI/CD) workflows allow you to automate regression testing.

> [!IMPORTANT]
> Azure Load Testing is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## How does Azure Load Testing work?

Azure Load Testing test engines abstract the required infrastructure for running a high-scale load test. The test engines execute the Apache JMeter script to simulate a large number of virtual users simultaneously accessing your application endpoints. To scale out the load test, you can configure the number of test engines.

The application can be hosted anywhere: in Azure, on-premises or in other clouds. During the load test execution, detailed resource metrics are collected and displayed in a dashboard.

- *Client-side metrics* give you details reported by the test engine, such as the number of virtual users, the request response time, or the number of requests per second.

- *Server-side metrics* provide details about your Azure application components. Azure Load Testing integrates with Azure Monitor, including Application Insights and Container insights, to capture details from the Azure services. Depending on the type of service, different metrics are available. For example, the number of database reads, the type of HTTP responses, or container resource consumption.

Azure Load Testing automatically incorporates Azure networking best practices to make sure your tests run securely and reliably. Load tests are automatically aborted if the application endpoints or Azure components start throttling requests.

:::image type="content" source="./media/overview-what-is-azure-load-testing/azure-load-testing-architecture.png" alt-text="Diagram showing the Azure Load Testing architecture overview.":::

> [!NOTE]
> This image shows how Azure Load Testing uses Azure Monitor to capture metrics for app components, and isn't a comprehensive list of supported Azure resources.

## How to identify performance bottlenecks using high-scale load tests?

You can create a high-scale load test to identify application performance bottlenecks. Azure Load Testing provides a single dashboard that shows live updates of the client and server-side metrics during the load test.

For Azure-hosted applications, you can use the server-side metrics to identify which Azure component in your application is most affected by the load. You can also visually compare the metrics across multiple test runs.

After the test completes, you can download the load test results to create your own customized reports for further analysis.

## How to enable continuous regression testing?

You can integrate Azure Load Testing in your continuous integration and continuous deployment (CI/CD) pipeline at meaningful points during the development lifecycle. Automatically run a load test at the end of each sprint or in a staging environment to validate a release candidate build.

In the test configuration, you specify pass/fail rules to catch performance regressions early in the development cycle. For example, fail the test if the average response time exceeds a given threshold.

Azure Load Testing will automatically abort an automated load test in specific error conditions. You can also use the AutoStop listener in your JMeter script. Auto-aborting safeguards you against failing tests further incurring costs, for example, because of an incorrectly configured endpoint URL.

You can trigger Azure Load Testing from Azure Pipelines or GitHub Actions workflows.

## Next steps

Start using Azure Load Testing:
- [Tutorial: Run a load test in the Azure portal to identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md)
- [Tutorial: Set up a CI/CD workflow for continuous regression testing](./tutorial-continuous-regression-testing-cicd-github-actions.md)
