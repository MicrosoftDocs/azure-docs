---
title: PowerPoint Live
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to view PowerPoint Live presentations.
author: jamescadd
manager: chpalm
ms.author: jacadd
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 11/10/2023
ms.custom: template-how-to
---

# View PowerPoint Live presentations
In this article, you learn how to implement viewing a [PowerPoint Live presentation in Microsoft Teams](https://support.microsoft.com/en-us/office/present-from-powerpoint-live-in-microsoft-teams-28b20e74-7165-499c-9bd4-0ad975d448ad) using the Azure Communication Services Calling SDKs. Attendees who use Azure Communication Services Calling SDKs to [join a Microsoft Teams meeting](./teams-interoperability.md) can view PowerPoint Live presentations and interact with [reactions](./reactions.md) and [raise hand](./raise-hand.md). The attendee view automatically maintains synchronization with the current slide of the Microsoft Teams presenter.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

PowerPoint Live viewing is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```js
import { Features}  from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance:

```js
const pptLive = call.feature(SDK.Features.PPTLive);
```

### Handle presentation state changes
With the `PPTLiveCallFeature` API, you can subscribe to the `isActiveChanged` event to handle changes to the state of a PowerPoint Live presentation on a call. This event is triggered by a presenter in Microsoft Teams and `isActive` indicates if PowerPoint Live is active in the current call.

```js
pptLive.on('isActiveChanged', pptliveStateChangedHandler);
```

### Start and stop presentation viewing
Add the `target` element to your HTML when the presentation starts and remove it when the presentation stops.

```js
const pptliveStateChangedHandler = () => {
    if (pptLive.isActive) {
        document.getElementById('pptLiveElement').appendChild(pptLive.target);
    } else {
        const pptLiveElement = document.getElementById('pptLiveElement');
        pptLiveElement.removeChild(pptLiveElement.lastElementChild);
    }
};
```

### Stop handling presentation state changes
Your application can unsubscribe from `isActiveChanged` to stop listening to presentation events.

```js
pptLive.off('isActiveChanged', pptliveStateChangedHandler);
```

### Key things to know when using PowerPoint Live viewing
- Switching to [screen sharing](./manage-calls.md) is recommended if any issues are experienced with PowerPoint Live viewing.
- PowerPoint Live is supported in the Web Calling SDK.
- PowerPoint Live is supported for Microsoft Teams Meeting interoperability.
- Microsoft Teams must be used to present PowerPoint Live.

## Next steps
- [Learn how to manage calls and use screen sharing](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to use reactions](./reactions.md)
- [Learn how to use raise hand](./raise-hand.md)