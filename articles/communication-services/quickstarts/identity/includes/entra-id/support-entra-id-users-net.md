---
title: include file
description: include file
services: azure-communication-services
author: aigerimb
manager: soricos

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 05/06/2025
ms.topic: include
ms.custom: include file
ms.author: aigerimb
---

## Set up prerequisites

- The latest version [.NET SDK](https://dotnet.microsoft.com/download/dotnet) for your operating system.
- [Azure Identify SDK for .Net](https://www.nuget.org/packages/Azure.Identity) to authenticate with Microsoft Entra ID.
- [Azure Communication Services Common SDK for .Net](https://www.nuget.org/packages/Azure.Communication.Common/) to obtain Azure Communication Services access tokens for Microsoft Entra ID user.

## Final code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/EntraIdUsersSupportQuickstart).

## Set up

### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `EntraIdUsersSupportQuickstart`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o EntraIdUsersSupportQuickstart
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd EntraIdUsersSupportQuickstart
dotnet build
```

### Install the package

While still in the application directory, install the Azure Identity and Azure Communication Services Common library for .NET package by using the `dotnet add package` command. The Azure Communication Services Common SDK version should be `1.4.0` or later.

```console
dotnet add package Azure.Identity
dotnet add package Azure.Communication.Common
```

### Implement the credential flow

From the project directory:

1. Open **Program.cs** file in a text editor
1. Replace the contents of **Program.cs** with the following code:

```csharp
using Azure.Communication;
using Azure.Identity;

namespace EntraIdUsersSupportQuickstart
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - Obtain Access Token for Entra ID User Quickstart");

            // Quickstart code goes here
        }
    }
}
```

<a name='step-1-obtain-entra-user-token-via-the-identity-library'></a>

### Step 1: Initialize implementation of TokenCredential from Azure Identity SDK

The first step in obtaining Communication Services access token for Entra ID user is getting an Entra ID access token for your Entra ID user by using [Azure.Identity](https://learn.microsoft.com/dotnet/api/overview/azure/identity-readme?view=azure-dotnet) SDK. The code below retrieves the Contoso Entra client ID and the Fabrikam tenant ID from environment variables named `ENTRA_CLIENT_ID` and `ENTRA_TENANT_ID`. To enable authentication for users across multiple tenants, initialize the `InteractiveBrowserCredential` class with the authority set to `https://login.microsoftonline.com/organizations`. For more information, see [Authority](https://learn.microsoft.com/entra/identity-platform/msal-client-application-configuration#authority).

```csharp
// This code demonstrates how to fetch your Microsoft Entra client ID and tenant ID from environment variables.
string clientId = Environment.GetEnvironmentVariable("ENTRA_CLIENT_ID");
string tenantId = Environment.GetEnvironmentVariable("ENTRA_TENANT_ID");

//Initialize InteractiveBrowserCredential for use with CommunicationTokenCredential.
var options = new InteractiveBrowserCredentialOptions
{
    TenantId = tenantId,
    ClientId = clientId,
};
var entraTokenCredential = new InteractiveBrowserCredential(options);

```

### Step 2: Initialize CommunicationTokenCredential

Instantiate a `CommunicationTokenCredential` with the TokenCredential created above and your Communication Services resource endpoint URI. The code below retrieves the endpoint for the resource from an environment variable named `COMMUNICATION_SERVICES_RESOURCE_ENDPOINT`.

Add the following code to the `Main` method:

```csharp
// This code demonstrates how to fetch your Azure Communication Services resource endpoint URI
// from an environment variable.
string resourceEndpoint = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_RESOURCE_ENDPOINT");

// Set up CommunicationTokenCredential to request a Communication Services access token for a Microsoft Entra ID user.
var entraTokenCredentialOptions = new EntraCommunicationTokenCredentialOptions(
    resourceEndpoint: resourceEndpoint,
    entraTokenCredential: entraTokenCredential)
{
    Scopes = new[] { "https://communication.azure.com/clients/VoIP" }
};

var credential = new CommunicationTokenCredential(entraTokenCredentialOptions);

```

Providing scopes is optional. When not specified, the `https://communication.azure.com/clients/.default` scope is automatically used, requesting all API permissions for Communication Services Clients that have been registered on the client application.

<a name='step-3-obtain-acs-access-token-of-the-entra-id-user'></a>

### Step 3: Obtain Azure Communication Services access token for Microsoft Entra ID user

Use the `GetTokenAsync` method to obtain an access token for the Entra ID user. The `CommunicationTokenCredential` can be used with the Azure Communication Services SDKs.

```csharp
// To obtain a Communication Services access token for Microsoft Entra ID call GetTokenAsync() method.
var accessToken = await credential.GetTokenAsync();
Console.WriteLine($"Token: {accessToken.Token}");
```

## Run the code

Run the application from your application directory with the `dotnet run` command.

```console
dotnet run
```
