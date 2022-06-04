---
title: Configure single sign-on for Azure Virtual Desktop - Azure
description: How to configure single sign-on for an Azure Virtual Desktop environment.
services: virtual-desktop
author: Heidilohr
manager: lizross

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 07/19/2022
ms.author: helohr
---
# Configure single sign-on for Azure Virtual Desktop

> [!IMPORTANT]
> Single sign-on using Azure AD authentication is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article will walk you through the process of configuring single sign-on (SSO) using Azure AD authentication for Azure Virtual Desktop. This SSO leverages an authentication protocol (RDS AAD Auth) to sign in to the session host using Azure AD, and also provides support for passwordless authentication and third-party Identity Providers that federate with Azure AD.

> [!NOTE]
> Azure Virtual Desktop (Classic) doesn't support this feature.

## Prerequisites

Single sign-on is only available on the following operating systems:

  - Windows 11 Enterprise single or multi-session with the [2022-09 Cumulative Updates for Windows 11]() or later installed.
  - Windows 10 Enterprise single or multi-session, versions 21H2 or later with the [2022-09 Cumulative Updates for Windows 10]() or later installed.
  - Windows Server, version 2022 with the [2022-09 Cumulative Update for Microsoft server operating system]() or later installed.
  - Windows Server, version 2019 with the [2022-09 Cumulative Update for Microsoft server operating system]() or later installed.

Single sign-on can be enabled for connections to Azure AD-joined VMs. SSO can also be used to access Hybrid Azure AD-joined VMs, after [creating a Kerberos Server object](#create-a-kerberos-server-object-for-hybrid-azure-ad-joined-vms). This solution is not supported with VMs joined to Azure AD Domain Services.

> [!NOTE]
> SSO is not supported with Hybrid Azure AD-joined Windows Server 2019 VMs.

SSO is currently supported with the [Windows Desktop client](./user-documentation/connect-windows-7-10.md).

> [!IMPORTANT]
> This feature is currently supported in the Azure Public, Azure Government and Azure China clouds.

## Enable single sign-on

## Create a Kerberos Server object for Hybrid Azure AD-joined VMs

For connections to Hybrid Azure AD-joined VMs, the RDS AAD Auth protocol relies on Azure AD Kerberos to complete the authentication. To enable Azure AD Kerberos in your environment, follow the 
steps to Create a Kerberos Server object.

> [!IMPORTANT]
> If SSO is enabled on Hybrid Azure AD-joined VMs before the Kerberos Server object is created, connections will fail with an error that a specified logon session does not exist.

## Next steps

- [Connect with the Windows Desktop client](./user-documentation/connect-windows-7-10.md)
- [Troubleshoot connections to Azure AD-joined VMs](troubleshoot-azure-ad-connections.md)
