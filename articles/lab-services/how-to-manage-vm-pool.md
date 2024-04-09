---
title: Manage a lab VM pool
titleSuffix: Azure Lab Services
description: Learn how to manage a lab VM pool in Azure Lab Services and change the number of lab virtual machines that are available for lab users.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 07/04/2023
---

# Manage a lab virtual machine pool in Azure Lab Services

Learn how you can manage the pool of lab virtual machines (VMs) in Azure Lab Services. Change the capacity of the lab to add or remove lab VMs, connect to a lab, or manage the state of individual lab VMs.

The lab virtual machine pool represents the set of lab VMs that are available for lab users to connect to. The lab VM creation starts when you publish a lab template, or when you update the lab capacity.

When you synchronize the lab user list with a Microsoft Entra group, or create a lab in Teams or Canvas, Azure Lab Services manages the lab VM pool automatically based on membership.

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Create and manage labs](./includes/lab-services-prerequisite-create-lab.md)]
[!INCLUDE [Existing lab plan](./includes/lab-services-prerequisite-lab-plan.md)]

## Lab VM states

A lab VM can be in one of the following states:

- **Unassigned**. The lab VM is not assigned to a lab user yet. The lab VM doesn't automatically start with the lab schedule.
- **Stopped**. The lab VM is turned off and not available for use.
- **Starting**.  The lab VM is starting.  It's not yet available for use.
- **Running**. The lab VM is running and is available for use.
- **Stopping**.  The lab VM is stopping and not available for use.

## Change lab capacity

When you synchronize the lab user list with a Microsoft Entra group, or create a lab in Teams or Canvas, Azure Lab Services manages the lab VM pool automatically based on membership. When you add or remove a user, the lab capacity increases or decreases accordingly. Lab users are also automatically registered and assigned to their lab VM.

If you manage the lab user list manually, you can modify the lab capacity to modify the number of lab VMs that are available for lab users.

1. Go to the **Virtual machine pool** page for the lab.

1. Select **Lab capacity** on the toolbar

1. In the **Lab capacity** window, update the number of lab VMs.

    :::image type="content" source="./media/how-to-manage-vm-pool/virtual-machine-pool-update-lab-capacity.png" alt-text="Screenshot of Lab capacity window.":::

## Manually start lab VMs

To manually start all lab VMs:

1. Go to the **Virtual machine pool** page for the lab.

1. Select the **Start all** button at the top of the page.

    :::image type="content" source="./media/how-to-manage-vm-pool/start-all-vms-button.png" alt-text="Screenshot that shows the Virtual machine pool page and the Start all button is highlighted.":::

To start individual lab VMs:

1. Go to the **Virtual machine pool** page for the lab.

1. In the list of lab VMs, select the state toggle control for individual lab VMs.

    The toggle text changes to **Starting** as the VM starts up, and then **Running** once the VM has started.

1. Alternately, select multiple VMs using the checks to the left of the **Name** column, and then select the **Start** button at the top of the page.

> [!NOTE]
> When you start a lab VM *from the virtual machine pool page*, it doesn't affect the available [quota hours](./classroom-labs-concepts.md#quota) for the lab user. Make sure to stop all lab VMs manually or use a [schedule](how-to-create-schedules.md) to avoid unexpected costs.

## Manually stop lab VMs

To manually stop all lab VMs:

1. Go to the **Virtual machine pool** page for the lab.

1. Select the **Stop all** button to stop all of the lab VMs.

    :::image type="content" source="./media/how-to-manage-vm-pool/stop-all-vms-button.png" alt-text="Screenshot that shows the Virtual machine pool page and the Stop all button is highlighted.":::

To start individual lab VMs:

1. Go to the **Virtual machine pool** page for the lab.

1. In the list of lab VMs, select the state toggle control for individual lab VMs.

    The toggle text changes to **Stopping** as the VM starts up, and then **Stopped** once the VM has shut down.

1. Alternately, select multiple VMs using the checks to the left of the **Name** column, and then select the **Stop** button at the top of the page.

## Reimage lab VMs

When you reimage a lab VM, Azure Lab Services shuts down the lab VM, deletes it, and recreates a new lab VM from the original lab template. You can think of a reimage operation as a refresh of the entire VM.

> [!CAUTION]
> After you reimage a lab VM, all the data that you saved on the OS disk (usually the C: drive on Windows), and the temporary disk (usually the D: drive on Windows), is lost. Learn how you can [store the user data outside the lab VM](./troubleshoot-access-lab-vm.md#store-user-data-outside-the-lab-vm).

To reimage one or more lab VMs:

1. Go to the **Virtual machine pool** page for the lab.

1. Select one or multiple VMs from the list, and then select **Reimage** in the toolbar.

    :::image type="content" source="./media/how-to-manage-vm-pool/reset-vm-button.png" alt-text="Screenshot of virtual machine pool.  Reimage button is highlighted.":::

1. On the **Reimage virtual machine** dialog box, and then select **Reimage** to start the operation.

    After the reimage operation finishes, the lab VMs are recreated from the lab template, and assigned to the lab users.

## Redeploy lab VMs

When you redeploy a lab VM, Azure Lab Services shuts down the lab VM, moves the lab VM to a new node in the Azure infrastructure, and then powers it back on. You can think of a redeploy operation as a refresh of the underlying VM for your lab.

All data that you saved in the [OS disk](/azure/virtual-machines/managed-disks-overview#os-disk) (usually the C: drive on Windows) of the VM is still available after the redeploy operation. Any data on the [temporary disk](/azure/virtual-machines/managed-disks-overview#temporary-disk) (usually the D: drive on Windows) is lost after a redeploy operation.

To redeploy one or more lab VMs:

1. Go to the **Virtual machine pool** page for the lab.

1. Select one or multiple VMs from the list, and then select **Redeploy** in the toolbar.

    :::image type="content" source="./media/how-to-manage-vm-pool/redeploy-vm-button.png" alt-text="Screenshot that shows the virtual machine pool in the Lab Services web portal, highlighting the Redeploy button.":::

1. On the **Redeploy virtual machine** dialog box, select **Redeploy** to start the redeployment.

## Connect to lab VMs

You can connect to a lab user's VM, for example to access local files on the lab VM and help lab users troubleshoot issues. To connect to a lab VM, it must be running.

1. Go to the **Virtual machine pool** page for the lab.

1. Verify that the lab user is *not* connected to the lab VM. 

1. Hover over the lab VM in the list, and then select the **Connect** button.

    For further instructions based on the operating system you're using, see [Connect to a lab VM](connect-virtual-machine.md).

## Export the list of lab VMs

1. Go to the **Virtual machine pool** page for the lab.

1. Select **...** (ellipsis) on the toolbar, and then select **Export CSV**.

    :::image type="content" source="./media/how-to-manage-vm-pool/virtual-machines-export-csv.png" alt-text="Screenshot of virtual machine pool page in Azure Lab Services.  The Export CSV menu item is highlighted.":::

## Next steps

See the following articles:

- [As a lab owner, set up and publish templates](how-to-create-manage-template.md)
- [As a lab owner, configure and control usage of a lab](how-to-manage-lab-users.md)
- [As a lab user, access labs](how-to-use-lab.md)
