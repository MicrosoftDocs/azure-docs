---
title: Troubleshoot VPN gateways and connections - Azure CLI
titleSuffix: Azure Network Watcher
description: Learn how to use Azure Network Watcher VPN troubleshoot capability to troubleshoot VPN virtual network gateways and their connections using the Azure CLI.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 11/30/2023
ms.custom: devx-track-azurecli

#CustomerIntent: As a network administrator, I want to determine why resources in a virtual network can't communicate with resources in a different virtual network over a VPN connection.
---

# Troubleshoot VPN virtual network gateways and connections using the Azure CLI

> [!div class="op_single_selector"]
> - [Portal](diagnose-communication-problem-between-networks.md)
> - [PowerShell](vpn-troubleshoot-powershell.md)
> - [Azure CLI](vpn-troubleshoot-cli.md)

In this article, you learn how to use Network Watcher VPN troubleshoot capability to diagnose and troubleshoot VPN virtual network gateways and their connections to solve connectivity issues between your virtual network and on-premises network. VPN troubleshoot requests are long running requests, which could take several minutes to return a result. The logs from troubleshooting are stored in a container on a storage account that is specified.

## Prerequisites

- An Azure account with an active subscription. [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Network Watcher enabled in the region of the virtual network gateway. For more information, see [Enable or disable Azure Network Watcher](network-watcher-create.md?tabs=cli).

- A virtual network gateway. For more information, see [Supported gateway types](vpn-troubleshoot-overview.md#supported-gateway-types).

- Azure Cloud Shell or Azure CLI.
    
    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.
    
    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

## Troubleshoot using an existing storage account

In this section, you learn how to troubleshoot a VPN virtual network gateway or a VPN connection using an existing storage account.

# [**Gateway**](#tab/gateway)

Use [az storage account show](/cli/azure/storage/account#az-storage-account-show) to retrieve the resource ID of the storage account. Then use [az network watcher troubleshooting start](/cli/azure/network/watcher/troubleshooting#az-network-watcher-troubleshooting-start) to start troubleshooting the VPN gateway.

```azurecli-interactive
# Place the storage account ID into a variable.
storageId=$(az storage account show --name 'mystorageaccount' --resource-group 'myResourceGroup' --query 'id' --output tsv)

# Start VPN troubleshoot session.
az network watcher troubleshooting start --resource-group 'myResourceGroup' --resource 'myGateway' --resource-type 'vnetGateway' --storage-account $storageId --storage-path 'https://mystorageaccount.blob.core.windows.net/{containerName}'
```

# [**Connection**](#tab/connection)

Use [az storage account show](/cli/azure/storage/account#az-storage-account-show) to retrieve the resource ID of the storage account. Then use [az network watcher troubleshooting start](/cli/azure/network/watcher/troubleshooting#az-network-watcher-troubleshooting-start) to start troubleshooting the VPN connection.

```azurecli-interactive
# Place the storage account ID into a variable.
storageId=$(az storage account show --name 'mystorageaccount' --resource-group 'myResourceGroup' --query 'id' --output tsv)

# Start VPN troubleshoot session.
az network watcher troubleshooting start --resource-group 'myResourceGroup' --resource 'myConnection' --resource-type 'vpnConnection' --storage-account $storageId --storage-path 'https://mystorageaccount.blob.core.windows.net/{containerName}'
```

---

After the troubleshooting request is completed, ***Healthy*** or ***UnHealthy*** is returned with action text that provides general guidance on how to resolve the issue. If an action can be taken for the issue, a link is provided with more guidance.

Additionally, detailed logs are stored in the storage account container you specified in the previous command. For more information, see [Log files](vpn-troubleshoot-overview.md#log-files). You can use Storage explorer or any other way you prefer to access and download the logs. For more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md). 

## Troubleshoot using a new storage account

In this section, you learn how to troubleshoot a VPN virtual network gateway or a VPN connection using a new storage account.

# [**Gateway**](#tab/gateway) 

Use [az storage account create](/cli/azure/storage/account#az-storage-account-create) and [az storage container create](/cli/azure/storage/container#az-storage-container-create) to create a new storage account and a container respectively. Then, use [az network watcher troubleshooting start](/cli/azure/network/watcher/troubleshooting#az-network-watcher-troubleshooting-start) to start troubleshooting the VPN gateway.

```azurecli-interactive
# Create a new storage account.
az storage account create --name 'mystorageaccount' --resource-group 'myResourceGroup' --location 'eastus' --sku 'Standard_LRS'

# Get the storage account keys.
az storage account keys list --resource-group 'myResourceGroup' --account-name 'mystorageaccount'

# Create a container.
az storage container create --account-name 'mystorageaccount' --account-key {storageAccountKey} --name 'vpn'

# Start VPN troubleshoot session.
az network watcher troubleshooting start --resource-group 'myResourceGroup' --resource 'myGateway' --resource-type 'vnetGateway' --storage-account 'mystorageaccount' --storage-path 'https://mystorageaccount.blob.core.windows.net/vpn'
```

# [**Connection**](#tab/connection)

Use [az storage account create](/cli/azure/storage/account#az-storage-account-create) and [az storage container create](/cli/azure/storage/container#az-storage-container-create) to create a new storage account and a container respectively. Then, use [az network watcher troubleshooting start](/cli/azure/network/watcher/troubleshooting#az-network-watcher-troubleshooting-start) to start troubleshooting the VPN connection.

```azurecli-interactive
# Create a new storage account.
az storage account create --name 'mystorageaccount' --resource-group 'myResourceGroup' --location 'eastus' --sku 'Standard_LRS'

# Get the storage account keys.
az storage account keys list --resource-group 'myResourceGroup' --account-name 'mystorageaccount'

# Create a container.
az storage container create --account-name 'mystorageaccount' --account-key {storageAccountKey} --name 'vpn'

# Start VPN troubleshoot session.
az network watcher troubleshooting start --resource-group 'myResourceGroup' --resource 'myConnection' --resource-type 'vpnConnection' --storage-account 'mystorageaccount' --storage-path 'https://mystorageaccount.blob.core.windows.net/vpn'
```

---

After the troubleshooting request is completed, ***Healthy*** or ***UnHealthy*** is returned with action text that provides general guidance on how to resolve the issue. If an action can be taken for the issue, a link is provided with more guidance.

Additionally, detailed logs are stored in the storage account container you specified in the previous command. For more information, see [Log files](vpn-troubleshoot-overview.md#log-files). You can use Storage explorer or any other way you prefer to access and download the logs. For more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md). 

## Related content

- [Tutorial: Diagnose a communication problem between virtual networks using the Azure portal](diagnose-communication-problem-between-networks.md).

- [VPN troubleshoot overview](vpn-troubleshoot-overview.md).