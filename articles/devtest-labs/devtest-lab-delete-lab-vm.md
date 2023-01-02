---
title: Delete a lab virtual machine or a lab
description: Learn how to delete a virtual machine from a lab or delete a lab in Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/14/2022
---

# Delete labs or lab VMs in Azure DevTest Labs

This article shows you how to delete a virtual machine (VM) from a lab or delete a lab in Azure DevTest Labs.

## Delete a VM from a lab

When you create a VM in a lab, DevTest Labs automatically creates resources for the VM, like a disk, network interface, and public IP address, in a separate resource group. Deleting the VM deletes most of the resources created at VM creation, including the VM, network interface, and disk. However, deleting the VM doesn't delete:

- Any resources you manually created in the VM's resource group.
- The VM's key vault in the lab's resource group.
- Any availability set, load balancer, or public IP address in the VM's resource group. These resources are shared by multiple VMs in a resource group.

To delete a VM from a lab:

1. On the lab's **Overview** page in the Azure portal, find the VM you want to delete in the list under **My virtual machines**.

1. Either:

   - Select **More options** (**...**) next to the VM listing, and select **Delete** from the context menu.
     ![Screenshot of Delete selected on the V M's context menu on the lab Overview page.](media/devtest-lab-delete-lab-vm/delete-vm-menu-in-list.png)

   or

   - Select the VM name in the list, and then on the VM's **Overview** page, select **Delete** from the top menu.
     ![Screenshot of the Delete button on the V M Overview page.](media/devtest-lab-delete-lab-vm/delete-from-vm-page.png) 

1. On the **Are you sure you want to delete it?** page, select **Delete**.

   ![Screenshot of the V M deletion confirmation page.](media/devtest-lab-delete-lab-vm/select-lab.png) 

1. To check deletion status, select the **Notifications** icon on the Azure menu bar. 

## Delete a lab

When you delete a lab from a resource group, DevTest Labs automatically deletes:

- All VMs in the lab.
- All resource groups associated with those VMs.
- All resources that DevTest Labs automatically created during lab creation.

DevTest Labs doesn't delete the lab's resource group itself, and doesn't delete any resources you manually created in the lab's resource group.

> [!NOTE]
> If you want to manually delete the lab's resource group, you must delete the lab first. You can't delete a resource group that has a lab in it.

To delete a lab:

1. On the lab's **Overview** page in the Azure portal, select **Delete** from the top toolbar.

   ![Screenshot of the Delete button on the lab Overview page.](media/devtest-lab-delete-lab-vm/delete-button.png)

1. On the **Are you sure you want to delete it?** page, under **Type the lab name**, type the lab name, and then select **Delete**.

   ![Screenshot of the lab deletion confirmation page.](media/devtest-lab-delete-lab-vm/confirm-delete.png) 

1. To check deletion status, select the **Notifications** icon on the Azure menu bar. 

   ![Screenshot of the Notifications icon on the Azure menu bar.](media/devtest-lab-delete-lab-vm/delete-status.png)

## Next steps

- [Attach and detach data disks for lab VMs](devtest-lab-attach-detach-data-disk.md)
- [Export or delete personal data](personal-data-delete-export.md)
- [Move a lab to another region](how-to-move-labs.md)

