---
title: Connect to enabled lab virtual machines through a browser
description: Learn how to connect to lab virtual machines (VMs) through a browser if browser connect is enabled for the lab and VMs.
ms.topic: how-to
ms.date: 03/08/2022
---

# Connect to DevTest Labs virtual machines through a browser

This article describes how to connect to DevTest Labs virtual machines (VMs) through a browser, if the lab and VM enable browser connect through [Azure Bastion](../bastion/index.yml). Azure Bastion provides secure remote desktop protocol (RDP) or secure shell (SSH) access to lab VMs without using public IP addresses or exposing the VMs' RDP or SSH ports to the internet.

You need access to a lab that has a [Bastion-configured virtual network](enable-browser-connection-lab-virtual-machines.md), and a lab VM that has [Browser connect enabled](enable-browser-connection-lab-virtual-machines.md#connect-to-lab-vms-through-azure-bastion).

1. In the [Azure portal](https://portal.azure.com), search for and select **DevTest Labs**.

1. On the **DevTest Labs** page, select your lab.

1. On the lab's **Overview** page, select the VM you want to connect to from the list under **My virtual machines**.

1. On the VM's **Overview** page, from the top menu, select **Browser connect**.

1. In the **Browser connect** pane, enter the username and password for the VM, and select whether you want the VM to open in a new browser window.

1. Select **Connect**.

   :::image type="content" source="./media/connect-virtual-machine-through-browser/lab-vm-browser-connect.png" alt-text="Screenshot of the V M Overview screen with the Browser connect button highlighted.":::

> [!NOTE]
> If you don't see **Browser connect** on the top menu, the lab or VM aren't set up for browser connect. For more information, see [Enable browser connection to DevTest Labs VMs with Azure Bastion](enable-browser-connection-lab-virtual-machines.md).

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]
