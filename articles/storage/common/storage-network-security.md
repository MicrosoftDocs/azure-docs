---
title: Configure Azure Storage Firewalls and Virtual Networks (preview) | Microsoft Docs
description: Configure layered network security for your storage account.
services: storage
documentationcenter: ''
author: cbrooksmsft
manager: cbrooks
editor: cbrooks

ms.service: storage
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage
ms.date: 09/25/2017
ms.author: cbrooks

---
# Configure Azure Storage Firewalls and Virtual Networks (preview)
Azure Storage provides a layered security model allowing you to secure your storage accounts to a specific set of allowed networks​.  When network rules are configured, only applications from allowed networks can access a storage account.  When calling from an allowed network, applications continue to require proper authorization (a valid access key or SAS token) to access the storage account.

## Preview availability and support
Storage Firewalls and Virtual Networks are in preview.  This capability is currently available for new or existing storage accounts in the following locations:
- East US
- West US
- West US 2
- West Central US
- Australia East
- Australia Southeast

> [!NOTE]
> Production workloads are not supported during preview.
>

## Scenarios
Storage accounts can be configured to deny access to traffic from all networks (including internet traffic) by default.  Access can be granted to traffic from specific Azure Virtual networks, allowing you to build a secure network boundary for your applications.  Access can also be granted to public internet IP address ranges, enabling connections from specific internet or on-premises clients.

Network rules are enforced on all network protocols to Azure storage, including REST and SMB.  Access to your data from tools like the Azure portal, Storage Explorer, and AZCopy require explicit network rules granting access when network rules are in force.

Network rules can be applied to existing Storage accounts, or can be applied during the creation of new Storage accounts.

Once network rules are applied, they are enforced for all requests.  SAS tokens that grant access to a specific IP Address service serve to **limit** the access of the token holder, but do not grant new access beyond configured network rules. 

Virtual Machine Disk traffic (including mount and unmount operations, and disk IO) is **not** affected b​y network rules.  Backup of unmanaged disks is not supported for protected storage accounts during the preview.  REST access to page blobs (used for Virtual Machine disks) is protected by network rules.

Classic Storage accounts **do not** support Firewalls and Virtual Networks.

## Change the default network access rule
By default, storage accounts accept connections from clients on any network.  To limit access to selected networks, you must first change the default action.

> [!WARNING]
> Making changes to network rules can impact your applications' ability to connect to Azure Storage.  Setting the default network rule to deny access blocks all access to the data unless specific network rules granting access are also applied.  Be sure to grant access to any allowed networks using network rules before you change the default rule to deny access.
>

#### Azure portal
1. Navigate to the storage account you want to secure.  
> [!NOTE]
> Make sure your storage account is in one of the supported regions for the public preview.
>

2. Click on the settings menu called **Firewalls and virtual networks**.
3. To deny access by default, choose to allow access from 'Selected networks'.  To allow traffic from all networks, choose to allow access from 'All networks'.
4. Click *Save* to apply your changes.

#### PowerShell
1. Install the latest [Azure PowerShell](/powershell/azure/install-azurerm-ps) and [Login](/powershell/azure/authenticate-azureps).

2. Display the status of the default rule for the storage account.
```PowerShell
(Get-AzureRmStorageAccountNetworkRuleSet  -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").DefaultAction
``` 

3. Set the default rule to deny network access by default.  
```PowerShell
Update-AzureRmStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Deny
```    

4. Set the default rule to allow network access by default.
```PowerShell
Update-AzureRmStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Allow
```    

#### CLIv2
1. [Install Azure CLI 2.0](/cli/azure/install-azure-cli) and [Login](/cli/azure/authenticate-azure-cli).
2. Display the status of the default rule for the storage account.
```azurecli
az storage account show --resource-group "myresourcegroup" --name "mystorageaccount" --query networkAcls.defaultAction
```

3. Set the default rule to deny network access by default.  
```azurecli
az storage account update --name "mystorageaccount" --resource-group "myresourcegroup" --default-action Allow
```

4. Set the default rule to allow network access by default.
```azurecli
az storage account update --name "mystorageaccount" --resource-group "myresourcegroup" --default-action Deny
```

## Grant access from a virtual network
Storage accounts can be configured to allow access only from specific Azure Virtual Networks. 

By enabling a [Service Endpoint](/azure/virtual-network/virtual-networks-service-endpoints-overview) for Azure Storage within the Virtual Network, traffic is ensured an optimal route to the Azure Storage service. The identities of the virtual network and the subnet are also transmitted with each request.  Administrators can subsequently configure network rules for the Storage account that allow requests to be received from specific subnets in the Virtual Network.  Clients granted access via these network rules must continue to meet the authorization requirements of the Storage account to access the data.

Each storage account can support up to 100 Virtual Network rules which may be combined with [IP network rules](#grant-access-from-an-internet-ip-range).

### Available Virtual Network locations
In general, Service Endpoints work between Virtual Networks and service instances in the same Azure location.  When Service Endpoints are used with Azure Storage, this scope is expanded to include the [paired region](/azure/best-practices-availability-paired-regions).  This allows continuity during a regional failover as well as seemless access to read-only geo-reduntant storage (RA-GRS) instances.  Network rules that grant access from a virtual network to a storage account also grant access to any RA-GRS instance.

When planning for disaster recovery during a regional outage, you should provision the Virtual Networks in the paired region in advance. Service Endpoints for Azure Storage should be enabled, and network rules granting access from these alternative Virtual Networks should be applied to your geo-redundant storage accounts.

> [!NOTE]
> Service Endpoints do not apply to traffic outside the location of the Virtual Network and the designated region pair.  Network rules granting access from Virtual Networks to Storage accounts can only be applied for Virtual Networks in the primary location of a Storage account or in the designated region pair of that location.
>

### Required permissions
In order to apply a Virtual Network rule to a Storage account, the user must have permission to *Join Service to a Subnet* for the subnets being added.  This permission is included in the *Storage Account Contributor* built-in role and can be added to custom role definitions.

Storage account and the Virtual Networks granted access **may** be in different subscriptions, but those subscriptions must be part of the same Azure Active Directory tenant.

### Managing Virtual Network rules
Virtual Network rules for storage accounts can be managed through the Azure portal, PowerShell, or CLIv2.

#### Azure portal
1. Navigate to the storage account you want to secure.  
2. Click on the settings menu called **Firewalls and virtual networks**.
3. Ensure that you have elected to allow access from 'Selected networks'.
4. To grant access to a Virtual network with a new network rule, under "Virtual networks", click "Add existing" to select an existing Virtual network and subnets, then click *Add*.  To create a new Virtual network and grant it access, click *Add new*, provide the information necessary to create the new Virtual network, and then click *Create*.
> [!NOTE]
> If a Service Endpoint for Azure Storage has not been previously configured for the selected Virtual network and subnets, it can be configured as part of this operation.
>
5. To remove a Virtual network or subnet rule, click "..." to open the context menu for the Virtual network or the subnet, and click "Remove".
6. Click *Save* to apply your changes.

#### PowerShell
1. Install the latest [Azure PowerShell](/powershell/azure/install-azurerm-ps) and [Login](/powershell/azure/authenticate-azureps).
2. List Virtual Network rules
```PowerShell
(Get-AzureRmStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").VirtualNetworkRules
```

3. Enable Service Endpoint for Azure Storage on an existing Virtual Network and Subnet
```PowerShell
Get-AzureRmVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Set-AzureRmVirtualNetworkSubnetConfig -Name "mysubnet"  -AddressPrefix "10.1.1.0/24" -ServiceEndpoint "Microsoft.Storage" | Set-AzureRmVirtualNetwork
```

4. Add a network rule for a Virtual Network and subnet.  
```PowerShell
$subnet = Get-AzureRmVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzureRmVirtualNetworkSubnetConfig -Name "mysubnet"
Add-AzureRmStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -VirtualNetworkResourceId $subnet.Id   
```    

5. Remove a network rule for a Virtual Network and subnet.  
```PowerShell
$subnet = Get-AzureRmVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzureRmVirtualNetworkSubnetConfig -Name "mysubnet"
Remove-AzureRmStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -VirtualNetworkResourceId $subnet.Id   
```    

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to Deny, or network rules will have no effect.
>

#### CLIv2
1. [Install Azure CLI 2.0](/cli/azure/install-azure-cli) and [Login](/cli/azure/authenticate-azure-cli).
2. List Virtual Network rules
```azurecli
az storage account network-rule list --resource-group "myresourcegroup" --account-name "mystorageaccount" --query virtualNetworkRules
```

2. Enable Service Endpoint for Azure Storage on an existing Virtual Network and Subnet
```azurecli
az network vnet subnet update --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --service-endpoints "Microsoft.Storage"
```

3. Add a network rule for a Virtual Network and subnet.  
```azurecli
subnetid=$(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "TestVNET" --name "default" --query id --output tsv)
az storage account network-rule add --resource-group myresourcegroup --account-name mystorageaccount --subnet $subnetid
```

4. Remove a network rule for a Virtual Network and subnet. 
```azurecli
subnetid=$(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "TestVNET" --name "default" --query id --output tsv)
az storage account network-rule remove --resource-group myresourcegroup --account-name mystorageaccount --subnet $subnetid
```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to Deny, or network rules will have no effect.
>

## Grant access from an internet IP range
Storage accounts can be configured to allow access from specific public internet IP address ranges.  This configuration enables specific internet-based services and on-premises networks to be granted access while general internet traffic is blocked.

Allowed internet address ranges can be provided using [CIDR notation](https://tools.ietf.org/html/rfc4632) in the form *16.17.18.0/24* or as individual IP addresses like *16.17.18.19* .

> [!NOTE]
> Small address ranges using "/31" or "/32" prefix sizes are not supported.  These ranges should be configured using individual IP address rules.
>

IP network rules are only allowed for **public internet** IP addresses.  IP address ranges reserved for private networks (as defined in RFC 1918) are not allowed in IP rules.  Private networks include addresses that start with *10.\**, *172.16.\**, and *192.168.\**.

Only IPV4 addresses are supported at this time.

Each storage account can support up to 100 IP network rules which may be combined with [Virtual Network rules](#grant-access-from-a-virtual-network)

### Configuring access from on-premises networks
In order to grant access from your on-premises networks to your storage account with an IP network rule, you must identify the internet facing IP addresses used by your network.  Contact your network administrator for help.

If your network is connected to the Azure network using [ExpressRoute](/azure/expressroute/expressroute-introduction), each circuit is configured with two public IP addresses at the Microsoft Edge that are used to connect to Microsoft Services like Azure Storage using [Azure Public Peering](/azure/expressroute/expressroute-circuit-peerings#expressroute-routing-domains).  To allow communication from your circuit to Azure Storage, you must create IP network rules for the public IP addresses of your circuits.  In order to find your ExpressRoute circuit's public IP addresses, [open a support ticket with ExpressRoute](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) via the Azure portal.


### Managing IP network rules
IP network rules for storage accounts can be managed through the Azure portal, PowerShell, or CLIv2.

#### Azure portal
1. Navigate to the storage account you want to secure.  
2. Click on the settings menu called **Firewalls and virtual networks**.
3. Ensure that you have elected to allow access from 'Selected networks'.
4. To grant access to an internet IP range, enter the IP address or address range (in CIDR format) under Firewall, Address Ranges.
5. To remove an IP network rule, click "..." to open the context menu for the rule, and click "Remove".
6. Click *Save* to apply your changes.

#### PowerShell
1. Install the latest [Azure PowerShell](/powershell/azure/install-azurerm-ps) and [Login](/powershell/azure/authenticate-azureps).
2. List IP network rules.
```PowerShell
(Get-AzureRmStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").IPRules
```

3. Add a network rule for an individual IP address.  
```PowerShell
Add-AzureRMStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.19" 
``` 

4. Add a network rule for an IP address range.  
```PowerShell
Add-AzureRMStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.0/24" 
```    

5. Remove a network rule for an individual IP address. 
```PowerShell
Remove-AzureRMStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.19"  
```

6. Remove a network rule for an IP address range.  
```PowerShell
Remove-AzureRMStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.0/24"  
```    

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to Deny, or network rules will have no effect.
>

#### CLIv2
1. [Install Azure CLI 2.0](/cli/azure/install-azure-cli) and [Login](/cli/azure/authenticate-azure-cli).
2. List IP network rules
```azurecli
az storage account network-rule list --resource-group "myresourcegroup" --account-name "mystorageaccount" --query ipRules
```

3. Add a network rule for an individual IP address.
```azurecli
az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.19"
```

4. Add a network rule for an IP address range.  
```azurecli
az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.0/24"
```

5. Remove a network rule for an individual IP address.  
```azurecli
az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.19"
```

6. Remove a network rule for an IP address range.  
```azurecli
az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.0/24"
```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to Deny, or network rules will have no effect.
>

## Exceptions
While network rules can enable a secure network configuration for most scenarios, there are some cases where exceptions must be granted to enable full functionality.  Storage accounts can be configured with exceptions for Trusted Microsoft services, and for access to Storage analytics data.

### Trusted Microsoft Services
Some Microsoft services that interact with Storage accounts operate from networks that cannot be granted access through network rules. 

To allow this type of service to work as intended, you can permit the set of trusted Microsoft services to bypass the network rules. These services will then use strong authentication to access the Storage account.

When the "Trusted Microsoft Services" exception is enabled, the following services (when registered in your subscription) are granted access to the Storage account:

|Service|Resource Provider Name|Purpose|
|:------|:---------------------|:------|
|Azure DevTest Labs|Microsoft.DevTestLab|Custom image creation and artifact installation.  [Learn more](https://docs.microsoft.com/en-us/azure/devtest-lab/devtest-lab-overview).|
|Azure Event Grid|Microsoft.EventGrid|Enable Blob Storage event publishing.  [Learn more](https://docs.microsoft.com/en-us/azure/event-grid/overview).|
|Azure Event Hubs|Microsoft.EventHub|Archive data with Event Hubs Capture.  [Learn More](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-capture-overview).|
|Azure HDInsight|Microsoft.HDInsight|Cluster provisioning and installation.  [Learn more](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-use-blob-storage).|
|Azure Networking|Microsoft.Networking|Store and analyze network traffic logs.  [Learn more](https://docs.microsoft.com/en-us/azure/network-watcher/network-watcher-packet-capture-overview).|
|Azure SQL Data Warehouse|Microsoft.Sql|Data import and export.  [Learn more](https://docs.microsoft.com/en-us/azure/sql-data-warehouse/sql-data-warehouse-overview-load#load-from-azure-blob-storage).|
||||

### Storage analytics data access
In some cases, access to read diagnostic logs and metrics is required from outside the network boundary.  Exceptions to the network rules can be granted to allow read-access to Storage account log files, metrics tables, or both. [Learn more about working with storage analytics.](/azure/storage/storage-analytics)

### Managing exceptions
Network rule exceptions can be managed through the Azure portal, PowerShell, or Azure CLI v2.

#### Azure portal
1. Navigate to the storage account you want to secure.  
2. Click on the settings menu called **Firewalls and virtual networks**.
3. Ensure that you have elected to allow access from 'Selected networks'.
4. Under Exceptions, select the exceptions you wish to grant.
5. Click *Save* to apply your changes.

#### PowerShell
1. Install the latest [Azure PowerShell](/powershell/azure/install-azurerm-ps) and [Login](/powershell/azure/authenticate-azureps).
2. Display the exceptions for the storage account network rules.
```PowerShell
(Get-AzureRmStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount").Bypass
```

3. Configure the exceptions to the storage account network rules.
```PowerShell
Update-AzureRmStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount"  -Bypass AzureServices,Metrics,Logging
```

4. Remove the exceptions to the storage account network rules.
```PowerShell
Update-AzureRmStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount"  -Bypass None
```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to Deny, or removing exceptions will have no effect.
>

#### CLIv2
1. [Install Azure CLI 2.0](/cli/azure/install-azure-cli) and [Login](/cli/azure/authenticate-azure-cli).
2. Display the exceptions for the storage account network rules.
```azurecli
az storage account show --resource-group "myresourcegroup" --name "mystorageaccount" --query networkAcls.bypass
```

3. Configure the exceptions to the storage account network rules.
```azurecli
az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --bypass Logging Metrics AzureServices
```

4. Remove the exceptions to the storage account network rules.
```azurecli
az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --bypass None
```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to Deny, or removing exceptions will have no effect.
>

## Next steps
Learn more about Azure Network Service Endpoints in [Service Endpoints](/azure/virtual-network/virtual-networks-service-endpoints-overview).

Dig deeper into Azure Storage security in [Azure Storage Security Guide](storage-security-guide.md).
