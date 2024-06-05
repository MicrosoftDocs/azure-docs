---
title: Stop and resize lab VMs
description: Learn how to change the size of a virtual machine (VM) in Azure DevTest Labs based on changing needs for CPU, network, or disk performance.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.custom: UpdateFrequency2
ms.date: 09/30/2023
---

# Resize a lab VM in Azure DevTest Labs

Azure DevTest Labs supports changing the size of a lab virtual machine (VM), based on changing needs for CPU, network, or disk performance. This article describes how to resize a lab VM.

> [!NOTE]
> The resize feature complies with lab policy for [allowed VM sizes](devtest-lab-set-lab-policy.md#set-allowed-virtual-machine-sizes). You can resize a VM only to sizes that lab policy allows.

## Stop the VM

To avoid losing work, disconnect from and stop the VM before resizing it.

1. If you're connected to the VM through secure shell (SSH) or remote desktop session (RDP), save your work and disconnect from the VM.

1. In the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040), on your lab's **Overview** page, select the VM you want to resize from the list under **My virtual machines**.

   :::image type="content" source="./media/devtest-lab-resize-vm/overview-page.png" alt-text="Screenshot that shows a V M selected on a lab's Overview page.":::

1. On the VM's **Overview** page, select **Stop** on the toolbar. 

   :::image type="content" source="./media/devtest-lab-resize-vm/stop-vm.png" alt-text="Screenshot that shows selecting Stop on the Overview page for a V M.":::

Once the VM stops, or if the VM is already stopped, **Stop** is grayed out.

## Resize the VM

1. On the VM's **Overview** page, select **Size** under **Settings** in the left navigation.

   :::image type="content" source="./media/devtest-lab-resize-vm/size-menu.png" alt-text="Screenshot that shows selecting Size in the V M's left navigation.":::

1. On the **Select a VM size** screen, select a new size for your VM, and then select **Select**.

   :::image type="content" source="./media/devtest-lab-resize-vm/select-size.png" alt-text="Screenshot that shows selecting a V M size.":::

   You can check the status of the resize operation in the **Notifications** window.

   :::image type="content" source="./media/devtest-lab-resize-vm/resize-status.png" alt-text="Screenshot of the Notifications window that shows resizing status.":::

1. When the resize finishes, start the VM by selecting **Start** from the VM's **Overview** page toolbar.

## Next steps

For more information about the resize feature for Azure VMs, see [Resize virtual machines](https://azure.microsoft.com/blog/resize-virtual-machines/).
