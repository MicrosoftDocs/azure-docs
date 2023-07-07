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

The lab virtual machine pool represents the set of lab virtual machines (VMs) that are available for lab users to connect to. The lab VM creation starts when you publish a lab template, or when you update the lab capacity. Learn how to change the capacity of the lab and modify the number of lab virtual machines, or manage the state of individual lab VMs.

When you synchronize the lab user list with an Azure AD group, or create a lab in Teams or Canvas, Azure Lab Services manages the lab VM pool automatically based on membership.

When you manage a lab VM pool, you can:

- Start and stop all or selected lab VMs.
- Reset a VM
- Connect to a lab user's VM.
- Change the lab capacity.

Lab VMs can be in one of a few states.

- **Unassigned**. The lab VM is not assigned to a lab user yet. The lab VM doesn't automatically start with the lab schedule.
- **Stopped**. The lab VM is turned off and not available for use.
- **Starting**.  The lab VM is starting.  It's not yet available for use.
- **Running**. The lab VM is running and is available for use.
- **Stopping**.  The lab VM is stopping and not available for use.

> [!WARNING]
> When you start a lab VM, it doesn't affect the available [quota hours](./classroom-labs-concepts.md#quota) for the lab user. Make sure to stop all lab VMs manually or use a [schedule](how-to-create-schedules.md) to avoid unexpected costs.

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Create and manage labs](./includes/lab-services-prerequisite-create-lab.md)]
[!INCLUDE [Existing lab plan](./includes/lab-services-prerequisite-lab-plan.md)]

## Change lab capacity

When you synchronize the lab user list with an Azure AD group, or create a lab in Teams or Canvas, Azure Lab Services manages the lab VM pool automatically based on membership. When you add or remove a user, the lab capacity increases or decreases accordingly. Lab users are also automatically registered and assigned to their lab VM.

If you manage the lab user list manually, you can modify the lab capacity to modify the number of lab VMs that are available for lab users.

1. Go to the **Virtual machine pool** page for the lab.

1. Select **Lab capacity** on the toolbar

1. In the **Lab capacity** window, update the number of lab VMs.

    :::image type="content" source="./media/how-to-manage-vm-pool/virtual-machine-pool-update-lab-capacity.png" alt-text="Screenshot of Lab capacity window.":::

## Manually start lab VMs

To manually start all lab VMs:

1. Go to the **Virtual machine pool** page for the lab.

1. Select the **Start all** button at the top of the page.

    :::image type="content" source="./media/how-to-set-virtual-machine-passwords/start-all-vms-button.png" alt-text="Screenshot that shows the Virtual machine pool page and the Start all button is highlighted.":::

To start individual lab VMs:

1. Go to the **Virtual machine pool** page for the lab.

1. In the list of lab VMs, select the state toggle control for individual lab VMs.

    The toggle text changes to **Starting** as the VM starts up, and then **Running** once the VM has started.

1. Alternately, select multiple VMs using the checks to the left of the **Name** column, and then select the **Start** button at the top of the page.

## Manually stop lab VMs

To manually stop all lab VMs:

1. Go to the **Virtual machine pool** page for the lab.

1. Select the **Stop all** button to stop all of the lab VMs.

    :::image type="content" source="./media/how-to-set-virtual-machine-passwords/stop-all-vms-button.png" alt-text="Screenshot that shows the Virtual machine pool page and the Stop all button is highlighted.":::

To start individual lab VMs:

1. Go to the **Virtual machine pool** page for the lab.

1. In the list of lab VMs, select the state toggle control for individual lab VMs.

    The toggle text changes to **Stopping** as the VM starts up, and then **Stopped** once the VM has shut down.

1. Alternately, select multiple VMs using the checks to the left of the **Name** column, and then select the **Stop** button at the top of the page.

## Reset lab VMs

When you reset a lab VM, Azure Lab Services shuts down the lab VM, deletes it, and recreates a new lab VM from the original template VM. You can think of a reset as a refresh of the entire lab VM.

> [!CAUTION]
> After you reset a lab VM, all the data that's saved on the OS disk (usually the C: drive on Windows), and the temporary disk (usually the D: drive on Windows), is lost. Learn how to [store the user data outside the lab VM](/azure/lab-services/troubleshoot-access-lab-vm#store-user-data-outside-the-lab-vm).

To reset one or more lab VMs:

1. Go to the **Virtual machine pool** page for the lab.

1. Select **Reset** in the toolbar.

    :::image type="content" source="./media/how-to-set-virtual-machine-passwords/reset-vm-button.png" alt-text="Screenshot of virtual machine pool.  Reset button is highlighted.":::

1. On the **Reset virtual machine(s)** dialog box, select **Reset**.

    :::image type="content" source="./media/how-to-set-virtual-machine-passwords/reset-vms-dialog.png" alt-text="Screenshot of reset virtual machine confirmation dialog.":::

### Redeploy lab VMs

When you use [lab plans](./lab-services-whats-new.md), lab users can now redeploy their lab VM. This operation is labeled **Troubleshoot** in Azure Lab Services. When you redeploy a lab VM, Azure Lab Services will shut down the VM, move the VM to a new node within the Azure infrastructure, and then power it back on.

Learn how [lab users can redeploy their lab VM](./how-to-reset-and-redeploy-vm.md#redeploy-vms).

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
