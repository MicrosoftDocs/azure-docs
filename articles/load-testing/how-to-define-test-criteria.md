---
title: Define load test pass/fail criteria
titleSuffix: Azure Load Testing
description: 'Learn how to configure pass/fail criteria for load tests with Azure Load Testing.'
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 11/30/2021
ms.topic: how-to
---

# Define pass/fail criteria for load tests by using Azure Load Testing Preview

In this article, you'll learn how to define pass/fail criteria for your load tests with Azure Load Testing Preview. 

By defining test criteria, you can specify the performance expectations of your application under test. By using the Azure Load Testing service, you can set failure criteria for various test metrics.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing resource. If you need to create an Azure Load Testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## Load test pass/fail criteria

This section discusses the syntax you use to define Azure Load Testing pass/fail criteria.

You use `Aggregate_function (client_metric) condition value` syntax. When a criterion evaluates to `true`, the load test gets the *failed* status.

|Parameter  |Description  |
|---------|---------|
|`Client metric`     | *Required.* The client metric on which the criteria should be applied.  |
|`Aggregate function`     |  *Required.* The aggregate function to be applied on the client metric.  |
|`Condition`     | *Required.* The comparison operator.        |
|`Threshold`     |  *Required.* The numeric value to compare with the client metric.<BR>The threshold evaluates against the aggregated value. |

Load Testing supports the following combination of parameters:

|Metric  |Aggregate function  |Threshold  |Condition  |
|---------|---------|---------|---------|
|`response_time_ms`     |  `avg` (average)       | Integer value, representing number of milliseconds (ms)     |   `>` (greater than)      |
|`error`     |  `percentage`       | Numerical values in the range 0-100, representing a percentage      |   `>` (greater than)      |

## Define test pass/fail criteria in the Azure portal

In this section, you configure test criteria for a load test in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.

1. On the left pane, select **Tests** to view the list of load tests, and then select the test you're working with.

    :::image type="content" source="media/how-to-define-test-criteria/configure-test.png" alt-text="Screenshot of the 'Configure' and 'Test' buttons and a list of load tests.":::

1. Select the **Test criteria** tab.

    :::image type="content" source="media/how-to-define-test-criteria/configure-test-test-criteria.png" alt-text="Screenshot that shows the 'Test criteria' tab and the pane for configuring the criteria.":::

1. On the **Test criteria** pane, use the dropdown lists to select the **Metric**, **Aggregate function**, **Condition**, and **Threshold** values for your test.

    :::image type="content" source="media/how-to-define-test-criteria/test-creation-criteria.png" alt-text="Screenshot of the 'Test criteria' pane and the dropdown controls for adding test criteria to a load test.":::

    You can define a maximum of 10 test criteria for a load test. If there are multiple criteria for the same client metric, the criterion with the lowest threshold value is used.

1. Select **Apply** to save the changes.

When you run the load test, Azure Load Testing uses the updated test configuration. The test run dashboard shows the test criteria and indicates whether the test results pass or fail the criteria.

:::image type="content" source="media/how-to-define-test-criteria/test-criteria-dashboard.png" alt-text="Screenshot that shows the test criteria on the load test dashboard.":::
 
## Define test pass/fail criteria in CI/CD workflows

In this section, you learn how to define load test pass/fail criteria for continuous integration and continuous delivery (CI/CD) workflows. To run a load test in your CI/CD workflow, you use a [YAML test configuration file](./reference-test-config-yaml.md). 

1. Open the YAML test configuration file.

1. Add the test criteria to the configuration file. For more information about YAML syntax, see [test configuration YAML reference](./reference-test-config-yaml.md).

    ```yml
    failureCriteria: 
        - avg(response_time_ms) > 300
        - percentage(error) > 20
    ```

1. Save the YAML configuration file.

When the CI/CD workflow runs the load test, the workflow status reflects the status of the pass/fail criteria. The CI/CD logging information shows the status of each of the test criteria.

:::image type="content" source="media/how-to-define-test-criteria/azure-pipelines-log.png" alt-text="Screenshot that shows the test criteria in the CI/CD workflow log.":::

## Next steps

- To learn how to parameterize a load test by using secrets, see [Parameterize a load test](./how-to-parameterize-load-tests.md).

- To learn about performance test automation, see [Configure automated performance testing](./tutorial-cicd-azure-pipelines.md).
