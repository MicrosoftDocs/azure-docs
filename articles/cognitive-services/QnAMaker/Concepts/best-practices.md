---
title: Best practices - QnA Maker 
titleSuffix: Azure Cognitive Services
description: Use these best practices to improve your knowledge base and provide better results to your application/chat bot's end users.
services: cognitive-services
author: tulasim88 
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 09/24/2018
ms.author: tulasim
---

# Best practices
The [knowledge base development lifecycle](../Concepts/development-lifecycle-knowledge-base.md) guides you on how to manage you KB end-to-end. Use these best practices to improve your knowledge base and provide better results to your application/chat bot's end users.

## Extraction
QnA Maker is continually improving the algorithms that extract QnAs from content and expanding the list of file and HTML-page formats supported. Follow the [guidelines](../Concepts/data-sources-supported.md) for extraction based on the type of document your are extracting from. 

In general, FAQ pages should be stand-alone and not combined with other information. Product manuals should have clear headings and preferably an index page. 

## Ranking/Matching
Make sure you are making the best use of the ranking features QnA Maker supports. Doing so will improve the likelihood that a given user query is answered with an appropriate response.

### Add alternate questions
[Alternate questions](../How-To/edit-knowledge-base.md) improve the likelihood of a match with a user query. Alternate questions are useful when there are multiple ways in which the same question may be asked. This can include changes in the sentence structure (for example, *"Is parking available?"* versus *"Do you have car park?"*) or changes in the word-style and slang (for example, *"Hi"* versus *"Yo"*, *"Hey there!"*).

### Use metadata filters
[Metadata](../How-To/edit-knowledge-base.md) adds the ability to narrow down the results of a user query based on filters. The knowledge base answer can differ based on the metadata tag, even if the query is the same. For example, *"where is parking located"* can have a different answer if the location of the restaurant branch is different - that is, the metadata is *Location: Seattle* versus *Location: Redmond*.)

### Use synonyms
While there is some support for synonyms in the English language, use [word alterations](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75fd) to add synonyms to keywords that take different form (Example: *buy* -> *purchase* or *netbanking* -> *net banking*. Synonyms should be added at the QnA Maker service-level and shared by all knowledge bases in the service.

### Use distinct words to differentiate questions
QnA Maker match-and-rank algorithms that match a user query with a question in the knowledge base work best if each question addresses different needs. Repetition of the same word set between questions reduces the likelihood that the right answer is chosen for a given user query with those words.

## Collaborate
QnA Maker allows users to [collaborate](../How-to/collaborate-knowledge-base.md) on a knowledge base. Users require access to the Azure QnA Maker resource group in order to access the knowledge bases. Some organizations may want to outsource the knowledge base editing and maintenance, and still be able to protect access to their Azure resources. This editor-approver model can be accomplished by setting up two identical [QnA Maker services](../How-to/set-up-qnamaker-service-azure.md) in different subscriptions and designating one for the edit-testing cycle. Once testing is complete, the knowledge base contents can be transferred with an [import-export](../Tutorials/migrate-knowledge-base.md) process to the QnA Maker service of the approver that will finally publish the knowledge base and update the endpoint.

## Next steps

> [!div class="nextstepaction"]
> [Edit a knowledge base](../How-to/edit-knowledge-base.md)

