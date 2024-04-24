---
title: Manage NSG flow logs - ARM template
titleSuffix: Azure Network Watcher
description: Learn how to create or delete Azure Network Watcher NSG flow logs using an Azure Resource Manager template (ARM template).
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 06/01/2023
ms.custom: devx-track-arm-template, fasttrack-edit
---

# Manage NSG flow logs using an Azure Resource Manager template

Network security group flow logging is a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through a network security group. For more information about network security group flow logging, see [NSG flow logs overview](nsg-flow-logs-overview.md).

In this article, you learn how to manage NSG flow logs programmatically using an Azure Resource Manager template and Azure PowerShell. You can learn how to manage an NSG flow log using the [Azure portal](nsg-flow-logs-portal.md), [PowerShell](nsg-flow-logs-powershell.md), [Azure CLI](nsg-flow-logs-cli.md), or [REST API](nsg-flow-logs-rest.md).

An [Azure Resource Manager template](../azure-resource-manager/templates/overview.md) is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project using declarative syntax.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## NSG flow logs object

The NSG flow logs object with all parameters is shown in the following example. For a complete overview of the object properties, see [NSG flow logs template reference](/azure/templates/microsoft.network/networkwatchers/flowlogs).

```json
{
  "name": "string",
  "type": "Microsoft.Network/networkWatchers/flowLogs",
  "location": "string",
  "apiVersion": "2022-07-01",
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

## Create your template

To learn more about using Azure Resource Manager templates, see:

- [Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md)
- [Tutorial: Create and deploy your first Azure Resource Manager template](../azure-resource-manager/templates/template-tutorial-create-first-template.md?tabs=azure-powershell)

The following examples present complete templates to enable NSG flow logs.

#### Example 1

Example 1 uses the simplest version of the ARM template with minimum parameters passed. The following template enables NSG flow logs on a target network security group and stores them in a given storage account.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "apiProfile": "2019-09-01",
  "resources": [
 {
    "name": "myNSG-myresourcegroup-flowlog",
    "type": "Microsoft.Network/networkWatchers/FlowLogs/",
    "location": "eastus",
    "apiVersion": "2022-11-01",
    "properties": {
      "targetResourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNSG",
      "storageId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/myStorageAccount",
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
> * `targetResourceId` is the resource ID of the target network security group.
> * `storageId` is the resource ID of the destination storage account.

#### Example 2
Example 2 uses the following template to enable NSG flow logs (version 2) with retention of 5 days and traffic analytics with a processing interval of 10 minutes.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "apiProfile": "2019-09-01",
  "resources": [
    {
      "name": "myNSG-myresourcegroup-flowlog",
      "type": "Microsoft.Network/networkWatchers/FlowLogs/",
      "location": "eastus",
      "apiVersion": "2022-11-01",
      "properties": {
        "targetResourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNSG",
        "storageId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/myStorageAccount",
        "enabled": true,
        "flowAnalyticsConfiguration": {
          "networkWatcherFlowAnalyticsConfiguration": {
            "enabled": true,
            "workspaceResourceId": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/defaultresourcegroup-eus/providers/Microsoft.OperationalInsights/workspaces/DefaultWorkspace-abcdef01-2345-6789-0abc-def012345678-EUS",
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

> [!NOTE]
> * `targetResourceId` is the resource ID of the target network security group.
> * `storageId` is the resource ID of the destination storage account.
> * `workspaceResourceId` is is the resource ID of the traffic analytics workspace.

## Deploy your Azure Resource Manager template

This tutorial assumes you have an existing Resource group and a network security group you can enable flow logging on.
You can save any of the above example templates locally as `azuredeploy.json`. Update the property values so that they point to valid resources in your subscription.

To deploy the template, run the following command in PowerShell.
```azurepowershell
$context = Get-AzSubscription -SubscriptionId <SubscriptionId>
Set-AzContext $context
New-AzResourceGroupDeployment -Name EnableFlowLog -ResourceGroupName NetworkWatcherRG `
    -TemplateFile "C:\MyTemplates\azuredeploy.json"
```

> [!NOTE]
> The previous commands deploys a resource to the **NetworkWatcherRG** resource group and not the resource group containing the network security group.

## Verify your deployment

There are a couple of ways to check if your deployment has succeeded. Your PowerShell console should show "ProvisioningState" as "Succeeded". Additionally, you can visit the [Flow logs portal page](https://portal.azure.com/#blade/Microsoft_Azure_Network/NetworkWatcherMenuBlade/flowLogs) to confirm your changes. If there were issues with the deployment, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](../azure-resource-manager/templates/common-deployment-errors.md).

## Delete your resource

Azure enables resource deletion through the *Complete* deployment mode. To delete a flow logs resource, specify a deployment in Complete mode without including the resource you wish to delete. For more information, see [Complete deployment mode](../azure-resource-manager/templates/deployment-modes.md#complete-mode).

## Next steps

- To learn how to use Azure built-in policies to audit or deploy NSG flow logs, see [Manage NSG flow logs using Azure Policy](nsg-flow-logs-policy-portal.md).
- To learn about traffic analytics, see [Traffic analytics](traffic-analytics.md).