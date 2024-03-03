---
title: Create a Vision resource
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-services
ms.topic: include
ms.date: 02/13/2023
ms.author: pafarley
---

#### [Azure AI Vision](#tab/computer-vision)

1. Select the following link to create an Azure AI Vision resource:
   - [Azure AI Vision](https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision)

1. On the **Create** page, provide the following information:
   [!INCLUDE [Create Azure resource for subscription](./cognitive-resource-project-details.md)]
1. Mark your acknowledgment of the Responsible AI terms and then select **Review + create**.

#### [Face](#tab/face)

1. Select the following link to create a Face resource:
   - [Face](https://portal.azure.com/#create/Microsoft.CognitiveServicesFace)
1. On the **Create** page, provide the following information:

   [!INCLUDE [Create Azure resource for subscription](./cognitive-resource-project-details.md)]
1. Mark your acknowledgment of the Face terms of use and then select **Review + create**.

#### [Custom Vision](#tab/custom-vision)

1. Select the following link to create a Custom Vision resource:
   - [Custom Vision service](https://portal.azure.com/#create/Microsoft.CognitiveServicesCustomVision)
1. On the **Create** page, provide the following information:

    |Project details| Description   |
    |--|--|
    | **Create options** | Custom Vision uses two separate resources together. The **Training** resource lets you train models, and the **Prediction** resource lets you publish and query models. Select **Both** if you're starting the project from scratch. |
    | **Subscription** | Select one of your available Azure subscriptions. |
    | **Resource group** | The Azure resource group that contains your Azure AI services resource. You can create a new group or add it to a pre-existing group. |
    | **Region** | The location of your Azure AI service resource. Different locations may introduce latency, but have no impact on the runtime availability of your resource. |
    | **Name** | A descriptive name for your Azure AI services resource. For example, *MyCognitiveServicesResource*. |
    | **Training pricing tier** | The cost of your Azure AI services account depends on the options you choose and your usage. For more information, see the API [pricing details](../../custom-vision-service/limits-and-quotas.md).|
    | **Prediction pricing tier** | The cost of your Azure AI services account depends on the options you choose and your usage. For more information, see the API [pricing details](../../custom-vision-service/limits-and-quotas.md).
1. Select **Review + create**.

#### [Document Intelligence](#tab/form-recognizer)

1. Select the following link to create a Document Intelligence resource:
   - [Document Intelligence service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer)
1. On the **Create** page, provide the following information:

    |Project details| Description   |
    |--|--|
    | **Subscription** | Select one of your available Azure subscriptions. |
    | **Resource group** | Select the Azure resource group that contains your Azure AI services resource. You can create a new group or add it to a pre-existing group. |
    | **Region** | The location of your Azure AI service resource. Different locations may introduce latency, but have no impact on the runtime availability of your resource. |
    | **Name** | A descriptive name for your Azure AI services resource. For example, *MyCognitiveServicesResource*. |
    | **Pricing tier** | The cost of your Azure AI services account depends on the options you choose and your usage. For more information, see [service quotas and limits](../../../ai-services/document-intelligence/service-limits.md) and [pricing details](https://azure.microsoft.com/pricing/details/form-recognizer/).|

1. Select **Review + create**.

---
