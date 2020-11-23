---
title: Connect to Windows Virtual Desktop with the web client - Azure
description: How to connect to Windows Virtual Desktop using the web client.
author: Heidilohr
ms.topic: how-to
ms.date: 09/24/2019
ms.author: helohr
manager: lizross
---
# Connect to Windows Virtual Desktop with the web client

>[!IMPORTANT]
>This content applies to Windows Virtual Desktop with Azure Resource Manager Windows Virtual Desktop objects. If you're using Windows Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/connect-web-2019.md).

The web client lets you access your Windows Virtual Desktop resources from a web browser without the lengthy installation process.

>[!NOTE]
>The web client doesn't currently have mobile OS support.

## Supported operating systems and browsers

While any HTML5-capable browser should work, we officially support the following operating systems and browsers.

| Browser           | Supported OS                     | Notes               |
|-------------------|----------------------------------|---------------------|
| Microsoft Edge    | Windows                          |                     |
| Internet Explorer | Windows                          | Version 11 or later |
| Apple Safari      | macOS                            |                     |
| Mozilla Firefox   | Windows, macOS, Linux            | Version 55 or later |
| Google Chrome     | Windows, macOS, Linux, Chrome OS |                     |

## Access remote resources feed

In a browser, navigate to the Azure Resource Manager-integrated version of the Windows Virtual Desktop web client at <https://rdweb.wvd.microsoft.com/arm/webclient> and sign in with your user account.

>[!NOTE]
>If you're using Windows Virtual Desktop (classic) without Azure Resource Manager integration, connect to your resources at <https://rdweb.wvd.microsoft.com/webclient> instead.
>
> If you're using the US Gov portal, use <https://rdweb.wvd.azure.us/arm/webclient/index.html>.

>[!NOTE]
>If you've already signed in with a different Azure Active Directory account than the one you want to use for Windows Virtual Desktop, you should either sign out or use a private browser window.

After signing in, you should now see a list of resources. You can launch resources by selecting them like you would a normal app in the **All Resources** tab.

## Using an Input Method Editor

The web client supports using an Input Method Editor (IME) in the remote session in version **1.0.21.16 or later**. The language pack for the keyboard you want to use in the remote session must be installed on the host virtual machine. To learn more about setting up language packs in the remote session, check out [Add language packs to a Windows 10 multi-session image](language-packs.md).

To enable IME input using the web client:

1. Before connecting to the remote session, go to the web client **Settings** panel.

2. Toggle the **Enable Input Method Editor** setting to **On**.

3. In the dropdown menu, select the keyboard you will use in the remote session.

4. Connect to the remote session.

The web client will suppress the local IME window when you are focused on the remote session. Changing IME settings once you have already connected to the remote session will not have any effect.

>[!NOTE]
>If the language pack is not installed on the host virtual machine, the remote session will default to English (United States) keyboard.

## Next steps

To learn more about how to use the web client, check out [Get started with the Web client](/windows-server/remote/remote-desktop-services/clients/remote-desktop-web-client).
