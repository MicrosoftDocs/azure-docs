---
title: 'Quickstart: Configure network security group flow logs by using an Azure Resource Manager template (ARM template)'
description: Learn how to enable network security group (NSG) flow logs programmatically by using an Azure Resource Manager template (ARM template) and Azure PowerShell.
services: network-watcher
author: damendo
ms.author: damendo
ms.date: 01/07/2021
ms.topic: quickstart
ms.service: network-watcher
ms.custom:
  - subject-armqs
  - mode-arm
# Customer intent: I need to enable the network security group flow logs by using an Azure Resource Manager template.
---

# Quickstart: Configure network security group flow logs by using an ARM template

In this quickstart, you learn how to enable [network security group (NSG) flow logs](network-watcher-nsg-flow-logging-overview.md) by using an [Azure Resource Manager](../azure-resource-manager/management/overview.md) template (ARM template) and Azure PowerShell.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

We start with an overview of the properties of the NSG flow log object. We provide sample templates. Then, we use a local Azure PowerShell instance to deploy the template.

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-networkwatcher-flowLogs-create%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template that we use in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-networkwatcher-flowlogs-create).

:::code language="json" source="~/quickstart-templates/101-networkwatcher-flowlogs-create/azuredeploy.json":::

These resources are defined in the template:

- [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts)
- [Microsoft.Resources/deployments](/azure/templates/microsoft.resources/deployments)

## NSG flow logs object

The following code shows an NSG flow logs object and its parameters. To create a `Microsoft.Network/networkWatchers/flowLogs` resource, add this code to the resources section of your template:

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

For a complete overview of the NSG flow logs object properties, see [Microsoft.Network networkWatchers/flowLogs](/azure/templates/microsoft.network/networkwatchers/flowlogs).

## Create your template

If you're using ARM templates for the first time, see the following articles to learn more about ARM templates:

- [Deploy resources with ARM templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md#deploy-local-template-or-bicep-file)
- [Tutorial: Create and deploy your first ARM template](../azure-resource-manager/templates/template-tutorial-create-first-template.md)

The following example is a complete template. It's also the simplest version of the template. The example contains the minimum parameters that are passed to set up NSG flow logs. For more examples, see the overview article [Configure NSG flow logs from an Azure Resource Manager template](network-watcher-nsg-flow-logging-azure-resource-manager.md).

### Example

The following template enables flow logs for an NSG, and then stores the logs in a specific storage account:

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
> - The resource name uses the format _ParentResource_ChildResource_. In our example, the parent resource is the regional Azure Network Watcher instance:
>    - **Format**: NetworkWatcher_RegionName
>    - **Example**: NetworkWatcher_centraluseuap
> - `targetResourceId` is the resource ID of the target NSG.
> - `storageId` is the resource ID of the destination storage account.

## Deploy the template

This tutorial assumes that you have an existing resource group and an NSG that you can enable flow logging on.

You can save any of the example templates that are shown in this article locally as *azuredeploy.json*. Update the property values so they point to valid resources in your subscription.

To deploy the template, run the following command in Azure PowerShell:

```azurepowershell-interactive
$context = Get-AzSubscription -SubscriptionId <subscription Id>
Set-AzContext $context
New-AzResourceGroupDeployment -Name EnableFlowLog -ResourceGroupName NetworkWatcherRG `
    -TemplateFile "C:\MyTemplates\azuredeploy.json"
```

> [!NOTE]
> These commands deploy a resource to the example NetworkWatcherRG resource group, and not to the resource group that contains the NSG.

## Validate the deployment

You have two options to see whether your deployment succeeded:

- Your PowerShell console shows `ProvisioningState` as `Succeeded`.
- Go to the [NSG flow logs portal page](https://ms.portal.azure.com/#blade/Microsoft_Azure_Network/NetworkWatcherMenuBlade/flowLogs) to confirm your changes.

If there were issues with the deployment, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](../azure-resource-manager/templates/common-deployment-errors.md).

## Clean up resources

You can delete Azure resources by using complete deployment mode. To delete a flow logs resource, specify a deployment in complete mode without including the resource you want to delete. Read more about [complete deployment mode](../azure-resource-manager/templates/deployment-modes.md#complete-mode).

You also can disable an NSG flow log in the Azure portal:

1. Sign in to the Azure portal.
1. Select **All services**. In the **Filter** box, enter **network watcher**. In the search results, select **Network Watcher**.
1. Under **Logs**, select **NSG flow logs**.
1. In the list of NSGs, select the NSG for which you want to disable flow logs.
1. Under **Flow logs settings**, select **Off**.
1. Select **Save**.

## Next steps

In this quickstart, you learned how to enable NSG flow logs by using an ARM template. Next, learn how to visualize your NSG flow data by using one of these options:

- [Microsoft Power BI](network-watcher-visualize-nsg-flow-logs-power-bi.md)
- [Open-source tools](network-watcher-visualize-nsg-flow-logs-open-source-tools.md)
- [Azure Traffic Analytics](traffic-analytics.md)
