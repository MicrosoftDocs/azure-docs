---
title: Related files for Device Update for Azure IoT Hub | Microsoft Docs
description: Understand the Device Update for IoT Hub related files feature.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 08/23/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Use the related files feature in Device Update for IoT Hub

Use the related files feature when you need to express relationships between different update files in a single update.

## What is the related files feature?

When importing an update to Device Update for IoT Hub, an import manifest containing metadata about the update payload is required. The file-level metadata in the import manifest can be a flat list of update payload files in the simplest case. However, for more advanced scenarios, you can instead use the related files feature, which provides a way for files to have a relationship specified between them.

When creating an import manifest using the related files feature, you can add a collection of _related_ files to one or more of your _primary_ payload files. An example of this concept is the Device Update [delta update](delta-updates.md) feature, which uses related files to specify a delta update that is associated with a full image file. In the delta scenario, the related files feature allows the full image and delta update to both be imported as a single update action, and then either one can be deployed to a device. However, the related files feature isn't limited to delta updates, since it's designed to be extensible by our customers depending on their own unique scenarios.

### Example import manifest using related files

Below is an example of an import manifest that uses the related files feature to import a delta update. In this example, you can see that in the `files` section, there's a full image specified (`full-image-file-name`) with a `properties` item. The `properties` item in turn has an associated `relatedFiles` item below it. Within the `relatedFiles` section, you can see another `properties` section for the delta update file (`delta-from-v1-file-name`), and also a `downloadHandler` item with the appropriate `id` listed (`microsoft/delta:1`).

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

## How to use related files

>[!NOTE]
>The documentation on this page uses delta updates as an example of how to use related files. If you want to use delta updates as a _feature_, follow the [delta update documentation](delta-updates.md).

### Related files properties

In certain scenarios, you may want to provide extra metadata for the update handler on your device to know how to interpret and properly use the files that you've specified as related files. This metadata is added as part of a `properties` property bag to the `file` and `relatedFile` objects.

### Specify a download handler

When you use the related files feature, you need to specify how to process these related files to produce the target file. You specify the processing approach by including a `downloadHandler` property in your import manifest. Including `downloadHandler` is required if you specify a non-empty collection of `relatedFiles` in a `file` element. You can specify a `downloadHandler` using a simple `id` property. The Download handler `id` has a limit of 64 ASCII characters.

## Next steps

- Learn about [import manifest schema](import-schema.md)
- Learn about [delta updates](delta-updates.md)
