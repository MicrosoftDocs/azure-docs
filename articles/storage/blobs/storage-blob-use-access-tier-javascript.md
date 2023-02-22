---
title: Use blob access tiers with JavaScript
titleSuffix: Azure Storage 
description: Learn how add or change a blob's access tier in your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 02/22/2023
ms.subservice: blobs
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js
---

# Using access tiers

This article shows how to use [access tiers](access-tiers-overview.md) for Block Blobs with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob). 

Access tiers are not supported for Append and Page Blobs.

## Understand Block Blob access tiers

Data stored in the cloud grows at an exponential pace. To manage costs for your expanding storage needs, it can be helpful to organize your data based on how frequently it will be accessed and how long it will be retained. Azure storage offers different access tiers so that you can store your blob data in the most cost-effective manner based on how it's being used. Azure Storage access tiers include:

- [**Online tiers**](access-tiers-overview.md#online-access-tiers)
    - **Hot tier** - An online tier optimized for storing data that is accessed or modified frequently. The hot tier has the highest storage costs, but the lowest access costs.
    - **Cool tier** - An online tier optimized for storing data that is infrequently accessed or modified. Data in the cool tier should be stored for a minimum of 30 days. The cool tier has lower storage costs and higher access costs compared to the hot tier.
- [**Archive tier**](access-tiers-overview.md#archive-access-tier) - An offline tier optimized for storing data that is rarely accessed, and that has flexible latency requirements, on the order of hours. Data in the archive tier should be stored for a minimum of 180 days.

## Restrictions

Review the current [PageBlob and BlockBlob restrictions](/rest/api/storageservices/set-blob-tier) for access tier changes.

## Set blob's access tier during upload

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/upload-blob-from-string-with-access-tier.js" id="Snippet_UploadAccessTier":::

## Change blob's access tier after upload

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/change-blob-access-tier.js" id="Snippet_BatchChangeAccessTier":::

## Copy blob into different access tier

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/copy-blob-to-different-access-tier.js" id="Snippet_CopyWithAccessTier":::

## Bulk archive

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/batch-set-access-tier.js" id="Snippet_BatchChangeAccessTier":::
 
### See also

- [Soft delete for containers](soft-delete-container-overview.md)
- [Enable and manage soft delete for containers](soft-delete-container-enable.md)
