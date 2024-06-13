---
title: Manager role assignments
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to track assigned Teams meeting role.
author: tomaschladek
ms.author: tchladek
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 04/03/2023
---

# How to manage Teams meeting role

In this article, you learn how users that joined Teams meetings or Room can learn the currently assigned role and manage role change.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

## Join Teams meeting
In the following code, you learn how to create `CallClient` and `CallAgent`, which are necessary for the next steps. Then we join the Teams meeting, which creates a `Call` instance.

```js
const { CallClient } = require('@azure/communication-calling');
const { AzureCommunicationTokenCredential} = require('@azure/communication-common');

const userToken = '<USER_TOKEN>';
callClient = new CallClient();
const tokenCredential = new AzureCommunicationTokenCredential(userToken);
const callAgent = await callClient.createCallAgent(tokenCredential);
const deviceManager = await callClient.getDeviceManager();

const meetingCall = callAgent.join({ meetingLink: '<MEETING_LINK>' });
```

## Learn the current role

You create a 'Call' instance when you join the Teams meeting or Room with calling SDK. This object has a property `role` that can have one of the following values:
- Unknown
- Attendee
- Presenter
- Organizer
- Consumer

```js
const role = meetingCall.role;
```

## Subscribe to role changes

During the Teams meeting or Room, your role can be changed. To learn about the change, subscribe to an event, `roleChanged`, on the `Call` object.

```js
meetingCall.on('roleChanged', args => {
   role = meetingCall.role;
   // Update UI
}
```

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)
