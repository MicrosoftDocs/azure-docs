---
title: Develop and configure Azure Functions SignalR Service applications
description: Details on how to develop and configure serverless real-time applications using Azure Functions and Azure SignalR Service
author: anthonychu
ms.service: signalr
ms.topic: conceptual
ms.date: 03/01/2019
ms.author: antchu
---

# Azure Functions development and configuration with Azure SignalR Service

Azure Functions applications can leverage the [Azure SignalR Service bindings](../azure-functions/functions-bindings-signalr-service.md) to add real-time capabilities. Client applications use client SDKs available in several languages to connect to Azure SignalR Service and receive real-time messages.

This article describes the concepts for developing and configuring an Azure Function app that is integrated with SignalR Service.

## SignalR Service configuration

Azure SignalR Service can be configured in different modes. When used with Azure Functions, the service must be configured in *Serverless* mode.

In the Azure portal, locate the *Settings* page of your SignalR Service resource. Set the *Service mode* to *Serverless*.

![SignalR Service Mode](media/signalr-concept-azure-functions/signalr-service-mode.png)

## Azure Functions development

A serverless real-time application built with Azure Functions and Azure SignalR Service typically requires two Azure Functions:

* A "negotiate" function that the client calls to obtain a valid SignalR Service access token and service endpoint URL
* One or more functions that send messages or manage group membership

### negotiate function

A client application requires a valid access token to connect to Azure SignalR Service. An access token can be anonymous or authenticated to a given user ID. Serverless SignalR Service applications require an HTTP endpoint named "negotiate" to obtain a token and other connection information, such as the SignalR Service endpoint URL.

Use an HTTP triggered Azure Function and the *SignalRConnectionInfo* input binding to generate the connection information object. The function must have an HTTP route that ends in `/negotiate`.

For more information on how to create the negotiate function, see the [*SignalRConnectionInfo* input binding reference](../azure-functions/functions-bindings-signalr-service.md#signalr-connection-info-input-binding).

To learn about how to create an authenticated token, refer to [Using App Service Authentication](#using-app-service-authentication).

### Sending messages and managing group membership

Use the *SignalR* output binding to send messages to clients connected to Azure SignalR Service. You can broadcast messages to all clients, or you can send them to a subset of clients that are authenticated with a specific user ID or have been added to a specific group.

Users can be added to one or more groups. You can also use the *SignalR* output binding to add or remove users to/from groups.

For more information, see the [*SignalR* output binding reference](../azure-functions/functions-bindings-signalr-service.md#signalr-output-binding).

### SignalR Hubs

SignalR has a concept of "hubs". Each client connection and each message sent from Azure Functions is scoped to a specific hub. You can use hubs as a way to separate your connections and messages into logical namespaces.

## Client development

SignalR client applications can leverage the SignalR client SDK in one of several languages to easily connect to and receive messages from Azure SignalR Service.

### Configuring a client connection

To connect to SignalR Service, a client must complete a successful connection negotiation that consists of these steps:

1. Make a request to the *negotiate* HTTP endpoint discussed above to obtain valid connection information
1. Connect to SignalR Service using the service endpoint URL and access token obtained from the *negotiate* endpoint

SignalR client SDKs already contain the logic required to perform the negotiation handshake. Pass the negotiate endpoint's URL, minus the `negotiate` segment, to the SDK's `HubConnectionBuilder`. Here is an example in JavaScript:

```javascript
const connection = new signalR.HubConnectionBuilder()
  .withUrl('https://my-signalr-function-app.azurewebsites.net/api')
  .build()
```

By convention, the SDK automatically appends `/negotiate` to the URL and uses it to begin the negotiation.

> [!NOTE]
> If you are using the JavaScript/TypeScript SDK in a browser, you need to [enable cross-origin resource sharing (CORS)](#enabling-cors) on your Function App.

For more information on how to use the SignalR client SDK, refer to the documentation for your language:

* [.NET Standard](https://docs.microsoft.com/aspnet/core/signalr/dotnet-client)
* [JavaScript](https://docs.microsoft.com/aspnet/core/signalr/javascript-client)
* [Java](https://docs.microsoft.com/aspnet/core/signalr/java-client)

### Sending messages from a client to the service

Although the SignalR SDK allows client applications to invoke backend logic in a SignalR hub, this functionality is not yet supported when you use SignalR Service with Azure Functions. Use HTTP requests to invoke Azure Functions.

## Azure Functions configuration

Azure Function apps that integrate with Azure SignalR Service can be deployed like any typical Azure Function app, using techniques such as [continuously deployment](../azure-functions/functions-continuous-deployment.md), [zip deployment](../azure-functions/deployment-zip-push.md), and [run from package](../azure-functions/run-functions-from-deployment-package.md).

However, there are a couple of special considerations for apps that use the SignalR Service bindings. If the client runs in a browser, CORS must be enabled. And if the app requires authentication, you can integrate the negotiate endpoint with App Service Authentication.

### Enabling CORS

The JavaScript/TypeScript client makes HTTP requests to the negotiate function to initiate the connection negotiation. When the client application is hosted on a different domain than the Azure Function app, cross-origin resource sharing (CORS) must be enabled on the Function app or the browser will block the requests.

#### Localhost

When running the Function app on your local computer, you can add a `Host` section to *local.settings.json* to enable CORS. In the `Host` section, add two properties:

* `CORS` - enter the base URL that is the origin the client application
* `CORSCredentials` - set it to `true` to allow "withCredentials" requests

Example:

```json
{
  "IsEncrypted": false,
  "Values": {
    // values
  },
  "Host": {
    "CORS": "http://localhost:8080",
    "CORSCredentials": true
  }
}
```

#### Azure

To enable CORS on an Azure Function app, go to the CORS configuration screen under the *Platform features* tab of your Function app in the Azure portal.

CORS with Access-Control-Allow-Credentials must be enabled for the SignalR client to call the negotiate function. Select the checkbox to enable it.

In the *Allowed origins* section, add an entry with the origin base URL of your web application.

![Configuring CORS](media/signalr-concept-serverless-development-config/cors-settings.png)

### Using App Service Authentication

Azure Functions has built-in authentication, supporting popular providers such as Facebook, Twitter, Microsoft Account, Google, and Azure Active Directory. This feature can be integrated with the *SignalRConnectionInfo* binding to create connections to Azure SignalR Service that have been authenticated to a user ID. Your application can send messages using the *SignalR* output binding that are targeted to that user ID.

In the Azure portal, in your Function app's *Platform features* tab, open the *Authentication/authorization* settings window. Follow the documentation for [App Service Authentication](../app-service/overview-authentication-authorization.md) to configure authentication using an identity provider of your choice.

Once configured, authenticated HTTP requests will include `x-ms-client-principal-name` and `x-ms-client-principal-id` headers containing the authenticated identity's username and user ID, respectively.

You can use these headers in your *SignalRConnectionInfo* binding configuration to create authenticated connections. Here is an example C# negotiate function that uses the `x-ms-client-principal-id` header.

```csharp
[FunctionName("negotiate")]
public static SignalRConnectionInfo Negotiate(
    [HttpTrigger(AuthorizationLevel.Anonymous)]HttpRequest req,
    [SignalRConnectionInfo
        (HubName = "chat", UserId = "{headers.x-ms-client-principal-id}")]
        SignalRConnectionInfo connectionInfo)
{
    // connectionInfo contains an access key token with a name identifier claim set to the authenticated user
    return connectionInfo;
}
```

You can then send messages to that user by setting the `UserId` property of a SignalR message.

```csharp
[FunctionName("SendMessage")]
public static Task SendMessage(
    [HttpTrigger(AuthorizationLevel.Anonymous, "post")]object message,
    [SignalR(HubName = "chat")]IAsyncCollector<SignalRMessage> signalRMessages)
{
    return signalRMessages.AddAsync(
        new SignalRMessage
        {
            // the message will only be sent to these user IDs
            UserId = "userId1",
            Target = "newMessage",
            Arguments = new [] { message }
        });
}
```

For information on other languages, see the [Azure SignalR Service bindings](../azure-functions/functions-bindings-signalr-service.md) for Azure Functions reference.

## Next steps

In this article, you have learned how to develop and configure serverless SignalR Service applications using Azure Functions. Try creating an application yourself using one of the quick starts or tutorials on the [SignalR Service overview page](index.yml).