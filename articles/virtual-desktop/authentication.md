---
title: Windows Virtual Desktop authentication - Azure
description: Authentication methods for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 09/04/2020
ms.author: helohr
manager: lizross
---
# Supported authentication methods

In this article, we'll give you a brief overview of what kinds of authentication you can use in Windows Virtual Desktop.

## Session host authentication

Windows Virtual Desktop supports both NT LAN Manager (NTLM) and Kerberos for session host authentication. However, to use Kerberos, the client needs to get Kerberos security tickets from a Key Distribution Center (KDC) service running on a domain controller. To get tickets, the client needs a direct line of sight to the domain controller. You can get a direct line of sight by using your corporate network. You can also use a VPN connection to your corporate network.

These are the currently supported sign-in methods:

- Windows Desktop client
    - Username and password
    - Smartcard
    - Windows Hello
- Windows Store client
    - Username and password
- Web client
    - Username and password
- Android
    - Username and password
- iOS
    - Username and password
- macOS
    - Username and password

>[!NOTE]
>Smartcard and Windows Hello can only use Kerberos to sign in. Signing in with Kerberos requires line of sight to the domain controller.

## Hybrid identity

Windows Virtual Desktop supports [hybrid identities](https://docs.microsoft.com/en-us/azure/active-directory/hybrid/whatis-hybrid-identity) through Azure Active Directory, including those which are federated using Active Directory Federation Services (ADFS). Since the users must be discoverable through Azure Active Directory, standalone Active Directory deployments with ADFS are not supported in Windows Virtual Desktop.

## Single sign-on (SSO)

Windows Virtual Desktop currently doesn't support Active Directory Federation Services (ADFS) for SSO.

The only way to avoid being prompted for your credentials for the session host is to save them in the client. We recommend you only do this with secure devices to prevent other users from accessing your resources.

## Next steps

Curious about other ways to keep your deployment secure? Check out [Security best practices](security-guide.md).
