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

### Create a new Python application

In a terminal or console window, create a new folder for your application and navigate to it.

```console
mkdir messages-quickstart && cd messages-quickstart
```

### Install the package

You need to use the Azure Communication Messages client library for Python [version 1.2.0](https://pypi.org/project/azure-communication-messages) or above.

From a console prompt, execute the following command:

```console
pip install azure-communication-messages
```

### Set up the app framework

Create a new file called `interactive-messages-quickstart.py` and add the basic program structure.

```console
type nul > interactive-messages-quickstart.py   
```
#### Basic program structure
```python
import os

class MessagesQuickstart(object):
    print("Azure Communication Services - Advanced Messages SDK QuickstartFor Interactive Types.")

if __name__ == '__main__':
    messages = MessagesQuickstart()
```

## Object model
The following classes and interfaces handle some of the major features of the Azure Communication Services Messages SDK for Python.

| Name                        | Description                                                                                            |
|-----------------------------|--------------------------------------------------------------------------------------------------------|
| NotificationMessagesClient  | This class connects to your Azure Communication Services resource. It sends the messages.              |
| InteractiveNotificationContent  | This class defines the interactive message business can send to user. |
| InteractiveMessage | This class defines interactive message content.|
| WhatsAppListActionBindings | This class defines WhatsApp List interactive message properties binding . |
| WhatsAppButtonActionBindings| This class defines WhatsApp Button interactive message properties binding .|
| WhatsAppUrlActionBindings | This class defines WhatsApp Url interactive message properties binding .|
| TextMessageContent     | This class defines the text content for Interactive message body , footer, header. |
| VideoMessageContent   | This class defines the video content for Interactive message header.  |
| DocumentMessageContent | This class defines the document content for Interactive message header. |
| ImageMessageContent | This class defines the image content for Interactive message header.|
| ActionGroupContent | This class defines the ActionGroup or ListOptions content for Interactive message.|
| ButtonSetContent | This class defines the Reply Buttons content for Interactive message. |
| LinkContent | This class defines the Url or Click-To-Action content for Interactive message. |

## Code examples

Follow these steps to add the necessary code snippets to the messages-quickstart.py python program.

- [Authenticate the client](#authenticate-the-client)
- [Set channel registration ID](#set-channel-registration-id)
- [Set recipient list](#set-recipient-list)
- [Send a Interactive List options messages to a WhatsApp user](#send-a-interactive-list-options-messages-to-a-whatsapp-user)
- [Send a Interactive Reply Button message to a WhatsApp user](#send-a-interactive-reply-button-messages-to-a-whatsapp-user)
- [Send a Interactive CTA Url based message to a WhatsApp user](#send-a-interactive-cta-url-based-messages-to-a-whatsapp-user)

### Authenticate the client 

Messages sending is done using NotificationMessagesClient. NotificationMessagesClient is authenticated using your connection string acquired from Azure Communication Services resource in the Azure portal. For more information on connection strings, see [access-your-connection-strings-and-service-endpoints](../../../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

#### [Connection String](#tab/connection-string)

Get Azure Communication Resource connection string from Azure portal as given in screenshot. On the left, navigate to the `Keys` tab. Copy the `Connection string` field for the primary key. The connection string is in the format `endpoint=https://{your Azure Communication Services resource name}.communication.azure.com/;accesskey={secret key}`.

:::image type="content" source="../../media/get-started/get-communication-resource-connection-string.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Primary Key' field in the 'Keys' section.":::

Set the environment variable `COMMUNICATION_SERVICES_CONNECTION_STRING` to the value of your connection string.   
Open a console window and enter the following command:
```console
setx COMMUNICATION_SERVICES_CONNECTION_STRING "<your connection string>"
```
After you add the environment variable, you might need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

For more information on how to set an environment variable for your system, follow the steps at [Store your connection string in an environment variable](../../../../create-communication-resource.md#store-your-connection-string-in-an-environment-variable).

```python
    # Get a connection string to our Azure Communication Services resource.
    connection_string = os.getenv("COMMUNICATION_SERVICES_CONNECTION_STRING")
    
    def send_template_message(self):
        from azure.communication.messages import NotificationMessagesClient

        # Create NotificationMessagesClient Client
        messaging_client = NotificationMessagesClient.from_connection_string(self.connection_string)
```

#### [Microsoft Entra ID](#tab/aad)

NotificationMessagesClient is also authenticated using Microsoft Entra ID/TokenCredentials. For more information, see [access-Azure-Communication-Resources-using-TokenCredentials](/python/api/overview/azure/identity-readme?view=azure-python&preserve-view=true#environment-variables).

The [`azure.identity`](https://github.com/Azure/azure-sdk-for-python/tree/azure-identity_1.15.0/sdk/identity/azure-identity) package provides various credential types that your application can use to authenticate. You can choose from the various options to authenticate the identity client detailed at [Azure Identity - Credential providers](/python/api/overview/azure/identity-readme?view=azure-python#credential-classes&preserve-view=true) and [Azure Identity - Authenticate the client](/python/api/overview/azure/identity-readme?view=azure-python#authenticate-with-defaultazurecredential&preserve-view=true). This option walks through one way of using the [`DefaultAzureCredential`](/python/api/overview/azure/identity-readme?view=azure-python#defaultazurecredential&preserve-view=true).
 
The `DefaultAzureCredential` attempts to authenticate via [`several mechanisms`](/python/api/overview/azure/identity-readme?view=azure-python#defaultazurecredential&preserve-view=true) and it might be able to find its authentication credentials if you're signed into Visual Studio or Azure CLI. However, this option walks you through setting up with environment variables.   

To create a `DefaultAzureCredential` object:
1. To set up your service principle app, follow the instructions at [Creating a Microsoft Entra registered Application](../../../../identity/service-principal.md?pivots=platform-azcli#creating-a-microsoft-entra-registered-application).

1. Set the environment variables `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID` using the output of your app's creation.    
    Open a console window and enter the following commands:
    ```console
    setx COMMUNICATION_SERVICES_ENDPOINT_STRING "<https://<resource name>.communication.azure.com>"
    setx AZURE_CLIENT_ID "<your app's appId>"
    setx AZURE_CLIENT_SECRET "<your app's password>"
    setx AZURE_TENANT_ID "<your app's tenant>"
    ```
    After you add the environment variables, you might need to restart any running programs that will need to read the environment variables, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

1. To use the [`DefaultAzureCredential`](/python/api/overview/azure/identity-readme?view=azure-python#defaultazurecredential&preserve-view=true) provider, or other credential providers provided with the Azure SDK, install the `azure.identity` python package and then instantiate client.
    
```python
    # Get a connection string to our Azure Communication Services resource.
    endpoint_string = os.getenv("COMMUNICATION_SERVICES_ENDPOINT_STRING")
    
    def send_template_message(self):
        from azure.communication.messages import NotificationMessagesClient
        from azure.identity import DefaultAzureCredential

        # Create NotificationMessagesClient Client
        messaging_client = NotificationMessagesClient(endpoint=self.endpoint_string,
                                                    credential=DefaultAzureCredential())
```

#### [AzureKeyCredential](#tab/azurekeycredential)

You can also authenticate with an AzureKeyCredential.

Get the endpoint and key from your Azure Communication Services resource in the Azure portal. On the left, navigate to the `Keys` tab. Copy the `Endpoint` and the `Key` field for the primary key.

:::image type="content" source="../../media/get-started/get-communication-resource-endpoint-and-key.png" lightbox="../../media/get-started/get-communication-resource-endpoint-and-key.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Connection string' field in the 'Primary key' section.":::

Set the environment variable `COMMUNICATION_SERVICES_KEY` to the value of your connection string.   
Open a console window and enter the following command:
```console
setx COMMUNICATION_SERVICES_ENDPOINT_STRING "<https://<resource name>.communication.azure.com>"
setx COMMUNICATION_SERVICES_KEY "<your key>"
```
After you add the environment variable, you might need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

For more information on how to set an environment variable for your system, follow the steps at [Store your connection string in an environment variable](../../../../create-communication-resource.md#store-your-connection-string-in-an-environment-variable).

To instantiate a `NotificationMessagesClient`, add the following code:

```python
    # Get a connection string to our Azure Communication Services resource.
    endpoint_string = os.getenv("COMMUNICATION_SERVICES_ENDPOINT_STRING")
    key = os.getenv("COMMUNICATION_SERVICES_KEY")

    def send_template_message(self):
        from azure.core.credentials import AzureKeyCredential
        from azure.communication.messages import NotificationMessagesClient

        # Create NotificationMessagesClient Client
        messaging_client = NotificationMessagesClient(endpoint=self.endpoint_string,
                                                    credential=AzureKeyCredential(self.key))
```
---

### Set channel registration ID   

The Channel Registration ID GUID was created during [channel registration](../../connect-whatsapp-business-account.md). You can look it up in the portal on the Channels tab of your Azure Communication Services resource.

:::image type="content" source="../../media/get-started/get-messages-channel-id.png" lightbox="../../media/get-started/get-messages-channel-id.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Channels' tab. Attention is placed on the copy action of the 'Channel ID' field.":::

Assign it to a variable called channelRegistrationId.
```python
    channelRegistrationId = os.getenv("WHATSAPP_CHANNEL_ID_GUID")
```

### Set recipient list

You need to supply a real phone number that has a WhatsApp account associated with it. This WhatsApp account receives the template, text, and media messages sent in this quickstart.
For this quickstart, this phone number may be your personal phone number.   

The recipient phone number can't be the business phone number (Sender ID) associated with the WhatsApp channel registration. The Sender ID appears as the sender of the text and media messages sent to the recipient.

The phone number should include the country code. For more information on phone number formatting, see WhatsApp documentation for [Phone Number Formats](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#phone-number-formats).

> [!NOTE]
> Only one phone number is currently supported in the recipient list.

Set the recipient list like this:
```python
    phone_number = os.getenv("RECIPIENT_WHATSAPP_PHONE_NUMBER")
```

Usage Example:
```python
    # Example only
    to=[self.phone_number],
```

### Start sending messages between a business and a WhatsApp user

Conversations between a WhatsApp Business Account and a WhatsApp user can be initiated in one of two ways:
- The business sends a template message to the WhatsApp user.
- The WhatsApp user sends any message to the business number.

For Interactive messages, Only after the user sends a message to the business, the business is allowed to send interactive messages to the user during the active conversation. Once the 24 hour conversation window expires, the conversation must be reinitiated. To learn more about conversations, see the definition at [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp/pricing#conversations).

To initiate a conversation between a WhatsApp Business Account and a WhatsApp user is to have the user initiate the conversation.
To do so, from your personal WhatsApp account, send a message to your business number (Sender ID).

:::image type="content" source="../../media/get-started/user-initiated-conversation.png" lightbox="../../media/get-started/user-initiated-conversation.png" alt-text="A WhatsApp conversation viewed on the web showing a user message sent to the WhatsApp Business Account number.":::

### Send a Interactive List options messages to a WhatsApp user

Advanced Messages SDK allows Contoso to send interactive WhatsApp messages, which initiated WhatsApp users initiated. To send text messages below details are required:
- [WhatsApp Channel ID](#set-channel-registration-id)
- [Recipient Phone Number in E16 format](#set-recipient-list)
- List Message can be created using given properties:

| Action type   | Description |
|----------|---------------------------|
| ActionGroupContent    | This class defines title of the group content and array of the group.    |
| ActionGroup    | This class defines title of the group and array of the group Items.   |
| ActionGroupItem | This class defines Id, Title and description of the group Item. |
| WhatsAppListActionBindings| This class defines the ActionGroupContent binding with the Interactive message. |

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, business sends inetractive shipping options message"
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

To run send_text_message(), update the [main method](#basic-program-structure)
```python
    #Calling send_whatsapplist_message()
    messages.send_whatsapplist_message()
```

### Send a Interactive Reply Button message to a WhatsApp user

Messages SDK allows Contoso to send Image WhatsApp messages to WhatsApp users. To send Image embedded messages below details are required:
- [WhatsApp Channel ID](#set-channel-registration-id)
- [Recipient Phone Number in E16 format](#set-recipient-list)
- Reply Button Message can be created using given properties:

| Action type   | Description |
|----------|---------------------------|
| ButtonSetContent    | This class defines button set content for reply button messages.  |
| ButtonContent    | This class defines id and title of the reply buttons.  |
| WhatsAppButtonActionBindings| This class defines the ButtonSetContent binding with the Interactive message. |

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

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

To run send_whatsappreplybutton_message(), update the [main method](#basic-program-structure)
```python
    # Calling send_imagesend_whatsappreplybutton_message_message()
    messages.send_whatsappreplybutton_message()
```

### Send a Interactive CTA Url based message to a WhatsApp user

Messages SDK allows Contoso to send Image WhatsApp messages to WhatsApp users. To send Image embedded messages below details are required:
- [WhatsApp Channel ID](#set-channel-registration-id)
- [Recipient Phone Number in E16 format](#set-recipient-list)
- Click-To-Action or Link content Message can be created using given properties:

| Action type   | Description |
|----------|---------------------------|
| LinkContent    | This class defines url or link content for message.  |
| WhatsAppUrlActionBindings| This class defines the LinkContent binding with the Interactive message. |

> [!IMPORTANT]
> To send a document message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

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
        print("Message with message id {} was successful sent to {}".format(response.message_id, response.to))
```

To run send_whatapp_click_to_action_message(), update the [main method](#basic-program-structure)
```python
    # Calling send_whatapp_click_to_action_message()
    messages.send_whatapp_click_to_action_message()
```

## Run the code

To run the code, make sure you are on the directory where your `messages-quickstart.py` file is.

```console
python interactive-messages-quickstart.py
```

```output
Azure Communication Services - Advanced Messages Quickstart
WhatsApp List Message with message id <<GUID>> was successfully sent to <<ToRecipient>>
WhatsApp Button Message with message id <<GUID>> was successfully sent to <<ToRecipient>>
WhatsApp CTA containing Message with message id <<GUID>> was successfully sent to <<ToRecipient>>
```

## Full sample code

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
        print("Message with message id {} was successful sent to {}".format(response.message_id, response.to))

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
            print("Message with message id {} was successful sent to {}".format(response.message_id, response.to))


if __name__ == '__main__':
    messages = MessagesQuickstart()
    messages.send_whatsapplist_message()
    messages.send_whatsappreplybutton_message()
    messages.send_whatapp_click_to_action_message()
```

> [!NOTE]
> Please update all placeholder variables in the above code.

### Other Samples

You can review and download other sample codes for Python Messages SDK on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/messages-quickstart).
