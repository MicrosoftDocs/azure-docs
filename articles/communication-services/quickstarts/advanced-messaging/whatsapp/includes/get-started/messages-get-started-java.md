---
title: Include file
description: Include file
services: azure-communication-services
author: arifibrahim4
ms.service: azure-communication-services
ms.date: 02/29/2024
ms.topic: include
ms.custom: include file
ms.author: armohamed
---

## Prerequisites

- [WhatsApp Business Account registered with your Azure Communication Services resource](../../connect-whatsapp-business-account.md)
- Active WhatsApp phone number to receive messages

- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or later
- [Apache Maven](https://maven.apache.org/download.cgi)

## Setting up

To set up an environment for sending messages, take the steps in the following sections.

### Create a new Java application

Open your terminal or command window and navigate to the directory where you would like to create your Java application. Run the following command to generate the Java project from the maven-archetype-quickstart template.

```console
mvn archetype:generate -DgroupId="com.communication.quickstart" -DartifactId="communication-quickstart" -DarchetypeArtifactId="maven-archetype-quickstart" -DarchetypeVersion="1.4" -DinteractiveMode="false"
```

The `generate` goal creates a directory with the same name as the `artifactId` value. Under this directory, the **src/main/java** directory contains the project source code, the **src/test/java directory** contains the test source, and the **pom.xml** file is the project's Project Object Model (POM).

### Install the package

Open the **pom.xml** file in your text editor. Add the following dependency element to the group of dependencies.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-messages</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Set up the app framework

Open **/src/main/java/com/communication/quickstart/App.java** in a text editor, add import directives, and remove the `System.out.println("Hello world!");` statement:

```java
package com.communication.quickstart;

import com.azure.communication.messages.*;
import com.azure.communication.messages.models.*;

import java.util.ArrayList;
import java.util.List;
public class App
{
    public static void main( String[] args )
    {
        // Quickstart code goes here.
    }
}
```

## Object model
The following classes and interfaces handle some of the major features of the Azure Communication Services Advance Messaging SDK for Java.

| Name                                        | Description                                                                                            |
| --------------------------------------------|------------------------------------------------------------------------------------------------------  |
| NotificationMessagesClientBuilder           | This class creates the Notification Messages Client. You provide it with an endpoint and a credential. |
| NotificationMessagesClient                  | This class is needed to send WhatsApp messages and download media files.                               |
| NotificationMessagesAsyncClient             | This class is needed to send WhatsApp messages and download media files asynchronously.                |
| SendMessageResult                           | This class contains the result from the Advance Messaging service for send notification message.       |
| MessageTemplateClientBuilder                | This class creates the Message Template Client. You provide it with an endpoint and a credential.      |
| MessageTemplateClient                       | This class is needed to get the list of WhatsApp templates.                                            |
| MessageTemplateAsyncClient                  | This class is needed to get the list of WhatsApp templates asynchronously.                             |

## Code examples

Follow these steps to add the necessary code snippets to the main function of your *App.java* file.

- [Authenticate the client](#authenticate-the-client)
- [Set channel registration ID](#set-channel-registration-id)
- [Set recipient list](#set-recipient-list)
- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user)
  - [Send a template message to a WhatsApp User](#option-1-initiate-conversation-from-business---send-a-template-message)
  - [Initiate conversation from user](#option-2-initiate-conversation-from-user)
- [Send a text message to a WhatsApp user](#send-a-text-message-to-a-whatsapp-user)
- [Send a media message to a WhatsApp user](#send-a-media-message-to-a-whatsapp-user)

### Authenticate the client

There are a few different options available for authenticating a Message client:

#### [Connection String](#tab/connection-string)

To authenticate a client, you instantiate an `NotificationMessagesClient` or `MessageTemplateClient` with your connection string. You can also initialize the client with any custom HTTP client that implements the `com.azure.core.http.HttpClient` interface.

For simplicity, this quickstart uses a connection string to authenticate. In production environments, we recommend using [service principals](../../../../identity/service-principal.md).

Get the connection string from your Azure Communication Services resource in the Azure portal. On the left, navigate to the `Keys` tab. Copy the `Connection string` field for the `Primary key`. The connection string is in the format `endpoint=https://{your Azure Communication Services resource name}.communication.azure.com/;accesskey={secret key}`.

:::image type="content" source="../../media/get-started/get-communication-resource-connection-string.png" lightbox="../../media/get-started/get-communication-resource-connection-string.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Connection string' field in the 'Primary key' section.":::

Set the environment variable `COMMUNICATION_SERVICES_CONNECTION_STRING` to the value of your connection string.   
Open a console window and enter the following command:
```console
setx COMMUNICATION_SERVICES_CONNECTION_STRING "<your connection string>"
```

For more information on how to set an environment variable for your system, follow the steps at [Store your connection string in an environment variable](../../../../create-communication-resource.md#store-your-connection-string-in-an-environment-variable).

To instantiate a NotificationMessagesClient, add the following code to the `main` method:

```java
// You can get your connection string from your resource in the Azure portal.
String connectionString = System.getenv("COMMUNICATION_SERVICES_CONNECTION_STRING");

NotificationMessagesClient notificationClient = new NotificationMessagesClientBuilder()
    .connectionString(connectionString)
    .buildClient();
```

<a name='azure-active-directory'></a>

#### [Microsoft Entra ID](#tab/aad)

You can also authenticate with Microsoft Entra ID using the [Azure Identity library](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/identity/azure-identity). 

The [`Azure.Identity`](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/identity/azure-identity) package provides various credential types that your application can use to authenticate. You can choose from the various options to authenticate the identity client detailed at [Azure Identity - Credential providers](/java/api/overview/azure/identity-readme#credentials) and [Azure Identity - Authenticate the client](/java/api/overview/azure/identity-readme#authenticate-the-client). This option walks through one way of using the [`DefaultAzureCredential`](/java/api/overview/azure/identity-readme#defaultazurecredential).

The `DefaultAzureCredential` attempts to authenticate via [`several mechanisms`](/java/api/overview/azure/identity-readme#defaultazurecredential) and it might be able to find its authentication credentials if you're signed into Visual Studio or Azure CLI. However, this option walks you through setting up with environment variables.   

To create a `DefaultAzureCredential` object:
1. To set up your service principle app, follow the instructions at [Creating a Microsoft Entra registered Application](../../../../identity/service-principal.md?pivots=platform-azcli#creating-a-microsoft-entra-registered-application).

1. Set the environment variables `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID` using the output of your app's creation.    
    Open a console window and enter the following commands:
    ```console
    setx AZURE_CLIENT_ID "<your app's appId>"
    setx AZURE_CLIENT_SECRET "<your app's password>"
    setx AZURE_TENANT_ID "<your app's tenant>"
    ```
    After you add the environment variables, you might need to restart any running programs that will need to read the environment variables, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

1. To use the [`DefaultAzureCredential`](/java/api/overview/azure/identity-readme#defaultazurecredential) provider, or other credential providers provided with the Azure SDK, follow the instruction to include the `azure-identity` package at [Azure Identity - Include the package](/java/api/overview/azure/identity-readme#include-the-package).

1. To instantiate a `NotificationMessagesClient`, add the following code to the `Main` method.
    ```java
    String endpoint = "https://<resource name>.communication.azure.com/";
    NotificationMessagesClient notificationClient =  new NotificationMessagesClientBuilder()
        .endpoint(endpoint)
        .credential(new DefaultAzureCredentialBuilder().build())
        .buildClient();
    ```

    A [DefaultAzureCredential](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/identity/azure-identity#defaultazurecredential) object must be passed to the `ClientBuilder` via the `credential()` method. An endpoint must also be set via the `endpoint()` method.

#### [AzureKeyCredential](#tab/azurekeycredential)

NotificationMessage or MessageTemplate clients can also be created and authenticated using the endpoint and Azure Key Credential acquired from an Azure Communication Resource in the [Azure portal](https://portal.azure.com/).

1. Add the import
   ```java
   import com.azure.core.credential.AzureKeyCredential;
   ``` 
    
1. To instantiate a `NotificationMessagesClient`, add the following code to the `Main` method.

    ```java
    String endpoint = "https://<resource name>.communication.azure.com";
    AzureKeyCredential azureKeyCredential = new AzureKeyCredential("<access key>");
    NotificationMessagesClient notificationClient = new NotificationMessagesClientBuilder()
        .endpoint(endpoint)
        .credential(azureKeyCredential)
        .buildClient();
    ```

---

### Set channel registration ID   

The Channel Registration ID GUID was created during channel registration. You can look it up in the portal on the Channels tab of your Azure Communication Services resource.

:::image type="content" source="../../media/get-started/get-messages-channel-id.png" lightbox="../../media/get-started/get-messages-channel-id.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Channels' tab. Attention is placed on the copy action of the 'Channel ID' field.":::

Assign it to a variable called channelRegistrationId.
```java
String channelRegistrationId = "<your channel registration id GUID>";
```

### Set recipient list
You need to supply a real phone number that has a WhatsApp account associated with it. This WhatsApp account receives the text and media messages sent in this quickstart.
For this quickstart, this phone number may be your personal phone number.   

The recipient phone number can't be the business phone number (Sender ID) associated with the WhatsApp channel registration. The Sender ID appears as the sender of the text and media messages sent to the recipient.

The phone number should include the country code. For more information on phone number formatting, see WhatsApp documentation for [Phone Number Formats](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#phone-number-formats).

> [!NOTE]
> Only one phone number is currently supported in the recipient list.

Create the recipient list like this:
```java
List<String> recipientList = new ArrayList<>();
recipientList.add("<to WhatsApp phone number>");
```

Example:
```java
// Example only
List<String> recipientList = new ArrayList<>();
recipientList.add("+14255550199");
```

### Start sending messages between a business and a WhatsApp user

Conversations between a WhatsApp Business Account and a WhatsApp user can be initiated in one of two ways:
- The business sends a template message to the WhatsApp user.
- The WhatsApp user sends any message to the business number.

Regardless of how the conversation was started, **a business can only send template messages until the user sends a message to the business.** Only after the user sends a message to the business, the business is allowed to send text or media messages to the user during the active conversation. Once the 24 hour conversation window expires, the conversation must be reinitiated. To learn more about conversations, see the definition at [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp/pricing#conversations).

#### (Option 1) Initiate conversation from business - Send a template message
Initiate a conversation by sending a template message.

First, create a MessageTemplate using the values for a template. 
> [!NOTE]
> To check which templates you have available, see the instructions at [List templates](../../../../../concepts/advanced-messaging/whatsapp/template-messages.md#list-templates).
> If you don't have a template to use, proceed to [Option 2](#option-2-initiate-conversation-from-user).

Here's MessageTemplate creation using a default template, `sample_template`.   
If `sample_template` isn't available to you, skip to [Option 2](#option-2-initiate-conversation-from-user). For advanced users, see the page [Templates](../../../../../concepts/advanced-messaging/whatsapp/template-messages.md) to understand how to send a different template with Option 1.

Messages SDK allows Contoso to send templated WhatsApp messages to WhatsApp users. To send template messages below details are required:
- [WhatsApp Channel ID](#set-channel-registration-id)
- [Recipient Phone Number in E16 format](#set-recipient-list)
- Template details
    - Name like 'sample_template'
    - Language like 'en_us'
    - Parameters if any
    
```java
// Assemble the template content
String templateName = "sample_template";
String templateLanguage = "en_us";
MessageTemplate messageTemplate = new MessageTemplate(templateName, templateLanguage);

// Assemble template message
TemplateNotificationContent templateContent = new TemplateNotificationContent(channelRegistrationId, recipientList, messageTemplate);

// Send template message
SendMessageResult templateMessageResult = notificationClient.send(templateContent);

// Process result
for (MessageReceipt messageReceipt : templateMessageResult.getReceipts()) {
    System.out.println("Message sent to:" + messageReceipt.getTo() + " and message id:" + messageReceipt.getMessageId());
}
```

Now, the user needs to respond to the template message. From the WhatsApp user account, reply to the template message received from the WhatsApp Business Account. The content of the message is irrelevant for this scenario.

> [!IMPORTANT]
> The recipient must respond to the template message to initiate the conversation before text or media message can be delivered to the recipient.

#### (Option 2) Initiate conversation from user

The other option to initiate a conversation between a WhatsApp Business Account and a WhatsApp user is to have the user initiate the conversation.
To do so, from your personal WhatsApp account, send a message to your business number (Sender ID).

:::image type="content" source="../../media/get-started/user-initiated-conversation.png" lightbox="" alt-text="A WhatsApp conversation viewed on the web showing a user message sent to the WhatsApp Business Account number.":::

### Send a text message to a WhatsApp user

Messages SDK allows Contoso to send text WhatsApp messages, which initiated WhatsApp users initiated. To send text messages below details are required:
- [WhatsApp Channel ID](#set-channel-registration-id)
- [Recipient Phone Number in E16 format](#set-recipient-list)
- Message body/text to be sent

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, we reply to the WhatsApp user with the text "Thanks for your feedback.\n From Notification Messaging SDK".

Assemble then send the text message:
```java
// Assemble text message
TextNotificationContent textContent = new TextNotificationContent(channelRegistrationId, recipientList, "“Thanks for your feedback.\n From Notification Messaging SDK");

// Send text message
SendMessageResult textMessageResult = notificationClient.send(textContent);

// Process result
for (MessageReceipt messageReceipt : textMessageResult.getReceipts()) {
    System.out.println("Message sent to:" + messageReceipt.getTo() + " and message id:" + messageReceipt.getMessageId());
}
```

### Send a media message to a WhatsApp user

Messages SDK allows Contoso to send Image WhatsApp messages to WhatsApp users. To send Image embedded messages below details are required:
- [WhatsApp Channel ID](#set-channel-registration-id)
- [Recipient Phone Number in E16 format](#set-recipient-list)
- MediaUri of the Image

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

As an example, create a URI:
```java
String mediaUrl = "https://aka.ms/acsicon1";
```

Assemble then send the media message:
```java
// Assemble media message
MediaNotificationContent mediaContent = new MediaNotificationContent(channelRegistrationId, recipientList, mediaUrl);

// Send media message
SendMessageResult mediaMessageResult = notificationClient.send(mediaContent);

// Process result
for (MessageReceipt messageReceipt : mediaMessageResult.getReceipts()) {
    System.out.println("Message sent to:" + messageReceipt.getTo() + " and message id:" + messageReceipt.getMessageId());
}
```

## Run the code

1. Navigate to the directory that contains the **pom.xml** file and compile the project by using the `mvn` command.

   ```console
   mvn compile
   ```

1. Run the app by executing the following `mvn` command.

   ```console
   mvn exec:java -D"exec.mainClass"="com.communication.quickstart.App" -D"exec.cleanupDaemonThreads"="false"
   ```

## Full sample code

Find the finalized code for this quickstart on [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/d668cb44f64d303e71d2ee72a8b0382896aa09d5/sdk/communication/azure-communication-messages/src/samples/java/com/azure/communication/messages).



