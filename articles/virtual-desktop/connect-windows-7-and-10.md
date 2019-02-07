---
title: Connect with Windows 7 and Windows 10 - Azure
description: How to connect to the Windows Virtual Desktop HTML5 web client.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 02/20/2019
ms.author: helohr
---
# Connect with Windows 7 and Windows 10 (Preview)

> Applies to: Windows 7 and Windows 10.

A downloadable client is available that provides access to Windows Virtual Desktop resources from devices running Windows 7 and Windows 10.

## Install the client

Follow the steps below to deploy the client to your local PC.

- [Download the client]() 
- Run the MSI to install the client. This requires admin rights.

## Subscribe to a feed

Get the list of resources available to you from your local PC by subscribing to the feed provided by your admin.

1. Start the client from the All Apps List, look for Remote Desktop.
2. Select Use a work or school account on the main page. This will subscribe with the default feed URL.
  - You may also provide a different URL if needed with the **Use a URL instead** option.
3. Sign in with your user account.

> [!NOTE]
> If your admin has set up email discovery, the client will automatically look up your feed URL when you enter your email address.

After successfully authenticating, you should now see a list of resources available to you.

## Launch Windows Virtual Desktop resources

Once you are subscribed to a feed, you can launch resources by one of two methods.

- Double-click a resource from the main page of the client.
- Launch a resource as you normally would other apps from the Start Menu.
  -  You can also search for the apps in the search bar.

## Update the client

Unless stated otherwise, you can update the client simply by running the new MSI on the system. This will automatically update the client.
