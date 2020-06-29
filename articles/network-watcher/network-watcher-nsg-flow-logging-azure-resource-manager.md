---
title: Network Watcher - Create NSG flow logs using an Azure Resource Manager template
description: Use an Azure Resource Manager template and PowerShell to easily set up NSG Flow Logs.
services: network-watcher
documentationcenter: na
author: damendo
manager: twooley
editor:
tags: azure-resource-manager

ms.service: network-watcher
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 01/26/2020
ms.author: damendo

---

# Configure NSG Flow Logs from an Azure Resource Manager template

> [!div class="op_single_selector"]
> - [Azure portal](network-watcher-nsg-flow-logging-portal.md)
> - [PowerShell](network-watcher-nsg-flow-logging-powershell.md)
> - [Azure CLI](network-watcher-nsg-flow-logging-cli.md)
> - [REST API](network-watcher-nsg-flow-logging-rest.md)
> - [Azure Resource Manager](network-watcher-nsg-flow-logging-azure-resource-manager.md)


[Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/) is Azure’s native and powerful way to manage your [infrastructure as code](https://docs.microsoft.com/azure/devops/learn/what-is-infrastructure-as-code).

This article shows how you to enable [NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-overview) programmatically using an Azure Resource Manager template and Azure PowerShell. We start by providing an overview of the properties of the NSG Flow Log object, followed by a few sample templates. Then we the deploy template using a local PowerShell instance.


## NSG Flow Logs object

The NSG Flow Logs object with all parameters is shown below.
For a complete overview of the properties, you may read the [NSG Flow Logs template reference](https://docs.microsoft.com/azure/templates/microsoft.network/2019-11-01/networkwatchers/flowlogs#RetentionPolicyParameters).

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


Below are two examples of complete templates to set up NSG Flow Logs.

**Example 1**:  The simplest version of the above with minimum parameters passed. The below template enables NSG Flow Logs on a target NSG and stores them in a given storage account.

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

**Example 2**: The following templates enabling NSG Flow Logs (version 2) with a retention for 5 days. Enabling Traffic Analytics with a processing interval of 10 minutes.

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
      "flowAnalyticsConfiguration": {
		"networkWatcherFlowAnalyticsConfiguration": {
			"enabled": true,
			"workspaceResourceId": "/subscriptions/56abfbd6-ec72-4ce9-831f-bc2b6f2c5505/resourceGroups/defaultresourcegroup-wcus/providers/Microsoft.OperationalInsights/workspaces/1c4f42e5-3a02-4146-ac9b-3051d8501db0",
			"trafficAnalyticsInterval": 10
				}
	  },
      "retentionPolicy": {
        "days": 5,
        "enabled": true
      },
      "format": {
        "type": "JSON",
        "version": 2			
      }
    }

  }
  ]
}
```

## Deploying your Azure Resource Manager template

This tutorial assumes you have an existing Resource group and an NSG you can enable Flow logging on.
You can save any of the above example templates locally as `azuredeploy.json`. Update the property values so that they point to valid resources in your subscription.

To deploy the template, run the following command in PowerShell.
```azurepowershell
$context = Get-AzSubscription -SubscriptionId 56acfbd6-vc72-43e9-831f-bcdb6f2c5505
Set-AzContext $context
New-AzResourceGroupDeployment -Name EnableFlowLog -ResourceGroupName NetworkWatcherRG `
    -TemplateFile "C:\MyTemplates\azuredeploy.json"
```

> [!NOTE]
> The above commands are deploying a resource to the NetworkWatcherRG resource group and not the resource group containing the NSG


## Verifying your deployment

There are a couple of ways to check if your deployment has Succeeded. Your PowerShell console should show "ProvisioningState" as "Succeeded". Additionally, you can visit the [NSG Flow Logs portal page](https://ms.portal.azure.com/#blade/Microsoft_Azure_Network/NetworkWatcherMenuBlade/flowLogs) to confirm your changes. If there were issues with the deployment, take a look at [Troubleshoot common Azure deployment errors with Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/templates/common-deployment-errors).

## Deleting your resource
Azure enables resource deletion through the "Complete" deployment mode. To delete a Flow Logs resource, specify a deployment in Complete mode without including the resource you wish to delete. Read more about the [Complete deployment mode](https://docs.microsoft.com/azure/azure-resource-manager/templates/deployment-modes#complete-mode)

## Next steps

Learn how to visualize your NSG Flow data using:
* [Microsoft Power BI](network-watcher-visualize-nsg-flow-logs-power-bi.md)
* [Open source tools](network-watcher-visualize-nsg-flow-logs-open-source-tools.md)
* [Azure Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)
