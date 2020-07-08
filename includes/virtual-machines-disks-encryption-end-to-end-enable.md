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

You must enable the feature on your subscription before you can enable end-to-end encryption for your VM/virtual machine scale set.

- Use the following command to register the feature for your subscription:
 `Register-AzProviderFeature -FeatureName "EncryptionAtHost" -ProviderNamespace "Microsoft.Compute"` 
- Registering can take a few minutes, you can check the registration state using the following command:
 `Get-AzProviderFeature -FeatureName "EncryptionAtHost" -ProviderNamespace "Microsoft.Compute"  `

### Create an Azure Key Vault and DiskEncryptionSet

Once you've enabled the feature, you'll need to set up an Azure Key Vault and a DiskEncryptionSet, if you haven't already.

[!INCLUDE [virtual-machines-disks-encryption-create-key-vault-powershell](virtual-machines-disks-encryption-create-key-vault-powershell.md)]

## Enable end to end encryption

Now that you've enabled the feature and set up an Azure Key Vault as well as a DiskEncryptionSet, you can enable end-to-end encryption on your VMs.

Currently, you must use the API in order to enable end-to-end encryption. Using an API version of 2020-06-01 or newer, setting the following two properties on new or existing VMs to enable end-to-end encryption:

`"securityProfile": { "encryptionAtHost": "true" }` and to the `"osDisk"` and `"dataDisks"` properties, add `"diskEncryptionSet": {"id": "[parameters('diskEncryptionSetId')]"}`. Replace diskEncryptionSetId with the resource URI of the DiskEncryptionSet you created earlier.

## Example scripts

Alternatively, you may use the following scripts that will create VMs using end-to-end encryption, for you.

### Disks encrypted with customer-managed keys with server-side encryption

The following script creates a VM using end-to-end encryption on VMs that are using customer-managed keys with server-side encryption:

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

The following script creates a VM with disks using end-to-end encryption on VMs that have been configured to use platform-managed keys with server-side encryption:

```PowerShell
$password=ConvertTo-SecureString -String "<yourPassword>" -AsPlainText -Force
New-AzResourceGroupDeployment -ResourceGroupName CMKTesting `
  -TemplateUri "https://raw.githubusercontent.com/ramankumarlive/manageddisksendtoendencryptionpreview/master/CreateVMWithDisksEncryptedInTransitAtRestWithPMK.json" `
  -virtualMachineName "<yourVMName>" `
  -adminPassword $password `
  -vmSize "<yourVMSize>" `
  -region "<yourRegion>"
```