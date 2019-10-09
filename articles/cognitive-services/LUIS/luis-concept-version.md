---
title: Versioning - LUIS
titleSuffix: Azure Cognitive Services
description: Versions, in LUIS, are similar to versions in traditional programming. Each version is a snapshot in time of the app. Before you make changes to the app, create a new version. It is easier to go back to the exact app, then to try to unpeel and app's intent and utterances to a previous state.
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

# Understand how and when to use a LUIS version

Versions, in LUIS, are similar to versions in traditional programming. Each version is a snapshot in time of the app. Before you make changes to the app, create a new version. It is easier to go back to an older version, then to try to remove intents and utterances to a previous state.

## Version ID constraints
The version ID consists of characters, digits or '.' and cannot be longer than 10 characters.

The initial version (0.1) is the default active version. 

## Active version

To [set a version](luis-how-to-manage-versions.md#set-active-version) as the active means it is currently edited and tested in the [LUIS](luis-reference-regions.md) portal. Set a version as active to access its data, make updates, as well as to test and publish it.

## Publishing slots
You publish to either the stage and production slots. Each slot can have a different version or the same version. This is useful for verifying changes before publishing to production, which is available to bots or other LUIS calling applications. 

## Clone an existing version
Clone an existing version to use as a starting point for the new version. Once you clone a version, the new version becomes the **active** version. 

## Import and export a version
You can import a version at the app level. That version becomes the active version and uses the version ID in the `versionId` property of the app file. You can also import into an existing app, at the version level. The new version becomes the active version. 

You can export a version at the app or version level. The only difference is that the app-level exported version is the currently active version while at the version level, you can choose any version to export on the **[Settings](luis-how-to-manage-versions.md)** page. 

The exported file does not contain:

* machine-learned information because the app is retrained after it is imported
* contributor information

## Export each version as app backup
In order to back up your LUIS app schema, export a version from the LUIS portal.

## Delete a version
You can delete all versions except the active version from the LUIS portal. 

## Version availability at the endpoint

Trained versions are not automatically available at your app's [endpoint](luis-glossary.md#endpoint). You must [publish](luis-how-to-publish-app.md) or republish a version in order for it to be available at your app endpoint. You can publish to **Staging** and **Production**, giving you two versions of the app available at the endpoint. If you need more versions of the app available at an endpoint, you should export the version and reimport to a new app. The new app has a different app ID.

## Manage versions with contributors

### Manage multiple versions inside the same app
Begin by [cloning](luis-how-to-manage-versions.md#clone-a-version), from a base version, for each author. 

Each author makes changes to their own version of the app. Once each author is satisfied with the model, export the new versions to JSON files.  

Exported apps are JSON-formatted files, which can be compared for changes. Combine the files to create a single JSON file of the new version. Change the **versionId** property in the JSON to signify the new merged version. Import that version into the original app. 

This method allows you to have one active version, one stage version, and one published version. You can compare the results of the active version with a published version (stage or production) in the [interactive testing pane](luis-interactive-test.md).

### Manage multiple versions as apps
[Export](luis-how-to-manage-versions.md#export-version) the base version. Each author imports the version. The person that imports the app is the owner of the version. When they are done modifying the app, export the version. 

Exported apps are JSON-formatted files, which can be compared with the base export for changes. Combine the files to create a single JSON file of the new version. Change the **versionId** property in the JSON to signify the new merged version. Import that version into the original app.

## Contributions from collaborators

Learn more about authoring contributions from [collaborators](luis-how-to-collaborate.md).

## Next steps

* Understand [app models](luis-concept-model.md) as your app schema.
* [How to](luis-how-to-manage-versions.md) add versioning on the app settings page. 
