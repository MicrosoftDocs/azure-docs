---
title: Connect to Azure Virtual Desktop with the Remote Desktop client for Android and Chrome OS - Azure Virtual Desktop
description: Learn how to connect to Azure Virtual Desktop using the Remote Desktop client for Android and Chrome OS.
author: dknappettmsft
ms.topic: how-to
ms.date: 10/04/2022
ms.author: daknappe
---

# Connect to Azure Virtual Desktop with the Remote Desktop client for Android and Chrome OS

The Microsoft Remote Desktop client is used to connect to Azure Virtual Desktop to access your desktops and applications. This article shows you how to connect to Azure Virtual Desktop with the Remote Desktop client for Android and Chrome OS.

You can find a list of all the Remote Desktop clients you can use to connect to Azure Virtual Desktop at [Remote Desktop clients overview](remote-desktop-clients-overview.md).

If you want to connect to Remote Desktop Services or a remote PC instead of Azure Virtual Desktop, see [Connect to Remote Desktop Services with the Remote Desktop client for Android and Chrome OS](/windows-server/remote/remote-desktop-services/clients/remote-desktop-android).

## Prerequisites

Before you can access your resources, you'll need to meet the prerequisites:

- Internet access

- One of the following:
  - Smartphone or tablet running Android 9 or later.
  - Chromebook running Chrome OS 53 or later. Learn more about [Android applications running in Chrome OS](https://sites.google.com/a/chromium.org/dev/chromium-os/chrome-os-systems-supporting-android-apps).

- Download and install the Remote Desktop client from [Google Play](https://play.google.com/store/apps/details?id=com.microsoft.rdc.androidx).

> [!IMPORTANT]
> The Android client is not available on platforms built on the Android Open Source Project (AOSP) that do not include Google Mobile Services (GMS), the client is only available through the canonical Google Play Store.

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
   | Azure US Gov | `https://rdweb.wvd.azure.us/api/arm/feeddiscovery` |
   | Azure operated by 21Vianet | `https://rdweb.wvd.azure.cn/api/arm/feeddiscovery` |

1. Tap **Next**.

1. Sign in with your user account. After a few seconds, your workspaces should show the desktops and applications that have been made available to you by your admin.

Once you've subscribed to a workspace, its content will update automatically regularly. Resources may be added, changed, or removed based on changes made by your admin.

## Connect to your desktops and applications

1. Open the **RD Client** app on your device.

1. Tap one of the icons to launch a session to Azure Virtual Desktop. You may be prompted to enter the password for your user account again, and to make sure you trust the remote PC before you connect, depending on how your admin has configured Azure Virtual Desktop.

## Beta client

If you want to help us test new builds before they're released, you should download our beta client. Organizations can use the beta client to validate new versions for their users before they're generally available. For more information, see [Test the beta client](client-features-android-chrome-os.md#test-the-beta-client).

## Next steps

To learn more about the features of the Remote Desktop client for Android and Chrome OS, check out [Use features of the Remote Desktop client for Android and Chrome OS when connecting to Azure Virtual Desktop](client-features-android-chrome-os.md).
