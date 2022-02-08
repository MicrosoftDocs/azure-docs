---
title: Create Keyword quickstart - Speech service
titleSuffix: Azure Cognitive Services
description: Your device is always listening for a keyword (or phrase). When a user speaks the keyword, your device sends their dictation to the cloud, until the user stops speaking. Customizing your keyword is an effective way to differentiate your device and strengthen your branding.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/12/2021
ms.author: eur
ms.devlang: csharp, objective-c, python
ms.custom: devx-track-csharp, ignite-fall-2021
zone_pivot_groups: keyword-quickstart
---

# Get started with Custom Keyword

In this quickstart, you learn the basics of working with custom keywords. A keyword is a word or short phrase, which allows your product to be voice activated. You create keyword models in Speech Studio. Then export a model file that you use with the Speech SDK in your applications.

## Prerequisites

The steps in this article require a Speech subscription and the Speech SDK. If you don't already have a subscription, [try the Speech service for free](overview.md#try-the-speech-service-for-free). To get the SDK, see the [install guide](quickstarts/setup-platform.md) for your platform.

## Create a keyword in Speech Studio

Before you can use a custom keyword, you need to create a keyword using the [Custom Keyword](https://aka.ms/sdsdk-wakewordportal) page on [Speech Studio](https://aka.ms/sdsdk-speechportal). After you provide a keyword, it produces a `.table` file that you can use with the Speech SDK.

> [!IMPORTANT]
> Custom keyword models, and the resulting `.table` files, can **only** be created in Speech Studio.
> You cannot create custom keywords from the SDK or with REST calls.

1. Go to the [Speech Studio](https://aka.ms/sdsdk-speechportal) and **Sign in**. If you don't have a speech subscription, go to [**Create Speech Services**](https://go.microsoft.com/fwlink/?linkid=2086754).

1. On the [Custom Keyword](https://aka.ms/sdsdk-wakewordportal) page, select **Create a new project**. 

1. Enter a **Name**, **Description**, and **Language** for your custom keyword project. You can only choose one language per project, and support is currently limited to English (United States) and Chinese (Mandarin, Simplified). 

    ![Describe your keyword project](media/custom-keyword/custom-kw-portal-new-project.png)

1. Select your project's name from the list. 

    :::image type="content" source="media/custom-keyword/custom-kw-portal-project-list.png" alt-text="Select your keyword project.":::

1. To create a custom keyword for your virtual assistant, select **Create a new model**.

1. Enter a **Name** for the model, **Description**, and **Keyword** of your choice, then select **Next**. See the [guidelines](keyword-recognition-guidelines.md#choosing-an-effective-keyword) on choosing an effective keyword.

    ![Enter your keyword](media/custom-keyword/custom-kw-portal-new-model.png)

1. The portal creates candidate pronunciations for your keyword. Listen to each candidate by selecting the play buttons and remove the checks next to any pronunciations that are incorrect.Select all pronunciations that correspond to how you expect your users to say the keyword and then select **Next** to begin generating the keyword model. 

    :::image type="content" source="media/custom-keyword/custom-kw-portal-choose-prons.png" alt-text="Screenshot that shows where you choose the correct pronunciations.":::

1. Select a model type, then select **Create**. You can view a list of regions that support the **Advanced** model type in the [Keyword recognition region support](regions.md#keyword-recognition) documentation. 

1. It may take up to 30 minutes for the model to be generated. The keyword list will change from **Processing** to **Succeeded** when the model is complete. 

    :::image type="content" source="media/custom-keyword/custom-kw-portal-review-keyword.png" alt-text="Review your keyword.":::

1. From the collapsible menu on the left, select **Tune** for options to tune and download your model. The downloaded file is a `.zip` archive. Extract the archive, and you see a file with the `.table` extension. You use the `.table` file with the SDK, so make sure to note its path.

    :::image type="content" source="media/custom-keyword/custom-kw-portal-download-model.png" alt-text="Download your model table.":::


## Use a keyword model with the Speech SDK

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

> [!div class="nextstepaction"]
> [Get the Speech SDK](speech-sdk.md)
