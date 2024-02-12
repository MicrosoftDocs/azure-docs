---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-blob-storage
ms.topic: include
ms.date: 07/03/2023
ms.author: pauljewell
ms.custom: include file
---

## About block blob access tiers

To manage costs for storage needs, it can be helpful to organize your data based on how frequently it's accessed and how long it needs to be retained. Azure storage offers different access tiers so that you can store your blob data in the most cost-effective manner based on how it's being used.

#### Access tiers for blob data

Azure Storage access tiers include:

- **Hot tier** - An online tier optimized for storing data that is accessed or modified frequently. The hot tier has the highest storage costs, but the lowest access costs.
- **Cool tier** - An online tier optimized for storing data that is infrequently accessed or modified. Data in the cool tier should be stored for a minimum of 30 days. The cool tier has lower storage costs and higher access costs compared to the hot tier.
- **Cold tier** - An online tier optimized for storing data that is infrequently accessed or modified. Data in the cold tier should be stored for a minimum of 90 days. The cold tier has lower storage costs and higher access costs compared to the cool tier.
- **Archive tier** - An offline tier optimized for storing data that is rarely accessed, and that has flexible latency requirements, on the order of hours. Data in the archive tier should be stored for a minimum of 180 days.

To learn more about access tiers, see [Access tiers for blob data](../../articles/storage/blobs/access-tiers-overview.md).

While a blob is in the Archive access tier, it's considered to be offline, and can't be read or modified. In order to read or modify data in an archived blob, you must first rehydrate the blob to an online tier. To learn more about rehydrating a blob from the Archive tier to an online tier, see [Blob rehydration from the Archive tier](../../articles/storage/blobs/archive-rehydrate-overview.md).

#### Restrictions

Setting the access tier is only allowed on block blobs. To learn more about restrictions on setting a block blob's access tier, see [Set Blob Tier (REST API)](/rest/api/storageservices/set-blob-tier#remarks).