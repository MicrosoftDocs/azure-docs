---
title: Troubleshooting for importing proxy updates to Device Update for IoT Hub | Microsoft Docs
description: This document provides troubleshooting steps for error messages that may occur when importing proxy update to Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 1/5/2022
ms.topic: reference
ms.service: iot-hub-device-update
---

# Device Update for IoT troubleshooting guide for importing proxy updates

This document provides troubleshooting steps and a table of error messages that may be encountered when importing proxy updates into Device Update for IoT Hub.


## Error messages

| Error message                 | How to troubleshoot                                                        |
|-------------------------------|----------------------------------------------------------------------------|
|_No import manifest was found in this upload. The file extension for import manifests is .importmanifest.json_  | At least one import manifest is required for any update to be imported into Device Update for IoT Hub. A proxy update may have a parent import manifest and also some number of child import manifests referenced from the parent. Each import manifest must end with _.importmanifest.json_ to be recognized by the import process in the Azure portal. [Learn more about import manifests.](.\import-update.md#create-a-device-update-import-manifest) |
|_This upload is missing a required parent manifest. The file extension for import manifests is .importmanifest.json_  | A proxy update may have a parent import manifest and also some number of child import manifests referenced from the parent. A parent manifest must be included when any child updates are being imported, as it contains required information about those child updates. The parent import manifest must end with _.importmanifest.json_ to be recognized by the import process in the Azure portal.[Learn more about import manifests.](.\import-update.md#create-a-device-update-import-manifest) |
|_This upload contains [n] parent manifests. Only one is allowed. Delete the manifests you don’t want to use and try uploading again._  | A proxy update may have a parent import manifest and also some number of child import manifests referenced from the parent. Only one parent manifest can be included for a given update, though there can be any number of child import manifests. If you see this error along with a list of import manifest files, each of those files is a parent import manifest, so you'll need to determine which parent import manifest matches the update you're importing, and remove any others. [Learn more about import manifests.](.\import-update.md#create-a-device-update-import-manifest) |
|_Upload is missing one or more of the child manifests listed in the parent_ ('parentImportFile.importmanifest.json')_. Add the required child manifests for these update IDs_  | A proxy update may have a parent import manifest and also some number of child import manifests referenced from the parent. The parent import manifest includes references to all the child import manifests in your update. If you see this error along with a list of update IDs, your parent import manifest includes a reference to a child import manifest for each of those IDs. You'll need to locate and add those child import manifests in order to import the update. [Learn more about import manifests.](.\import-update.md#create-a-device-update-import-manifest) |
|_Upload contains child manifest file(s)_ ('childmanifest.importmanifest.json') _that aren't listed in the parent. Delete it and try again._  | A proxy update may have a parent import manifest and also some number of child import manifests referenced from the parent. The parent import manifest includes references to all the child import manifests in your update. If you see this error along with a list of import manifests, those child import manifests aren't referenced in the parent import manifest. You'll need to remove those child import manifests to import the update, or else add references to them in your parent import manifest. [Learn more about import manifests.](.\import-update.md#create-a-device-update-import-manifest) |
|_Upload contains child manifest file(s)_ ('childmanifest.importmanifest.json') _that aren't listed in the parent. Delete it and try again._  | A proxy update may have a parent import manifest and also some number of child import manifests referenced from the parent. The parent import manifest includes references to all the child import manifests in your update. If you see this error along with a list of import manifests, those child import manifests aren't referenced in the parent import manifest. You'll need to remove those child import manifests to import the update, or else add references to them in your parent import manifest. [Learn more about import manifests.](.\import-update.md#create-a-device-update-import-manifest) |


**[Next Step: Troubleshoot other issues with Device Update](.\troubleshoot-device-update.md)**
