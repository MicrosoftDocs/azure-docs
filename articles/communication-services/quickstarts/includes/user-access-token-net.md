---
title: include file
description: include file
services: azure-communication-services
author: tomaschladek
manager: nmurav

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/20/2020
ms.topic: include
ms.custom: include file
ms.author: tchladek
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- The latest version [.NET Core client library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).

## Setting Up

### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `AccessTokensQuickstart`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o AccessTokensQuickstart
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd AccessTokensQuickstart
dotnet build
```

### Install the package

While still in the application directory, install the Azure Communication Services Administration library for .NET package by using the `dotnet add package` command.

```console
dotnet add package Azure.Communication.Administration --version 1.0.0-beta.2
```

### Set up the app framework

From the project directory:

1. Open **Program.cs** file in a text editor
1. Add a `using` directive to include the `Azure.Communication.Administration` namespace
1. Update the `Main` method declaration to support async code

Use the following code to begin:

```csharp
using System;
using Azure.Communication.Administration;

namespace AccessTokensQuickstart
{
    class Program
    {
        static async System.Threading.Tasks.Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - Access Tokens Quickstart");

            // Quickstart code goes here
        }
    }
}
```
## Authenticate the client

Initialize a `CommunicationIdentityClient` with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage you resource's connection string](../create-communication-resource.md#store-your-connection-string).

Add the following code to the `Main` method:

```csharp
// This code demonstrates how to fetch your connection string
// from an environment variable.
string ConnectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
var client = new CommunicationIdentityClient(ConnectionString);
```

## Create an identity

Azure Communication Services maintains a lightweight identity directory. Use the `createUser` method to create a new entry in the directory with a unique `Id`. You should maintain a mapping between your application's users and Communication Services generated identities (e.g. by storing them in your application server's database).

```csharp
var identityResponse = await client.CreateUserAsync();
var identity = identityResponse.Value;
Console.WriteLine($"\nCreated an identity with ID: {identity.Id}");
```

## Issue identity access tokens

Use the `issueToken` method to issue an access token for a Communication Services identity. Parameter `scopes` defines set of actions, which are authorized to be performed with the access token. See the [list of supported actions](../concepts/authentication.md). New instance of parameter `communicationUser` can be constructed with the identity's ID, which you are suppose to store and map to your application's users.

```csharp
// Issue an access token with the "voip" scope for an identity
var tokenResponse = await client.IssueTokenAsync(identity, scopes: new [] { CommunicationTokenScope.VoIP });
var token =  tokenResponse.Value.Token;
var expiresOn = tokenResponse.Value.ExpiresOn;
Console.WriteLine($"\nIssued an access token with 'voip' scope that expires at {expiresOn}:");
Console.WriteLine(token);
```

Access tokens are short-lived credentials that need to be reissued in order to prevent your application's users from experiencing service disruptions. The `expiresOn` response property indicates the lifetime of the access token. 

## Refresh access tokens

To refresh an access token, use the `CommunicationUser` object to re-issue:

```csharp  
// Value existingIdentity represents identity of Azure Communication Services stored during identity creation
identity = new CommunicationUser(existingIdentity);
tokenResponse = await client.IssueTokenAsync(identity, scopes: new [] { CommunicationTokenScope.VoIP });
```

## Revoke access tokens

In some cases, you may need to explicitly revoke access tokens, for example, when a application's user changes the password they use to authenticate to your service. Method `RevokeTokensAsync` invalidate all active access tokens, that were issued to the identity.

```csharp  
await client.RevokeTokensAsync(identity);
Console.WriteLine($"\nSuccessfully revoked all access tokens for identity with ID: {identity.Id}");
```

## Delete an identity

Deleting an identity revokes all active access tokens and prevents you from issuing subsequent access tokens for the identities. It also removes all the persisted content associated with the identity.

```csharp
await client.DeleteUserAsync(identity);
Console.WriteLine($"\nDeleted the identity with ID: {identity.Id}");
```

## Run the code

Run the application from your application directory with the `dotnet run` command.

```console
dotnet run
```
