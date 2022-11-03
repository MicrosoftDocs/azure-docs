---
title: Key concepts for new users
titleSuffix: Azure Load Testing
description: Learn how Azure Load Testing works, and the key concepts behind it.
services: load-testing
ms.service: load-testing
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 11/03/2022
ms.custom: template-concept 
---

<!-- 
  Customer intent:
	As a developer I want to understand the Azure Load Testing concepts so that I can set up a load test to identify performance issues in my application.
 -->

# Key concepts for new Azure Load Testing Preview users

Learn about the key concepts and components of Azure Load Testing Preview. This can help you to more effectively set up a load test to identify performance issues in your application.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## General concepts of load testing

Learn about the key concepts related to running load tests.

### Virtual users

A virtual user runs a particular test case against your server application and runs independently of other virtual users. You can use multiple virtual users to simulate concurrent connections to your server application.

Apache JMeter also refers to virtual users as *threads*. In the JMeter test script, a *thread group* element lets you specify the pool of virtual users. Learn about [thread groups](https://jmeter.apache.org/usermanual/test_plan.html#thread_group) in the Apache JMeter documentation.

The total number of virtual users for your load test depends on the number of virtual users in the test script and the number of [test engine instances](#test-engine).

The formula is: Total virtual users = (virtual users in the JMX file) * (number of test engine instances).

You can achieve the target number of virtual users by [configuring the number of test engine instances](./how-to-high-scale-load.md#test-engine-instances-and-virtual-users), the number of virtual users in the test script, or a combination of both.

### Ramp-up time

The ramp-up time is the amount of time to get to the full number of [virtual users](#virtual-users) for the load test. If the number of virtual users is 20, and the ramp-up time is 120 seconds, then it will take 120 seconds to get to all 20 virtual users. Each virtual user will start 6 (120/20) seconds after the previous user was started.

### Response time

The response time of an individual request, or [elapsed time in JMeter](https://jmeter.apache.org/usermanual/glossary.html), is the total time from just before sending the request to just after the last response has been received. The response time doesn't include the time to render the response. Any client code, such as JavaScript, isn't processed during the load test.

### Latency

The latency of an individual request is the total time from just before sending the request to just after the first response has been received. Latency includes all the processing needed to assemble the request and assembling the first part of the response.

### Requests per second (RPS)

Requests per second (RPS), or *throughput*, is the total number of requests to the server application that your load test generates per second.

The formula is: RPS = (number of requests) / (total time in seconds).

The time is calculated from the start of the first sample to the end of the last sample. This time includes any intervals between samples, for example if the test script contains [timers](https://jmeter.apache.org/usermanual/component_reference.html#timers).

Another way to calculate the RPS is based on the average application's [latency](#latency) and the number of [virtual users](#virtual-users). To simulate a specific number of RPS with a load test, given the application's latency, you can then calculate the required number of [virtual users](#virtual-users).

The formula is: Virtual users = (RPS) * (latency in seconds).

For example, given an application latency of 20 milliseconds (0.02 second), to simulate 100,000 RPS, you should configure the load test with 2,000 virtual users (100,000 * 0.02).

## Azure Load Testing components

Learn about the key concepts and components of Azure Load Testing.

### Load testing resource

The Azure load testing resource is the top-level resource for your load-testing activities. This resource provides a centralized place to view and manage load tests, test results, and related artifacts. A load testing resource contains zero or more [load tests](#test).

When you create a load test resource, you specify its location, which determines the location of the [test engines](#test-engine).

You can use [Azure role-based access control](./how-to-assign-roles.md) for granting access to your load testing resource.

Azure Load Testing can use Azure Key Vault for [storing secret parameters](./how-to-parameterize-load-tests.md). You can [use either a user-assigned or system-assigned managed identity](./how-to-use-a-managed-identity.md) for your load testing resource.

### Test

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

### Test engine

A test engine is computing infrastructure, managed by Microsoft that runs the Apache JMeter test script. You can [scale out your load test](./how-to-high-scale-load.md) by configuring the number of test engines. The test script runs in parallel across the specified number of test engines.

The test engines are hosted in the same location as your Azure Load Testing resource.

While the test script runs, Azure Load Testing collects and aggregates the Apache JMeter worker logs. You can [download the logs for analyzing errors during the load test](./how-to-find-download-logs.md).

### Test run

A test run represents one execution of a load test. It collects the logs associated with running the Apache JMeter script, the [load test YAML configuration](./reference-test-config-yaml.md), the list of [app components to monitor](./how-to-monitor-server-side-metrics.md), and the [results of the test](./how-to-export-test-results.md).

During a test run, Azure Load Testing sends the Apache JMeter script to the specified number of [test engines](#test-engine). After the test run, the logs and test results are aggregated and collected from the test engines.

You can [view and analyze the load test results in the Azure Load Testing dashboard](./tutorial-identify-bottlenecks-azure-portal.md) in the Azure portal.

### App component

When you run a load test for an Azure-hosted application, you can monitor resource metrics for the different Azure application components (server-side metrics). While the load test runs, and after completion of the test, you can [monitor and analyze the resource metrics in the Azure Load Testing dashboard](./how-to-monitor-server-side-metrics.md).

When you create or update a load test, you can configure the list of app components that Azure Load Testing will monitor. You can modify the list of default resource metrics for each app component. Learn more about which [Azure resource types are supported by Azure Load Testing](./resource-supported-azure-resource-types.md).

### Metrics

During a load test, Azure Load Testing collects metrics about the test execution. There are two types of metrics:

- *Client-side metrics* are reported by the test engines. These metrics include the number of virtual users, the request response time, the number of failed requests, or the number of requests per second. You can [define test fail criteria](./how-to-define-test-criteria.md) based on these client-side metrics.

- *Server-side metrics* are available for Azure-hosted applications and provide information about your Azure [application components](#app-component). Azure Load Testing integrates with Azure Monitor, including Application Insights and Container insights, to capture details from the Azure services. Depending on the type of service, different metrics are available. For example, metrics can be for the number of database reads, the type of HTTP responses, or container resource consumption.

## Next steps

You now know the key concepts of Azure Load Testing to start creating a load test.

- Learn how [Azure Load Testing works](./overview-what-is-azure-load-testing.md#how-does-azure-load-testing-work).
- Learn how to [Create and run a load test for a website](./quickstart-create-and-run-load-test.md).
- Learn how to [Identify a performance bottleneck in an Azure application](./tutorial-identify-bottlenecks-azure-portal.md).
- Learn how to [Set up automated regression testing with CI/CD](./tutorial-identify-performance-regression-with-cicd.md).
