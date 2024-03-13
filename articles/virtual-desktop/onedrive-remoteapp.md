---
title: Use Microsoft OneDrive with a RemoteApp (preview) - Azure Virtual Desktop
description: Learn how to use Microsoft OneDrive with a RemoteApp in Azure Virtual Desktop.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 10/11/2023
---

# Use Microsoft OneDrive with a RemoteApp in Azure Virtual Desktop (preview)

> [!IMPORTANT]
> Using Microsoft OneDrive with a RemoteApp in Azure Virtual Desktop is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

You can use Microsoft OneDrive alongside a RemoteApp in Azure Virtual Desktop (preview), allowing users to access and synchronize their files while using a RemoteApp. When a user connects to a RemoteApp, OneDrive can automatically launch as a companion to the RemoteApp. This article describes how to configure OneDrive to automatically launch alongside a RemoteApp in Azure Virtual Desktop.

> [!IMPORTANT]
> - You should only use OneDrive with a RemoteApp for testing purposes as it requires an Insider Preview build of Windows 11 for your session hosts.
>
> - You can't use the setting **Start OneDrive automatically when I sign in to Windows** in the OneDrive preferences, which starts OneDrive when a user signs in. Instead, you need to configure OneDrive to launch by configuring a registry value, which is described in this article.

## User experience

Once configured, when a user launches a RemoteApp, the OneDrive icon is integrated in the taskbar of their local Windows device. If a user launches another RemoteApp from the same host pool on the same session host, the same instance of OneDrive is used and another doesn't start.

If your session hosts are joined to Microsoft Entra ID, you can [silently configure user accounts](/sharepoint/use-silent-account-configuration) so users are automatically signed in to OneDrive and start synchronizing straight away. Otherwise, users need to sign in to OneDrive on first use.

The icon for the instance of OneDrive accompanying the RemoteApp in the system tray looks the same as if OneDrive is installed on a local device. You can differentiate the OneDrive icon from the remote session by hovering over the icon where the tooltip includes the word **Remote**.

When a user closes or disconnects from the last RemoteApp they're using on the session host, OneDrive exits within a few minutes, unless the user has the OneDrive Action Center window open.

## Prerequisites

Before you can use OneDrive with a RemoteApp in Azure Virtual Desktop, you need:

- A pooled host pool that is configured as a [validation environment](configure-validation-environment.md).

- Session hosts in the host pool that:

   - Are running Windows 11 Insider Preview Enterprise multi-session, version 22H2, build 25905 or later. To get Insider Preview builds for multi-session, you need to start with a non-Insider build, join session hosts to the Windows Insider Program, then install the preview build. For more information on the Windows Insider Program, see [Get started with the Windows Insider Program](/windows-insider/get-started) and [Manage Insider Preview builds across your organization](/windows-insider/business/manage-builds). Intune [doesn't support update rings with multi-session](/mem/intune/fundamentals/azure-virtual-desktop-multi-session#additional-configurations-that-arent-supported-on-windows-10-or-windows-11-enterprise-multi-session-vms). 
   
   - Have the latest version of FSLogix installed. For more information, see [Install FSLogix applications](/fslogix/how-to-install-fslogix).

## Configure OneDrive to launch with a RemoteApp

To configure OneDrive to launch with a RemoteApp in Azure Virtual Desktop, follow these steps:

1. Download and install the latest version of the [OneDrive sync app](https://www.microsoft.com/microsoft-365/onedrive/download) per-machine on your session hosts. For more information, see [Install the sync app per-machine](/sharepoint/per-machine-installation).

1. If your session hosts are joined to Microsoft Entra ID, [silently configure user accounts](/sharepoint/use-silent-account-configuration) for OneDrive on your session hosts, so users are automatically signed in to OneDrive.

1. On your session hosts, set the following registry value:

   - **Key**: `HKLM\Software\Microsoft\Windows\CurrentVersion\Run`
   - **Type**: `REG_SZ`
   - **Name**: `OneDrive`
   - **Data**: `"C:\Program Files\Microsoft OneDrive\OneDrive.exe" /background`

   You can configure the registry using an enterprise deployment tool such as Intune, Configuration Manager, or Group Policy. Alternatively, to set this registry value using PowerShell, open PowerShell as an administrator and run the following command:

   ```powershell
   New-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" -Name OneDrive -PropertyType String -Value '"C:\Program Files\Microsoft OneDrive\OneDrive.exe" /background' -Force
   ```

## Test OneDrive with a RemoteApp

To test OneDrive with a RemoteApp, follow these steps:

1. Connect to a RemoteApp from the host pool and check that the OneDrive icon can be seen on the task bar of your local Windows device.

1. Check that OneDrive is synchronizing files by opening the OneDrive Action Center. Sign in to OneDrive if you weren't automatically signed in.

1. From the RemoteApp, check that you can access your files from OneDrive.

1. Finally, close the RemoteApp and any others from the same session host, and within a few minutes OneDrive should exit.

## OneDrive recommendations

When using OneDrive with a RemoteApp in Azure Virtual Desktop, we recommend that you configure the following settings using the OneDrive administrative template. For more information, see [Manage OneDrive using Group Policy](/sharepoint/use-group-policy#manage-onedrive-using-group-policy) and [Use administrative templates in Intune](/sharepoint/configure-sync-intune).

- [Allow syncing OneDrive accounts for only specific organizations](/sharepoint/use-group-policy#allow-syncing-onedrive-accounts-for-only-specific-organizations).
- [Use OneDrive files On-Demand](/sharepoint/use-group-policy#use-onedrive-files-on-demand).
- [Silently move Windows known folders to OneDrive](/sharepoint/use-group-policy#silently-move-windows-known-folders-to-onedrive).
- [Silently sign-in users to the OneDrive sync app with their Windows credentials](/sharepoint/use-group-policy#silently-sign-in-users-to-the-onedrive-sync-app-with-their-windows-credentials).
