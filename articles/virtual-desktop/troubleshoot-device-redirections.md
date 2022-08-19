---
title: Device redirections in Azure Virtual Desktop - Azure
description: How to resolve issues with device redirections in Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr
manager: femila

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 08/24/2022
ms.author: helohr
---
# Device redirections

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects.

Use this article to resolve issues with device redirections in Azure Virtual Desktop.

## Provide feedback

Visit the [Azure Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/bd-p/AzureVirtualDesktopForum) to discuss the Azure Virtual Desktop service with the product team and active community members.

## WebAuthn redirection

If WebAuthn requests from the session aren't redirected to the local PC, verify that:

- you're using supported operating systems for [in-session passwordless authentication](authentication.md#in-session-passwordless-authentication) on both the local PC and the session host.
- WebAuthn redirection is enabled as a [device redirection](configure-device-redirections.md#webauthn-redirection).

If the option to use Windows Hello for Business or security keys isn't available when accessing Azure AD resources, verify that the FIDO2 security key method has been enabled for the user account in Azure AD. Follow the steps to [Enable FIDO2 security key method](../active-directory/authentication/howto-authentication-passwordless-security-key.md#enable-fido2-security-key-method).

If a user signs in to the session host using single factor credential like username and password, and then tries to access an Azure AD resource that requires MFA, they may not be able to use Windows Hello for Business. To authenticate to that resource, they can follow the steps below:

1. If they aren't prompted for a user account, they should first sign out.
1. On the account selection page, choose Use another account.
1. Choose Sign-in options at the bottom.
1. Select Sign in with Windows Hello or a security key.
1. They shouldn't see option to select their local Windows Hello or security key authentication methods.

## Next steps

- For an overview on troubleshooting Azure Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating an Azure Virtual Desktop environment and host pool in an Azure Virtual Desktop environment, see [Environment and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Azure Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues related to the Azure Virtual Desktop agent or session connectivity, see [Troubleshoot common Azure Virtual Desktop Agent issues](troubleshoot-agent.md).
- To troubleshoot issues when using PowerShell with Azure Virtual Desktop, see [Azure Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
