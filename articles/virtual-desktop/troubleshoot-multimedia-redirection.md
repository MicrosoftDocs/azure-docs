---
title: Troubleshoot Multimedia redirection on Azure Virtual Desktop - Azure
description: Known issues and troubleshooting instructions for multimedia redirection for Azure Virtual Desktop (preview).
author: Heidilohr
ms.topic: troubleshooting
ms.date: 09/27/2022
ms.author: helohr
manager: femila
---
# Troubleshoot multimedia redirection for Azure Virtual Desktop

> [!IMPORTANT]
> Multimedia redirection for Azure Virtual Desktop is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

>[!NOTE]
>Azure Virtual Desktop doesn't currently support multimedia redirection on Azure Virtual Desktop for Microsoft 365 Government (GCC), GCC-High environments, and Microsoft 365 DoD.
>
>Multimedia redirection on Azure Virtual Desktop is only available for the Windows Desktop client on Windows 11, Windows 10, or Windows 10 IoT Enterprise devices. Multimedia redirection requires the [Windows Desktop client, version 1.2.3573 or later](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-whatsnew).

This article describes known issues and troubleshooting instructions for multimedia redirection (MMR) for Azure Virtual Desktop (preview).

## Known issues and limitations

The following issues are ones we're already aware of, so you won't need to report them:

- In the first browser tab a user opens, the extension pop-up might show a message that says, “The extension is not loaded”, or a message that says video playback or calling redirection isn't supported while redirection is working correctly in the tab. You can resolve this issue by opening a second tab. 

- Multimedia redirection only works on the [Windows Desktop client](/windows-server/remote/remote-desktop-services/clients/windowsdesktop#install-the-client), not the web client.

- Multimedia redirection doesn't currently support protected content, so videos from Netflix, for example, won't work.

- During public preview, multimedia redirection will be disabled on all sites except for the sites listed in [Websites that work with MMR](multimedia-redirection-intro.md#websites-that-work-with-multimedia-redirection). However, you can enable multimedia redirection for all websites by following the steps in [Enable video playback for all sites](multimedia-redirection.md#enable-video-playback-for-all-sites). We added the extension so organizations can test the feature on their company websites.

- When you resize the video window, the window's size will adjust faster than the video itself. You'll also see this issue when minimizing and maximizing the window.

- You might run into issue where you are stuck in the loading state on every video site. This is a known issue that we're currently investigating. To temporarily mitigate this issue, sign out of Azure Virtual Desktop and restart your session.

### The MSI installer doesn't work

- There's a small chance that the MSI installer won't be able to install the extension during internal testing. If you run into this issue, you'll need to install the multimedia redirection extension from the Microsoft Edge Store or Google Chrome Store.

  - [Multimedia redirection browser extension (Microsoft Edge)](https://microsoftedge.microsoft.com/addons/detail/wvd-multimedia-redirectio/joeclbldhdmoijbaagobkhlpfjglcihd)
  - [Multimedia browser extension (Google Chrome)](https://chrome.google.com/webstore/detail/wvd-multimedia-redirectio/lfmemoeeciijgkjkgbgikoonlkabmlno)

- Installing the extension on host machines with the MSI installer will either prompt users to accept the extension the first time they open the browser or display a warning or error message. If users deny this prompt, it can cause the extension to not load. To avoid this issue, install the extensions by [editing the group policy](multimedia-redirection.md#install-the-browser-extension-using-group-policy).

- Sometimes the host and client version number disappears from the extension status message, which prevents the extension from loading on websites that support it. If you've installed the extension correctly, this issue is because your host machine doesn't have the latest C++ Redistributable installed. To fix this issue, install the [latest supported Visual C++ Redistributable downloads](/cpp/windows/latest-supported-vc-redist).

### Video playback redirection

- Video playback redirection only works on the [Windows Desktop client](/windows-server/remote/remote-desktop-services/clients/windowsdesktop#install-the-client), not the web client or other platforms such as macOS, Linux, and so on.

- Video playback redirection doesn't currently support protected content, so videos from Pluralsight and Netflix won't work.

- During public preview, video playback redirection will be disabled on all sites except for the sites listed in [Websites that work with MMR](multimedia-redirection-intro.md#websites-that-work-with-multimedia-redirection). However, if you have the extension, you can enable video playback redirection for all websites. We added the extension so organizations can test the feature on their company websites.

- When you resize the video window, the window's size will adjust faster than the video itself. You'll also see this issue when minimizing and maximizing the window.

## Log collection

If you encounter any issues, you can collect logs from the extension and provide them to your IT admin or support.

To enable log collection:

1. Select the multimedia redirection extension icon in your browser.

1. Select **Show Advanced Settings**.

1. For **Collect logs**, select **Start**.

## Support during public preview

If you run into issues while using the public preview version of multimedia redirection that this article can't solve, we recommend contacting Microsoft Support.

## Next steps

For more information about this feature and how it works, see [What is multimedia redirection for Azure Virtual Desktop? (preview)](multimedia-redirection-intro.md).

To learn how to use this feature, see [Multimedia redirection for Azure Virtual Desktop (preview)](multimedia-redirection.md).
