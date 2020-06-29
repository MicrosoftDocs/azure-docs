---
title: Plan your app - QnA Maker
description:
ms.topic: conceptual
ms.date: 06/29/2020
---

# Plan your QnA Maker app

## Azure resources

Each [Azure resource](azure-resources.md#resource-purposes) created with QnA Maker has a specific purpose. Because each resource has its own purpose, limits, and [pricing tier](azure-resources#pricing-tier-considerations), it is important to understand what these resources are as part of your planning process.

|Resource|Purpose|
|--|--|
| [QnA Maker](azure-resources.md#qna-maker-resource) resource|Authoring and query prediction|
| [Cognitive Search](azure-resources.md#cognitive-search-resource) resource|Data storage and search|
| [App Service resource and App Plan Service](azure-resources.md#app-service-and-app-service-plan) resource|Query prediction endpoint|
| [Application Insights](azure-resources.md#application-insights) resource|Query prediction telemetry|

### Resource planning

While you are learning authoring and query prediction, using the free tier of each resource works and will provide both the authoring and query prediction experience.

#### QnA Maker resource

A single QnA Maker can host more than one knowledge base. The number of knowledge bases is determined by the Cognitive Search pricing tier's quantity of supported indexes. Learn more about the [relationship of indexes to knowledge bases](azure-resources.md#index-usage).

#### Knowledge base size and throughput

When you plan to build a real app, plan your resources for the size of your knowledge base, and the query prediction requests you expect.

A knowledge base size is controlled by the:
* [Cognitive Search resource](../../search/search-limits-quotas-capacity.md) pricing tier limits
* [QnA Maker limits](../limits.md)

The knowledge base query prediction requests is controlled by the Web app plan and web app. Refer to [recommended settings](azure-resources#recommended-settings) to plan your pricing tier.

### Resource sharing

If you already have some of these resources in use, you may consider sharing resources. While some resources [can be shared](azure-resources.md#share-services-with-qna-maker), this is an advanced scenario.

All knowledge bases created in the same QnA Maker resource share the same test query prediction endpoint.

### Understanding impact of resource selection

Proper resource selection means your knowledge base answers query predictions successfully.

If you knowledge base isn't functioning properly, typically the issue is improper resource management.

Improper resource selection requires investigation to determine which [resources needs to change](azure-resources.md#when-to-change-a-pricing-tier).

## Knowledge bases

A knowledge base is directly tied its QnA Maker resource and holds the question and answer (QnA) pairs used to answer query prediction requests.

### Language considerations

The first knowledge base created on your QnA Maker resources sets the language for resource. You can only have one language set for a QnA Maker resource.

Structure your QnA Maker resources by language or use [Translator](../../translator/translator-info-overview.md) to change a query from another language into the knowledge base's language.

### Ingesting data sources

Ingested [data sources](knowledge-base.md), used to create a knowledge base, can be one of the following:

* Public URL
* Private Sharepoint URL
* File

The ingestion process converts [supported content types](content-types.md) to markdown. All further editing of the *answer* is done with markdown.

After creating your knowledge base, you can edit [QnA pairs](question-answer-set.md) in the QnA Maker portal with rich text authoring.

### Data format considerations

Because the final format of a QnA pair is markdown, understanding the [markdown support](reference-markdown-format.md) is important.

Linked images must be available from a public URL in order to display in the test pane of the QnA Maker portal as well as any client application because QnA Maker doesn't provide authentication for content, including images.

### Bot personality

Add a bot personality to your knowledge base with adding [chit-chat](../how-to/chit-chat-knowledge-base.md). This personality comes through with answers provided in a certain conversational tone such as *professional* and *friendly*. This chit-chat is provided as conversational sets which you have total control to add to, edit, and remove.

A bot personality is recommended if your bot connects to your knowledge base. If you are connecting to several services, one of which is your knowledge base, you can choose to continue using chit-chat in your knowledge base, but you should review how the bot services interact to know if that is the correct architectural design for your use.

### Conversation flow with a knowledge base

Conversation flow usually begins with a salutation from a user, such as `Hi` or `Hello`. Your knowledge base can answer with a general answer, such as `Hi, how can I help you`, and it can also provide a selection of follow-up prompts, to continue the conversation.

You should design your conversational flow with a loop in mind so that a user knows how to use your bot and isn't abandoned by the bot in the conversation.

### Authoring with collaborators

Collaborators may be other developers who share the full development stack of the knowledge base application or may be limited to just authoring the knowledge base.

Knowledge base authoring supports several [role-based access permissions](../how-to/collaborate-knowledge-base.md) you apply in the Azure portal to limit the scope of a collaborators abilities.

## Integration with client applications

Integration with [client applications](integration-with-other-applications.md) means sending a query to the prediction runtime endpoint. A query is sent to your specific knowledge base with a SDK or REST-based request to your QnA Maker's web app endpoint.

In order to have a client application authenticate a request correctly, the client application must base the correct credentials and knowledge base ID.

If you are using an Azure Bot Service, this settings can be configured as part of the bot configuration.

### Conversation flow in a client application

Conversation flow in a [client application](integration-with-other-applications#providing-multi-turn-conversations.md), such as an Azure bot, may require functionality before and after interacting with the knowledge base.

If you client application supports conversation flow, either providing alternate means to handle follow-up prompts or chit-chit, design these early and make sure the query using in the client application is handled correctly, either by another service or sent to your knowledge base.

### Dispatching between QnA Maker and Language Understanding (LUIS)

A client application may provide several features, only one of which is answered by a knowledge base. Other features would still need to understand the conversational text, and extract meaning from it.

A common client application architecture is to use both QnA Maker and Language Understanding (LUIS) together. LUIS provides the text classification and extraction for any query, including to other services, while QnA Maker provides answers from your knowledge base.

In a [shared architecture](../choose-natural-language-processing-service.md), dispatching between the two services is done with the [Dispatch](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Dispatch) tool from Bot Framework.

### Active learning from a client application

Part of [active learning](active-learning-suggestions.md) is the process of a client application knowing that the primary answer to a user's query was not the best answer, and the client application [sending that information back to the knowledge base](active-learning-suggestions.md#how-you-give-explicit-feedback-with-the-train-api).

### Providing a default answer

If your knowledge base doesn't have a good answer, determined by the [score](confidence-score.md), it can return an a default answer. This answer is configurable from the QnA Maker portal, on the **Settings** page, or the [APIs](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/qnamaker/knowledgebase/update#request-body).

This default answer is different from the Azure bot default answer. The Azure bot default answer is configured in the Azure portal, for your bot, as part of configuration settings.

## Prediction

The prediction is the response from your knowledge base and it includes more information than just the answer.

To get a query prediction response, use the [GeneateAnswer API](query-knowledge-base.md).

### Prediction score fluctuations

A score can change based on several factors:

* Number of answers your requested
* Variety of available alternate questions
* Filtering for metadata
* Query sent to test or production knowledge base

There is a [two-phase answer ranking](query-knowledge-base.md#how-qna-maker-processes-a-user-query-to-select-the-best-answer):
* Cognitive Search - 1st rank - In order for an answer to return from Cognitive Search, the number of _answers allowed_ needs to be high enough that the best answers are returned by Cognitive Search so they can pass into the QnA Maker ranker
* QnA Maker - 2nd rank - apply featurization and machine learning to determine best answer.

### Service updates

Service updates are managed by applying the [latest runtime updates](how-to/set-up-qnamaker-service-azure.md#get-the-latest-runtime-updates).

### Scaling, throughput and resiliency

Scaling, throughput and resiliency are determined by the [Azure resources](../how-to/set-up-qnamaker-service-azure.md), their pricing tiers, and any surrounding architecture such as [Traffic manager](../how-to/set-up-qnamaker-service-azure.md#business-continuity-with-traffic-manager).

### Analytics with Application Insights

All queries to your knowledge base are stored in Application Insights. Use our [top queries](../how-to/get-analytics-knowledge-base) to understand your metrics.

## Development lifecycle

The [development lifecycle](development-lifecycle-knowledge-base.md) of a knowledge base is ongoing, editing, testing, and publishing your knowledge base.

### Knowledge base development of QnA Maker pairs

You [QnA pairs](question-answer-set.md) should be designed and developed based on your client application usage.

Each pair can contain:
* Metadata - filterable when querying. This allows you to tag your QnA pairs with additional information about the source of the data, the content of the data, or the purpose of your data.
* Follow-up prompts - determine a path through your knowledge base so the user arrives at the correct answer.
* Alternate questions - alternate questions are important to allow search to match to your answer from a variety of forms of the question. [Active learning suggestions](active-learning-suggestions.md) turn into alternate questions.

### DevOps development

Developing a knowledge base to insert into a DevOps pipeline requires that the knowledge base be isolated during [batch testing](../quickstarts/batch-testing.md).

When testing a knowledge base shares the Cognitive Search index with all other knowledge bases on the QnA Maker resource. While the knowledge base is isolated by partition, sharing the index can cause a different in the score when compared to the published knowledge base.

In order to have the same score on the test and production knowledge bases, isolate a QnA Maker resource to a single knowledge base. In this architecture the resource only needs to live to the length of the isolated batch test.

## Next step

* [Azure resources](../how-to/set-up-qnamaker-service-azure.md)
* [Question and answer pairs](question-answer-set.md)