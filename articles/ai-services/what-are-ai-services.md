---
title: What are Azure AI services?
titleSuffix: Azure AI services
description: Azure AI services are cloud-based artificial intelligence (AI) services that help developers build cognitive intelligence into applications without having direct AI or data science skills or knowledge.
services: cognitive-services
author: eric-urban
manager: nitinme
keywords: Azure AI services, cognitive
ms.service: cognitive-services
ms.topic: overview
ms.date: 7/18/2023
ms.author: eur
ms.custom: build-2023, build-2023-dataai
---

# What are Azure AI services?

Azure AI services help developers and organizations rapidly create intelligent, cutting-edge, market-ready, and responsible applications with out-of-the-box and pre-built and customizable APIs and models. Example applications include natural language processing for conversations, search, monitoring, translation, speech, vision, and decision-making. 

Most Azure AI services are available through REST APIs and client library SDKs in popular development languages. For more information, see each service's documentation.

## Categories of Azure AI services

Select a service from the list below and learn how it can help you meet your development goals.

:::row:::
   :::column:::
      :::image type="icon" source="media/service-icons/language.svg" link="#read":::</br>Azure OpenAI
   :::column-end:::
   :::column span="":::
      Perform a wide variety of natural language tasks
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      :::image type="icon" source="media/service-icons/speech.svg" link="#read":::</br>Speech
   :::column-end:::
   :::column span="":::
      Speech to text, text to speech, translation and speaker recognition
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      :::image type="icon" source="media/service-icons/language.svg" link="#read":::</br>Language
   :::column-end:::
   :::column span="":::
      Build apps with industry-leading natural language understanding capabilities
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      :::image type="icon" source="media/service-icons/translator.svg" link="#read":::</br>Translator
   :::column-end:::
   :::column span="":::
      Translate more than 100 languages and dialects
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      :::image type="icon" source="media/service-icons/vision.svg" link="#read":::</br>Vision
   :::column-end:::
   :::column span="":::
      Analyze content in images and videos
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      :::image type="icon" source="media/service-icons/custom-vision.svg" link="#read":::</br>Custom Vision
   :::column-end:::
   :::column span="":::
      Customize image recognition to fit your business
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      :::image type="icon" source="media/service-icons/face.svg" link="#read":::</br>Face
   :::column-end:::
   :::column span="":::
      Detect and identify people and emotions in images
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      :::image type="icon" source="media/service-icons/anomaly-detector.svg" link="#read":::</br>Anomaly Detector
   :::column-end:::
   :::column span="":::
      Identify potential problems early on
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      :::image type="icon" source="media/service-icons/content-safety.svg" link="#read":::</br>Content Safety
   :::column-end:::
   :::column span="":::
      An AI service that detects unwanted contents
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      :::image type="icon" source="media/service-icons/personalizer.svg" link="#read":::</br>Personalizer
   :::column-end:::
   :::column span="":::
      Create rich, personalized experiences for each user
   :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        :::image type="icon" source="media/service-icons/bot-services.svg" link="#read":::</br>Bot Service
    :::column-end:::
    :::column span="":::
        Create bots and connect them across channels
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        :::image type="icon" source="media/service-icons/document-intelligence.svg" link="#read":::</br>Document Intelligence
    :::column-end:::
    :::column span="":::
        Turn documents into usable data at a fraction of the time and cost
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        :::image type="icon" source="media/service-icons/cognitive-search.svg" link="#read":::</br>Azure Cognitive Search
    :::column-end:::
    :::column span="":::
        Bring AI-powered cloud search to your mobile and web apps
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        :::image type="icon" source="media/service-icons/metrics-advisor.svg" link="#read":::</br>Metrics Advisor
    :::column-end:::
    :::column span="":::
        An AI service that detects unwanted contents
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        :::image type="icon" source="media/service-icons/video-indexer.svg" link="#read":::</br>Video Indexer
    :::column-end:::
    :::column span="":::
        Extract actionable insights from your videos
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
        :::image type="icon" source="media/service-icons/immersive-reader.svg" link="#read":::</br>Immersive Reader
    :::column-end:::
    :::column span="":::
        Help users read and comprehend text
    :::column-end:::
:::row-end:::



## Create an Azure AI services resource

You can create an Azure AI services resource with hands-on quickstarts using any of the following methods:

* [Azure portal](cognitive-services-apis-create-account.md?tabs=multiservice%2Cwindows "Azure portal")
* [Azure CLI](cognitive-services-apis-create-account-cli.md?tabs=windows "Azure CLI")
* [Azure SDK client libraries](cognitive-services-apis-create-account-client-library.md?tabs=windows "cognitive-services-apis-create-account-client-library?pivots=programming-language-csharp")
* [Azure Resource Manager (ARM template)](./create-account-resource-manager-template.md?tabs=portal "Azure Resource Manager (ARM template)")

## Use Azure AI services in different development environments

With Azure and Azure AI services, you have access to several development options, such as:

* Automation and integration tools like Logic Apps and Power Automate.
* Deployment options such as Azure Functions and the App Service. 
* Azure AI services Docker containers for secure access.
* Tools like Apache Spark, Azure Databricks, Azure Synapse Analytics, and Azure Kubernetes Service for big data scenarios. 

To learn more, see [Azure AI services development options](./cognitive-services-development-options.md).

### Containers for Azure AI services

Azure AI services also provides several Docker containers that let you use the same APIs that are available from Azure, on-premises. These containers give you the flexibility to bring Azure AI services closer to your data for compliance, security, or other operational reasons. For more information, see [Azure AI containers](cognitive-services-container-support.md "Azure AI containers").

<!--
## Subscription management

Once you are signed in with your Microsoft Account, you can access [My subscriptions](https://www.microsoft.com/cognitive-services/subscriptions "My subscriptions") to show the products you are using, the quota remaining, and the ability to add additional products to your subscription.

## Upgrade to unlock higher limits

All APIs have a free tier, which has usage and throughput limits.  You can increase these limits by using a paid offering and selecting the appropriate pricing tier option when deploying the service in the Azure portal. [Learn more about the offerings and pricing](https://azure.microsoft.com/pricing/details/cognitive-services/ "offerings and pricing"). You'll need to set up an Azure subscriber account with a credit card and a phone number. If you have a special requirement or simply want to talk to sales, click "Contact us" button at the top the pricing page.
-->


## Regional availability

The APIs in Azure AI services are hosted on a growing network of Microsoft-managed data centers. You can find the regional availability for each API in [Azure region list](https://azure.microsoft.com/regions "Azure region list").

Looking for a region we don't support yet? Let us know by filing a feature request on our [UserVoice forum](https://feedback.azure.com/d365community/forum/09041fae-0b25-ec11-b6e6-000d3a4f0858).

## Language support

Azure AI services supports a wide range of cultural languages at the service level. You can find the language availability for each API in the [supported languages list](language-support.md "Supported languages list").

## Security

Azure AI services provides a layered security model, including [authentication](authentication.md "Authentication") with Azure Active Directory credentials, a valid resource key, and [Azure Virtual Networks](cognitive-services-virtual-networks.md "Azure Virtual Networks").

## Certifications and compliance

Azure AI services has been awarded certifications such as CSA STAR Certification, FedRAMP Moderate, and HIPAA BAA. You can [download](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942 "Download") certifications for your own audits and security reviews.

To understand privacy and data management, go to the [Trust Center](https://servicetrust.microsoft.com/ "Trust Center").

## Help and support

Azure AI services provides several support options to help you move forward with creating intelligent applications. Azure AI services also has a strong community of developers that can help answer your specific questions. For a full list of support options available to you, see [Azure AI services support and help options](cognitive-services-support-options.md "Azure AI services support and help options").

## Next steps

* Select a service from the tables above and learn how it can help you meet your development goals.
* [Create an Azure AI services resource using the Azure portal](cognitive-services-apis-create-account.md "Create an Azure AI services account")
* [Plan and manage costs for Azure AI services](plan-manage-costs.md)
