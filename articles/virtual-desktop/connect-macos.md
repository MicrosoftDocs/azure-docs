---
title: Connect to Windows Virtual Desktop from macOS - Azure
description: How to connect to Windows Virtual Desktop using the macOS client.
services: virtual-desktop
author: heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 04/08/2020
ms.author: helohr
manager: lizross
---
# Connect with the macOS client

> Applies to: macOS 10.12 or later

>[!IMPORTANT]
>This content applies to the Spring 2020 update with Azure Resource Manager Windows Virtual Desktop objects. If you're using the Windows Virtual Desktop Fall 2019 release without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/connect-macos-2019.md).
>
> The Windows Virtual Desktop Spring 2020 update is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can access Windows Virtual Desktop resources from your macOS devices with our downloadable client. This guide will tell you how to set up the client.

## Install the client

To get started, [download](https://apps.apple.com/app/microsoft-remote-desktop/id1295203466?mt=12) and install the client on your macOS device.

## Subscribe to a feed

Subscribe to the feed your admin gave you to get the list of managed resources available to you on your macOS device.

To subscribe to a feed:

1. Select **Add Workspace** on the main page to connect to the service and retrieve your resources.
2. Enter the Feed URL. This can be a URL or email address:
   - If you use a URL, use the one your admin gave you. Normally, the URL is <https://rdweb.wvd.microsoft.com/api/arm/feeddiscovery>.
   - To use email, enter your email address. This tells the client to search for a URL associated with your email address if your admin configured the server that way.
3. Select **Add**.
4. Sign in with your user account when prompted.

After you've signed in, you should see a list of available resources.

Once you've subscribed to a feed, the feed's content will update automatically on a regular basis. Resources may be added, changed, or removed based on changes made by your administrator.

## Next steps

To learn more about the macOS client, check out the [Get started with the macOS client](/windows-server/remote/remote-desktop-services/clients/remote-desktop-mac/) documentation.
