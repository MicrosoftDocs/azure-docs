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

The `CommunicationUserIdentifier` represents a user identity created using the [Identity SDK or REST API](../../../quickstarts/identity/access-tokens.md). It's the only identifier used if your application doesn't use Microsoft Teams interoperability or Telephony features.


#### Basic usage

```java
// at some point you will have created a new user identity in your trusted service
CommunicationUserIdentifier newUser = identityClient.CreateUser();

// and then send newUser.getId() down to your client application
// where you can again create an identifier for the user
var sameUser = new CommunicationUserIdentifier(newUserId);
```

#### API reference

[CommunicationUserIdentifier](/java/api/com.azure.communication.common.communicationuseridentifier)

### Microsoft Teams user

The `MicrosoftTeamsUserIdentifier` represents a Teams user with its Microsoft Entra user object ID. You can retrieve the Microsoft Entra user object ID via the [Microsoft Graph REST API /users](/graph/api/user-get) endpoint from the `id` property in the response. For more information about working with Microsoft Graph, see [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer?request=users%2F%7Buser-mail%7D&method=GET&version=v1.0&GraphUrl=https://graph.microsoft.com) and look into the [Graph SDK](/graph/sdks/sdks-overview). Alternatively, you can find the ID as the `oid` claim in an [Microsoft Entra token](/entra/identity-platform/id-token-claims-reference#payload-claims) or [Microsoft Entra access token](/entra/identity-platform/access-token-claims-reference#payload-claims) after your user signed in and acquired a token.

#### Basic usage

```java
// get the Teams user's ID from Graph APIs if only the email is known
var user = graphClient.users("bob@contoso.com")
    .buildRequest()
    .get();

// create an identifier
var teamsUser = new MicrosoftTeamsUserIdentifier(user.id);

// if you're not operating in the public cloud, you must also set the right Cloud type.
var gcchTeamsUser = new MicrosoftTeamsUserIdentifier(userId).setCloudEnvironment(CommunicationCloudEnvironment.GCCH);
```

#### API reference

[MicrosoftTeamsUserIdentifier](/java/api/com.azure.communication.common.microsoftteamsuseridentifier)

### Phone number

The `PhoneNumberIdentifier` represents a phone number. The service assumes that phone numbers are formatted in E.164 format.

#### Basic usage

```java
// create an identifier
var phoneNumber = new PhoneNumberIdentifier("+112345556789");
```

#### API reference

[PhoneNumberIdentifier](/java/api/com.azure.communication.common.phonenumberidentifier)

### Microsoft Teams Application

The `MicrosoftTeamsAppIdentifier` interface represents a bot of the Teams Voice applications such as Call Queue and Auto Attendant with its Microsoft Entra bot object ID. The Teams applications must be configured with a resource account. You can retrieve the Microsoft Entra bot object ID via the [Microsoft Graph REST API /users](/graph/api/user-list) endpoint from the `id` property in the response. For more information about working with Microsoft Graph, see [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer?request=users%2F%7Buser-mail%7D&method=GET&version=v1.0&GraphUrl=https://graph.microsoft.com) and look into the [Graph SDK](/graph/sdks/sdks-overview).

#### Basic usage

```java
// Get the Microsoft Teams App's ID from Graph APIs
var user = graphClient.users()
	.buildRequest()
	.filter(filterConditions)
	.select("displayName,id")
	.get();

//Here we assume that you have a function getBotFromUsers that gets the bot from the returned response
var bot = getBotFromUsers(users);

// Create an identifier
var teamsAppIdentifier = new MicrosoftTeamsAppIdentifier(bot.id);

// If you're not operating in the public cloud, you must also pass the right Cloud type.
var gcchTeamsAppIdentifier = new MicrosoftTeamsAppIdentifier(bot.id, CommunicationCloudEnvironment.GCCH);
```

#### API reference

[MicrosoftTeamsAppIdentifier](/java/api/com.azure.communication.common.microsoftteamsappidentifier)

### Teams Extension user

The `TeamsExtensionUserIdentifier` interface represents a Teams user enabled for Teams Phone Extensibility. A `TeamsExtensionUserIdentifier` requires the Microsoft Entra user object ID of the Teams user, the Microsoft Entra tenant ID where the user resides and the Azure Communication Services resource ID. You can retrieve the Microsoft Entra user object ID via the [Microsoft Graph REST API /users](/graph/api/user-get) endpoint from the `id` property in the response and the Microsoft Entra tenant ID via the [Microsoft Graph REST API /organization](/graph/api/organization-get) endpoint from the `id` property in the response. For more information about working with Microsoft Graph, see [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer?request=users%2F%7Buser-mail%7D&method=GET&version=v1.0&GraphUrl=https://graph.microsoft.com) and look into the [Graph SDK](/graph/sdks/sdks-overview). 
Alternatively, you can find the object ID as the `oid` claim and the tenant ID as the `tid` claim in an [Microsoft Entra token](/entra/identity-platform/id-token-claims-reference#payload-claims) or [Microsoft Entra access token](/entra/identity-platform/access-token-claims-reference#payload-claims) after your user signed in and acquired a token.

#### Basic usage

```java
// get the Teams user's ID from Graph APIs if only the email is known
var user = graphClient.users("bob@contoso.com")
    .buildRequest()
    .get();

// get the tenantId from Graph API
OrganizationCollectionPage organizations = graphClient.organization()
    .buildRequest()
    .get();
String tenantId = organizations.getCurrentPage().get(0).id;

// Communication Services Resource ID
var resourceId = "<resource-id-guid>";

// create an identifier
var teamsExtensionUser = new TeamsExtensionUserIdentifier(user.id, tenantId, resourceId);

// if you're not operating in the public cloud, you must also set the right Cloud type.
var gcchTeamsExtensionUser = new TeamsExtensionUserIdentifier(user.id, tenantId, resourceId).setCloudEnvironment(CommunicationCloudEnvironment.GCCH);
```

#### API reference

[TeamsExtensionUserIdentifier](/java/api/com.azure.communication.common.teamsextensionuseridentifier)

### Unknown

The `UnknownIdentifier` exists for future-proofing and you might encounter it when you are on an old version of the SDK and a new identifier type is recently introduced. Any unknown identifier from the service deserializes to `UnknownIdentifier` in the SDK.

#### Basic usage

```java
// create an identifier
var unknown = new UnknownIdentifier("a raw id that originated in the service");
```

#### API reference

[UnknownIdentifier](/java/api/com.azure.communication.common.unknownidentifier)

### How to handle the `CommunicationIdentifier` base class

While you construct identifiers for a concrete type that you pass *into* the SDK, the SDK returns the abstract `CommunicationIdentifier`. You can down-cast back to a concrete type:

```java
if (communicationIdentifier instanceof CommunicationUserIdentifier) {
    System.out.println("Communication user: " + ((CommunicationUserIdentifier)communicationIdentifier).getId());
}
else if (communicationIdentifier instanceof MicrosoftTeamsUserIdentifier) {
    System.out.println("Teams user: " + ((MicrosoftTeamsUserIdentifier)communicationIdentifier).getUserId());
}
else if (communicationIdentifier instanceof  MicrosoftTeamsAppIdentifier) {
    Log.i(tag, "Teams app: " + (( MicrosoftTeamsAppIdentifier)communicationIdentifier).getAppId());
}
else if (communicationIdentifier instanceof PhoneNumberIdentifier) {
    System.out.println("Phone number: " + ((PhoneNumberIdentifier)communicationIdentifier).getPhoneNumber());
}
else if (communicationIdentifier instanceof UnknownIdentifier) {
    System.out.println("Unknown user: " + ((UnknownIdentifier)communicationIdentifier).getId());
}
else {
    // be careful here whether you want to throw because a new SDK version
        // can introduce new identifier types
}
```

## Raw ID representation

Sometimes you need to serialize an identifier to a flat string. For example, if you want to store the identifier in a database table or if you want to use it as a URL parameter.

For that purpose, identifiers have another representation called `RawId`. An identifier can always be translated to its corresponding raw ID, and a valid raw ID can always be converted to an identifier.

Since `azure-communication-common 1.2.0` the SDK helps with the conversion:

```java
// get an identifier's raw Id
String rawId = communicationIdentifier.getRawId();

// create an identifier from a given raw Id
CommunicationIdentifier identifier = CommunicationIdentifier.fromRawId(rawId);
```

An invalid raw ID converts to `UnknownIdentifier` in the SDK and any validation only happens service-side.
