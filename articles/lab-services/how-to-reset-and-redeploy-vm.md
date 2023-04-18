---
title: Troubleshoot a VM in Azure Lab Services
description: Learn how to troubleshoot a VM in Azure Lab Services by redeploying or resetting the VM.
services: lab-services
ms.service: lab-services
ms.topic: how-to
author: ntrogh
ms.author: nicktrog
ms.date: 12/06/2022
---
<!-- As a student, I want to be able to troubleshoot connectivity problems with my VM so that I can get back up and running quickly, without having to escalate an issue -->

# Troubleshoot a lab by redeploying or resetting the VM

On rare occasions, you may have problems connecting to a VM in one of your labs. In this article, you learn how to redeploy or reset a lab VM in Azure Lab Services. You can use these troubleshooting steps to resolve connectivity issues for your assigned labs, without support from an educator or admin.

Learn more about [strategies for troubleshooting lab VMs](./troubleshoot-access-lab-vm.md).

## Reset VMs

When you reset a lab VM, Azure Lab Services will shut down the VM, delete it, and recreate a new lab VM from the original template VM. You can think of a reset as a refresh of the entire VM.

You can reset a lab VM that is assigned to you. If you have the Lab Assistant, Lab Contributor, or Lab Operator role, you can reset any lab VM for which you have permissions.

You can also reset a lab VM by using the [REST api](/rest/api/labservices/virtual-machines/reimage), [PowerShell](/powershell/module/az.labservices/update-azlabservicesvmreimage), or the [.NET SDK](/dotnet/api/azure.resourcemanager.labservices.labvirtualmachineresource.reimage).

> [!WARNING]
> After you reset a lab VM, all the data that you saved on the OS disk (usually the C: drive on Windows), and the temporary disk (usually the D: drive on Windows), is lost. Learn how you can [store the user data outside the lab VM](./troubleshoot-access-lab-vm.md#store-user-data-outside-the-lab-vm).

To reset a lab VM in the Azure Lab Services website that's assigned to you:

1. Go to the [Azure Lab Services website](https://labs.azure.com/virtualmachines) to view your virtual machines.

1. For a specific lab VM, select **...** > **Reset**.

    :::image type="content" source="./media/how-to-reset-and-redeploy-vm/reset-single-vm.png" alt-text="Screenshot that shows how to reset a lab VM in the Lab Services web portal, highlighting the Reset button.":::

1. On the **Reset virtual machine** dialog box, select **Reset**.

    :::image type="content" source="./media/how-to-reset-and-redeploy-vm/reset-single-vm-confirmation.png" alt-text="Screenshot that shows the confirmation dialog for resetting a single VM in the Lab Services web portal.":::

Alternatively, if you have permissions across multiple labs, you can reset multiple VMs for a lab:

1. Go to the [Azure Lab Services website](https://labs.azure.com).

1. Select a lab, and then go to the **Virtual machine pool** tab.

1. Select one or multiple VMs from the list, and then select **Reset** in the toolbar.

    :::image type="content" source="./media/how-to-reset-and-redeploy-vm/reset-vm-button.png" alt-text="Screenshot that shows the virtual machine pool in the Lab Services web portal, highlighting the Reset button.":::

1. On the **Reset virtual machine** dialog box, select **Reset**.

    :::image type="content" source="./media/how-to-reset-and-redeploy-vm/reset-vms-dialog.png" alt-text="Screenshot that shows the reset virtual machine confirmation dialog in the Lab Services web portal.":::

## Redeploy VMs

When you use lab plans, introduced in the [April 2022 Update](lab-services-whats-new.md), you can now also redeploy a lab VM. This operation is labeled  **Troubleshoot** in the Azure Lab Services website and is available in the student's view of their VMs.

When you redeploy a lab VM, Azure Lab Services will shut down the VM, move the VM to a new node in within the Azure infrastructure, and then power it back on. You can think of a redeploy operation as a refresh of the underlying VM for your lab. All data that you saved in the [OS disk](/azure/virtual-machines/managed-disks-overview#os-disk) (usually the C: drive on Windows) of the VM will still be available after the redeploy operation. Any data on the [temporary disk](/azure/virtual-machines/managed-disks-overview#temporary-disk) (usually the D: drive on Windows) is lost after a redeploy operation.

You can only redeploy a lab VM in the Azure Lab Services website that is assigned to you.

You can also redeploy a lab VM by using the [REST api](/rest/api/labservices/virtual-machines/redeploy), [PowerShell](/powershell/module/az.labservices/start-azlabservicesvmredeployment), or the [.NET SDK](/dotnet/api/azure.resourcemanager.labservices.labvirtualmachineresource.redeploy).

> [!WARNING]
> After you redeploy a VM, all the data that you saved on the [temporary disk](/azure/virtual-machines/managed-disks-overview#temporary-disk) (D: drive by default on Windows) is lost.

To redeploy a lab VM in the Azure Lab Services website:

1. Go to the [Azure Lab Services website](https://labs.azure.com/virtualmachines) to view your virtual machines.

1. For a specific lab VM, select **...** > **Troubleshoot**.

    :::image type="content" source="./media/how-to-reset-and-redeploy-vm/redeploy-vms.png" alt-text="Screenshot that shows the Redeploy virtual machine menu option in the Lab Services web portal.":::

1. On the **Troubleshoot virtual machine** dialog box, select **Redeploy**.

    :::image type="content" source="./media/how-to-reset-and-redeploy-vm/redeploy-single-vm-confirmation.png" alt-text="Screenshot that shows the confirmation dialog for redeploying a single VM in the Lab Services web portal.":::

## Next steps

- As a student, learn to [access labs](how-to-use-lab.md).
- As a student, [connect to a VM](connect-virtual-machine.md).
