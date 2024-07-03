---
title: Monitor server-side metrics
titleSuffix: Azure Load Testing
description: Learn how to capture and monitor server-side application metrics when running a load test with Azure Load Testing. Add Azure app components and resource metrics to your load test configuration.
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 01/16/2024
ms.topic: how-to

---
# Monitor server-side application metrics by using Azure Load Testing

In this article, you learn how to capture and monitor server-side application metrics when running a load test with Azure Load Testing. When you run a load test for an Azure-hosted application, Azure Load Testing collects resource metrics for your application components and presents them in the load testing dashboard.

To capture metrics during your load test, you update the load test configuration and [add the Azure app components](#add-azure-app-components-to-a-load-test) that make up your application. The service automatically selects the most relevant resource metrics for these app components, depending on the type of component. Optionally, you can [update the list of server-side metrics](#configure-resource-metrics-for-a-load-test) for each Azure component.

Azure Load Testing integrates with Azure Monitor to capture server-side resource metrics for Azure-hosted applications. Read more about which [Azure resource types that Azure Load Testing supports](./resource-supported-azure-resource-types.md).

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure load testing resource. To create a load testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).

## Add Azure app components to a load test

To monitor resource metrics for an Azure-hosted application, you need to specify the list of Azure application components in your load test configuration. Azure Load Testing automatically captures a set of relevant resource metrics for each selected component. During the load test and after the test finishes, you can view the server-side metrics in the load testing dashboard.

For the list of Azure components that Azure Load Testing supports, see [Supported Azure resource types](./resource-supported-azure-resource-types.md).

Use the following steps to configure the Azure components for your load test:

1. In the [Azure portal](https://portal.azure.com), go to your Azure load testing resource. 

1. On the left pane, select **Tests**, and then select your load test from the list.

1. On the test details page, select **Configure**, and then select **App Components** to add or remove Azure resources to monitor during the load test.

    :::image type="content" source="media/how-to-monitor-server-side-metrics/configure-app-components.png" alt-text="Screenshot that shows the 'App Components' button for displaying app components to configure for a load test." lightbox="media/how-to-monitor-server-side-metrics/configure-app-components.png":::

1. On the **Configure App Components** page, select or clear the checkboxes for the Azure resources you want to add or remove, and then select **Apply**.

    :::image type="content" source="media/how-to-monitor-server-side-metrics/modify-app-components.png" alt-text="Screenshot that shows how to add or remove app components from a load test configuration." lightbox="media/how-to-monitor-server-side-metrics/modify-app-components.png":::  

    When you run the load test, Azure Load Testing displays the default resource metrics for the selected app components in the test run dashboard.

You can change the list of resource metrics for each app component at any time.

## Configure resource metrics for a load test

When you add app components to your load test configuration, Azure Load Testing adds the most relevant resource metrics for these components. You can add or remove resource metrics for each of the app components in your load test.

Use the following steps to view and update the list of resource metrics for a load test:

1. On the test details page, select **Configure**, and then select **Metrics** to select the specific resource metrics to capture during the load test.

    :::image type="content" source="media/how-to-monitor-server-side-metrics/configure-metrics.png" alt-text="Screenshot that shows the 'Metrics' button to configure metrics for a load test." lightbox="media/how-to-monitor-server-side-metrics/configure-metrics.png":::  

1. Update the list of metrics you want to capture, and then select **Apply**.

    :::image type="content" source="media/how-to-monitor-server-side-metrics/modify-metrics.png" alt-text="Screenshot that shows a list of resource metrics to configure for a load test." lightbox="media/how-to-monitor-server-side-metrics/modify-metrics.png":::  

1. Select **Run** to run the load test with the new configuration settings.

    :::image type="content" source="media/how-to-monitor-server-side-metrics/run-load-test.png" alt-text="Screenshot that shows the 'Run' button for running the load test from the test details page." lightbox="media/how-to-monitor-server-side-metrics/run-load-test.png":::  

    Notice that the test result dashboard now shows the updated server-side metrics.

    :::image type="content" source="media/how-to-monitor-server-side-metrics/dashboard-updated-metrics.png" alt-text="Screenshot that shows the updated server-side metrics on the test result dashboard." lightbox="media/how-to-monitor-server-side-metrics/dashboard-updated-metrics.png":::

> [!NOTE]
> When you update the load test configuration of a load test, all future test runs use the updated configuration. You can also update app components and metrics on the load testing dashboard. In this case, the configuration changes only apply to the current test run.

## Related content

- [View metrics trends and compare load test results to identify performance regressions](./how-to-compare-multiple-test-runs.md).
