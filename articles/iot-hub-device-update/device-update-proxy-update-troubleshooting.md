---
title: Troubleshooting for importing proxy updates to Device Update for Azure IoT Hub
description: This document provides troubleshooting steps for error messages that may occur when importing proxy update to Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 1/5/2022
ms.topic: troubleshooting
ms.service: iot-hub-device-update
---

# Device Update for IoT troubleshooting guide for importing proxy updates

This document provides troubleshooting steps and a table of error messages that you may encounter when importing [proxy updates](device-update-proxy-updates.md) into Device Update for IoT Hub.


## Error messages

| Error message                 | How to troubleshoot                                                        |
|-------------------------------|----------------------------------------------------------------------------|
|**No import manifest was found in this upload. The file extension for import manifests is _.importmanifest.json_**  | At least one import manifest is required for any update to be imported into Device Update for IoT Hub. A proxy update may have both a parent import manifest and also some number of child import manifests referenced from the parent. <br><br> A possible reason for this error is that you have valid import manifest(s) but they don't have the _.importmanifest.json_ extension at the end of the file name. This extension is required for the import manifests to be recognized by the import process in the Azure portal. If the extension is correct, you should review the [schema](import-schema.md) of each import manifest in your update for any issues. [Learn more about import manifests.](create-update.md) |
|**This upload is missing a required parent manifest. The file extension for import manifests is _.importmanifest.json_**  | A proxy update may have a parent import manifest and also some number of child import manifests referenced from the parent. A parent manifest must be included when any child updates are being imported, as it contains required information about those child updates. <br><br> A possible reason for this error is that you have a valid parent import manifest but it doesn't have the _.importmanifest.json_ extension at the end of the file name. This extension is required for the import manifests to be recognized by the import process in the Azure portal. If the extension is correct, you should review the [schema](import-schema.md) of the parent import manifest for any issues. [Learn more about import manifests.](create-update.md) |
|**This upload contains _[n]_ parent manifests. Only one is allowed. Delete the manifests you don’t want to use and try uploading again.**  | A proxy update may have a parent import manifest and also some number of child import manifests referenced from the parent. Only one parent manifest can be included for a given update, though there can be any number of child import manifests. If you see this error along with a list of import manifest files, _each_ of those files has information indicating it's a parent import manifest. <br><br> To address this issue, first determine which parent import manifest matches the update you're importing, and then remove any others so there's just one parent import manifest. [Learn more about import manifests.](create-update.md) |
|**Upload is missing one or more of the child manifests listed in the parent** _('parentimportfile.importmanifest.json')_**. Add the required child manifests for these update IDs**  | A proxy update may have a parent import manifest and also some number of child import manifests. The parent import manifest includes references to all the child import manifests in your update. If you see this error, your parent import manifest references a child import manifest for each of the listed update IDs, but those child import manifest(s) aren't part of your update. <br><br> To address this issue, you'll need to add each of those child import manifests to your update, or else remove the references in the parent import manifest. [Learn more about import manifests.](create-update.md) |
|**Upload contains child manifest file(s)** _('childmanifest.importmanifest.json')_ **that aren't listed in the parent. Delete it and try again.**  | A proxy update may have a parent import manifest and also some number of child import manifests. The parent import manifest includes references to all the child import manifests in your update. If you see this error, each listed manifest is a child import manifest which is present in the update but isn't referenced in the parent import manifest. <br><br> To address this issue, you'll need to remove those child import manifests. Or, you can add references to them in your parent import manifest. [Learn more about import manifests.](create-update.md) |
|**Some required update files were missing. Include them, and try your upload again.**  | A proxy update may have multiple import manifests, each referencing multiple update files. If any of the files referenced aren't included when you import your update, you'll see this error. <br><br> To address this issue, you'll need to add the files that are missing, or else remove the references to those files from the import manifest that includes them. [Learn more about import manifests.](create-update.md) |
|**Upload contains one or more files that aren’t listed in the manifest. Delete the extra files and try your upload again.**  | A proxy update may have multiple import manifests, each referencing multiple update files. You'll see this error if you try to import any update files that aren't referenced in an import manifest. <br><br> To address this issue, remove the files listed in the error message. Or, add a reference for each file to one of your import manifests. [Learn more about import manifests.](create-update.md) |
|**Upload contains duplicate file names. Delete or rename files so that each name is unique.**  | An update can contain multiple files, but each file must have a unique file name. If you try to import any update files that have the same name, you'll see this error. <br><br> To address this issue, remove or rename the files listed in the error message. If you rename any files, be sure to also change the associated reference for each file in the appropriate import manifest. [Learn more about import manifests.](create-update.md) |
|**One or more import manifest wasn’t formatted correctly. Delete the file or adjust its syntax, and try again.**  | If you see this error, there's an issue with how your import manifest(s) were created. To resolve this issue, review each listed import manifest and check that there are no [schema](import-schema.md) issues. [Learn more about import manifests.](create-update.md) |


<!-- Make sections visible when content is available --
## Troubleshooting

## FAQs
-->

## Next steps

- [Troubleshoot other issues with Device Update](troubleshoot-device-update.md)
