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

Use the Azure CLI IoT extension to see messages your devices are sending to IoT Central and observe changes in the device twin. You can use this tool to debug and observe of device connectivity and diagnose issues of device messages not reaching the cloud or devices not responding to twin changes.

[Visit the Azure CLI extensions reference for more details](https://docs.microsoft.com/en-us/cli/azure/ext/azure-cli-iot-ext/iotcentral)

## Prerequisites

+ Azure CLI installed and is version 2.0.7 or higher. Check the version of your Azure CLI by running. Learn how to install and update from the [Azure CLI docs](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
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


Before you get going, you need to have an administrator of your IoT Central application to get an access token for you to use. The administrator takes the following steps:

1. Navigate to **Administration** then **Access Tokens**.
1. Select **Generate Token**.
    ![Access token page screenshot](media/howto-use-iotc-explorer/accesstokenspage.png)

1. Enter a Token name, select **Next**, and then **Copy**.
    > [!NOTE]
    > The token value is only shown once, so it must be copied before closing the dialog. After closing the dialog, it is never shown again.

    ![Copy access token dialog screenshot](media/howto-use-iotc-explorer/copyaccesstoken.png)

You can use the token to log in to the CLI as follows:

```cmd/sh
iotc-explorer login "<Token value>"
```

If you prefer to not have the token persisted in your shell history, you can
leave the token out and instead provide it when prompted:

```cmd/sh
iotc-explorer login
```

### Monitor device messages

You can watch the messages coming from either a specific device or all devices
in your application using the `monitor-messages` command. This command starts a
watcher that continuously outputs new messages as they arrive:

To watch all devices in your application, run the following command:

```cmd/sh
iotc-explorer monitor-messages
```

Output:

![monitor-messages command output](media/howto-use-iotc-explorer/monitormessages.png)

To watch a specific device, just add the device id to the end of the command:

```cmd/sh
iotc-explorer monitor-messages <your-device-id>
```

You can also output a more machine-friendly format by adding
the `--raw` option to the command:

```cmd/sh
iotc-explorer monitor-messages --raw
```

### Get device twin

You can use the `get-twin` command to get the contents of the twin for an IoT
Central device. To do so, run the following command:

```cmd/sh
iotc-explorer get-twin <your-device-id>
```

Output:

![get-twin command output](media/howto-use-iotc-explorer/getdevicetwin.png)

As with `monitor-messages`, you can get a more machine-friendly output by
passing the `--raw` option:

```cmd/sh
iotc-explorer get-twin <your-device-id> --raw
```

## Next steps

Now that you've learned how to use the IoT Central Explorer, the suggested next step is to explore [managing devices IoT Central](howto-manage-devices.md).
