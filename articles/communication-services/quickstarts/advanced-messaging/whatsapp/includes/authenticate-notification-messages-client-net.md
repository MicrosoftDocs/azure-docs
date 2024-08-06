---
title: Include file
description: Include file
services: azure-communication-services
author: memontic
ms.service: azure-communication-services
ms.date: 07/15/2024
ms.topic: include
ms.custom: include file
ms.author: memontic
---   

#### [Connection String](#tab/connection-string)

For simplicity, this quickstart uses a connection string to authenticate. In production environments, we recommend using [service principals](../../../identity/service-principal.md).

Get the connection string from your Azure Communication Services resource in the Azure portal. On the left, navigate to the `Keys` tab. Copy the `Connection string` field for the primary key. The connection string is in the format `endpoint=https://{your Azure Communication Services resource name}.communication.azure.com/;accesskey={secret key}`.

:::image type="content" source="../media/get-started/get-communication-resource-connection-string.png" lightbox="../media/get-started/get-communication-resource-connection-string.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Connection string' field in the 'Primary key' section.":::

Set the environment variable `COMMUNICATION_SERVICES_CONNECTION_STRING` to the value of your connection string.   
Open a console window and enter the following command:
```console
setx COMMUNICATION_SERVICES_CONNECTION_STRING "<your connection string>"
```
After you add the environment variable, you might need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

For more information on how to set an environment variable for your system, follow the steps at [Store your connection string in an environment variable](../../../create-communication-resource.md#store-your-connection-string-in-an-environment-variable).

To instantiate a `NotificationMessagesClient`, add the following code to the `Main` method:
```csharp
// Retrieve connection string from environment variable
string connectionString = 
    Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");

// Instantiate the client
var notificationMessagesClient = new NotificationMessagesClient(connectionString);
```

#### [Microsoft Entra ID](#tab/aad)

You can also authenticate with Microsoft Entra ID using the [Azure Identity library](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/identity/Azure.Identity). 

The [`Azure.Identity`](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/identity/Azure.Identity) package provides various credential types that your application can use to authenticate. You can choose from the various options to authenticate the identity client detailed at [Azure Identity - Credential providers](/dotnet/api/overview/azure/identity-readme#credentials) and [Azure Identity - Authenticate the client](/dotnet/api/overview/azure/identity-readme#authenticate-the-client). This option walks through one way of using the [`DefaultAzureCredential`](/dotnet/api/overview/azure/identity-readme#defaultazurecredential).
 
The `DefaultAzureCredential` attempts to authenticate via [`several mechanisms`](/dotnet/api/overview/azure/identity-readme#defaultazurecredential) and might obtain its authentication credentials if you're signed into Visual Studio or Azure CLI. However, this option walks you through setting up with environment variables.   

To create a `DefaultAzureCredential` object:
1. To set up your service principle app, follow the instructions at [Creating a Microsoft Entra registered Application](../../../identity/service-principal.md?pivots=platform-azcli#creating-a-microsoft-entra-registered-application).

1. Set the environment variables `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID` using the output of your app's creation.    
    Open a console window and enter the following commands:
    ```console
    setx AZURE_CLIENT_ID "<your app's appId>"
    setx AZURE_CLIENT_SECRET "<your app's password>"
    setx AZURE_TENANT_ID "<your app's tenant>"
    ```
    After you add the environment variables, you might need to restart any running programs that will need to read the environment variables, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

1. To use the [`DefaultAzureCredential`](/dotnet/api/overview/azure/identity-readme#defaultazurecredential) provider, or other credential providers provided with the Azure SDK, install the `Azure.Identity` NuGet package and add the following `using` directive to your *Program.cs* file.
    ```csharp
    using Azure.Identity;
    ```

1. To instantiate a `NotificationMessagesClient`, add the following code to the `Main` method.
    ```csharp
    // Configure authentication
    var endpoint = new Uri("https://<resource name>.communication.azure.com");
    var credential = new DefaultAzureCredential();

    // Instantiate the client
    var notificationMessagesClient = 
        new NotificationMessagesClient(endpoint, credential);
    ```

#### [AzureKeyCredential](#tab/azurekeycredential)

You can also authenticate with an AzureKeyCredential.

Get the endpoint and key from your Azure Communication Services resource in the Azure portal. On the left, navigate to the `Keys` tab. Copy the `Endpoint` and the `Key` field for the primary key.

:::image type="content" source="../media/get-started/get-communication-resource-endpoint-and-key.png" lightbox="../media/get-started/get-communication-resource-endpoint-and-key.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Connection string' field in the 'Primary key' section.":::

Set the environment variable `COMMUNICATION_SERVICES_KEY` to the value of your connection string.   
Open a console window and enter the following command:
```console
setx COMMUNICATION_SERVICES_KEY "<your key>"
```
After you add the environment variable, you might need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

For more information on how to set an environment variable for your system, follow the steps at [Store your connection string in an environment variable](../../../create-communication-resource.md#store-your-connection-string-in-an-environment-variable).

To instantiate a `NotificationMessagesClient`, add the following code to the `Main` method:
```csharp
// Retrieve key from environment variable
string key = 
    Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_KEY");

// Configure authentication
var endpoint = new Uri("https://<resource name>.communication.azure.com");
var credential = new AzureKeyCredential(key);

// Instantiate the client
var notificationMessagesClient = 
    new NotificationMessagesClient(endpoint, credential);
```

---