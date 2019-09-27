---
title: Connect to Windows Virtual Desktop Preview from Windows 10 or Windows 7 - Azure
description: How to connect to the Windows Virtual Desktop Preview from Windows 10 or Windows 7.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 09/24/2019
ms.author: helohr
---
# Connect with the Windows Desktop client

> Applies to: Windows 7 and Windows 10.

A downloadable client is available that provides access to Windows Virtual Desktop resources from devices running Windows 7 and Windows 10.

> [!IMPORTANT]
> Windows Virtual Desktop doesn't support the RemoteApp and Desktop Connections (RADC) client or the Remote Desktop Connection (MSTSC) client.

## Install the Windows Desktop client

These are the clients you can currently download:

- [Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2068602)

We'll update this list as the client becomes available for more versions of Windows.

You can install the client for the current user, which doesn't require admin rights, or your admin can install and configure the client so that all users on the device can access it.

Once installed, the client can be launched from the Start menu by searching for **Remote Desktop**.

## Subscribe to a feed

Get the list of managed resources available to you by subscribing to the feed provided by your admin. Subscribing makes the resources available on your local PC.

To subscribe to a feed:

1. Start the client from the All Apps List, look for **Remote Desktop**.
2. Select **Subscribe** on the main page to connect to the service and retrieve your resources.
3. Sign in with your user account when prompted.

After you successfully sign in, you should see a list of the resources you can access.

You can launch resources by one of two methods.

- From the client's main page, double-click a resource to launch it.
- Launch a resource as you normally would other apps from the Start Menu.
  - You can also search for the apps in the search bar.

Once subscribed to a feed, the content of the feed is updated automatically on a regular basis. Resources may be added, changed, or removed based on changes made by your administrator.

## Client documentation

To learn more about how to use the Windows Desktop client, check out [Get started with the Windows Desktop client](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/windowsdesktop).
