---
title: Connections to Azure AD-joined VMs Azure Virtual Desktop - Azure
description: How to resolve issues while connecting to Azure AD-joined VMs in Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr
manager: lizross

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 07/14/2021
ms.author: helohr
---
# Connections to Azure AD-joined VMs

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects.

Use this article to resolve issues with connections to Azure AD-joined VMs in Azure Virtual Desktop.

## Provide feedback

Visit the [Azure Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/bd-p/AzureVirtualDesktopForum) to discuss the Azure Virtual Desktop service with the product team and active community members.

## The logon attempt failed

If you encounter an error saying **The logon attempt failed** on the Windows Security credential prompt, verify the following:

- You are on a device that is Azure AD-joined or hybrid Azure AD-joined to the same Azure AD tenant as the session host OR
- You are on a device running Windows 10 2004 or later that is Azure AD registered to the same Azure AD tenant as the session host
- The [PKU2U protocol is enabled](/windows/security/threat-protection/security-policy-settings/network-security-allow-pku2u-authentication-requests-to-this-computer-to-use-online-identities) on both the local PC and the session host

## Your account is configured to prevent you from using this device

If you encounter an error saying **Your account is configured to prevent you from using this device. For more information, contact your system administrator**, ensure the user account was given the [Virtual Machine User Login role](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md) on the VMs. 

## The sign-in method you're trying to use isn't allowed

If you encounter an error saying **The sign-in method you're trying to use isn't allowed. Try a different sign-in method or contact your system administrator**, you have some Conditional Access policies restricting the type of credentials that be used to sign-in to the VMs. Ensure you use the right credential type when signing in.

## Next steps

- For an overview on troubleshooting Azure Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating an Azure Virtual Desktop environment and host pool in an Azure Virtual Desktop environment, see [Environment and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Azure Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues related to the Azure Virtual Desktop agent or session connectivity, see [Troubleshoot common Azure Virtual Desktop Agent issues](troubleshoot-agent.md).
- To troubleshoot issues when using PowerShell with Azure Virtual Desktop, see [Azure Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
