---
title: Migrate to Azure resource for authoring
titleSuffix: Azure Cognitive Services
description: Migrate to an Azure authoring resource key.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 09/02/2019
ms.author: diberry
---

# Migrate to an Azure resource authoring key

Language Understanding (LUIS) authoring authentication changed from an email account to an Azure resource. 

## Why migrate?

Using an Azure resource for authoring allows you, as the owner of the resource, to control access to authoring. You can create and name authoring resources to manage different groups of authors. 

For example, if you have 2 types of LUIS apps you are authoring, with different members, you can create two different authoring resources and assign contributors. The Azure resource controls the authorization. 

Assign the resource to the apps, per LUIS app. Once the resource is assigned in the LUIS portal, you don't have to do any more work to provide authorization. 

> ![Note]
> Before migration, co-authors are known as _collaborators_. After migration, the Azure role of _contributor_ is used for the same functionality.

## When do you need to migrate?

All the apps you own need to migrate to use Azure authoring resources:

* **June 1, 2020** is the deadline.

The authentication process for both app owners and app collaborators (_contributors) for authoring is changing to use an **Azure resource**. 

## What is migrating?

When the **app owner** migrates, the owner is migrating:

* **All** the owned apps.
* In **one-way** migration.

The owner can't choose a subset of apps to migrate and the process isn't reversible. 

The migration is not: 

* A process that collects collaborators and automatically moves or adds to the Azure resource. You, as the app owner, need to complete this step. This step requires permissions to the appropriate resource.
* A process to create a prediction runtime resource. If you need a prediction runtime resource, that is [a separate process](/luis-how-to-azure-subscription.md#create-runtime-resource-in-the-azure-portal) and is unchanged. 

## How are the apps migrating?

The [LUIS portal](https://www.luis.ai) provides the migration process. You will be asked to migrate if:

* You have apps on the email authentication system for authoring.
* And you are the app owner. 

You can delay the migration process, by canceling out of the window. You are periodically asked to migrate until you migrate or the migration deadline is passed. You can start the migration process from the top navigation bar's lock icon.

## Migration for the app owner

### Before you migrate

* **Optionally**, backup the apps from the LUIS portal's apps list by exporting each app or use the export [API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c40).
* **Optionally**, save each app's collaborator's list. This email list is provided as part of the migration process.
* **Required**, you need to have an Azure subscription. A part of the subscription process does require billing information. However, you can use Free (F0) pricing tiers when you use LUIS. You may eventually find you need a paid tier, as your usage increases. 

### Migration steps

Follow [these migration steps](luis-migration-authoring-steps.md).

### After you migrate 

After the migration process, all your LUIS apps, which you own, are now assigned to a single LUIS authoring resource.

You can create more authoring resources and assign from the **Manage -> Azure resources** page in the _LUIS portal_. 

You can add contributors to the authoring resource from the _Azure portal_, on the **Access Control (IAM)** page for that resource. See [add contributor access](luis-migration-authoring-steps.md#after-migration-process) for more information.

|Portal|Purpose|
|--|--|
|[Azure](https://azure.microsoft.com/en-us/free/)|* Create prediction and authoring resources.<br>* Assign contributors.|
|[LUIS](https://www.luis.ai)|* Migrate to new authoring resources.<br>* Assign or unassign prediction and authoring resources to apps from **Manage -> Azure resources** page.| 

## Migration for the app contributor

After the migration process, you need to be added to the app's Azure authoring resource by the app owner. Make sure that your account's main or primary email is used. If your account has more than one email associated with it, make sure that only the primary account is connected to the app. 

## Next steps

* [How to migrate your app to an authoring resource](luis-migration-authoring-steps.md)