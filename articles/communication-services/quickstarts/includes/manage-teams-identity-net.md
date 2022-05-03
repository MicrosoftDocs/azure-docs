---
title: include file
description: include file
services: azure-communication-services
author: gistefan
manager: soricos

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 10/08/2021
ms.topic: include
ms.custom: include file
ms.author: gistefan
---

## Set up prerequisites

- The latest version [.NET SDK](https://dotnet.microsoft.com/download/dotnet) for your operating system.

## Set up

### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `CommunicationAccessTokensQuickstart`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o CommunicationAccessTokensQuickstart
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd CommunicationAccessTokensQuickstart
dotnet build
```

### Install the package

While still in the application directory, install the Azure Communication Services Identity library for .NET package by using the `dotnet add package` command.

```console
dotnet add package Azure.Communication.Identity --prerelease
dotnet add package Microsoft.Identity.Client --version 4.36.2
```

### Set up the app framework

From the project directory:

1. Open **Program.cs** file in a text editor
1. Add a `using` directive to include the `Azure.Communication.Identity` namespace
1. Update the `Main` method declaration to support async code

Use the following code to begin:

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Azure.Communication.Identity;
using Microsoft.Identity.Client;

namespace CommunicationAccessTokensQuickstart
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - Teams Access Tokens Quickstart");

            // Quickstart code goes here
        }
    }
}
```

### Step 1: Receive the Azure AD user token via the MSAL library

The first step in the token exchange flow is getting a token for your Teams user by using [Microsoft.Identity.Client](../../../active-directory/develop/reference-v2-libraries.md).

```csharp
string appId = "<contoso_application_id>";
string tenantId = "<contoso_tenant_id>";
string authority = $"https://login.microsoftonline.com/{tenantId}";
string redirectUri = "http://localhost";

var aadClient = PublicClientApplicationBuilder
                .Create(appId)
                .WithAuthority(authority)
                .WithRedirectUri(redirectUri)
                .Build();

string scope = "https://auth.msft.communication.azure.com/Teams.ManageCalls";

var teamsUserAadToken = await aadClient
                        .AcquireTokenInteractive(new List<string> { scope })
                        .ExecuteAsync();
```

### Step 2: Initialize the CommunicationIdentityClient

Initialize a `CommunicationIdentityClient` with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage your resource's connection string](../create-communication-resource.md#store-your-connection-string).

Add the following code to the `Main` method:

```csharp
// This code demonstrates how to fetch your connection string
// from an environment variable.
string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
var client = new CommunicationIdentityClient(connectionString);
```

### Step 3: Exchange the Azure AD access token of the Teams User for a Communication Identity access token

Use the `GetTokenForTeamsUser` method to issue an access token for the Teams user that can be used with the Azure Communication Services SDKs.

```csharp
var accessToken = await client.GetTokenForTeamsUserAsync(teamsUserAadToken.AccessToken);
Console.WriteLine($"Token: {accessToken.Value.Token}");
```

## Run the code

Run the application from your application directory with the `dotnet run` command.

```console
dotnet run
```
