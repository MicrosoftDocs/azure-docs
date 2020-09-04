---
title: Identity Model in Azure Communication Services
description: Learn how entities are represented in Azure Communication Services
author: arturk
manager: mariusu
services: azure-communication-services

ms.author: arturk
ms.date: 05/06/2020
ms.topic: conceptual
ms.service: azure-communication-services

zone_pivot_groups: acs-js-csharp
---

# Identity model

[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]

> [!WARNING]
> This document is under construction and needs the following items to be addressed: 
> - When do we need to create users? Can we initiate conversations without ever creating users?
> - Can we add a bit of clarity around user access tokens and access keys, per [auth docs](./authentication.md)?
> - We have a mix of C# and JS here - can we pick a single language, and later add pivots? Or ensure that both are provided in-line?

Azure Communication Services models identity around conversation identifiers. Identifiers are how you can address entities that can participate in conversations. Users, phone numbers, and applications are examples of identifiers. Any entity can initiate a voice, video, or chat conversation with any other entities as long as they're able to discover each other's identifier and have the necessary permission to do so.

| Identity Type         | ID Description                                                 |
| --------------------- | -------------------------------------------------------------- |
| `Communication User`  | Azure Communication Services User                              |
| `Phone Number`        | Phone number of a call participant, sender or recipient of SMS |
| `Calling Application` | Azure Communication Services Application                       |

## Users

Azure Communication Services is a user-oriented platform. Users are entities that can communicate with one another by participating in chat threads and calls. They're identified by a unique ID and authenticate directly to Azure Communications Services via [user access tokens](../quickstarts/user-access-tokens.md).

## Creating users

`CommunicationIdentityClient` provides functionality for creating and deleting users.

::: zone pivot="programming-language-csharp" 

```csharp
CommunicationIdentityClient client = new CommunicationIdentityClient(CONNECTION_STRING);
CommunicationUser user = await client.CreateUserAsync();
```

::: zone-end

::: zone pivot="programming-language-javascript" 

```javascript
const client = new CommunicationIdentityClient(CONNECTION_STRING);
const user = await client.createUser();
```

::: zone-end


It's possible for the same user to have multiple simultaneous sessions across multiple devices and SDKs. You're encouraged to store a mapping between Communication Services users and the users of your application so you can reissue access tokens for the same user over time. You also have to provide list of scopes to the function below. Scopes are list of strings that determine if a user can use the Azure Communication offerings, such as `"chat"`, `"call"`, `"voip"` etc.

::: zone pivot="programming-language-csharp" 
```csharp
public async Task<string> IssueAccessToken(CommunicationUser user)
{
    // initialize the identity client with a connection string
    // retrieved from the Azure portal
    var client = new CommunicationIdentityClient(CONNECTION_STRING);
    
    // create a user access token for the provided user
    var response = await client.IssueTokenAsync(user, new [] { CommunicationTokenScope.Chat });
    
    // return a the freshly minted token for the user
    return response.Value.Token;
}
```
::: zone-end

::: zone pivot="programming-language-javascript"
```javascript
public async issueAccessToken(user)
{
    // initialize the identity client with a connection string
    // retrieved from the Azure portal
    const client = new CommunicationIdentityClient(CONNECTION_STRING);
    
    // create a user access token for the provided user
    const { token } = await client.issueToken(user, ["chat"]);
    
    // return a the freshly minted token for the user
    return token;
}
```
::: zone-end

<!-- We should add this when we support it: It is also possible to treat users as ephemeral entities that are created for a single call or chat conversation. -->


### Chat

Azure Communication Services users chat with one another by participating in threads. When a message is sent to a thread, it's delivered to every participant within that thread.

::: zone pivot="programming-language-csharp" 
```csharp
var chatClient = new ChatClient(url, userAccessToken);
var threadClient = await chatClient.CreateChatThread(
  topic: "Lunch",
  members: new []
  {
    new ChatThreadMember(user1),
    new ChatThreadMember(user2)
  });
await threadClient.SendMessageAsync(content: "Hello 👋🏻");
```
::: zone-end

::: zone pivot="programming-language-javascript" 
```javascript
var chatClient = new ChatClient(url, userAccessToken);
var threadClient = await chatClient.createThread({
  topic: "Lunch",
  members: [user1, user2]
});
await threadClient.sendMessage({
  content: "Hello 👋🏻"
});
```
::: zone-end


It's possible to enumerate the full list of a thread's participants using the `members` API. The `userId` field corresponds to the unique identity of the Azure Communication Services user.

### Calling

Azure Communication Services users can call one another by passing the ID of the user they wish to call to the client calling SDK.

::: zone pivot="programming-language-csharp" 
```csharp
// TODO
```
::: zone-end

::: zone pivot="programming-language-javascript" 
```javascript
const callClient = await CallClientFactory.create(userToken);
const call = await callClient.call([user]);
```
::: zone-end

The `Call` interface exposes a `remoteParticipants` property that enables you to enumerate all participants in a call and exposes their identifiers.


## Communication Services identity to real identity resolution

Communication Services will not provide a way for customers to provide customer specific identities and will not store any type of data that would map a Communication Services Identity to a customer specific identity. Therefore, Communication Services will have no knowledge of how customer has assigned the Communication Services Identity.

When developing an application with Communication Services, you're encouraged to maintain a mapping between users within your identity domain and Communication Services identities. For example, if your users are stored in the `User` table of a relational database, you may want to add a `CommunicationServicesId` column to store your Communication Services identifiers. If you wish to build a one-to-many relationship between `User` and identifier in this scenario, you might consider using a separate table to represent conversation identifiers.

## Deleting users

It's possible to delete users via the Administration SDK. When you delete a user, all of the customer content associated with that user, including chat messages and call history, is deleted.

::: zone pivot="programming-language-csharp" 
```csharp
CommunicationIdentityClient client = new CommunicationIdentityClient(CONNECTION_STRING);
await client.DeleteUserAsync(user);
```
::: zone-end

::: zone pivot="programming-language-javascript" 
```javascript
const client = new CommunicationIdentityClient(CONNECTION_STRING);
const user = await client.deleteUser();
```
::: zone-end

## Next steps

 - [Learn about authentication and authorization](./authentication.md)
