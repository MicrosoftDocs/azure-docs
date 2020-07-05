---
title: Enable end-to-end encryption for Azure managed disks
description: How to enable end-to-end encryption on Azure managed disks.
author: roygara
ms.service: virtual-machines
ms.topic: how-to
ms.date: 07/05/2020
ms.author: rogarana
ms.subservice: disks
---

# Enable end-to-end encryption

Azure Disk Storage offers end-to-end encryption for managed disks, allowing you to have double encryption at rest and in transit, if you choose. For conceptual information on end-to-end encryption, as well as other managed disk encryption types, see [Server-side encryption of Azure managed disks](linux/disk-encryption.md#end-to-end-encryption)

## Restrictions

1.	End-to-end encryption is currently available only in the USCentralEUAP region.
1.	You cannot enable the feature if you have enabled Azure Disks Encryption (guest-VM encryption using bitlocker/VM-Decrypt) enabled on your VMs/VMSSes.
1.	You have to deallocate your existing VMs to enable the encryption.
1.	You can enable the encryption for existing VMSS. However, only new VMs created after enabling the encryption are automatically encrypted.
1.	Legacy VM Sizes are not supported.

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

You must enable the feature for your subscription before you use the **EncryptionAtHost** property for your VM/VMSS. The following steps will enable the feature for your subscription:

1.	Use the following command to register the feature for your subscription:
 `Register-AzProviderFeature -FeatureName "EncryptionAtHost" -ProviderNamespace "Microsoft.Compute"` 
1.	Registering can take a few minutes, so you can check the registration state using the following command:
 `Get-AzProviderFeature -FeatureName "EncryptionAtHost" -ProviderNamespace "Microsoft.Compute"  `

### Create an Azure Key Vault and DiskEncryptionSet

Now that the feature is enabled, you can begin to 

[!INCLUDE [virtual-machines-disks-encryption-create-key-vault-powershell](../../includes/virtual-machines-disks-encryption-create-key-vault-powershell.md)]

## Enable end to end encryption

### Disks encrypted with customer managed keys with server-side encryption

1.	Follow the instructions here for creating a Key Vault for storing your keys and a DiskEncryptionSet pointing to a key in the Key Vault
1.	Create a VM with managed disks that are encrypted with end-to-end encryption by passing the resource URI of the DiskEncryptionSet created in the step #1 to the sample template [CreateVMWithDisksEncryptedInTransitAtRestWithCMK.json](https://github.com/ramankumarlive/manageddisksendtoendencryptionpreview/blob/master/CreateVMWithDisksEncryptedInTransitAtRestWithCMK.json)

```PowerShell
$password=ConvertTo-SecureString -String "yourPassword" -AsPlainText -Force
New-AzResourceGroupDeployment -ResourceGroupName yourResourceGroupName `
  -TemplateUri "https://raw.githubusercontent.com/ramankumarlive/manageddisksendtoendencryptionpreview/master/CreateVMWithDisksEncryptedInTransitAtRestWithCMK.json" `
  -virtualMachineName "yourVMName" `
  -adminPassword $password `
  -vmSize "Standard_DS3_V2" `
  -diskEncryptionSetId "/subscriptions/dd80b94e-0463-4a65-8d04-c94f403879dc/resourceGroups/yourResourceGroupName/providers/Microsoft.Compute/diskEncryptionSets/yourDESName" `
  -region "CentralUSEUAP"
```

### Disks encrypted with platform-managed keys with server-side encryption

1.	Create a VM with managed disks using the sample template [CreateVMWithDisksEncryptedInTransitAtRestWithPMK.json](https://github.com/ramankumarlive/manageddisksendtoendencryptionpreview/blob/master/CreateVMWithDisksEncryptedInTransitAtRestWithPMK.json)

```PowerShell
$password=ConvertTo-SecureString -String "Password@123" -AsPlainText -Force
New-AzResourceGroupDeployment -ResourceGroupName CMKTesting `
  -TemplateUri "https://raw.githubusercontent.com/ramankumarlive/manageddisksendtoendencryptionpreview/master/CreateVMWithDisksEncryptedInTransitAtRestWithPMK.json" `
  -virtualMachineName "ramane2evm12" `
  -adminPassword $password `
  -vmSize "Standard_DS3_V2" `
  -region "CentralUSEUAP"
```