---
title: Connect to Azure Virtual Desktop with the legacy Remote Desktop clients for Windows - Azure Virtual Desktop
description: Learn how to connect Connect to Azure Virtual Desktop with the legacy Remote Desktop clients for Windows.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.custom: "se-defect-target"
ms.date: 09/24/2024
---

# Connect to Azure Virtual Desktop with the legacy Remote Desktop clients for Windows

> [!IMPORTANT]
> The Azure Virtual Desktop store app is no longer available for download or installation. To ensure a seamless experience and avoid any disruption, users are encouraged to download Windows App. Windows App is the gateway to securely connect to any devices or apps across Azure Virtual Desktop, Windows 365, and Microsoft Dev Box. For more information, see [What is Windows App](/windows-app/overview).

The Microsoft Remote Desktop client is used to connect to Azure Virtual Desktop to access your desktops and applications. Connecting to Azure Virtual Desktop with the Remote Desktop client for Windows allows you to subscribe to a feed made available to you by your organization administrators.

There are three versions of the Remote Desktop client for Windows, which are all supported for connecting to Azure Virtual Desktop:

- Standalone download as an MSI installer. This is the most common version of the Remote Desktop client for Windows.
- Azure Virtual Desktop app from the Microsoft Store. This is a preview version of the Remote Desktop client for Windows, but it's no longer available to download. You can still use it to connect to Azure Virtual Desktop if it's already installed.
- Remote Desktop app from the Microsoft Store. This version is no longer being developed. 

This article shows you how to connect to Azure Virtual Desktop with the Azure Virtual Desktop app and the Remote Desktop app. We recommend connecting to Azure Virtual Desktop with the Remote Desktop client using the MSI installer. To connect using the MSI installer, see [Connect to Azure Virtual Desktop with the Remote Desktop client](connect-remote-desktop-client.md?tab=windows). 


> [!TIP]
> You can also connect to Azure Virtual Desktop with Windows App, a single app to securely connect you to Windows devices and apps from Azure Virtual Desktop, Windows 365, Microsoft Dev Box, Remote Desktop Services, and remote PCs. For more information, see [What is Windows App?](/windows-app/overview)

You can find a list of all the Remote Desktop clients you can use to connect to Azure Virtual Desktop at [Remote Desktop clients overview](remote-desktop-clients-overview.md).

If you want to connect to Remote Desktop Services or a remote PC instead of Azure Virtual Desktop, see [Connect to Remote Desktop Services with the Remote Desktop app for Windows](/windows-server/remote/remote-desktop-services/clients/windows).

## Prerequisites

Select a tab for the version of the Remote Desktop client for Windows you want to use:

# [Azure Virtual Desktop Store app](#tab/avd-store)

To access your resources, you need: 

- Internet access.

- A device running one of the following supported versions of Windows:
  - Windows 11
  - Windows 10

# [Remote Desktop Store app](#tab/rd-store)

To access your resources, you need: 

- Internet access.

- A device running one of the following supported versions of Windows:
  - Windows 11
  - Windows 10

---


## Download and install

Select a tab for the version of the Remote Desktop client for Windows you want to use:

# [Azure Virtual Desktop Store app](#tab/avd-store)

The Azure Virtual Desktop app from the Microsoft Store is a preview version of the Remote Desktop client for Windows, but it's no longer available to download. You can still use it to connect to Azure Virtual Desktop if it's already installed.

> [!IMPORTANT]
> If you have the Remote Desktop client (MSI) and the Azure Virtual Desktop app from the Microsoft Store installed on the same device, you may see the message that begins **A version of this application called Azure Virtual Desktop was installed from the Microsoft Store**. Both apps are supported, and you have the option to choose **Continue anyway**, however we recommend using [Windows App](/windows-app/overview) for the most up-to-date experience.


# [Remote Desktop Store app](#tab/rd-store)

> [!IMPORTANT]
> We're no longer updating the Remote Desktop app for Windows with new features and support for Azure Virtual Desktop will be removed in the future.
> 
> To ensure a seamless experience and avoid any disruption, users are encouraged to download Windows App. Windows App is the gateway to securely connect to any devices or apps across Azure Virtual Desktop, Windows 365, and Microsoft Dev Box. For more information, see [What is Windows App](/windows-app/overview).

The Remote Desktop app is available from the Microsoft Store. To download and install it, follow these steps:

1. Go to the [Remote Desktop app in the Microsoft Store](https://go.microsoft.com/fwlink/?LinkID=616709).

1. Select **Install** to start downloading the app and installing it.

1. Once the app has finished downloading and installing, select **Open**.

---

## Subscribe to a workspace

Select a tab for the version of the Remote Desktop client for Windows you want to use:

# [Azure Virtual Desktop Store app](#tab/avd-store)

A workspace combines all the desktops and applications that have been made available to you by your admin. To be able to see these in the Azure Virtual Desktop app, you need to subscribe to the workspace by following these steps:

1. Open the **Azure Virtual Desktop** app on your device.

1. The first time you subscribe to a workspace, from the **Let's get started** screen, select **Subscribe** or **Subscribe with URL**. Use the tabs below for your scenario.

   - If you selected **Subscribe**, sign in with your user account when prompted, for example `user@contoso.com`. After a few seconds, your workspaces should show the desktops and applications that have been made available to you by your admin.
   
     If you see the message **No workspace is associated with this email address**, your admin might not have set up email discovery, or you're using an Azure environment that isn't Azure cloud, such as Azure for US Government. Try the steps to **Subscribe with URL** instead.

   - If you selected **Subscribe with URL**, in the **Email or Workspace URL** box, enter the relevant URL from the following table. After a few seconds, the message **We found Workspaces at the following URLs** should be displayed.

      | Azure environment | Workspace URL |
      |--|--|
      | Azure cloud *(most common)* | `https://rdweb.wvd.microsoft.com` |
      | Azure for US Government | `https://rdweb.wvd.azure.us/api/arm/feeddiscovery` |
      | Azure operated by 21Vianet | `https://rdweb.wvd.azure.cn/api/arm/feeddiscovery` |

1. Select **Next**.

1. Sign in with your user account when prompted. After a few seconds, the workspace should show the desktops and applications that have been made available to you by your admin.

Once you've subscribed to a workspace, its content will update automatically regularly and each time you start the client. Resources may be added, changed, or removed based on changes made by your admin.

# [Remote Desktop Store app](#tab/rd-store)

A workspace combines all the desktops and applications that have been made available to you by your admin. To be able to see these in the Remote Desktop app, you need to subscribe to the workspace by following these steps:

1. Open the **Remote Desktop** app on your device.

1. In the Connection Center, select **+ Add**, then select **Workspaces**.

1. In the **Email or Workspace URL** box, either enter your user account, for example `user@contoso.com`, or the relevant URL from the following table. After a few seconds, the message **We found Workspaces at the following URLs** should be displayed.

   If you see the message **We couldn't find any Workspaces associated with this email address. Try providing a URL instead**, your admin might not have set up email discovery. Use one of the following workspace URLs instead.

   | Azure environment | Workspace URL |
   |--|--|
   | Azure cloud *(most common)* | `https://rdweb.wvd.microsoft.com` |
   | Azure for US Government | `https://rdweb.wvd.azure.us/api/arm/feeddiscovery` |
   | Azure operated by 21Vianet | `https://rdweb.wvd.azure.cn/api/arm/feeddiscovery` |

1. Select **Subscribe**.

1. Sign in with your user account. After a few seconds, your workspaces should show the desktops and applications that have been made available to you by your admin.

Once you've subscribed to a workspace, its content will update automatically regularly. Resources may be added, changed, or removed based on changes made by your admin.

---

## Connect to your desktops and applications

Select a tab for the version of the Remote Desktop client for Windows you want to use:

# [Azure Virtual Desktop Store app](#tab/avd-store)

Once you've subscribed to a workspace, here's how to connect:

1. Open the **Azure Virtual Desktop** app on your device.

1. Double-click one of the icons to launch a session to Azure Virtual Desktop. You may be prompted to enter the password for your user account again, depending on how your admin has configured Azure Virtual Desktop.

1. To pin your desktops and applications to the Start Menu, right-click one of the icons and select **Pin to Start Menu**, then confirm the prompt.

### Insider releases

If you want to help us test new builds before they're released, you should download our Insider releases. Organizations can use the Insider releases to validate new versions for their users before they're generally available. For more information, see [Enable Insider releases](client-features-windows.md#enable-insider-releases).


# [Remote Desktop Store app](#tab/rd-store)

Once you've subscribed to a workspace, here's how to connect:

1. Open the **Remote Desktop** app on your device.

1. Select one of the icons to launch a session to Azure Virtual Desktop. You may be prompted to enter the password for your user account again, depending on how your admin has configured Azure Virtual Desktop.

---

## Next steps

- To learn more about the features of the Remote Desktop client for Windows, check out [Use features of the Remote Desktop client for Windows when connecting to Azure Virtual Desktop](client-features-windows.md).

- If you want to use Teams on Azure Virtual Desktop with media optimization, see [Use Microsoft Teams on Azure Virtual Desktop](../teams-on-avd.md).
