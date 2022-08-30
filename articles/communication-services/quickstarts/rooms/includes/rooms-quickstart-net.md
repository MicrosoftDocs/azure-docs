---
title: include file
description: include file
services: azure-communication-services
author: radubulboaca
manager: mariusu

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 01/26/2022
ms.topic: include
ms.custom: include file
ms.author: radubulboaca
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- Two or more Communication User Identities. [Create and manage access tokens](../../access-tokens.md?pivots=programming-language-csharp) or [Quick-create identities for testing](../../identity/quick-create-identity.md).
- The latest version [.NET Core client library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.

## Sample code

You can review and download the sample code for this quick start on [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/RoomsQuickstart).

## Setting up

### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `RoomsQuickstart`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o RoomsQuickstart
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd RoomsQuickstart
dotnet build
```

### Install the package

Install the Azure Communication Rooms client library for .NET with [NuGet][https://www.nuget.org/]:

```console
dotnet add package Azure.Communication.Rooms
``` 

### Initialize a room client

Create a new `RoomsClient` object that will be used to create new `rooms` and manage their properties and lifecycle. The connection string of your `Communications Service` will be used to authenticate the request. For more information on connection strings, see [this page](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

```csharp
// Find your Communication Services resource in the Azure portal
var connectionString = "<connection_string>"; 
RoomsClient roomsClient = new RoomsClient(connectionString);
```

### Create a room

Create a new `room` with default properties using the code snippet below:

```csharp
RoomRequest request = new RoomRequest();
Response<RoomModel> createRoomResponse = await roomsClient.CreateRoomAsync(validFrom, validUntil, RoomJoinPolicy.InviteOnly, participants);
RoomModel createCommunicationRoom = createRoomResponse.Value;
```

Since `rooms` are server-side entities, you may want to keep track of and persist the `roomId` in the storage medium of choice. You can reference the `roomId` to view or update the properties of a `room` object. 

### Get properties of an existing room

Retrieve the details of an existing `room` by referencing the `roomId`:

```csharp
Response<RoomModel> getRoomResponse = await roomsClient.GetRoomAsync(createdRoomId)
RoomModel getCommunicationRoom = getRoomResponse.Value;
```

### Update the lifetime of a room

The lifetime of a `room` can be modified by issuing an update request for the `ValidFrom` and `ValidUntil` parameters. A room can be valid for a maximum of six months. 

```csharp
var validFrom = new DateTime(2022, 05, 01, 00, 00, 00, DateTimeKind.Utc);
var validUntil = validFrom.AddDays(1);

UpdateRoomRequest updateRoomRequest = new UpdateRoomRequest();
updateRoomRequest.ValidFrom = validFrom;
updateRoomRequest.ValidUntil = validUntil;

Response<CommunicationRoom> updateRoomResponse = await roomsClient.UpdateRoomAsync(roomId, updateRoomRequest);
CommunicationRoom updateCommunicationRoom = updateRoomResponse.Value;
``` 

### Add new participants 

To add new participants to a `room`, use the `AddParticipantsAsync` method exposed on the client.

```csharp
var communicationUser1 = "<CommunicationUserId1>";
var communicationUser2 = "<CommunicationUserId2>";
var communicationUser3 = "<CommunicationUserId3>";

List<RoomParticipant> toAddCommunicationUsers = new List<RoomParticipant>();
toAddCommunicationUsers.Add(new RoomParticipant(new CommunicationUserIdentifier(communicationUser1), "Presenter"));
toAddCommunicationUsers.Add(new RoomParticipant(new CommunicationUserIdentifier(communicationUser2), "Attendee"));
toAddCommunicationUsers.Add(new RoomParticipant(new CommunicationUserIdentifier(communicationUser3), "Attendee"));

Response<RoomModel> addParticipantResponse = await roomsClient.AddParticipantsAsync(createdRoomId, toAddCommunicationUsers);
ParticipantsCollection addedParticipantsRoom = addParticipantResponse.Value;
```

Participants that have been added to a `room` become eligible to join calls.

### Get list of participants

Retrieve the list of participants for an existing `room` by referencing the `roomId`:

```csharp
Response<ParticipantsCollection> getParticipantsResponse = await roomsClient.GetParticipantsAsync(roomId);
ParticipantsCollection roomParticipants = getParticipantsResponse.Value;
```

### Remove participants

To remove a participant from a `room` and revoke their access, use the `RemoveParticipantsAsync` method.

```csharp
var communicationUser = "<CommunicationUserId1>";

 List<CommunicationIdentifier> toRemoveCommunicationUsers = new List<CommunicationIdentifier>();
toRemoveCommunicationUsers.Add(new CommunicationUserIdentifier(communicationUser));

Response<RoomModel> removeParticipantResponse = await roomsClient.RemoveParticipantsAsync(createdRoomId, toRemoveCommunicationUsers);
ParticipantsCollection removeParticipantsRoom = removeParticipantResponse.Value;
```

### Delete room
If you wish to disband an existing `room`, you may issue an explicit delete request. All `rooms` and their associated resources are automatically deleted at the end of their validity plus a grace period. 

```csharp
Response deleteRoomResponse = await roomsClient.DeleteRoomAsync(createdRoomId);
```

## Reference documentation

Read about the full set of capabilities of Azure Communication Services rooms from the [.NET SDK reference](/dotnet/api/azure.communication.rooms) or [REST API reference](/rest/api/communication/rooms).
