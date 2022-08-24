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

```java
// at some point you will have created a new user identity in your trusted service
CommunicationUserIdentifier newUser = identityClient.CreateUser();

// and then send newUser.getId() down to your client application
// where you can again create an identifier for the user
var sameUser = new CommunicationUserIdentifier(newUserId);
```

#### API reference

[CommunicationUserIdentifier](https://docs.microsoft.com/java/api/com.azure.communication.common.communicationuseridentifier?view=azure-java-stable)

### Microsoft Teams User identifier

The `MicrosoftTeamsUserIdentifier` represents a Teams user. You need to know the Teams user's Id that you can retrieve via the [Microsoft Graph REST API /users](https://docs.microsoft.com/graph/api/user-get?view=graph-rest-1.0&tabs=http) endpoint.

#### Basic usage

```java
// get the Team's users Id if only the email is known, assuming a helper method
var userId = getUserIdFromGraph("bob@contoso.com");

// create an identifier
var teamsUser = new MicrosoftTeamsUserIdentifier(userId);

// if you're not operating in the public cloud, you must also set the right Cloud type.
var gcchTeamsUser = new MicrosoftTeamsUserIdentifier(userId).setCloudEnvironment(CommunicationCloudEnvironment.GCCH);
```

#### API reference

[MicrosoftTeamsUserIdentifier](https://docs.microsoft.com/java/api/com.azure.communication.common.microsoftteamsuseridentifier?view=azure-java-stable)

### Phone Number identifier

The `PhoneNumberIdentifier` represents a phone number. The service assumes that phone numbers are formatted in E.164 format.

#### Basic usage

```java
// create an identifier
var phoneNumber = new PhoneNumberIdentifier("+112345556789");
```

#### API reference

[PhoneNumberIdentifier](https://docs.microsoft.com/java/api/com.azure.communication.common.phonenumberidentifier?view=azure-java-stable)

### Unknown identifier

The `UnknownIdentifier` exists for future-proofing and you might encounter it when you are on an old version of the SDK and a new identifier type has been introduced recently. Any unknown identifier from the service will be deserialized to the `UnknownIdentifier` in the SDK.

#### Basic usage

```java
// create an identifier
var unknown = new UnknownIdentifier("a raw id that originated in the service");
```

#### API reference

[UnknownIdentifier](https://docs.microsoft.com/java/api/com.azure.communication.common.unknownidentifier?view=azure-java-stable)

### How to handle the `CommunicationIdentifier` base class

While you construct identifiers for a concrete type that you pass *into* the SDK, the SDK returns the abstract `CommunicationIdentifier`. You can down-cast back to a concrete type:

```java
if (communicationIdentifier instanceof CommunicationUserIdentifier) {
    System.out.println("Communication user: " + ((CommunicationUserIdentifier)communicationIdentifier).getId());
}
else if (communicationIdentifier instanceof MicrosoftTeamsUserIdentifier) {
    System.out.println("Teams user: " + ((MicrosoftTeamsUserIdentifier)communicationIdentifier).getUserId());
}
else if (communicationIdentifier instanceof PhoneNumberIdentifier) {
    System.out.println("Phone number: " + ((PhoneNumberIdentifier)communicationIdentifier).getPhoneNumber());
}
else if (communicationIdentifier instanceof UnknownIdentifier) {
    System.out.println("Unkown user: " + ((UnknownIdentifier)communicationIdentifier).getId());
}
else {
    // be careful here whether you want to throw because a new SDK version can introduce new identfier types
}
```
