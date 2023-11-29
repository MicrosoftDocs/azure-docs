---
title: How to prepare an update to be imported into Azure Device Update for IoT Hub | Microsoft Docs
description: How-To guide for preparing to import a new update into Azure Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 10/31/2022
ms.topic: how-to
ms.service: iot-hub-device-update
ms.custom: devx-track-azurecli
---

# Prepare an update to import into Device Update for IoT Hub

Learn how to obtain a new update and prepare the update for importing into Device Update for IoT Hub.

## Prerequisites

* Access to [an IoT Hub with Device Update for IoT Hub enabled](create-device-update-account.md).
* An Azure CLI environment:

  * Use the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md).

    [![Launch Cloud Shell in a new window](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)

  * Or, if you prefer to run CLI reference commands locally, [install the Azure CLI](/cli/azure/install-azure-cli)

  1. Sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.
  2. Run [az version](/cli/azure/reference-index#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az-upgrade).
  3. When prompted, install Azure CLI extensions on first use. The commands in this article use the **azure-iot** extension. Run `az extension update --name azure-iot` to make sure you're using the latest version of the extension.

>[!TIP]
>The Azure CLI commands in this article use the backslash `\` character for line continuation so that the command arguments are easier to read. This syntax works in Bash environments. If you're running these commands in PowerShell, replace each backslash with a backtick `\``, or remove them entirely.

## Obtain an update for your devices

Now that you've set up Device Update and provisioned your devices, you need the update file(s) that you'll deploy to those devices.

* If you’ve purchased devices from an Original Equipment Manufacturer (OEM) or solution integrator, that organization will most likely provide update files for you, without you needing to create the updates. Contact the OEM or solution integrator to find out how they make updates available.

* If your organization creates software for the devices you use, that same group will create the updates for that software.

When creating an update to be deployed using Device Update for IoT Hub, start with either the [image-based or package-based approach](understand-device-update.md#support-for-a-wide-range-of-update-artifacts) depending on your scenario.

## Create a basic Device Update import manifest

Once you have your update files, create an import manifest to describe the update. If you haven't already done so, familiarize yourself with the basic [import concepts](import-concepts.md). While it's possible to author an import manifest JSON manually using a text editor, the Azure Command Line Interface (CLI) simplifies the process greatly, and is used in the examples below.

> [!TIP]
> Try the [image-based](device-update-raspberry-pi.md), [package-based](device-update-ubuntu-agent.md), or [proxy update](device-update-howto-proxy-updates.md) tutorials if you haven't already done so. You can also just view sample import manifest files from those tutorials for reference.

The [az iot du init v5](/cli/azure/iot/du/update/init#az-iot-du-update-init-v5) command takes the following arguments:

* `--update-provider`, `--update-name`, and `--update-version`: These three parameters define the **updateId** object that is a unique identifier for each update.
* `--compat`: The **compatibility** object is a set of name-value pairs that describe the properties of a device that this update is compatible with.
  * The same exact set of compatibility properties can't be used with more than one provider and name combination.
* `--step`: The update **handler** on the device (for example, `microsoft/script:1`, `microsoft/swupdate:1`, or `microsoft/apt:1`) and its associated **properties** for this update.
* `--file`: The paths to your update file or files.

For more information about these parameters, see [Import schema and API information](import-schema.md).

```azurecli
az iot du update init v5 \
    --update-provider <replace with your Provider> \
    --update-name <replace with your update Name> \
    --update-version <replace with your update Version> \
    --compat <replace with the property name>=<replace with the value your device will report> <replace with the property name>=<replace with the value your device will report> \
    --step handler=<replace with your chosen handler> properties=<replace with any handler properties (JSON-formatted)> \
    --file path=<replace with path(s) to your update file(s), including the full file name> 
```

For example:

```azurecli
az iot du update init v5 \
    --update-provider Microsoft \
    --update-name AptUpdate \
    --update-version 1.0.0 \
    --compat manufacturer=Contoso model=Vacuum \
    --step handler=microsoft/script:1 properties='{"installedCriteria": "1.0"}' \
    --file path=/my/apt/manifest/file
```

For handler properties, you may need to escape certain characters in your JSON. For example, use `'\'` to escape double-quotes if you're running the Azure CLI in PowerShell.

The `init` command supports advanced scenarios, including the [related files feature](related-files.md) that allows you to define the relationship between different update files. For more examples and a complete list of optional parameters, see [az iot du init v5](/cli/azure/iot/du/update/init#az-iot-du-update-init-v5).

Once you've created your import manifest and saved it as a JSON file, you're ready to [import your update](import-update.md). If you are planning to use the Azure portal UI for importing, be sure to name your import manifest in the following format: "\<manifestname\>.importmanifest.json".

## Create an advanced Device Update import manifest for a proxy update

If your update is more complex, such as a [proxy update](device-update-proxy-updates.md), you may need to create multiple import manifests. You can use the same Azure CLI approach from the previous section to create both a _parent_ import manifest and some number of _child_ import manifests for complex updates. Run the following Azure CLI commands after replacing the sample parameter values with your own. See [Import schema and API information](import-schema.md) for details on what values you can use. In the example below, there are three updates to be deployed to the device: one parent update and two child updates:

```azurecli
az iot du update init v5 \
    --update-provider <replace with child_1 update Provider> \
    --update-name <replace with child_1 update Name> \
    --update-version <replace with child_1 update Version> \
    --compat manufacturer=<replace with the value your device will report> model=<replace with the value your device will report> \
    --step handler=<replace with your chosen handler> \
    --file path=<replace with path(s) to your update file(s), including the full file name> \
az iot du update init v5 \
    --update-provider <replace with child_2 update Provider> \
    --update-name <replace with child_2 update Name> \
    --update-version <replace with child_2 update Version> \
    --compat manufacturer=<replace with the value your device will report> model=<replace with the value your device will report> \
    --step handler=<replace with your chosen handler> \
    --file path=<replace with path(s) to your update file(s), including the full file name> \
az iot du update init v5 \
    --update-provider <replace with the parent update Provider> \
    --update-name <replace with the parent update Name> \
    --update-version <replace with the parent update Version> \
    --compat manufacturer=<replace with the value your device will report> model=<replace with the value your device will report> \
    --step handler=<replace with your chosen handler> properties=<replace with any desired handler properties (JSON-formatted)> \
    --file path=<replace with path(s) to your update file(s), including the full file name> \
    --step updateId.provider=<replace with child_1 update provider> updateId.name=<replace with child_1 update name> updateId.version=<replace with child_1 update version> \
    --step updateId.provider=<replace with child_2 update provider> updateId.name=<replace with child_2 update name> updateId.version=<replace with child_2 update version> \
```

## Next steps

* [Import an update](import-update.md)
* [Learn about import concepts](import-concepts.md)
