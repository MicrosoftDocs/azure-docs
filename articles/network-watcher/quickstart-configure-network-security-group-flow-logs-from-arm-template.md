---
title: 'Quickstart: Configure network security group flow logs using an ARM template'
description: Learn how to enable network security group (NSG) flow logs programmatically using an Azure Resource Manager (ARM) template and Azure PowerShell.
services: network-watcher
author: halkazwini
ms.author: halkazwini
ms.date: 09/01/2022
ms.topic: quickstart
ms.service: network-watcher
ms.custom: devx-track-azurepowershell, subject-armqs, mode-arm, devx-track-arm-template
#Customer intent: I need to enable the network security group flow logs by using an Azure Resource Manager template.
---

# Quickstart: Configure network security group flow logs using an Azure Resource Manager (ARM) template

In this quickstart, you learn how to enable [network security group (NSG) flow logs](network-watcher-nsg-flow-logging-overview.md) using an [Azure Resource Manager](../azure-resource-manager/management/overview.md) (ARM) template and Azure PowerShell.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

We start with an overview of the properties of the NSG flow log object. We provide sample templates. Then, we use a local Azure PowerShell instance to deploy the template.

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fnetworkwatcher-flowLogs-create%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template that we use in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/networkwatcher-flowlogs-create/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/networkwatcher-flowLogs-create/azuredeploy.json" range="1-117" highlight="94-115":::

These resources are defined in the template:

- [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts?pivots=deployment-language-arm-template)
- [Microsoft.Network networkWatchers](/azure/templates/microsoft.network/networkwatchers?tabs=bicep&pivots=deployment-language-arm-template)
- [Microsoft.Network networkWatchers/flowLogs](/azure/templates/microsoft.network/networkwatchers/flowlogs?tabs=bicep&pivots=deployment-language-arm-template)

The highlighted code in the preceding sample shows an NSG flow logs resource definition.

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
- Go to the [NSG flow logs portal page](https://portal.azure.com/#blade/Microsoft_Azure_Network/NetworkWatcherMenuBlade/flowLogs) to confirm your changes.

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
