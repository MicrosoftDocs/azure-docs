---
title: Connect to Windows Virtual Desktop from iOS  - Azure
description: How to connect to the Windows Virtual Desktop from iOS.
services: virtual-desktop
author: btaintor

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 09/03/2019
ms.author: helohr
---
# Connect from iOS

> Applies to: iOS 8.0 or later. Compatible with iPhone, iPad, and iPod touch.

A downloadable client is available that provides access to Windows Virtual Desktop resources from iOS devices.

## Install the iOS Beta client

1. Install the [Apple TestFlight](https://apps.apple.com/us/app/testflight/id899247664) app on your iOS device.
2. On your iOS device, open a browser and navigate to [aka.ms/rdiosbeta](https://aka.ms/rdiosbeta).
3. Under the label **Step 2 Join the Beta**, select **Start Testing**.
4. When you're redirected to the TestFlight app, select **Accept** and then **Install** the client.

## Subscribe to a feed

Get the list of managed resources available to you by subscribing to the feed provided by your admin. Subscribing makes the resources available on your iOS device.

To subscribe to a feed:

1. In the Connection Center tap **+**, and then tap **Add Workspace**.
2. Enter the **Feed URL**. This can be a URL or email address:
   - The **URL** is the RD Web Access server's URL, provided to you by your admin. If accessing resources from Windows Virtual Desktop, you can use `https://rdweb.wvd.microsoft.com`.
   - If you plan to use **Email**, enter your email address in this field. This tells the client to search for an RD Web Access server associated with your email address if it was configured by your admin.
3. Tap **Next**.
4. Provide your sign-in information when prompted. This can vary based on the deployment and can include:
   - **User name**, the user name that has permission to access the resources.
   - **Password**, the password associated with the user name.
   - **Additional factor**, which you may be prompted for if authentication was configured that way by your admin.
5. Tap **Save**.

The remote resources will be displayed in the Connection Center.

Once subscribed to a feed, the content of the feed is updated automatically on a regular basis. Resources may be added, changed, or removed based on changes made by your administrator.

## Additional client documentation

For more documentation detailing how to use the iOS Beta client, check out the [Remote Desktop Services documentation](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/remote-desktop-ios).
