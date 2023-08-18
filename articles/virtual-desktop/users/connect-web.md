---
title: Connect to Azure Virtual Desktop with the Remote Desktop Web client - Azure
description: Learn how to connect to Azure Virtual Desktop using the Remote Desktop web client.
author: dknappettmsft
ms.topic: how-to
ms.date: 10/04/2022
ms.author: daknappe
---

# Connect to Azure Virtual Desktop with the Remote Desktop Web client

The Microsoft Remote Desktop client is used to connect to Azure Virtual Desktop to access your desktops and applications. This article shows you how to connect to Azure Virtual Desktop with the Remote Desktop Web client. The web client lets you access your Azure Virtual Desktop resources directly from a web browser without needing to install a separate client.

You can find a list of all the Remote Desktop clients you can use to connect to Azure Virtual Desktop at [Remote Desktop clients overview](remote-desktop-clients-overview.md).

## Prerequisites

Before you can access your resources, you'll need to meet the prerequisites:

- Internet access.

- A supported web browser. While any HTML5-capable web browser should work, we officially support the following web browsers and operating systems:

   | Web browser       | Supported operating system       | Notes               |
   |-------------------|----------------------------------|---------------------|
   | Microsoft Edge    | Windows, macOS, Linux, Chrome OS | Version 79 or later |
   | Google Chrome     | Windows, macOS, Linux, Chrome OS | Version 57 or later |
   | Apple Safari      | macOS                            | Version 11 or later |
   | Mozilla Firefox   | Windows, macOS, Linux            | Version 55 or later |

> [!NOTE]
> The Remote Desktop Web client doesn't support mobile web browsers.
>
> As of September 30, 2021, the Remote Desktop Web client no longer supports Internet Explorer. We recommend that you use Microsoft Edge with the Remote Desktop Web client instead. For more information, see our [blog post](https://aka.ms/WVDSupportIE11).

## Access your resources

When you sign in to the Remote Desktop Web client, you'll see your workspaces. A workspace combines all the desktops and applications that have been made available to you by your admin. You sign in by following these steps:

1. Open your web browser.

1. Go to one of the following URLs:

   | Azure environment | Workspace URL |
   |--|--|
   | Azure cloud *(most common)* | [https://client.wvd.microsoft.com/arm/webclient/](https://client.wvd.microsoft.com/arm/webclient/) |
   | Azure cloud (classic) | [https://client.wvd.microsoft.com/webclient/index.html](https://client.wvd.microsoft.com/webclient/index.html) |
   | Azure US Gov | [https://rdweb.wvd.azure.us/arm/webclient/](https://rdweb.wvd.azure.us/arm/webclient/) |
   | Azure operated by 21Vianet | [https://rdweb.wvd.azure.cn/arm/webclient/](https://rdweb.wvd.azure.cn/arm/webclient/) |

1. Sign in with your user account. Once you've signed in successfully, your workspaces should show the desktops and applications that have been made available to you by your admin.

1. Select one of the icons to launch a session to Azure Virtual Desktop. You may be prompted to enter the password for your user account again, depending on how your admin has configured Azure Virtual Desktop.

1. A prompt for **Access local resources** may be displayed asking you confirm which local resources you want to be available in the remote session. Make your selection, then select **Allow**.

>[!TIP]
>If you've already signed in to the web browser with a different Azure Active Directory account than the one you want to use for Azure Virtual Desktop, you should either sign out or use a private browser window.

## Preview features

If you want to help us test new features, you should enable the preview. A new user interface is available in preview; to learn how to try the new user interface, see [Preview user interface](client-features-web.md#preview-user-interface-preview), and for more information about what's new, see [What's new in the Remote Desktop Web client for Azure Virtual Desktop](../whats-new-client-web.md?toc=%2Fazure%2Fvirtual-desktop%2Fusers%2Ftoc.json).

## Next steps

To learn more about the features of the Remote Desktop Web client, check out [Use features of the Remote Desktop Web client when connecting to Azure Virtual Desktop](client-features-web.md).
