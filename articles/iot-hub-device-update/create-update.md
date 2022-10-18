---
title: How to prepare an update to be imported into Azure Device Update for IoT Hub | Microsoft Docs
description: How-To guide for preparing to import a new update into Azure Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 1/28/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Prepare an update to import into Device Update for IoT Hub

Learn how to obtain a new update and prepare the update for importing into Device Update for IoT Hub.

## Prerequisites

* [Access to an IoT Hub with Device Update for IoT Hub enabled](create-device-update-account.md).
* [Azure Command-Line Interface (CLI)](https://learn.microsoft.com/cli/azure/) installed.
* Supported browsers:
  * [Microsoft Edge](https://www.microsoft.com/edge)
  * Google Chrome

## Obtain an update for your devices

Now that you've set up Device Update and provisioned your devices, you'll need the update file(s) that you'll be deploying to those devices.

* If you’ve purchased devices from an Original Equipment Manufacturer (OEM) or solution integrator, that organization will most likely provide update files for you, without you needing to create the updates. Contact the OEM or solution integrator to find out how they make updates available.

* If your organization already creates software for the devices you use, that same group will be the ones to create the updates for that software.

When creating an update to be deployed using Device Update for IoT Hub, start with either the [image-based or package-based approach](understand-device-update.md#support-for-a-wide-range-of-update-artifacts) depending on your scenario.

## Create a basic Device Update import manifest

Once you have your update files, create an import manifest to describe the update. If you haven't already done so, be sure to familiarize yourself with the basic [import concepts](import-concepts.md). While it is possible to author an import manifest JSON manually using a text editor, the Azure Command Line Interface (CLI) simplifies the process greatly, and is used in the examples below.

> [!TIP]
> Try the [image-based](device-update-raspberry-pi.md), [package-based](device-update-ubuntu-agent.md), or [proxy update](device-update-howto-proxy-updates.md) tutorials if you haven't already done so. You can also just view sample import manifest files from those tutorials for reference.

Using the Azure CLI, run the following commands after replacing the following sample parameter values with your own: **Provider, Name, Version, Compatibility Properties, Update Handler and associated properties, and file(s)**. See [Import schema and API information](import-schema.md) for details on what values you can use for each item. _In particular, be aware that the same exact set of compatibility properties cannot be used with more than one Provider and Name combination._

    ```azurecli
    az iot device-update update init v5
    --update-provider <replace with your Provider> --update-name <replace with your update Name> --update-version <replace with your update Version>
    --compat manufacturer=<replace with the value your device will report> model=<replace with the value your device will report> 
    --step handler=<replace with your chosen handler, such as microsoft/script:1, microsoft/swupdate:1, or microsoft/apt:1> properties=<replace with any desired handler properties (JSON-formatted), such as '{"installedCriteria": "1.0"}'> 
    --file path=<replace with path(s) to your update file(s), including the full file name> 
    ```

_For handler properties, you may need to escape certain characters in your JSON. For example, use `'\'` to escape double-quotes if you are running the Azure CLI in PowerShell._

Once you've created your import manifest and saved it as a JSON file, if you're ready to import your update, you can scroll to the Next steps link at the bottom of this page.

## Create an advanced Device Update import manifest for a proxy update

If your update is more complex, such as a [proxy update](device-update-proxy-updates.md), you may need to create multiple import manifests. You can use the same Azure CLI approach from the previous section to create both a _parent_ import manifest and some number of _child_ import manifests for complex updates. Run the following Azure CLI commands after replacing the sample parameter values with your own. See [Import schema and API information](import-schema.md) for details on what values you can use. In the example below, there are three updates to be deployed to the device: 1 parent update and 2 child updates:

```azurecli
    az iot device-update update init v5
    --update-provider <replace with a child update Provider> --update-name <replace with a child update Name> --update-version <replace with a child update Version>
    --compat manufacturer=<replace with the value your device will report> model=<replace with the value your device will report> 
    --step handler=<replace with your chosen handler, such as microsoft/script:1, microsoft/swupdate:1, or microsoft/apt:1> 
    --file path=<replace with path(s) to your update file(s), including the full file name> 
	  --output json >"<replace with the path where you want your import manifest created, including the full file name>"
    az iot device-update update init v5
    --update-provider <replace with a child update Provider> --update-name <replace with a child update Name> --update-version <replace with a child update Version> 
    --compat manufacturer=<replace with the value your device will report> model=<replace with the value your device will report> 
    --step handler=<replace with your chosen handler, such as microsoft/script:1, microsoft/swupdate:1, or microsoft/apt:1> 
    --file path=<replace with path(s) to your update file(s), including the full file name> 
	  --output json >"<replace with the path where you want your import manifest created, including the full file name>"
    az iot device-update update init v5
    --update-provider <replace with the parent update Provider> --update-name <replace with the parent update Name> --update-version <replace with the parent update Version> 
    --compat manufacturer=<replace with the value your device will report> model=<replace with the value your device will report> 
    --step handler=<replace with your chosen handler, such as microsoft/script:1, microsoft/swupdate:1, or microsoft/apt:1> properties=<replace with any desired handler properties (JSON-formatted), such as '{"installedCriteria": "1.0"}'> 
    --file path=<replace with path(s) to your update file(s), including the full file name> 
	  --step provider=<replace with first child update provider> name=<replace with first child update name> version=<replace with first child update version>
	  --step provider=<replace with second child update provider> name=<replace with second child update name> version=<replace with second child update version
	  --output json >"<replace with the path where you want your import manifest created, including the full file name>"
```

## Next steps

* [Import an update](import-update.md)
* [Learn about import concepts](import-concepts.md)
