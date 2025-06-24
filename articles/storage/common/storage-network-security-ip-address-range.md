---
title: Create an IP network rule for Azure Storage
description: Learn how to create an IP network rule that enables traffic to an Azure Storage account from IP address ranges.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta
---

# Create an IP network rule for Azure Storage

You can deny all public access to your storage account, and then configure Azure network settings to accept requests from specific IP address ranges. To enable traffic from a specific public IP address ranges, create one or more IP network rules. To learn more, see [Permit access to IP address ranges](storage-network-security.md#grant-access-from-an-internet-ip-range).

## Create an IP network rule

### [Portal](#tab/azure-portal)

1. Go to the storage account for which you want to manage IP network rules.

2. In the service menu, under **Security + networking**, select **Networking**.

3. To allow traffic from IP address ranges, make sure that **Enabled from selected virtual networks and IP addresses** is selected.  

4. To grant access to an internet IP range, enter the IP address or address range (in CIDR format) under **Firewall** > **Address Range**.

5. To remove an IP network rule, select the delete icon (:::image type="icon" source="media/storage-network-security/delete-icon.png":::) next to the address range.

6. Select **Save** to apply your changes.

### [PowerShell](#tab/azure-powershell)

1. Install [Azure PowerShell](/powershell/azure/install-azure-powershell) and [sign in](/powershell/azure/authenticate-azureps).

2. To allow traffic to IP address ranges, use the `Update-AzStorageAccountNetworkRuleSet` command and set the `-DefaultAction` parameter to `Deny`:

   ```powershell
   Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Deny
   ```

   > [!IMPORTANT]
   > Network rules have no effect unless you set the `-DefaultAction` parameter to `Deny`. However, changing this setting can affect your application's ability to connect to Azure Storage. Be sure to grant access to any allowed networks or set up access through a private endpoint before you change this setting.

3. List IP network rules:

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").IPRules
    ```

4. Add a network rule for an individual IP address:

    ```powershell
    Add-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.19"
    ```

5. Add a network rule for an IP address range:

    ```powershell
    Add-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.0/24"
    ```

6. Remove a network rule for an individual IP address:

    ```powershell
    Remove-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.19"
    ```

7. Remove a network rule for an IP address range:

    ```powershell
    Remove-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.0/24"
    ```

### [Azure CLI](#tab/azure-cli)

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).


2. To allow traffic from IP address ranges, use the `az storage account update` command and set the `--default-action` parameter to `Deny`:

   ```azurecli
   az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --default-action Deny
   ```

   > [!IMPORTANT]
   > Network rules have no effect unless you set the `--default-action` parameter to `Deny`. However, changing this setting can affect your application's ability to connect to Azure Storage. Be sure to grant access to any allowed networks or set up access through a private endpoint before you change this setting.

3. List IP network rules:

    ```azurecli
    az storage account network-rule list --resource-group "myresourcegroup" --account-name "mystorageaccount" --query ipRules
    ```

4. Add a network rule for an individual IP address:

    ```azurecli
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.19"
    ```

5. Add a network rule for an IP address range:

    ```azurecli
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.0/24"
    ```

6. Remove a network rule for an individual IP address:

    ```azurecli
    az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.19"
    ```

7. Remove a network rule for an IP address range:

    ```azurecli
    az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.0/24"
    ```

---

## See also

- [Azure Storage firewall and virtual network rules](storage-network-security.md)
