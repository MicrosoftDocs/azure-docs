---
title: Connect to lab virtual machines through Browser connect
description: Learn how to connect to lab virtual machines (VMs) through a browser if Browser connect is enabled for the lab.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: UpdateFrequency2
---

# Connect to DevTest Labs VMs through a browser with Azure Bastion

This article describes how to connect to DevTest Labs virtual machines (VMs) through a browser by using [Azure Bastion](../bastion/index.yml). Azure Bastion provides secure remote desktop protocol (RDP) or secure shell (SSH) access without using public IP addresses or exposing RDP or SSH ports to the internet.

> [!IMPORTANT]
> The VM's lab must be in a [Bastion-configured virtual network](enable-browser-connection-lab-virtual-machines.md#option-1-connect-a-lab-to-an-azure-bastion-enabled-virtual-network) and have [Browser connect enabled](enable-browser-connection-lab-virtual-machines.md#connect-to-lab-vms-through-azure-bastion). For more information, see [Enable browser connection to DevTest Labs VMs with Azure Bastion](enable-browser-connection-lab-virtual-machines.md).

To connect to a lab VM through a browser:

1. In the [Azure portal](https://portal.azure.com), search for and select **DevTest Labs**.

1. On the **DevTest Labs** page, select your lab.

1. On the lab's **Overview** page, select the VM you want to connect to from the list under **My virtual machines**.

1. On the VM's **Overview** page, from the top menu, select **Browser connect**.

1. In the **Browser connect** pane, enter the username and password for the VM, and select whether you want the VM to open in a new browser window.

1. Select **Connect**.

   :::image type="content" source="./media/connect-virtual-machine-through-browser/lab-vm-browser-connect.png" alt-text="Screenshot of the V M Overview screen with the Browser connect button highlighted.":::

> [!NOTE]
> If you don't see **Browser connect** on the VM's top menu, the lab isn't set up for Browser connect. You can select **Connect** to connect via [RDP](connect-windows-virtual-machine.md) or [SSH](connect-linux-virtual-machine.md).

