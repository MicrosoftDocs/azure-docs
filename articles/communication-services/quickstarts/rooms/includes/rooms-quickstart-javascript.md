---
title: include file
description: include file
services: azure-communication-services
author: orwatson
manager: alexokun

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 04/28/2023
ms.topic: include
ms.custom: include file
ms.author: orwatson
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- Two or more Communication User Identities. [Create and manage access tokens](../../identity/access-tokens.md?pivots=programming-language-csharp) or [Quick-create identities for testing](../../identity/quick-create-identity.md).
- The latest versions of [Node.js](https://nodejs.org/en/download/) Active LTS and Maintenance LTS versions.

## Sample code

You can review and download the sample code for this quick start on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/rooms-quickstart).

## Setting up

### Create a new web application
In a terminal or console window, create a new folder for your application and navigate to it.

```console
mkdir acs-rooms-quickstart && cd acs-rooms-quickstart
```

Run `npm init` to create a package.json file with default settings.

```console
npm init -y
```

### Install the packages

Use the `npm install` command to install the below Communication Services SDKs for JavaScript.

```console
npm install @azure/communication-rooms --save
npm install @azure/communication-identity --save
```

### Initialize a room client

Create a new `RoomsClient` object that will be used to create new `rooms` and manage their properties and lifecycle. The connection string of your `Communications Service` will be used to authenticate the request. For more information on connection strings, see [this page](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

```javascript
const connectionString =
    process.env["COMMUNICATION_CONNECTION_STRING"] ||
    "endpoint=https://<resource-name>.communication.azure.com/;<access-key>";

const identityClient = new CommunicationIdentityClient(connectionString);
const user1 = await identityClient.createUserAndToken(["voip"]);
const user2 = await identityClient.createUserAndToken(["voip"]);

// create RoomsClient
const roomsClient = new RoomsClient(connectionString);
```

### Create a room

Create a new `room` with default properties using the code snippet below:

```javascript
let validFrom = new Date(Date.now());
let validForDays = 3;
let validUntil = new Date(validFrom.getTime());
validUntil.setDate(validFrom.getTime() + validForDays);

// options payload to create a room
const createRoomOptions = {
  validFrom: validFrom,
  validUntil: validUntil,
  participants: [
    {
      id: user1.user
    },
  ]
};
  
// create a room with the request payload
const createRoom = await roomsClient.createRoom(createRoomOptions);
const roomId = createRoom.id;
```

Since `rooms` are server-side entities, you may want to keep track of and persist the `roomId` in the storage medium of choice. You can reference the `roomId` to view or update the properties of a `room` object.

### Get properties of an existing room

Retrieve the details of an existing `room` by referencing the `roomId`:

```javascript
// retrieves the room with corresponding ID
const getRoom = await roomsClient.getRoom(roomId);
```

### Update the lifetime of a room

The lifetime of a `room` can be modified by issuing an update request for the `validFrom` and `validUntil` parameters. A room can be valid for a maximum of six months.

```javascript
validFrom = new Date(Date.now());
validForDays = 30;
validUntil = new Date(validFrom.getTime());
validUntil.setDate(validFrom.getTime() + validForDays);

// request payload to update a room
const updateRoomOptions = {
  validFrom: validFrom,
  validUntil: validUntil
};

// updates the specified room with the request payload
const updateRoom = await roomsClient.updateRoom(roomId, updateRoomOptions);
```

### Get list of rooms
Retrieve your list of rooms by using the `listRooms` method:

```javascript
const roomsList = await roomsClient.listRooms();
for await (const currentRoom of roomsList) {
  // access room data
  console.log(`The room id is ${currentRoom.id}.`);
}
```

### Add new participants

To add new participants to a `room`, use the `addOrUpdateParticipants` method exposed on the client. This method will also update a participant if they already exist in the room.

```javascript
  // request payload to add participants
  const addParticipantsList = {
    participants: [
      {
        id: user2.user,
        role: "Consumer",
      },
    ],
  };

  // add user2 to the room with the request payload
  const addParticipants = await roomsClient.addOrUpdateParticipants(roomId, addParticipantsList);
```

Participants that have been added to a `room` become eligible to join calls.

### Get list of participants

Retrieve the list of participants for an existing `room` by referencing the `roomId`:

```javascript
  const participantsList = await roomsClient.listParticipants(roomId);
  for await (const participant of participantsList) {
    // access participant data
    console.log(`The participant's role is ${participant.role}.`);
  }
```

### Remove participants

To remove a participant from a `room` and revoke their access, use the `removeParticipants` method.

```javascript
  const participantsToRemove = [user1.user, user2.user];
  await roomsClient.removeParticipants(roomId, participantsToRemove);
```

### Delete room
If you wish to disband an existing `room`, you may issue an explicit delete request. All `rooms` and their associated resources are automatically deleted at the end of their validity plus a grace period. 

```javascript
// deletes the specified room
await roomsClient.deleteRoom(roomId);
```

## Reference documentation

Read about the full set of capabilities of Azure Communication Services rooms from the [JavaScript SDK reference](/javascript/api/overview/azure/communication-rooms-readme) or [REST API reference](/rest/api/communication/rooms).
