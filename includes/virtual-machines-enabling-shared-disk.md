---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 02/03/2020
 ms.author: rogarana
 ms.custom: include file
---

Azure shared disks (preview) is a new feature for Azure managed disks. Enabling shared disks allows you to attach a managed disk to multiple virtual machines (VMs) simultaneously. Attaching a managed disk to multiple VMs allows you to either deploy new or migrate existing clustered applications to Azure. The VMs in the cluster can read or write to your attached disk based on the reservation chosen by the clustered application using [SCSI Persistent Reservations](https://www.t10.org/members/w_spc3.htm) (SCSI PR). SCSI PR is a well-known industry standard leveraged by applications running on Storage Area Network (SAN) on-premises. Enabling SCSI PR on a managed disk allows you to migrate these applications to Azure as-is.

If you're interested, [sign up for our preview](https://aka.ms/shareddisksignup).

## Limitations

[!INCLUDE [virtual-machines-disks-shared-disk-limitations](virtual-machines-disks-shared-disk-limitations.md)]

## Disk sizes

[!INCLUDE [virtual-machines-disks-shared-disk-sizes](virtual-machines-disks-shared-disk-sizes.md)]

## Deploy an Azure shared disk

To deploy a managed disk with the shared disk feature enabled, use the new property `maxShares` and define a value `>1`. This will make the disk shareable across multiple VMs.

> [!IMPORTANT]
> The value of `maxShares` can only be set or changed when a disk is unmounted from all VMs. See the [Disk sizes](#disk-sizes) for the allowed values for `maxShares`.

Before using the following template, replace `[parameters('dataDiskName')]`, `[resourceGroup().location]`, `[parameters('dataDiskSizeGB')]`, and `[parameters('maxShares')]` with your own values.

```json
{ 
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "dataDiskName": {
      "type": "string",
      "defaultValue": "mySharedDisk"
    },
    "dataDiskSizeGB": {
      "type": "int",
      "defaultValue": 1024
    },
    "maxShares": {
      "type": "int",
      "defaultValue": 2
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/disks",
      "name": "[parameters('dataDiskName')]",
      "location": "[resourceGroup().location]",
      "apiVersion": "2019-07-01",
      "sku": {
        "name": "Premium_LRS"
      },
      "properties": {
        "creationData": {
          "createOption": "Empty"
        },
        "diskSizeGB": "[parameters('dataDiskSizeGB')]",
        "maxShares": "[parameters('maxShares')]"
      }
    }
  ] 
}
```

### Using Azure shared disks with your VMs

Once you have deployed a shared disk with `maxShares>1`, you can mount the disk to one or more of your VMs.

```azurepowershell-interactive
$vm = New-AzVm -ResourceGroupName "mySharedDiskRG" -Name "myVM" -Location "WestCentralUS" -VirtualNetworkName "myVnet" -SubnetName "mySubnet" -SecurityGroupName "myNetworkSecurityGroup" -PublicIpAddressName "myPublicIpAddress" 

$vm = Add-AzVMDataDisk -VM $vm -Name "mySharedDisk" -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun 0
```

## Supported SCSI PR commands

Once you've mounted the shared disk on your VMs in your cluster, you can establish quorum and read/write to the disk using SCSI PR. The following PR commands are available when using Azure shared disks:

To interact with the disk, start with the persistent-reservation-action list:

```
PR_REGISTER_KEY 

PR_REGISTER_AND_IGNORE 

PR_GET_CONFIGURATION 

PR_RESERVE 

PR_PREEMPT_RESERVATION 

PR_CLEAR_RESERVATION 

PR_RELEASE_RESERVATION 
```

When using PR_RESERVE, PR_PREEMPT_RESERVATION, or  PR_RELEASE_RESERVATION, provide one of the following persistent-reservation-type:

```
PR_NONE 

PR_WRITE_EXCLUSIVE 

PR_EXCLUSIVE_ACCESS 

PR_WRITE_EXCLUSIVE_REGISTRANTS_ONLY 

PR_EXCLUSIVE_ACCESS_REGISTRANTS_ONLY 

PR_WRITE_EXCLUSIVE_ALL_REGISTRANTS 

PR_EXCLUSIVE_ACCESS_ALL_REGISTRANTS 
```

You will also need to provide a persistent-reservation-key when using PR_RESERVE, PR_REGISTER_AND_IGNORE, PR_REGISTER_KEY, PR_PREEMPT_RESERVATION, PR_CLEAR_RESERVATION, or PR_RELEASE-RESERVATION.

If any commands you expect to be in the list are missing, contact us at SharedDiskFeedback@microsoft .com