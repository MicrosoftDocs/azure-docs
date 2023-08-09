---
title: Troubleshoot Multimedia redirection on Azure Virtual Desktop - Azure
description: Known issues and troubleshooting instructions for multimedia redirection for Azure Virtual Desktop.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 07/18/2023
ms.author: helohr
manager: femila
---
# Troubleshoot multimedia redirection for Azure Virtual Desktop

> [!IMPORTANT]
> Call redirection is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article describes known issues and troubleshooting instructions for multimedia redirection for Azure Virtual Desktop.

## Known issues and limitations

The following issues are ones we're already aware of, so you won't need to report them:

- In the first browser tab a user opens, the extension pop-up might show a message that says, "The extension is not loaded", or a message that says video playback or call redirection isn't supported while redirection is working correctly in the tab. You can resolve this issue by opening a second tab. 

- Multimedia redirection only works on the [Windows Desktop client](users/connect-windows.md). Any other clients, such as the macOS, iOS, Android or Web client, don't support multimedia redirection.

- Multimedia redirection won't work as expected if the session hosts in your deployment are blocking cmd.exe.

- If you aren't using the default Windows size settings for video players, such as not fitting the player to window, not maximizing the window, and so on), parts of video players may not appear correctly. If you encounter this issue, you should change the settings back to Default mode.

- If your monitor or browser scale factor isn't set to 100%, you may see a gray pattern appear on the video screen.

### The MSI installer doesn't work

- There's a small chance that the MSI installer won't be able to install the extension during internal testing. If you run into this issue, you'll need to install the multimedia redirection extension from the Microsoft Edge Store or Google Chrome Store.

  - [Multimedia redirection browser extension (Microsoft Edge)](https://microsoftedge.microsoft.com/addons/detail/wvd-multimedia-redirectio/joeclbldhdmoijbaagobkhlpfjglcihd)
  - [Multimedia browser extension (Google Chrome)](https://chrome.google.com/webstore/detail/wvd-multimedia-redirectio/lfmemoeeciijgkjkgbgikoonlkabmlno)

- Installing the extension on host machines with the MSI installer will either prompt users to accept the extension the first time they open the browser or display a warning or error message. If users deny this prompt, it can cause the extension to not load. To avoid this issue, install the extensions by [editing the group policy](multimedia-redirection.md#install-the-browser-extension-using-group-policy).

- Sometimes the host and client version number disappears from the extension status message, which prevents the extension from loading on websites that support it. If you've installed the extension correctly, this issue is because your host machine doesn't have the latest C++ Redistributable installed. To fix this issue, install the [latest supported Visual C++ Redistributable downloads](/cpp/windows/latest-supported-vc-redist).

### Known issues for video playback redirection

- Video playback redirection doesn't currently support protected content, so videos that use protected content, such as from Pluralsight and Netflix, won't work.

- When you resize the video window, the window's size will adjust faster than the video itself. You'll also see this issue when minimizing and maximizing the window.

- If you access a video site, sometimes the video will remain in a loading or buffering state but never actually start playing. We're aware of this issue and are currently investigating it. For now, you can make videos load again by signing out of Azure Virtual Desktop and restarting your session.

### Known issues for call redirection

- Call redirection only works for WebRTC-based audio calls on the sites listed in [Call redirection](multimedia-redirection-intro.md#call-redirection).

- When disconnecting from a remote session, call redirection might stop working. You can make redirection start working again by refreshing the webpage.

- If you enabled the **Enable video playback for all sites** setting in the multimedia redirection extension pop-up and see issues on a supported WebRTC audio calling site, disable the setting and try again.

## Getting help for call redirection and video playback

If you can start a call with multimedia redirection enabled and can see the green phone icon on the extension icon while calling, but the call quality is low, you should contact the app provider for help.

If calls aren't going through, certain features don't work as expected while multimedia redirection is enabled, or multimedia redirection won't enable at all, you must submit a [Microsoft support ticket](../azure-portal/supportability/how-to-create-azure-support-request.md).

If you encounter any video playback issues that this guide doesn't address or resolve, submit a [Microsoft support ticket](../azure-portal/supportability/how-to-create-azure-support-request.md).

## Log collection

If you encounter any issues, you can collect logs from the extension and provide them to your IT admin or support.

To enable log collection:

1. Select the multimedia redirection extension icon in your browser.

1. Select **Show Advanced Settings**.

1. For **Collect logs**, select **Start**.

## Next steps

For more information about this feature and how it works, see [What is multimedia redirection for Azure Virtual Desktop?](multimedia-redirection-intro.md).

To learn how to use this feature, see [Multimedia redirection for Azure Virtual Desktop](multimedia-redirection.md).
