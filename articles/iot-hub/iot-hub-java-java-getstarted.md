<properties
	pageTitle="Get started with Azure IoT Hub for Java | Microsoft Azure"
	description="Follow this tutorial to get started using Azure IoT Hub with Java."
	services="iot-hub"
	documentationCenter="java"
	authors="dominicbetts"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="java"
     ms.topic="hero-article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="03/22/2016"
     ms.author="dobett"/>

# Get started with Azure IoT Hub for Java

[AZURE.INCLUDE [iot-hub-selector-get-started](../../includes/iot-hub-selector-get-started.md)]

## Introduction

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and a solution back end. One of the biggest challenges IoT projects face is how to reliably and securely connect devices to the solution back end. To address this challenge, IoT Hub:

- Offers reliable device-to-cloud and cloud-to-device hyper-scale messaging.
- Enables secure communications using per-device security credentials and access control.
- Includes device libraries for the most popular languages and platforms.

This tutorial shows you how to:

- Use the Azure portal to create an IoT hub.
- Create a device identity in your IoT hub.
- Create a simulated device that sends telemetry to your cloud back end.

At the end of this tutorial you will have three Java console applications:

* **create-device-identity**, which creates a device identity and associated security key to connect your simulated device.
* **read-d2c-messages**, which displays the telemetry sent by your simulated device.
* **simulated-device**, which connects to your IoT hub with the device identity created earlier, and sends a telemetry message every second.

> [AZURE.NOTE] The article [IoT Hub SDKs][lnk-hub-sdks] provides information about the various SDKs that you can use to build both applications to run on devices and your solution back end.

To complete this tutorial you'll need the following:

+ Java SE 8. <br/> [Prepare your development environment][lnk-dev-setup] describes how to install Java for this tutorial on either Windows or Linux.

+ Maven 3.  <br/> [Prepare your development environment][lnk-dev-setup] describes how to install Maven for this tutorial on either Windows or Linux.

+ An active Azure account. <br/>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].

## Create an IoT hub

You need to create an IoT Hub for you simulated device to connect to. The following steps show you how to complete this task using the Azure portal.

1. Sign in to the [Azure portal][lnk-portal].

2. In the Jumpbar, click **New**, then click **Internet of Things**, and then click **Azure IoT Hub**.

    ![][1]

3. In the **IoT hub** blade, choose the configuration for your IoT hub.

    ![][2]

    * In the **Name** box, enter a name for your IoT hub. If the **Name** is valid and available, a green check mark appears in the **Name** box.
    * Select a **Pricing and scale tier**. This tutorial does not require a specific tier.
    * In **Resource group**, create a new resource group, or select an existing one. For more information, see [Using resource groups to manage your Azure resources][lnk-resource-groups].
    * In **Location**, select the location to host your IoT hub.  

4. When you have chosen your IoT hub configuration options, click **Create**.  It can take a few minutes for Azure to create your IoT hub. To check the status, you can monitor the progress on the Startboard or in the Notifications panel.

    ![][3]

5. When the IoT hub has been created successfully, open the blade of the new IoT hub, make a note of the **Hostname**, and then click the **Keys** icon.

    ![][4]

6. Click the **iothubowner** policy, then copy and make note of the connection string in the **iothubowner** blade.

    ![][5]

7. Click **Settings** on the IoT Hub blade, then **Messaging** on the **Settings** blade. On the **Messaging** blade, make a note of the **Event Hub-compatible name** and the **Event Hub-compatible endpoint**. You will need these values when you create your **read-d2c-messages** application.

    ![][6]

You have now created your IoT hub and you have the IoT Hub hostname, IoT Hub connection string, Event Hub-compatible name, and Event-Hub compatible endpoint you need to complete the rest of this tutorial.

[AZURE.INCLUDE [iot-hub-get-started-cloud-java](../../includes/iot-hub-get-started-cloud-java.md)]


[AZURE.INCLUDE [iot-hub-get-started-device-java](../../includes/iot-hub-get-started-device-java.md)]

## Run the applications

You are now ready to run the applications.

1. At a command-prompt in the read-d2c folder, run the following command to begin monitoring your IoT hub:

    ```
    mvn exec:java -Dexec.mainClass="com.mycompany.app.App" 
    ```

    ![][7]

2. At a command-prompt in the simulated-device folder, run the following command to begin sending telemetry data to your IoT hub:

    ```
    mvn exec:java -Dexec.mainClass="com.mycompany.app.App" 
    ```

    ![][8]

## Next steps

In this tutorial, you configured a new IoT hub in the portal and then created a device identity in the hub's identity registry. You used this device identity to in a simulated device that sends device-to-cloud messages to the hub and created another app that displays the messages received by the hub. You can continue to explore IoT hub features and other IoT scenarios in the following tutorials:

- [Send Cloud-to-Device messages with IoT Hub][lnk-c2d-tutorial] shows how to send messages to devices, and process the delivery feedback produced by IoT Hub.
- [Process Device-to-Cloud messages][lnk-process-d2c-tutorial] shows how to reliably process telemetry and interactive messages coming from devices.
- [Uploading files from devices][lnk-upload-tutorial] describes a pattern that makes use of cloud-to-device messages to facilitate file uploads from devices.

<!-- Images. -->
[1]: ./media/iot-hub-java-java-getstarted/create-iot-hub1.png
[2]: ./media/iot-hub-java-java-getstarted/create-iot-hub2.png
[3]: ./media/iot-hub-java-java-getstarted/create-iot-hub3.png
[4]: ./media/iot-hub-java-java-getstarted/create-iot-hub4.png
[5]: ./media/iot-hub-java-java-getstarted/create-iot-hub5.png
[6]: ./media/iot-hub-java-java-getstarted/create-iot-hub6.png
[7]: ./media/iot-hub-java-java-getstarted/runapp1.png
[8]: ./media/iot-hub-java-java-getstarted/runapp2.png

<!-- Links -->
[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdks/blob/master/java/device/doc/devbox_setup.md
[lnk-c2d-tutorial]: iot-hub-csharp-csharp-c2d.md
[lnk-process-d2c-tutorial]: iot-hub-csharp-csharp-process-d2c.md
[lnk-upload-tutorial]: iot-hub-csharp-csharp-file-upload.md

[lnk-hub-sdks]: iot-hub-sdks-summary.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-resource-groups]: resource-group-portal.md
[lnk-portal]: https://portal.azure.com/