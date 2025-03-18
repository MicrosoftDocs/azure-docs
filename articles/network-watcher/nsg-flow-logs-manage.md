---
title: Manage NSG flow logs
titleSuffix: Azure Network Watcher
description: Learn how to create, change, enable, disable, or delete Azure Network Watcher network security group (NSG) flow logs.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 03/17/2025

#CustomerIntent: As an Azure administrator, I want to log my virtual network IP traffic using Network Watcher NSG flow logs so that I can analyze it later.
---

# Create, change, enable, disable, or delete NSG flow logs

[!INCLUDE [NSG flow logs retirement](../../includes/network-watcher-nsg-flow-logs-retirement.md)]

Network security group flow logging is a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through a network security group. For more information about network security group flow logging, see [NSG flow logs overview](nsg-flow-logs-overview.md).

In this article, you learn how to create, change, enable, disable, or delete a network security group flow log using the Azure portal, PowerShell, and Azure CLI.

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Insights provider. For more information, see [Register Insights provider](#register-insights-provider).

- A network security group. If you need to create a network security group, see [Create, change, or delete a network security group](../virtual-network/manage-network-security-group.md?tabs=network-security-group-portal&toc=/azure/network-watcher/toc.json).

- An Azure storage account. If you need to create a storage account, see [Create a storage account using the Azure portal](../storage/common/storage-account-create.md?tabs=azure-portal&toc=/azure/network-watcher/toc.json).

# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Insights provider. For more information, see [Register Insights provider](#register-insights-provider).

- A virtual network. If you need to create a virtual network, see [Create a virtual network using PowerShell](../virtual-network/quick-create-powershell.md).

- An Azure storage account. If you need to create a storage account, see [Create a storage account using PowerShell](../storage/common/storage-account-create.md?tabs=azure-powershell&toc=/azure/network-watcher/toc.json).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. This article requires the Azure PowerShell module. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Insights provider. For more information, see [Register Insights provider](#register-insights-provider).

- A virtual network. If you need to create a virtual network, see [Create a virtual network using the Azure CLI](../virtual-network/quick-create-cli.md).

- An Azure storage account. If you need to create a storage account, see [Create a storage account using the Azure CLI](../storage/common/storage-account-create.md?tabs=azure-cli).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

---

## Register Insights provider

# [**Portal**](#tab/portal)

*Microsoft.Insights* provider must be registered to successfully log traffic flowing through a virtual network. If you aren't sure if the *Microsoft.Insights* provider is registered, check its status in the Azure portal by following these steps:

1. In the search box at the top of the portal, enter *subscriptions*. Select **Subscriptions** from the search results.

    :::image type="content" source="./media/subscriptions-portal-search.png" alt-text="Screenshot that shows how to search for Subscriptions in the Azure portal." lightbox="./media/subscriptions-portal-search.png":::

1. Select the Azure subscription that you want to enable the provider for in **Subscriptions**.

1. Under **Settings**, select **Resource providers**.

1. Enter *insight* in the filter box.

1. Confirm the status of the provider displayed is **Registered**. If the status is **NotRegistered**, select the **Microsoft.Insights** provider then select **Register**.

    :::image type="content" source="./media/nsg-flow-logs-portal/register-microsoft-insights.png" alt-text="Screenshot that shows how to register Microsoft Insights provider in the Azure portal." lightbox="./media/nsg-flow-logs-portal/register-microsoft-insights.png":::

# [**PowerShell**](#tab/powershell)

*Microsoft.Insights* provider must be registered to successfully log traffic in a virtual network. If you aren't sure if the *Microsoft.Insights* provider is registered, use [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) to register it.

```azurepowershell-interactive
# Register Microsoft.Insights provider.
Register-AzResourceProvider -ProviderNamespace 'Microsoft.Insights'
```

# [**Azure CLI**](#tab/cli)

*Microsoft.Insights* provider must be registered to successfully log traffic in a virtual network. If you aren't sure if the *Microsoft.Insights* provider is registered, use [az provider register](/cli/azure/provider#az-provider-register) to register it.

```azurecli-interactive
# Register Microsoft.Insights provider.
az provider register --namespace 'Microsoft.Insights'
```

---

## Related content

- [Audit and deploy NSG flow logs using Azure Policy](nsg-flow-logs-policy-portal.md)
- [NSG flow logs](nsg-flow-logs-overview.md)
- [Traffic analytics](traffic-analytics.md)
