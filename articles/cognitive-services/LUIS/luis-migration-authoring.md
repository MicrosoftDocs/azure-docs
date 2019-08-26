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

## Why migrating?

All the apps you own need to migrate to use Azure authoring resources:

* **June 1, 2020** is the deadline.

The authentication process for both app owners and app collaborators for authoring is changing to use an **Azure resource**. 

## What is migrating?

When the **app owner** migrates, the owner is migrating:

* **All** the owned apps.
* In **one-way** migration.

The owner can't choose a subset of apps to migrate and the process isn't reversible. 

The migration is not: 

* A process that collects collaborators and automatically moves or adds to the Azure resource. You, as the app owner, need to complete this step. This step requires permissions to the appropriate resource.

## How are the apps migrating?

The [LUIS portal](https://www.luis.ai) provides the migration process. You will be asked to migrate if:

* You have apps on the email authentication system for authoring.
* And you are the app owner. 

You can delay the migration process, by canceling out of the window. You are periodically asked to migrate until you migrate or the migration deadline is passed. 

## Migration for the app owner

### Before you migrate

* Export the apps from the LUIS portal's apps list. 
* Save the collaborator's list. 

### Migration steps

Follow [these migration steps](luis-migration-authoring-steps.md).

### After you migrate 

After the migration process, [add collaborator access](luis-migration-authoring-steps.md#after-migration-process).

## Migration for the app collaborator

After the migration process, you need to be added to the app's Azure authoring resource by the app owner. Make sure that your account's main or primary email is used. If your account has more than one email associated with it, make sure that only the primary account is connected to the app. 

## Next steps

* [How to migrate your app to an authoring resource](luis-migration-authoring-steps.md)