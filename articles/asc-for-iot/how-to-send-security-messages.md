---
title: Send your security messages to Azure Security Center for IoT Preview| Microsoft Docs
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
ms.date: 03/26/2019
ms.author: mlottner

---

# Send security messages SDK

> [!IMPORTANT]
> Azure Security Center for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This how-to guide explains Azure Security Center (ASC) for IoT service capabilities when you choose to collect and send your device security messages without using an ASC for IoT agent, and explains how to do so.  

In this guide, you learn how to: 
> [!div class="checklist"]
> * Use the Send security message API for C#
> * Use the Send security message API for C

## ASC for IoT capabilities

ASC for IoT can process and analyze any kind of security message data as long as the data sent conforms to the [ASC for IoT schema](https://aka.ms/iot-security-schemas) and the message is set as a security message.

## Security message

ASC for IoT defines a security message using the following criteria:
- If the message was sent with Azure IoT C/C# SDK
- If the message conforms to the [security message schema](https://aka.ms/iot-security-schemas)
- If the message was set as a security message prior to sending

Each security message includes the metadata of the sender such as `AgentId`, `AgentVersion`, `MessageSchemaVersion` and a list of security events.
The schema defines the valid and required properties of the security message including the types of events.

[!NOTE]
> Messages sent that do not comply with the schema are ignored. Make sure to verify the schema before initiating sending data as ignored messages are not currently stored. 
> Messages sent that were not set as a security message using the Azure IoT C/C# SDK will not be routed to the ASC for IoT pipeline

## Valid message example

The example below shows a valid security message object. The example contains the message metadata and one `ProcessCreate` security event.

Once set as a security message and sent, this message will be processed by ASC for IoT.

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
                    "Executable": "/usr/bin/echo",
                    "ProcessId": 11750,
                    "ParentProcessId": 1593,
                    "UserName": "nginx",
                    "CommandLine": "./backup .htaccess"
                }
            ]
    }
]
```

## Send security messages 

Send security messages without using the ASC for IoT agent, by using the [Azure IoT C# device SDK](https://github.com/Azure/azure-iot-sdk-csharp/tree/preview) or [Azure IoT C device SDK](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview).

To send the device data from your devices for processing by ASC for IoT, use one of the following APIs to mark messages for correct routing to ASC for IoT processing pipeline. Messages sent this way will be processed and displayed as security insights within ASC for IoT within both IoT Hub or within Azure Security Center. 

All data that is sent, even if marked with the correct header, must also comply with the [ASC for IoT message schema](https://aka.ms/iot-security-schemas). 

### Send security message API

The **Send security messages** API is currently available in C and C#.  

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

## Next steps
- Read the ASC for IoT service [Overview](overview.md)
- Learn more about ASC for IoT [Architecture](architecture.md)
- Enable the [service](quickstart-onboard-iot-hub.md)
- Read the [FAQ](resources-frequently-asked-questions.md)
- Learn how to access [raw security data](how-to-security-data-access.md)
- Understand [recommendations](concept-recommendations.md)
- Understand [alerts](concept-security-alerts.md)
