---
title: Include file
description: Include file
services: azure-communication-services
author: arifibrahim4
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 12/29/2024
ms.topic: include
ms.custom: include file
ms.author: armohamed
---

## Prerequisites

- [WhatsApp Business Account registered with your Azure Communication Services resource](../../connect-whatsapp-business-account.md)
- [Event subscription and handling of Advanced Message Received events](./../../handle-advanced-messaging-events.md#subscribe-to-advanced-messaging-events)
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

| Name                                                                                                             | Description                                                                                                 |
|------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| [NotificationMessagesClient](/java/api/azure.communication.messages.notificationmessagesclient)                | This class connects to your Azure Communication Services resource. It sends the messages.                   |
| [DownloadMediaAsync](/java/api/azure.communication.messages.notificationmessagesclient.downloadmediaasync)     | Download the media payload from a User to Business message asynchronously, writing the content to a stream. |
| [Microsoft.Communication.AdvancedMessageReceived](/azure/event-grid/communication-services-advanced-messaging-events#microsoftcommunicationadvancedmessagereceived-event) | Event Grid event that is published when Advanced Messaging receives a message. |

> [!NOTE]
> Please find the SDK reference [here](/java/api/com.azure.communication.messages)

## Code examples

Follow these steps to add the necessary code snippets to the main function of your *App.java* file.

- [Authenticate the client](#authenticate-the-client)
- [Download the media payload to a stream](#download-the-media-payload-to-a-stream)

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

### Download the media payload to a stream

The Messages SDK allows Contoso to download the media in received WhatsApp media messages from WhatsApp users. To download the media payload to a stream, you need:
- [Authenticated NotificationMessagesClient](#authenticate-the-client)
- The media ID GUID of the media (Received from an incoming message in an [AdvancedMessageReceived event](/azure/event-grid/communication-services-advanced-messaging-events#microsoftcommunicationadvancedmessagereceived-event))

```java
    public static void main(String[] args) throws IOException {

        NotificationMessagesClient messagesClient = new NotificationMessagesClientBuilder()
            .connectionString(connectionString)
            .buildClient();

        BinaryData data = messagesClient.downloadMedia("<MEDIA_ID>");
        BufferedImage image = ImageIO.read(data.toStream());
        ImageIcon icon = new ImageIcon(image);
        JLabel label  = new JLabel(icon);
        JFrame frame = new JFrame();
        frame.add(label);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.pack();
        frame.setVisible(true);
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

Find the finalized code for this quickstart on [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/d668cb44f64d303e71d2ee72a8b0382896aa09d5/sdk/communication/azure-communication-messages/src/samples/java/com/azure/communication/messages/DownloadMediaSample.java).
