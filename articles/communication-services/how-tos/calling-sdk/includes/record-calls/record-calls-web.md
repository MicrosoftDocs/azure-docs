---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

> [!NOTE]
> This API is provided as a preview for developers and might change based on feedback that we receive. Don't use this API in a production environment. To use this API, use the beta release of the Azure Communication Services Calling Web SDK.

### Cloud and compliance recording

Call recording is an extended feature of the core Call API. You first need to import calling features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the recording features' API object from the call instance:

```js
const callRecordingApi = call.feature(Features.Recording);
```

To check if the call is being recorded, inspect the `isRecordingActive` property of `callRecordingApi`. It returns `Boolean`.

```js
const isRecordingActive = callRecordingApi.isRecordingActive;
```

You can also subscribe to recording changes:

```js
const isRecordingActiveChangedHandler = () => {
    console.log(callRecordingApi.isRecordingActive);
};

callRecordingApi.on('isRecordingActiveChanged', isRecordingActiveChangedHandler);
```

You can get a list of recordings by using the `recordings` property of `callRecordingApi`. It returns `RecordingInfo[]`, which has the current state of the cloud recording.

```js
const recordings = callRecordingApi.recordings;

recordings.forEach(r => {
    console.log("State: ${r.state}");
```

You can also subscribe to `recordingsUpdated` and get a collection of updated recordings. This event is triggered whenever there's a recording update.

```js
const cloudRecordingsUpdatedHandler = (args: { added: SDK.RecordingInfo[], removed: SDK.RecordingInfo[]}) => {
                        console.log('Recording started by: ');
                        args.added?.forEach(a => {
                            console.log('State: ${a.state}');
                        });

                        console.log('Recording stopped by: ');
                        args.removed?.forEach(r => {
                            console.log('State: ${r.state}');
                        });
                    };
callRecordingApi.on('recordingsUpdated', cloudRecordingsUpdatedHandler );
```
## Explicit Consent
When your Teams meeting or call is configured to require explicit consent for recording and transcription, you're required to collect consent from all participants in the call before you can record them. You can provide consent proactively when joining the meeting or reactively when the recording starts. Until explicit consent is given, participants' audio, video, and screen sharing will be disabled during recording.
 
You can check if the meeting recording requires explicit consent by property `isTeamsConsentRequired`. If the value is set to `true`, then explicit consent is required for the `call`.
 
```js
const isConsentRequired = callRecordingApi.isTeamsConsentRequired;
```

If you have already obtained the user's consent for recording, you can call `grantTeamsConsent()` method to indicate explicit consent to the service. This consent is valid for one `call` session only and users need to provide consent again if they rejoin the meeting.
 
```js
callRecordingApi.grantTeamsConsent();
```

Attempts to enable audio, video, or screen sharing fail when recording is active, explicit consent is required but isn't yet given. You can recognize this situation by checking property `reason` of class `ParticipantCapabilities` for [capabilities](../../capabilities.md) `turnVideoOn`, `unmuteMic` and `shareScreen`. You can find those [capabilities](../../capabilities.md) in the feature `call.feature(Features.Capabilities)`. Those [capabilities](../../capabilities.md) would return reason `ExplicitConsentRequired` as users need to provide explicit consent.
