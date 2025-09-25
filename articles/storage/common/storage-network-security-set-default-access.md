---
title: 'Set the default public network access rule: Azure Storage'
description: Configure whether to allow all networks, disable network access, or permit only specific networks to make requests to the storage account's public endpoint.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 08/25/2025
ms.author: normesta
---

# Set the default public network access rule for an Azure Storage account

By default, storage accounts accept connections from clients on any network. You can limit access to selected networks or prevent traffic from all networks and permit access only through a [private endpoint](storage-private-endpoints.md).

## Set the default public network access rule

### [Portal](#tab/azure-portal)

1. Go to the storage account that you want to secure.

2. In the service menu, under **Security + networking**, select **Networking**.

3. Select **Manage**, and then choose the network access that is enabled through the storage account's public endpoint:

   - To allow traffic from all networks, select **Enable**, and then select **Enabled from all networks**.
   
   - To allow traffic only from specific virtual networks, IP address ranges, or specific Azure resources, select **Enable**, and then select **Enabled from selected networks**. You are prompted to add virtual networks, IP address ranges, or resource instances.

   - To block traffic from all networks, select **Disable**.
   
   - To secure traffic by using a network security perimeter, select **Secured by perimeter**.

5. Select **Save** to apply your changes.

<a id="powershell"></a>

### [PowerShell](#tab/azure-powershell)

1. Install [Azure PowerShell](/powershell/azure/install-azure-powershell) and [sign in](/powershell/azure/authenticate-azureps).

2. Choose the type of public network access you want to allow:

    - To allow traffic from all networks, use the `Update-AzStorageAccountNetworkRuleSet` command and set the `-DefaultAction` parameter to `Allow`:

      ```powershell
      Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Allow
      ```
  
    - To allow traffic only from specific virtual networks, use the `Update-AzStorageAccountNetworkRuleSet` command and set the `-DefaultAction` parameter to `Deny`:

      ```powershell
      Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Deny
      ```

      > [!IMPORTANT]
      > Network rules have no effect unless you set the `-DefaultAction` parameter to `Deny`. However, changing this setting can affect your application's ability to connect to Azure Storage. Be sure to grant access to any allowed networks or set up access through a private endpoint before you change this setting.

    - To block traffic from all networks, use the `Set-AzStorageAccount` command and set the `-PublicNetworkAccess` parameter to `Disabled`. Traffic will be allowed only through a [private endpoint](storage-private-endpoints.md). You need to create that private endpoint.

      ```powershell
      Set-AzStorageAccount -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -PublicNetworkAccess Disabled
      ```

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

2. Choose the type of public network access you want to allow:

    - To allow traffic from all networks, use the `az storage account update` command and set the `--default-action` parameter to `Allow`:

      ```azurecli
      az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --default-action Allow
      ```

    - To allow traffic only from specific virtual networks, use the `az storage account update` command and set the `--default-action` parameter to `Deny`:

      ```azurecli
      az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --default-action Deny
      ```

      > [!IMPORTANT]
      > Network rules have no effect unless you set the `--default-action` parameter to `Deny`. However, changing this setting can affect your application's ability to connect to Azure Storage. Be sure to grant access to any allowed networks or set up access through a private endpoint before you change this setting.

    - To block traffic from all networks, use the `az storage account update` command and set the `--public-network-access` parameter to `Disabled`. Traffic will be allowed only through a [private endpoint](storage-private-endpoints.md). You need to create that private endpoint.

      ```azurecli
      az storage account update --name MyStorageAccount --resource-group MyResourceGroup --public-network-access Disabled
      ```

---

> [!NOTE]
> Firewall settings that restrict access to storage services remain in effect for up to a minute after you save settings that allow access.

## Next steps

- [Azure Storage firewall and virtual network rules](storage-network-security.md)
- [Private endpoints](storage-private-endpoints.md)
