---
title: "Get started with Custom Speech - Speech Services"
titlesuffix: Azure Cognitive Services
description: TBD
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: erhopf
---

# What is Custom Speech?

[Custom Speech](https://customspeech.ai) is a set of online tools that allow you to evaluate and improve Microsoft's speech-to-text accuracy for your applications, tools, and products. All it takes to get started are a handful of test audio files. Follow the links below to start creating a custom speech-to-text experience.

## What's in Custom Speech?

Before you can do anything with Custom Speech, you'll need an Azure account and a Speech Services subscription. Once you've got an account, you can prep your data, train and test your models, inspect recognition quality, evaluate accuracy, and ultimately deploy and use the custom speech-to-text model.

This diagram highlights the pieces that make up the Custom Speech portal. Use the links below to learn more about each step.

![Highlights the different components that make up the Custom Speech portal.](./media/custom-speech/custom-speech-overview.png)

1. [Subscribe and create a project](placeholder) - Create an Azure account and subscribe the Speech Services. This unified subscription gives you access to speech-to-text, text-to-speech, speech translation, and the custom speech portal. Then, using your Speech Services subscription, create your first Custom Speech project.

2. [Upload test data](placeholder) - Upload test data (audio and text) to customize and improve Microsoft's speech-to-text offering for your applications, tools, and products.

3. [Inspect recognition quality](placeholder) - Use the Custom Speech portal to play back uploaded audio and inspect the speech recognition quality of your test data. For quantitative measurements, see [Evaluate accuracy](placeholder).

4. [Evaluate accuracy](placeholder) - Provide written transcripts with your test audio and an accuracy measurement, *Word Error Rate* (WER) will be calculated. If you want to increase accuracy by 5%-20% relative on average go to Training page. If accuracy is good enough, use the Speech Service API directly.

<< **Archer/Ed/Mark** - What is an accuracy measurement? It's unclear from this description. >>

5. [Train the model](placeholder) - Improve the accuracy of your speech-to-text model by providing written transcripts (10-1,000 hours) and related text (10-500 MB) along with your audio test data. This data helps to train the speech-to-text model. After training, retest, and if you're satisfied with the result, you can deploy your model.

<< **Archer/Ed/Mark** - Can you clarify what the difference is between human transcripts and related text? By transcripts, are you speaking about raw audio? It's unclear here. >>

6. [Deploy the model](placeholder) - Create a custom endpoint for your speech-to-text model and use it in your applications, tools, or products.

## Set up your Azure account

A Speech Services subscription is required before you can use the Custom Speech portal to create a custom model. Follow these instructions to create an account: [Try Speech Services for free](get-started.md).

Once you've created an Azure account and a Speech Services subscription, you'll need to sign-in to Custom Speech portal and connect your subscription.

1. Get your Speech Services subscription key from the Azure portal.
2. Sign-in to the [Custom Speech portal](https://customspeech.ai).
2. Click **Connect existing subscription**.
4. When prompted, add your subscription key and click **Add**.
5. If you'd like to modify your subscription, use the **cog** icon located in the top navigation.

## How to create a project

<<TODO: Erik - Fine tune text >>

Custom Speech Services content are organized into Projects, where a project represents a particular domain (call center, virtual assistant, video, etc) and language+country pair, commonly referred to as locale (en-US would be English+United States).  A single project can, for example, be used for multiple en-US call centers.

Under the Speech-to-text/Custom speech tab, click New Project and go through the wizard to create your first project.  Once completed, you will see 4 tabs Data, Testing, Training, and Deployment in the project.

## Next steps

* [Prepare and test your data](placeholder)
* [Inspect and evaluate your data quality](placeholder)
* [Train your model](placeholder)
* [Deploy your model](placeholder)
