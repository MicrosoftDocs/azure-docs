---
title: Azure Virtual Desktop authentication - Azure
description: Authentication methods for Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 07/14/2021
ms.author: helohr
manager: femila
---
# Supported authentication methods

In this article, we'll give you a brief overview of what kinds of authentication you can use in Azure Virtual Desktop.

## Session host authentication

Azure Virtual Desktop supports both NT LAN Manager (NTLM) and Kerberos for session host authentication. However, to use Kerberos, the client needs to get Kerberos security tickets from a Key Distribution Center (KDC) service running on a domain controller. To get tickets, the client needs a direct line of sight to the domain controller. You can get a direct line of sight by using your corporate network. You can also use a VPN connection to your corporate network or set up a [KDC Proxy server](key-distribution-center-proxy.md).

These are the currently supported sign-in methods:

- Windows Desktop client
    - Username and password
    - Smartcard
    - [Windows Hello for Business certificate trust](/windows/security/identity-protection/hello-for-business/hello-hybrid-cert-trust)
    - [Windows Hello for Business key trust with certificates](/windows/security/identity-protection/hello-for-business/hello-deployment-rdp-certs)
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
>Smartcard and Windows Hello for Business can only use Kerberos to sign in. Signing in with Kerberos requires line-of-sight to the domain controller or a [KDC Proxy server](key-distribution-center-proxy.md).

## Hybrid identity

Azure Virtual Desktop supports [hybrid identities](../active-directory/hybrid/whatis-hybrid-identity.md) through Azure Active Directory (Azure AD), including those federated using Active Directory Federation Services (ADFS). Since users must be discoverable through Azure AD, Azure Virtual Desktop doesn't support standalone Active Directory deployments with ADFS.

### UPN mismatch

When accessing Active Directory joined or Hybrid Azure Active Directory joined VMs using hybrid identities, sometimes the User Principal Name (UPN) for the Active Directory (AD) and Azure AD don't match. For example, the AD account user@contoso.local may correspond to user@contoso.com in Azure AD. Azure Virtual Desktop only supports this type of configuration if the Security Identifier (SID) for both your AD and Azure AD accounts match.

## Cloud-only identity

Azure Virtual Desktop supports cloud-only identities when using [Azure AD-joined VMs](deploy-azure-ad-joined-vm.md).

## External identity

Azure Virtual Desktop currently doesn't support [external identities](../active-directory/external-identities/index.yml).

## Single sign-on (SSO)

Azure Virtual Desktop supports [SSO using Active Directory Federation Services (ADFS)](configure-adfs-sso.md) for the Windows and web clients.

Otherwise, the only way to avoid being prompted for your credentials for the session host is to save them in the client. We recommend you only do this with secure devices to prevent other users from accessing your resources.

## Next steps

Curious about other ways to keep your deployment secure? Check out [Security best practices](security-guide.md).