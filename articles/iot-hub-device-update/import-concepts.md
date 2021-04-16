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

An import manifest is a JSON file that defines important information about the update that you are importing. You will submit both your import manifest and associated update file or files (such as a firmware update package) as part of the import process. The metadata that is defined in the import manifest is used to ingest the update. Some of the metadata is also used at deployment time - for example, to validate if an update was installed correctly.

The import manifest contains several items which represent important Device Update for IoT Hub concepts. These concepts are outlined below.

### Update identity (Update ID)

The update identity represents the unique identifer of an update. It defines important properties about an update that is being imported. The update identity is composed of three parts:
* Provider: this is the entity who is creating or directly responsible for the update. It will often be a company name.
* Name: an identifier for a class of updates. The class can be anything you choose. It will often be a device or model name.
* Version: this is a version number distinguishing this update from others that have the same Provider and Name. This version is used by the Device Update for IoT Hub service, and may or may not match a version of an individual software component on the device. 

### Compatibility

To simplify update deployments, Device Update for IoT Hub compares compatibility properties for an update, which are defined in the import manifest, with corresponding device properties. Only updates which have matching properties will be returned and available for deployment.

### InstalledCriteria

The InstalledCriteria is used by the update agent on a device to determine if an update has been installed successfully.


## Next steps

If you're ready, try out the [Import How-To guide](./import-update.md), which will walk you through the import process step by step.


