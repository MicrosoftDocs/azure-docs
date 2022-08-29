---
title: Related Files for Device Update for Azure IoT Hub | Microsoft Docs
description: Understand the Device Update for IoT Hub Related Files feature.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 08/22/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Using the Related Files feature in Device Update for IoT Hub

Use the Related Files feature when you need to express relationships between different update files in a single update.

## What is the Related Files feature?

When importing an update to Device Update for IoT Hub, an import manifest containing metadata about the update payload is required. The file-level metadata in the import manifest can be a flat list of update payload files in the simplest case. However, for more advanced scenarios, you can instead use the Related Files feature, which provides a way for files to have a relationship specified between them.

When creating an import manifest using the Related Files feature, you can add a collection of _related_ files to one or more of your _primary_ payload files. An example of this concept is the Device Update [delta files](.\delta-updates.md) feature, which uses Related Files to specify a delta update that is associated with a full image file. In the delta scenario, the Related Files feature allows the full image and delta update to both be imported as a single update action, and then either one can be deployed to a device. However, Related Files isn't limited to delta updates, since it's designed to be extensible by our customers depending on their own unique scenarios.

## How to use Related Files

>[!NOTE]
>if you want to use delta updates, you should follow the [delta update documentation](.\delta-updates.md). The documentation on this page is for customizing Related Files to other scenarios.

### Related Files Properties

In certain scenarios, you may want to provide extra metadata for the update installer on your device to know how to interpret and properly use the files that you've specified as Related Files. This metadata is added as part of a `Properties` property bag to the `File` and `RelatedFile` objects. The `Properties` property bag has a limit of five key-value pairs, where each key is limited to 64 ASCII characters and each value is `JObject` (with up to 256 ASCII characters?).

### Specifying a Download Handler

When you use the Related Files feature, you need to specify how to process these related files to produce the target file. You specify the processing approach by including a `DownloadHandler` property in your import manifest. Including `DownloadHandler` is required if you specify a non-empty collection of `RelatedFiles` in a `File` element. You can specify a `DownloadHandler` using a simple `id` property. The Download handler `id` has a limit of 64 ASCII characters. **There might be some reserved values, like “microsoft/\*  ” where * is a wildcard character.**

### Example import manifest using Related Files

Below is an example of an import manifest that uses the Related Files feature to import a delta update. In this example, you can see that in the `"Files"` section, there is a `"Properties"` item with an associated `"RelatedFiles"` item below it. Within the `"RelatedFiles"` section, you can see another `"Properties"` section for the delta update file, and also a `"downloadHandler"` item with the appropriate `id` listed (`"microsoft/delta:1"`).
```json
    {
      "UpdateId": {
        // Provider, Name, Version
      },
      "Compatibility": [
        {
          // DeviceManufacturer, DeviceModel, etc.
        }
      ],
      "Instructions": {
        "Steps": [
          // Inline steps...
        ]
      },
      "Files": [
        {  
          // standard file properties
          "FileName": "full-image-file-name",
          "SizeInBytes": 12345,
          "Hashes": {
            "SHA256": "full-image-file-hash"
          },
          "MimeType": "application/octet-stream",
          // new properties
          "Properties  ": {},
          "RelatedFiles": [
            {
              // delta from version 1.0.0.0
              // standard file properties
              "FileName": "delta-from-v1-file-name",
              "SizeInBytes": 1234,
              "Hashes": {
                "SHA256": "delta-from-v1-file-hash"
              },
              "MimeType": "application/octet-stream",
              // new properties
              "Properties": {
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
  "CreatedDateTime": "2021-12-01T01:12:21Z",
  "ManifestVersion": "5.0"
    }
```

## Next steps

[Learn about delta updates](.\delta-updates.md)