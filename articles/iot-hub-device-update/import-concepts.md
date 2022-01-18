---
title: Understand Device Update for IoT Hub importing | Microsoft Docs
description: Key concepts for importing a new update into Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 2/10/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Importing updates into Device Update for IoT Hub

In order to deploy an update to devices from Device Update for IoT Hub, you first have to _import_ that update into the Device Update service. Here is an overview of some important concepts to understand when it comes to importing updates.

## Import manifest

An import manifest is a JSON file that defines important information about the update that you are importing. You will submit both your import manifest and associated update file or files (such as a firmware update package) as part of the import process. The metadata that is defined in the import manifest is used to ingest the update. Some of the metadata is also used at deployment time - for example, to validate if an update was installed correctly. The import manifest contains several items which represent important Device Update for IoT Hub concepts and they are outlined below. The full schema is documented [here](./import-schema.md).

### Update identity (updateId)

*Update identity* is the unique identifer for an update in Device Update for IoT Hub. It is composed of three parts:
- **Provider**: entity who is creating or directly responsible for the update. It will often be a company name.
- **Name**: identifier for a class of updates. It will often be a device class or model name.
- **Version**: a version number distinguishing this update from others that have the same Provider and Name.

[!NOTE]
UpdateId is used by Device Update for IoT Hub service only, and may be different from identity of actual software component on the device.

### Compatibility

*Compatibility* defines the criteria of a device that can receive the update deployment. It contains device properties - a set of arbitrary key value pairs that are reported from a device. Only devices with matching properties will be eligible for deployment. An update may have more than one set of device properties, making it possible to be compatible with multiple device classes.

Following is an example of update that can only be deployed to a device that reports *Microsoft* and *Toaster* as its device manufacturer and model.

```json
{
  "compatibility": [
    {
      "deviceManufacturer": "Microsoft",
      "deviceModel": "Toaster"
    }
  ]
}
```

### Instructions

*Instructions* contains the necessary information or *steps* for device agent to install the update. The simplest update contains single *inline* step which executes the included payload file with the help of a *handler* registered with the device agent:

```json
{
  "instructions": {
    "steps": [
      {
        "handler": "microsoft/swupdate:1",
        "files": [
          "microsoft.toaster.1.0.swu"
        ]
      }
    ]
  }
}
```

[!TIP]
`handler` is equivalent to `updateType` in import manifest version 3.0 or older.

An update may contain more than one steps:

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
          "microsoft.toaster.1.0.swu"
        ]
      }
    ]
  }
}
```

An update may contain *reference* step which instructs device agent to install another update with its own import manifest altogether, establishing a *parent* and *child* update relationship. For example an update for a toaster may contain two child updates:

```json
{
  "instructions": {
    "steps": [
      {
        "type": "reference",
        "updateId": {
          "provider": "Microsoft",
          "name": "Toaster.HeatingElement",
          "version": "1.0"
        }
      },
      {
        "type": "reference",
        "updateId": {
          "provider": "Microsoft",
          "name": "Toaster.Sensors",
          "version": "1.0"
        }
      }
    ]
  }
}
```

[!NOTE]
An update may contain any combination of *inline* and *reference* steps.

### Files

*Files* contains the metadata of update payload files like their names, sizes, and hashes. Device Update for IoT Hub uses this metadata for integrity validation during import process. The same information is then forwarded to device agent to repeat the integrity validation prior to installation.

[!NOTE]
An update that contains *reference* steps only will not have any update payload file in the parent update.

## Create an import manifest

You may use any text editor to create import manifest JSON file. There are also sample scripts for creating import manifest in [Azure/iot-hub-device-update](https://github.com/Azure/iot-hub-device-update/tree/release/0.8.0/tools/AduCmdlets) at GitHub.

[!IMPORTANT]
Import manifest JSON filename must end with `.importmanifest.json` when imported through Microsoft Azure portal.

[!TIP]
Use [Visual Studio Code](https://code.visualstudio.com) to enable autocomplete and JSON schema validation when creating an import manifest. The latest version of [import manifest JSON schema](https://json.schemastore.org/azure-deviceupdate-importmanifest-4.0.json) is hosted on [SchemaStore.org](https://www.schemastore.org/json).

## Limits on importing updates

Certain limits are enforced for each Device Update for IoT Hub instance. If you haven't already reviewed them, please see [Device Update limits](./device-update-limits.md).

## Next steps

- Try out the [Import How-To guide](./import-update.md), which will walk you through the import process step by step.
- Review [Import Manifest Schema](./import-schema.md).