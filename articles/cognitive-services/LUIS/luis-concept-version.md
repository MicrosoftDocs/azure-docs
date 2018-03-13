---
title: Understand versioning in LUIS - Azure | Microsoft Docs
description: Learn how to use versions to manage changes in Language Understanding (LUIS)
services: cognitive-services
author: v-geberr
manager: kaiqb

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/13/2018
ms.author: v-geberr;
---

# Versions
Create different models of the same app with versions. 

Trained versions are not automatically available at your app [endpoint](luis-glossary.md#endpoint). You must [publish](PublishApp.md) or republish a version in order for it to be available at your app endpoint. You can publish to **Staging** and **Production**, giving you up to two versions of the app available at the endpoint. If you need more versions of the app available at an endpoint, you should export the version and reimport to a new app. The new app has a different app ID. 

## Version ID
The version ID consists of characters, digits or '.' and cannot be longer than 10 characters.

## Active version
To set a version as the active means it is currently edited and tested in the [LUIS][LUIS] website. Set a version as active to access its data, make updates, as well as to test and publish it.

The initial version (0.1) is the default active version unless you set another version as active. The name of the currently active version is displayed in the top, left panel after the app name. 

## Versions and publishing slots
You publish to either the stage and product slots. Each slot can have a different version or the same version. This is useful for verifying changes between model versions via the endpoint, which is available to bots or other LUIS calling applications. 

## Clone a version
Clone a version to create a copy of an existing version and save it as a new version. Clone a version to use the same content of the existing version as a starting point for the new version. Once you clone a version, the new version becomes the **active** version. 

## Import a version
Import a version from a JSON file. Once you import the version, the new version becomes the active version.

## Export a version
Export a version to a JSON file. This is the entire definition of the application for this version. The exported file does not contain machine-learned information because the app is retrained after it is imported.

If you export from the **Settings** page, you can choose which version to export. If you export from the **Apps** list page, you export the active version of the app.

## Delete a version
You can delete versions, but you have to keep at least one version of the app. You can delete all versions except the active version. 

## Collaborators
The owner and all collaborators have full access to all versions of the app.

## Next steps

See [Add entities](Add-entities.md) to learn more about how to add entities to your LUIS app.

[LUIS]:luis-reference-regions.md