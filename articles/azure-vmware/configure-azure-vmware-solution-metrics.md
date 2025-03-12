---
title: Configure the latest iteration of Azure VMware Solution private cloud performance and health metrics
description: Learn how to take advantage of the latest improvements made to Azure VMware Solution private cloud performance and health metrics 
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 10/09/2024
ms.custom: engagement-fy24

#Customer intent: As an Azure service administrator, I want to collect key performance and reliability metrics from my Azure VMware Solution private cloud, so I can analyze for any diagnostic purposes.

---

# Configure the latest iteration of Azure VMware Solution private cloud performance and health metrics

In this article, you learn how to take advantage of the latest iteration of metrics available to monitor your Azure VMware Solution private cloud. 

Azure VMware Solution provides users with an array of high-level health and performance metrics to provide visibility into the health and performance of an Azure VMware Solution private cloud. Since early 2024, another set of identical metrics labeled with the word "(new)" were introduced, where a series of enhancements to the stability, reliability, and performance of these metrics were made to provide users a better experience relative to the older set of metrics.  
  

### View Azure VMware Solution metrics
From your Azure VMware Solution private cloud, select **Metrics** under the **Monitoring** section. Then under the **Metric** dropdown, choose a metric that contains the word "(new)". These newer metrics are powered by our improved metrics engine, providing utmost reliability and stability. The metrics monitor items like memory consumption, datastore usage, and CPU across your Azure VMware Solution private cloud.

:::image type="content" source="media/new-metrics/azure-vmware-solution-metrics-new-1.png" alt-text="Screenshot showing where to get the new metrics.":::

### Setting up a chart

Select a metric you'd like to build a chart for, such as "Percentage CPU (new)" in this example. Upon doing so, you will see a chart like the one below showing a time series for the metric you've selected.

:::image type="content" source="media/new-metrics/azure-vmware-solution-metrics-new-2.png" alt-text="Screenshot showing an example metric.":::

You can toggle the time window you are interested in this metric for by simply selecting the time window button in the top-right corner. The default window for your selected metric will be **24 hours**.

Once you are ready to save, click **Save to Dashboard** and select one of the options presented for where this metric will live.

### Send metrics to other monitoring solutions using the new metrics

Additionally, you can hover over each metric in the **Metric** dropdown to see the Metric ID. You can use this Metric ID in your third-party monitoring tools to monitor your Azure VMware Solution private cloud.
 >[!IMPORTANT]
   >We strongly encourage all users - first time and repeat - to migrate to the new metrics suffixed with **"(new)"**.

For those who have used the metrics previously and have built monitoring in downstream tools and configurations that rely on the old metric IDs, the following table provides the corresponding newer metric IDs you can use for the same set of metrics to seamlessly transition to using the newer set of metrics:

| Metric Name (as viewed in the portal) | Current Metric ID | New Metric ID | 
| :---     | :---      | :---     |
| Datastore Disk Used   | UsedLatest  | DiskUsedLatest |
| Datastore Disk Total Capacity   | CapacityLatest   | CapacityLatest |
| Average Effective Memory   | EffectiveMemAverage   | ClusterSummaryEffectiveMemory  |
| Average Total Memory   | TotalMbAverage    | ClusterSummaryTotalMemCapacityMB  |
| Average Memory Overhead    | OverheadAverage   | MemOverheadAverage  |
| Average Memory Usage   | UsageAverage    | MemUsageAverage  |
| Percentage CPU   | EffectiveCpuAverage  | CpuUsageAverage   |
| Percentage Datastore Disk Used    | DiskUsedPercentage   | DiskUsedPercentage   |