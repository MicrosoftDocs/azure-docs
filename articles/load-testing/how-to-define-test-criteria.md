---
title: Define test criteria
titleSuffix: Azure Load Testing
description: Define test criteria for load tests with Azure Load Testing 
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 11/19/2021
ms.topic: how-to
---

# Define test criteria for load tests with Azure Load Testing

In this article, you'll learn how to define test criteria for your load tests with Azure Load Testing.  

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing Resource already created. If you need to create a Load Test Resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## Define your test criteria  

Test criteria lets you specify the performance expectations of your system under test. Azure Load Testing service allows you to set failure criteria for various test metrics. Define test criteria using the below syntax:  

`[Aggregate_function] ([client_metric]) [condition] [value]`

It includes the following inputs:

|Parameter  |Description  |
|---------|---------|
|Client metric     | (Required) The client metric on which the criteria should be applied.        |
|Aggregate function     |  (Required) The aggregate function to be applied on the client metric.       |
|Condition     | (Required) The comparison operator.        |
|Threshold     |  (Required) The numeric value to compare with the client metric.        |

The following are the supported values:  

|Metric  |Aggregate function  |Threshold  |Condition  |
|---------|---------|---------|---------|
|Response Time     |  Average (avg)       |    Integer values </br> Units: milliseconds (ms)     |   Greater than (>)      |
|Error     |  Percentage (percentage)       |   Enter percentage values. Float values are allowed      |   Greater than (>)      |

> [!NOTE]
> The criteria are applied to metrics at the aggregate level.

When a criterion evaluates to true, the test result is marked as failed. The number of test criteria that can be defined is limited to 10. If there are multiple criteria for the same metric, the criterion with the lowest threshold value is considered.  

## Defining test criteria from Azure portal

1. In the test creation wizard, go to the **Test Criteria** tab.  

1. Select the **Metric** you want to define with criteria.  

1. Select the **Aggregate function** you want to apply to the selected metric.  

1. Enter the **Threshold** value you want to compare against.  

:::image type="content" source="media/how-to-define-test-criteria/test-creation-criteria.png" alt-text="Add test criteria from the test creation wizard in the test criteria tab":::

## Defining test criteria from load test YAML configuration file

You can use the load test YAML configuration file to define your test criteria while running the test from a CI/CD workflow.  

Add the test criteria to your YAML config file as shown in the following example:  

```yml
failureCriteria: 
    - avg(response_time_ms) > 300
    - percentage(error) > 20
```

## Viewing test criteria outcome

The outcomes of the test criteria are displayed on the test run dashboard on Azure portal as shown below. If any of the test criteria meets the condition on the threshold, the **Test result** field is marked as failed.  

:::image type="content" source="media/how-to-define-test-criteria/test-criteria-dashboard.png" alt-text="View the test criteria outcome in the test run dashboard":::

If you're running the test from a CI/CD workflow, you can view the test criteria outcome in the workflow logs. When any of the test criteria fail, the Azure Load Testing task or action is marked as failed.  

## Next steps

- For information on learning to parameterize load tests, see [Parameterize load tests](./how-to-parameterize-load-tests.md).
