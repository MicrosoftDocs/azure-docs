---
title: Enable end-to-end encryption using encryption at host - Azure CLI - managed disks
description: Use encryption at host to enable end-to-end encryption on your Azure managed disks.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 03/28/2023
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions, devx-track-azurecli
---

# Use the Azure CLI to enable end-to-end encryption using encryption at host

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

When you enable encryption at host, data stored on the VM host is encrypted at rest and flows encrypted to the Storage service. For conceptual information on encryption at host, and other managed disk encryption types, see [Encryption at host - End-to-end encryption for your VM data](../disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data).

## Restrictions

[!INCLUDE [virtual-machines-disks-encryption-at-host-restrictions](../../../includes/virtual-machines-disks-encryption-at-host-restrictions.md)]

### Supported VM sizes

The complete list of supported VM sizes can be pulled programmatically. To learn how to retrieve them programmatically, see the [Finding supported VM sizes](#finding-supported-vm-sizes) section.
Upgrading the VM size results in validation to check if the new VM size supports the EncryptionAtHost feature.

## Prerequisites

You must enable the feature for your subscription before you use the EncryptionAtHost property for your VM/VMSS. Use the following steps to enable the feature for your subscription:

- Execute the following command to register the feature for your subscription

```azurecli
az feature register --namespace Microsoft.Compute --name EncryptionAtHost
```
 
- Check that the registration state is **Registered** (takes a few minutes) using the command below before trying out the feature.

```azurecli
az feature show --namespace Microsoft.Compute --name EncryptionAtHost
```


### Create resources

> [!NOTE]
> This section only applies to configurations with customer-managed keys. If you're using platform-managed keys, you can skip to the [Example scripts](#example-scripts) section.

Once the feature is enabled, you need to set up a DiskEncryptionSet and either an [Azure Key Vault](../../key-vault/general/overview.md) or an [Azure Key Vault Managed HSM](../../key-vault/managed-hsm/overview.md).

[!INCLUDE [virtual-machines-disks-encryption-create-key-vault-cli](../../../includes/virtual-machines-disks-encryption-create-key-vault-cli.md)]

## Example scripts

### Create a VM with encryption at host enabled with customer-managed keys. 

Create a VM with managed disks using the resource URI of the DiskEncryptionSet created earlier to encrypt cache of OS and data disks with customer-managed keys. The temp disks are encrypted with platform-managed keys. 

```azurecli
rgName=yourRGName
vmName=yourVMName
location=eastus
vmSize=Standard_DS2_v2
image=UbuntuLTS 
diskEncryptionSetName=yourDiskEncryptionSetName

diskEncryptionSetId=$(az disk-encryption-set show -n $diskEncryptionSetName -g $rgName --query [id] -o tsv)

az vm create -g $rgName \
-n $vmName \
-l $location \
--encryption-at-host \
--image $image \
--size $vmSize \
--generate-ssh-keys \
--os-disk-encryption-set $diskEncryptionSetId \
--data-disk-sizes-gb 128 128 \
--data-disk-encryption-sets $diskEncryptionSetId $diskEncryptionSetId
```

### Create a VM with encryption at host enabled with platform-managed keys. 

Create a VM with encryption at host enabled to encrypt cache of OS/data disks and temp disks with platform-managed keys. 

```azurecli
rgName=yourRGName
vmName=yourVMName
location=eastus
vmSize=Standard_DS2_v2
image=UbuntuLTS 

az vm create -g $rgName \
-n $vmName \
-l $location \
--encryption-at-host \
--image $image \
--size $vmSize \
--generate-ssh-keys \
--data-disk-sizes-gb 128 128 \
```

### Update a VM to enable encryption at host. 

```azurecli
rgName=yourRGName
vmName=yourVMName

az vm update -n $vmName \
-g $rgName \
--set securityProfile.encryptionAtHost=true
```

### Check the status of encryption at host for a VM

```azurecli
rgName=yourRGName
vmName=yourVMName

az vm show -n $vmName \
-g $rgName \
--query [securityProfile.encryptionAtHost] -o tsv
```


### Update a VM to disable encryption at host. 

You must deallocate your VM before you can disable encryption at host.

```azurecli
rgName=yourRGName
vmName=yourVMName

az vm update -n $vmName \
-g $rgName \
--set securityProfile.encryptionAtHost=false
```

### Create a Virtual Machine Scale Set with encryption at host enabled with customer-managed keys. 

Create a Virtual Machine Scale Set with managed disks using the resource URI of the DiskEncryptionSet created earlier to encrypt cache of OS and data disks with customer-managed keys. The temp disks are encrypted with platform-managed keys. 

```azurecli
rgName=yourRGName
vmssName=yourVMSSName
location=westus2
vmSize=Standard_DS3_V2
image=UbuntuLTS 
diskEncryptionSetName=yourDiskEncryptionSetName

diskEncryptionSetId=$(az disk-encryption-set show -n $diskEncryptionSetName -g $rgName --query [id] -o tsv)

az vmss create -g $rgName \
-n $vmssName \
--encryption-at-host \
--image UbuntuLTS \
--upgrade-policy automatic \
--admin-username azureuser \
--generate-ssh-keys \
--os-disk-encryption-set $diskEncryptionSetId \
--data-disk-sizes-gb 64 128 \
--data-disk-encryption-sets $diskEncryptionSetId $diskEncryptionSetId
```

### Create a Virtual Machine Scale Set with encryption at host enabled with platform-managed keys. 

Create a Virtual Machine Scale Set with encryption at host enabled to encrypt cache of OS/data disks and temp disks with platform-managed keys. 

```azurecli
rgName=yourRGName
vmssName=yourVMSSName
location=westus2
vmSize=Standard_DS3_V2
image=UbuntuLTS 

az vmss create -g $rgName \
-n $vmssName \
--encryption-at-host \
--image UbuntuLTS \
--upgrade-policy automatic \
--admin-username azureuser \
--generate-ssh-keys \
--data-disk-sizes-gb 64 128 \
```

### Update a Virtual Machine Scale Set to enable encryption at host. 

```azurecli
rgName=yourRGName
vmssName=yourVMName

az vmss update -n $vmssName \
-g $rgName \
--set virtualMachineProfile.securityProfile.encryptionAtHost=true
```

### Check the status of encryption at host for a Virtual Machine Scale Set

```azurecli
rgName=yourRGName
vmssName=yourVMName

az vmss show -n $vmssName \
-g $rgName \
--query [virtualMachineProfile.securityProfile.encryptionAtHost] -o tsv
```

### Update a Virtual Machine Scale Set to disable encryption at host. 

You can disable encryption at host on your Virtual Machine Scale Set but, this will only affect VMs created after you disable encryption at host. For existing VMs, you must deallocate the VM, [disable encryption at host on that individual VM](#update-a-vm-to-disable-encryption-at-host), then reallocate the VM.

```azurecli
rgName=yourRGName
vmssName=yourVMName

az vmss update -n $vmssName \
-g $rgName \
--set virtualMachineProfile.securityProfile.encryptionAtHost=false
```

## Finding supported VM sizes

Legacy VM Sizes aren't supported. You can find the list of supported VM sizes by either using resource SKU APIs or the Azure PowerShell module. You can't find the supported sizes using the CLI.

When calling the [Resource Skus API](/rest/api/compute/resourceskus/list), check that the `EncryptionAtHostSupported` capability is set to **True**.

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

For the Azure PowerShell module, use the [Get-AzComputeResourceSku](/powershell/module/az.compute/get-azcomputeresourcesku) cmdlet.

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

## Next steps

Now that you've created and configured these resources, you can use them to secure your managed disks. The following link contains example scripts, each with a respective scenario, that you can use to secure your managed disks.

[Azure Resource Manager template samples](https://github.com/Azure-Samples/managed-disks-powershell-getting-started/tree/master/EncryptionAtHost)
