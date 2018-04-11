---
title: Azure virtual machine scale sets disk encryption | Microsoft Docs
description: Learn how to use Azure PowerShell to encrypt VM instances and attached disks in virtual machine scale sets
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/09/2018
ms.author: iainfou

---
# Encrypt OS and attached data disks in a virtual machine scale set
To protect and safeguard data at rest using industry standard encryption technology, virtual machine scale sets support Azure Disk Encryption (ADE). Encryption can be enabled for Windows and Linux virtual machine scale sets. For more information, see [Azure Disk Encryption for Windows and Linux](../security/azure-security-disk-encryption.md).

> [!NOTE]
>  Azure Disk Encryption for virtual machine scale sets is currently in preview, available in all Azure public regions. 
>
> Scale set VM reimage and upgrade operations are not supported in the current preview. In preview, scale set encryption is recommended only in test environments. In the preview, do not enable disk encryption in production environments where you may need to upgrade an OS image.

Azure disk encryption is supported:
- for scale sets created with managed disks, and not supported for native (or unmanaged) disk scale sets.
- for OS and data volumes in Windows scale sets. Disable encryption is supported for OS and Data volumes for Windows scale sets.
- for data volumes in Linux scale sets. OS disk encryption is NOT supported in the current preview for Linux scale sets.


## Prerequisites
This article requires the Azure PowerShell module version 5.3.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

Register your Azure subsription for the preview of disk encryption for virtual machine scale sets with [Register-AzureRmProviderFeature](/powershell/module/azurerm.resources/register-azurermproviderfeature): 

```powershell
Login-AzureRmAccount
Register-AzureRmProviderFeature -ProviderNamespace Microsoft.Compute -FeatureName "UnifiedDiskEncryption"
```

Wait around 10 minutes until the *Registered* state is returned by [Get-AzureRmProviderFeature](/powershell/module/AzureRM.Resources/Get-AzureRmProviderFeature), then reregister the `Microsoft.Compute` provider: 

```powershell
Get-AzureRmProviderFeature -ProviderNamespace "Microsoft.Compute" -FeatureName "UnifiedDiskEncryption"
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute
```


## Create an Azure Key Vault enabled for disk encryption
Azure Key Vault can store keys, secrets, or passwords that allow you to securely implement them in your applications and services. Cryptographic keys are stored in Azure Key Vault using software-protection, or you can import or generate your keys in Hardware Security Modules (HSMs) certified to FIPS 140-2 level 2 standards. These cryptographic keys are used to encrypt and decrypt virtual disks attached to your VM. You retain control of these cryptographic keys and can audit their use.

Create a Key Vault with [New-AzureRmKeyVault](/powershell/module/azurerm.keyvault/new-azurermkeyvault). To allow the Key Vault to be used for disk encryption, set the *EnabledForDiskEncryption* parameter. The following example also defines variables for resource group name, Key Vault Name, and location. Provide your own unique Key Vault name:

```powershell
$rgName="myResourceGroup"
$vaultName="myuniquekeyvault"
$location = "EastUS"

New-AzureRmResourceGroup -Name $rgName -Location $location
New-AzureRmKeyVault -VaultName $vaultName -ResourceGroupName $rgName -Location $location -EnabledForDiskEncryption
```


### Use an existing Key Vault
This step is only required if you have an existing Key Vault that you wish to use with disk encryption. Skip this step if you created a Key Vault in the previous section.

You can enable an existing Key Vault in the same subscription and region as the scale set for disk encryption with [Set-AzureRmKeyVaultAccessPolicy](/powershell/module/AzureRM.KeyVault/Set-AzureRmKeyVaultAccessPolicy). Define the name of your existing Key Vault in the *$vaultName* variable as follows:

```powershell
$vaultName="myexistingkeyvault"
Set-AzureRmKeyVaultAccessPolicy -VaultName $vaultName -EnabledForDiskEncryption
```


## Create a scale set
First, set an administrator username and password for the VM instances with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```powershell
$cred = Get-Credential
```

Now create a virtual machine scale set with [New-AzureRmVmss](/powershell/module/azurerm.compute/new-azurermvmss). To distribute traffic to the individual VM instances, a load balancer is also created. The load balancer includes rules to distribute traffic on TCP port 80, as well as allow remote desktop traffic on TCP port 3389 and PowerShell remoting on TCP port 5985:

```powershell
$vmssName="myScaleSet"

New-AzureRmVmss `
    -ResourceGroupName $rgName `
    -VMScaleSetName $vmssName `
    -Location $location `
    -VirtualNetworkName "myVnet" `
    -SubnetName "mySubnet" `
    -PublicIpAddressName "myPublicIPAddress" `
    -LoadBalancerName "myLoadBalancer" `
    -UpgradePolicy "Automatic" `
    -Credential $cred
```


## Enable encryption
To encrypt VM instances in a scale set, first get some information on the Key Vault URI and resource ID with [Get-AzureRmKeyVault](/powershell/module/AzureRM.KeyVault/Get-AzureRmKeyVault). These variables are used to then start the encryption process with [Set-AzureRmVmssDiskEncryptionExtension](/powershell/module/AzureRM.Compute/Set-AzureRmVmssDiskEncryptionExtension):

```powershell
$diskEncryptionKeyVaultUrl=(Get-AzureRmKeyVault -ResourceGroupName $rgName -Name $vaultName).VaultUri
$keyVaultResourceId=(Get-AzureRmKeyVault -ResourceGroupName $rgName -Name $vaultName).ResourceId

Set-AzureRmVmssDiskEncryptionExtension -ResourceGroupName $rgName -VMScaleSetName $vmssName `
    -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $keyVaultResourceId –VolumeType "All"
```

When prompted, type *y* to continue the disk encryption process on the scale set VM instances.


## Check encryption progress
To check on the status of disk encryption, use [Get-AzureRmVmssDiskEncryption](/powershell/module/AzureRM.Compute/Get-AzureRmVmssDiskEncryption):

```powershell
Get-AzureRmVmssDiskEncryption -ResourceGroupName $rgName -VMScaleSetName $vmssName
```

When VM instances are encrypted, the *EncryptionSummary* code reports *ProvisioningState/succeeded* as shown in the following example output:

```powershell
ResourceGroupName            : myResourceGroup
VmScaleSetName               : myScaleSet
EncryptionSettings           :
  KeyVaultURL                : https://myuniquekeyvault.vault.azure.net/
  KeyEncryptionKeyURL        :
  KeyVaultResourceId         : /subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.KeyVault/vaults/myuniquekeyvault
  KekVaultResourceId         :
  KeyEncryptionAlgorithm     :
  VolumeType                 : All
  EncryptionOperation        : EnableEncryption
EncryptionSummary[0]         :
  Code                       : ProvisioningState/succeeded
  Count                      : 2
EncryptionEnabled            : True
EncryptionExtensionInstalled : True
```


## Disable encryption
If you no longer wish to use encrypted VM instances disks, you can disable encryption with [Disable-AzureRmVmssDiskEncryption](/powershell/module/AzureRM.Compute/Disable-AzureRmVmssDiskEncryption) as follows:

```powershell
Disable-AzureRmVmssDiskEncryption -ResourceGroupName $rgName -VMScaleSetName $vmssName
```


## Next steps
In this article, you used Azure PowerShell to encrypt a virtual machine scale set. You can also use the [Azure CLI 2.0](virtual-machine-scale-sets-encrypt-disks-cli.md) or templates for [Windows](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-vmss-windows-jumpbox) or [Linux](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-vmss-linux-jumpbox).
