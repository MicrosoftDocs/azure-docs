---
title: Manage Azure IoT Hub cloud device messaging with iothub-explorer | Microsoft Docs
description: Learn how to use the iothub-explorer CLI tool to monitor device to cloud (D2C) messages and send cloud to device (C2D) messages in Azure IoT Hub.
services: iot-hub
documentationcenter: ''
author: shizn
manager: timtl
tags: ''
keywords: 'iothub explorer, cloud device messaging, iot hub cloud to device, cloud to device messaging'

ms.assetid: 04521658-35d3-4503-ae48-51d6ad3c62cc
ms.service: iot-hub
ms.devlang: arduino
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/27/2017
ms.author: xshi

---
# Use iothub-explorer to send and receive messages between your device and IoT Hub

![End-to-end diagram](media/iot-hub-get-started-e2e-diagram/2.png)

[!INCLUDE [iot-hub-get-started-note](../../includes/iot-hub-get-started-note.md)]

[iothub-explorer](https://github.com/azure/iothub-explorer) has a handful of commands that makes IoT Hub management easier. This tutorial focuses on how to use iothub-explorer to send and receive messages between your device and your IoT hub.

## What you will learn

You learn how to use iothub-explorer to monitor device-to-cloud messages and to send cloud-to-device messages. Device-to-cloud messages could be sensor data that your device collects and then sends to your IoT hub. Cloud-to-device messages could be commands that your IoT hub sends to your device to blink an LED that is connected to your device.

## What you will do

- Use iothub-explorer to monitor device-to-cloud messages.
- Use iothub-explorer to send cloud-to-device messages.

## What you need

- Tutorial [Setup your device](iot-hub-raspberry-pi-kit-node-get-started.md) completed which covers the following requirements:
  - An active Azure subscription.
  - An Azure IoT hub under your subscription.
  - A client application that sends messages to your Azure IoT hub.
- iothub-explorer. ([Install iothub-explorer](https://github.com/azure/iothub-explorer))

## Monitor device-to-cloud messages

To monitor messages that are sent from your device to your IoT hub, follow these steps:

1. Open a console window.
1. Run the following command:

   ```bash
   iothub-explorer monitor-events <device-id> --login "<IoTHubConnectionString>"
   ```

   > [!Note]
   > Get `<device-id>` and `<IoTHubConnectionString>` from your IoT hub. Make sure you've finished the previous tutorial. Or you can try to use `iothub-explorer monitor-events <device-id> --login "HostName=<my-hub>.azure-devices.net;SharedAccessKeyName=<my-policy>;SharedAccessKey=<my-policy-key>"` if you have `HostName`, `SharedAccessKeyName` and `SharedAccessKey`.

## Send cloud-to-device messages

To send a message from your IoT hub to your device, follow these steps:

1. Open a console window.
1. Start a session on your IoT hub by running the following command:

   ```bash
   iothub-explorer login `<IoTHubConnectionString>`
   ```

1. Send a message to your device by running the following command:

   ```bash
   iothub-explorer send <device-id> <message>
   ```

The command blinks the LED that is connected to your device and sends the message to your device.

> [!Note]
> There is no need for the device to send a separate ack command back to your IoT hub upon receiving the message.

## Next steps

You’ve learned how to monitor device-to-cloud messages and send cloud-to-device messages between your IoT device and Azure IoT Hub.

[!INCLUDE [iot-hub-get-started-next-steps](../../includes/iot-hub-get-started-next-steps.md)]
