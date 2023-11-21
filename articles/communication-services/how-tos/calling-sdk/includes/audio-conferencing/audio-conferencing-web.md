ms.author: cnwankwo
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
try {
     const details: SDK.TeamsMeetingAudioConferencingDetails = audioConferencingFeature.getTeamsMeetingAudioConferencingDetails();
     console.log(`Microsoft Teams Meeting Conference Id: ${details.phoneConferenceId}`);
     details.phoneNumbers.forEach(dialInPhoneNumber => {
        if (dialInPhoneNumber.tollPhoneNumber) { 
             console.log(`Dial-In Toll PhoneNumber: ${dialInPhoneNumber.tollPhoneNumber.phoneNumber}`);
        }
        else if (dialInPhoneNumber.tollFreePhoneNumber) { 
            console.log(`Dial-In TollFree PhoneNumber: ${dialInPhoneNumber.tollFreePhoneNumber.phoneNumber}`);
        } 
    })
} catch (e) {
    console.error(e);
}
```
