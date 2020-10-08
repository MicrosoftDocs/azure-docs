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
ms.date: 10/02/2020
ms.author: trbye
ms.custom: devx-track-csharp
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

1. Enter a **Name** for the model, an optional **Description**, and the **Keyword** of your choice, then click **Next**. See the [guidelines](speech-devices-sdk-kws-guidelines.md#choose-an-effective-keyword) on choosing an effective keyword.

    ![Enter your keyword](media/custom-keyword/custom-kws-portal-new-model.png)

1. The portal creates candidate pronunciations for your keyword. Listen to each candidate by clicking the play buttons and remove the checks next to any pronunciations that are incorrect. Once only good pronunciations are checked, click **Train** to begin generating the keyword model. 

    ![Review your keyword](media/custom-keyword/custom-kws-portal-choose-prons.png)

1. It may take up to thirty minutes for the model to be generated. The keyword list will change from **Processing** to **Succeeded** when the model is complete. You can then download the file.

    ![Review your keyword](media/custom-keyword/custom-kws-portal-download-model.png)

1. The downloaded file is a `.zip` archive. Extract the archive, and you see a file with the `.table` extension. This is the file you use with the SDK in the next section, so make sure to note its path. the file name mirrors your keyword name, for example a keyword **Activate device** has the file name `Activate_device.table`.

## Use a keyword model with the SDK

First, load your keyword model file using the `FromFile()` static function, which returns a `KeywordRecognitionModel`. Use the path to the `.table` file you downloaded from Speech Studio. Additionally, you create an `AudioConfig` using the default microphone, then instantiate a new `KeywordRecognizer` using the audio configuration.

```csharp
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;

var keywordModel = KeywordRecognitionModel.FromFile("your/path/to/Activate_device.table");
using var audioConfig = AudioConfig.FromDefaultMicrophoneInput();
using var keywordRecognizer = new KeywordRecognizer(audioConfig);
```

Next, running keyword recognition is done with one call to `RecognizeOnceAsync()` by passing your model object. This starts a keyword recognition session that lasts until the keyword is recognized. Thus, you generally use this design pattern in multi-threaded applications, or in use cases where you may be waiting for a wake-word indefinitely.

```csharp
KeywordRecognitionResult result = await keywordRecognizer.RecognizeOnceAsync(keywordModel);
```

> [!NOTE]
> The example shown here uses local keyword recognition, since it does not require a `SpeechConfig` 
object for authentication context, and does not contact the back-end. However, you can run both keyword recognition and verification [utilizing a continuous back-end connection](https://docs.microsoft.com/azure/cognitive-services/speech-service/tutorial-voice-enable-your-bot-speech-sdk#view-the-source-code-that-enables-keyword).

## Next steps

Test your custom keyword with the [Speech Devices SDK Quickstart](https://aka.ms/sdsdk-quickstart).
