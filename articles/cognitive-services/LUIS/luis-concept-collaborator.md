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

LUIS apps use Active Directory authentication with roles to provide access for app authoring. This allows multiple people to author a single app.

Please [migrated]() any apps, which use the older non-Active Directory authentication before continuing.

## LUIS account
A LUIS account is associated with a single [Microsoft Live](https://login.live.com/) account. Each LUIS 

## LUIS app owner

## Authorization roles

## Transfer ownership


## LUIS app collaborators

## Managing multiple authors

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
