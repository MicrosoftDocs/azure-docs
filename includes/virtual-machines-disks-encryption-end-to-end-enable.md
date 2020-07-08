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

You must get the feature enabled for your subscriptions before you use the EncryptionAtHost property for your VM or virtual machine scale set. Send an email to encryptionAtHost@microsoft .com with your subscription Ids to get the feature enabled for your subscriptions.

### Create an Azure Key Vault and DiskEncryptionSet

Once you've enabled the feature, you'll need to set up an Azure Key Vault and a DiskEncryptionSet, if you haven't already.

[!INCLUDE [virtual-machines-disks-encryption-create-key-vault-powershell](virtual-machines-disks-encryption-create-key-vault-powershell.md)]

## Enable encryption at host for disks attached to VM and virtual machine scale set using rest API

You can enable the feature by setting a new property EncryptionAtHost under securityProfile of VMs/VMSSs using the API version *2020-06-01* and above.

"securityProfile": { "encryptionAtHost": "true" }

## Enable encryption at host for disks attached to a VM with customer-managed keys via using PowerShell

Create a VM with managed disks using the resource URI of the DiskEncryptionSet created in the step #1 

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

## Enable encryption at host for disks attached to a VM with platform-managed keys via using PowerShell

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
