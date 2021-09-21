---
title: Connect to Azure Virtual Desktop with the web client - Azure
description: How to connect to Azure Virtual Desktop using the web client.
author: Heidilohr
ms.topic: how-to
ms.date: 07/20/2021
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
>Beginning 30 September 2021, the Azure Virtual Desktop web client will no longer support Internet Explorer 11. We recommend that you transition to using the Microsoft Edge browser instead of Internet Explorer 11. For more information, check out our Tech Community [blog post](https://aka.ms/WVDSupportIE11).

While any HTML5-capable browser should work, we officially support the following operating systems and browsers.

| Browser           | Supported OS                     | Notes               |
|-------------------|----------------------------------|---------------------|
| Microsoft Edge    | Windows                          |                     |
| Internet Explorer | Windows                          | Version 11 or later |
| Apple Safari      | macOS                            |                     |
| Mozilla Firefox   | Windows, macOS, Linux            | Version 55 or later |
| Google Chrome     | Windows, macOS, Linux, Chrome OS |                     |

## Access remote resources feed

In a browser, navigate to the Azure Resource Manager-integrated version of the Azure Virtual Desktop web client at <https://rdweb.wvd.microsoft.com/arm/webclient> and sign in with your user account.

>[!NOTE]
>If you're using Azure Virtual Desktop (classic) without Azure Resource Manager integration, connect to your resources at <https://rdweb.wvd.microsoft.com/webclient> instead.
>
> If you're using the US Gov portal, use <https://rdweb.wvd.azure.us/arm/webclient/index.html>.
> 
> To connect to the Azure China portal, use <https://rdweb.wvd.azure.cn/arm/webclient/index.html>.

>[!NOTE]
>If you've already signed in with a different Azure Active Directory account than the one you want to use for Azure Virtual Desktop, you should either sign out or use a private browser window.

After signing in, you should now see a list of resources. You can launch resources by selecting them like you would a normal app in the **All Resources** tab.

## Next steps

To learn more about how to use the web client, check out [Get started with the Web client](/windows-server/remote/remote-desktop-services/clients/remote-desktop-web-client).
