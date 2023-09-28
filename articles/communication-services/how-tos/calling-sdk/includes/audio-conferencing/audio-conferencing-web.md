author: cnwankwo
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/28/2023
ms.author: cnwankwo
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

TeamsMeetingAudioConferencing is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the feature API object from the call instance:

```js
const audioConferencingFeature = call.feature(Features.TeamsMeetingAudioConferencing);
```

### Get the audio conferencing details of a meeting
Use the following API, to get the audio conferencing details of a meeting
```js
const details: SDK.TeamsMeetingAudioConferencingDetails = audioConferencingFeature.getTeamsMeetingAudioConferencingDetails();
console.log(`Meeting Conference Id: ${details.phoneConferenceId}`);

if (details.phoneNumbers[0].tollPhoneNumber) { 
    this.elements.teamsMeetingAudioConferencingDetails.innerHTML +=
    `<h3> Toll Number: ${details.phoneNumbers[0].tollPhoneNumber.phoneNumber}</h3>`;
}

if (details.phoneNumbers[0].tollFreePhoneNumber) { 
    this.elements.teamsMeetingAudioConferencingDetails.innerHTML +=
    `<h3> TollFree Number: ${details.phoneNumbers[0].tollFreePhoneNumber.phoneNumber}</h3>`;
}
```