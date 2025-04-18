---
title: Stop and resize lab VMs
description: Learn how to change the size of a virtual machine (VM) in Azure DevTest Labs based on changing needs for CPU, network, or disk performance.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.custom: UpdateFrequency2
ms.date: 04/02/2025

#customer intent: As a lab user, I want to be able to resize my lab VMs so that I can respond to changing needs for CPU, network, or disk performance.

---

# Resize a lab VM in Azure DevTest Labs

Azure DevTest Labs supports changing the size of a lab virtual machine (VM), based on changing needs for CPU, network, or disk performance. This article describes how to resize a lab VM.

## Prerequisites

- To resize a VM, you must be a lab administrator or an owner of the VM.
- If the lab sets an [allowed VM sizes](devtest-lab-set-lab-policy.md#set-allowed-virtual-machine-sizes) policy, you can resize the VM only to sizes that the policy permits.

## Stop the VM

To avoid losing work, stop the VM before you resize it. To stop a VM, disconnect from it, and select **Stop** on the top toolbar of the VM's **Overview** page in the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

:::image type="content" source="./media/devtest-lab-resize-vm/stop-vm.png" alt-text="Screenshot that shows selecting Stop on the Overview page for a VM.":::

## Resize the VM

1. On the VM's **Overview** page, select **Size** under **Settings** in the left navigation menu.

   :::image type="content" source="./media/devtest-lab-resize-vm/size-menu.png" alt-text="Screenshot that shows selecting Size in the VM's left navigation.":::

1. On the **Select a VM size** screen, select a new size for your VM, and then select **Select**.

   :::image type="content" source="./media/devtest-lab-resize-vm/select-size.png" alt-text="Screenshot that shows selecting a V M size.":::

You can check the status of the resize operation in the **Notifications** window.

:::image type="content" source="./media/devtest-lab-resize-vm/resize-status.png" alt-text="Screenshot of the Notifications window that shows resizing status.":::

>[!NOTE]
>If the resize operation fails with an error that **Resizing virtual machines with shared IP configuration is not supported**, you need to add and associate a Public IP address to the VM before you can resize it. For more information, see [Associate a public IP address to a virtual machine](/azure/virtual-network/ip-services/associate-public-ip-address-vm).

When the resize operation finishes, you can start the VM by selecting **Start** from the VM **Overview** page top toolbar, and then connect to the VM by selecting **Connect** in the toolbar.

## Related content

For more information about the resize feature for Azure VMs, see [Resize virtual machines](https://azure.microsoft.com/blog/resize-virtual-machines/).
