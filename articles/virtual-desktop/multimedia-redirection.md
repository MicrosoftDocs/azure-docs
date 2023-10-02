---
title: Use multimedia redirection on Azure Virtual Desktop - Azure
description: How to use multimedia redirection on Azure Virtual Desktop.
author: dknappettmsft
ms.topic: how-to
ms.date: 07/18/2023
ms.author: daknappe
manager: femila
---
# Use multimedia redirection on Azure Virtual Desktop

> [!IMPORTANT]
> Multimedia redirection call redirection is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article will show you how to use multimedia redirection for Azure Virtual Desktop with Microsoft Edge or Google Chrome browsers. For more information about how multimedia redirection works, see [Understanding multimedia redirection for Azure Virtual Desktop](multimedia-redirection-intro.md).

## Prerequisites

Before you can use multimedia redirection on Azure Virtual Desktop, you'll need the following things:

- An Azure Virtual Desktop deployment.
- Microsoft Edge or Google Chrome installed on your session hosts.
- Windows Desktop client:
   - To use video playback redirection, you must install [Windows Desktop client, version 1.2.3916 or later](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-whatsnew). This feature is only compatible with version 1.2.3916 or later of the Windows Desktop client.

   - To use call redirection, you must install the Windows Desktop client, version 1.2.4337 or later with [Insider releases enabled](./users/client-features-windows.md#enable-insider-releases).

- Microsoft Visual C++ Redistributable 2015-2022, version 14.32.31332.0 or later installed on your session hosts and Windows client devices. You can download the latest version from [Microsoft Visual C++ Redistributable latest supported downloads](/cpp/windows/latest-supported-vc-redist).

- Your device must meet the [hardware requirements for Teams on a Windows PC](/microsoftteams/hardware-requirements-for-the-teams-app#hardware-requirements-for-teams-on-a-windows-pc/).

> [!NOTE]
> Multimedia redirection isn't supported on Azure Virtual Desktop for Microsoft 365 Government (GCC), GCC-High environments, and Microsoft 365 DoD.

## Install the multimedia redirection extension

For multimedia redirection to work, there are two parts to install on your session hosts: the host component and the browser extension for Edge or Chrome. You install both the host component and browser extension for Edge or Chrome browsers on your session hosts from an MSI file. You can also get and install the browser extension from Microsoft Edge Add-ons or the Chrome Web Store.

### Install the host component and browser extension from an MSI file

To install the host component on your session hosts, you can install the MSI manually on each session host or use your enterprise deployment tool with `msiexec`. To install the MSI manually, you'll need to:

1. Sign in to a session host as a local administrator.

1. Download the [multimedia redirection host MSI installer](https://aka.ms/avdmmr/msi).

1. Open the file that you downloaded to run the setup wizard.

1. Follow the prompts. Once it's finished installing, select **Finish**.

### Enable the browser extension

Next, users need to enable the browser extension in a remote session to use multimedia redirection with Edge or Chrome.

> [!TIP]
> You can also automate installing and enabling the browser extension from Microsoft Edge Add-ons or the Chrome Web Store for all users by [using Group Policy](#install-the-browser-extension-using-group-policy).

1. Sign in to Azure Virtual Desktop and open Edge or Chrome.

1. When opening the browser, after a short while, users will see a prompt that says **New Extension added**. Once the prompt appears, users should select **Turn on extension**. Users should also pin the extension so that they can see from the icon if multimedia redirection is connected.

   :::image type="content" source="./media/mmr-extension-enable.png" alt-text="A screenshot of the prompt to enable the extension.":::

   >[!IMPORTANT]
   >If the user selects **Remove extension**, it will be removed from the browser and they will need to add it from Microsoft Edge Add-ons or the Chrome Web Store. To install it again, see [Install the browser extension manually (optional)](#install-the-browser-extension-manually-optional).

Using Group Policy has the following benefits:

- You can install the extension silently and without user interaction.
- You can restrict which websites use multimedia redirection.
- You can pin the extension icon in Google Chrome by default.

#### Install the browser extension manually (optional)

If installing the host component doesn't automatically install the extension, you can also download it from Microsoft Edge Add-ons or the Chrome Web Store.

To install the multimedia redirection extension manually, follow these steps:

1. Sign in to Azure Virtual Desktop.

1. In your browser, open one of the following links, depending on which browser you're using:

   - For **Microsoft Edge**: [Microsoft multimedia redirection Extension](https://microsoftedge.microsoft.com/addons/detail/wvd-multimedia-redirectio/joeclbldhdmoijbaagobkhlpfjglcihd)

   - For **Google Chrome**: [Microsoft multimedia redirection Extension](https://chrome.google.com/webstore/detail/wvd-multimedia-redirectio/lfmemoeeciijgkjkgbgikoonlkabmlno)

1. Install the extension by selecting **Get** (for Microsoft Edge) or **Add to Chrome** (for Google Chrome), then at the additional prompt, select **Add extension**. Once the installation is finished, you'll see a confirmation message saying that you've successfully added the extension.

#### Install the browser extension using Group Policy

You can install the multimedia redirection extension using Group Policy, either centrally from your domain for session hosts that are joined to an Active Directory (AD) domain, or using the Local Group Policy Editor for each session host. This process will change depending on which browser you're using.

# [Edge](#tab/edge)

1. Download and install the Microsoft Edge administrative template by following the directions in [Configure Microsoft Edge policy settings on Windows devices](/deployedge/configure-microsoft-edge#1-download-and-install-the-microsoft-edge-administrative-template)

1. Next, decide whether you want to configure Group Policy centrally from your domain or locally for each session host:
   
   - To configure it from an AD Domain, open the **Group Policy Management Console** (GPMC) and create or edit a policy that targets your session hosts.
   
   - To configure it locally, open the **Local Group Policy Editor** on the session host.

1. Go to **Computer Configuration** > **Administrative Templates** > **Microsoft Edge** > **Extensions**.

1. Open the policy setting **Configure extension management settings** and set it to **Enabled**.

1. In the field for **Configure extension management settings**, enter the following:

   ```json
   { "joeclbldhdmoijbaagobkhlpfjglcihd": { "installation_mode": "force_installed", "update_url": "https://edge.microsoft.com/extensionwebstorebase/v1/crx" } }
   ```

   You can specify additional parameters to allow or block specific domains. For example, to only allow *youtube.com*, enter the following:

   ```json
   { "joeclbldhdmoijbaagobkhlpfjglcihd": { "installation_mode": "force_installed", "runtime_allowed_hosts": [ "*://*.youtube.com" ], "runtime_blocked_hosts": [ "*://*" ], "update_url": "https://edge.microsoft.com/extensionwebstorebase/v1/crx" } }
   ```

1. Apply the changes by running the following command in Command Prompt or PowerShell on each session host:

   ```cmd
   gpupdate /force
   ```

# [Google Chrome](#tab/google-chrome)

1. Download and install the Google Chrome administrative template by following the instructions in [Set Chrome Browser policies on managed PCs](https://support.google.com/chrome/a/answer/187202#zippy=%2Cwindows)

1. Next, decide whether you want to configure Group Policy centrally from your domain or locally for each session host:
   
   - To configure it from an AD Domain, open the **Group Policy Management Console** (GPMC) and create or edit a policy that targets your session hosts.
   
   - To configure it locally, open the **Local Group Policy Editor** on the session host.

1. Go to **Computer Configuration** > **Administrative Templates** > **Google** > **Google Chrome** > **Extensions**.

1. Open the policy setting **Extension management settings** and set it to **Enabled**.

1. In the field for **Extension management settings**, enter the following:

   ```json
   { "lfmemoeeciijgkjkgbgikoonlkabmlno": { "installation_mode": "force_installed", "update_url": "https://clients2.google.com/service/update2/crx" } }
   ```

   You can specify additional parameters to allow or block specific domains. For example, to only allow *youtube.com* and pin the extension to the toolbar, enter the following:

   ```json
   { "lfmemoeeciijgkjkgbgikoonlkabmlno": { "installation_mode": "force_installed", "runtime_allowed_hosts": [ "*://*.youtube.com" ], "runtime_blocked_hosts": [ "*://*" ], "toolbar_pin": "force_pinned", "update_url": "https://clients2.google.com/service/update2/crx" } }
   ```

1. Apply the changes by running the following command in Command Prompt or PowerShell on each session host:

   ```cmd
   gpupdate /force
   ```

---

## Configure call redirection (preview) for the Remote Desktop client only

If you want to test the call redirection (preview) feature, you first need to configure the Remote Desktop client to use [Insider features](./users/client-features-windows.md#enable-insider-releases).

## Check the extension status

Once you've installed the extension, you can check its status by visiting a website with media content, such as one from the list at [Websites that work with multimedia redirection](multimedia-redirection-intro.md#websites-that-work-with-multimedia-redirection), and hovering your mouse cursor over [the multimedia redirection extension icon](multimedia-redirection-intro.md#check-if-multimedia-redirection-is-active) in the extension bar on the top-right corner of your browser. A message will appear and tell you about the current status, as shown in the following screenshot.

:::image type="content" source="./media/mmr-extension-status-popup.png" alt-text="A screenshot of the multimedia redirection extension in the Microsoft Edge extension bar.":::

### Features supported on current page

To find out what types of redirections are enabled on the webpage you're visiting, you can open up the extension menu and look for the section named **Features supported on current page**. If a feature is currently enabled, you'll see a green check mark next to it, as shown in the following screenshot.

:::image type="content" source="./media/extension-menu-enabled.png" alt-text="A screenshot of the multimedia redirection extension menu. Both video playback redirection and call redirection are enabled, shown by a green circle with a white check mark inside next to each of them.":::

## Teams live events

To use multimedia redirection with Teams live events:

1. Sign in to Azure Virtual Desktop.

1. Open the link to the Teams live event in either the Edge or Chrome browser.

1. Make sure you can see a green play icon as part of the [multimedia redirection status icon](multimedia-redirection-intro.md#check-if-multimedia-redirection-is-active). If the green play icon is there, multimedia redirection is enabled for Teams live events.

1. Select **Watch on the web instead**. The Teams live event should automatically start playing in your browser. Make sure you only select **Watch on the web instead**, as shown in the following screenshot. If you use the native Teams app, multimedia redirection won't work.

   :::image type="content" source="./media/teams-live-events.png" alt-text="A screenshot of the 'Watch the live event in Microsoft Teams' page. The status icon and 'watch on the web instead' options are highlighted in red.":::

## Advanced settings

The following sections describe additional settings you can configure in multimedia redirection.

### Video playback redirection

The following sections will show you how to enable and use various features related to video playback redirection for Azure Virtual Desktop.

#### Enable video playback for all sites

Video playback redirection is currently limited to the sites listed in [Websites that work with multimedia redirection](multimedia-redirection-intro.md#websites-that-work-with-multimedia-redirection) by default. However, you can enable video playback redirection for all sites to allow you to test the feature with other websites. To enable video playback redirection for all sites:

1. Select the extension icon in your browser.

1. Select **Show Advanced Settings**.

1. Toggle **Enable video playback for all sites (beta)** to **on**.

#### Enable redirected video overlay

Redirected video outlines will allow you to highlight the currently redirected video elements. When this is enabled, you will see a bright highlighted border around the video element that is being redirected. To enable redirected video outlines:

1. Select the extension icon in your browser.

1. Select **Show Advanced Settings**.

1. Toggle **Redirected video outlines** to **on**. You will need to refresh the webpage for the change to take effect.

#### Video status overlay

When you enable video status overlay, you'll see a short message at the top of the video player that indicates the redirection status of the current video. The message will disappear after five seconds.  To enable video status overlay:

1. Select the extension icon in your browser.

1. Select **Show Advanced Settings**.

1. Toggle **Video Status Overlay** to **on**. You'll need to refresh the webpage for the change to take effect.

### Call redirection

The following section will show you how to use advanced features for call redirection.

#### Enable call redirection for all sites

Call redirection is currently limited to the web apps listed in [Websites that work with multimedia redirection](multimedia-redirection-intro.md#websites-that-work-with-multimedia-redirection) by default. If you're using one of the calling apps listed in [Call redirection](multimedia-redirection-intro.md#call-redirection) with an internal URL, you must turn the **Enable WebRTC for all sites** setting to use call redirection. You can also enable call redirection for all sites to test the feature with web apps that aren't officially supported yet.

To enable call redirection for all sites:

1. On your client device, create a registry key with the following values:

   - **Key**: HKCU\Software\Microsoft\MMR
   - **Type**: REG_DWORD 
   - **Name**: AllowCallRedirectionAllSites
   - **Value data**: 1

1. Next, connect to a remote session, then select the **extension icon** in your browser.

1. Select **Show Advanced Settings**.

1. Toggle **Enable call redirection for all sites (experimental)** on.

## Next steps

For more information about multimedia redirection and how it works, see [What is multimedia redirection for Azure Virtual Desktop?](multimedia-redirection-intro.md).

To troubleshoot issues or view known issues, see [our troubleshooting article](troubleshoot-multimedia-redirection.md).

If you're interested in learning more about using Teams for Azure Virtual Desktop, check out [Teams for Azure Virtual Desktop](teams-on-avd.md).
