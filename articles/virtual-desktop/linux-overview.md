---
title: Windows Virtual Desktop Linux Support - Azure
description: A brief overview Linux support for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 01/23/2020
ms.author: helohr
manager: lizross
---
# Linux support

You can access Windows Virtual Desktop resources from your Linux devices with the following supported clients, provided by our Linux thin client partners. We are working with a number of partners to enable supported Windows Virtual Desktop clients on more Linux-based operating systems and devices. If you would like Windows Virtual Desktop support on a Linux platform that is not listed here, please let us know on our [UserVoice page](https://remotedesktop.uservoice.com/forums/923035-remote-desktop-support-on-linux).

## Connect with your Linux device

The following partners have approved Windows Virtual Desktop clients for Linux devices.

|Partner|Partner documentation|Partner support|
|:------|:--------------------|:--------------|
|![IGEL logo](./media/partners/igel.png)|[IGEL client documentation](https://www.igel.com/igel-solution-family/windows-virtual-desktop/)|[IGEL support](https://www.igel.com/support/)|

## What is the Linux SDK?

Linux thin client partners can use the Windows Virtual Desktop Linux SDK APIs to retrieve resource feeds, connect to desktop or remote application sessions, and use many of the redirections that our first-party clients support. The SDK is compatible with most operating systems based on Ubuntu 18.04 or later.

### Feature support

The SDK supports multiple connections to desktop and remote application sessions. The following redirections are supported:

| Redirection       | Supported |
| :---------------- | :-------: |
| Keyboard          | &#10004;  |
| Mouse             | &#10004;  |
| Audio in          | &#10004;  |
| Audio out         | &#10004;  |
| Clipboard (text)  | &#10004;  |
| Clipboard (image) | &#10004;  |
| Clipboard (file)  | &#10004;  |
| Smartcard         | &#10004;  |
| Drive/folder      | &#10004;  |

The SDK also supports multiple monitor display configurations, as long as the monitors you select for your session are contiguous.

We'll update this document as we add support for new features and redirections. If you want to suggest new features and other improvements, visit our [UserVoice page](https://go.microsoft.com/fwlink/?linkid=2116523).

## Next steps

Check out our documentation for the following clients:

- [Windows Desktop client](connect-windows-7-10.md)
- [Web client](connect-web.md)
- [Android client](connect-android.md)
- [macOS client](connect-macos.md)
- [iOS client](connect-ios.md)
