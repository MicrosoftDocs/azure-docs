---
title: Migrate to Active Directory authoring
titleSuffix: Azure Cognitive Services
description: Migrate to an Active Directory authoring key.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 07/30/2019
ms.author: diberry
---

# Migration Steps

From the Language Understanding (LUIS) portal, migrate all the apps you own to use the Active Directory authoring key.

## Begin the migration process

Before you migrate to the Active Directory authoring experience, you need to have an Azure subscription. If you do not have an Azure subscription, [sign up](). 

![Migration notice for authoring keys](./media/migrate-authoring-key/migration-notice.png)

1. Choose to migrate now or migrate later. You have 9 months to migrate to the new authoring key in Active Directory.

1. [Sign up to Azure]() and create your first subscription if you do not have an Azure subscription. 

1. Send email to your collaborators. Select the apps and its collaborators to notify your collaborators about the migration.

1. Choose or create a LUIS authoring resource.

    ![Choose or create a LUIS authoring resource](./media/migrate-authoring-key/choose-authoring-resource.png)

    If you do not have a LUIS authoring resource, create one. 

    ![Create authoring resource](./media/migrate-authoring-key/create-luis-resources.png)

    ![Create authoring resource](./media/migrate-authoring-key/create-authoring-resource.png)

    When **creating a new authoring resource**, provide the following information: 

    * **Resource name** - a custom name you choose, used as part of the URL for your authoring and prediction endpoint queries.
    * **Tenant** - the tenant your Azure subscription is associated with. 
    * **Resource group** - a custom resource group name you choose or create. Resource groups allow you to group Azure resources for access and management. 
    * **Location** - an Azure global region your authoring resource is in. LUIS has 3 regions for authoring. The authoring region determines your available publishing regions.
    * **Pricing tier** - the pricing tier determines the maximum transaction per second and month. 

1. If your apps (that you own) have collaborators, 