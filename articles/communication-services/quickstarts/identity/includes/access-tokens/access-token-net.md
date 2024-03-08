---
title: include file
description: include file
services: azure-communication-services
author: tomaschladek
manager: nmurav

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 11/17/2021
ms.topic: include
ms.custom: include file
ms.author: tchladek
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The latest [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core) version for your operating system.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../../create-communication-resource.md).

## Final code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/AccessTokensQuickstart).

## Set up your environment

### Create a new C# application

In a Command Prompt window, such as cmd, PowerShell, or Bash, run the `dotnet new` command to create a new console app with the name `AccessTokensQuickstart`. This command creates a simple "Hello World" C# project with a single source file, *Program.cs*.

```console
dotnet new console -o AccessTokensQuickstart
```

Change your directory to the newly created app folder, and use the `dotnet build` command to compile your application.

```console
cd AccessTokensQuickstart
dotnet build
```
A simple "Hello World" output should be displayed. If it is, your setup is working correctly, and you can get started writing your Azure Communication Services-specific code.

### Install the package

While you're still in the application directory, install the Azure Communication Services Identity library for .NET package by using the `dotnet add package` command.

```console
dotnet add package Azure.Communication.Identity
```

### Set up the app framework

In the project directory, do the following:

1. Open the *Program.cs* file in a text editor.
1. Add a `using` directive to include the `Azure.Communication.Identity` namespace.
1. Update the `Main` method declaration to support async code.

To begin, run the following code:

```csharp
using System;
using Azure;
using Azure.Core;
using Azure.Communication.Identity;

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

Initialize `CommunicationIdentityClient` with your connection string. The following code, which you add to the `Main` method, retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. 

For more information, see the "Store your connection string" section of [Create and manage Communication Services resources](../../../create-communication-resource.md#store-your-connection-string).

```csharp
// This code demonstrates how to retrieve your connection string
// from an environment variable.
string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
var client = new CommunicationIdentityClient(connectionString);
```

Alternatively, you can separate the endpoint and access key by running the following code:

```csharp
// This code demonstrates how to fetch your endpoint and access key
// from an environment variable.
string endpoint = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_ENDPOINT");
string accessKey = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_ACCESSKEY");
var client = new CommunicationIdentityClient(new Uri(endpoint), new AzureKeyCredential(accessKey));
```

If you've already set up a Microsoft Entra application, you can [authenticate by using Microsoft Entra ID](../../../identity/service-principal.md).

```csharp
TokenCredential tokenCredential = new DefaultAzureCredential();
var client = new CommunicationIdentityClient(new Uri(endpoint), tokenCredential);
```

## Create an identity

To create access tokens, you need an identity. Azure Communication Services maintains a lightweight identity directory for this purpose. Use the `createUser` method to create a new entry in the directory with a unique `Id`. The identity is required later for issuing access tokens.

```csharp
var identityResponse = await client.CreateUserAsync();
var identity = identityResponse.Value;
Console.WriteLine($"\nCreated an identity with ID: {identity.Id}");
```
Store the received identity with mapping to your application's users (for example, by storing it in your application server database).

## Issue an access token

After you have a Communication Services identity, use the `GetToken` method to issue an access token for it. The `scopes` parameter defines a set of access token permissions and roles. For more information, see the list of supported actions in [Identity model](../../../../concepts/identity-model.md#access-tokens). You can also construct a new instance of `communicationUser` based on a string representation of an Azure Communication Service identity.

```csharp
// Issue an access token with a validity of 24 hours and the "voip" scope for an identity
var tokenResponse = await client.GetTokenAsync(identity, scopes: new [] { CommunicationTokenScope.VoIP });

// Get the token from the response
var token =  tokenResponse.Value.Token;
var expiresOn = tokenResponse.Value.ExpiresOn;
Console.WriteLine($"\nIssued an access token with 'voip' scope that expires at {expiresOn}:");
Console.WriteLine(token);
```

Access tokens are short-lived credentials that need to be reissued. Not doing so might cause a disruption of your application users' experience. The `expiresOn` property indicates the lifetime of the access token.

## Set a custom token expiration time

The default token expiration time is 24 hours, but you can configure it by providing a value between an hour and 24 hours to the optional parameter `tokenExpiresIn`. When requesting a new token, it's recommended that you specify the expected typical length of a communication session for the token expiration time.

```csharp
// Issue an access token with a validity of an hour and the "voip" scope for an identity 
TimeSpan tokenExpiresIn = TimeSpan.FromHours(1);
CommunicationTokenScope[] scopes = new[] { CommunicationTokenScope.VoIP };
var tokenResponse = await client.GetTokenAsync(identity, scopes, tokenExpiresIn);
```

## Create an identity and issue a token in the same request

You can use the `CreateUserAndTokenAsync` method to create a Communication Services identity and issue an access token for it at the same time. The `scopes` parameter defines a set of access token permissions and roles. For more information, see the list of supported actions in [Authenticate to Azure Communication Services](../../../../concepts/authentication.md).

```csharp
// Issue an identity and an access token with a validity of 24 hours and the "voip" scope for the new identity
var identityAndTokenResponse = await client.CreateUserAndTokenAsync(scopes: new[] { CommunicationTokenScope.VoIP });

// Retrieve the identity, token, and expiration date from the response
var identity = identityAndTokenResponse.Value.User;
var token = identityAndTokenResponse.Value.AccessToken.Token;
var expiresOn = identityAndTokenResponse.Value.AccessToken.ExpiresOn;
Console.WriteLine($"\nCreated an identity with ID: {identity.Id}");
Console.WriteLine($"\nIssued an access token with 'voip' scope that expires at {expiresOn}:");
Console.WriteLine(token);
```

## Refresh an access token

To refresh an access token, pass an instance of the `CommunicationUserIdentifier` object into `GetTokenAsync`. If you've stored this `Id` and need to create a new `CommunicationUserIdentifier`, you can do so by passing your stored `Id` into the `CommunicationUserIdentifier` constructor as follows:

```csharp
var identityToRefresh = new CommunicationUserIdentifier(identity.Id);
var tokenResponse = await client.GetTokenAsync(identityToRefresh, scopes: new [] { CommunicationTokenScope.VoIP });
```

## Revoke access tokens

You might occasionally need to explicitly revoke an access token. For example, you would do so when application users change the password they use to authenticate to your service. The `RevokeTokensAsync` method invalidates all active access tokens that were issued to the identity.

```csharp
await client.RevokeTokensAsync(identity);
Console.WriteLine($"\nSuccessfully revoked all access tokens for identity with ID: {identity.Id}");
```

## Delete an identity

When you delete an identity, you revoke all active access tokens and prevent the further issuance of access tokens for the identity. Doing so also removes all persisted content that's associated with the identity.

```csharp
await client.DeleteUserAsync(identity);
Console.WriteLine($"\nDeleted the identity with ID: {identity.Id}");
```

## Run the code

When you've finished creating the access token, you can run the application from your application directory by using the `dotnet run` command.

```console
dotnet run
```

The app's output describes each completed action:

<!---cSpell:disable --->
```console
Azure Communication Services - Access Tokens Quickstart

Created an identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-19e0-2727-80f5-8b3a0d003502

Issued an access token with 'voip' scope that expires at 10/11/2022 7:34:29 AM +00:00:
eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMF8wMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJzY3AiOjE3OTIsImNzaSI6IjE2NjUzODcyNjkiLCJleHAiOjE2NjUzOTA4NjksImFjc1Njb3BlIjoidm9pcCIsInJlc291cmNlSWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJyZXNvdXJjZUxvY2F0aW9uIjoidW5pdGVkc3RhdGVzIiwiaWF0IjoxNjY1Mzg3MjY5fQ.kTXpQQtY7w6O82kByljZXrKtBvNNOleDE5m06LapzLeoWfRZCCpJQcDzBoLRA146mOhNzLZ0b5WMNTa5tD-0hWCiicDwgKLMASEGY9g0EvNQOidPff47g2hh6yqi9PKiDPp-t5siBMYqA6Nh6CQ-Oeh-35vcRW09VfcqFN38IgSSzJ7QkqBiY_QtfXz-iaj81Td0287KO4U1y2LJIGiyJLWC567F7A_p1sl6NmPKUmvmwM47tyCcQ1r_lfkRdeyDmcrGgY6yyI3XJZQbpxyt2DZqOTSVPB4PuRl7iyXxvppEa4Uo_y_BdMOOWFe6YTRB5O5lhI8m7Tf0LifisxX2sw

Created an identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-1ce9-31b4-54b7-a43a0d006a52

Issued an access token with 'voip' scope that expires at 10/11/2022 7:34:29 AM +00:00:
eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMF8wMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJzY3AiOjE3OTIsImNzaSI6IjE2NjUzODcyNjkiLCJleHAiOjE2NjUzOTA4NjksImFjc1Njb3BlIjoidm9pcCIsInJlc291cmNlSWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJyZXNvdXJjZUxvY2F0aW9uIjoidW5pdGVkc3RhdGVzIiwiaWF0IjoxNjY1Mzg3MjY5fQ.kTXpQQtY7w6O82kByljZXrKtBvNNOleDE5m06LapzLeoWfRZCCpJQcDzBoLRA146mOhNzLZ0b5WMNTa5tD-0hWCiicDwgKLMASEGY9g0EvNQOidPff47g2hh6yqi9PKiDPp-t5siBMYqA6Nh6CQ-Oeh-35vcRW09VfcqFN38IgSSzJ7QkqBiY_QtfXz-iaj81Td0287KO4U1y2LJIGiyJLWC567F7A_p1sl6NmPKUmvmwM47tyCcQ1r_lfkRdeyDmcrGgY6yyI3XJZQbpxyt2DZqOTSVPB4PuRl7iyXxvppEa4Uo_y_BdMOOWFe6YTRB5O5lhI8m7Tf0LifisxX2sw

Successfully revoked all access tokens for identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-19e0-2727-80f5-8b3a0d003502

Deleted the identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-19e0-2727-80f5-8b3a0d003502
```
<!---cSpell:enable --->
