---
title: Get started with Custom Neural Voice - Speech service
titleSuffix: Azure Cognitive Services
description: Custom Neural Voice is a set of online tools that you use to create a recognizable, one-of-a-kind voice for your brand. All it takes to get started are a handful of audio files and the associated transcriptions."
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 02/18/2022
ms.author: eur
---

# Get started with Custom Neural Voice

[Custom Neural Voice](https://aka.ms/customvoice) is a set of online tools that you use to create a recognizable, one-of-a-kind voice for your brand. All it takes to get started are a handful of audio files and the associated transcriptions. See if Custom Neural Voice supports your [language](language-support.md#custom-neural-voice) and [region](regions.md#custom-neural-voices).

> [!NOTE]
> Custom Neural Voice Pro can be used to create higher-quality models that are indistinguishable from human recordings. For access you must commit to using it in alignment with our responsible AI principles. Learn more about our [policy on the limited access](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) and [apply here](https://aka.ms/customneural).
> 
> With [Custom Neural Voice Lite](custom-neural-voice.md#custom-neural-voice-project-types) (public preview), you can create a model for demonstration and evaluation purpose. No application is required. Microsoft restricts and selects the recording and testing samples for use with Custom Neural Voice Lite. You must apply the full access to Custom Neural Voice in order to deploy and use the Custom Neural Voice Lite model for business purpose. 
 
## Set up your Azure account

A Speech service subscription is required before you can use Custom Neural Voice. Follow these instructions to create a Speech service subscription in Azure. If you don't have an Azure account, you can sign up for a new one.  

Once you've created an Azure account and a Speech service subscription, you'll need to sign in to Speech Studio and connect your subscription.

1. Get your Speech service subscription key from the Azure portal.
1. Sign in to [Speech Studio](https://speech.microsoft.com), and then select **Custom Voice**.
1. Select your subscription and create a speech project.
1. If you want to switch to another Speech subscription, select the **cog** icon at the top.

> [!NOTE]
> Custom Neural Voice training is currently only available in East US, Southeast Asia, UK South, with the S0 tier. Make sure you select the right Speech resource if you would like to create a neural voice.

## Create a project

Content like data, models, tests, and endpoints are organized into projects in Speech Studio. Each project is specific to a country and language, and the gender of the voice you want to create. For example, you might create a project for a female voice for your call center's chat bots that use English in the United States.

To create a custom voice project:

1. Sign in to [Speech Studio](https://speech.microsoft.com).
1. Select **Text-to-Speech** > **Custom Voice** > **Create project**.

   See [Custom Neural Voice project types](custom-neural-voice.md#custom-neural-voice-project-types) for information about capabilities, requirements, and differences between Custom Neural Voice Pro and Custom Neural Voice Lite projects.

1. After you've created a CNV Pro project, you'll see four tabs: **Set up voice talent**, **Prepare training data**, **Train model**, and **Deploy model**. See [Prepare data for Custom Neural Voice](how-to-custom-voice-prepare-data.md) to set up the voice talent, and proceed to training data.

## Tips for creating a professional custom neural voice

Creating a great custom neural voice requires careful quality control in each step, from voice design and data preparation, to the deployment of the voice model to your system. The following sections discuss some key steps to take when you're creating a custom neural voice for your organization. 

### Persona design

First, design a persona of the voice that represents your brand by using a persona brief document. This document defines elements such as the features of the voice, and the character behind the voice. This helps to guide the process of creating a custom neural voice model, including defining the scripts, selecting your voice talent, training, and voice tuning.

### Script selection
 
Carefully select the recording script to represent the user scenarios for your voice. For example, you can use the phrases from bot conversations as your recording script if you're creating a customer service bot. Include different sentence types in your scripts, including statements, questions, and exclamations.

### Preparing training data

It's a good idea to capture the audio recordings in a professional quality recording studio to achieve a high signal-to-noise ratio. The quality of the voice model depends heavily on your training data. Consistent volume, speaking rate, pitch, and consistency in expressive mannerisms of speech are required.

After the recordings are ready, follow [Prepare training data](how-to-custom-voice-prepare-data.md) to prepare the training data in the right format.

### Training

After you've prepared the training data, go to [Speech Studio](https://aka.ms/custom-voice) to create your custom neural voice. Select at least 300 utterances to create a custom neural voice. A series of data quality checks are automatically performed when you upload them. To build high-quality voice models, you should fix any errors and submit again.

### Testing

Prepare test scripts for your voice model that cover the different use cases for your apps. It’s a good idea to use scripts within and outside the training dataset, so you can test the quality more broadly for different content.

### Tuning and adjustment

The style and the characteristics of the trained voice model depend on the style and the quality of the recordings from the voice talent used for training. However, you can make several adjustments by using [SSML (Speech Synthesis Markup Language)](./speech-synthesis-markup.md?tabs=csharp) when you make the API calls to your voice model to generate synthetic speech.

SSML is the markup language used to communicate with the text-to-speech service to convert text into audio. The adjustments you can make include change of pitch, rate, intonation, and pronunciation correction. If the voice model is built with multiple styles, you can also use SSML to switch the styles.

## Migrate to Custom Neural Voice

If you're using the old version of Custom Voice (which is scheduled to be retired in February 2024), see [How to migrate to Custom Neural Voice](how-to-migrate-to-custom-neural-voice.md).

## Next steps

- [Prepare data for custom neural voice](how-to-custom-voice-prepare-data.md)
- [Train your voice model](how-to-custom-voice-create-voice.md)
- [Deploy and use your voice model](how-to-deploy-and-use-endpoint.md)
- [How to record voice samples](record-custom-voice-samples.md)
