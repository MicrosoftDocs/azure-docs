---
author: stevenmatthew
ms.service: databox
ms.subservice: heavy   
ms.topic: include
ms.date: 01/24/2022
ms.author: shaas
---

Here are the sizes of the Azure objects that can be written. Make sure that all the files that are uploaded conform to these limits.

| Azure object type | Default limit                                             |
|-------------------|-----------------------------------------------------------|
| Block blob        | 14 TiB                                                  |
| Page blob         | 4 TiB <br> Every file uploaded in page blob format must be 512 bytes aligned (an integral multiple), else the upload fails. <br> VHD and VHDX are 512 bytes aligned. |
| Azure Files        | 1 TiB                                                      |
| Managed disks     | 4 TiB <br> For more information on size and limits, see: <li>[Scalability targets of Standard SSDs](../articles/virtual-machines/disks-types.md#standard-ssds)</li><li>[Scalability targets of Premium SSDs](../articles/virtual-machines/disks-types.md#standard-hdds)</li><li>[Scalability targets of Standard HDDs](../articles/virtual-machines/disks-types.md#premium-ssds)</li><li>[Pricing and billing of managed disks](../articles/virtual-machines/disks-types.md#billing)</li>  

