---
title: Configure single sign-on for Azure Virtual Desktop using Azure AD Authentication - Azure
description: How to configure single sign-on for an Azure Virtual Desktop environment using Azure AD Authentication.
services: virtual-desktop
author: Heidilohr
manager: femila

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 06/23/2023
ms.author: helohr
---
# Configure single sign-on for Azure Virtual Desktop using Azure AD Authentication

> [!IMPORTANT]
> Single sign-on using Azure AD authentication is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article walks you through the process of configuring single sign-on (SSO) using Azure Active Directory (Azure AD) authentication for Azure Virtual Desktop (preview). When you enable SSO, you can use passwordless authentication and third-party Identity Providers that federate with Azure AD to sign in to your Azure Virtual Desktop resources. When enabled, this feature provides a single sign-on experience when authenticating to the session host and configures the session to provide single sign-on to Azure AD-based resources inside the session.

For information on using passwordless authentication within the session, see [In-session passwordless authentication (preview)](authentication.md#in-session-passwordless-authentication-preview).

> [!NOTE]
> Azure Virtual Desktop (classic) doesn't support this feature.

## Prerequisites

Single sign-on is available on session hosts using the following operating systems:

- Windows 11 Enterprise single or multi-session with the [2022-10 Cumulative Updates for Windows 11 (KB5018418)](https://support.microsoft.com/kb/KB5018418) or later installed.
- Windows 10 Enterprise single or multi-session, versions 20H2 or later with the [2022-10 Cumulative Updates for Windows 10 (KB5018410)](https://support.microsoft.com/kb/KB5018410) or later installed.
- Windows Server 2022 with the [2022-10 Cumulative Update for Microsoft server operating system (KB5018421)](https://support.microsoft.com/kb/KB5018421) or later installed.

Session hosts must be Azure AD-joined or [hybrid Azure AD-Joined](../active-directory/devices/hybrid-join-plan.md).

> [!NOTE]
> Azure Virtual Desktop doesn't support this solution with VMs joined to Azure AD Domain Services or Active Directory only joined session hosts.

Clients currently supported:

- [Windows Desktop client](users/connect-windows.md) on local PCs running Windows 10 or later. There's no requirement for the local PC to be joined to a domain or Azure AD.
- [Web client](users/connect-web.md).
- [macOS client](users/connect-macos.md) version 10.8.2 or later.

## Things to know before enabling single sign-on

Before enabling single sign-on, review the following information for using SSO in your environment.

### Allow remote desktop connection dialog

When enabling single sign-on, you'll currently be prompted to authenticate to Azure AD and allow the Remote Desktop connection when launching a connection to a new host. Azure AD remembers up to 15 hosts for 30 days before prompting again. If you see this dialogue, select **Yes** to connect.

### Disconnection when the session is locked

When SSO is enabled, you sign in to Windows using an Azure AD authentication token, which provides support for passwordless authentication to Windows. The Windows lock screen in the remote session doesn't support Azure AD authentication tokens or passwordless authentication methods like FIDO keys. The lack of support for these authentication methods means that users can't unlock their screens in a remote session. When you try to lock a remote session, either through user action or system policy, the session is instead disconnected and the service sends a message to the user explaining they've been disconnected.

Disconnecting the session also ensures that when the connection is relaunched after a period of inactivity, Azure AD reevaluates the applicable conditional access policies.

### Using an Active Directory domain admin account with single sign-on

In environments with an Active Directory (AD) and hybrid user accounts, the default Password Replication Policy on Read-only Domain Controllers denies password replication for members of Domain Admins and Administrators security groups. This will prevent these admin accounts from signing in to hybrid Azure AD-joined hosts and may keep prompting them to enter their credentials. It will also prevent admin accounts from accessing on-premises resources that leverage Kerberos authentication from Azure AD-joined hosts.

To allow these admin accounts to connect when single sign-on is enabled:

1. On a device that you use to manage your Active Directory domain, open the **Active Directory Users and Computers** console.
1. Open the **Domain Controllers** folder for your tenant.
1. Find the **AzureADKerberos** object, then right-click it and select **Properties**.
1. Select the **Password Replication Policy** tab.
1. Change the policy for **Domain Admins** from *Deny* to *Allow*.
1. Delete the policy for **Administrators**. The Domain Admins group is a member of the Administrators group, so denying replication for administrators also denies it for domain admins.
1. Select **OK** to save your changes.

## Enable single sign-on

To enable single sign-on in your environment, you must first create a Kerberos Server object, then configure your host pool to enable the feature.

### Create a Kerberos Server object

You must [Create a Kerberos Server object](../active-directory/authentication/howto-authentication-passwordless-security-key-on-premises.md#create-a-kerberos-server-object) if your session host meets the following criteria:

- Your session host is hybrid Azure AD-joined. You must have a Kerberos Server object to complete authentication to the domain controller.
- Your session host is Azure AD-joined and your environment contains Active Directory Domain Controllers. You must have a Kerberos Server object for users to access on-premises resources, such as SMB shares, and Windows-integrated authentication to websites.

> [!IMPORTANT]
> If you enable SSO on your hybrid Azure AD-joined VMs before you create a Kerberos server object, one of the following things can happen: 
>
> - You receive an error message saying the specific session doesn't exist.
> - SSO will be skipped and you'll see a standard authentication dialog for the session host. 
>
> To resolve these issues, create the Kerberos server object before trying to connect again.

### Configure your host pool

To enable SSO on your host pool, you must configure the following RDP property, which you can do using the Azure portal or PowerShell. You can find the steps to do this in [Customize Remote Desktop Protocol (RDP) properties for a host pool](customize-rdp-properties.md).

- In the Azure portal, set **Azure AD single sign-on** to **Connections will use Azure AD authentication to provide single sign-on**.
- For PowerShell, set the **enablerdsaadauth** property to **1**.

## Next steps

- Check out [In-session passwordless authentication (preview)](authentication.md#in-session-passwordless-authentication-preview) to learn how to enable passwordless authentication.
- For more information about Azure AD Kerberos, see [Deep dive: How Azure AD Kerberos works](https://techcommunity.microsoft.com/t5/itops-talk-blog/deep-dive-how-azure-ad-kerberos-works/ba-p/3070889)
- If you're accessing Azure Virtual Desktop from our Windows Desktop client, see [Connect with the Windows Desktop client](./users/connect-windows.md).
- If you're accessing Azure Virtual Desktop from our web client, see [Connect with the web client](./users/connect-web.md).
- If you encounter any issues, go to [Troubleshoot connections to Azure AD-joined VMs](troubleshoot-azure-ad-connections.md).
