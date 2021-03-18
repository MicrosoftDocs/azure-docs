---
title: "Create a Cognitive Services resource in the Azure portal"
titleSuffix: Azure Cognitive Services
description: Get started with Azure Cognitive Services by creating and subscribing to a resource in the Azure portal.
services: cognitive-services
author: aahill
manager: nitinme
keywords: cognitive services, cognitive intelligence, cognitive solutions, ai services
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 03/15/2021
ms.author: aahi
---

# Quickstart: Create a Cognitive Services resource using the Azure portal

Use this quickstart to start using Azure Cognitive Services. After creating a Cognitive Service resource in the Azure portal, you'll get an endpoint and a key for authenticating your applications.

Azure Cognitive Services are cloud-based services with REST APIs, and client library SDKs available to help developers build cognitive intelligence into applications without having direct artificial intelligence (AI) or data science skills or knowledge. Azure Cognitive Services enables developers to easily add cognitive features into their applications with cognitive solutions that can see, hear, speak, understand, and even begin to reason.

[!INCLUDE [cognitive-services-subscription-types](../../includes/cognitive-services-subscription-types.md)]

## Prerequisites

* A valid Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

## Create a new Azure Cognitive Services resource

1. Create a resource.

### [Multi-service resource](#tab/multiservice)

The multi-service resource is named **Cognitive Services** in the portal. [Create a Cognitive Services resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne).

At this time, the multi-service resource enables access to the following Cognitive Services:

* **Vision** - Computer Vision, Custom Vision, Form Recognizer, Face
* **Speech** - Speech
* **Language** - Language Understanding (LUIS), Text Analytics, Translator
* **Decision** - Personalizer, Content Moderator

### [Single-service resource](#tab/singleservice)

Use the below links to create a resource for the available Cognitive Services:

| Vision                      | Speech                  | Language                          | Decision             |
|-----------------------------|-------------------------|-----------------------------------|----------------------|
| [Computer vision](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision)         | [Speech Services](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices)     | [Immersive reader](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesImmersiveReader)              | [Anomaly Detector](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector) | 
| [Custom vision service](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesCustomVision) |  | [Language Understanding (LUIS)](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesLUISAllInOne) | [Content Moderator](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesContentModerator) | 
| [Face](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFace)                    |                         | [QnA Maker](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesQnAMaker)                     | [Personalizer](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesPersonalizer)     |
| [Form Recognizer](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer)        |                         | [Text Analytics](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics)                |  [Metrics Advisor](https://go.microsoft.com/fwlink/?linkid=2142156)                    |
| | | [Translator](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) | |

---

2. On the **Create** page, provide the following information:
<!-- markdownlint-disable MD024 -->

### [Multi-service resource](#tab/multiservice)

|Project details| Description   |
|--|--|
| **Subscription** | Select one of your available Azure subscriptions. |
| **Resource group** | The Azure resource group that will contain your Cognitive Services resource. You can create a new group or add it to a pre-existing group. |
| **Region** | The location of your cognitive service instance. Different locations may introduce latency, but have no impact on the runtime availability of your resource. |
| **Name** | A descriptive name for your cognitive services resource. For example, *MyCognitiveServicesResource*. |
| **Pricing tier** | The cost of your Cognitive Services account depends on the options you choose and your usage. For more information, see the API [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/).

<!--![Multi-service resource creation screen](media/cognitive-services-apis-create-account/resource_create_screen-multi.png)-->
:::image type="content" source="media/cognitive-services-apis-create-account/resource_create_screen-multi.png" alt-text="Multi-service resource creation screen":::

Read and accept the conditions (as applicable for you) and then select **Review + create**.

### [Single-service resource](#tab/singleservice)

|Project details| Description   |
|--|--|
| **Subscription** | Select one of your available Azure subscriptions. |
| **Resource group** | The Azure resource group that will contain your Cognitive Services resource. You can create a new group or add it to a pre-existing group. |
| **Region** | The location of your cognitive service instance. Different locations may introduce latency, but have no impact on the runtime availability of your resource. |
| **Name** | A descriptive name for your cognitive services resource. For example, *MyCognitiveServicesResource*. |
| **Pricing tier** | The cost of your Cognitive Services account depends on the options you choose and your usage. For more information, see the API [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/).

<!--![Single-service resource creation screen](media/cognitive-services-apis-create-account/resource_create_screen.png)-->
:::image type="content" source="media/cognitive-services-apis-create-account/resource_create_screen.png" alt-text="Single-service resource creation screen":::

Select **Next: Virtual Network** and choose the type of network access you want to allow for your resource, and then select **Review + create**.

---

[!INCLUDE [Register Azure resource for subscription](./includes/register-resource-subscription.md)]

## Get the keys for your resource

1. After your resource is successfully deployed, click on **Go to resource** under **Next Steps**.

    ![Search for Cognitive Services](media/cognitive-services-apis-create-account/resource-next-steps.png)

2. From the quickstart pane that opens, you can access your key and endpoint.

    ![Get key and endpoint](media/cognitive-services-apis-create-account/get-cog-serv-keys.png)

[!INCLUDE [cognitive-services-environment-variables](../../includes/cognitive-services-environment-variables.md)]

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources contained in the group.

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Resource Groups** to display the list of your resource groups.
2. Locate the resource group containing the resource to be deleted
3. Right-click on the resource group listing. Select **Delete resource group**, and confirm.

## See also

* [Authenticate requests to Azure Cognitive Services](authentication.md)
* [What is Azure Cognitive Services?](./what-are-cognitive-services.md)
* [Create a new resource using the Azure Management client library](.\cognitive-services-apis-create-account-client-library.md)
* [Natural language support](language-support.md)
* [Docker container support](cognitive-services-container-support.md)
