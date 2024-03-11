---
title: Include file
description: Include file
services: azure-communication-services
author: shamkh
manager: camilo.ramirez
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 02/20/2024
ms.topic: include
ms.custom: Include file
ms.author: shamkh
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../../../create-communication-resource.md).
- [Python](https://www.python.org/downloads/) 3.7+ for your operating system.

## Sample code

You can review and download the sample code for this quick start on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/messages-quickstart).

## Setting up

### Create a new Python application

In a terminal or console window, create a new folder for your application and navigate to it.

```console
mkdir messages-quickstart && cd messages-quickstart
```

### Install the package

You need to use the Azure Communication Messages client library for Python [version 1.0.0](https://pypi.org/project/azure-communication-messages) or above.

From a console prompt, execute the following command:

```console
pip install azure-communication-messages
```

### Set up the app framework

Create a new file called `messages-quickstart.py` and add the basic program structure.

```console
type nul > messages-quickstart.py   
```

```python
import os

class MessagesQuickstart(object):
    print("Azure Communication Services - Advanced Messages Quickstart")

```

## Initialize the NotificationMessagesClient

Messages sending is done using NotificationMessagesClient. NotificationMessagesClient is authenticated using your connection string acquired from Azure Communication Services resource in the Azure Portal. For more information on connection strings, see [access-your-connection-strings-and-service-endpoints](../../../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints). NotificationMessagesClient is also authenticated using TokenCredentials. For more information see [access-Azure-Communication-Resources-using-TokenCredentials](https://learn.microsoft.com/python/api/overview/azure/identity-readme?view=azure-python&preserve-view=true#environment-variables).
Get Azure Communication Resource connection string from Azure Portal as given in screenshot:

:::image type="content" source="../../media/get-started/get-communication-resource-connection-string.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure Portal, viewing the 'Primary Key' field in the 'Keys' section.":::

Then Get WhatsChannelId from Azure Portal as given in screenshot:

:::image type="content" source="../../media/get-started/get-messages-channel-id.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure Portal, viewing the 'Channels' field in the 'Advanced Messaging' section.":::

```python
    # Get a connection string to our Azure Communication Services resource.
    connection_string = os.getenv("COMMUNICATION_SAMPLES_CONNECTION_STRING")
    phone_number = os.getenv("RECIPIENT_PHONE_NUMBER")
    channel_id = os.getenv("WHATSAPP_CHANNEL_ID")
    
    def send_template_send_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ( TemplateNotificationContent , MessageTemplate )

        # Create NotificationMessagesClient Client
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)

```

## Send Template WhatsApp Messages

Messages SDK allows Contoso to send templated WhatsApp messages to WhatsApp users. To send template messages below details are required:
- WhatsApp Channel ID
- Recipient Phone Number in E16 format
- Template details
    - Name
    - Language
    - Parameters if any

```python
        input_template: MessageTemplate = MessageTemplate(
            name="<<TemplateName>>",
            language="<<TemplateLanguage>>")
        template_options = TemplateNotificationContent(
            channel_registration_id=self.channel_id,
            to=[self.phone_number],
            template=input_template
        )

        # calling send() with whatsapp template details
        message_responses = messaging_client.send(template_options)
        response = message_responses.receipts[0]
        
        if (response is not None):
            print("WhatsApp Templated Message with message id {} was successful sent to {}"
            .format(response.message_id, response.to))
        else:
            print("Message failed to send")

if __name__ == '__main__':
    messages = MessagesQuickstart()
    messages.send_template_send_message()
```

## Run the code for send template

To run the code, make sure you are on the directory where your `messages-quickstart.py` file is.

```console
python messages-quickstart.py

Azure Communication Services - Advanced Messages Quickstart
Message with message id <GUID> was successful sent to <TOPhonenumber>
```

## Send Text WhatsApp Messages

Messages SDK allows Contoso to send text WhatsApp messages, which initiated WhatsApp users initiated. To send text messages below details are required:
- WhatsApp Channel ID
- Recipient Phone Number in E16 format
- Message body to be sent

```python
    def send_text_send_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ( TextNotificationContent )

        # Create NotificationMessagesClient Client
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)
        text_options = TextNotificationContent (
            channel_registration_id=self.channel_id,
            to= [self.phone_number],
            content="Hello World via Notification Messaging SDK.",
        )
        
        # calling send() with whatsapp message details
        message_responses = messaging_client.send(text_options)
        response = message_responses.receipts[0]
        
        if (response is not None):
            print("Message with message id {} was successful sent to {}"
            .format(response.message_id, response.to))
        else:
            print("Message failed to send")

# Update the main function to run send_text_send_message()
if __name__ == '__main__':
    messages = MessagesQuickstart()
    messages.send_text_send_message()
```

## Run the code for send text message

To run the code, make sure you are on the directory where your `messages-quickstart.py` file is.

```console
python messages-quickstart.py

Azure Communication Services - Advanced Messages Quickstart
Message with message id <GUID> was successful sent to <TOPhonenumber>
```

## Full code

```python
import os

class MessagesQuickstart(object):
    print("Azure Communication Services - Advanced Messages Quickstart")
    # Advanced Messages SDK implementations goes in this section.
   
    connection_string = os.getenv("COMMUNICATION_SAMPLES_CONNECTION_STRING")
    phone_number = os.getenv("RECIPIENT_PHONE_NUMBER")
    channel_id = os.getenv("WHATSAPP_CHANNEL_ID")

    def send_template_send_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ( TemplateNotificationContent , MessageTemplate )

        # client creation
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)
        input_template: MessageTemplate = MessageTemplate(
            name="<<TEMPLATE_NAME>>",
            language="<<LANGUAGE>>")
        template_options = TemplateNotificationContent(
            channel_registration_id=self.channel_id,
            to=[self.phone_number],
            template=input_template
        )

        # calling send() with WhatsApp template details.
        message_responses = messaging_client.send(template_options)
        response = message_responses.receipts[0]
        
        if (response is not None):
            print("WhatsApp Templated Message with message id {} was successful sent to {}"
            .format(response.message_id, response.to))
        else:
            print("Message failed to send")

    def send_text_send_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.communication.messages.models import ( TextNotificationContent )

        # client creation
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)

        text_options = TextNotificationContent (
            channel_registration_id=self.channel_id,
            to= [self.phone_number],
            content="Hello World via ACS Advanced Messaging SDK.",
        )
        
        # calling send() with WhatsApp message details
        message_responses = messaging_client.send(text_options)
        response = message_responses.receipts[0]
        
        if (response is not None):
            print("WhatsApp Text Message with message id {} was successful sent to {}"
            .format(response.message_id, response.to))
        else:
            print("Message failed to send")


if __name__ == '__main__':
    messages = MessagesQuickstart()
    messages.send_template_send_message()
    messages.send_text_send_message()
```

> [!NOTE]
> Sending text WhatsApp messages needs to be User-Intiated. For more information, see [User Initiated WhatsApp Messages](https://developers.facebook.com/docs/whatsapp/pricing/#opening-conversations).


