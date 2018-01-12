---
title: Find and delete unattached Azure managed and unmanaged disks | Microsoft Docs
description: How to find and delete unattached Azure managed and unmanaged (VHDs/Page blobs) disks, by using Azure PowerShell.
services: virtual-machines-windows
documentationcenter: ''
author: ramankum
manager: kavithag
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 01/10/2017
ms.author: ramankum
---

# Find and delete unattached Azure managed and unmanaged disks
When you delete a virtual machine in Azure, the disks attached to it are not deleted by default. It prevents data loss due to virtual machines deleted by mistake but you continue to pay for the unattached disks unnecessarily. Use this article to find and delete all the unattached disks and save cost. 


## Find and delete unattached managed disks 

The preceding script shows you how to find unattached Managed Disks by using ManagedBy property. It loops through all the Managed Disks in a subscription and checks the ManagedBy property is null to find unattached Managed Disks. ManagedBy property stores the resource ID of the virtual machine to which a Managed Disk is attached.

We highly recommend you to first run the script by setting the deleteUnattachedDisks variable to 0 to view all the unattached disks. After reviewing the unattached disks, run the script by setting deleteUnattachedDisks to 1 to delete all the unattached disks.

```azurepowershell-interactive

# Set deleteUnattachedDisks=1 if you want to delete unattached Managed Disks
# Set deleteUnattachedDisks=0 if you want to see the Id of the unattached Managed Disks
$deleteUnattachedDisks=0

$managedDisks = Get-AzureRmDisk

foreach ($md in $managedDisks) {
    
    # ManagedBy property stores the Id of the VM to which Managed Disk is attached to
    # If ManagedBy property is $null then it means that the Managed Disk is not attached to a VM
    if($md.ManagedBy -eq $null){

        if($deleteUnattachedDisks -eq 1){
            
            Write-Host "Deleting unattached Managed Disk with Id: $($md.Id)"

            $md | Remove-AzureRmDisk -Force

            Write-Host "Deleted unattached Managed Disk with Id: $($md.Id) "

        }else{

            $md.Id

        }
           
    }
     
 } 
```
## Find and delete unattached unmanaged disks 

Unmanaged Disks are VHD files stored as [page blobs](../../rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-page-blobs) in [Azure Storage accounts](../../storage/common/storage-create-storage-account.md). The preceding script shows you how to find unattached unmanaged disks (page blobs) by using LeaseStatus property. It loops through all the unmanaged disks in all the storage accounts in a subscription and checks if the LeaseStatus property is unlocked to find unattached unmanaged Disks. LeaseStatus property is set to locked if an unmanaged disk is attached to a virtual machine.

We highly recommend you to first run the script by setting the deleteUnattachedVHDs variable to 0 to view all the unattached disks. After reviewing the unattached disks, run the script by setting deleteUnattachedVHDs to 1 to delete all the unattached disks.


```azurepowershell-interactive
   
# Set deleteUnattachedVHDs=1 if you want to delete unattached VHDs
# Set deleteUnattachedVHDs=0 if you want to see the Uri of the unattached VHDs
$deleteUnattachedVHDs=1

$storageAccounts = Get-AzureRmStorageAccount

foreach($storageAccount in $storageAccounts){

    $storageKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $storageAccount.ResourceGroupName -Name $storageAccount.StorageAccountName)[0].Value

    $context = New-AzureStorageContext -StorageAccountName $storageAccount.StorageAccountName -StorageAccountKey $storageKey

    $containers = Get-AzureStorageContainer -Context $context

    foreach($container in $containers){

        $blobs = Get-AzureStorageBlob -Container $container.Name -Context $context

        #Fetch all the Page blobs with extension .vhd as only Page blobs can be attached as disk to Azure VMs
        $blobs | Where-Object {$_.BlobType -eq 'PageBlob' -and $_.Name.EndsWith('.vhd')} | ForEach-Object { 
        
            #If a Page blob is not attached as disk then LeaseStatus will be unlocked
            if($_.ICloudBlob.Properties.LeaseStatus -eq 'Unlocked'){
              
                  if($deleteUnattachedVHDs -eq 1){

                        Write-Host "Deleting unattached VHD with Uri: $($_.ICloudBlob.Uri.AbsoluteUri)"

                        $_ | Remove-AzureStorageBlob -Force

                        Write-Host "Deleted unattached VHD with Uri: $($_.ICloudBlob.Uri.AbsoluteUri)"
                  }
                  else{

                        $_.ICloudBlob.Uri.AbsoluteUri

                  }

            }
        
        }

    }

}

```


