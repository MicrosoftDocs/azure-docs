---
title: Launch Microsoft OneDrive with a RemoteApp - Azure Virtual Desktop
description: Learn how to launch Microsoft OneDrive with a RemoteApp in Azure Virtual Desktop.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 11/26/2024
---

# Launch Microsoft OneDrive with a RemoteApp in Azure Virtual Desktop 

You can Launch Microsoft OneDrive alongside a RemoteApp in Azure Virtual Desktop, allowing users to access and synchronize their files while using a RemoteApp. When a user connects to a RemoteApp, OneDrive can automatically launch as a companion to the RemoteApp.

In the settings for OneDrive, there's the option **Start OneDrive when I sign in to Windows**, which ordinarily starts OneDrive when a user signs in. However, this setting doesn't work with RemoteApp in Azure Virtual Desktop. Instead, you configure OneDrive to launch by configuring a registry value. You also enable an enhanced shell experience for RemoteApp sessions, offering support for default file associations, `Run/RunOnce` registry keys, and more.

This article describes how to configure OneDrive to automatically launch alongside a RemoteApp in Azure Virtual Desktop.

## User experience

When a user launches a RemoteApp, OneDrive is also launched and the OneDrive icon is integrated in the taskbar of their local Windows device. If a user launches another RemoteApp from the same host pool on the same session host, it uses the same instance of OneDrive and another doesn't start.

If your session hosts are joined to Microsoft Entra ID, you can [silently configure user accounts](/sharepoint/use-silent-account-configuration) so users are automatically signed in to OneDrive and start synchronizing straight away. Otherwise, users need to sign in to OneDrive on first use.

The icon for the instance of OneDrive accompanying the RemoteApp in the system tray looks the same as if OneDrive is installed on a local device. You can differentiate the OneDrive icon from the remote session by hovering over the icon where the tooltip includes the word **Remote**.

When a user closes or disconnects from the last RemoteApp they're using on the session host, OneDrive exits within a few minutes, unless the user has the OneDrive Action Center window open.

## Prerequisites

Before you can use OneDrive with a RemoteApp in Azure Virtual Desktop:

- Your session hosts must be running Windows 11 Enterprise, version 24H2, or version 22H2 or 23H2 with the [2024-07 Cumulative Update for Windows 11 (KB5040442)](https://support.microsoft.com/kb/KB5040442) or later installed.

- If you're using FSLogix, install the latest version of FSLogix on your session hosts. For more information, see [Install FSLogix applications](/fslogix/how-to-install-fslogix).

- Use Windows App on Windows or the Remote Desktop client on Windows to connect to a remote session. Other platforms aren't supported.

## Configure OneDrive to launch with a RemoteApp

To configure OneDrive to launch with a RemoteApp in Azure Virtual Desktop, you need to enable an enhanced shell experience for RemoteApp sessions using Group Policy and set a registry value to launch OneDrive when a user connects to a RemoteApp. The Group Policy setting isn't available in Microsoft Intune.

1. Download and install the latest version of the [OneDrive sync app](https://www.microsoft.com/microsoft-365/onedrive/download) per-machine on your session hosts. For more information, see [Install the sync app per-machine](/sharepoint/per-machine-installation).

1. If your session hosts are joined to Microsoft Entra ID, [silently configure user accounts](/sharepoint/use-silent-account-configuration) for OneDrive on your session hosts, so users are automatically signed in to OneDrive.

1. The Group Policy settings are only available in Windows 11, version 22H2 or 23H2 with the [2024-07 Cumulative Update for Windows 11 (KB5040442)](https://support.microsoft.com/kb/KB5040442) or later installed. You need to copy the administrative template files `C:\Windows\PolicyDefinitions\terminalserver.admx` and `C:\Windows\PolicyDefinitions\en-US\terminalserver.adml` from a session host to the same location on your domain controllers or the [Group Policy Central Store](/troubleshoot/windows-client/group-policy/create-and-manage-central-store), depending on your environment. In the file path for `terminalserver.adml` replace `en-US` with the appropriate language code if you're using a different language.

1. Open the **Group Policy Management** console on a device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Remote Session Environment**.

   :::image type="content" source="media/onedrive-remoteapp/remote-session-environment-group-policy.png" alt-text="A screenshot showing the remote session environment options in the Group Policy editor." lightbox="media/onedrive-remoteapp/remote-session-environment-group-policy.png":::

1. Double-click the policy setting **Enable enhanced shell experience for RemoteApp** to open it. Select **Enabled**, then select **OK**. 

1. Set the following registry value:

   - **Key**: `HKLM\Software\Microsoft\Windows\CurrentVersion\Run`
   - **Type**: `REG_SZ`
   - **Name**: `OneDrive`
   - **Data**: `"C:\Program Files\Microsoft OneDrive\OneDrive.exe" /background`

   You can configure the registry using an enterprise deployment tool such as Intune, Configuration Manager, or Group Policy. Alternatively, to set this registry value using PowerShell, open PowerShell as an administrator and run the following command:

   ```powershell
   New-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" -Name OneDrive -PropertyType String -Value '"C:\Program Files\Microsoft OneDrive\OneDrive.exe" /background' -Force
   ```
    
1. Ensure the side-by-side stack on the session host is version 1.0.2404.16770 or higher. To check the version, run the following command from Command Prompt or PowerShell.

   ```cmd
   qwinsta
   ```

   The output includes a line beginning with `rdp-sxs` followed by a number, where the number correlates to the version number of the side-by-side stack, as shown in the following example. You can find a list of the version numbers at [What's new in the Azure Virtual Desktop SxS Network Stack](whats-new-sxs.md).

   ```output
   SESSIONNAME               USERNAME                 ID  STATE   TYPE        DEVICE
   services                                            0  Disc
   console                                             1  Conn
   rdp-tcp                                         65537  Listen
   rdp-sxs240705700                                65538  Listen
   ```

1. Restart the session hosts to apply the changes.

## Test OneDrive with a RemoteApp

To test OneDrive with a RemoteApp, follow these steps:

1. Use a supported version of Windows App or the Remote Desktop client to connect to a RemoteApp from the host pool withe the session hosts you configured.

1. Check that the OneDrive icon can be seen on the task bar of your local Windows device. Hover over the icon to show the tooltip and ensure it includes the word **Remote**, which differentiates it from a local instance of OneDrive.

1. Check that OneDrive is synchronizing files by opening the OneDrive Action Center. Sign in to OneDrive if you weren't automatically signed in.

1. From the RemoteApp, check that you can access your files from OneDrive.

1. Finally, close the RemoteApp and any others from the same session host, and within a few minutes OneDrive should exit.

## OneDrive recommendations

When using OneDrive with a RemoteApp in Azure Virtual Desktop, we recommend that you configure the following settings using the OneDrive administrative template. For more information, see [Manage OneDrive using Group Policy](/sharepoint/use-group-policy#manage-onedrive-using-group-policy) and [Use administrative templates in Intune](/sharepoint/configure-sync-intune).

- [Allow syncing OneDrive accounts for only specific organizations](/sharepoint/use-group-policy#allow-syncing-onedrive-accounts-for-only-specific-organizations).
- [Use OneDrive files On-Demand](/sharepoint/use-group-policy#use-onedrive-files-on-demand).
- [Silently move Windows known folders to OneDrive](/sharepoint/use-group-policy#silently-move-windows-known-folders-to-onedrive).
- [Silently sign-in users to the OneDrive sync app with their Windows credentials](/sharepoint/use-group-policy#silently-sign-in-users-to-the-onedrive-sync-app-with-their-windows-credentials).
