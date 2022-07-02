---
title: Device redirections in Azure Virtual Desktop - Azure
description: How to resolve issues with device redirections in Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr
manager: lizross

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 07/26/2022
ms.author: helohr
---
# Device redirections

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects.

Use this article to resolve issues with device redirections in Azure Virtual Desktop.

## Provide feedback

Visit the [Azure Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/bd-p/AzureVirtualDesktopForum) to discuss the Azure Virtual Desktop service with the product team and active community members.

## WebAuthn redirection

WebAuthn redirection is enabled by default in Azure Virtual Desktop if you are using the following operating systems on both the local PC and the session host:

- Windows 11 Enterprise single or multi-session with the [2022-09 Cumulative Updates for Windows 11]() or later installed.
- Windows 10 Enterprise single or multi-session, versions 20H2 or later with the [2022-09 Cumulative Updates for Windows 10]() or later installed.
- Windows Server, version 2022 with the [2022-09 Cumulative Update for Microsoft server operating system]() or later installed.
- Windows Server, version 2019 with the [2022-09 Cumulative Update for Microsoft server operating system]() or later installed.

You can configure WebAuthn redirection using an [RDP property](configure-device-redirections.md#webauthn-redirection) available in the Azure Portal.

## Next steps

- For an overview on troubleshooting Azure Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating an Azure Virtual Desktop environment and host pool in an Azure Virtual Desktop environment, see [Environment and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Azure Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues related to the Azure Virtual Desktop agent or session connectivity, see [Troubleshoot common Azure Virtual Desktop Agent issues](troubleshoot-agent.md).
- To troubleshoot issues when using PowerShell with Azure Virtual Desktop, see [Azure Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
