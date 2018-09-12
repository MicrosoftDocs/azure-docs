---
title: Monitor device connectivity using the IoT Central Explorer CLI
description: Monitor device messages and observe device twin changes through the IoT Central Explorer CLI.
author: viv-liu
ms.author: viviali
ms.date: 09/06/2018
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: peterpr
---

# Monitor device connectivity using the IoT Central Explorer CLI

Use the IoT Central Explorer CLI to see messages your devices are sending to IoT Central and observe changes in the IoT Hub twin. You can use this open source tool to gain deeper insight into the state of device connectivity and diagnose issues of device messages not reaching the cloud or devices not responding to twin changes.

## [Go to Github to get the IoTC Explorer](https://aka.ms/iotciotcexplorercligithub)

## Prerequisites
+ Node.js version 8.x or higher - https://nodejs.org
+ You will need Administrator access to generate an access token

## How to use the IoTC Explorer

### Installing

Run the following from your command
line to install:

```
npm install -g iotc-explorer
```

*NOTE: You will typically need to run the install command with `sudo` in
Unix-like environments.*

Once installed, you can run `iotc-explorer --help` to verify everything is
working and get an overview of the available commands:

```
$ iotc-explorer --help

iotc-explorer <command>

Commands:
  iotc-explorer config                       Manage configuration values for the CLI
  iotc-explorer get-twin <deviceId>          Get the IoT Hub device twin for a specific device
  iotc-explorer login [token]                Log in to an Azure IoT Central application
  iotc-explorer monitor-messages [deviceId]  Monitor messages being sent to a specific device (if
                                             device id is provided), or all devices

Options:
  --version  Show version number                                                           [boolean]
  --help     Show help                                                                     [boolean]
```

### Running `iotc-explorer`

Below are some commands and common options that you can run when using
`iotc-explorer`. To view the full set of commands and options, you can pass
`--help` to `iotc-explorer` or any of its subcommands.

#### Login

Before you get going, you need to have an administrator of your IoT Central application to get an access token for you to use. The administrator takes the following steps:
- Go to **Administration/Access Tokens**. 
- Click **Generate**, and enter a Token name.  
- Click **Next**, and **copy the Token value**.
> NOTE: The Token value will only be shown once, so it must be copied before closing the dialog. After closing the dialog, it will never be shown again.

You can then use that token to
log in to the CLI by running:

```sh
iotc-explorer login "SharedAccessSignature sr=<your-resource>&sig=<your-signature>&skn=<your-key-name>&se=<your-expiry>"
```

If you would rather not have the token persisted in your shell history, you can
leave the token out and instead provide it when prompted:

```
iotc-explorer login
```

#### Monitor Device Messages

You can watch the messages coming from either a specific device or all devices
in your application using the `monitor-messages` command. This will start a
watcher that will continuously output new messages as they come in.

To watch all devices in your application, simply run:

```
iotc-explorer monitor-messages
```

To watch a specific device, just add the device's id to the end of the command:

```
iotc-explorer monitor-messages <your-device-id>
```

You can also have the command output a more machine-friendly format by adding
the `--raw` option to the command:

```
iotc-explorer monitor-messages --raw
```

#### Get Device Twin

You can use the `get-twin` command to get the contents of the twin for an IoT
Central device. To do so, simply run the following:

```
iotc-explorer get-twin <your-device-id>
```

As with `monitor-messages`, you can get a more machine-friendly output by
passing the `--raw` option:

```
iotc-explorer get-twin <your-device-id> --raw
```

## Next steps
Now that you have learned how to use the IoT Central Explorer, the suggested next step is to explore [managing devices IoT Central](howto-manage-devices.md).
