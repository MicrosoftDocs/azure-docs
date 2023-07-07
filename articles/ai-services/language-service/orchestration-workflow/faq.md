---
title: Frequently Asked Questions for orchestration projects
titleSuffix: Azure AI services
description: Use this article to quickly get the answers to FAQ about orchestration projects
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: faq
ms.date: 06/21/2022
ms.author: aahi
ms.custom: ignite-fall-2021, mode-other
---

# Frequently asked questions for orchestration workflows

Use this article to quickly get the answers to common questions about orchestration workflows

## How do I create a project?

See the [quickstart](./quickstart.md) to quickly create your first project, or the [how-to article](./how-to/create-project.md) for more details. 

## How do I connect other service applications in orchestration workflow projects?

See [How to create projects and build schemas](./how-to/create-project.md) for information on connecting another project as an intent.

## Which LUIS applications can I connect to in orchestration workflow projects?

LUIS applications that use the Language resource as their authoring resource will be available for connection. You can only connect to LUIS applications that are owned by the same resource. This option will only be available for resources in West Europe, as it's the only common available region between LUIS and CLU.

## Which question answering project can I connect to in orchestration workflow projects?

Question answering projects that use the Language resource will be available for connection. You can only connect to question answering projects that are in the same Language resource.

## Training is taking a long time, is this expected?

For orchestration projects, long training times are expected. Based on the number of examples you have your training times may vary from 5 minutes to 1 hour or more. 

## Can I add entities to orchestration workflow projects?

No. Orchestration projects are only enabled for intents that can be connected to other projects for routing. 

<!--
## Which languages are supported in this feature?

See the [language support](./language-support.md) article.
-->
## How do I get more accurate results for my project?

See [evaluation metrics](./concepts/evaluation-metrics.md) for information on how models are evaluated, and metrics you can use to improve accuracy.
<!--
## How many intents, and utterances can I add to a project?

See the [service limits](./service-limits.md) article. 
-->
## Can I label the same word as 2 different entities?

Unlike LUIS, you cannot label the same text as 2 different entities. Learned components across different entities are mutually exclusive, and only one learned span is predicted for each set of characters.

## Is there any SDK support?

Yes, only for predictions, and [samples are available](https://aka.ms/cluSampleCode). There is currently no authoring support for the SDK.

## Are there APIs for this feature?

Yes, all the APIs are available.
* [Authoring APIs](https://aka.ms/clu-authoring-apis)
* [Prediction API](/rest/api/language/2023-04-01/conversation-analysis-runtime/analyze-conversation)

## Next steps

[Orchestration workflow overview](overview.md)
