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
- Active WhatsApp phone number to receive messages.
- [Python](https://www.python.org/downloads/) 3.7+ for your operating system.

## Set up the environment

[!INCLUDE [Setting up for Python Application](../python-application-setup.md)]

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Messages SDK for Python.

| Class Name | Description |
| --- |--- |
| `NotificationMessagesClient`  | Connects to your Azure Communication Services resource. It sends the messages.              |
| `InteractiveNotificationContent`  | Defines the interactive message business can send to user. |
| `InteractiveMessage` | Defines interactive message content.|
| `WhatsAppListActionBindings` | Defines WhatsApp List interactive message properties binding. |
| `WhatsAppButtonActionBindings`| Defines WhatsApp Button interactive message properties binding.|
| `WhatsAppUrlActionBindings` | Defines WhatsApp Url interactive message properties binding.|
| `TextMessageContent`     | Defines the text content for Interactive message body, footer, header. |
| `VideoMessageContent`   | Defines the video content for Interactive message header.  |
| `DocumentMessageContent` | Defines the document content for Interactive message header. |
| `ImageMessageContent` | Defines the image content for Interactive message header.|
| `ActionGroupContent` | Defines the ActionGroup or ListOptions content for Interactive message.|
| `ButtonSetContent` | Defines the Reply Buttons content for Interactive message. |
| `LinkContent` | Defines the Url or Click-To-Action content for Interactive message. |

> [!NOTE]
> For more information, see the Azure SDK for Python reference [messages Package](/python/api/azure-communication-messages/azure.communication.messages).

## Common configuration

Follow these steps to add required code snippets to the messages-quickstart.py python program.

- [Authenticate the client](#authenticate-the-client)
- [Set channel registration ID](#set-channel-registration-id)
- [Set recipient list](#set-recipient-list)

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-python.md)]

## Code examples

The Messages SDK supports the following WhatsApp Interactive messages:

- [Send an Interactive List options message to a WhatsApp user](#send-an-interactive-list-options-message-to-a-whatsapp-user).
- [Send an Interactive Reply Button message to a WhatsApp user](#send-an-interactive-reply-button-message-to-a-whatsapp-user).
- [Send an Interactive Click-to-action Url based message to a WhatsApp user](#send-an-interactive-call-to-action-url-based-message-to-a-whatsapp-user).

### Send an Interactive List options message to a WhatsApp user

The Messages SDK enables Contoso to send interactive WhatsApp messages, when initiated by a WhatsApp users. To send text messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- List Message can be created using the given properties:

   | Action type | Description |
   | --- | --- |
   | `ActionGroupContent`    | This class defines title of the group content and array of the group.    |
   | `ActionGroup`    | This class defines title of the group and array of the group Items.   |
   | `ActionGroupItem` | This class defines ID, Title, and description of the group Item. |
   | `WhatsAppListActionBindings`| This class defines the `ActionGroupContent` binding with the interactive message. |

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends an interactive shipping options message to the user.

```python
    def send_whatsapplist_message(self):

        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import (
            ActionGroupContent,
            ActionGroup,
            ActionGroupItem,
            InteractiveMessage,
            TextMessageContent,
            WhatsAppListActionBindings,
            InteractiveNotificationContent,
        )

        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)

        action_items_list1 = [
            ActionGroupItem(id="priority_express", title="Priority Mail Express", description="Next Day to 2 Days"),
            ActionGroupItem(id="priority_mail", title="Priority Mail", description="1–3 Days"),
        ]
        action_items_list2 = [
            ActionGroupItem(id="usps_ground_advantage", title="USPS Ground Advantage", description="2-5 Days"),
            ActionGroupItem(id="media_mail", title="Media Mail", description="2-8 Days"),
        ]
        groups = [
            ActionGroup(title="I want it ASAP!", items_property=action_items_list1),
            ActionGroup(title="I can wait a bit", items_property=action_items_list2),
        ]

        action_group_content = ActionGroupContent(title="Shipping Options", groups=groups)

        interactionMessage = InteractiveMessage(
            body=TextMessageContent(text="Test Body"),
            footer=TextMessageContent(text="Test Footer"),
            header=TextMessageContent(text="Test Header"),
            action=WhatsAppListActionBindings(content=action_group_content),
        )
        interactiveMessageContent = InteractiveNotificationContent(
            channel_registration_id=self.channel_id,
            to=[self.phone_number],
            interactive_message=interactionMessage,
        )

        # calling send() with whatsapp message details
        message_responses = messaging_client.send(interactiveMessageContent)
        response = message_responses.receipts[0]
        print("Message with message id {} was successful sent to {}".format(response.message_id, response.to))

```

To run send_text_message(), update the [main method](#basic-program-structure):

```python
    #Calling send_whatsapplist_message()
    messages.send_whatsapplist_message()
```

:::image type="content" source="../../media/interactive-reaction-sticker/list-interactive-message.jpg" lightbox="../../media/interactive-reaction-sticker/list-interactive-message.jpg" alt-text="Screenshot that shows WhatsApp List interactive message from Business to User.":::

### Send an Interactive Reply Button message to a WhatsApp user

The Messages SDK enables Contoso to send image WhatsApp messages to WhatsApp users. To send image embedded messages:
- [WhatsApp Channel ID](#set-channel-registration-id)
- [Recipient Phone Number in E16 format](#set-recipient-list)
- Reply Button Messages can be created using given properties:

   | Action type | Description |
   | --- | --- |
   | `ButtonSetContent`    | This class defines button set content for reply button messages.  |
   | `ButtonContent`    | This class defines ID and title of the reply buttons.  |
   | `WhatsAppButtonActionBindings`| This class defines the `ButtonSetContent` binding with the interactive message. |

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends a reply button message to the user.

```python
    def send_whatsappreplybutton_message(self):

        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import (
            ButtonSetContent,
            ButtonContent,
            InteractiveMessage,
            TextMessageContent,
            WhatsAppButtonActionBindings,
            InteractiveNotificationContent,
        )

        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)

        reply_button_action_list = [
            ButtonContent(title="Cancel", id="cancel"),
            ButtonContent(title="Agree", id="agree"),
        ]
        button_set = ButtonSetContent(buttons=reply_button_action_list)
        interactionMessage = InteractiveMessage(
            body=TextMessageContent(text="Test Body"),
            footer=TextMessageContent(text="Test Footer"),
            header=TextMessageContent(text="Test Header"),
            action=WhatsAppButtonActionBindings(content=button_set),
        )
        interactiveMessageContent = InteractiveNotificationContent(
            channel_registration_id=self.channel_id,
            to=[self.phone_number],
            interactive_message=interactionMessage,
        )

        # calling send() with whatsapp message details
        message_responses = messaging_client.send(interactiveMessageContent)
        response = message_responses.receipts[0]
        print("Message with message id {} was successful sent to {}".format(response.message_id, response.to))
```

To run `send_whatsappreplybutton_message()`, update the [main method](#basic-program-structure):

```python
    # Calling send_imagesend_whatsappreplybutton_message_message()
    messages.send_whatsappreplybutton_message()
```

:::image type="content" source="../../media/interactive-reaction-sticker/reply-button-interactive-message.jpg" lightbox="../../media/interactive-reaction-sticker/reply-button-interactive-message.jpg" alt-text="Screenshot that shows WhatsApp Reply Button interactive message from Business to User.":::

### Send an Interactive Call-To-Action Url based message to a WhatsApp user

The Messages SDK enables Contoso to send image WhatsApp messages to WhatsApp users. To send image embedded messages:
- [WhatsApp Channel ID](#set-channel-registration-id)
- [Recipient Phone Number in E16 format](#set-recipient-list)
- Call-To-Action or Link content can be created using given properties:

| Action type   | Description |
| --- | --- |
| `LinkContent`    | This class defines url or link content for message.  |
| `WhatsAppUrlActionBindings` | This class defines the `LinkContent` binding with the interactive message. |

> [!IMPORTANT]
> To send a document message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends a click to a link message to the user.

```python
    def send_whatapp_click_to_action_message(self):

        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import (
            LinkContent,
            InteractiveMessage,
            TextMessageContent,
            WhatsAppUrlActionBindings,
            InteractiveNotificationContent,
        )

        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)

        urlAction = LinkContent(
            title="Test Url",
            url="https://example.com/audio.mp3",
        )
        interactionMessage = InteractiveMessage(
            body=TextMessageContent(text="Test Body"),
            footer=TextMessageContent(text="Test Footer"),
            header=TextMessageContent(text="Test Header"),
            action=WhatsAppUrlActionBindings(content=urlAction),
        )
        interactiveMessageContent = InteractiveNotificationContent(
            channel_registration_id=self.channel_id,
            to=[self.phone_number],
            interactive_message=interactionMessage,
        )

        # calling send() with whatsapp message details
        message_responses = messaging_client.send(interactiveMessageContent)
        response = message_responses.receipts[0]
        print("WhatsApp CTA containing Message with message ID {} was successfully sent to {}".format(response.message_id, response.to))
```

To run `send_whatapp_click_to_action_message()`, update the [main method](#basic-program-structure):

```python
    # Calling send_whatapp_click_to_action_message()
    messages.send_whatapp_click_to_action_message()
```

:::image type="content" source="../../media/interactive-reaction-sticker/click-to-action-interactive-message.jpg" lightbox="../../media/interactive-reaction-sticker/click-to-action-interactive-message.jpg" alt-text="Screenshot that shows WhatsApp Click-to-action interactive message from Business to User.":::

### Run the code

To run the code, open the directory where your `messages-quickstart.py` file is located.

```console
python interactive-messages-quickstart.py
```

```output
Azure Communication Services - Advanced Messages Quickstart
WhatsApp List Message with message ID <<GUID>> was successfully sent to <<ToRecipient>>
WhatsApp Button Message with message ID <<GUID>> was successfully sent to <<ToRecipient>>
WhatsApp CTA containing Message with message ID <<GUID>> was successfully sent to <<ToRecipient>>
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

    def send_whatsapplist_message(self):

        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import (
            ActionGroupContent,
            ActionGroup,
            ActionGroupItem,
            InteractiveMessage,
            TextMessageContent,
            WhatsAppListActionBindings,
            InteractiveNotificationContent,
        )

        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)

        action_items_list1 = [
            ActionGroupItem(id="priority_express", title="Priority Mail Express", description="Next Day to 2 Days"),
            ActionGroupItem(id="priority_mail", title="Priority Mail", description="1–3 Days"),
        ]
        action_items_list2 = [
            ActionGroupItem(id="usps_ground_advantage", title="USPS Ground Advantage", description="2-5 Days"),
            ActionGroupItem(id="media_mail", title="Media Mail", description="2-8 Days"),
        ]
        groups = [
            ActionGroup(title="I want it ASAP!", items_property=action_items_list1),
            ActionGroup(title="I can wait a bit", items_property=action_items_list2),
        ]

        action_group_content = ActionGroupContent(title="Shipping Options", groups=groups)

        interactionMessage = InteractiveMessage(
            body=TextMessageContent(text="Test Body"),
            footer=TextMessageContent(text="Test Footer"),
            header=TextMessageContent(text="Test Header"),
            action=WhatsAppListActionBindings(content=action_group_content),
        )
        interactiveMessageContent = InteractiveNotificationContent(
            channel_registration_id=self.channel_id,
            to=[self.phone_number],
            interactive_message=interactionMessage,
        )

        # calling send() with whatsapp message details
        message_responses = messaging_client.send(interactiveMessageContent)
        response = message_responses.receipts[0]
        print("WhatsApp List Message with message id {} was successful sent to {}".format(response.message_id, response.to))

    def send_whatsappreplybutton_message(self):

        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import (
            ButtonSetContent,
            ButtonContent,
            InteractiveMessage,
            TextMessageContent,
            WhatsAppButtonActionBindings,
            InteractiveNotificationContent,
        )

        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)

        reply_button_action_list = [
            ButtonContent(title="Cancel", id="cancel"),
            ButtonContent(title="Agree", id="agree"),
        ]
        button_set = ButtonSetContent(buttons=reply_button_action_list)
        interactionMessage = InteractiveMessage(
            body=TextMessageContent(text="Test Body"),
            footer=TextMessageContent(text="Test Footer"),
            header=TextMessageContent(text="Test Header"),
            action=WhatsAppButtonActionBindings(content=button_set),
        )
        interactiveMessageContent = InteractiveNotificationContent(
            channel_registration_id=self.channel_id,
            to=[self.phone_number],
            interactive_message=interactionMessage,
        )

        # calling send() with whatsapp message details
        message_responses = messaging_client.send(interactiveMessageContent)
        response = message_responses.receipts[0]
        print("WhatsApp Button Message with message id {} was successful sent to {}".format(response.message_id, response.to))

    def send_whatapp_click_to_action_message(self):

            from azure.communication.messages import NotificationMessagesClient
            from azure.communication.messages.models import (
                LinkContent,
                InteractiveMessage,
                TextMessageContent,
                WhatsAppUrlActionBindings,
                InteractiveNotificationContent,
            )

            messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)

            urlAction = LinkContent(
                title="Test Url",
                url="https://example.com/audio.mp3",
            )
            interactionMessage = InteractiveMessage(
                body=TextMessageContent(text="Test Body"),
                footer=TextMessageContent(text="Test Footer"),
                header=TextMessageContent(text="Test Header"),
                action=WhatsAppUrlActionBindings(content=urlAction),
            )
            interactiveMessageContent = InteractiveNotificationContent(
                channel_registration_id=self.channel_id,
                to=[self.phone_number],
                interactive_message=interactionMessage,
            )

            # calling send() with whatsapp message details
            message_responses = messaging_client.send(interactiveMessageContent)
            response = message_responses.receipts[0]
            print("WhatsApp CTA containing Message with message id {} was successful sent to {}".format(response.message_id, response.to))


if __name__ == '__main__':
    messages = MessagesQuickstart()
    messages.send_whatsapplist_message()
    messages.send_whatsappreplybutton_message()
    messages.send_whatapp_click_to_action_message()
```

### Other samples

You can review and download other sample codes from GitHub [Python Messages SDK](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/messages-quickstart).
