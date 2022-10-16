---
title: Get started with Custom Neural Voice - Speech service
titleSuffix: Azure Cognitive Services
description: Custom Neural Voice is a set of online tools that you use to create a recognizable, one-of-a-kind voice for your brand. All it takes to get started are a handful of audio files and the associated transcriptions."
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 10/14/2022
ms.author: eur
---

# Create a project for Custom Neural Voice

Content for [Custom Neural Voice](https://aka.ms/customvoice) like data, models, tests, and endpoints are organized into projects in Speech Studio. Each project is specific to a country and language, and the gender of the voice you want to create. For example, you might create a project for a female voice for your call center's chat bots that use English in the United States.

> [!TIP]
> Try [Custom Neural Voice (CNV) Lite](custom-neural-voice-lite.md) to demo and evaluate CNV before investing in professional recordings to create a higher-quality voice. 

All it takes to get started are a handful of audio files and the associated transcriptions. See if Custom Neural Voice supports your [language](language-support.md?tabs=stt-tts) and [region](regions.md#speech-service).

## Create a Custom Neural Voice Pro project

To create a Custom Neural Voice Pro project, follow these steps:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customvoice).
1. Select the subscription and Speech resource to work with. 

    > [!IMPORTANT]
    > Custom Neural Voice training is currently only available in some regions. After your voice model is trained in a supported region, you can copy it to a Speech resource in another region as needed. See footnotes in the [regions](regions.md#speech-service) table for more information.

1. Select **Custom Voice** > **Create a project**. 
1. Select **Custom Neural Voice Pro** > **Next**. 
1. Follow the instructions provided by the wizard to create your project. 

Select the new project by name or select **Go to project**. You will see these menu items in the left panel: **Set up voice talent**, **Prepare training data**, **Train model**, and **Deploy model**. See the following articles for more information:
- [Set up voice talent](how-to-custom-voice-talent.md)
- [Prepare data for custom neural voice](how-to-custom-voice-prepare-data.md)
- [Train your voice model](how-to-custom-voice-create-voice.md)
- [Deploy and use your voice model](how-to-deploy-and-use-endpoint.md)

## Cross lingual feature

With cross lingual feature (public preview), you can create a different language for your voice model. If the language of your training data is supported by cross lingual feature, you can create a voice that speaks a different language from your training data. For example, with the `zh-CN` training data, you can create a voice that speaks `en-US` or any of the languages supported by cross lingual feature.  For details, see [supported languages](language-support.md?tabs=stt-tts). You don't need to prepare additional data in the target language for training, but your test script needs to be in the target language. 

For how to create a different language from your training data, select the training method **Neural-cross lingual** during training. See [how to train your custom neural voice model](how-to-custom-voice-create-voice.md#train-your-custom-neural-voice-model).

After the voice is created, you can use the Audio Content Creation tool to fine-tune your deployed voice, with richer voice tuning supports. Sign in to the Audio Content Creation of [Speech Studio]( https://aka.ms/speechstudio/) with your Azure account, and select your created voice from the target language to start tuning experience.

## Next steps

- [Set up voice talent](how-to-custom-voice-talent.md)
- [Prepare data for custom neural voice](how-to-custom-voice-prepare-data.md)
- [Train your voice model](how-to-custom-voice-create-voice.md)
- [Deploy and use your voice model](how-to-deploy-and-use-endpoint.md)
