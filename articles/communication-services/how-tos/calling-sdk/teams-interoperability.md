---
title: Join a Teams meeting
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to join a Teams meeting.
author: tophpalmer
ms.author: chpalm
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.topic: how-to 
ms.date: 08/10/2021
ms.custom: template-how-to

#Customer intent: As a developer, I want to join a Teams meeting.
---

# Join a teams meeting

Azure Communication Services SDKs can allow your users to join regular Microsoft Teams meetings. Here's how!

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

To join a Teams meeting, use the `join` method and pass a meeting link or a meeting's coordinates.

Join by using a meeting link:

```js
const locator = { meetingLink: '<MEETING_LINK>'}
const call = callAgent.join(locator);
```

Join by using meeting coordinates (this is currently in limited preview):

```js
const locator = {
    threadId: <thread id>,
    organizerId: <organizer id>,
    tenantId: <tenant id>,
    messageId: <message id>
}
const call = callAgent.join(locator);
```

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to transfer calls](./transfer-calls.md)
