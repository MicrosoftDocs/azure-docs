---
title: "Improve synthesis with Custom Voice - Speech service"
titleSuffix: Azure Cognitive Services
description: "Custom Voice is a set of online tools that allow you to create a recognizable, one-of-a-kind voice for your brand. All it takes to get started are a handful of audio files and the associated transcriptions. Follow the links below to start creating a custom speech-to-text experience."
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 02/17/2020
ms.author: trbye
---

# Get started with Custom Voice

[Custom Voice](https://aka.ms/customvoice) is a set of online tools that allow you to create a recognizable, one-of-a-kind voice for your brand. All it takes to get started are a handful of audio files and the associated transcriptions. Follow the links below to start creating a custom text-to-speech experience.

## What's in Custom Voice?

Before starting with Custom Voice, you'll need an Azure account and a Speech service subscription. Once you've created an account, you can prepare your data, train and test your models, evaluate voice quality, and ultimately deploy your custom voice model.

The diagram below highlights the steps to create a custom voice model using the [Custom Voice portal](https://aka.ms/customvoice). Use the links to learn more.

![Custom Voice architecture diagram](media/custom-voice/custom-voice-diagram.png)

1. [Subscribe and create a project](#set-up-your-azure-account) - Create an Azure account and create a Speech service subscription. This unified subscription gives you access to speech-to-text, text-to-speech, speech translation, and the Custom Voice portal. Then, using your Speech service subscription, create your first Custom Voice project.

2. [Upload data](how-to-custom-voice-create-voice.md#upload-your-datasets) - Upload data (audio and text) using the Custom Voice portal or Custom Voice API. From the portal, you can investigate and evaluate pronunciation scores and signal-to-noise ratios. For more information, see [How to prepare data for Custom Voice](how-to-custom-voice-prepare-data.md).

3. [Train your model](how-to-custom-voice-create-voice.md#build-your-custom-voice-model) – Use your data to create a custom text-to-speech voice model. You can train a model in different languages. After training, test your model, and if you're satisfied with the result, you can deploy the model.

4. [Deploy your model](how-to-custom-voice-create-voice.md#create-and-use-a-custom-voice-endpoint) - Create a custom endpoint for your text-to-speech voice model, and use it for speech synthesis in your products, tools, and applications.

## Custom Neural voices

Custom Voice currently supports both standard and neural tiers. Custom Neural Voice empowers users to build higher quality voice models while requiring less data, and provides measures to help you deploy AI responsibly. We recommend you should use Custom Neural Voice to develop more realistic voices for more natural conversational interfaces and enable your customers and end users to benefit from the latest Text-to-Speech technology, in a responsible way. [Learn more about Custom Neural Voice](/legal/cognitive-services/speech-service/custom-neural-voice/transparency-note-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext). 

> [!NOTE]
> As part of Microsoft's commitment to designing responsible AI, we have limited the use of Custom Neural Voice. You may gain access to the technology only after your applications are reviewed and you have committed to using it in alignment with our responsible AI principles. Learn more about our [policy on the limit access](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) and [apply here](https://aka.ms/customneural). 
> The [languages](language-support.md#customization) and [regions](regions.md#custom-voices) supported for the standard and neural version of Custom Voice are different. Check the details before you start.  

## Set up your Azure account

A Speech service subscription is required before you can use the Custom Speech portal to create a custom model. Follow these instructions to create a Speech service subscription in Azure. If you do not have an Azure account, you can sign up for a new one.  

Once you've created an Azure account and a Speech service subscription, you'll need to sign in to the Custom Voice portal and connect your subscription.

1. Get your Speech service subscription key from the Azure portal.
2. Sign in to the [Custom Voice portal](https://aka.ms/custom-voice).
3. Select your subscription and create a speech project.
4. If you'd like to switch to another Speech subscription, use the cog icon located in the top navigation.

> [!NOTE]
> You must have a F0 or a S0 Speech service key created in Azure before you can use the service. Custom Neural Voice only supports the S0 tier. 

## How to create a project

Content like data, models, tests, and endpoints are organized into **Projects** in the Custom Voice portal. Each project is specific to a country/language and the gender of the voice you want to create. For example, you may create a project for a female voice for your call center's chat bots that use English in the United States ('en-US').

To create your first project, select the **Text-to-Speech/Custom Voice** tab, then click **New Project**. Follow the instructions provided by the wizard to create your project. After you've created a project, you will see four tabs: **Data**, **Training**, **Testing**, and **Deployment**. Use the links provided in [Next steps](#next-steps) to learn how to use each tab.

> [!IMPORTANT]
> The [Custom Voice portal](https://aka.ms/custom-voice) was recently updated! If you created previous data, models, tests, and published endpoints in the CRIS.ai portal or with APIs, you need to create a new project in the new portal to connect to these old entities.

## How to migrate to Custom Neural Voice

The standard/non-neural training tier (adaptive, statistical parametric, concacenative) of Custom Voice is being deprecated. The annoucement has been sent out to all existing Speech subscriptions before 2/28/2021. During the deprecation period (3/1/2021 - 2/29/2024), existing standard tier users can continue to use their non-neural models created. All new users/new speech resources should move to the neural tier/Custom Neural Voice. After 2/29/2024, all standard/non-neural custom voices will no longer be supported. 

If you are using non-neural/standard Custom Voice,  migrate to Custom Neural Voice immediately following the steps below. Moving to Custom Neural Voice will help you develop more realistic voices for even more natural conversational interfaces and enable your customers and end users to benefit from the latest Text-to-Speech technology, in a responsible way. 

1. Learn more about our [policy on the limit access](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) and [apply here](https://aka.ms/customneural). Note that the access to the Custom Neural Voice service is subject to Microsoft’s sole discretion based on our eligibility criteria. Customers may gain access to the technology only after their application is reviewed and they have committed to using it in alignment with our [Responsible AI principles](https://microsoft.com/ai/responsible-ai) and the [code of conduct](/legal/cognitive-services/speech-service/tts-code-of-conduct?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext). 
2. Once your application is approved, you will be provided with the access to the "neural" training feature. Make sure you log in to the [Custom Voice portal](https://speech.microsoft.com/customvoice) using the same Azure subscription that you provide in your application. 
    > [!IMPORTANT]
    > To protect voice talent and prevent training of voice models with unauthorized recording or without the acknowledgement from the voice talent, we require the customer to upload a recorded statement of the voice talent giving his or her consent. When preparing your recording script, make sure you include this sentence. 
    > “I [state your first and last name] am aware that recordings of my voice will be used by [state the name of the company] to create and use a synthetic version of my voice.”
    > This sentence must be uploaded to the **Voice Talent** tab as a verbal consent file. It will be used to verify if the recordings in your training datasets are done by the same person that makes the consent.
3. After the Custom Neural Voice model is created, deploy the voice model to a new endpoint. To create a new custom voice endpoint with your neural voice model, go to **Text-to-Speech > Custom Voice > Deployment**. Select **Deploy model** and enter a **Name** and **Description** for your custom endpoint. Then select the custom neural voice model you would like to associate with this endpoint and confirm the deployment.  
4. Update your code in your apps if you have created a new endpoint with a new model. 

## Next steps

- [Prepare Custom Voice data](how-to-custom-voice-prepare-data.md)
- [Create a Custom Voice](how-to-custom-voice-create-voice.md)
- [Guide: Record your voice samples](record-custom-voice-samples.md)
