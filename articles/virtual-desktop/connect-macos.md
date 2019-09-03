---
title: Connect to Windows Virtual Desktop from macOS  - Azure
description: How to connect to the Windows Virtual Desktop from macOS.
services: virtual-desktop
author: btaintor

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 09/03/2019
ms.author: helohr
---
# Connect from macOS

> Applies to:  macOS 10.12 or later.

A downloadable client is available that provides access to Windows Virtual Desktop resources from macOS devices.

## Install the client

[Download](https://apps.apple.com/app/microsoft-remote-desktop/id1295203466?mt=12) and install the client on your macOS device.

## Subscribe to a feed

Get the list of managed resources available to you by subscribing to the feed provided by your admin. Subscribing makes the resources available on your macOS device.

To subscribe to a feed:

1. Start the client, look for **Microsoft Remote Desktop 10**.
2. Select **Add Feed** on the main page to connect to the service and retrieve your resources.
3. Enter the Feed URL. This can be a URL or email address:
  - The URL is the RD Web Access server's URL, provided to you by your admin. For Windows Virtual Desktop, you can use https://rdweb.wvd.microsoft.com.
  - If you plan to use Email, enter your email address in this field. This tells the client to search for an RD Web Access server associated with your email address if it was configured by your admin.
3. Select **Subscribe**.
3. **Sign in** with your user account when prompted.

After successfully authenticating, you should now see a list of resources available to you.

Once subscribed to a feed, the content of the feed is updated automatically on a regular basis. Resources may be added, changed, or removed based on changes made by your administrator.

## Client documentation

For more documentation detailing how to use the macOS client, check out the [Remote Desktop Services documentation](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/remote-desktop-mac).
