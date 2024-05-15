---
title: Manage call recording on the client
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to manage call recording on the client.
author: tophpalmer
ms.author: chpalm
ms.service: azure-communication-services
ms.topic: how-to
ms.subservice: calling 
ms.date: 08/10/2021
ms.custom: template-how-to
zone_pivot_groups: acs-plat-web-ios-android-windows

#Customer intent: As a developer, I want to manage call recording on the client so that my users can record calls.
---

# Manage call recording on the client

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

[Call recording](../../concepts/voice-video-calling/call-recording.md) lets your users record calls that they make with Azure Communication Services. In this article, you learn how to manage recording on the client side. Before you start, you need to set up recording on the [server side](../../quickstarts/voice-video-calling/call-recording-sample.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Completion of the [quickstart to add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md).

::: zone pivot="platform-web"
[!INCLUDE [Record Calls Client-side JavaScript](./includes/record-calls/record-calls-web.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Record calls client-side Android](./includes/record-calls/record-calls-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Record calls client-side iOS](./includes/record-calls/record-calls-ios.md)]
::: zone-end

::: zone pivot="platform-windows"
[!INCLUDE [Record calls client-side Windows](./includes/record-calls/record-calls-windows.md)]
::: zone-end

### Compliance recording

Compliance recording is recording that's based on Microsoft Teams policy. You can enable it by using this tutorial: [Introduction to Teams policy-based recording for callings](/microsoftteams/teams-recording-policy).

Policy-based recording starts automatically when a user who has the policy joins a call. To get a notification from Azure Communication Services about recording, use the following code:

```js
const callRecordingApi = call.feature(Features.Recording);

const isComplianceRecordingActive = callRecordingApi.isRecordingActive;

const isComplianceRecordingActiveChangedHandler = () => {
    console.log(callRecordingApi.isRecordingActive);
};

callRecordingApi.on('isRecordingActiveChanged', isComplianceRecordingActiveChangedHandler);
```

You can also implement compliance recording by using a custom recording bot. See the [GitHub example](https://github.com/microsoftgraph/microsoft-graph-comms-samples/tree/a3943bafd73ce0df780c0e1ac3428e3de13a101f/Samples/BetaSamples/LocalMediaSamples/ComplianceRecordingBot).

## Next steps

- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to transcribe calls](./call-transcription.md)
