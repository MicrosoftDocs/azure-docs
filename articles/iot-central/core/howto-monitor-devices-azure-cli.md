---
title: Monitor device connectivity using the Azure IoT Central Explorer
description: Monitor device messages and observe device twin changes through the IoT Central Explorer CLI.
author: viv-liu
ms.author: viviali
ms.date: 03/27/2020
ms.topic: how-to
ms.service: iot-central
services: iot-central
manager: corywink
---

# Monitor device connectivity using Azure CLI

*This topic applies to device developers and solution builders.*

Use the Azure CLI IoT extension to see messages your devices are sending to IoT Central and observe changes in the device twin. You can use this tool to debug and observe device connectivity and diagnose issues of device messages not reaching the cloud or devices not responding to twin changes.

[Visit the Azure CLI extensions reference for more details](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/central?view=azure-cli-latest)

## Prerequisites

+ Azure CLI installed and is version 2.0.7 or higher. Check the version of your Azure CLI by running `az --version`. Learn how to install and update from the [Azure CLI docs](https://docs.microsoft.com/cli/azure/install-azure-cli)
+ A work or school account in Azure, added as a user in an IoT Central application.

## Install the IoT Central extension

Run the following command from your command line to install:

```azurecli
az extension add --name azure-iot
```

Check the version of the extension by running:

```azurecli
az --version
```

You should see the azure-iot extension is 0.8.1 or higher. If it is not, run:

```azurecli
az extension update --name azure-iot
```

## Using the extension

The following sections describe common commands and options that you can use when you run
`az iot central`. To view the full set of commands and options, pass
`--help` to `az iot central` or any of its subcommands.

### Login

Start by signing into the Azure CLI. 

```azurecli
az login
```

### Get the Application ID of your IoT Central app
In **Administration/Application Settings**, copy the **Application ID**. You use this value in later steps.

### Monitor messages
Monitor the messages that are being sent to your IoT Central app from your devices. The output includes all headers and annotations.

```azurecli
az iot central app monitor-events --app-id <app-id> --properties all
```

### View device properties
View the current read and read/write device properties for a given device.

```azurecli
az iot central device-twin show --app-id <app-id> --device-id <device-id>
```

## Next steps

If you're a device developer, a suggested next step is to read about [Device connectivity in Azure IoT Central](./concepts-get-connected.md).
