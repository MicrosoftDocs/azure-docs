---
title: Preview: Deploy a Trusted Launch VM using PowerShell
description: Deploy a VM that uses Trusted Launch by using Azure PowerShell. 
author: cynthn
ms.author: cynthn
ms.service: virtual-machines
ms.subservice: security
ms.topic: how-to 
ms.date: 02/04/2020
ms.custom: template-how-to 
---


# Deploy a VM with Trusted Launch enabled using Azure PowerShell (preview)

Azure offers [Trusted Launch](trusted-launch.md) as a seamless way to bolster the security of generation 2 VMs. Designed to protect against advanced and persistent attack techniques, Trusted Launch is comprised of several infrastructure technologies, including vTPM and secure boot.

## Prerequisites

Trusted Launch requires Azure PowerShell version x.x.x.

## Create a Linux VM

$resourceGroupName = "myResourceGroup"
$location = "East US"
$vmName = "myVM"

# Define a credential object
$securePassword = ConvertTo-SecureString ' ' -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential ("azureuser", $securePassword)

# Create a virtual machine configuration
$vmConfig = New-AzVMConfig `
  -VMName "myVM" `
  -VMSize "Standard_B1s" | `
Set-AzVMOperatingSystem `
  -Linux `
  -ComputerName $vmName `
  -Credential $cred `
  -DisablePasswordAuthentication 
  -ProvisionVMAgent `
  -EnableAutoUpdate | `
Set-AzVMSourceImage `
  -PublisherName "Canonical" `
  -Offer "UbuntuServer" `
  -Skus "18.04-LTS" `
  -Version "latest" | `
Set-AzVmUefi `
  -VM $vm 
  -EnableVtpm $vtpm `
  -EnableSecureBoot $secureboot 

New-AzResourceGroup -Name $resourceGroup -Location $location
$subnetConfig = New-AzVirtualNetworkSubnetConfig `
   -Name mySubnet -AddressPrefix 192.168.1.0/24
$vnet = New-AzVirtualNetwork -ResourceGroupName $resourceGroup `
   -Location $location -Name MYvNET -AddressPrefix 192.168.0.0/16 `
   -Subnet $subnetConfig
$pip = New-AzPublicIpAddress -ResourceGroupName $resourceGroup -Location $location `
  -Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4
$nsgRuleRDP = New-AzNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
  -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 3389 -Access Allow
$nsg = New-AzNetworkSecurityGroup -ResourceGroupName $resourceGroup -Location $location `
  -Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP
$nic = New-AzNetworkInterface -Name myNic -ResourceGroupName $resourceGroup -Location $location `
  -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id


# Configure the SSH key
$sshPublicKey = cat ~/.ssh/id_rsa.pub
Add-AzVMSshPublicKey `
  -VM $vmconfig `
  -KeyData $sshPublicKey `
  -Path "/home/azureuser/.ssh/authorized_keys"

# Create the VM
New-AzVM `
  -ResourceGroupName "myResourceGroup" `
  -Location eastus -VM $vmConfig
```
 

$vm = New-AzVMConfig -VMName $vmName -VMSize $vmSize | 

Set-AzVMOperatingSystem -VM $vm -Windows -ComputerName $vmName -Credential $credential -ProvisionVMAgent -EnableAutoUpdate | 

Add-AzVMNetworkInterface -VM $vm -Id $nic.Id | 

Set-AzVMSourceImage -VM $vm -PublisherName $publisherName -Offer $offer -Skus $sku -Version $version | 

Set-AzVMOSDisk -VM $vm -StorageAccountType $stoacctType -CreateOption "FromImage" | 

Set-AzVmUefi -VM $vm -EnableVtpm $vtpm -EnableSecureBoot $secureboot 

New-AzVM -ResourceGroupName $ResourceGroupName -Location $LocationName -VM $vm 


## Create a Windows VM



```azurepowershell-interactive
$resourceGroup = "myResourceGroup"
$location = "East US"
$vmName = "myVM"
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."
New-AzResourceGroup -Name $resourceGroup -Location $location
$subnetConfig = New-AzVirtualNetworkSubnetConfig `
   -Name mySubnet -AddressPrefix 192.168.1.0/24
$vnet = New-AzVirtualNetwork -ResourceGroupName $resourceGroup `
   -Location $location -Name MYvNET -AddressPrefix 192.168.0.0/16 `
   -Subnet $subnetConfig
$pip = New-AzPublicIpAddress -ResourceGroupName $resourceGroup -Location $location `
  -Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4
$nsgRuleRDP = New-AzNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
  -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 3389 -Access Allow
$nsg = New-AzNetworkSecurityGroup -ResourceGroupName $resourceGroup -Location $location `
  -Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP
$nic = New-AzNetworkInterface -Name myNic -ResourceGroupName $resourceGroup -Location $location `
  -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration and set it to use Trusted Launch

$vmConfig = New-AzVMConfig -VMName $vmName -VMSize Standard_D1  | `
Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred | `
Set-AzVMSourceImage -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2016-Datacenter -Version latest | `
Add-AzVMNetworkInterface -Id $nic.Id

New-AzVM -ResourceGroupName $resourceGroup -Location $location -VM $vmConfig
## Create a scale-set

$VMSS = New-AzVmssConfig -Location $LOC -SkuCapacity 2 -SkuName $skuName -UpgradePolicyMode "Automatic" ` 

    | Add-AzVmssNetworkInterfaceConfiguration -Name $NicName -Primary $True -IPConfiguration $IPCfg ` 

    | Add-AzVmssNetworkInterfaceConfiguration -Name $NicName  -IPConfiguration $IPCfg ` 

    | Set-AzVmssOSProfile -ComputerNamePrefix $namePrefix  -AdminUsername $AdminUsername -AdminPassword $AdminPassword ` 

    | Set-AzVmssStorageProfile -OsDiskCreateOption 'FromImage' -OsDiskCaching "None" ` 

    -ImageReferenceOffer $Offer -ImageReferenceSku $Sku -ImageReferenceVersion $Version ` 

    -ImageReferencePublisher $PublisherName ` 

    | Add-AzVmssExtension -Name $ExtName -Publisher $Publisher -Type $ExtType -TypeHandlerVersion $ExtVer -AutoUpgradeMinorVersion $True ` 

    | Set-AzVmssUefi -EnableVtpm $true -EnableSecureBoot $true 

 
 

New-AzVmss -ResourceGroupName $RGName -Name $VMSSName -VirtualMachineScaleSet $VMSS; 

 

## Add custom Kernel Module signing keys 

Use the serial console to add custom kernel module signing keys to your VM.

1.	Enable Azure Serial Console for Linux.
2.	Log on to the VM using Azure Serial Console.
3.	Execute mokutil command as required:      
 
4.	Reboot the machine from the serial console by typing `restart`.
 
5.	This will trigger a reboot, and soon a countdown for 10 s will begin. It is little difficult to spot:
 
6.	Press up or down key to interrupt and wait in UEFI console mode. If the timer is not interrupted booting process continues and all the MOK changes are lost:
 
7.	Take appropriate MOK action.






## Next steps

You can also use the portal to deploy a VM with Trusted Launch enable.
