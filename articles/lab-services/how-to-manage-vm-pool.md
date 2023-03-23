---
title: Manage a VM pool in Azure Lab Services
description: Learn how to manage a VM pool in Azure Lab Services
ms.topic: how-to
ms.date: 07/21/2022
ms.custom: devdivchpfy22
---

# Manage a VM pool in Lab Services

The **Virtual machine pool** page of a lab allows educators to set how many VMs are available for use and manage the state of those VMs.

- Start and stop all the VMs at once.
- Start and stop specific VMs.
- Reset a VM.
- Connect to a student's VM.
- Change the lab capacity.

VMs can be in one of a few states.

- **Unassigned**. These VMs aren't assigned to students yet. These VMs won't be started when a schedule runs.
- **Stopped**. VM is turned off and not available for use.
- **Starting**.  VM is starting.  It's not yet available for use.
- **Running**. VM is running and available for use.
- **Stopping**.  VM is stopping and not available for use.

> [!WARNING]
> Turning on a student VM will not affect the quota for the student. Make sure to stop all VMs manually or use a [schedule](how-to-create-schedules.md) to avoid unexpected costs.

## Manually starting VMs

You can start all VMs in a lab by selecting the **Start all** button at the top of the page.

:::image type="content" source="./media/how-to-set-virtual-machine-passwords/start-all-vms-button.png" alt-text="Screenshot that shows the Virtual machine pool page and the Start all button is highlighted.":::

Individual VMs can be started by clicking the state toggle.  The toggle will read **Starting** as the VM starts up, and then **Running** once the VM has started.  You can also select multiple VMs using the checks to the left of the **Name** column. Once the VMs are checked, select the **Start** button at the top of the screen.

## Manually stopping VMs

You can select the **Stop all** button to stop all of the VMs.

:::image type="content" source="./media/how-to-set-virtual-machine-passwords/stop-all-vms-button.png" alt-text="Screenshot that shows the Virtual machine pool page and the Stop all button is highlighted.":::

Individual VMs can be stopped by clicking the state toggle.  The toggle will read **Stopping** as the VM shuts down, and then **Stopped** once the VM has shutdown.  You can also select multiple VMs using the checks to the left of the **Name** column. Once the VMs are checked, select the **Stop** button at the top of the screen.

## Reset VMs

To reset one or more VMs, select them in the list, and then select **Reset** on the toolbar.

:::image type="content" source="./media/how-to-set-virtual-machine-passwords/reset-vm-button.png" alt-text="Screenshot of virtual machine pool.  Reset button is highlighted.":::

On the **Reset virtual machine(s)** dialog box, select **Reset**.

:::image type="content" source="./media/how-to-set-virtual-machine-passwords/reset-vms-dialog.png" alt-text="Screenshot of reset virtual machine confirmation dialog.":::

### Redeploy VMs

In the [April 2022 Update](lab-services-whats-new.md), redeploying VMs replaces the previous reset VM behavior.  In the Lab Services web portal: [https://labs.azure.com](https://labs.azure.com), the command is named **Troubleshoot** and is available in the student's view of their VMs. For more information and instructions on how students can redeploy their VMs, see: [Redeploy VMs](how-to-reset-and-redeploy-vm.md#redeploy-vms).

## Connect to VMs

Educators can connect to a student VM as long as it's turned on. Verify the student *isn't* connected to the VM first. By connecting to the VM, you can access local files on the VM and help students troubleshoot issues.

To connect to the student VM, hover the mouse on the VM in the list and select the **Connect** button.  For further instructions based on the operating system you're using, see [Connect to a lab VM](connect-virtual-machine.md).

## Set lab capacity

To change the lab capacity (number of VMs in the lab), select **Lab capacity** on the toolbar and update number of VMs on the **Lab capacity** window on the right.

:::image type="content" source="./media/how-to-manage-vm-pool/virtual-machine-pool-update-lab-capacity.png" alt-text="Screenshot of Lab capacity window.":::

If using [Teams](./how-to-manage-labs-within-teams.md#manage-a-lab-vm-pool-in-teams) or [Canvas](how-to-manage-vm-pool-within-canvas.md) integration, lab capacity will automatically be updated when Azure Lab Services syncs the user list.

## Export list of VMs

1. Switch to the **Virtual machine pool** tab.
2. Select **...** (ellipsis) on the toolbar and then select **Export CSV**.

    :::image type="content" source="./media/how-to-manage-vm-pool/virtual-machines-export-csv.png" alt-text="Screenshot of virtual machine pool page in Azure Lab Services.  The Export CSV menu item is highlighted.":::

## Next steps

See the following articles:

- [As a lab owner, set up and publish templates](how-to-create-manage-template.md)
- [As a lab owner, configure and control usage of a lab](how-to-configure-student-usage.md)
- [As a lab user, access labs](how-to-use-lab.md)
