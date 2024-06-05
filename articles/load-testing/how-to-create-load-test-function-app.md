---
title: Create load tests in Azure Functions
titleSuffix: Azure Load Testing
description: Learn how to create a load test for an Azure Function App with Azure Load Testing.
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 04/22/2024
ms.topic: how-to
---

# Create a load test for Azure Functions

Learn how to create a load test for an app in Azure Functions with Azure Load Testing. In this article, you'll learn how to create a URL-based load test for your function app in the Azure portal, and then use the load testing dashboard to analyze performance issues and identify bottlenecks.

With the integrated load testing experience in Azure Functions, you can:

- Create a [URL-based load test](./quickstart-create-and-run-load-test.md) for functions with an HTTP trigger
- View the load test runs associated with a function app
- Create a load testing resource
  

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- A function app with at least one function with an HTTP trigger. If you need to create a function app, see [Getting started with Azure Functions](/azure/azure-functions/functions-get-started).

## Create a load test for a function app

You can create a URL-based load test directly from your Azure Function App in the Azure portal.

To create a load test for a function app:

1. In the [Azure portal](https://portal.azure.com), go to your function app.

1. On the left pane, select **Load Testing (Preview)** under the **Performance** section.

    On this page, you can see the list of tests and the load test runs for this function app.
   
    :::image type="content" source="./media/how-to-create-load-test-azure-functions/azure-functions-load-test.png" lightbox="./media/how-to-create-load-test-azure-functions/azure-functions-load-test.png" alt-text="Screenshot that shows Load Testing page in an app in Azure Functions.":::

1. Optionally, select **Create load testing resource** if you don't have a load testing resource yet.

1. Select **Create test** to start creating a URL-based load test for the function app.

1. On the **Create test** page, first enter the test details:

    |Field  |Description  |
    |-|-|
    | **Load Testing Resource**    | Select your load testing resource. |
    | **Test name**                | Enter a unique test name. |
    | **Test description**         | (Optional) Enter a load test description. |
    | **Run test after creation**  | When selected, the load test starts automatically after creating the test. |


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

    :::image type="content" source="./media/how-to-create-load-test-azure-functions/azure-functions-create-test-add-requests.png" lightbox="./media/how-to-create-load-test-azure-functions/azure-functions-create-test-add-requests.png" alt-text="Screenshot that shows adding requests to a load test in an app in Azure Functions.":::

    Learn more about [adding HTTP requests to a load test](./how-to-add-requests-to-url-based-test.md).

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

    :::image type="content" source="./media/how-to-create-load-test-azure-functions/azure-functions-create-test-load-configuration.png" lightbox="./media/how-to-create-load-test-azure-functions/azure-functions-create-test-load-configuration.png" alt-text="Screenshot that shows the load configuration page for creating a test for an app in Azure Functions.":::


1. Select **Review + create** to review the test configuration, and then select **Create** to create the load test.

    Azure Load Testing now creates the load test. If you selected **Run test after creation** previously, the load test starts automatically.
   
> [!NOTE]
> If the test was converted from a URL test to a JMX test directly from the Load Testing resource, the test cannot be modified from the function app.

## View test runs

You can view the list of test runs and a summary overview of the test results directly from within the function app configuration in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), go to your Azure Function App.

1. On the left pane, select **Load testing**.

1. In the **Test runs** tab, you can view the list of test runs for your function app.

    For each test run, you can view the test details and a summary of the test outcome, such as average response time, throughput, and error state.

1. Select a test run to go to the Azure Load Testing dashboard and analyze the test run details.

   :::image type="content" source="./media/how-to-create-load-test-azure-functions/azure-functions-test-runs-list.png" lightbox="./media/how-to-create-load-test-azure-functions/azure-functions-test-runs-list.png" alt-text="Screenshot that shows the test runs list for an app in Azure Functions.":::

## Next steps

- Learn more about [load testing Azure App Service applications](./concept-load-test-app-service.md).
