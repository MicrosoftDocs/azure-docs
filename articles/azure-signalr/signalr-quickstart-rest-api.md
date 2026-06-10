---
title: Quickstart - Azure SignalR Service REST API
description: Learn how to use REST API with Azure SignalR Service following samples. Find details of REST API specification.
author: vicancy
ms.service: azure-signalr-service
ms.topic: quickstart
ms.date: 06/03/2026
ms.author: lianwei
ms.custom: mode-api
---
# Quickstart: Broadcast real-time messages from console app

Azure SignalR Service provides [REST API](https://github.com/Azure/azure-signalr/blob/dev/docs/rest-api.md) to support server-to-client communication scenarios such as broadcasting. You can choose any programming language that can make REST API calls. You can post messages to all connected clients, a specific client by name, or a group of clients.

In this quickstart, you learn how to send messages from a command-line app to connected client apps in C#.

[!INCLUDE [Connection string security](includes/signalr-connection-string-security.md)]

## Prerequisites

This quickstart can be run on macOS, Windows, or Linux.

* [.NET Core SDK](https://dotnet.microsoft.com/download)
* A text editor or code editor of your choice.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qsapi).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com) using your Azure account.

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qsapi).

[!INCLUDE [Create instance](includes/signalr-quickstart-create-instance.md)]

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qsapi).

## Clone the sample application

While the service is being deployed, let's get the code ready. First, clone the [sample app from GitHub](https://github.com/aspnet/AzureSignalR-samples.git). Next, set the SignalR Service connection string to the app. Finally, run the application locally.

1. Open a git terminal window. Change to a folder where you want to clone the sample project.

1. Run the following command to clone the sample repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/aspnet/AzureSignalR-samples.git
    ```
Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qsapi).

## Build and run the sample

This sample is a console app showing the use of Azure SignalR Service. It provides two modes:

- Server Mode: use simple commands to call Azure SignalR Service REST API.
- Client Mode: connect to Azure SignalR Service and receive messages from server.

You also learn how to generate an access token to authenticate with Azure SignalR Service.

### Build the executable file

We use macOS osx.10.13-x64 as example. You can find [reference](/dotnet/core/rid-catalog) on how to build on other platforms.

```bash
cd AzureSignalR-samples/samples/Serverless/

dotnet publish -c Release -r osx.10.13-x64
```

### Start a client

[!INCLUDE [Connection string security comment](includes/signalr-connection-string-security-comment.md)]

```bash
cd bin/Release/netcoreapp2.1/osx.10.13-x64/

Serverless client <ClientName> -c "<ConnectionString>" -h <HubName>
```

### Start a server

```bash
cd bin/Release/netcoreapp2.1/osx.10.13-x64/

Serverless server -c "<ConnectionString>" -h <HubName>
```

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qsapi).

## Run the sample without publishing

You can also run the following command to start a server or client

```bash
# Start a server
dotnet run -- server -c "<ConnectionString>" -h <HubName>

# Start a client
dotnet run -- client <ClientName> -c "<ConnectionString>" -h <HubName>
```

### Use user-secrets to specify Connection String

You can run `dotnet user-secrets set Azure:SignalR:ConnectionString "<ConnectionString>"` in the root directory of the sample. After that, you don't need the option `-c "<ConnectionString>"` anymore.

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qsapi).

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

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qsapi).

## <a name="usage"> </a> Integration with non-Microsoft services

The Azure SignalR service allows non-Microsoft services to integrate with the system.

### Definition of technical specifications

See [REST API Versions](signalr-reference-data-plane-rest-api.md#rest-api-versions) for all supported API versions and specifications.

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qsapi).

[!INCLUDE [Cleanup](includes/signalr-quickstart-cleanup.md)]

Having issues? Try the [troubleshooting guide](signalr-howto-troubleshoot-guide.md) or [let us know](https://aka.ms/asrs/qsapi).

## Next steps

In this quickstart, you learned how to use REST API to broadcast real-time message from SignalR Service to clients. Next, learn more about how to develop and deploy Azure Functions with SignalR Service binding, which is built on top of REST API.

> [!div class="nextstepaction"]
> [Develop Azure Functions using Azure SignalR Service bindings](signalr-quickstart-azure-functions-csharp.md)
