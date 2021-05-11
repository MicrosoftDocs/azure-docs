---
title: Audio effects detection  
titleSuffix: Azure Video Analyzer
description: "Audio Effects Detection" Is one of Azure Video Analyzer (AVA) for Media AI capabilities. It can detects a various of acoustics events and classify them into different acoustic categories (such as Gunshot, Screaming, Crowd Reaction and more).
services: media-services
author: Juliako
manager: femila

ms.service: azure-video-analyzer
ms.topic: article
ms.date: 04/30/2021
ms.author: juliako
---

#  Audio effects detection (public preview)

"Audio Effects Detection" Is one of Azure Video Analyzer (AVA) for Media AI capabilities. It can detects a various of acoustics events and classify them into different acoustic categories (such as Gunshot, Screaming, Crowd Reaction and more).

Audio Events Detection can be used in many domains. Two examples are:

· Using Audio Effects Detection is the domain of Public Safety & Justice. Audio Effects Detection can detect and classify Gunshots, Explosion and Glass-Shattering. Therefore, it can be implemented in a smart-city systems or in other public environments that includes cameras and microphones. Offering a fast and accurate detection of violence incidents. · In the Media & Entertainment domain, companies with a large set of video archives can easily improve their accessibility scenarios, by enhancing their video transcription with non-speech effects to provide more context for people who are hard of hearing.

## Audio Categories Supported

Audio Effect Detection can detect and classify 13 different categories. In the next table you can find the different categories split in to the different VI presets, divided to ‘Standard’ and ‘Advanced’. more about the different indexing options can be found here:

Indexing Type Standard indexing Advanced indexing

Preset Name "Audio Only” “Video + Audio” “Advance Audio” “Advance Video + Audio”

Appear in VI insights pane V

Category Crowd Reaction V V Silence V V Gunshot V Breaking glass V Alarm ringing V Siren Wailing V Laughter V Dog Barking V

Result formats

The audio effects are retrieved in the insights JSON that includes the category id, type, name, and set of instances per category along with their specific timeframe and confidence score.

The ‘name’ parameter will be presented in the language in which the JSON was indexed, while the type will always remain the same.

How to Index Audio Affects?

In order to set the index process to include the detection of Audio Effects, the user should chose the Advanced preset. Through the video + Audio or Audio only.

## Closed Caption

When Audio Effects are retrieved in the closed caption files, they will be retrieved in square brackets the following structure:

Type Example

SRT 00:00:00,000 --> 00:00:03,671

[Gunshot]

VTT 00:00:00.000 --> 00:00:03.671 [Gunshot]

TTML <!-- Confidence: 0.9047 --> <p begin="00:00:00.000" end="00:00:03.671">[Gunshot]</p>

TXT [Gunshot]

CSV 0.9047,00:00:00.000,00:00:03.671, [Gunshot]

Audio Effects in closed captions file will be retrieved with the following logic employed:

· ‘Silence’ event type will not be added to the closed captions

· Maximum duration to show an event I 5 seconds

· Minimum timer duration to show an event is 700 milliseconds

Adding audio effects in closed caption files

Audio effects can be added to the closed captions files supported by Azure Video Analyzer (AVA) via the Get video captions API by choosing true in the ‘includeAudioEffects’ parameter or via the video.ai portal experience by selecting Download -> Closed Captions -> Include Audio Effects.

Note: when using update transcript from closed caption files or update custom language model from closed caption files, audio effects included in those files will be ignored.

## Limitations and assumptions

* The model works on non-speech segments only.
* The model is currently working for a single category at a time. For example, a crying and speech on the background or gunshot + explosion are not supported for now.
* The model is currently not supporting cases when there is a loud music on background.
* Minimal segment length – 2 seconds.

## Next steps

Review [overview](video-indexer-overview.md)
