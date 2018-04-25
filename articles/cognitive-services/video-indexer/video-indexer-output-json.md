---
title: Examine the Azure Video Indexer output | Microsoft Docs
description: This topic examines the Video Indexer output.
services: cognitive services
documentationcenter: ''
author: juliako
manager: cflower

ms.service: cognitive-services
ms.topic: article
ms.date: 03/05/2018
ms.author: juliako

---
# Examine the Video Indexer output

When you call the **Get Breakdowns** API and the response status is OK, you get a detailed JSON output as the response content. The JSON content contains details of the specified video insights including (transcript, OCRs, people). The details include keywords (topics), faces, blocks. Each block includes time ranges, transcript lines, OCR lines, sentiments, faces, and block thumbnails.

You can use the **Get Breakdowns** API to get the full breakdown of a video as a JSON content.  
 
	GET https://videobreakdown.azure-api.net/Breakdowns/Api/Partner/Breakdowns/63c6d532ff HTTP/1.1
	Host: videobreakdown.azure-api.net
	Ocp-Apim-Subscription-Key: ••••••••••••••••••••••••••••••••
	
You can also visually examine the video's summarized insights by pressing the **Play** button on the video in the Video Indexer portal. For more information, see [View and edit video insights](video-indexer-view-edit.md).

![Insights](./media/video-indexer-output-json/video-indexer-summarized-insights.png)

This article examines the JSON content returned by the  **Get Breakdowns** API. It might be helpful, to review the [concepts](video-indexer-concepts.md) article.

> [!NOTE]
> Expiration of all the access tokens in Video Indexer is one hour.

## Root elements

Attribute | Description
---|---
id|The id of this video. For example, 63c6d532ff.
partition|A logical partition that the user can specify in upload in order to search for it later.
name|The name of the video. For example, Azure Monitor.
description|Description of the video. For example, "John Kemnetz joins Scott Hanselman to show how to unlock the power of Azure monitoring data with Azure Monitor."
userName|The creator of the video. For example, Channel9 Videos.
createTime |Time created. For example, 2017-03-31T16:36:41.4504249+00:00.
privacyMode|Your video can have one of the following modes: **Private**, **Public**. **Public** - the video is visible to everyone in your account and anyone that has a link to the video. **Private** - the video is visible to everyone in your account.
isOwned|True, if the current user owns the video. Otherwise, false.  
isBase|True, if the breakdown is based on a source video. False, if the breakdown is of a playlist that is derived from another breakdown.
durationInSeconds|Duration of the video.
summarizedInsights|Contains one [summarizedInsights](#summarizedInsights).
breakdowns|May contain one or more [breakdowns](#breakdowns)
social|Contains one **social** element that describes number of likes and views of the video.

## summarizedInsights

This section shows the summary of the insights.

Attribute | Description
---|---
name|The name of the video. For example, Azure Monitor.
shortId|The id of the video. For example, 63c6d532ff.
privacyMode|Your breakdown can have one of the following modes: **Private**, **Public**. **Public** - the video is visible to everyone in your account and anyone that has a link to the video. **Private** - the video is visible to everyone in your account.
duration|Contains one duration that describes the time an insight occurred. Duration is in seconds.
thumbnailUrl|The video's thumbnail full URL. For example, "https://www.videoindexer.ai/api/Thumbnail/3a9e38d72e/d1f5fac5-e8ae-40d9-a04a-6b2928fb5d10?accessToken=eyJ0eXAiOiJKV1QiLCJhbGciO...". Notice that if the video is private, the URL contains a one hour access token. After one hour, the URL will no longer be valid and you will need to either get the breakdown again with a new url in it, or call GetAccessToken to get a new access token and construct the full url manually ('https://www.videoindexer.ai/api/Thumbnail/[shortId]/[ThumbnailId]?accessToken=[accessToken]').
faces|May contain one or more [faces](#faces)
topics|May contain one or more [topics](#topics)
sentiments|May contain one or more [sentiments](#sentiments)
audioEffects| May contain one or more [audioEffects](#audioEffects)
brands| May contain zero or more [brands](#brands)

## breakdowns

This section shows the details of the insights.

Attribute | Description
---|---
id|The breakdown id. For example, 63c6d532ff.
state|The processing state of the given breakdown id. Could be one of the following: Uploaded, Processing, Processed, Failed.
processingProgress|The progress. For example, 10%.
externalId| You can set externalId during upload. For example, "4f9c3500-eca7-4ab3-987e-a745017af698". You can later search for your videos by this external id.
externalUrl|You can set externalUrl during upload. 
metadata|You can set metadata during upload. 
insights|May contain one or more [insights](#insights)
thumbnailUrl|The video's thumbnail full URL. For example, "https://www.videoindexer.ai/api/Thumbnail/3a9e38d72e/d1f5fac5-e8ae-40d9-a04a-6b2928fb5d10?accessToken=eyJ0eXAiOiJKV1QiLCJhbGciO...". Notice that if the video is private, the URL contains a one hour access token. After one hour, the URL will no longer be valid and you will need to either get the breakdown again with a new url in it, or call GetAccessToken to get a new access token and construct the full url manually ('https://www.videoindexer.ai/api/Thumbnail/[shortId]/[ThumbnailId]?accessToken=[accessToken]').
publishedUrl|The published URL. For example, "https://BreakdownMedia.azureedge.net:443/d5e5232d-48e2-4fbc-9893-0ea6335da563/Azure%20Monitor%20%20Azure%20Friday.ism/manifest."
viewToken|The bearer token
sourceLanguage|The source language. The following are supported: Chinese, English, French, German, Italian, Japanese, Portuguese, Russian, Spanish.
language|The language of the transcript.

## insights

Attribute | Description 
---|---
transcriptBlocks|May contain one or more [transcriptBlocks](#transcriptBlocks)
topics|May contain one or more [topics](#topics)
faces|May contain one or more [faces](#faces)
participants|May contain one or more [participants](#participants)
contentModeration|May contain one [contentModeration](#contentModeration)
audioEffectsCategories|May contain one or more [audioEffectsCategories](#audioEffectsCategories)

## faces

### summarizedInsights

**faces** that appear under **summarizedInsights**, show a summary of each face found in the video.

Attribute | Description 
---|---
id|The id of a person. For example, 11775.
shortId|The short id. Because a playlist may be derived from several breakdowns, this id is needed to find out which of these breakdowns is the origin of each face.  
name|If the face is recognized, the name of the person is added. For example, "Scott Hanselman". If the face is unknown, "Unknown #" is added. 
description|If the face is recognized, the description is populated based on the Bing API search. Otherwise, the description is **null**.
title|If the face is recognized, the description is populated based on the Bing API search. Otherwise, the title is **null**.
thumbnailFullUrl|The face's thumbnail full URL. For example, "https://www.videoindexer.ai/api/Thumbnail/3a9e38d72e/d1f5fac5-e8ae-40d9-a04a-6b2928fb5d10?accessToken=eyJ0eXAiOiJKV1QiLCJhbGciO...". Notice that if the video is private, the URL contains a one hour access token. After one hour, the URL will no longer be valid and you will need to either get the breakdown again with a new url in it, or call GetAccessToken to get a new access token and construct the full url manually ('https://www.videoindexer.ai/api/Thumbnail/[shortId]/[ThumbnailId]?accessToken=[accessToken]').
appearances|May contain one or more [appearances](#appearances)
seenDuration|For how long the face was seen (in seconds).
seenDurationRatio|Presence relative to the video duration (0-1).

### breakdown insights

**faces** that appear under **breakdowns**, describe details about each face found in the video.

Attribute | Description 
---|---
id|The id of a person. For example, 11775.
bingId|
name|If the face is recognized, the name of the person is added. For example, "Scott Hanselman". If the face is unknown, "Unknown #" is added. 
thumbnailId|For example, 616468f0-1636-4efa-94e7-262f2e575059.
description|If the face is recognized, the description is populated based on the Bing API search. Otherwise, the description is **null**.
title|If the face is recognized, the description is populated based on the Bing API search. Otherwise, the title is **null**.
imageUrl|This URL points to an image that is taken from the source video.  
confidence|The confidence score (higher is better).
knownPersonId|The id of a known person (for example, celebrity). If a person is not known, the id contains zeros. For example, e3eaff5f-ee1b-4eac-80ce-ebac47aadf64.

## topics

### summarizedInsights

**topics** that appear under **summarizedInsights**, show a summary of each topic found in the video.

Attribute | Description 
---|---
name|The topic name (for example, "Azure"). 
appearances|May contain one or more [appearances](#appearances).
isTranscript|True, if found in a transcript. False, if found in an OCR.

### breakdown insights

**topics** that appear under **breakdowns**, describe details about each topic found in the video.

|Attribute | Description |
|---|---|
|id|Unique topic id.|
|name|The topic name.|
|stem|Currently, this attribute is not used.|
|words|Currently, this attribute is not used.|
|rank|Relevance score (higher is better).|

## sentiments

Attribute | Description
---|---
sentimentKey| Currently, the following sentiments are supported: Positive, Neutral, Negative. 
appearances|May contain one or more [appearances](#appearances)|.
seenDurationRatio|Presence relative to the video duration (0-1).

## audioEffects

Attribute | Description 
---|---
audioEffectKey| Valid values are: Speech, Silence, HandClaps.
appearances|May contain one or more [appearances](#appearances)
seenDurationRatio|Presence relative to the video duration (0-1).
seenDuration|For how long the audio effect was present (in seconds).

## appearances

Attribute | Description 
---|---
startTime| Time value.
endTime|Time value.
startSeconds| Time value.
endSeconds| Time value.

## participants

Attribute | Description 
---|---
id|The id of the participant.
name|The name of the participant. For example, Speaker #1.
pictureUrl|The **pictureUrl** attribute is reserved for future use.

## contentModeration

Attribute | Description 
---|---
adultClassifierValue|The confidence level that the video has adult content.
racyClassifierValue|The confidence level that the video has racy content.
bannedWordsCount|Number of profanity words. 
bannedWordsRatio|Ratio of profanity words from the total number of words.
reviewRecommended|Boolean value indicating if the video should be manually reviewed.
isAdult|Boolean values indicating if the video is considered an adult video after manual review.

## audioEffectsCategories

Attribute | Description 
---|---
type|Id of the category.
key|One of the following: Speech, Silence, HandClaps. 

## transcriptBlocks

Attribute | Description
---|---
id|Id of the block.
lines|May contain one or more [lines](#lines)
sentimentIds|The **sentimentIds** attribute is reserved for future use.
thumbnailIds|The **thumbnailIds** attribute is reserved for future use.
sentiment|The sentiment in the block (0-1, negative to positive).
faces|May contain one or more [faces](#faces).
ocrs|May contain one or more [ocrs](#ocrs).
audioEffectInstances|May contain one or more [audioEffectInstances](#audioEffectInstances).
scenes|May contain one or more [scenes](#scenes).
annotations|May contain zero or more [annotations](#annotations).

## ocrs

Describes at what point in the video the text content was found. 

Attribute | Description 
---|---
timeRange|The time range in the original video.
adjustedTimeRange|AdjustedTimeRange is the time range relative to the current playlist. Since you can create a playlist from different lines of different videos, you can take a 1-hour video and use just 1 line from it, for example, 10:00-10:15. In that case, you will have a playlist with 1 line, where the time range is 10:00-10:15 but the adjustedTimeRange is 00:00-00:15.
lines|May contain one or more [lines](#lines).

## lines

### transcriptBlocks

**lines** that appear under **transcriptBlocks**, describe lines of transcripts found in the video.

Attribute | Description 
---|---
id| The id of the line.
timeRange|The time range in the original video.
adjustedTimeRange|AdjustedTimeRange is the time range relative to the current playlist. Since you can create a playlist from different lines of different videos, you can take a 1-hour video and use just 1 line from it, for example, 10:00-10:15. In that case, you will have a playlist with 1 line, where the time range is 10:00-10:15 but the adjustedTimeRange is 00:00-00:15.
participantID| The id of the speaker of this line.
text| The transcript.
isIncluded| In base breakdowns always true. In derived playlists, the lines that were included in the source video, are set to isIncluded=true. All other lines are false.

### ocrs

**lines** that appear under **ocrs**, describe lines of OCRs found in the video.

Attribute | Description 
---|---
id|The OCR id.
width|Currently, this attribute is not used.
height|Currently, this attribute is not used.
language|The OCR language.
textData|The OCR text.
confidence|The confidence score (higher is better).

## scenes

Attribute | Description 
---|---
id|The scene id.
timeRange|Contains one **timeRange**.
keyFrame|The time of the key frame.
shots|May contain one or more [shots](#shots).

## shots

Attribute | Description 
---|---
id||The shot id.
timeRange|Contains one **timeRange**.
keyFrame|The time of the key frame.

## audioEffectInstances

Attribute | Description 
---|---
type|The index of the audio event: Laughter = 1, HandClaps = 2, Music = 3, Speech = 4, Silence = 5
ranges|May contain one or more [ranges](#ranges).

## ranges

**ranges** that appear under **audioEffectInstances**, describe audio effects in those ranges.

Attribute | Description 
---|---
timeRange|The time range in the original video.
adjustedTimeRange|AdjustedTimeRange is the time range relative to the current playlist. Since you can create a playlist from different lines of different videos, you can take a one hour video and use just one line from it, for example, 10:00-10:15. In that case, you will have a playlist with 1 line, where the time range is 10:00-10:15 but the adjustedTimeRange is 00:00-00:15.

## annotations

Returns tags based on recognizable objects, living beings, scenery, actions and visual patterns.

|Attribute|Description|
|---|---|
|id|The id of the annotation.|
|Name|The name of the annotation (for example, Person, Athletic game, Black Frames).|
|Appearances|May contain one or more appearances.|

## brands

Business and product brand names detected in the speech to text transcript and/or Video OCR. This does not include visual recognition of brands or logo detection.

Attribute | Description
---|---
id | The id of a brand.
name | The name of the brand from Bing or a customized brand.  
wikiId | The suffix of the brand wikipedia url. For example, "Target_Corporation” is the suffix of [https://en.wikipedia.org/wiki/Target_Corporation](https://en.wikipedia.org/wiki/Target_Corporation).
wikiUrl | The brand’s Wikipedia url, if exists. For example, [https://en.wikipedia.org/wiki/Target_Corporation](https://en.wikipedia.org/wiki/Target_Corporation).
confidence | The confidence value of the Video Indexer brand detector (0-1).
description | Description of the brand extracted from Wikipedia. 
appearances | May contain one or more appearances.
seenDuration | Presence relative to the video duration (0-1).

## Next steps

For information about how to create your own breakdown, see [View and edit Video Indexer insights](video-indexer-view-edit.md).

For information about how to embed widgets in your application, see [Embed Video Indexer widgets into your applications](video-indexer-embed-widgets.md). 

## See also

[Video Indexer API](https://videobreakdown.portal.azure-api.net/docs/services/582074fb0dc56116504aed75/operations/5857caeb0dc5610f9ce979e4)

[Video Indexer overview](video-indexer-overview.md)

