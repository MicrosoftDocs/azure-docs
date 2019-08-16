---
title: Collaboration - LUIS
titleSuffix: Azure Cognitive Services
description: LUIS apps require a single owner and optional collaborators allowing multiple people to author a single app.
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
# Collaborating with other authors

Please [migrated]() any apps, which use the older non-Active Directory authentication before continuing.

After a one-time migration of authoring to Active Directory, LUIS apps use Active Directory authentication with Active Directory roles to provide access for app authoring. This allows multiple people to author a single app.

## Managing multiple authors

All users that author a LUIS app, need to be added to ROLENAME role on the resource. This is [completed]() from the Azure portal.

## Moving or changing ownership of your LUIS app

An app is defined by its Azure resource, which is determined by the app's subscription. 

You can move your LUIS app. Use the following documentation resources to learn more:

* [Move resource to new resource group or subscription](../azure-resource-manager/resource-group-move-resources.md)
* [Move resource within same subscription or across subscriptions](../azure-resource-manager/move-limitations/app-service-move-limitations.md)
* [Transfer ownership](../billing/billing-subscription-transfer.md) of your subscription 

## Collaborator roles vs entity roles

[Entity roles](luis-concept-roles.md) apply to the data model of the LUIS app. Collaborator roles apply to levels of authoring access. 

## Next steps

Understand [versioning](luis-concept-version.md) concepts. 

See [App Settings](luis-how-to-collaborate.md) to learn how to manage collaborators in your LUIS app.

See [Add email to access list](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58fcccdd5aca2f08a4104342) with the Authoring APIs.
