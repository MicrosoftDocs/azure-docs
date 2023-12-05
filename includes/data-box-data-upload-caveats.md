---
author: stevenmatthew
ms.service: databox  
ms.subservice: heavy
ms.topic: include
ms.date: 01/25/2022
ms.author: shaas
---

- Containers, shares, and folders:
  - Don't copy files directly to any of the precreated shares. You need to create a folder under the share and then copy files to that folder.
  - A folder under the *StorageAccount_BlockBlob* and *StorageAccount_PageBlob* is a container. For instance, containers are created as *StorageAccount_BlockBlob/container* and *StorageAccount_PageBlob/container*.
  - Each folder created directly under *StorageAccount_AzFile* is translated into an Azure File Share.
  - Azure Blob Storage doesn't support directories. If you create a folder under the *StorageAccount_BlockBlob* folder, then virtual folders are created in the blob name. For Azure Files, the actual directory structure is maintained.
- Merging folder contents:
  - Every file written into *StorageAccount_BlockBlob* and *StorageAccount_PageBlob* shares is uploaded as a block blob and page blob respectively.
  - If a folder has the same name as an existing container, the folder's contents are merged with the container's contents. Files or blobs that aren't already in the cloud are added to the container. If a file or blob has the same name as a file or blob that's already in the container, the existing file or blob is overwritten.
  - An upload to a blob in the Archive tier will fail if the container has an existing archived blob with the same name. While a blob is in the Archive tier, it can't be read or modified. If you need to overwrite a blob, make sure the blob isn't set to archive. For more information, see [Archive access tier](../articles/storage/blobs/access-tiers-overview.md#archive-access-tier).
  - Any empty directory hierarchy (without any files) created under *StorageAccount_BlockBlob* and *StorageAccount_PageBlob* folders isn't uploaded.
- If you use both the SMB and NFS protocols for data copies, we recommend that you:
  - Use different storage accounts for SMB and NFS.
  - Don't copy the same data to the same end destination in Azure using both SMB and NFS. In these cases, the final outcome can't be determined.
  - Although copying via both SMB and NFS in parallel can work, we don't recommend doing that as it's prone to human error. Wait until your SMB data copy is complete before you start an NFS data copy.
- Upload management: 
  - To improve performance during data uploads, we recommend that you [enable large file shares on the storage account and increase share capacity to 100 TiB](../articles/storage/files/storage-how-to-create-file-share.md#enable-large-file-shares-on-an-existing-account). 
  - If there are any errors when uploading data to Azure, an error log is created in the target storage account. The path to this error log is available when the upload is complete, and you can review the log to take corrective action. Don't delete data from the source without verifying the uploaded data.
  - File metadata and NTFS permissions can be preserved when the data is uploaded to Azure Files using guidance in [Preserving file ACLs, attributes, and timestamps with Azure Data Box](../articles/databox/data-box-file-acls-preservation.md).
  - The hierarchy of the files is maintained while uploading to the cloud for both blobs and Azure Files. For example, you copied a file at this path: `<container folder>\A\B\C.txt`. This file is uploaded to the same path in cloud.
  - [!INCLUDE [data-box-file-date-substitution](data-box-file-date-substitution.md)]
  
