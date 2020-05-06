---
title: User Access Tokens
description: Learn how to manage users and authenticate them to ACS
author: mikben
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/18/2020
ms.topic: conceptual
ms.service: azure-project-spool

---
# User Access Tokens

Azure Communication Services retains its own directory of user entities which engage in ACS powered communication. User entities send SMS messages, engage chat threads, interact with real-time data, voice, and video communication.

ACS’s separate identity system is oriented towards flexibility and simplicity. While you may simply make communication identities mapping to existing entities in your Azure Active Directory deployment, you can also make communication identities for any abstract concept interfacing with the ACS dataplane. 


Example 1: Bob sends Sue a chat message directly
In this example an end-user device is going to directly send a chat message from a human, bob@contoso.com, to another human, sue@contoso.com. The steps are:

***Trusted Service***
1. Create a TokenCredential for an AAD service principal (webservice.contoso.com) to access the ACS control plane 
2. Create an ACS Communication Client with the Management capability
3. Create a TokenCredential.CommunicationCredential for bob@contoso.com 
4. Share this TokenCredential with Bob’s end-user device as a string

***Bob’s end-user device***
1. Create an ACS Communication Client with the Chat capability, using the string-encoded credential provided by the trusted service as an initialization parameter 
2.  Send a message to sue@contoso.com 

### Use this TokenCredential to create an ACS Communication Client with the Management capability
Trusted services can access ACS on behalf of a AAD service principal or managed identity. For more information see the authorization topic. For clarity of the mananagement samples on this page, below is example code for creating a management client from a trusted service:

```
CommunicationClient serviceClient = new CommunicationClient(
                new Capabilities().AddManagement(),
                new Uri("https://contoso.westus.acs.azure.net"),
          serviceToken); 
```

## Creating users
Communication identity only need to be provisioned once in the lifetime of the ACS deployment.
```
var identity = serviceClient.Management().CreateUser(“Bob@contoso.com”);
```
## Issuing user access tokens


### Create a TokenCredential for bob@contoso.com 
Using it’s management enabled communication client, the trusted service creates a TokenCredential.CommunicationCredential for the communication identity associated with Bob’s user principal name.
```
userToken = await serviceClient.Management().UserTokens.CreateTokensAsync(bob@contoso.com)
```
This will implicitly create an identity for bob@contoso.com if there is not an already created communication identity.

Communication identities are uniquely identified by their name, an application provided string that must be unique across the ACS deployment.  and their type: human, bot, phone number, etc.  Attempting to create an identity that already exists returns an IdentityAlreadyExists exception.

A common pattern is using user principal names (UPN) as the identifying name. For example you may have an end-user application that uses Microsoft Graph APIs to identify interesting communication endpoints and leverage UPNs as a common currency across these systems with guaranteed uniqueness. 

### Share this TokenCredential with Bob’s end-user device
ACS communication identity token credentials can be JSON encoded for transmission between the trusted service generating them and the end-user device using them. 

ACS communication identity tokens typically have a lifetime of 12 hours. They can be refreshed directly by the end-user device, this means that the end-user device does not need to re-request a token from the trusted service intermediary in typical expiration scenarios. 

```string bobEncodedToken = userToken.GetToken();```

## Using user access tokens for communication 

### Use this TokenCredential to create an ACS Communication Client with the Chat capability
Bob creates a token credential object using the string they obtained from the trusted service. They use this token to create a Chat enabled communication client.
```var client = new CommunicationClient(
                new Capabilities().AddChat(),
                new Uri("https://contoso.westus.acs.azure.net"),
                bobEncodedToken);
```

#### Send a message to sue@contoso.com 
We need a source identity for Bob and target endpoint for Sue, this is trivial using their unique communication identity names, which are UPNs in this example. Using that target endpoint we send a message from Bob’s CommunicationClient. 
```
var message = await client.ServiceChat().SendMessage(“Hi Sue.”, 
                 new Azure.Communication.Identity(“bob@contoso.com”),
                 new Azure.Communication.Identity(“sue@contoso.com”)
);
```

It is possible with ACS for a communication identity to communicate on behalf of another user, a typical scenario being business administrators. In these situations there is little change to the above example.


## User access token scopes
## Access token life cycle (AKA refreshing access tokens)
## Revoking users access tokens
## Impersonating users
***Trusted service sends Sue a chat message on behalf of Bob***
In this example the trusted service directly sends Sue a chat message on behalf of Bob, without any interaction from an end-user device.

```
var serviceToken =  DefaultAzureCredential();

CommunicationClient serviceClient = new CommunicationClient(
                new Capabilities().AddChat(),
                new Uri("https://contoso.westus.acs.azure.net"),
          serviceToken);

var message = await client.ServiceChat().SendMessage(“Hi Sue.”,
                 new Azure.Communication.Identity(“bob@contoso.com”),
                 new Azure.Communication.Identity(“sue@contoso.com”)
);
```

 
