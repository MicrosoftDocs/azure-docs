---
author: elavarasid
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/24/2023
ms.author: elavarasid
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

Capabilities feature is an extended feature of the core `Call` API and allows you to obtain the capabilities of the local participant in the current call.

Do I have permission to turn videoOn, do I have permission to turn micOn, do I have permission to share screen are some example of participant capabilities that you can learn from the capabilities property. Learning the capabilities, can help build a user interface that only shows the buttons related to the actions the local user has permission to.

The feature allows you to register for an event listener, to listen to capability changes.

**Register to capabilities feature:**
>```js
>const capabilitiesFeature = this.call.feature(Features.Capabilities);
>```

**Get the capabilities of the local participant:**
Capabilities object has the capabilities of the local participants and is of type `ParticipantCapabilities`. Properties of Capabilities include:

- `isPresent` represent if a capability is present.
- `reason` capability resolution reason.

>```js
>const capabilities =  capabilitiesFeature.capabilities;
>```

**Subscribe to `capabilitiesChanged` event:**
>```js
>capabilitiesFeature.on('capabilitiesChanged', () => {
>  const updatedCapabilities  = capabilitiesFeature.capabilities;
>  // If screen share capability has changed then update the state to refresh UI and disable share screen button
>  if (this.state.canShareScreen != updatedCapabilities.shareScreen.isPresent) {
>    this.setState({ canShareScreen: updatedCapabilities.shareScreen.isPresent });
>  }
>});
>```
