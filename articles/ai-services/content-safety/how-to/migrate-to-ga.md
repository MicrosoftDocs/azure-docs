---
title: Migrate from Content Safety public preview to GA
description: Learn how to upgrade your app from the public preview version of Azure AI Content Safety to the GA version.
titleSuffix: Azure AI services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-safety
ms.topic: conceptual
ms.date: 09/25/2023
ms.author: pafarley
---

# Migrate from Content Safety public preview to GA

This guide shows how to upgrade your existing code from the public preview version of Azure AI Content Safety to the GA version.

## Operations

In all API calls, be sure to change the _api-version_ parameter in your code:

|old | new |
|--|--|
`api-version=2023-04-30-preview` | `api-version=2023-10-01` |

### Blocklist operations

The **addBlockItems** API has been renamed to **addOrUpdateBlocklistItems**. The return format has changed. The following table shows the changes.

The blockItems API has been renamed to blocklistItems.
The RemoveBlockItems API has been renamed to RemoveBlocklistItems.
The TextBlockItemInfo type has been renamed to TextblocklistItemInfo
The method AddBlockItems API has been renamed to addedblocklistItems
THe AddblocklistItemsOptions type has been renamed to AddBlocklistItemsOptions
The RemoveBlockItemsOptions type has been renamed to RemoveBlocklistItemsOptions

The `blockItems` JSON field has been renamed to `blocklistItems`.
The `BlockItemId` JSON field has been renamed to `blocklistItemId`.
The `blockItemIds` JSON field has been renamed to `blocklistItemIds`.

The TextBlockItemInfo type has been renamed to TextblocklistItemInfo
The AddBlockItemsOptions type has been renamed to AddBlocklistItemsOptions
The RemoveBlockItemsOptions type has been renamed to RemoveBlocklistItemsOptions
The TextBlockItemInfo type has been renamed to TextblocklistItemInfo
The AddBlockItemsOptions type has been renamed to AddBlocklistItemsOptions
The RemoveBlockItemsOptions type has been renamed to RemoveBlocklistItemsOptions

The `blocklistMatchResults` JSON field has been renamed to `blocklistsMatch`.

## Analyze operations

new format 

```json
{
 "categoriesAnalysis": [
        {
            "category": "Hate",
            "severity": 2
        },
        {
            "category": "SelfHarm",
            "severity": 0
        },
        {
            "category": "Sexual",
            "severity": 0
        },
        {
            "category": "Violence",
            "severity": 0
        }
    ]
}
```

parameter breakByBlocklists has been renamed to haltOnBlocklistHit