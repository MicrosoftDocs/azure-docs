---
title: Key concepts for Azure Load Testing concepts
titleSuffix: Azure Load Testing
description: Learn how Azure Load Testing works, and the key concepts behind it.
services: load-testing
ms.service: load-testing
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 03/30/2022
ms.custom: template-concept 
---

<!-- 
  Customer intent:
	As a developer I want to understand the Azure Load Testing concepts so that I can set up a load test to identify performance issues in my application.
 -->

# Key concepts for new Azure Load Testing Preview users

Learn about the key concepts and components of Azure Load Testing preview. This can help you to more effectively set up a load test to identify performance issues in your application.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Load testing resource

The Load testing resource is the top-level resource for your load-testing activities. This resource provides a centralized place to view and manage load tests, test results, and related artifacts. A load testing resource contains zero or more [load tests](#test).

When you create a load test resource, you specify its location, which determines the location of the [test engines](#test-engine).

You can use [Azure role-based access control](./how-to-assign-roles.md) for granting access to your load testing resource.

Azure Load Testing can use Azure Key Vault for [storing secret parameters](./how-to-parameterize-load-tests.md). You can [use either a user-assigned or system-assigned managed identity](./how-to-use-a-managed-identity.md) for your load testing resource.

## Test

A test specifies the test script, and configuration settings for running a load test. You can create one or more tests in an Azure Load Testing resource.

The configuration of a load test consists of:

- The test name and description.
- The Apache JMeter test script and related data and configuration files. For example, a [CSV data file](./how-to-read-csv-data.md).
- [Environment variables](./how-to-parameterize-load-tests.md).
- [Secret parameters](./how-to-parameterize-load-tests.md).
- The number of [test engines](#test-engine) to run the test script on.
- The [fail criteria](./how-to-define-test-criteria.md) for the test.
- The list of [app components and resource metrics to monitor](./how-to-monitor-server-side-metrics.md) during the test execution.

When you run a test, a [test run](#test-run) instance is created.

## Test engine

A test engine is computing infrastructure, managed by Microsoft, that runs the Apache JMeter test script. You can [scale out your load test](./how-to-high-scale-load.md) by configuring the number of test engines. The test script runs in parallel across the specified number of test engines.

The test engines are hosted in the same location as your Azure Load Testing resource.

While the test script runs, Azure Load Testing collects and aggregates the Apache JMeter worker logs. You can [download the logs for analyzing errors during the load test](./how-to-find-download-logs.md).

## Test run

A test run represents one execution of a load test. It collects the logs associated with running the Apache JMeter script, the [load test YAML configuration](./reference-test-config-yaml.md), the list of [app components to monitor](./how-to-monitor-server-side-metrics.md), and the [results of the test](./how-to-export-test-results.md).

During a test run, Azure Load Testing sends the Apache JMeter script to the specified number of [test engines](#test-engine). After the test run, the logs and test results are aggregated and collected from the test engines.

You can [view and analyze the load test results in the Azure Load Testing dashboard](./tutorial-identify-bottlenecks-azure-portal.md) in the Azure portal.

## App component

When you run a load test for an Azure-hosted application, you can monitor resource metrics for the different Azure application components (server-side metrics). While the load test runs, and after completion of the test, you can [monitor and analyze the resource metrics in the Azure Load Testing dashboard](./how-to-monitor-server-side-metrics.md).

When you create or update a load test, you can configure the list of app components that Azure Load Testing will monitor. You can modify the list of default resource metrics for each app component. Learn more about which [Azure resource types are supported by Azure Load Testing](./resource-supported-azure-resource-types.md).

## Metrics

During a load test, Azure Load Testing collects metrics about the test execution. There are two types of metrics:

- *Client-side metrics* give you telemetry reported by the test engine. These metrics include the number of virtual users, the request response time, the number of failed requests, or the number of requests per second. You can [define test fail criteria](./how-to-define-test-criteria.md) based on these client-side metrics.

- *Server-side metrics* are available for Azure-hosted applications and provide information about your Azure [application components](#app-component). Azure Load Testing integrates with Azure Monitor, including Application Insights and Container insights, to capture details from the Azure services. Depending on the type of service, different metrics are available. For example, metrics can be for the number of database reads, the type of HTTP responses, or container resource consumption.

## Next steps

You now know the key concepts of Azure Load Testing to start creating a load test.

- Learn how [Azure Load Testing works](./overview-what-is-azure-load-testing.md#how-does-azure-load-testing-work).
- Learn how to [Create and run a load test for a website](./quickstart-create-and-run-load-test.md).
- Learn how to [Identify a performance bottleneck in an Azure application](./tutorial-identify-bottlenecks-azure-portal.md).
- Learn how to [Set up automated regression testing with CI/CD](./tutorial-identify-performance-regression-with-cicd.md).
