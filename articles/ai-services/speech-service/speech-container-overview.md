---
title: Speech containers overview - Speech service
titleSuffix: Azure AI services
description: Use the Docker containers for the Speech service to perform speech recognition, transcription, generation, and more on-premises.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 10/2/2023
ms.author: eur
keywords: on-premises, Docker, container
---

# Speech containers overview

By using containers, you can use a subset of the Speech service features in your own environment. With Speech containers, you can build a speech application architecture that's optimized for both robust cloud capabilities and edge locality. Containers are great for specific security and data governance requirements. 

## Available Speech containers

The following table lists the Speech containers available in the Microsoft Container Registry (MCR). The table also lists the features supported by each container and the latest version of the container. 

| Container | Features | Supported versions and locales |
|--|--|--|
| [Speech to text](speech-container-stt.md) | Transcribes continuous real-time speech or batch audio recordings with intermediate results.  | Latest: 4.3.0<br/><br/>For all supported versions and locales, see the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/speech-to-text/tags) and [JSON tags](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/speech-to-text/tags/list).|
| [Custom speech to text](speech-container-cstt.md) | Using a custom model from the [Custom Speech portal](https://speech.microsoft.com/customspeech), transcribes continuous real-time speech or batch audio recordings into text with intermediate results. | Latest: 4.3.0<br/><br/>For all supported versions and locales, see the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/custom-speech-to-text/tags) and [JSON tags](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/speech-to-text/tags/list). |
| [Speech language identification](speech-container-lid.md)<sup>1, 2</sup> | Detects the language spoken in audio files. | Latest: 1.12.0<br/><br/>For all supported versions and locales, see the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/language-detection/tags) and [JSON tags](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/language-detection/tags/list). |
| [Neural text to speech](speech-container-ntts.md) | Converts text to natural-sounding speech by using deep neural network technology, which allows for more natural synthesized speech. | Latest: 2.17.0<br/><br/>For all supported versions and locales, see the [Microsoft Container Registry (MCR)](https://mcr.microsoft.com/product/azure-cognitive-services/speechservices/neural-text-to-speech/tags) and [JSON tags](https://mcr.microsoft.com/v2/azure-cognitive-services/speechservices/neural-text-to-speech/tags/list). |

<sup>1</sup> The container is available in public preview. Containers in preview are still under development and don't meet Microsoft's stability and support requirements.
<sup>2</sup> Not available as a disconnected container.

## Request approval to run containers disconnected from the internet

To use the Speech containers in environments that are disconnected from the internet, you must submit a [request form](https://aka.ms/csdisconnectedcontainers) and wait for approval. For more information about applying and purchasing a commitment plan to use containers in disconnected environments, see [Use containers in disconnected environments](../containers/disconnected-containers.md) in the Azure AI services documentation.

The form requests information about you, your company, and the user scenario for which you'll use the container. 

* On the form, you must use an email address associated with an Azure subscription ID.
* The Azure resource you use to run the container must have been created with the approved Azure subscription ID.
* Check your email for updates on the status of your application from Microsoft.

After you submit the form, the Azure AI services team reviews it and emails you with a decision within 10 business days.

## Billing

The Speech containers send billing information to Azure by using a Speech resource on your Azure account. 

> [!NOTE]
> Connected and disconnected container pricing and commitment tiers vary. For more information, see [Speech service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/).

Speech containers aren't licensed to run without being connected to Azure for metering. You must configure your container to communicate billing information with the metering service at all times. For more information, see [billing arguments](speech-container-howto.md#billing-arguments). 

## Container recipes and other container services

You can use container recipes to create containers that can be reused. Containers can be built with some or all configuration settings so that they are not needed when the container is started. For container recipes see the following Azure AI services articles:
- [Create containers for reuse](../containers/container-reuse-recipe.md)
- [Deploy and run container on Azure Container Instance](../containers/azure-container-instance-recipe.md)
- [Deploy a language detection container to Azure Kubernetes Service](../containers/azure-kubernetes-recipe.md)
- [Use Docker Compose to deploy multiple containers](../containers/docker-compose-recipe.md)

For information about other container services, see the following Azure AI services articles:
- [Tutorial: Create a container image for deployment to Azure Container Instances](../../container-instances/container-instances-tutorial-prepare-app.md)
- [Quickstart: Create a private container registry using the Azure CLI](../../container-registry/container-registry-get-started-azure-cli.md)
- [Tutorial: Prepare an application for Azure Kubernetes Service (AKS)](../../aks/tutorial-kubernetes-prepare-app.md)

## Next steps

* [Install and run Speech containers](speech-container-howto.md)


