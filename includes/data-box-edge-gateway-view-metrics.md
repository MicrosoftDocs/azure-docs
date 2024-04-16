---
author: stevenmatthew
ms.service: databox  
ms.topic: include
ms.date: 04/15/2019
ms.author: shaas
---

You can also view the metrics to monitor the performance of the device and in some instances for troubleshooting device issues.

Take the following steps in the Azure portal to create a chart for selected device metrics.

1. For your resource in the Azure portal, go to **Monitoring > Metrics** and select **Add metric**.

    ![Add metric](media/data-box-edge-gateway-view-metrics/view-metrics-1.png)

2. The resource is automatically populated.  

    ![Current resource](media/data-box-edge-gateway-view-metrics/view-metrics-2.png)

    To specify another resource, select the resource. On **Select a resource** blade, select the subscription, resource group, resource type, and the specific resource for which you want to show the metrics and select **Apply**.

    ![Choose another resource](media/data-box-edge-gateway-view-metrics/view-metrics-3.png)

3. From the dropdown list, select a metric to monitor your device. For a full list of these metrics, see [Metrics on your device](#metrics-on-your-device).

4. When a metric is selected from the dropdown list, aggregation can also be defined. Aggregation refers to the actual value aggregated over a specified span of time. The aggregated values can be average, minimum, or the maximum value. Select the Aggregation from Avg, Max, or Min.

    ![View chart](media/data-box-edge-gateway-view-metrics/view-metrics-4.png)

5. If the metric you selected has multiple instances, then the splitting option is available. Select **Apply splitting** and then select the value by which you want to see the breakdown.

    ![Apply splitting](media/data-box-edge-gateway-view-metrics/view-metrics-5.png)

6. If you now want to see the breakdown only for a few instances, you can filter the data. For example, in this case, if you want to see the network throughput only for the two connected network interfaces on your device, you could filter those interfaces. Select **Add filter** and specify the network interface name for filtering.

    ![Add filter](media/data-box-edge-gateway-view-metrics/view-metrics-6.png)

7. You could also pin the chart to dashboard for easy access.

    ![Pin to dashboard](media/data-box-edge-gateway-view-metrics/view-metrics-7.png)

8. To export chart data to an Excel spreadsheet or get a link to the chart that you can share, select the share option from the command bar.

    ![Export data](media/data-box-edge-gateway-view-metrics/view-metrics-8.png)

