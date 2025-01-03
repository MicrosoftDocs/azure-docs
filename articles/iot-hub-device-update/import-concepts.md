---
title: Azure Device Update for IoT Hub import manifest concepts
description: Understand the important concepts and sections in the Azure Device Update for IoT Hub import manifest.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 01/02/2025
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Azure Device Update for IoT Hub import manifest concepts

To deploy an update to devices using Azure Device Update for IoT Hub, you first import the update into the Device Update service, which stores the imported update and deploys it to devices. Along with the update payload, you submit a JSON import manifest file that defines important information about the update. This article describes the important concepts and sections in the import manifest JSON file.

<a name="import-manifest"></a>
## Import manifest file

You submit an import manifest JSON file along with the associated update files, such as a firmware update package, as part of the import process. The metadata defined in the import manifest is used both to ingest the update and at deployment time for functions like validating whether the update installed correctly.

The following JSON code shows an example import manifest file:

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

The sections of the import manifest file represent important Device Update concepts, as described in the following sections. For information about the full import manifest schema, see [Import manifest JSON schema](./import-schema.md).

### Update identity

The *update identity* or `updateId` provides the unique identifier for an update in Device Update, and contains the following properties:

- `provider` is the entity that creates or is responsible for the update, often a company name.
- `name` identifies an update class, often a device class or model name.
- `version` is a number that distinguishes this update from others with the same provider and name.

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
> The `updateId` is used only by the Device Update service, and is different from the software component identities on the devices.

### Compatibility

The `compatibility` section uses one or more arbitrary key-value pairs to define the devices that can install an update. Only devices that report properties matching the `compatibility` values are eligible to deploy the update. You can make an update compatible with multiple device classes by including more than one set of device compatibility properties.

The following example shows an update that can only be deployed to devices that report *Contoso* and *Toaster* as their device manufacturer and model.

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

The `instructions` section contains the necessary information or `steps` for the device agent to install the update. The simplest update contains a single inline step that executes the update payload file using a `handler` registered with the device agent. The following example shows a single-step `instructions` section.

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

> [!NOTE]
> The `handler` property is equivalent to the `updateType` property in import manifest version 3.0 or older.

An update and an import manifest `steps` section can contain more than one step, as in the following example:

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

A `steps` section can also contain `reference` steps that instruct the device agent to install a different update and corresponding import manifest, establishing a parent and child update relationship. The following example update for a toaster contains two child update steps. An update can contain any combination of inline and reference steps.

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


### Files

The `files` section of the import manifest contains update payload file metadata like `name`, `size`, and `hash`. Device Update uses this metadata for integrity validation during the import process, and forwards the same information to the device agent for integrity validation before installation.

> [!NOTE]
> A parent update that contains only reference steps doesn't define any update payload files.

## Create an import manifest

Once you understand the structure of an import manifest, create an import manifest to describe your update. You can author a JSON import manifest manually using a text editor, but the Azure CLI [az iot du init v5](/cli/azure/iot/du/update/init#az-iot-du-update-init-v5) command simplifies the process. For more information and instructions, see [Prepare an update to import into Device Update](create-update.md).

> [!IMPORTANT]
> To import into the Azure portal, an import manifest JSON filename must end with *.importmanifest.json*.

> [!TIP]
> You can use [Visual Studio Code](https://code.visualstudio.com) to enable autocomplete and JSON schema validation when you create an import manifest.

## Update import limits

Certain limits are enforced for Device Update instances, including import limits. For more information, see [Device Update limits](./device-update-limits.md).

## Related content

- [Import manifest schema](import-schema.md).
- [Prepare an update to import](create-update.md).
- [Import an update](import-update.md)
