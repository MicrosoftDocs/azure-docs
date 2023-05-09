---
title: Understanding multimedia redirection on Azure Virtual Desktop - Azure
description: An overview of multimedia redirection on Azure Virtual Desktop.
author: Heidilohr
ms.topic: conceptual
ms.date: 04/11/2023
ms.author: helohr
manager: femila
---
# Understanding multimedia redirection for Azure Virtual Desktop

> [!IMPORTANT]
> Multimedia Redirection Call Redirection is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Multimedia redirection redirects media content from Azure Virtual Desktop to your local machine for faster processing and rendering. Both Microsoft Edge and Google Chrome support this feature.

Multimedia redirection has two key components:

- Video playback redirection, which optimizes video playback experience for streaming sites and websites with embedded videos like YouTube and Facebook. For more information about which sites are compatible with this feature, see [Video playback redirection](#video-playback-redirection).
- WebRTC call redirection (preview), which optimizes audio calls for WebRTC-based calling apps like Content Guru Storm. For more information about which sites are compatible with this feature, see [Call redirection](#call-redirection).

## Prerequisites

In order to use multimedia redirection for Azure Virtual Desktop, you need:

- The Windows Desktop client.
- A Windows 11, Windows 10, or Windows 10 IoT Enterprise device.

To use multimedia redirection video playback redirection, you must install [Windows Desktop client, version 1.2.3916 or later](whats-new-client-windows.md). This feature is only compatible with version 1.2.3916 or later of the Windows Desktop client.

To use MMR WebRTC call redirection, you must install the Windows Desktop client, version 1.2.4237 or later with Insider releases enabled.

> [!NOTE]
> MMR isn't supported on Azure Virtual Desktop for Microsoft 365 Government (GCC), GCC-High environments, and Microsoft 365 DoD.

## Websites that work with multimedia redirection

The following lists show websites that are known to work with MMR. MMR works with these sites by default.

### Video playback redirection

The following sites work with video playback redirection:

:::row:::
   :::column span="":::
      - AnyClip
      - AWS Training
      - BBC
      - Big Think
      - Bleacher Report
      - Brightcove
      - CNBC
      - Coursera
      - Daily Mail
      - Facebook
      - Fidelity
   :::column-end:::
   :::column span="":::
      - Flashtalking
      - Fox Sports
      - Fox Weather
      - IMDB
      - Infosec Institute
      - LinkedIn Learning
      - Microsoft Learn
      - Microsoft Stream
      - NBC Sports
      - The New York Times
      - Pluralsight
      - Politico
      - Reuters
   :::column-end:::
   :::column span="":::
      - Skillshare
      - The Guardian
      - Twitch
      - Twitter
      - Udemy
      - UMU
      - U.S. News
      - Vidazoo
      - Vimeo
      - The Wall Street Journal
      - Yahoo
      - Yammer
      - YouTube (including sites with embedded YouTube videos).
   :::column-end:::
:::row-end:::

### Call redirection

The following sites work with call redirection:

- WebRTC Sample Site 
- Content Guru Storm 
- Intermedia AnyMeeting 
- Dynamics 365 Omnichannel Voice

Microsoft Teams live events aren't media-optimized for Azure Virtual Desktop and Windows 365 when using the native Teams app. However, if you use Teams live events with a supported browser, MMR is a workaround that provides smoother Teams live events playback on Azure Virtual Desktop. MMR supports Enterprise Content Delivery Network (ECDN) for Teams live events.

### The multimedia redirection status icon

To quickly tell if multimedia redirection is active in your browser, we've added the following icon states:

| Icon State  | Definition  |
|-----------------|-----------------|
| :::image type="content" source="./media/mmr-extension-unsupported.png" alt-text="The MMR extension icon greyed out, indicating that the website can't be redirected or the extension isn't loading."::: | A greyed out icon means that multimedia content on the website can't be redirected or the extension isn't loading. |
| :::image type="content" source="./media/mmr-extension-disconnect.png" alt-text="The MMR extension icon with a red square with an x that indicates the client can't connect to multimedia redirection."::: | The red square with an "X" inside of it means that the client can't connect to multimedia redirection. You may need to uninstall and reinstall the extension, then try again. |
| :::image type="content" source="./media/mmr-extension-supported.png" alt-text="The MMR extension icon with no status applied."::: | The default icon appearance with no status applied. This icon state means that multimedia content on the website can be redirected and is ready to use. |
| :::image type="content" source="./media/mmr-extension-playback.png" alt-text="The MMR extension icon with a green square with a play button icon inside of it, indicating that multimedia redirection is working."::: | The green square with a play button icon inside of it means that the extension is currently redirecting video playback. |
| :::image type="content" source="./media/mmr-extension-webrtc.png" alt-text="The MMR extension icon with a green square with telephone icon inside of it, indicating that multimedia redirection is working."::: | The green square with a phone icon inside of it means that the extension is currently redirecting a WebRTC call. This icon also appears when the service is redirecting both video playback and calls at the same time. |

Selecting the icon in your browser will display a pop-up menu where it lists the features supported on the current page, you can select to enable or disable video playback redirection and WebRTC call redirection on all websites and collect logs. It also lists the version numbers for each component of the service.

You can use the icon to check the status of the extension by following the directions in [Check the extension status](multimedia-redirection.md#check-the-extension-status).

## Next steps

To learn how to use this feature, see [Multimedia redirection for Azure Virtual Desktop](multimedia-redirection.md).

To troubleshoot issues or view known issues, see [our troubleshooting article](troubleshoot-multimedia-redirection.md).

If you're interested in video streaming on other parts of Azure Virtual Desktop, check out [Teams for Azure Virtual Desktop](teams-on-avd.md).
