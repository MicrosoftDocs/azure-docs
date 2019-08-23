---
title: Connect to Windows Virtual Desktop Preview from Windows 10 or Windows 7 - Azure
description: How to connect to the Windows Virtual Desktop Preview from Windows 10 or Windows 7.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 04/24/2019
ms.author: helohr
---
# Connect from Windows 10 or Windows 7

> Applies to: Windows 7 and Windows 10.

A downloadable client is available that provides access to Windows Virtual Desktop Preview resources from devices running Windows 7 and Windows 10.

> [!IMPORTANT]
> Don't use **RemoteApp and Desktop Connections (RADC)** or **Remote Desktop Connection (MSTSC)** to access Windows Virtual Desktop resources because Windows Virtual Desktop doesn't support either client.

## Install the client

[Download](https://go.microsoft.com/fwlink/?linkid=2068602) and install the client to your local PC. The installation requires admin rights.

## Subscribe to a feed

Get the list of managed resources available to you by subscribing to the feed provided by your admin. Subscribing makes the resources available on your local PC.

To subscribe to a feed:

1. Start the client from the All Apps List, look for **Remote Desktop**.
1. Select **Subscribe** on the main page to connect to the service and retrieve your resources.
1. **Sign in** with your user account when prompted.

After successfully authenticating, you should now see a list of resources available to you.

You can launch resources by one of two methods.

- From the client's main page, double-click a resource to launch it.
- Launch a resource as you normally would other apps from the Start Menu.
  - You can also search for the apps in the search bar.

Once subscribed to a feed, the content of the feed is updated automatically on a regular basis. Resources may be added, changed, or removed based on changes made by your administrator.

## View the details of a feed

After subscribing, you can view additional information about the feed by accessing the details panel.

1. From the client's main page, select the ellipsis (**...**) to the right of the feed name.
1. From the dropdown menu, select **Details**.
1. The Details panel shows up on the right side of the client.

The Details panel contains useful information about the feed:

- The URL and username used to subscribe
- The number of apps and desktops
- The date/time of the last update
- The status of the last update

If needed, you can start a manual update by selecting on **Update now**.

## Unsubscribe from a feed

This section will teach you how to unsubscribe from a feed. You can unsubscribe to either subscribe again with a different account or remove your resources from the system.

1. From the client's main page, select the ellipsis (**...**) to the right of the feed name.
1. From the dropdown menu, select **Unsubscribe**.
1. Review and select **Continue** from the dialog.

## Update the client

When a new version of the client is available, you'll be notified by the client and the Windows Action Center. Select the notification to start the update process.
