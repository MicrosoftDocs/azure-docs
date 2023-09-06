---
title: Confidence score - question answering
titleSuffix: Azure AI services
description: When a user query is matched against a knowledge base, question answering returns relevant answers, along with a confidence score.
services: cognitive-services
manager: nitinme
author: jboback
ms.author: jboback
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 11/02/2021
ms.custom: language-service-question-answering, ignite-fall-2021
---

# Confidence score

When a user query is matched against a project (also known as a knowledge base), question answering returns relevant answers, along with a confidence score. This score indicates the confidence that the answer is the right match for the given user query.

The confidence score is a number between 0 and 100. A score of 100 is likely an exact match, while a score of 0 means, that no matching answer was found. The higher the score- the greater the confidence in the answer. For a given query, there could be multiple answers returned. In that case, the answers are returned in order of decreasing confidence score.

The following table indicates typical confidence associated for a given score.

|Score Value|Score Meaning|Example Query|
|--|--|--|
|0.90 - 1.00|A near exact match of user query and a KB question|
|> 70|High confidence - typically a good answer that completely answers the user's query|
|0.50 - 0.70|Medium confidence - typically a fairly good answer that should answer the main intent of the user query|
|0.30 - 0.50|Low confidence - typically a related answer, that partially answers the user's intent|
|< 0.30|Very low confidence - typically does not answer the user's query, but has some matching words or phrases |
|0|No match, so the answer is not returned.|

## Choose a score threshold

The table above shows the range of scores that can occur when querying with question answering. However, since every project is different, and has different types of words, intents, and goals- we recommend you test and choose the threshold that best works for you. By default the threshold is set to `0`, so that all possible answers are returned. The recommended threshold that should work for most projects, is **50**.

When choosing your threshold, keep in mind the balance between **Accuracy** and **Coverage**, and adjust your threshold based on your requirements.

- If **Accuracy** (or precision) is more important for your scenario, then increase your threshold. This way, every time you return an answer, it will be a much more CONFIDENT case, and much more likely to be the answer users are looking for. In this case, you might end up leaving more questions unanswered. 

- If **Coverage** (or recall) is more important- and you want to answer as many questions as possible, even if there is only a partial relation to the user's question- then LOWER the threshold. This means there could be more cases where the answer does not answer the user's actual query, but gives some other somewhat related answer.

## Set threshold

Set the threshold score as a property of the [REST API JSON body](../quickstart/sdk.md). This means you set it for each call to REST API.

## Improve confidence scores

To improve the confidence score of a particular response to a user query, you can add the user query to the project as an alternate question on that response. You can also use case-insensitive [synonyms](../tutorials/adding-synonyms.md) to add synonyms to keywords in your project.

## Similar confidence scores

When multiple responses have a similar confidence score, it is likely that the query was too generic and therefore matched with equal likelihood with multiple answers. Try to structure your QnAs better so that every QnA entity has a distinct intent.

## Confidence score differences between test and production

The confidence score of an answer may change negligibly between the test and deployed version of the project even if the content is the same. This is because the content of the test and the deployed project are located in different Azure Cognitive Search indexes.

The test index holds all the question and answer pairs of your project. When querying the test index, the query applies to the entire index then results are restricted to the partition for that specific project. If the test query results are negatively impacting your ability to validate the project, you can:
* Organize your project using one of the following:
    * One resource restricted to one project: restrict your single language resource (and the resulting Azure Cognitive Search test index) to a project.
    * Two resources - one for test, one for production: have two language resources, using one for testing (with its own test and  production indexes) and one for production (also having its own test and production indexes)
* Always use the same parameters when querying both your test and production projects.

When you deploy a project, the question and answer contents of your project moves from the test index to a production index in Azure search.

If you have a project in different regions, each region uses its own Azure Cognitive Search index. Because different indexes are used, the scores will not be exactly the same.

## No match found

When no good match is found by the ranker, the confidence score of 0.0 or "None" is returned and the default response is returned. You can change the [default response](../how-to/change-default-answer.md).

## Next steps

