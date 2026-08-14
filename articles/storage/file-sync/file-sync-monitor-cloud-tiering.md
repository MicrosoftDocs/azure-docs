---
title: Monitor Azure File Sync Cloud Tiering
description: Use metrics to monitor your cloud tiering policies. You can monitor files synced, server cache size, cache hit rate, and more.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 08/12/2026
ms.author: kendownie
# Customer intent: As a system administrator, I want to monitor cloud tiering metrics for Azure File Sync through both the server endpoint and Azure Monitor, so that I can optimize storage efficiency and improve performance.
---

# Monitor Azure File Sync cloud tiering

Azure File Sync provides two ways to monitor your cloud tiering policy: from the server endpoint properties pane in the Azure portal, or with Azure Monitor metrics. Before you can use either method, you need a deployed Storage Sync Service with a registered server, a sync group, and a server endpoint that has cloud tiering enabled.

## Monitor from the server endpoint properties pane

Sign in to the [Azure portal](https://portal.azure.com/) and search for **Storage Sync Services**. Select the appropriate Storage Sync Service and Sync Group. Then select the server endpoint you want to monitor. Under **Properties**, you see a summary of your cloud tiering status and settings.

:::image type="content" source="media/file-sync-monitor-cloud-tiering/cloud-tiering-settings.png" alt-text="Screenshot showing cloud tiering status and settings summary.":::

The following table describes each property in the summary:

| Property | Description | Guidance |
|---|---|---|
| **Space savings** | The amount of space saved by enabling cloud tiering. | If your local volume size is large enough to hold all of your data, space savings shows 0%. A 0% or low percentage might indicate that cloud tiering isn't beneficial with your current local cache size. |
| **Total size (cloud)** | The size of your files that were synced to the cloud. | — |
| **Cached size (server)** | The total size of files on your server, both downloaded and tiered. | Cached size can be bigger than the total size of your files in the cloud due to variables like the volume's cluster size. If cached size is larger than you want, consider increasing your volume free space policy. |
| **Effective volume free space policy** | The volume free space policy that Azure File Sync uses to determine how much free space to leave on the volume your server endpoint is on. | When multiple server endpoints share the same volume, the highest volume free space policy among them becomes the effective policy for all of them. For example, if two server endpoints have 30% and 50% volume free space policies, the effective policy for both is 50%. To view the effective policy, select the percentage listed under **Cloud tiering settings** > **Volume free space policy**. |

You can drill down further by selecting **Monitoring** > **Cloud tiering status**.

:::image type="content" source="media/file-sync-monitor-cloud-tiering/cloud-tiering-status.png" alt-text="Screenshot showing cloud tiering monitoring view with current free space and cache hit rate.":::

The following table describes each property in the cloud tiering status view:

| Property | Description | Guidance |
|---|---|---|
| **Current free space** | The volume free space currently available on your on-premises server. | If you have high egress but more volume free space is available before your volume free space policy kicks in, consider disabling your date policy. Another issue might be that a currently tiered file is larger than the volume free space remaining before the policy kicks in. In this case, consider increasing your local volume size. |
| **Cache hit rate** | The percentage of bytes that are served directly from the local cache instead of recalled from the cloud. | A cache hit rate of 100% means that all of the data you accessed in the last hour was already in your local cache. If your goal is to reduce egress, a high cache hit rate indicates that your current policy is working well. Workloads with random access patterns typically have lower cache hit rates. |

## Monitor by using Azure Monitor metrics

Go to the **Storage Sync Service** and select **Metrics** from the left navigation. 

You can use the following nine metrics to monitor cloud tiering:


| Metric | Description | Use case |
|---|---|---|
| Cache data size by last access time | Total size of data (in bytes), categorized by the time it was last accessed. | Understand how much of your cached data is stale versus recently used. |
| Cloud tiering cache hit rate | Percentage of bytes served directly from the local cache instead of recalled from the cloud. | Reflect the efficiency of caching. |
| Cloud tiering low disk space mode | Boolean value that indicates whether a server is in low disk space mode (1 = yes, 0 = no). | Detect when a server has too little free space for normal tiering operations. |
| Cloud tiering recall size | Total size of data recalled (in bytes). | Identify how much data is being recalled. |
| Cloud tiering recall size by application | Total size of data recalled by an application (in bytes). | Identify what's recalling the data. |
| Cloud tiering recall success rate | Percentage of successful data recall operations. | Indicate how reliably data is being retrieved. |
| Cloud tiering recall throughput | Rate at which data is recalled (in bytes). | Investigate recall performance concerns. |
| Cloud tiering size of data tiered | Total size of data tiered to the Azure file share (in bytes). | Track tiering activity over time. |
| Cloud tiering size of data tiered by last maintenance job | Total size of data tiered to the Azure file share (in bytes) during the most recent maintenance job. | Diagnose emergency tiering events. |

To be more specific on what you want your graphs to display, consider using **Add Filter** and **Apply Splitting**.

## See also

- For details on the different types of metrics for Azure File Sync and how to use them, see [Monitor Azure File Sync](file-sync-monitoring.md).
- For details on how to use metrics, see [Analyze metrics with Azure Monitor metrics explorer](/azure/azure-monitor/essentials/analyze-metrics).
- To change your cloud tiering policy, see [Choose cloud tiering policies](file-sync-choose-cloud-tiering-policies.md).
