---
title: Event Aggregation with Linux Azure Diagnostics 
description: Learn about aggregating and collecting events using LAD for monitoring and diagnostics of Azure Service Fabric clusters.
author: srrengar

ms.topic: conceptual
ms.date: 2/25/2019
ms.author: srrengar
---

# Event aggregation and collection using Linux Azure Diagnostics
> [!div class="op_single_selector"]
> * [Windows](service-fabric-diagnostics-event-aggregation-wad.md)
> * [Linux](service-fabric-diagnostics-event-aggregation-lad.md)
>
>

When you're running an Azure Service Fabric cluster, it's a good idea to collect the logs from all the nodes in a central location. Having the logs in a central location helps you analyze and troubleshoot issues in your cluster, or issues in the applications and services running in that cluster.

One way to upload and collect logs is to use the Linux Azure Diagnostics (LAD) extension, which uploads logs to Azure Storage, and also has the option to send logs to Azure Application Insights or Event Hubs. You can also use an external process to read the events from storage and place them in an analysis platform product, such as [Azure Monitor logs](../log-analytics/log-analytics-service-fabric.md) or another log-parsing solution.

## Log and event sources

### Service Fabric platform events
Service Fabric emits a few out-of-the-box logs via [LTTng](https://lttng.org), including operational events or runtime events. These logs are stored in the location that the cluster's Resource Manager template specifies. To get or set the storage account details, search for the tag **AzureTableWinFabETWQueryable** and look for **StoreConnectionString**.

### Application events
 Events emitted from your applications' and services' code as specified by you when instrumenting your software. You can use any logging solution that writes text-based log files--for example, LTTng. For more information, see the LTTng documentation on tracing your application.

[Monitor and diagnose services in a local machine development setup](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally-linux.md).

## Deploy the Diagnostics extension
The first step in collecting logs is to deploy the Diagnostics extension on each of the VMs in the Service Fabric cluster. The Diagnostics extension collects logs on each VM and uploads them to the storage account that you specify. 

To deploy the Diagnostics extension to the VMs in the cluster as part of cluster creation, set **Diagnostics** to **On**. After you create the cluster, you can't change this setting by using the portal, so you will have to make the appropriate changes in the Resource Manager template.

This configures the LAD agent to monitor specified log files. Whenever a new line is appended to the file, it creates a syslog entry that is sent to the storage (table) that you specified.


## Next steps

1. To understand in more detail what events you should examine while troubleshooting issues, see [LTTng documentation](https://lttng.org/docs) and [Using LAD](https://docs.microsoft.com/azure/virtual-machines/extensions/diagnostics-linux).
2. [Set up the Log Analytics agent](service-fabric-diagnostics-event-analysis-oms.md) to help gather metrics, monitor Containers deployed on your cluster, and visualize your logs 
