---
title: include file
description: include file
services: azure-communication-services
author: radubulboaca
manager: mariusu

ms.service: azure-communication-services
ms.date: 07/13/2022
ms.topic: include
ms.custom: include file
ms.author: radubulboaca
---

## Join a room call

> [!NOTE] 
> Rooms can be accessed using the [Azure Communication Services UI Library](https://azure.github.io/communication-ui-library/?path=/docs/rooms--page). The UI Library enables developers to add a call client that is Rooms enabled into their application with only a couple lines of code.

To join a room call, set up your web application using the [Add video calling to your client app](../../voice-video-calling/get-started-with-video-calling.md?pivots=platform-web) guide. Alternatively, you can download the video calling quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/add-1-on-1-video-calling).

Once you have an initialized and authenticated `callAgent`, you may specify a context object with the `roomId` property as the `room` identifier. To join the call, use the `join` method and pass the context instance.

```js

const context = { roomId: '<RoomId>' }

const call = callAgent.join(context);

```

To display the role of the local or remote call participants, subscribe to the handler below.

```js
// Subscribe to changes for your role in a call
 const callRoleChangedHandler = () => {
 	console.log(call.role);
 };

 call.on('roleChanged', callRoleChangedHandler);

// Subscribe to role changes for remote participants
 const subscribeToRemoteParticipant = (remoteParticipant) => {
 	remoteParticipant.on('roleChanged', () => {
 	    console.log(remoteParticipant.role);
 	});
 }
```

The ability to join a room call and display the roles of call participants is available in the Calling JavaScript SDK for web browsers [version 1.7.1-beta.1](https://www.npmjs.com/package/@azure/communication-calling/v/1.7.1-beta.1) and above.

You can learn more about roles of room call participants in the [rooms concept documentation](../../../concepts/rooms/room-concept.md#predefined-participant-roles-and-permissions).
