---
title: Azure resources - question answering
description: Question answering uses several Azure sources, each with a different purpose. Understanding how they are used individually allows you to plan for and select the correct pricing tier or know when to change your pricing tier. Understanding how they are used in combination allows you to find and fix problems when they occur.
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: conceptual
ms.date: 10/10/2021
---

# Azure resources for question answering

Question answering uses several Azure sources, each with a different purpose. Understanding how they are used individually allows you to plan for and select the correct pricing tier or know when to change your pricing tier. Understanding how they are used _in combination_ allows you to find and fix problems when they occur.

## Resource planning

When you first develop a knowledge base, in the prototype phase, it is common to have a single resource for both testing and production.

When you move into the development phase of the project, you should consider:

* How many languages your knowledge base system will hold?
* How many regions you need your knowledge base to be available in?
* How many documents in each domain your system will hold?

## Pricing tier considerations

Typically there are three parameters you need to consider:

* **The throughput you need**:
    * Question answering is a free feature, and the throughput is currently capped at 10 transactions per second for both management APIs and prediction APIs.
    * This should also influence your Azure **Cognitive Search** SKU selection, see more details [here](../../../search/search-sku-tier.md). Additionally, you may need to adjust Cognitive Search [capacity](../../../search/search-capacity-planning.md) with replicas.

* **Size and the number of knowledge bases**: Choose the appropriate [Azure search SKU](https://azure.microsoft.com/pricing/details/search/) for your scenario. Typically, you decide number of knowledge bases you need based on number of different subject domains. Once subject domain (for a single language) should be in one knowledge base.

    With custom question answering, you have a choice to set up your language resource in a single language or multiple languages. You can make this selection when you create the first project (also known as knowledge base) in the Language Studio.

> [!IMPORTANT]
> You can publish N-1 knowledge bases of a single language or N/2 knowledge bases of different languages in a particular tier, where N is the maximum indexes allowed in the tier. Also check the maximum size and the number of documents allowed per tier.

For example, if your tier has 15 allowed indexes, you can publish 14 knowledge bases of the same language (one index per published knowledge base). The 15th index is used for all the knowledge bases for authoring and testing. If you choose to have knowledge bases in different languages, then you can only publish seven knowledge bases.

* **Number of documents as sources**: question answering is a free feature, and there are no limits to the number of documents you can add as sources. See more details [here](https://aka.ms/qnamaker-pricing).

The following table gives you some high-level guidelines.

|                            |Azure Cognitive Search | Limitations                      |
| -------------------------- |------------ | -------------------------------- |
| **Experimentation**        |Free Tier    | Publish Up to 2 KBs, 50 MB size  |
| **Dev/Test Environment**   |Basic        | Publish Up to 14 KBs, 2 GB size    |
| **Production Environment** |Standard     | Publish Up to 49 KBs, 25 GB size |

## Recommended Settings

Custom question answering is a free feature, and the throughput is currently capped at 10 transactions per second for both management APIs and prediction APIs. To target 10 transactions per second for your service, we recommend the S1 (one instance) SKU of Azure Cognitive Search.

## Keys in question answering

Your custom question answering feature deals with two kinds of keys: **authoring keys** and **Azure Cognitive Search keys** used to access the service in the customer’s subscription.

Use these keys when making requests to the service through APIs.

> [!div class="mx-imgBorder"]
> ![Key management managed preview](../media/qnamaker-how-to-key-management/custom-question-answering-key-management.png)

|Name|Location|Purpose|
|--|--|--|
|Authoring/Subscription key|[Azure portal](https://azure.microsoft.com/free/cognitive-services/)|These keys are used to access the [QnA Maker management service APIs](/rest/api/cognitiveservices/qnamaker4.0/knowledgebase). These APIs let you edit the questions and answers in your knowledge base, and publish your knowledge base. These keys are created when you create a new service.<br><br>Find these keys on the **Cognitive Services** resource on the **Keys and Endpoint** page.|
|Azure Cognitive Search Admin Key|[Azure portal](../../../search/search-security-api-keys.md)|These keys are used to communicate with the Azure cognitive search service deployed in the user’s Azure subscription. When you associate an Azure cognitive search with the Custom question answering (Preview) feature, the admin key is automatically passed on to the QnA Maker service. <br><br>You can find these keys on the **Azure Cognitive Search** resource on the **Keys** page.|

### Find authoring keys in the Azure portal

You can view and reset your authoring keys from the Azure portal, where you added the Custom question answering (Preview) feature in Text Analytics resource.

1. Go to the Text Analytics resource in the Azure portal and select the resource that has the *Cognitive Services* type:

> [!div class="mx-imgBorder"]
> ![Custom qna (Preview) resource list](../media/qnamaker-how-to-setup-service/resources-created-question-answering.png)

2. Go to **Keys and Endpoint**:

> [!div class="mx-imgBorder"]
> ![Custom qna (Preview) Subscription key](../media/qnamaker-how-to-key-management/custom-qna-keys-and-endpoint.png)

### Management service region

In custom question answering, both the management and the prediction services are colocated in the same region.

## Resource purposes

Each Azure resource created with Custom question answering (Preview) feature has a specific purpose:

* Text Analytics resource (Also referred to as a language resource within the context of the Language Studio.)
* Cognitive Search resource

### Text Analytics resource

The Text Analytics resource with Custom question answering (Preview) feature provides access to the authoring and publishing APIs, hosts the ranking runtime as well as provides telemetry.

### Azure Cognitive Search resource

The [Cognitive Search](../../../search/index.yml) resource is used to:

* Store the question and answer pairs
* Provide the initial ranking (ranker #1) of the question and answer pairs at runtime

#### Index usage

You can publish N-1 knowledge bases of a single language or N/2 knowledge bases of different languages in a particular tier, where N is the maximum indexes allowed in the Azure Cognitive Search tier. Also check the maximum size and the number of documents allowed per tier.

For example, if your tier has 15 allowed indexes, you can publish 14 knowledge bases of the same language (one index per published knowledge base). The 15th index is used for all the knowledge bases for authoring and testing. If you choose to have knowledge bases in different languages, then you can only publish seven knowledge bases.

#### Language usage

With custom question answering, you have a choice to set up your service for knowledge bases in a single language or multiple languages. You make this choice during the creation of the first knowledge base in your Text Analytics service. See [here](#pricing-tier-considerations) how to enable language setting per knowledge base.

## Next steps

* Learn about the QnA Maker [knowledge base](../How-To/manage-knowledge-bases.md)
* Understand a [knowledge base life cycle](development-lifecycle-knowledge-base.md)
* Review service and knowledge base [limits](../limits.md)
