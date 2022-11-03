---
title: Connect to Azure Virtual Desktop with the Remote Desktop client for Windows - Azure Virtual Desktop
description: Learn how to connect to Azure Virtual Desktop using the Remote Desktop client for Windows.
author: dknappettmsft
ms.topic: how-to
ms.date: 10/04/2022
ms.author: daknappe
---

# Connect to Azure Virtual Desktop with the Remote Desktop client for Windows

The Microsoft Remote Desktop client is used to connect to Azure Virtual Desktop to access your desktops and applications. This article shows you how to connect to Azure Virtual Desktop with the Remote Desktop client for Windows.

You can find a list of all the Remote Desktop clients you can use to connect to Azure Virtual Desktop at [Remote Desktop clients overview](remote-desktop-clients-overview.md).

## Prerequisites

Before you can access your resources, you'll need to meet the prerequisites:

- Internet access.

- A device running one of the following supported versions of Windows:
  - Windows 11
  - Windows 11 IoT Enterprise
  - Windows 10
  - Windows 10 IoT Enterprise
  - Windows 7
  - Windows Server 2019
  - Windows Server 2016
  - Windows Server 2012 R2

- Download the Remote Desktop client installer, choosing the correct version for your device:
  - [Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2068602) *(most common)*
  - [Windows 32-bit](https://go.microsoft.com/fwlink/?linkid=2098960)
  - [Windows on Arm](https://go.microsoft.com/fwlink/?linkid=2098961)

- .NET Framework 4.6.2 or later. You may need to install this on Windows 7, Windows Server 2012 R2, Windows Server 2016, and some versions of Windows 10. To download the latest version, see [Download .NET Framework](https://dotnet.microsoft.com/download/dotnet-framework).

- You cannot sign-in using the built-in Administrator user account.

> [!IMPORTANT]
> Extended support for using Windows 7 to connect to Azure Virtual Desktop ends on January 10, 2023.

## Install the Remote Desktop client

Once you've downloaded the Remote Desktop client, you'll need to install it by following these steps:

1. Run the installer by double-clicking the file you downloaded.

1. On the welcome screen, select **Next**.

1. To accept the end-user license agreement, check the box for **I accept the terms in the License Agreement**, then select **Next**.

1. For the Installation Scope, select one of the following options:

   - **Install just for you**: Remote Desktop will be installed in a per-user folder and be available just for your user account. You don't need local Administrator privileges.
   - **Install for all users of this machine**: Remote Desktop will be installed in a per-machine folder and be available for all users. You must have local Administrator privileges

1. Select **Install**.

1. Once installation has completed, select **Finish**.

1. If you left the box for **Launch Remote Desktop when setup exits** selected, the Remote Desktop client will automatically open. Alternatively to launch the client after installation, use the Start menu to search for and select **Remote Desktop**.

## Subscribe to a workspace

A workspace combines all the desktops and applications that have been made available to you by your admin. To be able to see these in the Remote Desktop client, you need to subscribe to the workspace by following these steps:

1. Open the **Remote Desktop** app on your device.

2. The first time you subscribe to a workspace, from the **Let's get started** screen, select **Subscribe** or **Subscribe with URL**. Use the tabs below for your scenario.

# [Subscribe](#tab/subscribe)

3. If you selected **Subscribe**, sign in with your user account when prompted, for example `user@contoso.com`. After a few seconds, your workspaces should show the desktops and applications that have been made available to you by your admin.
   
   > [!TIP]
   > If you see the message **No workspace is associated with this email address**, your admin might not have set up email discovery. Try the steps in the **Subscribe with URL** tab instead.

# [Subscribe with URL](#tab/subscribe-with-url)
   
3. If you selected **Subscribe with URL**, in the **Email or Workspace URL** box, enter the relevant URL from the following table. After a few seconds, the message **We found Workspaces at the following URLs** should be displayed.

   | Azure environment | Workspace URL |
   |--|--|
   | Azure cloud *(most common)* | `https://rdweb.wvd.microsoft.com` |
   | Azure US Gov | `https://rdweb.wvd.azure.us/api/arm/feeddiscovery` |
   | Azure China 21Vianet | `https://rdweb.wvd.azure.cn/api/arm/feeddiscovery` |

4. Select **Next**.

5. Sign in with your user account when prompted. After a few seconds, the workspace should show the desktops and applications that have been made available to you by your admin.

Once you've subscribed to a workspace, its content will update automatically regularly and each time you start the client. Resources may be added, changed, or removed based on changes made by your admin.

---

## Connect to your desktops and applications

1. Open the **Remote Desktop** app on your device.

1. Double-click one of the icons to launch a session to Azure Virtual Desktop. You may be prompted to enter the password for your user account again, depending on how your admin has configured Azure Virtual Desktop.

## Windows Insider

If you want to help us test new builds before they're released, you should download our Insider releases. Organizations can use the Insider releases to validate new versions for their users before they're generally available. For more information, see [Enable Windows Insider releases](client-features-windows.md#enable-windows-insider-releases).

## Next steps

To learn more about the features of the Remote Desktop client for Windows, check out [Use features of the Remote Desktop client for Windows when connecting to Azure Virtual Desktop](client-features-windows.md).
