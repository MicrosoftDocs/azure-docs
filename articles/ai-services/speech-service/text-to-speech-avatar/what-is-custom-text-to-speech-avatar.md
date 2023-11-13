---
title: Custom text to speech avatar overview - Speech service
titleSuffix: Azure AI services
description: Get an overview of the custom text to speech avatar feature of speech service, which allows you to create a customized, one-of-a-kind synthetic talking avatar for your application.
author: sally-baolian
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 11/15/2023
ms.author: v-baolianzou
keywords: custom text to speech avatar
---

# What is custom text to speech avatar? (preview)

[!INCLUDE [Text to speech avatar preview](../includes/text-to-speech-avatar-preview.md)]

Custom text to speech avatar allows you to create a customized, one-of-a-kind synthetic talking avatar for your application. With custom text to speech avatar, you can build a unique and natural-looking avatar for your product or brand by providing video recording data of your selected actors. If you also create a [custom neural voice](#custom-voice-and-custom-text-to-speech-avatar) for the same actor and use it as the avatar's voice, the avatar will be even more realistic.

> [!IMPORTANT]
> Custom text to speech avatar access is [limited](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) based on eligibility and usage criteria. Request access on the [intake form](https://aka.ms/customneural).

## How does it work?

Creating a custom text to speech avatar requires at least 10 minutes of video recording of the avatar talent as training data, and you must first get consent from the actor talent.

> [!IMPORTANT]
> Currently for custom text to speech avatar, the data processing and model training are done manually.

Before you get started, here are some considerations:

**Your use case:** Will you use the avatar to create video content such as training material, product introduction, or use the avatar as a virtual salesperson in a real-time conversation with your customers? There are some recording requirements for different use cases.

**The look of the avatar:** The custom text to speech avatar looks the same as the avatar talent in the training data, and we don't support customizing the appearance of the avatar model, such as clothes, hairstyle, etc. So if your application requires multiple styles of the same avatar, you should prepare training data for each style, as each style of an avatar will be considered as a single avatar model.

**The voice of the avatar:** The custom text to speech avatar can work with both prebuilt neural voices and custom neural voices. Creating a custom neural voice for the avatar talent and using it with the avatar will significantly increase the naturalness of the avatar experience.

Here's an overview of the steps to create a custom text to speech avatar:

1. **Get consent video:** Obtain a video recording of the consent statement. The consent statement is a video recording of the avatar talent reading a statement, giving consent to the usage of their image and voice data to train a custom text to speech avatar model.

1. **Prepare training data:** Ensure that the video recording is in the right format. It's a good idea to shoot the video recording in a professional-quality video shooting studio to get a clean background image. The quality of the resulting avatar heavily depends on the recorded video used for training. Factors like speaking rate, body posture, facial expression, hand gestures, consistency in the actor's position, and lighting of the video recording are essential to create an engaging custom text to speech avatar.

1. **Train the avatar model:** We'll start training the custom text to speech model after verifying the consent statement of the avatar talent. In the preview stage of this service, this step will be done manually by Microsoft. You'll be notified after the model is successfully trained.

1. **Deploy and use your avatar model in your APPs**

## Components sequence

The custom text to speech avatar model contains three components: text analyzer, the text to speech acoustic predictor, and text to speech avatar video renderer. 
- To generate an avatar video file or stream with the avatar model, text is first input into the text analyzer, which provides the output in the form of a phoneme sequence. 
- The acoustic predictor predicts the acoustic features of the input text, and these two parts are provided by text to speech or custom neural voice models. 
- Finally, the neural text to speech avatar model predicts the image of lip sync with the acoustic features, so that the synthetic video is generated. 

:::image type="content" source="../media/avatar/custom-avatar-workflow.png" alt-text="Screenshot of displaying an overview of the custom text to speech avatar workflow" lightbox="../media/avatar/custom-avatar-workflow.png":::

The neural text to speech avatar models are trained using deep neural networks based on the recording samples of human videos in different languages. All languages of prebuilt voices and custom neural voices can be supported.

## Custom voice and custom text to speech avatar

The custom text to speech avatar can work with a prebuilt neural voice or custom neural voice as the avatar's voice. For more information, see [Avatar voice and language](./what-is-text-to-speech-avatar.md#avatar-voice-and-language).

[Custom neural voice](../custom-neural-voice.md) and custom text to speech avatar are separate features. You can use them independently or together. If you plan to also use [custom neural voice](../custom-neural-voice.md) with a text to speech avatar, you need to deploy or [copy](../how-to-custom-voice-create-voice.md#copy-your-voice-model-to-another-project) your custom neural voice model to one of the [avatar supported regions](./what-is-text-to-speech-avatar.md#available-locations).

## Next steps

* [What is text to speech avatar](what-is-text-to-speech-avatar.md)
* [Real-time synthesis](./real-time-synthesis-avatar.md)
