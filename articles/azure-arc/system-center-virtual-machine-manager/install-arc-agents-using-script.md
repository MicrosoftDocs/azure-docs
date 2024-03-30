---
title: Install Arc agent using a script for SCVMM VMs
description: Learn how to enable guest management using a script for Arc enabled SCVMM VMs. 
ms.topic: how-to
ms.date: 12/01/2023
ms.service: azure-arc
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri
ms.subservice: azure-arc-scvmm

#Customer intent: As an IT infrastructure admin, I want to install arc agents to use Azure management services for SCVMM VMs.
---


# Install Arc agents using a script

In this article, you learn how to install Arc agents on Azure-enabled SCVMM VMs using a script.

## Prerequisites

Ensure the following before you install Arc agents using a script for SCVMM VMs:

- The resource bridge must be in a running state.
- The SCVMM management server must be in a connected state.
- The user account must have permissions listed in Azure Arc SCVMM Administrator role.
- The target machine:
     - Is powered on and the resource bridge has network connectivity to the host running the VM.
     - Is running a [supported operating system](/azure/azure-arc/servers/prerequisites#supported-operating-systems).
     - Is able to connect through the firewall to communicate over the Internet and [these URLs](/azure/azure-arc/servers/network-requirements?tabs=azure-cloud#urls) aren't blocked.
     - Has Azure CLI [installed](/cli/azure/install-azure-cli).
     - Has the Arc agent installation script downloaded from [here](https://download.microsoft.com/download/7/1/6/7164490e-6d8c-450c-8511-f8191f6ec110/arcscvmm-enable-guest-management.ps1) for a Windows VM or from [here](https://download.microsoft.com/download/0/9/b/09bd9ef4-a7af-49e5-ad5f-9e8f85fae75b/arcscvmm-enable-guest-management.sh) for a Linux VM.

>[!NOTE]
>- If you're using a Linux VM, the account must not prompt for login on sudo commands. To override the prompt, from a terminal, run `sudo visudo`, and `add <username> ALL=(ALL) NOPASSWD:ALL` at the end of the file. Ensure you replace `<username>`.
>- If your VM template has these changes incorporated, you won't need to do this for the VM created from that template.

## Steps to install Arc agents using a script

1. Sign in to the target VM as an administrator.
2. Run the Azure CLI with the `az` command from either Windows Command Prompt or PowerShell.
3. Sign in to your Azure account in Azure CLI using `az login --use-device-code`
4. Run the downloaded script *arcscvmm-enable-guest-management.ps1* or *arcscvmm-enable-guest-management.sh*, as applicable, using the following commands. The `vmmServerId` parameter should denote your VMM Server’s ARM ID.

    **For a Windows VM:**

    ```azurecli
    ./arcscvmm-enable-guest-management.ps1 -<vmmServerId> '/subscriptions/<subscriptionId>/resourceGroups/<rgName>/providers/Microsoft.ScVmm/vmmServers/<vmmServerName>
    ```

    **For a Linux VM:**

    ```azurecli
    ./arcscvmm-enable-guest-management.sh -<vmmServerId> '/subscriptions/<subscriptionId>/resourceGroups/<rgName>/providers/Microsoft.ScVmm/vmmServers/<vmmServerName>
    ```

## Next steps

[Manage VM extensions to use Azure management services for your SCVMM VMs](../servers/manage-vm-extensions.md).
