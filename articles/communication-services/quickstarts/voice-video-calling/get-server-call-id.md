---
ms.date: 09/07/2022 
ms.topic: quickstart
author: dbasantes
title: Get server Call ID
ms.author: dbasantes
ms.service: azure-communication-services
ms.custom: devx-track-js
description: This section describes how to get the serverCallid from a JavaScript server app
---


# Get serverCallId as a requirement for call recording server APIs from JavaScript application

In a peer to peer calling scenario using the [Calling client SDK](get-started-with-video-calling.md), in order to use Call Recording from Azure Communications you'll have to get the `serverCallId`.
The following example shows you how to get the `serverCallId` from a JavaScript server application.

Call recording is an extended feature of the core Call API. You first need to import calling Features from the Calling SDK.

```JavaScript
import { Features} from "@azure/communication-calling";
```
Then you can get the recording feature API object from the call instance:

```JavaScript
const callRecordingApi = call.feature(Features.Recording);
```
Subscribe to recording changes:

```JavaScript
const recordingStateChanged = () => {
    let recordings = callRecordingApi.recordings;

    let state = SDK.RecordingState.None;
    if (recordings.length > 0) {
        state = recordings.some(r => r.state == SDK.RecordingState.Started)
            ? SDK.RecordingState.Started
            : SDK.RecordingState.Paused;
    }
    
	console.log(`RecordingState: ${state}`);
}

const recordingsChangedHandler = (args: { added: SDK.RecordingInfo[], removed: SDK.RecordingInfo[]}) => {
    args.added?.forEach(a => {
        a.on('recordingStateChanged', recordingStateChanged);
    });

    args.removed?.forEach(r => {
        r.off('recordingStateChanged', recordingStateChanged);
    });

    recordingStateChanged();
};

callRecordingApi.on('recordingsUpdated', recordingsChangedHandler);
```
Get `servercallId`, which can be used to start/stop/pause/resume recording sessions.
Once the call is connected, use the `getServerCallId` method to get the server call ID.

```JavaScript
callAgent.on('callsUpdated', (e: { added: Call[]; removed: Call[] }): void => {
    e.added.forEach((addedCall) => {
        addedCall.on('stateChanged', (): void => {
            if (addedCall.state === 'Connected') {
                addedCall.info.getServerCallId().then(result => {
                    dispatch(setServerCallId(result));
                }).catch(err => {
                    console.log(err);
                });
            }
        });
    });
});
```

## See also

For more information, see the following articles:

- Learn about [Calling SDK capabilities]()
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md)
