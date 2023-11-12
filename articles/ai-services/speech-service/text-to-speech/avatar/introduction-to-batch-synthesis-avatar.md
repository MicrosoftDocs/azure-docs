---
title: Introduction to batch synthesis - Speech service
titleSuffix: Azure AI services
description: Learn the overview of batch synthesis
author: sally-baolian
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 11/15/2023
ms.author: v-baolianzou
ms.custom: cog-serv-seo-aug-2020
keywords: text to speech avatar
---

# Introduction to batch synthesis

The text to speech avatar batch synthesis API (preview) allows for the asynchronous synthesis of text into a talking avatar as a video file. Publishers and video content platforms can utilize this API to create avatar video content in a batch. That approach can be suitable for various use cases such as training materials, presentations, or advertisements.

The avatar batch synthesis API operates asynchronously and doesn't return synthesized videos in real-time. Instead, you submit text for synthesis, poll for the synthesis status, and download the video output when the status indicates success. The text input formats must be plain text or Speech Synthesis Markup Language (SSML) text.

This diagram provides a high-level overview of the workflow.

:::image type="content" source="../../media/avatar/batch-synthesis-workflow.png" alt-text="Screenshot of displaying a high-level overview of the batch synthesis workflow" lightbox="../../media/avatar/batch-synthesis-workflow.png":::

To perform batch synthesis, you can use the following REST API operations.

| Operation            | Method  | REST API call                                      |
|----------------------|---------|---------------------------------------------------|
| Create batch synthesis | POST    | texttospeech/3.1-preview1/batchsynthesis/talkingavatar |
| Get batch synthesis    | GET     | texttospeech/3.1-preview1/batchsynthesis/talkingavatar/{id} |
| List batch synthesis   | GET     | texttospeech/3.1-preview1/batchsynthesis/talkingavatar |
| Delete batch synthesis | DELETE  | texttospeech/3.1-preview1/batchsynthesis/talkingavatar/{id} |

You can refer to the code samples on the [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples).

## Next steps

* [Get started with text to speech avatar](get-started-avatar.md)
* [What is text to speech avatar](what-is-text-to-speech-avatar.md)
* [What is custom text to speech avatar](what-is-custom-tts-avatar.md)
