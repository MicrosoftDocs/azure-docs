---
title: Grant Access to Azure Storage from IP Address Ranges
description: Configure the Azure Storage firewall to accept requests from IP address ranges.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta
---

# Grant access to Azure Storage from IP address ranges

Put something here.

## Grant access from an internet IP range

You can use IP network rules to allow access from specific public internet IP address ranges by creating IP network rules. Each storage account supports up to 400 rules. These rules grant access to specific internet-based services and on-premises networks and block general internet traffic.

### Restrictions for IP network rules

The following restrictions apply to IP address ranges:

- IP network rules are allowed only for *public internet* IP addresses.

  IP address ranges reserved for private networks (as defined in [RFC 1918](https://tools.ietf.org/html/rfc1918#section-3)) aren't allowed in IP rules. Private networks include addresses that start with 10, 172.16 to 172.31, and 192.168.

- You must provide allowed internet address ranges by using [CIDR notation](https://tools.ietf.org/html/rfc4632) in the form 16.17.18.0/24 or as individual IP addresses like 16.17.18.19.

- Small address ranges that use /31 or /32 prefix sizes are not supported. Configure these ranges by using individual IP address rules.

- Only IPv4 addresses are supported for configuration of storage firewall rules.

> [!IMPORTANT]
> You can't use IP network rules in the following cases:
>
> - To restrict access to clients in same Azure region as the storage account. IP network rules have no effect on requests that originate from the same Azure region as the storage account. Use [Virtual network rules](storage-network-security-virtual-networks.md) to allow same-region requests.
> - To restrict access to clients in a [paired region](../../reliability/cross-region-replication-azure.md) that are in a virtual network that has a service endpoint.
> - To restrict access to Azure services deployed in the same region as the storage account. Services deployed in the same region as the storage account use private Azure IP addresses for communication. So, you can't restrict access to specific Azure services based on their public outbound IP address range.

### Configuring access from on-premises networks

To grant access from your on-premises networks to your storage account by using an IP network rule, you must identify the internet-facing IP addresses that your network uses. Contact your network administrator for help.

If you're using [Azure ExpressRoute](../../expressroute/expressroute-introduction.md) from your premises, you need to identify the NAT IP addresses used for Microsoft peering. Either the service provider or the customer provides the NAT IP addresses.

To allow access to your service resources, you must allow these public IP addresses in the firewall setting for resource IPs.

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

### Managing IP network rules

You can manage IP network rules for storage accounts through the Azure portal, PowerShell, or the Azure CLI v2.

#### [Portal](#tab/azure-portal)

1. Go to the storage account for which you want to manage IP network rules.

2. In the service menu, under **Security + networking**, select **Networking**.

3. Check that you've chosen to enable public network access from selected virtual networks and IP addresses.

4. To grant access to an internet IP range, enter the IP address or address range (in CIDR format) under **Firewall** > **Address Range**.

5. To remove an IP network rule, select the delete icon (:::image type="icon" source="media/storage-network-security/delete-icon.png":::) next to the address range.

6. Select **Save** to apply your changes.

#### [PowerShell](#tab/azure-powershell)

1. Install [Azure PowerShell](/powershell/azure/install-azure-powershell) and [sign in](/powershell/azure/authenticate-azureps).

2. List IP network rules:

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").IPRules
    ```

3. Add a network rule for an individual IP address:

    ```powershell
    Add-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.19"
    ```

4. Add a network rule for an IP address range:

    ```powershell
    Add-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.0/24"
    ```

5. Remove a network rule for an individual IP address:

    ```powershell
    Remove-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.19"
    ```

6. Remove a network rule for an IP address range:

    ```powershell
    Remove-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.0/24"
    ```

#### [Azure CLI](#tab/azure-cli)

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

1. List IP network rules:

    ```azurecli
    az storage account network-rule list --resource-group "myresourcegroup" --account-name "mystorageaccount" --query ipRules
    ```

1. Add a network rule for an individual IP address:

    ```azurecli
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.19"
    ```

1. Add a network rule for an IP address range:

    ```azurecli
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.0/24"
    ```

1. Remove a network rule for an individual IP address:

    ```azurecli
    az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.19"
    ```

1. Remove a network rule for an IP address range:

    ```azurecli
    az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.0/24"
    ```

---

## Next steps

- Learn more about [Azure network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).
- Dig deeper into [security recommendations for Azure Blob storage](../blobs/security-recommendations.md).
