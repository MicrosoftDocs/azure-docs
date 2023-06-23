---
title: 'Quickstart: Create and run a load test with Azure Load Testing'
description: 'This quickstart shows how to create an Azure Load Testing resource and run a high-scale load test for an external website by using the Azure portal.'
services: load-testing
ms.service: load-testing
ms.topic: quickstart
author: ntrogh
ms.author: nicktrog
ms.date: 01/18/2023
ms.custom: template-quickstart, mode-other
adobe-target: true
---

# Quickstart: Create and run a load test with Azure Load Testing

This quickstart describes how to load test a web application with Azure Load Testing from the Azure portal without prior knowledge about load testing tools. You'll first create an Azure Load Testing resource, and then create a load test by using the web application URL.

After you complete this quickstart, you'll have a resource and load test that you can use for other tutorials.

Learn more about the [key concepts for Azure Load Testing](./concept-load-testing-concepts.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure RBAC role with permission to create and manage resources in the subscription, such as [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Owner](../role-based-access-control/built-in-roles.md#owner) 

## Create an Azure Load Testing resource

First, you'll create the top-level resource for Azure Load Testing. It provides a centralized place to view and manage test plans, test results, and related artifacts.

If you already have a load testing resource, skip this section and continue to [Create a load test](#create-a-load-test).

To create a load testing resource:

[!INCLUDE [azure-load-testing-create-portal](./includes/azure-load-testing-create-in-portal/azure-load-testing-create-in-portal.md)]

## Create a load test

Azure Load Testing enables you to quickly create a load test from the Azure portal by specifying the target web application URL and the basic load testing parameters. The service abstracts the complexity of creating the load test script and provisioning the compute infrastructure.

You can specify the target load with a quick test by using either of two options:

- Virtual users: simulate a total number of virtual users for the specified load test duration.
- Requests per second: simulate a total number of requests per second, based on an estimated response time.

## [Virtual users](#tab/virtual-users)


1. Go to the **Overview** page of your Azure Load Testing resource.

1. On the **Get started** tab, select **Quick test**.

    :::image type="content" source="media/quickstart-create-and-run-load-test/quick-test-resource-overview.png" alt-text="Screenshot that shows the quick test button on the resource overview page.":::

1. On the **Quickstart test** page, enter the **Test URL**.

    Enter the complete URL that you would like to run the test for. For example, `https://www.example.com/login`.
 
1. Select **Virtual users** load specification method. 

1. (Optional) Update the **Number of virtual users** to the total number of virtual users. 

    The maximum allowed value is 11250. If the number of virtual users exceeds the maximum of 250 per test engine instance, Azure Load Testing provisions multiple test engines and distributes the load evenly. For example, 300 virtual users will result in 2 test engines with 150 virtual users each.

1. (Optional) Update the **Test duration** and **Ramp up time** for the test.

1. Select **Run test** to create and start the load test.

    :::image type="content" source="media/quickstart-create-and-run-load-test/quickstart-test-virtual-users.png" alt-text="Screenshot that shows the quick test page in the Azure portal, highlighting the option for specifying virtual users.":::

## [Requests per second (RPS)](#tab/rps)


1. Go to the **Overview** page of your Azure Load Testing resource.

1. On the **Get started** tab, select **Quick test**.

    :::image type="content" source="media/quickstart-create-and-run-load-test/quick-test-resource-overview.png" alt-text="Screenshot that shows the quick test button on the resource overview page.":::

1. On the **Quickstart test** page, enter the **Test URL**.

    Enter the complete URL that you would like to run the test for. For example, `https://www.example.com/login`.

1. Select **Requests per second** load specification method.

1. (Optional) Update the **Target Requests per second (RPS)** to the load that you want to generate. 

    The maximum load that the service can generate depends on the response time of the endpoint during the load test. Azure Load Testing uses the response time to provision multiple test engines and configure the target number of virtual users needed to generate the required load. The number of virtual users is calculated using the formula: Virtual users = (RPS * max response time) / 1000

1. (Optional) Update the **Response time (milliseconds)** to the estimated response time of the endpoint.

    The endpoint response time during the load test is expected to be higher than normal. Provide a value higher than the maximum observed response time for the endpoint. 
    
1. (Optional) Update the **Test duration** and **Ramp up time** for the test.

1. Select **Run test** to create and start the load test.

    :::image type="content" source="media/quickstart-create-and-run-load-test/quickstart-test-requests-per-second.png" alt-text="Screenshot that shows the quick test page in the Azure portal, highlighting the option for specifying requests per second.":::

---


> [!NOTE]
> Azure Load Testing auto-generates an Apache JMeter script for your load test.
> You can download the JMeter script from the test run dashboard. Select **Download**, and then select **Input file**. To run the script locally, you have to provide environment variables to configure the URL and test parameters.

## View the test results

Once the load test starts, you will be redirected to the test run dashboard. While the load test is running, Azure Load Testing captures both client-side metrics and server-side metrics. In this section, you'll use the dashboard to monitor the client-side metrics.

1. On the test run dashboard, you can see the streaming client-side metrics while the test is running. By default, the data refreshes every five seconds.

    :::image type="content" source="./media/quickstart-create-and-run-load-test/test-run-aggregated-by-percentile.png" alt-text="Screenshot that shows results of the load test.":::

1. Optionally, change the display filters to view a specific time range, result percentile, or error type.

    :::image type="content" source="./media/quickstart-create-and-run-load-test/test-result-filters.png" alt-text="Screenshot that shows the filter criteria for the results of a load test.":::

## Modify load test parameters

You can modify the load test configuration at any time. For example, [define test failure criteria](how-to-define-test-criteria.md) or [monitor server-side metrics for Azure-hosted applications](how-to-monitor-server-side-metrics.md).

1. In the [Azure portal](https://portal.azure.com/), go to your Azure Load Testing resource.

1. On the left pane, select **Tests** to view the list of load tests, and then select your test.

1. Select **Edit** to modify the load test configuration.

The generated load test uses environment variables to specify the initial configuration:

  - domain: Domain name of the web server (for example, www.example.com). Don't include the `http://` prefix.
  
  - protocol: HTTP or HTTPS

  - path: The path to the resource (for example, /servlets/myServlet).

  - threads_per_engine: The number of virtual users per engine instance. It is recommended to set this to maximum 250. If you need more virtual users, increase the number of test engines for the test. For more information, see [how to configure for high scale](how-to-high-scale-load.md).

  - duration_in_sec: Test duration in seconds

  - ramp_up_time: Ramp up time in seconds for the test to reach the total number of virtual users.

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

You now have an Azure Load Testing resource, which you used to load test an external website.

You can reuse this resource to learn how to identify performance bottlenecks in an Azure-hosted application by using server-side metrics.

> [!div class="nextstepaction"]
> [Automate load tests with CI/CD](./quickstart-add-load-test-cicd.md)
