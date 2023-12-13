---
title: Send cloud-to-device messages (Java)
titleSuffix: Azure IoT Hub
description: How to send cloud-to-device messages from a back-end app and receive them on a device app using the Azure IoT SDKs for Java.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.devlang: java
ms.topic: how-to
ms.date: 05/30/2023
ms.custom: [amqp, mqtt, devx-track-java, devx-track-extended-java]
---

# Send cloud-to-device messages with IoT Hub (Java)

[!INCLUDE [iot-hub-selector-c2d](../../includes/iot-hub-selector-c2d.md)]

Azure IoT Hub is a fully managed service that helps enable reliable and secure bi-directional communications between millions of devices and a solution back end. 

This article shows you how to:

* Send cloud-to-device (C2D) messages from your solution backend to a single device through IoT Hub

* Receive cloud-to-device messages on a device

* Request delivery acknowledgment (*feedback*), from your solution backend, for messages sent to a device from IoT Hub

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

At the end of this article, you run two Java console apps:

* **HandleMessages**: a sample device app included with the [Microsoft Azure IoT SDK for Java](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples), which connects to your IoT hub and receives cloud-to-device messages.

* **SendCloudToDevice**: sends a cloud-to-device message to the device app through IoT Hub and then receives its delivery acknowledgment.

> [!NOTE]
> IoT Hub has SDK support for many device platforms and languages (C, Java, Python, and JavaScript) through the [Azure IoT device SDKs](iot-hub-devguide-sdks.md).

To learn more about cloud-to-device messages, see [Send cloud-to-device messages from an IoT hub](iot-hub-devguide-messages-c2d.md).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* An IoT hub in your Azure subscription. If you don't have a hub yet, you can follow the steps in [Create an IoT hub](iot-hub-create-through-portal.md).

* A device registered in your IoT hub. If you haven't registered a device yet, register one in the [Azure portal](iot-hub-create-through-portal.md#register-a-new-device-in-the-iot-hub).

* This article uses sample code from the [Azure IoT SDK for Java](https://github.com/Azure/azure-iot-sdk-java).

  * Download or clone the SDK repository from GitHub to your development machine.
  * Make sure that [Java SE Development Kit 8](/java/azure/jdk/) is installed on your development machine. Make sure you select **Java 8** under **Long-term support** to get to downloads for JDK 8.

* [Maven 3](https://maven.apache.org/download.cgi)

* Make sure that port 8883 is open in your firewall. The device sample in this article uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

## Get the device connection string

In this article, you run a sample app that simulates a device, which receives cloud-to-device messages sent through your IoT Hub. The **HandleMessages** sample app included with the [Microsoft Azure IoT SDK for Java](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples) connects to your IoT hub and acts as your simulated device. The sample uses the primary connection string of the registered device on your IoT hub. 

[!INCLUDE [iot-hub-include-find-device-connection-string](../../includes/iot-hub-include-find-device-connection-string.md)]

## Receive messages in the device app

In this section, run the **HandleMessages** sample device app to receive C2D messages sent through your IoT hub. Open a new command prompt and navigate to the **azure-iot-sdk-java\iothub\device\iot-device-samples\handle-messages** folder, under the folder where you expanded the Azure IoT Java SDK. Run the following commands, replacing the `{Your device connection string}` placeholder value with the device connection string you copied from the registered device in your IoT hub.

```cmd/sh
mvn clean package -DskipTests
java -jar ./target/handle-messages-1.0.0-with-deps.jar "{Your device connection string}"
```

The following output is from the sample device app after it successfully starts and connects to your IoT hub:
    
```cmd/sh
5/22/2023 11:13:18 AM> Press Control+C at any time to quit the sample.
     
Starting...
Beginning setup.
Successfully read input parameters.
Using communication protocol MQTT.
2023-05-23 09:51:06,062 INFO (main) [com.microsoft.azure.sdk.iot.device.transport.ExponentialBackoffWithJitter] - NOTE: A new instance of ExponentialBackoffWithJitter has been created with the following properties. Retry Count: 2147483647, Min Backoff Interval: 100, Max Backoff Interval: 10000, Max Time Between Retries: 100, Fast Retry Enabled: true
2023-05-23 09:51:06,187 DEBUG (main) [com.microsoft.azure.sdk.iot.device.ClientConfiguration] - Device configured to use software based SAS authentication provider
2023-05-23 09:51:06,187 INFO (main) [com.microsoft.azure.sdk.iot.device.transport.ExponentialBackoffWithJitter] - NOTE: A new instance of ExponentialBackoffWithJitter has been created with the following properties. Retry Count: 2147483647, Min Backoff Interval: 100, Max Backoff Interval: 10000, Max Time Between Retries: 100, Fast Retry Enabled: true
2023-05-23 09:51:06,202 DEBUG (main) [com.microsoft.azure.sdk.iot.device.DeviceClient] - Initialized a DeviceClient instance using SDK version 2.1.5
Successfully created an IoT Hub client.
Successfully set message callback.
2023-05-23 09:51:06,205 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.MqttIotHubConnection] - Opening MQTT connection...
2023-05-23 09:51:06,218 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sending MQTT CONNECT packet...
2023-05-23 09:51:07,308 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sent MQTT CONNECT packet was acknowledged
2023-05-23 09:51:07,308 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sending MQTT SUBSCRIBE packet for topic devices/US60536-device/messages/devicebound/#
2023-05-23 09:51:07,388 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sent MQTT SUBSCRIBE packet for topic devices/US60536-device/messages/devicebound/# was acknowledged
2023-05-23 09:51:07,388 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.MqttIotHubConnection] - MQTT connection opened successfully
2023-05-23 09:51:07,388 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - The connection to the IoT Hub has been established
2023-05-23 09:51:07,404 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Updating transport status to new status CONNECTED with reason CONNECTION_OK
2023-05-23 09:51:07,404 DEBUG (main) [com.microsoft.azure.sdk.iot.device.DeviceIO] - Starting worker threads
2023-05-23 09:51:07,408 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Invoking connection status callbacks with new status details

CONNECTION STATUS UPDATE: CONNECTED
CONNECTION STATUS REASON: CONNECTION_OK
CONNECTION STATUS THROWABLE: null

The connection was successfully established. Can send messages.
2023-05-23 09:51:07,408 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Client connection opened successfully
2023-05-23 09:51:07,408 INFO (main) [com.microsoft.azure.sdk.iot.device.DeviceClient] - Device client opened successfully
Opened connection to IoT Hub. Messages sent to this device will now be received.
Press any key to exit...

```

The `execute` method in the `AppMessageCallback` class returns `IotHubMessageResult.COMPLETE`. This status notifies IoT Hub that the message has been successfully processed and that the message can be safely removed from the device queue. The device should return this value when its processing successfully completes regardless of the protocol it's using.

With AMQP and HTTPS, but not MQTT, the device can also:

* Abandon a message, which results in IoT Hub retaining the message in the device queue for future consumption.
* Reject a message, which permanently removes the message from the device queue.

If something happens that prevents the device from completing, abandoning, or rejecting the message, IoT Hub will, after a fixed timeout period, queue the message for delivery again. For this reason, the message processing logic in the device app must be *idempotent*, so that receiving the same message multiple times produces the same result.

For more information about the cloud-to-device message lifecycle and how IoT Hub processes cloud-to-device messages, see [Send cloud-to-device messages from an IoT hub](iot-hub-devguide-messages-c2d.md).

> [!NOTE]
> If you use HTTPS instead of MQTT or AMQP as the transport, the **DeviceClient** instance checks for messages from IoT Hub infrequently (a minimum of every 25 minutes). For more information about the differences between MQTT, AMQP, and HTTPS support, see [Cloud-to-device communications guidance](iot-hub-devguide-c2d-guidance.md) and [Choose a communication protocol](iot-hub-devguide-protocols.md).

## Get the IoT hub connection string

In this article, you create a backend service to send cloud-to-device messages through your IoT Hub. To send cloud-to-device messages, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

[!INCLUDE [iot-hub-include-find-service-connection-string](../../includes/iot-hub-include-find-service-connection-string.md)]

## Send a cloud-to-device message

In this section, you create a Java console app that sends cloud-to-device messages to the simulated device app. You need the device ID from your device and your IoT hub connection string.

1. Create a Maven project called **send-c2d-messages** using the following command at your command prompt. Note this command is a single, long command:

    ```cmd/sh
    mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=send-c2d-messages -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
    ```

2. At your command prompt, navigate to the new send-c2d-messages folder.

3. Using a text editor, open the pom.xml file in the send-c2d-messages folder and add the following dependency to the **dependencies** node. Adding the dependency enables you to use the **iothub-java-service-client** package in your application to communicate with your IoT hub service:

    ```xml
    <dependency>
      <groupId>com.microsoft.azure.sdk.iot</groupId>
      <artifactId>iot-service-client</artifactId>
      <version>1.7.23</version>
    </dependency>
    ```

    > [!NOTE]
    > You can check for the latest version of **iot-service-client** using [Maven search](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22iot-service-client%22%20g%3A%22com.microsoft.azure.sdk.iot%22).

4. Save and close the pom.xml file.

5. Using a text editor, open the send-c2d-messages\src\main\java\com\mycompany\app\App.java file.

6. Add the following **import** statements to the file:

    ```java
    import com.microsoft.azure.sdk.iot.service.*;
    import java.io.IOException;
    import java.net.URISyntaxException;
    ```

7. Add the following class-level variables to the **App** class, replacing **{yourhubconnectionstring}** and **{yourdeviceid}** with the values you noted earlier:

    ```java
    private static final String connectionString = "{yourhubconnectionstring}";
    private static final String deviceId = "{yourdeviceid}";
    private static final IotHubServiceClientProtocol protocol =    
        IotHubServiceClientProtocol.AMQPS;
    ```

8. Replace the **main** method with the following code. This code connects to your IoT hub, sends a message to your device, and then waits for an acknowledgment that the device received and processed the message:

    ```java
    public static void main(String[] args) throws IOException,
        URISyntaxException, Exception {
      ServiceClient serviceClient = ServiceClient.createFromConnectionString(
        connectionString, protocol);

      if (serviceClient != null) {
        serviceClient.open();
        FeedbackReceiver feedbackReceiver = serviceClient
          .getFeedbackReceiver();
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

    > [!NOTE]
    > For simplicity, this article does not implement a retry policy. In production code, you should implement retry policies (such as exponential backoff) as suggested in the article [Transient Fault Handling](/azure/architecture/best-practices/transient-faults).

9. To build the **send-c2d-messages** app using Maven, execute the following command at the command prompt in the simulated-device folder:

    ```cmd/sh
    mvn clean package -DskipTests
    ```

## Run the applications

You're now ready to run the applications.

1. At a command prompt in the **azure-iot-sdk-java\iothub\device\iot-device-samples\handle-messages** folder, run the following commands, replacing the `{Your device connection string}` placeholder value with the device connection string you copied from the registered device in your IoT hub. This step starts the sample device app, which sends telemetry to your IoT hub and listens for cloud-to-device messages sent from your hub:

    ```cmd/sh
    java -jar ./target/handle-messages-1.0.0-with-deps.jar "{Your device connection string}"
    ```

    :::image type="content" source="./media/iot-hub-java-java-c2d/receivec2d.png" alt-text="Screenshot of the sample device app running in a console window." lightbox="./media/iot-hub-java-java-c2d/receivec2d.png":::

2. At a command prompt in the **send-c2d-messages** folder, run the following command to send a cloud-to-device message and wait for a feedback acknowledgment:

    ```cmd/sh
    mvn exec:java -Dexec.mainClass="com.mycompany.app.App"
    ```

    :::image type="content" source="./media/iot-hub-java-java-c2d/sendc2d.png" alt-text="Screenshot of the sample service app running in a console window." lightbox="./media/iot-hub-java-java-c2d/sendc2d.png":::

## Next steps

In article, you learned how to send and receive cloud-to-device messages.

* To learn more about cloud-to-device messages, see [Send cloud-to-device messages from an IoT hub](iot-hub-devguide-messages-c2d.md).

* To learn more about IoT Hub message formats, see [Create and read IoT Hub messages](iot-hub-devguide-messages-construct.md).
