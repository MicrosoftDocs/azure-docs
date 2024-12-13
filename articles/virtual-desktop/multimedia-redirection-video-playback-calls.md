---
title: Multimedia redirection for video playback and calls in a remote session
description: Learn how multimedia redirection redirects video playback and calls in a remote session from Azure Virtual Desktop, a Windows 365 Cloud PC, or Microsoft Dev Box to your local device for faster processing and rendering.
ms.topic: how-to
zone_pivot_groups: rdp-products-features
author: dknappettmsft
ms.author: daknappe
ms.date: 09/30/2024
---

# Multimedia redirection for video playback and calls in a remote session

[!INCLUDE [include-rdp-shared-article](includes/include-rdp-shared-article.md)]

Multimedia redirection redirects video playback and calls in a remote session from Azure Virtual Desktop, a Windows 365 Cloud PC, or Microsoft Dev Box to your local device for faster processing and rendering. Specifically, these two functions work in the following ways:

- **Video playback redirection**: optimizes video playback experience for web pages with embedded videos like YouTube and Facebook. The browser in the remote session fetches video content, but the bitstream of video data is sent to the local device where it decodes and renders the video in the correct place on the screen.

   :::image type="content" source="media/multimedia-redirection/video-playback-redirection.png" alt-text="A diagram depicting the relationship between the video source, the remote session, and the local device." lightbox="media/multimedia-redirection/video-playback-redirection.png":::

- **Call redirection**: optimizes audio calls for WebRTC-based calling apps, reducing latency, and improving call quality. The connection happens between the local device and the telephony app server, where WebRTC calls are offloaded from a remote session to a local device, as shown in the following diagram. However, after the connection is established, call quality becomes dependent on the web page or app providers, just as it would with a non-redirected call.

   :::image type="content" source="media/multimedia-redirection/call-redirection.png" alt-text="A diagram depicting the relationship between the telephony web app server, the user, the web app, and other callers." lightbox="media/multimedia-redirection/call-redirection.png":::

There are two components you need to install for multimedia redirection:

- Remote Desktop Multimedia Redirection Service
- Browser extension for Microsoft Edge or Google Chrome browsers

This article shows you install and configure multimedia redirection in a remote session from Azure Virtual Desktop, a Windows 365 Cloud PC, or Microsoft Dev Box with Microsoft Edge or Google Chrome browsers, and manage settings for the browser extension using Microsoft Intune or Group Policy. Additionally, this article shows you how to manage settings for the browser extension in Microsoft Edge using the Microsoft Edge management service.

Later in the article you can find a list of websites that work with multimedia redirection for [video playback](#websites-for-video-playback-redirection) and [calls](#websites-for-call-redirection).

## Prerequisites

Before you can use multimedia redirection, you need:

::: zone pivot="azure-virtual-desktop"
- An existing host pool with session hosts.

- Local administrator privilege on your session hosts to install and update the Remote Desktop Multimedia Redirection Service.

- The latest version of Microsoft Edge or Google Chrome installed on your session hosts.

- Microsoft Visual C++ Redistributable 2015-2022, version 14.32.31332.0 or later installed on your session hosts and local Windows devices. You can download the latest version from [Microsoft Visual C++ Redistributable latest supported downloads](/cpp/windows/latest-supported-vc-redist).
::: zone-end

::: zone pivot="windows-365"
- An existing Cloud PC.

- Local administrator privilege on your Cloud PC to install and update the Remote Desktop Multimedia Redirection Service.

- The latest version of Microsoft Edge or Google Chrome installed on your Cloud PC.

- Microsoft Visual C++ Redistributable 2015-2022, version 14.32.31332.0 or later installed on your Cloud PC and local Windows devices. You can download the latest version from [Microsoft Visual C++ Redistributable latest supported downloads](/cpp/windows/latest-supported-vc-redist).
::: zone-end

::: zone pivot="dev-box"
- An existing dev box.

- Local administrator privilege on your dev box to install and update the Remote Desktop Multimedia Redirection Service.

- The latest version of Microsoft Edge or Google Chrome installed on your dev box.

- Microsoft Visual C++ Redistributable 2015-2022, version 14.32.31332.0 or later installed on your dev box and local Windows devices. You can download the latest version from [Microsoft Visual C++ Redistributable latest supported downloads](/cpp/windows/latest-supported-vc-redist).
::: zone-end

- To configure multimedia redirection using Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.
   - A group containing the devices you want to configure.

- To configure multimedia redirection using Group Policy, you need:

   - A domain account that has permission to create or edit Group Policy objects.
   - A security group or organizational unit (OU) containing the devices you want to configure.

- You need to connect to a remote session from one of the following supported apps and platforms:
   - Windows App on Windows, version 2.0.297.0 or later.
   - Remote Desktop app on Windows, version 1.2.5709 or later.

- Your local Windows device must meet the [hardware requirements for Teams on a Windows PC](/microsoftteams/hardware-requirements-for-the-teams-app#hardware-requirements-for-teams-on-a-windows-pc/).

> [!NOTE]
> Multimedia redirection isn't supported on Azure Virtual Desktop for Azure US Government, or Windows 365 for Microsoft 365 Government (GCC), GCC-High environments, and Microsoft 365 DoD.

::: zone pivot="azure-virtual-desktop"
## Install multimedia redirection on session hosts

There are two components you need to install on your session hosts:
::: zone-end

::: zone pivot="windows-365"
## Install multimedia redirection on a Cloud PC

> [!IMPORTANT]
> Multimedia redirection is already installed on Microsoft gallery images for Windows 365. You only need to install multimedia redirection on your Cloud PC if you're using a custom image.

There are two components you need to install on your Cloud PC:
::: zone-end

::: zone pivot="dev-box"
## Install multimedia redirection on a dev box

There are two components you need to install on your dev box:
::: zone-end

- Remote Desktop Multimedia Redirection Service
- Browser extension for Microsoft Edge or Google Chrome browsers

You install both the multimedia redirection service and browser extension from a single `.msi` file, which you can run manually, use Intune [Win32 app management](/mem/intune/apps/apps-win32-app-management), or your enterprise deployment tool with [msiexec](/windows-server/administration/windows-commands/msiexec). To install the `.msi` file:

1. Download the [multimedia redirection installer](https://aka.ms/avdmmr/msi).

1. Make sure Microsoft Edge or Google Chrome isn't running. Check in Task Manager that there are no instances of `msedge.exe` or `chrome.exe` listed in the **Details** tab.

1. Install the `.msi` file using one of the following methods:

   - To install it manually, open the file that you downloaded to run the setup wizard, then follow the prompts. After it's installed, select **Finish**.

   - Alternatively, use the following command with Intune or your enterprise deployment tool as an administrator from Command Prompt. This example specifies there's no UI or user interaction required during the installation process.

     ```cmd
     msiexec /i <path to the MSI file> /qn
     ```

After you install the multimedia redirection service and browser extension, next you need to enable the browser extension.

> [!IMPORTANT]
> The Remote Desktop Multimedia Redirection Service doesn't update automatically. You need to update the service manually when a new version is available. You can download the latest version from the same URL in this section and install using the same steps, which automatically replaces the previous version. For information about the latest version, see [What's new in multimedia redirection](whats-new-multimedia-redirection.md).
>
> The browser extension updates automatically when a new version is available.

## Enable and manage the browser extension centrally

> [!TIP]
> By default, users are automatically prompted to enable the extension when they open their browser. This section is optional if you want to enable and manage the browser extension centrally.

You can enable and manage the browser extension centrally from Microsoft Edge Add-ons or the Chrome Web Store for all users by using Microsoft Intune or Group Policy, or the Microsoft Edge management service (for Microsoft Edge only).

Managing the browser extension has the following benefits:

- Enable the browser extension silently and without user interaction.
- Restrict which web pages use multimedia redirection.
- Show or hide advanced settings for the browser extension.
- Pin the browser extension to the browser toolbar.

Select the relevant tab for your scenario.

::: zone pivot="windows-365"
For Windows 365, we recommend using Microsoft Intune to enable the multimedia redirection browser extension.
::: zone-end

# [Microsoft Intune](#tab/intune)

To enable the multimedia redirection browser extension using Microsoft Intune, expand one of the following sections, depending on which browser you're using:

<br />

<details>
    <summary>For <b>Microsoft Edge</b>, expand this section.</summary>

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Microsoft Edge** > **Extensions**.

   :::image type="content" source="media/multimedia-redirection/microsoft-edge-extensions-intune.png" alt-text="A screenshot showing the Microsoft Edge extensions options in the Microsoft Intune portal." lightbox="media/multimedia-redirection/microsoft-edge-extensions-intune.png":::

1. Check the box for **Configure extension management settings**, then close the settings picker.

1. Expand the **Microsoft Edge** category, then toggle the switch for **Configure extension management settings** to **Enabled**

   :::image type="content" source="media/multimedia-redirection/microsoft-edge-extensions-intune-configure-extension-management-settings.png" alt-text="A screenshot showing the Microsoft Edge extensions management settings in the Microsoft Intune portal." lightbox="media/multimedia-redirection/microsoft-edge-extensions-intune-configure-extension-management-settings.png":::

1. In the box that appears for **Configure extension management settings (Device)**, enter the following JSON as a single line string. This example installs the extension with the required update URL:

   ```json
   {
     "joeclbldhdmoijbaagobkhlpfjglcihd": {
       "installation_mode": "force_installed",
       "update_url": "https://edge.microsoft.com/extensionwebstorebase/v1/crx"
     }
   }
   ```

   > [!NOTE]
   > You can specify additional parameters to allow or block specific sites for redirection and to show or hide advanced settings. For more information, see:
   > - [Common policy configuration parameters](#common-policy-configuration-parameters).
   > - [Allow or block video playback redirection for specific domains](#allow-or-block-video-playback-redirection-for-specific-domains).
   > - [Enable call redirection for specific domains](#enable-call-redirection-for-specific-domains).

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. After the policy applies to the computers providing a remote session, restart them for the settings to take effect.
</details>

<br />

<details>
    <summary>For <b>Google Chrome</b>, expand this section.</summary>

1. Download the [administrative template for Google Chrome](https://chromeenterprise.google/browser/download/#manage-policies-tab). Select the option **Chrome ADM/ADMX templates** to download the ZIP file.

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. Follow the steps to [Import custom ADMX and ADML administrative templates into Microsoft Intune](/mem/intune/configuration/administrative-templates-import-custom). You need to import the `google.admx` and `google.adml` first, then import `chrome.admx` and `chrome.adml`.

1. After you imported the Google Chrome administrative template, follow the steps to [Create a profile using your imported files](/mem/intune/configuration/administrative-templates-import-custom#create-a-profile-using-your-imported-files)

1. In configuration settings, browse to **Computer Configuration** > **Google** > **Google Chrome** > **Extensions**.

   :::image type="content" source="media/multimedia-redirection/google-chrome-extensions-administrative-template-intune.png" alt-text="A screenshot showing the Google Chrome extensions options in the Microsoft Intune portal." lightbox="media/multimedia-redirection/google-chrome-extensions-administrative-template-intune.png":::

1. Select **Extension management settings**, which opens a new pane. Scroll to the end, then select **Enabled**.

   :::image type="content" source="media/multimedia-redirection/google-chrome-extensions-administrative-template-intune-enabled.png" alt-text="A screenshot showing the Google Chrome extensions management settings in the Microsoft Intune portal." lightbox="media/multimedia-redirection/google-chrome-extensions-administrative-template-intune-enabled.png":::

1. In the box, enter the following JSON as a single line string. This example installs the extension with the required update URL:

   ```json
   {
     "lfmemoeeciijgkjkgbgikoonlkabmlno": {
       "installation_mode": "force_installed",
       "update_url": "https://clients2.google.com/service/update2/crx"
     }
   }
   ```

   > [!NOTE]
   > You can specify additional parameters to allow or block specific sites for redirection and to show or hide advanced settings. For more information, see:
   > - [Common policy configuration parameters](#common-policy-configuration-parameters).
   > - [Allow or block video playback redirection for specific domains](#allow-or-block-video-playback-redirection-for-specific-domains).
   > - [Enable call redirection for specific domains](#enable-call-redirection-for-specific-domains).

1. Select **OK**, then select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. After the policy applies to the computers providing a remote session, restart them for the settings to take effect.
</details>

# [Group Policy](#tab/group-policy)

To enable the multimedia redirection browser extension using Group Policy:

<br />

<details>
    <summary>For <b>Microsoft Edge</b>, expand this section.</summary>

1. Download and install the Microsoft Edge administrative template by following the directions in [Configure Microsoft Edge policy settings on Windows devices](/deployedge/configure-microsoft-edge#1-download-and-install-the-microsoft-edge-administrative-template).

1. Open the **Group Policy Management** console on a device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Microsoft Edge** > **Extensions**.

   :::image type="content" source="media/multimedia-redirection/microsoft-edge-extensions-group-policy.png" alt-text="A screenshot showing the Microsoft Edge extensions options in the Group Policy editor." lightbox="media/multimedia-redirection/microsoft-edge-extensions-group-policy.png":::

1. Double-click the policy setting **Configure extension management settings** to open it.

   :::image type="content" source="media/multimedia-redirection/microsoft-edge-extensions-group-policy-extension-management-settings-enabled.png" alt-text="A screenshot showing the Microsoft Edge extensions management settings in the Group Policy editor." lightbox="media/multimedia-redirection/microsoft-edge-extensions-group-policy-extension-management-settings-enabled.png":::

1. Select **Enabled**, then in the field for **Configure extension management settings**, enter the following JSON as a single line string. This example installs the extension with the required update URL:

   ```json
   {
     "joeclbldhdmoijbaagobkhlpfjglcihd": {
       "installation_mode": "force_installed",
       "update_url": "https://edge.microsoft.com/extensionwebstorebase/v1/crx"
     }
   }
   ```

   > [!NOTE]
   > You can specify additional parameters to allow or block specific sites for redirection and to show or hide advanced settings. For more information, see:
   > - [Common policy configuration parameters](#common-policy-configuration-parameters).
   > - [Allow or block video playback redirection for specific domains](#allow-or-block-video-playback-redirection-for-specific-domains).
   > - [Enable call redirection for specific domains](#enable-call-redirection-for-specific-domains).

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.
</details>

<br />

<details>
    <summary>For <b>Google Chrome</b>, expand this section.</summary>

1. Download the [administrative template for Google Chrome](https://chromeenterprise.google/browser/download/#manage-policies-tab). Select the option **Chrome ADM/ADMX templates** to download the ZIP file.

1. On your domain controllers, copy and paste the following files to the relevant location, depending if you store Group Policy templates in the local `PolicyDefinitions` folder or the [Group Policy Central Store](/troubleshoot/windows-client/group-policy/create-and-manage-central-store). Replace `contoso.com` with your domain name, and `en-US` if you're using a different language.

   - **Filename**: `terminalserver-avd.admx`
       - **Local location**: `C:\Windows\PolicyDefinitions\`
       - **Central Store**: `\\contoso.com\SYSVOL\contoso.com\Policies\PolicyDefinitions`

   - **Filename**: `en-US\terminalserver-avd.adml`
       - **Local location**: `C:\Windows\PolicyDefinitions\en-US\`
       - **Central Store**: `\\contoso.com\SYSVOL\contoso.com\Policies\PolicyDefinitions\en-US`

1. Open the **Group Policy Management** console on a device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Google** > **Google Chrome** > **Extensions**.

   :::image type="content" source="media/multimedia-redirection/google-chrome-extensions-group-policy.png" alt-text="A screenshot showing the Google Chrome extensions options in the Group Policy editor." lightbox="media/multimedia-redirection/google-chrome-extensions-group-policy.png":::

1. Double-click the policy setting **Extension management settings** to open it.

   :::image type="content" source="media/multimedia-redirection/google-chrome-extensions-group-policy-extension-management-settings-enabled.png" alt-text="A screenshot showing the Google Chrome extensions management settings in the Group Policy editor." lightbox="media/multimedia-redirection/google-chrome-extensions-group-policy-extension-management-settings-enabled.png":::

1. Select **Enabled**, then in the field for **Extension management settings**, enter the following JSON as a single line string. This example installs the extension with the required update URL:

   ```json
   {
     "lfmemoeeciijgkjkgbgikoonlkabmlno": {
       "installation_mode": "force_installed",
       "update_url": "https://clients2.google.com/service/update2/crx"
     }
   }
   ```

   > [!NOTE]
   > You can specify additional parameters to allow or block specific sites for redirection and to show or hide advanced settings. For more information, see:
   > - [Common policy configuration parameters](#common-policy-configuration-parameters).
   > - [Allow or block video playback redirection for specific domains](#allow-or-block-video-playback-redirection-for-specific-domains).
   > - [Enable call redirection for specific domains](#enable-call-redirection-for-specific-domains).

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.
</details>

# [Microsoft Edge management service](#tab/edge)

To enable the multimedia redirection browser extension using the Microsoft Edge management service:

1. Sign in to the [Microsoft 365 admin center](https://admin.microsoft.com/Adminportal/).

1. [Create a configuration profile](/deployedge/microsoft-edge-management-service) for Microsoft Edge.

1. After the profile is created, select it, then select **Extensions**.

   :::image type="content" source="media/multimedia-redirection/microsoft-edge-configuration-profile-extensions-empty.png" alt-text="A screenshot showing the empty extensions tab in a Microsoft Edge configuration profile." lightbox="media/multimedia-redirection/microsoft-edge-configuration-profile-extensions-empty.png":::

1. Select **+ Select extension**.

1. In the new pane that opens, enter extension ID `joeclbldhdmoijbaagobkhlpfjglcihd` into the search box. The Microsoft Multimedia Redirection extension appears in the search results. Select **Select** and close the pane. You can't search for it by name.

   :::image type="content" source="media/multimedia-redirection/microsoft-edge-configuration-profile-extensions-multimedia-redirection-search.png" alt-text="A screenshot showing the search results for the Microsoft Multimedia Redirection extension in a Microsoft Edge configuration profile." lightbox="media/multimedia-redirection/microsoft-edge-configuration-profile-extensions-multimedia-redirection-search.png":::

1. Select the **Microsoft Multimedia Redirection** extension display name, which opens a new pane. From this pane you can configure the extension settings, based on your requirements. You can also use any of the JSON examples for Microsoft Edge in this article to add the extension or modify its settings.

   :::image type="content" source="media/multimedia-redirection/microsoft-edge-configuration-profile-extensions-multimedia-redirection-settings.png" alt-text="A screenshot showing the Microsoft Multimedia Redirection extension settings in a Microsoft Edge configuration profile." lightbox="media/multimedia-redirection/microsoft-edge-configuration-profile-extensions-multimedia-redirection-settings.png":::

1. Follow the steps to [Assign a configuration profile to a Microsoft Entra group](/deployedge/microsoft-edge-management-service#assign-a-configuration-profile-to-a-microsoft-entra-group), then [Configure Microsoft Edge to use a configuration profile](/deployedge/microsoft-edge-management-service#configure-microsoft-edge-to-use-a-configuration-profile) to apply the profile to the groups of users you specify.

---

## Common policy configuration parameters

The following sections show some examples of policy configuration parameters for the browser extension that are common for both video playback and call redirection. You can use these examples as part of the steps in [Enable and manage the browser extension centrally](#enable-and-manage-the-browser-extension-centrally). Combine these examples with the parameters you require for your users.

> [!NOTE]
> The following examples are for Microsoft Edge. For Google Chrome:
>
> - Change `joeclbldhdmoijbaagobkhlpfjglcihd` to `lfmemoeeciijgkjkgbgikoonlkabmlno`.
> - Change the `update_url` to `https://clients2.google.com/service/update2/crx`.

### Show or hide the extension on the browser toolbar

You can show or hide the extension icon on the browser toolbar. By default, extension icons are hidden from the toolbar.

The following example installs the extension and shows the extension icon on the toolbar by default, but still allows users to hide it. Other values are `force_shown` and `default_hidden`. For more information about configuring extensions for Microsoft Edge, see [A detailed guide to configuring extensions using the ExtensionSettings policy](/deployedge/microsoft-edge-manage-extensions-ref-guide).

```json
{
  "joeclbldhdmoijbaagobkhlpfjglcihd": {
    "installation_mode": "force_installed",
    "update_url": "https://edge.microsoft.com/extensionwebstorebase/v1/crx",
    "toolbar_state": "default_shown"
  }
}
```

### Hide advanced settings button

You can show or hide the advanced settings button to users in the extension. By default, the advanced settings button is shown and users have access to toggle each setting on or off. If you hide the advanced settings button, users can still collect logs.

Here's what the extension looks like when the advanced settings button is hidden:

:::image type="content" source="./media/multimedia-redirection/browser-extension-loaded-advanced-settings-hidden.png" alt-text="A screenshot of the browser extension advanced settings hidden.":::

To hide the advanced settings button, you need to set the following registry value on the computers providing a remote session, depending on the browser you're using:

- For Microsoft Edge:

   - **Key**: `HKLM\SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\joeclbldhdmoijbaagobkhlpfjglcihd\policy`
   - **Name**: `HideAdvancedSettings`
   - **Type**: `REG_DWORD`
   - **Data**: `1`

- For Google Chrome:

   - **Key**: `HKLM\SOFTWARE\Policies\Google\Chrome\3rdparty\extensions\lfmemoeeciijgkjkgbgikoonlkabmlno\policy`
   - **Name**: `HideAdvancedSettings`
   - **Type**: `REG_DWORD`
   - **Data**: `1`

If you set **Data** to `0`, the advanced settings button is shown.

You can configure the registry using an enterprise deployment tool such as Intune, Configuration Manager, or Group Policy. Alternatively, to set this registry value using PowerShell, open PowerShell as an administrator and run the following commands. This example uses the registry key for Microsoft Edge:

```powershell
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\joeclbldhdmoijbaagobkhlpfjglcihd\policy" -Force
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\joeclbldhdmoijbaagobkhlpfjglcihd\policy" -Name HideAdvancedSettings -PropertyType DWORD -Value 1 -Force
```

## Browser extension status

The extension icon changes based on whether multimedia redirection is available on the current web page and which features are supported. The following table shows the different states of the extension icon and their definitions:

| Icon State | Definition |
|--|--|
| :::image type="content" source="./media/multimedia-redirection/browser-extension-icon-loaded.png" alt-text="The multimedia redirection extension is loaded, indicating that content on the web page can be redirected."::: | The multimedia redirection extension is loaded, indicating that the website can be redirected. |
| :::image type="content" source="./media/multimedia-redirection/browser-extension-icon-not-loaded.png" alt-text="The multimedia redirection extension isn't loaded, indicating that content on the web page isn't redirected."::: | The multimedia redirection extension isn't loaded, indicating that content on the web page isn't redirected. |
| :::image type="content" source="./media/multimedia-redirection/browser-extension-icon-video-playback.png" alt-text="The multimedia redirection extension is currently redirecting video playback."::: | The multimedia redirection extension is currently redirecting video playback. |
| :::image type="content" source="./media/multimedia-redirection/browser-extension-icon-call.png" alt-text="The multimedia redirection extension is currently redirecting a call."::: | The multimedia redirection extension is currently redirecting a call. |
| :::image type="content" source="./media/multimedia-redirection/browser-extension-icon-error.png" alt-text="The multimedia redirection extension failed to load correctly. You might need to uninstall and reinstall the extension or the Remote Desktop Multimedia Redirection Service, then try again."::: | The multimedia redirection extension failed to load correctly. You might need to uninstall and reinstall the extension or the Remote Desktop Multimedia Redirection Service, then try again. |

## Video playback redirection

The following sections contain information about how to test video playback redirection and how you can configure advanced settings.

### Websites for video playback redirection

The following websites are known to work with video playback redirection, and which work by default.

:::row:::
   :::column span="":::
      - `AWS Training`
      - `BBC`
      - `Big Think`
      - `CNBC`
      - `Coursera`
      - `Daily Mail`
      - `Facebook`
      - `Fidelity`
      - `Fox Sports`
   :::column-end:::
   :::column span="":::
      - `Fox Weather`
      - `IMDB`
      - `Infosec Institute`
      - `LinkedIn Learning`
      - `Microsoft Learn`
      - `Microsoft Stream`
      - `Microsoft Teams live events`
      - `Pluralsight`
      - `Skillshare`
   :::column-end:::
   :::column span="":::
      - `The Guardian`
      - `Twitch`
      - `Udemy`\*
      - `UMU`
      - `U.S. News`
      - `Vimeo`
      - `Yahoo`
      - `Yammer`
      - `YouTube` (including sites with embedded `YouTube` videos).
   :::column-end:::
:::row-end:::

> [!IMPORTANT]
> Video playback redirection doesn't support protected content. Protected content can be played without multimedia redirection using regular video playback.

### Test video playback redirection

After you enable multimedia redirection, you can test it by visiting a web page with video playback from the list in [Websites for video playback redirection](#websites-for-video-playback-redirection) and following these steps:

1. Open the web page in Microsoft Edge or Google Chrome on your remote session.

1. Select the Microsoft Multimedia Redirection extension icon in the extension bar on the top-right corner of your browser. If you're on a web page where multimedia redirection is available, the icon has a blue border (rather than grey), and shows the message **The extension is loaded**. For web pages that support video playback redirection, **Video Playback Redirection** has a green check mark.
   
   :::image type="content" source="media/multimedia-redirection/browser-extension-loaded-video-playback-redirection.png" alt-text="A screenshot of the multimedia redirection extension in the Microsoft Edge extension bar with video playback redirection enabled." lightbox="media/multimedia-redirection/browser-extension-loaded-video-playback-redirection.png":::
   
1. On the web page, play a video. Check the status of the extension icon that multimedia redirection is active in your browser, which should look like the following image:

   :::image type="content" source="./media/multimedia-redirection/browser-extension-icon-video-playback.png" alt-text="Testing video playback redirection, the multimedia redirection extension is currently redirecting video playback.":::

#### Microsoft Teams live events

Microsoft Teams live events aren't media-optimized when using the native Teams app in a remote session. However, if you use Teams live events with a browser that supports Teams live events and multimedia redirection, multimedia redirection is a workaround that provides smoother Teams live events playback in a remote session. Multimedia redirection supports Enterprise Content Delivery Network (ECDN) for Teams live events.

To use multimedia redirection with Teams live events, you must use the web version of Teams. Multimedia redirection isn't supported with the native Teams app. When you launch the live event in your browser, make sure you select **Watch on the web instead**. The Teams live event should automatically start playing in your browser with multimedia redirection enabled.

:::image type="content" source="./media/multimedia-redirection/microsoft-teams-live-events.png" alt-text="A screenshot of the 'Watch the live event in Microsoft Teams' web page. The 'watch on the web instead' option and the multimedia extension icon are highlighted in red.":::

### Advanced settings for video playback redirection

The following advanced settings are available for video playback redirection. You can also hide the advanced settings button from users; for more information, see [Hide advanced settings button](#hide-advanced-settings-button).

- **Enable video playback for all sites (beta)**: By default, video playback redirection is limited to the sites listed in [Websites for video playback redirection](#websites-for-video-playback-redirection). You can enable video playback redirection for all sites to test the feature with other web pages. This setting is experimental and might not work as expected.

- **Video status overlay**: When enabled, a short message appears at the top of the video player that indicates the redirection status of the current video. The message disappears after five seconds.

- **Enable redirected video playback overlay**: When enabled, a bright highlighted border appears around the video playback element that is being redirected.

To enable these advanced settings:

1. Select the extension icon in your browser.

1. Select **Show Advanced Settings**.

1. Toggle the settings you want to enable to **on**.

### Allow or block video playback redirection for specific domains

If you configure multimedia redirection using Microsoft Intune or Group Policy, you can allow or block specific domains for video playback redirection.

> [!NOTE]
> The following example is for Microsoft Edge. For Google Chrome:
>
> - Change `joeclbldhdmoijbaagobkhlpfjglcihd` to `lfmemoeeciijgkjkgbgikoonlkabmlno`.
> - Change the `update_url` to `https://clients2.google.com/service/update2/crx`.

This example installs the extension and allows **learn.microsoft.com** and **youtube.com**, but blocks all other domains. You can use this example as part of the steps in [Enable and manage the browser extension centrally](#enable-and-manage-the-browser-extension-centrally).

```json
{
  "joeclbldhdmoijbaagobkhlpfjglcihd": {
    "installation_mode": "force_installed",
    "runtime_allowed_hosts": [ "*://*.learn.microsoft.com";"*://*.youtube.com" ],
    "runtime_blocked_hosts": [ "*://*" ],
    "update_url": "https://edge.microsoft.com/extensionwebstorebase/v1/crx",
    "toolbar_state": "default_shown"
  }
}
```

## Call redirection

The following sections contain information about how to test call redirection and how you can configure advanced settings.

### Websites for call redirection

The following websites are known to work with call redirection, and which work by default.

- [`WebRTC Sample Site`](https://webrtc.github.io/samples)
- [`Content Guru Storm App`](https://www.contentguru.com/en-us/news/content-guru-announces-its-storm-ccaas-solution-is-now-compatible-with-microsoft-azure-virtual-desktop/)
- [`Twilio Flex`](https://www.twilio.com/en-us/blog/public-beta-flex-microsoft-azure-virtual-desktop#join-the-flex-for-azure-virtual-desktop-public-beta)
- [`8x8`](https://www.8x8.com/)

### Test call redirection

After you enable multimedia redirection, you can test it by visiting a web page with calling from the list in [Websites for call redirection](#websites-for-call-redirection) and following these steps:

1. Open the web page in Microsoft Edge or Google Chrome on your remote session.

1. Select the Microsoft Multimedia Redirection extension icon in the extension bar on the top-right corner of your browser. If you're on a web page where multimedia redirection is available, the icon has a blue border (rather than grey), and shows the message **The extension is loaded**. For web pages that support call redirection, **Call Redirection** has a green check mark.
   
   :::image type="content" source="media/multimedia-redirection/browser-extension-loaded-call-redirection.png" alt-text="A screenshot of the multimedia redirection extension in the Microsoft Edge extension bar with call redirection enabled." lightbox="media/multimedia-redirection/browser-extension-loaded-call-redirection.png":::
   
1. On the web page, make a call. Check the status of the extension icon that multimedia redirection is active in your browser, which should look like the following image:

   :::image type="content" source="./media/multimedia-redirection/browser-extension-icon-call.png" alt-text="Testing call redirection, the multimedia redirection extension is currently redirecting video playback.":::

### Enable call redirection for specific domains

If you configure multimedia redirection using Microsoft Intune or Group Policy, you can enable one or more domains for call redirection. This parameter enables you to specify extra sites in addition to the [Websites for call redirection](#websites-for-call-redirection). The supported format is to specify the URL as the fully qualified domain name (FQDN) with up to one subdirectory. The following formats are supported:

- `contoso.com`
- `conferencing.contoso.com`
- `contoso.com/conferencing`

The following formats aren't supported:

- `www.contoso.com`
- `contoso.com/conferencing/groups`
- `contoso.com/`

For multiple sites, separate each site with a semicolon `;`, for example, `contoso.com;conferencing.contoso.com;contoso.com/conferencing`.

To add extra sites for call redirection, you need to set the following registry value on the computers providing a remote session, depending on the browser you're using. Replace `<URLs>` with the sites you want to enable.

- For Microsoft Edge:

   - **Key**: `HKLM\SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\joeclbldhdmoijbaagobkhlpfjglcihd\policy`
   - **Name**: `AllowedCallRedirectionSites`
   - **Type**: `REG_SZ`
   - **Data**: `<URLs>`

- For Google Chrome:

   - **Key**: `HKLM\SOFTWARE\Policies\Google\Chrome\3rdparty\extensions\lfmemoeeciijgkjkgbgikoonlkabmlno\policy`
   - **Name**: `AllowedCallRedirectionSites`
   - **Type**: `REG_SZ`
   - **Data**: `<URLs>`

You can configure the registry using an enterprise deployment tool such as Intune, Configuration Manager, or Group Policy. Alternatively, to set this registry value using PowerShell, open PowerShell as an administrator and run the following commands. This example uses the registry key for Microsoft Edge. Replace `<URLs>` with the sites you want to enable.

```powershell
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\joeclbldhdmoijbaagobkhlpfjglcihd\policy" -Force
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Edge\3rdparty\extensions\joeclbldhdmoijbaagobkhlpfjglcihd\policy" -Name AllowedCallRedirectionSites -PropertyType String -Value "<URLs>" -Force
```

### Enable call redirection for all sites for testing

You can enable call redirection for all sites to allow you to test web pages that aren't listed in [Websites for call redirection](#websites-for-call-redirection). This setting is experimental and can be useful when developing integration of your website with call redirection.

To enable call redirection for all sites:

1. On a local Windows device, add the following registry key and value:

   - **Key**: `HKEY_CURRENT_USER\Software\Microsoft\MMR`
   - **Type**: `REG_DWORD`
   - **Value**: `AllowCallRedirectionAllSites`
   - **Data**: `1`

1. Connect to a remote session and load a web browser, then select the extension icon in your browser.

1. Select **Show Advanced Settings**.

1. Toggle **Enable call redirection for all sites (experimental)** to **on**.

   :::image type="content" source="./media/multimedia-redirection/browser-extension-loaded-advanced-settings-call-redirection-all-sites.png" alt-text="A screenshot showing the browser extension with the option Enable call redirection for all sites (experimental) set to on.":::

## Next step

To troubleshoot issues or view known issues, see [our troubleshooting article](troubleshoot-multimedia-redirection.md).
