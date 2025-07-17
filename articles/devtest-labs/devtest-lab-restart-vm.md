---
title: Restart a VM in a Lab
description: Learn how to quickly and easily restart virtual machines (VM) in  Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 07/21/2025
ms.custom: UpdateFrequency2

#customer intent: As a lab admin, I want to restart a virtual machine in a lab in Azure DevTest Labs so that I can restart a virtual machine as part of a troubleshooting plan.
---

# Restart a VM in a lab in Azure DevTest Labs

You can quickly and easily restart a virtual machine in  DevTest Labs by following the steps in this article. Consider the following before restarting a VM:

- The VM must be running for the restart feature to be enabled.
- If you're connected to a running VM when you perform a restart, you need to reconnect to the VM after it starts back up.
- If an artifact is being applied when you restart the VM, you might receive a warning stating that the artifact might not be applied:

    :::image type="content" source="media/devtest-lab-restart-vm/devtest-lab-restart-vm-apply-artifacts.png" alt-text="Screenshot showing the warning that appears if you try to restart a VM while artifacts are being applied." lightbox="media/devtest-lab-restart-vm/devtest-lab-restart-vm-apply-artifacts.png":::

   > [!NOTE]
   > If a VM stalls while you're applying an artifact, restarting the VM might resolve the issue.

To restart a VM: 

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).
1. Go to the lab that includes the VM  you want to restart.
1. In the list of VMs, select a running VM.
1. At the top of the VM Overview page, select **Restart**:

    :::image type="content" source="media/devtest-lab-restart-vm/devtest-lab-restart-vm.png" alt-text="Screenshot of the Azure portal showing the VM Restart button." lightbox="media/devtest-lab-restart-vm/devtest-lab-restart-vm.png":::

1. Monitor the status of the restart by selecting the **Notifications** button in the top-right corner of the window:

    :::image type="content" source="media/devtest-lab-restart-vm/devtest-lab-restart-notification.png" alt-text="Screenshot showing the notification button and message." lightbox="media/devtest-lab-restart-vm/devtest-lab-restart-notification.png":::

You can also restart a running VM by selecting the associated ellipsis button (**...**) in the **My virtual machines** list:

:::image type="content" source="media/devtest-lab-restart-vm/devtest-lab-restart-ellipses.png" alt-text="Screenshot showing the VM Restart option in the ellipses menu." lightbox="media/devtest-lab-restart-vm/devtest-lab-restart-ellipses.png":::

After the VM restarts, you can reconnect to it by selecting **Connect** on the VM's Overview page.

## Related content

- [DevTest Labs Azure Resource Manager quickStart template gallery](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/QuickStartTemplates)
