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

When you call the **Get Video Index** API and the response status is OK, you get a detailed JSON output as the response content. The JSON content contains details of the specified video insights including (transcript, OCRs, people). The details include keywords (topics), faces, blocks. Each block includes time ranges, transcript lines, OCR lines, sentiments, faces, and block thumbnails.

You can use the **Get Video Index** API to get the full index of a video as a JSON content.  
 
	GET https://videobreakdown.azure-api.net/Breakdowns/Api/Partner/Breakdowns/63c6d532ff HTTP/1.1
	Host: videobreakdown.azure-api.net
	Ocp-Apim-Subscription-Key: ••••••••••••••••••••••••••••••••
	
You can also visually examine the video's summarized insights by pressing the **Play** button on the video in the Video Indexer portal. For more information, see [View and edit video insights](video-indexer-view-edit.md).

![Insights](./media/video-indexer-output-json/video-indexer-summarized-insights.png)

This article examines the JSON content returned by the  **Get Video Index** API. It might be helpful, to review the [concepts](video-indexer-concepts.md) article.

> [!NOTE]
> Expiration of all the access tokens in Video Indexer is one hour.

## Root elements

Attribute | Description
---|---
id|The id of this video. For example, 63c6d532ff.
name|The name of the video. For example, Azure Monitor.
description|Description of the video. For example, "John Kemnetz joins Scott Hanselman to show how to unlock the power of Azure monitoring data with Azure Monitor."
userName|The creator of the video. For example, Channel9 Videos.
created |Time created. For example, 2017-03-31T16:36:41.4504249+00:00.
privacyMode|Your video can have one of the following modes: **Private**, **Public**. **Public** - the video is visible to everyone in your account and anyone that has a link to the video. **Private** - the video is visible to everyone in your account.
state|The processing state of the given video index id. Could be one of the following: Uploaded, Processing, Processed, Failed, Quarantined.
isOwned|True, if the current user owns the video. Otherwise, false.  
isBase|True, if the video index is based on a source video. False, if the video index is of a playlist that is derived from another video index.
durationInSeconds|Duration of the video.
summarizedInsights| Calculated dynamically from [insights](#insights). **Subject to frequent changes, please prefer using insights**.
videos|May contain one or more [videos](#videos)
videosRanges|May contain one or more [videosRanges](#videosRanges)

## videos

This section shows the details of the insights.

Attribute | Description
---|---
accountId|The accountId to which the video belongs to. For example, 73f36236-987f-4251-94c2-297c35091647.
id|The video id. For example, 63c6d532ff.
state|The processing state of the given video index id. Could be one of the following: Uploaded, Processing, Processed, Failed, Quarantined.
processingProgress|The progress. For example, 10%.
failureCode|The failure code. Can be General, InvalidInput, UnsupportedFileType. In case of a failure, will be accompanied by failureMessage.
failureMessage|The failure message.
isAdult|Is the movie marked as having adult content.
externalId| You can set externalId during upload. For example, "4f9c3500-eca7-4ab3-987e-a745017af698". You can later search for your videos by this external id.
externalUrl|You can set externalUrl during upload. 
metadata|You can set metadata during upload. 
insights|May contain one or more [insights](#insights)
thumbnailId|The video's thumbnail id. For example, 1d943f97-1250-4806-aae7-69bba7e7eef3
publishedUrl|The published URL.
viewToken|The bearer token
sourceLanguage|The source language. The following are supported: Chinese, English, French, German, Italian, Japanese, Portuguese, Russian, Spanish.
language|The language of the transcript.
indexingPreset|The indexing preset that was used for indexing.
linguisticModelId|The id of the linguistic model that was used. For example, 594500a2-e516-4cb3-a285-3f10da06ee37.

## insights

Attribute | Description 
---|---
version|The insights version. For example, 0.8.9.0.
duration|String representation of the duration of the video.
sourceLanguage|The source language. The following are supported: Chinese, English, French, German, Italian, Japanese, Portuguese, Russian, Spanish.
language|The language of the transcript.
transcript|May contain one or more [transcript](#transcript)
ocr|May contain one or more [ocr](#ocr)
keywords|May contain one or more [keywords](#keywords)
faces|May contain one or more [faces](#faces)
labels|May contain one or more [labels](#labels)
shots|May contain one or more [shots](#shots)
brands|May contain one or more [brands](#brands)
sentiments|May contain one or more [sentiments](#sentiments)
blocks|May contain one or more [blocks](#blocks)
speakers|May contain one or more [speakers](#speakers)
textualContentModeration|May contain one [textualContentModeration](#textualContentModeration)

## faces

**faces** that appear under **video insights**, describe details about each face found in the video.

Attribute | Description 
---|---
id|The id of a person. For example, 11775.
name|If the face is recognized, the name of the person is added. For example, "Scott Hanselman". If the face is unknown, "Unknown #" is added.
confidence|The confidence score (higher is better).
description|If the face is recognized, the description is populated based on the Bing API search. Otherwise, the description is **null**.
thumbnailId|For example, 616468f0-1636-4efa-94e7-262f2e575059.
referenceId|Referenced object's id. For example, 15dec2d7-29d2-4783-9ce4-445334d92a2a.
referenceType|Referenced object's type. For example, Bing.
title|If the face is recognized, the description is populated based on the Bing API search. Otherwise, the title is **null**.
imageUrl|This URL points to an image that is taken from the source video.
instances|May contain one or more [instances](#instances), with additional field of **thumbnailsIds**: Thumbnail ids of the recognized face.

## sentiments

Attribute | Description
---|---
id|Sentiment id.
averageScore|Sentiment's average score.
sentimentType| Currently, the following sentiments are supported: Positive, Neutral, Negative. 
instances|May contain one or more [instances](#appearances)|.

## audioEffects

Attribute | Description 
---|---
type| Valid values are: Unlabeled, Baseline, Clapping, Speech, Silence
appearances|May contain one or more [appearances](#appearances)
seenDurationRatio|Presence relative to the video duration (0-1).
seenDuration|For how long the audio effect was present (in seconds).

## speakers

Attribute | Description 
---|---
id|The id of the speaker.
name|The name of the speaker. For example, Speaker #1.
instances|May contain one or more [instances](#instances)

## contentModeration

Attribute | Description 
---|---
adultClassifierValue|The confidence level that the video has adult content.
racyClassifierValue|The confidence level that the video has racy content.
bannedWordsCount|Number of profanity words. 
bannedWordsRatio|Ratio of profanity words from the total number of words.
reviewRecommended|Boolean value indicating if the video should be manually reviewed.
isAdult|Boolean values indicating if the video is considered an adult video after manual review.

## transcript

Attribute | Description
---|---
id|Id of the transcript line.
text|The transcript line's text.
confidence|The condfidence in the transcription.
speakerId|Line speaker's id.
language|Transcript line's language
instances|Array of size 1 of [instances](#instances).

### ocr

Attribute | Description 
---|---
id|The OCR id.
width|Currently, this attribute is not used.
height|Currently, this attribute is not used.
language|The OCR language.
text|The OCR text.
confidence|The confidence score (higher is better).
instances||May contain one or more [instances](#instances).

## shots

Attribute | Description 
---|---
id||The shot id.
keyFrames|May contain one or more [keyFrame](#keyFrame).
instances||Contains one element of type [instances](#instances).

## keyFrame

Attribute | Description 
---|---
id||The keyFrame id.
instances||Contains one element of type [instances](#instances), with one more field **thumbnailId**: the shot's thumbnail's id.

## labels

Returns tags based on recognizable objects, living beings, scenery, actions and visual patterns.

|Attribute|Description|
|---|---|
|id|The id of the annotation.|
|name|The name of the annotation (for example, Person, Athletic game, Black Frames).|
|language|The language the annotations is presented at. For example, en-US.
|instances||May contain one or more [instances](#instances)|

## brands

Business and product brand names detected in the speech to text transcript and/or Video OCR. This does not include visual recognition of brands or logo detection.

Attribute | Description
---|---
id | The id of a brand.
name | The name of the brand from Bing or a customized brand.  
referenceId | The suffix of the brand wikipedia url. For example, "Target_Corporation” is the suffix of [https://en.wikipedia.org/wiki/Target_Corporation](https://en.wikipedia.org/wiki/Target_Corporation).
referenceUrl | The brand’s Wikipedia url, if exists. For example, [https://en.wikipedia.org/wiki/Target_Corporation](https://en.wikipedia.org/wiki/Target_Corporation).
confidence | The confidence value of the Video Indexer brand detector (0-1).
isCustom | Is the brand a custom brand provided by the user or a build in provided by Video Indexer.
description | Description of the brand extracted from Wikipedia. 
instances | May contain one or more instances, with additional field **brandType**: Was the brand identified from transcript or ocr.

## Next steps

For information about how to create your own breakdown, see [View and edit Video Indexer insights](video-indexer-view-edit.md).

For information about how to embed widgets in your application, see [Embed Video Indexer widgets into your applications](video-indexer-embed-widgets.md). 

## See also

[Video Indexer API](https://videobreakdown.portal.azure-api.net/docs/services/582074fb0dc56116504aed75/operations/5857caeb0dc5610f9ce979e4)

[Video Indexer overview](video-indexer-overview.md)

