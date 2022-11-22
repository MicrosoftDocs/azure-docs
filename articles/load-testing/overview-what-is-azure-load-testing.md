---
title: What is Azure Load Testing?
description: 'Azure Load Testing is a fully managed load-testing service for generating high-scale loads and identifying performance bottlenecks. Quickly create a load test based on a URL or by using existing JMeter scripts.'
services: load-testing
ms.service: load-testing
ms.topic: overview
ms.author: nicktrog
author: ntrogh
ms.date: 05/13/2022
adobe-target: true
ms.custom: contperf-fy22q4
---

# What is Azure Load Testing Preview?

Azure Load Testing Preview is a fully managed load-testing service that enables you to generate high-scale load. The service simulates traffic for your applications, regardless of where they're hosted. Developers, testers, and quality assurance (QA) engineers can use it to optimize application performance, scalability, or capacity. 

Quickly [create a load test for your web application by using a URL](./quickstart-create-and-run-load-test.md), and without prior knowledge of testing tools. Azure Load Testing abstracts the complexity and infrastructure to run your load test at scale.

For Azure-based applications, Azure Load Testing collects detailed resource metrics to help you [identify performance bottlenecks](#identify-performance-bottlenecks-by-using-high-scale-load-tests) across your Azure application components.

You can [automate regression testing](#enable-automated-load-testing) by running load tests as part of your continuous integration and continuous deployment (CI/CD) workflow.

Azure Load Testing enables you to test private application endpoints or applications that you host on-premises. For more information, see the [scenarios for deploying Azure Load Testing in a virtual network](./concept-azure-load-testing-vnet-injection.md).

For more advanced load testing scenarios, you can [create a load test by reusing an existing Apache JMeter test script](how-to-create-and-run-load-test-with-jmeter-script.md), a popular open-source load and performance tool. For example, your test plan might consist of multiple application requests, or uses input data and parameters to make the test more dynamic.

Learn more about the [key concepts for Azure Load Testing](./concept-load-testing-concepts.md).

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Identify performance bottlenecks by using high-scale load tests

Performance problems often remain undetected until an application is under load. You can start a high-scale load test in the Azure portal to learn sooner how your application behaves under stress. While the test is running, the Azure Load Testing dashboard provides a live update of the client and server-side metrics.

After the load test finishes, you can use the dashboard to analyze the test results and identify performance bottlenecks. For Azure-hosted applications, the dashboard shows detailed resource metrics of the Azure application components. Get started with a tutorial to [identify performance bottlenecks for Azure-hosted applications](./tutorial-identify-bottlenecks-azure-portal.md).

Azure Load Testing keeps a history of test runs and allows you to visually [compare multiple runs](./how-to-compare-multiple-test-runs.md) to detect performance regressions.

You might also [download the test results](./how-to-export-test-results.md) for analysis in a third-party tool.

## Enable automated load testing

You can integrate Azure Load Testing in your CI/CD pipeline at meaningful points during the development lifecycle. For example, you could automatically run a load test at the end of each sprint or in a staging environment to validate a release candidate build.

Get started with [adding load testing to your CI/CD workflow](./tutorial-identify-performance-regression-with-cicd.md) to quickly identify performance degradation of your application under load.

In the test configuration, [specify test fail criteria](./how-to-define-test-criteria.md) to catch application performance or stability regressions early in the development cycle. For example, get alerted when the average response time or the number of errors exceed a specific threshold.

Azure Load Testing will automatically stop an automated load test in response to specific error conditions. You can also use the AutoStop listener in your Apache JMeter script. Automatically stopping safeguards you against failing tests further incurring costs, for example, because of an incorrectly configured endpoint URL.

You can trigger Azure Load Testing from Azure Pipelines or GitHub Actions workflows.

## How does Azure Load Testing work?

Azure Load Testing test engines abstract the required infrastructure for [running a high-scale load test](./how-to-high-scale-load.md). The test engines run the Apache JMeter script to simulate a large number of virtual users simultaneously accessing your application endpoints. When you create a load test based on a URL, Azure Load Testing automatically generates a JMeter test script for you. To scale out the load test, you can configure the number of test engines.

Azure Load Testing uses Apache JMeter version 5.4.3 for running load tests. You can use Apache JMeter plugins that are available on https://jmeter-plugins.org in your test script.

The application can be hosted anywhere: in Azure, on-premises, or in other clouds. To load test services that have no public endpoint, [deploy Azure Load Testing in a virtual network](./how-to-test-private-endpoint.md).

During the load test, the service collects the following resource metrics and displays them in a dashboard:

- *Client-side metrics* give you details reported by the test engine. These details include the number of virtual users, the request response time, or the number of requests per second.

- *Server-side metrics* provide information about your Azure application components. Azure Load Testing integrates with Azure Monitor, including Application Insights and Container insights, to capture details from the Azure services. Depending on the type of service, different metrics are available. For example, metrics can be for the number of database reads, the type of HTTP responses, or container resource consumption.

Azure Load Testing automatically incorporates best practices for Azure networking to help make sure that your tests run securely and reliably. Load tests are automatically stopped if the application endpoints or Azure components start throttling requests.

Data stored in your Azure Load Testing resource is automatically encrypted with keys managed by Microsoft (service-managed keys). This data includes, for example, your Apache JMeter script.

:::image type="content" source="./media/overview-what-is-azure-load-testing/azure-load-testing-architecture.svg" lightbox="./media/overview-what-is-azure-load-testing/azure-load-testing-architecture.svg" alt-text="Diagram that shows the Azure Load Testing architecture.":::

> [!NOTE]
> The overview image shows how Azure Load Testing uses Azure Monitor to capture metrics for app components. Learn more about the [supported Azure resource types](./resource-supported-azure-resource-types.md).

## Next steps

Start using Azure Load Testing:
- [Quickstart: Load test an existing web application](./quickstart-create-and-run-load-test.md).
- [Tutorial: Use a load test to identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md).
- [Tutorial: Set up automated load testing](./tutorial-identify-performance-regression-with-cicd.md).
- Learn about the [key concepts for Azure Load Testing](./concept-load-testing-concepts.md).
