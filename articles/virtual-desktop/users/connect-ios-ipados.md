---
title: Connect to Azure Virtual Desktop with the Remote Desktop client for iOS and iPadOS - Azure Virtual Desktop
description: Learn how to connect to Azure Virtual Desktop using the Remote Desktop client for iOS and iPadOS.
author: dknappettmsft
ms.topic: how-to
ms.date: 03/19/2024
ms.author: daknappe
---

# Connect to Azure Virtual Desktop with the Remote Desktop client for iOS and iPadOS

The Microsoft Remote Desktop client is used to connect to Azure Virtual Desktop to access your desktops and applications. This article shows you how to connect to Azure Virtual Desktop with the Remote Desktop client for iOS and iPadOS.

You can find a list of all the Remote Desktop clients you can use to connect to Azure Virtual Desktop at [Remote Desktop clients overview](remote-desktop-clients-overview.md).

If you want to connect to Remote Desktop Services or a remote PC instead of Azure Virtual Desktop, see [Connect to Remote Desktop Services with the Remote Desktop client for iOS and iPadOS](/windows-server/remote/remote-desktop-services/clients/remote-desktop-ios).

## Prerequisites

Before you can access your resources, you'll need to meet the following prerequisites:

- Internet access.

- An iPhone running iOS 16 or later or an iPad running iPadOS 16 or later.

- Download and install the Remote Desktop client from the [App Store](https://apps.apple.com/app/microsoft-remote-desktop/id714464092).

## Subscribe to a workspace

A workspace combines all the desktops and applications that have been made available to you by your admin. To be able to see these in the Remote Desktop client, you need to subscribe to the workspace by following these steps:

1. Open the **RD Client** app on your device.

1. In the Connection Center, tap **+**, then tap **Add Workspace**.

1. In the **Email or Workspace URL** box, either enter your user account, for example `user@contoso.com`, or the relevant URL from the following table. After a few seconds, the message **A workspace is associated with this URL** should be displayed.

   > [!TIP]
   > If you see the message **No workspace is associated with this email address**, your admin might not have set up email discovery. Use one of the following workspace URLs instead.

   | Azure environment | Workspace URL |
   |--|--|
   | Azure cloud *(most common)* | `https://rdweb.wvd.microsoft.com` |
   | Azure for US Government | `https://rdweb.wvd.azure.us/api/arm/feeddiscovery` |
   | Azure operated by 21Vianet | `https://rdweb.wvd.azure.cn/api/arm/feeddiscovery` |

1. Tap **Next**.

1. Sign in with your user account. After a few seconds, your workspaces should show the desktops and applications that have been made available to you by your admin.

Once you've subscribed to a workspace, its content will update automatically regularly. Resources may be added, changed, or removed based on changes made by your admin.

## Connect to your desktops and applications

1. Open the **RD Client** app on your device.

1. Tap one of the icons to launch a session to Azure Virtual Desktop. You may be prompted to enter the password for your user account again, depending on how your admin has configured Azure Virtual Desktop.

## Beta client

If you want to help us test new builds before they're released, you should download our beta client. Organizations can use the beta client to validate new versions for their users before they're generally available. For more information, see [Test the beta client](client-features-ios-ipados.md#test-the-beta-client).

## Next steps

To learn more about the features of the Remote Desktop client for iOS and iPadOS, check out [Use features of the Remote Desktop client for iOS and iPadOS when connecting to Azure Virtual Desktop](client-features-ios-ipados.md).
