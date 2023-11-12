---
title: Edit avatar gestures with SSML - Speech service
titleSuffix: Azure AI services
description: Learn how to edit text to speech avatar gestures with SSML
author: sally-baolian
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/15/2023
ms.author: v-baolianzou
ms.custom: cog-serv-seo-aug-2020
keywords: text to speech avatar batch synthesis
---

# Edit avatar gestures with SSML

The [Speech Synthesis Markup Language (SSML)](../../speech-synthesis-markup-structure.md) with input text determines the structure, content, and other characteristics of the text to speech output. Most SSML tags can also work in text to speech avatar. Furthermore, text to speech avatar batch mode provides avatar gestures insertion ability by using the SSML bookmark element with the format `<bookmark mark='gesture.*'/>`. 

A gesture starts at the time point of insertion. If the gesture takes more time than the audio, the gesture is cut at the point the audio is finished.

**Bookmark example:**

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
<voice name="en-US-JennyNeural">
Hello <bookmark mark='gesture.wave-left-1'/>, my name is Jenny, nice to meet you!
</voice>
</speak>
```

In this example, the avatar will start waving their hand at the left after the word "Hello".

The full list of prebuilt avatar supported gestures can be found in the text to speech avatar portal and on this page.

:::image type="content" source="../../media/avatar/gesture.png" alt-text="Screenshot of displaying the prebuilt avatar waving their hand at the left" lightbox="../../media/avatar/gesture.png":::

## Supported pre-built avatar characters, styles and gestures

|  Characters | Styles            | Gestures                    | Enabled for batch API | Enabled for real-time API |
|------------|-------------------|-----------------------------|-----------------------|---------------------------|
| Lisa| casual-sitting    | numeric1-left-1<br>numeric2-left-1<br>numeric3-left-1<br>thumbsup-left-1<br>show-front-1<br>show-front-2<br>show-front-3<br>show-front-4<br>show-front-5<br>think-twice-1<br>show-front-6<br>show-front-7<br>show-front-8<br>show-front-9              | Yes                   | Yes                       |
|    Lisa         | graceful-sitting  | wave-left-1<br>wave-left-2<br>thumbsup-left<br>show-left-1<br>show-left-2<br>show-left-3<br>show-left-4<br>show-left-5<br>show-right-1<br>show-right-2<br>show-right-3<br>show-right-4<br>show-right-5       | Yes                   | No                        |
|   Lisa          | graceful-standing |                             | Yes                   | No                        |
|    Lisa         | technical-sitting | wave-left-1<br>wave-left-2<br>show-left-1<br>show-left-2<br>point-left-1<br>point-left-2<br>point-left-3<br>point-left-4<br>point-left-5<br>point-left-6<br>show-right-1<br>show-right-2<br>show-right-3<br>point-right-1<br>point-right-2<br>point-right-3<br>point-right-4<br>point-right-5<br>point-right-6                      | Yes                   | No                        |
|    Lisa         | technical-standing |                             | Yes                   | No                        |

## Next steps

* [Get started with text to speech avatar](get-started-avatar.md)
* [What is text to speech avatar](what-is-text-to-speech-avatar.md)
* [Introduction to batch synthesis](introduction-to-batch-synthesis-avatar.md)
* [Create batch synthesis](create-batch-synthesis-avatar.md)
* [Get batch synthesis](get-batch-synthesis-avatar.md)
* [Obtain batch synthesis results](batch-synthesis-results-avatar.md)
* [What is custom text to speech avatar](what-is-custom-tts-avatar.md)
