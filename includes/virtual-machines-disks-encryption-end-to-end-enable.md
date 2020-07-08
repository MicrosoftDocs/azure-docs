---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 07/07/2020
 ms.author: rogarana
 ms.custom: include file
---
## Restrictions

[!INCLUDE [virtual-machines-disks-encryption-at-host-restrictions](virtual-machines-disks-encryption-at-host-restrictions.md)]

### Supported VM sizes

[!INCLUDE [virtual-machines-disks-encryption-at-host-suported-sizes](virtual-machines-disks-encryption-at-host-suported-sizes.md)]

## Prerequisites

You must get the feature enabled for your subscriptions before you use the EncryptionAtHost property for your VM/VMSS. Please send an email to encryptionAtHost@microsoft.com with your subscription Ids to get the feature enabled for your subscriptions.

## Enable encryption at host for disks attached to VM and VMSS using rest API

You can enable the feature by setting a new property EncryptionAtHost under securityProfile of VMs/VMSSs using the API version *2020-06-01* and above.

"securityProfile": { "encryptionAtHost": "true" }

## Enable encryption at host for disks attached to a VM with customer managed keys (CMK) via using PowerShell

1. Follow the instructions [here](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/disk-encryption#setting-up-your-azure-key-vault-and-diskencryptionset) for creating a Key Vault for storing your keys and a DiskEncryptionSet pointing to a key in the Key Vault

2. Create a VM with managed disks using the resource URI of the DiskEncryptionSet created in the step #1 

Replace `<yourPassword>`, `<yourVMName>`, `<yourVMSize>`, `<yourDESName>`, `<yoursubscriptionID>`, `<yourResourceGroupName>`, and `<yourRegion>`, then run the script.

```PowerShell
$password=ConvertTo-SecureString -String "<yourPassword>" -AsPlainText -Force
New-AzResourceGroupDeployment -ResourceGroupName <yourResourceGroupName> `
  -TemplateUri "https://raw.githubusercontent.com/ramankumarlive/manageddisksendtoendencryptionpreview/master/CreateVMWithDisksEncryptedInTransitAtRestWithCMK.json" `
  -virtualMachineName "<yourVMName>" `
  -adminPassword $password `
  -vmSize "<yourVMSize>" `
  -diskEncryptionSetId "/subscriptions/<yoursubscriptionID>/resourceGroups/<yourResourceGroupName>/providers/Microsoft.Compute/diskEncryptionSets/<yourDESName>" `
  -region "<yourRegion>"
```

## Enable encryption at host for disks attached to a VM with with platform managed keys (PMK) via using PowerShell

Replace `<yourPassword>`, `<yourVMName>`, `<yourVMSize>`, `<yourResourceGroupName>`, and `<yourRegion>`, then run the script.

```PowerShell
$password=ConvertTo-SecureString -String "<yourPassword>" -AsPlainText -Force
New-AzResourceGroupDeployment -ResourceGroupName <yourResourceGroupName> `
  -TemplateUri "https://raw.githubusercontent.com/ramankumarlive/manageddisksendtoendencryptionpreview/master/CreateVMWithDisksEncryptedInTransitAtRestWithPMK.json" `
  -virtualMachineName "<yourVMName>" `
  -adminPassword $password `
  -vmSize "<yourVMSize>" `
  -region "<yourRegion>"
```
