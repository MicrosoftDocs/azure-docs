---
title: "Quickstart: Test a model using audio files - Speech Studio"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll use Speech Studio to test recognition of speech in an audio file.
services: cognitive-services
author: v-demjoh
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 06/25/2020
ms.author: v-demjoh
---

# Quickstart: Test a model using an audio file in Speech Studio

In this quickstart, you use Speech Studio to convert speech from an audio file to text. Speech Studio lets you test, compare, improve, and deploy speech recognition models using related text, audio with human-labeled transcripts, and pronunciation guidance you provide.

## Prerequisites

Before you use Speech Portal, [follow these instructions to create an Azure account and subscribe to the Speech service](../how-to-custom-speech.md#set-up-your-azure-account). This unified subscription gives you access to speech-to-text, text-to-speech, speech translation, and the Custom Speech portal.

## Download an audio file

Follow these steps to download an audio file that contains speech and package it into a zip file.

1. Download the **[sample wav file from this link](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-speech-sdk/f9807b1079f3a85f07cbb6d762c6b5449d536027/samples/cpp/windows/console/samples/whatstheweatherlike.wav)** by right-clicking the link and selecting **Save link as**. Click **Save** to download the `whatstheweatherlike.wav` file.
2. Using a file explorer or terminal window with a zip tool, create a zip file named `whatstheweatherlike.zip` that contains the `whatstheweatherlike.wav` file you downloaded. In Windows, you can open Windows Explorer, navigate to the `Downloads` folder, right-click `whatstheweatherliike.wav`, click **Send to**, click **Compressed (zipped) folder**, and press enter to accept the default filename.

## Create a project in the Custom Speech portal

Follow these steps to create a project that contains your zip of one audio file.

1. Open [Speech Studio](https://speech.microsoft.com/), and click **New project**. Type a name for this project, and click **Create**. Your project appears in the Custom Speech list.
2. Click the name of your project. In the Data tab, click **Upload data**.
3. The speech data type defaults to **Audio only**, so click **Next**.
4. Name your new speech dataset `MyZipOfAudio`, and click **Next**.
5. Click **Browse files...**, navigate to your `whatstheweatherlike.zip` file, and click **Open**.
6. Click the **Upload** button. The browser uploads your zip file to Speech Studio, and Speech Studio processes the contents.

## Test a model

After Speech Studio processes the contents of your zip file, you can play the source audio while examining the transcription to look for errors or omissions. Follow these steps to examine transcription quality in the browser.

1. Click the **Testing** tab, and click **Add test**.
2. In this test, we are inspecting quality of audio-only data, so click **Next** to accept this test type.
3. Name this test `MyModelTest`, and click **Next**.
4. Click the radio button left of `MyZipOfAudio`, and click **Next**.
5. The **Model 1** dropdown defaults to the latest recognition model, so click **Create**. After processing the contents of your audio dataset, the test status will change to **Succeeded**.
6. Click **MyModelTest**. The results of speech recognition appear. Click the right-pointing triangle within the circle to hear the audio, and compare what you hear to the text by the circle.

## Download detailed results

You can download files that describe transcriptions in in much greater detail. The files include lexical form of speech in your audio files, and JSON files that contain offset, duration, and transcription confidence details about each word. Follow these steps to see these files.

1. Click **Download**.
2. On the Download dialog, unselect **Audio**, and click **Download**.
3. Unzip the downloaded zip file, and examine the extracted files.

## Next steps

Learn about improving the accuracy of speech recognition by [training a custom model](../how-to-custom-speech-test-and-train.md).