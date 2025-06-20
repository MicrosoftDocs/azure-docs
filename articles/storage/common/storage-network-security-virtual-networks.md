---
title: Configure Azure Storage to accept requests from virtual networks
description: Learn how to configure Azure Storage to accept requests from virtual networks.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta

---

# Configure Azure Storage to accept requests from virtual networks

You can deny all public access to your storage account, and then configure Azure network settings to accept requests that originate from specific virtual network subnets. To learn more, see [Permit access to virtual network subnets](storage-network-security.md#grant-access-from-a-virtual-network).

## [Portal](#tab/azure-portal)

> [!NOTE]
> If you want to enable access from a virtual network in another Microsoft Entra tenant, you must use PowerShell or the Azure CLI. The Azure portal doesn't show subnets in other Microsoft Entra tenants.

1. Go to the storage account for which you want to configure virtual network and access rules.

2. In the service menu, under **Security + networking**, select **Networking**.

3. To allow traffic only from specific virtual networks, make sure that **Enabled from selected virtual networks and IP addresses** is selected.  

4. To grant access to a virtual network by using a new network rule, under **Virtual networks**, select **Add existing virtual network**. Select the **Virtual networks** and **Subnets** options, and then select **Add**. To create a new virtual network and grant it access, select **Add new virtual network**. Provide the necessary information to create the new virtual network, and then select **Create**. Currently, only virtual networks that belong to the same Microsoft Entra tenant appear for selection during rule creation. To grant access to a subnet in a virtual network that belongs to another tenant, use PowerShell, the Azure CLI, or REST API.

5. To remove a virtual network or subnet rule, select the ellipsis (**...**) to open the context menu for the virtual network or subnet, and then select **Remove**.

6. Select **Save** to apply your changes.

> [!IMPORTANT]
> If you delete a subnet that's included in a network rule, it will be removed from the network rules for the storage account. If you create a new subnet by the same name, it won't have access to the storage account. To allow access, you must explicitly authorize the new subnet in the network rules for the storage account.

## [PowerShell](#tab/azure-powershell)

1. Install [Azure PowerShell](/powershell/azure/install-azure-powershell) and [sign in](/powershell/azure/authenticate-azureps).

2. To allow traffic only from specific virtual networks, use the `Update-AzStorageAccountNetworkRuleSet` command and set the `-DefaultAction` parameter to `Deny`:

   ```powershell
   Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Deny
   ```

   > [!IMPORTANT]
   > Network rules have no effect unless you set the `-DefaultAction` parameter to `Deny`. However, changing this setting can affect your application's ability to connect to Azure Storage. Be sure to grant access to any allowed networks or set up access through a private endpoint before you change this setting.

3. List virtual network rules:

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").VirtualNetworkRules
    ```

4. Enable a service endpoint for Azure Storage on an existing virtual network and subnet:

    ```powershell
    Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Set-AzVirtualNetworkSubnetConfig -Name "mysubnet" -AddressPrefix "10.0.0.0/24" -ServiceEndpoint "Microsoft.Storage.Global" | Set-AzVirtualNetwork
    ```

5. Add a network rule for a virtual network and subnet:

    ```powershell
    $subnet = Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzVirtualNetworkSubnetConfig -Name "mysubnet"
    Add-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -VirtualNetworkResourceId $subnet.Id
    ```

    To add a network rule for a subnet in a virtual network that belongs to another Microsoft Entra tenant, use a fully qualified `VirtualNetworkResourceId` parameter in the form `/subscriptions/subscription-ID/resourceGroups/resourceGroup-Name/providers/Microsoft.Network/virtualNetworks/vNet-name/subnets/subnet-name`.

6. Remove a network rule for a virtual network and subnet:

    ```powershell
    $subnet = Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzVirtualNetworkSubnetConfig -Name "mysubnet"
    Remove-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -VirtualNetworkResourceId $subnet.Id
    ```

## [Azure CLI](#tab/azure-cli)

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

2. To allow traffic only from specific virtual networks, use the `az storage account update` command and set the `--default-action` parameter to `Deny`:

   ```azurecli
   az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --default-action Deny
   ```

   > [!IMPORTANT]
   > Network rules have no effect unless you set the `--default-action` parameter to `Deny`. However, changing this setting can affect your application's ability to connect to Azure Storage. Be sure to grant access to any allowed networks or set up access through a private endpoint before you change this setting.

3. List virtual network rules:

    ```azurecli
    az storage account network-rule list --resource-group "myresourcegroup" --account-name "mystorageaccount" --query virtualNetworkRules
    ```

4. Enable a service endpoint for Azure Storage on an existing virtual network and subnet:

    ```azurecli
    az network vnet subnet update --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --service-endpoints "Microsoft.Storage.Global"
    ```

5. Add a network rule for a virtual network and subnet:

    ```azurecli
    subnetid=$(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --query id --output tsv)
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --subnet $subnetid
    ```

    To add a rule for a subnet in a virtual network that belongs to another Microsoft Entra tenant, use a fully qualified subnet ID in the form `/subscriptions/<subscription-ID>/resourceGroups/<resourceGroup-Name>/providers/Microsoft.Network/virtualNetworks/<vNet-name>/subnets/<subnet-name>`. You can use the `subscription` parameter to retrieve the subnet ID for a virtual network that belongs to another Microsoft Entra tenant.

6. Remove a network rule for a virtual network and subnet:

    ```azurecli
    subnetid=$(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --query id --output tsv)
    az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --subnet $subnetid
    ```

---

## Next steps

- Learn more about [Azure network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).
- Dig deeper into [security recommendations for Azure Blob storage](../blobs/security-recommendations.md).
