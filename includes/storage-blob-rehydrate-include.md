---
title: include file
description: include file
services: storage
author: mhopkins-msft

ms.author: mhopkins
ms.date: 04/08/2020
ms.service: storage
ms.subservice: blobs
ms.topic: include
ms.reviewer: hux
ms.custom: include file
---

To read data in archive storage, you must first change the tier of the blob to hot or cool. This process is known as rehydration and can take hours to complete. We recommend large blob sizes for optimal rehydration performance. Rehydrating several small blobs concurrently may add additional time. There are currently two rehydrate priorities, High and Standard, which can be set via the optional *x-ms-rehydrate-priority* property on a [Set Blob Tier](https://docs.microsoft.com/rest/api/storageservices/set-blob-tier) or [Copy Blob](https://docs.microsoft.com/rest/api/storageservices/copy-blob) operation.

* **Standard priority**: The rehydration request will be processed in the order it was received and may take up to 15 hours.
* **High priority**: The rehydration request will be prioritized over Standard requests and may finish in under 1 hour for objects under ten GB in size. 

> [!NOTE]
> Standard priority is the default rehydration option for archive. High priority is a faster option that will cost more than Standard priority rehydration and is usually reserved for use in emergency data restoration situations.
>
> High priority may take longer than 1 hour, depending on blob size and current demand. High priority requests are guaranteed to be prioritized over Standard priority requests.

Once a rehydration request is initiated, it cannot be canceled. During the rehydration process, the *x-ms-access-tier* blob property will continue to show as archive until rehydration is completed to an online tier. To confirm rehydration status and progress, you may call [Get Blob Properties](https://docs.microsoft.com/rest/api/storageservices/get-blob-properties) to check the *x-ms-archive-status* and the *x-ms-rehydrate-priority* blob properties. The archive status can read "rehydrate-pending-to-hot" or "rehydrate-pending-to-cool" depending on the rehydrate destination tier. The rehydrate priority will indicate the speed of "High" or "Standard". Upon completion, the archive status and rehydrate priority properties are removed, and the access tier blob property will update to reflect the selected hot or cool tier.
