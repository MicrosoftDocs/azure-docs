---
title: Speech containers overview - Speech service
titleSuffix: Azure Cognitive Services
description: Use the Docker containers for the Speech service to perform speech recognition, transcription, generation, and more on-premises.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 04/06/2023
ms.author: eur
keywords: on-premises, Docker, container
---

# Speech containers overview

By using containers, you can use a subset of the Speech service features in your own environment. With Speech containers, you can build a speech application architecture that's optimized for both robust cloud capabilities and edge locality. Containers are great for specific security and data governance requirements. 

> [!NOTE]
> Connected and disconnected container pricing and commitment tiers vary. For more information, see [Speech Services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

## Available Speech containers

The following table lists the Speech containers available in the Microsoft Container Registry (MCR). The table also lists the features supported by each container and the latest version of the container. 

> [!NOTE]
> You must [request and get approval](#request-approval-to-run-the-container) to use a Speech container. 

| Container | Features | Supported versions and locales |
|--|--|--|
| [Speech-to-text](speech-container-stt.md) | Analyzes sentiment and transcribes continuous real-time speech or batch audio recordings with intermediate results.  | Latest: 3.13.0<br/><br/>For all supported versions and locales, see the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/speech-to-text/tags) and [JSON tags](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/speech-to-text/tags/list).|
| [Custom speech-to-text](speech-container-cstt.md) | Using a custom model from the [Custom Speech portal](https://speech.microsoft.com/customspeech), transcribes continuous real-time speech or batch audio recordings into text with intermediate results. | Latest: 3.13.0<br/><br/>For all supported versions and locales, see the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/custom-speech-to-text/tags) and [JSON tags](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/speech-to-text/tags/list). |
| [Speech language identification](speech-container-lid.md)<sup>1, 2</sup> | Detects the language spoken in audio files. | Latest: 1.11.0<br/><br/>For all supported versions and locales, see the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/language-detection/tags) and [JSON tags](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/language-detection/tags/list). |
| [Neural text-to-speech](speech-container-ntts.md) | Converts text to natural-sounding speech by using deep neural network technology, which allows for more natural synthesized speech. | Latest: 2.12.0<br/><br/>For all supported versions and locales, see the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/neural-text-to-speech/tags) and [JSON tags](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/neural-text-to-speech/tags/list). |

<sup>1</sup> The container is available in public preview. Containers in preview are still under development and don't meet Microsoft's stability and support requirements.
<sup>2</sup> Not available as a disconnected container.

## Request approval to run the container

To use the Speech containers, you must submit one of the following request forms and wait for approval:
-	[Connected containers request form](https://aka.ms/csgate) if you want to run containers regularly, in environments that are only connected to the internet.
-	[Disconnected Container request form](https://aka.ms/csdisconnectedcontainers) if you want to run containers in environments that can be disconnected from the internet. For more information about applying and purchasing a commitment plan to use containers in disconnected environments, see [Use containers in disconnected environments](../containers/disconnected-containers.md) in the Azure Cognitive Services documentation.

The form requests information about you, your company, and the user scenario for which you'll use the container. 

* On the form, you must use an email address associated with an Azure subscription ID.
* The Azure resource you use to run the container must have been created with the approved Azure subscription ID.
* Check your email for updates on the status of your application from Microsoft.

After you submit the form, the Azure Cognitive Services team reviews it and emails you with a decision within 10 business days.

> [!IMPORTANT]
> To use the Speech containers, your request must be approved. 

While you're waiting for approval, you can [setup the prerequisites](speech-container-howto.md#prerequisites) on your host computer. You can also download the container from the Microsoft Container Registry (MCR). You can run the container after your request is approved.

## Billing

The Speech containers send billing information to Azure by using a Speech resource on your Azure account. 

Speech containers aren't licensed to run without being connected to Azure for metering. You must configure your container to communicate billing information with the metering service at all times. For more information, see [billing arguments](speech-container-howto.md#billing-arguments). 

## Next steps

* [Install and run Speech containers](speech-container-howto.md)


