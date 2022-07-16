---
title: Azure Virtual Desktop identities and authentication - Azure
description: Identities and authentication methods for Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr
ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 07/26/2022
ms.author: helohr
manager: femila
---
# Supported identities and authentication methods

In this article, we'll give you a brief overview of what kinds of identities and authentication methods you can use in Azure Virtual Desktop.

## Identities

Azure Virtual Desktop supports different types of identities depending on which configuration you choose. This section explains which identities you can use for each configuration.

### On-premises identity

Since users must be discoverable through Azure Active Directory (Azure AD) to access the Azure Virtual Desktop, user identities that exist only in Active Directory Domain Services (AD DS) are not supported. This includes standalone Active Directory deployments with Active Directory Federation Services (AD FS).

### Hybrid identity

Azure Virtual Desktop supports [hybrid identities](../active-directory/hybrid/whatis-hybrid-identity.md) through Azure AD, including those federated using AD FS. You can manage these user identities in AD DS and sync them to Azure AD using [Azure AD Connect](../active-directory/hybrid/whatis-azure-ad-connect.md). You can also use Azure AD to manage these identities and sync them to [Azure AD Directory Services (Azure AD DS)](../active-directory-domain-services/overview.md).

When accessing Azure Virtual Desktop using hybrid identities, sometimes the User Principal Name (UPN) or Security Identifier (SID) for the user in Active Directory (AD) and Azure AD don't match. For example, the AD account user@contoso.local may correspond to user@contoso.com in Azure AD. Azure Virtual Desktop only supports this type of configuration if either the UPN or SID for both your AD and Azure AD accounts match. SID refers to the user object property "ObjectSID" in AD and "OnPremisesSecurityIdentifier" in Azure AD.

### Cloud-only identity

Azure Virtual Desktop supports cloud-only identities when using [Azure AD-joined VMs](deploy-azure-ad-joined-vm.md). These users are created and managed directly in Azure AD.

### Third-party identity providers

If you're using an Identity Provider (IdP) other than Azure AD to manage your user accounts, you must ensure that:

- Your IdP is [federated with Azure AD](). TODO: Proper wording? Add link.
- Your session hosts are Azure AD-joined or [Hybrid Azure AD-joined](../active-directory/devices/hybrid-azuread-join-plan.md).
- You enable [Azure AD authentication](configure-single-sign-on.md) to the session host.

### External identity

Azure Virtual Desktop currently doesn't support [external identities](../active-directory/external-identities/index.yml).

## Service authentication

To access Azure Virtual Desktop resources, you must first authenticate to the service by signing in with an Azure AD account. Authentication happens whenever you subscribe to a workspace to retrieve your resources and connect to apps or desktops. You can use [third-party identity providers](../active-directory/devices/azureadjoin-plan.md#federated-environment) as long as they federate with Azure AD.

### Multi-factor authentication

Follow the instructions in [Enforce Azure Active Directory Multi-Factor Authentication for Azure Virtual Desktop using Conditional Access](set-up-mfa.md) to learn how to enforce Azure AD Multi-Factor Authentication for your deployment. That article will also tell you how to configure how often your users are prompted to enter their credentials. When deploying Azure AD-joined VMs, note the extra steps for [Azure AD-joined session host VMs](set-up-mfa.md#azure-ad-joined-session-host-vms).

### Passwordless authentication

You can use any authentication type supported by Azure AD, such as [Windows Hello for Business](/security/identity-protection/hello-for-business/hello-overview) and other [passwordless authentication options](../active-directory/authentication/concept-authentication-passwordless.md) (for example, FIDO keys), to authenticate to the service.

### Smart card authentication

To use a smart card to authenticate to Azure AD, you must first [configure AD FS for user certificate authentication](/windows-server/identity/ad-fs/operations/configure-user-certificate-authentication) or [configure Azure AD certificate-based authentication](../active-directory/authentication/concept-certificate-based-authentication.md).

## Session host authentication

If you haven't already enabled [single sign-on](#single-sign-on-sso) or saved your credentials locally, you'll also need to authenticate to the session host when launching a connection. These are the sign-in methods for the session host that the Azure Virtual Desktop clients currently support:

- The Windows Desktop client supports the following authentication methods:
    - Username and password
    - Smart card
    - [Windows Hello for Business certificate trust](/windows/security/identity-protection/hello-for-business/hello-hybrid-cert-trust)
    - [Windows Hello for Business key trust with certificates](/windows/security/identity-protection/hello-for-business/hello-deployment-rdp-certs)
    - [Azure AD authentication](configure-single-sign-on.md)
- The Windows Store client supports the following authentication methods:
    - Username and password
- The Web client supports the following authentication methods:
    - Username and password
- The Android supports the following authentication methods:
    - Username and password
- The iOS supports the following authentication methods:
    - Username and password
- The macOS supports the following authentication methods:
    - Username and password

>[!IMPORTANT]
>In order for authentication to work properly, your local machine must also be able to access the [required URLs for Remote Desktop clients](safe-url-list.md#remote-desktop-clients).

### Single sign-on (SSO)

SSO allows the connection to skip the session host credential prompt and automatically sign the user in to Windows. For session hosts that are Azure AD-joined or Hybrid Azure AD-joined, it is recommended to enable [SSO using Azure AD authentication](configure-single-sign-on.md). Azure AD authentication provides additional benefits including passwordless authentication and support for third-party identity providers.

Azure Virtual Desktop also supports [SSO using Active Directory Federation Services (AD FS)](configure-adfs-sso.md) for the Windows Desktop and web clients.

Without SSO, users will be prompted for the session host credentials for every connection. The only way to avoid being prompted is to save the credentials in the client. We recommend you only do this with secure devices to prevent other users from accessing your resources.

### Smart card and Windows Hello for Business

Azure Virtual Desktop supports both NT LAN Manager (NTLM) and Kerberos for session host authentication, however Smart card and Windows Hello for Business can only use Kerberos to sign in. To use Kerberos, the client needs to get Kerberos security tickets from a Key Distribution Center (KDC) service running on a domain controller. To get tickets, the client needs a direct networking line-of-sight to the domain controller. You can get a line-of-sight by connecting directly within your corporate network, using a VPN connection or setting up a [KDC Proxy server](key-distribution-center-proxy.md).

## In-session authentication

Once you're connected to your remote app or desktop, you may be prompted for authentication inside the session. This section explains how to use credentials other than username and password in this scenario.

### In-session passwordless authentication

Azure Virtual Desktop supports in-session passwordless authentication using [Windows Hello for Business](/security/identity-protection/hello-for-business/hello-overview) or security devices like FIDO keys. This functionality is enabled by default when the local PC and session hosts use a supported operating system, and you can configure it using the [WebAuthn redirection](configure-device-redirections.md#webauthn-redirection) RDP property. The supported operating systems are:

- Windows 11 Enterprise single or multi-session with the [2022-09 Cumulative Updates for Windows 11]() or later installed.
- Windows 10 Enterprise single or multi-session, versions 20H2 or later with the [2022-09 Cumulative Updates for Windows 10]() or later installed.
- Windows Server, version 2022 with the [2022-09 Cumulative Update for Microsoft server operating system]() or later installed.
- Windows Server, version 2019 with the [2022-09 Cumulative Update for Microsoft server operating system]() or later installed.

When enabled, all WebAuthn requests in the session are redirected to the local PC where you can use your local biometrics with Windows Hello for Business or locally attached security devices to complete the authentication process.

### In-session smart card authentication

To use a smart card in your session, make sure you've installed the smart card drivers on the session host and enabled [smart card redirection](configure-device-redirections.md#smart-card-redirection). Review the [client comparison chart](/windows-server/remote/remote-desktop-services/clients/remote-desktop-app-compare#other-redirection-devices-etc) to make sure your client supports smart card redirection.

## Next steps

- Curious about other ways to keep your deployment secure? Check out [Security best practices](security-guide.md).
- Having issues connecting to Azure AD-joined VMs? [Troubleshoot connections to Azure AD-joined VMs](troubleshoot-azure-ad-connections.md).
- Want to use smart cards from outside your corporate network? Review how to setup a [KDC Proxy server](key-distribution-center-proxy.md).
