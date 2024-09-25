---
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: java
ms.topic: include
ms.date: 06/20/2024
ms.custom: [amqp, mqtt, devx-track-java, devx-track-extended-java]
---

## Receive cloud-to-device messages

This section describes how to receive cloud-to-device messages using the [DeviceClient](/java/api/com.microsoft.azure.sdk.iot.device.deviceclient) class from the Azure IoT SDK for Java.

For a Java-based device application to receive cloud-to-device messages, it must connect to IoT Hub, then set up a callback listener and message handler to process incoming messages from IoT Hub. The device application should also be able to detect and handle disconnects in case the device-to-IoT Hub message connection is broken.

### Import Azure IoT Java SDK libraries

The code referenced in this article uses these SDK libraries.

```java
import com.microsoft.azure.sdk.iot.device.*;
import com.microsoft.azure.sdk.iot.device.exceptions.IotHubClientException;
import com.microsoft.azure.sdk.iot.device.transport.IotHubConnectionStatus;
```

### Declare a DeviceClient object

The [DeviceClient](/java/api/com.microsoft.azure.sdk.iot.device.deviceclient?#com-microsoft-azure-sdk-iot-device-deviceclient-deviceclient(java-lang-string-com-microsoft-azure-sdk-iot-device-iothubclientprotocol)) object instantiation requires these parameters:

* **connString** - The IoT device connection string. The connection string is a set of key-value pairs that are separated by ';', with the keys and values separated by '='. It should contain values for these keys: `HostName, DeviceId, and SharedAccessKey`.
* **Transport protocol** - The `DeviceClient` connection can use one of the following [IoTHubClientProtocol](/java/api/com.microsoft.azure.sdk.iot.device.iothubclientprotocol) transport protocols. `AMQP` is the most versatile, allows for checking messages frequently, and allows for message rejection and cancel. MQTT doesn't support message rejection or abandon methods:
  * `AMQPS`
  * `AMQPS_WS`
  * `HTTPS`
  * `MQTT`
  * `MQTT_WS`

For example:

```java
static string connectionString = "{a device connection string}";
static protocol = IotHubClientProtocol.AMQPS;
DeviceClient client = new DeviceClient(connectionString, protocol);
```

### Set the message callback method

Use the [setMessageCallback](/java/api/com.microsoft.azure.sdk.iot.device.deviceclient?com-microsoft-azure-sdk-iot-device-deviceclient-setmessagecallback(com-microsoft-azure-sdk-iot-device-messagecallback-java-lang-object)) method to define a message handler method that is notified when a message is received from IoT Hub.

`setMessageCallback` includes these parameters:

* `callback` - The callback method name. Can be `null`.
* `context` - An *optional* context of type `object`. Use `null` if unspecified.

In this example, a `callback` method named `MessageCallback` with no context parameter is passed to `setMessageCallback`.

```java
client.setMessageCallback(new MessageCallback(), null);
```

### Create a message callback handler

A callback message handler receives and processes an incoming message passed from the IoT Hub messages queue.

In this example, the message handler processes an incoming message and then returns [IotHubMessageResult.COMPLETE](/java/api/com.microsoft.azure.sdk.iot.device.iothubmessageresult). A `IotHubMessageResult.COMPLETE` return value notifies IoT Hub that the message is successfully processed and that the message can be safely removed from the device queue. The device should return `IotHubMessageResult.COMPLETE` when its processing successfully completes, notifying IoT Hub that the message should be removed from the message queue, regardless of the protocol it's using.

```java
  protected static class MessageCallback implements com.microsoft.azure.sdk.iot.device.MessageCallback
  {
      public IotHubMessageResult onCloudToDeviceMessageReceived(Message msg, Object context)
      {
          System.out.println(
                  "Received message with content: " + new String(msg.getBytes(), Message.DEFAULT_IOTHUB_MESSAGE_CHARSET));
          // Notify IoT Hub that the message
          return IotHubMessageResult.COMPLETE;
      }
  }
```

### Message abandon and rejection options

Though the vast number of incoming messages to a device should be successfully received and result in `IotHubMessageResult.COMPLETE`, it may be necessary to abandon or reject a message.

* With AMQP and HTTPS, but not MQTT, an application can:
  * `IotHubMessageResult.ABANDON` the message. IoT hub requeues it and sends it again later.
  * `IotHubMessageResult.REJECT` the message. IoT hub doesn't requeue the message and permanently removes the message from the message queue.
* Clients using `MQTT` or `MQTT_WS` cannot `ABANDON` or `REJECT` messages.

If something happens that prevents the device from completing, abandoning, or rejecting the message, IoT Hub will, after a fixed timeout period, queue the message for delivery again. For this reason, the message processing logic in the device app must be *idempotent*, so that receiving the same message multiple times produces the same result.

For more information about the cloud-to-device message lifecycle and how IoT Hub processes cloud-to-device messages, see [Send cloud-to-device messages from an IoT hub](../articles/iot-hub/iot-hub-devguide-messages-c2d.md).

> [!NOTE]
> If you use HTTPS instead of MQTT or AMQP as the transport, the **DeviceClient** instance checks for messages from IoT Hub infrequently (a minimum of every 25 minutes). For more information about the differences between MQTT, AMQP, and HTTPS support, see [Cloud-to-device communications guidance](../articles/iot-hub/iot-hub-devguide-c2d-guidance.md) and [Choose a communication protocol](../articles/iot-hub/iot-hub-devguide-protocols.md).

### Create the message state callback method

An application can use [registerConnectionStatusChangeCallback](/java/api/com.microsoft.azure.sdk.iot.device.internalclient?com-microsoft-azure-sdk-iot-device-internalclient-registerconnectionstatuschangecallback(com-microsoft-azure-sdk-iot-device-iothubconnectionstatuschangecallback-java-lang-object)) to register a callback method to be executed when the connection status of the device changes. This way the application can detect a downed messages connection and attempt to reconnect.

In this example, `IotHubConnectionStatusChangeCallbackLogger` is registered as the connection status change callback method.

```java
client.registerConnectionStatusChangeCallback(new IotHubConnectionStatusChangeCallbackLogger(), new Object());
```

The callback is fired and passed a `ConnectionStatusChangeContext` object.

Call `connectionStatusChangeContext.getNewStatus()` to get the current connection state.

```java
IotHubConnectionStatus status = connectionStatusChangeContext.getNewStatus();
```

The connection state returned can be one of these values:

* `IotHubConnectionStatus.DISCONNECTED`
* `IotHubConnectionStatus.DISCONNECTED_RETRYING`
* `IotHubConnectionStatus.CONNECTED`

Call `connectionStatusChangeContext.getNewStatusReason()` to get the reason for the connection status change.

```java
IotHubConnectionStatusChangeReason statusChangeReason = connectionStatusChangeContext.getNewStatusReason();
```

Call `connectionStatusChangeContext.getCause()` to find the reason for the connection status change. `getCause()` may return `null` if no information is available.

```java
Throwable throwable = connectionStatusChangeContext.getCause();
if (throwable != null)
    throwable.printStackTrace();
```

See the **HandleMessages** sample listed in the **SDK receive message sample** section of this article for a complete sample showing how to extract the status change callback method connection status change status, reason why the device status changed, and context.

### Open the connection between device and IoT Hub

Use [open](/java/api/com.microsoft.azure.sdk.iot.device.deviceclient) to create a connection between the device and IoT Hub. The device can now asynchronously send and receive messages to and from an IoT Hub. If the client is already open, the method does nothing.

```java
client.open(true);
```

### SDK receive message sample

**HandleMessages**: a sample device app included with the [Microsoft Azure IoT SDK for Java](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples), which connects to your IoT hub and receives cloud-to-device messages.

## Send cloud-to-device messages

This section describes how to send a cloud-to-device message using the [ServiceClient](/java/api/com.azure.core.annotation.serviceclient) class from the Azure IoT SDK for Java. A solution backend application connects to an IoT Hub and messages are sent to IoT Hub encoded with a destination device. IoT Hub stores incoming messages to its message queue, and messages are delivered from the IoT Hub message queue to the target device.

A solution backend application can also request and receive delivery feedback for a message sent to IoT Hub that is destined for device delivery via the message queue.

### Add the dependency statement

Add the dependency to use the **iothub-java-service-client** package in your application to communicate with your IoT hub service:

```xml
<dependency>
  <groupId>com.microsoft.azure.sdk.iot</groupId>
  <artifactId>iot-service-client</artifactId>
  <version>1.7.23</version>
</dependency>
```

### Add import statements

Add these **import** statements to use the Azure IoT Java SDK and exception handler.

```java
import com.microsoft.azure.sdk.iot.service.*;
import java.io.IOException;
import java.net.URISyntaxException;
```

### Define the connection protocol

Use [IotHubServiceClientProtocol](/java/api/com.microsoft.azure.sdk.iot.service.iothubserviceclientprotocol) to define the application-layer protocol used by the service client to communicate with an IoT Hub.

`IotHubServiceClientProtocol` only accepts the `AMQPS` or `AMQPS_WS` enum.

```java
private static final IotHubServiceClientProtocol protocol =    
    IotHubServiceClientProtocol.AMQPS;
```

### Create the ServiceClient object

Create the [ServiceClient](/java/api/com.azure.core.annotation.serviceclient) object, supplying the Iot Hub connection string and protocol.

```java
private static final String connectionString = "{yourhubconnectionstring}";
private static final ServiceClient serviceClient (connectionString, protocol);
```

### Open the connection between application and IoT Hub

[open](/java/api/com.microsoft.azure.sdk.iot.service.serviceclient?#com-microsoft-azure-sdk-iot-service-serviceclient-open()) the AMQP sender connection. This method creates the connection between the application and IoT Hub.

```java
serviceClient.open();
```

### Open a feedback receiver for message delivery feedback

You can use a [FeedbackReceiver](/java/api/com.microsoft.azure.sdk.iot.service.feedbackreceiver) to get sent message delivery to IoT Hub feedback. A `FeedbackReceiver` is a specialized receiver whose `Receive` method returns a `FeedbackBatch` instead of a `Message`.

In this example, the `FeedbackReceiver` object is created and the `open()` statement is called to await feedback.

```java
FeedbackReceiver feedbackReceiver = serviceClient
  .getFeedbackReceiver();
if (feedbackReceiver != null) feedbackReceiver.open();
```

### Add message properties

You can optionally use [setProperties](/java/api/com.microsoft.azure.sdk.iot.service.messaging.message) to add message properties. These properties are included in the message sent to the device and can be extracted by the device application upon receipt.

```java
Map<String, String> propertiesToSend = new HashMap<String, String>();
propertiesToSend.put(messagePropertyKey,messagePropertyKey);
messageToSend.setProperties(propertiesToSend);
```

### Create and send an asynchronous message

The [Message](/java/api/com.microsoft.azure.sdk.iot.service.message) object stores the message to be sent. In this example, a "Cloud to device message" is delivered.

Use [setDeliveryAcknowledgement](/java/api/com.microsoft.azure.sdk.iot.service.message?#com-microsoft-azure-sdk-iot-service-message-setdeliveryacknowledgementfinal(com-microsoft-azure-sdk-iot-service-deliveryacknowledgement)) to request delivered/not delivered to IoT Hub message queue acknowledgment. In this example, the acknowledgment requested is `Full`, either delivered or not delivered.

Use [SendAsync](/java/api/com.microsoft.azure.sdk.iot.service.serviceclient) to send an asynchronous message from the client to the device. Alternatively, you can use the `Send` (not async) method, but this function is synchronized internally so that only one send operation is allowed at a time. The message is delivered from the application to IoT Hub. IoT Hub puts the message into the message queue, ready to be delivered to the target device.

```java
Message messageToSend = new Message("Cloud to device message.");
messageToSend.setDeliveryAcknowledgementFinal(DeliveryAcknowledgement.Full);
serviceClient.sendAsync(deviceId, messageToSend);
```

## Receive message delivery feedback

After a message is sent from the application, the application can call [receive](/java/api/com.microsoft.azure.sdk.iot.service.feedbackreceiver?#com-microsoft-azure-sdk-iot-service-feedbackreceiver-receive(long)) with or without a timeout value. If a timeout value is not supplied, the default timeout is used. This passes back a [FeedbackBatch](/java/api/com.microsoft.azure.sdk.iot.service.messaging.feedbackbatch) object that contains message delivery feedback properties that can be examined.

This example creates the `FeedbackBatch` receiver and calls [getEnqueuedTimeUtc](/java/api/com.microsoft.azure.sdk.iot.service.feedbackbatch?com-microsoft-azure-sdk-iot-service-feedbackbatch-getenqueuedtimeutc()), printing the message enqueued time.

```java
FeedbackBatch feedbackBatch = feedbackReceiver.receive(10000);
if (feedbackBatch != null) {
  System.out.println("Message feedback received, feedback time: "
    + feedbackBatch.getEnqueuedTimeUtc().toString());
}
```

### SDK send message samples

* [Service client sample](/java/api/overview/azure/iot?example) - Send message example, #1.

* [Service client sample](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/service/samples/getting%20started/ServiceClientSample) - Send message example, #2.
