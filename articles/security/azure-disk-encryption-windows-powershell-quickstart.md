---
title: Create and encryption a Windows VM with Azure PowerShell
description: In this quickstart, you learn how to use Azure PowerShell to create and encrypt a Windows virtual machine
author: msmbaldwin
ms.author: mbaldwin
ms.service: security
ms.topic: quickstart
ms.date: 05/17/2019
---

# Quickstart: Create and encrypt a Windows virtual machine in Azure with PowerShell

The Azure PowerShell module is used to create and manage Azure resources from the PowerShell command line or in scripts. This quickstart shows you how to use the Azure PowerShell module to create a Windows virtual machine (VM), create a Key Vault for the storage of encryption keys, and encrypt the VM. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create a resource group

Create an Azure resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed:

```azurepowershell-interactive
New-AzResourceGroup -Name "myResourceGroup" -Location "EastUS"
```

## Create a virtual machine configuration object 

Before creating a virtual machine, you must first create an object that specifies credentials, a virtual network, a subnet, a public IP address, and other VM attributes. 

```azurepowershell-interactive
$securePassword = ConvertTo-SecureString 'AZUREuserPA$$W0RD' -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential ("azureuser", $securePassword)

# Create a subnet configuration
$subnetConfig = New-AzVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24

# Create a virtual network
$vnet = New-AzVirtualNetwork -ResourceGroupName "myResourceGroup" -Location "EastUS" `
  -Name MYvNET -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig

# Create a public IP address and specify a DNS name
$pip = New-AzPublicIpAddress -ResourceGroupName "myResourceGroup" -Location "EastUS" `
  -Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4

# Create an inbound network security group rule for port 22
$nsgRuleSSH = New-AzNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleSSH  -Protocol Tcp `
  -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 22 -Access Allow

# Create a network security group
$nsg = New-AzNetworkSecurityGroup -ResourceGroupName "myResourceGroup" -Location "EastUS" `
  -Name myNetworkSecurityGroup -SecurityRules $nsgRuleSSH

# Create a virtual network card and associate with public IP address and NSG
$nic = New-AzNetworkInterface -Name myNic -ResourceGroupName "myResourceGroup" -Location "EastUS" `
  -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration
$vmConfig = New-AzVMConfig -VMName "MyVM" -VMSize Standard_D2S_V3 |
Set-AzVMOperatingSystem -Windows -ComputerName "MyVM" -Credential $cred -DisablePasswordAuthentication |
Set-AzVMSourceImage -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2016-Datacenter -Version latest |
Add-AzVMNetworkInterface -Id $nic.Id

# Configure SSH Keys
$sshPublicKey = Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub"
Add-AzVMSshPublicKey -VM $vmconfig -KeyData $sshPublicKey -Path "/home/azureuser/.ssh/authorized_keys"
```



## Create a virtual machine

Create an Azure virtual machine with [New-AzVM](/powershell/module/az.compute/new-azvm). You must supply creditials to the cmdlet. 

```azurepowershell-interactive
New-AzVM -Name MyVM -ResourceGroupName MyResourceGroup -Location EastUS -Credential $cred
```

It will take a few minutes for your VM to be deployed. 

# Create a Key Vault

Azure disk encryption stores its encryption key in an Azure Key Vault. Create a Key Vault with [New-AzKeyvault](/powershell/module/az.keyvault/new-azkeyvault). To enable the Key Vault to store encryption keys, use the -EnabledForDiskEncryption parameter.

> [!Important]
> Each Key Vault must have a unique name. The following example creates a Key Vault named *myKV*, but you must name yours something different.

```azurecli-interactive
New-AzKeyvault -name MyKV -ResourceGroupName myResourceGroup -Location EastUS -EnabledForDiskEncryption
```

## Encrypt the virtual machine

Encrypt your VM with [Set-AzVmDiskEncryptionExtension](/powershell/module/az.compute/set-azvmdiskencryptionextension). 

Set-AzVmDiskEncryptionExtension requires some values from your Key Vault object. You can obtain these values by passing the unique name of your key vault to [Get-AzKeyvault](/powershell/module/az.keyvault/get-azkeyvault).

```azurecli-interactive
$KeyVault = Get-AzKeyVault -VaultName MyKV -ResourceGroupName MyResourceGroup

Set-AzVMDiskEncryptionExtension -ResourceGroupName MyResourceGroup -VMName MyVM -DiskEncryptionKeyVaultUrl $KeyVault.VaultUri -DiskEncryptionKeyVaultId $KeyVault.ResourceId –SkipVmBackup -VolumeType All
```

After a few minutes the process will return, "IsSuccessStatusCode" as "True".

You can verify the encryption process by running [Get-AzVmDiskEncryptionStatus](/powershell/module/az.compute/Get-AzVMDiskEncryptionStatus).

```azurecli-interactive
Get-AzVmDiskEncryptionStatus -VMName MyVM -ResourceGroupName MyResourceGroup
```


When encryption is enabled, you will see the following in the returned output:

```
OsVolumeEncrypted          : EncryptionInProgress
DataVolumesEncrypted       : NotMounted
OsVolumeEncryptionSettings : Microsoft.Azure.Management.Compute.Models.DiskEncryptionSettings
ProgressMessage            : OS disk encryption started
```

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to remove the resource group, VM, and all related resources:

```azurepowershell-interactive
Remove-AzResourceGroup -Name "myResourceGroup"
```

## Next steps

