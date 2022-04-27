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
CreateRoomRequest createRoomRequest = new CreateRoomRequest();
Response<CommunicationRoom> createRoomResponse = await roomsClient.CreateRoomAsync(createRoomRequest);
CommunicationRoom createCommunicationRoom = createRoomResponse.Value;
string roomId = createCommunicationRoom.Id;
```

Since `rooms` are server-side entities, you may want to keep track of and persist the `roomId` in the storage medium of choice. You can reference the `roomId` to view or update the properties of a `room` object. 

### Get properties of an existing room

Retrieve the details of an existing `room` by referencing the `roomId`:

```csharp
Response<CommunicationRoom> getRoomResponse = await roomsClient.GetRoomAsync(roomId)
CommunicationRoom getCommunicationRoom = getRoomResponse.Value;
```

### Update the lifetime of a room

The lifetime of a `room` can be modified by issuing an update request for the `ValidFrom` and `ValidUntil` parameters.

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

To add new participants to a `room`, issue an update request on the room's `Participants`:

```csharp
var communicationUser1 = "<CommunicationUserId1>";
var communicationUser2 = "<CommunicationUserId2>";
var communicationUser3 = "<CommunicationUserId3>";

UpdateRoomRequest updateRoomRequest = new UpdateRoomRequest()
updateRoomRequest.Participants.Add(communicationUser1, new RoomParticipant());
updateRoomRequest.Participants.Add(communicationUser2, new RoomParticipant());
updateRoomRequest.Participants.Add(communicationUser3, new RoomParticipant());

Response<CommunicationRoom> updateRoomResponse = await roomsClient.UpdateRoomAsync(roomId, updateRoomRequest);
CommunicationRoom updateCommunicationRoom = updateRoomResponse.Value;
```

Participants that have been added to a `room` become eligible to join calls.

### Remove participants

To remove a participant from a `room` and revoke their access, update the `Participants` list:

```csharp
var communicationUser1 = "<CommunicationUserId1>";
var communicationUser2 = "<CommunicationUserId2>";
var communicationUser3 = "<CommunicationUserId3>";

UpdateRoomRequest updateRoomRequest = new UpdateRoomRequest()
updateRoomRequest.Participants.Add(communicationUser1, null);
updateRoomRequest.Participants.Add(communicationUser2, null);
updateRoomRequest.Participants.Add(communicationUser3, null);

Response<CommunicationRoom> updateRoomResponse = await roomsClient.UpdateRoomAsync(roomId, updateRoomRequest);
CommunicationRoom updateCommunicationRoom = updateRoomResponse.Value;
```

### Join a room call

To join a room call, set up your web application using the [Add voice calling to your client app](../../voice-video-calling/getting-started-with-calling.md) guide. Once you have an initialized and authenticated `callAgent`, you may specify a context object with the `roomId` property as the `room` identifier. To join the call, use the `join` method and pass the context instance.

```js

const context = { roomId: '<RoomId>' }

const call = callAgent.join(context);

```

### Delete room
If you wish to disband an existing `room`, you may issue an explicit delete request. All `rooms` and their associated resources are automatically deleted at the end of their validity plus a grace period. 

```csharp
Response deleteRoomResponse = await roomsClient.DeleteRoomAsync(roomId)
```
