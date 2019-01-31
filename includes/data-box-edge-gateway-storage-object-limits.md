---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 01/31/2019
ms.author: alkohli
---

Here are the sizes of the Azure objects that can be written. Make sure that all the files that are uploaded conform to these limits.

| Azure object type | Default limit                                             |
|-------------------|-----------------------------------------------------------|
| Block Blob        | ~ 8 TB                                                 |
| Page Blob         | 1 TB <br> Every file uploaded in Page Blob format must be 512 bytes aligned (an integral multiple), else the upload fails. <br> The VHD and VHDX are 512 bytes aligned. |
