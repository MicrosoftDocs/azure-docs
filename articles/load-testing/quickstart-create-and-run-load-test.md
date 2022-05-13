---
title: 'Quickstart: Create and run a load test with Azure Load Testing'
description: 'This quickstart shows how to create an Azure Load Testing resource and run a high-scale load test for an external website by using the Azure portal.'
services: load-testing
ms.service: load-testing
ms.topic: quickstart
author: ntrogh
ms.author: nicktrog
ms.date: 02/15/2022
ms.custom: template-quickstart, mode-other
adobe-target: true
---

# Quickstart: Create and run a load test with Azure Load Testing Preview

This quickstart describes how to create an Azure Load Testing Preview resource by using the Azure portal. With this resource, you'll create a load test for a website without requiring a JMeter script.

After you complete this quickstart, you'll have a resource and load test that you can use for other tutorials.

Learn more about the [key concepts for Azure Load Testing](./concept-load-testing-concepts.md).

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## <a name="create_resource"></a> Create an Azure Load Testing resource

First, you'll create the top-level resource for Azure Load Testing. It provides a centralized place to view and manage test plans, test results, and related artifacts.

If you already have a Load Testing resource, skip this section and continue to [Create a load test](#create_test).

To create a Load Testing resource:

[!INCLUDE [azure-load-testing-create-portal](../../includes/azure-load-testing-create-in-portal.md)]

## <a name="create_test"></a> Run a load test

With Azure Load Testing, you can run a load test for a URL.

1. Go to your Azure Load Testing resource overview. On the Get started tab, click on the **Quickstart** button.
    
1. On the **Quickstart test** page, enter the **Test URL** with the complete URL that you would like to run the test for. For example, http://contoso-app.azurewebsites.net/login

1. (Optional) You can update the **Number of virtual users** to the total number of virtual users. The maximum allowed value is 11250. One engine instance can generate up to 250 threads. If the virtual users entered are above this, Azure Load Testing will evenly split it into different engines automatically.

1. (Optional) You can update the **Test duration** and **Ramp up time** for the test.

1. Click on Run test.

## <a name="view"></a> View the test results

Once the load test starts, you will be redirected to the test run dashboard. While the load test is running, Azure Load Testing captures both client-side metrics and server-side metrics. In this section, you'll use the dashboard to monitor the client-side metrics.

1. On the test run dashboard, you can see the streaming client-side metrics while the test is running. By default, the data refreshes every five seconds.

    :::image type="content" source="./media/quickstart-create-and-run-loadtest/test-run-aggregated-by-percentile.png" alt-text="Screenshot that shows results of the load test.":::

1. Optionally, change the display filters to view a specific time range, result percentile, or error type.

    :::image type="content" source="./media/quickstart-create-and-run-loadtest/test-result-filters.png" alt-text="Screenshot that shows the filter criteria for the results of a load test.":::

> [!NOTE]
> The test created will auto-generate a JMeter script. You can download the JMeter script from the test run dashboard. Click on **Download** and select **Input file**. To run this script you will need to provide environment variables.

## <a name="rerun"></a> Rerun the test

To rerun the test, select **Rerun** on the test run dashboard. You can modify the test settings by updating the following **Environment variables**:

  - threads_per_engine: The number of virtual users per engine instance

  - duration_in_sec: Test duration in seconds

  - ramp_up_time: Ramp up time in seconds for the test to reach the total number of virtual users.

> [!NOTE]
> You can update the test configuration at any time, for example [define test criteria](how-to-define-test-criteria.md) or [monitor server-side metrics](how-to-monitor-server-side-metrics.md). Choose your test in the list of tests, and then select **Edit**.

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

You now have an Azure Load Testing resource, which you used to load test an external website.

You can reuse this resource to learn how to identify performance bottlenecks in an Azure-hosted application by using server-side metrics.

> [!div class="nextstepaction"]
> [Identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md)
