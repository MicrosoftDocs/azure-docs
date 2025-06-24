---
title: Manage network security exceptions for Azure Storage
description: Learn how to enable traffic from an Azure service outside of the network boundary by adding a *network security exception*.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta

---

# Manage network security exceptions

You can enable traffic from an Azure service outside of the network boundary by adding a *network security exception*.

For a complete list of trusted Azure services, see [Trusted Azure services](storage-network-security-trusted-azure-services.md).

## Add a network security exception

### [Portal](#tab/azure-portal)

1. Go to the storage account for which you want to manage exceptions.

2. In the service menu, under **Security + networking**, select **Networking**.

3. Check that you've chosen to enable public network access from selected virtual networks and IP addresses.

4. Under **Exceptions**, select the exceptions that you want to grant.

5. Select **Save** to apply your changes.

### [PowerShell](#tab/azure-powershell)

1. Install [Azure PowerShell](/powershell/azure/install-azure-powershell) and [sign in](/powershell/azure/authenticate-azureps).

2. Display the exceptions for the storage account's network rules:

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount").Bypass
    ```

3. Configure the exceptions to the storage account's network rules:

    ```powershell
    Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -Bypass AzureServices,Metrics,Logging
    ```

4. Remove the exceptions to the storage account's network rules:

    ```powershell
    Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -Bypass None
    ```

### [Azure CLI](#tab/azure-cli)

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

2. Display the exceptions for the storage account's network rules:

    ```azurecli
    az storage account show --resource-group "myresourcegroup" --name "mystorageaccount" --query networkRuleSet.bypass
    ```

3. Configure the exceptions to the storage account's network rules:

    ```azurecli
    az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --bypass Logging Metrics AzureServices
    ```

4. Remove the exceptions to the storage account's network rules:

    ```azurecli
    az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --bypass None
    ```

---

## See also

- [Azure Storage firewall and virtual network rules](storage-network-security.md)
- [Trusted Azure services](storage-network-security-trusted-azure-services.md)
