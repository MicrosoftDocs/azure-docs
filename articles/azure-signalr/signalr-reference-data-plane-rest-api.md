---
title: Azure SignalR Service data-plane REST API reference
description: Learn about the REST APIs that Azure SignalR Service supports to manage connections and send messages to connections.
author: vicancy
ms.author: lianwei
ms.service: signalr
ms.topic: reference
ms.date: 03/29/2023
---

# Azure SignalR Service data-plane REST API reference

In addition to the classic client/server pattern, Azure SignalR Service provides a set of REST APIs to help you integrate real-time functionality into your serverless architecture.

> [!NOTE]
> Azure SignalR Service supports using REST APIs only to manage clients connected through ASP.NET Core SignalR. Clients connected through ASP.NET SignalR use a different data protocol that's not currently supported.

<a name="serverless"></a>

## Typical serverless architecture with Azure Functions

The following diagram shows a typical serverless architecture that uses Azure SignalR Service with Azure Functions.

:::image type="content" source="./media/signalr-reference-data-plane-rest-api/serverless-arch.png" alt-text="Diagram of a typical serverless architecture for Azure SignalR Service.":::

- The `negotiate` function returns a negotiation response and redirects all clients to Azure SignalR Service.
- The `broadcast` function calls the REST API for Azure SignalR Service. Azure SignalR Service broadcasts the message to all connected clients.

In a serverless architecture, clients have persistent connections to Azure SignalR Service. Because there's no application server to handle traffic, clients are in `LISTEN` mode. In that mode, clients can receive messages but can't send messages. Azure SignalR Service disconnects any client that sends messages because it's an invalid operation.

You can find a complete sample of using Azure SignalR Service with Azure Functions in [this GitHub repository](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/RealtimeSignIn).

### Implement the negotiation endpoint

You should implement a `negotiate` function that returns a redirect negotiation response so that clients can connect to the service.

A typical negotiation response has this format:

```json
{
  "url": "https://<service_name>.service.signalr.net/client/?hub=<hub_name>",
  "accessToken": "<a typical JWT token>"
}
```

The `accessToken` value is generated through the same algorithm described in the [authentication section](#authentication-via-accesskey-in-azure-signalr-service). The only difference is that the `aud` claim should be the same as `url`.

You should host your negotiation API in `https://<hub_url>/negotiate` so that you can still use a SignalR client to connect to the hub URL. Read more about redirecting clients to Azure SignalR Service in [Client connections](./signalr-concept-internals.md#client-connections).

## REST API versions

The following table shows all supported REST API versions. It also provides the Swagger file for each API version.

| API version   | Status   | Port     | Documentation                                                    | Specification                                                                                    |
| ------------- | -------- | -------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `20220601`    | Latest   | Standard | [Article](./swagger/signalr-data-plane-rest-v20220601.md)  | [Swagger file](https://github.com/Azure/azure-signalr/blob/dev/docs/swagger/V20220601.json)  |
| `1.0`         | Stable   | Standard | [Article](./swagger/signalr-data-plane-rest-v1.md)         | [Swagger file](https://github.com/Azure/azure-signalr/blob/dev/docs/swagger/v1.json)         |
| `1.0-preview` | Obsolete | Standard | [Article](./swagger/signalr-data-plane-rest-v1-preview.md) | [Swagger file](https://github.com/Azure/azure-signalr/blob/dev/docs/swagger/v1-preview.json) |

The following table lists the available APIs.

| API                                                                                                                                                                                       | Path                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [Broadcast a message to all clients connected to target hub](./swagger/signalr-data-plane-rest-v1.md#broadcast-a-message-to-all-clients-connected-to-target-hub)                         | `POST /api/v1/hubs/{hub}`                                             |
| [Broadcast a message to all clients belong to the target user](./swagger/signalr-data-plane-rest-v1.md#broadcast-a-message-to-all-clients-belong-to-the-target-user)                     | `POST /api/v1/hubs/{hub}/users/{id}`                                  |
| [Send message to the specific connection](./swagger/signalr-data-plane-rest-v1.md#send-message-to-the-specific-connection)                                                               | `POST /api/v1/hubs/{hub}/connections/{connectionId}`                  |
| [Check if the connection with the given connectionId exists](./swagger/signalr-data-plane-rest-v1.md#check-if-the-connection-with-the-given-connectionid-exists)                         | `GET /api/v1/hubs/{hub}/connections/{connectionId}`                   |
| [Close the client connection](./swagger/signalr-data-plane-rest-v1.md#close-the-client-connection)                                                                                       | `DELETE /api/v1/hubs/{hub}/connections/{connectionId}`                |
| [Broadcast a message to all clients within the target group](./swagger/signalr-data-plane-rest-v1.md#broadcast-a-message-to-all-clients-within-the-target-group)                         | `POST /api/v1/hubs/{hub}/groups/{group}`                              |
| [Check if there are any client connections inside the given group](./swagger/signalr-data-plane-rest-v1.md#check-if-there-are-any-client-connections-inside-the-given-group)             | `GET /api/v1/hubs/{hub}/groups/{group}`                               |
| [Check if there are any client connections connected for the given user](./swagger/signalr-data-plane-rest-v1.md#check-if-there-are-any-client-connections-connected-for-the-given-user) | `GET /api/v1/hubs/{hub}/users/{user}`                                 |
| [Add a connection to the target group](./swagger/signalr-data-plane-rest-v1.md#add-a-connection-to-the-target-group)                                                                     | `PUT /api/v1/hubs/{hub}/groups/{group}/connections/{connectionId}`    |
| [Remove a connection from the target group](./swagger/signalr-data-plane-rest-v1.md#remove-a-connection-from-the-target-group)                                                           | `DELETE /api/v1/hubs/{hub}/groups/{group}/connections/{connectionId}` |
| [Check whether a user exists in the target group](./swagger/signalr-data-plane-rest-v1.md#check-whether-a-user-exists-in-the-target-group)                                               | `GET /api/v1/hubs/{hub}/groups/{group}/users/{user}`                  |
| [Add a user to the target group](./swagger/signalr-data-plane-rest-v1.md#add-a-user-to-the-target-group)                                                                                 | `PUT /api/v1/hubs/{hub}/groups/{group}/users/{user}`                  |
| [Remove a user from the target group](./swagger/signalr-data-plane-rest-v1.md#remove-a-user-from-the-target-group)                                                                       | `DELETE /api/v1/hubs/{hub}/groups/{group}/users/{user}`               |
| [Remove a user from all groups](./swagger/signalr-data-plane-rest-v1.md#remove-a-user-from-all-groups)                                                                                   | `DELETE /api/v1/hubs/{hub}/users/{user}/groups`                       |

## Using the REST API

### Authentication via AccessKey in Azure SignalR Service

In each HTTP request, an authorization header with a [JSON Web Token (JWT)](https://en.wikipedia.org/wiki/JSON_Web_Token) is required to authenticate with Azure SignalR Service.

#### Signing algorithm and signature

`HS256`, namely HMAC-SHA256, is used as the signing algorithm.

Use the `AccessKey` value in the Azure SignalR Service instance's connection string to sign the generated JWT.

#### Claims

The following claims must be included in the JWT.

| Claim type | Is required | Description                                                                                                                                                                                                             |
| ---------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `aud`      | `true`        | Needs to be the same as your HTTP request URL, not including the trailing slash and query parameters. For example, a broadcast request's audience should look like: `https://example.service.signalr.net/api/v1/hubs/myhub`. |
| `exp`      | `true`        | Epoch time when this token expires.                                                                                                                                                                                     |

### Authentication via Microsoft Entra token

Similar to authenticating via `AccessKey`, a [JWT](https://en.wikipedia.org/wiki/JSON_Web_Token) is required to authenticate an HTTP request by using a Microsoft Entra token.

The difference is that in this scenario, Microsoft Entra ID generates the JWT. For more information, see [Learn how to generate Microsoft Entra tokens](../active-directory/develop/reference-v2-libraries.md).

You can also use *role-based access control (RBAC)* to authorize the request from your client or server to Azure SignalR Service. For more information, see [Authorize access with Microsoft Entra ID for Azure SignalR Service](./signalr-concept-authorize-azure-active-directory.md).

### User-related REST API

To call the user-related REST API, each of your clients should identify themselves to Azure SignalR Service. Otherwise, Azure SignalR Service can't find target connections from the user ID.

You can achieve client identification by including a `nameid` claim in each client's JWT when it's connecting to Azure SignalR Service. Azure SignalR Service then uses the value of the `nameid` claim as the user ID for each client connection.

### Sample

In [this GitHub repository](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/Serverless), you can find a complete console app to demonstrate how to manually build a REST API HTTP request in Azure SignalR Service.

You can also use [Microsoft.Azure.SignalR.Management](https://www.nuget.org/packages/Microsoft.Azure.SignalR.Management) to publish messages to Azure SignalR Service by using the similar interfaces of `IHubContext`. You can find samples in [this GitHub repository](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/Management). For more information, see [Azure SignalR Service Management SDK](https://github.com/Azure/azure-signalr/blob/dev/docs/management-sdk-guide.md).

## Limitations

Currently, REST API requests have the following limitations:

- Header size is a maximum of 16 KB.
- Body size is a maximum of 1 MB.

If you want to send messages larger than 1 MB, use the Service Management SDK with `persistent` mode.
