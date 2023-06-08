---
title: Configure single sign-on for Azure Virtual Desktop using Azure AD Authentication - Azure
description: How to configure single sign-on for an Azure Virtual Desktop environment using Azure AD Authentication.
services: virtual-desktop
author: Heidilohr
manager: femila

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 03/20/2023
ms.author: helohr
---
# Configure single sign-on for Azure Virtual Desktop using Azure AD Authentication

> [!IMPORTANT]
> Single sign-on using Azure AD authentication is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article will walk you through the process of configuring single sign-on (SSO) using Azure Active Directory (Azure AD) authentication for Azure Virtual Desktop (preview). When you enable SSO, you can use passwordless authentication and third-party Identity Providers that federate with Azure AD to sign in to your Azure Virtual Desktop and Remote Applications. When enabled, this feature provides a single sign-on experience when authenticating to the session host and configures the session to provide single sign-on to Azure AD-based resources inside the session.

For information on using passwordless authentication within the session, see [In-session passwordless authentication (preview)](authentication.md#in-session-passwordless-authentication-preview).

> [!NOTE]
> Azure Virtual Desktop (classic) doesn't support this feature.

## Prerequisites

Single sign-on is available on session hosts using the following operating systems:

- Windows 11 Enterprise single or multi-session with the [2022-10 Cumulative Updates for Windows 11 (KB5018418)](https://support.microsoft.com/kb/KB5018418) or later installed.
- Windows 10 Enterprise single or multi-session, versions 20H2 or later with the [2022-10 Cumulative Updates for Windows 10 (KB5018410)](https://support.microsoft.com/kb/KB5018410) or later installed.
- Windows Server 2022 with the [2022-10 Cumulative Update for Microsoft server operating system (KB5018421)](https://support.microsoft.com/kb/KB5018421) or later installed.

Session hosts must be Azure AD-joined or [Hybrid Azure AD-Joined](../active-directory/devices/hybrid-azuread-join-plan.md).

> [!NOTE]
> Azure Virtual Desktop doesn't support this solution with VMs joined to Azure AD Domain Services or Active Directory only joined session hosts.

You must [Create a Kerberos Server object](../active-directory/authentication/howto-authentication-passwordless-security-key-on-premises.md#create-a-kerberos-server-object) when your session host is:

- Hybrid Azure AD-joined. Azure AD Kerberos is needed to complete the authentication to the domain controller.
- Azure AD-joined and your environment contains Active Directory Domain Controllers. Azure AD Kerberos is required in this case for users to access on-premises resources, like SMB shares, and Windows-integrated authentication to websites.
  
Clients currently supported:  

- [Windows Desktop client](users/connect-windows.md) on local PCs running Windows 10 or later. There's no requirement for the local PC to be joined to a domain or Azure AD.
- [Web client](users/connect-web.md).

## Enable single sign-on

To enable SSO on your host pool, you must [customize an RDP property](customize-rdp-properties.md). You can find the **Azure AD Authentication** property under the **Connection information** tab in the Azure portal or set the **enablerdsaadauth** property to **1** using PowerShell.

> [!IMPORTANT]
> If you enable SSO on your Hybrid Azure AD-joined VMs before you create the Kerberos server object, you won't be able to connect to the VMs, and you'll see an error message saying the specific log on session doesn't exist.

### Allow remote desktop connection dialog

When enabling single sign-on, you'll currently be prompted to authenticate to Azure AD and allow the Remote Desktop connection when launching a connection to a new host. Azure AD remembers up to 15 hosts for 30 days before prompting again. If you see this dialogue, select **Yes** to connect.

### Disconnection when the session is locked

When SSO is enabled, you sign in to Windows using an Azure AD authentication token, which provides support for passwordless authentication to Windows. The Windows lock screen in the remote session doesn't support Azure AD authentication tokens or passwordless authentication methods like FIDO keys. The lack of support for these authentication methods means that users can't unlock their screens in a remote session. When you try to lock a remote session, either through user action or system policy, the session is instead disconnected and the service sends a message to the user explaining they've been disconnected.

Disconnecting the session also ensures that when the connection is relaunched after a period of inactivity, Azure AD reevaluates the applicable conditional access policies.

## Next steps

- Check out [In-session passwordless authentication (preview)](authentication.md#in-session-passwordless-authentication-preview) to learn how to enable passwordless authentication.
- For more information about Azure AD Kerberos, see [Deep dive: How Azure AD Kerberos works](https://techcommunity.microsoft.com/t5/itops-talk-blog/deep-dive-how-azure-ad-kerberos-works/ba-p/3070889)
- If you're accessing Azure Virtual Desktop from our Windows Desktop client, see [Connect with the Windows Desktop client](./users/connect-windows.md).
- If you're accessing Azure Virtual Desktop from our web client, see [Connect with the web client](./users/connect-web.md).
- If you encounter any issues, go to [Troubleshoot connections to Azure AD-joined VMs](troubleshoot-azure-ad-connections.md).
