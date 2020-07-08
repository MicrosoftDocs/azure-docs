---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 07/08/2020
 ms.author: rogarana
 ms.custom: include file
---
1. Does not support ultra disks.
1. Currently available only in westus, westus2, eastus, eastus2, southcentralus, usgoveast, usgovsw regions.
1. You cannot enable the feature if you have enabled Azure Disks Encryption (guest-VM encryption using bitlocker/VM-Decrypt) enabled on your VMs/virtual machine scale sets.
1. You have to deallocate your existing VMs to enable the encryption.
1. You can enable the encryption for existing virtual machine scale set. However, only new VMs created after enabling the encryption are encrypted.

Legacy VM Sizes are not supported. You can find the list of supported VM sizes by either:

- Calling the [Resource Skus API](https://docs.microsoft.com/rest/api/compute/resourceskus/list) and checking that the   EncryptionAtHostSupported capability is set to True
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
- Or, calling the [Get-AzComputeResourceSku](https://docs.microsoft.com/powershell/module/az.compute/get-azcomputeresourcesku?view=azps-3.8.0) PowerShell cmdlet 
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
1. VM Size upgrade will result in validation to check if the new VM size supports the EncryptionAtHost feature.