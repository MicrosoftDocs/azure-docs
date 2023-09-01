---
title: Define load test fail criteria
titleSuffix: Azure Load Testing
description: 'Learn how to configure fail criteria for load tests with Azure Load Testing. Fail criteria let you define conditions that your load test results should meet.'
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 05/08/2023
ms.topic: how-to
---

# Define fail criteria for load tests by using Azure Load Testing

In this article, you learn how to define fail criteria or auto stop criteria for your load tests with Azure Load Testing. Fail criteria let you define performance and quality expectations for your application under load. Azure Load Testing supports various client metrics for defining fail criteria, such as error rate or response time. Auto stop criteria enable you to automatically stop your load test when the error rate surpasses a given threshold.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure load testing resource. If you need to create an Azure Load Testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).

## Load test fail criteria

Load test fail criteria are conditions for client-side metrics, that your test should meet. You define test criteria at the load test level in Azure Load Testing. A load test can have one or more test criteria. When at least one of the test criteria evaluates to true, the load test gets the *failed* status.

You can define test criteria at two levels. A load test can combine criteria at the different levels.

- At the load test level. For example, to ensure that the total error percentage doesn't exceed a threshold.
- At the JMeter request level (JMeter sampler). For example, you could specify a response time threshold of the *getProducts* request, but disregard the response time of the *sign in* request.

You can define a maximum of 10 test criteria for a load test. If there are multiple criteria for the same client metric, the criterion with the lowest threshold value is used.

### Fail criteria structure

The format of fail criteria in Azure Load Testing follows that of a conditional statement for a [supported metric](#supported-client-metrics-for-fail-criteria). For example, ensure that the average number of requests per second is greater than 500.

Fail criteria have the following structure:

- Test criteria at the load test level: `Aggregate_function (client_metric) condition threshold`.
- Test criteria applied to specific JMeter requests: `Request: Aggregate_function (client_metric) condition threshold`.

The following table describes the different components:

|Parameter            |Description  |
|---------------------|-------------|
|`Client metric`      | *Required.* The client metric on which the condition should be applied.  |
|`Aggregate function` | *Required.* The aggregate function to be applied on the client metric.  |
|`Condition`          | *Required.* The comparison operator, such as `greater than`, or `less than`. |
|`Threshold`          | *Required.* The numeric value to compare with the client metric. |
|`Request`            | *Optional.* Name of the sampler in the JMeter script to which the criterion applies. If you don't specify a request name, the criterion applies to the aggregate of all the requests in the script. <br /> Don't include any personal data in the sampler name in your JMeter script. The sampler names appear in the Azure Load Testing results dashboard. |

### Supported client metrics for fail criteria

Azure Load Testing supports the following client metrics:

|Metric  |Aggregate function  |Threshold  |Condition  | Description |
|---------|---------|---------|---------|-------------|
|`response_time_ms`     |  `avg` (average)<BR> `min` (minimum)<BR> `max` (maximum)<BR> `pxx` (percentile), xx can be 50, 90, 95, 99     | Integer value, representing number of milliseconds (ms).     |   `>` (greater than)<BR> `<` (less than)      | Response time or elapsed time, in milliseconds. Learn more about [elapsed time in the Apache JMeter documentation](https://jmeter.apache.org/usermanual/glossary.html). |
|`latency`     |  `avg` (average)<BR> `min` (minimum)<BR> `max` (maximum)<BR> `pxx` (percentile), xx can be 50, 90, 95, 99     | Integer value, representing number of milliseconds (ms).     |   `>` (greater than)<BR> `<` (less than)      | Latency, in milliseconds. Learn more about [latency in the Apache JMeter documentation](https://jmeter.apache.org/usermanual/glossary.html). |
|`error`     |  `percentage`       | Numerical value in the range 0-100, representing a percentage.      |   `>` (greater than)      | Percentage of failed requests. |
|`requests_per_sec`     |  `avg` (average)       | Numerical value with up to two decimal places.      |   `>` (greater than) <BR> `<` (less than)     | Number of requests per second. |
|`requests`     |  `count`       | Integer value.      |   `>` (greater than) <BR> `<` (less than)     | Total number of requests. |

## Define load test fail criteria

# [Azure portal](#tab/portal)

In this section, you configure test criteria for a load test in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.

1. On the left pane, select **Tests** to view the list of load tests.

1. Select your load test from the list, and then select **Edit**.

    :::image type="content" source="media/how-to-define-test-criteria/edit-test.png" alt-text="Screenshot of the list of tests for an Azure load testing resource in the Azure portal, highlighting the 'Edit' button.":::

1. On the **Test criteria** pane, fill the **Metric**, **Aggregate function**, **Condition**, and **Threshold** values for your test.

    :::image type="content" source="media/how-to-define-test-criteria/test-creation-criteria.png" alt-text="Screenshot of the 'Test criteria' pane for a load test in the Azure portal and highlights the fields for adding a test criterion.":::

    Optionally, enter the **Request name** information to add a test criterion for a specific JMeter request. The value should match the name of the JMeter sampler in the JMX file.

    :::image type="content" source="media/how-to-define-test-criteria/jmeter-request-name.png" alt-text="Screenshot of the JMeter user interface, highlighting the request name.":::

1. Select **Apply** to save the changes.

    When you now run the load test, Azure Load Testing uses the test criteria to determine the status of the load test run.

1. Run the test and view the status in the load test dashboard.

    The dashboard shows each of the test criteria and their status. The overall test status is failed if at least one criterion was met.

    :::image type="content" source="media/how-to-define-test-criteria/test-criteria-dashboard.png" alt-text="Screenshot that shows the test criteria on the load test dashboard.":::

# [Azure Pipelines / GitHub Actions](#tab/pipelines+github)

In this section, you configure test criteria for a load test, as part of a CI/CD workflow. Learn how to [set up automated performance testing with CI/CD](./tutorial-identify-performance-regression-with-cicd.md).

For CI/CD workflows, you configure the load test settings in a [YAML test configuration file](./reference-test-config-yaml.md). You store the load test configuration file alongside the JMeter test script file in the source control repository.

To specify fail criteria in the YAML configuration file:

1. Open the YAML test configuration file for your load test in your editor of choice.

1. Add your test criteria in the `failureCriteria` setting.

    Use the [fail criteria format](#fail-criteria-structure), as described earlier. You can add multiple fail criteria for a load test.

    The following example defines three fail criteria. The first two criteria apply to the overall load test, and the last one specifies a condition for the `GetCustomerDetails` request.

    ```yaml
    version: v0.1
    testId: SampleTestCICD
    displayName: Sample test from CI/CD
    testPlan: SampleTest.jmx
    description: Load test website home page
    engineInstances: 1
    failureCriteria:
      - avg(response_time_ms) > 300
      - percentage(error) > 50
      - GetCustomerDetails: avg(latency) >200
    ```

    When you define a test criterion for a specific JMeter request, the request name should match the name of the JMeter sampler in the JMX file.

    :::image type="content" source="media/how-to-define-test-criteria/jmeter-request-name.png" alt-text="Screenshot of the JMeter user interface, highlighting the request name.":::

1. Save the YAML configuration file, and commit the changes to source control.

1. After the CI/CD workflow runs, verify the test status in the CI/CD log.

    The log shows the overall test status, and the status of each of the test criteria. The status of the CI/CD workflow run also reflects the test run status.

    :::image type="content" source="media/how-to-define-test-criteria/azure-pipelines-log.png" alt-text="Screenshot that shows the test criteria in the CI/CD workflow log.":::

---

## Auto stop configuration

Azure Load Testing automatically stops a load test if the error percentage exceeds a given threshold for a certain time window. Automatically stopping safeguards you against failing tests further incurring costs, for example, because of an incorrectly configured endpoint URL.

In the load test configuration, you can enable or disable the auto stop functionality and configure the error percentage threshold and time window. By default, Azure Load Testing automatically stops a load test that has an error percentage that is at least 90% during any 60-second time window.

You can use the Azure Load Testing auto stop functionality in combination with an [*AutoStop listener*](https://jmeter-plugins.org/wiki/AutoStop/) in your JMeter script. The load test automatically stops when one of the criteria in either the auto stop configuration or the JMeter AutoStop listener is met.

> [!CAUTION]
> If you disable auto stop for your load test, you may incur costs even when your load test is configured incorrectly.

# [Azure portal](#tab/portal)

To configure auto stop for your load test in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.

1. On the left pane, select **Tests** to view the list of load tests.

1. Select your load test from the list, and then select **Edit**. Alternately, select **Create** > **Upload a JMeter script** to create a new test.

1. Go to the **Test criteria** tab to configure the auto stop functionality.

    - Enable or disable automatically stopping of the load test by using the **Auto-stop test** control.

    - If you enable auto stop, you can fill the **Error percentage** and **Time window** fields. Specify the time window in seconds.

        :::image type="content" source="media/how-to-define-test-criteria/test-creation-auto-stop.png" alt-text="Screenshot of the 'Test criteria' pane for a load test in the Azure portal, highlighting the auto stop functionality.":::

1. Select **Apply**, or **Review + create** if you're creating a new load test, to save the changes.

# [Azure Pipelines / GitHub Actions](#tab/pipelines+github)

To configure auto stop for your load test in a CI/CD workflow, you update the [load test configuration YAML file](./reference-test-config-yaml.md).

To specify auto stop settings in the YAML configuration file:

1. Open the YAML test configuration file for your load test in your editor of choice.

    - To enable auto stop, add the `autoStop` setting and specify the `errorPercentage` and `timeWindow`.

        The following example automatically stops the load test when the error percentage exceeds 80% during any 2-minute time window:

        ```yaml
        version: v0.1
        testId: SampleTestCICD
        displayName: Sample test from CI/CD
        testPlan: SampleTest.jmx
        description: Load test website home page
        engineInstances: 1
        autoStop:
          errorPercentage: 80
          timeWindow: 120
        ```

    - To disable auto stop, add `autoStop: disable` to the configuration file.

        The following example disables auto stop for your load test:

        ```yaml
        version: v0.1
        testId: SampleTestCICD
        displayName: Sample test from CI/CD
        testPlan: SampleTest.jmx
        description: Load test website home page
        engineInstances: 1
        autoStop: disable
        ```

1. Save the YAML configuration file, and commit the changes to source control.

Learn how to [set up automated performance testing with CI/CD](./tutorial-identify-performance-regression-with-cicd.md).

---

## Next steps

- To learn how to parameterize a load test by using secrets, see [Parameterize a load test](./how-to-parameterize-load-tests.md).

- To learn about performance test automation, see [Configure automated performance testing](./tutorial-identify-performance-regression-with-cicd.md).
