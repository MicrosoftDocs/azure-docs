---
title: 'Quickstart: Configure NSG flow logs using a Bicep file'
titleSuffix: Azure Network Watcher
description: In this quickstart, you learn how to enable NSG flow logs programmatically using a Bicep file to log the traffic flowing through a network security group.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: quickstart
ms.date: 03/12/2025
ms.custom:
  - devx-track-bicep
  - subject-bicepqs
  - mode-arm
  - build-2025

#CustomerIntent: As an Azure administrator, I need to enable NSG flow logs using a Bicep file so that I can log the traffic flowing through a network security group.
---

# Quickstart: Configure NSG flow logs using a Bicep file

[!INCLUDE [NSG flow logs retirement](../../includes/network-watcher-nsg-flow-logs-retirement.md)]

In this quickstart, you learn how to enable NSG flow logs using a Bicep file. For more information, see [NSG flow logs overview](nsg-flow-logs-overview.md) and [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md) 

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

# [PowerShell](#tab/powershell)

- An Azure account with an active subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- [Azure PowerShell installed locally](/powershell/azure/install-azure-powershell) to run the cmdlets. Use [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet to sign in to Azure.

# [Azure CLI](#tab/cli)

- An Azure account with an active subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- [Azure CLI installed locally](/cli/azure/install-azure-cli) to run the commands. Use [az login](/cli/azure/reference-index#az-login) command to sign in to Azure.

---

## Review the Bicep file

This quickstart uses the [Create NSG flow logs](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/networkwatcher-flowLogs-create/main.bicep) Bicep file from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/networkwatcher-flowlogs-create/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/networkwatcher-flowLogs-create/main.bicep" range="1-67" highlight="51-67":::

The following resources are defined in the Bicep file:

- [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts?pivots=deployment-language-bicep)
- [Microsoft.Network networkWatchers](/azure/templates/microsoft.network/networkwatchers?tabs=bicep&pivots=deployment-language-bicep)
- [Microsoft.Network networkWatchers/flowLogs](/azure/templates/microsoft.network/networkwatchers/flowlogs?tabs=bicep&pivots=deployment-language-bicep)

The highlighted code in the preceding sample shows an NSG flow log resource definition.

## Deploy the Bicep file

This quickstart assumes that you have a network security group that you can enable flow logging on.

# [PowerShell](#tab/powershell)

1. Save the [Bicep file](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/networkwatcher-flowLogs-create/main.bicep) as **main.bicep** to your local computer.

1. Deploy the Bicep file.

    ```azurepowershell
    New-AzResourceGroup -Name 'exampleRG' -Location 'eastus'
    New-AzResourceGroupDeployment -ResourceGroupName 'exampleRG' -TemplateFile ./main.bicep
    ```

    You'll be prompted to enter the resource ID of the existing network security group. The syntax of the network security group resource ID is:

    ```json
    "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/networkSecurityGroups/<network-security-group-name>"
    ```

When the deployment finishes, you should see a message indicating the deployment succeeded.

# [Azure CLI](#tab/cli)

1. Save the [Bicep file](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/networkwatcher-flowLogs-create/main.bicep) as **main.bicep** to your local computer.

1. Deploy the Bicep file.

    ```azurecli
    az group create --name 'exampleRG' --location 'eastus'
    az deployment group create --resource-group 'exampleRG' --template-file main.bicep
    ```

    You'll be prompted to enter the resource ID of the existing network security group. The syntax of the network security group resource ID is:

    ```json
    "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/networkSecurityGroups/<network-security-group-name>"
    ```

When the deployment finishes, you should see a message indicating the deployment succeeded.

---

## Validate the deployment

You have two options to see whether your deployment succeeded:

- Your console shows `ProvisioningState` as `Succeeded`.
- Go to the [NSG flow logs portal page](https://portal.azure.com/#blade/Microsoft_Azure_Network/NetworkWatcherMenuBlade/flowLogs) to confirm your changes.

If there are issues with the deployment, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](../azure-resource-manager/troubleshooting/common-deployment-errors.md).

## Clean up resources

You can delete Azure resources using complete deployment mode. To delete a flow logs resource, specify a deployment in complete mode without including the resource you want to delete. Read more about [complete deployment mode](../azure-resource-manager/templates/deployment-modes.md#complete-mode).

You also can disable an NSG flow log in the Azure portal:

1. Sign in to the Azure portal.

1. In the search box at the top of the portal, enter ***network watcher***. Select **Network Watcher** from the search results.

1. Under **Logs**, select **Flow logs**.

1. In the list of flow logs, select the flow log that you want to disable.

1. Select **Disable**.

## Related content

In this quickstart, you learned how to enable NSG flow logs using a Bicep file. Next, learn how to visualize your NSG flow logs data using traffic analytics:

- [Traffic analytics overview](traffic-analytics.md)
- [Usage scenarios of traffic analytics](usage-scenarios-traffic-analytics.md)
- [Manage traffic analytics using Azure Policy](traffic-analytics-policy-portal.md)
