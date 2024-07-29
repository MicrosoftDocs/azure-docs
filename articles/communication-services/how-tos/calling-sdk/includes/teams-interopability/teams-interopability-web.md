---
author: tophpalmer
ms.service: azure-communication-services
ms.topic: include
ms.date: 08/10/2021
ms.author: chpalm
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Meeting join methods
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