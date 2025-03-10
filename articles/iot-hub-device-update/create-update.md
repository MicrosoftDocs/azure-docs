---
title: Prepare an update to import into Azure Device Update for IoT Hub | Microsoft Docs
description: Learn how to prepare an update for import into Azure Device Update for IoT Hub by creating an import manifest to describe the update.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 12/30/2024
ms.topic: how-to
ms.service: azure-iot-hub
ms.custom: devx-track-azurecli
ms.subservice: device-update
---

# Prepare an update to import into Device Update

This article describes how to get a new update and prepare it for importing into Azure Device Update for IoT Hub by creating an import manifest.

## Prerequisites

- A [Device Update account and instance configured with an IoT hub](create-device-update-account.md).
- An IoT device or simulator [provisioned for Device Update](device-update-agent-provisioning.md) within the IoT hub.
- The Bash environment in [Azure Cloud Shell](/azure/cloud-shell/quickstart) for running Azure CLI commands. Select **Launch Cloud Shell** to open Cloud Shell, or select the Cloud Shell icon in the top toolbar of the Azure portal.

  :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

  If you prefer, you can run the Azure CLI commands locally:
  
  1. [Install Azure CLI](/cli/azure/install-azure-cli). Run [az version](/cli/azure/reference-index#az-version) to see the installed Azure CLI version and dependent libraries, and run [az upgrade](/cli/azure/reference-index#az-upgrade) to install the latest version.
  1. Sign in to Azure by running [az login](/cli/azure/reference-index#az-login).
  1. Install the `azure-iot` extension when prompted on first use. To make sure you're using the latest version of the extension, run `az extension update --name azure-iot`.

>[!TIP]
>The Azure CLI commands in this article use the backslash \\ character for line continuation so that the command arguments are easier to read. This syntax works in Bash environments. If you run these commands in PowerShell, replace each backslash with a backtick \`, or remove them entirely.

<a name="obtain-an-update-for-your-device"></a>
## Get the update files for your device

Get the update file or files to deploy to your device using Device Update. If you purchased devices from an original equipment manufacturer (OEM) or solution integrator, that organization probably provides updates without you having to create update files. Contact the OEM or solution integrator to find out how they make updates available. If your organization creates software for your devices, it also creates the updates for that software.

To create the update, choose either the [image-based or package-based update type](understand-device-update.md#support-for-a-wide-range-of-update-artifacts), depending on your scenario.

> [!TIP]
> You can try the [image-based](device-update-raspberry-pi.md), [package-based](device-update-ubuntu-agent.md), or [proxy update](device-update-howto-proxy-updates.md) tutorials, or just view sample import manifest files from those tutorials for reference.

## Create a basic Device Update import manifest

Once you have your update files and are familiar with basic [Device Update import concepts](import-concepts.md), create an import manifest to describe the update. While you can author a JSON import manifest manually using a text editor, the Azure CLI [az iot du init v5](/cli/azure/iot/du/update/init#az-iot-du-update-init-v5) command simplifies the process. For more information about the import manifest schema, see [Device Update import schema and API information](import-schema.md).

The `az iot du init v5` command takes the following arguments. All are required except `--file`, which is derived from `--step` if not specified. There is positional sensitivity between `--step` and `--file`.

- The `--update-provider`, `--update-name`, and `--update-version` parameters define the `updateId` object that's a unique identifier for each update.
- The `--compat` compatibility object is a set of name-value pairs that describe the properties of a device that this update is compatible with. You can use a specific set of compatibility properties with only one provider and name combination.
- The `--step` parameter specifies the update `handler` on the device, such as `microsoft/script:1`, `microsoft/swupdate:1`, or `microsoft/apt:1`, and its associated `properties` for this update. You can use `--step` more than once.
- The `--file` parameter specifies the `path` to your update files. You can use `--file` one or more times.

```azurecli
az iot du update init v5 \
    --update-provider <provider> \
    --update-name <update name> \
    --update-version <update version> \
    --compat <property1>=<value> <property2>=<value> \
    --step handler=<handler> properties=<JSON-formatted handler properties> \
    --file path=<paths and full file names of your update files> 
```

The following `az iot du update init v5` command shows example values:

```azurecli
az iot du update init v5 \
    --update-provider Microsoft \
    --update-name AptUpdate \
    --update-version 1.0.0 \
    --compat manufacturer=Contoso model=Vacuum \
    --step handler=microsoft/script:1 properties='{"installedCriteria": "1.0"}' \
    --file path=/my/apt/manifest/file
```

> [!TIP]
> For handler properties, you might need to escape certain characters in your JSON. For example, use `'\'` to escape double quotes if you run the Azure CLI in PowerShell.

The `az iot du init v5` command supports advanced scenarios, including the [related files feature](related-files.md) that allows you to define the relationship between different update files. For more examples and a complete list of optional parameters, see the [az iot du init v5](/cli/azure/iot/du/update/init#az-iot-du-update-init-v5) command reference.

Once you create your import manifest and save it as a JSON file, you can [import the update](import-update.md). If you plan to use the Azure portal for importing, be sure to name your import manifest with the format *\<manifestname\>.importmanifest.json*.

## Create an advanced Device Update import manifest for a proxy update

If your update is more complex, such as a [proxy update](device-update-proxy-updates.md), you might need to create multiple import manifests. For complex updates, you can use the `az iot du update init v5` Azure CLI command to create a *parent* import manifest and some number of *child* import manifests.

Replace the placeholder values in the following Azure CLI commands. For details on the values you can use, see [Import schema and API information](import-schema.md). The following example shows three updates to deploy to the device, a parent update and two child updates.

```azurecli
az iot du update init v5 \
    --update-provider <child_1 update provider> \
    --update-name <child_1 update name> \
    --update-version <child_1 update version> \
    --compat manufacturer=<device manufacturer> model=<device model> \
    --step handler=<handler> \
    --file path=<paths and full file names of your update files> 
az iot du update init v5 \
    --update-provider <child_2 update provider> \
    --update-name <child_2 update name> \
    --update-version <child_2 update version> \
    --compat manufacturer=<device manufacturer> model=<device model> \
    --step handler=<handler> \
    --file path=<paths and full file names of your update files> 
az iot du update init v5 \
    --update-provider <parent update provider> \
    --update-name <parent update name> \
    --update-version <parent update version> \
    --compat manufacturer=<device manufacturer> model=<device model> \
    --step handler=<handler> properties=<any handler properties, JSON-formatted> \
    --file path=<paths and full file names of your update files> \
    --step updateId.provider=<child_1 update provider> updateId.name=<child_1 update name> updateId.version=<child_1 update version> \
    --step updateId.provider=<child_2 update provider> updateId.name=<child_2 update name> updateId.version=<child_2 update version> 
```

## Related content

- [Device Update import concepts](import-concepts.md)
- [Device Update import schema and API information](import-schema.md)
- [Proxy updates and multi-component updating](device-update-proxy-updates.md)
- [Import an update](import-update.md)
- [Use the related files feature to reference multiple update files](related-files.md)
