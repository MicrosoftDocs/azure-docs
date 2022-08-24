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

The `CommunicationUserIdentifier` interface represents a user identity that was created using the [Identity SDK or REST API](../quickstarts/access-tokens.md). It is the only identifier used if your  application doesn't use Microsoft Teams interop or PSTN features.


#### Basic usage

```typescript
// at some point you will have created a new user identity in your trusted service
const newUser = await identityClient.createUser();

// and then send newUser.communicationUserId down to your client application
// where you can again create an identifier for the user
const sameUser = { communicationUserId: newUserId };
```

#### API reference

[CommunicationUserIdentifier](/javascript/api/@azure/communication-common/communicationuseridentifier?view=azure-node-latest)

### Microsoft Teams User identifier

The `MicrosoftTeamsUserIdentifier` interface represents a Teams user. You need to know the Teams user's Id that you can retrieve via the [Microsoft Graph REST API /users](/graph/api/user-get?view=graph-rest-1.0&tabs=http) endpoint.

#### Basic usage

```typescript
// get the Team's users Id if only the email is known, assuming a helper method
var userId = await getUserIdFromGraph("bob@contoso.com");

// create an identifier
var teamsUser = { microsoftTeamsUserId: userId };

// if you're not operating in the public cloud, you must also pass the right Cloud type.
var gcchTeamsUser = { microsoftTeamsUserId: userId, cloud: "gcch" };
```

#### API reference

[MicrosoftTeamsUserIdentifier](/javascript/api/@azure/communication-common/microsoftteamsuseridentifier?view=azure-node-latest)

### Phone Number identifier

The `PhoneNumberIdentifier` interface represents a phone number. The service assumes that phone numbers are formatted in E.164 format.

#### Basic usage

```typescript
// create an identifier
var phoneNumber = { phoneNumber: "+112345556789" };
```

#### API reference

[PhoneNumberIdentifier](/javascript/api/@azure/communication-common/phonenumberidentifier?view=azure-node-latest)

### Unknown identifier

The `UnknownIdentifier` interface exists for future-proofing and you might encounter it when you are on an old version of the SDK and a new identifier type has been introduced recently. Any unknown identifier from the service will be deserialized to the `UnknownIdentifier` in the SDK.

#### Basic usage

```typescript
// create an identifier
var unknown = { id: "a raw id that originated in the service" };
```

#### API reference

[UnknownIdentifier](/javascript/api/@azure/communication-common/unknownidentifier?view=azure-node-latest)

### How to handle the `CommunicationIdentifier` base class

While you construct identifiers for a concrete type that you pass *into* the SDK, the SDK returns a `CommunicationIdentifierKind`, which is a [discrimated union](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions). It's easy to narrow to a concrete type and we suggest a switch-case statement with pattern matching:

```typescript
switch (communicationIdentifier.kind)
{
    case "communicationUser":
        // TypeScript has narrowed communicationIdentifier to be a CommunicationUserKind
        console.log(`Communication user: ${communicationIdentifier.communicationUserId}`);
        break;
    case "microsoftTeamsUser":
        // narrowed to MicrosoftTeamsUserKind
        console.log(`Teams user: ${communicationIdentifier.microsoftTeamsUserId}`);
        break;
    case "phoneNumber":
         // narrowed to PhoneNumberKind
        console.log(`Phone number: ${communicationIdentifier.phoneNumber}`);
        break;
    case "unknown":
         // narrowed to UnknownIdentifierKind
        console.log(`Unknown: ${communicationIdentifier.id}`);
        break;
    default;
        // be careful here whether you want to throw because a new SDK version can introduce new identfier types
        break;
}
```

The identifier interfaces have been designed so that you don't have to specify `kind` to reduce verbosity, and the discriminating union with the `kind` property is only used when returned from the SDK. However, if you find yourself needing to translate an identifier to its corresponding discriminating union type you can use this helper:

```typescript
const identifierKind = getIdentifierKind(identifier); // now you can switch-case on the kind
```

## RawId representation


