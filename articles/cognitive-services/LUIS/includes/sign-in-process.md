---
title: include file
description: include file
services: cognitive-services

manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.date: 05/05/2020
ms.topic: include

---
## Sign in to LUIS portal

A new user to LUIS needs to follow this procedure:

1. Sign in to the [LUIS portal](https://www.luis.ai), select your country/region and agree to the terms of use. If you see **My Apps** instead, a LUIS resource already exists and you should skip ahead to create an app. For supported regions, visit [authoring and publishing regions and the associated keys](https://docs.microsoft.com/azure/cognitive-services/luis/luis-reference-regions).

1. In the **Choose an authoring** window that appears, find your Azure subscription, and LUIS authoring resource. If you don't have a resource, you can create a new one.

     
    ![Choose a type of Language Understanding authoring resource](../media/luis-how-to-azure-subscription/choose-authoring-resource.png)


    When you create a new authoring resource, provide the following information:
    * **Tenant name** - the tenant your Azure subscription is associated with.
    * **Azure subscription name** - the subscription that will be billed for the resource.
    * **Azure resource group name** - a custom resource group name you choose or create. Resource groups allow you to group Azure resources for access and management.
    * **Azure resource name** - a custom name you choose, used as part of the URL for your authoring and prediction endpoint queries.
    * **Pricing tier** - the pricing tier determines the maximum transaction per second and month.


