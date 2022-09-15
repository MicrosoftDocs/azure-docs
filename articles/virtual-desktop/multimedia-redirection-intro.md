---
title: Multimedia redirection on Azure Virtual Desktop overview - Azure
description: A brief overview of multimedia redirection for Azure Virtual Desktop (preview).
author: Heidilohr
ms.topic: conceptual
ms.date: 09/15/2022
ms.author: helohr
manager: femila
---
# What is multimedia redirection for Azure Virtual Desktop?

> [!IMPORTANT]
> Multimedia redirection for Azure Virtual Desktop is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

>[!NOTE]
>Azure Virtual Desktop doesn't currently support multimedia redirection on Azure Virtual Desktop for Microsoft 365 Government (GCC), GCC-High environments, and Microsoft 365 DoD.
>
>Multimedia redirection on Azure Virtual Desktop is only available for the Windows Desktop client on Windows 11, Windows 10, or Windows 10 IoT Enterprise devices. Multimedia redirection requires the Windows Desktop client, version 1.2.2999 or later.

Multimedia redirection (MMR) gives you smooth video playback while watching videos in your Azure Virtual Desktop browser. Multimedia redirection remotes the media content from the browser to the local machine for faster processing and rendering. Both Microsoft Edge and Google Chrome support the multimedia redirection feature. However, the public preview version of multimedia redirection for Azure Virtual Desktop has restricted playback on sites in the "Known Sites" list. To test sites on the list within your organization's deployment, you'll need to [enable an extension](#managing-group-policies-for-the-multimedia-redirection-browser-extension).

## Websites that work with MMR 

The following list shows websites that are known to work with MMR. MMR is supposed to work on these sites by default, when you haven't selected the **Enable on all sites** check box.

- YouTube 
- Facebook
- Fox Sports
- IMDB
- [Microsoft Learn](/learn)
- LinkedIn Learning
- Fox Weather
- Yammer
- The Guardian
- Fidelity
- Udemy
- BBC
- Pluralsight
- Sites with embedded YouTube videos, such as Medium, Udacity, Los Angeles Times, and so on.
- Teams Live Events (on web)
  - Currently, Teams live events aren't media-optimized for Azure Virtual Desktop and Windows 365. MMR is a short-term workaround for a smoother Teams live events playback on Azure Virtual Desktop.  
  - MMR supports Enterprise Content Delivery Network (ECDN) for Teams live events.


### The multimedia redirection status icon

To quickly tell if multimedia redirection is active in your browser, we've added the following icon states:

| Icon State  | Definition  |
|-----------------|-----------------|
| ![The default Azure Virtual Desktop program icon with no status applied.](./media/icon-default.png) | The default icon appearance with no status applied. |
| ![The Azure Virtual Desktop program icon with a red square with an x that indicates multimedia redirection isn't working.](./media/icon-disconnect.png) | The red square with an "X" inside of it means that the client couldn't connect to multimedia redirection. |
| ![The Azure Virtual Desktop program icon with a green square with a check mark inside of it, indicating that multimedia redirection is working.](./media/icon-connect.png) | The green square with a check mark inside of it means that the client successfully connected to multimedia redirection. |

Selecting the icon will display a pop-up menu that has a checkbox you can select to enable or disable multimedia redirection on all websites. It also lists the version numbers for each component of the service.

## Support during public preview

If you run into issues while using the public preview version of multimedia redirection, we recommend contacting Microsoft Support.

## Next steps

To learn how to use this feature, see [Multimedia redirection for Azure Virtual Desktop (preview)](multimdia-redirection.md).

To troubleshoot issues or view known issues, see [our troubleshooting article](troubleshoot-multimedia-redirection.md).

If you're interested in video streaming on other parts of Azure Virtual Desktop, check out [Teams for Azure Virtual Desktop](teams-on-avd.md).
