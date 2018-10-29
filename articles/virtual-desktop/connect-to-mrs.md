---
title: Connect to Microsoft Remote Services
description: Describes how to set up and validate Remote Desktop modern infrastructure end-users in old Windows clients.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 10/25/2018
ms.author: helohr
---
# Connect to Microsoft Remote Services

You can connect to a Windows Virtual Desktop deployment using old Windows clients.

## Windows client

The Remote Desktop Windows client supports Windows 7 or later.

### Install the Windows client

Before getting started, confirm that your user account is set up and can access published apps or desktops.

Follow these steps to deploy the client to your local PC.

1. Copy the latest client binaries to the local PC:
   * Download **RDClient.zip** from the Connect site.
   * Create a local folder for the client. For example, create a folder named "RDClient" on the desktop.
   * Extract the content of the .zip file to the local folder.
2. If you have an earlier version of Windows, follow these additional steps:
   * For Windows 7 and 8, install the [VC++ Redistributable Package](https://www.microsoft.com/download/details.aspx?id=53840) if you haven't already.
   * For Windows 7, install the [Microsoft .Net Framework 4.5](https://www.microsoft.com/download/details.aspx?id=30653) if you haven't already.

### Subscribe to a feed

From the local PC, get the list of resources available to you by subscribing to the feed provided by your admin. Once you have the list, follow these steps:

1. Start the Remote Desktop client by running **RDClient.exe** from the folder you created above.
2. Select **Add subscription**.
3. Enter the URL provided by your admin.

    >[!NOTE]
    >If your admin has set up email discovery, just enter your email address and the client will automatically look up your feed URL.
4. Sign in with your user account.
5. Confirm that the feed items show up properly on the main page.

>[!TIP]
>Ask your admin which resources you should be seeing.

## Testing your deployment

After setting everything up, it's a good idea to make sure that everything works.

Before you start testing your deployment, make sure you have the following things handy:

* A feed URL from your admin to connect to the published resources. For example:
  1. <https://rdweb-contoso.azurewebsites.net>.
  1. <https://rdweb-contoso.azurewebsites.net/api/feeddiscovery/webfeeddiscovery.aspx>.
* A USB drive with text files and folders.
* A network printer configured on the local PC.
* A USB printer connected to the local PC (optional).

Use the remote desktop as you would for a typical session and make sure that you can print with both wireless and USB, that your apps work, that you can stream and play videos on the web, and that your mouse and keyboard are working.