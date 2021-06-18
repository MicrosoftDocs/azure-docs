---
title: What's new in QnA Maker service?
titleSuffix: Azure Cognitive Services
description: This article contains news about QnA Maker.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: overview
ms.date: 07/16/2020
---

# What's new in QnA Maker

Learn what's new in the service. These items may release notes, videos, blog posts, and other types of information. Bookmark this page to keep up-to-date with the service.

## Release notes

Learn what's new with QnA Maker.

### May 2021

* QnA Maker managed has been re-introduced as Custom question answering feature in [Text Analytics resource](https://ms.portal.azure.com/?quickstart=true#create/Microsoft.CognitiveServicesTextAnalytics).
* Custom question answering supports unstructured documents.
* [Prebuilt API](how-to/using-prebuilt-api.md) has been introduced to generate answers for user queries from document text passed via the API.

### November 2020

* New version of QnA Maker launched in free Public Preview. Read more [here](https://techcommunity.microsoft.com/t5/azure-ai/introducing-qna-maker-managed-now-in-public-preview/ba-p/1845575).

> [!VIDEO https://channel9.msdn.com/Shows/AI-Show/Introducing-QnA-managed-Now-in-Public-Preview/player]
* Simplified resource creation
* End to End region support
* Deep learnt ranking model
* Machine Reading Comprehension for precise answers
  
### July 2020

* [Metadata: `OR` logical combination of multiple metadata pairs](how-to/query-knowledge-base-with-metadata.md#logical-or-using-strictfilterscompoundoperationtype-property)
* [Steps](how-to/network-isolation.md) to configure Cognitive Search endpoints to be private, but still accessible to QnA Maker.
* Free Cognitive Search resources are removed after [90 days of inactivity](how-to/set-up-qnamaker-service-azure.md#inactivity-policy-for-free-search-resources).

### June 2020

* Updated [Power Virtual Agent](tutorials/integrate-with-power-virtual-assistant-fallback-topic.md) tutorial for faster and easier steps

### May 2020

* [Azure role-based access control (Azure RBAC)](concepts/role-based-access-control.md)
* [Rich-text editing](how-to/edit-knowledge-base.md#rich-text-editing-for-answer) for answers

### March 2020

* TLS 1.2 is now enforced for all HTTP requests to this service. For more information, see [Azure Cognitive Services security](../cognitive-services-security.md).

### February 2020

* [NPM package](https://www.npmjs.com/package/@azure/cognitiveservices-qnamaker) with GenerateAnswer API

### November 2019

* [US Government cloud support](../../azure-government/compare-azure-government-global-azure.md#guidance-for-developers) for QnA Maker
* [Multi-turn](./how-to/multiturn-conversation.md) feature in GA
* [Chit-chat support](./how-to/chit-chat-knowledge-base.md#language-support) available in tier-1 languages

### October 2019

* Explicitly setting the language for all knowledge bases in the  QnA Maker service.

### September 2019

* Import and export with XLS file format.

### June 2019

* Improved [ranker model](concepts/query-knowledge-base.md#ranker-process) for French, Italian, German, Spanish, Portuguese

### April 2019

* Support website content extraction
* [SharePoint document](how-to/add-sharepoint-datasources.md) support from authenticated access

### March 2019

* [Active learning](how-to/improve-knowledge-base.md) provides suggestions for new question alternatives based on real user questions
* Improved natural language processing (NLP) [ranker](concepts/query-knowledge-base.md#ranker-process) model for English

> [!div class="nextstepaction"]
> [Create a QnA Maker service](how-to/set-up-qnamaker-service-azure.md)

## Cognitive Service updates

[Azure update announcements for Cognitive Services](https://azure.microsoft.com/updates/?product=cognitive-services)
