---
title: Data sources supported - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure Cognitive Services
description: QnA Maker can automatically extract question-answer pairs from common semi-structured content formats such as FAQs and product manuals. Content can also be added to the knowledge base from structured files.
services: cognitive-services
author: tulasim88 
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 09/24/2018
ms.author:  tulasim
---

# Data sources 
QnA Maker can automatically extract question-answer pairs from common semi-structured content formats such as FAQs and product manuals. Content can also be added to the knowledge base from structured files.

## Plain FAQ pages
This is the most common type of FAQ page, in which the answers immediately follow the questions in the same page. 

![Plain FAQ page](../media/qnamaker-concepts-datasources/plain-faq.png) 

 

## FAQ pages with Section Links 
In this type of FAQ page, questions are aggregated together and are linked to answers that are in different sections on the same page.

 ![Section Link FAQ page](../media/qnamaker-concepts-datasources/sectionlink-faq.png) 


## FAQ pages with links to different pages 
This type of FAQ page is similar to a section-linked FAQ page, except that the links redirect to a different page. QnA Maker crawls all the linked pages to extract the corresponding answers.

 ![Deep link FAQ page](../media/qnamaker-concepts-datasources/deeplink-faq.png) 


## Product manuals

A manual is typically guidance material that accompanies a product. It helps the user to set up, use, maintain, and troubleshoot the product. When QnA Maker processes a manual, it extracts the headings and subheadings as questions and the subsequent content as answers. See an example [here](http://download.microsoft.com/download/2/9/B/29B20383-302C-4517-A006-B0186F04BE28/surface-pro-4-user-guide-EN.pdf).

> [!NOTE]
> Extraction works best on manuals that have a table of contents and/or an index page, and a clear structure with hierarchical headings.


## Structured data format through file upload

Structured files such as .tsv, .xlsx with formatted columns can also be uploaded to QnA Maker during knowledge base creation. You can also upload files from the **Settings** tab of a knowledge base

| Question  | Answer  | Metadata                |
|-----------|---------|-------------------------|
| Question1 | Answer1 | `Key1:Value1|Key2:Value2` |
| Question2 | Answer2 |      `Key:Value`           |
Any additional columns in the source file are ignored.

## Structured data format through import
Importing a knowledge base replaces the content of the existing knowledge base. Import requires a structured .tsv file that contains data source information. This information helps QnA Maker group the question-answer pairs and attribute them to a particular data source.

| Question  | Answer  | Source| Metadata                |
|-----------|---------|----|---------------------|
| Question1 | Answer1 | Url1|`Key1:Value1|Key2:Value2` |
| Question2 | Answer2 | Editorial|    `Key:Value`       |

## Editorial
If you do not have pre-existing content to populate the knowledge base, you can also add them editorially in QnA Maker Knowledge base. Learn how to update your knowledge base [here](../How-To/edit-knowledge-base.md).

## Next steps

> [!div class="nextstepaction"]
> [Add personality to answers with chit-chat personas](../How-To/chit-chat-knowledge-base.md)

## See also 

[QnA Maker overview](../Overview/overview.md)
