---
title: Azure SignalR service data plane REST API reference
description: Describes the REST APIs Azure SignalR service supports to manage the connections and send messages to them.
author: vicancy
ms.author: lianwei
ms.service: signalr
ms.topic: reference
ms.date: 03/29/2023
---

# Azure SignalR service data plane REST API reference

In addition to the classic client-server pattern, Azure SignalR Service provides a set of REST APIs so that you can easily integrate real-time functionality into your serverless architecture.

> [!NOTE]
> Azure SignalR Service only supports using REST API to manage clients connected using ASP.NET Core SignalR. Clients connected using ASP.NET SignalR use a different data protocol that is not currently supported.

<a name="serverless"></a>

## Typical serverless Architecture with Azure Functions

The following diagram shows a typical serverless architecture using Azure SignalR Service with Azure Functions.

:::image type="content" source="./media/signalr-reference-data-plane-rest-api/serverless-arch.png" alt-text="Diagram of a typical serverless architecture for Azure SignalR service":::

- The `negotiate` function returns a negotiation response and redirects all clients to SignalR Service.
- The `broadcast` function calls SignalR Service's REST API. The SignalR Service broadcasts the message to all connected clients.

In a serverless architecture, clients still have persistent connections to the SignalR Service.
Since there's no application server to handle traffic, clients are in `LISTEN` mode, which means they can only receive messages but can't send messages.
SignalR Service disconnects any client that sends messages because it's an invalid operation.

You can find a complete sample of using SignalR Service with Azure Functions at [here](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/RealtimeSignIn).

## API

The following table shows all supported versions of REST API. You can also find the swagger file for each version of REST API.

| API Version   | Status   | Port     | Doc                                                    | Spec                                                                                    |
| ------------- | -------- | -------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `20220601`    | Latest   | Standard | [Doc](./swagger/signalr-data-plane-rest-v20220601.md)  | [swagger](https://github.com/Azure/azure-signalr/blob/dev/docs/swagger/V20220601.json)  |
| `1.0`         | Stable   | Standard | [Doc](./swagger/signalr-data-plane-rest-v1.md)         | [swagger](https://github.com/Azure/azure-signalr/blob/dev/docs/swagger/v1.json)         |
| `1.0-preview` | Obsolete | Standard | [Doc](./swagger/signalr-data-plane-rest-v1-preview.md) | [swagger](https://github.com/Azure/azure-signalr/blob/dev/docs/swagger/v1-preview.json) |

The available APIs are listed as following.

| API                                                                                                                                                                                       | Path                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [Broadcast a message to all clients connected to target hub.](./swagger/signalr-data-plane-rest-v1.md#broadcast-a-message-to-all-clients-connected-to-target-hub)                         | `POST /api/v1/hubs/{hub}`                                             |
| [Broadcast a message to all clients belong to the target user.](./swagger/signalr-data-plane-rest-v1.md#broadcast-a-message-to-all-clients-belong-to-the-target-user)                     | `POST /api/v1/hubs/{hub}/users/{id}`                                  |
| [Send message to the specific connection.](./swagger/signalr-data-plane-rest-v1.md#send-message-to-the-specific-connection)                                                               | `POST /api/v1/hubs/{hub}/connections/{connectionId}`                  |
| [Check if the connection with the given connectionId exists.](./swagger/signalr-data-plane-rest-v1.md#check-if-the-connection-with-the-given-connectionid-exists)                         | `GET /api/v1/hubs/{hub}/connections/{connectionId}`                   |
| [Close the client connection.](./swagger/signalr-data-plane-rest-v1.md#close-the-client-connection)                                                                                       | `DELETE /api/v1/hubs/{hub}/connections/{connectionId}`                |
| [Broadcast a message to all clients within the target group.](./swagger/signalr-data-plane-rest-v1.md#broadcast-a-message-to-all-clients-within-the-target-group)                         | `POST /api/v1/hubs/{hub}/groups/{group}`                              |
| [Check if there are any client connections inside the given group.](./swagger/signalr-data-plane-rest-v1.md#check-if-there-are-any-client-connections-inside-the-given-group)             | `GET /api/v1/hubs/{hub}/groups/{group}`                               |
| [Check if there are any client connections connected for the given user.](./swagger/signalr-data-plane-rest-v1.md#check-if-there-are-any-client-connections-connected-for-the-given-user) | `GET /api/v1/hubs/{hub}/users/{user}`                                 |
| [Add a connection to the target group.](./swagger/signalr-data-plane-rest-v1.md#add-a-connection-to-the-target-group)                                                                     | `PUT /api/v1/hubs/{hub}/groups/{group}/connections/{connectionId}`    |
| [Remove a connection from the target group.](./swagger/signalr-data-plane-rest-v1.md#remove-a-connection-from-the-target-group)                                                           | `DELETE /api/v1/hubs/{hub}/groups/{group}/connections/{connectionId}` |
| [Check whether a user exists in the target group.](./swagger/signalr-data-plane-rest-v1.md#check-whether-a-user-exists-in-the-target-group)                                               | `GET /api/v1/hubs/{hub}/groups/{group}/users/{user}`                  |
| [Add a user to the target group.](./swagger/signalr-data-plane-rest-v1.md#add-a-user-to-the-target-group)                                                                                 | `PUT /api/v1/hubs/{hub}/groups/{group}/users/{user}`                  |
| [Remove a user from the target group.](./swagger/signalr-data-plane-rest-v1.md#remove-a-user-from-the-target-group)                                                                       | `DELETE /api/v1/hubs/{hub}/groups/{group}/users/{user}`               |
| [Remove a user from all groups.](./swagger/signalr-data-plane-rest-v1.md#remove-a-user-from-all-groups)                                                                                   | `DELETE /api/v1/hubs/{hub}/users/{user}/groups`                       |

## Using REST API

### Authenticate via Azure SignalR Service AccessKey

In each HTTP request, an authorization header with a [JSON Web Token (JWT)](https://en.wikipedia.org/wiki/JSON_Web_Token) is required to authenticate with SignalR Service.

#### Signing Algorithm and Signature

`HS256`, namely HMAC-SHA256, is used as the signing algorithm.

Use the `AccessKey` in Azure SignalR Service instance's connection string to sign the generated JWT token.

#### Claims

The following claims are required to be included in the JWT token.

| Claim Type | Is Required | Description                                                                                                                                                                                                             |
| ---------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `aud`      | true        | Needs to be the same as your HTTP request URL, trailing slash and query parameters not included. For example, a broadcast request's audience should look like: `https://example.service.signalr.net/api/v1/hubs/myhub`. |
| `exp`      | true        | Epoch time when this token expires.                                                                                                                                                                                     |

### Authenticate via Microsoft Entra token

Similar to authenticating using `AccessKey`, when authenticating using Microsoft Entra token, a [JSON Web Token (JWT)](https://en.wikipedia.org/wiki/JSON_Web_Token) is also required to authenticate the HTTP request. 

The difference is, in this scenario, the JWT Token is generated by Microsoft Entra ID. For more information, see [Learn how to generate Microsoft Entra tokens](../active-directory/develop/reference-v2-libraries.md)

You could also use **Role Based Access Control (RBAC)** to authorize the request from your client/server to SignalR Service. For more information, see [Authorize access with Microsoft Entra ID for Azure SignalR Service](./signalr-concept-authorize-azure-active-directory.md)

### Implement Negotiate Endpoint

As shown in the [architecture section](#serverless), you should implement a `negotiate` function that returns a redirect negotiation response so that clients can connect to the service.
A typical negotiation response looks as follows:

```json
{
  "url": "https://<service_name>.service.signalr.net/client/?hub=<hub_name>",
  "accessToken": "<a typical JWT token>"
}
```

The `accessToken` is generated using the same algorithm described in the [authentication section](#authenticate-via-azure-signalr-service-accesskey). The only difference is the `aud` claim should be the same as `url`.

You should host your negotiate API in `https://<hub_url>/negotiate` so you can still use SignalR client to connect to the hub url. Read more about redirecting client to Azure SignalR Service at [here](./signalr-concept-internals.md#client-connections).

### User-related REST API

In order to the call user-related REST API, each of your clients should identify themselves to SignalR Service. Otherwise SignalR Service can't find target connections from a given user ID.

Client identification can be achieved by including a `nameid` claim in each client's JWT token when they're connecting to SignalR Service.
Then SignalR Service uses the value of `nameid` claim as the user ID of each client connection.

### Sample

You can find a complete console app to demonstrate how to manually build a REST API HTTP request in SignalR Service [here](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/Serverless).

You can also use [Microsoft.Azure.SignalR.Management](https://www.nuget.org/packages/Microsoft.Azure.SignalR.Management) to publish messages to SignalR Service using the similar interfaces of `IHubContext`. Samples can be found [here](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/Management). For more information, see [How to use Management SDK](https://github.com/Azure/azure-signalr/blob/dev/docs/management-sdk-guide.md).

## Limitation

Currently, we have the following limitation for REST API requests:

- Header size is a maximum of 16 KB.
- Body size is a maximum of 1 MB.

If you want to send messages larger than 1 MB, use the Management SDK with `persistent` mode.
