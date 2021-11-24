---
title: Monitor server-side application metrics for load testing
titleSuffix: Azure Load Testing
description: Learn how to configure a load test to monitor server-side application metrics with Azure Load Testing.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 11/30/2021
ms.topic: how-to

---
# Monitor server-side application metrics with Azure Load Testing Preview

In this article, you'll learn how to configure your load test to monitor server-side application metrics with Azure Load Testing Preview.

Azure Load Testing integrates with Azure Monitor to capture server-side resource metrics for Azure-hosted applications. You can specify which Azure components and resource metrics to monitor for your load test run.

> [!IMPORTANT]
> Azure Load Testing is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing resource with at least one completed test run. If you need to create an Azure Load Testing resource, see [Tutorial: Run a load test to identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md).

## Configure server-side monitoring for a load test

In this section, you'll update an existing load test to configure the Azure application components to capture server-side resource metrics for.

1. Navigate to your Azure Load Testing resource in the Azure portal. 

1. Select **Tests** from the left navigation, and then select your load test from the list.

    :::image type="content" source="media/how-to-update-rerun-test/select-test.png" alt-text="Screenshot that shows how to select a load test.":::  

1. On the test runs page, select **Configure**, and then select **App Components** to add or remove Azure resources to monitor during the load test.

    :::image type="content" source="media/how-to-update-rerun-test/configure-app-components.png" alt-text="Screenshot that shows how to configure app components for a load test.":::  

    You can add or remove Azure resources by checking the boxes, and then selecting **Apply**.

    :::image type="content" source="media/how-to-update-rerun-test/modify-app-components.png" alt-text="Screenshot that shows how to add or remove app components to a load test configuration.":::  

    The Azure Load Testing service will capture resource metrics for the selected Azure components and display them in the test result dashboard.
    
1. Select **Configure**, and then select **Metrics** to select the specific resource metrics to capture during the load test.

    :::image type="content" source="media/how-to-update-rerun-test/configure-metrics.png" alt-text="Screenshot that shows how to configure metrics for a load test.":::  

1. Update the list of metrics you want to capture, and then select **Apply** to save your changes.

    :::image type="content" source="media/how-to-update-rerun-test/modify-metrics.png" alt-text="Screenshot that shows how to modify the list of resource metrics.":::  

    Alternatively, you can also update the app components and metrics from the test result details page.

1. Select **Run** to run the load test with the new configuration settings.

    :::image type="content" source="media/how-to-update-rerun-test/run-load-test.png" alt-text="Screenshot that shows how to run  the test from the test runs page.":::  

    If you've updated the load test from the test results page, you can select **Rerun** to run the load test with the new configuration settings.

    :::image type="content" source="media/how-to-update-rerun-test/dashboard-run.png" alt-text="Screenshot that shows how to rerun the load test from the test result dashboard.":::

    Notice that the test result dashboard now shows the updated server-side metrics.

    :::image type="content" source="media/how-to-update-rerun-test/dashboard-updated-metrics.png" alt-text="Screenshot that shows the updated server-side metrics in the test result dashboard.":::

## Next steps

- For information about high-scale load tests, see [Set up a high-scale load test](./how-to-high-scale-load.md).

- To learn about performance test automation, see [Configure automated performance testing](./tutorial-cicd-azure-pipelines.md)
