---
author: tinaharter
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/15/2023
ms.author: tinaharter
---
>[!IMPORTANT]
> The examples here are available in [1.15.1-beta.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.15.1-beta.1) of the Calling SDK for JavaScript. Be sure to use that version or newer when you're trying this quickstart.

[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

Object `Lobby` on `Call` or `TeamsCall` class allow users to access Teams meeting lobby information. It includes the APIs, `admit`, `reject` and `admitAll`, which allows user to admit and reject participants from Teams meeting lobby. User could also get the `participants` collection and subscribe the `lobbyParticipantsUpdated` event to receive notification.

### Get lobby object
The first thing is to get the `Call` or `TeamsCall` object of admitter: [Learn how to join Teams meeting](../../teams-interoperability.md). 
You can get the `Lobby` object from `Call` or `TeamsCall` object.
```js
const lobby = call.lobby;
```

### Get lobby participants properties
To know who is in the lobby, you could get the `participants` collection from `Lobby` object. It's a collection of `RemoteParticipant` object with `InLobby` state. To get the `participants` collection:

```js
let lobbyParticipants = lobby.participants; // [remoteParticipant, remoteParticipant....]
```

### Get identifier for a remote participant
Before admit or reject participant from lobby, you could get the identifier for a remote participant:
```js
if(lobbyParticipants.length !== 0){
    let remoteParticipant = lobbyParticipants[0];
}
//You could get the identifier from the Lobby.participants collection
//You could also get the identifier from the lobbyParticipantsUpdated event
const identifier = remoteParticipant.identifier;
```

The `identifier` can be one of the following `CommunicationIdentifier` types:

- `{ communicationUserId: '<COMMUNICATION_SERVICES_USER_ID'> }`: Object representing the Azure Communication Services user.
- `{ phoneNumber: '<PHONE_NUMBER>' }`: Object representing the phone number in E.164 format.
- `{ microsoftTeamsUserId: '<MICROSOFT_TEAMS_USER_ID>', isAnonymous?: boolean; cloud?: "public" | "dod" | "gcch" }`: Object representing the Teams user.
- `{ id: string }`: object representing identifier that doesn't fit any of the other identifier types

### Admit, reject and admitAll participant from lobby
To admit, reject or admit all users from the lobby, you can use the `admit`, `reject` and `admitAll` methods. 
They're the async APIs, to verify results can be used `lobbyParticipantsUpdated` listeners.

You can admit or reject from lobby by calling the method `admit` and `reject`. The method accepts identifiers `MicrosoftTeamsUserIdentifier`, `CommunicationUserIdentifier`, `PhoneNumberIdentifier` or `UnknownIdentifier` as input. You can also admit all users from the lobby by calling the method `admitAll`. 
```js
//admit
await lobby.admit(identifier);
//reject
await lobby.reject(identifier);
//admitAll
await lobby.admitAll();
```

### Handle lobby updated event
You could subscribe to the `lobbyParticipantsUpdated` event to handle the changes in the `participants` collection. This event will be triggered when the participants are added or removed from the lobby and it will provide the added or removed participants list.
```js
subscribeToCall = (call) => {
    try {
        //Subscribe to lobby's 'lobbyParticipantsUpdated' event for lobbyParticipants update.
        call.lobby.on('lobbyParticipantsUpdated', lobbyParticipantsUpdatedHandler);
    } catch (error) {
        console.error(error);
    }
}

const lobbyParticipantsUpdatedHandler = (event) => {
    event.added.forEach(remoteParticipant => {
        console.log(`${remoteParticipant._displayName} joins the lobby`);
    });
    event.removed.forEach(remoteParticipant => {
        console.log(`${remoteParticipant._displayName} leaves the lobby`);
    })
};
```
[Learn more about events and subscription ](../../events.md)