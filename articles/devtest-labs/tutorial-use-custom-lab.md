---
title: Access a lab
description: In this tutorial, you access a lab in Azure DevTest Labs. You use a virtual machine, unclaim it, and then claim it.
ms.topic: tutorial
ms.date: 11/03/2021
ms.author: spelluru
---

# Tutorial: Access a lab in Azure DevTest Labs

In this tutorial, you use the lab that was created in the [Tutorial: Create a lab in Azure DevTest Labs](tutorial-create-custom-lab.md).

In this tutorial, you do the following actions:

> [!div class="checklist"]
> * Connect to the lab VM
> * Unclaim the lab VM
> * Claim the lab virtual machine (VM)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

A [lab in DevTest Labs with an Azure virtual machine](tutorial-create-custom-lab.md).

## Connect to the lab VM

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your lab in **DevTest Labs**.

1. Under **My virtual machines**, select your VM.

    :::image type="content" source="./media/tutorial-use-custom-lab/my-virtual-machines.png" alt-text="Screenshot of VM under My virtual machines.":::

1. From the top menu, select **Connect**. Then select the `.rdp` file that downloads to your machine.

    :::image type="content" source="./media/tutorial-use-custom-lab/vm-connect.png" alt-text="Screenshot of VM connect button.":::

1. On the **Remote Desktop Connection** dialog box, select **Connect**

1. On the **Enter your credentials** dialog box, enter the password, and then select **OK**.

1. If you receive a dialog box that states, **The identity of the remote computer cannot be verified**, select the check box for **Don't ask me again for connections to this computer**. Then select **Yes**.

    :::image type="content" source="./media/tutorial-use-custom-lab/remote-computer-verification.png" alt-text="Screenshot of remote computer verification.":::

For steps to connect to a Linux VM, see [Connect to a Linux VM in Azure](../virtual-machines/linux/use-remote-desktop.md). 

## Unclaim the lab VM

After you're done with the VM, unclaim the VM by following these steps: 

1. Select your VM from DevTest Labs using the same earlier steps.

1. On the **virtual machine** page, from the top menu, select **Unclaim**. 

    :::image type="content" source="./media/tutorial-use-custom-lab/virtual-machine-unclaim.png" alt-text="Screenshot of unclaim option.":::

1. The VM is shut down before it's unclaimed. You can monitor the status of this operation in **Notifications**.

1. Close the **virtual machine** page to be returned to the **DevTest Lab Overview** page.

1. Under **My Lab**, select **Claimable virtual machines**. The VM is now available to be claimed.

    :::image type="content" source="./media/tutorial-use-custom-lab/claimable-virtual-machines.png" alt-text="Screenshot of options under claimable virtual machines.":::

## Claim a lab VM

You can claim the VM again if you need to use it.

1. In the list of **Claimable virtual machines**, select **...** (ellipsis), and select **Claim machine**.

    :::image type="content" source="./media/tutorial-use-custom-lab/claimable-virtual-machines-claimed.png" alt-text="Screenshot of claim option.":::

1. Confirm that you see the VM in the list **My virtual machines**.

    :::image type="content" source="./media/tutorial-use-custom-lab/my-virtual-machines-2.png" alt-text="Screenshot showing vm returned to my virtual machines.":::

## Clean up resources

Delete resources to avoid charges for running the lab and VM on Azure. If you plan to go through the next tutorial to access the VM in the lab, you can clean up the resources after you finish that tutorial. Otherwise, follow these steps: 

1. Return to the home page for the lab you created.

1. From the top menu, select **Delete**.

   :::image type="content" source="./media/tutorial-use-custom-lab/portal-lab-delete.png" alt-text="Screenshot of lab delete button.":::

1. On the **Are you sure you want to delete it** page, enter the lab name in the text box and then select **Delete**.

1. During the deletion, you can select **Notifications** at the top of your screen to view progress. Deleting the lab takes a while. Continue to the next step once the lab is deleted.

1. If you created the lab in an existing resource group, then all of the lab resources have been removed. If you created a new resource group for this tutorial, it's now empty and can be deleted. It wouldn't have been possible to have deleted the resource group earlier while the lab was still in it.
    
## Next steps

In this tutorial, you learned how to access and use a lab in Azure DevTest Labs. For more information about accessing and using VMs in a lab, see:

> [!div class="nextstepaction"]
> [How to: Use VMs in a lab](devtest-lab-add-vm.md)
