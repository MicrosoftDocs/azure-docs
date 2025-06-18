---
title: Manage network security exceptions
description: Put something here.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta

---

# Manage exceptions

<a id="exceptions"></a>
<a id="trusted-microsoft-services"></a>

## Grant access to trusted Azure services

Some Azure services operate from networks that you can't include in your network rules. You can grant a subset of such trusted Azure services access to the storage account, while maintaining network rules for other apps. These trusted services will then use strong authentication to connect to your storage account.

In some cases, like storage analytics, access to read resource logs and metrics is required from outside the network boundary. When you configure trusted services to access the storage account, you can allow read access for the log files, metrics tables, or both by creating a network rule exception. You can manage network rule exceptions through the Azure portal, PowerShell, or the Azure CLI v2.

To learn more about working with storage analytics, see [Use Azure Storage analytics to collect logs and metrics data](./storage-analytics.md).

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
## Next steps

- Learn more about [Azure network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).
- Dig deeper into [security recommendations for Azure Blob storage](../blobs/security-recommendations.md).
