---
title: Optimize Azure Functions for performance and cost
titleSuffix: Azure Load Testing
description: Learn how to optimize Azure Functions for Performance and Costs using Azure Load Testing
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
author: ninallam
ms.date: 06/12/2024
ms.topic: how-to
---

# Optimize Azure Functions for Performance and Costs using Azure Load Testing

In this article, learn how optimize Azure Functions for performance and costs using Azure Load Testing. Azure Functions is a serverless compute service that lets you run event-triggered code without having to explicitly provision or manage infrastructure. Azure Functions Flex Consumption plan hosting gives you more flexibility and customizability by introducing private networking, instance memory size selection, and fast/large scale-out features still based on a serverless model.

Performance Optimizer is a tool powered by Azure Load Testing, that enables you to decide the right configuration for your app by running load tests on different Functions configurations. It helps you to understand the performance and cost implications of different configurations and make informed decisions.

Performance optimizer enables the following

- In-context experience to quickly create and run tests by specifying different memory and HTTP concurrency configurations with the expected load.
- Comparison of performance metrics from load test results across scale & concurrency configs helping you choose the right configuration.
- Right-sizing based on performance metrics to optimize costs.

## Prerequisites
* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* A function app in the Flex Consumption plan with at least one function with an HTTP trigger. If you need to create a function app, see [Create and manage function apps in the Flex Consumption plan](https://learn.microsoft.com/azure/azure-functions/flex-consumption-how-to).


## Running Performance Optimizer on your Azure Functions

Performance optimizer allows you to test for different configurations like instance size and HTTP concurrency for you Function App by balancing the performance and cost. It uses Azure Load Testing to help you identify your app's optimal configuration for performance and scalability. You can run the Performance optimizer on your functions with HTTP triggers. Once you have deployed your code to Azure Functions, follow the below steps to run the optimizer.

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Navigate to the function app hosted on Flex Consumption plan.

1. Select Performance Optimizer in the Performance section of your app.

1. If you don’t have an Azure Load Testing resource in the subscription, create one by clicking Create Load Testing resource.

:::image type="content" source="media/how-to-optimize-azure-functions/performance-optimizer-open.png" alt-text="Screenshot that the performance optimizer page in the Azure portal." lightbox="media/how-to-optimize-azure-functions/performance-optimizer-open.png":::


### Create a test profile

A test profile describes your function app configuration, request details and load configuration. For each function app configuration, a load test is run with the specified load. You can create a test profile by following these steps:

1. Click on Create test profile to start creating a new test profile.

1. On the **Profile Configuration** tab, first enter the test details:

    |Field  |Description  |
    |-|-|
    | **Load Testing Resource**    | Select your load testing resource. |
    | **Test profile name**                | Enter a unique test profile name. |
    | **Test profile description**         | (Optional) Enter a test profile description. |
    | **Run test after creation**  | When selected, the test profile starts automatically after creating the test. |

1. In the **Functions configuration** section, select the function app configuration you want to test. You can select the instance memory size and the HTTP concurrency. You can select up to ten combinations of memory and concurrency. 

    > [!NOTE]
    > Once the test profile run initiates, configuration changes are made directly to your app. Your Function app will restart for every combination specified and a load test is run against your app.

    :::image type="content" source="media/how-to-optimize-azure-functions/create-test-profile.png" alt-text="Screenshot that the create test profile page in the Azure portal." lightbox="media/how-to-optimize-azure-functions/create-test-profile.png":::

1. In the **Request details** section, enter the request details for your function app. You can specify the request method, URL, and headers.


1. Select **Add request** to add HTTP requests to the load test:

    On the **Add request** page, enter the details for the request:

    |Field  |Description  |
    |-|-|
    | **Request name** | Unique name within the load test to identify the request. You can use this request name when [defining test criteria](./how-to-define-test-criteria.md). |
    | **Function name**          | Select the function that you want to test |
    | **Key**         | Select the key required for accessing the function |
    | **HTTP method**  | Select an HTTP method from the list. Azure Load Testing supports GET, POST, PUT, DELETE, PATCH, HEAD, and OPTIONS. |
    | **Query parameters** | (Optional) Enter query string parameters to append to the URL. |
    | **Headers**          | (Optional) Enter HTTP headers to include in the HTTP request. |
    | **Body**             | (Optional) Depending on the HTTP method, you can specify the HTTP body content. Azure Load Testing supports the following formats: raw data, JSON view, JavaScript, HTML, and XML. |

1. Select the **Load configuration** tab to configure the load parameters for the load test.


    |Field  |Description  |
    |-|-|
    | **Engine instances**            | Enter the number of load test engine instances. The load test runs in parallel across all the engine instances. |
    | **Load pattern**                | Select the load pattern (linear, step, spike) for ramping up to the target number of virtual users. |
    | **Concurrent users per engine** | Enter the number of *virtual users* to simulate on each of the test engines. The total number of virtual users for the load test is: #test engines * #users per engine. |
    | **Test duration (minutes)** | Enter the duration of the load test in minutes. |
    | **Ramp-up time (minutes)**  | Enter the ramp-up time of the load test in minutes. The ramp-up time is the time it takes to reach the target number of virtual users. |

1. Optionally, configure the network settings if the function app isn't publicly accessible.

    Learn more about [load testing privately hosted endpoints](./how-to-test-private-endpoint.md).


1. Select **Review + create** to review the test profile configuration, and then select **Create** to create the test profile. Azure Load Testing now creates the test profile. If you selected **Run test after creation** previously, the test profile starts automatically.

The Function App is reverted to the original configuration after the test profile run completes.


# View results

After the test profile run completes, you can view the results in the Azure portal. The test profile run contains the load test runs for each function app configuration. The results include performance metrics such as response time, throughput, and error rate for each function app configuration. You can compare the performance metrics across different configurations and choose the right configuration for your app. Once you’ve decided the optimal configuration, click on Apply to apply the scale and concurrency settings to your Function App.

:::image type="content" source="media/how-to-optimize-azure-functions/test-profile-run-results.png" alt-text="Screenshot that the create test profile run results in the Azure portal." lightbox="media/how-to-optimize-azure-functions/test-profile-run-results.png":::

## Next steps

- Learn more about [load testing  Azure Functions](./how-to-create-load-test-function-app.md).
- Learn how to [Monitor server-side application metrics](./how-to-monitor-server-side-metrics.md).
