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

# Define test criteria for load tests with Azure Load Testing Preview

In this article, you'll learn how to define pass/fail criteria for your load tests with Azure Load Testing Preview. 

Test criteria let you specify the performance expectations of your application under test. Azure Load Testing service allows you to set failure criteria for various test metrics.


> [!IMPORTANT]
> Azure Load Testing is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing resource. If you need to create an Azure Load Testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## Load test pass/fail criteria

In this section, you'll learn about the syntax to define Azure Load Testing pass/fail criteria.

You use the following syntax to define test criteria in Azure Load Testing: `Aggregate_function (client_metric) condition value`. When a criterion evaluates to true, the load test gets the failed status.

|Parameter  |Description  |
|---------|---------|
|`Client metric`     | **(Required)** The client metric on which the criteria should be applied.  |
|`Aggregate function`     |  **(Required)** The aggregate function to be applied on the client metric.  |
|`Condition`     | **(Required)** The comparison operator.        |
|`Threshold`     |  **(Required)** The numeric value to compare with the client metric.<BR>The threshold evaluates against the aggregated value. |

The following combination of parameters is supported.

|Metric  |Aggregate function  |Threshold  |Condition  |
|---------|---------|---------|---------|
|*`response_time_ms`*     |  *`avg`* (average)       | Integer value, representing number of milliseconds.     |   *`>`* (greater than)      |
|*`error`*     |  *`percentage`*       | Numerical values in the range 0-100, representing a percentage.      |   *`>`* (greater than)      |

## Define test pass/fail criteria in the Azure portal

In this section, you'll learn how to configure test criteria for a load test in the Azure portal.

1. Navigate to your Azure Load Testing resource in the [Azure portal](https://portal.azure.com).

1. Select **Tests** to view the list of tests, and then select your test.

    :::image type="content" source="media/how-to-define-test-criteria/configure-test.png" alt-text="Screenshot that shows how to configure a load test.":::

1. Select the **Test Criteria** tab.

    :::image type="content" source="media/how-to-define-test-criteria/configure-test-test-criteria.png" alt-text="Screenshot that shows the load test criteria tab.":::

1. Select the **Metric**, **Aggregate function**, **Condition**, and **Threshold** values.

    :::image type="content" source="media/how-to-define-test-criteria/test-creation-criteria.png" alt-text="Screenshot that shows how to add test criteria to a load test.":::

    You can define maximum 10 test criteria for a load test. If there are multiple criteria for the same client metric, the criterion with the lowest threshold value is used.

1. Select **Apply** to save the changes.

When you run the load test, Azure Load Testing will use the updated test configuration. The test run dashboard shows the test criteria, and indicates if the test results pass or fail the criteria.

:::image type="content" source="media/how-to-define-test-criteria/test-criteria-dashboard.png" alt-text="Screenshot that shows the test criteria in the load test dashboard.":::
 
## Define test pass/fail criteria in CI/CD workflows

In this section, you'll learn how to define load test pass/fail criteria for CI/CD workflows. To run a load test in your CI/CD workflow, you use a [YAML test configuration file](./reference-test-config-yaml.md). 

1. Open the YAML test configuration file.

1. Add the test criteria to the configuration file. For more information about the YAML syntax, see [test configuration YAML reference](./reference-test-config-yaml.md).

    ```yml
    failureCriteria: 
        - avg(response_time_ms) > 300
        - percentage(error) > 20
    ```

1. Save the YAML configuration file.

When the CI/CD workflow runs the load test, the workflow status reflects the status of the pass/fail criteria. The CI/CD logging information shows the status of each of the test criteria.

:::image type="content" source="media/how-to-define-test-criteria/azure-pipelines-log.png" alt-text="Screenshot that shows the test criteria in the CI/CD workflow log.":::

## Next steps

- For information on learning to parameterize load tests, see [Parameterize load tests](./how-to-parameterize-load-tests.md).

- To learn about performance test automation, see [Configure automated performance testing](./tutorial-cicd-azure-pipelines.md)
