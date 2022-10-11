---
title: Conversational Language Understanding Project Versioning
titleSuffix: Azure Cognitive Services
description: Learn how versioning works in conversational language understanding
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 10/10/2022
ms.author: aahi
ms.custom: language-service-clu
ms.reviewer: haelhamm
---

# Project versioning

> [!NOTE]
> This article applies to the following custom features in Azure Cognitive Service for Language:
> * Conversational language understanding
> * Custom text classification
> * Custom NER
> * Orchestration workflow

Building your project typically happens in increments. You may add, remove, or edit intents, entities, labels and data at each stage. Every time you train, a snapshot of your current state is taken to produce a **model**. That model now saves that snapshot to be loaded back at any time. Every model now acts as its own **version** of the project.

For example, if your project has 10 intents and/or entities, with 50 training documents or utterances, it can be trained to create a model named **v1**. Afterwards, you might make changes to the project to alter the numbers of training data. The project can be trained again to create a new model named **v2**. If you don't like the changes you've made in **v2** and would like to continue from where you left off in model **v1**, then you would just need to **load** the model data from **v1** back into the project. Loading a model's data is available both through the Language Studio and via the APIs. Once complete, the project will have the original amount and types of training data.

If the project data is not saved in a trained model, it can be lost. For example, if you loaded model **v1**, your project now has the data that was used to train it. If you then made changes such as adding 5 new intents and entities, and did not train and simply loaded model **v2**, you would lose those 5 new intents and entities added as they weren't saved to any specific snapshot.

If you overwrite a model with a new snapshot of data, you won't be able to revert back to any previous state of that model.

You always have the option to locally export the data for every model. 

## Data location

The data for your model versions will be saved in different locations, depending on the custom feature you're using. 

# [Custom NER](#tab/custom-ner)

In custom named entity recognition, the data being saved to the snapshot is the labels file.

# [Custom text classification](#tab/custom-text-classification)

In custom text classification, the data being saved to the snapshot is the labels file.

# [Orchestration workflow](#tab/orchestration-workflow)

In orchestration workflow, you do not version or store the assets of the connected intents as part of the orchestration snapshot - those are managed separately. The only snapshot being taken is of the connection itself and the intents and utterances that do not have connections, including all the test data.

---


## Next steps
* Learn how to [load or export model data](../how-to/view-model-evaluation.md#load-or-export-model-data).
