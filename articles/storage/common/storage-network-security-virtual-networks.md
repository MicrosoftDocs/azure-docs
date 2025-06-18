---
title: Grant access to Azure Storage from virtual networks
description: Configure the Azure Storage firewall to accept requests from virtual networks.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta

---

# Grant access to Azure Storage from IP virtual networks

Put something here.

## Grant access from a virtual network

You can configure storage accounts to allow access only from specific subnets. The allowed subnets can belong to a virtual network in the same subscription or a different subscription, including those that belong to a different Microsoft Entra tenant. With [cross-region service endpoints](#azure-storage-cross-region-service-endpoints), the allowed subnets can also be in different regions from the storage account.

You can enable a [service endpoint](../../virtual-network/virtual-network-service-endpoints-overview.md) for Azure Storage within the virtual network. The service endpoint routes traffic from the virtual network through an optimal path to the Azure Storage service. The identities of the subnet and the virtual network are also transmitted with each request. Administrators can then configure network rules for the storage account that allow requests to be received from specific subnets in a virtual network. Clients granted access via these network rules must continue to meet the authorization requirements of the storage account to access the data.

Each storage account supports up to 400 virtual network rules. You can combine these rules with [IP network rules](storage-network-security-ip-address-range.md).

> [!IMPORTANT]
> When referencing a service endpoint in a client application, it's recommended that you avoid taking a dependency on a cached IP address. The storage account IP address is subject to change, and relying on a cached IP address may result in unexpected behavior.
>
> Additionally, it's recommended that you honor the time-to-live (TTL) of the DNS record and avoid overriding it. Overriding the DNS TTL may result in unexpected behavior.

### Required permissions

To apply a virtual network rule to a storage account, the user must have the appropriate permissions for the subnets that are being added. A [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor) or a user who has permission to the `Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftnetwork) can apply a rule by using a custom Azure role.

The storage account and the virtual networks that get access can be in different subscriptions, including subscriptions that are a part of a different Microsoft Entra tenant.

Configuration of rules that grant access to subnets in virtual networks that are a part of a different Microsoft Entra tenant are currently supported only through PowerShell, the Azure CLI, and REST APIs. You can't configure such rules through the Azure portal, though you can view them in the portal.

### Azure Storage cross-region service endpoints

Cross-region service endpoints for Azure Storage became generally available in April 2023. They work between virtual networks and storage service instances in any region. With cross-region service endpoints, subnets no longer use a public IP address to communicate with any storage account, including those in another region. Instead, all the traffic from subnets to storage accounts uses a private IP address as a source IP. As a result, any storage accounts that use IP network rules to permit traffic from those subnets no longer have an effect.

Configuring service endpoints between virtual networks and service instances in a [paired region](../../best-practices-availability-paired-regions.md) can be an important part of your disaster recovery plan. Service endpoints allow continuity during a regional failover and access to read-only geo-redundant storage (RA-GRS) instances. Network rules that grant access from a virtual network to a storage account also grant access to any RA-GRS instance.

When you're planning for disaster recovery during a regional outage, create the virtual networks in the paired region in advance. Enable service endpoints for Azure Storage, with network rules granting access from these alternative virtual networks. Then apply these rules to your geo-redundant storage accounts.

Local and cross-region service endpoints can't coexist on the same subnet. To replace existing service endpoints with cross-region ones, delete the existing `Microsoft.Storage` endpoints and re-create them as cross-region endpoints (`Microsoft.Storage.Global`).

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

### Managing virtual network and access rules

You can manage virtual network and access rules for storage accounts through the Azure portal, PowerShell, or the Azure CLI v2.

If you want to enable access to your storage account from a virtual network or subnet in another Microsoft Entra tenant, you must use PowerShell or the Azure CLI. The Azure portal doesn't show subnets in other Microsoft Entra tenants.

#### [Portal](#tab/azure-portal)

1. Go to the storage account for which you want to configure virtual network and access rules.

2. In the service menu, under **Security + networking**, select **Networking**.

3. Check that you've chosen to enable public network access from selected virtual networks and IP addresses.

4. To grant access to a virtual network by using a new network rule, under **Virtual networks**, select **Add existing virtual network**. Select the **Virtual networks** and **Subnets** options, and then select **Add**. To create a new virtual network and grant it access, select **Add new virtual network**. Provide the necessary information to create the new virtual network, and then select **Create**. Currently, only virtual networks that belong to the same Microsoft Entra tenant appear for selection during rule creation. To grant access to a subnet in a virtual network that belongs to another tenant, use PowerShell, the Azure CLI, or REST API.

5. To remove a virtual network or subnet rule, select the ellipsis (**...**) to open the context menu for the virtual network or subnet, and then select **Remove**.

6. Select **Save** to apply your changes.

> [!IMPORTANT]
> If you delete a subnet that's included in a network rule, it will be removed from the network rules for the storage account. If you create a new subnet by the same name, it won't have access to the storage account. To allow access, you must explicitly authorize the new subnet in the network rules for the storage account.

#### [PowerShell](#tab/azure-powershell)

1. Install [Azure PowerShell](/powershell/azure/install-azure-powershell) and [sign in](/powershell/azure/authenticate-azureps).

2. List virtual network rules:

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").VirtualNetworkRules
    ```

3. Enable a service endpoint for Azure Storage on an existing virtual network and subnet:

    ```powershell
    Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Set-AzVirtualNetworkSubnetConfig -Name "mysubnet" -AddressPrefix "10.0.0.0/24" -ServiceEndpoint "Microsoft.Storage.Global" | Set-AzVirtualNetwork
    ```

4. Add a network rule for a virtual network and subnet:

    ```powershell
    $subnet = Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzVirtualNetworkSubnetConfig -Name "mysubnet"
    Add-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -VirtualNetworkResourceId $subnet.Id
    ```

    To add a network rule for a subnet in a virtual network that belongs to another Microsoft Entra tenant, use a fully qualified `VirtualNetworkResourceId` parameter in the form `/subscriptions/subscription-ID/resourceGroups/resourceGroup-Name/providers/Microsoft.Network/virtualNetworks/vNet-name/subnets/subnet-name`.

5. Remove a network rule for a virtual network and subnet:

    ```powershell
    $subnet = Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzVirtualNetworkSubnetConfig -Name "mysubnet"
    Remove-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -VirtualNetworkResourceId $subnet.Id
    ```

#### [Azure CLI](#tab/azure-cli)

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

2. List virtual network rules:

    ```azurecli
    az storage account network-rule list --resource-group "myresourcegroup" --account-name "mystorageaccount" --query virtualNetworkRules
    ```

3. Enable a service endpoint for Azure Storage on an existing virtual network and subnet:

    ```azurecli
    az network vnet subnet update --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --service-endpoints "Microsoft.Storage.Global"
    ```

4. Add a network rule for a virtual network and subnet:

    ```azurecli
    subnetid=$(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --query id --output tsv)
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --subnet $subnetid
    ```

    To add a rule for a subnet in a virtual network that belongs to another Microsoft Entra tenant, use a fully qualified subnet ID in the form `/subscriptions/<subscription-ID>/resourceGroups/<resourceGroup-Name>/providers/Microsoft.Network/virtualNetworks/<vNet-name>/subnets/<subnet-name>`. You can use the `subscription` parameter to retrieve the subnet ID for a virtual network that belongs to another Microsoft Entra tenant.

5. Remove a network rule for a virtual network and subnet:

    ```azurecli
    subnetid=$(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --query id --output tsv)
    az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --subnet $subnetid
    ```

---

## Next steps

- Learn more about [Azure network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).
- Dig deeper into [security recommendations for Azure Blob storage](../blobs/security-recommendations.md).
