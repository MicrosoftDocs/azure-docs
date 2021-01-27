---
title: What is the Speech service?
titleSuffix: Azure Cognitive Services
description: The Speech service is the unification of speech-to-text, text-to-speech, and speech translation into a single Azure subscription. Add speech to your applications, tools, and devices with the Speech SDK, Speech Devices SDK, or REST APIs.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: overview
ms.date: 11/23/2020
ms.author: trbye
---

# What is the Speech service?

The Speech service is the unification of speech-to-text, text-to-speech, and speech-translation into a single Azure subscription. It's easy to speech enable your applications, tools, and devices with the [Speech CLI](spx-overview.md), [Speech SDK](./speech-sdk.md), [Speech Devices SDK](./speech-devices-sdk-quickstart.md?pivots=platform-android), [Speech Studio](https://speech.microsoft.com/), or [REST APIs](#reference-docs).

> [!IMPORTANT]
> The Speech service has replaced Bing Speech API and Translator Speech. See the _Migration_ section for migration instructions.

The following features are part of the Speech service. Use the links in this table to learn more about common use-cases for each feature, or browse the API reference.

| Service | Feature | Description | SDK | REST |
|---------|---------|-------------|-----|------|
| [Speech-to-Text](speech-to-text.md) | Real-time Speech-to-text | Speech-to-text transcribes or translates audio streams or local files to text in real time that your applications, tools, or devices can consume or display. Use speech-to-text with [Language Understanding (LUIS)](../luis/index.yml) to derive user intents from transcribed speech and act on voice commands. | [Yes](./speech-sdk.md) | [Yes](#reference-docs) |
| | [Batch Speech-to-Text](batch-transcription.md) | Batch Speech-to-text enables asynchronous speech-to-text transcription of large volumes of speech audio data stored in Azure Blob Storage. In addition to converting speech audio to text, Batch Speech-to-text also allows for diarization and sentiment-analysis. | No | [Yes](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0) |
| | [Multi-device Conversation](multi-device-conversation.md) | Connect multiple devices or clients in a conversation to send speech- or text-based messages, with easy support for transcription and translation| Yes | No |
| | [Conversation Transcription](./conversation-transcription.md) | Enables real-time speech recognition, speaker identification, and diarization. It's perfect for transcribing in-person meetings with the ability to distinguish speakers. | Yes | No |
| | [Create Custom Speech Models](#customize-your-speech-experience) | If you are using speech-to-text for recognition and transcription in a unique environment, you can create and train custom acoustic, language, and pronunciation models to address ambient noise or industry-specific vocabulary. | No | [Yes](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0) |
| [Text-to-Speech](text-to-speech.md) | Text-to-speech | Text-to-speech converts input text into human-like synthesized speech using [Speech Synthesis Markup Language (SSML)](speech-synthesis-markup.md). Choose from standard voices and neural voices (see [Language support](language-support.md)). | [Yes](./speech-sdk.md) | [Yes](#reference-docs) |
| | [Create Custom Voices](#customize-your-speech-experience) | Create custom voice fonts unique to your brand or product. | No | [Yes](#reference-docs) |
| [Speech Translation](speech-translation.md) | Speech translation | Speech translation enables real-time, multi-language translation of speech to your applications, tools, and devices. Use this service for speech-to-speech and speech-to-text translation. | [Yes](./speech-sdk.md) | No |
| [Voice assistants](voice-assistants.md) | Voice assistants | Voice assistants using the Speech service empower developers to create natural, human-like conversational interfaces for their applications and experiences. The voice assistant service provides fast, reliable interaction between a device and an assistant implementation that uses the Bot Framework's Direct Line Speech channel or the integrated Custom Commands service for task completion. | [Yes](voice-assistants.md) | No |
| [Speaker Recognition](speaker-recognition-overview.md) | Speaker verification & identification | The Speaker Recognition service provides algorithms that verify and identify speakers by their unique voice characteristics. Speaker Recognition is used to answer the question “who is speaking?”. | Yes | [Yes](/rest/api/speakerrecognition/) |


[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

## Try the Speech service for free

For the following steps, you need both a Microsoft account and an Azure account. If you do not have a Microsoft account, you can sign up for one free of charge at the [Microsoft account portal](https://account.microsoft.com/account). Select **Sign in with Microsoft** and then, when asked to sign in, select **Create a Microsoft account**. Follow the steps to create and verify your new Microsoft account.

Once you have a Microsoft account, go to the [Azure sign-up page](https://azure.microsoft.com/free/ai/), select **Start free**, and create a new Azure account using a Microsoft account. Here is a video of [how to sign up for Azure free account](https://www.youtube.com/watch?v=GWT2R1C_uUU).

> [!NOTE]
> When you sign up for a free Azure account, it comes with $200 in service credit that you can apply toward a paid Speech service subscription, valid for up to 30 days. Your Azure services are disabled when your credit runs out or expires at the end of the 30 days. To continue using Azure services, you must upgrade your account. For more information, see [How to upgrade your Azure free account](../../cost-management-billing/manage/upgrade-azure-subscription.md). 
>
> The Speech service has two service tiers: free(f0) and subscription(s0), which have different limitations and benefits. If you use the free, low-volume Speech service tier you can keep this free subscription even after your free trial or service credit expires. For more information, see [Cognitive Services pricing - Speech service](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

### Create the Azure resource

To add a Speech service resource (free or paid tier) to your Azure account:

1. Sign in to the [Azure portal](https://portal.azure.com/) using your Microsoft account.

1. Select **Create a resource** at the top left of the portal. If you do not see **Create a resource**, you can always find it by selecting the collapsed menu in the upper left corner of the screen.

1. In the **New** window, type "speech" in the search box and press ENTER.

1. In the search results, select **Speech**.

   ![speech search results](media/index/speech-search.png)

1. Select **Create**,  then:

   - Give a unique name for your new resource. The name helps you distinguish among multiple subscriptions tied to the same service.
   - Choose the Azure subscription that the new resource is associated with to determine how the fees are billed. Here is the introduction for [how to create an Azure subscription](../../cost-management-billing/manage/create-subscription.md#create-a-subscription-in-the-azure-portal) in the Azure portal.
   - Choose the [region](regions.md) where the resource will be used. Azure is a global cloud platform that is generally available in many regions worldwide. To get the best performance, select a region that’s closest to you or where your application runs. The Speech service availabilities vary from different regions. Make sure that you create your resource in a supported region. See [region support for Speech services](./regions.md#speech-to-text-text-to-speech-and-translation).
   - Choose either a free (F0) or paid (S0) pricing tier. For complete information about pricing and usage quotas for each tier, select **View full pricing details** or see [speech services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/). For limits on resources, see [Azure Cognitive Services Limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-cognitive-services-limits).
   - Create a new resource group for this Speech subscription or assign the subscription to an existing resource group. Resource groups help you keep your various Azure subscriptions organized.
   - Select **Create**. This will take you to the deployment overview and display deployment progress messages.  
<!--
> [!NOTE]
> You can create an unlimited number of standard-tier subscriptions in one or multiple regions. However, you can create only one free-tier subscription. Model deployments on the free tier that remain unused for 7 days will be decommissioned automatically.
-->
It takes a few moments to deploy your new Speech resource. 

### Find keys and region

To find the keys and region of a completed deployment, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/) using your Microsoft account.

2. Select **All resources**, and select the name of your Cognitive Services resource.

3. On the left pane, under **RESOURCE MANAGEMENT**, select **Keys and Endpoint**.

Each subscription has two keys; you can use either key in your application. To copy/paste a key to your code editor or other location, select the copy button next to each key, switch windows to paste the clipboard contents to the desired location.

Additionally, copy the `LOCATION` value, which is your region ID (ex. `westus`, `westeurope`) for SDK calls.

> [!IMPORTANT]
> These subscription keys are used to access your Cognitive Service API. Do not share your keys. Store them securely– for example, using Azure Key Vault. We also recommend regenerating these keys regularly. Only one key is necessary to make an API call. When regenerating the first key, you can use the second key for continued access to the service.

## Complete a quickstart

We offer quickstarts in most popular programming languages, each designed to teach you basic design patterns, and have you running code in less than 10 minutes. See the following list for the quickstart for each feature.

* [Speech-to-text quickstart](get-started-speech-to-text.md)
* [Text-to-speech quickstart](get-started-text-to-speech.md)
* [Speech translation quickstart](./get-started-speech-translation.md)
* [Intent recognition quickstart](quickstarts/intent-recognition.md)
* [Speaker recognition quickstart](./get-started-speaker-recognition.md)

After you've had a chance to get started with the Speech service, try our tutorials that show you how to solve various scenarios.

- [Tutorial: Recognize intents from speech with the Speech SDK and LUIS, C#](how-to-recognize-intents-from-speech-csharp.md)
- [Tutorial: Voice enable your bot with the Speech SDK, C#](tutorial-voice-enable-your-bot-speech-sdk.md)
- [Tutorial: Build a Flask app to translate text, analyze sentiment, and synthesize translated text to speech, REST](../translator/tutorial-build-flask-app-translation-synthesis.md?bc=%2fazure%2fcognitive-services%2fspeech-service%2fbreadcrumb%2ftoc.json%252c%2fen-us%2fazure%2fbread%2ftoc.json&toc=%2fazure%2fcognitive-services%2fspeech-service%2ftoc.json%252c%2fen-us%2fazure%2fcognitive-services%2fspeech-service%2ftoc.json)

## Get sample code

Sample code is available on GitHub for the Speech service. These samples cover common scenarios like reading audio from a file or stream, continuous and single-shot recognition, and working with custom models. Use these links to view SDK and REST samples:

- [Speech-to-text, text-to-speech, and speech translation samples (SDK)](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
- [Batch transcription samples (REST)](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/batch)
- [Text-to-speech samples (REST)](https://github.com/Azure-Samples/Cognitive-Speech-TTS)
- [Voice assistant samples (SDK)](https://aka.ms/csspeech/samples)

## Customize your speech experience

The Speech service works well with built-in models, however, you may want to further customize and tune the experience for your product or environment. Customization options range from acoustic model tuning to unique voice fonts for your brand.

Other products offer speech models tuned for specific purposes like healthcare or insurance, but are available to everyone equally. Customization in Azure Speech becomes part of *your unique* competitive advantage that is unavailable to any other user or customer. In other words, your models are private and custom-tuned for your use-case only.

| Speech Service | Platform | Description |
| -------------- | -------- | ----------- |
| Speech-to-Text | [Custom Speech](https://aka.ms/customspeech) | Customize speech recognition models to your needs and available data. Overcome speech recognition barriers such as speaking style, vocabulary and background noise. |
| Text-to-Speech | [Custom Voice](https://aka.ms/customvoice) | Build a recognizable, one-of-a-kind voice for your Text-to-Speech apps with your speaking data available. You can further fine-tune the voice outputs by adjusting a set of voice parameters. |

## Deploy on premises using Docker containers

[Use Speech service containers](speech-container-howto.md) to deploy API features on-premises. These Docker containers enable you to bring the service closer to your data for compliance, security or other operational reasons. The Speech service offers the following containers:

* Standard Speech-to-text
* Custom Speech-to-text
* Standard Text-to-speech
* Neural Text-to-speech
* Custom Text-to-speech (preview)
* Speech Language Detection (preview)

## Reference docs

- [Speech SDK](./speech-sdk.md)
- [Speech Devices SDK](speech-devices-sdk.md)
- [REST API: Speech-to-text](rest-speech-to-text.md)
- [REST API: Text-to-speech](rest-text-to-speech.md)
- [REST API: Batch transcription and customization](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0)


## Next steps

> [!div class="nextstepaction"]
> [Get started with speech-to-text](./get-started-speech-to-text.md)
> [Get started with text-to-speech](get-started-text-to-speech.md)