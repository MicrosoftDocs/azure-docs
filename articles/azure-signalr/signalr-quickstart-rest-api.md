---
title: Quickstart - Azure SignalR Service REST API
description: Learn how to use REST API with Azure SignalR Service following samples. Find details of REST API specification. 
author: sffamily
ms.service: signalr
ms.topic: quickstart
ms.date: 11/13/2019
ms.author: zhshang
---
# Quickstart: Broadcast real-time messages from console app

Azure SignalR Service provides [REST API](https://github.com/Azure/azure-signalr/blob/dev/docs/rest-api.md) to support server to client communication scenarios, such as broadcasting. You can choose any programming language that can make REST API call. You can post messages to all connected clients, a specific client by name, or a group of clients.

In this quickstart, you will learn how to send messages from a command-line app to connected client apps in C#.

## Prerequisites

This quickstart can be run on macOS, Windows, or Linux.

* [.NET Core SDK](https://www.microsoft.com/net/download/core)
* A text editor or code editor of your choice.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Sign in to Azure

Sign in to the Azure portal at <https://portal.azure.com/> with your Azure account.

[!INCLUDE [Create instance](includes/signalr-quickstart-create-instance.md)]

## Clone the sample application

While the service is deploying, let's switch to prepare the code. Clone the [sample app from GitHub](https://github.com/aspnet/AzureSignalR-samples.git), set the SignalR Service connection string, and run the application locally.

1. Open a git terminal window. Change to a folder where you want to clone the sample project.

1. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/aspnet/AzureSignalR-samples.git
    ```

## Build and run the sample

This sample is a console app showing the use of Azure SignalR Service. It provides two modes:

- Server Mode: use simple commands to call Azure SignalR Service REST API.
- Client Mode: connect to Azure SignalR Service and receive messages from server.

Also you can find how to generate an access token to authenticate with Azure SignalR Service.

### Build the executable file

We use macOS osx.10.13-x64 as example. You can find [reference](https://docs.microsoft.com/dotnet/core/rid-catalog) on how to build on other platforms.

```bash
cd AzureSignalR-samples/samples/Serverless/

dotnet publish -c Release -r osx.10.13-x64
```

### Start a client

```bash
cd bin/Release/netcoreapp2.1/osx.10.13-x64/

Serverless client <ClientName> -c "<ConnectionString>" -h <HubName>
```

### Start a server

```bash
cd bin/Release/netcoreapp2.1/osx.10.13-x64/

Serverless server -c "<ConnectionString>" -h <HubName>
```

## Run the sample without publishing

You can also run the command below to start a server or client

```bash
# Start a server
dotnet run -- server -c "<ConnectionString>" -h <HubName>

# Start a client
dotnet run -- client <ClientName> -c "<ConnectionString>" -h <HubName>
```

### Use user-secrets to specify Connection String

You can run `dotnet user-secrets set Azure:SignalR:ConnectionString "<ConnectionString>"` in the root directory of the sample. After that, you don't need the option `-c "<ConnectionString>"` anymore.

## Usage

After the server started, use the command to send message:

```
send user <User Id>
send users <User List>
send group <Group Name>
send groups <Group List>
broadcast
```

You can start multiple clients with different client names.

## <a name="usage"> </a> Integration with third-party services

The Azure SignalR service allows third-party services to integrate with the system.

### Definition of technical specifications

The following table shows all the versions of the REST APIs supported to date. You can also find the definition file for each specific version

Version | API State | Door | Specific
--- | --- | --- | ---
`1.0-preview` | Available | 5002 | [Swagger](https://github.com/Azure/azure-signalr/tree/dev/docs/swagger/v1-preview.json)
`1.0` | Available | Standard | [Swagger](https://github.com/Azure/azure-signalr/tree/dev/docs/swagger/v1.json)

The list of available APIs for each specific version is available in the following list.

API | `1.0-preview` | `1.0`
--- | --- | ---
[Broadcast to all](#broadcast) | **&#x2713;** | **&#x2713;**
[Broadcast to a group](#broadcast-group) | **&#x2713;** | **&#x2713;**
Broadcast to some groups | **&#x2713;** (Deprecated) | `N / A`
[Send to a user](#send-user) | **&#x2713;** | **&#x2713;**
Send to some users | **&#x2713;** (Deprecated) | `N / A`
[Adding a user to a group](#add-user-to-group) | `N / A` | **&#x2713;**
[Removing a user from a group](#remove-user-from-group) | `N / A` | **&#x2713;**
[Check user existence](#check-user-existence) | `N / A` | **&#x2713;**
[Remove a user from all groups](#remove-user-from-all-groups) | `N / A` | **&#x2713;**
[Send to a connection](#send-connection) | `N / A` | **&#x2713;**
[Add a connection to a group](#add-connection-to-group) | `N / A` | **&#x2713;**
[Remove a connection from a group](#remove-connection-from-group) | `N / A` | **&#x2713;**
[Close a client connection](#close-connection) | `N / A` | **&#x2713;**
[Service Health](#service-health) | `N / A` | **&#x2713;**

<a name="broadcast"> </a>
### Broadcast to everyone

Version | API HTTP Method | Request URL | Request body
--- | --- | --- | ---
`1.0-preview` | `POST` | `https://<instance-name>.service.signalr.net:5002/api/v1-preview/hub/<hub-name>` | `{"target": "<method-name>", "arguments": [...]}`
`1.0` | `POST` | `https://<instance-name>.service.signalr.net/api/v1/hubs/<hub-name>` | Same as above

<a name="broadcast-group"> </a>
### Broadcast to a group

Version | API HTTP Method | Request URL | Request body
--- | --- | --- | ---
`1.0-preview` | `POST` | `https://<instance-name>.service.signalr.net:5002/api/v1-preview/hub/<hub-name>/group/<group-name>` | `{"target": "<method-name>", "arguments": [...]}`
`1.0` | `POST` | `https://<instance-name>.service.signalr.net/api/v1/hubs/<hub-name>/groups/<group-name>` | Same as above

<a name="send-user"> </a>
### Sending to a user

Version | API HTTP Method | Request URL | Request body
--- | --- | --- | ---
`1.0-preview` | `POST` | `https://<instance-name>.service.signalr.net:5002/api/v1-preview/hub/<hub-name>/user/<user-id>` | `{"target": "<method-name>", "arguments": [...]}`
`1.0` | `POST` | `https://<instance-name>.service.signalr.net/api/v1/hubs/<hub-name>/users/<user-id>` | Same as above

<a name="add-user-to-group"> </a>
### Adding a user to a group

Version | API HTTP Method | Request URL
--- | --- | ---
`1.0` | `PUT` | `https://<instance-name>.service.signalr.net/api/v1/hubs/<hub-name>/groups/<group-name>/users/<user-id>`

<a name="remove-user-from-group"> </a>
### Removing a user from a group

Version | API HTTP Method | Request URL
--- | --- | ---
`1.0` | `DELETE` | `https://<instance-name>.service.signalr.net/api/v1/hubs/<hub-name>/groups/<group-name>/users/<user-id>`

<a name="check-user-existence"> </a>
### Check user existence in a group

API Version | API HTTP Method | Request URL
---|---|---
`1.0` | `GET` | `https://<instance-name>.service.signalr.net/api/v1/hubs/<hub-name>/users/<user-id>/groups/<group-name>`
`1.0` | `GET` | `https://<instance-name>.service.signalr.net/api/v1/hubs/<hub-name>/groups/<group-name>/users/<user-id>` 

Response Status Code | Description
---|---
`200` | User exists
`404` | User not exists

<a name="remove-user-from-all-groups"> </a>
### Remove a user from all groups

API Version | API HTTP Method | Request URL
---|---|---
`1.0` | `DELETE` | `https://<instance-name>.service.signalr.net/api/v1/hubs/<hub-name>/users/<user-id>/groups`

<a name="send-connection"> </a>
### Send message to a connection

API Version | API HTTP Method | Request URL | Request Body
---|---|---|---
`1.0` | `POST` | `https://<instance-name>.service.signalr.net/api/v1/hubs/<hub-name>/connections/<connection-id>` | `{ "target":"<method-name>", "arguments":[ ... ] }`

<a name="add-connection-to-group"> </a>
### Add a connection to a group

API Version | API HTTP Method | Request URL
---|---|---
`1.0` | `PUT` | `https://<instance-name>.service.signalr.net/api/v1/hubs/<hub-name>/groups/<group-name>/connections/<connection-id>`
`1.0` | `PUT` | `https://<instance-name>.service.signalr.net/api/v1/hubs/<hub-name>/connections/<connection-id>/groups/<group-name>`

<a name="remove-connection-from-group"> </a>
### Remove a connection from a group

API Version | API HTTP Method | Request URL
---|---|---
`1.0` | `DELETE` | `https://<instance-name>.service.signalr.net/api/v1/hubs/<hub-name>/groups/<group-name>/connections/<connection-id>`
`1.0` | `DELETE` | `https://<instance-name>.service.signalr.net/api/v1/hubs/<hub-name>/connections/<connection-id>/groups/<group-name>`

<a name="close-connection"> </a>
### Close a client connection

API Version | API HTTP Method | Request URL
---|---|---
`1.0` | `DELETE` | `https://<instance-name>.service.signalr.net/api/v1/hubs/<hub-name>/connections/<connection-id>`
`1.0` | `DELETE` | `https://<instance-name>.service.signalr.net/api/v1/hubs/<hub-name>/connections/<connection-id>?reason=<close-reason>`

<a name="service-health"> </a>
### Service Health

API Version | API HTTP Method | Request URL
---|---|---                             
`1.0` | `GET` | `https://<instance-name>.service.signalr.net/api/v1/health`

Response Status Code | Description
---|---
`200` | Service Good
`503` | Service Unavailable

[!INCLUDE [Cleanup](includes/signalr-quickstart-cleanup.md)]

## Next steps

In this quickstart, you learned how to use REST API to broadcast real-time message from SignalR Service to clients. Next, learn more about how to develop and deploy Azure Functions with SignalR Service binding, which is built on top of REST API.

> [!div class="nextstepaction"]
> [Develop Azure Functions using Azure SignalR Service bindings](signalr-quickstart-azure-functions-csharp.md)
