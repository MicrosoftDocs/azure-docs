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

- *isPresent* indicates if a capability is present.
- *reason* indicates capability resolution reason.

```js
const capabilities =  capabilitiesFeature.capabilities;
```

**Subscribe to `capabilitiesChanged` event:**
```js
capabilitiesFeature.on('capabilitiesChanged', (capabilitiesChangeInfo) => {
    for (const [key, value] of Object.entries(capabilitiesChangeInfo.newValue)) {
        if(key === 'turnVideoOn' && value.reason != 'FeatureNotSupported') {
             (value.isPresent) ? this.setState({ canOnVideo: true }) : this.setState({ canOnVideo: false });
             continue;
        }
        if(key === 'unmuteMic' && value.reason != 'FeatureNotSupported') {
            (value.isPresent) ? this.setState({ canUnMuteMic: true }) : this.setState({ canUnMuteMic: false });
            continue;
        }
        if(key === 'shareScreen' && value.reason != 'FeatureNotSupported') {
            (value.isPresent) ? this.setState({ canShareScreen: true }) : this.setState({ canShareScreen: false });
            continue;
        }
        if(key === 'spotlightParticipant' && value.reason != 'FeatureNotSupported') {
            (value.isPresent) ? this.setState({ canSpotlight: true }) : this.setState({ canSpotlight: false });
            continue;
        }
        if(key === 'raiseHand' && value.reason != 'FeatureNotSupported') {
            (value.isPresent) ? this.setState({ canRaiseHands: true }) : this.setState({ canRaiseHands: false });
            continue;
        }
        if(key === 'muteOthers' && value.reason != 'FeatureNotSupported') {
            (value.isPresent) ? this.setState({ canMuteOthers: true }) : this.setState({ canMuteOthers: false });
            continue;
        }
        if(key === 'reaction' && value.reason != 'FeatureNotSupported') {
            (value.isPresent) ? this.setState({ canReact: true }) : this.setState({ canReact: false });
            continue;
        }
        if(key === 'forbidOthersAudio' && value.reason != 'FeatureNotSupported') {
            (value.isPresent) ? this.setState({ canForbidOthersAudio: true }) : this.setState({ canForbidOthersAudio: false });
            continue;
        }
        if(key === 'forbidOthersVideo' && value.reason != 'FeatureNotSupported') {
            (value.isPresent) ? this.setState({ canForbidOthersVideo: true }) : this.setState({ canForbidOthersVideo: false });
            continue;
        }
    }
});
```

**Capabilities Exposed**
- *turnVideoOn*: Ability to turn on video
- *unmuteMic*: Ability to send audio
- *shareScreen*: Ability to share screen
- *removeParticipant*: Ability to remove a participant
- *hangUpForEveryOne*: Ability to hang up for everyone
- *addCommunicationUser*: Ability to add a communication user
- *addTeamsUser*: Ability to add Teams User
- *addPhoneNumber*: Ability to add phone number
- *manageLobby*: Ability to manage lobby (beta only)
- *spotlightParticipant*: Ability to spotlight Participant (beta only)
- *removeParticipantsSpotlight*: Ability to remove Participant spotlight (beta only)
- *startLiveCaptions*: Ability to start live captions (beta only)
- *stopLiveCaptions*: Ability to stop live captions (beta only)
- *raiseHand*: Ability to raise hand (beta only)
- *muteOthers*: Ability to soft mute remote participant(s) in the meeting 
- *reaction*: Ability to react in the meeting (beta only)
- *viewAttendeeNames*: Ability to view attendee names in the meeting
- *forbidOthersAudio*: Ability to forbid attendees' audio in the meeting or group call
- *forbidOthersVideo*: Ability to forbid attendees' video in the meeting or group call
