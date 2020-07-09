---
title: Connect to Windows Virtual Desktop Windows 10 or 7 - Azure
description: How to connect to Windows Virtual Desktop using the Windows Desktop client.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 06/25/2020
ms.author: helohr
manager: lizross
---
# Connect with the Windows Desktop client

> Applies to: Windows 7, Windows 10, and Windows 10 IoT Enterprise

>[!IMPORTANT]
>This content applies to the Fall 2019 release that doesn't support Azure Resource Manager Windows Virtual Desktop objects. If you're trying to manage Azure Resource Manager Windows Virtual Desktop objects introduced in the Spring 2020 update, see [this article](../connect-windows-7-and-10.md).

You can access Windows Virtual Desktop resources on devices with Windows 7, Windows 10, and Windows 10 IoT Enterprise using the Windows Desktop client.

>[!NOTE]
>The Windows client automatically defaults to Windows Virtual Desktop Fall 2019 release. However, if the client detects that the user also has Azure Resource Manager resources, it automatically adds the resources or notifies the user that they are available.

> [!IMPORTANT]
> Windows Virtual Desktop doesn't support the RemoteApp and Desktop Connections (RADC) client or the Remote Desktop Connection (MSTSC) client.

> [!IMPORTANT]
> Windows Virtual Desktop doesn't currently support the Remote Desktop client from the Windows Store. Support for this client will be added in a future release.

## Install the Windows Desktop client

Choose the client that matches your version of Windows:

- [Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2068602)
- [Windows 32-bit](https://go.microsoft.com/fwlink/?linkid=2098960)
- [Windows ARM64](https://go.microsoft.com/fwlink/?linkid=2098961)

You can install the client for the current user, which doesn't require admin rights, or your admin can install and configure the client so that all users on the device can access it.

Once installed, the client can be launched from the Start menu by searching for **Remote Desktop**.

## Subscribe to a Workspace

Get the list of managed resources available to you by subscribing to the Workspace provided by your admin. Subscribing makes the resources available on your local PC.

To subscribe to a Workspace:

1. Open the Windows Desktop client.
2. Select **Subscribe** on the main page to connect to the service and retrieve your resources.
3. Sign in with your user account when prompted.

After you successfully sign in, you should see a list of the resources you can access.

You can launch resources by one of two methods.

- From the client's main page, double-click a resource to launch it.
- Launch a resource as you normally would other apps from the Start Menu.
  - You can also search for the apps in the search bar.

Once subscribed to a Workspace, its content is updated automatically on a regular basis. Resources may be added, changed, or removed based on changes made by your administrator.

## Next steps

To learn more about how to use the Windows Desktop client, check out [Get started with the Windows Desktop client](/windows-server/remote/remote-desktop-services/clients/windowsdesktop/).
