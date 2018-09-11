---
title: Best practices - QnA Maker
titlesuffix: Azure Cognitive Services 
description: Use these best practices to improve your knowledge base and provide better results to your application/chat bot's end users.
services: cognitive-services
author: tulasim88
manager: pchoudh
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 09/24/2018
ms.author: tulasim
---

# Best practices
The [knowledge base development lifecycle](../Concepts/development-lifecycle-knowledge-base.md) guides you on how to manage you KB end-to-end. Use these best practices to improve your knowledge base and provide better results to your application/chat bot's end users.

## Extraction
QnA Maker is continually improving the algorithms that extract QnAs from content and expanding the list of file and HTML-page formats supported. Follow the [guidelines](../Concepts/data-sources-supported.md) for extraction based on the type of document you are extracting from. 

In general, FAQ pages should be stand-alone and not combined with other information. Product manuals should have clear headings and preferably an index page. 

## Chit-Chat
Add chit-chat to your bot, to make your bot more conversational and engaging, with low effort. You can easily add chit-chat data sets for 3 pre-defined personalities when creating your KB, and change them at any time. Learn how to [add chit-chat to your KB](../How-To/chit-chat-knowledge-base.md). 

### Choosing a personality
Today, Chit-chat is supported for 3 pre-defined personalities: "The Professional", "The Friend", "The Comic". The responses range from very formal to very informal and irreverent. You should select the personality that is closest aligned with the desired tone of your bot. You can view the datasets, and choose one that serves as a base for your bot, and then customize the responses. 

### Edit bot-specific questions
There are some bot-specific questions that are part of the chit-chat data set, and have been filled in with generic answers. You should change these to best reflect your bot details. We recommend making the following chit-chat QnAs more specific:

* Who are you?
* What can you do?
* How old are you?
* Who created you?
* Hello
   

## Ranking/Scoring
Make sure you are making the best use of the ranking features QnA Maker supports. Doing so will improve the likelihood that a given user query is answered with an appropriate response.

### Choosing a threshold
The default confidence score that is used as a threshold is 50, however you can change it for your KB based on your needs. Since every KB is different, you should test and choose the threshold that is best suited for your KB. Read more about the [confidence score](../Concepts/confidence-score.md). 


### Add alternate questions
[Alternate questions](../How-To/edit-knowledge-base.md) improve the likelihood of a match with a user query. Alternate questions are useful when there are multiple ways in which the same question may be asked. This can include changes in the sentence structure and word-style.

<!-- added table for scanability -->

|Original query|Alternate queries|Change| 
|--|--|--|
|Is parking available?|Do you have car park?|sentence structure|
 |Hi|Yo<br>Hey there!|word-style or slang|

### Use metadata filters
[Metadata](../How-To/edit-knowledge-base.md) adds the ability to narrow down the results of a user query based on filters. The knowledge base answer can differ based on the metadata tag, even if the query is the same. For example, *"where is parking located"* can have a different answer if the location of the restaurant branch is different - that is, the metadata is *Location: Seattle* versus *Location: Redmond*.

### Use synonyms
While there is some support for synonyms in the English language, use [word alterations](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75fd) to add synonyms to keywords that take different form. Synonyms should be added at the QnA Maker service-level and shared by all knowledge bases in the service.

<!-- added table for scanability -->

|Original word|Synonyms|
|--|--|
|buy|purchase<br>netbanking<br>net banking|

### Use distinct words to differentiate questions
QnA Maker match-and-rank algorithms, that match a user query with a question in the knowledge base, work best if each question addresses a different need. Repetition of the same word set between questions reduces the likelihood that the right answer is chosen for a given user query with those words. <!-- TBD: Can you give an example of this last sentence?-->

## Collaborate
QnA Maker allows users to [collaborate](../How-to/collaborate-knowledge-base.md) on a knowledge base. Users require access to the Azure QnA Maker resource group in order to access the knowledge bases. Some organizations may want to outsource the knowledge base editing and maintenance, and still be able to protect access to their Azure resources. This editor-approver model can be accomplished by setting up two identical [QnA Maker services](../How-to/set-up-qnamaker-service-azure.md) in different subscriptions and designating one for the edit-testing cycle. Once testing is complete, the knowledge base contents can be transferred with an [import-export](../Tutorials/migrate-knowledge-base.md) process to the QnA Maker service of the approver that will finally publish the knowledge base and update the endpoint.

## Next steps

> [!div class="nextstepaction"]
> [Edit a knowledge base](../How-to/edit-knowledge-base.md)
