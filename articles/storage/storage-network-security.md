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

## Network Access Control
This control turns the feature on or off for the storage account.  Allow **All networks** means the storage account can be accessed from any location.  Allow **selected networks** means the storage account can only be access from allowed networks and services defined by network rules and exceptions.

### Virtual Networks
Create a virtual network based rule to allow resources on an Azure Subnet, for example Azure Virtual Machines, access to the storage account.

### Firewall IP-ranges
Create an IP range rule to allow on-premises and 3rd party services and systems access to the storage account.  IP-ranges support a single IP-address (52.254.240.20) or a CIDR range of /30 or larger (for example 52.254.240.0/24).

### Exceptions
#### Storage Data Access
This control allows read access to diagnostics and metrics from any network.  By default, when network security is enabled for a storage account all assets are protected including logging and metrics.  [Learn more about working with storage analytics.](https://docs.microsoft.com/en-us/azure/storage/storage-analytics)

#### Trusted Services
Allow all Microsoft services enabled on your subscription access to the storage account.  The currently supported Microsoft services are:
- HDInsights
- Visual Studio DevTest Lab

Support for additional services, for example Azure Backup, are in the works.  Granular control of services, allowing you to enable specific services only, is also in the works.

## Dependencies
Network Security requires that Virtual Network Private Access is enabled on the Virtual Networks you want to allow access to your storage account.  **Virtual Network Private Access** isn't required to create IP-range based rules.

## Limitations
- Each storage account can have up to 100 Virtual Network based ACLs and 100 IP-range ACLs.

- Network Security is not supported on classic storage accounts, from the Microsoft.ClassicStorage provider. They are only supported on Azure Resource Manager (ARM) storage accounts from the Microsoft.Storage provider.

- Virtual Machine Disk traffic, which includes I/O, mount and unmount operations, is not secured b​y Network ACLs.

## Common Scenarios

### Secure Storage Account to a Virtual Network or IP-range
You can enable only specific Azure Virtual networks to access the storage account.  The storage account and virtual network must be in the same geographic region, for example USWest2.

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

### Test Access
The simplest way to test that your rules are properly set up is using the [Microsoft Azure Storage Explorer](http://storageexplorer.com/).

## Next steps
Configure Network Security on your storage account using one of the following methods.
- Learn how to use the [Azure portal](https://portal.azure.com) to enable Network Security on your storage account.
- You can configure your storage account for network security using PowerShell, the CLIv2, SDK, REST and ARM templates.  [Azure Developer Tools and documentation are available here.](https://azure.microsoft.com/downloads/)
- Use Storage Explorer to test your security from various network locations.  [Download the client here.](http://storageexplorer.com/)
