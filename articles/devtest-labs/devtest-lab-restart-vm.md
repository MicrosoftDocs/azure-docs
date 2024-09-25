---
title: Restart a VM in a lab
description: This article provides steps to quickly and easily restart virtual machines (VM) in  Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 04/18/2024
ms.custom: UpdateFrequency2

#customer intent: As a lab admin, I want to restart a virtual machine in a lab in Azure DevTest Labs so that I can restart a virtual machine as part of a troubleshooting plan.
---

# Restart a VM in a lab in Azure DevTest Labs

You can quickly and easily restart a virtual machine in  DevTest Labs by following the steps in this article. Consider the following before restarting a VM:

- The VM must be running for the restart feature to be enabled.
- If a user is connected to a running VM when they perform a restart, they must reconnect to the VM after it starts back up.
- If an artifact is being applied when you restart the VM, you receive a warning that the artifact might not be applied.

    :::image type="content" source="media/devtest-lab-restart-vm/devtest-lab-restart-vm-apply-artifacts.png" alt-text="Screenshot showing the restarting while applying artifacts warning." lightbox="media/devtest-lab-restart-vm/devtest-lab-restart-vm-apply-artifacts.png":::

   > [!NOTE]
   > If the VM has stalled while applying an artifact, you can use the restart VM feature as a potential way to resolve the issue.

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).
1. Select **All Services**, and then select **DevTest Labs** from the list.
1. From the list of labs, select the lab that includes the VM  you want to restart.
1. In the left panel, select **My Virtual Machines**.
1. From the list of VMs, select a running VM.
1. At the top of the VM management pane, select **Restart**.

    :::image type="content" source="media/devtest-lab-restart-vm/devtest-lab-restart-vm.png" alt-text="Screenshot of the Azure portal showing the Restart VM button." lightbox="media/devtest-lab-restart-vm/devtest-lab-restart-vm.png":::

1. Monitor the status of the restart by selecting the **Notifications** icon at the top right of the window.

    :::image type="content" source="media/devtest-lab-restart-vm/devtest-lab-restart-notification.png" alt-text="Screenshot of the Azure portal showing the notification icon and message." lightbox="media/devtest-lab-restart-vm/devtest-lab-restart-notification.png":::

You can also restart a running VM by selecting its ellipsis (...) in the list of **My Virtual Machines**.

:::image type="content" source="media/devtest-lab-restart-vm/devtest-lab-restart-ellipses.png" alt-text="Screenshot of the Azure portal showing the Restart VM option in the ellipses menu." lightbox="media/devtest-lab-restart-vm/devtest-lab-restart-ellipses.png":::


After the VM restarts, you can reconnect to it by selecting **Connect** on the VM management pane.

## Related content

- [DevTest Labs Azure Resource Manager quickStart template gallery](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/QuickStartTemplates)
