---
title: Configure Azure Storage firewalls and virtual networks | Microsoft Docs
description: Configure layered network security for your storage account.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 03/21/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Configure Azure Storage firewalls and virtual networks

Azure Storage provides a layered security model. This model enables you to secure your storage accounts to a specific set of supported networks​. When network rules are configured, only applications requesting data from over the specified set of networks can access a storage account.

An application that accesses a storage account when network rules are in effect requires proper authorization on the request. Authorization is supported with Azure Active Directory (Azure AD) credentials for blobs and queues, with a valid account access key, or with an SAS token.

> [!IMPORTANT]
> Azure File Sync does not yet support firewalls and virtual networks. If you are using Azure File Sync on your storage account and you enable these, Azure File Sync will not sync.
>
> Turning on firewall rules for your storage account blocks incoming requests for data by default, unless the requests come from a service that is operating within an Azure Virtual Network (VNet). Requests that are blocked include those from other Azure services, from the Azure portal, from logging and metrics services, and so on.
>
> You can grant access to Azure services that operate from within a VNet by allowing the subnet of the service instance. Enable a limited number of scenarios through the [Exceptions](#exceptions) mechanism described in the following section. To access the Azure portal, you would need to be on a machine within the trusted boundary (either IP or VNet) that you set up.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Scenarios

Configure storage accounts to deny access to traffic from all networks (including internet traffic) by default. Then grant access to traffic from specific VNets. This configuration enables you to build a secure network boundary for your applications. You can also grant access to public internet IP address ranges, enabling connections from specific internet or on-premises clients.

Network rules are enforced on all network protocols to Azure storage, including REST and SMB. To access the data with tools like Azure portal, Storage Explorer, and AZCopy, explicit network rules are required.

You can apply network rules to existing storage accounts, or when you create new storage accounts.

Once network rules are applied, they're enforced for all requests. SAS tokens that grant access to a specific IP address serve to limit the access of the token holder, but don't grant new access beyond configured network rules.

Virtual machine disk traffic (including mount and unmount operations, and disk IO) is not affected by network rules. REST access to page blobs is protected by network rules.

Classic storage accounts do not support firewalls and virtual networks.

You can use unmanaged disks in storage accounts with network rules applied to backup and restore VMs by creating an exception. This process is documented in the [Exceptions](#exceptions) section of this article. Firewall exceptions aren't applicable with managed disks as they're already managed by Azure.

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

1. Install the [Azure PowerShell](/powershell/azure/install-Az-ps) and [sign in](/powershell/azure/authenticate-azureps).

1. Display the status of the default rule for the storage account.

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").DefaultAction
    ```

1. Set the default rule to deny network access by default.

    ```powershell
    Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Deny
    ```

1. Set the default rule to allow network access by default.

    ```powershell
    Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Allow
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

## Grant access from a virtual network

You can configure storage accounts to allow access only from specific VNets.

Enable a [Service endpoint](/azure/virtual-network/virtual-network-service-endpoints-overview) for Azure Storage within the VNet. This endpoint gives traffic an optimal route to the Azure Storage service. The identities of the virtual network and the subnet are also transmitted with each request. Administrators can then configure network rules for the storage account that allow requests to be received from specific subnets in the VNet. Clients granted access via these network rules must continue to meet the authorization requirements of the storage account to access the data.

Each storage account supports up to 100 virtual network rules, which may be combined with [IP network rules](#grant-access-from-an-internet-ip-range).

### Available virtual network regions

In general, service endpoints work between virtual networks and service instances in the same Azure region. When using service endpoints with Azure Storage, this scope grows to include the [paired region](/azure/best-practices-availability-paired-regions). Service endpoints allow continuity during a regional failover and access to read-only geo-redundant storage (RA-GRS) instances. Network rules that grant access from a virtual network to a storage account also grant access to any RA-GRS instance.

When planning for disaster recovery during a regional outage, you should create the VNets in the paired region in advance. Enable service endpoints for Azure Storage, with network rules granting access from these alternative virtual networks. Then apply these rules to your geo-redundant storage accounts.

> [!NOTE]
> Service endpoints don't apply to traffic outside the region of the virtual network and the designated region pair. You can only apply network rules granting access from virtual networks to storage accounts in the primary region of a storage account or in the designated paired region.

### Required permissions

To apply a virtual network rule to a storage account, the user must have the appropriate permissions for the subnets being added. The permission needed is *Join Service to a Subnet* and is included in the *Storage Account Contributor* built-in role. It can also be added to custom role definitions.

Storage account and the virtual networks granted access may be in different subscriptions, but those subscriptions must be part of the same Azure AD tenant.

### Managing virtual network rules

You can manage virtual network rules for storage accounts through the Azure portal, PowerShell, or CLIv2.

#### Azure portal

1. Go to the storage account you want to secure.

1. Click on the settings menu called **Firewalls and virtual networks**.

1. Check that you've selected to allow access from **Selected networks**.

1. To grant access to a virtual network with a new network rule, under **Virtual networks**, click **Add existing virtual network**, select **Virtual networks** and **Subnets** options, and then click **Add**. To create a new virtual network and grant it access, click **Add new virtual network**. Provide the information necessary to create the new virtual network, and then click **Create**.

    > [!NOTE]
    > If a service endpoint for Azure Storage wasn't previously configured for the selected virtual network and subnets, you can configure it as part of this operation.

1. To remove a virtual network or subnet rule, click **...** to open the context menu for the virtual network or subnet, and click **Remove**.

1. Click **Save** to apply your changes.

#### PowerShell

1. Install the [Azure PowerShell](/powershell/azure/install-Az-ps) and [sign in](/powershell/azure/authenticate-azureps).

1. List virtual network rules.

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").VirtualNetworkRules
    ```

1. Enable service endpoint for Azure Storage on an existing virtual network and subnet.

    ```powershell
    Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Set-AzVirtualNetworkSubnetConfig -Name "mysubnet" -AddressPrefix "10.0.0.0/24" -ServiceEndpoint "Microsoft.Storage" | Set-AzVirtualNetwork
    ```

1. Add a network rule for a virtual network and subnet.

    ```powershell
    $subnet = Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzVirtualNetworkSubnetConfig -Name "mysubnet"
    Add-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -VirtualNetworkResourceId $subnet.Id
    ```

1. Remove a network rule for a virtual network and subnet.

    ```powershell
    $subnet = Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzVirtualNetworkSubnetConfig -Name "mysubnet"
    Remove-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -VirtualNetworkResourceId $subnet.Id
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or network rules have no effect.

#### CLIv2

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

1. List virtual network rules.

    ```azurecli
    az storage account network-rule list --resource-group "myresourcegroup" --account-name "mystorageaccount" --query virtualNetworkRules
    ```

1. Enable service endpoint for Azure Storage on an existing virtual network and subnet.

    ```azurecli
    az network vnet subnet update --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --service-endpoints "Microsoft.Storage"
    ```

1. Add a network rule for a virtual network and subnet.

    ```azurecli
    $subnetid=(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --query id --output tsv)
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --subnet $subnetid
    ```

1. Remove a network rule for a virtual network and subnet.

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
   > IP network rules have no effect on requests originating from the same Azure region as the storage account. Use [Virtual network rules](#grant-access-from-a-virtual-network) to allow same-region requests.

Only IPV4 addresses are supported at this time.

Each storage account supports up to 100 IP network rules, which may be combined with [Virtual network rules](#grant-access-from-a-virtual-network).

### Configuring access from on-premises networks

To grant access from your on-premises networks to your storage account with an IP network rule, you must identify the internet facing IP addresses used by your network. Contact your network administrator for help.

If you are using [ExpressRoute](/azure/expressroute/expressroute-introduction) from your premises, for public peering or Microsoft peering, you will need to identify the NAT IP addresses that are used. For public peering, each ExpressRoute circuit by default uses two NAT IP addresses applied to Azure service traffic when the traffic enters the Microsoft Azure network backbone. For Microsoft peering, the NAT IP address(es) that are used are either customer provided or are provided by the service provider. To allow access to your service resources, you must allow these public IP addresses in the resource IP firewall setting. To find your public peering ExpressRoute circuit IP addresses, [open a support ticket with ExpressRoute](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) via the Azure portal. Learn more about [NAT for ExpressRoute public and Microsoft peering.](/azure/expressroute/expressroute-nat#nat-requirements-for-azure-public-peering)

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

1. Install the [Azure PowerShell](/powershell/azure/install-Az-ps) and [sign in](/powershell/azure/authenticate-azureps).

1. List IP network rules.

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").IPRules
    ```

1. Add a network rule for an individual IP address.

    ```powershell
    Add-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.19"
    ```

1. Add a network rule for an IP address range.

    ```powershell
    Add-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.0/24"
    ```

1. Remove a network rule for an individual IP address.

    ```powershell
    Remove-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.19"
    ```

1. Remove a network rule for an IP address range.

    ```powershell
    Remove-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.0/24"
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

Network rules can enable a secure network configuration for most scenarios. However, there are some cases where exceptions must be granted to enable full functionality. You can configure storage accounts with exceptions for trusted Microsoft services, and for access to storage analytics data.

### Trusted Microsoft services

Some Microsoft services that interact with storage accounts operate from networks that can't be granted access through network rules.

To help this type of service work as intended, allow the set of trusted Microsoft services to bypass the network rules. These services will then use strong authentication to access the storage account.

If you enable the **Allow trusted Microsoft services...** exception, the following services (when registered in your subscription), are granted access to the storage account:

|Service|Resource Provider Name|Purpose|
|:------|:---------------------|:------|
|Azure Backup|Microsoft.RecoveryServices|Run backups and restores of unmanaged disks in IAAS virtual machines. (not required for managed disks). [Learn more](/azure/backup/backup-introduction-to-azure-backup).|
|Azure Data Box|Microsoft.DataBox|Enables import of data to Azure using Data Box. [Learn more](/azure/databox/data-box-overview).|
|Azure DevTest Labs|Microsoft.DevTestLab|Custom image creation and artifact installation. [Learn more](/azure/devtest-lab/devtest-lab-overview).|
|Azure Event Grid|Microsoft.EventGrid|Enable Blob Storage event publishing and allow Event Grid to publish to storage queues. Learn about [blob storage events](/azure/event-grid/event-sources) and [publishing to queues](/azure/event-grid/event-handlers).|
|Azure Event Hubs|Microsoft.EventHub|Archive data with Event Hubs Capture. [Learn More](/azure/event-hubs/event-hubs-capture-overview).|
|Azure HDInsight|Microsoft.HDInsight|Provision the initial contents of the default file system for a new HDInsight cluster. [Learn more](https://azure.microsoft.com/blog/enhance-hdinsight-security-with-service-endpoints/).|
|Azure Monitor|Microsoft.Insights|Allows writing of monitoring data to a secured storage account [Learn more](/azure/monitoring-and-diagnostics/monitoring-roles-permissions-security).|
|Azure Networking|Microsoft.Network|Store and analyze network traffic logs. [Learn more](/azure/network-watcher/network-watcher-packet-capture-overview).|
|Azure Site Recovery|Microsoft.SiteRecovery |Configure disaster recovery by enabling replication for Azure IaaS virtual machines. This is required if you are using firewall enabled cache storage account or source storage account or target storage account.  [Learn more](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-enable-replication).|
|Azure SQL Data Warehouse|Microsoft.Sql|Allows import and export scenarios from specific SQL Databases instances using PolyBase. [Learn more](/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview).|

### Storage analytics data access

In some cases, access to read diagnostic logs and metrics is required from outside the network boundary. You can grant exceptions to the network rules to allow read-access to storage account log files, metrics tables, or both. [Learn more about working with storage analytics.](/azure/storage/storage-analytics)

### Managing exceptions

You can manage network rule exceptions through the Azure portal, PowerShell, or Azure CLI v2.

#### Azure portal

1. Go to the storage account you want to secure.

1. Click on the settings menu called **Firewalls and virtual networks**.

1. Check that you've selected to allow access from **Selected networks**.

1. Under **Exceptions**, select the exceptions you wish to grant.

1. Click **Save** to apply your changes.

#### PowerShell

1. Install the [Azure PowerShell](/powershell/azure/install-Az-ps) and [sign in](/powershell/azure/authenticate-azureps).

1. Display the exceptions for the storage account network rules.

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount").Bypass
    ```

1. Configure the exceptions to the storage account network rules.

    ```powershell
    Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -Bypass AzureServices,Metrics,Logging
    ```

1. Remove the exceptions to the storage account network rules.

    ```powershell
    Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -Bypass None
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

Learn more about Azure Network service endpoints in [Service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview).

Dig deeper into Azure Storage security in [Azure Storage security guide](storage-security-guide.md).
