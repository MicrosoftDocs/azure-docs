---
title: Create Keyword quickstart - Speech service
titleSuffix: Azure Cognitive Services
description: Your device is always listening for a keyword (or phrase). When the user says the keyword, the device sends all subsequent audio to the cloud, until the user stops speaking. Customizing your keyword is an effective way to differentiate your device and strengthen your branding.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/03/2020
ms.author: trbye
ms.custom: devx-track-csharp
zone_pivot_groups: keyword-quickstart
---

# Get started with Custom Keyword

In this quickstart, you learn the basics of working with custom keywords, using Speech Studio and the Speech SDK. A keyword is a word or short phrase which allows your product to be voice activated. You create keyword models in Speech Studio, then you export a model file that you use with the Speech SDK in your applications.

## Prerequisites

The steps in this article require a Speech subscription, and the Speech SDK. If you don't already have a subscription, [try the Speech service for free](overview.md#try-the-speech-service-for-free). To get the SDK, see the [install guide](quickstarts/setup-platform.md) for your platform.

## Create a keyword in Speech Studio

Before you can use a custom keyword, you need to create a keyword using the [Custom Keyword](https://aka.ms/sdsdk-wakewordportal) page on [Speech Studio](https://aka.ms/sdsdk-speechportal). After you provide a keyword, it produces a `.table` file that you can use with the Speech SDK.

> [!IMPORTANT]
> Custom keyword models, and the resulting `.table` files, can **only** be created in Speech Studio.
> You cannot create custom keywords from the SDK or with REST calls.

1. Go to the [Speech Studio](https://aka.ms/sdsdk-speechportal) and **Sign in** or, if you do not yet have a speech subscription, choose [**Create a subscription**](https://go.microsoft.com/fwlink/?linkid=2086754).

1. At the [Custom Keyword](https://aka.ms/sdsdk-wakewordportal) page, create a **New project**. 

1. Enter a **Name**, an optional **Description**, and select the language. You need one project per language, and support is currently limited to the `en-US` language.

    ![Describe your keyword project](media/custom-keyword/custom-kws-portal-new-project.png)

1. Select your project from the list. 

    ![Select your keyword project](media/custom-keyword/custom-kws-portal-project-list.png)

1. To create a new keyword model, click **Train model**.

1. Enter a **Name** for the model, an optional **Description**, and the **Keyword** of your choice, then click **Next**. See the [guidelines](./custom-keyword-overview.md#choose-an-effective-keyword) on choosing an effective keyword.

    ![Enter your keyword](media/custom-keyword/custom-kws-portal-new-model.png)

1. The portal creates candidate pronunciations for your keyword. Listen to each candidate by clicking the play buttons and remove the checks next to any pronunciations that are incorrect. Once only good pronunciations are checked, click **Train** to begin generating the keyword model. 

    ![Screenshot that shows where you choose the correct pronounciations.](media/custom-keyword/custom-kws-portal-choose-prons.png)

1. It may take up to thirty minutes for the model to be generated. The keyword list will change from **Processing** to **Succeeded** when the model is complete. You can then download the file.

    ![Review your keyword](media/custom-keyword/custom-kws-portal-download-model.png)

1. The downloaded file is a `.zip` archive. Extract the archive, and you see a file with the `.table` extension. This is the file you use with the SDK in the next section, so make sure to note its path. the file name mirrors your keyword name, for example a keyword **Activate device** has the file name `Activate_device.table`.

## Use a keyword model with the SDK

::: zone pivot="programming-language-csharp"
[!INCLUDE [C# Basics include](includes/how-to/keyword-recognition/keyword-basics-csharp.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Python Basics include](includes/how-to/keyword-recognition/keyword-basics-python.md)]
::: zone-end

::: zone pivot="programming-languages-objectivec-swift"
[!INCLUDE [ObjectiveC/Swift Basics include](includes/how-to/keyword-recognition/keyword-basics-objc.md)]
::: zone-end

## Next steps

Test your custom keyword with the [Speech Devices SDK Quickstart](./speech-devices-sdk-quickstart.md?pivots=platform-android).