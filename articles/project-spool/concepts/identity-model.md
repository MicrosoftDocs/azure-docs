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


# Identity model

Every entitiy in ACS world, a user, bot or pstn number is represented by an Identity type.
Depending on the type, for:
* user, Identity represents an object in ACS world that maps to a user entity in your system, identified by a unique userId provided for that user at the time when he was created using ACS management SDK
* pstn numbers, Identity represents an object in ACS world that maps to a phone number.
* bot, Identity represents an object in ACS world that maps to a particular bot, identified by bot APP Id

When your application interacts with other entities in the ACS system through ACS client SDKs you'll use Identity objects.
Identity defines set of properties:
* type - user | bot | pstn
* identity:
  * APP ID for a bot type
  * phone number for a pstn type
  * user identity in your system that is resolved asynchronously using ACS Mapping Service or via custom resolver

Identity interface:
```cs
interface IIdentity
    {
        IdentityType Type { get; }
        Task<string> Identity { get; }
    }
```

> akania Simplifying interface to type/Identity that is always resolved async - is it better? it's noop for pstn and bot since there's nothing to resolve, it makes sense only for a user

> akania Skipping custom properties that can be set only if contoso uses custom resolver - [check this PR](https://skype.visualstudio.com/SCC/_git/async_spool_core/pullrequest/350021)

> akania Would it be ok to have separate Identity classes for all the types, ie UserIdentity, PstnIdentity, BotIdentity?
For contoso, difference between creating a UserIdentity vs Identity(type: user) is negligible
When contoso is given an Identity from SDK,ie participants in roster represented by Identities - contoso still has to perform some checks to learn what type of identity it is dealing with, it can check type property, or check if object is an instace of.. - again small difference - using type property is better
Only real difference in semantics is for user type - when contoso want's to resolve identity to get userId from their system
Separate types for user|bot|pstn - can better represent real behavior - there's no async step to resolve pstn/bot but interfaces won't be aligned for all types.

> akania An alternative - if we don't want to have Identity type, all interfaces/types in ACS SDK would need to clearly define 'type' of entity, ie
```js
call({bots: [appid1, appid2...], users: ['bob', 'alice'...], pstn: ['+1123', '+2345'...]);
```
> and when represeting lists of participants
```js
call.participants.bots = [appid1, appid2...]
call.participants.users = .. // here's the trick we still need container for async resolution
call.participants.pstns = [+123,+234];
```
> I don't think this is cleaner.

## Create Identity instance
To create Identity object you have to use a IdentityMap provided by every client
Identity map accepts an identifier and a type of identity ( user | pstn | bot )

```javascript
const { ChatClient } = require('@azure/communicationservices-chat');
const client = new ChatClient(endpoint, userAccessToken);

const userIdentity = client.identityMap.fromIdentity('bob@contoso.com', IdentityType.User); 
const pstnIdentity = client.identityMap.fromIdentity('+14259871234', IdentityType.Pstn); 
const botIdentity = client.identityMap.fromIdentity('APP_ID', IdentityType.Bot); 
```

## Use Identity with ACS SDK
To interact with other entities in your system using ACS SDK you have to address them using Identity objects
```javascript
const { ChatClient } = require('@azure/communicationservices-chat');
const { CallClient } = require('@azure/communicationservices-calling');
// create client for alice@contoso.com
const chatClient = new ChatClient(endpoint, userAccessToken);
const callingClient = new CallClient(endpoint, userAccessToken);

// create Identity for bob@contoso.com
const bobIdentity = client.identityMap.fromIdentity('bob@contoso.com', IdentityType.User);

// send message from alice to bob
chatClient.send('message', /* to */ bobIdentity );

// alice starts call with bob
callingClient.call(/* callee */ [bobIdentity]);
```

## Identity resolution 
> akania

>> TODO Describe how we map contoso userIds on ACS side

>> TODO Describe how resolution works using ACS Mapping service

>> TODO Describe how resolution works using Contoso's mapping, how contoso can set custom resolver

>> If contoso chooses to - it doesn't have to resolve identity

>> [Custom properties & expiry date for Identities when contoso uses custom resolver](https://skype.visualstudio.com/SCC/_git/async_spool_core/pullrequest/350021)
