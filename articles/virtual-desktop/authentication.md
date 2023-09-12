---
title: Azure Virtual Desktop identities and authentication - Azure
description: Identities and authentication methods for Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr
ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 07/11/2023
ms.author: helohr
manager: femila
---
# Supported identities and authentication methods

In this article, we'll give you a brief overview of what kinds of identities and authentication methods you can use in Azure Virtual Desktop.

## Identities

Azure Virtual Desktop supports different types of identities depending on which configuration you choose. This section explains which identities you can use for each configuration.

>[!IMPORTANT]
>Azure Virtual Desktop doesn't support signing in to Azure AD with one user account, then signing in to Windows with a separate user account. Signing in with two different accounts at the same time can lead to users reconnecting to the wrong session host, incorrect or missing information in the Azure portal, and error messages appearing while using MSIX app attach.

### On-premises identity

Since users must be discoverable through Azure Active Directory (Azure AD) to access the Azure Virtual Desktop, user identities that exist only in Active Directory Domain Services (AD DS) aren't supported. This includes standalone Active Directory deployments with Active Directory Federation Services (AD FS).

### Hybrid identity

Azure Virtual Desktop supports [hybrid identities](../active-directory/hybrid/whatis-hybrid-identity.md) through Azure AD, including those federated using AD FS. You can manage these user identities in AD DS and sync them to Azure AD using [Azure AD Connect](../active-directory/hybrid/whatis-azure-ad-connect.md). You can also use Azure AD to manage these identities and sync them to [Azure AD Domain Services (Azure AD DS)](../active-directory-domain-services/overview.md).

When accessing Azure Virtual Desktop using hybrid identities, sometimes the User Principal Name (UPN) or Security Identifier (SID) for the user in Active Directory (AD) and Azure AD don't match. For example, the AD account user@contoso.local may correspond to user@contoso.com in Azure AD. Azure Virtual Desktop only supports this type of configuration if either the UPN or SID for both your AD and Azure AD accounts match. SID refers to the user object property "ObjectSID" in AD and "OnPremisesSecurityIdentifier" in Azure AD.

### Cloud-only identity

Azure Virtual Desktop supports cloud-only identities when using [Azure AD joined VMs](deploy-azure-ad-joined-vm.md). These users are created and managed directly in Azure AD.

>[!NOTE]
>You can also assign hybrid identities to Azure Virtual Desktop Application groups that host Session hosts of join type Azure AD joined.

### Third-party identity providers

If you're using an Identity Provider (IdP) other than Azure AD to manage your user accounts, you must ensure that:

- Your IdP is [federated with Azure AD](../active-directory/devices/azureadjoin-plan.md#federated-environment).
- Your session hosts are Azure AD-joined or [Hybrid Azure AD-joined](../active-directory/devices/hybrid-join-plan.md).
- You enable [Azure AD authentication](configure-single-sign-on.md) to the session host.

### External identity

Azure Virtual Desktop currently doesn't support [external identities](../active-directory/external-identities/index.yml).

## Service authentication

To access Azure Virtual Desktop resources, you must first authenticate to the service by signing in with an Azure AD account. Authentication happens whenever you subscribe to a workspace to retrieve your resources and connect to apps or desktops. You can use [third-party identity providers](../active-directory/devices/azureadjoin-plan.md#federated-environment) as long as they federate with Azure AD.

### Multi-factor authentication

Follow the instructions in [Enforce Azure Active Directory Multi-Factor Authentication for Azure Virtual Desktop using Conditional Access](set-up-mfa.md) to learn how to enforce Azure AD Multi-Factor Authentication for your deployment. That article will also tell you how to configure how often your users are prompted to enter their credentials. When deploying Azure AD-joined VMs, note the extra steps for [Azure AD-joined session host VMs](set-up-mfa.md#azure-ad-joined-session-host-vms).

### Passwordless authentication

You can use any authentication type supported by Azure AD, such as [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-overview) and other [passwordless authentication options](../active-directory/authentication/concept-authentication-passwordless.md) (for example, FIDO keys), to authenticate to the service.

### Smart card authentication

To use a smart card to authenticate to Azure AD, you must first [configure AD FS for user certificate authentication](/windows-server/identity/ad-fs/operations/configure-user-certificate-authentication) or [configure Azure AD certificate-based authentication](../active-directory/authentication/concept-certificate-based-authentication.md).

## Session host authentication

If you haven't already enabled [single sign-on](#single-sign-on-sso) or saved your credentials locally, you'll also need to authenticate to the session host when launching a connection. The following list describes which types of authentication each Azure Virtual Desktop client currently supports.


|Client  |Supported authentication type(s)  |
|---------|---------|
|Windows Desktop client    | Username and password <br>Smart card <br>[Windows Hello for Business certificate trust](/windows/security/identity-protection/hello-for-business/hello-hybrid-cert-trust) <br>[Windows Hello for Business key trust with certificates](/windows/security/identity-protection/hello-for-business/hello-deployment-rdp-certs) <br>[Azure AD authentication](configure-single-sign-on.md)               |
|Azure Virtual Desktop Store app     |  Username and password <br>Smart card <br>[Windows Hello for Business certificate trust](/windows/security/identity-protection/hello-for-business/hello-hybrid-cert-trust) <br>[Windows Hello for Business key trust with certificates](/windows/security/identity-protection/hello-for-business/hello-deployment-rdp-certs) <br>[Azure AD authentication](configure-single-sign-on.md)           |
|Remote Desktop app     |  Username and password       |
|Web client    | Username and password        |
|Android client   | Username and password        |
|iOS client     |   Username and password      |
|macOS client    | Username and password <br>Smart card: support for smart card-based sign in using smart card redirection at the Winlogon prompt when NLA is not negotiated.        |

>[!IMPORTANT]
>In order for authentication to work properly, your local machine must also be able to access the [required URLs for Remote Desktop clients](safe-url-list.md#remote-desktop-clients).

### Single sign-on (SSO)

SSO allows the connection to skip the session host credential prompt and automatically sign the user in to Windows. For session hosts that are Azure AD-joined or Hybrid Azure AD-joined, it's recommended to enable [SSO using Azure AD authentication](configure-single-sign-on.md). Azure AD authentication provides other benefits including passwordless authentication and support for third-party identity providers.

Azure Virtual Desktop also supports [SSO using Active Directory Federation Services (AD FS)](configure-adfs-sso.md) for the Windows Desktop and web clients.

Without SSO, the client will prompt users for their session host credentials for every connection. The only way to avoid being prompted is to save the credentials in the client. We recommend you only save credentials on secure devices to prevent other users from accessing your resources.

### Smart card and Windows Hello for Business

Azure Virtual Desktop supports both NT LAN Manager (NTLM) and Kerberos for session host authentication, however Smart card and Windows Hello for Business can only use Kerberos to sign in. To use Kerberos, the client needs to get Kerberos security tickets from a Key Distribution Center (KDC) service running on a domain controller. To get tickets, the client needs a direct networking line-of-sight to the domain controller. You can get a line-of-sight by connecting directly within your corporate network, using a VPN connection or setting up a [KDC Proxy server](key-distribution-center-proxy.md).

## In-session authentication

Once you're connected to your RemoteApp or desktop, you may be prompted for authentication inside the session. This section explains how to use credentials other than username and password in this scenario.

### In-session passwordless authentication (preview)

> [!IMPORTANT]
> In-session passwordless authentication is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Virtual Desktop supports in-session passwordless authentication (preview) using [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-overview) or security devices like FIDO keys when using the [Windows Desktop client](users/connect-windows.md). Passwordless authentication is enabled automatically when the session host and local PC are using the following operating systems:

  - Windows 11 single or multi-session with the [2022-10 Cumulative Updates for Windows 11 (KB5018418)](https://support.microsoft.com/kb/KB5018418) or later installed.
  - Windows 10 single or multi-session, versions 20H2 or later with the [2022-10 Cumulative Updates for Windows 10 (KB5018410)](https://support.microsoft.com/kb/KB5018410) or later installed.
  - Windows Server 2022 with the [2022-10 Cumulative Update for Microsoft server operating system (KB5018421)](https://support.microsoft.com/kb/KB5018421) or later installed.

To disable passwordless authentication on your host pool, you must [customize an RDP property](customize-rdp-properties.md). You can find the **WebAuthn redirection** property under the **Device redirection** tab in the Azure portal or set the **redirectwebauthn** property to **0** using PowerShell.

When enabled, all WebAuthn requests in the session are redirected to the local PC. You can use Windows Hello for Business or locally attached security devices to complete the authentication process.

To access Azure AD resources with Windows Hello for Business or security devices, you must enable the FIDO2 Security Key as an authentication method for your users. To enable this method, follow the steps in [Enable FIDO2 security key method](../active-directory/authentication/howto-authentication-passwordless-security-key.md#enable-fido2-security-key-method).

### In-session smart card authentication

To use a smart card in your session, make sure you've installed the smart card drivers on the session host and enabled [smart card redirection](configure-device-redirections.md#smart-card-redirection). Review the [client comparison chart](/windows-server/remote/remote-desktop-services/clients/remote-desktop-app-compare#other-redirection-devices-etc) to make sure your client supports smart card redirection.

## Next steps

- Curious about other ways to keep your deployment secure? Check out [Security best practices](security-guide.md).
- Having issues connecting to Azure AD-joined VMs? Look at [Troubleshoot connections to Azure AD-joined VMs](troubleshoot-azure-ad-connections.md).
- Having issues with in-session passwordless authentication? See [Troubleshoot WebAuthn redirection](troubleshoot-device-redirections.md#webauthn-redirection).
- Want to use smart cards from outside your corporate network? Review how to set up a [KDC Proxy server](key-distribution-center-proxy.md).
