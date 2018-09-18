---
title: Quickstart - Azure SignalR Service REST API | Microsoft Docs
description: A quickstart for using the Azure SignalR Service REST API.
services: signalr
documentationcenter: ''
author: sffamily
manager: cfowler
editor: 

ms.assetid: 
ms.service: signalr
ms.devlang: dotnet
ms.topic: quickstart
ms.tgt_pltfrm: ASP.NET
ms.workload: tbd
ms.date: 06/13/2018
ms.author: zhshang
#Customer intent: As an ASP.NET Core developer, I want to push real-time data in my ASP.NET Core apps. So that my clients are updated without the need to poll, or request updates.
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

### Fist to build the executable file.
We use macOS osx.10.13-x64 as example. You can find [reference](https://docs.microsoft.com/en-us/dotnet/core/rid-catalog) on how to build on other platforms.
```bash
cd AzureSignalR-samples/samples/Serverless/

dotnet publish -c Release -r osx.10.13-x64
```

### Start a client

```
cd bin/Release/netcoreapp2.1/osx.10.13-x64/

Serverless client <ClientName> -c "<ConnectionString>" -h <HubName>
```

### Start a server

```
cd bin/Release/netcoreapp2.1/osx.10.13-x64/

Serverless server -c "<ConnectionString>" -h <HubName>
```

## Run the sample without publishing

You can also run the command below to start a server or client

```
# Start a server
dotnet run -- server -c "<ConnectionString>" -h <HubName>

# Start a client
dotnet run -- client <ClientName> -c "<ConnectionString>" -h <HubName>
```

### Use user-secrets to specify Connection String

You can run `dotnet user-secrets set Azure:SignalR:ConnectionString "<ConnectionString>"` in the root directory of the sample. After that, you don't need the option `-c "<ConnectionString>"` anymore.

## Usage

After the server started, use the command to send message

```
send user <User Id>
send users <User List>
send group <Group Name>
send groups <Group List>
broadcast
```

You can start multiple clients with different client names.


[!INCLUDE [Cleanup](includes/signalr-quickstart-cleanup.md)]