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

You may also find the VM sizes programmatically. For details on that, refer to the [Finding supported VM sizes](#finding-supported-vm-sizes) section.

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

## Finding supported VM sizes

Legacy VM Sizes are not supported. You can find the list of supported VM sizes by either:

Calling the [Resource Skus API](https://docs.microsoft.com/rest/api/compute/resourceskus/list) and checking that the   EncryptionAtHostSupported capability is set to True

```json
    {
        "resourceType": "virtualMachines",
        "name": "Standard_DS1_v2",
        "tier": "Standard",
        "size": "DS1_v2",
        "family": "standardDSv2Family",
        "locations": [
        "CentralUSEUAP"
        ],
        "capabilities": [
        {
            "name": "EncryptionAtHostSupported",
            "value": "True"
        }
        ]
    }
```

Or, calling the [Get-AzComputeResourceSku](https://docs.microsoft.com/powershell/module/az.compute/get-azcomputeresourcesku?view=azps-3.8.0) PowerShell cmdlet.

```powershell
$vmSizes=Get-AzComputeResourceSku | where{$_.ResourceType -eq 'virtualMachines' -and $_.Locations.Contains('CentralUSEUAP')} 

foreach($vmSize in $vmSizes)
{
    foreach($capability in $vmSize.capabilities)
    {
        if($capability.Name -eq 'EncryptionAtHostSupported' -and $capability.Value -eq 'true')
        {
            $vmSize

        }

    }
}
```