---
title: Understanding multimedia redirection on Azure Virtual Desktop - Azure
description: An overview of multimedia redirection on Azure Virtual Desktop.
author: Heidilohr
ms.topic: conceptual
ms.date: 04/07/2023
ms.author: helohr
manager: femila
---
# Understanding multimedia redirection for Azure Virtual Desktop

Multimedia redirection (MMR) gives you smooth video playback while watching videos in a browser in Azure Virtual Desktop. Multimedia redirection redirects the media content from Azure Virtual Desktop to your local machine for faster processing and rendering. Both Microsoft Edge and Google Chrome support this feature. 

> [!NOTE]
> Multimedia redirection on Azure Virtual Desktop is only available for the [Windows Desktop client, version 1.2.3916 or later](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-whatsnew). on Windows 11, Windows 10, or Windows 10 IoT Enterprise devices.

## Websites that work with multimedia redirection

The following list shows websites that are known to work with MMR. MMR works with these sites by default.

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

Microsoft Teams live events aren't media-optimized for Azure Virtual Desktop and Windows 365 when using the native Teams app. However, if you use Teams live events with a supported browser, MMR is a workaround that provides smoother Teams live events playback on Azure Virtual Desktop. MMR supports Enterprise Content Delivery Network (ECDN) for Teams live events.

### The multimedia redirection status icon

To quickly tell if multimedia redirection is active in your browser, we've added the following icon states:

| Icon State  | Definition  |
|-----------------|-----------------|
| :::image type="content" source="./media/mmr-extension-unsupported.png" alt-text="The MMR extension icon greyed out, indicating that the website can't be redirected or the extension isn't loading."::: | A greyed out icon means that multimedia content on the website can't be redirected or the extension isn't loading. |
| :::image type="content" source="./media/mmr-extension-disconnect.png" alt-text="The MMR extension icon with a red square with an x that indicates the client can't connect to multimedia redirection."::: | The red square with an "X" inside of it means that the client can't connect to multimedia redirection. You may need to uninstall and reinstall the extension, then try again. |
| :::image type="content" source="./media/mmr-extension-supported.png" alt-text="The MMR extension icon with no status applied."::: | The default icon appearance with no status applied. This icon state means that multimedia content on the website can be redirected and is ready to use. |
| :::image type="content" source="./media/mmr-extension-playback.png" alt-text="The MMR extension icon with a green square with a play button icon inside of it, indicating that multimedia redirection is working."::: | The green square with a play button icon inside of it means that the extension is currently redirecting video playback. |
| :::image type="content" source="./media/mmr-extension-webrtc.png" alt-text="The MMR extension icon with a green square with telephone icon inside of it, indicating that multimedia redirection is working."::: | The green square with a phone icon inside of it means that the extension is currently redirecting a WebRTC call. |

Selecting the icon in your browser will display a pop-up menu where it lists the features supported on the current page, you can select to enable or disable multimedia redirection on all websites, and collect logs. It also lists the version numbers for each component of the service.

You can use the icon to check the status of the extension by following the directions in [Check the extension status](multimedia-redirection.md#check-the-extension-status).

## Next steps

To learn how to use this feature, see [Multimedia redirection for Azure Virtual Desktop](multimedia-redirection.md).

To troubleshoot issues or view known issues, see [our troubleshooting article](troubleshoot-multimedia-redirection.md).

If you're interested in video streaming on other parts of Azure Virtual Desktop, check out [Teams for Azure Virtual Desktop](teams-on-avd.md).
