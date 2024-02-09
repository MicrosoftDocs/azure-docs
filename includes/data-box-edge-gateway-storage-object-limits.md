---
author: stevenmatthew
ms.service: databox  
ms.topic: include
ms.date: 02/04/2019
ms.author: shaas
---

Here are the sizes of the Azure objects that can be written. Make sure that all the files that are uploaded conform to these limits.

| Azure object type | Upload limit                                             |
|-------------------|-----------------------------------------------------------|
| Block Blob        | ~ 4.75 TB                                                 |
| Page Blob         | 1 TB <br> Every file uploaded in Page Blob format must be 512 bytes aligned (an integral multiple), else the upload fails. <br> The VHD and VHDX are 512 bytes aligned. |
| Azure Files         | 1 TB <br> Every file uploaded in Page Blob format must be 512 bytes aligned (an integral multiple), else the upload fails. <br> The VHD and VHDX are 512 bytes aligned. |

> [!IMPORTANT]
> Creation of files (irrespective of the storage type) is allowed up to 5 TB. However, if you create a file whose size is greater than the upload limit defined in the preceding table, the file does not get uploaded. You have to manually delete the file to reclaim the space.
