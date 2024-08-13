---
ms.author: cnwankwo
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/28/2023
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
|400	| 45950 | ExpectedError  | Audio conferencing feature is available only in Teams meetings | Join Teams meeting with configured Audio conferencing |
|405 | 45951	| ExpectedError | ACS service disabled audio conferencing |  Create Azure Support ticket to request assistance |
|403 | 45952	| ExpectedError | Audio conferencing details aren't available before joining the meeting  | Ensure that the call object is in the `connected` state before invoking the API to retrieve the audio conferencing details |
|403 | 45953	| ExpectedError | Audio conferencing details aren't available in lobby  | Ensure that the call object is in the `connected` state before invoking the API to retrieve the audio conferencing details |
