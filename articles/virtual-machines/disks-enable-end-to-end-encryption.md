---
title: Enable end-to-end encryption for Azure managed disks
description: How to enable end-to-end encryption on Azure managed disks.
author: roygara
ms.service: virtual-machines
ms.topic: how-to
ms.date: 07/07/2020
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions
---

# Enable end-to-end encryption

Azure Disk Storage offers end-to-end encryption for managed disks, allowing you to have double encryption at rest and in transit. This article contains scripts that will deployFor conceptual information on end-to-end encryption, as well as other managed disk encryption types, see [Server-side encryption of Azure managed disks](linux/disk-encryption.md#end-to-end-encryption)

## Restrictions

1.	End-to-end encryption is currently available only in the USCentralEUAP region.
1.	You cannot enable the feature if you have enabled Azure Disks Encryption (guest-VM encryption using bitlocker/VM-Decrypt) enabled on your VMs/VMSSes.
1.	You have to deallocate your existing VMs to enable the encryption.
1.	You can enable the encryption for existing VMSS. However, only new VMs created after enabling the encryption are automatically encrypted.

### Supported VM sizes

Only the following VM sizes currently support end-to-end encryption:

|Type  |Supported  |Not supported  |
|---------|---------|---------|
|General purpose     | Dv3, Dav4, Dv2, Av2        | B, DSv2, Dsv3, DC, DCv2, Dasv4        |
|Compute optimized     |         |         |
|Memory optimized     | Ev3, Eav4        | DSv2, Esv3, M, Mv2, Easv4        |
|Storage optimized     |         | Ls, Lsv2 (NVMe disks not encrypted)        |
|GPU     | NC, NV        | NCv2, NCv3, ND, NVv3, NVv4, NDv2 (preview)        |
|High performance compute     | H        | HB, HC, HBv2        |
|Previous generations     | F, A, D, L, G        | DS, GS, Fs, NVv2        |

## Prerequisites

You must enable the feature on your subscription before you can enable end-to-end encryption for your VM/VMSS.

- Use the following command to register the feature for your subscription:
 `Register-AzProviderFeature -FeatureName "EncryptionAtHost" -ProviderNamespace "Microsoft.Compute"` 
- Registering can take a few minutes, you can check the registration state using the following command:
 `Get-AzProviderFeature -FeatureName "EncryptionAtHost" -ProviderNamespace "Microsoft.Compute"  `

### Create an Azure Key Vault and DiskEncryptionSet

Once you've enabled the feature, you'll need to set up an Azure Key Vault and a DiskEncryptionSet, if you haven't already.

[!INCLUDE [virtual-machines-disks-encryption-create-key-vault-powershell](../../includes/virtual-machines-disks-encryption-create-key-vault-powershell.md)]

## Enable end to end encryption

Now that you've enabled the feature and set up an Azure Key Vault as well as a DiskEncryptionSet, you can enable end-to-end encryption on your VMs.

Currently, you must use the API in order to enable end-to-end encryption. Using an API version of 2020-06-01 or newer, setting the following two properties on new or existing VMs to enable end-to-end encryption:

`"securityProfile": { "encryptionAtHost": "true" }` and to the `"osDisk"` and `"dataDisks"` properties, add `"diskEncryptionSet": {"id": "[parameters('diskEncryptionSetId')]"}`. Replace diskEncryptionSetId with the resource URI of the DiskEncryptionSet you created earlier.

## Example scripts

Alternatively, you may use the following scripts that will create VMs using end-to-end encryption, for you.

### Disks encrypted with customer managed keys with server-side encryption

The following script creates a VM using end-to-end encryption on VMs that are using customer-managed keys with server side encryption:

Replace `<yourPassword>`, `<yourVMName>`, `<yourVMSize>`, `<yourDESName>`, `<yoursubscriptionID>`, `<yourResourceGroupName>`, and `<yourRegion>`, then run the script.

```PowerShell
$password=ConvertTo-SecureString -String "<yourPassword>" -AsPlainText -Force
New-AzResourceGroupDeployment -ResourceGroupName yourResourceGroupName `
  -TemplateUri "https://raw.githubusercontent.com/ramankumarlive/manageddisksendtoendencryptionpreview/master/CreateVMWithDisksEncryptedInTransitAtRestWithCMK.json" `
  -virtualMachineName "<yourVMName>" `
  -adminPassword $password `
  -vmSize "<yourVMSize>" `
  -diskEncryptionSetId "/subscriptions/<yoursubscriptionID>/resourceGroups/<yourResourceGroupName>/providers/Microsoft.Compute/diskEncryptionSets/<yourDESName>" `
  -region "<yourRegion>"
```

### Disks encrypted with platform-managed keys with server-side encryption

The following script creates a VM with disks using end-to-end encryption on VMs that have been configured to use platform-managed keys with server side encryption:

```PowerShell
$password=ConvertTo-SecureString -String "<yourPassword>" -AsPlainText -Force
New-AzResourceGroupDeployment -ResourceGroupName CMKTesting `
  -TemplateUri "https://raw.githubusercontent.com/ramankumarlive/manageddisksendtoendencryptionpreview/master/CreateVMWithDisksEncryptedInTransitAtRestWithPMK.json" `
  -virtualMachineName "<yourVMName>" `
  -adminPassword $password `
  -vmSize "<yourVMSize>" `
  -region "<yourRegion>"
```