---
title: Connect to Azure Virtual Desktop with the Remote Desktop app for Windows - Azure Virtual Desktop
description: Learn how to connect to Azure Virtual Desktop using the Remote Desktop app for Windows.
author: dknappettmsft
ms.topic: how-to
ms.date: 06/12/2023
ms.author: daknappe
---

# Connect to Azure Virtual Desktop with the Remote Desktop app for Windows

The Microsoft Remote Desktop app is used to connect to Azure Virtual Desktop to access your desktops and applications. This article shows you how to connect to Azure Virtual Desktop with the Remote Desktop app for Windows.

> [!IMPORTANT]
> We're no longer updating the Remote Desktop app for Windows with new features and support for Azure Virtual Desktop will be removed in the future.
> 
> For the best Azure Virtual Desktop experience that includes the latest features and updates, we recommend you download the [Windows Desktop client](connect-windows.md) instead.

You can find a list of all the Remote Desktop clients at [Remote Desktop clients overview](remote-desktop-clients-overview.md).

If you want to connect to Remote Desktop Services or a remote PC instead of Azure Virtual Desktop, see [Connect to Remote Desktop Services with the Remote Desktop app for Windows](/windows-server/remote/remote-desktop-services/clients/windows).

## Prerequisites

Before you can access your resources, you'll need to meet the prerequisites:

- Internet access.

- A device running Windows 11 or Windows 10.

- Download and install the Remote Desktop app from the [Microsoft Store](https://go.microsoft.com/fwlink/?LinkID=616709).

## Subscribe to a workspace

A workspace combines all the desktops and applications that have been made available to you by your admin. To be able to see these in the Remote Desktop app, you need to subscribe to the workspace by following these steps:

1. Open the **Remote Desktop** app on your device.

1. In the Connection Center, select **+ Add**, then select **Workspaces**.

1. In the **Email or Workspace URL** box, either enter your user account, for example `user@contoso.com`, or the relevant URL from the following table. After a few seconds, the message **We found Workspaces at the following URLs** should be displayed.

   > [!TIP]
   > If you see the message **We couldn't find any Workspaces associated with this email address. Try providing a URL instead**, your admin might not have set up email discovery. Use one of the following workspace URLs instead.

   | Azure environment | Workspace URL |
   |--|--|
   | Azure cloud *(most common)* | `https://rdweb.wvd.microsoft.com` |
   | Azure US Gov | `https://rdweb.wvd.azure.us/api/arm/feeddiscovery` |
   | Azure operated by 21Vianet | `https://rdweb.wvd.azure.cn/api/arm/feeddiscovery` |

1. Select **Subscribe**.

1. Sign in with your user account. After a few seconds, your workspaces should show the desktops and applications that have been made available to you by your admin.

Once you've subscribed to a workspace, its content will update automatically regularly. Resources may be added, changed, or removed based on changes made by your admin.

## Connect to your desktops and applications

1. Open the **Remote Desktop** app on your device.

1. Select one of the icons to launch a session to Azure Virtual Desktop. You may be prompted to enter the password for your user account again, depending on how your admin has configured Azure Virtual Desktop.

## Next steps

To learn more about the features of the Remote Desktop app for Windows, check out [Use features of the Remote Desktop app for Windows when connecting to Azure Virtual Desktop](client-features-microsoft-store.md).
