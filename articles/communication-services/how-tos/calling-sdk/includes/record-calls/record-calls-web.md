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
