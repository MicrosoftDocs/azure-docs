---
title: Install Arc agent at scale for your SCVMM VMs
description: Learn how to enable guest management at scale for Arc-enabled SCVMM VMs. 
ms.service: azure-arc
ms.subservice: azure-arc-scvmm
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri
ms.topic: how-to 
ms.date: 03/27/2024
keywords: "VMM, Arc, Azure"

#Customer intent: As an IT infrastructure admin, I want to install arc agents to use Azure management services for SCVMM VMs.
---

# Install Arc agents at scale for Arc-enabled SCVMM VMs

In this article, you learn how to install Arc agents at scale for SCVMM VMs and use Azure management capabilities.

>[!IMPORTANT]
>We recommend maintaining the SCVMM management server and the SCVMM console in the same Long-Term Servicing Channel (LTSC) and Update Rollup (UR) version.

>[!NOTE]
>This article is applicable only if you are running:  
>- SCVMM 2022 UR1 or later versions of SCVMM server or console
>- SCVMM 2019 UR5 or later versions of SCVMM server or console
>- VMs running Windows Server 2012 R2, 2016, 2019, 2022, Windows 10, and Windows 11  
>For other SCVMM versions, Linux VMs or Windows VMs running WS 2012 or earlier, [install Arc agents through the script](install-arc-agents-using-script.md).

## Prerequisites

Ensure the following before you install Arc agents at scale for SCVMM VMs:

- The resource bridge must be in a running state.
- The SCVMM management server must be in a connected state.
- The user account must have permissions listed in Azure Arc SCVMM Administrator role.
- All the target machines are:
    - Powered on and the resource bridge has network connectivity to the host running the VM.
    - Running a [supported operating system](../servers/prerequisites.md#supported-operating-systems).
    - Able to connect through the firewall to communicate over the internet and [these URLs](../servers/network-requirements.md?tabs=azure-cloud#urls) aren't blocked.

## Install Arc agents at scale from portal

An admin can install agents for multiple machines from the Azure portal if the machines share the same administrator credentials.

1. Navigate to the **SCVMM management servers** blade on [Azure Arc Center](https://portal.azure.com/#view/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/~/overview), and select the SCVMM management server resource.
2. Select all the machines and choose the **Enable in Azure** option.
3. Select **Enable guest management** checkbox to install Arc agents on the selected machine.
4. If you want to connect the Arc agent via proxy, provide the proxy server details.
5. If you want to connect Arc agent via private endpoint, follow these [steps](../servers/private-link-security.md) to set up Azure private link. 

      >[!Note]
      > Private endpoint connectivity is only available for Arc agent to Azure communications. For Arc resource bridge to Azure connectivity, Azure Private link isn't supported.

6. Provide the administrator username and password for the machine.

    >[!Note]
    > For Windows VMs, the account must be part of the local administrator group; and for Linux VM, it must be a root account.

## Next steps

[Manage VM extensions to use Azure management services for your SCVMM VMs](../servers/manage-vm-extensions.md).
