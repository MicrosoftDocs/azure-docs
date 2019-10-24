---
title: include file
description: include file
services: storage
author: mhopkins-msft

ms.author: mhopkins
ms.date: 08/09/2019
ms.service: storage
ms.subservice: blobs
ms.topic: include
ms.reviewer: hux
ms.custom: include file
---

To read data in archive storage, you must first change the tier of the blob to hot or cool. This process is known as rehydration and can take hours to complete. We recommend large blob sizes for optimal rehydration performance. Rehydrating several small blobs concurrently may add additional time. There are currently two rehydrate priorities, High (preview) and Standard, which can be set via the optional *x-ms-rehydrate-priority* property on a [Set Blob Tier](https://docs.microsoft.com/rest/api/storageservices/set-blob-tier) or [Copy Blob](https://docs.microsoft.com/rest/api/storageservices/copy-blob) operation.

* **Standard priority**: The rehydration request will be processed in the order it was received and may take up to 15 hours.
* **High priority (preview)**: The rehydration request will be prioritized over Standard requests and may finish in under 1 hour. High priority may take longer than 1 hour, depending on blob size and current demand. High priority requests are guaranteed to be prioritized over Standard priority requests.

> [!NOTE]
> Standard priority is the default rehydration option for archive. High priority is a faster option that will cost more than Standard priority rehydration and is usually reserved for use in emergency data restoration situations.

During rehydration, you may check the *Archive Status* blob property to confirm if the tier has changed. The status reads "rehydrate-pending-to-hot" or "rehydrate-pending-to-cool" depending on the destination tier. Upon completion, the archive status property is removed, and the *Access Tier* blob property reflects the new hot or cool tier.
