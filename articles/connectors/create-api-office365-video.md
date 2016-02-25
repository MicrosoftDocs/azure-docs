<properties
pageTitle="Use the Office 365 Video API in your Logic apps | Microsoft Azure"
description="Get started using the Office 365 Video API (connector) in your Microsoft Azure App service Logic apps"
services=""	
documentationCenter="" 	
authors="msftman"	
manager="erikre"	
editor=""
tags="connectors"/>

<tags
ms.service="multiple"
ms.devlang="na"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="na"
ms.date="02/18/2016"
ms.author="deonhe"/>

# Get started with the Office365 Video API

The Office 365 Video API provides an API to work with Office 365 channels and videos.

>[AZURE.NOTE] This version of the article applies to logic apps 2015-08-01-preview schema version. For the 2014-12-01-preview schema version, click [Office365 Video Connector](../app-service-logic/app-service-logic-connector-Office365 Video Connector.md).

With the Office365 Video, you can:

* Use it to build logic apps

To add an operation in logic apps, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Let's talk about triggers and actions

The Office365 Video API can be used as an action; there are no triggers. All APIs support data in JSON and XML formats. 

 The Office365 Video API has the following action(s) and/or trigger(s) available:

### Office365 Video API actions
You can take these action(s):

|Action|Description|
|--- | ---|
|IsVideoPortalEnabled|Checks the video portal status to see if video services are enabled|
|ListViewableChannels|Gets all the channels the user has viewing access to|
|ListVideos|Lists all the office365 videos present in a channel|
|GetVideo|Gets information about a particular office365 video|
|GetPlaybackUrl|Get playback url of the Azure Media Services manifest for a video|
|GetStreamingKeyAccessToken|Get the bearer token to get access to decrypt the video|
ActionsTableReplaceMeLater## Create a connection to Office365 Video API
To use the Office365 Video API, you first create a **connection** then provide the details for these properties: 

|Property| Required|Description|
| ---|---|---|
|Token|Yes|Provide SharePoint Online Credentials|


>[AZURE.TIP] You can use this connection in other logic apps.

## Office365 Video REST API reference
#### This documentation is for version: 1.0


### Checks the video portal status to see if video services are enabled
**```GET: /{tenant}/IsEnabled```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|tenant|string|yes|path|none|The tenant name for the directory the user is part of|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|404|Not Found|
|500|Internal Server Error|
|default|Operation Failed.|
------



### Gets all the channels the user has viewing access to
**```GET: /{tenant}/Channels```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|tenant|string|yes|path|none|The tenant name for the directory the user is part of|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|404|Not Found|
|500|Internal Server Error|
|default|Operation Failed.|
------



### Lists all the office365 videos present in a channel
**```GET: /{tenant}/Channels/{channelId}/Videos```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|tenant|string|yes|path|none|The tenant name for the directory the user is part of|
|channelId|string|yes|path|none|The channel id from which videos need to be fetched|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|404|Not Found|
|500|Internal Server Error|
|default|Operation Failed.|
------



### Gets information about a particular office365 video
**```GET: /{tenant}/Channels/{channelId}/Videos/{videoId}```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|tenant|string|yes|path|none|The tenant name for the directory the user is part of|
|channelId|string|yes|path|none|The channel id|
|videoId|string|yes|path|none|The video id|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|404|Not Found|
|500|Internal Server Error|
|default|Operation Failed.|
------



### Get playback url of the Azure Media Services manifest for a video
**```GET: /{tenant}/Channels/{channelId}/Videos/{videoId}/playbackurl```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|tenant|string|yes|path|none|The tenant name for the directory the user is part of|
|channelId|string|yes|path|none|The channel id|
|videoId|string|yes|path|none|The video id|
|streamingFormatType|string|yes|query|none|Streaming format type. 1 - Smooth Streaming or MPEG-DASH. 0 - HLS Streaming|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|404|Not Found|
|500|Internal Server Error|
|default|Operation Failed.|
------



### Get the bearer token to get access to decrypt the video
**```GET: /{tenant}/Channels/{channelId}/Videos/{videoId}/token```** 



| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|tenant|string|yes|path|none|The tenant name for the directory the user is part of|
|channelId|string|yes|path|none|The channel id|
|videoId|string|yes|path|none|The video id|


### Here are the possible responses:

|Name|Description|
|---|---|
|200|Operation was successful|
|400|BadRequest|
|401|Unauthorized|
|404|Not Found|
|500|Internal Server Error|
|default|Operation Failed.|
------



## Object definition(s): 

 **Channel**:Channel class

Required properties for Channel:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|Id|string|
|Title|string|
|Description|string|



 **Video**:Video class

Required properties for Video:


None of the properties are required. 


**All properties**: 


| Name | Data Type |
|---|---|
|Id|string|
|Title|string|
|Description|string|
|CreationDate|string|
|Owner|string|
|ThumbnailUrl|string|
|VideoUrl|string|
|VideoDuration|integer|
|VideoProcessingStatus|integer|
|ViewCount|integer|


## Next Steps
[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).