---
title: "Create a Azure AI services resource in the Azure portal"
titleSuffix: Azure AI services
description: Get started with Azure AI services by creating and subscribing to a resource in the Azure portal.
services: cognitive-services
author: aahill
manager: nitinme
keywords: Azure AI services, cognitive intelligence, cognitive solutions, ai services
ms.service: cognitive-services
ms.topic: quickstart
ms.date: 02/13/2023
ms.author: aahi
---

# Quickstart: Create a Azure AI services resource using the Azure portal

Use this quickstart to create a Azure AI services resource. After you create a Cognitive Service resource in the Azure portal, you'll get an endpoint and a key for authenticating your applications.

Azure AI services is cloud-based artificial intelligence (AI) services that help developers build cognitive intelligence into applications without having direct AI or data science skills or knowledge. They're available through REST APIs and client library SDKs in popular development languages. Azure AI services enables developers to easily add cognitive features into their applications with cognitive solutions that can see, hear, speak, and analyze.

## Types of Azure AI services resources

[!INCLUDE [cognitive-services-subscription-types](../../includes/cognitive-services-subscription-types.md)]

## Prerequisites

* A valid Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
* [!INCLUDE [contributor-requirement](./includes/quickstarts/contributor-requirement.md)]

## Create a new Azure AI services resource

### [Multi-service](#tab/multiservice)

The multi-service resource is named **Azure AI services** in the portal. The multi-service resource enables access to the following Azure AI services:

* **Decision** - Content Moderator
* **Language** - Language, Translator
* **Speech** - Speech
* **Vision** - Azure AI Vision, Custom Vision, Document Intelligence, Face

1. You can select this link to create an Azure Cognitive multi-service resource: [Create a Azure AI services resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne).

1. On the **Create** page, provide the following information:

    [!INCLUDE [Create Azure resource for subscription](./includes/quickstarts/cognitive-resource-project-details.md)]

    :::image type="content" source="media/cognitive-services-apis-create-account/resource_create_screen-multi.png" alt-text="Multi-service resource creation screen":::

1. Configure other settings for your resource as needed, read and accept the conditions (as applicable), and then select **Review + create**.

### [Decision](#tab/decision)

[!INCLUDE [Create Decision resource for subscription](./includes/quickstarts/create-decision-resource-portal.md)]

### [Language](#tab/language)

[!INCLUDE [Create Language resource for subscription](./includes/quickstarts/create-language-resource-portal.md)]

### [Speech](#tab/speech)

1. Select the following links to create a Speech resource:
   - [Speech Services](https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices)

1. On the **Create** page, provide the following information:

    [!INCLUDE [Create Azure resource for subscription](./includes/quickstarts/cognitive-resource-project-details.md)]

1. Select **Review + create**.

### [Vision](#tab/vision)

[!INCLUDE [Create Vision resource for subscription](./includes/quickstarts/create-vision-resource-portal.md)]

---

[!INCLUDE [Register Azure resource for subscription](./includes/register-resource-subscription.md)]

## Get the keys for your resource

1. After your resource is successfully deployed, select **Next Steps** > **Go to resource**.

    :::image type="content" source="media/cognitive-services-apis-create-account/cognitive-services-resource-deployed.png" alt-text="Get resource keys screen":::

1. From the quickstart pane that opens, you can access the resource endpoint and manage keys.
<!--
1. If you missed the previous steps or need to find your resource later, go to the [Azure services](https://portal.azure.com/#home) home page. From here you can view recent resources, select **My resources**, or use the search box to find your resource by name.

    :::image type="content" source="media/cognitive-services-apis-create-account/home-my-resources.png" alt-text="Find resource keys from home screen":::
-->

[!INCLUDE [cognitive-services-environment-variables](../../includes/cognitive-services-environment-variables.md)]

## Clean up resources

If you want to clean up and remove a Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources contained in the group.

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **Resource Groups** to display the list of your resource groups.
1. Locate the resource group containing the resource to be deleted.
1. If you want to delete the entire resource group, select the resource group name. On the next page, Select **Delete resource group**, and confirm.
1. If you want to delete only the Cognitive Service resource, select the resource group to see all the resources within it. On the next page, select the resource that you want to delete, select the ellipsis menu for that row, and select **Delete**.

If you need to recover a deleted resource, see [Recover deleted Azure AI services resources](manage-resources.md).

## See also

* See **[Authenticate requests to Azure AI services](authentication.md)** on how to securely work with Azure AI services.
* See **[What are Azure AI services?](./what-are-cognitive-services.md)** to get a list of different categories within Azure AI services.
* See **[Natural language support](language-support.md)** to see the list of natural languages that Azure AI services supports.
* See **[Use Azure AI services as containers](cognitive-services-container-support.md)** to understand how to use Azure AI services on-premises.
* See **[Plan and manage costs for Azure AI services](plan-manage-costs.md)** to estimate cost of using Azure AI services.
