---
title: Include file
description: Include file
services: azure-communication-services
author: shamkh
manager: camilo.ramirez
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 05/01/25
ms.topic: include
ms.custom: Include file
ms.author: shamkh
---

## Prerequisites

- [WhatsApp Business Account registered with your Azure Communication Services resource](../../connect-whatsapp-business-account.md).

- Active WhatsApp phone number to receive messages.

- [Python](https://www.python.org/downloads/) 3.7+ for your operating system.

## Set up the environment

[!INCLUDE [Setting up for Python Application](../python-application-setup.md)]

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Messages SDK for Python.

| Class Name | Description  |
| --- | --- |
| `NotificationMessagesClient`  | Connects to your Azure Communication Services resource. It sends the messages.              |
| `ReactionNotificationContent` | Defines the reaction content of the messages with emoji and reply message ID.|

> [!NOTE]
> For more information, see the Azure SDK for Python reference [messages Package](/python/api/azure-communication-messages/azure.communication.messages).

## Common configuration

Follow these steps to add required code snippets to the `messages-quickstart.py` python program.

- [Authenticate the client](#authenticate-the-client).
- [Set channel registration ID](#set-channel-registration-id).
- [Set recipient list](#set-recipient-list).

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-python.md)]

## Code examples

Follow these steps to add required code snippets to the `messages-quickstart.py` python program.

- [Send a Reaction messages to a WhatsApp user message](#send-a-reaction-messages-to-a-whatsapp-user-message).

### Send a reaction messages to a WhatsApp user message

The Messages SDK enables Contoso to send reaction WhatsApp messages, when initiated by WhatsApp users. To send text messages:

- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- Reaction content can be created using given properties:

   | Action type   | Description |
   |----------|---------------------------|
   | ReactionNotificationContent    | This class defines title of the group content and array of the group.    |
   | Emoji    | This property defines the unicode for emoji character.   |
   | Reply Message ID | This property defines ID of the message to be replied with emoji. |

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends a reaction to the user message:

```python
    def send_reaction_message(self):

        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ReactionNotificationContent

        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)

        video_options = ReactionNotificationContent(
            channel_registration_id=self.channel_id,
            to=[self.phone_number],
            emoji="\uD83D\uDE00",
            message_id="<<ReplyMessageIdGuid>>",
        )

        # calling send() with whatsapp message details
        message_responses = messaging_client.send(video_options)
        response = message_responses.receipts[0]
        print("Message with message ID {} was successful sent to {}".format(response.message_id, response.to))
```

To run `send_reaction_message()`, update the [main method](#basic-program-structure):

```python
    #Calling send_reaction_message()
    messages.send_reaction_message()
```

:::image type="content" source="../../media/interactive-reaction-sticker/reaction-message.png" lightbox="../../media/interactive-reaction-sticker/reaction-message.png" alt-text="Screenshot that shows WhatsApp call-to-action interactive message from Business to User.":::

### Run the code

To run the code, make sure you are in the directory where your `reaction-messages-quickstart.py` file is located.

```console
python reaction-messages-quickstart.py
```

```output
Azure Communication Services - Advanced Messages Quickstart
WhatsApp Reaction Message with message ID <<GUID>> was successfully sent to <<ToRecipient>>
```

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

    def send_reaction_message(self):

        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ReactionNotificationContent

        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)

        video_options = ReactionNotificationContent(
            channel_registration_id=self.channel_id,
            to=[self.phone_number],
            emoji="\uD83D\uDE00",
            message_id="<<ReplyMessageIdGuid>>",
        )

        # calling send() with whatsapp message details
        message_responses = messaging_client.send(video_options)
        response = message_responses.receipts[0]
        print("WhatsApp Reaction Message with message ID {} was successful sent to {}".format(response.message_id, response.to))

if __name__ == '__main__':
    messages = MessagesQuickstart()
    messages.send_reaction_message()
```

### Other samples

You can review and download other sample codes on GitHub at [Python Messages SDK](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/messages-quickstart).
