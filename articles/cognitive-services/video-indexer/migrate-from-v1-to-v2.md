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

The latest release of Video Indexer introduces Video Indexer API v2. To avoid service disruptions, it is recommended to migrate your code to the latest API.

> [!Note]
> The Video Indexer v1 API is going to be deprecated on July 31, 2018.

This article describes changes that were inroduced in v2.  

## API changes

### Authorization and Operations

In the v2 virsion, Video Indexer changed the authentication and authorization model of the API. There are two sets of APIs: 

* Authorization 
* Operations

The **Authorization** API is used to obtain access tokens for calling the **Operations** API. The **Operations** API contains all the Video Indexer APIs, such as Upload video, Get insights, etc.

Once you subscribe to the **Authorization** API, you will be able to obtain access tokens by passing your subscription key (just like you did in v1.)

When calling the **Operations** APIs, the subscription key won't be used anymore. Instead, you will pass the access tokens obtained by the **Authorization** API. 

Each request should have a valid token, matching the access level of the API you are calling. For example, operations on your user, such as getting your accounts, require a user access token. Operations on the account level, such as list all videos, require an account access token. Operations on videos, such as re-index video, require a video access token.

For more information about the different access tokens, see [Use Azure Video Indexer API](video-indexer-use-apis.md).

### Locations

Each call to the API should include the location of your Video Indexer account. For example:  https://api.videoindexer.ai/northeurope/Accounts/{accountId}/Videos/{videoId}/Index?language=English. API calls without the location or with a wrong location will fail.

For trial accounts, you should use 'trial' as the location. For example:  https://api.videoindexer.ai/trial/Accounts/{accountId}/Videos/{videoId}/Index?language=English.

### Data Model

Video Indexer now has a simplified data model to deliver much clearer insights. For more information about the output produced by v2 API, see [Examine the Video Indexer output produced by v2 API](video-indexer-output-json-v2.md).

### Swagger

The Video Indexer API definitions were update accordingly and available to download through the [API portal](https://api-portal.videoindexer.ai/docs/services/authorization/operations/Get-Account-Access-Token).

## Next steps

[Get started](video-indexer-get-started.md)

