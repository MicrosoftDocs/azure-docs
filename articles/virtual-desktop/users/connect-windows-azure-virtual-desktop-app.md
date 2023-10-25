---
title: Connect to Azure Virtual Desktop with the Azure Virtual Desktop Store app for Windows (preview) - Azure Virtual Desktop
description: Learn how to connect to Azure Virtual Desktop using the Azure Virtual Desktop Store app for Windows from the Microsoft Store.
author: dknappettmsft
ms.topic: how-to
ms.date: 03/09/2023
ms.author: daknappe
---

# Connect to Azure Virtual Desktop with the Azure Virtual Desktop Store app for Windows (preview)

> [!IMPORTANT]
> The Azure Virtual Desktop Store app for Windows is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The Azure Virtual Desktop Store app is used to connect to Azure Virtual Desktop to access your desktops and applications. This article shows you how to connect to Azure Virtual Desktop with the Azure Virtual Desktop Store app (preview) for Windows from the Microsoft Store.

You can find a list of all the Remote Desktop clients you can use to connect to Azure Virtual Desktop at [Remote Desktop clients overview](remote-desktop-clients-overview.md).

## Prerequisites

Before you can access your resources, you'll need to meet the prerequisites:

- Internet access.

- A device running one of the following supported versions of Windows:
  - Windows 11
  - Windows 10
   
## Download and install the Azure Virtual Desktop app

The Azure Virtual Desktop Store app is available from the Microsoft Store. To download and install it, follow these steps:

1. Go to the [Azure Virtual Desktop Store app in the Microsoft Store](https://aka.ms/AVDStoreClient).

1. Select **Install** to start downloading the app and installing it.

1. Once the app has finished downloading and installing, select **Open**. The first time the app runs, it will install the *Azure Virtual Desktop (HostApp)* dependency automatically.

> [!IMPORTANT]
> If you have the Azure Virtual Desktop app and the [Remote Desktop client for Windows](connect-windows.md) installed on the same device, you may see the message that begins **A version of this application called Azure Virtual Desktop was installed from the Microsoft Store**. Both apps are supported, and you have the option to choose **Continue anyway**, however it could be confusing to use the same remote resource across both apps. We recommend using only one version of the app at a time.

## Subscribe to a workspace

A workspace combines all the desktops and applications that have been made available to you by your admin. To be able to see these in the Azure Virtual Desktop app, you need to subscribe to the workspace by following these steps:

1. Open the **Azure Virtual Desktop** app on your device, if you have not already done so.

2. The first time you subscribe to a workspace, from the **Let's get started** screen, select **Subscribe** or **Subscribe with URL**. Use the tabs below for your scenario.

# [Subscribe](#tab/subscribe)

3. If you selected **Subscribe**, sign in with your user account when prompted, for example `user@contoso.com`. After a few seconds, your workspaces should show the desktops and applications that have been made available to you by your admin.
   
   > [!TIP]
   > If you see the message **No workspace is associated with this email address**, your admin might not have set up email discovery, or you are using an Azure environment that is not Azure cloud, such as Azure US Gov. Try the steps in the **Subscribe with URL** tab instead.

# [Subscribe with URL](#tab/subscribe-with-url)
   
3. If you selected **Subscribe with URL**, in the **Email or Workspace URL** box, enter the relevant URL from the following table. After a few seconds, the message **We found Workspaces at the following URLs** should be displayed.

   | Azure environment | Workspace URL |
   |--|--|
   | Azure cloud *(most common)* | `https://rdweb.wvd.microsoft.com` |
   | Azure US Gov | `https://rdweb.wvd.azure.us/api/arm/feeddiscovery` |
   | Azure operated by 21Vianet | `https://rdweb.wvd.azure.cn/api/arm/feeddiscovery` |

4. Select **Next**.

5. Sign in with your user account when prompted. After a few seconds, the workspace should show the desktops and applications that have been made available to you by your admin.

Once you've subscribed to a workspace, its content will update automatically regularly and each time you start the client. Resources may be added, changed, or removed based on changes made by your admin.

---

## Connect to your desktops and applications and pin to the Start Menu

Once you've subscribed to a workspace, here's how to connect:

1. Open the **Azure Virtual Desktop** app on your device.

1. Double-click one of the icons to launch a session to Azure Virtual Desktop. You may be prompted to enter the password for your user account again, depending on how your admin has configured Azure Virtual Desktop.

1. To pin your desktops and applications to the Start Menu, right-click one of the icons and select **Pin to Start Menu**, then confirm the prompt.

## Insider releases

If you want to help us test new builds before they're released, you should download our Insider releases. Organizations can use the Insider releases to validate new versions for their users before they're generally available. For more information, see [Enable Insider releases](client-features-windows.md#enable-insider-releases).

## Next steps

- To learn more about the features of the **Azure Virtual Desktop** app, check out [Use features of the Azure Virtual Desktop Store app when connecting to Azure Virtual Desktop](client-features-windows.md).

- If you want to use Teams on Azure Virtual Desktop with media optimization, see [Use Microsoft Teams on Azure Virtual Desktop](../teams-on-avd.md).