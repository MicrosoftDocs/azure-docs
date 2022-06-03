---
title: Connect to Azure Virtual Desktop with the web client - Azure
description: How to connect to Azure Virtual Desktop using the web client.
author: Heidilohr
ms.topic: how-to
ms.date: 03/21/2022
ms.author: helohr
manager: femila
---
# Connect to Azure Virtual Desktop with the web client

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](../virtual-desktop-fall-2019/connect-web-2019.md).

The web client lets you access your Azure Virtual Desktop resources from a web browser without the lengthy installation process.

>[!NOTE]
>The web client doesn't currently have mobile OS support.

## Supported operating systems and browsers

>[!IMPORTANT]
>As of September 30, 2021, the Azure Virtual Desktop web client no longer supports Internet Explorer. We recommend that you use Microsoft Edge to connect to the web client instead. For more information, see our [blog post](https://aka.ms/WVDSupportIE11).

While any HTML5-capable browser should work, we officially support the following operating systems and browsers:

| Browser           | Supported OS                     | Notes               |
|-------------------|----------------------------------|---------------------|
| Microsoft Edge    | Windows, macOS, Linux, Chrome OS | Version 79 or later |
| Apple Safari      | macOS                            | Version 11 or later |
| Mozilla Firefox   | Windows, macOS, Linux            | Version 55 or later |
| Google Chrome     | Windows, macOS, Linux, Chrome OS | Version 57 or later |

## Access remote resources feed

In a browser, navigate to the Azure Resource Manager-integrated version of the Azure Virtual Desktop web client at <https://client.wvd.microsoft.com/arm/webclient/index.html> and sign in with your user account.

>[!IMPORTANT]
>We plan to start automatically redirecting to a new web client URL at <https://client.wvd.microsoft.com/arm/webclient/index.html> as of April 18th, 2022. The current URLs at <https://rdweb.wvd.microsoft.com/arm/webclient/index.html> and <https://www.wvd.microsoft.com/arm/webclient/index.html> will still be available, but we recommend you update your bookmarks to the new URL at <https://client.wvd.microsoft.com/arm/webclient/index.html> as soon as possible.

>[!NOTE]
>If you're using Azure Virtual Desktop (classic) without Azure Resource Manager integration, connect to your resources at <https://client.wvd.microsoft.com/webclient/index.html> instead.
>
> If you're using the US Gov portal, use <https://rdweb.wvd.azure.us/arm/webclient/index.html>.
> 
> To connect to the Azure China portal, use <https://rdweb.wvd.azure.cn/arm/webclient/index.html>.

>[!NOTE]
>If you've already signed in with a different Azure Active Directory account than the one you want to use for Azure Virtual Desktop, you should either sign out or use a private browser window.

After signing in, you should now see a list of resources. You can launch resources by selecting them like you would a normal app in the **All Resources** tab.

## Next steps

To learn more about how to use the web client, check out [Get started with the Web client](/windows-server/remote/remote-desktop-services/clients/remote-desktop-web-client).
