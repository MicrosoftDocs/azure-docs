---
title: Access, claim, and connect to lab VMs
description: Learn how to access, claim, unclaim, delete, and connect to DevTest Labs virtual machines (VMs).
ms.topic: tutorial
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/31/2025
ms.custom: UpdateFrequency2

#customer intent: As a lab user, I want to be able to claim ownership and connect to lab VMs, so I can use preconfigured VMs to do my work.
---

# Access, claim, and connect to a DevTest Labs VM

When you create a virtual machine (VM) in Azure DevTest Labs, you automatically own the VM. You can connect to the VM and see it listed in **My VMs** on the Azure portal lab page.

As a lab user, you can also claim ownership of existing claimable lab VMs. Once you claim a VM, you see it listed in **My VMs** and can connect to and manage it as your own VM.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Claim an available lab VM.
> * Connect to the VM.
> * Unclaim or delete the VM when no longer needed.

## Prerequisites

You need:

- At least [DevTest Labs User](/azure/role-based-access-control/built-in-roles#devtest-labs-user) access to a lab that has a claimable VM.
- The URL to access the lab in the Azure portal, and the username and password to access the VM.

## Claim a lab VM

To claim a lab VM, follow these steps. For more information about claiming VMs, see [Use claim capabilities in Azure DevTest Labs](devtest-lab-use-claim-capabilities.md).

1. Go to the URL for your lab in the Azure portal.
1. On the lab **Overview** page, select **Claimable virtual machines** under **My Lab** in the left navigation.
1. On the **Claimable virtual machines** page, select the ellipsis **...**  next to the listing for an available VM, and select **Claim machine**.

   :::image type="content" source="./media/tutorial-use-custom-lab/claimable-virtual-machines-claimed.png" alt-text="Screenshot showing Claim machine in the context menu.":::

   The VM is claimed and started. You can select the **Notifications** icon at the top of the portal to see progress.

1. When the process finishes, return to the lab **Overview** page and confirm that you now see the VM listed under **My virtual machines**.

   :::image type="content" source="./media/tutorial-use-custom-lab/my-virtual-machines-2.png" alt-text="Screenshot showing the claimed VM in the My virtual machines list.":::

## Connect to a lab VM

To connect to a VM, it must be running. An unclaimed VM is stopped. When you claim the VM, it starts automatically. To connect to the VM, make sure the VM **Status** is still **Running**, or select **Start** at the top of the VM's page to start it.

1. On the lab **Overview** page, select the VM from the list under **My virtual machines**.
1. On the VM's **Overview** page, select **Connect** from the top menu.

   :::image type="content" source="./media/tutorial-use-custom-lab/my-virtual-machines.png" alt-text="Screenshot of selecting Connect in the top menu of the VM.":::
   
1. If available, select **Connect via Bastion** from the context menu. In the **Connect via Bastion** pane, enter the VM username and password, select whether to open the VM in a new window, and then select **Connect**.

   :::image type="content" source="./media/tutorial-use-custom-lab/vm-connect.png" alt-text="Screenshot of selecting Connect via Bastion and connecting through Bastion.":::

1. If **Connect via Bastion** isn't available:
   - For a Windows VM, select **Connect via RDP**, and follow the instructions at [Connect to a Windows VM in your lab](connect-windows-virtual-machine.md).
   - For a Linux VM, select **Connect via Azure CLI** or **Connect via Native SSH**, and follow the instructions at [Connect to a Linux VM in your lab](connect-linux-virtual-machine.md).

Once you connect to the VM, you can use it to do your work. You have [Owner](/azure/role-based-access-control/built-in-roles/privileged#owner) role on all lab VMs you claim or create, unless you unclaim them.

## Unclaim a lab VM

After you're done using the VM, you can unclaim it so someone else can claim it, by following these steps:

1. On the lab **Overview** page, select the VM from the list under **My virtual machines**.
1. On the VM's **Overview** page, select **Unclaim** from the top menu.

   :::image type="content" source="./media/tutorial-use-custom-lab/virtual-machine-unclaim.png" alt-text="Screenshot of Unclaim on the VM's Overview page.":::

   The VM is shut down and unclaimed. To claim or reclaim this VM, you can select **Claim machine** from the top menu.

   :::image type="content" source="./media/tutorial-use-custom-lab/remote-computer-verification.png" alt-text="Screenshot of Claim machine on the VM's Overview page.":::

1. Return to the lab **Overview** page and confirm that the VM no longer appears under **My virtual machines**.

1. Select **Claimable virtual machines** in the left navigation and confirm that the VM is now available to be claimed.

## Delete a lab VM

When you're done using a VM, you can delete it unless someone else claims it. To delete an individual lab VM, follow these steps:

1. Select the ellipsis **...** next to the VM in the **My virtual machines** list or on the **Claimable virtual machines** page, and select **Delete** from the context menu.
1. On the **Are you sure you want to delete it** page, select **Delete**.

The lab owner can also delete the entire lab when it's no longer needed, which deletes all lab VMs and resources.

## Related content

- [Create lab virtual machines in Azure DevTest Labs](devtest-lab-add-vm.md)
- [Tutorial: Set up a lab in Azure DevTest Labs](tutorial-create-custom-lab.md)
- [Add and configure lab users in Azure DevTest Labs](devtest-lab-add-devtest-user.md)
