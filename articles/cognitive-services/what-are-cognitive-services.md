---
title: What are Azure Cognitive Services?
titleSuffix: Azure Cognitive Services
description: Cognitive Services makes AI accessible to every developer without requiring machine-learning and data-science expertise. You just need to make an API call from your application to add the ability to see (advanced image search and recognition), hear, speak, search, and decision-making into your apps.
services: cognitive-services
author: nitinme
manager: nitinme
keywords: cognitive services, cognitive intelligence, cognitive solutions, ai services, cognitive understanding, cognitive features
ms.service: cognitive-services
ms.subservice:
ms.topic: overview
ms.date: 04/16/2021
ms.author: nitinme
ms.custom: cog-serv-seo-aug-2020
---

# What are Azure Cognitive Services?

Azure Cognitive Services are cloud-based services with REST APIs and client library SDKs available to help you build cognitive intelligence into your applications. You can add cognitive features to your applications without having artificial intelligence (AI) or data science skills. Azure Cognitive Services comprise various AI services that enable you to build cognitive solutions that can see, hear, speak, understand, and even make decisions.

## Categories of Cognitive Services

The catalog of cognitive services that provide cognitive understanding are categorized into five main pillars:

* Vision
* Speech
* Language
* Decision
* Search

The following sections in this article provides a list of services that are part of these five pillars.

## Vision APIs

|Service Name|Service Description|
|:-----------|:------------------|
|[Computer Vision](./computer-vision/index.yml "Computer Vision")|The Computer Vision service provides you with access to advanced cognitive algorithms for processing images and returning information. See [Computer Vision quickstart](./computer-vision/quickstarts-sdk/client-library.md) to get started with the service.|
|[Custom Vision Service](./custom-vision-service/index.yml "Custom Vision Service")|The Custom Vision Service lets you build, deploy, and improve your own image classifiers. An image classifier is an AI service that applies labels to images, based on their visual characteristics. |
|[Face](./face/index.yml "Face")| The Face service provides access to advanced face algorithms, enabling face attribute detection and recognition. See [Face quickstart](./face/quickstarts/client-libraries.md) to get started with the service.|
|[Form Recognizer](./form-recognizer/index.yml "Form Recognizer")|Form Recognizer identifies and extracts key-value pairs and table data from form documents; then outputs structured data including the relationships in the original file. See [Form Recognizer quickstart](./form-recognizer/quickstarts/client-library.md) to get started.|
|[Video Indexer](../media-services/video-indexer/video-indexer-overview.md "Video Indexer")|Video Indexer enables you to extract insights from your video. See [Video Indexer quickstart](/azure/media-services/video-indexer/video-indexer-get-started) to get started.|

## Speech APIs

|Service Name|Service Description|
|:-----------|:------------------|
|[Speech service](./speech-service/index.yml "Speech service")|Speech service adds speech-enabled features to applications. Speech service includes various capabilities like speech-to-text, text-to-speech, speech translation, and many more.|
<!--
|[Speaker Recognition API](./speech-service/speaker-recognition-overview.md "Speaker Recognition API") (Preview)|The Speaker Recognition API provides algorithms for speaker identification and verification.|
|[Bing Speech](./speech-service/how-to-migrate-from-bing-speech.md "Bing Speech") (Retiring)|The Bing Speech API provides you with an easy way to create speech-enabled features in your applications.|
|[Translator Speech](/azure/cognitive-services/translator-speech/ "Translator Speech") (Retiring)|Translator Speech is a machine translation service.|
-->
## Language APIs

|Service Name|Service Description|
|:-----------|:------------------|
|[Language Understanding LUIS](./luis/index.yml "Language Understanding")|Language Understanding (LUIS) is a cloud-based conversational AI service that applies custom machine-learning intelligence to a user's conversational, natural language text to predict overall meaning, and pull out relevant, detailed information. [See LUIS quickstart](./luis/luis-get-started-create-app.md) to get started with the service.|
|[QnA Maker](./qnamaker/index.yml "QnA Maker")|QnA Maker allows you to build a question and answer service from your semi-structured content. [See QnA Maker quickstart](./qnamaker/quickstarts/create-publish-knowledge-base.md) to get started with the service.|
|[Text Analytics](./text-analytics/index.yml "Text Analytics")| Text Analytics provides natural language processing over raw text for sentiment analysis, key phrase extraction, and language detection. See [Text Analytics quickstart](./text-analytics/quickstarts/client-libraries-rest-api.md) to get started with the service.|
|[Translator](./translator/index.yml "Translator")|Translator provides machine-based text translation in near real-time.|
| [Immersive Reader](./immersive-reader/index.yml "Immersive Reader") | Immersive Reader adds screen reading and comprehension capabilities to your applications. See [Immersive Reader quickstart](./immersive-reader/quickstarts/client-libraries.md) to get started with the service. |

## Decision APIs

|Service Name|Service Description|
|:-----------|:------------------|
|[Anomaly Detector](./anomaly-detector/index.yml "Anomaly Detector") |Anomaly Detector allows you to monitor and detect abnormalities in your time series data. See [Anomaly Detector quickstart](./anomaly-detector/quickstarts/client-libraries.md) to get started with the service|
|[Content Moderator](./content-moderator/overview.md "Content Moderator")|Content Moderator provides monitoring for possible offensive, undesirable, and risky content. See [Content Moderator quickstart](./content-moderator/client-libraries.md) to get started with the service.|
|[Metrics Advisor](./metrics-advisor/index.yml) (Preview) | Metrics Advisor provides customizable anomaly detection on multi-variate time series data, and a fully featured web portal to help you use the service. See [Metrics Advisor quickstart](./metrics-advisor/quickstarts/rest-api-and-client-library.md) to get started with the service. |
|[Personalizer](./personalizer/index.yml "Personalizer")|Personalizer allows you to choose the best experience to show to your users, learning from their real-time behavior. See [Personalizer quickstart](./personalizer/quickstart-personalizer-sdk.md) to get started with the service.|

## Search APIs

> [!NOTE]
> Looking for [Azure Cognitive Search](../search/index.yml)? Although it uses Cognitive Services for some tasks, it's a different search technology that supports other scenarios.

|Service Name|Service Description|
|:-----------|:------------------|
|[Bing News Search](/azure/cognitive-services/bing-news-search/ "Bing News Search")|Bing News Search returns a list of news articles determined to be relevant to the user's query.|
|[Bing Video Search](/azure/cognitive-services/Bing-Video-Search/ "Bing Video Search")|Bing Video Search returns a list of videos determined to be relevant to the user's query.|
|[Bing Web Search](./bing-web-search/index.yml "Bing Web Search")|Bing Web Search returns a list of search results determined to be relevant to the user's query.|
|[Bing Autosuggest](/azure/cognitive-services/Bing-Autosuggest "Bing Autosuggest")|Bing Autosuggest allows you to send a partial search query term to Bing and get back a list of suggested queries.|
|[Bing Custom Search](/azure/cognitive-services/bing-custom-search "Bing Custom Search")|Bing Custom Search allows you to create tailored search experiences for topics that you care about.|
|[Bing Entity Search](/azure/cognitive-services/bing-entities-search/ "Bing Entity Search")|Bing Entity Search returns information about entities that Bing determines are relevant to a user's query.|
|[Bing Image Search](/azure/cognitive-services/bing-image-search "Bing Image Search")|Bing Image Search returns a display of images determined to be relevant to the user's query.|
|[Bing Visual Search](/azure/cognitive-services/bing-visual-search "Bing Visual Search")|Bing Visual Search provides returns insights about an image such as visually similar images, shopping sources for products found in the image, and related searches.|
|[Bing Local Business Search](/azure/cognitive-services/bing-local-business-search/ "Bing Local Business Search")| Bing Local Business Search API enables your applications to find contact and location information about local businesses based on search queries.|
|[Bing Spell Check](/azure/cognitive-services/bing-spell-check/ "Bing Spell Check")|Bing Spell Check allows you to perform contextual grammar and spell checking.|

## Get started with Cognitive Services

Start by creating a Cognitive Services resource with hands-on quickstarts using the following methods:

* [Azure portal](cognitive-services-apis-create-account.md?tabs=multiservice%2Cwindows "Azure portal")
* [Azure CLI](cognitive-services-apis-create-account-cli.md?tabs=windows "Azure CLI")
* [Azure SDK client libraries](cognitive-services-apis-create-account-cli.md?tabs=windows "cognitive-services-apis-create-account-client-library?pivots=programming-language-csharp")
* [Azure Resource Manager (ARM) templates](./create-account-resource-manager-template.md?tabs=portal "Azure Resource Manager (ARM) templates")

## Using Cognitive Services in different development environments

With Azure and Cognitive Services, you have access to several development options, such as:

* Automation and integration tools like Logic Apps and Power Automate.
* Deployment options such as Azure Functions and the App Service. 
* Cognitive Services Docker containers for secure access.
* Tools like Apache Spark, Azure Databricks, Azure Synapse Analytics, and Azure Kubernetes Service for Big Data scenarios. 

To learn more, see [Cognitive Services development options](./cognitive-services-development-options.md).

<!--
## Subscription management

Once you are signed in with your Microsoft Account, you can access [My subscriptions](https://www.microsoft.com/cognitive-services/subscriptions "My subscriptions") to show the products you are using, the quota remaining, and the ability to add additional products to your subscription.

## Upgrade to unlock higher limits

All APIs have a free tier, which has usage and throughput limits.  You can increase these limits by using a paid offering and selecting the appropriate pricing tier option when deploying the service in the Azure portal. [Learn more about the offerings and pricing](https://azure.microsoft.com/pricing/details/cognitive-services/ "offerings and pricing"). You'll need to set up an Azure subscriber account with a credit card and a phone number. If you have a special requirement or simply want to talk to sales, click "Contact us" button at the top the pricing page.
-->

## Using Cognitive Services securely

Azure Cognitive Services provides a layered security model, including [authentication](authentication.md "authentication") via Azure Active Directory credentials, a valid resource key, and [Azure Virtual Networks](cognitive-services-virtual-networks.md "Azure Virtual Networks").

## Containers for Cognitive Services

 Azure Cognitive Services provides several Docker containers that let you use the same APIs that are available in Azure, on-premises. Using these containers gives you the flexibility to bring Cognitive Services closer to your data for compliance, security or other operational reasons. Learn more about [Cognitive Services Containers](cognitive-services-container-support.md "Cognitive Services Containers").

## Regional availability

The APIs in Cognitive Services are hosted on a growing network of Microsoft-managed data centers. You can find the regional availability for each API in [Azure region list](https://azure.microsoft.com/regions "Azure region list").

Looking for a region we don't support yet? Let us know by filing a feature request on our [UserVoice forum](https://cognitive.uservoice.com/ "UserVoice forum").

## Supported cultural languages

Cognitive Services supports a wide range of cultural languages at the service level. You can find the language availability for each API in the [supported languages list](language-support.md "supported languages list").

## Certifications and compliance

Cognitive Services has been awarded certifications such as CSA STAR Certification, FedRAMP Moderate, and HIPAA BAA. You can [download](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942 "download") certifications for your own audits and security reviews.

To understand privacy and data management, go to the [Trust Center](https://servicetrust.microsoft.com/ "Trust Center").

## Support

Cognitive Services provides several support options to help you move forward with creating intelligent applications. Cognitive Services also has a strong community of developers that can help answer your specific questions. For a full list of options available to you, see [Cognitive Services support and help options](cognitive-services-support-options.md "Cognitive Services support and help options").

## Next steps

* [Create a Cognitive Services account](cognitive-services-apis-create-account.md "Create a Cognitive Services account")
* [What's new in Cognitive Services docs](whats-new-docs.md "What's new in Cognitive Services docs")
* [Plan and manage costs for Cognitive Services](plan-manage-costs.md)
