---
title: 'Quickstart: Configure Network Watcher network security group flow logs using a Bicep file'
description: Learn how to enable network security group (NSG) flow logs programmatically using Bicep and Azure PowerShell.
services: network-watcher
author: halkazwini
ms.author: halkazwini
ms.date: 08/26/2022
ms.topic: quickstart
ms.service: network-watcher
ms.custom: devx-track-azurepowershell, subject-bicepqs, mode-arm, devx-track-bicep
#Customer intent: I need to enable the network security group flow logs by using a Bicep file.
---

# Quickstart: Configure network security group flow logs using a Bicep file

In this quickstart, you learn how to enable [network security group (NSG) flow logs](network-watcher-nsg-flow-logging-overview.md) by using a Bicep file

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

We start with an overview of the properties of the NSG flow log object. We provide a sample Bicep file. Then, we deploy the Bicep file.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file that we use in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/networkwatcher-flowlogs-create/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/networkwatcher-flowLogs-create/main.bicep" range="1-67" highlight="51-67":::

These resources are defined in the Bicep file:

- [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts?pivots=deployment-language-bicep)
- [Microsoft.Network networkWatchers](/azure/templates/microsoft.network/networkwatchers?tabs=bicep&pivots=deployment-language-bicep)
- [Microsoft.Network networkWatchers/flowLogs](/azure/templates/microsoft.network/networkwatchers/flowlogs?tabs=bicep&pivots=deployment-language-bicep)

The highlighted code in the preceding sample shows an NSG flow resource definition.

## Deploy the Bicep file

This tutorial assumes that you have a network security group that you can enable flow logging on.

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep
    ```

    ---

    You will be prompted to enter the resource ID of the existing network security group. The syntax of the network security group resource ID is:

    ```json
    "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/networkSecurityGroups/<network-security-group-name>"
    ```

When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

You have two options to see whether your deployment succeeded:

- Your console shows `ProvisioningState` as `Succeeded`.
- Go to the [NSG flow logs portal page](https://portal.azure.com/#blade/Microsoft_Azure_Network/NetworkWatcherMenuBlade/flowLogs) to confirm your changes.

If there were issues with the deployment, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](../azure-resource-manager/troubleshooting/common-deployment-errors.md).

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

In this quickstart, you learned how to enable NSG flow logs by using a Bicep file. Next, learn how to visualize your NSG flow data by using one of these options:

- [Microsoft Power BI](network-watcher-visualize-nsg-flow-logs-power-bi.md)
- [Open-source tools](network-watcher-visualize-nsg-flow-logs-open-source-tools.md)
- [Azure Traffic Analytics](traffic-analytics.md)
