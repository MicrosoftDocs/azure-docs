---
title: Create a Windows virtual machine with PowerShell in Azure Stack | Microsoft Docs
description: Create a Windows virtual machine with PowerShell in Azure Stack.
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/16/2017
ms.author: sngun

---

# Create a Windows virtual machine with PowerShell in Azure Stack
‎
Azure Stack requires specific version of Azure PowerShell module to create and manage Azure Stack resources. This guide details the steps required to create a Windows Server 2016 virtual machine in Azure Stack by using PowerShell. You can run the described in this article either from MAS-CON01, Azure Stack host computer, or from a Windows-based external client if you are connected through VPN. 

## Prerequisites

1. In Azure Stack, the Windows Server 2016 image is not available in the marketplace by default. So, before you can create a virtual machine, make sure that the Azure Stack administrator [adds the Windows Server 2016 image to the Azure Stack marketplace](azure-stack-add-default-image.md). 
2. [Install PowerShell for Azure Stack.](azure-stack-powershell-install.md)
3. [Configure PowerShell to connect to the Azure Stack.](azure-stack-powershell-configure.md)

## Create a resource group

Create a resource group. A resource group is a logical container into which Azure Stack resources are deployed and managed.

```powershell
# Create variables to store the location and resource group names
$location = "local"
$ResourceGroupName = "myResourceGroup"

# Create a new resource group
New-AzureRmResourceGroup -Name $ResourceGroupName -Location $location
```

## Create storage resources 

Create a storage account, and a storage container to store the Windows Server 2016 image.

```powershell
# Create variables to store the storage account name and SKU information
$StorageAccountName = "mystorageaccount"
$SkuName = "Standard_LRS"

# Create a new storage account
$StorageAccount = New-AzureRMStorageAccount -Location $location -ResourceGroupName $ResourceGroupName -Type $SkuName -Name $StorageAccountName

# Set the default storage account for the specified subscription
Set-AzureRmCurrentStorageAccount -StorageAccountName $storageAccountName -ResourceGroupName $resourceGroupName

# Create a storage container to store the virtual machine image
$containerName = 'osdisks'
$container = New-AzureStorageContainer -Name $containerName -Permission Blob
```

## Create networking resources

Create a virtual network, subnet, and a public IP address. These resources are used to provide network connectivity to the virtual machine.  

```powershell
# Create a subnet configuration
$subnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24

# Create a virtual network
$vnet = New-AzureRmVirtualNetwork -ResourceGroupName $ResourceGroupName -Location $location `
-Name MYvNET -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig

# Create a public IP address and specify a DNS name
$pip = New-AzureRmPublicIpAddress -ResourceGroupName $ResourceGroupName -Location $location `
-AllocationMethod Static -IdleTimeoutInMinutes 4 -Name "mypublicdns$(Get-Random)"
```

### Create a network security group and a network security group rule

The network security group secures the virtual machine using inbound and outbound rules. In this case, an inbound rule is created for port 3389 to allow incoming Remote Desktop connections. You should also create an inbound rule for port 80 to allow incoming web traffic.

```powershell
# Create an inbound network security group rule for port 3389
$nsgRuleRDP = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP -Protocol Tcp `
-Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
-DestinationPortRange 3389 -Access Allow

# Create an inbound network security group rule for port 80
$nsgRuleWeb = New-AzureRmNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleWWW -Protocol Tcp `
-Direction Inbound -Priority 1001 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
-DestinationPortRange 80 -Access Allow

# Create a network security group
$nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName $ResourceGroupName -Location $location `
-Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP,$nsgRuleWeb 
```
 
### Create a network card for the virtual machine

The network card connects the virtual machine to a subnet, network security group, and public IP address.

```powershell
# Create a virtual network card and associate it with public IP address and NSG
$nic = New-AzureRmNetworkInterface -Name myNic -ResourceGroupName $ResourceGroupName -Location $location -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id 
```

## Create a virtual machine

Create a virtual machine configuration. The configuration includes the settings that are used when deploying the virtual machine such as a virtual machine image, size, and authentication configuration. When running this step, you are prompted for credentials. The values that you enter are configured as the user name and password for the virtual machine.

```powershell
# Define a credential object to store the username and password for the virtual machine
$UserName='demouser'
$Password='Password@123'|ConvertTo-SecureString -Force -AsPlainText
$Credential=New-Object PSCredential($UserName,$Password)

# Create the virtual machine configuration object
$VmName = "VirtualMachinelatest"
$VmSize = "Standard_A1"
$VirtualMachine = New-AzureRmVMConfig -VMName $VmName -VMSize $VmSize 
$VirtualMachine = Set-AzureRmVMOperatingSystem -VM $VirtualMachine -Windows -ComputerName "MainComputer" -Credential $Credential 
$VirtualMachine = Set-AzureRmVMSourceImage -VM $VirtualMachine -PublisherName "MicrosoftWindowsServer" -Offer "WindowsServer" -Skus "2016-Datacenter" -Version "latest"
$osDiskName = "myOsDisk"
$osDiskUri = '{0}vhds/{1}-{2}.vhd' -f $StorageAccount.PrimaryEndpoints.Blob.ToString(), $vmName.ToLower(), $osDiskName

# Sets the operating system disk properties on a virtual machine. 
$VirtualMachine = Set-AzureRmVMOSDisk -VM $VirtualMachine -Name $osDiskName -VhdUri $OsDiskUri -CreateOption FromImage | Add-AzureRmVMNetworkInterface -Id $nic.Id 
Create the virtual machine.
New-AzureRmVM -ResourceGroupName $ResourceGroupName -Location $location -VM $VirtualMachine
```

## Connect to the virtual machine

After the virtual machine is created successfully, create a Remote Desktop connection to the virtual machine from MAS-CON01 or Azure Stack host computer, or from a Windows-based external client if you are connected through VPN . To remote into the virtual machine that you created in previous steps, you need its IP address. Run the following command to get the public IP address  of the virtual machine: 

```powershell
Get-AzureRmPublicIpAddress -ResourceGroupName $ResourceGroupName | Select IpAddress
```
 
Use the following command to create a Remote Desktop session with the virtual machine. Replace the IP address with the publicIPAddress of your virtual machine. When prompted, enter the username and password used when creating the virtual machine.

```powershell
mstsc /v:<publicIpAddress>
```
## Delete the virtual machine

When no longer needed, use the following command to remove the resource group that contains the virtual machine  and its related resources:

```powershell
Remove-AzureRmResourceGroup -Name $ResourceGroupName
```

## Next steps

* [Overview](azure-stack-storage-overview.md)
* [Differences and considerations](azure-stack-acs-differences-tp2.md)
