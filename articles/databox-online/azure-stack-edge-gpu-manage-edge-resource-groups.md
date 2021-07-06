---
title: Manage Edge resource groups on your Azure Stack Edge Pro GPU device
description: Learn how to manage Edge resource groups on your Azure Stack Edge Pro GPU, Azure Stack Edge Pro R, and Azure Stack Edge Mini R device via the Azure portal.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 07/06/2021
ms.author: alkohli
# Customer intent: As an IT admin, I need a quick way to get rid of resource groups no longer in use that were created for VMs on my Azure Stack Edge Pro GPU devices.
---

# Manage Edge resource groups on Azure Stack Edge Pro GPU devices

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

INTRO TK

## View Edge resource groups

To view the Edge resource groups on your Azure Stack Edge Pro GPU device, do these steps:

1. In the Azure portal, go to the Azure Stack Edge resource for your device. Go to **Virtual machines**, open **Resources**, and select **Edge resource groups**.<!--To get to Resources, the device must have been activated. First order of business Tue a.m.: Create and activate a device (maybe - delivery issue may be a barrier). Use screenshots from the demo to write the procedures.-->

    ![Screenshot showing Edge resource groups tab in Resources for a virtual machine in Azure Stack Edge.](media/azure-stack-edge-gpu-manage-edge-resource-groups/resources-01-edge-resource-groups.png)

## Delete a resource group

When a resource group is no longer in use, it's a good idea to delete it. To be deleted, a resource group must be empty.

To delete an Edge resource group, do these steps:

1. Open the Azure Stack Edge resource in the Azure portal. Choose **Resources**, and then ****Edge resource groups**.

   ![Screenshot showing Edge resource groups tab in Resources, with empty resource group and Delete icon identified.](media/azure-stack-edge-gpu-manage-edge-resource-groups/resources-01-edge-resource-groups.png)

1. Select the Delete button by the resource you want to delete.

   The Delete icon is displayed when a resource group doesn't contain any resources.

    ![Screenshot showing Edge resource groups for an Azure Stack Edge VM, with Delete button identified.](media/azure-stack-edge-gpu-manage-edge-resource-groups/resources-02-edge-resource-groups-ready-to-delete.png)

1. CONFIRMATION PROMPT? No screen needed. Just describe.

## Next steps

To learn how to administer your Azure Stack Edge Pro GPU device, see [Use local web UI to administer an Azure Stack Edge Pro GPU](azure-stack-edge-manage-access-power-connectivity-mode.md).