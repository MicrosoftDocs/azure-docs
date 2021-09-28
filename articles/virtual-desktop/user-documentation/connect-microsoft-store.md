---
title: Connect to Microsoft Store client - Azure
description: How to connect to Azure Virtual Desktop using the Microsoft Store client.
author: Heidilohr
ms.topic: how-to
ms.date: 10/05/2020
ms.author: helohr
manager: femila
---
# Connect with the Microsoft Store client

>Applies to: Windows 10.

You can access Azure Virtual Desktop resources on devices with Windows 10.

## Install the Microsoft Store client

You can install the client for the current user, which doesn't require admin rights. Alternatively, your admin can install and configure the client so that all users on the device can access it.

Once installed, the client can be launched from the Start menu by searching for Remote Desktop.

To get started, [download and install the client from the Microsoft Store](https://www.microsoft.com/store/productId/9WZDNCRFJ3PS).

## Subscribe to a workspace

Subscribe to the workspace provided by your admin to get the list of managed resources you can access on your PC.

To subscribe to a workspace:

1. In the Connection Center screen, tap **+Add**, then tap **Workspaces**.
2. Enter the Workspace URL into the Workspace URL field provided by your admin. The workspace URL can be either a URL or an email address.
   
   - If you're using a Workspace URL, use the URL your admin gave you.
   - If you're connecting from Azure Virtual Desktop, use one of the following URLs depending on which version of the service you're using:
       - Azure Virtual Desktop (classic): `https://rdweb.wvd.microsoft.com/api/feeddiscovery/webfeeddiscovery.aspx`.
       - Azure Virtual Desktop: `https://rdweb.wvd.microsoft.com/api/arm/feeddiscovery`.
  
3. Tap **Subscribe**.
4. Provide your credentials when prompted.
5. After subscribing, the workspaces should be displayed in the Connection Center.

Workspaces may be added, changed, or removed based on changes made by your administrator.

## Next steps

To learn more about how to use the Microsoft Store client, check out [Get started with the Microsoft Store client](/windows-server/remote/remote-desktop-services/clients/windows/).