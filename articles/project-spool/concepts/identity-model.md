---
title: Identity model in ACS
description: Learn how entities are represented in ACS world
author: ...    
manager: ...
services: azure-project-spool

ms.author: ...
ms.date: 05/06/2020
ms.topic: conceptual
ms.service: azure-project-spool

---


# Users

Azure Communication Services is a user oriented platform. Users are entities that can communicate with one another by participating in chat threads and calls. They are identified by a unique ID and authenticate directly to Azure Communications Services via [user access tokens](./user-access-tokens.md).

## Creating Users

Users are implicitly created when you request a [user access token](./user-access-tokens.md) without providing a user ID. 

```csharp
var configurationClient = new ConfigurationClient(CONNECTION_STRING);
var tokenResult = await configurationClient.CreateUserAccessTokenAsync();

// unique User ID
String userID = tokenResult.id;
```

It is possible for the same user to have simultaneous sessions across multiple devices and SDKs, so you may store a mapping between Azure Communication Users and the users of your application and re-issue additional access tokens for the same user over time.

```csharp
public async Task<string> IssueAccessToken(string userId)
{    
    // initialize the configuration client with a connection string
    // retrieved from the Azure Portal
    var configurationClient = new ConfigurationClient(CONNECTION_STRING);
    
    // create a user access token for the provided identity
    var tokenResult = await configurationClient.CreateUserAccessTokenAsync(userId);
    
    // return a the freshly minted token for the user
    return tokenResult.token;
}
```
It is also to treat users as ephemeral entities that are created for a single call or chat conversation.

## Connecting Users

The User IDs in Azure Communication Services are analagous to phone numbers. Any user can initiate a chat or call with any other user provided they are able to discover that user's ID.

### Chat

```C#
var chatClient = new ChatClient(endpoint, user1Token);
await chatClient.SendMessage(user2Id, "Hello 👋🏻");
```

### Calling

```C#
var callingClient = async CallingClient.CreateAsync(user1Token);
await callingClient.Call(user2Id);
```

## ACS Identity to real identity resolution

ACS will not provide a way for customers to provide customer specific identities and will not store any type of data that would map an ACS Identity to a customer specific identity. Therefore, ACS will have no knowledge of how customer has assigned the ACS Identity.

You as a customer have to maintain map of ACS identities to entities in your system, in a way that is suitable to satisfy requirements of the system you're building, for example by storing this mapping in a (non)persistent database.

## Deleting Users
