---
title: Quickstart - Turn off local preview mirroring
titleSuffix: An Azure Communication Services Quickstart
description: This quickstart describes how to mirror turn off local preview mirroring
author: yassirbisteni
manager: gaobob

ms.author: yassirb
ms.date: 2/21/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other, devx-track-js

zone_pivot_groups: acs-plat-windows-android-ios
---
# Turn off local preview mirroring

**We’re excited to announce the rollout of the turn off local preview mirroring feature for the native ACS calling experience**
<br/>
<br/>Meeting participants can now choose to stop mirroring their video preview—the small window showing how they appear during meetings.
<br/>This is especially useful for situations like:
<br/>✅ Virtual backgrounds with text – ensuring words appear correctly in your preview.
<br/>✅ Teaching and presenting – making it easier to align your view with what participants see, reducing distractions when writing on a whiteboard or sharing content.
 
## Frequently Asked Questions
1. What is the default setting?
   <br/> By default, your video will be mirrored to you. This matches the familiar experience of front-facing smartphone cameras. However, you can easily toggle mirroring off when joining a meeting.
2. Does this affect my outgoing video?
   <br/> No, this setting only changes your personal view. Others will always see your video as intended, regardless of whether mirroring is on or off.
4. When is this most useful?
   <br/>  This feature is helpful in:
    <br/>  - Gallery & Large Gallery views
    <br/>  - Preview videos
    <br/>  - PowerPoint content sharing & PowerPoint Live
    <br/>  *These views mirror your self-view, but others still see your actual video.
## Quickstart: Turn off local preview mirroring

::: zone pivot="platform-windows"
[!INCLUDE [Turn off local preview mirroring on Windows](./includes/local-preview-mirroring/local-preview-mirroring-windows.md)]
::: zone-end

::: zone pivot="platform-android"
[!INCLUDE [Turn off local preview mirroring on Android](./includes/local-preview-mirroring/local-preview-mirroring-android.md)]
::: zone-end

::: zone pivot="platform-ios"
[!INCLUDE [Turn off local preview mirroring on iOS](./includes/local-preview-mirroring/local-preview-mirroring-ios.md)]
::: zone-end

## Next steps

- [Consume call logs with Azure Monitor](../../concepts/analytics/logs/voice-and-video-logs.md).

## Related articles

- Check out the [calling hero sample](../../samples/calling-hero-sample.md).
- Get started with the [UI Library](../../concepts/ui-library/ui-library-overview.md).
- Learn about [Calling SDK capabilities](./getting-started-with-calling.md?pivots=platform-web).
- Learn more about [how calling works](../../concepts/voice-video-calling/about-call-types.md).
