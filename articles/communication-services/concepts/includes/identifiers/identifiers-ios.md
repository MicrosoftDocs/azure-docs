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

```swift
// at some point you will have created a new user identity in your trusted service
// and send the new user id down to your client application
// where you can create an identifier for the user
let user = CommunicationUserIdentifier(newUserId)
```

#### API reference

[CommunicationUserIdentifier](https://azure.github.io/azure-sdk-for-ios/AzureCommunicationCommon/Classes/CommunicationUserIdentifier.html)

### Microsoft Teams user

The `MicrosoftTeamsUserIdentifier` represents a Teams user with its Microsoft Entra user object ID. You can retrieve the Microsoft Entra user object ID via the [Microsoft Graph REST API /users](/graph/api/user-get) endpoint from the `id` property in the response. For more information on how to work with Microsoft Graph, try the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer?request=users%2F%7Buser-mail%7D&method=GET&version=v1.0&GraphUrl=https://graph.microsoft.com) and look into the [Graph SDK](/graph/sdks/sdks-overview). Alternatively, you can find the ID as the `oid` claim in an [ID token](/entra/identity-platform/id-token-claims-reference#payload-claims) or [Microsoft Entra access token](/entra/identity-platform/access-token-claims-reference#payload-claims) after your user has signed in and acquired a token.

#### Basic usage

```swift
// get the Teams user's ID if only the email is known, assuming a helper method for the Graph API
let userId = await getUserIdFromGraph("bob@contoso.com")

// create an identifier
let teamsUser = MicrosoftTeamsUserIdentifier(userId: userId)

// if you're not operating in the public cloud, you must also pass the right Cloud type.
let gcchTeamsUser = MicrosoftTeamsUserIdentifier(userId: userId, cloud: CommunicationCloudEnvironment.Gcch)
```

#### API reference

[MicrosoftTeamsUserIdentifier](https://azure.github.io/azure-sdk-for-ios/AzureCommunicationCommon/Classes/MicrosoftTeamsUserIdentifier.html)

### Phone number

The `PhoneNumberIdentifier` represents a phone number. The service assumes that phone numbers are formatted in E.164 format.

#### Basic usage

```swift
// create an identifier
let phoneNumber = PhoneNumberIdentifier(phoneNumber: "+112345556789")
```

#### API reference

[PhoneNumberIdentifier](https://azure.github.io/azure-sdk-for-ios/AzureCommunicationCommon/Classes/PhoneNumberIdentifier.html)

### Microsoft Teams Application

The `MicrosoftTeamsAppIdentifier` interface represents a bot of the Teams Voice applications such as Call Queue and Auto Attendant with its Microsoft Entra bot object ID. The Teams applications should be configured with a resource account. You can retrieve the Microsoft Entra bot object ID via the [Microsoft Graph REST API /users](/graph/api/user-list) endpoint from the `id` property in the response. For more information on how to work with Microsoft Graph, try the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer?request=users%2F%7Buser-mail%7D&method=GET&version=v1.0&GraphUrl=https://graph.microsoft.com) and look into the [Graph SDK](/graph/sdks/sdks-overview).
#### Basic usage

```swift
// Get the Microsoft Teams App's ID from Graph APIs, assuming a helper method for the Graph API
let botId = await getBotIdFromGraph()

// Create an identifier
let teamsAppIdentifier = MicrosoftTeamsAppIdentifier(appId: botId)

// If you're not operating in the public cloud, you must also pass the right Cloud type.
let gcchTeamsAppIdentifier = MicrosoftTeamsAppIdentifier(appId: botId, cloudEnvironment: CommunicationCloudEnvironment.Gcch)
```

#### API reference

[MicrosoftTeamsAppIdentifier](https://azure.github.io/azure-sdk-for-ios/AzureCommunicationCommon/Classes/MicrosoftTeamsAppIdentifier.html)

### Unknown

The `UnknownIdentifier` exists for future-proofing and you might encounter it when you are on an old version of the SDK and a new identifier type has been introduced recently. Any unknown identifier from the service will be deserialized to the `UnknownIdentifier` in the SDK.

#### Basic usage

```swift
// create an identifier
let unknown = UnknownIdentifier("a raw id that originated in the service")
```

#### API reference

[UnknownIdentifier](https://azure.github.io/azure-sdk-for-ios/AzureCommunicationCommon/Classes/UnknownIdentifier.html)

### How to handle the `CommunicationIdentifier` base protocol

While you construct identifiers for a concrete type that you pass *into* the SDK, the SDK returns the `CommunicationIdentifier` protocol. It's easy to down-cast back to a concrete type and we suggest a switch-case statement with pattern matching:

```swift
switch (communicationIdentifier)
{
    case let communicationUser as CommunicationUserIdentifier:
        print(#"Communication user: \(communicationUser.id)"#)
    case let teamsUser as MicrosoftTeamsUserIdentifier:
        print(#"Teams user: \(teamsUser.UserId)"#)
    case let teamsApp as MicrosoftTeamsAppIdentifier:
        print(#"Teams app: \(teamsApp.appId)"#)
    case let phoneNumber as PhoneNumberIdentifier:
        print(#"Phone number: \(phoneNumber.PhoneNumber)"#)
    case let unknown as UnknownIdentifier:
        print(#"Unknown: \(unknown.Id)"#)
    @unknown default:
        // be careful here whether you want to throw because a new SDK version
        // can introduce new identifier types
        break;
}
```

## Raw ID representation

Sometimes you need to serialize an identifier to a flat string. For example, if you want to store the identifier in a database table or if you'd like to use it as a URL parameter.

For that purpose, identifiers have another representation called `RawId`. An identifier can always be translated to its corresponding raw ID, and a valid raw ID can always be converted to an identifier.

Since `Azure.Communication.Common 1.1.0` the SDK helps with the conversion:

*Swift*
```swift
// get an identifier's raw Id
let rawId = communicationIdentifier.rawId;

// create an identifier from a given raw Id
let identifier = createCommunicationIdentifier(fromRawId: rawId);
```

An invalid raw ID will just convert to an `UnknownIdentifier` in the SDK and any validation only happens service-side.
