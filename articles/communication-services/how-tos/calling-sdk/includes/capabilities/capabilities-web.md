---
author: elavarasidc
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/24/2023
ms.author: elavarasid
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

Capabilities feature is an extended feature of the core `Call` API and allows you to obtain the capabilities of the local participant in the current call.


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

**Capabilities Exposed**
> - *manageBreakOutRoom*:	    Ability to manage break out room
> - *muteUnmuteMic*:	        Ability to mute and unmute Mic
> - *removeParticipant*:	    Ability to remove a participant
> - *shareApplication*:	        Ability to share an application
> - *shareBrowserTab*:	        Ability to share a browser tab
> - *shareScreen*:              Ability to share screen
