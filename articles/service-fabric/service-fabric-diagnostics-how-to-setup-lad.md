<properties
   pageTitle="How to collect logs with Linux Azure Diagnostics | Microsoft Azure"
   description="This article describes how to set up Azure Diagnostics to collect logs from a Service Fabric Linux cluster running in Azure."
   services="service-fabric"
   documentationCenter=".net"
   authors="mani-ramaswamy"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/24/2016"
   ms.author="subramar"/>


# How to collect logs with Azure Diagnostics

> [AZURE.SELECTOR]
- [Windows](service-fabric-diagnostics-how-to-setup-wad.md)
- [Linux](service-fabric-diagnostics-how-to-setup-lad.md)
When you're running an Azure Service Fabric cluster, it's a good idea to collect the logs from all the nodes in a central location. Having the logs in a central location makes it easy to analyze and troubleshoot issues, whether they are in your services, application or the cluster itself. One way to upload and collect logs is to use the Azure Diagnostics extension, which uploads logs to Azure Storage. You can read the events from storage and place them into a product such as [Elastic Search](service-fabric-diagnostic-how-to-use-elasticsearch.md) or another log parsing solution.

## Different log sources that you may want to collect
1. **Service Fabric logs:** Emitted by the platform using LTTng and uploaded to your storage account. Logs may be operational events or runtime events emitted by the platform. These logs are stored in the location pointed in your cluster manifest (Search for the tag "AzureTableWinFabETWQueryable", and look for the "StoreConnectionString" to get the storage account details. 
2. **Application events:** Events emitted from your services code.  You can use any logging solution that writes text-based logfiles, for example [LTTng](http://lttng.org). Refer to th LTTng documentation on tracing your application.  


## Deploy the diagnostics extensions
The first step in collecting logs is to deploy the Diagnostics extension on each of the VMs in the Service Fabric cluster. The Diagnostics extension collects logs on each VM and uploads them to the storage account you specify. The steps vary based on whether you use the Azure portal or the Azure Resource Manager. 

### Deploy the diagnostics extension as part of cluster creation 
To deploy diagnostics extension to the VMs in the cluster as part of cluster creation, set "Diagnostics" to **On**. After the cluster has been created, this setting cannot be changed using the portal. 

Configure Linux Azure Diagnostics (LAD) to collect the files and place them into the customers storage account. This process is explained as scenario 3("Upload your own log files") in the article [Using LAD to monitor and diagnose Linux VMs](../virtual-machines/virtual-machines-linux-classic-diagnostic-extension.md). Following this process gets you access to the traces, which can be uploaded to a visualizer of your choice.


You can also deploy the diagnostics extension using the Azure Resource Manager. The process is similar for Windows and Linux and is documented for Windows clusters at [How to collect logs with Azure Diagnostics](service-fabric-diagnostics-how-to-setup-wad.md).

You can also use OMS as described in [OMS log analytics with linux](https://blogs.technet.microsoft.com/hybridcloud/2016/01/28/operations-management-suite-log-analytics-with-linux/).

After this configuration is done, the LAD agent monitors the log files specified.  Whenever a new line is appended to the file, it creates a syslog entry that is sent to the storage specified by the customer.


## Next steps
Check out [LTTng documentation](http://lttng.org/docs) and [Using LAD](../virtual-machines/virtual-machines-linux-classic-diagnostic-extension.md) to understand in more detail what events you should look into while troubleshooting issues.


