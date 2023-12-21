---
title: Project best practices
description: Best practices for Question Answering
ms.service: azure-ai-language
ms.subservice: azure-ai-qna-maker
ms.topic: how-to
author: jboback
ms.author: jboback
recommendations: false
ms.date: 12/19/2023
---

# Project best practices

The following list of QnA pairs will be used to represent a project to highlight best practices when authoring in custom question answering. 

|Question                             |Answer                                                 | 
|-------------------------------------|-------------------------------------------------------|
|I want to buy a car.                 |There are three options for buying a car.              |
|I want to purchase software license. |Software licenses can be purchased online at no cost.  |
|How to get access to WPA?            |WPA can be accessed via the company portal.            |
|What is the price of Microsoft stock?|$200.                                                  |
|How do I buy Microsoft Services?     |Microsoft services can be bought online.               |
|I want to sell car.                  |Please send car pictures and documents.                |
|How do I get an identification card? |Apply via company portal to get an identification card.|
|How do I use WPA?                    |WPA is easy to use with the provided manual.           |
|What is the utility of WPA?          |WPA provides a secure way to access company resources. |

## When should you add alternate questions to a QnA?

- Question answering employs a transformer-based ranker that takes care of user queries that are semantically similar to questions in the project. For example, consider the following question answer pair:

   **Question: “What is the price of Microsoft Stock?”**

   **Answer: “$200”.**

   The service can return expected responses for semantically similar queries such as:

   "How much is Microsoft stock worth?"

   "How much is Microsoft's share value?"

   "How much does a Microsoft share cost?"

   "What is the market value of Microsoft stock?"

   "What is the market value of a Microsoft share?"

   However, please note that the confidence score with which the system returns the correct response will vary based on the input query and how different it is from the original question answer pair.

- There are certain scenarios which require the customer to add an alternate question. When a query does not return the correct answer despite it being present in the project, we advise adding that query as an alternate question to the intended QnA pair.

## How many alternate questions per QnA is optimal?

- Users can add up to 10 alternate questions depending on their scenario. Alternate questions beyond the first 10 aren’t considered by our core ranker. However, they are evaluated in the other processing layers resulting in better output overall. All the alternate questions will be considered in the preprocessing step to look for an exact match.

- Semantic understanding in question answering should be able to take care of similar alternate questions.

- The return on investment will start diminishing once you exceed 10 questions. Even if you’re adding more than 10 alternate questions, try to make the initial 10 questions as semantically dissimilar as possible so that all intents for the answer are captured by these 10 questions. For the project above, in QNA #1, adding alternate questions such as "How can I buy a car?", "I wanna buy a car." are not required. Whereas adding alternate questions such as "How to purchase a car.", "What are the options for buying a vehicle?" can be useful.

## When to add synonyms to a project

- Question answering provides the flexibility to use synonyms at the project level, unlike QnA Maker where synonyms are shared across projects for the entire service.

- For better relevance, the customer needs to provide a list of acronyms that the end user intends to use interchangeably. For instance, the following is a list of acceptable acronyms:

   MSFT – Microsoft

   ID – Identification

   ETA – Estimated time of Arrival

- Apart from acronyms, if you think your words are similar in context of a particular domain and generic language models won’t consider them similar, it’s better to add them as synonyms. For instance, if an auto company producing a car model X receives queries such as "my car’s audio isn’t working" and the project has questions on "fixing audio for car X", then we need to add "X" and "car" as synonyms.

- The Transformer based model already takes care of most of the common synonym cases, for e.g.- Purchase – Buy, Sell - Auction, Price – Value. For example, consider the following QnA pair: Q: "What is the price of Microsoft Stock?" A: "$200".

If we receive user queries like "Microsoft stock value", "Microsoft share value", "Microsoft stock worth", "Microsoft share worth", "stock value", etc., they should be able to get correct answer even though these queries have words like share, value, worth which are not originally present in the knowledge base.

## How are lowercase/uppercase characters treated?

Question answering takes casing into account but it's intelligent enough to understand when it is to be ignored. You should not be seeing any perceivable difference due to wrong casing.

## How are QnAs prioritized for multi-turn questions?

When a KB has hierarchical relationships (either added manually or via extraction) and the previous response was an answer related to other QnAs, for the next query we give slight preference to all the children QnAs, sibling QnAs and grandchildren QnAs in that order. Along with any query, the [Question Answering API] (/rest/api/cognitiveservices/questionanswering/question-answering/get-answers) expects a "context" object with the property "previousQnAId" which denotes the last top answer. Based on this previous QnA ID, all the related QnAs are boosted.

## How are accents treated?

Accents are supported for all major European languages. If the query has an incorrect accent, confidence score might be slightly different, but the service still returns the relevant answer and takes care of minor errors by leveraging fuzzy search.

## How is punctuation in a user query treated?

Punctuation is ignored in user query before sending it to the ranking stack. Ideally it should not impact the relevance scores. Punctuation that are ignored are as follows:  ,?:;\"'(){}[]-+。./!*؟

## Next steps

