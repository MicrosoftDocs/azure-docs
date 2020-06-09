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

Every entitiy in ACS world, a user, bot or pstn number is represented by special type.
Depending on the type, for:
* user, UserIdentity represents an object in ACS world that maps AcsID to a to an entity in your system
* pstn numbers, PhoneNumberIdentity represents an entity in ACS world that maps to a phone number.
* bot, BotIdentity represents an entity in ACS world that maps to a particular bot, identified by bot APP ID

When your application interacts with other entities in the ACS system through ACS client SDKs you'll use corresponding Identity objects.
Identity types defines set of properties:
* type - user | bot | pstn
* identity:
  * APP ID - representing id of a 1p or 3p bot provisioned through ACS
  * phone number
  * ACS ID - a GUID generated for a userId provided when user is created using ACS Management SDK

Identity interface:
```cs
public enum IdentityType
{
  User,
  Bot,
  Pstn
}
interface IIdentity
    {
        IdentityType Type { get; }
        string AcsId { get; }
    }
 interface IUserIdentity: IIdentity {}
 interface IBotIdentity: IIdentity {}
 interface IPstnIdentity: IIdentity {}

```

## Create Identity instance
To create Identity object you have to create an instance of one of the class for corresponding identity type:

```javascript
const { ChatClient, UserIdentity, BotIdentity, PstnIdentity } = require('@azure/communicationservices-chat');
const client = new ChatClient(endpoint, userAccessToken);

const userIdentity = new UserIdentity('acs_id_for_bob'); 
const pstnIdentity = new PstnIdentity('pstn_number_e_164'); 
const botIdentity = new BotIdentity('app_id'); 
```

## Use Identity with ACS SDK
To interact with other entities in your system using ACS SDK you have to address them using Identity objects
```javascript
const { ChatClient } = require('@azure/communicationservices-chat');
const { CallClient } = require('@azure/communicationservices-calling');
// create client for alice@contoso.com
const chatClient = new ChatClient(endpoint, userAccessToken);
const callingClient = new CallClient(endpoint, userAccessToken);

// create Identity for acs_id_for_bob which maps to bob@contoso.com
const bobIdentity = new UserIdentity('acs_id_for_bob'); 

// send message from alice to bob
chatClient.send('message', /* to */ bobIdentity );

const bobPhoneIdentity = new PstnIdentity('bob_phone_number_e_164'); 
// alice starts call with bob
callingClient.call([bobIdentity, bobPhoneIdentity]);
```

## Identity resolution 

