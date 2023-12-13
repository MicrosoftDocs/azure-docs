author: karanmish
title: Local recording notification for Teams
titleSuffix: An Azure Communication Services tutorials document
description: Show local recording notifications to users joining Teams calls or Teams meetings
ms.subservice: teams-interop
ms.service: azure-communication-services
ms.topic: tutorial
ms.date: 09/08/2021
ms.author: karanmishra
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

### Local recording notification for Teams
> [!NOTE]
> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment. To use this api please use 'beta' release of Azure Communication Services Calling Web SDK.

Terms of use for Azure Communication Services require developers to show notification to the users, if they are being recorded. Microsoft Teams application allows Teams users to record Teams calls and Teams meetings in the cloud and on Teams desktop app also locally. Developers can use Azure Communication Services Calling SDK to identify whether local or cloud recording has started or stopped. 

Azure Communication Services Calling SDK provides object `Call` to manage calls, that has dedicated features for local recording `LocalRecordingCallFeature` and cloud recording `RecordingCallFeature `. Developers need to implement both features to provide a compliant solution.
You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the local recording feature API object from the call instance:

```js
const localCallRecordingApi = call.feature(Features.LocalRecording);
```

Then, to check if the call is being recorded locally, inspect the `isRecordingActive` property of `callRecordingApi`. It returns `Boolean`.

```js
const isLocalRecordingActive = localCallRecordingApi.isLocalRecordingActive;
```

You can also get a list of local recordings by using the `recordings` property of `callRecordingApi`. It returns `LocalRecordingInfo[]`.

```js
const recordings = localCallRecordingApi.recordings;

recordings.forEach(r => {
    console.log("Microsoft 365 user ID: ${r.initiatorIdentifier?.microsoftTeamsUserId}, State: ${r.state});
```

You can subscribe to recording changes:

```js
const isLocalRecordingActiveChangedHandler = () => {
    console.log(localCallRecordingApi.isLocalRecordingActive);
};    

localCallRecordingApi.on('isLocalRecordingActiveChanged', isLocalRecordingActiveChangedHandler);
```

You can also subscribe to 'localRecordingsUpdated' and get a collection of updated recordings. This event is triggered whenever there is a recording update

```js
const localRecordingsUpdateddHandler = (args: { added: SDK.LocalRecordingInfo[], removed: SDK.LocalRecordingInfo[]}) => {
                        console.log('Local recording started by: ');
                        args.added?.forEach(a => {
                            console.log('Microsoft 365 user ID: ${a.initiatorIdentifier?.microsoftTeamsUserId});
                        });

                        console.log('Local recording stopped by: ');
                        args.removed?.forEach(r => {
                            console.log('Microsoft 365 user ID: ${r.initiatorIdentifier?.microsoftTeamsUserId});
                        });
                    };
localCallRecordingApi.on('localRecordingsUpdated', localRecordingsUpdateddHandler);
```
