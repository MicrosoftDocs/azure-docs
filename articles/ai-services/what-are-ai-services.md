---
title: What are Azure AI services?
titleSuffix: Azure AI services
description: Azure AI services are cloud-based artificial intelligence (AI) services that help developers build cognitive intelligence into applications without having direct AI or data science skills or knowledge.
author: eric-urban
manager: nitinme
keywords: Azure AI services, cognitive
ms.service: azure-ai-services
ms.topic: overview
ms.date: 11/15/2023
ms.author: eur
ms.custom:
  - build-2023
  - build-2023-dataai
  - ignite-2023
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
| ![Azure AI Search icon](media/service-icons/search.svg) [Azure AI Search](../search/index.yml) | Bring AI-powered cloud search to your mobile and web apps |
| ![Azure OpenAI Service icon](media/service-icons/azure-openai.svg) [Azure OpenAI](./openai/index.yml) | Perform a wide variety of natural language tasks |
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
| ![Video Indexer icon](media/service-icons/video-indexer.svg) [Video Indexer](/azure/azure-video-indexer/) | Extract actionable insights from your videos |
| ![Vision icon](media/service-icons/vision.svg) [Vision](./computer-vision/index.yml) | Analyze content in images and videos |

## Pricing tiers and billing

Pricing tiers (and the amount you get billed) are based on the number of transactions you send using your authentication information. Each pricing tier specifies the:
* Maximum number of allowed transactions per second (TPS).
* Service features enabled within the pricing tier.
* Cost for a predefined number of transactions. Going above this number will cause an extra charge as specified in the [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/) for your service.

> [!NOTE]
> Many of the Azure AI services have a free tier you can use to try the service. To use the free tier, use `F0` as the SKU for your resource.

## Development options 

The tools that you will use to customize and configure models are different from those that you'll use to call the Azure AI services. Out of the box, most Azure AI services allow you to send data and receive insights without any customization. For example: 

* You can send an image to the Azure AI Vision service to detect words and phrases or count the number of people in the frame
* You can send an audio file to the Speech service and get transcriptions and translate the speech to text at the same time

Azure offers a wide range of tools that are designed for different types of users, many of which can be used with Azure AI services. Designer-driven tools are the easiest to use, and are quick to set up and automate, but might have limitations when it comes to customization. Our REST APIs and client libraries provide users with more control and flexibility, but require more effort, time, and expertise to build a solution. If you use REST APIs and client libraries, there is an expectation that you're comfortable working with modern programming languages like C#, Java, Python, JavaScript, or another popular programming language. 

Let's take a look at the different ways that you can work with the Azure AI services.

### Client libraries and REST APIs

Azure AI services client libraries and REST APIs provide you direct access to your service. These tools provide programmatic access to the Azure AI services, their baseline models, and in many cases allow you to programmatically customize your models and solutions. 

* **Target user(s)**: Developers and data scientists
* **Benefits**: Provides the greatest flexibility to call the services from any language and environment. 
* **UI**: N/A - Code only
* **Subscription(s)**: Azure account + Azure AI services resources

If you want to learn more about available client libraries and REST APIs, use our [Azure AI services overview](index.yml) to pick a service and get started with one of our quickstarts.

### Continuous integration and deployment

You can use Azure DevOps and GitHub Actions to manage your deployments. In the [section below](#continuous-integration-and-delivery-with-devops-and-github-actions), we have two examples of CI/CD integrations to train and deploy custom models for Speech and the Language Understanding (LUIS) service. 

* **Target user(s)**: Developers, data scientists, and data engineers
* **Benefits**: Allows you to continuously adjust, update, and deploy applications and models programmatically. There is significant benefit when regularly using your data to improve and update models for Speech, Vision, Language, and Decision. 
* **UI tools**: N/A - Code only 
* **Subscription(s)**: Azure account + Azure AI services resource + GitHub account

### Continuous integration and delivery with DevOps and GitHub Actions

Language Understanding and the Speech service offer continuous integration and continuous deployment solutions that are powered by Azure DevOps and GitHub Actions. These tools are used for automated training, testing, and release management of custom models. 

* [CI/CD for Custom Speech](./speech-service/how-to-custom-speech-continuous-integration-continuous-deployment.md)
* [CI/CD for LUIS](./luis/luis-concept-devops-automation.md)

### On-premises containers 

Many of the Azure AI services can be deployed in containers for on-premises access and use. Using these containers gives you the flexibility to bring Azure AI services closer to your data for compliance, security, or other operational reasons. For a complete list of Azure AI containers, see [On-premises containers for Azure AI services](./cognitive-services-container-support.md).

### Training models

Some services allow you to bring your own data, then train a model. This allows you to extend the model using the Service's data and algorithm with your own data. The output matches your needs. When you bring your own data, you might need to tag the data in a way specific to the service. For example, if you are training a model to identify flowers, you can provide a catalog of flower images along with the location of the flower in each image to train the model. 

## Azure AI services in the ecosystem

With Azure and Azure AI services, you have access to a broad ecosystem, such as:

* Automation and integration tools like Logic Apps and Power Automate.
* Deployment options such as Azure Functions and the App Service. 
* Azure AI services Docker containers for secure access.
* Tools like Apache Spark, Azure Databricks, Azure Synapse Analytics, and Azure Kubernetes Service for big data scenarios. 

To learn more, see [Azure AI services ecosystem](ai-services-and-ecosystem.md).

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

* Learn how to [get started with Azure](https://azure.microsoft.com/get-started/)
* Select a service from the tables above and learn how it can help you meet your development goals.
* [Create a multi-service resource](multi-service-resource.md?pivots=azportal)
* [Plan and manage costs for Azure AI services](plan-manage-costs.md)
