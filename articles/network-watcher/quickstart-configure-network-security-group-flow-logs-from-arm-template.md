---
title: 'Quickstart: Configure NSG Flow Logs by using Azure Resource Manager template'
description: Learn how to enable NSG Flow Logs programmatically using an Azure Resource Manager template and Azure PowerShell.
services: network-watcher
author: damendo
Customer intent: I need to enable the NSG Flow Logs using Azure Resource Manager Template

ms.service: network-watcher
ms.topic: quickstart
ms.date: 07/22/2020
ms.author: damendo
ms.custom: subject-armqs

---

# Quickstart: Configure NSG Flow Logs from ARM template

In this quickstart, you enable [NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-overview) programmatically using an [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/management/overview) template (ARM template) and Azure PowerShell. 

We start by providing an overview of the properties of the NSG Flow Log object, followed by a few sample template. Then we the deploy template using a local PowerShell instance.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## NSG Flow Logs object

The NSG Flow Logs object with all parameters is shown below.
For a complete overview of the properties, you may read the [NSG Flow Logs template reference](https://docs.microsoft.com/azure/templates/microsoft.network/networkwatchers/flowlogs).

```json
{
  "name": "string",
  "type": "Microsoft.Network/networkWatchers/flowLogs",
  "location": "string",
  "apiVersion": "2019-09-01",
  "properties": {
    "targetResourceId": "string",
    "storageId": "string",
    "enabled": "boolean",
    "flowAnalyticsConfiguration": {
      "networkWatcherFlowAnalyticsConfiguration": {
         "enabled": "boolean",
         "workspaceResourceId": "string",
          "trafficAnalyticsInterval": "integer"
        },
        "retentionPolicy": {
           "days": "integer",
           "enabled": "boolean"
         },
        "format": {
           "type": "string",
           "version": "integer"
         }
      }
    }
  }
```
To create a Microsoft.Network/networkWatchers/flowLogs resource, add the above JSON to the resources section of your template.


## Creating your template

If you are using Azure Resource Manager templates for the first time, you can learn more about them using the links below.

* [Deploy resources with Resource Manager templates and Azure PowerShell](https://docs.microsoft.com/azure/azure-resource-manager/templates/deploy-powershell#deploy-local-template)
* [Tutorial: Create and deploy your first Azure Resource Manager template](https://docs.microsoft.com/azure/azure-resource-manager/templates/template-tutorial-create-first-template?tabs=azure-powershell)

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-networkwatcher-flowlogs-create).

Below example of complete template is the simplest version with minimum parameters passed to set up NSG Flow Logs. For more examples go to this [link](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-azure-resource-manager).

**Example**: The below template enables NSG Flow Logs on a target NSG and stores them in a given storage account.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "apiProfile": "2019-09-01",
  "resources": [
 {
    "name": "NetworkWatcher_centraluseuap/Microsoft.NetworkDalanDemoPerimeterNSG",
    "type": "Microsoft.Network/networkWatchers/FlowLogs/",
    "location": "centraluseuap",
    "apiVersion": "2019-09-01",
    "properties": {
      "targetResourceId": "/subscriptions/56abfbd6-ec72-4ce9-831f-bc2b6f2c5505/resourceGroups/DalanDemo/providers/Microsoft.Network/networkSecurityGroups/PerimeterNSG",
      "storageId": "/subscriptions/56abfbd6-ec72-4ce9-831f-bc2b6f2c5505/resourceGroups/MyCanaryFlowLog/providers/Microsoft.Storage/storageAccounts/storagev2ira",
      "enabled": true,
      "flowAnalyticsConfiguration": {},
      "retentionPolicy": {},
      "format": {}
    }

  }
  ]
}
```

> [!NOTE]
> * The name of resource has the format "Parent Resource_Child resource". Here, the parent resource is the regional Network Watcher instance (Format: NetworkWatcher_RegionName. Example: NetworkWatcher_centraluseuap)
> * targetResourceId is the resource ID of the target NSG
> * storageId is the resource ID of the destination storage account


## Deploying your Azure Resource Manager template

This tutorial assumes you have an existing Resource group and an NSG you can enable Flow logging on.
You can save any of the above example templates locally as `azuredeploy.json`. Update the property values so that they point to valid resources in your subscription.

To deploy the template, run the following command in PowerShell.
```azurepowershell-interactive
$context = Get-AzSubscription -SubscriptionId 56acfbd6-vc72-43e9-831f-bcdb6f2c5505
Set-AzContext $context
New-AzResourceGroupDeployment -Name EnableFlowLog -ResourceGroupName NetworkWatcherRG `
    -TemplateFile "C:\MyTemplates\azuredeploy.json"
```

> [!NOTE]
> The above commands are deploying a resource to the NetworkWatcherRG resource group and not the resource group containing the NSG


## Validate the deployment

There are a couple of ways to check if your deployment has Succeeded. Your PowerShell console should show "ProvisioningState" as "Succeeded". Additionally, you can visit the [NSG Flow Logs portal page](https://ms.portal.azure.com/#blade/Microsoft_Azure_Network/NetworkWatcherMenuBlade/flowLogs) to confirm your changes. If there were issues with the deployment, take a look at [Troubleshoot common Azure deployment errors with Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/templates/common-deployment-errors).

## Deleting your resource
Azure enables resource deletion through the "Complete" deployment mode. To delete a Flow Logs resource, specify a deployment in Complete mode without including the resource you wish to delete. Read more about the [Complete deployment mode](https://docs.microsoft.com/azure/azure-resource-manager/templates/deployment-modes#complete-mode)

Alternatively, you can disable a NSG flow log from Azure portal as per below steps:
1. Login to Azure portal
2. In the top, left corner of portal, select **All services**. In the **Filter** box, type *Network Watcher*. When **Network Watcher** appears in the search results, select it.
3. Under **LOGS**, select **NSG flow logs**
4. From the list of NSGs, select the NSG for which you want to disable flow logs
5. Under **Flow logs settings**, set flows log status as **Off**
6. Scroll down and select **save**

## Next steps

In this quickstart, you enabled NSG Flow logs. Now, you must learn how to visualize your NSG Flow data using: 

* [Microsoft Power BI](network-watcher-visualize-nsg-flow-logs-power-bi.md)
* [Open source tools](network-watcher-visualize-nsg-flow-logs-open-source-tools.md)
* [Azure Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)
