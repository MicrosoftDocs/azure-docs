---
title: Find and delete unattached Azure managed and unmanaged disks | Microsoft Docs
description: How to find and delete unattached Azure managed and unmanaged (VHDs/Page blobs) disks, by using Azure CLI
services: virtual-machines-linux
documentationcenter: ''
author: ramankum
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 01/10/2017
ms.author: ramankum
---
# Find and delete unattached Azure managed and unmanaged disks
When you delete a virtual machine in Azure, the disks attached to it are not deleted by default. It prevents data loss due to virtual machines deleted by mistake but you continue to pay for the unattached disks unnecessarily. Use this article to find and delete all the unattached disks and save cost. 


## Find and delete unattached managed disks 

The following script shows you how to find unattached Managed Disks by using ManagedBy property.  It loops through all the Managed Disks in a subscription and checks if the *ManagedBy* property is null to find unattached Managed Disks. *ManagedBy* property stores the resource ID of the virtual machine to which a Managed Disk is attached. 

We highly recommend you to first run the script by setting the *deleteUnattachedDisks* variable to 0 to view all the unattached disks. After reviewing the unattached disks, run the script by setting *deleteUnattachedDisks* to 1 to delete all the unattached disks.

 ```azurecli

# Set deleteUnattachedDisks=1 if you want to delete unattached Managed Disks
# Set deleteUnattachedDisks=0 if you want to see the Id of the unattached Managed Disks
deleteUnattachedDisks=0

unattachedDiskIds=$(az disk list --query '[?managedBy==`null`].[id]' -o tsv)
for id in ${unattachedDiskIds[@]}
do
    if (( $deleteUnattachedDisks == 1 ))
    then

        echo "Deleting unattached Managed Disk with Id: "$id
        az disk delete --ids $id --yes
        echo "Deleted unattached Managed Disk with Id: "$id

    else
        echo $id
    fi
done

```
## Find and delete unattached unmanaged disks 

Unmanaged Disks are VHD files stored as [page blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-page-blobs) in [Azure Storage accounts](../../storage/common/storage-create-storage-account.md). The following script shows you how to find unattached unmanaged disks (page blobs) by using LeaseStatus property. It loops through all the unmanaged disks in all the storage accounts in a subscription and checks if the *LeaseStatus* property is unlocked to find unattached unmanaged Disks. The *LeaseStatus* property is set to locked if an unmanaged disk is attached to a virtual machine. 

We highly recommend you to first run the script by setting the *deleteUnattachedVHDs* variable to 0 to view all the unattached disks. After reviewing the unattached disks, run the script by setting *deleteUnattachedVHDs* to 1 to delete all the unattached disks.


 ```azurecli
   
# Set deleteUnattachedVHDs=1 if you want to delete unattached VHDs
# Set deleteUnattachedVHDs=0 if you want to see the details of the unattached VHDs
deleteUnattachedVHDs=1

storageAccountIds=$(az storage account list --query [].[id] -o tsv)

for id in ${storageAccountIds[@]}
do
    connectionString=$(az storage account show-connection-string --ids $id --query connectionString -o tsv)
    containers=$(az storage container list --connection-string $connectionString --query [].[name] -o tsv)

    for container in ${containers[@]}
    do 
        
        blobs=$(az storage blob list -c $container --connection-string $connectionString --query "[?properties.blobType=='PageBlob' && ends_with(name,'.vhd')].[name]" -o tsv)
        
        for blob in ${blobs[@]}
        do
            leaseStatus=$(az storage blob show -n $blob -c $container --connection-string $connectionString --query "properties.lease.status" -o tsv)
            
            if [ "$leaseStatus" == "unlocked" ]
            then 

                if (( $deleteUnattachedVHDs == 1 ))
                then 

                    echo "Deleting VHD: "$blob" in container: "$container" in storage account: "$id

                    az storage blob delete --delete-snapshots include  -n $blob -c $container --connection-string $connectionString

                    echo "Deleted VHD: "$blob" in container: "$container" in storage account: "$id
                else
                    echo "StorageAccountId: "$id" container: "$container" VHD: "$blob
                fi

            fi
        done
    done
done 

```

## Next steps

[Delete Storage account](../../storage/common/storage-create-storage-account)



