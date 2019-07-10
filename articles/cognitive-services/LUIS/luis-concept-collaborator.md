---
title: Collaboration 
titleSuffix: Language Understanding - Azure Cognitive Services
description: LUIS apps require a single owner and optional collaborators allowing multiple people to author a single app.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 06/03/2019
ms.author: diberry
---
# Collaborating with other authors

LUIS apps require a single owner and optional collaborators allowing multiple people to author a single app.

## LUIS account
A LUIS account is associated with a single [Microsoft Live](https://login.live.com/) account. Each LUIS account is given a free [authoring key](luis-concept-keys.md#authoring-key) to use for authoring all the LUIS apps the account has access to. 

A LUIS account may have many LUIS apps.

See [Azure Active Directory tenant user](luis-how-to-collaborate.md#azure-active-directory-tenant-user) to learn more about Active Directory user accounts. 

## LUIS app owner

The account that creates an app is the owner and each app has a single owner. The owner is listed on the app **[Settings](luis-how-to-collaborate.md)** page. The owner receives email when the endpoint quota reaches 75% of the monthly limit. 

## Authorization roles
LUIS doesn't support different roles for owners and collaborators with one exception. The owner is the only account that can delete the app.

If you are interested in controlling access to the model, consider slicing the model into smaller LUIS apps, where each smaller app has a more limited set of collaborators. Use [Dispatch](https://aka.ms/dispatch-tool) to allow a parent LUIS app to manage the coordination between parent and child apps.

## Transfer ownership
LUIS doesn't provide transfer of ownership, however any collaborator can export the app, and then create an app by importing it. Be aware the new app has a different App ID. The new app needs to be trained, published, and the new endpoint used.

## LUIS app collaborators
An app owner can add collaborators to an app. The owner needs to add the collaborator's email address on app **[Settings](luis-how-to-collaborate.md)**. The collaborator has full access to the app. If the collaborator deletes the app, the app is removed from the collaborator's account but remains in the owner's account. 

If you want to share multiple apps with collaborators, each app needs the collaborator's email added. 

## Managing multiple authors
The [LUIS](luis-reference-regions.md#luis-website) website doesn't currently offer transaction-level authoring. You can allow authors to work on independent versions from a base version. Two different methods are described in the following sections.

## Manage multiple versions inside the same app
Begin by [cloning](luis-how-to-manage-versions.md#clone-a-version), from a base version, for each author. 

Each author makes changes to their own version of the app. Once each author is satisfied with the model, export the new versions to JSON files.  

Exported apps are JSON-formatted files, which can be compared for changes. Combine the files to create a single JSON file of the new version. Change the **versionId** property in the JSON to signify the new merged version. Import that version into the original app. 

This method allows you to have one active version, one stage version, and one published version. You can compare the results in the interactive testing pane across the three versions.

## Manage multiple versions as apps
[Export](luis-how-to-manage-versions.md#export-version) the base version. Each author imports the version. The person that imports the app is the owner of the version. When they are done modifying the app, export the version. 

Exported apps are JSON-formatted files, which can be compared with the base export for changes. Combine the files to create a single JSON file of the new version. Change the **versionId** property in the JSON to signify the new merged version. Import that version into the original app.

## Collaborator roles vs entity roles

[Entity roles](luis-concept-roles.md) apply to the data model of the LUIS app. Collaborator roles apply to levels of authoring access. 

## Next steps

Understand [versioning](luis-concept-version.md) concepts. 

See [App Settings](luis-how-to-collaborate.md) to learn how to manage collaborators in your LUIS app.

See [Add email to access list](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/58fcccdd5aca2f08a4104342) with the Authoring APIs.
