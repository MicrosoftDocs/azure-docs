---
title: Understand Device Update for IoT Hub importing | Microsoft Docs
description: Key concepts for importing a new update into Device Update for IoT Hub.
author: andbrown
ms.author: andbrown
ms.date: 2/10/2021
ms.topic: conceptual
ms.service: iot-hub
---

# Importing updates into Device Update for IoT Hub
In order to deploy an update to devices from Device Update for IoT Hub, you first have to _import_ that update into the Device Update service. Here is an overview of some important concepts to understand when it comes to importing updates.

## Import manifest

An import manifest is a JSON file that defines important information about the update that you are importing into Device Update for IoT Hub. You will submit both your import manifest and associated update file or files (such as a firmware update package) as part of the import process. The metadata that is defined in the import manifest is used to ingest the content. It is also used at deployment time - for example, to validate if an update was installed correctly.

The import manifest contains several items which represent important Device Update for IoT Hub concepts. These concepts are outlined below.

### Update identity (Update ID)

The update identity defines important properties about an update that is being imported into Device Update for IoT Hub. These properties are used to determine if a device is compliant, meaning the latest compatible update is installed.

The update identity is composed of three parts:
* Provider: this is the entity who is creating or directly responsible for the update. It will often be a company name.
* Name: this is the most specific indicator of the target of the update. It will often be a device or model name.
* Version: this is a version number distinguishing this update from others that have the same Provider and Name. This version is used by the Device Update for IoT Hub service, and may or may not match a version of an individual software component on the device. 

### Compatibility

Device Update for IoT Hub simplifies the deployment experience for updates and reduces the possibility of deployment errors. It does this by using compatibility properties defined in the import manifest and comparing them with device properties.

### InstalledCriteria

The InstalledCriteria property is used once the update has been installed on the device to determine if the update was successful.


## Next steps

If you're ready, try out the [Import How-To guide](./import-update.md), which will walk you through the import process step by step.


