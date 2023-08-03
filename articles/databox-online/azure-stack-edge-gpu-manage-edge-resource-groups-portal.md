---
title: Manage Edge resource groups on your Azure Stack Edge Pro GPU device
description: Learn how to manage Edge resource groups on your Azure Stack Edge Pro GPU, Azure Stack Edge Pro R, and Azure Stack Edge Mini R device via the Azure portal.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 08/02/2021
ms.author: alkohli
# Customer intent: As an IT admin, I need a quick way to get rid of resource groups no longer in use that were created for VMs on my Azure Stack Edge Pro GPU devices.
---

# Manage Edge resource groups on Azure Stack Edge Pro GPU devices

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

Edge resource groups contain resources that are created on the device via the local Azure Resource Manager during virtual machine creation and deployment. These local resources can include virtual machines, VM images, disks, network interfaces, and other resource types such as Edge storage accounts.

This article describes how to view and delete Edge resource groups on an Azure Stack Edge Pro GPU device.

## View Edge resource groups

Follow these steps to view the Edge resource groups for the current subscription.

1. Go to **Virtual machines** on your device, and go to the **Resources** pane. Select **Edge resource groups**.

    ![Screenshot of the Resources view for virtual machines on an Azure Stack Edge device. The Edge Resource groups tab is shown and highlighted.](media/azure-stack-edge-gpu-manage-edge-resource-groups-portal/edge-resource-groups-01.png)

    > [!NOTE]
    > You can get the same listing by using [Get-AzResource](/powershell/module/az.resources/get-azresource) in Azure PowerShell after you set up the Azure Resource Manager environment on your device. For more information, see [Connect to Azure Resource Manager](azure-stack-edge-gpu-connect-resource-manager.md).


## Delete an Edge resource group

Follow these steps to delete an Edge resource group that's no longer in use.

> [!NOTE]
> - A resource group must be empty to be deleted. 
> - You can't delete the ASERG resource group. That resource group stores the ASEVNET virtual network, which is created automatically when you enable compute on your device.

1. Go to **Virtual machines** on your device, and go to the **Resources** pane. Select **Edge resource groups**.

    ![Screenshot showing Resources view for virtual machines on an Azure Stack Edge device. The Edge Resource groups tab is shown and highlighted.](media/azure-stack-edge-gpu-manage-edge-resource-groups-portal/edge-resource-groups-01.png)

1. Select the resource group that you want to delete. In the far right of the resource group, select the delete icon (trashcan).

   The delete icon is only displayed when a resource group doesn't contain any resources.

    ![Screenshot of Resources view, Edge resource groups tab, for VMs on an Azure Stack Edge device. A trashcan icon by a resource group indicates it can be deleted. The icon is highlighted.](media/azure-stack-edge-gpu-manage-edge-resource-groups-portal/edge-resource-groups-02.png)

1. You'll see a message asking you to confirm that you want to delete the Edge resource group. The operation can't be reversed. Select **Yes**.

    ![Screenshot of  the Edge resource groups tab  in Resources view for VMs. The highlighted trashcan icon indicates a resource group can be deleted.](./media/azure-stack-edge-gpu-manage-edge-resource-groups-portal/edge-resource-groups-03.png)

    When deletion is complete, the resource group is removed from the list.

## Next steps

- To learn how to administer your Azure Stack Edge Pro GPU device, see [Use local web UI to administer an Azure Stack Edge Pro GPU](azure-stack-edge-manage-access-power-connectivity-mode.md).

- [Set up the Azure Resource Manager environment on your device](azure-stack-edge-gpu-connect-resource-manager.md).