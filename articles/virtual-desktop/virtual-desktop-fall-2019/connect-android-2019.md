---
title: Connect to Azure Virtual Desktop (classic) from Android - Azure
description: How to connect to Azure Virtual Desktop (classic) using the Android client.
author: Heidilohr
ms.topic: how-to
ms.date: 03/30/2020
ms.author: helohr
manager: femila
---
# Connect to Azure Virtual Desktop (classic) with the Android client

> Applies to: Android 4.1 and later, Chromebooks with ChromeOS 53 and later.

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../users/connect-android-chrome-os.md).

You can access Azure Virtual Desktop resources from your Android device with our downloadable client. You can also use the Android client on Chromebook devices that support the Google Play Store. This guide will tell you how to set up the Android client.

## Install the Android client

To get started, [download](https://play.google.com/store/apps/details?id=com.microsoft.rdc.androidx) and install the client on your Android device.

## Subscribe to a feed

Subscribe to the feed provided by your admin to get the list of managed resources you can access on your Android device.

To subscribe to a feed:

1. In the Connection Center, tap **+**, and then tap **Remote Resource Feed**.
2. Enter the feed URL into the **Feed URL** field. The feed URL can be either a URL or an email address.
   - If you use a URL, use the one your admin gave you, normally `https://rdweb.wvd.microsoft.com/api/feeddiscovery/webfeeddiscovery.aspx`.
   - To use email, enter your email address. The client will search for a URL associated with your email address if your admin configured the server that way.
3. Tap **NEXT**.
4. Provide your credentials when prompted.
   - For **User name**, give the user name with permission to access resources.
   - For **Password**, give the password associated with the user name.
   - You may also be prompted to provide additional factors if your admin configured authentication that way.

After subscribing, the Connection Center should display the remote resources.

Once subscribed to a feed, the feed's content will update automatically on a regular basis. Resources may be added, changed, or removed based on changes made by your administrator.

## Next steps

To learn more about how to use the Android client, check out [Get started with the Android client](/windows-server/remote/remote-desktop-services/clients/remote-desktop-android/).