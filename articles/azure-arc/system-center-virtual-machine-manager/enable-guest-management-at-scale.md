---
title: Install Arc agent at scale for your SCVMM VMs
description: Learn how to enable guest management at scale for Arc-enabled SCVMM VMs. 
ms.service: azure-arc
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.topic: how-to 
ms.date: 09/18/2023
keywords: "VMM, Arc, Azure"

#Customer intent: As an IT infrastructure admin, I want to install arc agents to use Azure management services for SCVMM VMs.
---

# Install Arc agents at scale for Arc-enabled SCVMM VMs

In this article, you learn how to install Arc agents at scale for SCVMM VMs and use Azure management capabilities.

>[!NOTE]
>This article is applicable only for Windows VMs on hosts running on WS 2016, WS 2019, and WS 2022 OS versions. If you’re using a Windows VM which is not running on these host OS versions or if you're using a Linux VM, [install Arc agents through the script](install-arc-agents-using -script.md).

## Prerequisites

Ensure the following before you install Arc agents at scale for SCVMM VMs:

- The resource bridge must be in a running state.
- The SCVMM management server must be in a connected state.
- The user account must have permissions listed in Azure Arc SCVMM Administrator role.
- All the target machines are:
    - Powered on and the resource bridge has network connectivity to the host running the VM.
    - Running a [supported operating system](/azure/azure-arc/servers/prerequisites#supported-operating-systems).
    - Able to connect through the firewall to communicate over the internet and [these URLs](/azure/azure-arc/servers/network-requirements?tabs=azure-cloud#urls) aren't blocked.

## Install Arc agents at scale from portal

An admin can install agents for multiple machines from the Azure portal if the machines share the same administrator credentials.

1. Navigate to the **SCVMM management servers** blade on [Azure Arc Center](https://ms.portal.azure.com/#view/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/~/overview), and select the SCVMM management server resource.
2. Select all the machines and choose the **Enable in Azure** option.
3. Select **Enable guest management** checkbox to install Arc agents on the selected machine.
4. If you want to connect the Arc agent via proxy, provide the proxy server details.
5. Provide the administrator username and password for the machine.

    >[!Note]
    > For Windows VMs, the account must be part of the local administrator group; and for Linux VM, it must be a root account.

## Next steps

[Recover from accidental deletion of resource bridge virtual machine](disaster-recovery.md).