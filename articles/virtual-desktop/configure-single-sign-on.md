---
title: Configure single sign-on for Azure Virtual Desktop - Azure
description: How to configure single sign-on for an Azure Virtual Desktop environment.
services: virtual-desktop
author: Heidilohr
manager: femila

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 09/22/2022
ms.author: helohr
---
# Configure single sign-on for Azure Virtual Desktop

> [!IMPORTANT]
> Single sign-on using Azure AD authentication is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article will walk you through the process of configuring single sign-on (SSO) using Azure AD authentication for Azure Virtual Desktop (preview). When you enable SSO, you can use passwordless authentication and third-party Identity Providers that federate with Azure AD to sign in to your resources.

> [!NOTE]
> Azure Virtual Desktop (classic) doesn't support this feature.

## Prerequisites

Single sign-on is available on session hosts using the following operating systems:

  - Windows 11 Enterprise single or multi-session with the [2022-09 Cumulative Updates for Windows 11 Preview (KB5017383)](https://support.microsoft.com/kb/KB5017383) or later installed.
  - Windows 10 Enterprise single or multi-session, versions 20H2 or later with the [2022-09 Cumulative Updates for Windows 10 Preview (KB5017380)](https://support.microsoft.com/kb/KB5017380) or later installed.
  - Windows Server 2022 with the [2022-09 Cumulative Update for Microsoft server operating system preview (KB5017381)](https://support.microsoft.com/kb/KB5017381) or later installed.

You can enable SSO for connections to Azure Active Directory (AD)-joined VMs. You can also use SSO to access Hybrid Azure AD-joined VMs, but only after creating a Kerberos Server object. Azure Virtual Desktop doesn't support this solution with VMs joined to Azure AD Domain Services.

You can use the [Windows Desktop client](user-documentation/connect-windows-7-10.md) on local PCs running Windows 10 or later. There's no requirement for the local PC to be joined to a domain or Azure AD. You can also have a single sign-on experience when using the [web client](user-documentation/connect-web.md).

SSO is currently supported in the Azure Public cloud.

## Enable single sign-on

If your host pool contains Hybrid Azure AD-joined session hosts, you must first enable Azure AD Kerberos in your environment by creating a Kerberos Server object. Azure AD Kerberos enables the authentication needed with the domain controller. We recommended you also enable Azure AD Kerberos for Azure AD-joined session hosts if you have a Domain Controller (DC). Azure AD Kerberos provides a single sign-on experience when accessing legacy Kerberos-based applications or network shares. To enable Azure AD Kerberos in your environment, follow the steps to [Create a Kerberos Server object](../active-directory/authentication/howto-authentication-passwordless-security-key-on-premises.md#create-a-kerberos-server-object) on your DC.

To enable SSO on your host pool, you must [customize an RDP property](customize-rdp-properties.md). You can find the **Azure AD Authentication** property under the **Connection information** tab in the Azure portal or set the **enablerdsaadauth** property to **1** using PowerShell.

> [!IMPORTANT]
> If you enable SSO on your Hybrid Azure AD-joined VMs before you create the Kerberos server object, you won't be able to connect to the VMs, and you'll see an error message saying the specific log on session doesn't exist.

### Allow remote desktop connection dialog

When enabling single sign-on, you'll currently be prompted to authenticate to Azure AD and allow the Remote Desktop connection when launching a connection to a new host. Azure AD remembers up to 15 hosts for 30 days before prompting again. If you see this dialogue, select **Yes** to connect.

## Next steps

- Check out [In-session passwordless authentication (preview)](authentication.md#in-session-passwordless-authentication-preview) to learn how to enable passwordless authentication.
- If you're accessing Azure Virtual Desktop from our Windows Desktop client, see [Connect with the Windows Desktop client](./user-documentation/connect-windows-7-10.md).
- If you're accessing Azure Virtual Desktop from our web client, see [Connect with the web client](./user-documentation/connect-web.md).
- If you encounter any issues, go to [Troubleshoot connections to Azure AD-joined VMs](troubleshoot-azure-ad-connections.md).
