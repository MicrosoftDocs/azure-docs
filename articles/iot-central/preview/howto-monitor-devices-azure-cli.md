---
title: Monitor device connectivity using the Azure IoT Central Explorer
description: Monitor device messages and observe device twin changes through the IoT Central Explorer CLI.
author: viv-liu
ms.author: viviali
ms.date: 09/27/2019
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: corywink
---

# Monitor device connectivity using Azure CLI (preview features)

*This topic applies to builders and administrators.*

Use the Azure CLI IoT extension to see messages your devices are sending to IoT Central and observe changes in the device twin. You can use this tool to debug and observe device connectivity and diagnose issues of device messages not reaching the cloud or devices not responding to twin changes.

[Visit the Azure CLI extensions reference for more details](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/central)

## Prerequisites

+ Azure CLI installed and is version 2.0.7 or higher. Check the version of your Azure CLI by running `az --version`. Learn how to install and update from the [Azure CLI docs](https://docs.microsoft.com/cli/azure/install-azure-cli)
+ A work or school account in Azure, added as a user in an IoT Central application.

## Install the IoT Central extension

Run the following command from your command line to install:

```cmd/sh
az extension add --name azure-cli-iot-ext
```

Check the version of the extension by running 
```cmd/sh
az --version
```
You should see the azure-cli-iot-ext extension is 0.8.1 or higher. If it is not, run
```cmd/sh
az extension update --name azure-cli-iot-ext
```

## Using the extension

The following sections describe common commands and options that you can use when you run
`az iot central`. To view the full set of commands and options, pass
`--help` to `az iot central` or any of its subcommands.

### Login

Start by signing into the Azure CLI. 

```cmd/sh
az login
```

### Get the Application ID of your IoT Central app
In **Administration/Application Settings**, copy the **Application ID**. You will use this in later steps.

### Monitor messages
Monitor the messages that are being sent to your IoT Central app from your devices. This will include all headers and annotations.

```cmd/sh
az iot central app monitor-events --app-id <app-id> --properties all
```

### View device properties
View the current read and read/write device properties for a given device.

```cmd/sh
az iot central device-twin show --app-id <app-id> --device-id <device-id>
```

## Next steps

Now that you've learned how to use the IoT Central Explorer, the suggested next step is to explore [managing devices IoT Central](howto-manage-devices.md).
