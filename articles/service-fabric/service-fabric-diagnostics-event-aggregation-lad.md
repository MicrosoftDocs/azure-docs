---
title: Azure Service Fabric Event Aggregation with Linux Azure Diagnostics | Microsoft Docs
description: Learn about aggregating and collecting events using LAD for monitoring and diagnostics of Azure Service Fabric clusters.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/26/2017
ms.author: dekapur

---

# Event aggregation and collection using Linux Azure Diagnostics
> [!div class="op_single_selector"]
> * [Windows](service-fabric-diagnostics-event-aggregation-wad.md)
> * [Linux](service-fabric-diagnostics-event-aggregation-lad.md)
>
>

When you're running an Azure Service Fabric cluster, it's a good idea to collect the logs from all the nodes in a central location. Having the logs in a central location helps you analyze and troubleshoot issues in your cluster, or issues in the applications and services running in that cluster.

One way to upload and collect logs is to use the Linux Azure Diagnostics (LAD) extension, which uploads logs to Azure Storage, and also has the option to send logs to Azure Application Insights or Event Hubs. You can also use an external process to read the events from storage and place them in an analysis platform product, such as [OMS Log Analytics](../log-analytics/log-analytics-service-fabric.md) or another log-parsing solution.

## Log and event sources

### Service Fabric infrastructure events
Service Fabric emits a few out-of-the-box logs via [LTTng](http://lttng.org), including operational events or runtime events. These logs are stored in the location that the cluster's Resource Manager template specifies. To get or set the storage account details, search for the tag **AzureTableWinFabETWQueryable** and look for **StoreConnectionString**.

### Application events
 Events emitted from your applications' and services' code as specified by you when instrumenting your software. You can use any logging solution that writes text-based log files--for example, LTTng. For more information, see the LTTng documentation on tracing your application.

[Monitor and diagnose services in a local machine development setup](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md).

## Deploy the Diagnostics extension
The first step in collecting logs is to deploy the Diagnostics extension on each of the VMs in the Service Fabric cluster. The Diagnostics extension collects logs on each VM and uploads them to the storage account that you specify. The steps vary based on whether you use the Azure portal or Azure Resource Manager.

To deploy the Diagnostics extension to the VMs in the cluster as part of cluster creation, set **Diagnostics** to **On**. After you create the cluster, you can't change this setting by using the portal.

Then, configure Linux Azure Diagnostics (LAD) to collect the files and place them into your storage account. This process is explained as scenario 3 ("Upload your own log files") in the article [Using LAD to monitor and diagnose Linux VMs](../virtual-machines/linux/classic/diagnostic-extension.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json). Following this process gets you access to the traces. You can upload the traces to a visualizer of your choice.

You can also deploy the Diagnostics extension by using Azure Resource Manager. The process is similar for Windows and Linux and is documented for Windows clusters in [How to collect logs with Azure Diagnostics](service-fabric-diagnostics-how-to-setup-wad.md).

You can also use Operations Management Suite, as described in [Operations Management Suite Log Analytics with Linux](https://blogs.technet.microsoft.com/hybridcloud/2016/01/28/operations-management-suite-log-analytics-with-linux/).

After you finish this configuration, the LAD agent monitors the specified log files. Whenever a new line is appended to the file, it creates a syslog entry that is sent to the storage that you specified.

## Next steps

To understand in more detail what events you should examine while troubleshooting issues, see [LTTng documentation](http://lttng.org/docs) and [Using LAD](../virtual-machines/linux/classic/diagnostic-extension.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json).