---
title: Encrypt disks for Azure scale sets with Azure PowerShell
description: Learn how to use Azure PowerShell to encrypt VM instances and attached disks in a Windows Virtual Machine Scale Set
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: disks
ms.date: 11/22/2022
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-azurepowershell

---

# Encrypt OS and attached data disks in a Virtual Machine Scale Set with Azure PowerShell

The Azure PowerShell module is used to create and manage Azure resources from the PowerShell command line or in scripts.  This article shows you how to use Azure PowerShell to create and encrypt a Virtual Machine Scale Set. For more information on applying Azure Disk Encryption to a Virtual Machine Scale Set, see [Azure Disk Encryption for Virtual Machine Scale Sets](disk-encryption-overview.md).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create an Azure Key Vault enabled for disk encryption

Azure Key Vault can store keys, secrets, or passwords that allow you to securely implement them in your applications and services. Cryptographic keys are stored in Azure Key Vault using software-protection, or you can import or generate your keys in Hardware Security Modules (HSMs) certified to FIPS 140-2 level 2 standards. These cryptographic keys are used to encrypt and decrypt virtual disks attached to your VM. You retain control of these cryptographic keys and can audit their use.

Create a Key Vault with [New-AzKeyVault](/powershell/module/az.keyvault/new-azkeyvault). To allow the Key Vault to be used for disk encryption, set the *EnabledForDiskEncryption* parameter. The following example also defines variables for resource group name, Key Vault Name, and location. Provide your own unique Key Vault name:

```azurepowershell-interactive
$rgName="myResourceGroup"
$vaultName="myuniquekeyvault"
$location = "EastUS"

New-AzResourceGroup -Name $rgName -Location $location
New-AzKeyVault -VaultName $vaultName -ResourceGroupName $rgName -Location $location -EnabledForDiskEncryption
```

### Use an existing Key Vault

This step is only required if you have an existing Key Vault that you wish to use with disk encryption. Skip this step if you created a Key Vault in the previous section.

You can enable an existing Key Vault in the same subscription and region as the scale set for disk encryption with [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/Set-AzKeyVaultAccessPolicy). Define the name of your existing Key Vault in the *$vaultName* variable as follows:


```azurepowershell-interactive
$vaultName="myexistingkeyvault"
Set-AzKeyVaultAccessPolicy -VaultName $vaultName -EnabledForDiskEncryption
```

## Create a scale set

First, set an administrator username and password for the VM instances with [Get-Credential](/powershell/module/microsoft.powershell.security/get-credential):

```azurepowershell-interactive
$cred = Get-Credential
```

Now create a Virtual Machine Scale Set with [New-AzVmss](/powershell/module/az.compute/new-azvmss). To distribute traffic to the individual VM instances, a load balancer is also created. The load balancer includes rules to distribute traffic on TCP port 80, as well as allow remote desktop traffic on TCP port 3389 and PowerShell remoting on TCP port 5985:

```azurepowershell-interactive
$vmssName="myScaleSet"

New-AzVmss `
    -ResourceGroupName $rgName `
    -VMScaleSetName $vmssName `
    -OrchestrationMode "flexible" `
    -Location $location `
    -VirtualNetworkName "myVnet" `
    -SubnetName "mySubnet" `
    -PublicIpAddressName "myPublicIPAddress" `
    -LoadBalancerName "myLoadBalancer" `
    -UpgradePolicy "Automatic" `
    -Credential $cred
```

## Enable encryption

To encrypt VM instances in a scale set, first get some information on the Key Vault URI and resource ID with [Get-AzKeyVault](/powershell/module/az.keyvault/Get-AzKeyVault). These variables are used to then start the encryption process with [Set-AzVmssDiskEncryptionExtension](/powershell/module/az.compute/Set-AzVmssDiskEncryptionExtension):


```azurepowershell-interactive
$diskEncryptionKeyVaultUrl=(Get-AzKeyVault -ResourceGroupName $rgName -Name $vaultName).VaultUri
$keyVaultResourceId=(Get-AzKeyVault -ResourceGroupName $rgName -Name $vaultName).ResourceId

Set-AzVmssDiskEncryptionExtension -ResourceGroupName $rgName -VMScaleSetName $vmssName `
    -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $keyVaultResourceId -VolumeType "All"
```

When prompted, type *y* to continue the disk encryption process on the scale set VM instances.

### Enable encryption using KEK to wrap the key

You can also use a Key Encryption Key for added security when encrypting the Virtual Machine Scale Set.

```azurepowershell-interactive
$diskEncryptionKeyVaultUrl=(Get-AzKeyVault -ResourceGroupName $rgName -Name $vaultName).VaultUri
$keyVaultResourceId=(Get-AzKeyVault -ResourceGroupName $rgName -Name $vaultName).ResourceId
$keyEncryptionKeyUrl = (Get-AzKeyVaultKey -VaultName $vaultName -Name $keyEncryptionKeyName).Key.kid;

Set-AzVmssDiskEncryptionExtension -ResourceGroupName $rgName -VMScaleSetName $vmssName `
    -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $keyVaultResourceId `
    -KeyEncryptionKeyUrl $keyEncryptionKeyUrl -KeyEncryptionKeyVaultId $keyVaultResourceId -VolumeType "All"
```

> [!NOTE]
>  The syntax for the value of disk-encryption-keyvault parameter is the full identifier string:</br>
/subscriptions/[subscription-id-guid]/resourceGroups/[resource-group-name]/providers/Microsoft.KeyVault/vaults/[keyvault-name]</br></br>
> The syntax for the value of the key-encryption-key parameter is the full URI to the KEK as in:</br>
https://[keyvault-name].vault.azure.net/keys/[kekname]/[kek-unique-id]

## Check encryption progress

To check on the status of disk encryption, use [Get-AzVmssDiskEncryption](/powershell/module/az.compute/Get-AzVmssDiskEncryption):


```azurepowershell-interactive
Get-AzVmssDiskEncryption -ResourceGroupName $rgName -VMScaleSetName $vmssName
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

If you no longer wish to use encrypted VM instances disks, you can disable encryption with [Disable-AzVmssDiskEncryption](/powershell/module/az.compute/Disable-AzVmssDiskEncryption) as follows:


```azurepowershell-interactive
Disable-AzVmssDiskEncryption -ResourceGroupName $rgName -VMScaleSetName $vmssName
```

## Next steps

- In this article, you used Azure PowerShell to encrypt a Virtual Machine Scale Set. You can also use the [Azure CLI](disk-encryption-cli.md) or [Azure Resource Manager templates](disk-encryption-azure-resource-manager.md).
- If you wish to have Azure Disk Encryption applied after another extension is provisioned, you can use [extension sequencing](virtual-machine-scale-sets-extension-sequencing.md).
