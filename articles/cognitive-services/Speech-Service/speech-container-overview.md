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


## Request approval to run the container

To use the Speech containers, you must submit a request form and wait for approval. Fill out and submit a request form to request access to the container. 
* For connected containers, you must submit [this request form](https://aka.ms/csgate) and wait for approval.
* For disconnected containers (not connected to the internet), you must submit [this request form](https://aka.ms/csdisconnectedcontainers) and wait for approval. For more information about applying and purchasing a commitment plan to use containers in disconnected environments, see [Use containers in disconnected environments](../containers/disconnected-containers.md#request-access-to-use-containers-in-disconnected-environments).

The form requests information about you, your company, and the user scenario for which you'll use the container. 

* On the form, you must use an email address associated with an Azure subscription ID.
* The Azure resource you use to run the container must have been created with the approved Azure subscription ID.
* Check your email for updates on the status of your application from Microsoft.

After you submit the form, the Azure Cognitive Services team reviews it and emails you with a decision within 10 business days.

> [!IMPORTANT]
> To use the Speech containers, your request must be approved. 

While you're waiting for approval, you can [setup the prerequisites](speech-containers-howto.md#prerequisites) on your host computer. You can also download the container from the Microsoft Container Registry (MCR). You can run the container after your request is approved.


## Billing

The Speech containers send billing information to Azure by using a Speech resource on your Azure account. 

Speech containers aren't licensed to run without being connected to Azure for metering. You must configure your container to communicate billing information with the metering service at all times. 





## Next steps

* [Install and run Speech containers](speech-container-howto.md)


