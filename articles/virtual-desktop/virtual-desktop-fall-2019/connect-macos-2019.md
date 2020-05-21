---
title: Connect to Windows Virtual Desktop from macOS - Azure
description: How to connect to Windows Virtual Desktop using the macOS client.
services: virtual-desktop
author: heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 03/30/2020
ms.author: helohr
manager: lizross
---
# Connect with the macOS client

> Applies to: macOS 10.12 or later

>[!IMPORTANT]
>This content applies to the Fall 2019 release that doesn't support Azure Resource Manager Windows Virtual Desktop objects. If you're trying to manage Azure Resource Manager Windows Virtual Desktop objects introduced in the Spring 2020 update, see [this article](../connect-macos.md).

You can access Windows Virtual Desktop resources from your macOS devices with our downloadable client. This guide will tell you how to set up the client.

## Install the client

To get started, [download](https://apps.apple.com/app/microsoft-remote-desktop/id1295203466?mt=12) and install the client on your macOS device.

## Subscribe to a feed

Subscribe to the feed your admin gave you to get the list of managed resources available to you on your macOS device.

To subscribe to a feed:

1. Select **Add Workspace** on the main page to connect to the service and retrieve your resources.
2. Enter the Feed URL. This can be a URL or email address:
   - If you use a URL, use the one your admin gave you. Normally, the URL is <https://rdweb.wvd.microsoft.com>.
   - To use email, enter your email address. This tells the client to search for a URL associated with your email address if your admin configured the server that way.
3. Select **Add**.
4. Sign in with your user account when prompted.

After you've signed in, you should see a list of available resources.

Once you've subscribed to a feed, the feed's content will update automatically on a regular basis. Resources may be added, changed, or removed based on changes made by your administrator.

## Next steps

To learn more about the macOS client, check out the [Get started with the macOS client](/windows-server/remote/remote-desktop-services/clients/remote-desktop-mac/) documentation.