---
title: What is Azure Load Testing?
description: 'Azure Load Testing is a fully managed load-testing service for generating high-scale loads and identifying performance bottlenecks. Quickly create a load test based on a URL or by using existing JMeter scripts.'
services: load-testing
ms.service: load-testing
ms.topic: overview
ms.author: nicktrog
author: ntrogh
ms.date: 05/09/2023
adobe-target: true
ms.custom: contperf-fy22q4
---

# What is Azure Load Testing?

Azure Load Testing is a fully managed load-testing service that enables you to generate high-scale load. The service simulates traffic for your applications, regardless of where they're hosted. Developers, testers, and quality assurance (QA) engineers can use it to optimize application performance, scalability, or capacity. 

Quickly [create a load test for your web application by using a URL](./quickstart-create-and-run-load-test.md), and without prior knowledge of testing tools. Azure Load Testing abstracts the complexity and infrastructure to run your load test at scale.

For more advanced load testing scenarios, you can [create a load test by reusing an existing Apache JMeter test script](how-to-create-and-run-load-test-with-jmeter-script.md), a popular open-source load and performance tool. For example, your test plan might consist of multiple application requests, you want to call non-HTTP endpoints, or you're using  input data and parameters to make the test more dynamic.

If your application is hosted on Azure, Azure Load Testing collects detailed resource metrics to help you [identify performance bottlenecks](#identify-performance-bottlenecks-by-using-high-scale-load-tests) across your Azure application components.

To capture application performance regressions early, add your load test in your [continuous integration and continuous deployment (CI/CD) workflow](./quickstart-add-load-test-cicd.md). Leverage test fail criteria to define and validate your application quality requirements.

Azure Load Testing enables you to test private application endpoints or applications that you host on-premises. For more information, see the [scenarios for deploying Azure Load Testing in a virtual network](./concept-azure-load-testing-vnet-injection.md).

The following diagram shows an architecture overview of Azure Load Testing.

:::image type="content" source="./media/overview-what-is-azure-load-testing/azure-load-testing-architecture.png" lightbox="./media/overview-what-is-azure-load-testing/azure-load-testing-architecture-large.png" alt-text="Diagram that shows the Azure Load Testing architecture.":::

> [!NOTE]
> The overview image shows how Azure Load Testing uses Azure Monitor to capture metrics for app components. Learn more about the [supported Azure resource types](./resource-supported-azure-resource-types.md).

Learn more about the [key concepts for Azure Load Testing](./concept-load-testing-concepts.md).

## Usage scenarios

Azure Load Testing uses Apache JMeter and supports a wide range of application types and communication protocols. The following list provides examples of supported application or endpoint types:

- Web applications, using HTTP or HTTPS
- REST APIs
- Databases via JDBC
- TCP-based endpoints

By [using JMeter plugins](./how-to-use-jmeter-plugins.md) in your test script, you can load test more application types.

With the quick test experience you can [test a single URL-based HTTP endpoint](./quickstart-create-and-run-load-test.md). By [uploading a JMeter script](how-to-create-and-run-load-test-with-jmeter-script.md), you can use all JMeter-supported communication protocols.

## Identify performance bottlenecks by using high-scale load tests

Performance problems often remain undetected until an application is under load. You can start a high-scale load test in the Azure portal to learn sooner how your application behaves under stress. While the test is running, the Azure Load Testing dashboard provides a live update of the client and server-side metrics.

After the load test finishes, you can use the dashboard to analyze the test results and identify performance bottlenecks. For Azure-hosted applications, the dashboard shows detailed resource metrics of the Azure application components. Get started with a tutorial to [identify performance bottlenecks for Azure-hosted applications](./tutorial-identify-bottlenecks-azure-portal.md).

Azure Load Testing keeps a history of test runs and allows you to visually [compare multiple runs](./how-to-compare-multiple-test-runs.md) to detect performance regressions over time.

You might also [download the test results](./how-to-export-test-results.md) for analysis in a third-party tool.

## Enable automated load testing

You can integrate Azure Load Testing in your CI/CD pipeline at meaningful points during the development lifecycle. For example, you could automatically run a load test at the end of each sprint or in a staging environment to validate a release candidate build.

Get started with [adding load testing to your CI/CD workflow](./quickstart-add-load-test-cicd.md) to quickly identify performance degradation of your application under load.

In the test configuration, [specify test fail criteria](./how-to-define-test-criteria.md) to catch application performance or stability regressions early in the development cycle. For example, get alerted when the average response time or the number of errors exceed a specific threshold.

Azure Load Testing will automatically stop an automated load test in response to specific error conditions. Alternately, you can also use the AutoStop listener in your Apache JMeter script. Automatically stopping safeguards you against failing tests further incurring costs, for example, because of an incorrectly configured endpoint URL. Learn how you can [configure auto stop for your load test](./how-to-define-test-criteria.md#auto-stop-configuration).

You can trigger Azure Load Testing from Azure Pipelines or GitHub Actions workflows.

## How does Azure Load Testing work?

Azure Load Testing uses Apache JMeter for running load tests. You can use Apache JMeter plugins from https://jmeter-plugins.org or [upload your own plugin code](./how-to-use-jmeter-plugins.md). Azure Load Testing supports all communication protocols that JMeter supports. For example, to load test a database connection or message queue. Learn more about the [supported Apache JMeter functionality](./resource-jmeter-support.md).

The Azure Load Testing test engines abstract the required infrastructure for [running a high-scale load test](./how-to-high-scale-load.md). Each test engine instance runs your JMeter script to simulate a large number of virtual users simultaneously accessing your application endpoints. When you create a load test based on a URL (*quick test*), Azure Load Testing automatically generates a JMeter test script for you. To scale out the load test, you can configure the number of test engines.

You can host the application under load anywhere: in Azure, on-premises, or in other clouds. To run a load test for services that have no public endpoint, [deploy Azure Load Testing in a virtual network](./how-to-test-private-endpoint.md).

During the load test, Azure Load Testing collects the following resource metrics and displays them in a dashboard:

- *Client-side metrics* give you details reported by the test engine. These details include the number of virtual users, the request response time, or the number of requests per second.

- *Server-side metrics* provide information about your Azure application components. Azure Load Testing integrates with Azure Monitor, including Application Insights and Container insights, to capture details from the Azure services. Depending on the type of service, different metrics are available. For example, metrics can be for the number of database reads, the type of HTTP responses, or container resource consumption.

Azure Load Testing automatically incorporates best practices for Azure networking to help make sure that your tests run securely and reliably. Load tests are automatically stopped if the application endpoints or Azure components start throttling requests.

The service automatically encrypts all data stored in your load testing resource with keys managed by Microsoft (service-managed keys). For example, this data includes your Apache JMeter script, configuration files, and more. Alternately, you can also [configure the service to use customer-managed keys](./how-to-configure-customer-managed-keys.md).

## In-region data residency

Azure Load Testing doesn't store or process customer data outside the region you deploy the service instance in.

## Next steps

Start using Azure Load Testing:
- [Quickstart: Load test an existing web application](./quickstart-create-and-run-load-test.md).
- [Quickstart: Automate load tests with CI/CD](./quickstart-add-load-test-cicd.md).
- [Tutorial: Use a load test to identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md).
- Learn about the [key concepts for Azure Load Testing](./concept-load-testing-concepts.md).
