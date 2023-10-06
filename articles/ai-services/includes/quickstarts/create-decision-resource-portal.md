---
title: Create a Decision resource
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 08/29/2022
ms.author: pafarley
---

#### [Anomaly Detector](#tab/anomaly-detector)

1. Select the following link to create an Anomaly Detector resource:
   - [Anomaly Detector](https://portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector)
1. On the **Create** page, provide the following information:
   [!INCLUDE [Create Azure resource for subscription](./cognitive-resource-project-details.md)]
1. Select **Review + create**.

#### [Content Moderator](#tab/content-moderator)

1. Select the following link to create a Content Moderator resource:
   - [Content Moderator](https://portal.azure.com/#create/Microsoft.CognitiveServicesContentModerator)
1. On the **Create** page, provide the following information:

   [!INCLUDE [Create Azure resource for subscription](./cognitive-resource-project-details.md)]
1. Select **Review + create**.

#### [Metrics Advisor](#tab/metrics-advisor)

1. Select the following link to create a Metrics Advisor resource:
   - [Metrics Advisor](https://portal.azure.com/#create/Microsoft.CognitiveServicesMetricsAdvisor)
1. On the **Create** page, provide the following information:

   |Project details| Description   |
   |--|--|
   | **Subscription** | Select one of your available Azure subscriptions. |
   | **Resource group** | The Azure resource group that will contain your Azure AI services resource. You can create a new group or add it to a pre-existing group. |
   | **Region** | The location of your Azure AI service resource. Different locations may introduce latency, but have no impact on the runtime availability of your resource. |
   | **Name** | A descriptive name for your Azure AI services resource. For example, *MyCognitiveServicesResource*. |
   | **Pricing tier** | The cost of your Azure AI services account depends on the options you choose and your usage. For more information, see the API [pricing details](../../custom-vision-service/limits-and-quotas.md).|
   | **Storage** | You can optionally use your own Azure database resource to store the data that Metrics Advisor will use.
1. Mark your acknowledgment of the Service Agreement and Terms and then select **Review + create**.

---
