---
title: Understand Device Update for IoT Hub importing
description: Key concepts for importing a new update into Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 06/27/2022
ms.topic: concept-article
ms.service: iot-hub-device-update
---

# Importing updates into Device Update for IoT Hub

In order to deploy an update to devices from Device Update for IoT Hub, you first have to import that update into the Device Update service. The imported update will be stored in the Device Update service and can be deployed from there to devices. This article provides an overview of some important concepts to understand when it comes to importing updates.

## Import manifest

An import manifest is a JSON file that defines important information about the update that you're importing. You submit both your import manifest and associated update file or files (such as a firmware update package) as part of the import process. The metadata that is defined in the import manifest is used to ingest the update. Some of the metadata is also used at deployment time - for example, to validate if an update was installed correctly.

For example:

```json
{
  "updateId": {
    "provider": "Contoso",
    "name": "Toaster",
    "version": "1.0"
  },
  "isDeployable": false,
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
        "files": [
          "firmware.swu"
        ],
        "handlerProperties": {
          "installedCriteria": "1.0"
        }
      }
    ]
  },
  "files": [
    {
      "filename": "firmware.swu",
      "sizeInBytes": 7558,
      "hashes": {
        "sha256": "/CD7Sn6fiknWa3NgcFjGlJ+ccA81s1QAXX4oo5GHiFA="
      }
    }
  ],
  "createdDateTime": "2022-01-19T06:23:52.6996916Z",
  "manifestVersion": "5.0"
}
```

The import manifest contains several items that represent important Device Update for IoT Hub concepts. These items are outlined in this section. For information about the full import schema, see [Import manifest JSON schema](./import-schema.md).

### Update identity

The *update identity* or *updateId* is the unique identifier for an update in Device Update for IoT Hub. It's composed of three parts:

- **Provider**: entity who is creating or directly responsible for the update. It will often be a company name.
- **Name**: identifier for a class of updates. It will often be a device class or model name.
- **Version**: a version number distinguishing this update from others that have the same provider and name.

For example:

```json
{
  "updateId": {
    "provider": "Contoso",
    "name": "Toaster",
    "version": "1.0"
  }
}
```

> [!NOTE]
> UpdateId is used by the Device Update service only, and may be different from the identities of actual software components on the device.

### Compatibility

*Compatibility* defines the criteria of a device that can install the update. It contains device properties that are a set of arbitrary key value pairs that are reported from a device. Only devices with matching properties will be eligible for deployment. An update may be compatible with multiple device classes by having more than one set of device properties.

Here's an example of an update that can only be deployed to a device that reports *Contoso* and *Toaster* as its device manufacturer and model.

```json
{
  "compatibility": [
    {
      "manufacturer": "Contoso",
      "model": "Toaster"
    }
  ]
}
```

### Instructions

The *Instructions* part contains the necessary information or *steps* for device agent to install the update. The simplest update contains a single inline step. That step executes the included payload file using a *handler* registered with the device agent:

```json
{
  "instructions": {
    "steps": [
      {
        "handler": "microsoft/swupdate:1",
        "files": [
          "contoso.toaster.1.0.swu"
        ]
      }
    ]
  }
}
```

> [!TIP]
> `handler` is equivalent to `updateType` in import manifest version 3.0 or older.

An update may contain more than one step:

```json
{
  "instructions": {
    "steps": [
      {
        "description": "pre-install script",
        "handler": "microsoft/script:1",
        "handlerProperties": {
          "arguments": "--pre-install"
        },
        "files": [
          "configure.sh"
        ]
      },
      {
        "description": "firmware package",
        "handler": "microsoft/swupdate:1",
        "files": [
          "contoso.toaster.1.0.swu"
        ]
      }
    ]
  }
}
```

An update may contain *reference* steps that instruct the device agent to install another update with its own import manifest altogether, establishing a parent and child update relationship. For example, an update for a toaster may contain two child updates:

```json
{
  "instructions": {
    "steps": [
      {
        "type": "reference",
        "updateId": {
          "provider": "Contoso",
          "name": "Toaster.HeatingElement",
          "version": "1.0"
        }
      },
      {
        "type": "reference",
        "updateId": {
          "provider": "Contoso",
          "name": "Toaster.Sensors",
          "version": "1.0"
        }
      }
    ]
  }
}
```

> [!NOTE]
> An update may contain any combination of inline and reference steps.

### Files

The *Files* part contains the metadata of update payload files like their names, sizes, and hash. Device Update for IoT Hub uses this metadata for integrity validation during the import process. The same information is then forwarded to the device agent to repeat the integrity validation prior to installation.

> [!NOTE]
> An update that contains only reference steps won't have any update payload file in the parent update.

## Create an import manifest

While it's possible to author an import manifest JSON manually using a text editor, the Azure Command Line Interface (CLI) simplifies the process greatly. When you're ready to try out the creation of an import manifest, you can use the [How-to guide](create-update.md#create-a-basic-device-update-import-manifest).

> [!IMPORTANT]
> An import manifest JSON filename must end with `.importmanifest.json` when imported through Azure portal.

> [!TIP]
> Use [Visual Studio Code](https://code.visualstudio.com) to enable autocomplete and JSON schema validation when creating an import manifest.

## Limits on importing updates

Certain limits are enforced for each Device Update for IoT Hub instance. If you haven't already reviewed them, see [Device Update limits](./device-update-limits.md).

## Next steps

- To learn more about the import process, see [Prepare an update to import](./create-update.md).
- Review the [Import manifest schema](./import-schema.md).
