---
title: Create a project for Custom Neural Voice - Speech service
titleSuffix: Azure AI services
description: Learn how to create a Custom Neural Voice project that contains data, models, tests, and endpoints in Speech Studio.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 10/27/2022
ms.author: eur
---

# Create a project for Custom Neural Voice

Content for [Custom Neural Voice](https://aka.ms/customvoice) like data, models, tests, and endpoints are organized into projects in Speech Studio. Each project is specific to a country/region and language, and the gender of the voice you want to create. For example, you might create a project for a female voice for your call center's chat bots that use English in the United States.

> [!TIP]
> Try [Custom Neural Voice (CNV) Lite](custom-neural-voice-lite.md) to demo and evaluate CNV before investing in professional recordings to create a higher-quality voice. 

All it takes to get started are a handful of audio files and the associated transcriptions. See if Custom Neural Voice supports your [language](language-support.md?tabs=tts) and [region](regions.md#speech-service).

## Create a Custom Neural Voice Pro project

To create a Custom Neural Voice Pro project, follow these steps:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customvoice).
1. Select the subscription and Speech resource to work with. 

    > [!IMPORTANT]
    > Custom Neural Voice training is currently only available in some regions. After your voice model is trained in a supported region, you can copy it to a Speech resource in another region as needed. See footnotes in the [regions](regions.md#speech-service) table for more information.

1. Select **Custom Voice** > **Create a project**. 
1. Select **Custom Neural Voice Pro** > **Next**. 
1. Follow the instructions provided by the wizard to create your project. 

Select the new project by name or select **Go to project**. You'll see these menu items in the left panel: **Set up voice talent**, **Prepare training data**, **Train model**, and **Deploy model**. 

## Next steps

- [Set up voice talent](how-to-custom-voice-talent.md)
- [Prepare data for custom neural voice](how-to-custom-voice-prepare-data.md)
- [Train your voice model](how-to-custom-voice-create-voice.md)
- [Deploy and use your voice model](how-to-deploy-and-use-endpoint.md)
