---
title: Microsoft Teams on Azure Virtual Desktop - Azure
description: How to use Microsoft Teams on Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 06/27/2022
ms.author: helohr
manager: femila
---
# Use Microsoft Teams on Azure Virtual Desktop

>[!NOTE]
>Media optimization for Microsoft Teams is only available for the following two clients:
>
>- Windows Desktop client for Windows 10 or 11 machines, version 1.2.1026.0 or later.
>- macOS Remote Desktop client, version 10.7.7 or later.

Microsoft Teams on Azure Virtual Desktop supports chat and collaboration. With media optimizations, it also supports calling and meeting functionality. To learn more about how to use Microsoft Teams in Virtual Desktop Infrastructure (VDI) environments, see [Teams for Virtualized Desktop Infrastructure](/microsoftteams/teams-for-vdi/).

With media optimization for Microsoft Teams, the Remote Desktop client handles audio and video locally for Teams calls and meetings. You can still use Microsoft Teams on Azure Virtual Desktop with other clients without optimized calling and meetings. Teams chat and collaboration features are supported on all platforms. To redirect local devices in your remote session, check out [Customize Remote Desktop Protocol properties for a host pool](#customize-remote-desktop-protocol-properties-for-a-host-pool).

## Prerequisites

Before you can use Microsoft Teams on Azure Virtual Desktop, you'll need to do these things:

- [Prepare your network](/microsoftteams/prepare-network/) for Microsoft Teams.
- Install the [Remote Desktop client](./user-documentation/connect-windows-7-10.md) on a Windows 10, Windows 10 IoT Enterprise, Windows 11, or macOS 10.14 or later device that meets the [hardware requirements for Microsoft Teams](/microsoftteams/hardware-requirements-for-the-teams-app#hardware-requirements-for-teams-on-a-windows-pc/).
- Connect to a Windows 10 or 11 Multi-session or Windows 10 or 11 Enterprise virtual machine (VM).

## Install the Teams desktop app

This section will show you how to install the Teams desktop app on your Windows 10 or 11 Multi-session or Windows 10 or 11 Enterprise VM image. To learn more, check out [Install or update the Teams desktop app on VDI](/microsoftteams/teams-for-vdi#install-or-update-the-teams-desktop-app-on-vdi).

### Prepare your image for Teams

To enable media optimization for Teams, set the following registry key on the host VM:

1. From the start menu, run **Registry Editor** as an administrator. Navigate to `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Teams`. Create the Teams key if it doesn't already exist. 

2. Create the following value for the Teams key:

   | Name             | Type   | Data/Value  |
   |------------------|--------|-------------|
   | IsWVDEnvironment | DWORD  | 1           |

Alternatively, you can create the registry entry by running the following commands from an elevated PowerShell session:

```powershell
New-Item -Path "HKLM:\SOFTWARE\Microsoft\Teams" -Force
New-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Teams" -Name IsWVDEnvironment -PropertyType DWORD -Value 1 -Force
```

### Install the Teams WebSocket Service

Install the latest version of the [Remote Desktop WebRTC Redirector Service](https://aka.ms/msrdcwebrtcsvc/msi) on your VM image. If you encounter an installation error, install the [latest Microsoft Visual C++ Redistributable](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) and try again.

#### Latest WebSocket Service versions

The following table lists the latest versions of the WebSocket Service:

|Version        |Release date  |
|---------------|--------------|
|1.17.2205.23001|06/20/2022    |
|1.4.2111.18001 |12/02/2021    |
|1.1.2110.16001 |10/15/2021    |
|1.0.2106.14001 |07/29/2021    |
|1.0.2006.11001 |07/28/2020    |
|0.11.0         |05/29/2020    |

### Updates for version 1.17.2205.23001

- Fixed an issue that made the WebRTC redirector service disconnect from Teams on Azure Virtual Desktop.
- Added keyboard shortcut detection for Shift+Ctrl+; that lets users turn on a diagnostic overlay during calls on Teams for Azure Virtual Desktop. This feature is supported in version 1.2.3313 or later of the Windows Desktop client. 
- Added further stability and reliability improvements to the service.

#### Updates for version 1.4.2111.18001

- Fixed a mute notification problem.
- Multiple z-ordering fixes in Teams on Azure Virtual Desktop and Teams on Microsoft 365.
- Removed timeout that prevented the WebRTC redirector service from starting when the user connects.
- Fixed setup problems that prevented side-by-side installation from working.

#### Updates for version 1.1.2110.16001

- Fixed an issue that caused the screen to turn black while screen sharing. If you've been experiencing this issue, confirm that this update will resolve it by resizing the Teams window. If screen sharing starts working again after resizing, the update will resolve this issue.
- You can now control the meeting, ringtone, and notification volume from the host VM. You can only use this feature with version 1.2.2459 or later of [the Windows Desktop client](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-whatsnew).
- The installer will now make sure that Teams is closed before installing updates.
- Fixed an issue that prevented users from returning to full screen mode after leaving the call window.

#### Updates for version 1.0.2106.14001

Increased the connection reliability between the WebRTC redirector service and the WebRTC client plugin.

#### Updates for version 1.0.2006.11001

- Fixed an issue where minimizing the Teams app during a call or meeting caused incoming video to drop.
- Added support for selecting one monitor to share in multi-monitor desktop sessions.

### Install Microsoft Teams

You can deploy the Teams desktop app using a per-machine or per-user installation. To install Microsoft Teams in your Azure Virtual Desktop environment:

1. Download the [Teams MSI package](/microsoftteams/teams-for-vdi#deploy-the-teams-desktop-app-to-the-vm) that matches your environment. We recommend using the 64-bit installer on a 64-bit operating system.

2. Run one of the following commands to install the MSI to the host VM:

    - Per-user installation

        ```powershell
        msiexec /i <path_to_msi> /l*v <install_logfile_name>
        ```

        This process is the default installation, which installs Teams to the **%AppData%** user folder. Teams won't work properly with per-user installation on a non-persistent setup.

    - Per-machine installation

        ```powershell
        msiexec /i <path_to_msi> /l*v <install_logfile_name> ALLUSER=1
        ```

        This process installs Teams to the `%ProgramFiles(x86)%` folder on a 64-bit operating system and to the `%ProgramFiles%` folder on a 32-bit operating system. At this point, the golden image setup is complete. Installing Teams per-machine is required for non-persistent setups.

        There are two flags that may be set when installing teams, **ALLUSER=1** and **ALLUSERS=1**. It's important to understand the difference between these parameters. The **ALLUSER=1** parameter is used only in VDI environments to specify a per-machine installation. The **ALLUSERS=1** parameter can be used in non-VDI and VDI environments. When you set this parameter, **Teams Machine-Wide Installer** appears in Program and Features in Control Panel as well as Apps & features in Windows Settings. All users with admin credentials on the machine can uninstall Teams.

        > [!NOTE]
        > Users and admins can't disable automatic launch for Teams during sign-in at this time.

3. To uninstall the MSI from the host VM, run this command:

      ```powershell
      msiexec /passive /x <msi_name> /l*v <uninstall_logfile_name>
      ```

      This uninstalls Teams from the Program Files (x86) folder or Program Files folder, depending on the operating system environment.

      > [!NOTE]
      > When you install Teams with the MSI setting ALLUSER=1, automatic updates will be disabled. We recommend you make sure to update Teams at least once a month. To learn more about deploying the Teams desktop app, check out [Deploy the Teams desktop app to the VM](/microsoftteams/teams-for-vdi#deploy-the-teams-desktop-app-to-the-vm/).

>[!IMPORTANT]
>If you're using a version of the Remote Desktop client for macOS that's earlier than 10.7.7, in order to use our latest Teams optimization features, you'll need to update your client to version 10.7.7 or later, then go to **Microsoft Remote Desktop Preferences** > **General** and enable Teams optimizations. If you're using the client for the first time and already have version 10.7.7 or later installed, you won't need to do this, because Teams optimizations are enabled by default.

### Verify media optimizations loaded

After installing the WebSocket Service and the Teams desktop app, follow these steps to verify that Teams media optimizations loaded:

1. Quit and restart the Teams application.

2. Select your user profile image, then select **About**.

3. Select **Version**.

      If media optimizations loaded, the banner will show you **Azure Virtual Desktop Media optimized**. If the banner shows you **Azure Virtual Desktop Media not connected**, quit the Teams app and try again.

4. Select your user profile image, then select **Settings**.

      If media optimizations loaded, the audio devices and cameras available locally will be enumerated in the device menu. If the menu shows **Remote audio**, quit the Teams app and try again. If the devices still don't appear in the menu, check the Privacy settings on your local PC. Ensure the under **Settings** > **Privacy** > **App permissions - Microphone** the setting **"Allow apps to access your microphone"** is toggled **On**. Disconnect from the remote session, then reconnect and check the audio and video devices again. To join calls and meetings with video, you must also grant permission for apps to access your camera.

      If optimizations don't load, uninstall then reinstall Teams and check again.

## Known issues and limitations

Using Teams in a virtualized environment is different from using Teams in a non-virtualized environment. For more information about the limitations of Teams in virtualized environments, check out [Teams for Virtualized Desktop Infrastructure](/microsoftteams/teams-for-vdi#known-issues-and-limitations).

### Client deployment, installation, and setup

- With per-machine installation, Teams on VDI isn't automatically updated the same way non-VDI Teams clients are. To update the client, you'll need to update the VM image by installing a new MSI.
- Media optimization for Teams is only supported for the Remote Desktop client on machines running Windows 10 or later or macOS 10.14 or later.
- Use of explicit HTTP proxies defined on the client endpoint device isn't supported.
- Zoom in/zoom out of chat windows isn't supported.

### Calls and meetings

- The Teams desktop client in Azure Virtual Desktop environments doesn't support creating live events, but you can join live events. For now, we recommend you create live events from the [Teams web client](https://teams.microsoft.com) in your remote session instead. When watching a live event in the browser, [enable multimedia redirection (MMR) for Teams live events](multimedia-redirection.md#teams-live-events) for smoother playback.
- Calls or meetings don't currently support application sharing. Desktop sessions support desktop sharing.
- Due to WebRTC limitations, incoming and outgoing video stream resolution is limited to 720p.
- The Teams app doesn't support HID buttons or LED controls with other devices.
- New Meeting Experience (NME) isn't currently supported in VDI environments.
- Teams for Azure Virtual Desktop doesn't currently support uploading custom background images.

For Teams known issues that aren't related to virtualized environments, see [Support Teams in your organization](/microsoftteams/known-issues).

### Known issues for Teams for macOS

- You can't configure audio devices from the Teams app, and the client will automatically use the default client audio device. To switch audio devices, you'll need to configure your settings from the client audio preferences instead.
- Teams for Azure Virtual Desktop on macOS doesn't currently support background effects such as background blur and background images.
- Give control and take control aren't currently supported.

## Collect Teams logs

If you encounter issues with the Teams desktop app in your Azure Virtual Desktop environment, collect client logs under **%appdata%\Microsoft\Teams\logs.txt** on the host VM.

If you encounter issues with calls and meetings, collect Teams Web client logs with the key combination **Ctrl** + **Alt** + **Shift** + **1**. Logs will be written to **%userprofile%\Downloads\MSTeams Diagnostics Log DATE_TIME.txt** on the host VM.

## Contact Microsoft Teams support

To contact Microsoft Teams support, go to the [Microsoft 365 admin center](/microsoft-365/admin/contact-support-for-business-products).

## Customize Remote Desktop Protocol properties for a host pool

Customizing a host pool's Remote Desktop Protocol (RDP) properties, such as multi-monitor experience or enabling microphone and audio redirection, lets you deliver an optimal experience for your users based on their needs.

Enabling device redirections isn't required when using Teams with media optimization. If you're using Teams without media optimization, set the following RDP properties to enable microphone and camera redirection:

- `audiocapturemode:i:1` enables audio capture from the local device and redirects audio applications in the remote session.
- `audiomode:i:0` plays audio on the local computer.
- `camerastoredirect:s:*` redirects all cameras.

To learn more, check out [Customize Remote Desktop Protocol properties for a host pool](customize-rdp-properties.md).
