---
title: Connect to Windows Virtual Desktop Preview with Windows 7 and Windows 10  - Azure
description: How to connect to the Windows Virtual Desktop Preview service with Windows 7 or Windows 10.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 03/27/2019
ms.author: helohr
---
# Connect with Windows 7 and Windows 10

> Applies to: Windows 7 and Windows 10.

A downloadable client is available that provides access to Windows Virtual Desktop Preview resources from devices running Windows 7 and Windows 10.

> [!IMPORTANT]
> Don't use **RemoteApp and Desktop Connections (RADC)** or **Remote Desktop Connection (MSTSC)** to access Windows Virtual Desktop resources because Windows Virtual Desktop doesn't support either client.

## Install the client

[Download](https://go.microsoft.com/fwlink/?linkid=2068602) and install the client to your local PC. This requires admin rights.

## Subscribe to a feed

Get the list of resources available to you from your local PC by subscribing to the feed provided by your admin.

To subscribe to a feed:

1. Start the client from the All Apps List, look for **Remote Desktop**.
1. Select **Subscribe** on the main page to connect to the service and retrieve your resources.
1. **Sign in** with your user account when prompted.

After successfully authenticating, you should now see a list of resources available to you.

You can launch resources by one of two methods.

- From the client's main page, double-click a resource to launch it.
- Launch a resource as you normally would other apps from the Start Menu.
  - You can also search for the apps in the search bar.

## Update the client

When a new version of the client is available, you'll be notified by the client and the Windows Action Center. Select the notification to start the update process.
