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

The `CommunicationUserIdentifier` interface represents a user identity that was created using the [Identity SDK or REST API](../../../quickstarts/identity/access-tokens.md). It's the only identifier used if your application doesn't use Microsoft Teams interoperability or Telephony features.


#### Basic usage

```javascript
// at some point you will have created a new user identity in your trusted service
const newUser = await identityClient.createUser();

// and then send newUser.communicationUserId down to your client application
// where you can again create an identifier for the user
const sameUser = { communicationUserId: newUserId };
```

#### API reference

[CommunicationUserIdentifier](/javascript/api/@azure/communication-common/communicationuseridentifier)

### Microsoft Teams user

The `MicrosoftTeamsUserIdentifier` interface represents a Teams user with its Azure AD user object ID. You can retrieve the Azure AD user object ID via the [Microsoft Graph REST API /users](/graph/api/user-get) endpoint from the `id` property in the response. For more information on how to work with Microsoft Graph, try the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer?request=users%2F%7Buser-mail%7D&method=GET&version=v1.0&GraphUrl=https://graph.microsoft.com) and look into the [Graph SDK](/graph/sdks/sdks-overview). Alternatively, you can find the ID as the `oid` claim in an [Azure AD ID token](../../../../active-directory/develop/id-token-claims-reference.md#payload-claims) or [Azure AD access token](../../../../active-directory/develop/access-token-claims-reference.md#payload-claims) after your user has signed in and acquired a token.

#### Basic usage

```javascript
// get the Teams user's ID from Graph APIs if only the email is known
const user = await graphClient.api("/users/bob@contoso.com").get();

// create an identifier
const teamsUser = { microsoftTeamsUserId: user.id };

// if you're not operating in the public cloud, you must also pass the right Cloud type.
const gcchTeamsUser = { microsoftTeamsUserId: userId, cloud: "gcch" };
```

#### API reference

[MicrosoftTeamsUserIdentifier](/javascript/api/@azure/communication-common/microsoftteamsuseridentifier)

### Phone number

The `PhoneNumberIdentifier` interface represents a phone number. The service assumes that phone numbers are formatted in E.164 format.

#### Basic usage

```javascript
// create an identifier
const phoneNumber = { phoneNumber: "+112345556789" };
```

#### API reference

[PhoneNumberIdentifier](/javascript/api/@azure/communication-common/phonenumberidentifier)

### Microsoft bot

> [!NOTE]
> The Microsoft Bot Identifier is currently in public preview. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The `MicrosoftTeamsAppIdentifier` interface represents a Microsoft bot with its Azure AD bot object ID. In the preview version the interface represents a bot of the Teams Voice applications such as Call Queue and Auto Attendant, and the application should be configured with a resource account. You can retrieve the Azure AD bot object ID via the [Microsoft Graph REST API /users](/graph/api/user-list) endpoint from the `id` property in the response. For more information on how to work with Microsoft Graph, try the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer?request=users%2F%7Buser-mail%7D&method=GET&version=v1.0&GraphUrl=https://graph.microsoft.com) and look into the [Graph SDK](/graph/sdks/sdks-overview).

#### Basic usage

```javascript
// Get the Microsoft bot's ID from Graph APIs
const users = await graphClient.api("/users")
                    .filter(filterConditions)
                    .select('displayName,id')
                    .get();
//Here we assume that you have a function getBotFromUsers that gets the bot from the returned response
const bot = getBotFromUsers(users);
// Create an identifier
const botIdentifier = { teamsAppId: bot.id };

// If you're not operating in the public cloud, you must also pass the right Cloud type.
// If you use Azure Bot Framework instead of Teams Voice applications, set property isResourceAccountConfigured to false.
const gcchBotIdentifier = { teamsAppId: id, cloud: "gcch" };
```

#### API reference

[MicrosoftBotIdentifier](/javascript/api/@azure/communication-common/microsoftbotidentifier?view=azure-node-preview&preserve-view=true)

### Unknown

The `UnknownIdentifier` interface exists for future-proofing and you might encounter it when you are on an old version of the SDK and a new identifier type has been introduced recently. Any unknown identifier from the service will be deserialized to the `UnknownIdentifier` in the SDK.

#### Basic usage

```javascript
// create an identifier
const unknownId = { id: "a raw id that originated in the service" };
```

#### API reference

[UnknownIdentifier](/javascript/api/@azure/communication-common/unknownidentifier)

### How to handle the `CommunicationIdentifier` base interface

While you construct identifiers for a concrete type that you pass *into* the SDK, the SDK returns a `CommunicationIdentifierKind`, which is a [discriminated union](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions). It's easy to narrow to a concrete type and we suggest a switch-case statement with pattern matching:

```javascript
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
    case "microsoftBot":
        // narrowed to MicrosoftBotIdentifier
        console.log(`Microsoft bot: ${communicationIdentifier.botId}`);
        break;
    default:
        // be careful here whether you want to throw because a new SDK version
        // can introduce new identifier types
        break;
}
```

The identifier interfaces have been designed so that you don't have to specify `kind` to reduce verbosity, and the discriminating union with the `kind` property is only used when returned from the SDK. However, if you find yourself needing to translate an identifier to its corresponding discriminating union type you can use this helper:

```javascript
const identifierKind = getIdentifierKind(identifier); // now you can switch-case on the kind
```

## Raw ID representation

Sometimes you need to serialize an identifier to a flat string. For example, if you want to store the identifier in a database table or if you'd like to use it as a URL parameter.

For that purpose, identifiers have another representation called `RawId`. An identifier can always be translated to its corresponding raw ID, and a valid raw ID can always be converted to an identifier.

Since `azure-communication-common@2.1.0` the SDK helps with the conversion:

```javascript
// get an identifier's raw Id
const rawId = getIdentifierRawId(communicationIdentifier);

// create an identifier from a given raw Id
const identifier = createIdentifierFromRawId(rawId);
```

An invalid raw ID will just convert to an `UnknownIdentifier` in the SDK and any validation only happens service-side.