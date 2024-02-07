---
title: Install Arc agent at scale for your VMware VMs
description: Learn how to enable guest management at scale for Arc enabled VMware vSphere VMs. 
ms.topic: how-to
ms.date: 11/06/2023
ms.service: azure-arc
ms.subservice: azure-arc-vmware-vsphere
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri

#Customer intent: As an IT infra admin, I want to install arc agents to use Azure management services for VMware VMs.
---

# Install Arc agents at scale for your VMware VMs

In this article, you learn how to install Arc agents at scale for VMware VMs and use Azure management capabilities.

## Prerequisites

Ensure the following before you install Arc agents at scale for VMware VMs:

- The resource bridge must be in running state.
- The vCenter must be in connected state.
- The user account must have permissions listed in Azure Arc VMware Administrator role.
- All the target machines are:
    - Powered on and the resource bridge has network connectivity to the host running the VM.
    - Running a [supported operating system](../servers/prerequisites.md#supported-operating-systems).
    - Able to connect through the firewall to communicate over the internet, and [these URLs](../servers/network-requirements.md#urls) aren't blocked.

      > [!NOTE]
      > If you're using a Linux VM, the account must not prompt for login on sudo commands. To override the prompt, from a terminal, run `sudo visudo`, and add `<username> ALL=(ALL) NOPASSWD:ALL` at the end of the file. Ensure you replace `<username>`. <br> <br>If your VM template has these changes incorporated, you won't need to do this for the VM created from that template.

## Install Arc agents at scale from portal

An admin can install agents for multiple machines from the Azure portal if the machines share the same administrator credentials.

1. Navigate to **Azure Arc center** and select **vCenter resource**.

2. Select all the machines and choose **Enable in Azure** option. 

3. Select **Enable guest management** checkbox to install Arc agents on the selected machine.

4. If you want to connect the Arc agent via proxy, provide the proxy server details.

5. Provide the administrator username and password for the machine. 

> [!NOTE]
> For Windows VMs, the account must be part of local administrator group; and for Linux VM, it must be a root account.


## Next steps

[Set up and manage self-service access to VMware resources through Azure RBAC](setup-and-manage-self-service-access.md).
