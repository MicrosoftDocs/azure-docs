---
author: alkohli
ms.service: databox
ms.subservice: heavy   
ms.topic: include
ms.date: 05/21/2019
ms.author: alkohli
---

Here are the sizes of the Azure objects that can be written. Make sure that all the files that are uploaded conform to these limits.

| Azure object type | Default limit                                             |
|-------------------|-----------------------------------------------------------|
| Block blob        | ~ 4.75 TiB                                                 |
| Page blob         | 8 TiB <br> Every file uploaded in page blob format must be 512 bytes aligned (an integral multiple), else the upload fails. <br> VHD and VHDX are 512 bytes aligned. |
| Azure Files        | 1 TiB                                                      |
| Managed disks     | 4 TiB <br> For more information on size and limits, see: <li>[Scalability targets of Standard SSDs](../articles/virtual-machines/windows/disks-types.md#standard-ssd)</li><li>[Scalability targets of Premium SSDs](../articles/virtual-machines/windows/disks-types.md#standard-hdd)</li><li>[Scalability targets of Standard HDDs](../articles/virtual-machines/windows/disks-types.md#premium-ssd)</li><li>[Pricing and billing of managed disks](../articles/virtual-machines/windows/disks-types.md#billing)</li>  
