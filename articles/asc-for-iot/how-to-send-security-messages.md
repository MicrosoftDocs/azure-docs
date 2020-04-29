---
title: Send device security messages
description: Learn how to send your security messages using Azure Security Center for IoT.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: c611bb5c-b503-487f-bef4-25d8a243803d
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 1/30/2020
ms.author: mlottner
---

# Send security messages SDK

This how-to guide explains the Azure Security Center for IoT service capabilities when you choose to collect and send your device security messages without using an Azure Security Center for IoT agent, and explains how to do so.

In this guide, you learn how to:

> [!div class="checklist"]
> * Send security messages using the Azure IoT C SDK
> * Send security messages using the Azure IoT C# SDK
> * Send security messages using the Azure IoT Python SDK
> * Send security messages using the Azure IoT Node.js SDK
> * Send security messages using the Azure IoT Java SDK

## Azure Security Center for IoT capabilities

Azure Security Center for IoT can process and analyze any kind of security message data as long as the data sent conforms to the [Azure Security Center for IoT schema](https://aka.ms/iot-security-schemas) and the message is set as a security message.

## Security message

Azure Security Center for IoT defines a security message using the following criteria:

- If the message was sent with Azure IoT SDK
- If the message conforms to the [security message schema](https://aka.ms/iot-security-schemas)
- If the message was set as a security message prior to sending

Each security message includes the metadata of the sender such as `AgentId`, `AgentVersion`, `MessageSchemaVersion` and a list of security events.
The schema defines the valid and required properties of the security message including the types of events.

> [!NOTE]
> Messages sent that do not comply with the schema are ignored. Make sure to verify the schema before initiating sending data as ignored messages are not currently stored.

> [!NOTE]
> Messages sent that were not set as a security message using the Azure IoT SDK will not be routed to the Azure Security Center for IoT pipeline.

## Valid message example

The example below shows a valid security message object. The example contains the message metadata and one `ProcessCreate` security event.

Once set as a security message and sent, this message will be processed by Azure Security Center for IoT.

```json
"AgentVersion": "0.0.1",
"AgentId": "e89dc5f5-feac-4c3e-87e2-93c16f010c25",
"MessageSchemaVersion": "1.0",
"Events": [
    {
        "EventType": "Security",
        "Category": "Triggered",
        "Name": "ProcessCreate",
        "IsEmpty": false,
        "PayloadSchemaVersion": "1.0",
        "Id": "21a2db0b-44fe-42e9-9cff-bbb2d8fdf874",
        "TimestampLocal": "2019-01-27 15:48:52Z",
        "TimestampUTC": "2019-01-27 13:48:52Z",
        "Payload":
            [
                {
                    "Executable": "/usr/bin/myApp",
                    "ProcessId": 11750,
                    "ParentProcessId": 1593,
                    "UserName": "aUser",
                    "CommandLine": "myApp -a -b"
                }
            ]
    }
]
```

## Send security messages

Send security messages *without* using Azure Security Center for IoT agent, by using the [Azure IoT C device SDK](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview), [Azure IoT C# device SDK](https://github.com/Azure/azure-iot-sdk-csharp/tree/preview), , [Azure IoT Node.js SDK](https://github.com/Azure/azure-iot-sdk-node), [Azure IoT Python SDK](https://github.com/Azure/azure-iot-sdk-python), or [Azure IoT Java SDK](https://github.com/Azure/azure-iot-sdk-java).

To send the device data from your devices for processing by Azure Security Center for IoT, use one of the following APIs to mark messages for correct routing to Azure Security Center for IoT processing pipeline.

All data that is sent, even if marked with the correct header, must also comply with the [Azure Security Center for IoT message schema](https://aka.ms/iot-security-schemas).

### Send security message API

The **Send security messages** API is currently available in C and C#, Python, Node.js, and Java.

#### C API

```c
bool SendMessageAsync(IoTHubAdapter* iotHubAdapter, const void* data, size_t dataSize) {

    bool success = true;
    IOTHUB_MESSAGE_HANDLE messageHandle = NULL;

    messageHandle = IoTHubMessage_CreateFromByteArray(data, dataSize);

    if (messageHandle == NULL) {
        success = false;
        goto cleanup;
    }

    if (IoTHubMessage_SetAsSecurityMessage(messageHandle) != IOTHUB_MESSAGE_OK) {
        success = false;
        goto cleanup;
    }

    if (IoTHubModuleClient_SendEventAsync(iotHubAdapter->moduleHandle, messageHandle, SendConfirmCallback, iotHubAdapter) != IOTHUB_CLIENT_OK) {
        success = false;
        goto cleanup;
    }

cleanup:
    if (messageHandle != NULL) {
        IoTHubMessage_Destroy(messageHandle);
    }

    return success;
}

static void SendConfirmCallback(IOTHUB_CLIENT_CONFIRMATION_RESULT result, void* userContextCallback) {
    if (userContextCallback == NULL) {
        //error handling
        return;
    }

    if (result != IOTHUB_CLIENT_CONFIRMATION_OK){
        //error handling
    }
}
```

#### C# API

```cs

private static async Task SendSecurityMessageAsync(string messageContent)
{
    ModuleClient client = ModuleClient.CreateFromConnectionString("<connection_string>");
    Message  securityMessage = new Message(Encoding.UTF8.GetBytes(messageContent));
    securityMessage.SetAsSecurityMessage();
    await client.SendEventAsync(securityMessage);
}
```

#### Node.js API

```typescript
var Protocol = require('azure-iot-device-mqtt').Mqtt
​
function SendSecurityMessage(messageContent)​
{​
  var client = Client.fromConnectionString(connectionString, Protocol);​
​
  var connectCallback = function (err) {​
    if (err) {​
      console.error('Could not connect: ' + err.message);​
    } else {​
      var message = new Message(messageContent);​
      message.setAsSecurityMessage();​
      client.sendEvent(message);​
  ​
      client.on('error', function (err) {​
        console.error(err.message);​
      });​
  ​
      client.on('disconnect', function () {​
        clearInterval(sendInterval);​
        client.removeAllListeners();​
        client.open(connectCallback);​
      });​
    }​
  };​
​
  client.open(connectCallback);​
}
```

#### Python API

To use the Python API you need to install the package [azure-iot-device](https://pypi.org/project/azure-iot-device/).

When using the Python API, you can either send the security message through the module or through the device using the unique device or module connection string. When using the following Python script example, with a device, use **IoTHubDeviceClient**, and with a module, use **IoTHubModuleClient**.

```python
from azure.iot.device.aio import IoTHubDeviceClient, IoTHubModuleClient
from azure.iot.device import Message

async def send_security_message_async(message_content):
    conn_str = os.getenv("<connection_string>")​
    device_client = IoTHubDeviceClient.create_from_connection_string(conn_str)​
    await device_client.connect()​
    security_message = Message(message_content)​
    security_message.set_as_security_message()​
    await device_client.send_message(security_message)​
    await device_client.disconnect()
```

#### Java API

```java
public void SendSecurityMessage(string message)
{
    ModuleClient client = new ModuleClient("<connection_string>", IotHubClientProtocol.MQTT);
    Message msg = new Message(message);
    msg.setAsSecurityMessage();
    EventCallback callback = new EventCallback();
    string context = "<user_context>";
    client.sendEventAsync(msg, callback, context);
}
```

## Next steps

- Read the Azure Security Center for IoT service [Overview](overview.md)
- Learn more about Azure Security Center for IoT [Architecture](architecture.md)
- Enable the [service](quickstart-onboard-iot-hub.md)
- Read the [FAQ](resources-frequently-asked-questions.md)
- Learn how to access [raw security data](how-to-security-data-access.md)
- Understand [recommendations](concept-recommendations.md)
- Understand [alerts](concept-security-alerts.md)
