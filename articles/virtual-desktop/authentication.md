---
title: Azure Virtual Desktop identities and authentication - Azure
description: Identities and authentication methods for Azure Virtual Desktop.
author: Heidilohr
ms.topic: conceptual
ms.date: 07/16/2024
ms.author: helohr
---
# Supported identities and authentication methods

In this article, we'll give you a brief overview of what kinds of identities and authentication methods you can use in Azure Virtual Desktop.

## Identities

Azure Virtual Desktop supports different types of identities depending on which configuration you choose. This section explains which identities you can use for each configuration.

>[!IMPORTANT]
>Azure Virtual Desktop doesn't support signing in to Microsoft Entra ID with one user account, then signing in to Windows with a separate user account. Signing in with two different accounts at the same time can lead to users reconnecting to the wrong session host, incorrect or missing information in the Azure portal, and error messages appearing while using app attach or MSIX app attach.

### On-premises identity

Since users must be discoverable through Microsoft Entra ID to access the Azure Virtual Desktop, user identities that exist only in Active Directory Domain Services (AD DS) aren't supported. This includes standalone Active Directory deployments with Active Directory Federation Services (AD FS).

### Hybrid identity

Azure Virtual Desktop supports [hybrid identities](/entra/identity/hybrid/whatis-hybrid-identity) through Microsoft Entra ID, including those federated using AD FS. You can manage these user identities in AD DS and sync them to Microsoft Entra ID using [Microsoft Entra Connect](/entra/identity/hybrid/connect/whatis-azure-ad-connect). You can also use Microsoft Entra ID to manage these identities and sync them to [Microsoft Entra Domain Services](/entra/identity/domain-services/overview).

When accessing Azure Virtual Desktop using hybrid identities, sometimes the User Principal Name (UPN) or Security Identifier (SID) for the user in Active Directory (AD) and Microsoft Entra ID don't match. For example, the AD account user@contoso.local may correspond to user@contoso.com in Microsoft Entra ID. Azure Virtual Desktop only supports this type of configuration if either the UPN or SID for both your AD and Microsoft Entra ID accounts match. SID refers to the user object property "ObjectSID" in AD and "OnPremisesSecurityIdentifier" in Microsoft Entra ID.

### Cloud-only identity

Azure Virtual Desktop supports cloud-only identities when using [Microsoft Entra joined VMs](deploy-azure-ad-joined-vm.md). These users are created and managed directly in Microsoft Entra ID.

>[!NOTE]
>You can also assign hybrid identities to Azure Virtual Desktop Application groups that host Session hosts of join type Microsoft Entra joined.

### Federated identity

If you're using a third-party Identity Provider (IdP), other than Microsoft Entra ID or Active Directory Domain Services, to manage your user accounts, you must ensure that:

- Your IdP is [federated with Microsoft Entra ID](/entra/identity/devices/device-join-plan#federated-environment).
- Your session hosts are Microsoft Entra joined or [Microsoft Entra hybrid joined](/entra/identity/devices/hybrid-join-plan).
- You enable [Microsoft Entra authentication](configure-single-sign-on.md) to the session host.

### External identity

Azure Virtual Desktop currently doesn't support [external identities](/entra/external-id/external-identities-overview).

## Authentication methods

When accessing Azure Virtual Desktop resources, there are three separate authentication phases:

- **Cloud service authentication**: Authenticating to the Azure Virtual Desktop service, which includes subscribing to resources and authenticating to the Gateway, is with Microsoft Entra ID.
- **Remote session authentication**: Authenticating to the remote VM. There are multiple ways to authenticate to the remote session, including the recommended single sign-on (SSO).
- **In-session authentication**: Authenticating to applications and web sites within the remote session.

For the list of credential available on the different clients for each of the authentication phase, [compare the clients across platforms](compare-remote-desktop-clients.md?pivots=azure-virtual-desktop#authentication).

>[!IMPORTANT]
>In order for authentication to work properly, your local machine must also be able to access the [required URLs for Remote Desktop clients](safe-url-list.md#remote-desktop-clients).

The following sections provide more information on these authentication phases.

### Cloud service authentication

To access Azure Virtual Desktop resources, you must first authenticate to the service by signing in with a Microsoft Entra ID account. Authentication happens whenever you subscribe to retrieve your resources, connect to the gateway when launching a connection or when sending diagnostic information to the service. The Microsoft Entra ID resource used for this authentication is Azure Virtual Desktop (app ID 9cdead84-a844-4324-93f2-b2e6bb768d07).

<a name='multi-factor-authentication'></a>

#### Multifactor authentication

Follow the instructions in [Enforce Microsoft Entra multifactor authentication for Azure Virtual Desktop using Conditional Access](set-up-mfa.md) to learn how to enforce Microsoft Entra multifactor authentication for your deployment. That article will also tell you how to configure how often your users are prompted to enter their credentials. When deploying Microsoft Entra joined VMs, note the extra steps for [Microsoft Entra joined session host VMs](set-up-mfa.md#azure-ad-joined-session-host-vms).

#### Passwordless authentication

You can use any authentication type supported by Microsoft Entra ID, such as [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-overview) and other [passwordless authentication options](/entra/identity/authentication/concept-authentication-passwordless) (for example, FIDO keys), to authenticate to the service.

#### Smart card authentication

To use a smart card to authenticate to Microsoft Entra ID, you must first [configure Microsoft Entra certificate-based authentication](/entra/identity/authentication/concept-certificate-based-authentication) or [configure AD FS for user certificate authentication](/windows-server/identity/ad-fs/operations/configure-user-certificate-authentication).

#### Third-party identity providers

You can use third-party identity providers as long as they [federate with Microsoft Entra ID](/entra/identity/devices/device-join-plan#federated-environment).

### Remote session authentication

If you haven't already enabled [single sign-on](#single-sign-on-sso) or saved your credentials locally, you'll also need to authenticate to the session host when launching a connection.

#### Single sign-on (SSO)

SSO allows the connection to skip the session host credential prompt and automatically sign the user in to Windows through Microsoft Entra authentication. For session hosts that are Microsoft Entra joined or Microsoft Entra hybrid joined, it's recommended to enable [SSO using Microsoft Entra authentication](configure-single-sign-on.md). Microsoft Entra authentication provides other benefits including passwordless authentication and support for third-party identity providers.

Azure Virtual Desktop also supports [SSO using Active Directory Federation Services (AD FS)](configure-adfs-sso.md) for the Windows Desktop and web clients.

Without SSO, the client prompts users for their session host credentials for every connection. The only way to avoid being prompted is to save the credentials in the client. We recommend you only save credentials on secure devices to prevent other users from accessing your resources.

#### Smart card and Windows Hello for Business

Azure Virtual Desktop supports both NT LAN Manager (NTLM) and Kerberos for session host authentication, however Smart card and Windows Hello for Business can only use Kerberos to sign in. To use Kerberos, the client needs to get Kerberos security tickets from a Key Distribution Center (KDC) service running on a domain controller. To get tickets, the client needs a direct networking line-of-sight to the domain controller. You can get a line-of-sight by connecting directly within your corporate network, using a VPN connection or setting up a [KDC Proxy server](key-distribution-center-proxy.md).

### In-session authentication

Once you're connected to your RemoteApp or desktop, you may be prompted for authentication inside the session. This section explains how to use credentials other than username and password in this scenario.

#### In-session passwordless authentication

Azure Virtual Desktop supports in-session passwordless authentication using [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-overview) or security devices like FIDO keys when using the [Windows Desktop client](users/connect-windows.md). Passwordless authentication is enabled automatically when the session host and local PC are using the following operating systems:

  - Windows 11 single or multi-session with the [2022-10 Cumulative Updates for Windows 11 (KB5018418)](https://support.microsoft.com/kb/KB5018418) or later installed.
  - Windows 10 single or multi-session, versions 20H2 or later with the [2022-10 Cumulative Updates for Windows 10 (KB5018410)](https://support.microsoft.com/kb/KB5018410) or later installed.
  - Windows Server 2022 with the [2022-10 Cumulative Update for Microsoft server operating system (KB5018421)](https://support.microsoft.com/kb/KB5018421) or later installed.

To disable passwordless authentication on your host pool, you must [customize an RDP property](customize-rdp-properties.md). You can find the **WebAuthn redirection** property under the **Device redirection** tab in the Azure portal or set the **redirectwebauthn** property to **0** using PowerShell.

When enabled, all WebAuthn requests in the session are redirected to the local PC. You can use Windows Hello for Business or locally attached security devices to complete the authentication process.

To access Microsoft Entra resources with Windows Hello for Business or security devices, you must enable the FIDO2 Security Key as an authentication method for your users. To enable this method, follow the steps in [Enable FIDO2 security key method](/entra/identity/authentication/how-to-enable-passkey-fido2#enable-fido2-security-key-method).

#### In-session smart card authentication

To use a smart card in your session, make sure you've installed the smart card drivers on the session host and enabled [smart card redirection](redirection-configure-smart-cards.md). Review the comparison charts for [Windows App](/windows-app/compare-platforms-features?pivots=azure-virtual-desktop#device-redirection) and the [Remote Desktop app](compare-remote-desktop-clients.md?pivots=azure-virtual-desktop#device-redirection) to make you can use smart card redirection.

## Next steps

- Curious about other ways to keep your deployment secure? Check out [Security best practices](security-guide.md).
- Having issues connecting to Microsoft Entra joined VMs? Look at [Troubleshoot connections to Microsoft Entra joined VMs](troubleshoot-azure-ad-connections.md).
- Having issues with in-session passwordless authentication? See [Troubleshoot WebAuthn redirection](troubleshoot-device-redirections.md#webauthn-redirection).
- Want to use smart cards from outside your corporate network? Review how to set up a [KDC Proxy server](key-distribution-center-proxy.md).
