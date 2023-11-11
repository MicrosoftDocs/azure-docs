---
title: How to record video samples for custom text to speech avatar - Speech service
titleSuffix: Azure AI services
description: Learn how to prepare high-quality video samples for creating a custom text to speech avatar
services: cognitive-services
author: sally-baolian
manager: nitinme
ms.service: azure-ai-speech
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: v-baolianzou
ms.custom: cog-serv-seo-aug-2020
keywords: how to record video samples for custom text to speech avatar
---

# Recording video samples for custom text to speech avatar

This article provides instructions on preparing high-quality video samples for creating a custom text to speech avatar.

## Recording environment

- We recommend recording in a professional video shooting studio or a well-lit place with a clean background.
- The background of the video should be clean, smooth, pure-colored, and a green screen is the best choice.
- Ensure even and bright lighting on the actor's face, avoiding shadows on face or reflections on actor's glasses and clothes.
- Camera requirement: A minimum of 1080P resolution and 36 FPS.
- Other devices: You can use a teleprompter to remind the script during recording but ensure it doesn't affect the actor's gaze towards the camera. Provide a seat if the avatar needs to be in a sitting position.

## Appearance of the actor

The custom text to speech avatar doesn't support customization of clothes or looks. Therefore, it's essential to carefully design and prepare the avatar's appearance when recording the training data. Consider the following tips:

- The actor's hair should have a smooth and glossy surface, avoiding messy hair or backgrounds showing through the hair.

- Avoid wearing clothing that is too similar to the background color or reflective materials like white shirts. Avoid clothing with obvious lines or items with logos and brand names you don't want to highlight.

- Ensure the actor's face is clearly visible, not obscured by hair, sunglasses, or accessories.

## What video clips to record

You need three types of basic video clips:

**Status 0 speaking:**
   - Status 0 represents the posture you can naturally maintain most of the time while speaking. For example, arms crossed in front of the body or hanging down naturally at the sides. 
   - Maintain a front-facing pose with minimal body movement. The actor can nod slightly, but don't move the body too much.
   - Length: keep speaking in status 0 for 3-5 minutes.

**Naturally speaking:**
   - Actor speaks in status 0 but with natural hand gestures from time to time.
   - Hands should start from status 0 and return after making gestures.
   - Use natural and common gestures when speaking. Avoid meaningful gestures like pointing, applause, or thumbs up.
   - Length: Minimum 5 minutes, maximum 30 minutes in total. At least one piece of 5-minutes continuous video recording is required. If recording multiple video clips, keep each clip under 10 minutes.

**Silent status:**
   - Maintain status 0 but don't speak.
   - Maintain a smile or nodding head as if listening or waiting.
   - Length: 1 minute.

Other tips:

- Ensure all video clips are taken in the same conditions.
- Mind facial expressions, which should be suitable for the avatar's use case. For example, look positive and be smile if the custom text to speech avatar will be used as customer service, and look professionally if the avatar will be used for news reporting.
- Maintain eye gaze towards the camera, even when using a teleprompter
- Return your body to status 0 when pausing speaking.
- Speak on a self-chosen topic, and minor speech mistakes like miss a word or mispronounced are acceptable. If the actor misses a word or mispronounces something, just go back to status 0, pause for 3 seconds, and then continue speaking.
- Consciously pause between sentences and paragraphs. When pausing, go back to the status 0  and close your lips.
- Maintain high-quality audio, avoiding background noise, like other people's voice.

## Data requirements

- Avatar training video recording file format: .mp4 or .MOV.
- Resolution: >= 1920*1080.
- Frame rate per second: >= 25 FPS.

## Next steps

* [What is text to speech avatar](what-is-text-to-speech-avatar.md)
* [What is custom text to speech avatar](what-is-custom-tts-avatar.md)
