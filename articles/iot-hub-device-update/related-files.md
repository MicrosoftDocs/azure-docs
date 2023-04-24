---
title: Related files for Device Update for Azure IoT Hub
description: Create import manifests that reference multiple update files using the Device Update for IoT Hub related files feature.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 01/24/2023
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Use the related files feature to reference multiple update files

Use the related files feature when you need to express relationships between different update files in a single update.

When importing an update to Device Update for IoT Hub, an import manifest containing metadata about the update payload is required. The file-level metadata in the import manifest can be a flat list of update payload files in the simplest case. However, for more advanced scenarios, the related files feature provides a way for you to specify relationships between multiple update files.

When creating an import manifest using the related files feature, you can add a collection of _related_ files to one or more of your _primary_ payload files. An example of this concept is the Device Update [delta update](delta-updates.md) feature, which uses related files to specify a delta update that is associated with a full image file. In the delta scenario, the related files feature allows the full image and delta update to both be imported as a single update action, and then either one can be deployed to a device. However, the related files feature isn't limited to delta updates, since it's designed to be extensible by our customers depending on their own unique scenarios.

## How to define related files

The related files feature is available for import manifests that are version 5 or later.

When you add related files to an import manifest, include the following information:

* File details

  Define the related files by providing the filename, size, and hash.

* A download handler

  Specify how to process these related files to produce the target file. You specify the processing approach by including a `downloadHandler` property in your import manifest. Including `downloadHandler` is required if you specify a non-empty collection of `relatedFiles` in a `file` element. You can specify a `downloadHandler` using a simple `id` property. The Download handler `id` has a limit of 64 ASCII characters.

* Related files properties

  You can provide extra metadata for the update handler on your device to know how to interpret and properly use the files that you've specified as related files. This metadata is added as part of a `properties` property bag to the `file` and `relatedFile` objects.

For more information about the import schema for related files, see [relatedFiles object](import-schema.md#relatedfiles-object).

## Example import manifest using related files

The following sample import manifest demonstrates how the related files feature is used to import a delta update. In this example, you can see that in the `files` section, there's a full image specified (`full-image-file-name`) with a `properties` item. The `properties` item in turn has an associated `relatedFiles` item below it. Within the `relatedFiles` section, you can see another `properties` section for the delta update file (`delta-from-v1-file-name`), and also a `downloadHandler` item with the appropriate `id` listed (`microsoft/delta:1`).

>[!NOTE]
>This example uses delta updates to demonstrate how to reference related files. If you want to use delta updates as a feature, learn more in the [delta update documentation](delta-updates.md).

```json
    {
      "updateId": {
        // provider, name, version
      },
      "compatibility": [
        {
          // manufacturer, model, etc.
        }
      ],
      "instructions": {
        "steps": [
          // Inline steps...
        ]
      },
      "files": [
        {  
          // standard file properties
          "fileName": "full-image-file-name",
          "sizeInBytes": 12345,
          "hashes": {
            "SHA256": "full-image-file-hash"
          },
          "mimeType": "application/octet-stream",
          // new properties
          "properties  ": {},
          "relatedFiles": [
            {
              // delta from version 1.0.0.0
              // standard file properties
              "fileName": "delta-from-v1-file-name",
              "sizeInBytes": 1234,
              "hashes": {
                "SHA256": "delta-from-v1-file-hash"
              },
              "mimeType": "application/octet-stream",
              // new properties
              "properties": {
                "microsoft.sourceFileHash": "delta-source-file-hash",
                "microsoft.sourceFileHashAlgorithm": "sha256"
              }
            }  
          ],
          // handler to download/process our related files
      "downloadHandler": {
        "id": "microsoft/delta:1"
      }
    }
  ],
  "createdDateTime": "2021-12-01T01:12:21Z",
  "manifestVersion": "5.0"
    }
```

## Example init command using related files

The [az iot du init v5](/cli/azure/iot/du/update/init#az-iot-du-update-init-v5) command for creating an import manifest supports an optional `--related-file` parameter.

The `--related-file` parameter takes a `path` and `properties` key:

```azurecli
--related-file path=<replace with path(s) to your delta file(s), including the full file name> properties='{"microsoft.sourceFileHashAlgorithm": "sha256", "microsoft.sourceFileHash": "<replace with the source SWU image file hash>"}' 
```

For example:

```azurecli
az iot du update init v5 \
--update-provider Microsoft --update-name myBundled --update-version 2.0 \
--compat manufacturer=Contoso model=SpaceStation \
--step handler=microsoft/script:1 properties='{"arguments": "--pre"}' description="Pre-install script" \
--file path=/my/update/scripts/preinstall.sh downloadHandler=microsoft/delta:1 \
--related-file path=/my/update/scripts/related_preinstall.json properties='{"microsoft.sourceFileHashAlgorithm": "sha256"}' \
--step updateId.provider=Microsoft updateId.name=SwUpdate updateId.version=1.1 \
--step handler=microsoft/script:1 properties='{"arguments": "--post"}' description="Post-install script" \
--file path=/my/update/scripts/postinstall.sh
```

## Next steps

* Learn about [import manifest schema](import-schema.md)
* Learn about [delta updates](delta-updates.md)
