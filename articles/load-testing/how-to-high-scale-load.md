---
title: Configure high-scale load tests
titleSuffix: Azure Load Testing
description: Learn how to configure test engine instances in Azure Load Testing to run high-scale load tests. Monitor engine health metrics to find an optimal configuration for your load test.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 10/23/2023
ms.topic: how-to
---

# Configure Azure Load Testing for high-scale load

In this article, you learn how to configure your load test for high-scale with Azure Load Testing. Azure Load Testing abstracts the complexity of provisioning the infrastructure for simulating high-scale traffic. To scale out a load test, you can configure the number of parallel test engine instances. To achieve an optimal load distribution, you can monitor the test instance health metrics in the Azure Load Testing dashboard.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  

- An existing Azure load testing resource. To create an Azure load testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).

## Configure load parameters for a load test

To simulate user traffic for your application, you can configure the load pattern and the number of virtual users you want to simulate load for. By running the load test across many parallel test engine instances, Azure Load Testing can scale out the number of virtual users that simulate traffic to your application. The load pattern determines how the load is distributed over the duration of the load test. Examples of load patterns are linear, stepped, or spike load.

Depending on the type of load test, URL-based or JMeter-based, you have different options to configure the target load and the load pattern. The following table lists the differences between the two test types.

| Test type | Number of virtual users | Load pattern |
|-|-|-|
| URL-based (basic)    | Specify the target number of virtual users in the load test configuration. | Linear load pattern, based on the ramp-up time and number of virtual users. |
| URL-based (advanced) | Specify the number of test engines and the number of virtual users per instance in the load test configuration. | Configure the load pattern (linear, step, spike). |
| JMeter-based         | Specify the number of test engines in the load test configuration. Specify the number of virtual users in the test script. | Configure the load pattern in the test script. |

### Configure load parameters for URL-based tests

To specify the load parameters for a URL-based load test:

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com/), go to your Azure Load Testing resource.

1. In the left navigation, select **Tests**  to view all tests.

1. In the list, select your load test, and then select **Edit**.

    :::image type="content" source="media/how-to-high-scale-load/edit-test.png" alt-text="Screenshot that shows the list of load tests and the 'Edit' button." lightbox="media/how-to-high-scale-load/edit-test.png":::

    Alternately, you can also edit the test configuration from the test details page. To do so, select **Configure**, and then select **Test**.

1. On the **Basics** page, make sure to select **Enable advanced settings**.

1. On the **Edit test** page, select the **Load** tab.

    For URL-based tests, you can configure the number of parallel test engine instances and the load pattern.

1. Use the **Engine instances** slider control to update the number of parallel test engine instances. Alternately, enter the target value in the input box.

    :::image type="content" source="media/how-to-high-scale-load/edit-test-load.png" alt-text="Screenshot of the 'Load' tab on the 'Edit test' pane." lightbox="media/how-to-high-scale-load/edit-test-load.png":::

1. Select the **Load pattern** value from the list.

    For each pattern, fill the corresponding configuration settings. The chart gives a visual representation of the load pattern and its configuration parameters.

    :::image type="content" source="media/how-to-high-scale-load/load-test-configure-load-pattern.png" alt-text="Screenshot of the 'Load' tab when editing a load test, showing how to configure the load pattern." lightbox="media/how-to-high-scale-load/load-test-configure-load-pattern.png":::

# [Azure Pipelines / GitHub Actions](#tab/pipelines+github)

For CI/CD workflows, you specify the load parameters for a URL-based load test in the requests JSON file, in the `testSetup` property.

Depending on the load pattern (`loadType`), you can specify different load parameters:

| Load pattern (`loadType`) | Parameters |
|-|-|
| Linear | `virtualUsersPerEngine`, `durationInSeconds`, `rampUpTimeInSeconds` |
| Step | `virtualUsersPerEngine`, `durationInSeconds`, `rampUpTimeInSeconds`, `rampUpSteps` |
| Spike | `virtualUsersPerEngine`, `durationInSeconds`, `spikeMultiplier`, `spikeHoldTimeInSeconds` |

In the load test configuration YAML file, make sure to set the `testType` property to `URL` and set the `testPlan` property to reference the requests JSON file.

The following code snippet shows an example requests JSON file for a URL-based load test. The `testSetup` specifies a linear load pattern that runs for 300 seconds, with a ramp-up time of 30 seconds and five virtual users per test engine.

```json
{
    "version": "1.0",
    "scenarios": {
      "requestGroup1": {
        "requests": [
          {
            "requestName": "Request1",
            "requestType": "URL",
            "endpoint": "http://northwind.contoso.com",
            "queryParameters": [],
            "headers": {},
            "body": null,
            "method": "GET",
            "responseVariables": [
                {
                  "extractorType": "XPathExtractor",
                  "expression": "/note/body",
                  "variableName": "token"
                }
              ]
          },
          {
            "requestName": "Request2",
            "requestType": "CURL",
            "curlCommand": "curl --location '${domain}' --header 'Ocp-Apim-Subscription-Key: ${token}"
          }
        ],
        "csvDataSetConfigList": [
            {
              "fileName": "inputData.csv",
              "variableNames": "domain"
            }
          ]
      }
    },
    "testSetup": [
      {
        "virtualUsersPerEngine": 5,
        "durationInSeconds": 300,
        "loadType": "Linear",
        "scenario": "requestGroup1",
        "rampUpTimeInSeconds": 30
      }
    ]
}
```

---

### Configure load parameters for JMeter-based tests

To specify the load parameters for a JMeter-based load test:

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com/), go to your Azure Load Testing resource.

1. In the left navigation, select **Tests**  to view all tests.

1. In the list, select your load test, and then select **Edit**.

    :::image type="content" source="media/how-to-high-scale-load/edit-test.png" alt-text="Screenshot that shows the list of load tests and the 'Edit' button." lightbox="media/how-to-high-scale-load/edit-test.png":::

    Alternately, you can also edit the test configuration from the test details page. To do so, select **Configure**, and then select **Test**.

1. On the **Edit test** page, select the **Load** tab. Use the **Engine instances** slider control to update the number of test engine instances, or enter the value directly in the input box.

    :::image type="content" source="media/how-to-high-scale-load/edit-test-load.png" alt-text="Screenshot of the 'Load' tab on the 'Edit test' pane." lightbox="media/how-to-high-scale-load/edit-test-load.png":::

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

:::image type="content" source="media/how-to-high-scale-load/engine-health-metrics.png" alt-text="Screenshot that shows the load engine health metrics on the test run dashboard." lightbox="media/how-to-high-scale-load/engine-health-metrics.png":::

### Troubleshoot unhealthy engine instances

If one or multiple instances show a high resource usage, it could affect the test results. To resolve the issue, try one or more of the following steps:

- Reduce the number of threads (virtual users) per test engine. To achieve a target number of virtual users, you might increase the number of engine instances for the load test.

- Ensure that your script is effective, with no redundant code.

- If the engine health status is unknown, rerun the test.

## Determine requests per second

The maximum number of *requests per second* (RPS) that Azure Load Testing can generate for your load test depends on the application's *latency* and the number of *virtual users* (VUs). Application latency is the total time from sending an application request by the test engine, to receiving the response. The virtual user count is the number of parallel requests that Azure Load Testing performs at a given time.

To calculate the number of requests per second, apply the following formula: RPS = (# of VUs) * (1/latency in seconds).

For example, if application latency is 20 milliseconds (0.02 seconds), and you're generating a load of 2,000 VUs, you can achieve around 100,000 RPS (2000 * 1/0.02s).

To achieve a target number of requests per second, configure the total number of virtual users for your load test.

> [!NOTE]
> Apache JMeter only reports requests that made it to the server and back, either successful or not. If Apache JMeter is unable to connect to your application, the actual number of requests per second will be lower than the maximum value. Possible causes might be that the server is too busy to handle the request, or that a TLS/SSL certificate is missing. To diagnose connection problems, you can check the **Errors** chart in the load testing dashboard and [download the load test log files](./how-to-diagnose-failing-load-test.md).

## Test engine instances and virtual users

In the Apache JMeter script, you can specify the number of parallel threads. Each thread represents a virtual user that accesses the application endpoint. We recommend that you keep the number of threads in a script below a maximum of 250.

In Azure Load Testing, *test engine* instances are responsible for running the Apache JMeter script. All test engine instances run in parallel. You can configure the number of instances for a load test.

The total number of virtual users for a load test is then: VUs = (# threads) * (# test engine instances).

To simulate a target number of virtual users, you can configure the parallel threads in the JMeter script, and the engine instances for the load test accordingly. [Monitor the test engine metrics](#monitor-engine-instance-metrics) to optimize the number of instances.

For example, to simulate 1,000 virtual users, set the number of threads in the Apache JMeter script to 250. Then configure the load test with four test engine instances (that is, 4 x 250 threads).

The location of the Azure Load Testing resource determines the location of the test engine instances. All test engine instances within a Load Testing resource are hosted in the same Azure region.

## Related content

- More information about [service limits and quotas in Azure Load Testing](./resource-limits-quotas-capacity.md).
