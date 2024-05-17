---
title: Use Microsoft Teams on Azure Virtual Desktop - Azure
description: How to use Microsoft Teams on Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 12/06/2023
ms.author: helohr
---
# Use Microsoft Teams on Azure Virtual Desktop

Microsoft Teams on Azure Virtual Desktop supports chat and collaboration. With media optimizations, it also supports calling and meeting functionality by redirecting it to the local device when using a supported Remote Desktop client. You can still use Microsoft Teams on Azure Virtual Desktop with other clients without optimized calling and meetings. Teams chat and collaboration features are supported on all platforms.

> [!TIP]
> The new Microsoft Teams app is now generally available to use with Azure Virtual Desktop, with feature parity with the classic Teams app and improved performance, reliability, and security.
>
> If you're using the [classic Teams app with Virtual Desktop Infrastructure (VDI) environments](/microsoftteams/teams-for-vdi), such as as Azure Virtual Desktop, end of support is **October 1, 2024** and end of availability is **July 1, 2025**, after which you'll need to use the new Microsoft Teams app. For more information, see [End of availability for classic Teams app](/microsoftteams/teams-classic-client-end-of-availability).

## Prerequisites

Before you can use Microsoft Teams on Azure Virtual Desktop, you'll need to do these things:

- [Prepare your network](/microsoftteams/prepare-network/) for Microsoft Teams.

- Connect to a session host running Windows 10 or 11 multi-session or Windows 10 or 11 Enterprise. Session hosts running an N or KN SKU of Windows aren't supported.

- For Windows, you also need to install the latest version of the [Microsoft Visual C++ Redistributable](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) on your client device and session hosts. The C++ Redistributable is required to use media optimization for Teams on Azure Virtual Desktop.

- Install the latest [Remote Desktop client](./users/connect-windows.md) on a client device running Windows 10, Windows 10 IoT Enterprise, Windows 11, or macOS 10.14 or later that meets the [hardware requirements for Microsoft Teams](/microsoftteams/hardware-requirements-for-the-teams-app#hardware-requirements-for-teams-on-a-windows-pc/).

- If you use FSLogix for profile management and want to use the new Microsoft Teams app, you need to install FSLogix 2210 hotfix 3 (2.9.8716.30241) or later.

Media optimization for Microsoft Teams is only available for the following clients:

- [Remote Desktop client for Windows](users/connect-windows.md) or the [Azure Virtual Desktop app](users/connect-windows-azure-virtual-desktop-app.md), version 1.2.1026.0 or later, including ARM64-based devices.

- [Remote Desktop client for macOS](users/connect-macos.md), version 10.7.7 or later.

- [Windows App](/windows-app/get-started-connect-devices-desktops-apps).

For more information about which features Teams on Azure Virtual Desktop supports and minimum required client versions, see [Supported features for Teams on Azure Virtual Desktop](teams-supported-features.md).

## Prepare to install the Teams desktop app

This section will show you how to install the Teams desktop app on your Windows 10 or 11 Enterprise multi-session or Windows 10 or 11 Enterprise VM image.

### Enable media optimization for Teams

To enable media optimization for Teams, set the following registry key on the host VM:

1. From the start menu, run **Registry Editor** as an administrator. Go to `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Teams`. Create the Teams key if it doesn't already exist. 

2. Create the following value for the Teams key:

   | Name             | Type   | Data/Value  |
   |------------------|--------|-------------|
   | IsWVDEnvironment | DWORD  | 1           |

Alternatively, you can create the registry entry by running the following commands from an elevated PowerShell session:

```powershell
New-Item -Path "HKLM:\SOFTWARE\Microsoft\Teams" -Force
New-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Teams" -Name IsWVDEnvironment -PropertyType DWORD -Value 1 -Force
```

### Install the Remote Desktop WebRTC Redirector Service

The Remote Desktop WebRTC Redirector Service is required to run Teams on Azure Virtual Desktop. To install the service:

1. Sign in to a session host as a local administrator.

1. Download the [Remote Desktop WebRTC Redirector Service installer](https://aka.ms/msrdcwebrtcsvc/msi).

1. Open the file that you downloaded to start the setup process.

1. Follow the prompts. Once it's completed, select **Finish**.

You can find more information about the latest version of the WebRTC Redirector Service at [What's new in the Remote Desktop WebRTC Redirector Service](whats-new-webrtc.md).

## Install Teams on session hosts

You can deploy the Teams desktop app per-machine or per-user. For session hosts in a pooled host pool, you'll need to install Teams per-machine. To install Teams on your session hosts follow the steps in the relevant article:

- [Install the classic Teams app](/microsoftteams/teams-for-vdi#deploy-the-teams-desktop-app-to-the-vm).
- [Install the new Teams app](/microsoftteams/new-teams-vdi-requirements-deploy).

## Verify media optimizations loaded

After installing the WebRTC Redirector Service and the Teams desktop app, follow these steps to verify that Teams media optimizations loaded:

1. Quit and restart the Teams application.

1. Select your user profile image, then select **About**.

1. Select **Version**.

      If media optimizations loaded, the banner will show you **Azure Virtual Desktop Media optimized**. If the banner shows you **Azure Virtual Desktop Media not connected**, quit the Teams app and try again.

1. Select your user profile image, then select **Settings**.

      If media optimizations loaded, the audio devices and cameras available locally will be enumerated in the device menu. If the menu shows **Remote audio**, quit the Teams app and try again. If the devices still don't appear in the menu, check the Privacy settings on your local PC. Ensure the under **Settings** > **Privacy** > **App permissions - Microphone** the setting **"Allow apps to access your microphone"** is toggled **On**. Disconnect from the remote session, then reconnect and check the audio and video devices again. To join calls and meetings with video, you must also grant permission for apps to access your camera.

      If optimizations don't load, uninstall then reinstall Teams and check again.

## Enable registry keys for optional features

If you want to use certain optional features for Teams on Azure Virtual Desktop, you'll need to enable certain registry keys. The following instructions only apply to Windows client devices and session host VMs.

### Enable hardware encode for Teams on Azure Virtual Desktop

Hardware encode lets you increase video quality for the outgoing camera during Teams calls. In order to enable this feature, your client will need to be running version 1.2.3213 or later of the [Windows Desktop client](whats-new-client-windows.md). You'll need to repeat the following instructions for every client device. 

To enable hardware encode:

1. On your client device, from the start menu, run **Registry Editor** as an administrator.
1. Go to `HKCU\SOFTWARE\Microsoft\Terminal Server Client\Default\AddIns\WebRTC Redirector`.
1. Add the **UseHardwareEncoding** as a DWORD value.
1. Set the value to **1** to enable the feature.
1. Repeat these instructions for every client device.

### Enable content sharing for Teams for RemoteApp

Enabling content sharing for Teams on Azure Virtual Desktop lets you share your screen or application window. To enable this feature, your session host VM needs to be running version 1.31.2211.15001 or later of [the WebRTC Redirector Service](whats-new-webrtc.md) and version 1.2.3401 or later of the [Windows Desktop client](whats-new-client-windows.md).

To enable content sharing:

1. On your session host VM, from the start menu, run **Registry Editor** as an administrator.
1. Go to `HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\AddIns\WebRTC Redirector\Policy`.
1. Add the **ShareClientDesktop** as a DWORD value.
1. Set the value to **1** to enable the feature.

### Disable desktop screen share for Teams for RemoteApp

You can disable desktop screen sharing for Teams on Azure Virtual Desktop. To enable this feature, your session host VM needs to be running version 1.31.2211.15001 or later of [the WebRTC service](whats-new-webrtc.md) and version 1.2.3401 or later of the [Windows Desktop client](whats-new-client-windows.md).

>[!NOTE]
>You must [enable the ShareClientDesktop key](#enable-content-sharing-for-teams-for-remoteapp) before you can use this key.

To disable desktop screen share:

1. On your session host VM, from the start menu, run **Registry Editor** as an administrator.
1. Go to `HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\AddIns\WebRTC Redirector\Policy`.
1. Add the **DisableRAILScreensharing** as a DWORD value.
1. Set the value to **1** to disable desktop screen share.

### Disable application window sharing for Teams for RemoteApp

You can disable application window sharing for Teams on Azure Virtual Desktop. To enable this feature, your session host VM needs to be running version 1.31.2211.15001 or later of [the WebRTC service](whats-new-webrtc.md) and version 1.2.3401 or later of the [Windows Desktop client](whats-new-client-windows.md).

>[!NOTE]
>You must [enable the ShareClientDesktop key](#enable-content-sharing-for-teams-for-remoteapp) before you can use this key.

To disable application window sharing:

1. On your session host VM, from the start menu, run **Registry Editor** as an administrator.
1. Go to `HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\AddIns\WebRTC Redirector\Policy`.
1. Add the **DisableRAILAppSharing** as a DWORD value.
1. Set the value to **1** to disable application window sharing.

## Customize Remote Desktop Protocol properties for a host pool

Customizing a host pool's Remote Desktop Protocol (RDP) properties, such as multi-monitor experience or enabling microphone and audio redirection, lets you deliver an optimal experience for your users based on their needs.

Enabling device redirections isn't required when using Teams with media optimization. If you're using Teams without media optimization, set the following RDP properties to enable microphone and camera redirection:

- `audiocapturemode:i:1` enables audio capture from the local device and redirects audio applications in the remote session.
- `audiomode:i:0` plays audio on the local computer.
- `camerastoredirect:s:*` redirects all cameras.

To learn more, check out [Customize Remote Desktop Protocol properties for a host pool](customize-rdp-properties.md).

## Next steps

See [Supported features for Teams on Azure Virtual Desktop](teams-supported-features.md) for more information about which features Teams on Azure Virtual Desktop supports and minimum required client versions.

Learn about known issues, limitations, and how to log issues at [Troubleshoot Teams on Azure Virtual Desktop](troubleshoot-teams.md).

Learn about the latest version of the WebRTC Redirector Service at [What's new in the WebRTC Redirector Service for Azure Virtual Desktop](whats-new-webrtc.md).
