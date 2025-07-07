---
title: Include file
description: Include file
services: azure-communication-services
author: shamkh
manager: camilo.ramirez
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 05/01/2025
ms.topic: include
ms.custom: Include file
ms.author: shamkh
---

## Prerequisites

- [WhatsApp Business Account registered with your Azure Communication Services resource](../../connect-whatsapp-business-account.md).
- .NET development environment, such as [Visual Studio](https://visualstudio.microsoft.com/downloads/), [Visual Studio Code](https://code.visualstudio.com/Download), or [.NET CLI](https://dotnet.microsoft.com/download).
- Event subscription and handling of [Advanced Message Received events](./../../handle-advanced-messaging-events.md#subscribe-to-advanced-messaging-events).

## Setting up

[!INCLUDE [Setting up for Python Application](../python-application-setup.md)]

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Messages SDK for Python.

| Name | Description |
| --- | --- |
| [NotificationMessagesClient](/python/api/azure-communication-messages/azure.communication.messages.notificationmessagesclient)  | This class connects to your Azure Communication Services resource. It sends the messages.                   |
| [DownloadMediaAsync](/python/api/azure-communication-messages/azure.communication.messages.aio.notificationmessagesclient)     | Download the media payload from a User to Business message asynchronously, writing the content to a stream. |
| [Microsoft.Communication.AdvancedMessageReceived](/azure/event-grid/communication-services-advanced-messaging-events#microsoftcommunicationadvancedmessagereceived-event) | Event Grid event that is published when Advanced Messaging receives a message. |

> [!NOTE]
> For more information, see the Azure SDK for Python reference [messages Package](/python/api/azure-communication-messages/azure.communication.messages).

## Common configuration

Follow these steps to add required code snippets to the `messages-quickstart.py` python program.

- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).
- [Authenticate the client](#authenticate-the-client).
- [Set channel registration ID](#set-channel-registration-id).
- [Set recipient list](#set-recipient-list).

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-python.md)]

## Code examples

Follow these steps to add required code snippets to the `messages-quickstart.py` python program.
- [Download the media payload to a stream](#download-the-media-payload-to-a-stream)

### Download the media payload to a stream

The Messages SDK enables Contoso to receive or download media from a WhatsApp user, when initiated by the WhatsApp users. To download the media payload to a stream, you need:

- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- Download media ID as Guid.

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends a reaction to the user message.

```python
      def download_media(self):

        from azure.communication.messages import NotificationMessagesClient

        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)
        input_media_id: str = "de7558b5-e169-4d47-9ba4-37a95c28f390"

        # calling send() with whatsapp message details
        media_stream = messaging_client.download_media(input_media_id)
        length : int = 0
        for byte in media_stream:
            length = length + 1
        print("WhatsApp Media stream downloaded.It's length is {}".format(length))

```

To run `download_media()`, update the [main method](#basic-program-structure).

```python
    #Calling download_media()
    messages.download_media()
```

### Run the code

To run the code, make sure you are on the same directory where your `download-media-quickstart.py` file is located.

```console
python download-media-quickstart.py
```

```output
Azure Communication Services - Advanced Messages Quickstart
WhatsApp Media stream downloaded.
```

## Full sample code

> [!NOTE]
> Change all placeholder variables in the following code so they match your values.

```python
import os
from io import BytesIO

class MessagesQuickstart(object):
    print("Azure Communication Services - Advanced Messages SDK Quickstart using connection string.")
    # Advanced Messages SDK implementations goes in this section.
   
    connection_string = os.getenv("COMMUNICATION_SERVICES_CONNECTION_STRING")

     def download_media(self):

        from azure.communication.messages import NotificationMessagesClient

        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)
        input_media_id: str = "de7558b5-e169-4d47-9ba4-37a95c28f390"

        # calling send() with whatsapp message details
        media_stream = messaging_client.download_media(input_media_id)
        length : int = 0
        for byte in media_stream:
            length = length + 1
        print("WhatsApp Media stream downloaded.It's length is {}".format(length))

if __name__ == '__main__':
    messages = MessagesQuickstart()
    messages.download_media()
```

### Sample code

Review and download other sample code on GitHub at [Python Messages SDK](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/messages-quickstart).
