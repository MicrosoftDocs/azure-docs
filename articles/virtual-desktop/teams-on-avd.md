---
title: Use Microsoft Teams on Azure Virtual Desktop - Azure
description: How to use Microsoft Teams on Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 06/14/2023
ms.author: helohr
manager: femila
---
# Use Microsoft Teams on Azure Virtual Desktop

Microsoft Teams on Azure Virtual Desktop supports chat and collaboration. With media optimizations, it also supports calling and meeting functionality. To learn more about how to use Microsoft Teams in Virtual Desktop Infrastructure (VDI) environments, see [Teams for Virtualized Desktop Infrastructure](/microsoftteams/teams-for-vdi/).

With media optimization for Microsoft Teams, the Remote Desktop client handles audio and video locally for Teams calls and meetings by redirecting it to the local device. You can still use Microsoft Teams on Azure Virtual Desktop with other clients without optimized calling and meetings. Teams chat and collaboration features are supported on all platforms.

## Prerequisites

Before you can use Microsoft Teams on Azure Virtual Desktop, you'll need to do these things:

- [Prepare your network](/microsoftteams/prepare-network/) for Microsoft Teams.

- Connect to a session host running Windows 10 or 11 multi-session or Windows 10 or 11 Enterprise. Session hosts running an N or KN SKU of Windows aren't supported.

- For Windows, you also need to install the latest version of the [Microsoft Visual C++ Redistributable](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) on your client device and session hosts. The C++ Redistributable is required to use media optimization for Teams on Azure Virtual Desktop.

- Install the [Remote Desktop client](./users/connect-windows.md) on a client device running Windows 10, Windows 10 IoT Enterprise, Windows 11, or macOS 10.14 or later that meets the [hardware requirements for Microsoft Teams](/microsoftteams/hardware-requirements-for-the-teams-app#hardware-requirements-for-teams-on-a-windows-pc/).

Media optimization for Microsoft Teams is only available for the following two clients:

- [Remote Desktop client for Windows](users/connect-windows.md) or the [Azure Virtual Desktop app](users/connect-windows-azure-virtual-desktop-app.md), version 1.2.1026.0 or later.

- [Remote Desktop client for macOS](users/connect-macos.md), version 10.7.7 or later.

For more information about which features Teams on Azure Virtual Desktop supports and minimum required client versions, see [Supported features for Teams on Azure Virtual Desktop](teams-supported-features.md).

## Prepare to install the Teams desktop app

This section will show you how to install the Teams desktop app on your Windows 10 or 11 Enterprise multi-session or Windows 10 or 11 Enterprise VM image. To learn more, check out [Install or update the Teams desktop app on VDI](/microsoftteams/teams-for-vdi#install-or-update-the-teams-desktop-app-on-vdi).

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

## Install Teams on Azure Virtual Desktop

You can deploy the Teams desktop app using a per-machine or per-user installation. To install Teams on Azure Virtual Desktop:

1. Download the [Teams MSI package](/microsoftteams/teams-for-vdi#deploy-the-teams-desktop-app-to-the-vm) that matches your environment. We recommend using the 64-bit installer on a 64-bit operating system.

1. Run one of the following commands to install the MSI to the host VM:

    - For per-machine installation, run this command:

        ```powershell
        msiexec /i <path_to_msi> /l*v <install_logfile_name> ALLUSER=1 ALLUSERS=1
        ```

        This process installs Teams to the `%ProgramFiles(x86)%` folder on a 64-bit operating system and to the `%ProgramFiles%` folder on a 32-bit operating system. At this point, the golden image setup is complete. Installing Teams per-machine is required for non-persistent setups.

        During this process, you can set the *ALLUSER=1* and the *ALLUSERS=1* parameters. The following table lists the differences between these two parameters.

        |Parameter|Purpose|
        |---|---|
        |ALLUSER=1|Used in virtual desktop infrastructure (VDI) environments to specify per-machine installation.|
        |ALLUSERS=1|Used in both non-VDI and VDI environments to make the Teams Machine-Wide Installer appear in Programs and Features under the Control Panel and in Apps & Features in Windows Settings. The installer lets all users with admin credentials uninstall Teams.|

        When you install Teams with the MSI setting ALLUSER=1, automatic updates will be disabled. We recommend you make sure to update Teams at least once a month. To learn more about deploying the Teams desktop app, check out [Deploy the Teams desktop app to the VM](/microsoftteams/teams-for-vdi#deploy-the-teams-desktop-app-to-the-vm/).
        
        > [!NOTE]
        > We recommend you use per-machine installation for better centralized management for both pooled and personal host pool setups.
        >
        > Users and admins can't disable automatic launch for Teams during sign-in at this time.

    - For per-user installation, run the following command:

        ```powershell
        msiexec /i <path_to_msi> /l*v <install_logfile_name> ALLUSERS=1
        ```

        This process installs Teams to the **%AppData%** user folder.
        
        >[!NOTE]
        >Per-user installation only works on personal host pools. If your deployment uses pooled host pools, we recommend using per-machine installation instead.

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

### Enable hardware encode for teams on Azure Virtual Desktop

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
