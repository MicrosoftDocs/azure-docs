---
title: Limits and boundaries - QnA Maker 
titleSuffix: Azure Cognitive Services
description: QnA Maker has meta-limits for parts of the knowledge base and service. It is important to keep your knowledge base within those limits in order to test and publish. 
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: article
ms.date: 05/22/2019
ms.author: diberry
ms.custom: seodec18
---

# QnA Maker knowledge base limits and boundaries
Comprehensive list of limits across QnA Maker.

## Knowledge Bases

* Maximum number of knowledge bases based on [Azure Search tier limits](https://docs.microsoft.com/azure/search/search-limits-quotas-capacity)

|**Azure Search tier** | **Free** | **Basic** |**S1** | **S2**| **S3** |**S3 HD**|
|---|---|---|---|---|---|----|
|Maximum number of published knowledge bases allowed|2|14|49|199|199|2,999|

 For example, if your tier has 15 allowed indexes, you can publish 14 knowledge bases (1 index per published knowledge base). The fifteenth index, `testkb`, is used for all the knowledge bases for authoring and testing. 

## Extraction Limits
* Maximum number of files that can be extracted and maximum file size: See [QnAMaker pricing](https://azure.microsoft.com/pricing/details/cognitive-services/qna-maker/)
* Maximum number of deep-links that can be crawled for extraction of QnAs from FAQ HTML pages: 20

## Metadata Limits
* Maximum number of metadata fields per knowledge base, based on [Azure Search tier limits](https://docs.microsoft.com/azure/search/search-limits-quotas-capacity)

|**Azure Search tier** | **Free** | **Basic** |**S1** | **S2**| **S3** |**S3 HD**|
|---|---|---|---|---|---|----|
|Maximum metadata fields per QnA Maker service (across all KBs)|1,000|100*|1,000|1,000|1,000|1,000|

## Knowledge Base content limits
Overall limits on the content in the knowledge base:
* Length of answer text: 25,000
* Length of question text: 1,000
* Length of metadata key/value text: 100
* Supported characters for metadata name: Alphabets, digits and _  
* Supported characters for metadata value: All except : and | 
* Length of file name: 200
* Supported file formats: ".tsv", ".pdf", ".txt", ".docx", ".xlsx".
* Maximum number of alternate questions: 300
* Maximum number of question-answer pairs: Depends on the [Azure Search tier](https://docs.microsoft.com/azure/search/search-limits-quotas-capacity#document-limits) chosen. A question and answer pair maps to a document on Azure Search index. 

## Create Knowledge base call limits:
These represent the limits for each create knowledge base action; that is, clicking *Create KB* or calling the CreateKnowledgeBase API.
* Maximum number of alternate questions per answer: 300
* Maximum number of URLs: 10
* Maximum number of files: 10

## Update Knowledge base call limits
These represent the limits for each update action; that is, clicking *Save and train* or calling the UpdateKnowledgeBase API.
* Length of each source name: 300
* Maximum number of alternate questions added or deleted: 300
* Maximum number of metadata fields added or deleted: 10
* Maximum number of URLs that can be refreshed: 5

## Next steps

Learn when and how to change service tiers:

* [QnA Maker](how-to/upgrade-qnamaker-service.md#upgrade-qna-maker-management-sku): When you need to have more source files or bigger documents in your knowledge base, beyond your current tier, upgrade your QnA Maker service pricing tier.
* [App Service](how-to/upgrade-qnamaker-service.md#upgrade-app-service): When your knowledge base needs to serve more requests from your client app, upgrade your app service pricing tier.
* [Azure Search](how-to/upgrade-qnamaker-service.md#upgrade-azure-search-service): When you plan to have many knowledge bases, upgrade your Azure Search service pricing tier.
