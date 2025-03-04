---
author: kgremban
ms.author: kgremban
ms.service: azure-iot-hub
ms.devlang: nodejs
ms.topic: include
ms.date: 12/19/2024
ms.custom: [amqp, mqtt, devx-track-js]
---

## Create a device application

This section describes how to receive cloud-to-device messages using the [azure-iot-device](/javascript/api/azure-iot-device) package in the Azure IoT SDK for Node.js.

For a Node.js-based device application to receive cloud-to-device messages, it must connect to IoT Hub, then set up a callback listener and message handler to process incoming messages from IoT Hub. The device application should also be able to detect and handle disconnects in case the device-to-IoT Hub message connection is broken.

### Install SDK packages

The [azure-iot-device](/javascript/api/azure-iot-device) package contains objects that interface with IoT devices. Run this command to install the **azure-iot-device** device SDK on your development machine:

```cmd/sh
npm install azure-iot-device --save
```

### Connect a device to IoT Hub

A device app can authenticate with IoT Hub using the following methods:

* X.509 certificate
* Shared access key

[!INCLUDE [iot-authentication-device-connection-string.md](iot-authentication-device-connection-string.md)]

#### Authenticate using an X.509 certificate

[!INCLUDE [iot-hub-howto-auth-device-cert-node](iot-hub-howto-auth-device-cert-node.md)]

#### Authenticate using a shared access key

##### Choose a transport protocol

The `Client` object supports these protocols:

* `Amqp`
* `Http` - When using `Http`, the `Client` instance checks for messages from IoT Hub infrequently (a minimum of every 25 minutes).
* `Mqtt`
* `MqttWs`
* `AmqpWs`

Install needed transport protocols on your development machine.

For example, this command installs the `Amqp` protocol:

```cmd/sh
npm install azure-iot-device-amqp --save
```

For more information about the differences between MQTT, AMQP, and HTTPS support, see [Cloud-to-device communications guidance](../articles/iot-hub/iot-hub-devguide-c2d-guidance.md) and [Choose a communication protocol](../articles/iot-hub/iot-hub-devguide-protocols.md).

This example assigns the AMQP protocol to a `Protocol` variable. This Protocol variable is passed to the `Client.fromConnectionString` method in the **Add the connection string** section of this article.

```javascript
const Protocol = require('azure-iot-device-mqtt').Amqp;
```

###### Message completion, rejection, and abandon capabilities

Message completion, rejection, and abandon methods can be used depending on the protocol chosen.

###### AMQP and HTTP

The AMQP and HTTP transports can complete, reject, or abandon a message:

* [Complete](/javascript/api/azure-iothub/client.servicereceiver?#azure-iothub-client-servicereceiver-complete) - To complete a message, the service that sent the cloud-to-device message is notified that the message is received. IoT Hub removes the message from the message queue. The method takes the form of `client.complete(message, callback function)`.
* [Reject](/javascript/api/azure-iothub/client.servicereceiver?#azure-iothub-client-servicereceiver-reject) - To reject a message, the service that sent the cloud-to-device message is notified that the message is not processed by the device. IoT Hub permanently removes the message from the device queue. The method takes the form of `client.reject(message, callback function)`.
* [Abandon](/javascript/api/azure-iothub/client.servicereceiver?#azure-iothub-client-servicereceiver-abandon) - To abandon a message, IoT Hub immediately tries to resend it. IoT Hub retains the message in the device queue for future consumption. The method takes the form of `client.abandon(message, callback function)`.

###### MQTT

MQTT does not support message complete, reject, or abandon functions. Instead, MQTT accepts a message by default and the message is removed from the IoT Hub message queue.

###### Redelivery attempts

If something happens that prevents the device from completing, abandoning, or rejecting the message, IoT Hub will, after a fixed timeout period, queue the message for delivery again. For this reason, the message processing logic in the device app must be *idempotent*, so that receiving the same message multiple times produces the same result.

##### Create a client object

Create a `Client` object using the installed package.

For example:

```javascript
const Client = require('azure-iot-device').Client;
```

##### Create a protocol object

Create a `Protocol` object using an installed transport package.

This example assigns the AMQP protocol:

```javascript
const Protocol = require('azure-iot-device-amqp').Amqp;
```

##### Add the device connection string and transport protocol

Call [fromConnectionString](/javascript/api/azure-iot-device/client?#azure-iot-device-client-fromconnectionstring) to supply device connection parameters:

* **connStr** - The device connection string.
* **transportCtor** - The transport protocol.

This example uses the `Amqp` transport protocol:

```javascript
const deviceConnectionString = "{IoT hub device connection string}"
const Protocol = require('azure-iot-device-mqtt').Amqp;
let client = Client.fromConnectionString(deviceConnectionString, Protocol);
```

### Create an incoming message handler

The message handler is called for each incoming message.

After a message is successfully received, if using AMQP or HTTP transport then call the `client.complete` method to inform IoT Hub that the message can be removed from the message queue.

For example, this message handler prints the message ID and message body to the console, then calls `client.complete`  to notify IoT Hub that it processed the message and that it can safely be removed from the device queue. The call to `complete` isn't required if you're using MQTT transport and can be omitted. A call to`complete` is required for AMQP or HTTPS transport.

```javascript
function messageHandler(msg) {
  console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
  client.complete(msg, printResultFor('completed'));
}
```

### Create a connection disconnect handler

The disconnect handler is called when the connection is disconnected. A disconnect handler is useful for implementing reconnect code.

This example catches and displays the disconnect error message to the console.

```javascript
function disconnectHandler() {
  clearInterval(sendInterval);
  sendInterval = null;
  client.open().catch((err) => {
    console.error(err.message);
  });
}
```

### Add event listeners

You can specify these event listeners using the [.on](/javascript/api/azure-iot-device/client?#azure-iot-device-client-on) method.

* Connection handler
* Error handler
* Disconnect handler
* Message handler

This example includes the message and disconnect handlers defined previously.

```javascript
client.on('connect', connectHandler);
client.on('error', errorHandler);
client.on('disconnect', disconnectHandler);
client.on('message', messageHandler);
```

### Open the connection to IoT Hub

Use the [open](/javascript/api/azure-iot-device/client?#azure-iot-device-client-open) method to open a connection between an IoT device and IoT Hub.
Use `.catch(err)` to catch an error and call handler code.

For example:

```javascript
client.open()
.catch((err) => {
  console.error('Could not connect: ' + err.message);
});
```

### SDK device samples

The Azure IoT SDK for Node.js provides a working sample of a device app that handles message receive. For more information, see:

[simple_sample_device](https://github.com/Azure/azure-iot-sdk-node/tree/main/device/samples) - A device app that connects to your IoT hub and receives cloud-to-device messages.

## Create a backend application

This section describes how to send a cloud-to-device message. As discussed previously, a solution backend application connects to an IoT Hub and messages are sent to IoT Hub encoded with a destination device. IoT Hub stores incoming messages to its message queue, and messages are delivered from the IoT Hub message queue to the target device.

A solution backend application can also request and receive delivery feedback for a message sent to IoT Hub that is destined for device delivery via the message queue.

### Install service SDK package

The [azure-iothub](/javascript/api/azure-iothub) package contains objects that interface with IoT Hub. This article describes `Client` class code that sends a message from an application to a device via IoT Hub.

Run this command to install **azure-iothub** on your development machine:

```cmd/sh
npm install azure-iothub --save
```

### Load the client and message modules

Declare a `Client` object using the `Client` class from the `azure-iothub` package.

Declare a `Message` object using the `Message` class from the `azure-iot-common` package.

```javascript
'use strict';
var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;
```

### Connect to IoT hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Use [fromConnectionString](/javascript/api/azure-iothub/client?#azure-iothub-client-fromconnectionstring) to connect to IoT hub.

In this example, the `serviceClient` object is created with the `Amqp` transport type.

  ```javascript
  var connectionString = '{IoT hub device connection string}';
  var serviceClient = Client.fromConnectionString(connectionString,`Amqp`);
  ```

##### Open the Client connection

Call the `Client` [open](/javascript/api/azure-iothub/client?#azure-iothub-client-open-1) method to open a connection between an application and IoT Hub.

`open` can be called with or without specifying a callback function that is called when the `open` operation is complete.

In this example, the `open` method includes an optional `err` open connection callback function. If an open error occurs, an error object is returned. If the open connection is successful, a `null` callback value is returned.

```javascript
serviceClient.open(function (err)
if (err)
  console.error('Could not connect: ' + err.message);
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-node](iot-hub-howto-connect-service-iothub-entra-node.md)]

### Create a message

The [message](/javascript/api/azure-iot-common/message) object includes the asynchronous cloud-to-device message. The message functionality works the same way over AMQP, MQTT, and HTTP.

The message object supports several properties, including these properties. See the [message](/javascript/api/azure-iot-common/message) properties for a complete list.

* `ack` - Delivery feedback. Described in the next section.
* `properties` - A map containing string keys and values for storing custom message properties.
* [messageId](/javascript/api/azure-iot-common/message?#azure-iot-common-message-messageid) - Used to correlate two-way communication.

Add the message body when the message object is instantiated. In this example, a `'Cloud to device message.'` message is added.

```javascript
var message = new Message('Cloud to device message.');
message.ack = 'full';
message.messageId = "My Message ID";
```

#### Delivery acknowledgment

A sending program can request delivery (or expiration) acknowledgments from IoT Hub for each cloud-to-device message. This option enables the sending program to use inform, retry, or compensation logic. A complete description of message feedback operations and properties are described at [Message feedback](/azure/iot-hub/iot-hub-devguide-messages-c2d#message-feedback).

Each message that is to receive message feedback must include a value for the delivery acknowledgment [ack](/dotnet/api/microsoft.azure.devices.message.ack) property. The `ack` property can be one of these values:

* none (default): no feedback message is generated.

* `sent`: receive a feedback message if the message was completed.

* : receive a feedback message if the message expired (or maximum delivery count was reached) without being completed by the device.

* `full`: feedback for both sent and not sent results.

In this example, the `ack` property is set to `full`, requesting both sent and not sent message delivery feedback for one message.

```javascript
message.ack = 'full';
```

### Link the message feedback receiver

The message feedback receiver callback function is linked to the `Client` using [getFeedbackReceiver](/javascript/api/azure-iothub/client?#azure-iothub-client-getfeedbackreceiver).

The message feedback receiver receives two arguments:

* Error object (can be null)
* AmqpReceiver object - Emits events when new feedback messages are received by the client.

This example function receives and prints a delivery feedback message to the console.

```javascript
function receiveFeedback(err, receiver){
  receiver.on('message', function (msg) {
    console.log('Feedback message:')
    console.log(msg.getData().toString('utf-8'));
  });
}
```

This code links the `receiveFeedback` feedback callback function to the service `Client` object using `getFeedbackReceiver`.

```javascript
serviceClient.getFeedbackReceiver(receiveFeedback);
```

### Define a message completion results handler

The message send completion callback function is called after each message is sent.

This example function prints message `send` operation results to the console. In this example, the `printResultFor` function is supplied as a parameter to the `send` function described in the next section.

```javascript
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}
```

### Send a message

Use the [send](/javascript/api/azure-iothub/client?#azure-iothub-client-send) function to send an asynchronous cloud-to-device message to the device app through IoT Hub.

`send` supports these parameters:

* **deviceID** - The device ID of the target device.
* **message** - The body of the message to send to the device.
* **done** - The optional function to call when the operation is complete. Done is called with two arguments:
  * Error object (can be null).
  * transport-specific response object useful for logging or debugging.

This code calls `send` to send a cloud-to-device message to the device app through IoT Hub. The callback function `printResultFor` defined in the previous section receives the delivery acknowledgment information.

```javascript
var targetDevice = '{device ID}';
serviceClient.send(targetDevice, message, printResultFor('send'));
```

This example shows how to send a message to your device and handle the feedback message when the device acknowledges the cloud-to-device message:

```javascript
serviceClient.open(function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Service client connected');
    serviceClient.getFeedbackReceiver(receiveFeedback);
    var message = new Message('Cloud to device message.');
    message.ack = 'full';
    message.messageId = "My Message ID";
    console.log('Sending message: ' + message.getData());
    serviceClient.send(targetDevice, message, printResultFor('send'));
  }
});
```

### SDK send message sample

The Azure IoT SDK for Node.js provides working samples of a service app that handles send message tasks. For more information, see:

[send_c2d_message.js](https://github.com/Azure/azure-iot-hub-node/tree/main/samples) - Send C2D messages to a device through IoT Hub.
