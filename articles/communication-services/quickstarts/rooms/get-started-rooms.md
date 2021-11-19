---
title: Quickstart - Create and manage a Rooms resource
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
# Quickstart: Create and manage a Rooms resource

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

This quickstart will help you get started with Azure Communication Services Rooms. A Room is a server-managed communications space for a known, fixed set of participants to collaborate for a pre-determined duration. To learn more about Rooms concepts and terminology visit [Rooms conceptual documentation](../../concepts/rooms/rooms.md). 


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

### Initialize a Rooms client

Create a new `RoomsClient` object that will be used to create new `Rooms` and manage their properties and lifecycle. To authenticate the request, you will need the connection string for the `Communications Service` you intend to use. See [this page](../create-communication-resource.md#access-your-connection-strings-and-service-endpoints) for additional details and ways to retrieve the `Communication Services` connection string.  

```csharp
// Find your Communication Services resource in the Azure portal
var connectionString = "<connection_string>"; 
RoomsClient client = new RoomsClient(connectionString);
```

### Create a Room

Create a new `Room` with default properties using default properties using the code snippet below.

```csharp
CreateRoomRequest createRoomRequest = new CreateRoomRequest();
Response<RoomResult> createRoomResponse = await roomsClient.CreateRoomAsync(createRoomRequest);
RoomResult createRoomResult = createRoomResponse.Value;
string roomId = createRoomResult.Id;
```

Because `Rooms` are server-side entities, you will need to keep track of and persist the `roomId` in the storage medium of choice. You will need to reference a `roomId` to view or update the properties of a `Room` object. 

### Get properties of an existing room

Retrieve the details of an existing `Room` by referencing the `roomId`:

```csharp
Response<RoomResult> getRoomResponse = await roomsClient.GetRoomAsync(
    createdRoomId: "<roomId>")
RoomResult getRoomResult = getRoomResponse.Value;
```

### Update the lifetime of a Room

The lifetime of a `Room` can be modified by issuing an update request for the `ValidFrom` and `ValidUntil` parameters.

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

To add new participants to a `Room`, issue an update request on the Room's `Participants`:

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

Participants that have been added to a `Room` become eligible to join calls.

### Remove participants

To remove a participant from a `Room` and revoke their access, update the `Participants` list:

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

### Delete Room
If you wish to disband an existing `Room`, you may issue an explicit delete request. All `Rooms` and their associated resources are automatically deleted at the end of their validity plus a grace period. 

```csharp
Response deleteRoomResponse = await roomsClient.DeleteRoomAsync(createdRoomId)
```

## Object model

The table below lists the main properties of `Room` objects: 

| Name                  | Description                               |
|-----------------------|-------------------------------------------|
| `roomId`              | Unique `Room` identifier.                  |
| `ValidFrom`           | Earliest point in time when a `Room` can be used. | 
| `ValidUntil`          | Latest point in time when a `Room` can be used. |
| `Participants`        | List of pre-existing participant IDs.       | 
