---
title: include file
description: include file
services: azure-communication-services
author: domessin
manager: rejooyan

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/24/2022
ms.topic: include
ms.custom: include file
ms.author: domessin
---

### Communication User identifier

The `CommunicationUserIdentifier` represents a user identity that was created using the [Identity SDK or REST API](../quickstarts/access-tokens.md). It is the only identifier used if your  application doesn't use Microsoft Teams interop or PSTN features.


#### Basic usage

```csharp
// at some point you will have created a new user identity in your trusted service
CommunicationUserIdentifier newUser = await identityClient.CreateUser();

// and then send newUser.Id down to your client application
// where you can again create an identifier for the user
var sameUser = new CommunicationUserIdentifier(newUserId);
```

#### API reference

[CommunicationUserIdentifier](https://docs.microsoft.com/dotnet/api/azure.communication.communicationuseridentifier?view=azure-dotnet)

### Microsoft Teams User identifier

The `MicrosoftTeamsUserIdentifier` represents a Teams user. You need to know the Teams user's Id that you can retrieve via the [Microsoft Graph REST API /users](https://docs.microsoft.com/en-us/graph/api/user-get?view=graph-rest-1.0&tabs=http) endpoint.

#### Basic usage

```csharp
// get the Team's users Id if only the email is known, assuming a helper method
var userId = await GetUserIdFromGraph("bob@contoso.com");

// create an identifier
var teamsUser = new MicrosoftTeamsUserIdentifier(userId);

// if you're not operating in the public cloud, you must also pass the right Cloud type.
var gcchTeamsUser = new MicrosoftTeamsUserIdentifier(userId: userId, cloud: CommunicationCloudEnvironment.Gcch);
```

#### API reference

[MicrosoftTeamsUserIdentifier](https://docs.microsoft.com/dotnet/api/azure.communication.microsoftteamsuseridentifier?view=azure-dotnet)

### Phone Number identifier

The `PhoneNumberIdentifier` represents a phone number. The service assumes that phone numbers are formatted in E.164 format.

#### Basic usage

```csharp
// create an identifier
var phoneNumber = new PhoneNumberIdentifier("+112345556789");
```

#### API reference

[PhoneNumberIdentifier](https://docs.microsoft.com/dotnet/api/azure.communication.phonenumberidentifier?view=azure-dotnet)

### Unknown identifier

The `UnknownIdentifier` exists for future-proofing and you might encounter it when you are on an old version of the SDK and a new identifier type has been introduced recently. Any unknown identifier from the service will be deserialized to the `UnknownIdentifier` in the SDK.

#### Basic usage

```csharp
// create an identifier
var unknown = new UnknownIdentifier("a raw id that originated in the service");
```

#### API reference

[UnknownIdentifier](https://docs.microsoft.com/dotnet/api/azure.communication.unknownidentifier?view=azure-dotnet)

### How to handle the `CommunicationIdentifier` base class

While you construct identifiers for a concrete type that you pass *into* the SDK, the SDK returns the abstract `CommunicationIdentifier`. It's easy to down-cast back to a concrete type and we suggest a switch-case statement with pattern matching:

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
    default;
        // be careful here whether you want to throw because a new SDK version can introduce new identfier types
        break;
}
```

## RawId representation

- 1:1 translation from/to identifier
- useful for db serialization, keys in dictionaries, url query params
- how to construct per type
