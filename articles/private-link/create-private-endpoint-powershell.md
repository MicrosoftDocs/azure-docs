---
title: 'Create an Azure Private Link using Azure PowerShell| Microsoft Docs'
description: Learn about Azure Private Link
services: virtual-network
author: KumudD
# Customer intent: As someone with a basic network background, but is new to Azure, I want to create an Azure Private Endpoint
ms.service: virtual-network
ms.topic: article
ms.date: 09/05/2019
ms.author: kumud

---
# Create Azure Private Link using Azure PowerShell
A private endpoint is the fundamental building block for private link in Azure. It enables Azure resources, like virtual machines (VMs), to communicate privately with private link resources. 

In this Quickstart, you will learn how to create a VM on an Azure virtual network, a storage account with an Azure Private Endpoint using Azure PowerShell. Then, you can securely access the the storage account from the VM.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create a resource group

Before you can create your private link, you must create a resource group host the virtual network and the Private Endpoint with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). The following example creates a resource group named *myResourceGroup* in the *WestUS* location:

```azurepowershell

New-AzResourceGroup `
  -ResourceGroupName myResourceGroup `
  -Location westus
```

## Create a virtual network
In this section, you create a virtual network and a subnet. Next, you associate the subnet your virtual network.

### Create a virtual network

Create a virtual network for your Private Endpoint with [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork). The following example creates a virtual network named *myPEVNet*:
 
```azurepowershell

$virtualNetwork = New-AzVirtualNetwork `
  -ResourceGroupName myResourceGroup `
  -Location WestUS `
  -Name myPEVnet`
  -AddressPrefix 10.0.0.0/16
```

### Add a subnet

Azure deploys resources to a subnet within a virtual network, so you need to create a subnet. Create a subnet configuration named *peSubnet* with [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig). The following examples creates a subnet named *PESubnet* with the Private Endpoint network policy flag set to **Disabled**.

```azurepowershell
$subnetConfig = Add-AzVirtualNetworkSubnetConfig `
  -Name PESubnet ` 
  -AddressPrefix 10.0.0.0/24 `
  -PrivateEndpointNetworkPoliciesFlag "Disabled" `
  -VirtualNetwork $virtualNetwork
```

### Associate the subnet to the virtual network

You can write the subnet configuration to the virtual network with [Set-AzVirtualNetwork](/powershell/module/az.network/Set-azVirtualNetwork). This command creates the subnet:

```azurepowershell
$virtualNetwork | Set-AzVirtualNetwork
```

## Create a virtual machine

Create a VM in the virtual network with [New-AzVM](/powershell/module/az.compute/new-azvm). When you run the next command, you're prompted for credentials. Enter a user name and password for the VM:

```azurepowershell-interactive
New-AzVm `
    -ResourceGroupName "myResourceGroup" `
    -Name "myPEVM" `
    -Location "West US" `
    -VirtualNetworkName "myPEVNet" `
    -SubnetName "PESubnet" `
    -SecurityGroupName "myNetworkSecurityGroup" `
    -PublicIpAddressName "myPublicIpAddress" `
    -OpenPorts 80,3389 `
    -AsJob  
```

The `-AsJob` option creates the VM in the background. You can continue to the next step.

When Azure starts creating the VM in the background, you'll get something like this back:

```powershell
Id     Name            PSJobTypeName   State         HasMoreData     Location             Command
--     ----            -------------   -----         -----------     --------             -------
1      Long Running... AzureLongRun... Running       True            localhost            New-AzVM
```

## Create a storage account

Create a general-purpose v2 storage account with read-access geo-redundant storage (RA-GRS) by using the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) command. Remember that the name of your storage account must be unique across Azure, so replace the placeholder value in brackets with your own unique value:

```azurepowershell
$storageAccount = New-AzStorageAccount -ResourceGroupName "myResourceGroup" `
  -Name "mystorageaccount" `
  -Location "WestUS" `
  -SkuName Standard_RAGRS `
  -Kind StorageV2 `
  -NetworkRuleSet (@{defaultAction="Deny"})
``` 


## Create a Private Endpoint

Create a private endpoint for the storage account in your virtual network with [New-AzPrivateLinkServiceConnection](/powershell/module/az.network/New-AzPrivateLinkServiceConnection): 

```azurepowershell

$privateEndpointConnection = New-AzPrivateLinkServiceConnection -Name "myConnection" ` 
  -PrivateLinkServiceId $storageAccount.Id ` 
  -GroupId "blob" 
 
$virtualNetwork = Get-AzVirtualNetwork -ResourceGroupName  "myResourceGroup" -Name "myPEVNet"  
 
$subnet = $virtualNetwork ` 
  | Select -ExpandProperty subnets ` 
  | Where-Object  {$_.Name -eq 'mypesubnet'}  
 
$privateEndpoint = New-AzPrivateEndpoint -ResourceGroupName "myResourceGroup" ` 
  -Name "myPrivateEndpoint" ` 
  -Location "WestUS" ` 
  -Subnet  $subnet` 
  -PrivateLinkServiceConnection $privateEndpointConnection
``` 

## Configure the private DNS zone 
Create a private DNS zone for storage blob domain and create an association link with the virtual network: 

```azurepowershell

$zone = New-AzPrivateDnsZone -ResourceGroupName "myResourceGroup" ` 
  -Name "privatelink.blob.core.windows.net"  
 
$link  = New-AzPrivateDnsVirtualNetworkLink -ResourceGroupName "myResourceGroup" ` 
  -ZoneName "privatelink.blob.core.windows.net"` 
  -Name "mylink" `  
  -VirtualNetworkId $virtualNetwork.Id  
 
$networkInterface = Get-AzResource -ResourceId $privateEndpoint.NetworkInterfaces[0].Id -ApiVersion "2019-04-01" 
 
foreach ($ipconfig in $networkInterface.properties.ipConfigurations) { 
foreach ($fqdn in $ipconfig.properties.privateLinkConnectionProperties.fqdns) { 
Write-Host "$($ipconfig.properties.privateIPAddress) $($fqdn)"  
$recordName = $fqdn.split('.',2)[0] 
$dnsZone = $fqdn.split('.',2)[1] 
New-AzPrivateDnsRecordSet -Name $recordName -RecordType A -ZoneName "privatelink.blob.core.windows.net"  ` 
-ResourceGroupName "myResourceGroup" -Ttl 600 ` 
-PrivateDnsRecords (New-AzPrivateDnsRecordConfig -IPv4Address $ipconfig.properties.privateIPAddress)  
} 
} 
``` 
  
## Connect to a VM from the internet

Use [Get-AzPublicIpAddress](/powershell/module/az.network/Get-AzPublicIpAddress) to return the public IP address of a VM. This example returns the public IP address of the *myPEVM* VM:

```azurepowershell
Get-AzPublicIpAddress ` 
  -Name myPublicIpAddress ` 
  -ResourceGroupName myResourceGroup ` 
  | Select IpAddress 
```  
Open a command prompt on your local computer. Run the mstsc command. Replace <publicIpAddress> with the public IP address returned from the last step: 


> [!NOTE]
> If you've been running these commands from a PowerShell prompt on your local computer, and you're using the Az PowerShell module version 1.0 or later, you can continue in that interface.
```
mstsc /v:<publicIpAddress>
```

1. If prompted, select **Connect**. 
2. Enter the user name and password you specified when creating the VM.
  > [!NOTE]
  > You may need to select More choices > Use a different account, to specify the credentials you entered when you created the VM. 
3. Select OK. 
4. You may receive a certificate warning. If you do, select Yes or Continue. 

## Access storage account privately from the VM

1. In the Remote Desktop of myPEVM, open PowerShell.
2. Enter `nslookup mystorageaccount.blob.core.windows.net`
    You'll receive a message similar to this:
    ```azurepowershell
    Server:  UnKnown
    Address:  168.63.129.16
    Non-authoritative answer:
    Name:    mystorageaccount123123.privatelink.blob.core.windows.net
    Address:  10.0.0.5
    Aliases:  mystorageaccount.blob.core.windows.net
3. Install [Microsoft Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&tabs=windows).
4. Select **Storage accounts** with the right-click.
5. Select **Connect to an azure storage**.
6. Select **Use a connection string**.
7. Select **Next**.
8. Enter the connection string by pasting the information previously copied.
9. Select **Next**.
10. Select **Connect**.
11. Browse the Blob containers from mystorageaccount 
12. (Optionally) Create folders and/or upload files to *mystorageaccount*. 
13. Close the remote desktop connection to *myPEVM*. 


Additional options to access the Storage account:
- Microsoft Azure Storage Explorer is a standalone free app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux. You can install the application to browse privately the storage account content. 
 
- The AzCopy utility is another option for high-performance scriptable data transfer for Azure Storage. Use AzCopy to transfer data to and from Blob, File, and Table storage. 


## Clean up resources 
When you're done using the private endpoint, storage account and the VM, use [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group and all the resources it has:

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroup -Force
```

## Next steps
- Learn more about [Azure Private Link](private-link-overview.md)