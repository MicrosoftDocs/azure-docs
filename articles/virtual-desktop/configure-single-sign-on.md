---
title: Configure single sign-on for Azure Virtual Desktop - Azure
description: How to configure single sign-on for an Azure Virtual Desktop environment.
services: virtual-desktop
author: Heidilohr
manager: femila

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 07/26/2022
ms.author: helohr
---
# Configure single sign-on for Azure Virtual Desktop

> [!IMPORTANT]
> Single sign-on using Azure AD authentication is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article will walk you through the process of configuring single sign-on (SSO) using Azure AD authentication for Azure Virtual Desktop. When SSO is enabled, you can use passwordless authentication and third-party Identity Providers that federate with Azure AD to sign in to your resources.

> [!NOTE]
> Azure Virtual Desktop (classic) doesn't support this feature.

## Prerequisites

Single sign-on is only available on the following operating systems:

  - Windows 11 Enterprise single or multi-session with the [2022-09 Cumulative Updates for Windows 11]() or later installed.
  - Windows 10 Enterprise single or multi-session, versions 20H2 or later with the [2022-09 Cumulative Updates for Windows 10]() or later installed.
  - Windows Server, version 2022 with the [2022-09 Cumulative Update for Microsoft server operating system]() or later installed.
  - Windows Server, version 2019 with the [2022-09 Cumulative Update for Microsoft server operating system]() or later installed.

Single sign-on can be enabled for connections to Azure AD-joined VMs. SSO can also be used to access Hybrid Azure AD-joined VMs, but only after creating a Kerberos Server object. This solution is not supported with VMs joined to Azure AD Domain Services.

> [!NOTE]
> Hybrid Azure AD-joined Windows Server 2019 VMs don't support SSO.

Currently, the [Windows Desktop client](./user-documentation/connect-windows-7-10.md) is the only client that supports SSO.

This feature is currently supported in the Azure Public, Azure Government and Azure China clouds.

## Enable single sign-on

If your host pool contains Hybrid Azure AD-joined session hosts, you must first enable Azure AD Kerberos in your environment by creating a Kerberos Server object. This enables the authentication needed with the domain controller. It is also recommended to enable Azure AD Kerberos for Azure AD-joined session hosts if you plan to access legacy kerberos based applications or network shares and want a single sign-on experience. To enable Azure AD Kerberos in your environment, follow the steps to [Create a Kerberos Server object](../active-directory/authentication/howto-authentication-passwordless-security-key-on-premises.md#install-the-azure-ad-kerberos-powershell-module).

To enable SSO on your host pool, you must [customize an RDP property](customize-rdp-properties.md). You can find the **Azure AD Authentication** property under the **Connection information** tab in the Azure Portal.

> [!IMPORTANT]
> If you enable SSO on your Hybrid Azure AD-joined VMs before you create the Kerberos server object, you won't be able to connect to the VMs, and you'll see an error message saying the specific log on session doesn't exist.

## Next steps

- [Connect with the Windows Desktop client](./user-documentation/connect-windows-7-10.md)
- [Troubleshoot connections to Azure AD-joined VMs](troubleshoot-azure-ad-connections.md)
