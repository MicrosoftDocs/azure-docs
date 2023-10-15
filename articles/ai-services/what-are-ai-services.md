---
title: What are Azure AI services?
titleSuffix: Azure AI services
description: Azure AI services are cloud-based artificial intelligence (AI) services that help developers build cognitive intelligence into applications without having direct AI or data science skills or knowledge.
services: cognitive-services
author: eric-urban
manager: nitinme
keywords: Azure AI services, cognitive
ms.service: azure-ai-services
ms.topic: overview
ms.date: 7/18/2023
ms.author: eur
ms.custom: build-2023, build-2023-dataai
---

# What are Azure AI services?

Azure AI services help developers and organizations rapidly create intelligent, cutting-edge, market-ready, and responsible applications with out-of-the-box and pre-built and customizable APIs and models. Example applications include natural language processing for conversations, search, monitoring, translation, speech, vision, and decision-making. 

[!INCLUDE [Azure AI services rebrand](./includes/rebrand-note.md)]

Most Azure AI services are available through REST APIs and client library SDKs in popular development languages. For more information, see each service's documentation.

## Available Azure AI services

Select a service from the table below and learn how it can help you meet your development goals.

| Service | Description |
| --- | --- |
| ![Anomaly Detector icon](media/service-icons/anomaly-detector.svg) [Anomaly Detector](./Anomaly-Detector/index.yml) (retired) | Identify potential problems early on |
| ![Azure Cognitive Search icon](media/service-icons/cognitive-search.svg) [Azure Cognitive Search](../search/index.yml) | Bring AI-powered cloud search to your mobile and web apps |
| ![Azure OpenAI Service icon](media/service-icons/azure.svg) [Azure OpenAI](./openai/index.yml) | Perform a wide variety of natural language tasks |
| ![Bot service icon](media/service-icons/bot-services.svg) [Bot Service](/composer/) | Create bots and connect them across channels |
| ![Content Moderator icon](media/service-icons/content-moderator.svg) [Content Moderator](./content-moderator/index.yml) (retired) | Detect potentially offensive or unwanted content |
| ![Content Safety icon](media/service-icons/content-safety.svg) [Content Safety](./content-safety/index.yml) | An AI service that detects unwanted contents |
| ![Custom Vision icon](media/service-icons/custom-vision.svg) [Custom Vision](./custom-vision-service/index.yml) | Customize image recognition to fit your business |
| ![Document Intelligence icon](media/service-icons/document-intelligence.svg) [Document Intelligence](./document-intelligence/index.yml) | Turn documents into usable data at a fraction of the time and cost |
| ![Face icon](media/service-icons/face.svg) [Face](./computer-vision/overview-identity.md) | Detect and identify people and emotions in images |
| ![Immersive Reader icon](media/service-icons/immersive-reader.svg) [Immersive Reader](./immersive-reader/index.yml) | Help users read and comprehend text |
| ![Language icon](media/service-icons/language.svg) [Language](./language-service/index.yml) | Build apps with industry-leading natural language understanding capabilities |
| ![Language Understanding icon](media/service-icons/luis.svg) [Language understanding](./luis/index.yml) (retired) | Understand natural language in your apps |
| ![Metrics Advisor icon](media/service-icons/metrics-advisor.svg) [Metrics Advisor](./metrics-advisor/index.yml) (retired) | An AI service that detects unwanted contents |
| ![Personalizer icon](media/service-icons/personalizer.svg) [Personalizer](./personalizer/index.yml) (retired) | Create rich, personalized experiences for each user |
| ![QnA Maker icon](media/service-icons/luis.svg) [QnA maker](./qnamaker/index.yml) (retired) | Distill information into easy-to-navigate questions and answers |
| ![Speech icon](media/service-icons/speech.svg) [Speech](./speech-service/index.yml) | Speech to text, text to speech, translation and speaker recognition |
| ![Translator icon](media/service-icons/translator.svg) [Translator](./translator/index.yml) | Translate more than 100 languages and dialects |
| ![Video Indexer icon](media/service-icons/video-indexer.svg) [Video Indexer](../azure-video-indexer/index.yml) | Extract actionable insights from your videos |
| ![Vision icon](media/service-icons/vision.svg) [Vision](./computer-vision/index.yml) | Analyze content in images and videos |

## Pricing tiers and billing

Pricing tiers (and the amount you get billed) are based on the number of transactions you send using your authentication information. Each pricing tier specifies the:
* maximum number of allowed transactions per second (TPS).
* service features enabled within the pricing tier.
* cost for a predefined number of transactions. Going above this number will cause an extra charge as specified in the [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/) for your service.

> [!NOTE]
> Many of the Azure AI services have a free tier you can use to try the service. To use the free tier, use `F0` as the SKU for your resource.


## Use Azure AI services in different development environments

With Azure and Azure AI services, you have access to several development options, such as:

* Automation and integration tools like Logic Apps and Power Automate.
* Deployment options such as Azure Functions and the App Service. 
* Azure AI services Docker containers for secure access.
* Tools like Apache Spark, Azure Databricks, Azure Synapse Analytics, and Azure Kubernetes Service for big data scenarios. 

To learn more, see [Azure AI services development options](./cognitive-services-development-options.md).

### Containers for Azure AI services

Azure AI services also provides several Docker containers that let you use the same APIs that are available from Azure, on-premises. These containers give you the flexibility to bring Azure AI services closer to your data for compliance, security, or other operational reasons. For more information, see [Azure AI containers](cognitive-services-container-support.md "Azure AI containers").

## Regional availability

The APIs in Azure AI services are hosted on a growing network of Microsoft-managed data centers. You can find the regional availability for each API in [Azure region list](https://azure.microsoft.com/regions "Azure region list").

Looking for a region we don't support yet? Let us know by filing a feature request on our [UserVoice forum](https://feedback.azure.com/d365community/forum/09041fae-0b25-ec11-b6e6-000d3a4f0858).

## Language support

Azure AI services supports a wide range of cultural languages at the service level. You can find the language availability for each API in the [supported languages list](language-support.md "Supported languages list").

## Security

Azure AI services provides a layered security model, including [authentication](authentication.md "Authentication") with Microsoft Entra credentials, a valid resource key, and [Azure Virtual Networks](cognitive-services-virtual-networks.md "Azure Virtual Networks").

## Certifications and compliance

Azure AI services has been awarded certifications such as CSA STAR Certification, FedRAMP Moderate, and HIPAA BAA. You can [download](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942 "Download") certifications for your own audits and security reviews.

To understand privacy and data management, go to the [Trust Center](https://servicetrust.microsoft.com/ "Trust Center").

## Help and support

Azure AI services provides several support options to help you move forward with creating intelligent applications. Azure AI services also has a strong community of developers that can help answer your specific questions. For a full list of support options available to you, see [Azure AI services support and help options](cognitive-services-support-options.md "Azure AI services support and help options").

## Next steps

* Select a service from the tables above and learn how it can help you meet your development goals.
* [Create a multi-service resource](multi-service-resource.md?pivots=azportal)
* [Plan and manage costs for Azure AI services](plan-manage-costs.md)
