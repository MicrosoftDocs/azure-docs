---
author: tinaharter
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/26/2023
ms.author: tinaharter
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

Object `CallLobby` on `Call` or `TeamsCall` class allow users to access Teams meeting lobby information. It includes the APIs, `AdmitAsync`, `RejectAsync` and `AdmitAllAsync`, which allows user to admit and reject participants from Teams meeting lobby. User could also get the `Participants` collection and subscribe the `LobbyParticipantsUpdated` event to receive notification.

### Get CallLobby object
The first thing is to get the `CallLobby` object  from the call instance: 
```csharp
private CallLobby callLobby;
callLobby = call.CallLobby;
```

### Get lobby participants properties
To know who is in the lobby, you could get the `Participants` collection from `CallLobby` object. It's a collection of `RemoteParticipant` object with `InLobby` state. To get the `Participants` collection:

```csharp
var lobbyParticipants = callLobby.Participants; 
```

### Get identifier for a remote participant
Before admit or reject participant from CallLobby, you need to get the identifier for a remote participant:
```csharp
//You could get the identifier from the CallLobby.Participants collection
//You could also get the identifier from the LobbyParticipantsUpdated event
var identifiers = lobbyParticipants.Select(p => p.Identifier).ToList().AsReadOnly();
```

### Admit participant from CallLobby
CallLobby object allows user with the Organizer, Co-organizer and Presenter roles to admit participants from Teams CallLobby. Method `AdmitAsync` accepts identifiers collection as input, and it returns `AdmitParticipantsResult` object as result.

```csharp
AdmitParticipantsResult result = await callLobby?.AdmitAsync(identifiers);
Trace.WriteLine("Admit result. success count: " + result.SuccessCount + ", failure count: " + result.FailureCount + ", failure participants: " + result.FailedParticipants);
foreach (RemoteParticipant participant in result.FailureParticipants.ToList<RemoteParticipant>())
{
    Trace.WriteLine("Admit participant: " + participant.DisplayName + " failed ");
}
```

### Reject participant from CallLobby
CallLobby object allows user with the Organizer, Co-organizer and Presenter roles to reject participant from Teams CallLobby. Method `RejectAsync` accepts identifier as input.

```csharp
//To reject all participants from CallLobby:
foreach (CallIdentifier identifier in identifiers)
{
    await callLobby?.RejectAsync(identifier);
}
```

### Admit all participants from CallLobby
CallLobby object allows user with the Organizer, Co-organizer and Presenter roles to admit all participants from Teams CallLobby. Method `AdmitAllAsync` returns `AdmitAllParticipantsResult` object as result.

```csharp
AdmitAllParticipantsResult result = await callLobby?.AdmitAllAsync();
Trace.WriteLine("Admit all result. success count: " + result.SuccessCount + ", failure count: " + result.FailureCount);
```

### Handle CallLobby updated event
You could subscribe to the `LobbyParticipantsUpdated` event to handle the changes in the `Participants` collection. This event is triggered when the participants are added or removed from the CallLobby and it provides the added or removed participants list.
```csharp
//When call.State == CallState.Connected
callLobby.LobbyParticipantsUpdated += CallLobby_OnLobbyParticipantsUpdated;

private async void CallLobby_OnLobbyParticipantsUpdated(object sender, ParticipantsUpdatedEventArgs args)
{
    foreach (var remoteParticipant in args.AddedParticipants.ToList<RemoteParticipant>()){
        Trace.WriteLine("Participant: " + participant.DisplayName + " joins lobby ");
    }

    foreach (var remoteParticipant in args.RemovedParticipants.ToList<RemoteParticipant>()){
        Trace.WriteLine("Participant: " + participant.DisplayName + " leaves lobby ");
    }
}
```
[Learn more about events and subscription ](../../events.md)