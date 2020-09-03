---
title: include file
description: include file
services: azure-communication-services
author: shahen
manager: nimag
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/26/2020
ms.topic: include
ms.custom: include file
ms.author: shahen
---

**TODO: update all these reference links as the resources go live**

<!--[API reference documentation](../../../references/overview.md) | [Package (NuGet)](#todo-nuget) | [Samples](#todo-samples)-->

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The latest version [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- An active Communication Services resource [Create a Communication Services resource](../../create-a-communication-resource.md).
- A user access token for your Communication Services resource with `voip` permissions [Create and Manage User Access Tokens](../../user-access-tokens.md)

### Prerequisite check

- In a terminal or command window, run the `dotnet` command to check that the .NET SDK is installed.

## Setting Up

### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `RelayTokenQuickstart`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o RelayTokenQuickstart
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd RelayTokenQuickstart
dotnet build
```

### Set up the app framework

From the project directory:

1. Open **Program.cs** file in a text editor
1. Add a `using` directive to include the `Azure.Communication.Administration`, `System.Threading.Tasks` and `System.Net.Http`
1. Update the `Main` method declaration to support async code

Use the following code to get started:

```csharp
using System;
using Azure.Communication.Administration;
using System.Threading.Tasks;
using System.Net.Http;

namespace RelayTokenQuickstart
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - User Access Tokens Quickstart");

            // Quickstart code goes here
        }
    }
}
```

## Exchange the user access token for a relay token

Call the Azure Communication Services token service to exchange the user access token for a TURN service token:

```csharp  
var accessToken = INSERT_ACCESS_TOKEN_PREREQ

var httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Add("X-Skypetoken", accessToken);
httpClient.DefaultRequestHeaders.Add("api-version", "2");

HttpResponseMessage httpResponse = await httpClient.GetAsync("https://edge.skype.com/trap/tokens");
httpResponse.EnsureSuccessStatusCode();
string responseBody = await httpResponse.Content.ReadAsStringAsync();

Console.WriteLine(responseBody);
```

## Use the token on the client as an ICE candidate

The token can now be deserialized and added to an ICE candidate using a WebRTC library like [WinRTC](https://github.com/microsoft/winrtc).

```csharp  

public class RelayTokenResponse
{
    public List<TurnToken> Tokens { get; set; }
    public double Expires { get; set; }


}
public class TurnToken
{
    public string Realm { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
}


RelayTokenResponse relayTokenResponse = JsonSerializer.Deserialize<RelayTokenResponse>(
    responseBody,
    new JsonSerializerOptions() {PropertyNameCaseInsensitive = true });

var iceServers = new List<RTCIceServer>();
foreach (var token in responseBody.Tokens)
{
    RTCIceServer iceServer = new RTCIceServer();
    iceServer.Urls = new[] { $"turn:worldaz.turn.skype.com:3478" };
    iceServer.Username = token.Username;
    iceServer.Credential = token.Password;
    iceServer.CredentialType = RTCIceCredentialType.Password;
    iceServers.Add(iceServer);
}

//supply iceServers to RTCPeerConnection in and RTCConfiguration object from WinRTC
var config = new RTCConfiguration() {IceServers = iceServers};
var peerConnection = new RTCPeerConnection(_config);

```

## Run the code

Run the application from your application directory with the `dotnet run` command.

```console

dotnet run

```