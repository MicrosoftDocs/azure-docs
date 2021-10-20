---
title: Define test criteria
titleSuffix: Azure Load Testing
description: Define test criteria for load tests with Azure Load Testing 
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 10/12/2021
ms.topic: how-to
---

# Define test criteria for load tests with Azure Load Testing

Test criteria enables specifying the performance expectations of the system under test. Azure Load Testing service allows you to set failure criteria of your test for various metrics. Test criteria can be defined using the below syntax

`[Aggregate_function] ([client_metric]) [condition] [value]`

It includes the following inputs

|Parameter  |Description  |
|---------|---------|
|Client metric     | (Required) The client metric on which the criteria should be applied.        |
|Aggregate function     |  (Required) The aggregate function to be applied on the client metric.       |
|Condition     | (Required) The comparison operator.        |
|Threshold     |  (Required) The numeric value to compare with the client metric.        |
|Action     |   (Optional) Either ‘continue’ or 'stop' after the threshold is met. If action is ‘continue’, the criteria is evaluated on the aggregate values, when the test is completed. If the action is ‘stop’, the criteria is evaluated for the entire test at every 60 seconds. If the criteria evaluates to true at any time, the test is stopped.</br> Default: ‘continue’      |

The following are the supported values

|Metric  |Aggregate function  |Threshold  |Condition  |
|---------|---------|---------|---------|
|Response Time     |  Average (avg)       |    Integer values </br> Units: milliseconds (ms)     |   greater than (>)      |
|Latency     | Average (avg)        |   Integer values </br> Units: milliseconds (ms)      |   greater than (>)      |
|Error     |  Rate (rate)       |   Enter percentage values. Float values are allowed      |   greater than (>)      |

If atleast one criterion evaluates to true, the test result is marked as failed. The limit number of test criteria that can be defined is limited to 10. If there are multiple criteria for the same metric, the criterion with the lowest threshold value is considered.

## Defining test criteria from Azure portal

1. In the test creation wizard, go to the **Test Criteria** tab.

1. Select the **Metric** on which you want to define the criteria.

1. Select the **Aggregate function** you want to apply on the selected metric.

1. Enter the **Threshold** value you want to compare against.

1. Check the **Stop test** checkbox, if  you want the test to stop if the criteria is met.

## Defining test criteria from YAML Configuration

You can use the YAML configuration file to define your test criteria while running the test from a CI/CD workflow and the VS Code extension.

1. Add the test criteria to your YAML config file as shown in the following example.

    ```yml
    faliureCriteria: 
        - avg(response_time) > 300
        - avg(latency) > 300
        - rate(error) > 20
    ```

## Viewing test criteria outcome

The outcome of the test criteria are displayed on the test run dashboard on Azure portal as shown below. If any of the test criteria meets the condition on the threshold, the **Test result** field is marked as failed.

If you are running the test from a CI/CD workflow, you can view the test criteria outcome in the workflow logs as shown below. If any of the test criteria fails, the Azure Load testing task or action is marked and failed, which will eventually fail the workflow.
