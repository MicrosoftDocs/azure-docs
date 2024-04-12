---
title: References - How to collect diagnostic audio recordings
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to collect diagnostic audio recordings.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# How to collect diagnostic audio recordings
To debug some issue, you may need audio recordings, especially when investigating audio quality problems, such as distorted audio and echo issues.

To collect diagnostic audio recordings, open the chrome://webrtc-internals(Chrome) or edge://webrtc-internals(Edge) page.

When you click *Enable diagnostic audio recordings*, the browser prompts a dialog asking for the download file location.

:::image type="content" source="./media/enable-diagnostic-audio-recordings.png" alt-text="Screenshot of diagnostic audio recordings settings.":::

After you finish an ACS call, you should be able to see files saved in the folder you choose.

:::image type="content" source="./media/diagnostic-audio-recordings.png" alt-text="Screenshot of diagnostic audio recording files.":::

`*.output.N.wav` is the audio output sent to the speaker.

`*.input.M.wav` is the audio input captured from the microphone.

`*.aecdump` contains the necessary wav files for debugging audio after processed by the audio processing module in browsers.
