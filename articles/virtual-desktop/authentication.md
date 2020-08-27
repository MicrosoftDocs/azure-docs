---
title: Windows Virtual Desktop authentication - Azure
description: Authentication methods for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/22/2020
ms.author: helohr
manager: lizross
---
# Supported authentication methods

In this article, we'll give you a brief overview of what kinds of authentication you can use in Windows Virtual Desktop.

## Session host authentication

Windows Virtual Desktop supports both NT LAN Manager (NTLM) and Kerberos for authentication. However, in order to use Kerberos, the client needs to get Kerberos security tickets from a KDC service running on a domain controller. In order to get tickets, the client needs a direct connection to the domain controller. Controller.

Supported sign-in methods:
- Windows Virtual Desktop client
    - Username and password
    - Smartcard
    - Windows Hello
- Web client
    - Username and password
- Android
    - Username and password
- iOS
    - Username and password
- macOS
    - Username and password

>[!NOTE]
>Smartcard and Windows Hello can only use Kerberos to sign in.

## Unsupported methods

Windows Virtual Desktop currently doesn't support the following authentication methods:

- Active Directory Federation Services (ADFS)
- Single sign-on (SSO)

The only way to avoid being prompted for your password is to select the **Remember Me** check box on the prompt window, which will save your username and password to the credential manager.

## Next steps

Curious about other ways to keep your deployment secure? Check out [Security best practices](security-guide.md).
