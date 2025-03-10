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

### Communication user

The `CommunicationUserIdentifier` represents a user identity that was created using the [Identity SDK or REST API](../../../quickstarts/identity/access-tokens.md). It's the only identifier used if your application doesn't use Microsoft Teams interoperability or Telephony features.


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

### Microsoft Teams user

The `MicrosoftTeamsUserIdentifier` represents a Teams user with its Microsoft Entra user object ID. You can retrieve the Microsoft Entra user object ID via the [Microsoft Graph REST API /users](/graph/api/user-get) endpoint from the `id` property in the response. For more information on how to work with Microsoft Graph, try the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer?request=users%2F%7Buser-mail%7D&method=GET&version=v1.0&GraphUrl=https://graph.microsoft.com) and look into the [Graph SDK](/graph/sdks/sdks-overview). Alternatively, you can find the ID as the `oid` claim in an [Microsoft Entra token](/entra/identity-platform/id-token-claims-reference#payload-claims) or [Microsoft Entra access token](/entra/identity-platform/access-token-claims-reference#payload-claims) after your user has signed in and acquired a token.

#### Basic usage

```csharp
// get the Teams user's ID from Graph APIs if only the email is known
var user = await graphClient.Users["bob@contoso.com"]
    .Request()
    .GetAsync();

// create an identifier
var teamsUser = new MicrosoftTeamsUserIdentifier(user.Id);

// if you're not operating in the public cloud, you must also pass the right Cloud type.
var gcchTeamsUser = new MicrosoftTeamsUserIdentifier(userId: userId, cloud: CommunicationCloudEnvironment.Gcch);
```

#### API reference

[MicrosoftTeamsUserIdentifier](/dotnet/api/azure.communication.microsoftteamsuseridentifier)

### Phone number

The `PhoneNumberIdentifier` represents a phone number. The service assumes that phone numbers are formatted in E.164 format.

#### Basic usage

```csharp
// create an identifier
var phoneNumber = new PhoneNumberIdentifier("+112345556789");
```

#### API reference

[PhoneNumberIdentifier](/dotnet/api/azure.communication.phonenumberidentifier)

### Microsoft Teams Application

The `MicrosoftTeamsAppIdentifier` interface represents a bot of the Teams Voice applications such as Call Queue and Auto Attendant with its Microsoft Entra bot object ID. The Teams applications should be configured with a resource account. You can retrieve the Microsoft Entra bot object ID via the [Microsoft Graph REST API /users](/graph/api/user-list) endpoint from the `id` property in the response. For more information on how to work with Microsoft Graph, try the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer?request=users%2F%7Buser-mail%7D&method=GET&version=v1.0&GraphUrl=https://graph.microsoft.com) and look into the [Graph SDK](/graph/sdks/sdks-overview).

#### Basic usage

```csharp
// Get the Microsoft Teams App's ID from Graph APIs
var users = await graphClient.Users.GetAsync((requestConfiguration) =>
{
	requestConfiguration.QueryParameters.Select = new string []{ "displayName","id" };
	requestConfiguration.QueryParameters.Filter = filterConditions;
});

// Here we assume that you have a function GetBotFromUsers that gets the bot from the returned response
var bot = GetBotFromUsers(users);

// Create an identifier
var teamsAppIdentifier = new MicrosoftTeamsAppIdentifier(bot.Id);

// If you're not operating in the public cloud, you must also pass the right Cloud type.
var gcchTeamsAppIdentifier = new MicrosoftTeamsAppIdentifier(bot.Id, CommunicationCloudEnvironment.Gcch);
```

#### API reference

[MicrosoftTeamsAppIdentifier](/dotnet/api/azure.communication.microsoftteamsappidentifier)

### Unknown

The `UnknownIdentifier` exists for future-proofing and you might encounter it when you are on an old version of the SDK and a new identifier type has been introduced recently. Any unknown identifier from the service will be deserialized to the `UnknownIdentifier` in the SDK.

#### Basic usage

```csharp
// create an identifier
var unknown = new UnknownIdentifier("a raw id that originated in the service");
```

#### API reference

[UnknownIdentifier](/dotnet/api/azure.communication.unknownidentifier)

### How to handle the `CommunicationIdentifier` base class

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
    case MicrosoftTeamsAppIdentifier teamsApp:
        Console.WriteLine($"Teams app: {teamsApp.AppId}");
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

## Raw ID representation

Sometimes you need to serialize an identifier to a flat string. For example, if you want to store the identifier in a database table or if you'd like to use it as a URL parameter.

For that purpose, identifiers have another representation called `RawId`. An identifier can always be translated to its corresponding raw ID, and a valid raw ID can always be converted to an identifier.

Since `Azure.Communication.Common 1.2.0` the SDK helps with the conversion:

```csharp
// get an identifier's raw Id
string rawId = communicationIdentifier.RawId;

// create an identifier from a given raw Id
CommunicationIdentifier identifier = CommunicationIdentifier.FromRawId(rawId);
```

An invalid raw ID will just convert to an `UnknownIdentifier` in the SDK and any validation only happens service-side.
