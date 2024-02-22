---
title: include file
description: include file
services: azure-communication-services
author: arifibrahim4
ms.service: azure-communication-services
ms.date: 03/07/2024
ms.topic: include
ms.custom: include file
ms.author: armohamed
---

> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/d668cb44f64d303e71d2ee72a8b0382896aa09d5/sdk/communication/azure-communication-messages/src/samples/java/com/azure/communication/messages).

### Prerequisite check

- In a terminal or command window, run `mvn -v` to check that Maven is installed.
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or later.
- [Apache Maven](https://maven.apache.org/download.cgi).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../../../create-communication-resource.md).
- A setup managed identity for a development environment, [see Authorize access with managed identity](../../../../identity/service-principal.md?pivot="programming-language-java").
- To view the channels that are associated with your Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/) and locate your Communication Services resource. In the navigation pane on the left, select **Advanced Messaging -> Channels**.

## Set up the application environment

To set up an environment for sending messages, take the steps in the following sections.

### Create a new Java application

Open your terminal or command window and navigate to the directory where you would like to create your Java application. Run the following command to generate the Java project from the maven-archetype-quickstart template.

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
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

import com.azure.communication.messages.models.*;
import com.azure.communication.messages.models.channels.WhatsAppMessageButtonSubType;
import com.azure.communication.messages.models.channels.WhatsAppMessageTemplateBindings;
import com.azure.communication.messages.models.channels.WhatsAppMessageTemplateBindingsButton;
import com.azure.communication.messages.models.channels.WhatsAppMessageTemplateBindingsComponent;
import com.azure.core.credential.AzureKeyCredential;
import com.azure.core.credential.TokenCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;

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

| Name                                        | Description                                                                                           |
| --------------------------------------------|------------------------------------------------------------------------------------------------------ |
| NotificationMessagesClientBuilder           | This class creates the Notification Messages Client. You provide it with an endpoint and a credential |
| NotificationMessagesClient                  | This class is needed to send WhatsApp messages and download media files.                              |
| NotificationMessagesAsyncClient             | This class is needed to send WhatsApp messages and download media files asynchronously.               |
| SendMessageResult                           | This class contains the result from the Advance Messaging service for send notification message.      |
| MessageTemplateClientBuilder                | This class creates the Message Template Client. You provide it with an endpoint and a credential.     |
| MessageTemplateClient                       | This class is needed to get the list of WhatsApp templates.                                           |
| MessageTemplateAsyncClient                  | This class is needed to get the list of WhatsApp templates asynchronously.                            |


## Creating the Message client with authentication

There are a few different options available for authenticating a Message client:

#### [Connection String](#tab/connection-string)

To authenticate a client, you instantiate an `NotificationMessagesClient` or `MessageTemplateClient` with your connection string. Learn how to [manage your resource's connection string](../../../../create-communication-resource.md#store-your-connection-string). You can also initialize the client with any custom HTTP client that implements the `com.azure.core.http.HttpClient` interface.

To instantiate a Notification Message client, add the following code to the `main` method:

```java
// You can get your connection string from your resource in the Azure portal.
String connectionString = "endpoint=https://<resource-name>.communication.azure.com/;accesskey=<access-key>";

NotificationMessagesClient notificationClient = new NotificationMessagesClientBuilder()
    .connectionString(connectionString)
    .buildClient();
```

To instantiate a MessageTemplate Message client, add the following code to the `main` method:

```java
// You can get your connection string from your resource in the Azure portal.
String connectionString = "endpoint=https://<resource-name>.communication.azure.com/;accesskey=<access-key>";

MessageTemplateClient messageTemplateClient = new MessageTemplateClientBuilder()
    .connectionString("<CONNECTION_STRING>")
    .buildClient();
```

<a name='azure-active-directory'></a>

#### [Microsoft Entra ID](#tab/aad)

A [DefaultAzureCredential](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/identity/azure-identity#defaultazurecredential) object must be passed to the `ClientBuilder` via the `credential()` method. An endpoint must also be set via the `endpoint()` method.

The `AZURE_CLIENT_SECRET`, `AZURE_CLIENT_ID`, and `AZURE_TENANT_ID` environment variables are needed to create a `DefaultAzureCredential` object.

```java
// You can find your endpoint and access key from your resource in the Azure portal
String endpoint = "https://<resource-name>.communication.azure.com/";
NotificationMessagesClient notificationClient =  new NotificationMessagesClientBuilder()
    .endpoint(endpoint)
    .credential(new DefaultAzureCredentialBuilder().build())
    .buildClient();
```

```java
// You can find your endpoint and access key from your resource in the Azure portal
String endpoint = "https://<resource-name>.communication.azure.com/";
MessageTemplateClient messageTemplateClient = new MessageTemplateClientBuilder()
    .endpoint(endpoint)
    .credential(new DefaultAzureCredentialBuilder().build())
    .buildClient();
```

#### [AzureKeyCredential](#tab/azurekeycredential)

NotificationMessage or MessageTemplate clients can also be created and authenticated using the endpoint and Azure Key Credential acquired from an Azure Communication Resource in the [Azure portal](https://portal.azure.com/).

```java
String endpoint = "https://<resource-name>.communication.azure.com";
AzureKeyCredential azureKeyCredential = new AzureKeyCredential("<access-key>");
NotificationMessagesClient notificationClient = new NotificationMessagesClientBuilder()
    .endpoint(endpoint)
    .credential(azureKeyCredential)
    .buildClient();
```

```java
String endpoint = "https://<resource-name>.communication.azure.com";
AzureKeyCredential azureKeyCredential = new AzureKeyCredential("<access-key>");
MessageTemplateClient messageTemplateClient = new MessageTemplateClientBuilder()
    .endpoint(endpoint)
    .credential(azureKeyCredential)
    .buildClient();
```

---

For simplicity, this quickstart uses connection strings, but in production environments, we recommend using [service principals](../../../../identity/service-principal.md).

#### Set recipient list
You need to supply a real phone number that has a WhatsApp account associated with it. This WhatsApp account receives the text and media messages sent in this quickstart.
For this quickstart, this phone number may be your personal phone number.   

The recipient phone number can't be the business phone number (Sender ID) associated with the WhatsApp channel registration. The Sender ID appears as the sender of the text and media messages sent to the recipient.

The phone number should include the country code. For more information on phone number formatting, see WhatsApp documentation for [Phone Number Formats](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#phone-number-formats).

> [!NOTE]
> Only one phone number is currently supported in the recipient list.

Create the recipient list like this:
```java
    List<String> recipients = new ArrayList<>();
    recipients.add("<Phone_Number e.g. '+14255550199');
```

#### Send Template Message

Template definition:
```json
{ 
    Name: sample_shipping_confirmation,
    Language: en_US
    [
        {
        "type": "BODY",
        "text": "Your package has been shipped. It will be delivered in {{1}} business days."
        },
        {
        "type": "FOOTER",
        "text": "This message is from an unverified business."
        }
    ]
}
```

```java
       //Update Template Name and language according your template associate to your channel.
        MessageTemplate template = new MessageTemplate("sample_shipping_confirmation", "en_US");

        //Update template parameter type and value
        List<MessageTemplateValue> messageTemplateValues = new ArrayList<>();
        messageTemplateValues.add(new MessageTemplateText("Days", "5"));
        template.setValues(messageTemplateValues);

        //Update template parameter binding
        List<WhatsAppMessageTemplateBindingsComponent> components = new ArrayList<>();
        components.add(new WhatsAppMessageTemplateBindingsComponent("Days"));
        MessageTemplateBindings bindings =new WhatsAppMessageTemplateBindings()
            .setBody(components);
        template.setBindings(bindings);

        SendMessageResult result = notificationClient.send(
            new TemplateNotificationContent(CHANNEL_ID, recipients, template));

        result.getReceipts().forEach(r -> System.out.println("Message sent to:"+r.getTo() + " and message id:"+ r.getMessageId()));
```

#### Send Text Message

> [!NOTE]
> Business can't start a conversation with a text message. It needs to be user initiated.

```java
        SendMessageResult result = notificationClient.send(
            new TextNotificationContent("<CHANNEL_ID>", recipients, "Hello from ACS messaging"));

        result.getReceipts().forEach(r -> System.out.println("Message sent to:"+r.getTo() + " and message id:"+ r.getMessageId()));

```

#### Send Media Message

> [!NOTE]
> Business can't start a conversation with a media message. It needs to be user initiated.

```java
        String mediaUrl = "https://wallpapercave.com/wp/wp2163723.jpg";
        SendMessageResult result = notificationClient.send(
            new MediaNotificationContent("<CHANNEL_ID>", recipients, mediaUrl));

        result.getReceipts().forEach(r -> System.out.println("Message sent to:"+r.getTo() + " and message id:"+ r.getMessageId()));

```

#### Get Template List for a channel
```java
        PagedIterable<MessageTemplateItem> response = messageTemplateClient.listTemplates("<CHANNEL_ID>");

        response.stream().forEach(t -> {
            WhatsAppMessageTemplateItem template = (WhatsAppMessageTemplateItem) t ;
            System.out.println("===============================");
            System.out.println("Template Name :: "+template.getName());
            System.out.println("Template Language :: "+template.getLanguage());
            System.out.println("Template Status :: "+template.getStatus());
            System.out.println("Template Content :: "+template.getContent());
            System.out.println("===============================");
        });
```


### Run the code

1. Navigate to the directory that contains the **pom.xml** file and compile the project by using the `mvn` command.

   ```console
   mvn compile
   ```

1. Build the package.

   ```console
   mvn package
   ```

1. Run the following `mvn` command to execute the app.

   ```console
   mvn exec:java -D"exec.mainClass"="com.communication.quickstart.App" -D"exec.cleanupDaemonThreads"="false"
   ```




