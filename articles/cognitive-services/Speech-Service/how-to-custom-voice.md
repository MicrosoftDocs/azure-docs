---
title: "Get started with Custom Neural Voice - Speech service"
titleSuffix: Azure Cognitive Services
description: "Custom Neural Voice is a set of online tools that allow you to create a recognizable, one-of-a-kind voice for your brand. All it takes to get started are a handful of audio files and the associated transcriptions."
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/18/2021
ms.author: eur
---

# Get started with Custom Neural Voice

[Custom Neural Voice](https://aka.ms/customvoice) is a set of online tools that allow you to create a recognizable, one-of-a-kind voice for your brand. All it takes to get started are a handful of audio files and the associated transcriptions. Follow the links below to start creating a custom Text-to-Speech experience. See the supported [languages](language-support.md#custom-neural-voice) and [regions](regions.md#custom-neural-voices) for Custom Neural Voice.

> [!NOTE]
> As part of Microsoft's commitment to designing responsible AI, we have limited the use of Custom Neural Voice. You may gain access to the technology only after your applications are reviewed and you have committed to using it in alignment with our responsible AI principles. Learn more about our [policy on the limit access](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) and [apply here](https://aka.ms/customneural). 
 
## Set up your Azure account

A Speech service subscription is required before you can use Custom Neural Voice. Follow these instructions to create a Speech service subscription in Azure. If you do not have an Azure account, you can sign up for a new one.  

Once you've created an Azure account and a Speech service subscription, you'll need to sign in Speech Studio and connect your subscription.

1. Get your Speech service subscription key from the Azure portal.
2. Sign in to [Speech Studio](https://speech.microsoft.com), then click **Custom Voice**.
3. Select your subscription and create a speech project.
4. If you'd like to switch to another Speech subscription, use the cog icon located in the top navigation.

> [!NOTE]
> You must have a F0 or a S0 Speech service key created in Azure before you can use the service. Custom Neural Voice only supports the S0 tier. 

## Create a project

Content like data, models, tests, and endpoints are organized into **Projects** in Speech Studio. Each project is specific to a country/language and the gender of the voice you want to create. For example, you may create a project for a female voice for your call center's chat bots that use English in the United States ('en-US').

To create your first project, select the **Text-to-Speech/Custom Voice** tab, then click **Create project**. Follow the instructions provided by the wizard to create your project. After you've created a project, you will see four tabs: **Set up voice talent**, **Prepare training data**, **Train model**, and **Deploy model**. Use the links provided in [next steps](#next-steps) to learn how to use each tab.

## Tips for creating a custom neural voice

Creating a great custom neural voice requires careful quality control in each step, from voice design and data preparation, to the deployment of the voice model to your system. Below are some key steps to take when creating a custom neural voice for your organization. 

### Persona design

First, design a persona of the voice that represents your brand using a persona brief document that defines elements such as the features of the voice, and the character behind the voice. This will help to guide the process of creating a custom neural voice model, including defining the scripts, selecting your voice talent, training and voice tuning.

### Script selection
 
Carefully select the recording script to represent the user scenarios for your voice. For example, you can use the phrases from bot conversations as your recording script if you are creating a customer service bot. Include different sentence types in your scripts, including statements, questions, exclamations, etc.

### Preparing training data

We recommend that the audio recordings be captured in a professional quality recording studio to achieve a high signal-to-noise ratio. The quality of the voice model heavily depends on your training data. Consistent volume, speaking rate, pitch, and consistency in expressive mannerisms of speech are required.

Once the recordings are ready, follow [Prepare training data](how-to-custom-voice-prepare-data.md) to prepare the training data in the right format.

### Training

Once you have prepared the training data, go to [Speech Studio](https://aka.ms/custom-voice) to create your custom neural voice. You need to select at least 300 utterances to create a custom neural voice. A series of data quality checks are automatically performed when you upload them. To build high quality voice models, you should fix the errors and submit again.

### Testing

Prepare test scripts for your voice model that cover the different use cases for your apps. It’s recommended that you use scripts within and outside the training dataset so you can test the quality more broadly for different content.

### Tuning and adjustment

The style and the characteristics of the trained voice model depend on the style and the quality of the recordings from the voice talent used for training. However, several adjustments can be made using [SSML (Speech Synthesis Markup Language)](./speech-synthesis-markup.md?tabs=csharp) when you make the API calls to your voice model to generate synthetic speech. SSML is the markup language used to communicate with the TTS service to convert text into audio. The adjustments include change of pitch, rate, intonation, and pronunciation correction.  If the voice model is built with multiple styles, SSML can also be used to switch the styles.

## Migrate to Custom Neural Voice

If you are using the old version of Custom Voice (to be retired in 2/2024), check the instructions [here](how-to-migrate-to-custom-neural-voice.md) on how to migrate it to Custom Neural Voice.


## Next steps

- [Prepare data for custom neural voice](how-to-custom-voice-prepare-data.md)
- [Train and deploy a custom neural voice](how-to-custom-voice-create-voice.md)
- [How to record voice samples](record-custom-voice-samples.md)
