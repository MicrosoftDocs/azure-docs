---
title: Configure Azure Storage Firewalls and Virtual Networks | Microsoft Docs
description: Configure layered network security for your storage account.
services: storage
author: cbrooksmsft
ms.service: storage
ms.topic: article
ms.date: 10/30/2018
ms.author: cbrooks
ms.component: common
---
# Configure Azure Storage Firewalls and Virtual Networks

Azure Storage provides a layered security model. This model lets you secure your storage accounts to a specific set of supported networks​. When network rules are configured, only applications from allowed networks can access a storage account. When calling from an allowed network, applications continue to require proper authorization (a valid access key or SAS token) to access the storage account.

> [!IMPORTANT]
> Turning on Firewall rules for your Storage account blocks access to incoming requests for data, including from other Azure services. This includes using the Portal, writing logs, and so on. Grant access to Azure services that operate from within a VNet by allowing the subnet of the service instance. Azure services that don't operate from within a VNet are blocked by the firewall. Enable a limited number of scenarios through the [Exceptions](#exceptions) mechanism described in the following section. To access the Portal, you would need to be on a machine within the trusted boundary (either IP or VNet) that you set up.

## Scenarios

Configure storage accounts to deny access to traffic from all networks (including internet traffic) by default. Then grant access to traffic from specific Azure Virtual networks. This configuration allows you to build a secure network boundary for your applications. You can also grant access to public internet IP address ranges, enabling connections from specific internet or on-premises clients.

Network rules are enforced on all network protocols to Azure storage, including REST and SMB. To access the data with tools like Azure portal, Storage Explorer, and AZCopy, explicit network rules are required.

You can apply network rules to existing Storage accounts, or when you create new Storage accounts.

Once network rules are applied, they're enforced for all requests. SAS tokens that grant access to a specific IP address serve to **limit** the access of the token holder, but don't grant new access beyond configured network rules.

Virtual Machine Disk traffic (including mount and unmount operations, and disk IO) is **not** affected by network rules. REST access to page blobs is protected by network rules.

Classic Storage accounts **do not** support Firewalls and Virtual Networks.

You can use unmanaged disks in storage accounts with network rules applied to backup and restore Virtual Machines by creating an exception. This process is documented in the [Exceptions](#exceptions) section of this article. Firewall exceptions aren't applicable with Managed Disks as they're already managed by Azure.

## Change the default network access rule

By default, storage accounts accept connections from clients on any network. To limit access to selected networks, you must first change the default action.

> [!WARNING]
> Making changes to network rules can impact your applications' ability to connect to Azure Storage. Setting the default network rule to **deny** blocks all access to the data unless specific network rules to **grant** access are also applied. Be sure to grant access to any allowed networks using network rules before you change the default rule to deny access.

### Managing default network access rules

You can manage default network access rules for storage accounts through the Azure portal, PowerShell, or CLIv2.

#### Azure portal

1. Go to the storage account you want to secure.

1. Click on the settings menu called **Firewalls and virtual networks**.

1. To deny access by default, choose to allow access from **Selected networks**. To allow traffic from all networks, choose to allow access from **All networks**.

1. Click **Save** to apply your changes.

#### PowerShell

1. Install the [Azure PowerShell](/powershell/azure/install-azurerm-ps) and [sign in](/powershell/azure/authenticate-azureps).

1. Display the status of the default rule for the storage account.

    ```PowerShell
    (Get-AzureRmStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").DefaultAction
    ```

1. Set the default rule to deny network access by default.

    ```PowerShell
    Update-AzureRmStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Deny
    ```

1. Set the default rule to allow network access by default.

    ```PowerShell
    Update-AzureRmStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Allow
    ```

#### CLIv2

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

1. Display the status of the default rule for the storage account.

    ```azurecli
    az storage account show --resource-group "myresourcegroup" --name "mystorageaccount" --query networkRuleSet.defaultAction
    ```

1. Set the default rule to deny network access by default.

    ```azurecli
    az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --default-action Deny
    ```

1. Set the default rule to allow network access by default.

    ```azurecli
    az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --default-action Allow
    ```

## Grant access from a Virtual Network

You can configure Storage accounts to allow access only from specific Azure Virtual Networks.

Enable a [Service Endpoint](/azure/virtual-network/virtual-network-service-endpoints-overview) for Azure Storage within the Virtual Network. This endpoint gives traffic an optimal route to the Azure Storage service. The identities of the virtual network and the subnet are also transmitted with each request. Administrators can then configure network rules for the Storage account that allow requests to be received from specific subnets in the Virtual Network. Clients granted access via these network rules must continue to meet the authorization requirements of the Storage account to access the data.

Each storage account supports up to 100 Virtual Network rules, which may be combined with [IP network rules](#grant-access-from-an-internet-ip-range).

### Available Virtual Network regions

In general, Service Endpoints work between Virtual Networks and service instances in the same Azure region. When using Service Endpoints with Azure Storage, this scope grows to include the [paired region](/azure/best-practices-availability-paired-regions). Service Endpoints allow continuity during a regional failover and access to read-only geo-redundant storage (RA-GRS) instances. Network rules that grant access from a virtual network to a storage account also grant access to any RA-GRS instance.

When planning for disaster recovery during a regional outage, you should create the Virtual Networks in the paired region in advance. Enable Service Endpoints for Azure Storage, with network rules granting access from these alternative Virtual Networks. Then apply these rules to your geo-redundant storage accounts.

> [!NOTE]
> Service Endpoints don't apply to traffic outside the region of the Virtual Network and the designated region pair. You can only apply network rules granting access from Virtual Networks to Storage accounts in the primary region of a Storage account or in the designated paired region.

### Required permissions

To apply a Virtual Network rule to a Storage account, the user must have the appropriate permissions for the subnets being added. The permission needed is *Join Service to a Subnet* and is included in the *Storage Account Contributor* built-in role. It can also be added to custom role definitions.

Storage account and the Virtual Networks granted access **may** be in different subscriptions, but those subscriptions must be part of the same Azure Active Directory tenant.

### Managing Virtual Network rules

You can manage Virtual Network rules for storage accounts through the Azure portal, PowerShell, or CLIv2.

#### Azure portal

1. Go to the storage account you want to secure.

1. Click on the settings menu called **Firewalls and virtual networks**.

1. Check that you've selected to allow access from **Selected networks**.

1. To grant access to a Virtual network with a new network rule, under **Virtual networks**, click **Add existing virtual network**, select **Virtual networks** and **Subnets** options, and then click **Add**. To create a new Virtual network and grant it access, click **Add new virtual network**. Provide the information necessary to create the new Virtual network, and then click **Create**.

    > [!NOTE]
    > If a Service Endpoint for Azure Storage wasn't previously configured for the selected Virtual network and subnets, you can configure it as part of this operation.

1. To remove a Virtual network or subnet rule, click **...** to open the context menu for the Virtual network or the subnet, and click **Remove**.

1. Click **Save** to apply your changes.

#### PowerShell

1. Install the [Azure PowerShell](/powershell/azure/install-azurerm-ps) and [sign in](/powershell/azure/authenticate-azureps).

1. List Virtual Network rules.

    ```PowerShell
    (Get-AzureRmStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").VirtualNetworkRules
    ```

1. Enable Service Endpoint for Azure Storage on an existing Virtual Network and Subnet.

    ```PowerShell
    Get-AzureRmVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Set-AzureRmVirtualNetworkSubnetConfig -Name "mysubnet" -AddressPrefix "10.0.0.0/24" -ServiceEndpoint "Microsoft.Storage" | Set-AzureRmVirtualNetwork
    ```

1. Add a network rule for a Virtual Network and subnet.

    ```PowerShell
    $subnet = Get-AzureRmVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzureRmVirtualNetworkSubnetConfig -Name "mysubnet"
    Add-AzureRmStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -VirtualNetworkResourceId $subnet.Id
    ```

1. Remove a network rule for a Virtual Network and subnet.

    ```PowerShell
    $subnet = Get-AzureRmVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzureRmVirtualNetworkSubnetConfig -Name "mysubnet"
    Remove-AzureRmStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -VirtualNetworkResourceId $subnet.Id
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or network rules have no effect.

#### CLIv2

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

1. List Virtual Network rules.

    ```azurecli
    az storage account network-rule list --resource-group "myresourcegroup" --account-name "mystorageaccount" --query virtualNetworkRules
    ```

1. Enable Service Endpoint for Azure Storage on an existing Virtual Network and Subnet.

    ```azurecli
    az network vnet subnet update --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --service-endpoints "Microsoft.Storage"
    ```

1. Add a network rule for a Virtual Network and subnet.

    ```azurecli
    $subnetid=(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --query id --output tsv)
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --subnet $subnetid
    ```

1. Remove a network rule for a Virtual Network and subnet.

    ```azurecli
    $subnetid=(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --query id --output tsv)
    az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --subnet $subnetid
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or network rules have no effect.

## Grant access from an internet IP range

You can configure storage accounts to allow access from specific public internet IP address ranges. This configuration grants access to specific internet-based services and on-premises networks and blocks general internet traffic.

Provide allowed internet address ranges using [CIDR notation](https://tools.ietf.org/html/rfc4632) in the form *16.17.18.0/24* or as individual IP addresses like *16.17.18.19*.

   > [!NOTE]
   > Small address ranges using "/31" or "/32" prefix sizes are not supported. These ranges should be configured using individual IP address rules.

IP network rules are only allowed for **public internet** IP addresses. IP address ranges reserved for private networks (as defined in [RFC 1918](https://tools.ietf.org/html/rfc1918#section-3)) aren't allowed in IP rules. Private networks include addresses that start with _10.*_, _172.16.*_ - _172.31.*_, and _192.168.*_.

   > [!NOTE]
   > IP network rules have no effect on requests originating from the same Azure region as the Storage account. Use [Virtual Network rules](#grant-access-from-a-virtual-network) to allow same-region requests.

Only IPV4 addresses are supported at this time.

Each storage account supports up to 100 IP network rules, which may be combined with [Virtual Network rules](#grant-access-from-a-virtual-network).

### Configuring access from on-premises networks

To grant access from your on-premises networks to your storage account with an IP network rule, you must identify the internet facing IP addresses used by your network. Contact your network administrator for help.

You can use [ExpressRoute](/azure/expressroute/expressroute-introduction) to connect your network to the Azure network. Here, each circuit is configured with two public IP addresses. They can be found at the Microsoft Edge and use [Azure Public Peering](/azure/expressroute/expressroute-circuit-peerings#expressroute-routing-domains) to connect to Microsoft Services like Azure Storage. To allow communication with Azure Storage, create IP network rules for the public IP addresses of your circuits. To find your ExpressRoute circuit's public IP addresses, [open a support ticket with ExpressRoute](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) via the Azure portal.

### Managing IP network rules

You can manage IP network rules for storage accounts through the Azure portal, PowerShell, or CLIv2.

#### Azure portal

1. Go to the storage account you want to secure.

1. Click on the settings menu called **Firewalls and virtual networks**.

1. Check that you've selected to allow access from **Selected networks**.

1. To grant access to an internet IP range, enter the IP address or address range (in CIDR format) under **Firewall** > **Address Range**.

1. To remove an IP network rule, click the trash can icon next to the address range.

1. Click **Save** to apply your changes.

#### PowerShell

1. Install the [Azure PowerShell](/powershell/azure/install-azurerm-ps) and [sign in](/powershell/azure/authenticate-azureps).

1. List IP network rules.

    ```PowerShell
    (Get-AzureRmStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").IPRules
    ```

1. Add a network rule for an individual IP address.

    ```PowerShell
    Add-AzureRMStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.19"
    ```

1. Add a network rule for an IP address range.

    ```PowerShell
    Add-AzureRMStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.0/24"
    ```

1. Remove a network rule for an individual IP address.

    ```PowerShell
    Remove-AzureRMStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.19"
    ```

1. Remove a network rule for an IP address range.

    ```PowerShell
    Remove-AzureRMStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.0/24"
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or network rules have no effect.

#### CLIv2

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

1. List IP network rules.

    ```azurecli
    az storage account network-rule list --resource-group "myresourcegroup" --account-name "mystorageaccount" --query ipRules
    ```

1. Add a network rule for an individual IP address.

    ```azurecli
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.19"
    ```

1. Add a network rule for an IP address range.

    ```azurecli
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.0/24"
    ```

1. Remove a network rule for an individual IP address.

    ```azurecli
    az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.19"
    ```

1. Remove a network rule for an IP address range.

    ```azurecli
    az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.0/24"
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or network rules have no effect.

## Exceptions

Network rules can enable a secure network configuration for most scenarios. However, there are some cases where exceptions must be granted to enable full functionality. You can configure Storage accounts with exceptions for Trusted Microsoft services, and for access to Storage analytics data.

### Trusted Microsoft Services

Some Microsoft services that interact with Storage accounts operate from networks that can't be granted access through network rules.

To help this type of service work as intended, allow the set of trusted Microsoft services to bypass the network rules. These services will then use strong authentication to access the Storage account.

If you enable the **Allow trusted Microsoft services...** exception, the following services (when registered in your subscription), are granted access to the storage account:

|Service|Resource Provider Name|Purpose|
|:------|:---------------------|:------|
|Azure Backup|Microsoft.Backup|Run backups and restores of unmanaged disks in IAAS virtual machines. (not required for managed disks). [Learn more](/azure/backup/backup-introduction-to-azure-backup).|
|Azure DevTest Labs|Microsoft.DevTestLab|Custom image creation and artifact installation. [Learn more](/azure/devtest-lab/devtest-lab-overview).|
|Azure Event Grid|Microsoft.EventGrid|Enable Blob Storage event publishing. [Learn more](/azure/event-grid/overview).|
|Azure Event Hubs|Microsoft.EventHub|Archive data with Event Hubs Capture. [Learn More](/azure/event-hubs/event-hubs-capture-overview).|
|Azure Networking|Microsoft.Networking|Store and analyze network traffic logs. [Learn more](/azure/network-watcher/network-watcher-packet-capture-overview).|
|Azure Monitor|Microsoft.Insights|Allows writing of monitoring data to a secured storage account [Learn more](/azure/monitoring-and-diagnostics/monitoring-roles-permissions-security#monitoring-and-secured-Azure-storage-and-networks).|
|

### Storage analytics data access

In some cases, access to read diagnostic logs and metrics is required from outside the network boundary. You can grant exceptions to the network rules to allow read-access to Storage account log files, metrics tables, or both. [Learn more about working with storage analytics.](/azure/storage/storage-analytics)

### Managing exceptions

You can manage network rule exceptions through the Azure portal, PowerShell, or Azure CLI v2.

#### Azure portal

1. Go to the storage account you want to secure.

1. Click on the settings menu called **Firewalls and virtual networks**.

1. Check that you've selected to allow access from **Selected networks**.

1. Under **Exceptions**, select the exceptions you wish to grant.

1. Click **Save** to apply your changes.

#### PowerShell

1. Install the [Azure PowerShell](/powershell/azure/install-azurerm-ps) and [sign in](/powershell/azure/authenticate-azureps).

1. Display the exceptions for the storage account network rules.

    ```PowerShell
    (Get-AzureRmStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount").Bypass
    ```

1. Configure the exceptions to the storage account network rules.

    ```PowerShell
    Update-AzureRmStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -Bypass AzureServices,Metrics,Logging
    ```

1. Remove the exceptions to the storage account network rules.

    ```PowerShell
    Update-AzureRmStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -Bypass None
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or removing exceptions have no effect.

#### CLIv2

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

1. Display the exceptions for the storage account network rules.

    ```azurecli
    az storage account show --resource-group "myresourcegroup" --name "mystorageaccount" --query networkRuleSet.bypass
    ```

1. Configure the exceptions to the storage account network rules.

    ```azurecli
    az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --bypass Logging Metrics AzureServices
    ```

1. Remove the exceptions to the storage account network rules.

    ```azurecli
    az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --bypass None
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or removing exceptions have no effect.

## Next steps

Learn more about Azure Network Service Endpoints in [Service Endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview).

Dig deeper into Azure Storage security in [Azure Storage Security Guide](storage-security-guide.md).
