---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of Azure Communication Services Calling Web SDK.

### Cloud Recording

Call recording is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the recording feature API object from the call instance:

```js
const callRecordingApi = call.feature(Features.Recording);
```

Then, to check if the call is being recorded, inspect the `isRecordingActive` property of `callRecordingApi`. It returns `Boolean`.

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

You can also get a list of recordings by using the `recordings` property of `callRecordingApi`. It returns `RecordingInfo[]` which will have the displayName of the user and current state of the cloud recording.

```js
const recordings = callRecordingApi.recordings;

recordings.forEach(r => {
    console.log("User: ${r.displayName}, State: ${r.state});
```

You can also subscribe to 'recordingsUpdated' and get a collection of updated recordings. This event is triggered whenever there is a recording update

```js
const cloudRecordingsUpdatedHandler = (args: { added: SDK.RecordingInfo[], removed: SDK.RecordingInfo[]}) => {
                        console.log('Recording started by: ');
                        args.added?.forEach(a => {
                            console.log('User: ${a.displayName}');
                        });

                        console.log('Recording stopped by: ');
                        args.removed?.forEach(r => {
                            console.log('User: ${r.displayName});
                        });
                    };
callRecordingApi.on('recordingsUpdated', cloudRecordingsUpdatedHandler );
```
