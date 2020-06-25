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

Users are implicitly created when you request a [user access token](./user-access-tokens.md) without providing a user ID. You also have to provide list of scopes to the function below. Scopes are list of strings that determine if a user can use the Azure Communication offerings, such as `"chat"`, `"call"`, `"voip"` etc.

```csharp
var userTokenClient = new UserTokenClient(CONNECTION_STRING);
var tokenResponse = await userTokenClient.IssueAsync(scopes: new List<string>{ "chat" });

string userId = tokenResponse.Value.AcsIdentity;

string token = tokenResponse.Value.Token
```

It is possible for the same user to have simultaneous sessions across multiple devices and SDKs, so you may store a mapping between Azure Communication Users and the users of your application and re-issue additional access tokens for the same user over time.

```csharp
public async Task<string> IssueAccessToken(string userId)
{    
    // initialize the user token client with a connection string
    // retrieved from the Azure Portal
    var userTokenClient = new UserTokenClient(CONNECTION_STRING);
    
    // create a user access token for the provided identity
    var tokenResponse = await userTokenClient.IssueAsync(userId);
    
    // return a the freshly minted token for the user
    return tokenResponse.Token;
}
```
It is also possible to treat users as ephemeral entities that are created for a single call or chat conversation.

## Connecting Users

The User IDs in Azure Communication Services are analagous to phone numbers. Any user can initiate a chat or call with any other user provided they are able to discover that user's ID.

### Chat

Azure Communication Services users chat with one another by participating in threads. When a message is sent to a thread, it is delivered to all the members of that thread.

```javascript
var chatClient = new ChatClient(url, userAccessToken);
var thread = await chatClient.createThread([user1, user2]);
await chatClient.postMessage({
  content: "Hello 👋🏻"
});
```

It it possible to enumerate the full list of a thread's participants using the `members` API. The `userId` field corresponds to the unique ID of the Azure Communication Services user.

### Calling

Azure Communication Services users can call one another by passing the ID of the user they wish to call to the client calling SDK.

```javascript
const callClient = await CallClientFactory.create(userToken);
const call = await callClient.call([userId]);
```

The `Call` interface exposes a `remoteParticipants` property that enables you to enumerate all participants in a call. The `identity` of each `RemoteParticipant` is a combination of unique identifier and type.

| Identity Type | ID Description |
|---|---|
|`user`| Unique Azure Communication Services User ID |
|`pstn`| The phone number of the call participant |
|`bot`| Unique Azure Communication Services User ID |

## ACS Identity to real identity resolution

ACS will not provide a way for customers to provide customer specific identities and will not store any type of data that would map an ACS Identity to a customer specific identity. Therefore, ACS will have no knowledge of how customer has assigned the ACS Identity.

You as a customer have to maintain map of ACS identities to entities in your system, in a way that is suitable to satisfy requirements of the system you're building, for example by storing this mapping in a (non)persistent database.

## Deleting Users

It is possible to delete users via the configuration SDK. When you delete a user, all of the customer content associated with that user, including chat messages and call history, is deleted.
<!--TODO: This part is not ready in SDK yet-->
```charpt
await configurationClient.users().delete(userId);
```
