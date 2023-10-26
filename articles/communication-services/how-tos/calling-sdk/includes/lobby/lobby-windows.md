---
author: tinaharter
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/26/2023
ms.author: tinaharter
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-windows.md)]

Object `MeetingLobby` on `Call` or `TeamsCall` class allow users to access Teams meeting lobby information. It includes the APIs, `AdmitAsync`, `RejectAsync` and `AdmitAllAsync`, which allows user to admit and reject participants from Teams meeting lobby. User could also get the `Participants` collection and subscribe the `LobbyParticipantsUpdated` event to receive notification.

### Get lobby object
The first thing is to get the `MeetingLobby` object  from the call instance: 
```csharp
private MeetingLobby meetingLobby;
meetingLobby = call.MeetingLobby;
```

### Get lobby participants properties
To know who is in the lobby, you could get the `Participants` collection from `MeetingLobby` object. It's a collection of `RemoteParticipant` object with `InLobby` state. To get the `Participants` collection:

```csharp
var lobbyParticipants = meetingLobby.Participants; 
```

### Get identifier for a remote participant
Before admit or reject participant from lobby, you need to get the identifier for a remote participant:
```csharp
//You could get the identifier from the MeetingLobby.Participants collection
//You could also get the identifier from the LobbyParticipantsUpdated event
var identifiers = lobbyParticipants.Select(p => p.Identifier).ToList().AsReadOnly();
```

### Admit participant from lobby
MeetingLobby object allows user with the Organizer, Co-organizer and Presenter roles to admit participants from Teams MeetingLobby. Method `AdmitAsync` accepts identifiers collection and `AdmitLobbyParticipantOptions` as input, and it returns `AdmitOperationResult` object as result.

```csharp
AdmitLobbyParticipantOptions admitOptions = new AdmitLobbyParticipantOptions();
AdmitOperationResult result = await meetingLobby?.AdmitAsync(identifiers, admitOptions);
Trace.WriteLine("Admit result. success count: " + result.SuccessCount + ", failure count: " + result.FailureParticipants.Count);
foreach (RemoteParticipant participant in result.FailureParticipants.ToList<RemoteParticipant>())
{
    Trace.WriteLine("Admit participant: " + participant.DisplayName + " failed ");
}
```

### Reject participant from lobby
MeetingLobby object allows user with the Organizer, Co-organizer and Presenter roles to reject participant from Teams MeetingLobby. Method `RejectAsync` accepts identifier and `RejectLobbyParticipantOptions` as input.

```csharp
//To reject all participants from lobby:
RejectLobbyParticipantOptions rejectOptions = new RejectLobbyParticipantOptions();
foreach (CallIdentifier identifier in identifiers)
{
    await meetingLobby?.RejectAsync(identifier, rejectOptions);
}
```

### Admit all participants from lobby
MeetingLobby object allows user with the Organizer, Co-organizer and Presenter roles to admit all participants from Teams MeetingLobby. Method `AdmitAllAsync` accepts `AdmitLobbyParticipantOptions` as input, and it returns `AdmitOperationResult` object as result.

```csharp
AdmitLobbyParticipantOptions admitOptions = new AdmitLobbyParticipantOptions();
AdmitOperationResult result = await meetingLobby?.AdmitAllAsync(admitOptions);
Trace.WriteLine("Admit all result. success count: " + result.SuccessCount + ", failure count: " + result.FailureParticipants.Count);
foreach (RemoteParticipant participant in result.FailureParticipants.ToList<RemoteParticipant>())
{
    Trace.WriteLine("Admit participant: " + participant.DisplayName + " failed ");
}
```

### Handle lobby updated event
You could subscribe to the `LobbyParticipantsUpdated` event to handle the changes in the `Participants` collection. This event is triggered when the participants are added or removed from the lobby and it provides the added or removed participants list.
```csharp
//When call.State == CallState.Connected
meetingLobby.LobbyParticipantsUpdated += Lobby_OnLobbyParticipantsUpdated;

private async void Lobby_OnLobbyParticipantsUpdated(object sender, ParticipantsUpdatedEventArgs args)
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