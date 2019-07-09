---
title: include file
description: include file
services: storage
author: mhopkins-msft

ms.service: storage
ms.topic: include
ms.date: 06/20/2019
ms.author: mhopkins
ms.reviewer: hux
ms.custom: include file
---

To read data in archive storage, you must first change the tier of the blob to hot or cool. This process is known as rehydration and can take hours to complete. We recommend large blob sizes for optimal rehydration performance. Rehydrating several small blobs concurrently may add additional time. There are currently two rehydrate priorities, High and Standard, that can be set via the optional *rehydrate-priority* property on a [Set Blob Tier](https://docs.microsoft.com/rest/api/storageservices/set-blob-tier) or [Copy Blob](https://docs.microsoft.com/rest/api/storageservices/copy-blob) operation.

* Standard priority - the blob rehydrate request will be processed in the order it was received and may take up to 15 hours.
* High priority - the blob rehydrate request will be prioritized over other requests and may finish in under 1 hour.

> [!NOTE]
> Standard priority is the default rehydration option for Archive. High priority is a faster option that will cost more than the Standard priority rehydration and is usually reserved for use in emergency data-restoration situations.

During rehydration, you may check the **Archive Status** blob property to confirm if the tier has changed. The status reads "rehydrate-pending-to-hot" or "rehydrate-pending-to-cool" depending on the destination tier. Upon completion, the Archive status property is removed, and the **Access Tier** blob property reflects the new Hot or Cool tier.
