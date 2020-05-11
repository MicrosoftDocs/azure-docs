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

Partners can use the Linux SDK for Windows Virtual Desktop to build a standalone Windows Virtual Desktop client. You can also use it to enable Windows Virtual Desktop support on your client application. This quick guide will explain what the Linux SDK is and how to start using it.

## Connect with your Linux device

The following partners have approved Windows Virtual Desktop clients for Linux devices.

|Partner|Partner documentation|Partner support|
|:------|:--------------------|:--------------|
|![IGEL logo](./media/partners/igel.png)|[IGEL client documentation](https://www.igel.com/igel-solution-family/windows-virtual-desktop/)|[IGEL support](https://www.igel.com/support/)|

## What is the Linux SDK?

You can use the SDK APIs to retrieve resource feeds, connect to desktop or remote application sessions, and use many of the redirections that our first-party clients support.

> [!NOTE]
> The SDK is currently in development. We'll update this document with instructions to access the SDK when it is generally available.

### Supported Linux distributions

The SDK is compatible with most operating systems based on Ubuntu 18.04 or later. If you have a different Linux distribution, we can work with you to figure out how to best support your needs.

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

## Get started with the Linux SDK

Before you can develop a Linux client for Windows Virtual Desktop, you need to do the following things:

1. Build and deploy a Windows Virtual Desktop environment for testing or production use.
2. Test the available first-party clients to familiarize yourself with the Windows Virtual Desktop user experience.

## Next steps

Check out our documentation for the following clients:

- [Windows Desktop client](connect-windows-7-and-10.md)
- [Web client](connect-web.md)
- [Android client](connect-android.md)
- [macOS client](connect-macos.md)
- [iOS client](connect-ios.md)
