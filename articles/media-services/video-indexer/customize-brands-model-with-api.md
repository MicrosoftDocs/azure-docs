---
title: Customize a Brands model with Video Indexer API
titleSuffix: Azure Media Services
description: Learn how to customize a Brands model with the Video Indexer API.
services: media-services
author: anikaz
manager: johndeu
ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 01/14/2020
ms.author: anzaman
---

# Customize a Brands model with the Video Indexer API

Video Indexer supports brand detection from speech and visual text during indexing and reindexing of video and audio content. The brand detection feature identifies mentions of products, services, and companies suggested by Bing's brands database. For example, if Microsoft is mentioned in video or audio content or if it shows up in visual text in a video, Video Indexer detects it as a brand in the content. A custom Brands model allows you to exclude certain brands from being detected and include brands that should be part of your model that might not be in Bing's brands database.

For a detailed overview, see [Overview](customize-brands-model-overview.md).

You can use the Video Indexer APIs to create, use, and edit custom Brands models detected in a video, as described in this topic. You can also use the Video Indexer website, as described in [Customize Brands model using the Video Indexer website](customize-brands-model-with-api.md).

## Create a Brand

The [create a brand](https://api-portal.videoindexer.ai/docs/services/operations/operations/Create-Brand) API creates a new custom brand and adds it to the custom Brands model for the specified account.

> [!NOTE]
> Setting `enabled` (in the body) to true puts the brand in the *Include* list for Video Indexer to detect. Setting `enabled` to false puts the brand in the *Exclude* list, so Video Indexer won't detect it.

Some other parameters that you can set in the body:

* The `referenceUrl` value can be any reference websites for the brand, such as a link to its Wikipedia page.
* The `tags` value is a list of tags for the brand. This tag shows up in the brand's *Category* field in the Video Indexer website. For example, the brand "Azure" can be tagged or categorized as "Cloud".

### Response

The response provides information on the brand that you just created following the format of the example below.

```json
{
  "referenceUrl": "https://en.wikipedia.org/wiki/Example",
  "id": 97974,
  "name": "Example",
  "accountId": "SampleAccountId",
  "lastModifierUserName": "SampleUserName",
  "created": "2018-04-25T14:59:52.7433333",
  "lastModified": "2018-04-25T14:59:52.7433333",
  "enabled": true,
  "description": "This is an example",
  "tags": [
    "Tag1",
    "Tag2"
  ]
}
```

## Delete a Brand

The [delete a brand](https://api-portal.videoindexer.ai/docs/services/operations/operations/Delete-Brand?) API removes a brand from the custom Brands model for the specified account. The account is specified in the `accountId` parameter. Once called successfully, the brand will no longer be in the *Include* or *Exclude* brands lists.

### Response

There's no returned content when the brand is deleted successfully.

## Get a specific Brand

The [get a brand](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-Brand?) API lets you search for the details of a brand in the custom Brands model for the specified account using the brand ID.

### Response

The response provides information on the brand that you searched (using brand ID) following the format of the example below.

```json
{
  "referenceUrl": "https://en.wikipedia.org/wiki/Example",
  "id": 128846,
  "name": "Example",
  "accountId": "SampleAccountId",
  "lastModifierUserName": "SampleUserName",
  "created": "2018-01-06T13:51:38.3666667",
  "lastModified": "2018-01-11T13:51:38.3666667",
  "enabled": true,
  "description": "This is an example",
  "tags": [
    "Tag1",
    "Tag2"
  ]
}
```

> [!NOTE]
> `enabled` being set to `true` signifies that the brand is in the *Include* list for Video Indexer to detect, and `enabled` being false signifies that the brand is in the *Exclude* list, so Video Indexer won't detect it.

## Update a specific brand

The [update a brand](https://api-portal.videoindexer.ai/docs/services/operations/operations/Update-Brand?) API lets you search for the details of a brand in the custom Brands model for the specified account using the brand ID.

### Response

The response provides the updated information on the brand that you updated following the format of the example below.

```json
{
  "referenceUrl": null,
  "id": 97974,
  "name": "Example",
  "accountId": "SampleAccountId",
  "lastModifierUserName": "SampleUserName",
  "Created": "2018-04-25T14:59:52.7433333",
  "lastModified": "2018-04-25T15:37:50.67",
  "enabled": false,
  "description": "This is an update example",
  "tags": [
    "Tag1",
    "NewTag2"
  ]
}
```

## Get all of the Brands

The [get all brands](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-Brands?) API returns all of the brands in the custom Brands model for the specified account regardless of whether the brand is meant to be in the *Include* or *Exclude* brands list.

### Response

The response provides a list of all of the brands in your account and each of their details following the format of the example below.

```json
[
    {
        "ReferenceUrl": null,
        "id": 97974,
        "name": "Example",
        "accountId": "AccountId",
        "lastModifierUserName": "UserName",
        "Created": "2018-04-25T14:59:52.7433333",
        "LastModified": "2018-04-25T14:59:52.7433333",
        "enabled": true,
        "description": "This is an example",
        "tags": ["Tag1", "Tag2"]
    },
    {
        "ReferenceUrl": null,
        "id": 97975,
        "name": "Example2",
        "accountId": "AccountId",
        "lastModifierUserName": "UserName",
        "Created": "2018-04-26T14:59:52.7433333",
        "LastModified": "2018-04-26T14:59:52.7433333",
        "enabled": false,
        "description": "This is another example",
        "tags": ["Tag1", "Tag2"]
    },
]
```

> [!NOTE]
> The brand named *Example* is in the *Include* list for Video Indexer to detect, and the brand named *Example2* is in the *Exclude* list, so Video Indexer won't detect it.

## Get Brands model settings

The [get brands settings](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-Brands) API returns the Brands model settings in the specified account. The Brands model settings represent whether detection from the Bing brands database is enabled or not. If Bing brands aren't enabled, Video Indexer will only detect brands from the custom Brands model of the specified account.

### Response

The response shows whether Bing brands are enabled following the format of the example below.

```json
{
  "state": true,
  "useBuiltIn": true
}
```

> [!NOTE]
> `useBuiltIn` being set to true represents that Bing brands are enabled. If `useBuiltin` is false, Bing brands are disabled. The `state` value can be ignored because it has been deprecated.

## Update Brands model settings

The [update brands](https://api-portal.videoindexer.ai/docs/services/operations/operations/Update-Brands-Model-Settings?) API updates the Brands model settings in the specified account. The Brands model settings represent whether detection from the Bing brands database is enabled or not. If Bing brands aren't enabled, Video Indexer will only detect brands from the custom Brands model of the specified account.

The `useBuiltIn` flag set to true means that Bing brands are enabled. If `useBuiltin` is false, Bing brands are disabled.

### Response

There's no returned content when the Brands model setting is updated successfully.

## Next steps

[Customize Brands model using website](customize-brands-model-with-website.md)
