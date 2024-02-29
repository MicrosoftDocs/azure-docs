---
title: Connect to Azure Virtual Desktop (classic) from iOS - Azure
description: How to connect to Azure Virtual Desktop (classic) using the iOS client.
author: Heidilohr
ms.topic: how-to
ms.date: 03/30/2020
ms.author: helohr
manager: femila
---
# Connect to Azure Virtual Desktop (classic) with the iOS client

> Applies to: iOS 13.0 or later. Compatible with iPhone, iPad, and iPod touch.

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../users/connect-ios-ipados.md).

You can access Azure Virtual Desktop resources from your iOS device with our downloadable client. This guide will tell you how to set up the iOS client.

## Install the iOS client

To get started, [download](https://aka.ms/rdios) and install the client on your iOS device.

## Subscribe to a feed

Subscribe to the feed provided by your admin to get the list of managed resources you can access on your iOS device.

To subscribe to a feed:

1. In the Connection Center, tap **+**, and then tap **Add Workspace**.
2. Enter the feed URL into the **Feed URL** field. The feed URL can be either a URL or an email address.
   - If you use a URL, use the one your admin gave you. Normally, the URL is `https://rdweb.wvd.microsoft.com/api/feeddiscovery/webfeeddiscovery.aspx`.
   - To use email, enter your email address. This tells the client to search for a URL associated with your email address if your admin configured the server that way.
3. Tap **Next**.
4. Provide your credentials when prompted.
   - For **User name**, give the user name with permission to access resources.
   - For **Password**, give the password associated with the user name.
   - You may also be prompted to provide additional factors if your admin configured authentication that way.
5. Tap **Save**.

After this, the Connection Center should display the remote resources.

Once subscribed to a feed, the feed's content will update automatically on a regular basis. Resources may be added, changed, or removed based on changes made by your administrator.

## Next steps

To learn more about how to use the iOS client, check out the [Get started with the iOS client](/windows-server/remote/remote-desktop-services/clients/remote-desktop-ios/) documentation.
