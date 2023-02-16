---
title: What are Azure Cognitive Services?
titleSuffix: Azure Cognitive Services
description: Cognitive Services makes AI accessible to every developer without requiring machine-learning and data-science expertise. You need to make an API call from your application to add the ability to see (advanced image search and recognition), hear, speak, search, and decision-making into your apps.
services: cognitive-services
author: PatrickFarley
manager: nitinme
keywords: cognitive services, cognitive intelligence, cognitive solutions, ai services, cognitive understanding, cognitive features
ms.service: cognitive-services
ms.topic: overview
ms.date: 02/28/2022
ms.author: pafarley
ms.custom: cog-serv-seo-aug-2020, ignite-fall-2021
---

# What are Azure Cognitive Services?

Azure Cognitive Services are cloud-based artificial intelligence (AI) services that help developers build cognitive intelligence into applications without having direct AI or data science skills or knowledge. They are available through REST APIs and client library SDKs in popular development languages. Azure Cognitive Services enables developers to easily add cognitive features into their applications with cognitive solutions that can see, hear, speak, and analyze.

## Categories of Cognitive Services

Cognitive Services can be categorized into four main pillars:

* Vision
* Speech
* Language
* Decision

See the tables below to learn about the services offered within those categories. 

## Vision APIs

|Service Name|Service Description|Quickstart
|:-----------|:------------------|--|
|[Computer Vision](./computer-vision/index.yml "Computer Vision")|The Computer Vision service provides you with access to advanced cognitive algorithms for processing images and returning information.| [Computer Vision quickstart](./computer-vision/quickstarts-sdk/client-library.md)|
|[Custom Vision](./custom-vision-service/index.yml "Custom Vision Service")|The Custom Vision Service lets you build, deploy, and improve your own image classifiers. An image classifier is an AI service that applies labels to images, based on their visual characteristics. | [Custom Vision quickstart](./custom-vision-service/getting-started-build-a-classifier.md)|
|[Face](./computer-vision/index-identity.yml "Face")| The Face service provides access to advanced face algorithms, enabling face attribute detection and recognition.| [Face quickstart](./face/quickstarts/client-libraries.md)|

## Speech APIs

|Service Name|Service Description| Quickstart|
|:-----------|:------------------|--|
|[Speech service](./speech-service/index.yml "Speech service")|Speech service adds speech-enabled features to applications. Speech service includes various capabilities like speech-to-text, text-to-speech, speech translation, and many more.| Go to the [Speech documentation](./speech-service/index.yml) to choose a subservice quickstart.|
<!--
|[Speaker Recognition API](./speech-service/speaker-recognition-overview.md "Speaker Recognition API") (Preview)|The Speaker Recognition API provides algorithms for speaker identification and verification.|
|[Bing Speech](./speech-service/how-to-migrate-from-bing-speech.md "Bing Speech") (Retiring)|The Bing Speech API provides you with an easy way to create speech-enabled features in your applications.|
|[Translator Speech](/azure/cognitive-services/translator-speech/ "Translator Speech") (Retiring)|Translator Speech is a machine translation service.|
-->

## Language APIs

|Service Name|Service Description| Quickstart|
|:-----------|:------------------|--|
|[Language service](./language-service/index.yml "Language service")| Azure Language service provides several Natural Language Processing (NLP) features to understand and analyze text.| Go to the [Language documentation](./language-service/index.yml) to choose a subservice quickstart.|
|[Translator](./translator/index.yml "Translator")|Translator provides machine-based text translation in near real time.| [Translator quickstart](./translator/quickstart-translator.md)|
|[Language Understanding LUIS](./luis/index.yml "Language Understanding")|Language Understanding (LUIS) is a cloud-based conversational AI service that applies custom machine-learning intelligence to a user's conversational or natural language text to predict overall meaning and pull out relevant information. |[LUIS quickstart](./luis/luis-get-started-create-app.md)|
|[QnA Maker](./qnamaker/index.yml "QnA Maker")|QnA Maker allows you to build a question and answer service from your semi-structured content.| [QnA Maker quickstart](./qnamaker/quickstarts/create-publish-knowledge-base.md) |

## Decision APIs

|Service Name|Service Description| Quickstart|
|:-----------|:------------------|--|
|[Anomaly Detector](./anomaly-detector/index.yml "Anomaly Detector") |Anomaly Detector allows you to monitor and detect abnormalities in your time series data.| [Anomaly Detector quickstart](./anomaly-detector/quickstarts/client-libraries.md) |
|[Content Moderator](./content-moderator/overview.md "Content Moderator")|Content Moderator provides monitoring for possible offensive, undesirable, and risky content. | [Content Moderator quickstart](./content-moderator/client-libraries.md)|
|[Personalizer](./personalizer/index.yml "Personalizer")|Personalizer allows you to choose the best experience to show to your users, learning from their real-time behavior. |[Personalizer quickstart](./personalizer/quickstart-personalizer-sdk.md)|

## Create a Cognitive Services resource

You can create a Cognitive Services resource with hands-on quickstarts using any of the following methods:

* [Azure portal](cognitive-services-apis-create-account.md?tabs=multiservice%2Cwindows "Azure portal")
* [Azure CLI](cognitive-services-apis-create-account-cli.md?tabs=windows "Azure CLI")
* [Azure SDK client libraries](cognitive-services-apis-create-account-client-library.md?tabs=windows "cognitive-services-apis-create-account-client-library?pivots=programming-language-csharp")
* [Azure Resource Manager (ARM template)](./create-account-resource-manager-template.md?tabs=portal "Azure Resource Manager (ARM template)")

## Use Cognitive Services in different development environments

With Azure and Cognitive Services, you have access to several development options, such as:

* Automation and integration tools like Logic Apps and Power Automate.
* Deployment options such as Azure Functions and the App Service. 
* Cognitive Services Docker containers for secure access.
* Tools like Apache Spark, Azure Databricks, Azure Synapse Analytics, and Azure Kubernetes Service for big data scenarios. 

To learn more, see [Cognitive Services development options](./cognitive-services-development-options.md).

### Containers for Cognitive Services

Azure Cognitive Services also provides several Docker containers that let you use the same APIs that are available from Azure, on-premises. These containers give you the flexibility to bring Cognitive Services closer to your data for compliance, security, or other operational reasons. For more information, see [Cognitive Services Containers](cognitive-services-container-support.md "Cognitive Services Containers").

<!--
## Subscription management

Once you are signed in with your Microsoft Account, you can access [My subscriptions](https://www.microsoft.com/cognitive-services/subscriptions "My subscriptions") to show the products you are using, the quota remaining, and the ability to add additional products to your subscription.

## Upgrade to unlock higher limits

All APIs have a free tier, which has usage and throughput limits.  You can increase these limits by using a paid offering and selecting the appropriate pricing tier option when deploying the service in the Azure portal. [Learn more about the offerings and pricing](https://azure.microsoft.com/pricing/details/cognitive-services/ "offerings and pricing"). You'll need to set up an Azure subscriber account with a credit card and a phone number. If you have a special requirement or simply want to talk to sales, click "Contact us" button at the top the pricing page.
-->


## Regional availability

The APIs in Cognitive Services are hosted on a growing network of Microsoft-managed data centers. You can find the regional availability for each API in [Azure region list](https://azure.microsoft.com/regions "Azure region list").

Looking for a region we don't support yet? Let us know by filing a feature request on our [UserVoice forum](https://feedback.azure.com/d365community/forum/09041fae-0b25-ec11-b6e6-000d3a4f0858).

## Language support

Cognitive Services supports a wide range of cultural languages at the service level. You can find the language availability for each API in the [supported languages list](language-support.md "Supported languages list").

## Security

Azure Cognitive Services provides a layered security model, including [authentication](authentication.md "Authentication") with Azure Active Directory credentials, a valid resource key, and [Azure Virtual Networks](cognitive-services-virtual-networks.md "Azure Virtual Networks").

## Certifications and compliance

Cognitive Services has been awarded certifications such as CSA STAR Certification, FedRAMP Moderate, and HIPAA BAA. You can [download](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942 "Download") certifications for your own audits and security reviews.

To understand privacy and data management, go to the [Trust Center](https://servicetrust.microsoft.com/ "Trust Center").

## Help and support

Cognitive Services provides several support options to help you move forward with creating intelligent applications. Cognitive Services also has a strong community of developers that can help answer your specific questions. For a full list of support options available to you, see [Cognitive Services support and help options](cognitive-services-support-options.md "Cognitive Services support and help options").

## Next steps

* Select a service from the tables above and learn how it can help you meet your development goals.
* [Create a Cognitive Services resource using the Azure portal](cognitive-services-apis-create-account.md "Create a Cognitive Services account")
* [Plan and manage costs for Cognitive Services](plan-manage-costs.md)
