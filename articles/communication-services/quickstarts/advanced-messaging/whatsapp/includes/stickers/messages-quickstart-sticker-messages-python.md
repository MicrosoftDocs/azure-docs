---
title: Include file
description: Include file
services: azure-communication-services
author: shamkh
manager: camilo.ramirez
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 02/20/2024
ms.topic: include
ms.custom: Include file
ms.author: shamkh
---

## Prerequisites

- [WhatsApp Business Account registered with your Azure Communication Services resource](../../connect-whatsapp-business-account.md).

- Active WhatsApp phone number to receive messages.

- [Python](https://www.python.org/downloads/) 3.7+ for your operating system.

## Setting up

[!INCLUDE [Setting up for Python Application](../python-application-setup.md)]

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Messages SDK for Python.

| Class Name | Description |
| --- | --- |
| `NotificationMessagesClient`  | Connects to your Azure Communication Services resource. It sends the messages.              |
| `StickerNotificationContent` |  Defines sticker content of the messages. |

> [!NOTE]
> For more information, seer the Azure SDK for Python reference [messages Package](/python/api/azure-communication-messages/azure.communication.messages).

## Common configuration

Follow these steps to add required code snippets to the `messages-quickstart.py` python program.

- [Authenticate the client](#authenticate-the-client).
- [Set channel registration ID](#set-channel-registration-id).
- [Set recipient list](#set-recipient-list).

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-python.md)]

## Code examples

Follow these steps to add required code snippets to the `messages-quickstart.py` python program.

- [Send a Sticker messages to a WhatsApp user](#send-a-sticker-messages-to-a-whatsapp-user)

### Send a sticker messages to a WhatsApp user

The Messages SDK enables Contoso to send sticker WhatsApp messages, when initiated by WhatsApp users. To send sticker messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- Sticker message content can be created using given properties:

   | Action type | Description |
   | --- | --- |
   | `StickerNotificationContent`    | This class defines sticker message content.  |
   | `Media_Uri`    | This property defines the uri to the animated/static sticker.   |

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends sticker message to the WhatsApp user:

```python
   def send_sticker_message(self):

        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import StickerNotificationContent

        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)

        video_options = StickerNotificationContent(
            channel_registration_id=self.channel_id,
            to=[self.phone_number],
            media_uri="https://www.simpleimageresizer.com/_uploads/photos/d299e618/1.sm_512x512_cropped.webp",
        )

        # calling send() with whatsapp message details
        message_responses = messaging_client.send(video_options)
        response = message_responses.receipts[0]
        print("Message with message id {} was successful sent to {}".format(response.message_id, response.to))

```

To run `send_sticker_message()`, update the [main method](#basic-program-structure):

```python
    #Calling send_sticker_message()
    messages.send_sticker_message()
```

### Run the code

To run the code, make sure you are on the directory where your `messages-quickstart.py` file is located.

```console
python reaction-messages-quickstart.py
```

```output
Azure Communication Services - Advanced Messages Quickstart
WhatsApp Sticker Message with message id <<GUID>> was successfully sent to <<ToRecipient>>
```

:::image type="content" source="../../media/interactive-reaction-sticker/sticker-message.png" lightbox="../../media/interactive-reaction-sticker/sticker-message.png" alt-text="Screenshot that shows WhatsApp call-to-action interactive message from Business to User.":::

## Full sample code

> [!NOTE]
> Replace all placeholder variables in the code with your values.

```python
import os

class MessagesQuickstart(object):
    print("Azure Communication Services - Advanced Messages SDK Quickstart using connection string.")
    # Advanced Messages SDK implementations goes in this section.
   
    connection_string = os.getenv("COMMUNICATION_SERVICES_CONNECTION_STRING")
    phone_number = os.getenv("RECIPIENT_PHONE_NUMBER")
    channelRegistrationId = os.getenv("WHATSAPP_CHANNEL_ID")

    def send_sticker_message(self):

        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import StickerNotificationContent

        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)

        video_options = StickerNotificationContent(
            channel_registration_id=self.channel_id,
            to=[self.phone_number],
            media_uri="https://www.simpleimageresizer.com/_uploads/photos/d299e618/1.sm_512x512_cropped.webp",
        )

        # calling send() with whatsapp message details
        message_responses = messaging_client.send(video_options)
        response = message_responses.receipts[0]
        print("WhatsApp Sticker Message with message id {} was successful sent to {}".format(response.message_id, response.to))

if __name__ == '__main__':
    messages = MessagesQuickstart()
    messages.send_sticker_message()
```

### Other samples

You can review and download other sample codes for Python Messages SDK on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/messages-quickstart).
