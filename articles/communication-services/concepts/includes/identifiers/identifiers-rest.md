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

In REST APIs, the identifier is a polymorphic type: you construct a JSON object and a property that maps to a concrete identifier subtype. For convenience and backwards-compatibility reasons, the `kind` and `rawId` properties are optional in requests but get populated in service responses.

### Communication user

The `CommunicationUserIdentifierModel` represents a user identity that was created using the [Identity SDK or REST API](../../../quickstarts/identity/access-tokens.md). It's the only identifier used if your application doesn't use Microsoft Teams interoperability or Telephony features.


#### Basic usage

```json

// at some point you will have created a new user identity in your trusted service
// you can specify an identifier with the id of the new user in a request
{
    "communicationUser": {
        "id": "8:acs:8540c0de-899f-5cce-acb5-3ec493af3800_c94ff260-162d-46d6-94fd-e79f4d213715"
    }
}

// the corresponding serialization in a response
{
    "kind": "communicationUser",
    "rawId": "8:acs:8540c0de-899f-5cce-acb5-3ec493af3800_c94ff260-162d-46d6-94fd-e79f4d213715",
    "communicationUser": {
        "id": "8:acs:8540c0de-899f-5cce-acb5-3ec493af3800_c94ff260-162d-46d6-94fd-e79f4d213715"
    }
}
```

You can find an example for a request that includes an identifier in Chat's REST API for [adding a participant](/rest/api/communication/chat/chat-thread/add-chat-participants?tabs=HTTP#chatparticipant), and an example for a response with an identifier under [get chat message](/rest/api/communication/chat/chat-thread/get-chat-message?tabs=HTTP#chatmessage).

#### API reference

[CommunicationUserIdentifierModel](https://github.com/Azure/azure-rest-api-specs/blob/c1883ee5b87c41dfcb699420409bc0e31cff0786/specification/communication/data-plane/Common/stable/2022-07-13/common.json#L113)

### Microsoft Teams user

The `MicrosoftTeamsUserIdentifierModel` represents a Teams user with its Microsoft Entra user object ID. You can retrieve the Microsoft Entra user object ID via the [Microsoft Graph REST API /users](/graph/api/user-get) endpoint from the `id` property in the response. For more information on how to work with Microsoft Graph, try the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer?request=users%2F%7Buser-mail%7D&method=GET&version=v1.0&GraphUrl=https://graph.microsoft.com) and look into the [Graph SDK](/graph/sdks/sdks-overview). Alternatively, you can find the ID as the `oid` claim in an [Microsoft Entra token](/entra/identity-platform/id-token-claims-reference#payload-claims) or [Microsoft Entra access token](/entra/identity-platform/access-token-claims-reference#payload-claims) after your user has signed in and acquired a token.

#### Basic usage

```json
// request
{
    "microsoftTeamsUser": {
        "userId": "00aa00aa-bb11-cc22-dd33-44ee44ee44ee"
    }
}

// response
{
    "kind": "microsoftTeamsUser",
    "rawId": "8:orgid:00aa00aa-bb11-cc22-dd33-44ee44ee44ee",
    "microsoftTeamsUser": {
        "userId": "00aa00aa-bb11-cc22-dd33-44ee44ee44ee"
    }
}


// if you're not operating in the public cloud, you must also pass the right Cloud type in a request
{
    "microsoftTeamsUser": {
        "userId": "00aa00aa-bb11-cc22-dd33-44ee44ee44ee",
        "cloud": "gcch"
    }
}

// response
{
    "kind": "microsoftTeamsUser",
    "rawId": "8:gcch:00aa00aa-bb11-cc22-dd33-44ee44ee44ee",
    "microsoftTeamsUser": {
        "userId": "00aa00aa-bb11-cc22-dd33-44ee44ee44ee",
        "isAnonymous": false,
        "cloud": "gcch"
    }
}
```

#### API reference

[MicrosoftTeamsUserIdentifierModel](https://github.com/Azure/azure-rest-api-specs/blob/c1883ee5b87c41dfcb699420409bc0e31cff0786/specification/communication/data-plane/Common/stable/2022-07-13/common.json#L139)

### Phone number

The `PhoneNumberIdentifierModel` represents a phone number. The service assumes that phone numbers are formatted in E.164 format.

#### Basic usage

```json
// request
{
    "phoneNumber": {
        "value": "+112345556789"
    }
}

// response
{
    "kind": "phoneNumber",
    "rawId": "4:+112345556789",
    "phoneNumber": {
        "value": "+112345556789"
    }
}
```

#### API reference

[PhoneNumberIdentifierModel](https://github.com/Azure/azure-rest-api-specs/blob/c1883ee5b87c41dfcb699420409bc0e31cff0786/specification/communication/data-plane/Common/stable/2022-07-13/common.json#L126)

### Microsoft Teams Application

The `MicrosoftTeamsAppIdentifierModel` represents a bot of the Teams Voice applications such as Call Queue and Auto Attendant with its Microsoft Entra bot object ID. The Teams applications should be configured with a resource account. You can retrieve the Microsoft Entra bot object ID via the [Microsoft Graph REST API /users](/graph/api/user-list) endpoint from the `id` property in the response. For more information on how to work with Microsoft Graph, try the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer?request=users%2F%7Buser-mail%7D&method=GET&version=v1.0&GraphUrl=https://graph.microsoft.com) and look into the [Graph SDK](/graph/sdks/sdks-overview).

#### Basic usage

```json
// request
{
    "microsoftTeamsApp": {
        "appId": "00001111-aaaa-2222-bbbb-3333cccc4444"
    }
}

// response
{
    "kind": "microsoftTeamsApp",
    "rawId": "28:orgid:00001111-aaaa-2222-bbbb-3333cccc4444",
    "microsoftTeamsApp": {
        "appId": "00001111-aaaa-2222-bbbb-3333cccc4444"
    }
}


// if you're not operating in the public cloud, you must also pass the right Cloud type in a request
{
    "microsoftTeamsApp": {
        "appId": "00001111-aaaa-2222-bbbb-3333cccc4444",
        "cloud": "gcch"
    }
}

// response
{
    "kind": "microsoftTeamsApp",
    "rawId": "28:gcch:00001111-aaaa-2222-bbbb-3333cccc4444",
    "microsoftTeamsApp": {
        "appId": "00001111-aaaa-2222-bbbb-3333cccc4444",
        "cloud": "gcch"
    }
}
```

#### API reference

[MicrosoftTeamsAppIdentifierModel](https://github.com/Azure/azure-rest-api-specs/blob/ea28180c6ce9027df36568307f235868d581144c/specification/communication/data-plane/Common/stable/2023-11-15/common.json#L165C6-L165C38)

### Unknown

If a new identifier gets introduced in a service, it will get downgraded to the `CommunicationIdentifierModel` if you are on an old API version.

#### Basic usage

```json
// request
{
    "rawId": "a raw id that originated in the service"
}

// response
{
    "kind": "unknown",
    "rawId": "a raw id that originated in the service"
}
```

#### API reference

[CommunicationIdentifierModel](https://github.com/Azure/azure-rest-api-specs/blob/c1883ee5b87c41dfcb699420409bc0e31cff0786/specification/communication/data-plane/Common/stable/2022-07-13/common.json#L87)

### How to handle the `CommunicationIdentifierModel` in responses

Recent API versions populate a `kind` property that you can use to discriminate on:

```javascript
switch (communicationIdentifier.kind)
{
    case "communicationUser":
        console.log(`Communication user: ${communicationIdentifier.communicationUser.id}`);
        break;
    case "microsoftTeamsUser":
        console.log(`Teams user: ${communicationIdentifier.microsoftTeamsUser.userId}`);
        break;
    case "microsoftTeamsApp":
        console.log(`Teams user: ${communicationIdentifier.microsoftTeamsApp.appId}`);
        break;
    case "phoneNumber":
        console.log(`Phone number: ${communicationIdentifier.phoneNumber.value}`);
        break;
    case "unknown":
        console.log(`Unknown: ${communicationIdentifier.rawId}`);
        break;
    default:
        // this case should not be hit because adding a new identifier type requires a new API version
        // if it does get hit, please file an issue on https://github.com/Azure/azure-rest-api-specs/issues 
        break;
}
```

On older API versions, the `kind` property is missing and you have to check for the existence of the right subproperty:

```javascript
if (communicationIdentifier.communicationUser) {
    console.log(`Communication user: ${communicationIdentifier.communicationUser.id}`);
} else if (communicationIdentifier.microsoftTeamsUser) {
    console.log(`Teams user: ${communicationIdentifier.microsoftTeamsUser.userId}`);
} else if (communicationIdentifier.microsoftTeamsApp) {
    console.log(`Teams app: ${communicationIdentifier.microsoftTeamsApp.appId}`);
} else if (communicationIdentifier.phoneNumber) {
    console.log(`Phone number: ${communicationIdentifier.phoneNumber.value}`);
} else {
    console.log(`Unknown: ${communicationIdentifier.rawId}`);
}
```

## Raw ID representation

Sometimes you need to serialize an identifier to a flat string. For example, if you want to store the identifier in a database table or if you'd like to use it as a URL parameter.

For that purpose, identifiers have another representation called `RawId`. An identifier can always be translated to its corresponding raw ID, and a valid raw ID can always be converted to an identifier.

If you're using the Azure SDK, it will help you with the conversion. If you use the REST API directly, you need to construct the raw ID manually as described below.

### Communication user

*Identifier:*
```json
{
    "communicationUser": {
        "id": "[communicationUserId]"
    }
}
```
*Raw ID:*

`[communicationUserId]`

The raw ID is the same as `communicationUser.id`.

### Microsoft Teams user

*Identifier:*
```json
{
    "microsoftTeamsUser": {
        "userId": "[entraUserId]"
    }
}
```
*Raw ID:*

`8:orgid:[entraUserId]`

The raw ID is the Microsoft Entra user object ID prefixed with `8:orgid:`.

*Identifier:*
```json
{
    "microsoftTeamsUser": {
        "userId": "[entraUserId]",
        "cloud": "gcch"
    }
}
```
*Raw ID:*

`8:gcch:[entraUserId]`

The raw ID is the Microsoft Entra user object ID prefixed with `8:gcch:` or `8:dod:` depending on the cloud environment.

*Identifier:*
```json
{
    "microsoftTeamsUser": {
        "userId": "[visitorUserId]",
        "isAnonymous": true
    }
}
```
*Raw ID:* 

`8:teamsvisitor:[visitorUserId]`

The raw ID is the Teams visitor ID prefixed with `8:teamsvisitor:`. The Teams visitor ID is a temporary ID that Teams generates to enable meeting access.

### Phone number

*Identifier:*
```json
{
    "phoneNumber": {
        "value": "+1123455567"
    }
}
```
*Raw ID:*

`4:+1123455567`

The raw ID is the E.164 formatted phone number prefixed with `4:`.

### Microsoft Teams app

*Identifier:*
```json
{
    "microsoftTeamsApp": {
        "appId": "[entraUserId]"
    }
}
```
*Raw ID:*

`28:orgid:[entraUserId]`

The raw ID is the application's Entra user object ID prefixed with `28:orgid:`.

*Identifier:*
```json
{
    "microsoftTeamsUser": {
        "userId": "[entraUserId]",
        "cloud": "gcch"
    }
}
```
*Raw ID:*

`28:gcch:[entraUserId]`

The raw ID is the application's Entra user object ID prefixed with `28:gcch:` or `28:dod:` depending on the cloud environment.

### Unknown

*Identifier:*
```json
{
    "rawId": "[unknown identifier id]"
}
```
*Raw ID:*

`[unknown identifier id]`


If a raw ID is invalid, the service will fail the request.
