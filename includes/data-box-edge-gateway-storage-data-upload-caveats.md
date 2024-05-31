---
author: stevenmatthew
ms.service: databox  
ms.topic: include
ms.date: 09/25/2020
ms.author: shaas
---

The following caveats apply to data as it moves into Azure:

- We suggest that more than one device should not write to the same container.
- If you have an existing Azure object (such as a blob or a file) in the cloud with the same name as the object that is being copied, device overwrites the file in the cloud.
- An empty directory hierarchy (without any files) created under share folders is not uploaded to the blob containers.
- You can copy the data using drag and drop with File Explorer or via command line. If the aggregate size of files being copied is greater than 10 GB, we recommend you use a bulk copy program such as Robocopy or rsync. The bulk copy tools retry the copy operation for intermittent errors and provide additional resiliency.
- If the share associated with the Azure storage container uploads blobs that don't match the type of blobs defined for the share at the time of creation, then such blobs aren't updated. For example, you create a block blob share on the device. Associate the share with an existing cloud container that has page blobs. Refresh that share to download the files. Modify some of the refreshed files that are already stored as page blobs in the cloud. You'll see upload failures.
- After a file is created in the shares, renaming of the file isn't supported.
- Deletion of a file from a share doesn't delete the entry in the storage account.
- If using rsync to copy data, then `rsync -a` option isn't supported.


