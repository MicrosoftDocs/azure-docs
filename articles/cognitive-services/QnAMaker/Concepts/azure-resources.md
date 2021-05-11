---
title: Azure resources - QnA Maker
description: QnA Maker uses several Azure sources, each with a different purpose. Understanding how they are used individually allows you to plan for and select the correct pricing tier or know when to change your pricing tier. Understanding how they are used in combination allows you to find and fix problems when they occur.
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: conceptual
ms.date: 11/09/2020
---

# Azure resources for QnA Maker

QnA Maker uses several Azure sources, each with a different purpose. Understanding how they are used individually allows you to plan for and select the correct pricing tier or know when to change your pricing tier. Understanding how they are used _in combination_ allows you to find and fix problems when they occur.

## Resource planning

# [QnA Maker GA (stable release)](#tab/v1)

When you first develop a QnA Maker knowledge base, in the prototype phase, it is common to have a single QnA Maker resource for both testing and production.

When you move into the development phase of the project, you should consider:

* How many languages your knowledge base system will hold?
* How many regions you need your knowledge base to be available in?
* How many documents in each domain your system will hold?

Plan to have a single QnA Maker resource hold all knowledge bases that have the same language, the same region and the same subject domain combination.

# [QnA Maker managed (preview release)](#tab/v2)

When you first develop a QnA Maker managed knowledge base, in the prototype phase, it is common to have a single QnA Maker managed resource for both testing and production.

When you move into the development phase of the project, you should consider:

* How many languages your knowledge base system will hold?
* How many regions you need your knowledge base to be available in?
* How many documents in each domain your system will hold?

---

## Pricing tier considerations

# [QnA Maker GA (stable release)](#tab/v1)

Typically there are three parameters you need to consider:

* **The throughput you need from the service**:
    * Select the appropriate [App Plan](https://azure.microsoft.com/pricing/details/app-service/plans/) for your App service based on your needs. You can [scale up](../../../app-service/manage-scale-up.md) or down the App.
    * This should also influence your Azure **Cognitive Search** SKU selection, see more details [here](../../../search/search-sku-tier.md). Additionally, you may need to adjust Cognitive Search [capacity](../../../search/search-capacity-planning.md) with replicas.

* **Size and the number of knowledge bases**: Choose the appropriate [Azure search SKU](https://azure.microsoft.com/pricing/details/search/) for your scenario. Typically, you decide number of knowledge bases you need based on number of different subject domains. Once subject domain (for a single language) should be in one knowledge base.

    You can publish N-1 knowledge bases in a particular tier, where N is the maximum indexes allowed in the tier. Also check the maximum size and the number of documents allowed per tier.

    For example, if your tier has 15 allowed indexes, you can publish 14 knowledge bases (1 index per published knowledge base). The fifteenth index is used for all the knowledge bases for authoring and testing.

* **Number of documents as sources**: The free SKU of the QnA Maker management service limits the number of documents you can manage via the portal and the APIs to 3 (of 1 MB size each). The standard SKU has no limits to the number of documents you can manage. See more details [here](https://aka.ms/qnamaker-pricing).

The following table gives you some high-level guidelines.

|                            | QnA Maker Management | App Service | Azure Cognitive Search | Limitations                      |
| -------------------------- | -------------------- | ----------- | ------------ | -------------------------------- |
| **Experimentation**        | Free SKU             | Free Tier   | Free Tier    | Publish Up to 2 KBs, 50 MB size  |
| **Dev/Test Environment**   | Standard SKU         | Shared      | Basic        | Publish Up to 14 KBs, 2 GB size    |
| **Production Environment** | Standard SKU         | Basic       | Standard     | Publish Up to 49 KBs, 25 GB size |

# [QnA Maker managed (preview release)](#tab/v2)

Typically there are three parameters you need to consider:

* **The throughput you need from the service**:
    * QnA Maker managed (Preview) is a free service, and the throughput is currently capped at 10 TPS for both management APIs and prediction APIs.
    * This should also influence your Azure **Cognitive Search** SKU selection, see more details [here](../../../search/search-sku-tier.md). Additionally, you may need to adjust Cognitive Search [capacity](../../../search/search-capacity-planning.md) with replicas.

* **Size and the number of knowledge bases**: Choose the appropriate [Azure search SKU](https://azure.microsoft.com/pricing/details/search/) for your scenario. Typically, you decide number of knowledge bases you need based on number of different subject domains. Once subject domain (for a single language) should be in one knowledge base.

    With QnA Maker managed (Preview) you have a choice to setup your QnA Maker service for KBs in a single language or multiple languages. You can make this selection when you create the first knowledge base in your QnA Maker managed (Preview) service.

    ![QnA Maker managed (Preview) multi-lingual knowledge base selection](../media/concept-plan-your-knowledge-base/qnamaker-v2-select-multilanguage-knowledge-base.png)

    You can publish N-1 knowledge bases of a single language or N/2 knowledge bases of different languages in a particular tier, where N is the maximum indexes allowed in the tier. Also check the maximum size and the number of documents allowed per tier.

    For example, if your tier has 15 allowed indexes, you can publish 14 knowledge bases of the same language (1 index per published knowledge base). The fifteenth index is used for all the knowledge bases for authoring and testing. If you choose to have knowledge bases in different languages, then you can only publish 7 knowledge bases.

* **Number of documents as sources**: QnA Maker managed (Preview) is a free service, and there are no limits to the number of documents you can add as sources. See more details [here](https://aka.ms/qnamaker-pricing).

The following table gives you some high-level guidelines.

|                            |Azure Cognitive Search | Limitations                      |
| -------------------------- |------------ | -------------------------------- |
| **Experimentation**        |Free Tier    | Publish Up to 2 KBs, 50 MB size  |
| **Dev/Test Environment**   |Basic        | Publish Up to 14 KBs, 2 GB size    |
| **Production Environment** |Standard     | Publish Up to 49 KBs, 25 GB size |

---

## Recommended Settings

# [QnA Maker GA (stable release)](#tab/v1)

|Target QPS | App Service | Azure Cognitive Search |
| -------------------- | ----------- | ------------ |
| 3             | S1, 1 Replica   | S1, 1 Replica    |
| 50         | S3, 10 Replicas       | S1, 12 Replicas         |
| 80         | S3, 10 Replicas      |  S3, 12 Replicas  |
| 100         | P3V2, 10 Replicas  | S3, 12 Replicas, 3 Partitions   |
| 200 to 250         | P3V2, 20 Replicas | S3, 12 Replicas, 3 Partitions    |

# [QnA Maker managed (preview release)](#tab/v2)

QnA Maker managed is a free service, and the throughput is currently capped at 10 transactions per second for both management APIs and prediction APIs. To target 10 transactions per second for your service we recommend the S1 (1 instance) SKU of Azure Cognitive Search.

---

## When to change a pricing tier

# [QnA Maker GA (stable release)](#tab/v1)

|Upgrade|Reason|
|--|--|
|[Upgrade](../How-to/set-up-qnamaker-service-azure.md#upgrade-qna-maker-sku) QnA Maker management SKU|You want to have more QnA pairs or document sources in your knowledge base.|
|[Upgrade](../How-to/set-up-qnamaker-service-azure.md#upgrade-app-service) App Service SKU and check Cognitive Search tier and [create Cognitive Search replicas](../../../search/search-capacity-planning.md)|Your knowledge base needs to serve more requests from your client app, such as a chat bot.|
|[Upgrade](../How-to/set-up-qnamaker-service-azure.md#upgrade-the-azure-cognitive-search-service) Azure Cognitive Search service|You plan to have many knowledge bases.|

Get the latest runtime updates by [updating your App Service in the Azure portal](../how-to/configure-QnA-Maker-resources.md#get-the-latest-runtime-updates).

# [QnA Maker managed (preview release)](#tab/v2)

[Upgrade](../How-to/set-up-qnamaker-service-azure.md#upgrade-the-azure-cognitive-search-service) Azure Cognitive Search service when you plan to have many knowledge bases.

---

## Keys in QnA Maker

# [QnA Maker GA (stable release)](#tab/v1)

Your QnA Maker service deals with two kinds of keys: **authoring keys** and **query endpoint keys** used with the runtime hosted in the App service.

Use these keys when making requests to the service through APIs.

![Key management](../media/authoring-key.png)

|Name|Location|Purpose|
|--|--|--|
|Authoring/Subscription key|[Azure portal](https://azure.microsoft.com/free/cognitive-services/)|These keys are used to access the [QnA Maker management service APIs](/rest/api/cognitiveservices/qnamaker4.0/knowledgebase). These APIs let you edit the questions and answers in your knowledge base, and publish your knowledge base. These keys are created when you create a new QnA Maker service.<br><br>Find these keys on the **Cognitive Services** resource on the **Keys and Endpoint** page.|
|Query endpoint key|[QnA Maker portal](https://www.qnamaker.ai)|These keys are used to query the published knowledge base endpoint to get a response for a user question. You typically use this query endpoint in your chat bot or in the client application code that connects to the QnA Maker service. These keys are created when you publish your QnA Maker knowledge base.<br><br>Find these keys in the **Service settings** page. Find this page from the user's menu in the upper right of the page on the drop-down menu.|

### Find authoring keys in the Azure portal

You can view and reset your authoring keys from the Azure portal, where you created the QnA Maker resource.

1. Go to the QnA Maker resource in the Azure portal and select the resource that has the _Cognitive Services_ type:

    ![QnA Maker resource list](../media/qnamaker-how-to-key-management/qnamaker-resource-list.png)

2. Go to **Keys and Endpoint**:

    ![QnA Maker managed (Preview) Subscription key](../media/qnamaker-how-to-key-management/subscription-key-v2.png)

### Find query endpoint keys in the QnA Maker portal

The endpoint is in the same region as the resource because the endpoint keys are used to make a call to the knowledge base.

Endpoint keys can be managed from the [QnA Maker portal](https://qnamaker.ai).

1. Sign in to the [QnA Maker portal](https://qnamaker.ai), go to your profile, and then select **Service settings**:

    ![Endpoint key](../media/qnamaker-how-to-key-management/Endpoint-keys.png)

2. View or reset your keys:

    > [!div class="mx-imgBorder"]
    > ![Endpoint key manager](../media/qnamaker-how-to-key-management/Endpoint-keys1.png)

    >[!NOTE]
    >Refresh your keys if you think they've been compromised. This may require corresponding changes to your client application or bot code.

# [QnA Maker managed (preview release)](#tab/v2)

Your QnA Maker managed (Preview) service deals with two kinds of keys: **authoring keys** and **Azure Cognitive Search keys** used to access the service in the customer’s subscription.

Use these keys when making requests to the service through APIs.

![Key management managed preview](../media/qnamaker-how-to-key-management/qnamaker-v2-key-management.png)

|Name|Location|Purpose|
|--|--|--|
|Authoring/Subscription key|[Azure portal](https://azure.microsoft.com/free/cognitive-services/)|These keys are used to access the [QnA Maker management service APIs](/rest/api/cognitiveservices/qnamaker4.0/knowledgebase). These APIs let you edit the questions and answers in your knowledge base, and publish your knowledge base. These keys are created when you create a new QnA Maker service.<br><br>Find these keys on the **Cognitive Services** resource on the **Keys and Endpoint** page.|
|Azure Cognitive Search Admin Key|[Azure portal](../../../search/search-security-api-keys.md)|These keys are used to communicate with the Azure cognitive search service deployed in the user’s Azure subscription. When you associate an Azure cognitive search with the QnA Maker managed (Preview) service, the admin key is automatically passed on to the QnA Maker service. <br><br>You can find these keys on the **Azure Cognitive Search** resource on the **Keys** page.|

### Find authoring keys in the Azure portal

You can view and reset your authoring keys from the Azure portal, where you created the QnA Maker managed (Preview) resource.

1. Go to the QnA Maker managed (Preview) resource in the Azure portal and select the resource that has the *Cognitive Services* type:

    ![QnA Maker managed (Preview) resource list](../media/qnamaker-how-to-key-management/qnamaker-v2-resource-list.png)

2. Go to **Keys and Endpoint**:

    ![QnA Maker managed (Preview) Subscription key](../media/qnamaker-how-to-key-management/subscription-key-v2.png)

### Update the resources

Learn how to upgrade the resources used by your knowledge base. QnA Maker managed (Preview) is **free** while in preview. 

---

## Management service region

# [QnA Maker GA (stable release)](#tab/v1)

The management service of QnA Maker is used only for the QnA Maker portal and for initial data processing. This service is available only in the **West US** region. No customer data is stored in this West US service.

# [QnA Maker managed (preview release)](#tab/v2)

In QnA Maker managed (Preview) both the management and the prediction services are co-located in the same region. Currently QnA Maker managed (Preview) is available in **South Central US, North Europe and Australia East**.

---

## Resource naming considerations

# [QnA Maker GA (stable release)](#tab/v1)

The resource name for the QnA Maker resource, such as `qna-westus-f0-b`, is also used to name the other resources.

The Azure portal create window allows you to create a QnA Maker resource and select the pricing tiers for the other resources.

> [!div class="mx-imgBorder"]
> ![Screenshot of Azure portal for QnA Maker resource creation](../media/concept-azure-resource/create-blade.png)

After the resources are created, they have the same name, except for the optional Application Insights resource, which postpends characters to the name.

> [!div class="mx-imgBorder"]
> ![Screenshot of Azure portal resource listing](../media/concept-azure-resource/all-azure-resources-created-qnamaker.png)

> [!TIP]
> Create a new resource group when you create a QnA Maker resource. That allows you to see all resources associated with the QnA Maker resource when searching by resource group.

> [!TIP]
> Use a naming convention to indicate pricing tiers within the name of the resource or the resource group. When you receive errors from creating a new knowledge base, or adding new documents, the Cognitive Search pricing tier limit is a common issue.

# [QnA Maker managed (preview release)](#tab/v2)

The resource name for the QnA Maker managed (Preview) resource, such as `qna-westus-f0-b`, is also used to name the other resources.

The Azure portal create window allows you to create a QnA Maker managed (Preview) resource and select the pricing tiers for the other resources.

> [!div class="mx-imgBorder"]
> ![Screenshot of Azure portal for QnA Maker managed (Preview) resource creation](../media/qnamaker-how-to-setup-service/enter-qnamaker-v2-info.png)
After the resources are created, they have the same name.

> [!div class="mx-imgBorder"]
> ![Screenshot of Azure portal resource listing QnA Maker managed (Preview)](../media/qnamaker-how-to-setup-service/resources-created-v2.png)

> [!TIP]
> Create a new resource group when you create a QnA Maker resource. That allows you to see all resources associated with the QnA Maker managed (Preview) resource when searching by resource group.

> [!TIP]
> Use a naming convention to indicate pricing tiers within the name of the resource or the resource group. When you receive errors from creating a new knowledge base, or adding new documents, the Cognitive Search pricing tier limit is a common issue.

---

## Resource purposes

# [QnA Maker GA (stable release)](#tab/v1)

Each Azure resource created with QnA Maker has a specific purpose:

* QnA Maker resource
* Cognitive Search resource
* App Service
* App Plan Service
* Application Insights Service

### QnA Maker resource

The QnA Maker resource provides access to the authoring and publishing APIs as well as the natural language processing (NLP) based second ranking layer (ranker #2) of the QnA pairs at runtime.

The second ranking applies intelligent filters that can include metadata and follow-up prompts.

#### QnA Maker resource configuration settings

When you create a new knowledge base in the [QnA Maker portal](https://qnamaker.ai), the **Language** setting is the only setting that is applied at the resource level. You select the language when you create the first knowledge base for the resource.

### Cognitive Search resource

The [Cognitive Search](../../../search/index.yml) resource is used to:

* Store the QnA pairs
* Provide the initial ranking (ranker #1) of the QnA pairs at runtime

#### Index usage

The resource keeps one index to act as the test index and the remaining indexes correlate to one published knowledge base each.

A resource priced to hold 15 indexes, will hold 14 published knowledge bases, and one index is used for testing all the knowledge bases. This test index is partitioned by knowledge base so that a query using the interactive test pane will use the test index but only return results from the specific partition associated with the specific knowledge base.

#### Language usage

The first knowledge base created in the QnA Maker resource is used to determine the _single_ language set for the Cognitive Search resource and all its indexes. You can only have _one language set_ for a QnA Maker service.

#### Using a single Cognitive Search service

If you create a QnA service and its dependencies (such as Search) through the portal, a Search service is created for you and linked to the QnA Maker service. After these resources are created, you can update the App Service setting to use a previously existing Search service and remove the one you just created.

Learn [how to configure](../How-To/configure-QnA-Maker-resources.md#configure-qna-maker-to-use-different-cognitive-search-resource) QnA Maker to use a different Cognitive Service resource than the one created as part of the QnA Maker resource creation process.

### App service and App service plan

The [App service](../../../app-service/index.yml) is used by your client application to access the published knowledge bases via the runtime endpoint.

To query the published knowledge base, all published knowledge bases use the same URL endpoint,  but specify the **knowledge base ID** within the route.

`{RuntimeEndpoint}/qnamaker/knowledgebases/{kbId}/generateAnswer`

### Application Insights

[Application Insights](../../../azure-monitor/app/app-insights-overview.md) is used to collect chat logs and telemetry. Review the common [Kusto queries](../how-to/get-analytics-knowledge-base.md) for information about your service.

### Share services with QnA Maker

QnA Maker creates several Azure resources. To reduce management and benefit from cost sharing, use the following table to understand what you can and can't share:

|Service|Share|Reason|
|--|--|--|
|Cognitive Services|X|Not possible by design|
|App Service plan|✔|Fixed disk space allocated for an App Service plan. If other apps that sharing the same App Service plan use significant disk space, the QnAMaker App Service instance will encounter problems.|
|App Service|X|Not possible by design|
|Application Insights|✔|Can be shared|
|Search service|✔|1. `testkb` is a reserved name for the QnAMaker service; it can't be used by others.<br>2. Synonym map by the name `synonym-map` is reserved for the QnAMaker service.<br>3. The number of published knowledge bases is limited by Search service tier. If there are free indexes available, other services can use them.|

# [QnA Maker managed (preview release)](#tab/v2)

Each Azure resource created with QnA Maker managed (Preview) has a specific purpose:

* QnA Maker resource
* Cognitive Search resource

### QnA Maker resource

The QnA Maker managed (Preview) resource provides access to the authoring and publishing APIs, hosts the ranking runtime as well as provides telemetry.

### Azure Cognitive Search resource

The [Cognitive Search](../../../search/index.yml) resource is used to:

* Store the QnA pairs
* Provide the initial ranking (ranker #1) of the QnA pairs at runtime

#### Index usage

You can publish N-1 knowledge bases of a single language or N/2 knowledge bases of different languages in a particular tier, where N is the maximum indexes allowed in the Azure Cognitive Search tier. Also check the maximum size and the number of documents allowed per tier.

For example, if your tier has 15 allowed indexes, you can publish 14 knowledge bases of the same language (1 index per published knowledge base). The fifteenth index is used for all the knowledge bases for authoring and testing. If you choose to have knowledge bases in different languages, then you can only publish 7 knowledge bases.

#### Language usage

With QnA Maker managed (Preview) you have a choice to setup your QnA Maker service for knowledge bases in a single language or multiple languages. You make this choice during the creation of the first knowledge base in your QnA Maker service. See [here](#pricing-tier-considerations) how to enable language setting per knowledge base.

---

## Next steps

* Learn about the QnA Maker [knowledge base](../How-To/manage-knowledge-bases.md)
* Understand a [knowledge base life cycle](development-lifecycle-knowledge-base.md)
* Review service and knowledge base [limits](../limits.md)
