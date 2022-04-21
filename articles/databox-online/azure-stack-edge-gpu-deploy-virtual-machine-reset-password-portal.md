---
title: Reset the password on VMs for your Azure Stack Edge Pro GPU device via Azure portal
description: Describes how to reset the password on virtual machines (VMs) on an Azure Stack Edge Pro GPU device via Azure portal.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 04/21/2022
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how reset or change the password on virtual machines (VMs) on my Azure Stack Edge Pro GPU device via Azure portal.
---
# Reset VM password for your Azure Stack Edge Pro GPU device via Azure portal

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article covers steps to reset the password on both Windows and Linux VMs using Azure portal. To reset a password using PowerShell and Azure Resource Manager templates, see [Install the VM password reset extension](azure-stack-edge-gpu-deploy-virtual-machine-install-password-reset-extension.md).

## Reset Windows VM password

Use the following steps to reset the VM password for your Azure Stack Edge Pro GPU device:

1. From Azure portal VM list view, click the VM name with the password you would like to reset.

    ![Azure portal Windows VM list view](media/azure-stack-edge-gpu-deploy-virtual-machine-reset-password-portal/az-portal-vm-list-view-windows.png)

1. Click **Reset password**.

    ![Azure portal VM change password tab](media/azure-stack-edge-gpu-deploy-virtual-machine-reset-password-portal/my-windows-vm-change-password-tab.png)

1. Specify the username and the new password. Confirm the new password, and then click **Save**.

    For more information about Windows VM password requirements, see [Password requirements for a Windows VM](/azure/virtual-machines/windows/faq#what-are-the-password-requirements-when-creating-a-vm-). 

https://docs.microsoft.com/en-us/azure/virtual-machines/windows/faq#what-are-the-password-requirements-when-creating-a-vm-

    ![Azure portal VM change password control](media/azure-stack-edge-gpu-deploy-virtual-machine-reset-password-portal/my-windows-vm-specify-new-password.png)

1. While the operation is in progress, you can see status in the ribbon.

    ![Azure portal VM change password progress](media/azure-stack-edge-gpu-deploy-virtual-machine-reset-password-portal/my-windows-vm-change-password-progress.png)

    You can also click **Refresh** to update status of the operation.

1. When the operation is complete, you can see that the *windowsVMAccessExt* extension is installed for the VM.

    ![Azure portal VM change password confirmation](media/azure-stack-edge-gpu-deploy-virtual-machine-reset-password-portal/my-windows-vm-change-password-success.png)

1. Connect to the VM with the new password.

## Reset Linux VM password

Use the following steps to reset the VM password for your Azure Stack Edge Pro GPU device:

1. From Azure portal VM list view, click the VM name with the password you would like to reset.

    ![Azure portal Linux VM list view](media/azure-stack-edge-gpu-deploy-virtual-machine-reset-password-portal/az-portal-vm-list-view-linux.png)


## Next steps
Deploy VMs via Azure portal

Reset password extension via ARM and PowerShell
