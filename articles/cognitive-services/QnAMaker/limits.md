---
title: Limits and boundaries - QnA Maker
description: QnA Maker has meta-limits for parts of the knowledge base and service. It is important to keep your knowledge base within those limits in order to test and publish.
ms.topic: reference
ms.date: 02/14/2020
---

# QnA Maker knowledge base limits and boundaries

QnA Maker limits provided below are a combination of the [Azure Cognitive Search pricing tier limits](https://docs.microsoft.com/azure/search/search-limits-quotas-capacity) and the [QnA Maker pricing tier limits](https://azure.microsoft.com/pricing/details/cognitive-services/qna-maker/). You need to know both sets of limits to understand how many knowledge bases you can create per resource and how large each knowledge base can grow.

## Knowledge bases

The maximum number of knowledge bases is based on [Azure Cognitive Search tier limits](https://docs.microsoft.com/azure/search/search-limits-quotas-capacity).

|**Azure Cognitive Search tier** | **Free** | **Basic** |**S1** | **S2**| **S3** |**S3 HD**|
|---|---|---|---|---|---|----|
|Maximum number of published knowledge bases allowed|2|14|49|199|199|2,999|

 For example, if your tier has 15 allowed indexes, you can publish 14 knowledge bases (1 index per published knowledge base). The fifteenth index, `testkb`, is used for all the knowledge bases for authoring and testing.

## Extraction Limits

### File naming constraints

File names may not include the following characters:

|Do not use character|
|--|
|Single quote `'`|
|Double quote `"`|

### Maximum file size

|Format|Max file size (MB)|
|--|--|
|`.docx`|10|
|`.pdf`|25|
|`.tsv`|10|
|`.txt`|10|
|`.xlsx`|3|

### Maximum number of files

The maximum number of files that can be extracted and maximum file size is based on your **[QnA Maker pricing tier limits](https://azure.microsoft.com/pricing/details/cognitive-services/qna-maker/)**.

### Maximum number of deep-links from URL

The maximum number of deep-links that can be crawled for extraction of QnAs from a URL page is **20**.

## Metadata Limits

Metadata is presented as a text-based key:value pair, such as `product:windows 10`. It is stored and compared in lower case.

### By Azure Cognitive Search pricing tier

Maximum number of metadata fields per knowledge base is based on your **[Azure Cognitive Search tier limits](https://docs.microsoft.com/azure/search/search-limits-quotas-capacity)**.

|**Azure Cognitive Search tier** | **Free** | **Basic** |**S1** | **S2**| **S3** |**S3 HD**|
|---|---|---|---|---|---|----|
|Maximum metadata fields per QnA Maker service (across all KBs)|1,000|100*|1,000|1,000|1,000|1,000|

### By name and value

The length and acceptable characters for metadata name and value are listed in the following table.

|Item|Allowed chars|Regex pattern match|Max chars|
|--|--|--|--|
|Name (key)|Allows<br>alphanumeric (letters and digits)<br>`_` (underscore)<br> Must not contain spaces.|`^[a-zA-Z0-9_]+$`|100|
|Value|Allows everything except<br>`:` (colon)<br>`|` (vertical pipe)<br>Only one value allowed.|`^[^:|]+$`|500|
|||||

## Knowledge Base content limits
Overall limits on the content in the knowledge base:
* Length of answer text: 25,000
* Length of question text: 1,000
* Length of metadata key/value text: 100
* Supported characters for metadata name: Alphabets, digits and `_`
* Supported characters for metadata value: All except `:` and `|`
* Length of file name: 200
* Supported file formats: ".tsv", ".pdf", ".txt", ".docx", ".xlsx".
* Maximum number of alternate questions: 300
* Maximum number of question-answer pairs: Depends on the **[Azure Cognitive Search tier](https://docs.microsoft.com/azure/search/search-limits-quotas-capacity#document-limits)** chosen. A question and answer pair maps to a document on Azure Cognitive Search index.
* URL/HTML page: 1 million characters

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

Learn when and how to change [service pricing tiers](How-To/set-up-qnamaker-service-azure.md#upgrade-qna-maker-sku).
