---
title: Enable end-to-end encryption using encryption at host - Azure CLI - managed disks
description: Use encryption at host to enable end-to-end encryption on your Azure managed disks.
author: roygara
ms.service: virtual-machines
ms.topic: how-to
ms.date: 08/24/2020
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions, devx-track-azurecli
---

# Use the Azure CLI to enable end-to-end encryption using encryption at host

When you enable encryption at host, data stored on the VM host is encrypted at rest and flows encrypted to the Storage service. For conceptual information on encryption at host, as well as other managed disk encryption types, see [Encryption at host - End-to-end encryption for your VM data](../disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data).

## Restrictions

[!INCLUDE [virtual-machines-disks-encryption-at-host-restrictions](../../../includes/virtual-machines-disks-encryption-at-host-restrictions.md)]

### Supported VM sizes

[!INCLUDE [virtual-machines-disks-encryption-at-host-suported-sizes](../../../includes/virtual-machines-disks-encryption-at-host-suported-sizes.md)]

The complete list of supported VM sizes can be pulled programmatically. To learn how to retrieve them programmatically, refer to the [Finding supported VM sizes](#finding-supported-vm-sizes) section.
Upgrading the VM size will result in validation to check if the new VM size supports the EncryptionAtHost feature.

## Prerequisites

You must enable the feature for your subscription before you use the EncryptionAtHost property for your VM/VMSS. Please follow the steps below to enable the feature for your subscription:

1.	Execute the following command to register the feature for your subscription

    ```azurecli
    az feature register --namespace Microsoft.Compute --name EncryptionAtHost
    ```
 
2.	Please check that the registration state is Registered (takes a few minutes) using the command below before trying out the feature.

    ```azurecli
    az feature show --namespace Microsoft.Compute --name EncryptionAtHost
    ```


### Create an Azure Key Vault and DiskEncryptionSet

Once the feature is enabled, you'll need to set up an Azure Key Vault and a DiskEncryptionSet, if you haven't already.

[!INCLUDE [virtual-machines-disks-encryption-create-key-vault-cli](../../../includes/virtual-machines-disks-encryption-create-key-vault-cli.md)]

## Examples

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

### Create a virtual machine scale set with encryption at host enabled with customer-managed keys. 

Create a virtual machine scale set with managed disks using the resource URI of the DiskEncryptionSet created earlier to encrypt cache of OS and data disks with customer-managed keys. The temp disks are encrypted with platform-managed keys. 

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

### Create a virtual machine scale set with encryption at host enabled with platform-managed keys. 

Create a virtual machine scale set with encryption at host enabled to encrypt cache of OS/data disks and temp disks with platform-managed keys. 

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

### Update a virtual machine scale set to enable encryption at host. 

```azurecli
rgName=yourRGName
vmssName=yourVMName

az vmss update -n $vmssName \
-g $rgName \
--set virtualMachineProfile.securityProfile.encryptionAtHost=true
```

### Check the status of encryption at host for a virtual machine scale set

```azurecli
rgName=yourRGName
vmssName=yourVMName

az vmss show -n $vmssName \
-g $rgName \
--query [virtualMachineProfile.securityProfile.encryptionAtHost] -o tsv
```

## Finding supported VM sizes

Legacy VM Sizes are not supported. You can find the list of supported VM sizes by either:

Calling the [Resource Skus API](/rest/api/compute/resourceskus/list) and checking that the `EncryptionAtHostSupported` capability is set to **True**.

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

Or, calling the [Get-AzComputeResourceSku](/powershell/module/az.compute/get-azcomputeresourcesku) PowerShell cmdlet.

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
