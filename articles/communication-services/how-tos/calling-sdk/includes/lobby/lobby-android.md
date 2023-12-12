---
author: tinaharter
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/26/2023
ms.author: tinaharter
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-android.md)]

Object `CallLobby` on `Call` or `TeamsCall` class allow users to access Teams meeting lobby information. It includes the APIs, `admit`, `reject` and `admitAll`, which allows user to admit and reject participants from Teams meeting lobby. User could also get the `participants` collection and subscribe the `addOnLobbyParticipantsUpdatedListener` event listener to receive notification.

### Get CallLobby object
The first thing is to get the `CallLobby` object  from the call instance: 
```java
private CallLobby callLobby;
callLobby = call.getCallLobby();
```

### Get lobby participants properties
To know who is in the lobby, you could get the `participants` collection from `CallLobby` object. It's a collection of `RemoteParticipant` object with `InLobby` state. To get the `participants` collection:

```java
List<RemoteParticipant> lobbyParticipants = callLobby.getParticipants(); 
```

### Get identifier for a remote participant
Before admit or reject participant from lobby, you need to get the identifier for a remote participant:
```java
//You could get the identifier from the lobby participants collection
//You could also get the identifier from the addOnLobbyParticipantsUpdatedListener event
List<CommunicationIdentifier> identifiers = new ArrayList<>();
CommunicationUserIdentifier acsUser = new CommunicationUserIdentifier(<USER_ID>);
MicrosoftTeamsUserIdentifier teamsUser = new MicrosoftTeamsUserIdentifier(<USER_ID>);
identifiers.add(new CommunicationUserIdentifier("<USER_ID>"));
identifiers.add(new MicrosoftTeamsUserIdentifier("<USER_ID>"));
```

### Admit participant from CallLobby
CallLobby object allows user with the Organizer, Co-organizer and Presenter roles to admit participants from Teams CallLobby. Method `admit` accepts identifiers collection as input, and it returns `AdmitParticipantsResult` object as result.

```java
AdmitParticipantsResult result = this.callLobby.admit(identifiers).get();
String failedParticipants = this.convertListToString("", result.getFailedParticipants());
Log.i(LOBBY_TAG, String.format("Admit result: success count: %s, failure count: %s, failure participants: %s", admitResult.getSuccessCount(), admitResult.getFailedCount(), failedParticipants));
```

### Reject participant from CallLobby
MeetingLobby object allows user with the Organizer, Co-organizer and Presenter roles to reject participant from Teams MeetingLobby. Method `reject` accepts identifier as input.

```java
//To reject all participants from CallLobby:
for (CommunicationIdentifier identifier : identifiers)
{
    this.callLobby.reject(lobbyParticipantsIdentifiers.get(0)).get();
}
```

### Admit all participants from CallLobby
MeetingLobby object allows user with the Organizer, Co-organizer and Presenter roles to admit all participants from Teams MeetingLobby. Method `admitAll` returns `AdmitAllParticipantsResult` object as result.

```java
AdmitAllParticipantsResult result = this.callLobby.admitAll().get();
Log.i(LOBBY_TAG, String.format("Admit result: success count: %s, failure count: %s, failure participants: %s", result.getSuccessCount(), result.getFailureCount()));
```

### Handle CallLobby updated event
You could subscribe to the `addOnLobbyParticipantsUpdatedListener` event listener to handle the changes in the `participants` collection. This event is triggered when the participants are added or removed from the CallLobby and it provides the added or removed participants list.

```java
//To register listener:
this.callLobby.addOnLobbyParticipantsUpdatedListener(this::OnLobbyParticipantsUpdated);

private void OnLobbyParticipantsUpdated(ParticipantsUpdatedEvent args) {
    if(!args.getAddedParticipants().isEmpty()){
        for(RemoteParticipant addedParticipant : args.getAddedParticipants()){
            Log.i(TAG, String.format("Participant %s joins lobby", addedParticipant.getDiaplayName()));
        }
    }

    if(!args.getRemovedParticipants().isEmpty()){
        for(RemoteParticipant removedParticipant : args.getRemovedParticipants()){
            Log.i(TAG, String.format("Participant %s leaves lobby", removedParticipant.getDiaplayName()));
        }
    }
}

//To unregister listener:
lobby.removeOnLobbyParticipantsUpdatedListener(this::OnLobbyParticipantsUpdated);
```
[Learn more about events and subscription ](../../events.md)