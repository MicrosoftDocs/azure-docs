---
title: include file
description: include file
services: azure-communication-services
author: DominikMe
manager: RezaJooyandeh

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/24/2022
ms.topic: include
ms.custom: include file
ms.author: domessin
---

### Communication User identifier

The `CommunicationUserIdentifier` represents a user identity that was created using the [Identity SDK or REST API](../../../quickstarts/access-tokens.md). It's the only identifier used if your application doesn't use Microsoft Teams interop or PSTN features.


#### Basic usage

```swift
# at some point you will have created a new user identity in your trusted service
# and send the new user id down to your client application
# where you can create an identifier for the user
let user = CommunicationUserIdentifier(newUserId)
```

#### API reference

[CommunicationUserIdentifier](https://azure.github.io/azure-sdk-for-ios/AzureCommunicationCommon/Classes/CommunicationUserIdentifier.html)

### Microsoft Teams User identifier

The `MicrosoftTeamsUserIdentifier` represents a Teams user. You need to know the Teams user's Id that you can retrieve via the [Microsoft Graph REST API /users](/graph/api/user-get) endpoint.

#### Basic usage

```swift
# get the Teams user's Id if only the email is known, assuming a helper method
let userId = await getUserIdFromGraph("bob@contoso.com")

# create an identifier
let teamsUser = MicrosoftTeamsUserIdentifier(userId)

# if you're not operating in the public cloud, you must also pass the right Cloud type.
gcchTeamsUser = MicrosoftTeamsUserIdentifier(userId: userId, cloud: CommunicationCloudEnvironment.Gcch)
```

#### API reference

[MicrosoftTeamsUserIdentifier](https://azure.github.io/azure-sdk-for-ios/AzureCommunicationCommon/Classes/MicrosoftTeamsUserIdentifier.html)

### Phone Number identifier

The `PhoneNumberIdentifier` represents a phone number. The service assumes that phone numbers are formatted in E.164 format.

#### Basic usage

```swift
# create an identifier
let phoneNumber = PhoneNumberIdentifier("+112345556789")
```

#### API reference

[PhoneNumberIdentifier](https://azure.github.io/azure-sdk-for-ios/AzureCommunicationCommon/Classes/PhoneNumberIdentifier.html)

### Unknown identifier

The `UnknownIdentifier` exists for future-proofing and you might encounter it when you are on an old version of the SDK and a new identifier type has been introduced recently. Any unknown identifier from the service will be deserialized to the `UnknownIdentifier` in the SDK.

#### Basic usage

```swift
# create an identifier
let unknown = UnknownIdentifier("a raw id that originated in the service")
```

#### API reference

[UnknownIdentifier](https://azure.github.io/azure-sdk-for-ios/AzureCommunicationCommon/Classes/UnknownIdentifier.html)

### How to handle the `CommunicationIdentifier` base protocol

While you construct identifiers for a concrete type that you pass *into* the SDK, the SDK returns the `CommunicationIdentifier` protocol. It's easy to down-cast back to a concrete type and we suggest a switch-case statement with pattern matching:

```swift
match communication_identifier.kind:
    case CommunicationIdentifierKind.COMMUNICATION_USER:
        print(f"Communication user: {communication_identifier.properties['id']}")
    case CommunicationIdentifierKind.MICROSOFT_TEAMS_USER:
        print(f"Teams user: {communication_identifier.properties['user_id']}")
    case CommunicationIdentifierKind.PHONE_NUMBER:
        print(f"Phone number: {communication_identifier.properties['value']}")
    case CommunicationIdentifierKind.UNKNOWN:
        print(f"Unknown: {communication_identifier.raw_id}")
    case _:
        # be careful here whether you want to throw because a new SDK version
        # can introduce new identifier types
```

## RawId representation
