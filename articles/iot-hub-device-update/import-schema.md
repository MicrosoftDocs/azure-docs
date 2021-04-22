---
title: Importing updates into Device Update for IoT Hub - schema and other information | Microsoft Docs
description: Schema and other related information (including objects) that is used when importing updates into Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 2/25/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Importing updates into Device Update for IoT Hub - schema and other information
If you want to import an update into Device Update for IoT Hub, be sure you've reviewed the [concepts](import-concepts.md) and [How-To guide](import-update.md) first. If you're interested in the details of the schema used when constructing an import manifest, as well as information about related objects, see below.

## Import manifest schema

| Name | Type | Description | Restrictions |
| --------- | --------- | --------- | --------- |
| UpdateId | `UpdateId` object | Update identity. |
| UpdateType | string | Update type: <br/><br/> * Specify `microsoft/apt:1` when performing a package-based update using reference agent.<br/> * Specify `microsoft/swupdate:1` when performing an image-based update using reference agent.<br/> * Specify `microsoft/simulator:1` when using sample agent simulator.<br/> * Specify a custom type if developing a custom agent. | Format: <br/> `{provider}/{type}:{typeVersion}`<br/><br/> Maximum of 32 characters total |
| InstalledCriteria | string | String interpreted by the agent to determine whether the update was applied successfully:  <br/> * Specify **value** of SWVersion for update type `microsoft/swupdate:1`.<br/> * Specify `{name}-{version}` for update type `microsoft/apt:1`, of which name and version are obtained from the APT file.<br/> * Specify a custom string if developing a custom agent.<br/> | Maximum of 64 characters |
| Compatibility | Array of `CompatibilityInfo` [objects](#compatibilityinfo-object) | Compatibility information of device compatible with this update. | Maximum of 10 items |
| CreatedDateTime | date/time | Date and time at which the update was created. | Delimited ISO 8601 date and time format, in UTC |
| ManifestVersion | string | Import manifest schema version. Specify `2.0`, which will be compatible with `urn:azureiot:AzureDeviceUpdateCore:1` interface and `urn:azureiot:AzureDeviceUpdateCore:4` interface. | Must be `2.0` |
| Files | Array of `File` objects | Update payload files | Maximum of 5 files |

## UpdateId Object

| Name | Type | Description | Restrictions |
| --------- | --------- | --------- | --------- |
| Provider | string | Provider part of the update identity. | 1-64 characters, alphanumeric, dot and dash. |
| Name | string | Name part of the update identity. | 1-64 characters, alphanumeric, dot and dash. |
| Version | version | Version part of the update identity. | 2 to 4 part, dot separated version number between 0 and 2147483647. Leading zeroes will be dropped. |

## File Object

| Name | Type | Description | Restrictions |
| --------- | --------- | --------- | --------- |
| Filename | string | Name of file | Must be unique within an update |
| SizeInBytes | Int64 | Size of file in bytes. | Maximum of 800 MB per individual file, or 800 MB collectively per update |
| Hashes | `Hashes` object | JSON object containing hash(es) of the file |

## CompatibilityInfo Object

| Name | Type | Description | Restrictions |
| --- | --- | --- | --- |
| DeviceManufacturer | string | Manufacturer of the device the update is compatible with. | 1-64 characters, alphanumeric, dot and dash. |
| DeviceModel | string | Model of the device the update is compatible with. | 1-64 characters, alphanumeric, dot and dash. |

## Hashes Object

| Name | Required | Type | Description |
| --------- | --------- | --------- | --------- |
| Sha256 | True | string | Base64-encoded hash of the file using the SHA-256 algorithm. |

## Next steps

Learn more about [import concepts](./import-concepts.md).

If you're ready, try out the [Import How-To guide](./import-update.md), which will walk you through the import process step by step.
