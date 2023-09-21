---
title: Install Arc agent at scale for your SCVMM VMs
description: Learn how to enable guest management at scale for Arc-enabled SCVMM VMs. 
ms.service: azure-arc
ms.subservice: azure-arc-scvmm
author: jyothisuri
ms.author: jsuri
ms.topic: how-to 
ms.date: 09/18/2023
keywords: "VMM, Arc, Azure"

#Customer intent: As an IT infra admin, I want to install arc agents to use Azure management services for SCVMM VMs.
---

# Install Arc agents at scale for Arc-enabled SCVMM VMs

In this article, you will learn how to install Arc agents at scale for SCVMM VMs and use Azure management capabilities.

## Prerequisites

Ensure the following before you install Arc agents at scale for SCVMM VMs:

- The resource bridge must be in a running state.
- The SCVMM management server must be in connected state.
- The user account must have permissions listed in Azure Arc SCVMM Administrator role.
- All the target machines are:
    - Powered on and the resource bridge has network connectivity to the host running the VM.
    - Running a [supported operating system](/azure/azure-arc/servers/prerequisites#supported-operating-systems).
    - Able to connect through the firewall to communicate over the internet and [these URLs](/azure/azure-arc/servers/network-requirements?tabs=azure-cloud#urls) aren't blocked.

      >[!Note]
      > If you're using a Linux VM, the account must not prompt for login on sudo commands. To override the prompt, from a terminal, run `sudo visudo`, and `add <username> ALL=(ALL) NOPASSWD:ALL` at the end of the file. Ensure you replace `<username>`.<br> <br> If your VM template has these changes incorporated, you won't need to do this for the VM created from that template.

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