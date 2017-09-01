---
title: Storage Network Security | Microsoft Docs
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
# Network security for Azure Storage
Azure Storage Network security is a layered security feature allowing you to secure your storage accounts to a set of azure virtual networks or public IP ranges​.  Only applications from allowed networks can access a secured storage account.  Resources from an allowed network continue to require a valid key or SAS to access the storage account.

## Scenarios
Storage Network Security allows you to create Network Rules in the form of ACLs (either by Virtual Network or IP-Range) to secure Azure Resource Manager (ARM) storage accounts.  Network ACLs protect both REST and SMB access of all storage account contents. Network Security for Azure storage allows you to secure your storage account in the following ways.

## Regional availability and support
> [!WARNING]
> Production workloads are not supported during public preview.
>

Storage Network Security is in public preview available in the following regions.
- WestCentralUS
- USWest2
- USEast
- USWest

## Virtual Network Regional Limitations
Storage accounts can only be ACL'ed to a Virtual Network in the same region, or in the case of an GRS or RA-GRS account, the primary or secondary region of the account.  This page lists [GRS storage account](/azure/storage/common/storage-redundancy#geo-redundant-storage) primary and secondary regions and also explains in more detail the uses for geo-redundant storage.

Network ACLs, like your data, are mirrored across the primary and secondary regions.  Which means in the event of a failover, the secondary region will accept connections only from the same set of networks.  In the case of RA-GRS (read access geo-redundant storage) accounts, this means the secondary region will accept only read connections from the configured set of networks.

In the event of a regional failover, if your service is designed to failover from one Azure region to another.  Be sure to ACL both the primary and failover networks your service lives on.  For example, if your service runs on compute VMs on a virtual network in West US as primary and East US as secondary, ACL both the virtual network in West US and the virtual network in East US to your storage account prior to failover.

## Creating IP-ACL for ExpressRoute Circuit
Your [ExpressRoute circuit](/azure/expressroute/expressroute-introduction) is given two IP addresses at the Microsoft Edge that are used to connect to Microsoft Services like Azure Storage.  To allow communication from your circuit to Azure Storage you must create an allow IP-ACL for those two IP addresses on your storage account.  In order to find your ExpressRoute circuit IP addresses, [open a support ticket with ExpressRoute](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) via the Azure Portal.

## Network Access Control
This control turns the feature on or off for the storage account.  Allow **All networks** means the storage account can be accessed from any location.  Allow **selected networks** means the storage account can only be access from allowed networks and services defined by network rules and exceptions.

### Virtual Networks
Create a virtual network based rule to allow resources on an Azure Subnet, for example Azure Virtual Machines, access to the storage account.

### Firewall IP-ranges
Create an IP range rule to allow on-premises and 3rd party services and systems access to the storage account.  IP-ranges support a single IP-address (52.254.240.20) or a CIDR range of /30 or larger (for example 52.254.240.0/24).

### Exceptions
#### Storage Data Access
This control allows read access to diagnostics and metrics from any network.  By default, when network security is enabled for a storage account all assets are protected including logging and metrics.  [Learn more about working with storage analytics.](/azure/storage/storage-analytics)

#### Trusted Services
Connections to your storage account can come from Microsoft PaaS services, which live on Microsoft owned networks that you cannot ACL by virtual network to your storage account.  This control allows all Microsoft services enabled on your subscription to access the storage account, effectively bypassing network based rules.  Those services still must be provided a valid key or SAS to access a storage account.

The currently supported Microsoft services are the following, with more in the works.
- HDInsights
- Visual Studio DevTest Lab

The ability to granularly allow only specific services access to a storage account is also in the works.

## Dependencies
Network Security requires that Virtual Network Private Access is enabled on the Virtual Networks you want to allow access to your storage account.  **Virtual Network Private Access** isn't required to create IP-range based rules.

## Limitations
- Each storage account can have up to 100 Virtual Network based ACLs and 100 IP-range ACLs.

- Network Security is not supported on classic storage accounts, from the Microsoft.ClassicStorage provider. They are only supported on Azure Resource Manager (ARM) storage accounts from the Microsoft.Storage provider.

- Virtual Machine Disk traffic, which includes I/O, mount and unmount operations, is not secured b​y Network ACLs.

## Working with Network Security
The primary scenario for network security is to secure a Storage Account to a Virtual Network or IP-range.  What follows is how to make that happen using the Azure Portal, PowerShell, and CLIv2.

#### Azure Portal
1. Navigate to the storage account you want to secure.  Make sure your storage account is in one of the supported regions for the public preview.
2. Click on the settings menu called **Virtual Networks and Firewall**.
3. Enable the feature by clicking moving the On/Off slider from 'All Networks' to 'Selected Networks'
4. Add the subnet you want to allow access to the storage account by clicking 'Add Subnet'.  If the subnet has not yet been enabled with a **VNet Service Endpoint** to Azure Storage the Azure Portal will prompt you to enable the feature at this time.
5. Once the subnet is enabled it will appear in the Portal as allowed to access the storage account.

#### PowerShell
1. Install up to date [Azure PowerShell](https://azure.microsoft.com/downloads/) which includes new cmdlets for Azure Networking and Azure Storage.
2. Set the default rule for the storage account you are going to secure.
```PowerShell
Update-AzureRMStorageAccountNetworkACL -ResourceGroupName myRG -Name "mystorageaccount" -DefaultAction Deny
```    
3. Configure a **VNet Service Endpoint** for the subnet you want to allow access to the Storage Account.
```PowerShell
Get-AzureRmVirtualNetwork -ResourceGroupName myRG -Name "myVNet" | Set-AzureRmVirtualNetworkSubnetConfig -Name "BESubnet" -AddressPrefix "10.1.1.0/24" -ServiceTunnel "Microsoft.Storage" | Set-AzureRmVirtualNetwork
```
4. Add Virtual Network Rule to **mystorageaccount** to allow access only to myVNet:BESubnet
```PowerShell
$subnet = Get-AzureRmVirtualNetwork -ResourceGroupName myRG -Name "myVNet" | Get-AzureRmVirtualNetworkSubnetConfig -Name "BESubnet"
```
```PowerShell
Add-AzureRmStorageAccountNetworkACLRule -ResourceGroupName myRG -Name "mystorageaccount" -VirtualNetworkResourceId $subnet.Id      
```
5. Add firewall rule to **mystorageaccount** for and IP-range 52.254.240.0/24 and a single IP 52.254.136.20.
```PowerShell
Add-AzureRmStorageAccountNetworkACLRule -ResourceGroupName myRG -Name "mystorageaccount" -IPAddressOrRange "52.254.240.0/24","52.254.136.0"
```

#### CLIv2
1. [Install the Azure CLI 2.0](/cli/azure/install-azure-cli) to manage your Storage Security and Azure Network Service Endpoints.

2. List the network rules on a storage account.
```azurecli
az storage account network-rule list -n mystorageaccount -g myresourcegroup
```
3. Add an IP-address based rule to a storage account.
```azurecli
az storage account network-rule add --ip-address 20.20.20.20 -n mystorageaccount -g myresourcegroup
…
  "networkAcls": {
    "bypass": "AzureServices",
    "defaultAction": "Allow",
    "ipRules": [
      {
        "action": "Allow",
        "ipAddressOrRange": "20.20.20.20"
      }
    ],
    "virtualNetworkRules": []
  },
…
```
4. Add a virtual network based rule to a storage account by name and resource group when the storage account and virtual network are in the same resource group.
```azurecli
az storage account network-rule add --resource-group myresourcegroup --account-name mystorageaccount --subnet mysubnet --vnet-name myvnet
```
5. Or using the full ARM path to the subnet then the storage account and virtual network are in different resource groups or across subscriptions.
```azurecli
az storage account network-rule add --resource-group VM-security --account-name mystorageaccount --subnet /subscriptions/12345678-1234-12324-1234-12345678abcd/resourceGroups/myresourcegroup/providers/Microsoft.Network/virtualNetworks/myvnet/subnets/default
```
6. Deleting a network rule follows syntax similar to creating.
```azurecli
az storage account network-rule remove --ip-address 20.20.20.20 -n mystorageaccount -g myresourcegroup
```

### Test Access
The simplest way to test that your rules are properly set up is using the [Microsoft Azure Storage Explorer](http://storageexplorer.com/).

## Next steps
Configure Network Security on your storage account using one of the following methods.
- Discover more about Azure Network Service Endpoints here.
- Learn how to use the [Azure portal](https://portal.azure.com) to enable Network Security on your storage account.
- You can configure your storage account for network security using PowerShell, the CLIv2, SDK, REST and ARM templates.  [Azure Developer Tools and documentation are available here.](https://azure.microsoft.com/downloads/)
- Use Storage Explorer to test your security from various network locations.  [Download the client here.](http://storageexplorer.com/)
