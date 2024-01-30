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

```python
# at some point you will have created a new user identity in your trusted service
new_user = identity_client.create_user()

# and then send new_user.properties['id'] down to your client application
# where you can again create an identifier for the user
same_user = CommunicationUserIdentifier(new_user_id)
```

#### API reference

[CommunicationUserIdentifier](/python/api/azure-communication-chat/azure.communication.chat.communicationuseridentifier)

### Microsoft Teams user

The `MicrosoftTeamsUserIdentifier` represents a Teams user with its Microsoft Entra user object ID. You can retrieve the Microsoft Entra user object ID via the [Microsoft Graph REST API /users](/graph/api/user-get) endpoint from the `id` property in the response. For more information on how to work with Microsoft Graph, try the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer?request=users%2F%7Buser-mail%7D&method=GET&version=v1.0&GraphUrl=https://graph.microsoft.com) and look into the [Graph SDK](/graph/sdks/sdks-overview). Alternatively, you can find the ID as the `oid` claim in an [Microsoft Entra token](../../../../active-directory/develop/id-token-claims-reference.md#payload-claims) or [Microsoft Entra access token](../../../../active-directory/develop/access-token-claims-reference.md#payload-claims) after your user has signed in and acquired a token.

#### Basic usage

```python
# get the Teams user's ID from Graph APIs if only the email is known
user_id = graph_client.get("/users/bob@contoso.com").json().get("id");

# create an identifier
teams_user = MicrosoftTeamsUserIdentifier(user_id)

# if you're not operating in the public cloud, you must also pass the right Cloud type.
gcch_teams_user = MicrosoftTeamsUserIdentifier(user_id, cloud=CommunicationCloudEnvironment.GCCH)
```

#### API reference

[MicrosoftTeamsUserIdentifier](/python/api/azure-communication-chat/azure.communication.chat.microsoftteamsuseridentifier)

### Phone number

The `PhoneNumberIdentifier` represents a phone number. The service assumes that phone numbers are formatted in E.164 format.

#### Basic usage

```python
# create an identifier
phone_number = PhoneNumberIdentifier("+112345556789")
```

#### API reference

[PhoneNumberIdentifier](/python/api/azure-communication-chat/azure.communication.chat.phonenumberidentifier)

### Microsoft bot

> [!NOTE]
> The Microsoft Bot Identifier is currently in public preview. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The `MicrosoftBotIdentifier` interface represents a Microsoft bot with its Microsoft Entra bot object ID. In the preview version the interface represents a bot of the Teams Voice applications such as Call Queue and Auto Attendant, and the application should be configured with a resource account. You can retrieve the Microsoft Entra bot object ID via the [Microsoft Graph REST API /users](/graph/api/user-list) endpoint from the `id` property in the response. For more information on how to work with Microsoft Graph, try the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer?request=users%2F%7Buser-mail%7D&method=GET&version=v1.0&GraphUrl=https://graph.microsoft.com) and look into the [Graph SDK](/graph/sdks/sdks-overview).

#### Basic usage

```python
# Get the Microsoft bot's ID from Graph APIs
users = graph_client.get("/users").json()

# Here we assume that you have a function get_bot_from_users that gets the bot from the returned response
bot = get_bot_from_users(users);

# Create an identifier
bot_identifier = MicrosoftBotIdentifier(bot_id=bot.get("id"))

# If you're not operating in the public cloud, you must also pass the right Cloud type.
# If you use Azure Bot Framework instead of Teams Voice applications, set property isResourceAccountConfigured to false.
gcch_bot_identifier = MicrosoftBotIdentifier(
            bot_id=bot.get("id"),
            is_resource_account_configured=True,
            cloud=CommunicationCloudEnvironment.GCCH
        )
```

#### API reference

[MicrosoftBotIdentifier](/python/api/azure-communication-identity/azure.communication.identity.microsoftbotidentifier?view=azure-python-preview&preserve-view=true)

### Unknown

The `UnknownIdentifier` exists for future-proofing and you might encounter it when you are on an old version of the SDK and a new identifier type has been introduced recently. Any unknown identifier from the service will be deserialized to the `UnknownIdentifier` in the SDK.

#### Basic usage

```python
# create an identifier
unknown = UnknownIdentifier("a raw id that originated in the service")
```

#### API reference

[UnknownIdentifier](/python/api/azure-communication-chat/azure.communication.chat.unknownidentifier)

### How to handle the `CommunicationIdentifier` base class

While you construct identifiers for a concrete type that you pass *into* the SDK, the SDK returns the `CommunicationIdentifier` protocol. Concrete identifier classes are just the CommunicationIdentifier protocol together with a typed dictionary called `properties`. So you can use pattern matching on the protocol's `kind` instance variable to translate to the concrete type:

```python
match communication_identifier.kind:
    case CommunicationIdentifierKind.COMMUNICATION_USER:
        print(f"Communication user: {communication_identifier.properties['id']}")
    case CommunicationIdentifierKind.MICROSOFT_TEAMS_USER:
        print(f"Teams user: {communication_identifier.properties['user_id']}")
    case CommunicationIdentifierKind.PHONE_NUMBER:
        print(f"Phone number: {communication_identifier.properties['value']}")
    case CommunicationIdentifierKind.MICROSOFT_BOT:
        print(f"Microsoft bot: {communication_identifier.properties['bot_id']}")
    case CommunicationIdentifierKind.UNKNOWN:
        print(f"Unknown: {communication_identifier.raw_id}")
    case _:
        # be careful here whether you want to throw because a new SDK version
        # can introduce new identifier types
```

## Raw ID representation

Sometimes you need to serialize an identifier to a flat string. For example, if you want to store the identifier in a database table or if you'd like to use it as a URL parameter.

For that purpose, identifiers have another representation called `RawId`. An identifier can always be translated to its corresponding raw ID, and a valid raw ID can always be converted to an identifier.

The SDK helps with the conversion:

```python
# get an identifier's raw Id
raw_id = communication_identifier.raw_id

# create an identifier from a given raw Id
identifier = identifier_from_raw_id(raw_id)
```

An invalid raw ID will just convert to an `UnknownIdentifier` in the SDK and any validation only happens service-side.
