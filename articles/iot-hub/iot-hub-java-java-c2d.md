<properties
	pageTitle="Send cloud-to-device messages with IoT Hub | Microsoft Azure"
	description="Follow this tutorial to learn how to send cloud-to-device messages using Azure IoT Hub with Java."
	services="iot-hub"
	documentationCenter="java"
	authors="dominicbetts"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="java"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="06/23/2016"
     ms.author="dobett"/>

# Tutorial: How to send cloud-to-device messages with IoT Hub and Java

[AZURE.INCLUDE [iot-hub-selector-c2d](../../includes/iot-hub-selector-c2d.md)]

## Introduction

Azure IoT Hub is a fully managed service that helps enable reliable and secure bi-directional communications between millions of IoT devices and an application back end. The [Get started with IoT Hub] tutorial shows how to create an IoT hub, provision a device identity in it, and code a simulated device that sends device-to-cloud messages.

This tutorial builds on [Get started with IoT Hub]. It shows you how to:

- From your application cloud back end, send cloud-to-device messages to a single device through IoT Hub.
- Receive cloud-to-device messages on a device.
- From your application cloud back end, request delivery acknowledgement (*feedback*) for messages sent to a device from IoT Hub.

You can find more information on cloud-to-device messages in the [IoT Hub Developer Guide][IoT Hub Developer Guide - C2D].

At the end of this tutorial, you will run two Java console applications:

* **simulated-device**, a modified version of the app created in [Get started with IoT Hub], which connects to your IoT hub and receives cloud-to-device messages.
* **send-c2d-messages**, which sends a cloud-to-device message to the simulated device through IoT Hub, and then receives its delivery acknowledgement.

> [AZURE.NOTE] IoT Hub has SDK support for many device platforms and languages (including C, Java, and Javascript) through Azure IoT device SDKs. For step-by-step instructions on how to connect your device to this tutorial's code, and generally to Azure IoT Hub, see the [Azure IoT Developer Center].

To complete this tutorial, you'll need the following:

+ Java SE 8. <br/> [Prepare your development environment][lnk-dev-setup] describes how to install Java for this tutorial on either Windows or Linux.

+ Maven 3.  <br/> [Prepare your development environment][lnk-dev-setup] describes how to install Maven for this tutorial on either Windows or Linux.

+ An active Azure account. (If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].)

## Receiving messages on the simulated device

In this section, you'll modify the simulated device application you created in [Get started with IoT Hub] to receive cloud-to-device messages from the IoT hub.

1. Using a text editor, open the simulated-device\src\main\java\com\mycompany\app\App.java file.

2. Add the following **MessageCallback** class as a nested class inside the **App** class. The **execute** method is invoked when the device receives a message from IoT Hub. In this example, the device always notifies the hub that it has completed the message:

    ```
    private static class MessageCallback implements
    com.microsoft.azure.iothub.MessageCallback {
      public IotHubMessageResult execute(Message msg, Object context) {
        System.out.println("Received message from hub: "
          + new String(msg.getBytes(), Message.DEFAULT_IOTHUB_MESSAGE_CHARSET));

        return IotHubMessageResult.COMPLETE;
      }
    }
    ```

3. Modify the **main** method to create a **MessageCallback** instance and call the **setMessageCallback** method before it opens the client as follows:

    ```
    client = new DeviceClient(connString, protocol);

    MessageCallback callback = new MessageCallback();
    client.setMessageCallback(callback, null);
    client.open();
    ```

    > [AZURE.NOTE] If you use HTTP/1 instead of AMQP as the transport, the **DeviceClient** instance checks for messages from IoT Hub infrequently (less than every 25 minutes). For more information about the differences between AMQP and HTTP/1 support, and IoT Hub throttling, see the [IoT Hub Developer Guide][IoT Hub Developer Guide - C2D].

## Send a cloud-to-device message from the app back end

In this section, you'll create a Java console app that sends cloud-to-device messages to the simulated device app. You need the device Id of the device you added in the [Get started with IoT Hub] tutorial and the connection string for your IoT hub which you can find in the [Azure portal].

1. Create a new Maven project called **send-c2d-messages** using the following command at your command-prompt. Note that this is a single, long command:

    ```
    mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=send-c2d-messages -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
    ```

2. At your command prompt, navigate to the new send-c2d-messages folder.

3. Using a text editor, open the pom.xml file in the send-c2d-messages folder and add the following dependency to the **dependencies** node. This enables you to use the **iothub-java-service-client** package in your application to communicate with your IoT hub service:

    ```
    <dependency>
      <groupId>com.microsoft.azure.iothub-java-client</groupId>
      <artifactId>iothub-java-service-client</artifactId>
      <version>1.0.7</version>
    </dependency>
    ```

4. Save and close the pom.xml file.

5. Using a text editor, open the send-c2d-messages\src\main\java\com\mycompany\app\App.java file.

6. Add the following **import** statements to the file:

    ```
    import com.microsoft.azure.iot.service.sdk.*;
    import java.io.IOException;
    import java.net.URISyntaxException;
    ```

7. Add the following class-level variables to the **App** class, replacing **{yourhubconnectionstring}** and **{yourdeviceid}** with the values your noted earlier:

    ```
    private static final String connectionString = "{yourhubconnectionstring}";
    private static final String deviceId = "{yourdeviceid}";
    private static final IotHubServiceClientProtocol protocol = IotHubServiceClientProtocol.AMQPS;
    ```
    
8. Replace the **main** method with the following code that connects to your IoT hub, sends a message to your device, and then waits for an acknowledgment that the device received and processed the message:

    ```
    public static void main(String[] args) throws IOException,
        URISyntaxException, Exception {
      ServiceClient serviceClient = ServiceClient.createFromConnectionString(
        connectionString, protocol);
      
      if (serviceClient != null) {
        serviceClient.open();
        FeedbackReceiver feedbackReceiver = serviceClient
          .getFeedbackReceiver(deviceId);
        if (feedbackReceiver != null) feedbackReceiver.open();

        Message messageToSend = new Message("Cloud to device message.");
        messageToSend.setDeliveryAcknowledgement(DeliveryAcknowledgement.Full);

        serviceClient.send(deviceId, messageToSend);
        System.out.println("Message sent to device");

        FeedbackBatch feedbackBatch = feedbackReceiver.receive(10000);
        if (feedbackBatch != null) {
          System.out.println("Message feedback received, feedback time: "
            + feedbackBatch.getEnqueuedTimeUtc().toString());
        }

        if (feedbackReceiver != null) feedbackReceiver.close();
        serviceClient.close();
      }
    }
    ```

    > [AZURE.NOTE] For simplicity's sake, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as exponential backoff), as suggested in the MSDN article [Transient Fault Handling].

## Run the applications

You are now ready to run the applications.

1. At a command-prompt in the simulated-device folder, run the following command to begin sending telemetry data to your IoT hub and to listen for cloud-to-device messages sent from your IoT hub:

    ```
    mvn exec:java -Dexec.mainClass="com.mycompany.app.App" 
    ```

    ![][img-simulated-device]

2. At a command-prompt in the send-c2d-messages folder, run the following command to send a cloud-to-device message and wait for a feedback acknowledgment:

    ```
    mvn exec:java -Dexec.mainClass="com.mycompany.app.App"
    ```

    ![][img-send-command]

## Next steps

In this tutorial, you learned how to send and receive cloud-to-device messages. 

To see examples of complete end-to-end solutions that use IoT Hub, see [Azure IoT Suite].

To learn more about developing solutions with IoT Hub, see the [IoT Hub Developer Guide].


<!-- Images -->
[img-simulated-device]: media/iot-hub-java-java-c2d/receivec2d.png
[img-send-command]:  media/iot-hub-java-java-c2d/sendc2d.png
<!-- Links -->

[Get started with IoT Hub]: iot-hub-java-java-getstarted.md
[IoT Hub Developer Guide - C2D]: iot-hub-devguide.md#c2d
[Process Device-to-Cloud messages]: iot-hub-csharp-csharp-process-d2c.md
[Uploading files from devices]: iot-hub-csharp-csharp-file-upload.md
[IoT Hub Overview]: iot-hub-what-is-iot-hub.md
[IoT Hub Guidance]: iot-hub-guidance.md
[IoT Hub Developer Guide]: iot-hub-devguide.md
[Supported device platforms and languages]: iot-hub-supported-devices.md
[Azure IoT Developer Center]: http://www.azure.com/develop/iot
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/get_started/java-devbox-setup.md
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
[Azure portal]: https://portal.azure.com
[Azure IoT Suite]: https://azure.microsoft.com/documentation/suites/iot-suite/