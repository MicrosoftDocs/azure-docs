---
title: include file
description: include file
services: azure-communication-services
author: DominikMe
manager: RezaJooyandeh

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/30/2022
ms.topic: include
ms.custom: include file
ms.author: domessin
---

### Communication User identifier

The `CommunicationUserIdentifier` represents a user identity that was created using the [Identity SDK or REST API](../../../quickstarts/access-tokens.md). It's the only identifier used if your application doesn't use Microsoft Teams interop or PSTN features.


#### Basic usage

```csharp
// at some point you will have created a new user identity in your trusted service
CommunicationUserIdentifier newUser = await identityClient.CreateUser();

// and then send newUser.Id down to your client application
// where you can again create an identifier for the user
var sameUser = new CommunicationUserIdentifier(newUserId);
```

#### API reference

[CommunicationUserIdentifier](/dotnet/api/azure.communication.communicationuseridentifier)

### Microsoft Teams User identifier

The `MicrosoftTeamsUserIdentifier` represents a Teams user. You need to know the Teams user's Id that you can retrieve via the [Microsoft Graph REST API /users](/graph/api/user-get) endpoint.

#### Basic usage

```csharp
// get the Teams user's Id if only the email is known, assuming a helper method
var userId = await GetUserIdFromGraph("bob@contoso.com");

// create an identifier
var teamsUser = new MicrosoftTeamsUserIdentifier(userId);

// if you're not operating in the public cloud, you must also pass the right Cloud type.
var gcchTeamsUser = new MicrosoftTeamsUserIdentifier(userId: userId, cloud: CommunicationCloudEnvironment.Gcch);
```

#### API reference

[MicrosoftTeamsUserIdentifier](/dotnet/api/azure.communication.microsoftteamsuseridentifier)

### Phone Number identifier

The `PhoneNumberIdentifier` represents a phone number. The service assumes that phone numbers are formatted in E.164 format.

#### Basic usage

```csharp
// create an identifier
var phoneNumber = new PhoneNumberIdentifier("+112345556789");
```

#### API reference

[PhoneNumberIdentifier](/dotnet/api/azure.communication.phonenumberidentifier)

### Unknown identifier

The `UnknownIdentifier` exists for future-proofing and you might encounter it when you are on an old version of the SDK and a new identifier type has been introduced recently. Any unknown identifier from the service will be deserialized to the `UnknownIdentifier` in the SDK.

#### Basic usage

```csharp
// create an identifier
var unknown = new UnknownIdentifier("a raw id that originated in the service");
```

#### API reference

[UnknownIdentifier](/dotnet/api/azure.communication.unknownidentifier)

### How to handle the `CommunicationIdentifier` base protocol

While you construct identifiers for a concrete type that you pass *into* the SDK, the SDK returns the `CommunicationIdentifier` protocol. It's easy to down-cast to a concrete type and we suggest a switch-case statement with pattern matching:

```csharp
switch (communicationIdentifier)
{
    case CommunicationUserIdentifier communicationUser:
        Console.WriteLine($"Communication user: {communicationUser.Id}");
        break;
    case MicrosoftTeamsUserIdentifier teamsUser:
        Console.WriteLine($"Teams user: {teamsUser.UserId}");
        break;
    case PhoneNumberIdentifier phoneNumber:
        Console.WriteLine($"Phone number: {phoneNumber.PhoneNumber}");
        break;
    case UnknownIdentifier unknown:
        Console.WriteLine($"Unknown: {unknown.Id}");
        break;
    default:
        // be careful here whether you want to throw because a new SDK version
        // can introduce new identifier types
        break;
}
```

## RawId representation

Sometimes you need to serialize an identifier to a flat string. For example, if you want to store the identifier in a database table or if you'd like to use it as a url parameter.

For that purpose, identifiers have another representation called `RawId`. An identifier can always be translated to its corresponding raw Id, and a valid raw Id can always be converted to an identifier.

Since `Azure.Communication.Common 1.2.0` the SDK helps with the conversion:

```c#
// get an identifier's raw Id
string rawId = communicationIdentifier.RawId;

// create an identifier from a given raw Id
CommunicationIdentifier identifier = CommunicationIdentifier.FromRawId(rawId);
```

An invalid raw Id will just convert to an `UnknownIdentifier` in the SDK and any validation only happens service-side.
