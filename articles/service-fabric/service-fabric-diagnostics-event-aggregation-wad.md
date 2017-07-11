---
title: Azure Service Fabric Event Aggregation with Windows Azure Diagnostics | Microsoft Docs
description: Learn about aggregating and collecting events using WAD for monitoring and diagnostics of Azure Service Fabric clusters.
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
ms.date: 06/30/2017
ms.author: dekapur

---

# Event aggregation and collection using Windows Azure Diagnostics
> [!div class="op_single_selector"]
> * [Windows](service-fabric-diagnostics-event-aggregation-wad.md)
> * [Linux](service-fabric-diagnostics-event-aggregation-lad.md)
>
>

When you're running an Azure Service Fabric cluster, it's a good idea to collect the logs from all the nodes in a central location. Having the logs in a central location helps you analyze and troubleshoot issues in your cluster, or issues in the applications and services running in that cluster.

One way to upload and collect logs is to use the Windows Azure Diagnostics (WAD) extension, which uploads logs to Azure Storage, and also has the option to send logs to Azure Application Insights or Event Hubs. You can also use an external process to read the events from storage and place them in an analysis platform product, such as [OMS Log Analytics](../log-analytics/log-analytics-service-fabric.md) or another log-parsing solution.

## Prerequisites
These tools are used to perform some of the operations in this document:

* [Azure Diagnostics](../cloud-services/cloud-services-dotnet-diagnostics.md) (related to Azure Cloud Services but has good information and examples)
* [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md)
* [Azure PowerShell](/powershell/azure/overview)
* [Azure Resource Manager client](https://github.com/projectkudu/ARMClient)
* [Azure Resource Manager template](../virtual-machines/windows/extensions-diagnostics-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

## Log and event sources

### Service Fabric infrastructure events
As discussed in [this article](service-fabric-diagnostics-event-generation-infra.md), Service Fabric sets you up with a few out-of-the-box logging channels, of which the following channels are easily configured with WAD to send monitoring and diagnostics data to a storage table or elsewhere:
  * Operational events: higher-level operations that the Service Fabric platform performs. Examples include creation of applications and services, node state changes, and upgrade information. These are emitted as Event Tracing for Windows (ETW) logs
  * [Reliable Actors programming model events](service-fabric-reliable-actors-diagnostics.md)
  * [Reliable Services programming model events](service-fabric-reliable-services-diagnostics.md)

### Application events
 Events emitted from your applications' and services' code and written out by using the EventSource helper class provided in the Visual Studio templates. For more information on how to write EventSource logs from your application, see [Monitor and diagnose services in a local machine development setup](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md).

## Deploy the Diagnostics extension
The first step in collecting logs is to deploy the Diagnostics extension on each of the VMs in the Service Fabric cluster. The Diagnostics extension collects logs on each VM and uploads them to the storage account that you specify. The steps vary a little based on whether you use the Azure portal or Azure Resource Manager. The steps also vary based on whether the deployment is part of cluster creation or is for a cluster that already exists. Let's look at the steps for each scenario.

### Deploy the Diagnostics extension as part of cluster creation through Azure portal
To deploy the Diagnostics extension to the VMs in the cluster as part of cluster creation, you use the Diagnostics settings panel shown in the following image - ensure that Diagnostics is set to **On** (the default setting). After you create the cluster, you can't change these settings by using the portal.

![Azure Diagnostics settings in the portal for cluster creation](media/service-fabric-diagnostics-event-aggregation-wad/azure-enable-diagnostics.png)

When you're creating a cluster by using the portal, we highly recommend that you download the template **before you click OK** to create the cluster. For details, refer to [Set up a Service Fabric cluster by using an Azure Resource Manager template](service-fabric-cluster-creation-via-arm.md). You'll need the template to make changes later, because you can't make some changes by using the portal.

### Deploy the Diagnostics extension as part of cluster creation by using Azure Resource Manager
To create a cluster by using Resource Manager, you need to add the Diagnostics configuration JSON to the full cluster Resource Manager template before you create the cluster. We provide a sample five-VM cluster Resource Manager template with Diagnostics configuration added to it as part of our Resource Manager template samples. You can see it at this location in the Azure Samples gallery: [Five-node cluster with Diagnostics Resource Manager template sample](https://github.com/Azure/azure-quickstart-templates/tree/master/service-fabric-secure-cluster-5-node-1-nodetype-wad).

To see the Diagnostics setting in the Resource Manager template, open the azuredeploy.json file and search for **IaaSDiagnostics**. To create a cluster by using this template, select the **Deploy to Azure** button available at the previous link.

Alternatively, you can download the Resource Manager sample, make changes to it, and create a cluster with the modified template by using the `New-AzureRmResourceGroupDeployment` command in an Azure PowerShell window. See the following code for the parameters that you pass in to the command. For detailed information on how to deploy a resource group by using PowerShell, see the article [Deploy a resource group with the Azure Resource Manager template](../azure-resource-manager/resource-group-template-deploy.md).

### Deploy the Diagnostics extension to an existing cluster
If you have an existing cluster that doesn't have Diagnostics deployed, or if you want to modify an existing configuration, you can add or update it. Modify the Resource Manager template that's used to create the existing cluster or download the template from the portal as described earlier. Modify the template.json file by performing the following tasks.

Add a new storage resource to the template by adding to the resources section.

```json
{
  "apiVersion": "2015-05-01-preview",
  "type": "Microsoft.Storage/storageAccounts",
  "name": "[parameters('applicationDiagnosticsStorageAccountName')]",
  "location": "[parameters('computeLocation')]",
  "properties": {
    "accountType": "[parameters('applicationDiagnosticsStorageAccountType')]"
  },
  "tags": {
    "resourceType": "Service Fabric",
    "clusterName": "[parameters('clusterName')]"
  }
},
```

 Next, add to the parameters section just after the storage account definitions, between `supportLogStorageAccountName` and `vmNodeType0Name`. Replace the placeholder text *storage account name goes here* with the name of the storage account.

```json
    "applicationDiagnosticsStorageAccountType": {
      "type": "string",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS"
      ],
      "defaultValue": "Standard_LRS",
      "metadata": {
        "description": "Replication option for the application diagnostics storage account"
      }
    },
    "applicationDiagnosticsStorageAccountName": {
      "type": "string",
      "defaultValue": "storage account name goes here",
      "metadata": {
        "description": "Name for the storage account that contains application diagnostics data from the cluster"
      }
    },
```
Then, update the `VirtualMachineProfile` section of the template.json file by adding the following code within the extensions array. Be sure to add a comma at the beginning or the end, depending on where it's inserted.

```json
{
    "name": "[concat(parameters('vmNodeType0Name'),'_Microsoft.Insights.VMDiagnosticsSettings')]",
    "properties": {
        "type": "IaaSDiagnostics",
        "autoUpgradeMinorVersion": true,
        "protectedSettings": {
        "storageAccountName": "[parameters('applicationDiagnosticsStorageAccountName')]",
        "storageAccountKey": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('applicationDiagnosticsStorageAccountName')),'2015-05-01-preview').key1]",
        "storageAccountEndPoint": "https://core.windows.net/"
        },
        "publisher": "Microsoft.Azure.Diagnostics",
        "settings": {
        "WadCfg": {
            "DiagnosticMonitorConfiguration": {
            "overallQuotaInMB": "50000",
            "EtwProviders": {
                "EtwEventSourceProviderConfiguration": [
                {
                    "provider": "Microsoft-ServiceFabric-Actors",
                    "scheduledTransferKeywordFilter": "1",
                    "scheduledTransferPeriod": "PT5M",
                    "DefaultEvents": {
                    "eventDestination": "ServiceFabricReliableActorEventTable"
                    }
                },
                {
                    "provider": "Microsoft-ServiceFabric-Services",
                    "scheduledTransferPeriod": "PT5M",
                    "DefaultEvents": {
                    "eventDestination": "ServiceFabricReliableServiceEventTable"
                    }
                }
                ],
                "EtwManifestProviderConfiguration": [
                {
                    "provider": "cbd93bc2-71e5-4566-b3a7-595d8eeca6e8",
                    "scheduledTransferLogLevelFilter": "Information",
                    "scheduledTransferKeywordFilter": "4611686018427387904",
                    "scheduledTransferPeriod": "PT5M",
                    "DefaultEvents": {
                    "eventDestination": "ServiceFabricSystemEventTable"
                    }
                }
                ]
            }
            }
        },
        "StorageAccount": "[parameters('applicationDiagnosticsStorageAccountName')]"
        },
        "typeHandlerVersion": "1.5"
    }
}
```

After you modify the template.json file as described, republish the Resource Manager template. If the template was exported, running the deploy.ps1 file republishes the template. After you deploy, ensure that **ProvisioningState** is **Succeeded**.

## Collect health and load events

Starting with the 5.4 release of Service Fabric, health and load metric events are available for collection. These events reflect events generated by the system or your code by using the health or load reporting APIs such as [ReportPartitionHealth](https://msdn.microsoft.com/library/azure/system.fabric.iservicepartition.reportpartitionhealth.aspx) or [ReportLoad](https://msdn.microsoft.com/library/azure/system.fabric.iservicepartition.reportload.aspx). This allows for aggregating and viewing system health over time and for alerting based on health or load events. To view these events in Visual Studio's Diagnostic Event Viewer add "Microsoft-ServiceFabric:4:0x4000000000000008" to the list of ETW providers.

To collect the events, modify the resource manager template to include

```json
  "EtwManifestProviderConfiguration": [
    {
      "provider": "cbd93bc2-71e5-4566-b3a7-595d8eeca6e8",
      "scheduledTransferLogLevelFilter": "Information",
      "scheduledTransferKeywordFilter": "4611686018427387912",
      "scheduledTransferPeriod": "PT5M",
      "DefaultEvents": {
        "eventDestination": "ServiceFabricSystemEventTable"
      }
    }
```

## Collect from new EventSource channels

To update Diagnostics to collect logs from new EventSource channels that represent a new application that you're about to deploy, perform the same steps as previously described for the setup of Diagnostics for an existing cluster.

Update the `EtwEventSourceProviderConfiguration` section in the template.json file to add entries for the new EventSource channels before you apply the configuration update by using the `New-AzureRmResourceGroupDeployment` PowerShell command. The name of the event source is defined as part of your code in the Visual Studio-generated ServiceEventSource.cs file.

For example, if your event source is named My-Eventsource, add the following code to place the events from My-Eventsource into a table named MyDestinationTableName.

```json
        {
            "provider": "My-Eventsource",
            "scheduledTransferPeriod": "PT5M",
            "DefaultEvents": {
            "eventDestination": "MyDestinationTableName"
            }
        }
```

To collect performance counters or event logs, modify the Resource Manager template by using the examples provided in [Create a Windows virtual machine with monitoring and diagnostics by using an Azure Resource Manager template](../virtual-machines/windows/extensions-diagnostics-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). Then, republish the Resource Manager template.

## Collect Performance Counters

To collect performance metrics from your cluster, add the performance counters to your "WadCfg > DiagnosticMonitorConfiguration" in the Resource Manager template for your cluster. See [Service Fabric Performance Counters](service-fabric-diagnostics-event-generation-perf.md) for performance counters that we recommend collecting.

For example, here we set one performance counter, sampled every 15 seconds (this can be changed and follows the format of "PT\<time>\<unit>", for example, PT3M would sample at three minute intervals), and transferred to the appropriate storage table every one minute.

    ```json
    "PerformanceCounters": {
        "scheduledTransferPeriod": "PT1M",
        "PerformanceCounterConfiguration": [
            {
                "counterSpecifier": "\\Processor(_Total)\\% Processor Time",
                "sampleRate": "PT15S",
                "unit": "Percent",
                "annotation": [
                ],
                "sinks": ""
            }
        ]
    }
    ```
If you are using an Application Insights sink, as described in the section below, and want these metrics to show up in Application Insights, then make sure to add the sink name in the "sinks" section as shown above. Additionally, consider creating a separate table to send your Performance Counters to, so they don't crowd out the data coming from the other logging channels you have enabled.


## Send logs to Application Insights

Sending monitoring and diagnostics data to Application Insights (AI) can be done as part of the WAD configuration. If you decide to use AI for event analysis and visualization, read [Event Analysis and Visualization with Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md) to set up an AI Sink as part of your "WadCfg".

## Next steps

Once you have correctly configured Azure diagnostics, you will see data in your Storage tables from the ETW and EventSource logs. If you choose to use OMS, Kibana, or any other data analytics and visualization platform that is not directly configured in the Resource Manager template, make sure to set up the platform of your choice to read in the data from these storage tables. Doing this for OMS is relatively trivial, and is explained in [Event and log analysis through OMS](service-fabric-diagnostics-event-analysis-oms.md). Application Insights is a bit of a special case in this sense, since it can be configured as part of the Diagnostics extension configuration, so refer to the [appropriate article](service-fabric-diagnostics-event-analysis-appinsights.md) if you choose to use AI.

>[!NOTE]
>There is currently no way to filter or groom the events that are sent to the table. If you don't implement a process to remove events from the table, the table will continue to grow. Currently, there is an example of a data grooming service running in the [Watchdog sample](https://github.com/Azure-Samples/service-fabric-watchdog-service), and it is recommended that you write one for yourself as well, unless there is a good reason for you to store logs beyond a 30 or 90 day timeframe.

* [Learn how to collect performance counters or logs by using the Diagnostics extension](../virtual-machines/windows/extensions-diagnostics-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
* [Event Analysis and Visualization with Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md)
* [Event Analysis and Visualization with OMS](service-fabric-diagnostics-event-analysis-oms.md)