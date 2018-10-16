---
title: Limits and boundaries - QnA Maker 
titleSuffix: Azure Cognitive Services
description: Comprehensive list of limits across QnA Maker.
services: cognitive-services
author: tulasim88
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 09/12/2018
ms.author: tulasim
---

# QnA Maker Limits
Comprehensive list of limits across QnA Maker.

## Knowledge Bases

* Maximum number of knowledge bases based on [Azure Search tier limits](https://docs.microsoft.com/azure/search/search-limits-quotas-capacity)

|**Azure Search tier** | **Free** | **Basic** |**S1** | **S2**| **S3** |**S3 HD**|
|---|---|---|---|---|---|----|
|Maximum number of published knowledge bases allowed (Max indexes -- 1 (reserved for test)|2|14|49|199|199|2999|

## Extraction Limits
* Maximum number of files that can be extracted and maximum file size: See [QnAMaker pricing](https://azure.microsoft.com/en-in/pricing/details/cognitive-services/qna-maker/)
* Maximum number of deep-links that can be crawled for extraction of QnAs from FAQ HTML pages: 20

## Metadata Limits
* Maximum number of metadata fields per knowledge base, based on [Azure Search tier limits](https://docs.microsoft.com/azure/search/search-limits-quotas-capacity)

|**Azure Search tier** | **Free** | **Basic** |**S1** | **S2**| **S3** |**S3 HD**|
|---|---|---|---|---|---|----|
|Maximum metadata fields per QnA Maker service (across all KBs)|1000|100*|1000|1000|1000|1000|

## Knowledge Base content limits
Overall limits on the content in the knowledge base:
* Length of answer text: 250000
* Length of question text: 1000
* Length of metadata key/value text: 100
* Supported characters for metadata name: Alphabets, digits and _  
* Supported characters for metadata value: All except : and | 
* Length of file name: 200
* Supported file formats: ".tsv", ".pdf", ".txt", ".docx", ".xlsx".
* Maximum number of alternate questions: 100
* Maximum number of question-answer pairs: Depends on the [Azure Search tier](https://docs.microsoft.com/en-in/azure/search/search-limits-quotas-capacity#document-limits) chosen 

## Create Knowledge base call limits:
These represent the limits for each create knowledge base action; that is, clicking *Create KB* or calling the CreateKnowledgeBase API.
* Maximum number of alternate questions per answer: 100
* Maximum number of URLs: 10
* Maximum number of files: 10

## Update Knowledge base call limits
These represent the limits for each update action; that is, clicking *Save and train* or calling the UpdateKnowledgeBase API.
* Length of each source name: 300
* Maximum number of alternate questions added or deleted: 100
* Maximum number of metadata fields added or deleted: 10
* Maximum number of URLs that can be refreshed: 5
