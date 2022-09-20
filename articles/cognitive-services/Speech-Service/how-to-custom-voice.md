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
ms.date: 08/01/2022
ms.author: eur
---

# Create a Project

[Custom Neural Voice](https://aka.ms/customvoice) is a set of online tools that you use to create a recognizable, one-of-a-kind voice for your brand. All it takes to get started are a handful of audio files and the associated transcriptions. See if Custom Neural Voice supports your [language](language-support.md?tabs=stt-tts) and [region](regions.md#speech-service).

> [!IMPORTANT]
> Custom Neural Voice Pro can be used to create higher-quality models that are indistinguishable from human recordings. For access you must commit to using it in alignment with our responsible AI principles. Learn more about our [policy on limited access](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) and [apply here](https://aka.ms/customneural).
> 
> With [Custom Neural Voice Lite](custom-neural-voice.md#custom-neural-voice-project-types) (public preview), you can create a model for demonstration and evaluation purpose. No application is required. Microsoft restricts and selects the recording and testing samples for use with Custom Neural Voice Lite. You must apply the full access to Custom Neural Voice in order to deploy and use the Custom Neural Voice Lite model for business purpose. 
 
## Set up your Azure account

A Speech resource is required before you can use Custom Neural Voice. Follow these instructions to create a Speech resource in Azure. If you don't have an Azure account, you can sign up for a new one.  

Once you've created an Azure account and a Speech resource, you'll need to sign in to Speech Studio and connect your subscription.

1. Get your Speech resource key from the Azure portal.
1. Sign in to [Speech Studio](https://aka.ms/speechstudio), and then select **Custom Voice**.
1. Select your subscription and create a speech project.
1. If you want to switch to another Speech subscription, select the **cog** icon at the top.

> [!NOTE]
> Custom Neural Voice training is currently only available in some regions. But you can easily copy a neural voice model from those regions to other regions. For more information, see the [regions for Custom Neural Voice](regions.md#speech-service).

## Create a project

Content like data, models, tests, and endpoints are organized into projects in Speech Studio. Each project is specific to a country and language, and the gender of the voice you want to create. For example, you might create a project for a female voice for your call center's chat bots that use English in the United States.

To create a custom voice project:

1. Sign in to [Speech Studio](https://aka.ms/speechstudio).
1. Select **Text-to-Speech** > **Custom Voice** > **Create project**.

   See [Custom Neural Voice project types](custom-neural-voice.md#custom-neural-voice-project-types) for information about capabilities, requirements, and differences between Custom Neural Voice Lite and Custom Neural Voice Pro projects.

1. After you've created a CNV Pro project, click your project's name and you'll see four tabs: **Set up voice talent**, **Prepare training data**, **Train model**, and **Deploy model**. See [Prepare data for Custom Neural Voice](how-to-custom-voice-prepare-data.md) to set up the voice talent, and proceed to training data.

## Cross lingual feature

With cross lingual feature (public preview), you can create a different language for your voice model. If the language of your training data is supported by cross lingual feature, you can create a voice that speaks a different language from your training data. For example, with the `zh-CN` training data, you can create a voice that speaks `en-US` or any of the languages supported by cross lingual feature.  For details, see [supported languages](language-support.md?tabs=stt-tts). You don't need to prepare additional data in the target language for training, but your test script needs to be in the target language. 

For how to create a different language from your training data, select the training method **Neural-cross lingual** during training. See [how to train your custom neural voice model](how-to-custom-voice-create-voice.md#train-your-custom-neural-voice-model).

After the voice is created, you can use the Audio Content Creation tool to fine-tune your deployed voice, with richer voice tuning supports.  Sign in to the Audio Content Creation of [Speech Studio]( https://aka.ms/speechstudio/) with your Azure account, and select your created voice from the target language to start tuning experience.

## Migrate to Custom Neural Voice

If you're using the old version of Custom Voice (which is scheduled to be retired in February 2024), see [How to migrate to Custom Neural Voice](how-to-migrate-to-custom-neural-voice.md).

## Next steps

- [Prepare data for custom neural voice](how-to-custom-voice-prepare-data.md)
- [How to record voice samples](record-custom-voice-samples.md)
- [Train your voice model](how-to-custom-voice-create-voice.md)
- [Deploy and use your voice model](how-to-deploy-and-use-endpoint.md)
