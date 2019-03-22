---
title: Send your security messages to Azure IoT Security Preview| Microsoft Docs
description: Learn how to send your security messages using Azure IoT Security.
services: azureiotsecurity
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: c611bb5c-b503-487f-bef4-25d8a243803d
ms.service: azureiotsecurity
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/19/2019
ms.author: mlottner

---

# Send security messages

> [!IMPORTANT]
> Azure IoT Security is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains Azure IoT Security data analysis capabilities when choosing to collect and send your device security messages without using an Azure IoT Security agent, and explains how to do so.  

## Azure IoT Security 
Azure IoT Security can process and analyze any kind of security message data as long as the data sent conforms to the [Azure IoT Security schema](https://github.com/Azure/Azure-Security-IoT-Schemas). 

## Send security messages 

Send security messages without using the Azure IoT Security agent, by using the [Azure IoT device SDK](https://github.com/Azure/azure-iot-sdk-csharp).

To send the device data from your devices for processing by Azure IoT Security, use one of the  following APIs to mark messages for correct routing to Azure IoT Security processing pipeline. Messages sent this way will be processed and displayed as security insights within Azure IoT Security within both IoT Hub or within Azure Security Center. 

All data that is sent, even if marked with the correct header, must also comply with the [Azure IoT Security message schema](https://github.com/Azure/Azure-Security-IoT-Schemas). 

> [!NOTE]
> Sent messages that do not comply with the schema are ignored. Make sure to verify the schema before initiating sending data as ignored messages are not currently stored. 

### Send security message API
**Send security messages** API is currently available in C and C#. Additional languages are planned for a future release. 

C# API
```cs
private static async Task SendSecurityMessageAsync()
        {
            string messageContent = "Security Data";
            ModuleClient client = ModuleClient.CreateFromConnectionString("<connection_string>");
            Message  securityMessage = new Message(Encoding.UTF8.GetBytes(messageContent));
            securityMessage.SetAsSecurityMessage();
            await client.SendEventAsync(securityMessage);
        }
```
C API
```c
bool SendMessageAsync(IoTHubAdapter* iotHubAdapter, const void* data) {
 
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

## See Also
- [Azure IoT Security preview](overview.md)
- [Authentication](authentication-methods.md)
- [Azure IoT Security alerts](concepts-security-alerts.md)

