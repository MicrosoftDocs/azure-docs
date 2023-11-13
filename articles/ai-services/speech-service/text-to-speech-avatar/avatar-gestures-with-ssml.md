---
title: Customize avatar gestures with SSML - Speech service
titleSuffix: Azure AI services
description: Learn how to edit text to speech avatar gestures with SSML
author: sally-baolian
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/15/2023
ms.author: v-baolianzou
keywords: text to speech avatar batch synthesis
---

# Customize text to speech avatar gestures with SSML (preview)

[!INCLUDE [Text to speech avatar preview](../includes/text-to-speech-avatar-preview.md)]

The [Speech Synthesis Markup Language (SSML)](../speech-synthesis-markup-structure.md) with input text determines the structure, content, and other characteristics of the text to speech output. Most SSML tags can also work in text to speech avatar. Furthermore, text to speech avatar batch mode provides avatar gestures insertion ability by using the SSML bookmark element with the format `<bookmark mark='gesture.*'/>`. 

A gesture starts at the insertion point in time. If the gesture takes more time than the audio, the gesture is cut at the point in time when the audio is finished.

## Bookmark example

The following example shows how to insert a gesture in the text to speech avatar batch synthesis with SSML.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
<voice name="en-US-JennyNeural">
Hello <bookmark mark='gesture.wave-left-1'/>, my name is Jenny, nice to meet you!
</voice>
</speak>
```

In this example, the avatar will start waving their hand at the left after the word "Hello".

:::image type="content" source="./media/gesture.png" alt-text="Screenshot of displaying the prebuilt avatar waving their hand at the left." lightbox="./media/gesture.png":::

## Supported pre-built avatar characters, styles and gestures

The full list of prebuilt avatar supported gestures provided here can also be found in the text to speech avatar portal.

|  Characters | Styles<sup>1</sup>               | Gestures<sup>2</sup>                    | 
|------------|-------------------|-----------------------------|
| Lisa| casual-sitting    | numeric1-left-1<br>numeric2-left-1<br>numeric3-left-1<br>thumbsup-left-1<br>show-front-1<br>show-front-2<br>show-front-3<br>show-front-4<br>show-front-5<br>think-twice-1<br>show-front-6<br>show-front-7<br>show-front-8<br>show-front-9              | 
|    Lisa         | graceful-sitting  | wave-left-1<br>wave-left-2<br>thumbsup-left<br>show-left-1<br>show-left-2<br>show-left-3<br>show-left-4<br>show-left-5<br>show-right-1<br>show-right-2<br>show-right-3<br>show-right-4<br>show-right-5       | 
|   Lisa          | graceful-standing |                             | 
|    Lisa         | technical-sitting | wave-left-1<br>wave-left-2<br>show-left-1<br>show-left-2<br>point-left-1<br>point-left-2<br>point-left-3<br>point-left-4<br>point-left-5<br>point-left-6<br>show-right-1<br>show-right-2<br>show-right-3<br>point-right-1<br>point-right-2<br>point-right-3<br>point-right-4<br>point-right-5<br>point-right-6                      |
|    Lisa         | technical-standing |                             | 

<sup>1</sup> Only `casual-sitting` style is supported on real-time API.

<sup>2</sup> Gestures are only supported on batch API and not supported on real-time API.      

## Next steps

* [What is text to speech avatar](what-is-text-to-speech-avatar.md)
* [Real-time synthesis](./real-time-synthesis-avatar.md)
* [Use batch synthesis for text to speech avatar](./batch-synthesis-avatar.md)

