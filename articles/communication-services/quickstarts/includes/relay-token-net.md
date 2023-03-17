---
title: include file
description: include file
services: Communication Services
author: rahulva
manager: shahen
ms.service: Communication Services
ms.subservice: Communication Services
ms.date: 06/30/2021
ms.topic: include
ms.custom: include file
ms.author: rahulva
---
> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/GetRelayConfiguration)
### Prerequisite check

- In a terminal or command window, run the `dotnet` command to check that the .NET SDK is installed.

## Setting Up

### Create a new C# application

1. In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `RelayTokenQuickstart`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o RelayTokenQuickstart
```

2. Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd RelayTokenQuickstart
dotnet build
```

### Install the package

While still in the application directory, install the Azure Communication Services Identity and NetworkTraversal library for .NET package by using the `dotnet add package` command.

```console
dotnet add package Azure.Communication.Identity
dotnet add package Azure.Communication.NetworkTraversal
```

### Set up the app framework

From the project directory:

1. Open **Program.cs** file in a text editor
2. Add a `using` directive to include the `Azure.Communication.Identity`, `System.Threading.Tasks`, and `System.Net.Http`
3. Update the `Main` method declaration to support async code

Here's the code:

```csharp
using System;
using Azure.Communication.Identity;
using Azure;
using System.Collections.Generic;
using Azure.Communication.NetworkTraversal;

namespace RelayTokenQuickstart
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - User Relay Token Quickstart");

            // Quickstart code goes here
        }
    }
}
```

### Authenticate the client

Initialize a `CommunicationIdentityClient` with your connection string. The code below retrieves the connection string for the resource from an environment variable. If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable.

Add the following code to the `Main` method:

```csharp
// This code demonstrates how to fetch your connection string
// from an environment variable.
string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
var client = new CommunicationIdentityClient(connectionString);
```

## Create an identity

Azure Communication Services maintains a lightweight identity directory. Use the `createUser` method to create a new entry in the directory with a unique `Id`. Store received identity with mapping to your application's users. For example, by storing them in your application server's database. The identity is required later to issue access tokens.

```csharp
var identityResponse = await client.CreateUserAsync().Result;
var identity = identityResponse.Value;
Console.WriteLine($"\nCreated an identity with ID: {identity.Id}");
```

### Exchange the user access token for a relay token

Call the Azure Communication token service to exchange the user access token for a TURN service token

```csharp
var relayClient = new CommunicationRelayClient("COMMUNICATION_SERVICES_CONNECTION_STRING");

Response<CommunicationRelayConfiguration> turnTokenResponse = await relayClient.GetRelayConfigurationAsync(identity).Result;
DateTimeOffset turnTokenExpiresOn = turnTokenResponse.Value.ExpiresOn;
IReadOnlyList<CommunicationIceServer> iceServers = turnTokenResponse.Value.IceServers;
Console.WriteLine($"Expires On: {turnTokenExpiresOn}");
foreach (CommunicationIceServer iceServer in iceServers)
{
    foreach (string url in iceServer.Urls)
    {
        Console.WriteLine($"TURN Url: {url}");
    }
    Console.WriteLine($"TURN Username: {iceServer.Username}");
    Console.WriteLine($"TURN Credential: {iceServer.Credential}");
}
```

## Run the code

Run the application from your application directory with the `dotnet run` command.

```console
dotnet run
```
