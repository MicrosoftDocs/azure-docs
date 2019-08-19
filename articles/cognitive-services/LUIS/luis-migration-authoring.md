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
ms.date: 08/25/2019
ms.author: diberry
---

# Migrate to an Active Directory authoring key

Language Understanding (LUIS) authoring authentication changed from email to Active Directory. 

## Why migrating?

All the apps you own need to migrate to use Active Directory by:

* **June 1, 2020** is the deadline.

The authentication process for both app owners and app collaborators for authoring is changing to use **Active Directory**. This simplifies some management tasks:

* Collaboration.
* Transferring ownership.

The migration to Active Directory solves these two issues. 

## What is migrating?

When the **app owner** migrates, the owner is migrating:

* **All** the owned apps.
* In **one-way** migration.

The owner can't choose a subset of apps to migrate and the process isn't reversible. 

The migration is not: 

* A process that collects collaborators and automatically moved or added to the Active Directory. You, as the app owner, need to complete this step. This step requires permissions to the appropriate Active Directory.

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

Follow [these migration steps](luis-migration-authoring-steps).

### After you migrate 

* Email contributors with information about how to get added to the app as a collaborator using Active Directory.

## Migration for the app collaborator

You need to be added to the app's Active Directory by the app owner. Make sure that your account's main or primary email is used. If your account has more than one email associated with it, make sure that only the primary account is connected to the app with Active Directory. 

## Next steps

* [How to migrate your app to Active Directory authoring](luis-migration-authoring-steps.md)