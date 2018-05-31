---
title: QnA Maker Limits - Azure Cognitive Services | Microsoft Docs
description: QnA Maker Limits
services: cognitive-services
author: nstulasi
manager: sangitap
ms.service: cognitive-services
ms.component: QnAMaker
ms.topic: article
ms.date: 05/07/2018
ms.author: saneppal
---

# QnA Maker Limits
Comprehensive list of limits across QnA Maker.

## Knowledge Bases

* Maximum number of knowledge bases based on [Azure Search tier limits](https://docs.microsoft.com/en-us/azure/search/search-limits-quotas-capacity)

|**Azure Search tier** | **Free** | **Basic** |**S1** | **S2**| **S3** |**S3 HD**|
|---|---|---|---|---|---|----|
|Maximum number of published knowledge bases allowed (Max indexes -- 1 (reserved for test)|2|14|49|199|199|2999|

## Extraction Limits
* Maximum number of files that can be extracted (Free tier): 3 
* Maximum file size limit per file: 5 MB
* Maximum number of deep-links that can be crawled for extraction of QnAs from FAQ HTML pages: 20

## Metadata Limits
* Maximum number of metadata fields per knowledge base, based on [Azure Search tier limits](https://docs.microsoft.com/en-us/azure/search/search-limits-quotas-capacity)

|**Azure Search tier** | **Free** | **Basic** |**S1** | **S2**| **S3** |**S3 HD**|
|---|---|---|---|---|---|----|
|Maximum metadata fields per QnA Maker service (across all KBs)|1000|100*|1000|1000|1000|1000|

## Knowledge Base content limits
Overall limits on the content in the knowledge base:
* Length of answer text: 250000
* Length of question text: 1000
* Length of metadata key/value text: 100
* Length of file name: 200
* Supported formats: ".tsv", ".pdf", ".txt", ".docx", ".xlsx".
* Maximum number of alternate questions
* Maximum number of question-answers

## Create Knowledge base call limits:
These represent the limits for each create knowledge base action; that is, clicking *Create KB* or calling the CreateKnowledgeBase API.
* Maximum number of alternate questions per answer: 100
* Maximum number of URLs: 10
* Maximum number of files: 10

## Update Knowledge base call limits
These represent the limits for each update action; that is, clicking *Save and train* or calling the UpdateKnowledgeBase API.
* Length of each source name: 300
* Maximum number of questions alternate questions added or deleted: 100
* Maximum number of metadata fields added or deleted: 10
* Maximum number of URLs that can be refreshed: 5
