---
title: Create a Language resource
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-services
ms.topic: include
ms.date: 08/29/2022
ms.author: pafarley
---

#### [Language service](#tab/language-service)

1. Select the following link to create a Language resource:
   - [Language service](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics)
1. On the **Select additional features** page, choose whether you'd like to include the customization features that work with other services.
1. On the **Create** page, provide the following information:

   [!INCLUDE [Create Azure resource for subscription](./cognitive-resource-project-details.md)]
1. Mark your acknowledgment of the Responsible AI terms and select **Review + create**.

#### [Language Understanding (LUIS)](#tab/luis)

1. Select the following link to create a LUIS resource:
   - [Language Understanding (LUIS)](https://portal.azure.com/#create/Microsoft.CognitiveServicesLUISAllInOne)
1. On the **Create** page, provide the following information:

   |Project details| Description   |
   |--|--|
   | **Create options** | LUIS uses two separate resources together. The **Authoring** resource lets you train models, and the **Prediction** resource lets you publish and query models. Select **Both** if you're starting the project from scratch. |
   | **Subscription** | Select one of your available Azure subscriptions. |
   | **Resource group** | The Azure resource group that will contain your Azure AI services resource. You can create a new group or add it to a pre-existing group. |
   | **Name** | A descriptive name for your Azure AI services resource. For example, *MyCognitiveServicesResource*. |
   | **Authoring Resource Region** | The location of your Authoring resource. Different locations may introduce latency, but have no impact on the runtime availability of your resource. |
   | **Authoring Pricing tier** | The cost of your Azure AI services account depends on the options you choose and your usage. For more information, see the API [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/#pricing).|
   | **Prediction Resource Region** | The location of your Prediction resource. Different locations may introduce latency, but have no impact on the runtime availability of your resource. |
   | **Prediction Pricing tier** | The cost of your Azure AI services account depends on the options you choose and your usage. For more information, see the API [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/#pricing).|
1. Select **Review + create**.

#### [Translator](#tab/translator)

1. Select the following link to create a Translator resource:
   - [Translator](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation)
1. On the **Create** page, provide the following information:

    [!INCLUDE [Create Azure resource for subscription](./cognitive-resource-project-details.md)]

1. Select **Review + create**.

#### [QnA Maker](#tab/qna)

1. Select the following link to create a QnA Maker resource:
   - [QnA Maker](https://portal.azure.com/#create/Microsoft.CognitiveServicesQnAMaker)
1. On the **Create** page, provide the following information:

    |Project details| Description   |
    |--|--|
    | **Subscription** | Select one of your available Azure subscriptions. |
    | **Resource group** | The Azure resource group that will contain your Azure AI services resource. You can create a new group or add it to a pre-existing group. |
    | **Name** | A descriptive name for your Azure AI services resource. For example, *MyCognitiveServicesResource*. |
    | **Pricing tier** | The cost of your Azure AI services account depends on the options you choose and your usage. For more information, see the API [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/translator/#pricing).|
    | **Azure Search location** | The location of the Azure Search instance that will go with your QnA Maker resource. Different locations may introduce latency, but have no impact on the runtime availability of your resource. |
    | **Azure Search pricing tier** | The cost of your Azure AI services account depends on the options you choose and your usage. For more information, see the Cognitive Search [pricing details](https://azure.microsoft.com/pricing/details/search/#pricing).|
    | **App name** | Enter a name for the App Service app that will handle your QnA Maker queries.|
    | **Website location** | The location of the App Service instance that will go with your QnA Maker resource. Different locations may introduce latency, but have no impact on the runtime availability of your resource. |
    | **App insights** | Choose whether you'd like to use an Application Insights resource in tandem with your QnA Maker resource. |
    | **App insights location** | Different locations may introduce latency, but have no impact on the runtime availability of your resource.|
1. Select **Review + create**.

---
