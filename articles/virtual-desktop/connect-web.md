---
title: Connect Windows Virtual Desktop web client - Azure
description: How to connect to Windows Virtual Desktop using the web client.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 09/24/2019
ms.author: helohr
manager: lizross
---
# Connect with the web client

The web client lets you access your Windows Virtual Desktop resources from a web browser without the lengthy installation process.

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

In a browser, navigate to the [Windows Virtual Desktop web client](https://rdweb.wvd.microsoft.com/webclient) and sign in with your user account.

>[!NOTE]
>If you've already signed in with a different Azure Active Directory account than the one you want to use for Windows Virtual Desktop, you should either sign out or use a private browser window.

After signing in, you should now see a list of resources. You can launch resources by selecting them like you would a normal app in the **All Resources** tab.

## Next steps

To learn more about how to use the web client, check out [Get started with the Web client](/windows-server/remote/remote-desktop-services/clients/remote-desktop-web-client).
