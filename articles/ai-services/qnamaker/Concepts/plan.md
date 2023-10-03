---
title: Plan your app - QnA Maker
description: Learn how to plan your QnA Maker app. Understand how QnA Maker works and interacts with other Azure services and some knowledge base concepts.
ms.service: azure-ai-language
manager: nitinme
ms.author: jboback
author: jboback
ms.subservice: azure-ai-qna-maker
ms.topic: conceptual
ms.date: 11/02/2021
ms.custom: ignite-fall-2021
---

# Plan your QnA Maker app

To plan your QnA Maker app, you need to understand how QnA Maker works and interacts with other Azure services. You should also have a solid grasp of knowledge base concepts.

[!INCLUDE [Custom question answering](../includes/new-version.md)]

## Azure resources

Each [Azure resource](azure-resources.md#resource-purposes) created with QnA Maker has a specific purpose. Each resource has its own purpose, limits, and [pricing tier](azure-resources.md#pricing-tier-considerations). It's important to understand the function of these resources so that you can use that knowledge into your planning process.

| Resource | Purpose |
|--|--|
| [QnA Maker](azure-resources.md#qna-maker-resource) resource | Authoring and query prediction |
| [Cognitive Search](azure-resources.md#cognitive-search-resource) resource | Data storage and search |
| [App Service resource and App Plan Service](azure-resources.md#app-service-and-app-service-plan) resource | Query prediction endpoint |
| [Application Insights](azure-resources.md#application-insights) resource | Query prediction telemetry |

### Resource planning

The free tier, `F0`, of each resource works and can provide both the authoring and query prediction experience. You can use this tier to learn authoring and query prediction. When you move to a production or live scenario, reevaluate your resource selection.

### Knowledge base size and throughput

When you build a real app, plan sufficient resources for the size of your knowledge base and for your expected query prediction requests.

A knowledge base size is controlled by the:
* [Cognitive Search resource](../../../search/search-limits-quotas-capacity.md) pricing tier limits
* [QnA Maker limits](../limits.md)

The knowledge base query prediction request is controlled by the web app plan and web app. Refer to [recommended settings](azure-resources.md#recommended-settings) to plan your pricing tier.

### Resource sharing

If you already have some of these resources in use, you may consider sharing resources. See which resources [can be shared](azure-resources.md#share-services-with-qna-maker) with the understanding that resource sharing is an advanced scenario.

All knowledge bases created in the same QnA Maker resource share the same **test** query prediction endpoint.

### Understand the impact of resource selection

Proper resource selection means your knowledge base answers query predictions successfully.

If your knowledge base isn't functioning properly, it's typically an issue of improper resource management.

Improper resource selection requires investigation to determine which [resource needs to change](azure-resources.md#when-to-change-a-pricing-tier).

## Knowledge bases

A knowledge base is directly tied its QnA Maker resource. It holds the question and answer (QnA) pairs that are used to answer query prediction requests.

### Language considerations

The first knowledge base created on your QnA Maker resource sets the language for the resource. You can only have one language for a QnA Maker resource.

You can structure your QnA Maker resources by language or you can use [Translator](../../translator/translator-overview.md) to change a query from another language into the knowledge base's language before sending the query to the query prediction endpoint.

### Ingest data sources

You can use one of the following ingested [data sources](../concepts/data-sources-and-content.md) to create a knowledge base:

* Public URL
* Private SharePoint URL
* File

The ingestion process converts [supported content types](../reference-document-format-guidelines.md) to markdown. All further editing of the *answer* is done with markdown. After you create a knowledge base, you can edit [QnA pairs](question-answer-set.md) in the QnA Maker portal with [rich text authoring](../how-to/edit-knowledge-base.md#rich-text-editing-for-answer).

### Data format considerations

Because the final format of a QnA pair is markdown, it's important to understand [markdown support](../reference-markdown-format.md).

Linked images must be available from a public URL to be displayed in the test pane of the QnA Maker portal or in a client application. QnA Maker doesn't provide authentication for content, including images.

### Bot personality

Add a bot personality to your knowledge base with [chit-chat](../how-to/chit-chat-knowledge-base.md). This personality comes through with answers provided in a certain conversational tone such as *professional* and *friendly*. This chit-chat is provided as a conversational set, which you have total control to add, edit, and remove.

A bot personality is recommended if your bot connects to your knowledge base. You can choose to use chit-chat in your knowledge base even if you also connect to other services, but you should review how the bot service interacts to know if that is the correct architectural design for your use.

### Conversation flow with a knowledge base

Conversation flow usually begins with a salutation from a user, such as `Hi` or `Hello`. Your knowledge base can answer with a general answer, such as `Hi, how can I help you`, and it can also provide a selection of follow-up prompts to continue the conversation.

You should design your conversational flow with a loop in mind so that a user knows how to use your bot and isn't abandoned by the bot in the conversation. [Follow-up prompts](../how-to/multi-turn.md) provide linking between QnA pairs, which allow for the conversational flow.

### Authoring with collaborators

Collaborators may be other developers who share the full development stack of the knowledge base application or may be limited to just authoring the knowledge base.

Knowledge base authoring supports several role-based access permissions you apply in the Azure portal to limit the scope of a collaborator's abilities.

## Integration with client applications

Integration with client applications is accomplished by sending a query to the prediction runtime endpoint. A query is sent to your specific knowledge base with an SDK or REST-based request to your QnA Maker's web app endpoint.

To authenticate a client request correctly, the client application must send the correct credentials and knowledge base ID. If you're using an Azure AI Bot Service, configure these settings as part of the bot configuration in the Azure portal.

### Conversation flow in a client application

Conversation flow in a client application, such as an Azure bot, may require functionality before and after interacting with the knowledge base.

Does your client application support conversation flow, either by providing alternate means to handle follow-up prompts or including chit-chit? If so, design these early and make sure the client application query is handled correctly by another service or when sent to your knowledge base.

### Dispatch between QnA Maker and Language Understanding (LUIS)

A client application may provide several features, only one of which is answered by a knowledge base. Other features still need to understand the conversational text and extract meaning from it.

A common client application architecture is to use both QnA Maker and [Language Understanding (LUIS)](../../LUIS/what-is-luis.md) together. LUIS provides the text classification and extraction for any query, including to other services. QnA Maker provides answers from your knowledge base.

In such a [shared architecture](../choose-natural-language-processing-service.md) scenario, the dispatching between the two services is accomplished by the [Dispatch](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Dispatch) tool from Bot Framework.

### Active learning from a client application

QnA Maker uses _active learning_ to improve your knowledge base by suggesting alternate questions to an answer. The client application is responsible for a part of this [active learning](../how-to/use-active-learning.md). Through conversational prompts, the client application can determine that the knowledge base returned an answer that's not useful to the user, and it can determine a better answer. The client application needs to send that information back to the knowledge base to improve the prediction quality.

### Providing a default answer

If your knowledge base doesn't find an answer, it returns the _default answer_. This answer is configurable on the **Settings** page in the QnA Maker portal or in the [APIs](/rest/api/cognitiveservices/qnamaker/knowledgebase/update#request-body).

This default answer is different from the Azure bot default answer. You configure the default answer for your Azure bot in the Azure portal as part of configuration settings. It's returned when the score threshold isn't met.

## Prediction

The prediction is the response from your knowledge base, and it includes more information than just the answer. To get a query prediction response, use the [GenerateAnswer API](query-knowledge-base.md).

### Prediction score fluctuations

A score can change based on several factors:

* Number of answers you requested in response to [GenerateAnswer](query-knowledge-base.md) with `top` property
* Variety of available alternate questions
* Filtering for metadata
* Query sent to `test` or `production` knowledge base

There's a [two-phase answer ranking](query-knowledge-base.md#how-qna-maker-processes-a-user-query-to-select-the-best-answer):
- Cognitive Search - first rank. Set the number of _answers allowed_ high enough that the best answers are returned by Cognitive Search and then passed into the QnA Maker ranker.
- QnA Maker - second rank. Apply featurization and machine learning to determine best answer.

### Service updates

Apply the [latest runtime updates](../how-to/configure-QnA-Maker-resources.md#get-the-latest-runtime-updates) to automatically manage service updates.

### Scaling, throughput, and resiliency

Scaling, throughput, and resiliency are determined by the [Azure resources](../how-to/set-up-qnamaker-service-azure.md), their pricing tiers, and any surrounding architecture such as [Traffic manager](../how-to/configure-QnA-Maker-resources.md#business-continuity-with-traffic-manager).

### Analytics with Application Insights

All queries to your knowledge base are stored in Application Insights. Use our [top queries](../how-to/get-analytics-knowledge-base.md) to understand your metrics.

## Development lifecycle

The [development lifecycle](development-lifecycle-knowledge-base.md) of a knowledge base is ongoing: editing, testing, and publishing your knowledge base.

### Knowledge base development of QnA Maker pairs

Your QnA pairs should be designed and developed based on your client application usage.

Each pair can contain:
* Metadata - filterable when querying to allow you to tag your QnA pairs with additional information about the source, content, format, and purpose of your data.
* Follow-up prompts - helps to determine a path through your knowledge base so the user arrives at the correct answer.
* Alternate questions - important to allow search to match to your answer from different  forms of the question. [Active learning suggestions](../how-to/use-active-learning.md) turn into alternate questions.

### DevOps development

Developing a knowledge base to insert into a DevOps pipeline requires that the knowledge base is isolated during batch testing.

A knowledge base shares the Cognitive Search index with all other knowledge bases on the QnA Maker resource. While the knowledge base is isolated by partition, sharing the index can cause a difference in the score when compared to the published knowledge base.

To have the _same score_ on the `test` and `production` knowledge bases, isolate a QnA Maker resource to a single knowledge base. In this architecture, the resource only needs to live as long as the isolated batch test.

## Next steps

* [Azure resources](../how-to/set-up-qnamaker-service-azure.md)
* [Question and answer pairs](question-answer-set.md)
