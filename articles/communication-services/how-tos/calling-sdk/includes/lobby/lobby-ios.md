---
author: tinaharter
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/26/2023
ms.author: tinaharter
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-ios.md)]

Object `CallLobby` on `Call` or `TeamsCall` class allow users to access Teams meeting lobby information. It includes the APIs, `admit`, `reject` and `admitAll`, which allows user to admit and reject participants from Teams meeting lobby. User could also get the `participants` collection and subscribe the event listener to receive notification.

### Get CallLobby object
The first thing is to get the `CallLobby` object from the call instance: 
```swift
@State var callLobby: CallLobby?
callLobby = self.call!.callLobby
```

### Get lobby participants properties
To know who is in the lobby, you could get the `participants` collection from `CallLobby` object. It's a collection of `RemoteParticipant` object with `InLobby` state. To get the `participants` collection:

```swift
let lobbyParticipants = callLobby.participants
```

### Get identifier for a remote participant
Before admit or reject participant from CallLobby, you need to get the identifier for a remote participant:
```swift
//You could get the identifier from the lobby participants collection
//You could also get the identifier from the addOnLobbyParticipantsUpdatedListener event
let identifiers = (call?.callLobby.participants.map {$0.identifier})!;
```

### Admit participant from CallLobby
CallLobby object allows user with the Organizer, Co-organizer and Presenter roles to admit participants from Teams CallLobby. Method `admit` accepts identifiers collection as input, and it returns `AdmitParticipantsResult` object as result.

```swift
callLobby.admit(identifiers: identifiers, completionHandler: { result, error in
    if error != nil {
        print ("Admit participant is failed %@", error! as Error)
    } else{
        print ("Admit result. success count: %s , failure count: %s, failure participants: %s", result.successCount, result.failureCount, result.failureParticipants)
    }
})
```

### Reject participant from CallLobby
CallLobby object allows user with the Organizer, Co-organizer and Presenter roles to reject participant from Teams CallLobby. Method `reject` accepts identifier.

```swift
//To reject participant from CallLobby:
callLobby.reject(identifiers.first!, completionHandler: { error in
    if error != nil {
        print ("Reject all participants is failed %@", error! as Error)
    }
})
```

### Admit all participants from CallLobby
CallLobby object allows user with the Organizer, Co-organizer and Presenter roles to admit all participants from Teams CallLobby. Method `admitAll` returns `AdmitAllParticipantsResult` object as result.

```swift
callLobby.admitAll(completionHandler: { result, error in
    if error != nil {
        print ("Admit all participants is failed %@", error! as Error)
    } else{
        print ("AdmitAll result. success count: %s , failure count: %s", result.successCount, result.failureCount)
    }
})
```

### Handle CallLobby updated event
You could subscribe to the event listener to handle the changes in the `participants` collection. This event is triggered when the participants are added or removed from the CallLobby and it provides the added or removed participants list.

```swift
//To register listener:
self.callObserver = CallObserver(view:self)

callLobby = self.call!.callLobby
callLobby!.delegate = self.callObserver

public class CallObserver : NSObject, CallLobbyDelegate
{
    public func callLobby(_ callLobby: CallLobby, didUpdateLobbyParticipants args: ParticipantsUpdatedEventArgs) {
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
self.callLobby?.delegate = nil
```
[Learn more about events and subscription ](../../events.md)