---
title: Migrate from Azure AI Content Safety public preview to GA
description: Learn how to upgrade your app from the public preview version of Azure AI Content Safety to the GA version.
titleSuffix: Azure AI services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.topic: conceptual
ms.date: 09/25/2023
ms.author: pafarley
---

# Migrate from Azure AI Content Safety public preview to GA

This guide shows you how to upgrade your existing code from the public preview version of Azure AI Content Safety to the GA version.

## REST API calls

In all API calls, be sure to change the _api-version_ parameter in your code:

|old | new |
|--|--|
`api-version=2023-04-30-preview` | `api-version=2023-10-01` |

Note the following REST endpoint name changes:

| Public preview term          | GA term                 |  
|-------------------|---------------------------|  
| **addBlockItems**     | **addOrUpdateBlocklistItems** |  
| **blockItems**        | **blocklistItems**            |  
| **removeBlockItems**  | **removeBlocklistItems**       |  


## JSON fields

The following JSON fields have been renamed. Be sure to change them when you send data to a REST call:

| Public preview Term        | GA Term                    |  
|-------------------------|-------------------------------|  
| `blockItems`            | `blocklistItems`              |  
| `BlockItemId`           | `blocklistItemId`             |  
| `blockItemIds`          | `blocklistItemIds`            |  
| `blocklistMatchResults` | `blocklistsMatch`             |  
| `breakByBlocklists`     | `haltOnBlocklistHit`           |


## Return formats

Some of the JSON return formats have changed. See the following updated JSON return examples.

The **text:analyze** API call with category analysis:

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

The **text:analyze** API call with a blocklist:
```json
{
  "blocklistsMatch": [
    {
      "blocklistName": "string",
      "blocklistItemId": "string",
      "blocklistItemText": "bleed"
    }
  ],
  "categoriesAnalysis": [
    {
      "category": "Hate",
      "severity": 0
    }
  ]
}
```

The **addOrUpdateBlocklistItems** API call:

```json
{
  "blocklistItems:"[
    {
      "blocklistItemId": "string",
      "description": "string",
      "text": "bleed"
    }
  ]
}
```

The **blocklistItems** API call (list all blocklist items):
```json
{
  "values": [
    {
      "blocklistItemId": "string",
      "description": "string",
      "text": "bleed",
    }
  ]
}
```

The **blocklistItems** API call with an item ID (retrieve a single item):

```json
{
  "blocklistItemId": "string",
  "description": "string",
  "text": "string"
}
```


## Next steps

- [Quickstart: Analyze text content](../quickstart-text.md)