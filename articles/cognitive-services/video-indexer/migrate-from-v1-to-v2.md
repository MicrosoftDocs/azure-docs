---
title: Migrate from Azure Video Indexer API v1 to v2 | Microsoft Docs
description: This topic explains how to migrate from the Azure Video Indexer API v1 to v2.
services: cognitive services
documentationcenter: ''
author: juliako
manager: erikre

ms.service: cognitive-services
ms.topic: article
ms.date: 05/13/2018
ms.author: juliako
---

# Migrate from the Video Indexer API v1 to v2

> [!Note]
> The Video Indexer v1 API is going to be deprecated on August 1, 2018.

The latest release of Video Indexer introduces Video Indexer API v2. To avoid service disruptions, we recommend that you to migrate your code to the latest API.

This article describes changes that were introduced in v2.  

## API changes

### Authorization and Operations

In the v2 version, Video Indexer changed the authentication and authorization model of the API. There are two sets of APIs: 

* Authorization 
* Operations

The **Authorization** API is used to obtain access tokens for calling the **Operations** API. The **Operations** API contains all the Video Indexer APIs, such as Upload video, Get insights, and other operations.

Once you [subscribe](video-indexer-get-started.md) to the **Authorization** API, you will be able to obtain access tokens by passing your subscription key (just like you did in v1.)

When calling the **Operations** APIs, the subscription key won't be used anymore. Instead, you will pass the access tokens obtained by the **Authorization** API. 

Each request should have a valid token, matching the access level of the API you are calling. For example, operations on your user, such as getting your accounts, require a user access token. Operations on the account level, such as list all videos, require an account access token. Operations on videos, such as reindex video, require a video access token.

For more information about the different access tokens, see [Use Azure Video Indexer API](video-indexer-use-apis.md).

### Locations

Each call to the API should include the location of your Video Indexer account. API calls without the location or with a wrong location will fail.

The values described in the following table apply. The **Param value** is the value you pass when using the API.

|**Name**|**Param value**|**Description**|
|---|---|---|
|Trial|trial|Used for trial accounts. For example: https://api.videoindexer.ai/trial/Accounts/{accountId}/Videos/{videoId}/Index?language=English.|
|West US|westus2|Used for the Azure West US 2 region.  For example: https://api.videoindexer.ai/westus2/Accounts/{accountId}/Videos/{videoId}/Index?language=English.|
|North Europe |northeurope|Used for the Azure North Europe region. For example:  https://api.videoindexer.ai/northeurope/Accounts/{accountId}/Videos/{videoId}/Index?language=English. |
|East Asia|eastasia|Used for the Azure East Asia region. For example:  https://api.videoindexer.ai/eastasia/Accounts/{accountId}/Videos/{videoId}/Index?language=English.|

### Data Model

Video Indexer now has a simplified data model to deliver much clearer insights. For more information about the output produced by the v2 API, see [Examine the Video Indexer output produced by the v2 API](video-indexer-output-json-v2.md).

### Swagger

The Video Indexer API definitions were updated accordingly and are available to download through the [API portal](https://api-portal.videoindexer.ai/docs/services/authorization/operations/Get-Account-Access-Token).


### V1 vs V2 examples

#### Uploading a video in V1:

```
https://videobreakdown.azure-api.net/Breakdowns/Api/Partner/Breakdowns?name=some_name&description=some_description&privacy=private&videoUrl=http://URL_TO_YOUR_VIDEO
```

#### Uploading a video in V2:

1. Get an access token for the upload request:

  ```
  https://api.videoindexer.ai/auth/westus2/Accounts/00000000-c48b-4703-a5d6-2d3fd810ff9c/AccessToken?allowEdit=true
  ```
  
2. Upload a video:

  ```
  https://api.videoindexer.ai/westus2/Accounts/00000000-c48b-4703-a5d6-2d3fd810ff9c/Videos?accessToken=YOUR_ACCESS_TOKEN&name=my-video&description=my-video-description&language=English&videoUrl=http://url-to-the-video&indexingPreset=Default&streamingPreset=Default&privacy=Private
  ```
  

#### Getting insights in V1:

```
https://videobreakdown.azure-api.net/Breakdowns/Api/Partner/Breakdowns/VIDEO_ID
```
  
#### Getting insights in V2:

1. Get a video level access token:

  ```
  https://api.videoindexer.ai/auth/westus2/Accounts/YOUR_ACCOUNT_ID/Videos/VIDEO_ID/AccessToken
  ```
  
2. Get insights:

  ```
  https://api.videoindexer.ai/westus2/Accounts/YOUR_ACCOUNT_ID/Videos/VIDEO_ID/Index?accessToken=ACCESS_TOKEN&language=English
  ```

## Next steps

[Examine the Video Indexer output produced by the v2 API](video-indexer-output-json-v2.md)

