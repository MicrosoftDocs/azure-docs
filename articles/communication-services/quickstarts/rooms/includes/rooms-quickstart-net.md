---
title: include file
description: include file
services: azure-communication-services
author: peiliu
manager: alexokun

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 04/20/2023
ms.topic: include
ms.custom: include file
ms.author: peiliu
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
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
dotnet add package Azure.Communication.Identity
dotnet add package Azure.Communication.Rooms
```
You'll need to use the Azure Communication Rooms client library for .NET [version 1.0.0-beta.2](https://www.nuget.org/packages/Azure.Communication.Rooms/1.0.0-beta.2) or above.

### Set up the app framework

In the `Program.cs` file, add the following code to import the required namespaces and create the basic program structure.

```csharp

using System;
using Azure;
using Azure.Core;
using Azure.Communication.Identity;

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

Create a new `RoomsClient` object that will be used to create new `rooms` and manage their properties and lifecycle. The connection string of your `Communications Service` will be used to authenticate the request. For more information on connection strings, see [this page](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

```csharp

// Find your Communication Services resource in the Azure portal
var connectionString = "<connection_string>";
RoomsClient roomsClient = new RoomsClient(connectionString);

// create identities for users
var client = new CommunicationIdentityClient(connectionString);
var user1 = await client.CreateUserAndTokenAsync(scopes: new[] { CommunicationTokenScope.VoIP });
var user2 = await client.CreateUserAndTokenAsync(scopes: new[] { CommunicationTokenScope.VoIP });

```

## Create a room

Create a new `room` with default properties using the code snippet below:

```csharp

//Create a room
List roomParticipants = new List<RoomParticipant>();
roomParticipants.Add(new RoomParticipant(new CommunicationUserIdentifier(user1.Value.User.Id), RoleType.Presenter));


RoomParticipant participant1 = new RoomParticipant(new CommunicationIdentifier("<CommunicationUserId1>")) { Role = ParticipantRole.Presenter };
RoomParticipant participant2 = new RoomParticipant(new CommunicationIdentifier("<CommunicationUserId2>")) { Role = ParticipantRole.Attendee };

List<RoomParticipant> participants = new List<RoomParticipant>();

participants.Add(participant1);
participants.Add(participant2);

DateTimeOffset validFrom = DateTimeOffset.UtcNow;
DateTimeOffset validUntil = validFrom.AddDays(1);
CancellationToken cancellationToken = new CancellationTokenSource().Token;

CommunicationRoom createdRoom = await roomsClient.CreateRoomAsync(validFrom, validUntil, participants, cancellationToken);
string roomId = createdRoom.Id;
Console.WriteLine("\nCreated room with id: " + roomId);

```

Since `rooms` are server-side entities, you may want to keep track of and persist the `roomId` in the storage medium of choice. You can reference the `roomId` to view or update the properties of a `room` object.

## Get properties of an existing room

Retrieve the details of an existing `room` by referencing the `roomId`:

```csharp

// Retrieve the room with corresponding ID
CommunicationRoom getRoomResponse = await roomsClient.GetRoomAsync(roomId);
Console.WriteLine("\Retrieved room with id: " + getRoomResponse.Id);

```

## Update the lifetime of a room

The lifetime of a `room` can be modified by issuing an update request for the `ValidFrom` and `ValidUntil` parameters. A room can be valid for a maximum of six months.

```csharp

//Update room lifetime
DateTimeOffset  validFrom = new DateTime(2022, 05, 01, 00, 00, 00, DateTimeKind.Utc);
DateTimeOffset  validUntil = validFrom.AddDays(1);

CommunicationRoom updatedRoom = await roomsClient.UpdateRoomAsync(roomId, validFrom, validUntil, cancellationToken);
Console.WriteLine("\nUpdated room with validFrom: " + updatedRoom.ValidFrom + " and validUntil: " + updatedRoom.ValidUntil);
```

### List all created rooms

To retrieve all created rooms, use the `GetRoomsAsync` method exposed on the client.

```csharp
AsyncPageable<CommunicationRoom> allCreatedRooms = await roomsClient.GetRoomsAsync();
List<CommunicationRoom> allCreatedRoomsList = await allParticipants.ToEnumerableAsync();
```

### Add new participants or update existing participants

To add new participants to a `room`, use the `AddParticipantsAsync` method exposed on the client.

```csharp
// Add participants
List<RoomParticipant> participants = new List<RoomParticipant>();
RoomParticipant participant2 = new RoomParticipant(new CommunicationIdentifier("<CommunicationUserId2>")) { Role = ParticipantRole.Consumer }; // Update participant2 from Attendee to Consumer
RoomParticipant participant3 = new RoomParticipant(new CommunicationIdentifier("<CommunicationUserId3>")) { Role = ParticipantRole.Attendee }; // Add participant3

Response addOrUpdateParticipantsResponse = await roomsClient.AddOrUpdateParticipantsAsync(roomId, participants);
```

Participants that have been added to a `room` become eligible to join calls. Participants that have been updated will see their new `role` in the call.

## Get list of participants

Retrieve the list of participants for an existing `room` by referencing the `roomId`:

```csharp
// Get list of participants in room
AsyncPageable<RoomParticipant> existingParticipants = await roomsClient.GetParticipantsAsync(roomId);
List<RoomParticipant> existingParticipantsList = await allParticipants.ToEnumerableAsync();
```

## Remove participants

To remove a participant from a `room` and revoke their access, use the `RemoveParticipantsAsync` method.

```csharp
// Remove user from room
var communicationUser = user2.Value.User.Id;

List<CommunicationIdentifier> participants = new List<CommunicationIdentifier>();
participants.Add(new CommunicationUserIdentifier(communicationUser));

Response removeParticipantsResponse = await roomsClient.RemoveParticipantsAsync(roomId, participants);
await roomsClient.removeParticipants(roomId, removeParticipantsList);
Console.WriteLine("\nRemoved participants from room");

```

## Delete room
If you wish to disband an existing `room`, you may issue an explicit delete request. All `rooms` and their associated resources are automatically deleted at the end of their validity plus a grace period.

```csharp

// Deletes the specified room
Response deleteRoomResponse = await RoomCollection.DeleteRoomAsync(createdRoomId);
```

## Run the code

To run the code, make sure you are on the directory where your `Program.cs` file is.

```console

dotnet run

```

The expected output describes each completed action:

```console

Azure Communication Services - Rooms Quickstart

Created a room with id:  99445276259151407

Retrieved room with id:  99445276259151407

Updated room with validFrom:  2023-05-11T22:11:46.784Z  and validUntil:  2023-05-11T22:16:46.784Z

Added participants to room

Retrieved participants for room:  [
  {
    id: {
      kind: 'communicationUser',
      communicationUserId: '8:acs:b6aada1f-0b1d-47ac-866f-91aae00a1d01_00000018-ac89-7c76-35f3-343a0d00e901'
    },
    role: 'Attendee'
  },
  {
    id: {
      kind: 'communicationUser',
      communicationUserId: '8:acs:b6aada1f-0b1d-47ac-866f-91aae00a1d01_00000018-ac89-7ccc-35f3-343a0d00e902'
    },
    role: 'Consumer'
  }
]

Removed participants from room

Deleted room with id:  99445276259151407

```

## Reference documentation

Read about the full set of capabilities of Azure Communication Services re [.NET SDK reference](/dotnet/api/azure.communication.rooms) or [REST API reference](/rest/api/communication/rooms).
ooms from th