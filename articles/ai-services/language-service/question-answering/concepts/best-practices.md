---
title: Best practices - question answering
description: Use these best practices to improve your project and provide better results to your application/chat bot's end users.
ms.service: azure-ai-language
author: jboback
ms.author: jboback
ms.topic: conceptual
ms.date: 06/03/2022
ms.custom: language-service-question-answering
---

# Question answering best practices

Use these best practices to improve your project and provide better results to your client application or chat bot's end users.

## Extraction

Question answering is continually improving the algorithms that extract question answer pairs from content and expanding the list of supported file and HTML formats. In general, FAQ pages should be stand-alone and not combined with other information. Product manuals should have clear headings and preferably an index page.

## Creating good questions and answers

We’ve used the following list of question and answer pairs as representation of a project to highlight best practices when authoring projects for question answering.

| Question | Answer |
|----------|----------|
| I want to buy a car |There are three options to buy a car.|
| I want to purchase software license |Software license can be purchased online at no cost.|
| What is the price of Microsoft stock? | $200. |
| How to buy Microsoft Services | Microsoft services can be bought online.|
| Want to sell car | Please send car pics and document.|
| How to get access to identification card? | Apply via company portal to get identification card.|

### When should you add alternate questions to question and answer pairs?

Question answering employs a transformer-based ranker that takes care of user queries that are semantically similar to the question in the project. For example, consider the following question answer pair:

*Question: What is the price of Microsoft Stock?*
*Answer: $200.*

The service can return the expected response for semantically similar queries such as:

“How much is Microsoft stock worth?
“How much is Microsoft share value?”
“How much does a Microsoft share cost?”
“What is the market value of a Microsoft stock?”
“What is the market value of a Microsoft share?”

However, it’s important to understand that the confidence score with which the system returns the correct response will vary based on the input query and how different it is from the original question answer pair.  

There are certain scenarios that require the customer to add an alternate question. When it’s already verified that for a particular query the correct answer isn’t returned despite being present in the project, we advise adding that query as an alternate question to the intended question answer pair.

### How many alternate questions per question answer pair is optimal?

Users can add as many alternate questions as they want, but only first 5 will be considered for core ranking. However, the rest will be useful for exact match scenarios. It is also recommended to keep the different intent/distinct alternate questions at the top for better relevance and score.

Semantic understanding in question answering should be able to take care of similar alternate questions.

The return on investment will start diminishing once you exceed 10 questions. Even if you’re adding more than 10 alternate questions, try to make the initial 10 questions as semantically dissimilar as possible so that all kinds of intents for the answer are captured by these 10 questions.  For the project at the beginning of this section, in question answer pair #1, adding alternate questions such as “How can I buy a car”, “I wanna buy a car” aren’t required. Whereas adding alternate questions such as “How to purchase a car”, “What are the options of buying a vehicle” can be useful.

### When to add synonyms to a project?

Question answering provides the flexibility to use synonyms at the project level, unlike QnA Maker where synonyms are shared across projects for the entire service.

For better relevance, you need to provide a list of acronyms that the end user intends to use interchangeably. The following is a list of acceptable acronyms:

`MSFT` – Microsoft
`ID` – Identification
`ETA` – Estimated time of Arrival

Other than acronyms, if you think your words are similar in context of a particular domain and generic language models won’t consider them similar, it’s better to add them as synonyms. For instance, if an auto company producing a car model X receives queries such as “my car’s audio isn’t working” and the project has questions on “fixing audio for car X”, then we need to add ‘X’ and ‘car’ as synonyms.

The transformer-based model already takes care of most of the common synonym cases, for example: `Purchase – Buy`, `Sell - Auction`, `Price – Value`. For another example, consider the following question answer pair: Q: “What is the price of Microsoft Stock?” A: “$200”.  

If we receive user queries like “Microsoft stock value”,” Microsoft share value”, “Microsoft stock worth”, “Microsoft share worth”, “stock value”, etc., you should be able to get the correct answer even though these queries have words like "share", "value", and "worth", which aren’t originally present in the project.

Special characters are not allowed in synonyms.

### How are lowercase/uppercase characters treated?

Question answering takes casing into account but it's intelligent enough to understand when it’s to be ignored. You shouldn’t be seeing any perceivable difference due to wrong casing.

### How are question answer pairs prioritized for multi-turn questions?

When a project has hierarchical relationships (either added manually or via extraction) and the previous response was an answer related to other question answer pairs, for the next query we give slight preference to all the children question answer pairs, sibling question answer pairs, and grandchildren question answer pairs in that order. Along with any query, the [Question Answering REST API](/rest/api/cognitiveservices/questionanswering/question-answering/get-answers) expects a `context` object with the property `previousQnAId`, which denotes the last top answer. Based on this previous `QnAID`, all the related `QnAs` are boosted.

### How are accents treated?

Accents are supported for all major European languages. If the query has an incorrect accent, the confidence score might be slightly different, but the service still returns the relevant answer and takes care of minor errors by leveraging fuzzy search.

### How is punctuation in a user query treated?

Punctuation is ignored in a user query before sending it to the ranking stack. Ideally it shouldn’t impact the relevance scores. Punctuation that is ignored is as follows:  `,?:;\"'(){}[]-+。./!*؟`

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

### Searching questions only when answer isn’t relevant

Use the [`RankerType=QuestionOnly`](#choosing-ranker-type) if you don't want to search answers.

An example of this is when the project is a catalog of acronyms as questions with their full form as the answer. The value of the answer won’t help to search for the appropriate answer.

## Ranking/Scoring

Make sure you’re making the best use of the supported ranking features. Doing so will improve the likelihood that a given user query is answered with an appropriate response.

### Choosing a threshold

The default [confidence score](confidence-score.md) that is used as a threshold is 0, however you can [change the threshold](confidence-score.md#set-threshold) for your project based on your needs. Since every project is different, you should test and choose the threshold that is best suited for your project.

### Choosing Ranker type

By default, question answering searches through questions and answers. If you want to search through questions only, to generate an answer, use the `RankerType=QuestionOnly` in the POST body of the REST API request.

### Add alternate questions

Alternate questions to improve the likelihood of a match with a user query. Alternate questions are useful when there are multiple ways in which the same question may be asked. This can include changes in the sentence structure and word-style.

|Original query|Alternate queries|Change|
|--|--|--|
|Is parking available?|Do you have a car park?|sentence structure|
 |Hi|Yo<br>Hey there|word-style or slang|

### Use metadata tags to filter questions and answers

Metadata adds the ability for a client application to know it shouldn’t take all answers but instead to narrow down the results of a user query based on metadata tags. The project answer can differ based on the metadata tag, even if the query is the same. For example, *"where is parking located"* can have a different answer if the location of the restaurant branch is different - that is, the metadata is *Location: Seattle* versus *Location: Redmond*.

### Use synonyms

While there’s some support for synonyms in the English language, use case-insensitive [word alterations](../tutorials/adding-synonyms.md) to add synonyms to keywords that take different forms.

|Original word|Synonyms|
|--|--|
|buy|purchase<br>net-banking<br>net banking|

---

### Use distinct words to differentiate questions

The ranking algorithm, which matches a user query with a question in the project, works best if each question addresses a different need. Repetition of the same word set between questions reduces the likelihood that the right answer is chosen for a given user query with those words.

For example, you might have two separate question answer pairs with the following questions:

|Questions|
|--|
|where is the parking *location*|
|where is the ATM *location*|

Since these two questions are phrased with very similar words, this similarity could cause very similar scores for many user queries that are phrased like  *"where is the `<x>` location"*. Instead, try to clearly differentiate with queries like  *"where is the parking lot"* and *"where is the ATM"*, by avoiding words like "location" that could be in many questions in your project.

## Collaborate

Question answering allows users to collaborate on a project. Users need access to the associated Azure resource group in order to access the projects. Some organizations may want to outsource the project editing and maintenance, and still be able to protect access to their Azure resources. This editor-approver model is done by setting up two identical language resources with identical question answering projects in different subscriptions and selecting one for the edit-testing cycle. Once testing is finished, the project contents are exported and transferred with an [import-export](../how-to/migrate-knowledge-base.md) process to the language resource of the approver that will finally deploy the project and update the endpoint.

## Active learning

[Active learning](../tutorials/active-learning.md) does the best job of suggesting alternative questions when it has a wide range of quality and quantity of user-based queries. It’s important to allow client-applications' user queries to participate in the active learning feedback loop without censorship. Once questions are suggested in Language Studio, you can review and accept or reject those suggestions.

## Next steps


