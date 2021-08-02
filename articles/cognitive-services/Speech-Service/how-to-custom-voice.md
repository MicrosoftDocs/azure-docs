---
title: "Get started with Custom Neural Voice - Speech service"
titleSuffix: Azure Cognitive Services
description: "Custom Neural Voice is a set of online tools that allow you to create a recognizable, one-of-a-kind voice for your brand. All it takes to get started are a handful of audio files and the associated transcriptions."
services: cognitive-services
author: nitinme
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/18/2021
ms.author: nitinme
---

# Get started with Custom Neural Voice

[Custom Neural Voice](https://aka.ms/customvoice) is a set of online tools that allow you to create a recognizable, one-of-a-kind voice for your brand. All it takes to get started are a handful of audio files and the associated transcriptions. Follow the links below to start creating a custom text-to-speech experience. See the supported [languages](language-support.md#customization) and [regions](regions.md#custom-voices) for Custom Neural Voice.

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

Creating a great custom voice requires careful quality control in each step, from voice design and data preparation, to the deployment of the voice model to your system. Below are some key steps to take when creating a custom neural voice for your organization. 

### Persona design

First, design a persona of the voice that represents your brand using a persona brief document that defines elements such as the features of the voice, and the character behind the voice. This will help to guide the process of creating a custom voice model, including defining the scripts, selecting your voice talent, training and voice tuning.

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

The standard/non-neural training tier (statistical parametric, concacenative) of Custom Voice is being deprecated. The announcement has been sent out to all existing Speech subscriptions before 2/28/2021. During the deprecation period (3/1/2021 - 2/29/2024), existing standard tier users can continue to use their non-neural models created. All new users/new speech resources should move to the neural tier/Custom Neural Voice. After 2/29/2024, all standard/non-neural custom voices will no longer be supported. 

If you are using non-neural/standard Custom Voice,  migrate to Custom Neural Voice immediately following the steps below. Moving to Custom Neural Voice will help you develop more realistic voices for even more natural conversational interfaces and enable your customers and end users to benefit from the latest Text-to-Speech technology, in a responsible way. 

1. Learn more about our [policy on the limit access](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) and [apply here](https://aka.ms/customneural). Note that the access to the Custom Neural Voice service is subject to Microsoft’s sole discretion based on our eligibility criteria. Customers may gain access to the technology only after their application is reviewed and they have committed to using it in alignment with our [Responsible AI principles](https://microsoft.com/ai/responsible-ai) and the [code of conduct](/legal/cognitive-services/speech-service/tts-code-of-conduct?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext). 
2. Once your application is approved, you will be provided with the access to the "neural" training feature. Make sure you log in to [Speech Studio](https://speech.microsoft.com) using the same Azure subscription that you provide in your application. 
    > [!IMPORTANT]
    > To protect voice talent and prevent training of voice models with unauthorized recording or without the acknowledgement from the voice talent, we require the customer to upload a recorded statement of the voice talent giving their consent. When preparing your recording script, make sure you include this sentence. 
    > “I [state your first and last name] am aware that recordings of my voice will be used by [state the name of the company] to create and use a synthetic version of my voice.”
    > This sentence must be uploaded to the **Set up voice talent** tab as a verbal consent file. It will be used to verify if the recordings in your training datasets are done by the same person that makes the consent.
3. After the Custom Neural Voice model is created, deploy the voice model to a new endpoint. To create a new custom voice endpoint with your neural voice model, go to **Text-to-Speech > Custom Voice > Deploy model**. Select **Deploy models** and enter a **Name** and **Description** for your custom endpoint. Then select the custom neural voice model you would like to associate with this endpoint and confirm the deployment.  
4. Update your code in your apps if you have created a new endpoint with a new model. 

## Next steps

- [Prepare data for Custom Neural Voice](how-to-custom-voice-prepare-data.md)
- [Train and deploy a Custom Neural Voice](how-to-custom-voice-create-voice.md)
- [How to record voice samples](record-custom-voice-samples.md)