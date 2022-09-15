---
title: Multimedia redirection on Azure Virtual Desktop - Azure
description: How to use multimedia redirection for Azure Virtual Desktop (preview).
author: Heidilohr
ms.topic: how-to
ms.date: 09/15/2022
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

This article will show you how to use multimedia redirection (MMR) for Azure Virtual Desktop (preview) in your Microsoft Edge or Google Chrome browser. For more information about this feature and how it works, see [What is multimedia redirection for Azure Virtual Desktop? (preview)](multimedia-redirection-intro.md).

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

4. Use [the MSI installer (MsMmrHostMri)](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE55eRq) to install both the host native component and the multimedia redirection extensions for your internet browser on your Azure VM.
<!--This is where the actual installation of the extension happens, according to Chi.-->

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
<!--What code do I use for policies?-->

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
<!--What code should I use for this? The team never specified-->

For more information about configuring Google Chrome policies, see [Google Chrome group policy](https://support.google.com/chrome/a/answer/187202#zippy=%2Cwindows).
<!--Wait, where did this Google link come from?!-->

## Run the multimedia redirection extension manually on a browser

MMR uses remote apps and the session desktop for Microsoft Edge and Google Chrome browsers. Once you've fulfilled [the requirements](#requirements), open your supported browser. If you didn't install the browsers or extension with a group policy, users will need to manually run the extension. This section will tell you how to manually run the extension in one of the currently supported browsers.

### Microsoft Edge

To run the extension on Microsoft Edge manually:

1. Look for the yellow exclamation mark on the overflow menu. You should see a prompt to enable the Azure Virtual Desktop Multimedia Redirection extension.
2. Select **Enable extension**.

### Google Chrome

To run the extension on Google Chrome manually:

1. Look for the notification message that says the new extension was installed, as shown in the following screenshot. 

   ![A screenshot of the Google Chrome taskbar. There's a notification tab that says "New Extension Added."](media/chrome-notification.png)

2. Select the notification to allow your users to enable the extension.
3. Users should also pin the extension so that they can see from the icon if multimedia redirection is connected.

### How to use MMR for Teams live events 

To use MMR for Teams live events:

1. First, open the link to the Teams event in either a Microsoft Edge or Google Chrome browser.

2. Make sure you can see a green check mark next to the [multimedia redirection status icon](#the-multimedia-redirection-status-icon). If the green check mark is there, MMR is enabled for Teams live events.

3. Select **Watch on the web instead**. The Teams live event should automatically start playing in your browser. Make sure you only select **Watch on the web instead**, as shown in the following screenshot. If you use the Teams app, MMR won't work.

The following screenshot highlights the areas described in the previous steps:

:::image type="content" source="./media/teams-live-events.png" alt-text="A screenshot of the 'Watch the live event in Microsoft Teams' page. The status icon and 'watch on the web instead' options are highlighted in red.":::

## Next steps

For more information about this feature and how it works, see [What is multimedia redirection for Azure Virtual Desktop? (preview)](multimedia-redirection-intro.md).

To troubleshoot issues or view known issues, see [our troubleshooting article](troubleshoot-multimedia-redirection.md).

If you're interested in video streaming on other parts of Azure Virtual Desktop, check out [Teams for Azure Virtual Desktop](teams-on-avd.md).
