---
title: Connect to lab VMs via Azure Bastion
description: Learn how to connect to Azure DevTest Labs virtual machines (VMs) through an internet browser if Azure Bastion is enabled for the lab.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 12/04/2025
ms.custom:
  - UpdateFrequency2
  - sfi-image-nochange

#customer intent: As a lab user, I want to connect to Bastion-enabled lab VMs through my browser, so I can connect securely without using public IP addresses or exposing RDP or SSH ports to the internet.
---

# Connect to lab VMs via Azure Bastion

This article describes how to connect to your DevTest Labs virtual machine (VM) by using [Azure Bastion](/azure/bastion/index). Bastion provides secure remote desktop protocol (RDP) or secure shell (SSH) access without using public IP addresses or exposing RDP or SSH ports to the internet.

## Prerequisites

- A running VM in a lab that has a Bastion-configured virtual network and Bastion connections enabled. For more information, see [Enable browser connection to DevTest Labs VMs with Azure Bastion](enable-browser-connection-lab-virtual-machines.md).
- Ownership access to the VM and at least **DevTest Labs User** role in the lab.

## Connect to a lab VM via Bastion

1. In the [Azure portal](https://portal.azure.com), search for and select **DevTest Labs**.
1. On the **DevTest Labs** page, select your lab.
1. On the lab's **Overview** page, select the VM you want to connect to from **My virtual machines**.
1. On the VM's **Overview** page, from the top menu, select **Connect** > **Connect via Bastion**.
1. In the **Connect via Bastion** pane, enter the username and password for the VM, and select whether you want the VM to open in a new browser window.
1. Select **Connect**.

:::image type="content" source="./media/connect-virtual-machine-through-browser/lab-vm-browser-connect.png" alt-text="Screenshot of the VM Overview screen with the Bastion connect button highlighted.":::

> [!NOTE]
> If you don't see **Connect via Bastion** on the VM's top menu, the lab isn't set up for Azure Bastion. You can select **Connect** to connect via [RDP](connect-windows-virtual-machine.md) or [SSH](connect-linux-virtual-machine.md).

## Related content

- [Access, claim, and connect to a DevTest Labs VM](tutorial-use-custom-lab.md)
- [Enable browser connection to DevTest Labs VMs with Azure Bastion](enable-browser-connection-lab-virtual-machines.md)
