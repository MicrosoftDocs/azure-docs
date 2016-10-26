<properties
 pageTitle="Read messages persisted in Azure Storage | Microsoft Azure"
 description="Monitor the device-to-cloud messages as they are written to your Azure Table storage."
 services="iot-hub"
 documentationCenter=""
 authors="shizn"
 manager="timlt"
 tags=""
 keywords=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="10/21/2016"
 ms.author="xshi"/>

# Read messages persisted in Azure Storage

## What you will do

Monitor the device-to-cloud messages that are sent from Raspberry Pi 3 to your hub as the messages are written to your Azure Table storage. If you have any problems, look for solutions on the [troubleshooting page](iot-hub-raspberry-pi-kit-node-troubleshooting.md).

## What you will learn

In this article, you will learn how to use the gulp read-message task to read messages persisted in your Azure Table storage.

## What you need

Before starting this process, you must have successfully completed [Run the Azure blink sample application on your Raspberry Pi 3](iot-hub-raspberry-pi-kit-node-lesson3-run-azure-blink.md).

## Read new messages from your storage account

In the previous article, you ran a sample application on your Pi. The sample application sent messages to Azure IoT hub. The messages sent to your hub are stored into your Azure Table storage via the Azure function app. You need the Azure storage connection string to read messages from your Azure Table storage.

To read messages stored in your Azure Table storage, follow these steps:

1. Get the connection string by running the following commands:

    ```bash
    az storage account list -g iot-sample --query [].name
    az storage account show-connection-string -g iot-sample -n {storage name}
    ```

    The first command retrieves the `storage name` that is used in the second command to get the connection string. `iot-sample` is the default value of `{resource group name}`.

2. Open the configuration file `config-raspberrypi.json` in Visual Studio Code by running the following command:

    ```bash
    # For Windows command prompt
    code %USERPROFILE%\.iot-hub-getting-started\config-raspberrypi.json

    # For macOS or Ubuntu
    code ~/.iot-hub-getting-started/config-raspberrypi.json
    ```

3. Replace `[Azure storage connection string]` with the connection string you got in Step 1.
4. Save the `config-raspberrypi.json` file.
5. Send messages again and read them from your Azure Table storage by running the following command:

    ```bash
    gulp run --read-storage
    ```

    The logic for reading from Azure table storage is in the `azure-table.js` file.

    ![gulp run --read-storage](media/iot-hub-raspberry-pi-lessons/lesson3/gulp_read_message.png)

## Summary

You've successfully connected Pi to your hub in the cloud and used the blink sample application to send device-to-cloud messages. You also used the Azure function app to store incoming hub messages to your Azure Table storage. You can move on to the next article about how to send cloud-to-device messages from your hub to Pi.

## Next steps

[Send cloud-to-device messages](iot-hub-raspberry-pi-kit-node-lesson4-send-cloud-to-device-messages.md)
