---
title: Create a Translator resource
titleSuffix: Azure Cognitive Services
description: This article will show you how to create the Azure Cognitive Services Translator resource and get a subscription key.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: how-to
ms.date: 01/25/2021
ms.author: lajanuar
---
# Create a Translator resource 

## Prerequisites

To get started, you need an active Azure subscription.
If you don't have one, you can [**create a free Azure account**](https://azure.microsoft.com/free/cognitive-services/).

## Create your resource

### 1. Choose your resource type

The Translator service can be accessed through two different resource types:

* **Single-service resource**—enables access to a single service API key and endpoint.  
* **Multi-service resource**—enables access to the following Cognitive Services using a single API key and endpoint and is currently available for the following services:
  * Language ([Translator](../translator/translator-info-overview.md), [Language Understanding (LUIS)](../luis/what-is-luis.md), [Text Analytics](../text-analytics/overview.md))  
  * Vision ([Computer Vision](../computer-vision/overview.md)), ([Face](../face/overview.md))  
  * Decision ([Content Moderator](../content-moderator/overview.md))

### 2. Navigate to the Azure Portal

You can navigate directly to the _Details_ page for your service:

# [Create your Translator resource](#tab/translator details page)
[Translator](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) resource.

# [Create your Cognitive Services resource](#tab/cognitive services details page)

[Cognitive Services resource](https://ms.portal.azure.com/#create/MicrosoftCognitiveServicesAllInOne) (the multi-service resource is named **Cognitive Services** in the Azure portal).

---

>[!TIP]
>If you prefer, you can start the *Create* process on the Azure Portal home page as follows:
>
> 1. Navigate to the Azure Portal.
> 1. Select ➕**Create a resource**  from the Azure services menu.
>1. In the **Search the Marketplace** search box, enter and select **Translator** (single-service resource) or **Cognitive Services** (multi-service resource).  *See* [Choose your resource type](#1-choose-your-resource-type), above.
> 1. Select **Create** and you will be taken to the project details page.
><br/><br/>

### 3. Complete project and instance details

> [!div class="checklist"]
> * **Subscription**. Select one of your available Azure subscriptions.
> * **Resource Group**. This Azure resource group will contain your Cognitive Services resource. You can create a new group or add it to a pre-existing group that shares the same lifecycle, permissions, and policies.
> * **Resource Region**. Choose the Global unless your business or application requires a specific region. Translator is a non-regional service for which there is no dependency on a specific Azure region.
> * **Name**. Enter the name you have chosen for your resource. This will be your custom domain name in your endpoint.
> * **Pricing tier**. Select a [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/translator) that meets your needs:

> > * Each subscription has a free tier.
>> * The free tier has the same features and functionalities as paid plans and doesn't expire.
>> * You can only have one free subscription per account.</li></ul>

> [!div class="checklist"]
> * If you have created a multi-service resource, you will need to confirm additional usage details via the check boxes.
> * Select **Review + Create**. 
> * Review the service terms and select **Create** to deploy your resource. 
> * After your resource has successfully deployed, select **Go to resource**.

## Retrieve your authentication key and endpoint URL

All Cognitive Services API requests require an authentication key. You can pass your key through a query-string parameter or by specifying it in the HTTP request header.

1. Retrieve your authentication key by selecting **Keys and Endpoint** from the left-rail menu.
1. You can copy the endpoint and either of the listed subscription keys to a text editor for easy retrieval.

## Delete a  resource or resource group

To remove a Cognitive Services or Translator resource, you can [delete the resource](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource) or [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group). 

> [!Warning]
> Deleting a resource group also deletes all resources contained in the group.

## Get started

* **[Translator quickstart](quickstart-translator.md?tabs=csharp)**.  Learn to use the Translator service with REST APIs.

## More resources

* [Microsoft Translator code samples](https://github.com/MicrosoftTranslator).  Multi-language Translator code samples are available on GitHub.
* [Microsoft Translator Support Forum](https://www.aka.ms/TranslatorForum)
* [Get Started with Azure (3-minute video)](https://azure.microsoft.com/get-started/?b=16.24)
