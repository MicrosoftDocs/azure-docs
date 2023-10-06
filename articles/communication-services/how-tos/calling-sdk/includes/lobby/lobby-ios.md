---
author: tinaharter
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/26/2023
ms.author: tinaharter
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-ios.md)]

Object `Lobby` on `Call` or `TeamsCall` class allow users to access Teams meeting lobby information. It includes the APIs, `admit`, `reject` and `admitAll`, which allows user to admit and reject participants from Teams meeting lobby. User could also get the `participants` collection and subscribe the event listener to receive notification.

### Get lobby object
The first thing is to get the `Lobby` object  from the call instance: 
```swift
@State var lobby: Lobby?
lobby = self.call!.lobby
```

### Get lobby participants properties
To know who is in the lobby, you could get the `participants` collection from `Lobby` object. It's a collection of `RemoteParticipant` object with `InLobby` state. To get the `participants` collection:

```swift
let lobbyParticipants = lobby.participants
```

### Get identifier for a remote participant
Before admit or reject participant from lobby, you need to get the identifier for a remote participant:
```swift
//You could get the identifier from the lobby participants collection
//You could also get the identifier from the addOnLobbyParticipantsUpdatedListener event
let identifiers = (call?.lobby.participants.map {$0.identifier})!;
```

### Admit participant from lobby
MeetingLobby object allows user with the Organizer, Co-organizer and Presenter roles to admit participants from Teams MeetingLobby. Method `admit` accepts identifiers collection and `AdmitLobbyParticipantOptions` as input, and it returns `AdmitOperationResult` object as result.

```swift
let options = AdmitLobbyParticipantOptions();
lobby.admit(identifiers: identifiers, options:options, completionHandler: { result, error in
    if error != nil {
        print ("Admit one participant is failed %@", error! as Error)
    }
})
print ("Admit result. success count: %s , failure count: %s", result.successCount, result.failureParticipants.count)
```

### Reject participant from lobby
MeetingLobby object allows user with the Organizer, Co-organizer and Presenter roles to reject participant from Teams MeetingLobby. Method `reject` accepts identifier and `RejectLobbyParticipantOptions` as input.

```swift
//To reject all participants from lobby:
let options = RejectLobbyParticipantOptions();
lobby.reject(identifiers.first!, options: options, withCompletionHandler: { error in
    if error != nil {
        print ("Reject all participants is failed %@", error! as Error)
    }
})
```

### Admit all participants from lobby
MeetingLobby object allows user with the Organizer, Co-organizer and Presenter roles to admit all participants from Teams MeetingLobby. Method `admitAll` accepts `AdmitLobbyParticipantOptions` as input, and it returns `AdmitOperationResult` object as result.

```swift
let options = AdmitLobbyParticipantOptions();
lobby.admitAll(options: options, completionHandler: { result, error in
    if error != nil {
        print ("Admit all participants is failed %@", error! as Error)
    }
})
```

### Handle lobby updated event
You could subscribe to the event listener to handle the changes in the `participants` collection. This event is triggered when the participants are added or removed from the lobby and it provides the added or removed participants list.

```swift
//To register listener:
self.callObserver = CallObserver(view:self)

lobby = self.call!.lobby
lobby!.delegate = self.callObserver

public class CallObserver : NSObject, LobbyDelegate
{
    public func lobby(_ lobby: Lobby, didUpdateLobbyParticipant args: ParticipantsUpdatedEventArgs) {
        args.removedParticipants.forEach { p in
            let mri = Utilities.toMri(p.identifier)
            os_log("==>Participants %d is removed from the lobby.", log:log, mri)
        }

        args.addedParticipants.forEach { p in
            let mri = Utilities.toMri(p.identifier)
            os_log("==>Participants %d is added to the lobby.", log:log, mri)
        }
    }
}    

//To unregister listener, you can use the `off` method.
self.lobby?.delegate = nil
```
[Learn more about events and subscription ](../../events.md)