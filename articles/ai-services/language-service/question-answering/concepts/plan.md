---
title: Plan your app - question answering
description: Learn how to plan your question answering app. Understand how question answering works and interacts with other Azure services and some project concepts.
ms.service: cognitive-services
ms.subservice: language-service
author: jboback
ms.author: jboback
ms.topic: conceptual
ms.date: 06/03/2022
---

# Plan your question answering app

To plan your question answering app, you need to understand how question answering works and interacts with other Azure services. You should also have a solid grasp of project concepts.

## Azure resources

Each [Azure resource](azure-resources.md#resource-purposes) created with question answering has a specific purpose. Each resource has its own purpose, limits, and [pricing tier](azure-resources.md#pricing-tier-considerations). It's important to understand the function of these resources so that you can use that knowledge into your planning process.

| Resource | Purpose |
|--|--|
| [Language resource](azure-resources.md) resource | Authoring, query prediction endpoint and telemetry|
| [Cognitive Search](azure-resources.md#azure-cognitive-search-resource) resource | Data storage and search |

### Resource planning

Question answering throughput is currently capped at 10 text records per second for both management APIs and prediction APIs. To target 10 text records per second for your service, we recommend the S1 (one instance) SKU of Azure Cognitive Search.

### Language resource

A single language resource with the custom question answering feature enabled can host more than one project. The number of projects is determined by the Cognitive Search pricing tier's quantity of supported indexes. Learn more about the [relationship of indexes to projects](azure-resources.md#index-usage).

### Project size and throughput

When you build a real app, plan sufficient resources for the size of your project and for your expected query prediction requests.

A project size is controlled by the:
* [Cognitive Search resource](../../../../search/search-limits-quotas-capacity.md) pricing tier limits
* [Question answering limits](./limits.md)

The project query prediction request is controlled by the web app plan and web app. Refer to [recommended settings](azure-resources.md#recommended-settings) to plan your pricing tier.

### Understand the impact of resource selection

Proper resource selection means your project answers query predictions successfully.

If your project isn't functioning properly, it's typically an issue of improper resource management.

Improper resource selection requires investigation to determine which [resource needs to change](azure-resources.md#pricing-tier-considerations).

## Project

A project is directly tied its language resource. It holds the question and answer (QnA) pairs that are used to answer query prediction requests.

### Language considerations

You can now have projects in different languages within the same language resource where the custom question answering feature is enabled. When you create the first project, you can choose whether you want to use the resource for projects in a single language that will apply to all subsequent projects or make a language selection each time a project is created.

### Ingest data sources

Question answering also supports unstructured content. You can upload a file that has unstructured content.

Currently we do not support URLs for unstructured content.

The ingestion process converts supported content types to markdown. All further editing of the *answer* is done with markdown. After you create a project, you can edit QnA pairs in Language Studio with rich text authoring.

### Data format considerations

Because the final format of a QnA pair is markdown, it's important to understand markdown support.

### Bot personality

Add a bot personality to your project with [chit-chat](../how-to/chit-chat.md). This personality comes through with answers provided in a certain conversational tone such as *professional* and *friendly*. This chit-chat is provided as a conversational set, which you have total control to add, edit, and remove.

A bot personality is recommended if your bot connects to your project. You can choose to use chit-chat in your project even if you also connect to other services, but you should review how the bot service interacts to know if that is the correct architectural design for your use.

### Conversation flow with a project

Conversation flow usually begins with a salutation from a user, such as `Hi` or `Hello`. Your project can answer with a general answer, such as `Hi, how can I help you`, and it can also provide a selection of follow-up prompts to continue the conversation.

You should design your conversational flow with a loop in mind so that a user knows how to use your bot and isn't abandoned by the bot in the conversation. [Follow-up prompts](../tutorials/guided-conversations.md) provide linking between QnA pairs, which allow for the conversational flow.

### Authoring with collaborators

Collaborators may be other developers who share the full development stack of the project application or may be limited to just authoring the project.

project authoring supports several role-based access permissions you apply in the Azure portal to limit the scope of a collaborator's abilities.

## Integration with client applications

Integration with client applications is accomplished by sending a query to the prediction runtime endpoint. A query is sent to your specific project with an SDK or REST-based request to your question answering web app endpoint.

To authenticate a client request correctly, the client application must send the correct credentials and project ID. If you're using an Azure AI Bot Service, configure these settings as part of the bot configuration in the Azure portal.

### Conversation flow in a client application

Conversation flow in a client application, such as an Azure bot, may require functionality before and after interacting with the project.

Does your client application support conversation flow, either by providing alternate means to handle follow-up prompts or including chit-chit? If so, design these early and make sure the client application query is handled correctly by another service or when sent to your project.

### Active learning from a client application

Question answering uses _active learning_ to improve your project by suggesting alternate questions to an answer. The client application is responsible for a part of this [active learning](../tutorials/active-learning.md). Through conversational prompts, the client application can determine that the project returned an answer that's not useful to the user, and it can determine a better answer. The client application needs to send that information back to the project to improve the prediction quality.

### Providing a default answer

If your project doesn't find an answer, it returns the _default answer_. This answer is configurable on the **Settings** page.

This default answer is different from the Azure bot default answer. You configure the default answer for your Azure bot in the Azure portal as part of configuration settings. It's returned when the score threshold isn't met.

## Prediction

The prediction is the response from your project, and it includes more information than just the answer. To get a query prediction response, use the question answering API.

### Prediction score fluctuations

A score can change based on several factors:

* Number of answers you requested in response with the `top` property
* Variety of available alternate questions
* Filtering for metadata
* Query sent to `test` or `production` project.

### Analytics with Azure Monitor

In question answering, telemetry is offered through the [Azure Monitor service](../../../../azure-monitor/index.yml). Use our [top queries](../how-to/analytics.md) to understand your metrics.

## Development lifecycle

The development lifecycle of a project is ongoing: editing, testing, and publishing your project.

### Project development of question answer pairs

Your QnA pairs should be designed and developed based on your client application usage.

Each pair can contain:
* Metadata - filterable when querying to allow you to tag your QnA pairs with additional information about the source, content, format, and purpose of your data.
* Follow-up prompts - helps to determine a path through your project so the user arrives at the correct answer.
* Alternate questions - important to allow search to match to your answer from different  forms of the question. [Active learning suggestions](../tutorials/active-learning.md) turn into alternate questions.

### DevOps development

Developing a project to insert into a DevOps pipeline requires that the project is isolated during batch testing.

A project shares the Cognitive Search index with all other projects on the language resource. While the project is isolated by partition, sharing the index can cause a difference in the score when compared to the published project.

To have the _same score_ on the `test` and `production` projects, isolate a language resource to a single project. In this architecture, the resource only needs to live as long as the isolated batch test.

## Next steps

* [Azure resources](./azure-resources.md)
