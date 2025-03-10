---
title: Key concepts for Azure Load Testing
description: Learn how Azure Load Testing works, and the key concepts behind it.
services: load-testing
ms.service: azure-load-testing
author: ninallam
ms.author: ninallam
ms.topic: conceptual
ms.date: 11/24/2023
ms.custom: template-concept, build-2024
---

# Key concepts for new Azure Load Testing users

Learn about the key concepts and components of Azure Load Testing. This information can help you to more effectively set up a load test to identify performance issues in your application.

## General concepts of load testing

Learn about the key concepts related to running load tests.

### Virtual users

A virtual user runs a particular test case against your server application and runs independently of other virtual users. You can use multiple virtual users to simulate concurrent connections to your server application.

Apache JMeter also refers to virtual users as *threads*. In the JMeter test script, a *thread group* element lets you specify the pool of virtual users. Learn about [thread groups](https://jmeter.apache.org/usermanual/test_plan.html#thread_group) in the Apache JMeter documentation.

Locust refers to virtual users as *users*. You can specify the users needed for your test in the web interface, as a command line argument, through an environment variable, or through a configuration file. For more information, see [configuration options](https://docs.locust.io/en/stable/configuration.html) in the Locust documentation. 

The total number of virtual users for your load test depends on the number of virtual users in the test script and the number of [test engine instances](#test-engine).

For JMeter based load tests, the formula is: Total virtual users = (virtual users in the JMX file) * (number of test engine instances).

You can achieve the target number of virtual users by [configuring the number of test engine instances](./how-to-high-scale-load.md#test-engine-instances-and-virtual-users-for-jmeter-based-tests), the number of virtual users in the test script, or a combination of both.

For Locust based load tests, the total number of virtual users is the number of users specified through any of the configuration options. You can then [configure the number of test engine instances](./how-to-high-scale-load.md#test-engine-instances-and-virtual-users-for-locust-based-tests) required to generate the total number of users. 

### Ramp-up time

The ramp-up time is the amount of time to get to the full number of [virtual users](#virtual-users) for the load test. If the number of virtual users is 20, and the ramp-up time is 120 seconds, then it takes 120 seconds to get to all 20 virtual users. Each virtual user will start 6 (120/20) seconds after the previous user was started.

For Locust, you can configure ramp-up using *spawn rate*. Spawn rate is the number of users added per second. For example, if the number of users is 20 and the spawn rate is 2, 2 users will get added every second and it takes 10 seconds to get to all the 20 users. 

### Response time

The response time of an individual request, or [elapsed time in JMeter](https://jmeter.apache.org/usermanual/glossary.html), is the total time from just before sending the request to just after the last response is received. The response time doesn't include the time to render the response. Any client code, such as JavaScript, isn't processed during the load test.

### Latency

The latency of an individual request is the total time from just before sending the request to just after the first response is received. Latency includes all the processing needed to assemble the request and assembling the first part of the response.

### Requests per second (RPS)

Requests per second (RPS), or *throughput*, is the total number of requests to the server application that your load test generates per second.

The formula is: RPS = (number of requests) / (total time in seconds).

The time is calculated from the start of the first sample to the end of the last sample. This time includes any intervals between samples, for example if the test script contains [timers](https://jmeter.apache.org/usermanual/component_reference.html#timers).

Another way to calculate the RPS is based on the average application's [latency](#latency) and the number of [virtual users](#virtual-users). To simulate a specific number of RPS with a load test, given the application's latency, you can then calculate the required number of [virtual users](#virtual-users).

The formula is: Virtual users = (RPS) * (latency in seconds).

For example, given an application latency of 20 milliseconds (0.02 seconds), to simulate 100,000 RPS, you should configure the load test with 2,000 virtual users (100,000 * 0.02).

## Azure Load Testing components

Learn about the key concepts and components of Azure Load Testing. The following diagram gives an overview of how the different concepts relate to one another.

:::image type="content" source="./media/concept-load-testing-concepts/azure-load-testing-concepts.png" alt-text="Diagram that shows how the different concepts in Azure Load Testing relate to one another." lightbox="./media/concept-load-testing-concepts/azure-load-testing-concepts-large.png":::

### Load testing resource

The Azure load testing resource is the top-level resource for your load-testing activities. This resource provides a centralized place to view and manage load tests, test results, and related artifacts. 

When you create a load test resource, you specify its location, which determines the location of the [test engines](#test-engine). Azure Load Testing automatically encrypts all artifacts in your resource. You can choose between Microsoft-managed keys or use your own customer-managed keys for encryption.

To run a load test for your application, you add a [test](#test) to your load testing resource. A resource can contain zero or more tests.

You can use [Azure role-based access control](./how-to-assign-roles.md) to grant access to your load testing resource and related artifacts.

Azure Load Testing allows you to [use managed identities](./how-to-use-a-managed-identity.md) for various purposes, such as accessing Azure Key Vault to store [load test secret parameters or certificates](./how-to-parameterize-load-tests.md), accessing Azure Monitor metrics to [configure failure criteria](./how-to-define-test-criteria.md#access-app-component-for-test-criteria-on-server-metrics), or simulating [managed identity-based authentication flows](./how-to-test-secured-endpoints.md#authenticate-with-a-managed-identity).

### Test

A test describes the load test configuration for your application. You add a test to an existing Azure load testing resource.

A test contains a test plan, which describes the steps to invoke the application endpoint. You can define the test plan in one of three ways:

- [Upload a JMeter test script](./how-to-create-and-run-load-test-with-jmeter-script.md).
- [Upload a Locust test script](./quickstart-create-run-load-test-with-locust.md).
- [Specify the list of URL endpoints to test](./quickstart-create-and-run-load-test.md).

Azure Load Testing supports all communication protocols that JMeter and Locust support, not only HTTP-based endpoints. For example, you might want to read from or write to a database or message queue in the test script.

Azure Load Testing currently does not support other testing frameworks than Apache JMeter and Locust.

The test also specifies the configuration settings for running the load test:

- [Load test parameters](./how-to-parameterize-load-tests.md), such as environment variables, secrets, and certificates.
- Load configuration to [scale out your load test](./how-to-high-scale-load.md) across multiple [test engine](#test-engine) instances.
- [Fail criteria](./how-to-define-test-criteria.md) to determine when the test should pass or fail.
- Monitoring settings to configure the list of [Azure app components and resource metrics to monitor](./how-to-monitor-server-side-metrics.md) during the test run.

In addition, you can upload CSV input data files and test configuration files to the load test.

When you start a test, Azure Load Testing deploys the test script, related files, and configuration to the test engine instances. The test engine instances then initiate the test script to simulate the application load.

Each time you start a test, Azure Load Testing creates a [test run](#test-run) and attaches it to the test.

### Test run

A test run represents one execution of a load test. When you run a test, the test run contains a copy of the configuration settings from the associated test.

After the test run completes, you can [view and analyze the load test results in the Azure Load Testing dashboard](./tutorial-identify-bottlenecks-azure-portal.md) in the Azure portal. 

Alternately, you can [download the test logs](./how-to-diagnose-failing-load-test.md#download-apache-jmeter-or-locust-worker-logs-for-your-load-test) and [export the test results file](./how-to-export-test-results.md).

> [!IMPORTANT]
> When you update a test, the existing test runs don't automatically inherit the new settings from the test. The new settings are only used by new test runs when you run the *test*. If you rerun an existing *test run*, the original settings of the test run are used.

### Test engine

A test engine is computing infrastructure, managed by Microsoft that runs the test script. The test engine instances run the test script in parallel. You can [scale out your load test](./how-to-high-scale-load.md) by configuring the number of test engine instances. Learn how to configure the number of [virtual users](#virtual-users), or simulate a target number of [requests per second](#requests-per-second-rps).

The test engines are hosted in the same location as your Azure Load Testing resource. You can configure the Azure region when you create the Azure load testing resource.

While the test script runs, Azure Load Testing collects and aggregates the testing framework logs from all test engine instances. You can [download the logs for analyzing errors during the load test](./how-to-diagnose-failing-load-test.md).

### App component

When you run a load test for an Azure-hosted application, you can monitor resource metrics for the different Azure application components (server-side metrics). While the load test runs, and after completion of the test, you can [monitor and analyze the resource metrics in the Azure Load Testing dashboard](./how-to-monitor-server-side-metrics.md).

When you create or update a load test, you can configure the list of app components that Azure Load Testing will monitor. You can modify the list of default resource metrics for each app component.

Learn more about which [Azure resource types that Azure Load Testing supports](./resource-supported-azure-resource-types.md).

### Metrics

During a load test, Azure Load Testing collects metrics about the test execution. There are two types of metrics:

- *Client-side metrics* are reported by the test engines. These metrics include the number of virtual users, the request response time, the number of failed requests, or the number of requests per second. You can [define test fail criteria](./how-to-define-test-criteria.md) based on these client-side metrics.

- *Server-side metrics* are available for Azure-hosted applications and provide information about your Azure [application components](#app-component). Azure Load Testing integrates with Azure Monitor, including Application Insights and Container insights, to capture details from the Azure services. Depending on the type of service, different metrics are available. For example, metrics can be for the number of database reads, the type of HTTP responses, or container resource consumption. You can [define test fail criteria](./how-to-define-test-criteria.md) based on these server-side metrics also.

## Related content

You now know the key concepts of Azure Load Testing to start creating a load test.

- Learn how [Azure Load Testing works](./overview-what-is-azure-load-testing.md#how-does-azure-load-testing-work).
- Learn how to [Create and run a URL-based load test for a website](./quickstart-create-and-run-load-test.md).
- Learn how to [Identify a performance bottleneck in an Azure application](./tutorial-identify-bottlenecks-azure-portal.md).
- Learn how to [Set up automated regression testing with CI/CD](./quickstart-add-load-test-cicd.md).
