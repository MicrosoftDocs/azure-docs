---
title: Troubleshoot a VM in Azure Lab Services
description: Learn how to troubleshoot a VM in Azure Lab Services
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 01/21/2022
---
<!-- As a student, I want to be able to troubleshoot connectivity problems with my VM so that I can get back up and running quickly, without having to escalate an issue -->

# How to troubleshoot a VM
On rare occasions, you may have problems connecting with a VM in one of your labs. There are some troubleshooting steps you can take as a student to resolve connectivity issues and get back up and running quickly. You can avoid having to escalate the issue to your educator and wait for a solution.

## Reset VMs

To reset one or more VMs, select them in the list, and then select **Reset** on the toolbar.

:::image type="content" source="./media/how-to-reset-and-redeploy-vm/reset-vm-button.png" alt-text="Screenshot of virtual machine pool.  Reset button is highlighted.":::

On the **Reset virtual machine(s)** dialog box, select **Reset**.

:::image type="content" source="./media/how-to-reset-and-redeploy-vm/reset-vms-dialog.png" alt-text="Screenshot of reset virtual machine confirmation dialog.":::

### Redeploy VMs

In the [April 2022 Update](lab-services-whats-new.md), redeploying VMs replaces the previous reset VM behavior.  In the Lab Services web portal: [https://labs.azure.com](https://labs.azure.com), the command is named **Troubleshoot** and is available in the student's view of their VMs.

If you're facing difficulties accessing their VM, redeploying the VM may provide a resolution for the issue. Redeploying, unlike resetting, doesn't cause the data on the OS to be lost.  When you [redeploy a VM](/troubleshoot/azure/virtual-machines/redeploy-to-new-node-windows), Azure Lab Services will shut down the VM, move it to a new host, and restart it.  You can think of it as a refresh of the underlying VM for your machine.  You don’t need to re-register to the lab or perform any other action.  Any data you saved in the OS disk (usually C: drive) of the VM will still be available after the redeploy operation.  Anything saved on the temporary disk (usually D: drive) will be lost.

:::image type="content" source="./media/how-to-reset-and-redeploy-vm/redeploy-vms.png" alt-text="Screenshot of redeploy virtual machine menu option.":::

## Next steps

- As a student, learn to [access labs](how-to-use-lab.md).
- As a student, [connect to a VM](connect-virtual-machine.md).
