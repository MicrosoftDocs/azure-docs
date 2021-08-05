---
title: Azure Virtual Desktop authentication - Azure
description: Authentication methods for Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/09/2021
ms.author: helohr
manager: femila
---
# Supported authentication methods

In this article, we'll give you a brief overview of what kinds of authentication you can use in Azure Virtual Desktop.

## Identities

Azure Virtual desktop supports different types of identities depending on the configuration you choose. This section explains what can be used.

### On-premise identity

Since users must be discoverable through Azure Active Directory (Azure AD) to access the Azure Virtual Desktop, user identities that exist only in Active Directory Domain Services (AD DS) are not supported. This includes standalone Active Directory deployments with Active Directory Federation Services (AD FS).

### Hybrid identity

Azure Virtual Desktop supports [hybrid identities](../active-directory/hybrid/whatis-hybrid-identity.md) through Azure AD, including those federated using AD FS. These user identities can be managed in AD DS and synced to Azure AD using [Azure AD Connect](../active-directory/hybrid/whatis-azure-ad-connect.md). The user identities can also be managed in Azure AD and synced to [Azure AD Directory Services](../active-directory-domain-services/overview.md) (Azure AD DS).

When accessing Azure Virtual Desktop using hybrid identities, sometimes the User Principal Name (UPN) or Security Identifier (SID) for the user in Active Directory (AD) and Azure AD don't match. For example, the AD account user@contoso.local may correspond to user@contoso.com in Azure AD. Azure Virtual Desktop only supports this type of configuration if either the UPN or SID for both your AD and Azure AD accounts match.

### Cloud-only identity

Azure Virtual Desktop supports cloud-only identities when using [Azure AD-joined VMs](deploy-azure-ad-joined-vm.md).

### External identity

Azure Virtual Desktop currently doesn't support [external identities](../active-directory/external-identities/index.yml).

## Service authentication

To access Azure Virtual Desktop resources, you must first authenticate to the service using an Azure AD account. Authentication happens when subscribing to a workspace to retrieve your resources or every time you connect to apps or desktops. You can use [3rd party identity providers](../active-directory/devices/azureadjoin-plan.md#federated-environment) as long as they federate with Azure AD.

### Multifactor authentication

You can enable multifactor authentication (MFA) to Azure Virtual Desktop resources and configure how often users should be prompted by following these [configuration steps](set-up-mfa.md). When deploying Azure AD-joined VMs, review the additional guidance to [configure MFA](deploy-azure-ad-joined-vm.md#enabling-mfa-for-azure-ad-joined-vms).

### Smartcard authentication

To use a smartcard to authenticate to Azure AD, you must first [configure AD FS for user certificate authentication](/windows-server/identity/ad-fs/operations/configure-user-certificate-authentication).

## Session host authentication

Unless [single sign-on](#single-sign-on-sso) is enabled or you save your credentials locally, you also need to authenticate to the session host. These are the currently supported sign-in methods for the session host for the different clients:

- Windows Desktop client
    - Username and password
    - Smartcard
    - [Windows Hello for Business certificate trust](https://docs.microsoft.com/windows/security/identity-protection/hello-for-business/hello-hybrid-cert-trust)
    - [Windows Hello for Business key trust with certificates](https://docs.microsoft.com/windows/security/identity-protection/hello-for-business/hello-deployment-rdp-certs)
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

Azure Virtual Desktop supports both NT LAN Manager (NTLM) and Kerberos for session host authentication. Smartcard and Windows Hello for Business can only use Kerberos to sign in. To use Kerberos, the client needs to get Kerberos security tickets from a Key Distribution Center (KDC) service running on a domain controller. To get tickets, the client needs a direct networking line-of-sight to the domain controller. You can get a line-of-sight by using your corporate network. You can also use a VPN connection to your corporate network or set up a [KDC Proxy server](key-distribution-center-proxy.md).

### Single sign-on (SSO)

Azure Virtual Desktop supports [SSO using Active Directory Federation Services (ADFS)](configure-adfs-sso.md) for the Windows and web clients. This allows you to skip the session host authentication.

Otherwise, the only way to avoid being prompted for your credentials for the session host is to save them in the client. We recommend you only do this with secure devices to prevent other users from accessing your resources.

## In-session authentication

Once you are connected to your remote app or desktop, you may be prompted for authentication inside the session. This section explains how to use credentials other than username and password in this scenario.

### Smartcards

To use a smartcard inside the session, ensure the smartcard drivers are installed on the session host and that [smartcard redirection](configure-device-redirections.md#smart-card-redirection) is enabled. Review the [client comparison](/windows-server/remote/remote-desktop-services/clients/remote-desktop-app-compare#other-redirection-devices-etc) chart for which clients support smartcard redirection.

### FIDO2 and Windows Hello for Business

Authenticating using FIDO2 or Windows Hello for Business inside the session isn't currently supported.

## Next steps

- Curious about other ways to keep your deployment secure? Check out [Security best practices](security-guide.md).
- Having issues connecting to Azure AD-joined VMs? [Troubleshoot connections to Azure AD-joined VMs](troubleshoot-azure-ad-connections.md)
- Want to use smart cards from outside your corporate network? Review how to setup a [KDC Proxy server](key-distribution-center-proxy.md).