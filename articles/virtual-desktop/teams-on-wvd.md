---
title: Microsoft Teams on Windows Virtual Desktop - Azure
description: How to use Microsoft Teams on Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 05/29/2020
ms.author: helohr
manager: lizross
---
# Use Microsoft Teams on Windows Virtual desktop

>[!IMPORTANT]
>Media optimization for Microsoft Teams is currently in public preview. We recommend evaluating the optimized Teams user experience before deploying Teams for production workloads. Certain features might not be supported or might have constrained capabilities.

>[!NOTE]
>Media optimization for Microsoft Teams is only available for the Windows Desktop client on Windows 10 machines. Media optimizations require Windows Desktop client version 1.2.1026.0 or later.

Microsoft Teams on Windows Virtual Desktop supports chat and collaboration. With media optimizations, it also supports calling and meeting functionality. To learn more about how to use Microsoft Teams in Virtual Desktop Infrastructure (VDI) environments, see [Teams for Virtualized Desktop Infrastructure](/microsoftteams/teams-for-vdi/).

With media optimization for Microsoft Teams, the Windows Desktop client handles audio and video locally for Teams calls and meetings. You can still use Microsoft Teams on Windows Virtual Desktop with other clients without optimized calling and meetings. Teams chat and collaboration features are supported on all platforms. To redirect local devices in your remote session, check out [Customize Remote Desktop Protocol properties for a host pool](#customize-remote-desktop-protocol-properties-for-a-host-pool).

## Prerequisites

Before you can use Microsoft Teams on Windows Virtual Desktop, you'll need to do these things:

- [Prepare your network](/microsoftteams/prepare-network/) for Microsoft Teams.
- Install the [Windows Desktop client](connect-windows-7-and-10.md) on a Windows 10 or Windows 10 IoT Enterprise device that meets the Microsoft Teams [hardware requirements for Teams on a Windows PC](/microsoftteams/hardware-requirements-for-the-teams-app#hardware-requirements-for-teams-on-a-windows-pc/).
- Connect to a Windows 10 Multi-session or Windows 10 Enterprise virtual machine (VM).
- Install the Teams desktop app on the host using per-machine installation. Media optimization for Microsoft Teams requires Teams desktop app version 1.3.00.4461 or later.

## Install the Teams desktop app

This section will show you how to install the Teams desktop app on your Windows 10 Multi-session or Windows 10 Enterprise VM image. To learn more, check out [Install or update the Teams desktop app on VDI](/microsoftteams/teams-for-vdi#install-or-update-the-teams-desktop-app-on-vdi/).

### Prepare your image for Teams

To enable media optimization for Teams, set the following registry key on the host:

1. From the start menu, run **RegEdit** as an administrator. Navigate to **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Teams**.
2. Create the following value for the Teams key:

| Name             | Type   | Data/Value  |
|------------------|--------|-------------|
| IsWVDEnvironment | DWORD  | 1           |

### Install the Teams WebSocket Service

Install the [WebSocket Service](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE4yj0i) on your VM image. If you encounter an installation error, install the [latest Microsoft Visual C++ Redistributable](https://support.microsoft.com/help/2977003/the-latest-supported-visual-c-downloads) and try again.

### Install Microsoft Teams

You can deploy the Teams desktop app using a per-machine or per-user installation. To install Microsoft Teams in your Windows Virtual Desktop environment:

1. Download the [Teams MSI package](/microsoftteams/teams-for-vdi#deploy-the-teams-desktop-app-to-the-vm/) that matches your environment. We recommend using the 64-bit installer on a 64-bit operating system.

      > [!NOTE]
      > Media optimization for Microsoft Teams requires Teams desktop app version 1.3.00.4461 or later.

2. Run one of the following commands to install the MSI to the host VM:

    - Per-user installation

        ```powershell
        msiexec /i <path_to_msi> /l*v <install_logfile_name> ALLUSERS=1
        ```

        This process is the default installation, which installs Teams to the **%AppData%** user folder. Teams won't work properly with per-user installation on a non-persistent setup.

    - Per-machine installation

        ```powershell
        msiexec /i <path_to_msi> /l*v <install_logfile_name> ALLUSER=1 ALLUSERS=1
        ```

        This installs Teams to the Program Files (x86) folder on a 64-bit operating system and to the Program Files folder on a 32-bit operating system. At this point, the golden image setup is complete. Installing Teams per-machine is required for non-persistent setups.

        The next time you open Teams in a session, you'll be asked for your credentials.

        > [!NOTE]
        > Users and admins can't disable automatic launch for Teams during sign-in at this time.

3. To uninstall the MSI from the host VM, run this command:

      ```powershell
      msiexec /passive /x <msi_name> /l*v <uninstall_logfile_name>
      ```

      This uninstalls Teams from the Program Files (x86) folder or Program Files folder, depending on the operating system environment.

      > [!NOTE]
      > When you install Teams with the MSI setting ALLUSER=1, automatic updates will be disabled. We recommend you make sure to update Teams at least once a month. To learn more about deploying the Teams desktop app, check out [Deploy the Teams desktop app to the VM](/microsoftteams/teams-for-vdi#deploy-the-teams-desktop-app-to-the-vm/).

### Verify media optimizations loaded

After installing the WebSocket Service and the Teams desktop app, follow these steps to verify that Teams media optimizations loaded:

1. Select your user profile image, then select **About**.
2. Select **Version**.

      If media optimizations loaded, the banner will show you **WVD Media optimized**. If the banner shows you **WVD Media not connected**, quit the Teams app and try again.

3. Select your user profile image, then select **Settings**.

      If media optimizations loaded, the audio devices and cameras available locally will be enumerated in the device menu. If the menu shows **Remote audio**, quit the Teams app and try again. If the devices still don't appear in the menu, go back to [Install Microsoft Teams](#install-microsoft-teams) and make sure you've completed the installation process.

## Known issues and limitations

Using Teams in a virtualized environment is different from using Teams in a non-virtualized environment. For more information about the limitations of Teams in virtualized environments, check out [Teams for Virtualized Desktop Infrastructure](/microsoftteams/teams-for-vdi#known-issues-and-limitations/).

### Client deployment, installation, and setup

- With per-machine installation, Teams on VDI isn't automatically updated the same way non-VDI Teams clients are. To update the client, you'll need to update the VM image by installing a new MSI.
- Teams currently only shows the UTC time zone in chat, channels, and calendar.
- Media optimization for Teams is only supported for the Windows Desktop client on machines running Windows 10.
- Use of explicit HTTP proxies defined on an endpoint is not supported.

### Calls and meetings

- The Teams desktop client in Windows Virtual Desktop environments doesn't support live events. For now, we recommend you join live events from the [Teams web client](https://teams.microsoft.com) in your remote session instead.
- Minimizing the Teams app during a call or meeting may result in the incoming video feed disappearing when you expand the app.
- Calls or meetings don't currently support application sharing. Desktop sessions support desktop sharing.
- When desktop sharing in a multi-monitor setup, all monitors are shared.
- Give control and take control aren't currently supported.
- Teams on Windows Virtual Desktop only supports one incoming video input at a time. This means that whenever someone tries to share their screen, their screen will appear instead of the meeting leader's screen.
- Due to WebRTC limitations, incoming and outgoing video stream resolution is limited to 720p.
- The Teams app doesn't support HID buttons or LED controls with other devices.

For Teams known issues that aren't related to virtualized environments, see [Support Teams in your organization](/microsoftteams/known-issues/)

## UserVoice site

Provide feedback for Microsoft Teams on Windows Virtual Desktop on the Teams [UserVoice site](https://microsoftteams.uservoice.com/).

## Collect Teams logs

If you encounter issues with the Teams desktop app in your Windows Virtual Desktop environment, collect client logs under **%appdata%\Microsoft\Teams\logs.txt** on the host VM.

If you encounter issues with calls and meetings, collect Teams Web client logs with the key combination **Ctrl** + **Alt** + **Shift** + **1**. Logs will be written to **%userprofile%\Downloads\MSTeams Diagnostics Log DATE_TIME.txt** on the host VM.

## Contact Microsoft Teams support

To contact Microsoft Teams support, go to the [Microsoft 365 admin center](/microsoft-365/admin/contact-support-for-business-products).

## Customize Remote Desktop Protocol properties for a host pool

Customizing a host pool's Remote Desktop Protocol (RDP) properties, such as multi-monitor experience or enabling microphone and audio redirection, lets you deliver an optimal experience for your users based on their needs.

Enabling device redirections is not required when using Teams with media optimization. If you are using Teams without media optimization, set the following RDP properties to enable microphone and camera redirection:

- `audiocapturemode:i:1` enables audio capture from the local device and redirects audio applications in the remote session.
- `audiomode:i:0` plays audio on the local computer.
- `camerastoredirect:s:*` redirects all cameras.

To learn more, check out [Customize Remote Desktop Protocol properties for a host pool](customize-rdp-properties.md).
