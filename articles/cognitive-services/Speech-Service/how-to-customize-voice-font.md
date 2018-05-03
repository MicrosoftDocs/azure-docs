---
title: Creating voice fonts for Text to Speech | Microsoft Docs
description: Create custom Text to Speech voice fonts.
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: v-jerkin
manager: noellelacharite

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 05/07/2018
ms.author: v-jerkin
---
# Create custom voice fonts using Speech service

A voice font, or voice, defines the sound of **Text to Speech** output and its language and dialect. The Speech service allows you to create voice fonts automatically from sample data you provide. Custom voice fonts are created through the [Custom Speech portal](https://www.cris.ai/).

After creating a new voice font, you create a custom endpoint. You then use the custom endpoint in place of the standard endpoint for REST requests to the **Text to Speech** API.

> [!NOTE]
> The capability of creating custom voice fonts is currently in private preview. Apply for access using the [registration form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR0N8Vcdi8MZBllkZb70o6KdURjRaUzhBVkhUNklCUEMxU0tQMEFPMjVHVi4u).

## Language support

Custom **Text to Speech** voice fonts support US English (en-US) and Chinese (zh-CN).

## Prepare a data set

The data set for creating a **Text to Speech** voice font contains two parts. 
* First is a set of audio data (`.wav`) files containing recordings of speech (utterances). 
* The other is a text file that, on each line, contains the name of one audio file, a tab, and a transcription of the utterance.

Text files should follow the [text transcription guidelines](prepare-transcription.md) for the intended language. It's important that the transcripts are 100% accurate.

## Prepare audio files

The quality of a voice font relies heavily on the quality and quantity of audio data. A few hundred recorded sentences are sufficient for proof-of-concept voices. Production-level voices, however, may require recordings of tens of thousands of utterances. Scripts should be carefully developed, with consideration to both phonetic coverage and efficiency.

It is crucial that the recordings are done in a quiet room with a high-quality microphone. Use professional recording studio to achieve the highest-quality results. Consistent volume, speaking rate, speaking pitch, and even consistency in expressive mannerisms of speech are all key ingredients of a great voice. So, choose your speaker carefully.

Audio files must have a *filename consisting only of numbers* with the extension `.wav` and adhere to the following standard:

| Property | Required value |
|----------|------|
File format | RIFF (WAV)
Sample rate | 16,000 Hz
Channels | 1 (mono)
Sample format | PCM, 16-bit integer
Archive format | zip
Maximum archive size | 200 MB

> [!NOTE]
> Each zipped collection of audio files can be a maximum size of 200 MB. Free subscription users may upload ten such archives, and standard subscriptions are allowed up to 50.

## Upload data sets

To create a custom voice, first upload your data.

1.  Log in to the [Custom Voice portal](http://customvoice.ai/).

1.  From the **Custom Voice** menu, select **Data**. A list of existing data sets (if any) appears.

1. If necessary, select **Change Locale** to change the language.

1.  Select **Import Data** and specify a name and description for the new data set, along with the speaker characteristics.

1. Choose the data files you have prepared and then select **Import** to upload the data and begin validation.

Validation performs speech recognition on all audio files (using a standard model) and compares the results to the provided transcript. Validation may take a while.

## Create a voice

After your data set has been validated, create the voice by following the instructions.

1. From the **Custom Voice** menu, select **Models** > **Create New.**

1. Enter a name and description. The name you specify here identifies your voice in [SSML](speech-synthesis-markup.md) requests.

1.  Choose the data set from which the model is to be created, along with the locale and gender. These should match the actual locale (language and dialect) and gender of the speaker.

1. Select **Create** to begin building the new voice.

## Create custom endpoint

After you have created a custom voice font, you can deploy it to a custom **Text to Speech** endpoint. Only the account that created an endpoint is permitted to make calls to it.

Follow the steps below to create an endpoint.

1. From the **Custom Speech** menu at the top of the page, select **Endpoints**. 

2. This opens the **Deployments** page, which contains a table of current custom endpoints, if you have created any. Click **Deploy Voice** to create a new endpoint.

3. Choose the voice you wish to deploy and click **Create**. Your new endpoint may take a few minutes to provision.

Once the endpoint is ready, click the endpoints in the **Deployments** table to see its URI. You can use custom endpoints with the [Rest API](rest-apis.md#text-to-speech) in place of the standard endpoint.

## Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
- [Recognize speech in C#](quickstart-csharp-windows.md)
