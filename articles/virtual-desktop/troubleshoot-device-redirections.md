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
# Troubleshoot device redirections for Azure Virtual Desktop

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects.

Use this article to resolve issues with device redirections in Azure Virtual Desktop.

## WebAuthn redirection

If WebAuthn requests from the session aren't redirected to the local PC, check to make sure you've fulfilled the following requirements:

- Are you using supported operating systems for [in-session passwordless authentication](authentication.md#in-session-passwordless-authentication-preview) on both the local PC and session host?
- Have you enabled WebAuthn redirection as a [device redirection](configure-device-redirections.md#webauthn-redirection)?

If you've answered "yes" to both of the earlier questions but still don't see the option to use Windows Hello for Business or security keys when accessing Microsoft Entra resources, make sure you've enabled the FIDO2 security key method for the user account in Microsoft Entra ID. To enable this method, follow the directions in [Enable FIDO2 security key method](../active-directory/authentication/howto-authentication-passwordless-security-key.md#enable-fido2-security-key-method).

If a user signs in to the session host with a single-factor credential like username and password, then tries to access a Microsoft Entra resource that requires MFA, they may not be able to use Windows Hello for Business. The user should follow these instructions to authenticate properly:

1. If the user isn't prompted for a user account, they should first sign out.
1. On the **account selection** page, select **Use another account**.
1. Next, choose **Sign-in options** at the bottom of the window.
1. After that, select **Sign in with Windows Hello or a security key**. They should see an option to select Windows Hello or security authentication methods.

## Provide feedback

Visit the [Azure Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/bd-p/AzureVirtualDesktopForum) to discuss the Azure Virtual Desktop service with the product team and active community members.

## Next steps

- For an overview on troubleshooting Azure Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating an Azure Virtual Desktop environment and host pool in an Azure Virtual Desktop environment, see [Environment and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Azure Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues related to the Azure Virtual Desktop agent or session connectivity, see [Troubleshoot common Azure Virtual Desktop Agent issues](troubleshoot-agent.md).
- To troubleshoot issues when using PowerShell with Azure Virtual Desktop, see [Azure Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To go through a troubleshooting tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
