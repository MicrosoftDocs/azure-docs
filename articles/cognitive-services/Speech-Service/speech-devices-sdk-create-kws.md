---
title: Create custom keywords - Speech service
titleSuffix: Azure Cognitive Services
description: Your device is always listening for a keyword (or phrase). When the user says the keyword, the device sends all subsequent audio to the cloud, until the user stops speaking. Customizing your keyword is an effective way to differentiate your device and strengthen your branding.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 12/11/2019
ms.author: trbye
---

# Create a custom keyword using Speech Studio

Your device is always listening for a keyword (or phrase). For example, "Hey Cortana" is a keyword for the Cortana assistant. When the user says the keyword, the device sends all subsequent audio to the cloud, until the user stops speaking. Customizing your keyword is an effective way to differentiate your device and strengthen your branding.

In this article, you learn how to create a custom keyword for your device.

## Create your keyword

Before you can use a custom keyword, you'll need to create a keyword using the [Custom Keyword](https://aka.ms/sdsdk-wakewordportal) page on [Speech Studio](https://aka.ms/sdsdk-speechportal). After you provide a keyword, it produces a file that you deploy to your device.

1. Go to the [Speech Studio](https://aka.ms/sdsdk-speechportal) and **Sign in** or, if you do not yet have a speech subscription, choose [**Create a subscription**](https://go.microsoft.com/fwlink/?linkid=2086754).

1. At the [Custom Keyword](https://aka.ms/sdsdk-wakewordportal) page, create a **New project**. 

1. Enter a **Name**, an optional **Description**, and select the language. You will need one project per language and support is currently limited to the en-US language.

    ![Describe your keyword project](media/custom-keyword/custom-kws-portal-new-project.png)

1. Select your project from the list. 

    ![Select your keyword project](media/custom-keyword/custom-kws-portal-project-list.png)

1. To start a new keyword model click **Train model**.

1. Enter a **Name** for the keyword model, and optional **Description** and type in the **Keyword** of your choice, and click **Next**. We have some [guidelines](speech-devices-sdk-kws-guidelines.md#choose-an-effective-keyword) to help choose an effective keyword.

    ![Enter your keyword](media/custom-keyword/custom-kws-portal-new-model.png)

1. The portal will now create candidate pronunciations for your keyword. Listen to each candidate by clicking the play buttons and remove the checks next to any pronunciations that are incorrect. Once only good pronunciations are checked, click **Train** to begin generating the keyword. 

    ![Review your keyword](media/custom-keyword/custom-kws-portal-choose-prons.png)

1. It may take up to thirty minutes for the model to be generated. The keyword list will change from **Processing** to **Succeeded** when the model is complete. You can then download the file.

    ![Review your keyword](media/custom-keyword/custom-kws-portal-download-model.png)

1. Save the .zip file to your computer. You will need this file to deploy your custom keyword to your device.

## Next steps

Test your custom keyword with [Speech Devices SDK Quickstart](https://aka.ms/sdsdk-quickstart).
