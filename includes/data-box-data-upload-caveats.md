---
author: alkohli
ms.service: databox  
ms.subservice: heavy
ms.topic: include
ms.date: 09/30/2020
ms.author: alkohli
---

- Don't copy files directly to any of the precreated shares. You need to create a folder under the share and then copy files to that folder.
- A folder under the *StorageAccount_BlockBlob* and *StorageAccount_PageBlob* is a container. For instance, containers are created as *StorageAccount_BlockBlob/container* and *StorageAccount_PageBlob/container*.
- Each folder created directly under *StorageAccount_AzureFiles* is translated into an Azure File Share.
- If an object that is being copied has the same name as an Azure object, such as a blob or a file, that is already in the cloud, Data Box will overwrite the file in the cloud.
- Every file written into *StorageAccount_BlockBlob* and *StorageAccount_PageBlob* shares is uploaded as a block blob and page blob respectively.
- Azure Blob Storage doesn't support directories. If you create a folder under the *StorageAccount_BlockBlob* folder, then virtual folders are created in the blob name. For Azure Files, the actual directory structure is maintained.
- Any empty directory hierarchy (without any files) created under *StorageAccount_BlockBlob* and *StorageAccount_PageBlob* folders isn't uploaded.
- If there are any errors when uploading data to Azure, an error log is created in the target storage account. The path to this error log is available when the upload is complete, and you can review the log to take corrective action. Don't delete data from the source without verifying the uploaded data.
- File metadata and NTFS permissions can be preserved when the data is uploaded to Azure Files using guidance in [Preserving file ACLs, attributes, and timestamps with Azure Data Box](../articles/databox/data-box-file-acls-preservation.md).
