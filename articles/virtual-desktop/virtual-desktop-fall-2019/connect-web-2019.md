---
title: Connect Azure Virtual Desktop (classic) web client - Azure
description: How to connect to Azure Virtual Desktop (classic) using the web client.
author: Heidilohr
ms.topic: how-to
ms.date: 03/21/2022
ms.author: helohr
manager: femila
---
# Connect to Azure Virtual Desktop (classic) with the web client

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../users/connect-web.md).

The web client lets you access your Azure Virtual Desktop resources from a web browser without the lengthy installation process.

>[!NOTE]
>The web client doesn't currently have mobile OS support.

## Supported operating systems and browsers

While any HTML5-capable browser should work, we officially support the following operating systems and browsers.

| Browser           | Supported OS                     | Notes               |
|-------------------|----------------------------------|---------------------|
| Microsoft Edge    | Windows                          |                     |
| Internet Explorer | Windows                          |                     |
| Apple Safari      | macOS                            |                     |
| Mozilla Firefox   | Windows, macOS, Linux            | Version 55 or later |
| Google Chrome     | Windows, macOS, Linux, Chrome OS |                     |

## Access remote resources feed

In a browser, navigate to the Azure Virtual Desktop web client at <https://client.wvd.microsoft.com/webclient/index.html> and sign in with your user account.

>[!IMPORTANT]
>We plan to start automatically redirecting to a new web client URL at <https://client.wvd.microsoft.com/webclient/index.html> as of April 18th, 2022. The current URLs at <https://rdweb.wvd.microsoft.com/webclient/index.html> and <https://www.wvd.microsoft.com/webclient/index.html> will still be available, but we recommend you update your bookmarks to the new URL at <https://client.wvd.microsoft.com/webclient/index.html> as soon as possible.

>[!NOTE]
>If you're using Azure Virtual Desktop with Azure Resource Manager integration, connect to your resources at <https://client.wvd.microsoft.com/arm/webclient/index.html> instead.

>[!NOTE]
>If you've already signed in with a different Microsoft Entra account than the one you want to use for Azure Virtual Desktop, you should either sign out or use a private browser window.

After signing in, you should now see a list of resources. You can launch resources by selecting them like you would a normal app in the **All Resources** tab.

## Next steps

To learn more about how to use the web client, check out [Get started with the Web client](/windows-server/remote/remote-desktop-services/clients/remote-desktop-web-client).
