---
title: Azure SignalR service data plane REST API reference
description: Describes the REST APIs Azure SignalR service supports to manage the connections and send messages to them.
author: vicancy
ms.author: lianwei
ms.service: signalr
ms.topic: reference
ms.date: 06/09/2022
---

# Azure SignalR service data plane REST API reference

> [!NOTE]
>
> Azure SignalR Service only supports using REST API to manage clients connected using ASP.NET Core SignalR. Clients connected using ASP.NET SignalR use a different data protocol and is now not supported.

On top of classical client-server pattern, Azure SignalR Service provides a set of REST APIs, so that you can easily integrate real-time functionality into your server-less architecture.

<a name="architecture"></a>

## Typical Server-less Architecture with Azure Functions

The following diagram shows a typical server-less architecture of using Azure SignalR Service with Azure Functions.

    :::image type="content" source="../media/signalr-reference-data-plane-rest-api/serverless-arch.png" alt-text="A typical serverless architecture for Azure SignalR service":::

- `negotiate` function will return negotiation response and redirect all clients to Azure SignalR Service.
- `broadcast` function will call Azure SignalR Service's REST API. Then SignalR Service will broadcast the message to all connected clients.

In server-less architecture, clients still have persistent connections to Azure SignalR Service.
Since there are no application server to handle traffic, clients are in `LISTEN` mode, which means they can only receive messages but can't send messages.
SignalR Service will disconnect any client who sends messages because it is an invalid operation.

You can find a complete sample of using Azure SignalR Service with Azure Functions at [here](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/RealtimeSignIn).

## API

The following table shows all versions of REST API we have for now. You can also find the swagger file for each version of REST API.

API Version | Status | Port | Doc | Spec 
---|---|---|---|---
`1.0-preview` | Obsolete | Standard | [Doc](./swagger/v1-preview.md) | [swagger](https://github.com/Azure/azure-signalr/blob/dev/docs/swagger/v1-preview.json)
`1.0` | Available | Standard | [Doc](./swagger/v1.md) | [swagger](https://github.com/Azure/azure-signalr/blob/dev/docs/swagger/v1.json)

The latest available APIs are listed as following.


| API | Path |
| ---- | ---------- | 
| [Broadcast a message to all clients connected to target hub.](./swagger/v1.md#post-broadcast-a-message-to-all-clients-connected-to-target-hub.) | `POST /api/v1/hubs/{hub}` |
| [Broadcast a message to all clients belong to the target user.](./swagger/v1.md#post-broadcast-a-message-to-all-clients-belong-to-the-target-user.) | `POST /api/v1/hubs/{hub}/users/{id}` |
| [Send message to the specific connection.](./swagger/v1.md#post-send-message-to-the-specific-connection.) | `POST /api/v1/hubs/{hub}/connections/{connectionId}` |
| [Check if the connection with the given connectionId exists](./swagger/v1.md#get-check-if-the-connection-with-the-given-connectionid-exists) | `GET /api/v1/hubs/{hub}/connections/{connectionId}` |
| [Close the client connection](./swagger/v1.md#delete-close-the-client-connection) | `DELETE /api/v1/hubs/{hub}/connections/{connectionId}` |
| [Broadcast a message to all clients within the target group.](./swagger/v1.md#post-broadcast-a-message-to-all-clients-within-the-target-group.) | `POST /api/v1/hubs/{hub}/groups/{group}` |
| [Check if there are any client connections inside the given group](./swagger/v1.md#get-check-if-there-are-any-client-connections-inside-the-given-group) | `GET /api/v1/hubs/{hub}/groups/{group}` |
| [Check if there are any client connections connected for the given user](./swagger/v1.md#get-check-if-there-are-any-client-connections-connected-for-the-given-user) | `GET /api/v1/hubs/{hub}/users/{user}` |
| [Add a connection to the target group.](./swagger/v1.md#put-add-a-connection-to-the-target-group.) | `PUT /api/v1/hubs/{hub}/groups/{group}/connections/{connectionId}` |
| [Remove a connection from the target group.](./swagger/v1.md#delete-remove-a-connection-from-the-target-group.) | `DELETE /api/v1/hubs/{hub}/groups/{group}/connections/{connectionId}` |
| [Check whether a user exists in the target group.](./swagger/v1.md#get-check-whether-a-user-exists-in-the-target-group.) | `GET /api/v1/hubs/{hub}/groups/{group}/users/{user}` |
| [Add a user to the target group.](./swagger/v1.md#put-add-a-user-to-the-target-group.) | `PUT /api/v1/hubs/{hub}/groups/{group}/users/{user}` |
| [Remove a user from the target group.](./swagger/v1.md#delete-remove-a-user-from-the-target-group.) | `DELETE /api/v1/hubs/{hub}/groups/{group}/users/{user}` |
| [Remove a user from all groups.](./swagger/v1.md#delete-remove-a-user-from-all-groups.) | `DELETE /api/v1/hubs/{hub}/users/{user}/groups` |

## Using REST API

### Authenticate via Azure SignalR Service AccessKey

In each HTTP request, an authorization header with a [JSON Web Token (JWT)](https://en.wikipedia.org/wiki/JSON_Web_Token) is required to authenticate with Azure SignalR Service.

<a name="signing"></a>
#### Signing Algorithm and Signature

`HS256`, namely HMAC-SHA256, is used as the signing algorithm.

You should use the `AccessKey` in Azure SignalR Service instance's connection string to sign the generated JWT token.

#### Claims

Below claims are required to be included in the JWT token.

Claim Type | Is Required | Description
---|---|---
`aud` | true | Should be the **SAME** as your HTTP request url, trailing slash and query parameters not included. For example, a broadcast request's audience should look like: `https://example.service.signalr.net/api/v1/hubs/myhub`.
`exp` | true | Epoch time when this token will be expired.

### Authenticate via Azure Active Directory Token (AAD Token)

Like using `AccessKey`, a [JSON Web Token (JWT)](https://en.wikipedia.org/wiki/JSON_Web_Token) is also required to authenticate the HTTP request. 

**The difference is**, in this scenario, JWT Token is generated by Azure Active Directory. 

[Learn how to generate AAD Tokens](/azure/active-directory/develop/reference-v2-libraries)

You could also leverage from **Role Based Access Control (RBAC)** to authorize the request from your client/server to Azure SignalR Service.

[Learn how to configure RBAC roles for your resource](/azure/azure-signalr/authorize-access-azure-active-directory)

### Implement Negotiate Endpoint

As shown in the [architecture section](#serverless), you should implement a `negotiate` function that returns a redirect negotiation response so that client can connect to the service.
A typical negotiation response looks like as following:

```json
{
    "url":"https://<service_name>.service.signalr.net/client/?hub=<hub_name>",
    "accessToken":"<a typical JWT token>"
}
```

The `accessToken` is generated using the same algorithm described in [authentication section](#authentication). The only difference is the `aud` claim should be same as `url`.

You should host your negotiate API in `https://<hub_url>/negotiate` so you can still use SignalR client to connect to the hub url.

Read more about redirecting client to Azure SignalR Service at [here](./signalr-concept-internals.md#client-connections).

<a name="user-api"></a>

### User-related REST API

In order to call user-related REST API, each of your clients should identify itself to Azure SignalR Service.
Otherwise SignalR Service can't find target connections from a given user id.

This can be achieved by including a `nameid` claim in each client's JWT token when they are connecting to Azure SignalR Service.
Then SignalR Service will use the value of `nameid` claim as the user id of each client connection.

### Sample

You can find a complete console app to demonstrate how to manually build REST API HTTP request in Azure SignalR Service [here](https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/Serverless).

You can also use [Microsoft.Azure.SignalR.Management](<https://www.nuget.org/packages/Microsoft.Azure.SignalR.Management>) to publish messages to Azure SignalR Service using the similar interfaces of `IHubContext`. Samples can be found [here](<https://github.com/aspnet/AzureSignalR-samples/tree/master/samples/Management>). For more information, see [How to use Management SDK](https://github.com/Azure/azure-signalr/blob/dev/docs/management-sdk-guide.md).


## Limitation

Currently, we have following limitation for REST API request:

* Header size, we only support up to 16KB.
* Body size, we only support up to 1MB.

If you want to send message larger than 1MB, please use the Management SDK with `persistent` mode.