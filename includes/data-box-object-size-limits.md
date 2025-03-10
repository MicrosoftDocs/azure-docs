---
author: stevenmatthew
ms.service: azure-data-box-heavy
ms.topic: include
ms.date: 03/10/2024
ms.author: shaas
---

Here are the sizes of the Azure objects that can be written. Make sure that all the files that are uploaded conform to these limits.

| Azure object type | Default limit                                             |
|-------------------|-----------------------------------------------------------|
| Block blob        | 14 TiB                                                  |
| Page blob         | 4 TiB <br> Every file uploaded in page blob format must be 512 bytes aligned (an integral multiple), else the upload fails. <br> VHD and VHDX are 512 bytes aligned. |
| Azure Files        | 4 TiB                                                      |
| Managed disks     | 4 TiB <br> For more information on size and limits, see: <li>[Scalability targets of Standard SSDs](/azure/virtual-machines/disks-types#standard-ssds)</li><li>[Scalability targets of Premium SSDs](/azure/virtual-machines/disks-types#standard-hdds)</li><li>[Scalability targets of Standard HDDs](/azure/virtual-machines/disks-types#premium-ssds)</li><li>[Pricing and billing of managed disks](/azure/virtual-machines/disks-types#billing)</li>  

