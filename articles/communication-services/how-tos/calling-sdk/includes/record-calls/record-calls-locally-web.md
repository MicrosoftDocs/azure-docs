---
author: karanmish
title: Local recording notification for Teams
titleSuffix: An Azure Communication Services article
description: Show local recording notifications to users who join Teams calls or Teams meetings.
ms.subservice: teams-interop
ms.service: azure-communication-services
ms.topic: tutorial
ms.date: 09/08/2021
ms.author: karanmishra
---

### Local recording notification for Teams

Terms of use for Azure Communication Services require developers to show a notification to users who are being recorded. The Microsoft Teams application allows users to record calls and meetings in the cloud and on the Teams desktop app. Developers can use the Azure Communication Services Calling SDK to identify whether cloud or local recording has started or stopped.

The Azure Communication Services Calling SDK provides a `Call` object to manage calls. It has dedicated features for local recording (`LocalRecordingCallFeature`) and cloud recording (`RecordingCallFeature`). Developers need to implement both features to provide a compliant solution.

You first need to import calling features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the local recording features' API object from the call instance:

```js
const localCallRecordingApi = call.feature(Features.LocalRecording);
```

To check if the call is being recorded locally, inspect the `isLocalRecordingActive` property of `localCallRecordingApi`. It returns `Boolean`.

```js
const isLocalRecordingActive = localCallRecordingApi.isLocalRecordingActive;
```

You can also get a list of local recordings by using the `localRecordings` property of `localCallRecordingApi`. It returns `LocalRecordingInfo[]`, which has the display name of the user and the current state of the local recording.

```js
const recordings = localCallRecordingApi.localRecordings;

recordings.forEach(r => {
    console.log("User: ${r.displayName}, State: ${r.state}");
```

You can subscribe to recording changes:

```js
const isLocalRecordingActiveChangedHandler = () => {
    console.log(localCallRecordingApi.isLocalRecordingActive);
};    

localCallRecordingApi.on('isLocalRecordingActiveChanged', isLocalRecordingActiveChangedHandler);
```

You can also subscribe to `localRecordingsUpdated` and get a collection of updated recordings. This event is triggered whenever there's a recording update.

```js
const localRecordingsUpdatedHandler = (args: { added: SDK.LocalRecordingInfo[], removed: SDK.LocalRecordingInfo[]}) => {
                        console.log('Local recording started by: ');
                        args.added?.forEach(a => {
                            console.log('User: ${a.displayName}');
                        });

                        console.log('Local recording stopped by: ');
                        args.removed?.forEach(r => {
                            console.log('User: ${r.displayName}');
                        });
                    };
localCallRecordingApi.on('localRecordingsUpdated', localRecordingsUpdatedHandler);
```
