---
title: include file
description: include file
services: azure-communication-services
author: orwatson
manager: alexokun

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/23/2023
ms.topic: include
ms.custom: include file
ms.author: orwatson
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
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

Create a new file `index.js` where the code for this quickstart will be added.

### Install the packages

You'll need to use the Azure Communication Rooms client library for JavaScript [version 1.0.0](https://www.npmjs.com/package/@azure/communication-rooms) or above.

Use the `npm install` command to install the below Communication Services SDKs for JavaScript.

```console
npm install @azure/communication-rooms --save
```

### Set up the app framework

In the `index.js` file add the following code. We will be adding the code for the quickstart in the `main` function.

``` javascript
const { RoomsClient } = require('@azure/communication-rooms');

const main = async () => {
  console.log("Azure Communication Services - Rooms Quickstart")

  // Quickstart code goes here

};

main().catch((error) => {
  console.log("Encountered an error");
  console.log(error);
})
```

## Initialize a room client

Create a new `RoomsClient` object that will be used to create new `rooms` and manage their properties and lifecycle. The connection string of your `Communications Service` will be used to authenticate the request. For more information on connection strings, see [this page](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

Add the following code in `index.js` inside the `main` function.

```javascript
const connectionString =
    process.env["COMMUNICATION_CONNECTION_STRING"] ||
    "endpoint=https://<resource-name>.communication.azure.com/;<access-key>";

// create RoomsClient
const roomsClient = new RoomsClient(connectionString);
```

## Create a room

### Set up room participants

In order to set up who can join a room, you'll need to have the list of the identities of those users. You can follow the instructions [here](../../identity/access-tokens.md?pivots=programming-language-javascript) for creating users and issuing access tokens. Alternatively, if you want to create the users on demand, you can create them using the `CommunicationIdentityClient`.

To use the CommunicationIdentityClient, install the following npm package:

```console
npm install @azure/communication-identity --save
```

Also, add the following required package at the top of your `index.js` file:

```javascript
const { CommunicationIdentityClient } = require('@azure/communication-identity');
```

Now, the `CommunicationIdentityClient` can be initialized and used to create users:

```javascript
// create identities for users
const identityClient = new CommunicationIdentityClient(connectionString);
const user1 = await identityClient.createUserAndToken(["voip"]);
const user2 = await identityClient.createUserAndToken(["voip"]);
```

Then, create the list of room participants by referencing those users:

```javascript
const participants = [
  {
      id: user1.user,
      role: "Presenter",
  },
  {
    id: user2.user,
    role: "Consumer",
  }
]
```

### Initialize the room
Create a new `room` using the `participants` defined in the code snippet above:

```javascript
// Create a room
var validFrom = new Date(Date.now());
var validUntil = new Date(validFrom.getTime() + 60 * 60 * 1000);
var pstnDialOutEnabled = false;

const createRoomOptions = {
  validFrom,
  validUntil,
  pstnDialOutEnabled,
  participants
};

const createRoom = await roomsClient.createRoom(createRoomOptions);
const roomId = createRoom.id;
console.log("\nCreated a room with id: ", roomId);
```
*pstnDialOutEnabled is currently in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

Since `rooms` are server-side entities, you may want to keep track of and persist the `roomId` in the storage medium of choice. You can reference the `roomId` to view or update the properties of a `room` object.

### Enable PSTN Dial Out Capability for a Room (Currently in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/))
Each `room` has PSTN dial out disabled by default. The PSTN dial out can be enabled for a `room` at creation, by defining the `pstnDialOutEnabled` parameter as true. This capability may also be modified for a `room` by issuing an update request for the `pstnDialOutEnabled` parameter.

```javascript
// Create a room with PSTN dial out capability
var pstnDialOutEnabled = true;
const createRoomOptions = {
  pstnDialOutEnabled,
};

const createRoom = await roomsClient.createRoom(createRoomOptions);
console.log("\nCreated a room with PSTN dial out enabled: ", createRoom.pstnDialOutEnabled);

// Update a room to enable or disable PSTN dial out capability
pstnDialOutEnabled = false;
const updateRoomOptions = {
  pstnDialOutEnabled,
};

const updateRoom = await roomsClient.updateRoom(roomId, updateRoomOptions);
console.log("\nUpdated a room with PSTN dial out enabled: ", updateRoom.pstnDialOutEnabled);

```

## Get properties of an existing room

Retrieve the details of an existing `room` by referencing the `roomId`:

```javascript
// Retrieve the room with corresponding ID
const getRoom = await roomsClient.getRoom(roomId);
console.log("\nRetrieved room with id: ", getRoom.id);
```

## Update the lifetime of a room

The lifetime of a `room` can be modified by issuing an update request for the `validFrom` and `validUntil` parameters. A room can be valid for a maximum of six months.

```javascript
// Update room lifetime
validFrom.setTime(validUntil.getTime());
validUntil.setTime(validFrom.getTime() + 5 * 60 * 1000);
pstnDialOutEnabled = true;
// request payload to update a room
const updateRoomOptions = {
  validFrom,
  validUntil,
  pstnDialOutEnabled,
};

const updateRoom = await roomsClient.updateRoom(roomId, updateRoomOptions);
console.log("\nUpdated room with validFrom: ", updateRoom.validFrom, ", validUntil: ", updateRoom.validUntil, " and pstnDialOutEnabled: ", updateRoom.pstnDialOutEnabled);
```

## Get list of rooms
Retrieve your list of rooms by using the `listRooms` method:

```javascript
const roomsList = await roomsClient.listRooms();
console.log("\nRetrieved list of rooms; printing first room:");
for await (const currentRoom of roomsList) {
  // access room data here
  console.log(currentRoom);
  break;
}

```

## Add or update participants

To add new participants to a `room`, use the `addOrUpdateParticipants` method exposed on the client. This method will also update a participant if they already exist in the room.

```javascript
// Add and update participants
// request payload to add and update participants
const addOUpdateParticipantsList = [
  {
      id: user1.user,
      role: "Presenter",
  },
  {
    id: user2.user,
    role: "Consumer",
  }
]

// add user2 to the room and update user1 to Presenter role
await roomsClient.addOrUpdateParticipants(roomId, addOUpdateParticipantsList);
console.log("\nAdded and updated participants in the room");
```

Participants that have been added to a `room` become eligible to join calls.

## Get list of participants

Retrieve the list of participants for an existing `room` by referencing the `roomId`:

```javascript
const participantsList = await roomsClient.listParticipants(roomId);
console.log("\nRetrieved participants for room:");
for await (const participant of participantsList) {
  // access participant data here
  console.log(participant);
}
```

## Remove participants

To remove a participant from a `room` and revoke their access, use the `removeParticipants` method.

```javascript
// Remove both users from the room
const removeParticipantsList = [user1.user, user2.user]

// remove both users from the room with the request payload
await roomsClient.removeParticipants(roomId, removeParticipantsList);
console.log("\nRemoved participants from room");
```

## Delete room
If you wish to disband an existing `room`, you may issue an explicit delete request. All `rooms` and their associated resources are automatically deleted at the end of their validity plus a grace period.

```javascript
// Deletes the specified room
await roomsClient.deleteRoom(roomId);
console.log("\nDeleted room with id: ", roomId)
```

## Run the code

To run the code, make sure you are on the directory where your `index.js` file is.

```console
node index.js
```

The expected output describes each completed action:

```console
Azure Communication Services - Rooms QuickStart

Created a room with id:  99445276259151407

Retrieved room with id:  99445276259151407

Updated room with validFrom:  2023-05-11T22:11:46.784Z, validUntil:  2023-05-11T22:16:46.784Z and pstnDialOutEnabled: true

Retrieved list of rooms; printing first room:

{
  id: "99445276259151407",
  createdAt: "2023-05-11T22:11:50.784Z",
  validFrom: "2023-05-11T22:11:46.784Z",
  validUntil: "2023-05-11T22:16:46.784Z"
}

Added and updated participants in the room

Retrieved participants for room:
{
  id: {
    kind: 'communicationUser',
    communicationUserId: '8:acs:b6aada1f-0b1d-47ac-866f-91aae00a1d01_00000018-ac89-7c76-35f3-343a0d00e901'
  },
  role: 'Presenter'
}
{
  id: {
    kind: 'communicationUser',
    communicationUserId: '8:acs:b6aada1f-0b1d-47ac-866f-91aae00a1d01_00000018-ac89-7ccc-35f3-343a0d00e902'
  },
  role: 'Consumer'
}

Removed participants from room

Deleted room with id:  99445276259151407
```

## Reference documentation

Read about the full set of capabilities of Azure Communication Services rooms from the [JavaScript SDK reference](/javascript/api/overview/azure/communication-rooms-readme) or [REST API reference](/rest/api/communication/rooms/rooms).
