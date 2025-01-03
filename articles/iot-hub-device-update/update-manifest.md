---
title: Azure Device Update for IoT Hub update manifest
description: Learn how the Azure Device Update for IoT Hub service uses the update manifest to send properties to devices during updates.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 01/02/2025
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---


# Azure Device Update for IoT Hub update manifest

This article describes how Azure Device Update for IoT Hub uses [IoT Plug and Play](./device-update-plug-and-play.md) to send *update manifest* data to devices during update deployment. The update manifest is a serialized JSON object string containing metadata about the update to install. The update manifest is cryptographically signed so the Device Update agent can verify its authenticity. For more information about how the update manifest is used to securely install content, see [Device Update security](./device-update-security.md).

## Import manifest vs update manifest

The update manifest is different from the Device Update *import manifest*.

- Whoever creates the update for Device Update also creates the corresponding [import manifest](./import-concepts.md), which describes the contents of the update to import into Device Update.
- The Device Update service automatically generates the update manifest, using some of the same properties defined in the import manifest, to communicate information to the Device Update agent during the update process.

Each manifest type has its own schema and schema version. For more information about the import manifest schema, see [Device Update import manifest schema](import-schema.md).

## Update manifest schema

The update manifest JSON schema version 4 is hosted at [SchemaStore.org](https://json.schemastore.org/azure-deviceupdate-update-manifest-4.json).

### Example update manifest

```JSON
{
  "manifestVersion": "4",
  "updateId": {
    "provider": "Contoso",
    "name": "Toaster",
    "version": "1.0"
  },
  "compatibility": [
    {
      "manufacturer": "Contoso",
      "model": "Toaster"
    }
  ],
  "instructions": {
    "steps": [
      {
        "handler": "microsoft/swupdate:1",
        "handlerProperties": {
          "installedCriteria": "1.0"
        },
        "files": [
          "fileId0"
        ]
      }
    ]
  },
  "files": {
    "fileId0": {
      "filename": "contoso.toaster.1.0.swu",
      "sizeInBytes": 718,
      "hashes": {
        "sha256": "mcB5SexMU4JOOzqmlJqKbue9qMskWY3EI/iVjJxCtAs="
      }
    }
  },
  "createdDateTime": "2021-09-28T18:32:01.8404544Z"
}
```

### Full vs mini update manifest

If an update manifest is too large to be communicated efficiently, Device Update sends it to the device in *detached* format, also known as a *mini update manifest*. A mini manifest contains metadata about the update manifest that Device Update agent needs to download the full update manifest and verify its authenticity.

The following example shows a mini update manifest:

```json
{
  "manifestVersion": "4",
  "updateId": {
    "provider": "Contoso",
    "name": "Toaster",
    "version": "1.0"
  },
  "detachedManifestFileId": "fileId1",
  "files": {
    "fileId1": {
      "filename": "contoso.toaster.1.0.updatemanifest.json",
      "sizeInBytes": 2048,
      "hashes": {
        "sha256": "789s9PDfX4uA9wFUubyC30BWkLFbgmpkpmz1fEdqo2U="
      }
    }
  }
}
```
## Related content
- [Device Update import manifest concepts](import-manifest.md)
- [Device Update import manifest schema](import-schema.md)
- [Prepare an update to import into Device Update](create-update.md)
- [Import an update into Device Update](import-update.md)
