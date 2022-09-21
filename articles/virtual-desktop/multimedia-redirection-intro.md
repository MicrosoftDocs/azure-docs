---
title: Understanding multimedia redirection on Azure Virtual Desktop - Azure
description: A brief overview of multimedia redirection for Azure Virtual Desktop (preview).
author: Heidilohr
ms.topic: conceptual
ms.date: 09/15/2022
ms.author: helohr
manager: femila
---
# Understanding multimedia redirection for Azure Virtual Desktop

> [!IMPORTANT]
> Multimedia redirection for Azure Virtual Desktop is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

>[!NOTE]
>Azure Virtual Desktop doesn't currently support multimedia redirection on Azure Virtual Desktop for Microsoft 365 Government (GCC), GCC-High environments, and Microsoft 365 DoD.
>
>Multimedia redirection on Azure Virtual Desktop is only available for the Windows Desktop client on Windows 11, Windows 10, or Windows 10 IoT Enterprise devices. Multimedia redirection requires the Windows Desktop client, version 1.2.2999 or later.

Multimedia redirection (MMR) gives you smooth video playback while watching videos in your Azure Virtual Desktop browser. Multimedia redirection remotes the media content from the browser to the local machine for faster processing and rendering. Both Microsoft Edge and Google Chrome support the multimedia redirection feature. However, the public preview version of multimedia redirection for Azure Virtual Desktop has restricted playback on sites in the "Known Sites" list. To test sites on the list within your organization's deployment, you'll need to [enable an extension](multimedia-redirection.md#managing-group-policies-for-the-multimedia-redirection-browser-extension).

## Websites that work with multimedia redirection

The following list shows websites that are known to work with MMR. MMR works on these sites by default, even when you haven't selected the **Enable on all sites** check box.

- YouTube 
- Facebook
- Fox Sports
- IMDB
- Microsoft Learn
- LinkedIn Learning
- Fox Weather
- Yammer
- The Guardian
- Fidelity
- Udemy
- BBC
- Pluralsight
- US News
- BigThink
- InfosecInstitue
- Skillshare
- FlashTalking
- Coursera
- Yahoo
- ESPN
- CNBC
- DailyMail
- CNN
- AWS Training
- Reddit
- Vidazoo
- Vimeo
- iHeart Radio
- UMU
- Twitch.tv
- TikTok
- BrightCove
- AnyClip
- Reuters
- Microsoftstream.com
- Sites with embedded YouTube videos, such as Medium, Udacity, Los Angeles Times, and so on.
- Teams Live Events (on web)
  - Currently, Teams live events aren't media-optimized for Azure Virtual Desktop and Windows 365. MMR is a short-term workaround for a smoother Teams live events playback on Azure Virtual Desktop.  
  - MMR supports Enterprise Content Delivery Network (ECDN) for Teams live events.

### The multimedia redirection status icon

To quickly tell if multimedia redirection is active in your browser, we've added the following icon states:

| Icon State  | Definition  |
|-----------------|-----------------|
| :::image type="content" source="./media/extension-unsupported.png" alt-text="The Azure Virtual Desktop program icon greyed out, indicating that the extension isn't working or isn't supported."::: | A greyed out icon means that either the website doesn't support redirection or the extension isn't loading. |
| :::image type="content" source="./media/extension-disconnect.png" alt-text="The Azure Virtual Desktop program icon with a red square with an x that indicates multimedia redirection isn't working."::: | The red square with an "X" inside of it means that the client can't connect to multimedia redirection. You may need to uninstall and reinstall the extension, then try again. |
| :::image type="content" source="./media/extension-supported.png" alt-text="The default Azure Virtual Desktop program icon with no status applied."::: | The default icon appearance with no status applied. This icon state means that the extension is supported by the website and ready to use. |
| :::image type="content" source="./media/extension-playback.png" alt-text="The Azure Virtual Desktop program icon with a green square with a play button icon inside of it, indicating that multimedia redirection is working."::: | The green square with a play button icon inside of it means that the extension is currently redirecting video playback. |
| :::image type="content" source="./media/extension-webrtc.png" alt-text="The Azure Virtual Desktop program icon with a green square with telephone icon inside of it, indicating that multimedia redirection is working."::: | The green square with a phone icon inside of it means that the extension is currently redirecting a WebRTC call. |
<!--We're going to need images that are consistent sizes. Nicholas will need to get in touch with graphics dept.-->

Selecting the icon will display a pop-up menu that has a checkbox you can select to enable or disable multimedia redirection on all websites. It also lists the version numbers for each component of the service.

You can use the icon to check the status of the extension by following the directions in [Check the extension status](multimedia-redirection.md#check-the-extension-status).

## Support during public preview

If you run into issues while using the public preview version of multimedia redirection, we recommend contacting Microsoft Support.

## Next steps

To learn how to use this feature, see [Multimedia redirection for Azure Virtual Desktop (preview)](multimedia-redirection.md).

To troubleshoot issues or view known issues, see [our troubleshooting article](troubleshoot-multimedia-redirection.md).

If you're interested in video streaming on other parts of Azure Virtual Desktop, check out [Teams for Azure Virtual Desktop](teams-on-avd.md).
