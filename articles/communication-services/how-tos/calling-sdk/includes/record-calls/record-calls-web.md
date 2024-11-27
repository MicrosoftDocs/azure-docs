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

### Cloud recording

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
 
If your Teams meeting or call is configured to require explicit consent for recording and transcription, you are required to gather explicit consent from your users to be transcribed or Recorded.
 
### Support
The following tables show support of explicit consent for specific call type and identity.
 
|Identities                   | Teams meeting | Room | 1:1 call | Group call | 1:1 Teams interop call | Group Teams interop call |
|-----------------------------|---------------|------|----------|------------|------------------------|--------------------------|
|Communication Services user  | ✔️            |      |          |            |                       |  ✔️                       |
|Microsoft 365 user           | ✔️            |      |          |            |                       | ✔️                      |
 
 
 You can check if the meeting recording requires explicit consent by property `isConsentRequired`. If the value is set to `true`, then explicit consent is required for the call.
 
```js
const isConsentRequired = callRecordingApi.isConsentRequired;
```
 
If the recording is active and explicit consent is required, user will not be able to unmute, turn video on and share screen until they provide the consent. You can provide the consent for the user by using the api `consentToBeingRecordedAndTranscribed`.
 
```js
callRecordingApi.consentToBeingRecordedAndTranscribed();
```

