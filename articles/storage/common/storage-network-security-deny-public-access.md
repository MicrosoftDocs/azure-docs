---
title: Deny Access to Public Endpoints of an Azure Storage account
description: Put description here.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta

---
# Deny access to public endpoints of an Azure Storage account

Put something here.

## Change the default network access rule

By default, storage accounts accept connections from clients on any network. You can limit access to selected networks *or* prevent traffic from all networks and permit access only through a [private endpoint](storage-private-endpoints.md).

You must set the default rule to **deny**, or network rules have no effect. However, changing this setting can affect your application's ability to connect to Azure Storage. Be sure to grant access to any allowed networks or set up access through a private endpoint before you change this setting.

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

### [Portal](#tab/azure-portal)

1. Go to the storage account that you want to secure.

2. In the service menu, under **Security + networking**, select **Networking**.

3. Choose what network access is enabled through the storage account's public endpoint:

   - Select either **Enabled from all networks** or **Enabled from selected virtual networks and IP addresses**. If you select the second option, you'll be prompted to add virtual networks and IP address ranges.

   - To restrict inbound access while allowing outbound access, select **Disabled**.

4. Select **Save** to apply your changes.

<a id="powershell"></a>

### [PowerShell](#tab/azure-powershell)

1. Install [Azure PowerShell](/powershell/azure/install-azure-powershell) and [sign in](/powershell/azure/authenticate-azureps).

2. Choose which type of public network access you want to allow:

    - To allow traffic from all networks, use the `Update-AzStorageAccountNetworkRuleSet` command and set the `-DefaultAction` parameter to `Allow`:

      ```powershell
      Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Allow
      ```
  
    - To allow traffic only from specific virtual networks, use the `Update-AzStorageAccountNetworkRuleSet` command and set the `-DefaultAction` parameter to `Deny`:

      ```powershell
      Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Deny
      ```

    - To block traffic from all networks, use the `Set-AzStorageAccount` command and set the `-PublicNetworkAccess` parameter to `Disabled`. Traffic will be allowed only through a [private endpoint](storage-private-endpoints.md). You'll have to create that private endpoint.

      ```powershell
      Set-AzStorageAccount -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -PublicNetworkAccess Disabled
      ```

### [Azure CLI](#tab/azure-cli)

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

2. Choose which type of public network access you want to allow:

    - To allow traffic from all networks, use the `az storage account update` command and set the `--default-action` parameter to `Allow`:

      ```azurecli
      az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --default-action Allow
      ```

    - To allow traffic only from specific virtual networks, use the `az storage account update` command and set the `--default-action` parameter to `Deny`:

      ```azurecli
      az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --default-action Deny
      ```

    - To block traffic from all networks, use the `az storage account update` command and set the `--public-network-access` parameter to `Disabled`. Traffic will be allowed only through a [private endpoint](storage-private-endpoints.md). You'll have to create that private endpoint.

      ```azurecli
      az storage account update --name MyStorageAccount --resource-group MyResourceGroup --public-network-access Disabled
      ```

---

## Next steps

- Learn more about [Azure network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).
- Dig deeper into [security recommendations for Azure Blob storage](../blobs/security-recommendations.md).
