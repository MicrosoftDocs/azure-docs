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

In REST APIs the identifier is a polymorphic type: you construct a JSON object and a property that maps to a concrete identifier subtype. For convenience and backwards-compatibility reasons the `kind` and `rawId` properties are optional in requests but get populated in service responses.

### Communication User identifier

The `CommunicationUserIdentifierModel` represents a user identity that was created using the [Identity SDK or REST API](../../../quickstarts/access-tokens.md). It's the only identifier used if your application doesn't use Microsoft Teams interop or PSTN features.


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

#### API reference

[CommunicationUserIdentifierModel](https://github.com/Azure/azure-rest-api-specs/blob/c1883ee5b87c41dfcb699420409bc0e31cff0786/specification/communication/data-plane/Common/stable/2022-07-13/common.json#L113)

### Microsoft Teams User identifier

The `MicrosoftTeamsUserIdentifierModel` represents a Teams user. You need to know the Teams user's Id that you can retrieve via the [Microsoft Graph REST API /users](/graph/api/user-get) endpoint.

#### Basic usage

```json
// request
{
    "microsoftTeamsUser": {
        "userId": "daba101a-91c5-44c9-bb9b-e2a9a790571a"
    }
}

// response
{
    "kind": "microsoftTeamsUser",
    "rawId": "8:orgid:daba101a-91c5-44c9-bb9b-e2a9a790571a",
    "microsoftTeamsUser": {
        "userId": "daba101a-91c5-44c9-bb9b-e2a9a790571a"
    }
}


// if you're not operating in the public cloud, you must also pass the right Cloud type in a request
{
    "microsoftTeamsUser": {
        "userId": "daba101a-91c5-44c9-bb9b-e2a9a790571a",
        "cloud": "gcch"
    }
}

// response
{
    "kind": "microsoftTeamsUser",
    "rawId": "8:gcch:daba101a-91c5-44c9-bb9b-e2a9a790571a",
    "microsoftTeamsUser": {
        "userId": "daba101a-91c5-44c9-bb9b-e2a9a790571a",
        "isAnonymous": false,
        "cloud": "gcch"
    }
}
```

#### API reference

[MicrosoftTeamsUserIdentifierModel](https://github.com/Azure/azure-rest-api-specs/blob/c1883ee5b87c41dfcb699420409bc0e31cff0786/specification/communication/data-plane/Common/stable/2022-07-13/common.json#L139)

### Phone Number identifier

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
    "rawId": "4:112345556789",
    "phoneNumber": {
        "value": "+112345556789"
    }
}
```

#### API reference

[PhoneNumberIdentifierModel](https://github.com/Azure/azure-rest-api-specs/blob/c1883ee5b87c41dfcb699420409bc0e31cff0786/specification/communication/data-plane/Common/stable/2022-07-13/common.json#L126)

### Unknown identifier

If a new identifier got introduced in a service it will get downgraded to the `CommunicationIdentifierModel` if you are on an old API version.

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

On older API versions the `kind` property is missing and you have to check for the existence of the right subproperty:

```javascript
if (communicationIdentifier.communicationUser) {
    console.log(`Communication user: ${communicationIdentifier.communicationUser.id}`);
} else if (communicationIdentifier.microsoftTeamsUser) {
    console.log(`Teams user: ${communicationIdentifier.microsoftTeamsUser.userId}`);
} else if (communicationIdentifier.phoneNumber) {
    console.log(`Phone number: ${communicationIdentifier.phoneNumber.value}`);
} else {
    console.log(`Unknown: ${communicationIdentifier.rawId}`);
}
```

## RawId representation

Sometimes you need to serialize an identifier to a flat string. For example, if you want to store the identifier in a database table or if you'd like to use it as a url parameter.

For that purpose, identifiers have another representation called `RawId`. An identifier can always be translated to its corresponding raw Id, and a valid raw Id can always be converted to an identifier.

If you are using the Azure SDK it will help you with the conversion. Using the REST API directly, requires you to construct the raw id manually as follows.

| Identifier | Raw Id |
|---|---|
| <pre style="font-size: 14px">{<br/>    "communicationUser": {<br/>        "id": "8:acs:[resourceId]\_[userId]"<br/>    }<br/>}</pre> | `8:acs:[resourceId]\_[userId]` |
| <pre style="font-size: 14px">{<br/>    "phoneNumber": {<br/>         "value": "+1123455567"<br/>    }<br/>}</pre> | `4:+1123455567` |
| <pre style="font-size: 14px">{<br/>    "microsoftTeamsUser": {<br/>        "userId": "[aadUserId]"<br/>    }<br/>}</pre> | `8:orgid:[aadUserId]` |
| <pre style="font-size: 14px">{<br/>    "microsoftTeamsUser": {<br/>        "userId": "[visitorUserId]",<br/>        "isAnonymous": true<br/>    }<br/>}</pre> | `8:teamsvisitor:[visitorUserId]` |
| <pre style="font-size: 14px">{<br/>    "microsoftTeamsUser": {<br/>        "userId": "[aadUserId]",<br/>        "cloud": "gcch"<br/>    }<br/>}</pre> | `8:gcch:[aadUserId]` |

If a raw Id is invalid the service will fail the request.
