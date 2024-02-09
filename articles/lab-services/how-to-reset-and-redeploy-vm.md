---
title: Troubleshoot a lab VM
description: Learn how you can troubleshoot your lab VM in Azure Lab Services by redeploying the VM to another hardware node, or by reimaging the lab VM to its initial state.
services: lab-services
ms.service: lab-services
ms.topic: how-to
author: ntrogh
ms.author: nicktrog
ms.date: 09/28/2023
---
<!-- As a student, I want to be able to troubleshoot connectivity problems with my VM so that I can get back up and running quickly, without having to escalate an issue -->

# Troubleshoot a lab VM with redeploy or reimage

In this article, you learn how to troubleshoot problems with connecting to your lab virtual machine (VM) in Azure Lab Services. As a lab user, you can perform troubleshooting operations on the lab VM, without support from the lab creator or an administrator.

You can perform the following troubleshooting operations on the lab VM:

- **Redeploy a lab VM**: Azure Lab Services moves the VM to a new node in the Azure infrastructure, and then powers it back on. All data on the OS disk is still available after a redeploy operation.

- **Reimage a lab VM**:  Azure Lab Services recreates a new lab VM from the original template. All data in the lab VM is lost.

## Redeploy a lab VM

When you redeploy a lab VM, Azure Lab Services shuts down the lab VM, moves the lab VM to a new node in the Azure infrastructure, and then powers it back on. You can think of a redeploy operation as a refresh of the underlying VM for your lab.

All data that you saved in the [OS disk](/azure/virtual-machines/managed-disks-overview#os-disk) (usually the C: drive on Windows) of the VM is still available after the redeploy operation. Any data on the [temporary disk](/azure/virtual-machines/managed-disks-overview#temporary-disk) (usually the D: drive on Windows) is lost after a redeploy operation.

You can redeploy a lab VM that is assigned to you. If you have the Lab Assistant, or Lab Contributor role, you can redeploy any lab VM for which you have permissions.

To redeploy a lab VM that's assigned to you:

1. Go to the [Azure Lab Services website](https://labs.azure.com/virtualmachines) to view your virtual machines.

1. For a specific lab VM, select **...** > **Redeploy**.

    :::image type="content" source="./media/how-to-reset-and-redeploy-vm/redeploy-single-vm.png" alt-text="Screenshot that shows the Redeploy virtual machine menu option in the Lab Services web portal.":::

1. On the **Redeploy virtual machine** dialog box, select **Redeploy** to start the redeployment.

    :::image type="content" source="./media/how-to-reset-and-redeploy-vm/redeploy-single-vm-confirmation.png" alt-text="Screenshot that shows the confirmation dialog for redeploying a single VM in the Lab Services web portal.":::

Alternatively, if you have permissions across multiple labs, you can redeploy multiple VMs for a lab:

1. Go to the [Azure Lab Services website](https://labs.azure.com).

1. Select a lab, and then go to the **Virtual machine pool** tab.

1. Select one or multiple VMs from the list, and then select **Redeploy** in the toolbar.

    :::image type="content" source="./media/how-to-reset-and-redeploy-vm/redeploy-vm-button.png" alt-text="Screenshot that shows the virtual machine pool in the Lab Services web portal, highlighting the Redeploy button.":::

1. On the **Redeploy virtual machine** dialog box, select **Redeploy** to start the redeployment.


You can also redeploy a lab VM by using the [REST api](/rest/api/labservices/virtual-machines/redeploy), [PowerShell](/powershell/module/az.labservices/start-azlabservicesvmredeployment), or the [.NET SDK](/dotnet/api/azure.resourcemanager.labservices.labvirtualmachineresource.redeploy).

## Reimage a lab VM

When you reimage a lab VM, Azure Lab Services shuts down the lab VM, deletes it, and recreates a new lab VM from the original lab template. You can think of a reimage operation as a refresh of the entire VM.

You can reimage a lab VM that is assigned to you. If you have the Lab Assistant, or Lab Contributor role, you can reimage any lab VM for which you have permissions.

> [!WARNING]
> After you reimage a lab VM, all the data that you saved on the OS disk (usually the C: drive on Windows), and the temporary disk (usually the D: drive on Windows), is lost. Learn how you can [store the user data outside the lab VM](./troubleshoot-access-lab-vm.md#store-user-data-outside-the-lab-vm).

To reimage a lab VM that's assigned to you:

1. Go to the [Azure Lab Services website](https://labs.azure.com/virtualmachines) to view your virtual machines.

1. For a specific lab VM, select **...** > **Reimage**.

    :::image type="content" source="./media/how-to-reset-and-redeploy-vm/reset-single-vm.png" alt-text="Screenshot that shows how to reimage a lab VM in the Lab Services web portal, highlighting the Reimage button.":::

1. On the **Reimage virtual machine** dialog box, select **Reimage**.

    :::image type="content" source="./media/how-to-reset-and-redeploy-vm/reset-single-vm-confirmation.png" alt-text="Screenshot that shows the confirmation dialog for reimaging a single VM in the Lab Services web portal.":::

Alternatively, if you have permissions across multiple labs, you can reimage multiple VMs for a lab:

1. Go to the [Azure Lab Services website](https://labs.azure.com).

1. Select a lab, and then go to the **Virtual machine pool** tab.

1. Select one or multiple VMs from the list, and then select **Reimage** in the toolbar.

    :::image type="content" source="./media/how-to-reset-and-redeploy-vm/reset-vm-button.png" alt-text="Screenshot that shows the virtual machine pool in the Lab Services web portal, highlighting the Reimage button.":::

1. On the **Reimage virtual machine** dialog box, and then select **Reimage**.

You can also reimage a lab VM by using the [REST api](/rest/api/labservices/virtual-machines/reimage), [PowerShell](/powershell/module/az.labservices/update-azlabservicesvmreimage), or the [.NET SDK](/dotnet/api/azure.resourcemanager.labservices.labvirtualmachineresource.reimage).

## Next steps

- Learn more about [strategies for troubleshooting lab VMs](./troubleshoot-access-lab-vm.md).
- As a student, learn to [access labs](how-to-use-lab.md).
- As a student, [connect to a VM](connect-virtual-machine.md).
