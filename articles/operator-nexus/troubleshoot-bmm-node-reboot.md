---
title: Troubleshoot VM problems after cordoning off and restarting bare-metal machines for Azure Operator Nexus
description: Learn what to do when you get VM errors on the Azure portal after you cordon off and restart bare-metal machines.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 06/13/2023
ms.author: v-sathysubra
author: Sathyadevi-S
---
# Troubleshoot VM problems after cordoning off and restarting bare-metal machines

Follow this troubleshooting guide after you cordon off and restart bare metal machine (BMMs) for Azure Operator Nexus if:

- You encounter virtual machines (VMs) with an error status on the Azure portal after an upgrade.
- Traditional methods such as powering off and restarting the VMs don't work.

## Prerequisites

- Install the latest version of the
  [appropriate Azure CLI extensions](./howto-install-cli-extensions.md).
- Familiarize yourself with the capabilities referenced in this article by reviewing the [BMM actions](howto-baremetal-functions.md).
- Gather the following information:
  - Subscription ID
  - Cluster name and resource group
  - Virtual machine name
- Make sure that the virtual machine has a provisioning state of **Succeeded** and a power state of **On**.

## Symptoms

- During BMM restart or upgrade testing, the VM is in an error state.
- After the restart, or after powering off and powering back on, the BMM is no longer cordoned off.
- Although the virtual network function (VNF) successfully came up, established its BGP sessions, and started routing traffic, the VM status in the portal consistently shows an error. Despite this discrepancy, the application remains healthy and continues to function properly.
- The portal actions and Azure CLI APIs for the NC VM resource itself are no longer achieving the intent. For example:
  - Selecting **Power Off** (or using the Azure CLI to power off)  doesn't actually power off the VM anymore.
  - Selecting **Restart** (or using the Azure CLI to restart) doesn't actually restart the VM anymore.
  - The platform has lost the ability to manage this VM resource.

:::image type="content" source="media\troubleshoot-bmm-server\bmm-error-status.png" alt-text="Screenshot of an example virtual machine in an error status." lightbox="media\troubleshoot-bmm-server\bmm-error-status.png":::

## Troubleshooting steps

1. Gather the VM details and validate the VM status in the portal. Ensure that the VM isn't connected and is powered off.  
1. Validate the status of the virtual machine before and after restart or upgrade.
1. Check the BGP session and traffic flow before and after restart or upgrade of the VNF.

For more troubleshooting, see [Troubleshoot Azure Operator Nexus server problems](troubleshoot-reboot-reimage-replace.md).

## Procedure

There's a problem with the status update on the VM after the upgrade.
Although the upgrade and the VM itself are fine, the status is being reported incorrectly, leading to actions being ignored.

Perform the following Azure CLI update on any affected VMs with dummy tag values (the use of `tag1` and `value1`):  

~~~bash
   az networkcloud virtualmachine update --ids <VMresourceId> --tags tag1=value1
~~~

This process restores the VM to an online state.

:::image type="content" source="media\troubleshoot-bmm-server\BMM-running-status.png" alt-text="Screenshot of an example virtual machine in a running status." lightbox="media\troubleshoot-bmm-server\BMM-running-status.png":::
