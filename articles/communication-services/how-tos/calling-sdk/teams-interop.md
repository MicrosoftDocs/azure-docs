---
title: Join a Teams meeting
description: Use Azure Communication Services SDKs to join a Teams meeting.
author: probableprime
ms.author: rifox
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 08/10/2021
ms.custom: template-how-to

#Customer intent: As a developer, I want to join a Teams meeting.
---

# Join a teams meeting

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of ACS Calling Web SDK

To join a Teams meeting, use the `join` method and pass a meeting link or a meeting's coordinates.

Join by using a meeting link:

```js
const locator = { meetingLink: '<MEETING_LINK>'}
const call = callAgent.join(locator);
```

Join by using meeting coordinates:

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
<!-- Add a context sentence for the following links -->
- 