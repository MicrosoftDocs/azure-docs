---
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: include
ms.date: 06/20/2024
ms.custom: [amqp, mqtt, "Role: Cloud Development", "Role: IoT Device", devx-track-csharp, devx-track-dotnet]
---

## Receive cloud-to-device messages

This section describes how to receive cloud-to-device messages using the [DeviceClient](/dotnet/api/microsoft.azure.devices.client.deviceclient) class in the Azure IoT SDK for .NET.

There are two options that a device client application can use to receive messages:

* **Polling**: The device application checks for new IoT Hub messages using a code loop (for example, a `while` or `for` loop). The loop executes continually, checking for messages.
* **Callback**: The device application sets up an asynchronous message handler method that is called immediately when a message arrives.

### Declare a DeviceClient object

[DeviceClient](/dotnet/api/microsoft.azure.devices.client.deviceclient) includes methods and properties necessary to receive messages from IoT Hub.

For example:

```csharp
static DeviceClient deviceClient;
```

### Supply the connection parameters

Supply the IoT Hub primary connection string and Device ID to `DeviceClient` using the [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.client.deviceclient.createfromconnectionstring) method. In addition to the required IoT Hub primary connection string, the `CreateFromConnectionString` method can be overloaded to include these *optional* parameters:

* `transportType` - The transport protocol: variations of HTTP version 1, AMQP, or MQTT. `AMQP` is the default. To see all available values, see [TransportType Enum](/dotnet/api/microsoft.azure.devices.client.transporttype).
* `transportSettings` - Interface used to define various transport-specific settings for `DeviceClient` and `ModuleClient`. For more information, see [ITransportSettings Interface](/dotnet/api/microsoft.azure.devices.client.itransportsettings).
* `ClientOptions` - Options that allow configuration of the device or module client instance during initialization.

This example calls `CreateFromConnectionString` to define the `DeviceClient` connection IoT hub and device ID settings.

``` csharp
static string connectionString = "{your IoT hub connection string}";
static string deviceID = "{your device ID}";
deviceClient = DeviceClient.CreateFromConnectionString(connectionString,deviceID);
```

### Polling

Polling uses [ReceiveAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.receiveasync) to check for messages.

A call to `ReceiveAsync` can take these forms:

* `ReceiveAsync()` - Wait for the default timeout period for a message before continuing.
* `ReceiveAsync (Timespan)` - Receive a message from the device queue using a specific timeout.
* `ReceiveAsync (CancellationToken)` - Receive a message from the device queue using a cancellation token. When using a cancellation token, the default timeout period is not used.

When using a transport type of HTTP 1 instead of MQTT or AMQP, the `ReceiveAsync` method returns immediately. The supported pattern for cloud-to-device messages with HTTP 1 is intermittently connected devices that check for messages infrequently (a minimum of every 25 minutes). Issuing more HTTP 1 receives results in IoT Hub throttling the requests. For more information about the differences between MQTT, AMQP, and HTTP 1 support, see [Cloud-to-device communications guidance](../articles/iot-hub/iot-hub-devguide-c2d-guidance.md) and [Choose a communication protocol](../articles/iot-hub/iot-hub-devguide-protocols.md).

#### CompleteAsync method

After the device receives a message, the device application calls the [CompleteAsync](/dotnet/api/microsoft.azure.devices.receiver-1.completeasync) method to notify IoT Hub that the message is successfully processed and that the message can be safely removed from the IoT Hub device queue. The device should call this method when its processing successfully completes regardless of the transport protocol it's using.

#### Message abandon, reject, or timeout

With AMQP and HTTP version 1 protocols, but not the [MQTT protocol](../articles/iot/iot-mqtt-connect-to-iot-hub.md), the device can also:

* Abandon a message by calling [AbandonAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.abandonasync). This results in IoT Hub retaining the message in the device queue for future consumption.
* Reject a message by calling [RejectAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.rejectasync). This permanently removes the message from the device queue.

If something happens that prevents the device from completing, abandoning, or rejecting the message, IoT Hub will, after a fixed timeout period, queue the message for delivery again. For this reason, the message processing logic in the device app must be *idempotent*, so that receiving the same message multiple times produces the same result.

For more information about the cloud-to-device message lifecycle and how IoT Hub processes cloud-to-device messages, see [Send cloud-to-device messages from an IoT hub](../articles/iot-hub/iot-hub-devguide-messages-c2d.md).

#### Polling loop

Using polling, an application uses a code loop that calls the `ReceiveAsync` method repeatedly to check for new messages until stopped.

If using `ReceiveAsync` with a timeout value or the default timeout, in the loop each call to `ReceiveAsync` waits for the specified timeout period. If `ReceiveAsync` times out, a `null` value is returned and the loop continues.

When a message is received, a [Task](/dotnet/api/system.threading.tasks.task-1) object is returned by `ReceiveAsync` that should be passed to [CompleteAsync](/dotnet/api/microsoft.azure.devices.receiver-1.completeasync). A call to `CompleteAsync` notifies IoT Hub to delete the specified message from the message queue based on the `Task` parameter.

In this example, the loop calls `ReceiveAsync` until a message is received or the polling loop is stopped.

```csharp
static bool stopPolling = false;

while (!stopPolling)
{
   // Check for a message. Wait for the default DeviceClient timeout period.
   using Message receivedMessage = await _deviceClient.ReceiveAsync();

   // Continue if no message was received
   if (receivedMessage == null)
   {
      continue;
   }
   else  // A message was received
   {
      // Print the message received
      Console.WriteLine($"{DateTime.Now}> Polling using ReceiveAsync() - received message with Id={receivedMessage.MessageId}");
      PrintMessage(receivedMessage);

      // Notify IoT Hub that the message was received. IoT Hub will delete the message from the message queue.
      await _deviceClient.CompleteAsync(receivedMessage);
      Console.WriteLine($"{DateTime.Now}> Completed C2D message with Id={receivedMessage.MessageId}.");
   }

   // Check to see if polling loop should end
   stopPolling = ShouldPollingstop ();
}
```

### Callback

To receive callback cloud-to-device messages in the device application, the application must connect to the IoT Hub and set up a callback listener to process incoming messages. Incoming messages to the device are received from the IoT Hub message queue.

Using callback, the device application sets up a message handler method using [SetReceiveMessageHandlerAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.setreceivemessagehandlerasync). The message handler is called then a message is received. Creating a callback method to receive messages removes the need to continuously poll for received messages.

Callback is available only using these protocols:

* `Mqtt`
* `Mqtt_WebSocket_Only`
* `Mqtt_Tcp_Only`
* `Amqp`
* `Amqp_WebSocket_Only`
* `Amqp_Tcp_only`

The `Http1` protocol option does not support callbacks since the SDK methods would need to poll for received messages anyway, which defeats the callback principle.

In this example, `SetReceiveMessageHandlerAsync` sets up a callback handler method named `OnC2dMessageReceivedAsync`, which is called each time a message is received.

```csharp
// Subscribe to receive C2D messages through a callback (which isn't supported over HTTP).
await deviceClient.SetReceiveMessageHandlerAsync(OnC2dMessageReceivedAsync, deviceClient);
Console.WriteLine($"\n{DateTime.Now}> Subscribed to receive C2D messages over callback.");
```

### Receive message retry policy

The device client message retry policy can be defined using [DeviceClient.SetRetryPolicy](/dotnet/api/microsoft.azure.devices.client.deviceclient.setretrypolicy).

The message retry timeout is stored in the [DeviceClient.OperationTimeoutInMilliseconds](/dotnet/api/microsoft.azure.devices.client.deviceclient.operationtimeoutinmilliseconds) property.

### SDK receive message sample

The .NET/C# SDK includes a [Message Receive](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/getting%20started/MessageReceiveSample) sample that includes the receive message methods described in this section.

## Send cloud-to-device messages

This section describes essential code to send a message from a solution backend application to an IoT device using the [ServiceClient](/dotnet/api/microsoft.azure.devices.serviceclient) class in the Azure IoT SDK for .NET. As discussed previously, a solution backend application connects to an IoT Hub and messages are sent to IoT Hub encoded with a destination device. IoT Hub stores incoming messages to its message queue, and messages are delivered from the IoT Hub message queue to the target device.

A solution backend application can also request and receive delivery feedback for a message sent to IoT Hub that is destined for device delivery via the message queue.

### Declare a ServiceClient object

[ServiceClient](/dotnet/api/microsoft.azure.devices.serviceclient) includes methods and properties necessary to send messages from an application through IoT Hub to a device.

``` csharp
static ServiceClient serviceClient;
```

### Supply the connection string

Supply the IoT Hub primary connection string to `ServiceClient` using the [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.serviceclient.createfromconnectionstring) method. In addition to the required IoT Hub primary connection string, the `CreateFromConnectionString` method can be overloaded to include these *optional* parameters:

* `transportType` - `Amqp` or `Amqp_WebSocket_Only`.
* `transportSettings` - The AMQP and HTTP proxy settings for Service Client.
* `ServiceClientOptions` - Options that allow configuration of the service client instance during initialization. For more information, see [ServiceClientOptions](/dotnet/api/microsoft.azure.devices.serviceclientoptions).

This example creates the `ServiceClient` object using the IoT Hub connection string.

``` csharp
static string connectionString = "{your iot hub connection string}";
serviceClient = ServiceClient.CreateFromConnectionString(connectionString);
```

### Send an asynchronous cloud-to-device message

Use [sendAsync](/dotnet/api/microsoft.azure.devices.serviceclient.sendasync) to send an asynchronous message from an application through the cloud (IoT Hub) to the device. The call is made using the AMQP protocol.

`sendAsync` uses these parameters:

* `deviceID` - The string identifier of the target device.
* `message` - The cloud-to-device message. The message is of type [Message](/dotnet/api/microsoft.azure.devices.message) and can be formatted accordingly.
* `timeout` - An *optional* timeout value. The default is one minute if unspecified.

This example sends a test message to the target device with 10-second timeout value.

``` csharp
string targetDevice = "Device-1";
static readonly TimeSpan operationTimeout = TimeSpan.FromSeconds(10);
var commandMessage = new
Message(Encoding.ASCII.GetBytes("Cloud to device message."));
await serviceClient.SendAsync(targetDevice, commandMessage, operationTimeout);
```

### Receive delivery feedback

A sending program can request delivery (or expiration) acknowledgments from IoT Hub for each cloud-to-device message. This option enables the sending program to use inform, retry, or compensation logic. A complete description of message feedback operations and properties are described at [Message feedback](/azure/iot-hub/iot-hub-devguide-messages-c2d#message-feedback).

To receive message delivery feedback:

* Create the `feedbackReceiver` object
* Send messages using the `Ack` parameter
* Wait to receive feedback

#### Create the feedbackReceiver object

Call [GetFeedbackReceiver](/dotnet/api/microsoft.azure.devices.serviceclient.getfeedbackreceiver) to create a [FeedbackReceiver](/dotnet/api/microsoft.azure.devices.feedbackreceiver-1) object. `FeedbackReceiver` contains methods that services can use to perform feedback receive operations.

``` csharp
var feedbackReceiver = serviceClient.GetFeedbackReceiver();
```

#### Send messages using the Ack parameter

Each message must include a value for the delivery acknowledgment [Ack](/dotnet/api/microsoft.azure.devices.message.ack) property in order to receive delivery feedback. The `Ack` property can be one of these values:

* none (default): no feedback message is generated.

* `Positive`: receive a feedback message if the message was completed.

* `Negative`: receive a feedback message if the message expired (or maximum delivery count was reached) without being completed by the device.

* `Full`: feedback for both `Positive` and `Negative` results.

In this example, the `Ack` property is set to `Full`, requesting both positive or negative message delivery feedback for one message.

``` csharp
var commandMessage = new
Message(Encoding.ASCII.GetBytes("Cloud to device message."));
commandMessage.Ack = DeliveryAcknowledgement.Full;
await serviceClient.SendAsync(targetDevice, commandMessage);
```

#### Wait to receive feedback

Define a `CancellationToken`. Then in a loop, call [ReceiveAsync](/dotnet/api/microsoft.azure.devices.receiver-1.receiveasync) repeatedly, checking for delivery feedback messages. Each call to `ReceiveAsync` waits for the timeout period defined for the `ServiceClient` object.

* If a `ReceiveAsync` timeout expires with no message received, `ReceiveAsync` returns `null` and the loop continues.
* If a feedback message is received, a [Task](/dotnet/api/system.threading.tasks.task-1) object is returned by `ReceiveAsync` that should be passed to [CompleteAsync](/dotnet/api/microsoft.azure.devices.receiver-1.completeasync) along with the cancellation token. A call to `CompleteAsync` deletes the specified sent message from the message queue based on the `Task` parameter.
* If needed, the receive code can call [AbandonAsync](/dotnet/api/microsoft.azure.devices.receiver-1.abandonasync) to put a send message back in the queue.

``` csharp
var feedbackReceiver = serviceClient.GetFeedbackReceiver();
```

``` csharp
// Define the cancellation token.
CancellationTokenSource source = new CancellationTokenSource();
CancellationToken token = source.Token;
// Call ReceiveAsync, passing the token. Wait for the timout period.
var feedbackBatch = await feedbackReceiver.ReceiveAsync(token);
if (feedbackBatch == null) continue;
```

This example shows a method that includes these steps.

```csharp
private async static void ReceiveFeedbackAsync()
{
      var feedbackReceiver = serviceClient.GetFeedbackReceiver();

      Console.WriteLine("\nReceiving c2d feedback from service");
      while (true)
      {
         // Check for messages, wait for the timeout period.
         var feedbackBatch = await feedbackReceiver.ReceiveAsync();
         // Continue the loop if null is received after a timeout.
         if (feedbackBatch == null) continue;

         Console.ForegroundColor = ConsoleColor.Yellow;
         Console.WriteLine("Received feedback: {0}",
            string.Join(", ", feedbackBatch.Records.Select(f => f.StatusCode)));
         Console.ResetColor();

         await feedbackReceiver.CompleteAsync(feedbackBatch);
      }
   }
   ```

Note this feedback receive pattern is similar to the pattern used to receive cloud-to-device messages in the device application.

### Service client reconnection

On encountering an exception, the service client relays that information to the calling application. At that point, it is recommended that you inspect the exception details and take necessary action.

For example:

* If it a network exception, you can retry the operation.
* If it is a security exception (unauthorized exception), inspect your credentials and make sure they are up-to-date.
* If it is a throttling/quota exceeded exception, monitor and/or modify the frequency of sending requests, or update your hub instance scale unit. See [IoT Hub quotas and throttling](/azure/iot-hub/iot-hub-devguide-quotas-throttling) for details.

### Send message retry policy

The `ServiceClient` message retry policy can be defined using [ServiceClient.SetRetryPolicy](/dotnet/api/microsoft.rest.serviceclient-1.setretrypolicy).

### SDK send message sample

The .NET/C# SDK includes a [Service client sample](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/service/samples/getting%20started/ServiceClientSample) that includes the send message methods described in this section.
