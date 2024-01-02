---
title: When to choose conversational language understanding or orchestration workflow
titleSuffix: Azure AI services
description: Learn when to choose conversational language understanding or orchestration workflow
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: best-practice
ms.date: 12/19/2023
ms.author: aahi
ms.custom: language-service-clu
---

# When to use conversational language understanding or orchestration workflow apps

When you create large applications, you should consider whether your use-case would be best served by a single conversational app (flat architecture), or multiple apps that are orchestrated.


## Orchestration overview 

Orchestration workflow is a feature that allows you to connect different projects from [LUIS](../../../LUIS/what-is-luis.md) [conversational language understanding](../overview.md), and [custom question answering](../../question-answering/overview.md) in one project. You can then use this project for predictions using one endpoint. The orchestration project makes a prediction on which child project should be called, automatically routes the request, and returns with its response.

The key point is that orchestration involves two steps:

1.	Predicting which child project to call. <!--The model that performs this classification can be trained either with a standard or an advanced recipe. (Please see footnotes on instructions for training with advanced recipe).-->
2.	Routing the utterance to the destination child app, and returning the child app's response.

### Advantages

* Clear decomposition and faster development:
    * If your overall schema has a substantial number of domains, the orchestration approach can help decompose your application into several child apps (each serving a specific domain). For example, an automotive conversational app might have a *navigation domain*, a *media domain*, and so on.
    * Developing each domain app in parallel is easier. People and teams with specific domain expertise  can work on individual apps collaboratively and in parallel.
    * Since each domain app is smaller, the development cycle becomes faster. Smaller sized domain apps take much less time to train than a single large app.
* More flexible [confidence score thresholds](/legal/cognitive-services/clu/clu-characteristics-and-limitations?context=/azure/ai-services/language-service/context/context#understand-confidence-scores):
    * Since there are separate child apps serving each domain, it's easy to set separate thresholds for different child apps.
* AI quality improvements where appropriate:
    * Some applications require that certain entities are domain restricted. Orchestration makes this easy to achieve. Once the orchestration project has predicted which child app should be called, the other child apps won't be called.

    For example, if your app contains a `Person.Name` prebuilt entity, consider the utterance *"How do I use a jack?"*, in the context of a vehicle question.  In this context, *jack* is an automotive tool, and shouldn’t be recognized as a person's name. Using orchestration, this utterance can be redirected to a child app created to answer such questions, which doesn’t have a `Person.Name` entity.

### Disadvantages

* Redundant entities in child apps:
    * If you need a particular prebuilt entity being returned in all utterances irrespective of the domain, for example `Quantity.Number` or `Geography.Location`, there is no way of adding an entity to the Orchestration app (it is an intent-only model). You would need to add it to all individual child apps.
* Efficiency:
    * Orchestration apps take two model inferences. One for predicting which child app to call, another for the prediction in the child app. Inference times will typically be slower than single apps with a flat architecture.
* Train/test split for orchestrator:
    * Training an orchestration app does not allow you to granularly split data between the testing and training sets. For example, you cannot train a 90-10 split for child app A, and then an 80-20 split for child app B. This may be a minor point, but worth keeping in mind.

## Flat architecture overview

Flat architecture is the other method of developing conversational apps. Instead of using an orchestration app to send utterances to one of multiple child apps, you develop a singular (or flat) app to handle utterances.  

### Advantages

* Simplicity:
    * For small sized apps or domains, the orchestrator approach can be overly complex.
    * Since all intents and entities are at the same app level, it might be easier to make changes to all of them together.
* It's easier to add entities that should always be returned:
    * If you want certain prebuilt or list entities to be returned for all utterances, you only need to add it alongside other entities in a single app. If you use orchestration, as mentioned above, you would need to add it to every child app.

### Disadvantages

* Unwieldy for large apps:
    * For large apps (say > 50 intents or entities) it can become difficult to keep track of evolving schemas and datasets. This is particularly evident in cases where the app has to serve several domains. For example an automotive conversational app might have a *navigation domain*, a *media domain*, and so on.
* Limited control over entity matches:
    * In a flat architecture, there is no way to restrict entities to be returned only in certain cases. You can accomplish this using orchestration by assigning those specific entities to particular child apps.

## Next steps
* [Orchestration workflow overview](../../orchestration-workflow/overview.md)
* [Conversational language understanding overview](../overview.md)