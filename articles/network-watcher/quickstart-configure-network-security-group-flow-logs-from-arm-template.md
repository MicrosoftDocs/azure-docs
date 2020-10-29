---
title: 'Quickstart: Configure NSG flow logs by using Azure Resource Manager template'
description: Learn how to enable NSG flow logs programmatically using an Azure Resource Manager template (ARM template) and Azure PowerShell.
services: network-watcher
author: damendo
Customer intent: I need to enable the NSG flow logs using Azure Resource Manager Template

ms.service: network-watcher
ms.topic: quickstart
ms.date: 07/22/2020
ms.author: damendo
ms.custom: subject-armqs

---

# Quickstart: Configure NSG flow logs using an ARM template

In this quickstart, you enable [NSG flow logs](network-watcher-nsg-flow-logging-overview.md) using an [Azure Resource Manager](../azure-resource-manager/management/overview.md) template (ARM template) and Azure PowerShell.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

We start by providing an overview of the properties of the NSG Flow Log object, followed by a few sample template. Then we the deploy template using a local PowerShell instance.

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-networkwatcher-flowLogs-create%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-networkwatcher-flowlogs-create).

:::code language="json" source="~/quickstart-templates/101-networkwatcher-flowlogs-create/azuredeploy.json":::

Multiple resources are defined in the template:

- [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts)
- [Microsoft.Resources/deployments](/azure/templates/microsoft.resources/deployments)

## NSG flow logs object

The NSG flow logs object with all parameters is shown below. For a complete overview of the properties, see [Microsoft.Network networkWatchers/flowLogs](/azure/templates/microsoft.network/networkwatchers/flowlogs).

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

To create a `Microsoft.Network/networkWatchers/flowLogs` resource, add the above JSON to the resources section of your template.

## Creating your template

If you are using ARM templates for the first time, you can learn more about them using the links below.

- [Deploy resources with ARM templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md#deploy-local-template)
- [Tutorial: Create and deploy your first ARM template](../azure-resource-manager/templates/template-tutorial-create-first-template.md)

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-networkwatcher-flowlogs-create).

Below example of complete template is the simplest version with minimum parameters passed to set up NSG flow logs. For more examples go to this [How-to guide](network-watcher-nsg-flow-logging-azure-resource-manager.md).

**Example**: The below template enables NSG flow logs on a target NSG and stores them in a given storage account.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "apiProfile": "2019-09-01",
  "resources": [
    {
      "name": "NetworkWatcher_centraluseuap/Microsoft.NetworkDalanDemoPerimeterNSG",
      "type": "Microsoft.Network/networkWatchers/FlowLogs/",
      "location": "centraluseuap",
      "apiVersion": "2019-09-01",
      "properties": {
        "targetResourceId": "/subscriptions/<subscription Id>/resourceGroups/DalanDemo/providers/Microsoft.Network/networkSecurityGroups/PerimeterNSG",
        "storageId": "/subscriptions/<subscription Id>/resourceGroups/MyCanaryFlowLog/providers/Microsoft.Storage/storageAccounts/storagev2ira",
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
> - The name of resource has the format _Parent Resource_Child resource_. Here, the parent resource is the regional Network Watcher instance (Format: NetworkWatcher_RegionName. Example: NetworkWatcher_centraluseuap)
> - `targetResourceId` is the resource ID of the target NSG.
> - `storageId` is the resource ID of the destination storage account.

## Deploy the template

This tutorial assumes you have an existing Resource group and an NSG you can enable Flow logging on.
You can save any of the above example templates locally as `azuredeploy.json`. Update the property values so that they point to valid resources in your subscription.

To deploy the template, run the following command in PowerShell.

```azurepowershell-interactive
$context = Get-AzSubscription -SubscriptionId <subscription Id>
Set-AzContext $context
New-AzResourceGroupDeployment -Name EnableFlowLog -ResourceGroupName NetworkWatcherRG `
    -TemplateFile "C:\MyTemplates\azuredeploy.json"
```

> [!NOTE]
> The above commands are deploying a resource to the NetworkWatcherRG resource group and not the resource group containing the NSG

## Validate the deployment

There are a couple of ways to check if your deployment has Succeeded. Your PowerShell console should show `ProvisioningState` as `Succeeded`. Additionally, you can visit the [NSG flow logs portal page](https://ms.portal.azure.com/#blade/Microsoft_Azure_Network/NetworkWatcherMenuBlade/flowLogs) to confirm your changes. If there were issues with the deployment, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](../azure-resource-manager/templates/common-deployment-errors.md).

## Clean up resources

Azure enables resource deletion through the `Complete` deployment mode. To delete a flow logs resource, specify a deployment in `Complete` mode without including the resource you wish to delete. Read more about the [Complete deployment mode](../azure-resource-manager/templates/deployment-modes.md#complete-mode).

Alternatively, you can disable a NSG flow log from Azure portal as per below steps:

1. Login to Azure portal
1. In the top, left corner of portal, select **All services**. In the **Filter** box, type _Network Watcher_. When **Network Watcher** appears in the search results, select it.
1. Under **LOGS**, select **NSG flow logs**.
1. From the list of NSGs, select the NSG for which you want to disable flow logs.
1. Under **Flow logs settings**, set flows log status as **Off**.
1. Scroll down and select **Save**.

## Next steps

In this quickstart, you enabled NSG flow logs. Now, you must learn how to visualize your NSG flow data using:

- [Microsoft Power BI](network-watcher-visualize-nsg-flow-logs-power-bi.md)
- [Open source tools](network-watcher-visualize-nsg-flow-logs-open-source-tools.md)
- [Azure Traffic Analytics](traffic-analytics.md)
