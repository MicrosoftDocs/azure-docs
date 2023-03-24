---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 03/24/2023
ms.author: elavarasidc
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

Capabilities feature is an extended feature of the core `Call` API and allows you to obtain the capabilities of the local participant in the current call.

Do I have permission to turn videoOn, do I have permission to turn micOn, do I have permission to share screen are some example of participant capabilities that you can learn from the capabilities property. Learning the capabilities, can help build an user interface that only shows the buttons related to the actions the local user has permission to.

The feature allows you to register for an event listener, to listen to capability changes.

In order to obtain the capabilities of the localParticipant in a call, you first need to obtain the Capabilities feature API object:

```js
const capabilitiesFeature = call.feature(Features.Capabilities);
```
Then, the capabilities of the local participant can be obtained through the capabilities property. This hsa the type of `ParticipantCapabilities` which has the following members:

- `isPresent` is capability present.
- `reason` capability resolution reasoning.

```js
let capabilities: ParticipantCapabilities = capabilitiesFeature.capabilities;
```
Also, you can subscribe to the `capabilitiesChanged` event to know when the capabilities has changed.

```js
const capabilitiesChangedHandler = () => {
    // Get the latest updated capabilities of the local participant
    let capabilities = callDominantSpeakersApi.capabilities;
};
capabilitiesFeature.on('capabilitiesChanged', capabilitiesChangedHandler);
```
#### Handle the Dominant Speaker's video streams

Your application can use the `Capabilities` feature to get the capabilities of the localParticipant and keep updating UI whenever capabilities change of hte user changes. This can be achieved with the following code example.

```js
  // Capabilities Feature
  const capabilitiesFeature =  this.call.feature(Features.Capabilities);
  const capabilities =  this.call.feature(Features.Capabilities).capabilities;

  capabilitiesFeature.on('capabilitiesChanged', () => {
    const updatedCapabilities  = capabilitiesFeature.capabilities;
    // If screen share capability has changed then update the state to refresh UI and enable/disable share screen button
    if (this.state.canShareScreen != updatedCapabilities.shareScreen.isPresent) {
        this.setState({ canShareScreen: updatedCapabilities.shareScreen.isPresent });
    }
  });
```
