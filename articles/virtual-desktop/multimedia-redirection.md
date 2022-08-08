---
title: Multimedia redirection on Azure Virtual Desktop - Azure
description: How to use multimedia redirection for Azure Virtual Desktop (preview).
author: Heidilohr
ms.topic: how-to
ms.date: 04/29/2022
ms.author: helohr
manager: femila
---
# Multimedia redirection for Azure Virtual Desktop (preview)

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

### How to use MMR for Teams live events 

To use MMR for Teams live events:

1. First, open the link to the Teams event in either a Microsoft Edge or Google Chrome browser.

2. Make sure you can see a green check mark next to the [multimedia redirection status icon](#the-multimedia-redirection-status-icon). If the green check mark is there, MMR is enabled for Teams live events.

3. Select **Watch on the web instead**. The Teams live event should automatically start playing in your browser. Make sure you only select **Watch on the web instead**, as shown in the following screenshot. If you use the Teams app, MMR won't work.

The following screenshot highlights the areas described in the previous steps:

:::image type="content" source="./media/teams-live-events.png" alt-text="A screenshot of the 'Watch the live event in Microsoft Teams' page. The status icon and 'watch on the web instead' options are highlighted in red.":::

## Requirements

Before you can use Multimedia Redirection on Azure Virtual Desktop, you'll need
to do these things:

1. [Install the Windows Desktop client](/windows-server/remote/remote-desktop-services/clients/windowsdesktop) on a Windows 11, Windows 10, or Windows 10 IoT Enterprise device that meets the [hardware requirements for Teams on a Windows PC](/microsoftteams/hardware-requirements-for-the-teams-app#hardware-requirements-for-teams-on-a-windows-pc/). Installing version 1.2.2999 or later of the client will also install the multimedia redirection plugin (MsMmrDVCPlugin.dll) on the client device. To learn more about updates and new versions, see [What's new in the Windows Desktop client](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-whatsnew).

2. [Create a host pool for your users](create-host-pools-azure-marketplace.md).

3. Configure the client machine to let your users access the Insiders program. To configure the client for the Insider group, set the following registry information:

   - **Key**: HKLM\\Software\\Microsoft\\MSRDC\\Policies
   - **Type**: REG_SZ
   - **Name**: ReleaseRing
   - **Data**: insider

   To learn more about the Insiders program, see [Windows Desktop client for admins](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-admin#configure-user-groups).

4. Use [the MSI installer (MsMmrHostMri)](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE4QWrF) to install both the host native component and the multimedia redirection extensions for your internet browser on your Azure VM.

## Managing group policies for the multimedia redirection browser extension

Using the multimedia redirection MSI will install the browser extensions. However, as this service is still in public preview, user experience may vary. For more information about known issues, see [Known issues](#known-issues-and-limitations).

Keep in mind that when the IT admin installs an extension with MSI, the users will see a prompt that says "New Extension added." In order to use the app, they'll need to confirm the prompt. If they select **Cancel**, then their browser will uninstall the extension. If you want the browser to force install the extension without any input from your users, we recommend you use the group policy in the following section.

In some cases, you can change the group policy to manage the browser extensions and improve user experience. For example:

- You can install the extension without user interaction.
- You can restrict which websites use multimedia redirection.
- You can pin the extension icon in Google Chrome by default. The extension icon is already pinned by default in Microsoft Edge, so you'll only need to change this setting in Chrome.

### Configure Microsoft Edge group policies for multimedia redirection

To configure the group policies, you'll need to edit the Microsoft Edge Administrative Template. You should see the extension configuration options under **Administrative Templates Microsoft Edge Extensions** > **Configure extension management settings**.

The following code is an example of a Microsoft Edge group policy that doesn't restrict site access: 
 
```cmd
{ "joeclbldhdmoijbaagobkhlpfjglcihd": { "installation_mode": "force_installed", "update_url": "https://edge.microsoft.com/extensionwebstorebase/v1/crx" } } 
```

This next example group policy makes the browser install the multimedia redirection extension, but only lets multimedia redirection load on YouTube: 

```cmd
{ "joeclbldhdmoijbaagobkhlpfjglcihd": { "installation_mode": "force_installed", "runtime_allowed_hosts": [ "*://*.youtube.com" ], "runtime_blocked_hosts": [ "*://*" ], "update_url": "https://edge.microsoft.com/extensionwebstorebase/v1/crx" } }
```

To learn more about group policy configuration, see [Microsoft Edge group policy](/DeployEdge/configure-microsoft-edge).

### Configure Google Chrome group policies for multimedia redirection

To configure the Google Chrome group policies, you'll need to edit the Google Chrome Administrative Template. You should see the extension configuration options under **Administrative Templates** > **Google** > **Google Chrome Extensions** > **Extension management settings**.

The following example is much like the code example in [Configure Microsoft Edge group policies for multimedia redirection](#configure-microsoft-edge-group-policies-for-multimedia-redirection). This policy will force the multimedia redirection extension to install with the icon pinned in the top-right menu, and will only allow multimedia redirection to load on YouTube.

```cmd
{ "lfmemoeeciijgkjkgbgikoonlkabmlno": { "installation_mode": "force_installed", "runtime_allowed_hosts": [ "*://*.youtube.com" ], "runtime_blocked_hosts": [ "*://*" ], "toolbar_pin": "force_pinned", "update_url": "https://clients2.google.com/service/update2/crx" } }
```

Additional information on configuring [Google Chrome group policy](https://support.google.com/chrome/a/answer/187202#zippy=%2Cwindows).

## Run the multimedia redirection extension manually on a browser

MMR uses remote apps and the session desktop for Microsoft Edge and Google Chrome browsers. Once you've fulfilled [the requirements](#requirements), open your supported browser. If you didn't install the browsers or extension with a group policy, users will need to manually run the extension. This section will tell you how to manually run the extension in one of the currently supported browsers.

### Microsoft Edge

To run the extension on Microsoft Edge manually, look for the yellow exclamation mark on the overflow menu. You should see a prompt to enable the Azure Virtual Desktop Multimedia Redirection extension. Select **Enable extension**.

### Google Chrome

To run the extension on Google Chrome manually, look for the notification message that says the new extension was installed, as shown in the following screenshot. 

![A screenshot of the Google Chrome taskbar. There's a notification tab that says "New Extension Added."](media/chrome-notification.png)

Select the notification to allow your users to enable the extension. Users should also pin the extension so that they can see from the icon if multimedia redirection is connected.

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

### Known issues and limitations

The following issues are ones we're already aware of, so you won't need to report them:

- Multimedia redirection only works on the [Windows Desktop client](/windows-server/remote/remote-desktop-services/clients/windowsdesktop#install-the-client), not the web client.

- Multimedia redirection doesn't currently support protected content, so videos from Pluralsight and Netflix won't work.

- During public preview, multimedia redirection will be disabled on all sites except for the sites listed in [Websites that work with MMR](#websites-that-work-with-mmr). However, if you have the extension, you can enable multimedia redirection for all websites. We added the extension so organizations can test the feature on their company websites.

- There's a small chance that the MSI installer won't be able to install the extension during internal testing. If you run into this issue, you'll need to install the multimedia redirection extension from the Microsoft Edge Store or Google Chrome Store.

    - [Multimedia redirection browser extension (Microsoft Edge)](https://microsoftedge.microsoft.com/addons/detail/wvd-multimedia-redirectio/joeclbldhdmoijbaagobkhlpfjglcihd)
    - [Multimedia browser extension (Google Chrome)](https://chrome.google.com/webstore/detail/wvd-multimedia-redirectio/lfmemoeeciijgkjkgbgikoonlkabmlno)

- Installing the extension on host machines with the MSI installer will either prompt users to accept the extension the first time they open the browser or display a warning or error message. If users deny this prompt, it can cause the extension to not load. To avoid this issue, install the extensions by [editing the group policy](#managing-group-policies-for-the-multimedia-redirection-browser-extension).

- When you resize the video window, the window's size will adjust faster than the video itself. You'll also see this issue when minimizing and maximizing the window.

- When the display scale factor of the screen isn't at 100% and you've set the video window to a certain size, you might see a gray patch on the screen. In most cases, you can get rid of the gray patch by resizing the window.

## Next steps

If you're interested in video streaming on other parts of Azure Virtual Desktop, check out [Teams for Azure Virtual Desktop](teams-on-avd.md).
