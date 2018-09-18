---
title: Migrate from Azure Video Indexer API v1 to v2
titlesuffix: Azure Cognitive Services
description: This topic explains how to migrate from the Azure Video Indexer API v1 to v2.
services: cognitive services
author: juliako
manager: cgronlun

ms.service: cognitive-services
ms.component: video-indexer
ms.topic: conceptual
ms.date: 09/15/2018
ms.author: juliako
---

# Migrate from the Video Indexer API v1 to v2

> [!Note]
> The Video Indexer V1 API was deprecated on August 1st, 2018. You should now use the Video Indexer v2 API. <br/>To develop with Video Indexer v2 APIs, please refer to the instructions found [here](https://api-portal.videoindexer.ai/). 

This article describes changes that were introduced in v2.  

## API changes

### Authorization and Operations

In the v2 version, Video Indexer changed the authentication and authorization model of the API. There are two sets of APIs: 

* Authorization 
* Operations

The **Authorization** API is used to obtain access tokens for calling the **Operations** API. The **Operations** API contains all the Video Indexer APIs, such as Upload video, Get insights, and other operations.

Once you [subscribe](video-indexer-get-started.md) to the **Authorization** API, you will be able to obtain access tokens by passing your subscription key (just like you did in v1.)

## Getting and using the access token for operations APIs

When calling the **Operations** APIs, the subscription key won't be used anymore. Instead, you will pass the access tokens obtained by the **Authorization** API. 

Each request should have a valid token, matching the access level of the API you are calling. For example, operations on your user, such as getting your accounts, require a user access token. Operations on the account level, such as list all videos, require an account access token. Operations on videos, such as reindex video, require either an account access token or a video access token.

To make things easier, you can use **Authorization** API > **GetAccounts** to get your accounts without obtaining a user token first. You can also ask to get the accounts with valid tokens, enabling you to skip an additional call to get an account token.

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

The Video Indexer API definitions were updated accordingly and are available to download through [Video Indexer Developer Portal](https://api-portal.videoindexer.ai/docs/services/authorization/operations/Get-Account-Access-Token).


### V1 vs V2 examples

The new V2 APIs involve 3 main parameters:

1. [LOCATION] - As described above. Either trial, westus2, northeurope or eastasia.
2. [YOUR_ACCOUNT_ID] - A Guid id of your account. Retrieved when getting all accounts (described below).
3. [YOUR_VIDEO_ID] - The id of your video (e.g. "d4fa369abc"). Returned when uploading a video or when searching for videos.

#### Uploading a video in V1:

```
https://videobreakdown.azure-api.net/Breakdowns/Api/Partner/Breakdowns?name=some_name&description=some_description&privacy=private&videoUrl=http://URL_TO_YOUR_VIDEO
```

#### Uploading a video in V2:

1. Get an access token for the upload request:

  You can either get all accounts and their access tokens:

    ```
    https://api.videoindexer.ai/auth/[LOCATION]/Accounts?generateAccessTokens=true&allowEdit=true
    ```

  Or get the specific account access token:
  
  ```
  https://api.videoindexer.ai/auth/[LOCATION]/Accounts/[YOUR_ACCOUNT_ID]/AccessToken?allowEdit=true
  ```
2. Upload a video:

  ```
  POST https://api.videoindexer.ai/[LOCATION]/Accounts/[YOUR_ACCOUNT_ID]/Videos?name=MySample&description=MySampleDescription&videoUrl=[URL_ENCODED_VIDEO_URL]&accessToken=eyJ0eXAiOiJ...
  ```

#### Getting insights in V1:

```
https://videobreakdown.azure-api.net/Breakdowns/Api/Partner/Breakdowns/[VIDEO_ID]
```
  
#### Getting insights in V2:

1. Either use the account access token, or get a video level access token:

  ```
  https://api.videoindexer.ai/auth/[LOCATION]/Accounts/[YOUR_ACCOUNT_ID]/Videos/[VIDEO_ID]/AccessToken
  ```
  
2. Get insights:

  ```
  https://api.videoindexer.ai/[LOCATION]/Accounts[YOUR_ACCOUNT_ID]/Videos/[VIDEO_ID]/Index?accessToken=eyJ0eXA...
  ```

#### Getting video processing state in V1:

```
https://videobreakdown.azure-api.net/Breakdowns/Api/Partner/Breakdowns/[VIDEO_ID]/State
```
  
#### Getting video processing state in V2:

In API v2, the processing state is returned as part of the Get Video Index API.

1. Either use the account access token, or get a video level access token:

  ```
  https://api.videoindexer.ai/trial/[LOCATION]/[YOUR_ACCOUNT_ID]/Videos/[VIDEO_ID]/Index?accessToken=eyJ0eXA...
  ```
  
2. Get insights:

  ```
  https://api.videoindexer.ai/trial/[LOCATION]/[YOUR_ACCOUNT_ID]/Videos/[VIDEO_ID]/Index?accessToken=eyJ0eXA...
  ```

## Next steps

[Use Azure Video Indexer API](video-indexer-use-apis.md)

