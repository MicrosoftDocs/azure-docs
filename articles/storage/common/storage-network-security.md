---
title: Configure Azure Storage Firewalls and Virtual Networks | Microsoft Docs
description: Configure layered network security for your storage account.
services: storage
author: cbrooksmsft
ms.service: storage
ms.topic: article
ms.date: 10/25/2017
ms.author: cbrooks
ms.component: common
---
# Configure Azure Storage Firewalls and Virtual Networks
Azure Storage provides a layered security model allowing you to secure your storage accounts to a specific set of allowed networks​.  When network rules are configured, only applications from allowed networks can access a storage account.  When calling from an allowed network, applications continue to require proper authorization (a valid access key or SAS token) to access the storage account.

> [!IMPORTANT]
> Turning on Firewall rules for your Storage account will block access to incoming requests for data, including from other Azure services.  This includes using the Portal, writing logs, etc.  Azure services that operate from within a VNet can be granted access by allowing the subnet of the service instance.  Azure services that do not operate from within a VNet will be blocked by the firewall.  A limited number of scenarios can be enabled through the [Exceptions](https://docs.microsoft.com/azure/storage/common/storage-network-security#exceptions) mechanism described below.  To access the Portal you would need to do so from a machine within the trusted boundary (either IP or VNet) that you have set up.
>

## Scenarios
Storage accounts can be configured to deny access to traffic from all networks (including internet traffic) by default.  Access can be granted to traffic from specific Azure Virtual networks, allowing you to build a secure network boundary for your applications.  Access can also be granted to public internet IP address ranges, enabling connections from specific internet or on-premises clients.

Network rules are enforced on all network protocols to Azure storage, including REST and SMB.  Access to your data from tools like the Azure portal, Storage Explorer, and AZCopy require explicit network rules granting access when network rules are in force.

Network rules can be applied to existing Storage accounts, or can be applied during the creation of new Storage accounts.

Once network rules are applied, they are enforced for all requests.  SAS tokens that grant access to a specific IP Address service serve to **limit** the access of the token holder, but do not grant new access beyond configured network rules. 

Virtual Machine Disk traffic (including mount and unmount operations, and disk IO) is **not** affected by network rules.  REST access to page blobs is protected by network rules.

Classic Storage accounts **do not** support Firewalls and Virtual Networks.

Backup and Restore of Virtual Machines using unmanaged disks in storage accounts with network rules applied is supported via creating an exception as documented in the [Exceptions](https://docs.microsoft.com/azure/storage/common/storage-network-security#exceptions) section of this article.  Firewall exceptions are not applicable with Managed Disks as they are already managed by Azure.

## Change the default network access rule
By default, storage accounts accept connections from clients on any network.  To limit access to selected networks, you must first change the default action.

> [!WARNING]
> Making changes to network rules can impact your applications' ability to connect to Azure Storage.  Setting the default network rule to **deny** blocks all access to the data unless specific network rules *granting* access are also applied.  Be sure to grant access to any allowed networks using network rules before you change the default rule to deny access.
>

#### Azure portal
1. Navigate to the storage account you want to secure.  

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
1. [Install the Azure CLI](/cli/azure/install-azure-cli) and [Login](/cli/azure/authenticate-azure-cli).
2. Display the status of the default rule for the storage account.
```azurecli
az storage account show --resource-group "myresourcegroup" --name "mystorageaccount" --query networkRuleSet.defaultAction
```

3. Set the default rule to deny network access by default.  
```azurecli
az storage account update --name "mystorageaccount" --resource-group "myresourcegroup" --default-action Deny
```

4. Set the default rule to allow network access by default.
```azurecli
az storage account update --name "mystorageaccount" --resource-group "myresourcegroup" --default-action Allow
```

## Grant access from a virtual network
Storage accounts can be configured to allow access only from specific Azure Virtual Networks. 

By enabling a [Service Endpoint](/azure/virtual-network/virtual-network-service-endpoints-overview) for Azure Storage within the Virtual Network, traffic is ensured an optimal route to the Azure Storage service. The identities of the virtual network and the subnet are also transmitted with each request.  Administrators can subsequently configure network rules for the Storage account that allow requests to be received from specific subnets in the Virtual Network.  Clients granted access via these network rules must continue to meet the authorization requirements of the Storage account to access the data.

Each storage account can support up to 100 Virtual Network rules which may be combined with [IP network rules](#grant-access-from-an-internet-ip-range).

### Available Virtual Network regions
In general, Service Endpoints work between Virtual Networks and service instances in the same Azure region.  When Service Endpoints are used with Azure Storage, this scope is expanded to include the [paired region](/azure/best-practices-availability-paired-regions).  This allows continuity during a regional failover as well as seamless access to read-only geo-redundant storage (RA-GRS) instances.  Network rules that grant access from a virtual network to a storage account also grant access to any RA-GRS instance.

When planning for disaster recovery during a regional outage, you should provision the Virtual Networks in the paired region in advance. Service Endpoints for Azure Storage should be enabled, and network rules granting access from these alternative Virtual Networks should be applied to your geo-redundant storage accounts.

> [!NOTE]
> Service Endpoints do not apply to traffic outside the region of the Virtual Network and the designated region pair.  Network rules granting access from Virtual Networks to Storage accounts can only be applied for Virtual Networks in the primary region of a Storage account or in the designated paired region.
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
1. [Install the Azure CLI](/cli/azure/install-azure-cli) and [Login](/cli/azure/authenticate-azure-cli).
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
subnetid=$(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --query id --output tsv)
az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --subnet $subnetid
```

4. Remove a network rule for a Virtual Network and subnet. 
```azurecli
subnetid=$(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --query id --output tsv)
az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --subnet $subnetid
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
5. To remove an IP network rule, click the trash can icon next to the network rule.
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
1. [Install the Azure CLI](/cli/azure/install-azure-cli) and [Login](/cli/azure/authenticate-azure-cli).
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
|Azure Backup|Microsoft.Backup|Perform backups and restores of unmanaged disks in IAAS virtual machines. (not required for managed disks). [Learn more](https://docs.microsoft.com/azure/backup/backup-introduction-to-azure-backup).|
|Azure DevTest Labs|Microsoft.DevTestLab|Custom image creation and artifact installation.  [Learn more](https://docs.microsoft.com/azure/devtest-lab/devtest-lab-overview).|
|Azure Event Grid|Microsoft.EventGrid|Enable Blob Storage event publishing.  [Learn more](https://docs.microsoft.com/azure/event-grid/overview).|
|Azure Event Hubs|Microsoft.EventHub|Archive data with Event Hubs Capture.  [Learn More](https://docs.microsoft.com/azure/event-hubs/event-hubs-capture-overview).|
|Azure Networking|Microsoft.Networking|Store and analyze network traffic logs.  [Learn more](https://docs.microsoft.com/azure/network-watcher/network-watcher-packet-capture-overview).|
|Azure Monitor|Microsoft.Insights| Allows writing of monitoring data to a secured storaage account [Learn more](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-roles-permissions-security#monitoring-and-secured-Azure-storage-and-networks).|
|


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
1. [Install the Azure CLI](/cli/azure/install-azure-cli) and [Login](/cli/azure/authenticate-azure-cli).
2. Display the exceptions for the storage account network rules.
```azurecli
az storage account show --resource-group "myresourcegroup" --name "mystorageaccount" --query networkRuleSet.bypass
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
Learn more about Azure Network Service Endpoints in [Service Endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview).

Dig deeper into Azure Storage security in [Azure Storage Security Guide](storage-security-guide.md).
