---
title: Configure high-scale load tests
titleSuffix: Azure Load Testing
description: Learn how to configure test engine instances in Azure Load Testing to run high-scale load tests. Monitor engine health metrics to find an optimal configuration for your load test.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 08/22/2023
ms.topic: how-to

---

# Configure Azure Load Testing for high-scale load

In this article, you learn how to configure your load test for high-scale with Azure Load Testing. Configure multiple test engine instances to scale out the number of virtual users for your load test and simulate a high number of requests per second. To achieve an optimal load distribution, you can monitor the test instance health metrics in the Azure Load Testing dashboard.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  

- An existing Azure load testing resource. To create an Azure load testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).

## Determine requests per second

The maximum number of *requests per second* (RPS) that Azure Load Testing can generate for your load test depends on the application's *latency* and the number of *virtual users* (VUs). Application latency is the total time from sending an application request by the test engine, to receiving the response. The virtual user count is the number of parallel requests that Azure Load Testing performs at a given time.

To calculate the number of requests per second, apply the following formula: RPS = (# of VUs) * (1/latency in seconds).

For example, if application latency is 20 milliseconds (0.02 second), and you're generating a load of 2,000 VUs, you can achieve around 100,000 RPS (2000 * 1/0.02s).

To achieve a target number of requests per second, configure the total number of virtual users for your load test.

> [!NOTE]
> Apache JMeter only reports requests that made it to the server and back, either successful or not. If Apache JMeter is unable to connect to your application, the actual number of requests per second will be lower than the maximum value. Possible causes might be that the server is too busy to handle the request, or that an TLS/SSL certificate is missing. To diagnose connection problems, you can check the **Errors** chart in the load testing dashboard and [download the load test log files](./how-to-troubleshoot-failing-test.md).

## Test engine instances and virtual users

In the Apache JMeter script, you can specify the number of parallel threads. Each thread represents a virtual user that accesses the application endpoint. We recommend that you keep the number of threads in a script below a maximum of 250.

In Azure Load Testing, *test engine* instances are responsible for running the Apache JMeter script. All test engine instances run in parallel. You can configure the number of instances for a load test.

The total number of virtual users for a load test is then: VUs = (# threads) * (# test engine instances).

To simulate a target number of virtual users, you can configure the parallel threads in the JMeter script, and the engine instances for the load test accordingly. [Monitor the test engine metrics](#monitor-engine-instance-metrics) to optimize the number of instances.

For example, to simulate 1,000 virtual users, set the number of threads in the Apache JMeter script to 250. Then configure the load test with four test engine instances (that is, 4 x 250 threads).

The location of the Azure Load Testing resource determines the location of the test engine instances. All test engine instances within a Load Testing resource are hosted in the same Azure region.

## Configure test engine instances

You can specify the number of test engine instances for each test. Your test script runs in parallel across each of these instances to simulate load to your application.

To configure the number of instances for a test:

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Go to your Load Testing resource. On the left pane, select **Tests** to view the list of load tests.

1. In the list, select your load test, and then select **Edit**.

    :::image type="content" source="media/how-to-high-scale-load/edit-test.png" alt-text="Screenshot that shows the list of load tests and the 'Edit' button.":::

1. You can also edit the test configuration from the test details page. To do so, select **Configure**, and then select **Test**.

    :::image type="content" source="media/how-to-high-scale-load/configure-test.png" alt-text="Screenshot that shows the 'Configure' and 'Test' buttons on the test details page.":::

1. On the **Edit test** page, select the **Load** tab. Use the **Engine instances** slider control to update the number of test engine instances, or enter the value directly in the input box.

    :::image type="content" source="media/how-to-high-scale-load/edit-test-load.png" alt-text="Screenshot of the 'Load' tab on the 'Edit test' pane.":::

1. Select **Apply** to modify the test and use the new configuration when you rerun it.

# [Azure Pipelines / GitHub Actions](#tab/pipelines+github)

For CI/CD workflows, you configure the number of engine instances in the [YAML test configuration file](./reference-test-config-yaml.md). You store the load test configuration file alongside the JMeter test script file in the source control repository.

1. Open the YAML test configuration file for your load test in your editor of choice.

1. Configure the number of test engine instances in the `engineInstances` setting.

    The following example configures a load test that runs across 10 parallel test engine instances.

    ```yaml
    version: v0.1
    testId: SampleTestCICD
    displayName: Sample test from CI/CD
    testPlan: SampleTest.jmx
    description: Load test website home page
    engineInstances: 10
    ```

1. Save the YAML configuration file, and commit the changes to source control.

---

## Monitor engine instance metrics

To make sure that the test engine instances, themselves aren't a performance bottleneck, you can monitor resource metrics of the test engine instance. A high resource usage for a test instance might negatively influence the results of the load test.

Azure Load Testing reports four resource metrics for each instance:

- CPU percentage.
- Memory percentage.
- Network bytes per second.
- Number of virtual users.

A test engine instance is considered healthy if the average CPU percentage or memory percentage over the duration of the test run remains below 75%.

To view the engine resource metrics:

1. Go to your Load Testing resource. On the left pane, select **Tests** to view the list of load tests.
1. In the list, select your load test to view the list of test runs.
1. In the test run list, select your test run.
1. In the test run dashboard, select the **Engine health** to view the engine resource metrics.
    
    Optionally, select a specific test engine instance by using the filters controls.

:::image type="content" source="media/how-to-high-scale-load/engine-health-metrics.png" alt-text="Screenshot that shows the load engine health metrics on the test run dashboard.":::

### Troubleshoot unhealthy engine instances

If one or multiple instances show a high resource usage, it could affect the test results. To resolve the issue, try one or more of the following steps:

- Reduce the number of threads (virtual users) per test engine. To achieve a target number of virtual users, you might increase the number of engine instances for the load test.

- Ensure that your script is effective, with no redundant code.

- If the engine health status is unknown, rerun the test.

## Next steps

- For more information about comparing test results, see [Compare multiple test results](./how-to-compare-multiple-test-runs.md).
- To learn about performance test automation, see [Configure automated performance testing](./tutorial-identify-performance-regression-with-cicd.md).
- More information about [service limits and quotas in Azure Load Testing](./resource-limits-quotas-capacity.md).
