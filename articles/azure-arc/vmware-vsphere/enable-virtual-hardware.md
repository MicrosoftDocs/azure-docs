---
title:  Enable virtual hardware and VM CRUD capabilities in a machine with Arc agent installed
description: Enable virtual hardware and VM CRUD capabilities in a machine with Arc agent installed
ms.topic: how-to 
ms.date: 01/03/2024
ms.service: azure-arc
ms.subservice: azure-arc-vmware-vsphere
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri
---

# Enable virtual hardware and VM CRUD capabilities in a machine with Arc agent installed

In this article, you learn how to enable virtual hardware management and VM CRUD operational ability on a VMware VM that has Arc agents installed via the Arc-enabled Servers route.

>[!IMPORTANT]
> This article is applicable only if you've installed Arc agents directly in VMware machines before onboarding to Azure Arc-enabled VMware vSphere by deploying Arc resource bridge. 

## Prerequisites

- An Azure subscription and resource group where you have *Azure Arc VMware Administrator role*. 
- Your vCenter instance must be [onboarded](quick-start-connect-vcenter-to-arc-using-script.md) to Azure Arc.

## Enable virtual hardware management and self-service access to vCenter VMs with Arc agent installed

1. From your browser, go to [Azure portal](https://portal.azure.com/).

1. Navigate to the Virtual machines inventory page of your vCenter. The virtual machines that have Arc agent installed via the Arc-enabled Servers route will have **Link to vCenter** status under virtual hardware management.

1. Select **Link to vCenter** to view the pane with the list of all the machines under vCenter with Arc agent installed but not linked to the vCenter in Azure Arc.

1. Choose all the machines that need to be enabled in Azure, and select **Link** to link the machines to vCenter.

1. After you link to vCenter, the virtual hardware status will reflect as **Enabled** for all the VMs, and you can perform [virtual hardware operations](perform-vm-ops-through-azure.md). 

### Known issue
 
During the first scan of the vCenter inventory after onboarding to Azure Arc-enabled VMware vSphere, Arc-enabled Servers machines will be discovered under vCenter inventory. If the Arc-enabled Server machines aren't discovered and you try to perform the **Enable in Azure** operation, you'll encounter the following error:<br>

*A machine '/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXX/resourceGroups/rg-contoso/providers/Microsoft.HybridCompute/machines/testVM1' already exists with the specified virtual machine MoRefId: 'vm-4441'. The existing machine resource can be extended with private cloud capabilities by creating the VirtualMachineInstance resource under it.*

When you encounter this error message, try performing the **Link to vCenter** operation again after a few minutes (5-10 minutes). Alternatively, you can use the following Azure CLI command to link an existing Arc-enabled Server machine to vCenter:<br>


```azurecli-interactive
az connectedvmware vm create --subscription <subscription-id> --location <Azure region of the machine> --resource-group <resource-group-name> --custom-location /providers/microsoft.extendedlocation/customlocations/<custom-location-name> --name <machine-name> --inventory-item /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ConnectedVMwarevSphere/VCenters/<vcenter-name>/InventoryItems/<machine-name>
```

## Next steps

[Set up and manage self-service access to VMware resources through Azure RBAC](setup-and-manage-self-service-access.md).

