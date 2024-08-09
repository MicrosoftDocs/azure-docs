---
ms.author: cnwankwo
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/28/2023
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

**For meeting scenario the following API can be called by Microsoft 365 or Communication Services users with the following role**

|APIs| Organizer | Co-Organizer | Presenter | Attendee |
|----------------------------------------------|--------|--------|--------|--------|
| getTeamsMeetingAudioConferencingDetails | ✔️ | ✔️  | ✔️ | ✔️ |

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
        else if (dialInPhoneNumber.countryName) {
            console.log(`Dial-In Country Name: ${dialInPhoneNumber.countryName}`);
        }
        else if (dialInPhoneNumber.cityName) {
            console.log(`Dial-In City Name: ${dialInPhoneNumber.cityName}`);
        }
    })
} catch (e) {
    console.error(e);
}
```
## Troubleshooting
|code| Subcode | Result Category | Reason | Resolution |
|----------------------------------------------|--------|--------|---------|----------|
|400	| 45900 | ExpectedError  | All provided participant IDs are already spotlighted  | Only participants who are not currently spotlighted can be spotlighted |
|400 | 45902	| ExpectedError | The maximum number of spotlighted participants has been reached | Only seven participants can be in the spotlight state at any given time |
|403 | 45903	| ExpectedError | Only participants with the roles of organizer, coorganizer, or presenter can initiate a spotlight. | nsure that the participant invoking the `startSpotlight` API holds the role of organizer, co-organizer, or presenter |