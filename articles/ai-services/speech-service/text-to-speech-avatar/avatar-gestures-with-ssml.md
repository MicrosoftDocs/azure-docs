---
title: Customize avatar gestures with SSML - Speech service
titleSuffix: Azure AI services
description: Learn how to edit text to speech avatar gestures with SSML.
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 2/24/2024
ms.reviewer: v-baolianzou
ms.author: eur
author: eric-urban
---

# Customize text to speech avatar gestures with SSML

The [Speech Synthesis Markup Language (SSML)](../speech-synthesis-markup-structure.md) with input text determines the structure, content, and other characteristics of the text to speech output. Most SSML tags can also work in text to speech avatar. Furthermore, text to speech avatar batch mode provides avatar gestures insertion ability by using the SSML bookmark element with the format `<bookmark mark='gesture.*'/>`. 

A gesture starts at the insertion point in time. If the gesture takes more time than the audio, the gesture is cut at the point in time when the audio is finished.

## Bookmark example

The following example shows how to insert a gesture in the text to speech avatar batch synthesis with SSML.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
<voice name="en-US-AvaMultilingualNeural">
Hello <bookmark mark='gesture.wave-left-1'/>, my name is Ava, nice to meet you!
</voice>
</speak>
```

In this example, the avatar will start waving their hand at the left after the word "Hello".

:::image type="content" source="./media/gesture.png" alt-text="Screenshot of displaying the prebuilt avatar waving their hand at the left." lightbox="./media/gesture.png":::

## Supported prebuilt avatar characters, styles, and gestures

The full list of prebuilt avatar supported gestures provided here can also be found in the text to speech avatar portal.

|  Characters | Styles | Gestures | 
|------------|-------------------|-----------------------------|
| Harry | business | 123<br>calm-down<br>come-on<br>five-star-reviews<br>good<br>hello<br>introduce<br>invite<br>thanks<br>welcome |
| Harry | casual | 123<br>come-on<br>five-star-reviews<br>gong-xi-fa-cai<br>good<br>happy-new-year<br>hello<br>please<br>welcome |
| Harry | youthful | 123<br>come-on<br>down<br>five-star<br>good<br>hello<br>invite<br>show-right-up-down<br>welcome |
| Jeff | business | 123<br>come-on<br>five-star-reviews<br>hands-up<br>here<br>meddle<br>please2<br>show<br>silence<br>thanks |
| Jeff | formal | 123<br>come-on<br>five-star-reviews<br>lift<br>please<br>silence<br>thanks<br>very-good |
| Lisa| casual-sitting | numeric1-left-1<br>numeric2-left-1<br>numeric3-left-1<br>thumbsup-left-1<br>show-front-1<br>show-front-2<br>show-front-3<br>show-front-4<br>show-front-5<br>think-twice-1<br>show-front-6<br>show-front-7<br>show-front-8<br>show-front-9              | 
|    Lisa         | graceful-sitting  | wave-left-1<br>wave-left-2<br>thumbsup-left<br>show-left-1<br>show-left-2<br>show-left-3<br>show-left-4<br>show-left-5<br>show-right-1<br>show-right-2<br>show-right-3<br>show-right-4<br>show-right-5       | 
|   Lisa          | graceful-standing |                             | 
|    Lisa         | technical-sitting | wave-left-1<br>wave-left-2<br>show-left-1<br>show-left-2<br>point-left-1<br>point-left-2<br>point-left-3<br>point-left-4<br>point-left-5<br>point-left-6<br>show-right-1<br>show-right-2<br>show-right-3<br>point-right-1<br>point-right-2<br>point-right-3<br>point-right-4<br>point-right-5<br>point-right-6                      |
|    Lisa         | technical-standing | 
| Lori | casual | 123-left<br>a-little<br>beg<br>calm-down<br>come-on<br>five-star-reviews<br>good<br>hello<br>open<br>please<br>thanks |
| Lori | graceful | 123-left<br>applaud<br>come-on<br>introduce<br>nod<br>please<br>show-left<br>show-right<br>thanks<br>welcome |
| Lori | formal | 123<br>come-on<br>come-on-left<br>down<br>five-star<br>good<br>hands-triangle<br>hands-up<br>hi<br>hopeful<br>thanks |
| Max | business | a-little-bit<br>click-the-link<br>display-number<br>encourage-1<br>encourage-2<br>five-star-praise<br>front-right<br>good-01<br>good-02<br>introduction-to-products-1<br>introduction-to-products-2<br>introduction-to-products-3<br>left<br>lower-left<br>number-one<br>press-both-hands-down-1<br>press-both-hands-down-2<br>push-forward<br>raise-ones-hand<br>right<br>say-hi<br>shrug-ones-shoulders<br>slide-from-left-to-right<br>slide-to-the-left<br>thanks<br>the-front<br>top-middle-and-bottom-left<br>top-middle-and-bottom-right<br>upper-left<br>upper-right<br>welcome |
| Max | casual | a-little-bit<br>applaud<br>click-the-link<br>display-number<br>encourage-1<br>encourage-2<br>five-star-praise<br>front-left<br>good-1<br>good-2<br>hello<br>introduction-to-products-1<br>introduction-to-products-2<br>introduction-to-products-3<br>introduction-to-products-4<br>left<br>length<br>nodding<br>number-one<br>press-both-hands-down<br>raise-ones-hand<br>right<br>right-front<br>shrug-ones-shoulders<br>slide-from-left-to-right<br>slide-to-the-left<br>thanks<br>the-front<br>upper-left<br>upper-right<br>welcome |
| Max | formal | a-little-bit<br>click-the-link<br>display-number<br>encourage-1<br>encourage-2<br>five-star-praise<br>front-left<br>front-right<br>good-1<br>good-2<br>introduction-to-products-1<br>introduction-to-products-2<br>introduction-to-products-3<br>left<br>lower-left<br>lower-right<br>press-both-hands-down<br>push-forward<br>right<br>say-hi<br>shrug-ones-shoulders<br>slide-from-left-to-right<br>slide-to-the-left<br>the-front<br>top-middle-and-bottom-right<br>upper-left<br>upper-right |
| Meg | formal | a-little-bit<br>click-the-link<br>display-number<br>encourage-1<br>encourage-2<br>five-star-praise<br>front-left<br>front-right<br>good-1<br>good-2<br>hands-forward<br>introduction-to-products-1<br>introduction-to-products-2<br>introduction-to-products-3<br>left<br>number-one<br>press-both-hands-down-1<br>press-both-hands-down-2<br>right<br>say-hi<br>shrug-ones-shoulders<br>slide-from-left-to-right<br>the-front<br>upper-left<br>upper-right |
| Meg | casual | a-little-bit<br>click-the-link<br>cross-hand<br>display-number<br>encourage-1<br>encourage-2<br>five-star-praise<br>front-left<br>front-right<br>good-1<br>good-2<br>handclap<br>introduction-to-products-1<br>introduction-to-products-2<br>introduction-to-products-3<br>left<br>length<br>lower-left<br>lower-right<br>number-one<br>press-both-hands-down<br>right<br>say-hi<br>shrug-ones-shoulders<br>slide-from-right-to-left<br>slide-to-the-left<br>spread-hands<br>the-front<br>top-middle-and-bottom-left<br>top-middle-and-bottom-right<br>upper-left<br>upper-right |
| Meg | business | a-little-bit<br>encourage-1<br>encourage-2<br>five-star-praise<br>front-left<br>front-right<br>good-1<br>good-2<br>introduction-to-products-1<br>introduction-to-products-2<br>introduction-to-products-3<br>left<br>length<br>number-one<br>press-both-hands-down-1<br>press-both-hands-down-2<br>raise-ones-hand<br>right<br>say-hi<br>shrug-ones-shoulders<br>slide-from-left-to-right<br>slide-to-the-left<br>spread-hands<br>thanks<br>the-front<br>upper-left |

All styles except `lisa-graceful-sitting`, `lisa-graceful-standing`, `lisa-technical-sitting`, and `lisa-technical-standing` are supported via the real-time text to speech API. Gestures are only supported with the batch synthesis API and aren't supported via the real-time API.   

## Next steps

* [What is text to speech avatar](what-is-text-to-speech-avatar.md)
* [Real-time synthesis](./real-time-synthesis-avatar.md)
* [Use batch synthesis for text to speech avatar](./batch-synthesis-avatar.md)

