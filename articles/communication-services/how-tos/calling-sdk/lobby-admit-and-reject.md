---
title: Admit and reject users from Teams meeting lobby
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to admit or reject users from Teams meeting lobby.
author: tinaharter
ms.author: tinaharter
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.topic: how-to 
ms.date: 03/14/2023
ms.custom: template-how-to

---

# Manage Teams meeting lobby

APIs lobby admit and reject on `Call` or `TeamsCall` class allow users to admit and reject participants from Teams meeting lobby.

In this article, you will learn how to admit and reject participants from Microsoft Teams meetings lobby by using Azure Communication Service calling SDKs.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

User ends up in the lobby depending on Microsoft Teams configuration. The controls are described here:
[Learn more about Teams configuration ](../../concepts/interop/guest/teams-administration.md)

Microsoft 365 or Azure Communication Services users can admit or reject users from lobby, if they are connected to Teams meeting and have Organizer, Co-organizer, or Presenter meeting role.
[Learn more about meeting roles](https://support.microsoft.com/office/roles-in-a-teams-meeting-c16fa7d0-1666-4dde-8686-0a0bfe16e019)

To update or check current meeting join & lobby policies in Teams admin center:
[Learn more about Teams policies](/microsoftteams/settings-policies-reference#automatically-admit-people)


### Get remote participant properties

The first thing is to get the `Call` or `TeamsCall` object of admitter: [Learn how to join Teams meeting](./teams-interoperability.md)

To know who is in the lobby, you could check the state of a remote participant. The `remoteParticipant` with `InLobby` state indicates that remote participant is in lobby.
To get the `remoteParticipants` collection:

```js
let remoteParticipants = call.remoteParticipants; // [remoteParticipant, remoteParticipant....]
```

To get the state of a remote participant:

```js
const state = remoteParticipant.state;
```

You could check remote participant state in subscription method:
[Learn more about events and subscription ](./events.md)

```js
// Subscribe to a call obj.
// Listen for property changes and collection updates.
subscribeToCall = (call) => {
    try {
        // Inspect the call's current remote participants and subscribe to them.
        call.remoteParticipants.forEach(remoteParticipant => {
            subscribeToRemoteParticipant(remoteParticipant);
        })
        // Subscribe to the call's 'remoteParticipantsUpdated' event to be
        // notified when new participants are added to the call or removed from the call.
        call.on('remoteParticipantsUpdated', e => {
            // Subscribe to new remote participants that are added to the call.
            e.added.forEach(remoteParticipant => {
                subscribeToRemoteParticipant(remoteParticipant)
            });
            // Unsubscribe from participants that are removed from the call
            e.removed.forEach(remoteParticipant => {
                console.log('Remote participant removed from the call.');
            })
        });
    } catch (error) {
        console.error(error);
    }
}

// Subscribe to a remote participant obj.
// Listen for property changes and collection updates.
subscribeToRemoteParticipant = (remoteParticipant) => {
    try {
        // Inspect the initial remoteParticipant.state value.
        console.log(`Remote participant state: ${remoteParticipant.state}`);
        if(remoteParticipant.state === 'InLobby'){
            console.log(`${remoteParticipant._displayName} is in the lobby`);
        }
        // Subscribe to remoteParticipant's 'stateChanged' event for value changes.
        remoteParticipant.on('stateChanged', () => {
            console.log(`Remote participant state changed: ${remoteParticipant.state}`);
            if(remoteParticipant.state === 'InLobby'){
                console.log(`${remoteParticipant._displayName} is in the lobby`);
            }
            else if(remoteParticipant.state === 'Connected'){
                console.log(`${remoteParticipant._displayName} is in the meeting`);
            }
        });
    } catch (error) {
        console.error(error);
    }
}
```

Before admit or reject `remoteParticipant` with `InLobby` state, you could get the identifier for a remote participant:

```js
const identifier = remoteParticipant.identifier;
```

The `identifier` can be one of the following `CommunicationIdentifier` types:

- `{ communicationUserId: '<COMMUNICATION_SERVICES_USER_ID'> }`: Object representing the Azure Communication Services user.
- `{ phoneNumber: '<PHONE_NUMBER>' }`: Object representing the phone number in E.164 format.
- `{ microsoftTeamsUserId: '<MICROSOFT_TEAMS_USER_ID>', isAnonymous?: boolean; cloud?: "public" | "dod" | "gcch" }`: Object representing the Teams user.
- `{ id: string }`: object representing identifier that doesn't fit any of the other identifier types

### Start lobby operations

To admit, reject or admit all users from the lobby, you can use the `admit`, `rejectParticipant` and `admitAll` asynchronous APIs:

You can admit specific user to the Teams meeting from lobby by calling the method `admit` on the object `TeamsCall` or `Call`. The method accepts identifiers `MicrosoftTeamsUserIdentifier`, `CommunicationUserIdentifier`, `PhoneNumberIdentifier` or `UnknownIdentifier` as input.

```js
await call.admit(identifier);
```

You can also reject specific user to the Teams meeting from lobby by calling the method `rejectParticipant` on the object `TeamsCall` or `Call`. The method accepts identifiers `MicrosoftTeamsUserIdentifier`, `CommunicationUserIdentifier`, `PhoneNumberIdentifier` or `UnknownIdentifier` as input.

```js
await call.rejectParticipant(identifier);
```

You can also admit all users in the lobby by calling the method `admitAll` on the object `TeamsCall` or `Call`. 

```js
await call.admitAll();
```

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage Teams calls](../cte-calling-sdk/manage-calls.md)
- [Learn how to join Teams meeting](./teams-interoperability.md)
- [Learn how to manage video](./manage-video.md)
