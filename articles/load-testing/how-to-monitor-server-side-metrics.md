---
title: Monitor server-side application metrics for load testing
titleSuffix: Azure Load Testing
description: Learn how to configure a load test to monitor server-side application metrics by using Azure Load Testing.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 01/18/2023
ms.topic: how-to

---
# Monitor server-side application metrics by using Azure Load Testing
 
You can monitor server-side application metrics for Azure-hosted applications when running a load test with Azure Load Testing. In this article, you'll learn how to configure app components and metrics for your load test.

To capture metrics during your load test, you'll first [select the Azure components](#select-azure-application-components) that make up your application. Optionally, you can then [configure the list of server-side metrics](#select-server-side-resource-metrics) for each Azure component.

Azure Load Testing integrates with Azure Monitor to capture server-side resource metrics for Azure-hosted applications. Read more about which [Azure resource types that Azure Load Testing supports](./resource-supported-azure-resource-types.md).

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing resource with at least one completed test run. If you need to create an Azure Load Testing resource, see [Tutorial: Run a load test to identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md).

## Select Azure application components

To monitor resource metrics for an Azure-hosted application, you need to specify the list of Azure application components in your load test. Azure Load Testing automatically captures a set of relevant resource metrics for each selected component. When your load test finishes, you can view the server-side metrics in the dashboard.

For the list of Azure components that Azure Load Testing supports, see [Supported Azure resource types](./resource-supported-azure-resource-types.md).

Use the following steps to configure the Azure components for your load test:

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource. 

1. On the left pane, select **Tests**, and then select your load test from the list.

    :::image type="content" source="media/how-to-monitor-server-side-metrics/select-test.png" alt-text="Screenshot that shows a list of load tests to select from.":::  

1. On the test runs page, select **Configure**, and then select **App Components** to add or remove Azure resources to monitor during the load test.

    :::image type="content" source="media/how-to-monitor-server-side-metrics/configure-app-components.png" alt-text="Screenshot that shows the 'App Components' button for displaying app components to configure for a load test.":::  

1. Select or clear the checkboxes next to the Azure resources you want to add or remove, and then select **Apply**.

    :::image type="content" source="media/how-to-monitor-server-side-metrics/modify-app-components.png" alt-text="Screenshot that shows how to add or remove app components from a load test configuration.":::  

    When you run the load test, Azure Load Testing will display the default resource metrics in the test run dashboard.

You can change the list of resource metrics at any time. In the next section, you'll view and configure the list of resource metrics.

## Select server-side resource metrics

For each Azure application component, you can select the resource metrics to monitor during your load test.

Use the following steps to view and update the list of resource metrics:

1. On the test runs page, select **Configure**, and then select **Metrics** to select the specific resource metrics to capture during the load test.

    :::image type="content" source="media/how-to-monitor-server-side-metrics/configure-metrics.png" alt-text="Screenshot that shows the 'Metrics' button to configure metrics for a load test.":::  

1. Update the list of metrics you want to capture, and then select **Apply**.

    :::image type="content" source="media/how-to-monitor-server-side-metrics/modify-metrics.png" alt-text="Screenshot that shows a list of resource metrics to configure for a load test.":::  

    Alternatively, you can update the app components and metrics from the page that shows test result details.

1. Select **Run** to run the load test with the new configuration settings.

    :::image type="content" source="media/how-to-monitor-server-side-metrics/run-load-test.png" alt-text="Screenshot that shows the 'Run' button for running the load test from the test runs page.":::  

    Notice that the test result dashboard now shows the updated server-side metrics.

    :::image type="content" source="media/how-to-monitor-server-side-metrics/dashboard-updated-metrics.png" alt-text="Screenshot that shows the updated server-side metrics on the test result dashboard.":::

When you update the configuration of a load test, all future test runs will use that configuration. On the other hand, if you update a test run, the new configuration will only apply to that test run.

## Next steps

- Learn how you can [identify performance problems by comparing metrics across multiple test runs](./how-to-compare-multiple-test-runs.md).

- Learn how to [set up a high-scale load test](./how-to-high-scale-load.md).

- Learn how to [configure automated performance testing](./tutorial-identify-performance-regression-with-cicd.md).
