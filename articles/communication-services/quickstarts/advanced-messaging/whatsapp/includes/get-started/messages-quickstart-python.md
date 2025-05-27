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
| `MessageTemplate`             | Defines which template you use and the content of the template properties for your message. |
| `TemplateNotificationContent` | Defines the "who" and the "what" of the template message you intend to send.                |
| `TextNotificationContent`     | Defines the "who" and the "what" of the text message you intend to send.                    |
| `ImageNotificationContent`    | Defines the "who" and the "what" of the image media message you intend to send.             |
| `DocumentNotificationContent` | Defines the "who" and the "what" of the Document media message you intend to send.             |
| `VideoNotificationContent`    | Defines the "who" and the "what" of the Video media message you intend to send.             |
| `AudioNotificationContent`    | Defines the "who" and the "what" of the Audio media message you intend to send.             |

> [!NOTE]
> For more information, see the Azure SDK for Python reference [messages Package](/python/api/azure-communication-messages/azure.communication.messages).

## Common configuration

Follow these steps to add required code snippets to the `messages-quickstart.py` python program.

- [Authenticate the client](#authenticate-the-client).
- [Set channel registration ID](#set-channel-registration-id).
- [Set recipient list](#set-recipient-list).
- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-python.md)]

## Code examples

Follow these steps to add required code snippets to the messages-quickstart.py python program.
- [Send a text message to a WhatsApp user](#send-a-text-message-to-a-whatsapp-user).
- [Send an image media message to a WhatsApp user](#send-an-image-media-message-to-a-whatsapp-user).
- [Send a document media message to a WhatsApp user](#send-a-document-media-message-to-a-whatsapp-user).
- [Send an audio media message to a WhatsApp user](#send-an-audio-media-message-to-a-whatsapp-user).
- [Send a video media message to a WhatsApp user](#send-a-video-media-message-to-a-whatsapp-user).

### Send a text message to a WhatsApp user

The Messages SDK enables Contoso to send text WhatsApp messages, when initiated by a WhatsApp user. To send text messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- Message body/text to be sent.

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, we reply to the WhatsApp user with the text `"Thanks for your feedback.\n From Notification Messaging SDK."`

```python
    def send_text_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ( TextNotificationContent)

        # Create NotificationMessagesClient Client
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)
        text_options = TextNotificationContent (
            channel_registration_id=self.channelRegistrationId,
            to= [self.phone_number],
            content="Thanks for your feedback.\n From Notification Messaging SDK",
        )
        
        # calling send() with whatsapp message details
        message_responses = messaging_client.send(text_options)
        response = message_responses.receipts[0]
        
        if (response is not None):
            print("WhatsApp Text Message with message id {} was successfully sent to {}."
            .format(response.message_id, response.to))
        else:
            print("Message failed to send")
```

To run `send_text_message()`, update the [main method](#basic-program-structure):

```python
    #Calling send_text_message()
    messages.send_text_message()
```

### Send an image media message to a WhatsApp user

The Messages SDK enables Contoso to send image WhatsApp messages to WhatsApp users. To send image embedded messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- MediaUri of the image.

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

An example of `media_uri` used when sending a media WhatsApp message.

`input_media_uri: str = "https://aka.ms/acsicon1"`

```python
    def send_image_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ( ImageNotificationContent)

        # Create NotificationMessagesClient Client
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)
        input_media_uri: str = "https://aka.ms/acsicon1"
        image_message_options = ImageNotificationContent(
            channel_registration_id=self.channelRegistrationId,
            to=[self.phone_number],
            media_uri=input_media_uri
        )

        # calling send() with whatsapp image message
        message_responses = messaging_client.send(image_message_options)
        response = message_responses.receipts[0]
        
        if (response is not None):
            print("WhatsApp Image containing Message with message id {} was successfully sent to {}"
            .format(response.message_id, response.to))
        else:
            print("Message failed to send")
```

To run `send_text_message()`, update the [main method](#basic-program-structure):

```python
    # Calling send_image_message()
    messages.send_image_message()
```

### Send a document media message to a WhatsApp user

The Messages SDK enables Contoso to send document WhatsApp messages to WhatsApp users. To send document embedded messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- MediaUri of the document.

> [!IMPORTANT]
> To send a document message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

An example of `media_uri` used when sending a media WhatsApp message.

`input_media_uri: str = "##DocumentLinkPlaceholder##"`

```python
    def send_document_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ( DocumentNotificationContent)

        # Create NotificationMessagesClient Client
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)
        input_media_uri: str = "##DocumentLinkPlaceholder##"
        documents_options = DocumentNotificationContent(
            channel_registration_id=self.channelRegistrationId,
            to=[self.phone_number],
            caption="Hello World via Advanced Messaging SDK.This is document message",
            file_name="Product roadmap timeline.pptx",
            media_uri=input_media_uri,
        )

        # calling send() with whatsapp image message
        message_responses = messaging_client.send(documents_options)
        response = message_responses.receipts[0]
        
        if (response is not None):
            print("WhatsApp Document containing Message with message id {} was successfully sent to {}"
            .format(response.message_id, response.to))
        else:
            print("Message failed to send")
```

To run `send_text_message()`, update the [main method](#basic-program-structure):

```python
    # Calling send_image_message()
    messages.send_image_message()
```

### Send an audio media message to a WhatsApp user

The Messages SDK enables Contoso to send image WhatsApp messages to WhatsApp users. To send audio embedded messages:

- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- MediaUri of the audio.

> [!IMPORTANT]
> To send an audio message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

An example of `media_uri` used when sending a media WhatsApp message.

`input_media_uri: str = "##AudioLinkPlaceholder##"`

```python
    def send_audio_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ( AudioNotificationContent)

        # Create NotificationMessagesClient Client
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)
        input_media_uri: str = "##AudioLinkPlaceholder##"
        audio_options = AudioNotificationContent(
            channel_registration_id=self.channelRegistrationId,
            to=[self.phone_number],
            media_uri=input_media_uri,
        )

        # calling send() with whatsapp image message
        message_responses = messaging_client.send(audio_options)
        response = message_responses.receipts[0]
        
        if (response is not None):
            print("WhatsApp Audio containing Message with message id {} was successfully sent to {}"
            .format(response.message_id, response.to))
        else:
            print("Message failed to send")
```

To run `send_text_message()`, update the [main method](#basic-program-structure):

```python
    # Calling send_image_message()
    messages.send_image_message()
```

### Send a video media message to a WhatsApp user

The Messages SDK enables Contoso to send video WhatsApp messages to WhatsApp users. To send video embedded messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- MediaUri of the video.

> [!IMPORTANT]
> To send a video message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

An example of `media_uri` used when sending a media WhatsApp message.

`input_media_uri: str = "##VideoLinkPlaceholder##"`

```python
    def send_video_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ( VideoNotificationContent)

        # Create NotificationMessagesClient Client
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)
        input_media_uri: str = "##VideoLinkPlaceholder##"
        video_options = VideoNotificationContent(
            channel_registration_id=self.channelRegistrationId,
            to=[self.phone_number],
            media_uri=input_media_uri,
        )

        # calling send() with whatsapp image message
        message_responses = messaging_client.send(image_message_options)
        response = message_responses.receipts[0]
        
        if (response is not None):
            print("WhatsApp Video containing Message with message id {} was successfully sent to {}"
            .format(response.message_id, response.to))
        else:
            print("Message failed to send")
```

To run `send_text_message()`, update the [main method](#basic-program-structure):

```python
    # Calling send_image_message()
    messages.send_image_message()
```

### Run the code

To run the code, make sure you are on the directory where your `messages-quickstart.py` file is located.

```console
python messages-quickstart.py
```

```output
Azure Communication Services - Advanced Messages Quickstart
WhatsApp Templated Message with message id <<GUID>> was successfully sent to <<ToRecipient>>
WhatsApp Text Message with message id <<GUID>> was successfully sent to <<ToRecipient>>
WhatsApp Image containing Message with message id <<GUID>> was successfully sent to <<ToRecipient>>
```

## Full sample code

> [!NOTE]
> Replace all placeholder variables in the sample code with your values.

```python
import os

class MessagesQuickstart(object):
    print("Azure Communication Services - Advanced Messages SDK Quickstart using connection string.")
    # Advanced Messages SDK implementations goes in this section.
   
    connection_string = os.getenv("COMMUNICATION_SERVICES_CONNECTION_STRING")
    phone_number = os.getenv("RECIPIENT_PHONE_NUMBER")
    channelRegistrationId = os.getenv("WHATSAPP_CHANNEL_ID")

    def send_template_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ( TemplateNotificationContent , MessageTemplate )

        # client creation
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)
        input_template: MessageTemplate = MessageTemplate(
            name="<<TEMPLATE_NAME>>",
            language="<<LANGUAGE>>")
        template_options = TemplateNotificationContent(
            channel_registration_id=self.channelRegistrationId,
            to=[self.phone_number],
            template=input_template
        )

        # calling send() with WhatsApp template details.
        message_responses = messaging_client.send(template_options)
        response = message_responses.receipts[0]
        
        if (response is not None):
            print("WhatsApp Templated Message with message id {} was successfully sent to {}"
            .format(response.message_id, response.to))
        else:
            print("Message failed to send")

    def send_text_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ( TextNotificationContent )

        # client creation
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)

        text_options = TextNotificationContent (
            channel_registration_id=self.channelRegistrationId,
            to= [self.phone_number],
            content="Hello World via ACS Advanced Messaging SDK.",
        )
        
        # calling send() with WhatsApp message details
        message_responses = messaging_client.send(text_options)
        response = message_responses.receipts[0]
        
        if (response is not None):
            print("WhatsApp Text Message with message id {} was successfully sent to {}"
            .format(response.message_id, response.to))
        else:
            print("Message failed to send")

    def send_image_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ( ImageNotificationContent)

        # Create NotificationMessagesClient Client
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)
        input_media_uri: str = "https://aka.ms/acsicon1"
        image_message_options = ImageNotificationContent(
            channel_registration_id=self.channelRegistrationId,
            to=[self.phone_number],
            media_uri=input_media_uri
        )

        # calling send() with whatsapp image message
        message_responses = messaging_client.send(image_message_options)
        response = message_responses.receipts[0]
        
        if (response is not None):
            print("WhatsApp Image containing Message with message id {} was successfully sent to {}"
            .format(response.message_id, response.to))
        else:
            print("Message failed to send")
    
    def send_document_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ( DocumentNotificationContent)

        # Create NotificationMessagesClient Client
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)
        input_media_uri: str = "##DocumentLinkPlaceholder##"
        documents_options = DocumentNotificationContent(
            channel_registration_id=self.channelRegistrationId,
            to=[self.phone_number],
            caption="Hello World via Advanced Messaging SDK.This is document message",
            file_name="Product roadmap timeline.pptx",
            media_uri=input_media_uri,
        )

        # calling send() with whatsapp image message
        message_responses = messaging_client.send(documents_options)
        response = message_responses.receipts[0]
        
        if (response is not None):
            print("WhatsApp Document containing Message with message id {} was successfully sent to {}"
            .format(response.message_id, response.to))
        else:
            print("Message failed to send")

    def send_audio_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ( AudioNotificationContent)

        # Create NotificationMessagesClient Client
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)
        input_media_uri: str = "##AudioLinkPlaceholder##"
        audio_options = AudioNotificationContent(
            channel_registration_id=self.channelRegistrationId,
            to=[self.phone_number],
            media_uri=input_media_uri,
        )

        # calling send() with whatsapp image message
        message_responses = messaging_client.send(audio_options)
        response = message_responses.receipts[0]
        
        if (response is not None):
            print("WhatsApp Audio containing Message with message id {} was successfully sent to {}"
            .format(response.message_id, response.to))
        else:
            print("Message failed to send")

    def send_video_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ( VideoNotificationContent)

        # Create NotificationMessagesClient Client
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)
        input_media_uri: str = "##VideoLinkPlaceholder##"
        video_options = VideoNotificationContent(
            channel_registration_id=self.channelRegistrationId,
            to=[self.phone_number],
            media_uri=input_media_uri,
        )

        # calling send() with whatsapp image message
        message_responses = messaging_client.send(image_message_options)
        response = message_responses.receipts[0]
        
        if (response is not None):
            print("WhatsApp Video containing Message with message id {} was successfully sent to {}"
            .format(response.message_id, response.to))
        else:
            print("Message failed to send")

if __name__ == '__main__':
    messages = MessagesQuickstart()
    messages.send_template_message()
    messages.send_text_message()
    messages.send_image_message()
    messages.send_document_message()
    messages.send_audio_message()
    messages.send_video_message()
```

### Other samples

You can review and download other sample codes on GitHub for [Python Messages SDK](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/messages-quickstart).
