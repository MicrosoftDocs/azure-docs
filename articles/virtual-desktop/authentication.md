---
title: Windows Virtual Desktop authentication - Azure
description: Authentication methods for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/19/2020
ms.author: helohr
manager: lizross
---
# Supported authentication methods

Windows Virtual Desktop supports both NTLM and Kerberos for authentication. However, in order to use Kerberos, the client needs to get Kerberos security tickets from a KDC service running on a domain controller. In order to get tickets, the client needs a direct connection to the domain controller. Controller.

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

## Windows Virtual Desktop single sign-on (SSO)

Windows Virtual Desktop currently doesn't support ADFS or single sign-on (SSO) for authentication. The only way to avoid being prompted for your password is to select the **Remember Me** check box on the prompt window, which will save your username and password to the credential manager.


Here is additional information I would like add to existing AD requirements page to clear up a lot of the confusion. 

## Active Directory requirements

Your infrastructure needs the following things to support Windows Virtual Desktop:

- An Azure Active Directory
- A Windows Server Active Directory in sync with Azure Active Directory. You can configure this with one of the following using Azure AD Connect (for hybrid organizations) or Azure AD Domain Services (for hybrid or cloud organizations).
- A Windows Server AD in sync with Azure Active Directory, User is sourced from Windows Server AD and Windows Virtual Desktop computer is joined to Windows Server AD domain. 
- A Windows Server AD in sync with Azure Active Directory, User is sourced from Windows Server AD and Windows Virtual Desktop computer is joined to Azure AD Domain Services domain
- A Azure AD Domain Services domain, user is sourced from Azure Active Directory, and Windows Virtual Desktop computer is joined to Azure AD Domain Services domain
- An Azure subscription that contains a virtual network that either contains or is connected to the Windows Server Active Directory

User requirements to connect to Windows Virtual Desktop:
- The user must be sourced from the same AD that is synced to Azure Active Directory. Windows Virtual Desktop does not support B2P or MSA accounts.
- The UPN used to subscribe to Windows Virtual Desktop feed must exist in AD domain the VM is joined to
