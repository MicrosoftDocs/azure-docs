---
title: 'Quickstart: Configure NSG flow logs using an ARM template'
titleSuffix: Azure Network Watcher
description: Learn how to enable network security group (NSG) flow logs programmatically using an Azure Resource Manager (ARM) template and Azure PowerShell.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: quickstart
ms.date: 12/13/2023
ms.custom: devx-track-azurepowershell, subject-armqs, mode-arm, devx-track-arm-template

#CustomerIntent: As an Azure administrator, I want to learn how to enable NSG flow logs using an ARM template so that I can log traffic flowing through a network security group.
---

# Quickstart: Configure Azure Network Watcher NSG flow logs using an Azure Resource Manager (ARM) template

In this quickstart, you learn how to enable NSG flow logs using an Azure Resource Manager (ARM) template and Azure PowerShell. For more information, see [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md) and [NSG flow logs overview](nsg-flow-logs-overview.md).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

We start with an overview of the properties of the NSG flow log object. We provide sample templates. Then, we use a local Azure PowerShell instance to deploy the template.

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fnetworkwatcher-flowLogs-create%2Fazuredeploy.json":::

## Prerequisites

An Azure account with an active subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template that we use in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/networkwatcher-flowlogs-create/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/networkwatcher-flowLogs-create/azuredeploy.json" range="1-117" highlight="94-115":::

The following resources are defined in the template:

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
> These commands deploy a resource to ***NetworkWatcherRG*** resource group, and not to the resource group that contains the network security group.

## Validate the deployment

You have two options to see whether your deployment succeeded:

- Your PowerShell console shows `ProvisioningState` as `Succeeded`.
- Go to the [NSG flow logs portal page](https://portal.azure.com/#blade/Microsoft_Azure_Network/NetworkWatcherMenuBlade/flowLogs) to confirm your changes.

If there were issues with the deployment, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](../azure-resource-manager/templates/common-deployment-errors.md).

## Clean up resources

You can delete Azure resources by using complete deployment mode. To delete a flow log resource, specify a deployment in complete mode without including the resource you want to delete. Read more about [complete deployment mode](../azure-resource-manager/templates/deployment-modes.md#complete-mode).

You can also disable or delete a flow log in the Azure portal:

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** in the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the checkbox of the flow log that you want to delete.

1. Select **Disable** or **Delete**. For more information, see [Disable a flow log](nsg-flow-logs-portal.md#disable-a-flow-log) or [Delete a flow log](nsg-flow-logs-portal.md#delete-a-flow-log).

## Related content

In this quickstart, you learned how to enable NSG flow logs using an ARM template. Next, learn how to visualize your NSG flow data using traffic analytics:

- [Traffic analytics overview](traffic-analytics.md)
- [Usage scenarios of traffic analytics](usage-scenarios-traffic-analytics.md)
- [Manage traffic analytics using Azure Policy](traffic-analytics-policy-portal.md)
