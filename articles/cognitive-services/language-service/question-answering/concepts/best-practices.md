---
title: Best practices - question answering
description: Use these best practices to improve your project and provide better results to your application/chat bot's end users.
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 11/02/2021
ms.custom: language-service-question-answering, ignite-fall-2021
---

# Question answering best practices

Use these best practices to improve your knowledge base and provide better results to your client application or chat bot's end users.

## Extraction

The question answering is continually improving the algorithms that extract question answer pairs from content and expanding the list of supported file and HTML formats. In general, FAQ pages should be stand-alone and not combined with other information. Product manuals should have clear headings and preferably an index page.

## Creating good questions and answers

### Good questions

The best questions are simple. Consider the key word or phrase for each question then create a simple question for that key word or phrase.

Add as many alternate questions as you need but keep the alterations simple. Adding more words or phrasings that are not part of the main goal of the question does not help the question answering algorithms find a match.

### Add relevant alternative questions

Your user may enter questions with either a conversational style of text, `How do I add a toner cartridge to my printer?` or a keyword search such as `toner cartridge`. The project should have both styles of questions in order to correctly return the best answer. If you aren't sure what keywords a customer is entering, use the [Azure Monitor](../how-to/analytics.md) data to analyze queries.

### Good answers

The best answers are simple answers but not too simple. Do not use answers such as `yes` and `no`. If your answer should link to other sources or provide a rich experience with media and links, use metadata tagging to distinguish between answers, then submit the query with metadata tags in the `strictFilters` property to get the correct answer version.

|Answer|Follow-up prompts|
|--|--|
|Power down the Surface laptop with the power button on the keyboard.|* Key-combinations to sleep, shut down, and restart.<br>* How to hard-boot a Surface laptop<br>* How to change the BIOS for a Surface laptop<br>* Differences between sleep, shut down and restart|
|Customer service is available via phone, Skype, and text message 24 hours a day.|* Contact information for sales.<br> * Office and store locations and hours for an in-person visit.<br> * Accessories for a Surface laptop.|

## Chit-Chat

Add chit-chat to your bot, to make your bot more conversational and engaging, with low effort. You can easily add chit-chat data sources from pre-defined personalities when creating your project, and change them at any time. Learn how to [add chit-chat to your KB](../How-To/chit-chat.md).

Chit-chat is supported in [many languages](../how-to/chit-chat.md#language-support).

### Choosing a personality

Chit-chat is supported for several predefined personalities:

|Personality |Question answering dataset file |
|---------|-----|
|Professional |[qna_chitchat_professional.tsv](https://qnamakerstore.blob.core.windows.net/qnamakerdata/editorial/qna_chitchat_professional.tsv) |
|Friendly |[qna_chitchat_friendly.tsv](https://qnamakerstore.blob.core.windows.net/qnamakerdata/editorial/qna_chitchat_friendly.tsv) |
|Witty |[qna_chitchat_witty.tsv](https://qnamakerstore.blob.core.windows.net/qnamakerdata/editorial/qna_chitchat_witty.tsv) |
|Caring |[qna_chitchat_caring.tsv](https://qnamakerstore.blob.core.windows.net/qnamakerdata/editorial/qna_chitchat_caring.tsv) |
|Enthusiastic |[qna_chitchat_enthusiastic.tsv](https://qnamakerstore.blob.core.windows.net/qnamakerdata/editorial/qna_chitchat_enthusiastic.tsv) |

The responses range from formal to informal and irreverent. You should select the personality that is closest aligned with the tone you want for your bot. You can view the [datasets](https://github.com/Microsoft/BotBuilder-PersonalityChat/tree/master/CSharp/Datasets), and choose one that serves as a base for your bot, and then customize the responses.

### Edit bot-specific questions

There are some bot-specific questions that are part of the chit-chat data set, and have been filled in with generic answers. Change these answers to best reflect your bot details.

We recommend making the following chit-chat question answer pairs more specific:

* Who are you?
* What can you do?
* How old are you?
* Who created you?
* Hello

### Adding custom chit-chat with a metadata tag

If you add your own chit-chat question answer pairs, make sure to add metadata so these answers are returned. The metadata name/value pair is `editorial:chitchat`.

## Searching for answers

Question answering REST API uses both questions and the answer to search for best answers to a user's query.

### Searching questions only when answer is not relevant

Use the [`RankerType=QuestionOnly`](#choosing-ranker-type) if you don't want to search answers.

An example of this is when the knowledge base is a catalog of acronyms as questions with their full form as the answer. The value of the answer will not help to search for the appropriate answer.

## Ranking/Scoring

Make sure you are making the best use of the supported ranking features. Doing so will improve the likelihood that a given user query is answered with an appropriate response.

### Choosing a threshold

The default [confidence score](confidence-score.md) that is used as a threshold is 0, however you can [change the threshold](confidence-score.md#set-threshold) for your project based on your needs. Since every project is different, you should test and choose the threshold that is best suited for your project.

### Choosing Ranker type

By default, question answering searches through questions and answers. If you want to search through questions only, to generate an answer, use the `RankerType=QuestionOnly` in the POST body of the REST API request.

### Add alternate questions

Alternate questions to improve the likelihood of a match with a user query. Alternate questions are useful when there are multiple ways in which the same question may be asked. This can include changes in the sentence structure and word-style.

|Original query|Alternate queries|Change|
|--|--|--|
|Is parking available?|Do you have a car park?|sentence structure|
 |Hi|Yo<br>Hey there!|word-style or slang|

### Use metadata tags to filter questions and answers

Metadata adds the ability for a client application to know it should not take all answers but instead to narrow down the results of a user query based on metadata tags. The project/knowledge base answer can differ based on the metadata tag, even if the query is the same. For example, *"where is parking located"* can have a different answer if the location of the restaurant branch is different - that is, the metadata is *Location: Seattle* versus *Location: Redmond*.

### Use synonyms

While there is some support for synonyms in the English language, use case-insensitive [word alterations](../tutorials/adding-synonyms.md) to add synonyms to keywords that take different forms.

|Original word|Synonyms|
|--|--|
|buy|purchase<br>net-banking<br>net banking|

---

### Use distinct words to differentiate questions

The ranking algorithm, that matches a user query with a question in the project/knowledge base, works best if each question addresses a different need. Repetition of the same word set between questions reduces the likelihood that the right answer is chosen for a given user query with those words.

For example, you might have two separate question answer pairs with the following questions:

|Questions|
|--|
|where is the parking *location*|
|where is the ATM *location*|

Since these two questions are phrased with very similar words, this similarity could cause very similar scores for many user queries that are phrased like  *"where is the `<x>` location"*. Instead, try to clearly differentiate with queries like  *"where is the parking lot"* and *"where is the ATM"*, by avoiding words like "location" that could be in many questions in your project.

## Collaborate

Question answering allows users to collaborate on a project/knowledge base. Users need access to the associated Azure resource group in order to access the project/knowledge bases. Some organizations may want to outsource the knowledge base editing and maintenance, and still be able to protect access to their Azure resources. This editor-approver model is done by setting up two identical language resources with identical question answering projects in different subscriptions and selecting one for the edit-testing cycle. Once testing is finished, the project contents are exported and transferred with an [import-export](../how-to/migrate-knowledge-base.md) process to the language resource of the approver that will finally deploy the project and update the endpoint.

## Active learning

[Active learning](../tutorials/active-learning.md) does the best job of suggesting alternative questions when it has a wide range of quality and quantity of user-based queries. It is important to allow client-applications' user queries to participate in the active learning feedback loop without censorship. Once questions are suggested in the Language Studio portal, you can review and accept or reject those suggestions.

## Next steps

> [!div class="nextstepaction"]
> [Edit a knowledge base](../How-to/manage-knowledge-base.md)
