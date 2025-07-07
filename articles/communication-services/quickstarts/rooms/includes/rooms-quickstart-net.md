---
title: include file
description: include file
services: azure-communication-services
author: mayssamm
manager: alexokun

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 05/15/2025
ms.topic: include
ms.custom: include file
ms.author: mayssamm
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- The latest version [.NET Core client library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.

## Sample code

Review and download the sample code for from GitHub at [Rooms Quickstart - .NET](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/RoomsQuickstart).

## Set up

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

Use the Azure Communication Rooms client library for .NET [version 1.1.0](https://www.nuget.org/packages/Azure.Communication.Rooms/1.1.0) or later.

### Set up the app framework

In the `Program.cs` file, add the following code to import the required namespaces and create the basic program structure.

```csharp

using System;
using Azure;
using Azure.Core;
using Azure.Communication.Rooms;

namespace RoomsQuickstart
{
    class Program
    {
        static async System.Threading.Tasks.Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - Rooms Quickstart");

            // Quickstart code goes here
        }
    }
}

```

## Initialize a room client

Create a new `RoomsClient` object that you need to create new `rooms` and manage their properties and lifecycle. Use the connection string of your Communications Service to authenticate the request. For more information on connection strings, see [this page](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

```csharp

// Find your Communication Services resource in the Azure portal
var connectionString = "<connection_string>";
RoomsClient roomsClient = new RoomsClient(connectionString);

```

## Create a room

### Set up room participants

To set up who can join a room, you need to have the list of the identities of those users. Follow the instructions at [Access tokens](../../identity/access-tokens.md?pivots=programming-language-csharp) to creatieusers and issue access tokens. Alternatively, to create the users on demand, you can create them using the `CommunicationIdentityClient`. Azure Communication Services Rooms currently support a room participant of type `CommunicationUserIdentifier` only, using other types of `CommunicationIdentity` cause a runtime error.

To use the `CommunicationIdentityClient`, install the following package:

```console
dotnet add package Azure.Communication.Identity
```

Also, import the namespace of the package at the top of your `Program.cs` file:

``` csharp
using Azure.Communication.Identity;
```

Now, you can initialize the `CommunicationIdentityClient` and use it to create users:

```csharp
// Create identities for users who will join the room
CommunicationIdentityClient identityClient = new CommunicationIdentityClient(connectionString);
CommunicationUserIdentifier user1 = identityClient.CreateUser();
CommunicationUserIdentifier user2 = identityClient.CreateUser();
```

Then, create the list of room participants by referencing those users:

```csharp
List<RoomParticipant> participants = new List<RoomParticipant>()
{
    new RoomParticipant(user1) { Role = ParticipantRole.Presenter },
    new RoomParticipant(user2) // The default participant role is ParticipantRole.Attendee
};
```

### Initialize the room

Create a new room using the `participants` defined in the preceding code snippet:

```csharp
// Create a room
DateTimeOffset validFrom = DateTimeOffset.UtcNow;
DateTimeOffset validUntil = validFrom.AddDays(1);
CancellationToken cancellationToken = new CancellationTokenSource().Token;

CommunicationRoom createdRoom = await roomsClient.CreateRoomAsync(validFrom, validUntil, participants, cancellationToken);

// CreateRoom or CreateRoomAsync methods can take CreateRoomOptions type as an input parameter.
bool pstnDialOutEnabled = false;
CreateRoomOptions createRoomOptions = new CreateRoomOptions()
{
    ValidFrom = validFrom,
    ValidUntil = validUntil,
    PstnDialOutEnabled = pstnDialOutEnabled,
    Participants = participants
};

createdRoom = await roomsClient.CreateRoomAsync(createRoomOptions, cancellationToken);
string roomId = createdRoom.Id;
Console.WriteLine("\nCreated room with id: " + roomId);
```

Since rooms are server-side entities, you should keep track of and persist the `roomId` in the storage medium of choice. You can reference the `roomId` to view or update the properties of a room object.

### Enable PSTN dial out capability for a room
Each room has PSTN dial out disabled by default. You can enable the PSTN dial out for a room at creation, by defining the `pstnDialOutEnabled` parameter as true. You can change this capability  for a room by issuing an update request for the `pstnDialOutEnabled` parameter.

```csharp
// Create a room
CancellationToken cancellationToken = new CancellationTokenSource().Token;

// CreateRoom or CreateRoomAsync methods to create a room with PSTN dial out capability
bool pstnDialOutEnabled = true;
CreateRoomOptions createRoomOptions = new CreateRoomOptions()
{
    PstnDialOutEnabled = pstnDialOutEnabled,
};

CommunicationRoom createdRoom = await roomsClient.CreateRoomAsync(createRoomOptions, cancellationToken);
Console.WriteLine("\nCreated a room with PSTN dial out enabled: " + createdRoom.PstnDialOutEnabled);

// UpdateRoom or UpdateRoomAsync methods can take UpdateRoomOptions to enable or disable PSTN dial out capability
pstnDialOutEnabled = false;
UpdateRoomOptions updateRoomOptions = new UpdateRoomOptions()
{
    PstnDialOutEnabled = pstnDialOutEnabled,
};

CommunicationRoom updatedRoom = await roomsClient.UpdateRoomAsync(roomId, updateRoomOptions, cancellationToken);
Console.WriteLine("\nUpdated a room with PSTN dial out enabled: " + updatedRoom.PstnDialOutEnabled);

```

## Get properties of an existing room

To retrieve the details of an existing room, reference the `roomId`:

```csharp

// Retrieve the room with corresponding ID
CommunicationRoom room = await roomsClient.GetRoomAsync(roomId);
Console.WriteLine("\nRetrieved room with id: " + room.Id);

```

## Update the lifetime of a room

You can change the lifetime of a room by issuing an update request for the `ValidFrom` and `ValidUntil` parameters. A room can be valid for a maximum of six months.

```csharp

// Update room lifetime
DateTimeOffset updatedValidFrom = DateTimeOffset.UtcNow;
DateTimeOffset updatedValidUntil = DateTimeOffset.UtcNow.AddDays(10);
CommunicationRoom updatedRoom = await roomsClient.UpdateRoomAsync(roomId, updatedValidFrom, updatedValidUntil, cancellationToken);

// UpdateRoom or UpdateRoomAsync methods can take UpdateRoomOptions type as an input parameter.
bool pstnDialOutEnabled = true;
UpdateRoomOptions updateRoomOptions = new UpdateRoomOptions()
{
    ValidFrom = validFrom,
    ValidUntil = validUntil,
    PstnDialOutEnabled = pstnDialOutEnabled,
};

updatedRoom = await roomsClient.UpdateRoomAsync(roomId, updateRoomOptions, cancellationToken);
Console.WriteLine("\nUpdated room with validFrom: " + updatedRoom.ValidFrom + ", validUntil: " + updatedRoom.ValidUntil + " and pstnDialOutEnabled: " + updatedRoom.PstnDialOutEnabled);
```

### List all active rooms

To retrieve all active rooms, use the `GetRoomsAsync` method exposed on the client.

```csharp

// List all active rooms
AsyncPageable<CommunicationRoom> allRooms = roomsClient.GetRoomsAsync();
await foreach (CommunicationRoom currentRoom in allRooms)
{
    Console.WriteLine("\nFirst room id in all active rooms: " + currentRoom.Id);
    break;
}

```

### Add new participants or update existing participants

To add new participants to a room, use the `AddParticipantsAsync` method exposed on the client.

```csharp

List<RoomParticipant> addOrUpdateParticipants = new List<RoomParticipant>();
// Update participant2 from Attendee to Consumer
RoomParticipant participant2 = new RoomParticipant(user2) { Role = ParticipantRole.Consumer };
// Add participant3
CommunicationUserIdentifier user3 = identityClient.CreateUser();
RoomParticipant participant3 = new RoomParticipant(user3) { Role = ParticipantRole.Collaborator };
addOrUpdateParticipants.Add(participant2);
addOrUpdateParticipants.Add(participant3);

Response addOrUpdateParticipantsResponse = await roomsClient.AddOrUpdateParticipantsAsync(roomId, addOrUpdateParticipants);
Console.WriteLine("\nAdded or updated participants to room");

```

When you add participants to a room, they become eligible to join calls. Updated participants  see their new `role` in the call.

## Get list of participants

Retrieve the list of participants for an existing room by referencing the `roomId`:

```csharp

// Get list of participants in room
AsyncPageable<RoomParticipant> existingParticipants = roomsClient.GetParticipantsAsync(roomId);
Console.WriteLine("\nRetrieved participants from room: ");
await foreach (RoomParticipant participant in existingParticipants)
{
    Console.WriteLine($"{participant.CommunicationIdentifier.ToString()},  {participant.Role.ToString()}");
}

```

## Remove participants

To remove a participant from a room and revoke their access, use the `RemoveParticipantsAsync` method.

```csharp

// Remove user from room
List<CommunicationIdentifier> removeParticipants = new List<CommunicationIdentifier>();
removeParticipants.Add(user2);

Response removeParticipantsResponse = await roomsClient.RemoveParticipantsAsync(roomId, removeParticipants);
Console.WriteLine("\nRemoved participants from room");

```

## Delete room

If you wish to disband an existing room, issue an explicit delete request. All rooms and their associated resources are automatically deleted at the end of their validity plus a grace period.

```csharp

// Deletes the specified room
Response deleteRoomResponse = await roomsClient.DeleteRoomAsync(roomId);
Console.WriteLine("\nDeleted room with id: " + roomId);
```

## Run the code

To run the code, make sure you are in the same directory as the `Program.cs` file.

```console

dotnet run

```

The expected output describes each completed action:

```console

Azure Communication Services - Rooms Quickstart

Created a room with id: 99445276259151407

Retrieved room with id: 99445276259151407

Updated room with validFrom: 2023-05-11T22:11:46.784Z, validUntil: 2023-05-21T22:16:46.784Z and pstnDialOutEnabled: true

First room id in all active rooms: 99445276259151407

Added or updated participants to room

Retrieved participants from room:
8:acs:b6aada1f-0b1d-47ac-866f-91aae00a1d01_00000018-ac89-7c76-35f3-343a0d00e901, Presenter
8:acs:b6aada1f-0b1d-47ac-866f-91aae00a1d01_00000018-f00d-aa4b-0cf9-9c3a0d00543e, Consumer
8:acs:b6aada1f-0b1d-47ac-866f-91aae00a1d01_00000018-f00d-aaf2-0cf9-9c3a0d00543f, Collaborator

Removed participants from room

Deleted room with id: 99445276259151407

```

## Reference documentation

Read about the full set of capabilities of Azure Communication Services rooms from the [.NET SDK reference](/dotnet/api/overview/azure/communication.rooms-readme) or [REST API reference](/rest/api/communication/rooms/rooms).