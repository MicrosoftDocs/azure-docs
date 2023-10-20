---
title: Understanding multimedia redirection on Azure Virtual Desktop - Azure
description: An overview of multimedia redirection on Azure Virtual Desktop.
author: Heidilohr
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: helohr
manager: femila
---
# Understanding multimedia redirection for Azure Virtual Desktop

> [!IMPORTANT]
> Call redirection is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Multimedia redirection redirects media content from Azure Virtual Desktop to your local machine for faster processing and rendering. Both Microsoft Edge and Google Chrome support this feature when using the Windows Desktop client.

Multimedia redirection has two key components:

- Video playback redirection, which optimizes video playback experience for streaming sites and websites with embedded videos like YouTube and Facebook. For more information about which sites are compatible with this feature, see [Video playback redirection](#video-playback-redirection).
- Call redirection (preview), which optimizes audio calls for WebRTC-based calling apps. For more information about which sites are compatible with this feature, see [Call redirection](#call-redirection).

  Call redirection only affects the connection between the local client device and the telephony app server, as shown in the following diagram.

  :::image type="content" source="media/multimedia-redirection-intro/call-redirection.png" alt-text="A diagram depicting the relationship between the telephony web app server, the Azure Virtual Desktop user, the web app, and other callers." lightbox="media/multimedia-redirection-intro/call-redirection.png":::

  Call redirection offloads WebRTC calls from session hosts to local client devices to reduce latency and improve call quality. However, after the connection is established, call quality becomes dependent on the website or app providers just as it would with a non-redirected call.

## Websites that work with multimedia redirection

The following lists show websites that are known to work with multimedia redirection. Multimedia redirection works with these sites by default.

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
      - Coursera\*
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
      - LinkedIn Learning\*
      - Microsoft Learn\*
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
      - Udemy\*
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

\* Multimedia redirection only supports non-DRM content on these sites. Any digital rights managed content can only be played with regular video playback without multimedia redirection.

### Call redirection

The following websites work with call redirection:

- [WebRTC Sample Site](https://webrtc.github.io/samples)

Microsoft Teams live events aren't media-optimized for Azure Virtual Desktop and Windows 365 when using the native Teams app. However, if you use Teams live events with a browser that supports Teams live events and multimedia redirection, multimedia redirection is a workaround that provides smoother Teams live events playback on Azure Virtual Desktop. Multimedia redirection supports Enterprise Content Delivery Network (ECDN) for Teams live events.

### Check if multimedia redirection is active

To quickly tell if multimedia redirection is active in your browser, we've added the following icon states:

| Icon State  | Definition  |
|-----------------|-----------------|
| :::image type="content" source="./media/mmr-extension-unsupported.png" alt-text="The multimedia redirection extension icon greyed out, indicating that the website can't be redirected or the extension isn't loading."::: | A greyed out icon means that multimedia content on the website can't be redirected or the extension isn't loading. |
| :::image type="content" source="./media/mmr-extension-disconnect.png" alt-text="The multimedia redirection extension icon with a red square with an x that indicates the client can't connect to multimedia redirection."::: | The red square with an "X" inside of it means that the client can't connect to multimedia redirection. You may need to uninstall and reinstall the extension, then try again. |
| :::image type="content" source="./media/mmr-extension-supported.png" alt-text="The multimedia redirection extension icon with no status applied."::: | The default icon appearance with no status applied. This icon state means that multimedia content on the website can be redirected and is ready to use. |
| :::image type="content" source="./media/mmr-extension-playback.png" alt-text="The multimedia redirection extension icon with a green square with a play button icon inside of it, indicating that multimedia redirection is working."::: | The green square with a play button icon inside of it means that the extension is currently redirecting video playback. |
| :::image type="content" source="./media/mmr-extension-webrtc.png" alt-text="The multimedia redirection extension icon with a green square with telephone icon inside of it, indicating that multimedia redirection is working."::: | The green square with a phone icon inside of it means that the extension is currently redirecting a WebRTC call. This icon also appears when both video playback and calls are being redirected at the same time. |

Selecting the icon in your browser will display a pop-up menu where it lists the features supported on the current page. You can select to enable or disable video playback redirection and call redirection on all websites, and collect logs. It also lists the version numbers for each component of multimedia redirection.

You can use the icon to check the status of the extension by following the directions in [Check the extension status](multimedia-redirection.md#check-the-extension-status).

## Next steps

To learn how to use this feature, see [Multimedia redirection for Azure Virtual Desktop](multimedia-redirection.md).

To troubleshoot issues or view known issues, see [our troubleshooting article](troubleshoot-multimedia-redirection.md).

If you're interested in video streaming on other parts of Azure Virtual Desktop, check out [Teams for Azure Virtual Desktop](teams-on-avd.md).
