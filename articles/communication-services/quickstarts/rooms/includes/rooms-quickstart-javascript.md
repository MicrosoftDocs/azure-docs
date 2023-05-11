---
title: include file
description: include file
services: azure-communication-services
author: radubulboaca
manager: mariusu

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 09/08/2022
ms.topic: include
ms.custom: include file
ms.author: antonsamson
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

You'll need to use the Azure Communication Rooms client library for JavaScript [version 1.0.0-beta.1](https://www.npmjs.com/package/@azure/communication-rooms) or above. 

Use the `npm install` command to install the below Communication Services SDKs for JavaScript.

```console
npm install @azure/communication-rooms --save
npm install @azure/communication-identity --save
```

## Initialize a room client

Create a new `RoomsClient` object that will be used to create new `rooms` and manage their properties and lifecycle. The connection string of your `Communications Service` will be used to authenticate the request. For more information on connection strings, see [this page](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

`index.js`
```javascript
const { CommunicationIdentityClient } = require('@azure/communication-identity');
const { RoomsClient } = require('@azure/communication-rooms');

const connectionString =
    process.env["COMMUNICATION_CONNECTION_STRING"] ||
    "endpoint=https://<resource-name>.communication.azure.com/;<access-key>";

const identityClient = new CommunicationIdentityClient(connectionString);
const user1 = await identityClient.createUserAndToken(["voip"]);
const user2 = await identityClient.createUserAndToken(["voip"]);

// create RoomsClient
const roomsClient = new RoomsClient(connectionString);
```

## Create a room

Create a new `room` with default properties using the code snippet below:

```javascript
// options payload to create a room
const createRoomOptions = {
  validFrom: validFrom,
  validUntil: validUntil,
  roomJoinPolicy: "InviteOnly",
  participants: [
    {
      id: user1.user,
      role: "Attendee",
    },
  ]
};
  
// create a room with the request payload
const createRoom = await roomsClient.createRoom(createRoomOptions);
const roomId = createRoom.id;
```

Since `rooms` are server-side entities, you may want to keep track of and persist the `roomId` in the storage medium of choice. You can reference the `roomId` to view or update the properties of a `room` object.

## Run the code



## Reference documentation

Read about the full set of capabilities of Azure Communication Services rooms from the [JavaScript SDK reference](/javascript/api/overview/azure/communication-rooms-readme) or [REST API reference](/rest/api/communication/rooms).
