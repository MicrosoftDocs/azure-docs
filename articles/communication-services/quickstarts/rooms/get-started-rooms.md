---
title: Quickstart - Create and manage a `room` resource
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to create a Room within your Azure Communication Services resource.
author: radubulboaca
manager: mariusu
services: azure-communication-services

ms.author: radubulboaca
ms.date: 11/19/2021
ms.topic: quickstart
ms.service: azure-communication-services
---
# Quickstart: Create and manage a room resource

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

This quickstart will help you get started with Azure Communication Services Rooms. A `room` is a server-managed communications space for a known, fixed set of participants to collaborate for a pre-determined duration. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).

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

Create a new `RoomsClient` object that will be used to create new `rooms` and manage their properties and lifecycle. The connection string of your `Communications Service` will be used to authenticate the request. For more information on connection strings, see [this page](../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

```csharp
// Find your Communication Services resource in the Azure portal
var connectionString = "<connection_string>"; 
RoomsClient client = new RoomsClient(connectionString);
```

### Create a room

Create a new `room` with default properties using the code snippet below:

```csharp
CreateRoomRequest createRoomRequest = new CreateRoomRequest();
Response<RoomResult> createRoomResponse = await roomsClient.CreateRoomAsync(createRoomRequest);
RoomResult createRoomResult = createRoomResponse.Value;
string roomId = createRoomResult.Id;
```

Since `rooms` are server-side entities, you may want to keep track of and persist the `roomId` in the storage medium of choice. You can reference the `roomId` to view or update the properties of a `room` object. 

### Get properties of an existing room

Retrieve the details of an existing `room` by referencing the `roomId`:

```csharp
Response<RoomResult> getRoomResponse = await roomsClient.GetRoomAsync(
    createdRoomId: "<roomId>")
RoomResult getRoomResult = getRoomResponse.Value;
```

### Update the lifetime of a room

The lifetime of a `room` can be modified by issuing an update request for the `ValidFrom` and `ValidUntil` parameters.

```csharp
UpdateRoomRequest updateRoomRequest = new UpdateRoomRequest()
{
    ValidFrom = new DateTimeOffset(2021, 12, 1, 8, 6, 32,
                                 new TimeSpan(1, 0, 0)),
    ValidUntil = new DateTimeOffset(2021, 12, 2, 8, 6, 32,
                                 new TimeSpan(1, 0, 0))
    } 
 };
Response<RoomResult> updateRoomResponse = await roomsClient.UpdateRoomAsync(createdRoomId, updateRoomRequest);
RoomResult updateRoomResult = updateRoomResponse.Value;
``` 

### Add new participants 

To add new participants to a `room`, issue an update request on the room's `Participants`:

```csharp
UpdateRoomRequest updateRoomRequest = new UpdateRoomRequest()
{
    Participants = {
        { "<ParticipantId1>", new {} }
        { "<ParticipantId2>", new {} }
        { "<ParticipantId3>", new {} }
        { "<ParticipantId4>", new {} }
    } 
 };
Response<RoomResult> updateRoomResponse = await roomsClient.UpdateRoomAsync(createdRoomId, updateRoomRequest);
RoomResult updateRoomResult = updateRoomResponse.Value;
```

Participants that have been added to a `room` become eligible to join calls.

### Remove participants

To remove a participant from a `room` and revoke their access, update the `Participants` list:

```csharp
UpdateRoomRequest updateRoomRequest = new UpdateRoomRequest()
{
    Participants = {
        { "<ParticipantId", null }
    } 
 };
Response<RoomResult> updateRoomResponse = await roomsClient.UpdateRoomAsync(createdRoomId, updateRoomRequest);
RoomResult updateRoomResult = updateRoomResponse.Value;
```

### Join a room call

To join a room call, set up your web application using the [Add voice calling to your client app](../voice-video-calling/getting-started-with-calling.md) guide. Once you have an initialized and authenticated `callAgent`, you may specify a context object with the `roomId` property as the `room` identifier. To join the call, use the `join` method and pass the context instance.

```js

const context = { roomId: '<RoomId>' }

const call = callAgent.join(context);

```

### Delete room
If you wish to disband an existing `room`, you may issue an explicit delete request. All `rooms` and their associated resources are automatically deleted at the end of their validity plus a grace period. 

```csharp
Response deleteRoomResponse = await roomsClient.DeleteRoomAsync(createdRoomId)
```

## Object model

The table below lists the main properties of `room` objects: 

| Name                  | Description                               |
|-----------------------|-------------------------------------------|
| `roomId`              | Unique `room` identifier.                  |
| `ValidFrom`           | Earliest time a `room` can be used. | 
| `ValidUntil`          | Latest time a `room` can be used. |
| `Participants`        | List of pre-existing participant IDs.       | 

## Next steps

In this section you learned how to:
> [!div class="checklist"]
> - Create a new room
> - Get the properties of a room
> - Update the properties of a room
> - Join a room call
> - Delete a room

You may also want to:
 - Learn about [rooms concept](../../concepts/rooms/room-concept.md)
 - Learn about [voice and video calling concepts](../../concepts/voice-video-calling/about-call-types.md)
 - Review Azure Communication Services [samples](../../samples/overview.md)
