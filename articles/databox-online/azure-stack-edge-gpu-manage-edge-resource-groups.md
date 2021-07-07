---
title: Manage Edge resource groups on your Azure Stack Edge Pro GPU device
description: Learn how to manage Edge resource groups on your Azure Stack Edge Pro GPU, Azure Stack Edge Pro R, and Azure Stack Edge Mini R device via the Azure portal.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 07/07/2021
ms.author: alkohli
# Customer intent: As an IT admin, I need a quick way to get rid of resource groups no longer in use that were created for VMs on my Azure Stack Edge Pro GPU devices.
---

# Manage Edge resource groups on Azure Stack Edge Pro GPU devices

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

After you activate an Azure Stack Edge Pro GPU device, you can manage the local (Edge) resource groups in the Azure portal. 

Edge resource groups contain resources for VM creation and deployment from creating and deploying virtual machines on your device. The default Edge resource group, ASERG, contains the default local network interface, ASENET.

The **Resources** pane is available in the portal after you activate your device.

## View Edge resource groups in portal

To view the Edge resource groups on your Azure Stack Edge Pro GPU device in the Azure portal, do these steps.

1. Go to **Virtual machines** on your device, and go to the **Resources** pane. Select **Edge resource groups**.

    ![Screenshot showing Edge resource groups for virtual machines deployed on an Azure Stack Edge device.-1](media/azure-stack-edge-gpu-manage-edge-resource-groups/edge-resource-groups-01.png)

You can also use [Get-AzResource](/powershell/module/az.resources/get-azresource?view=azps-6.1.0&preserve-view=true) in [Azure Az Powershell](/powershell/azure/new-azureps-module-az?view=azps-6.1.0&preserve-view=true) to list Edge resource groups. Get-AzResource by default returns all local resource groups for the current subscription.

The following is example output from Get-AzResource.

```output
PS C:\WINDOWS\system32> Get-AzResource
   
Name              : aseimagestorageaccount
ResourceGroupName : ase-image-resourcegroup
ResourceType      : Microsoft.Storage/storageaccounts
Location          : dbelocal
ResourceId        : /subscriptions/.../resourceGroups/ase-image-resourcegroup/providers/Microsoft.Storage/storageac
                        counts/aseimagestorageaccount
Tags              :
    
Name              : myaselinuxvmimage1
ResourceGroupName : ASERG
ResourceType      : Microsoft.Compute/images
Location          : dbelocal
ResourceId        : /subscriptions/.../resourceGroups/ASERG/providers/Microsoft.Compute/images/myaselinuxvmimage1
Tags              :
    
Name              : ASEVNET
ResourceGroupName : ASERG
ResourceType      : Microsoft.Network/virtualNetworks
Location          : dbelocal
ResourceId        : /subscriptions/.../resourceGroups/ASERG/providers/Microsoft.Network/virtualNetworks/ASEVNET
Tags              :
    
PS C:\WINDOWS\system32>  
```

## Delete an Edge resource group

Follow these steps to delete an Edge resource group that's no longer in use.

> [!NOTE]
> - A resource group must be empty to be deleted. 
> - The resource group ASERG, which is created XXXXX, can't be deleted.

1. Go to **Virtual machines** on your device, and go to the **Resources** pane. Select **Edge resource groups**.

    ![Screenshot showing Edge resource groups for virtual machines deployed on an Azure Stack Edge device.-2](media/azure-stack-edge-gpu-manage-edge-resource-groups/edge-resource-groups-01.png)

1. Select the resource group that you want to delete. In the far right of the resource group, select the delete icon (trashcan).

   The delete icon is only displayed when a resource group doesn't contain any resources.

    ![Screenshot showing an Edge resource group with the delete icon selected.](media/azure-stack-edge-gpu-manage-edge-resource-groups/edge-resource-groups-02.png)

    When the resource group deletion is complete, the resource group is removed from the list.

## Next steps

- To learn how to administer your Azure Stack Edge Pro GPU device, see [Use local web UI to administer an Azure Stack Edge Pro GPU](azure-stack-edge-manage-access-power-connectivity-mode.md).

- [Connect to Azure Resource Manager on your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-connect-resource-manager.md).