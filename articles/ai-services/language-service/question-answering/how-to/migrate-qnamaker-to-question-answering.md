---
title: Migrate from QnA Maker to Question Answering
description: Details on features, requirements, and examples for migrating from QnA Maker to Question Answering
ms.service: cognitive-services
ms.subservice: language-service
ms.author: jboback
author: jboback
ms.manager: nitinme
ms.topic: how-to
ms.date: 08/08/2022
ms.custom: language-service-question-answering
---
# Migrate from QnA Maker to Question Answering 

**Purpose of this document:** This article aims to provide information that can be used to successfully migrate applications that use QnA Maker to Question Answering. Using this article, we hope customers will gain clarity on the following: 

  - Comparison of features across QnA Maker and Question Answering
  - Pricing
  - Simplified Provisioning and Development Experience
  - Migration phases
  - Common migration scenarios
  - Migration steps

**Intended Audience:** Existing QnA Maker customers

> [!IMPORTANT]
> Question Answering, a feature of Azure AI Language was introduced in November 2021 with several new capabilities including enhanced relevance using a deep learning ranker, precise answers, and end-to-end region support. Each question answering project is equivalent to a knowledge base in QnA Maker. Resource level settings such as Role-based access control (RBAC) are not migrated to the new resource. These resource level settings would have to be reconfigured for the language resource post migration:
>
>  - Automatic RBAC to Language project (not resource)
>  - Automatic enabling of analytics.

You will also need to [re-enable analytics](analytics.md) for the language resource.

## Comparison of features

In addition to a new set of features, Question Answering provides many technical improvements to common features.

|Feature|QnA Maker|Question Answering|Details|
|-------|---------|------------------|-------|
|State of the art transformer-based models|➖|✔️|Turing based models that enable search of QnA at web scale.|
|Pre-built capability|➖|✔️|Using this capability one can leverage the power of question answering without having to ingest content and manage resources.|
|Precise answering|➖|✔️|Question Answering supports  precise answering with the help of SOTA models.|
|Smart URL Refresh|➖|✔️|Question Answering provides a means to refresh ingested content from public sources with a single click.|
|Q&A over knowledge base (hierarchical extraction)|✔️|✔️| |
|Active learning|✔️|✔️|Question Answering has an improved active learning model.|
|Alternate Questions|✔️|✔️|The improved models in question answering reduces the need to add alternate questions.|
|Synonyms|✔️|✔️| |
|Metadata|✔️|✔️| |
|Question Generation (private preview)|➖|✔️|This new feature will allow generation of questions over text.|
|Support for unstructured documents|➖|✔️|Users can now ingest unstructured documents as input sources and query the content for responses|
|.NET SDK|✔️|✔️| |
|API|✔️|✔️| |
|Unified Authoring experience|➖|✔️|A single authoring experience across all Azure AI Language|
|Multi region support|➖|✔️|

## Pricing

When you are looking at migrating to Question Answering, please consider the following:

|Component                      |QnA Maker|Question Answering|Details                                                                                                  |
|-------------------------------|---------|------------------|---------------------------------------------------------------------------------------------------------|
|QnA Maker Service cost         |✔️      |➖                |The fixed cost per resource per month. Only applicable for QnAMaker.                                     |
|Question Answering service cost|➖      |✔️                |The Question Answering cost according to the pay as you go model. Only applicable for Question Answering.|
|Azure Search cost              |✔️      |✔️                |Applicable for both QnA Maker and Question Answering.                                                    |
|App Service cost               |✔️      |➖                |Only applicable for QnA Maker. This is the biggest cost savings for users moving to Question Answering.  |

- Users may select a higher tier with higher capacity, which will impact overall price they pay. It doesn’t impact the price on language component of Custom Question Answering.

- “Text Records” in Question Answering features refers to the query submitted by the user to the runtime, and it is a concept common to all features within Language service. Sometimes a query may have more text records when the query length is higher. 

**Example price estimations**

|Usage |Number of resources in QnA Maker|Number of app services in QnA Maker (Tier)|Monthly inference calls in QnA Maker|Search Partitions x search replica (Tier)|Relative cost in Question Answering                        |
|------|--------------------------------|------------------------------------------|------------------------------------|--------------------------|--------------------------------------------------------------------------|
|High  |5                               |5(P1)                                     |8M                                  |9x3(S2)                                  |More expensive                     |
|High  |100                             |100(P1)                                   |6M                                  |9x3(S2)                                  |Less expensive                     |
|Medium|10                              |10(S1)                                    |800K                                |4x3(S1)                                  |Less expensive                     |
|Low   |4                               |4(B1)                                     |100K                                |3x3(S1)                                  |Less expensive                     |

 Summary : Customers should save cost across the most common configurations as seen in the relative cost column.

Here you can find the pricing details for [Question Answering](https://azure.microsoft.com/pricing/details/cognitive-services/language-service/) and [QnA Maker](https://azure.microsoft.com/pricing/details/cognitive-services/qna-maker/).

The [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) can provide even more detail.

## Simplified Provisioning and Development Experience

With the Language service, QnA Maker customers now benefit from a single service that provides Text Analytics, LUIS and Question Answering as features of the language resource. The Language service provides:

- One Language resource to access all above capabilities
- A single pane of authoring experience across capabilities
- A unified set of APIs across all the capabilities
- A cohesive, simpler, and powerful product

Learn how to get started in [Language Studio](../../language-studio.md)

## Migration Phases

If you or your organization have applications in development or production that use QnA Maker, you should update them to use Question Answering as soon as possible. See the following links for available APIs, SDKs, Bot SDKs and code samples.

Following are the broad migration phases to consider:

![A chart showing the phases of a successful migration](../media/migrate-qnamaker-to-question-answering/migration-phases.png)

Additional links which can help you are given below:
- [Authoring portal](https://language.cognitive.azure.com/home)
- [API](authoring.md)
- [SDK](/dotnet/api/microsoft.azure.cognitiveservices.knowledge.qnamaker)
- Bot SDK: For bots to use custom question answering, use the [Bot.Builder.AI.QnA](https://www.nuget.org/packages/Microsoft.Bot.Builder.AI.QnA/) SDK – We recommend customers to continue to use this for their Bot integrations. Here are some sample usages of the same in the bot’s code: [Sample 1](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/csharp_dotnetcore/48.customQABot-all-features) [Sample 2](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/csharp_dotnetcore/12.customQABot)

## Common migration scenarios

This topic compares two hypothetical scenarios when migrating from QnA Maker to Question Answering. These scenarios can help you to determine the right set of migration steps to execute for the given scenario.

> [!NOTE]
> An attempt has been made to ensure these scenarios are representative of real customer migrations, however, individual customer scenarios will of course differ. Also, this article doesn't include pricing details. Visit the [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/language-service/) page for more information.

> [!IMPORTANT] 
> Each question answering project is equivalent to a knowledge base in QnA Maker. Resource level settings such as Role-based access control (RBAC) are not migrated to the new resource. These resource level settings would have to be reconfigured for the language resource post migration. You will also need to [re-enable analytics](analytics.md) for the language resource.

### Migration scenario 1: No custom authoring portal

In the first migration scenario, the customer uses qnamaker.ai as the authoring portal and they want to migrate their QnA Maker knowledge bases to Custom Question Answering.

[Migrate your project from QnA Maker to Question Answering](migrate-qnamaker.md)

Once migrated to Question Answering:

- The resource level settings need to be reconfigured for the language resource
- Customer validations should start on the migrated knowledge bases on:
  - Size validation
  - Number of QnA pairs in all KBs to match pre and post migration
- Customers need to establish new thresholds for their knowledge bases in custom question answering as the Confidence score mapping is different when compared to QnA Maker.
  - Answers for sample questions in pre and post migration
  - Response time for Questions answered in v1 vs v2
  - Retaining of prompts
  - Customers can use the batch testing tool post migration to test the newly created project in custom question answering.

Old QnA Maker resources need to be manually deleted.

Here are some [detailed steps](migrate-qnamaker.md) on migration scenario 1.

### Migration scenario 2

In this migration scenario, the customer may have created their own authoring frontend leveraging the QnA Maker authoring APIs or QnA Maker SDKs.

They should perform these steps required for migration of SDKs:

This [SDK Migration Guide](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.Language.QuestionAnswering_1.1.0-beta.1/sdk/cognitivelanguage/Azure.AI.Language.QuestionAnswering/MigrationGuide.md) is intended to assist in the migration to the new Question Answering client library, [Azure.AI.Language.QuestionAnswering](https://www.nuget.org/packages/Azure.AI.Language.QuestionAnswering), from the old one, [Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker). It will focus on side-by-side comparisons for similar operations between the two packages.

They should perform the steps required for migration of Knowledge bases to the new Project within Language resource.

Once migrated to Question Answering:
- The resource level settings need to be reconfigured for the language resource
- Customer validations should start on the migrated knowledge bases on
  - Size validation
  - Number of QnA pairs in all KBs to match pre and post migration
  - Confidence score mapping
  - Answers for sample questions in pre and post migration
  - Response time for Questions answered in v1 vs v2
  - Retaining of prompts
   - Batch testing pre and post migration
- Old QnA Maker resources need to be manually deleted.

Additionally, for customers who have to migrate and upgrade Bot, upgrade bot code is published as NuGet package.

Here you can find some code samples: [Sample 1](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/csharp_dotnetcore/48.customQABot-all-features) [Sample 2](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/csharp_dotnetcore/12.customQABot)

Here are [detailed steps on migration scenario 2](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.Language.QuestionAnswering_1.1.0-beta.1/sdk/cognitivelanguage/Azure.AI.Language.QuestionAnswering/MigrationGuide.md)

Learn more about the [pre-built API](../../../QnAMaker/How-To/using-prebuilt-api.md)

Learn more about the [Question Answering Get Answers REST API](/rest/api/cognitiveservices/questionanswering/question-answering/get-answers)

## Migration steps

Please note that some of these steps are needed depending on the customers existing architecture. Kindly look at migration phases given above for getting more clarity on which steps are needed by you for migration.

![A chart showing the steps of a successful migration](../media/migrate-qnamaker-to-question-answering/migration-steps.png)
