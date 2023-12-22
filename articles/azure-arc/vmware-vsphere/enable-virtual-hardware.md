---
title:  Enable virtual hardware and VM CRUD capabilities in a machine with Arc agent installed
description: Enable virtual hardware and VM CRUD capabilities in a machine with Arc agent installed
ms.topic: how-to 
ms.date: 12/22/2023
ms.service: azure-arc
ms.subservice: azure-arc-vmware-vsphere
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri
ms.custom: 
---

# Enable virtual hardware and VM CRUD capabilities in a machine with Arc agent installed

In this article, you learn how to enable virtual hardware management and VM CRUD operational ability on a VMware VM that has Arc agents installed via the Arc-enabled Servers route.

>[!IMPORTANT]
> This article is applicable only if you have installed Arc agents directly in the VMware machines before onboarding to Azure Arc-enabled VMware vSphere by deploying resource bridge. 

## Prerequisites

- An Azure subscription and resource group where you have *Azure Arc VMware Administrator role*. 
- Your vCenter instance must be [onboarded](quick-start-connect-vcenter-to-arc-using-script.md) to Azure Arc.

## Enable virtual hardware management and self-service access to vCenter VMs with Arc agent installed

1.	Navigate to the Virtual machines inventory page of your vCenter in the Azure portal.
2.	The Virtual machines that have Arc agent installed via the Arc-enabled Servers route will have **Link to vCenter** status under virtual hardware management. 
3.	Select **Link to vCenter** to open a pane that will list all the machines under the vCenter with Arc agent installed but not linked to the vCenter in Azure Arc. 
4.	Choose all the machines and select the option to link machines to vCenter.
5.	After linking to vCenter, the virtual hardware status will reflect as **Enabled for all the VMs** and you can perform [virtual hardware operations](perform-vm-ops-through-azure.md). 

### Known issue
 
During the first scan of the vCenter inventory after onboarding to Azure Arc-enabled VMware vSphere, Arc-enabled Servers machines will be discovered under vCenter inventory. If the Arc-enabled Server machines didn't get discovered and you try to perform the **Enable in Azure** operation, you'll encounter the following error: 

```
A machine '/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXX/resourceGroups/rg-contoso/providers/Microsoft.HybridCompute/machines/testVM1' already exists with the specified virtual machine MoRefId: 'vm-4441'. The existing machine resource can be extended with private cloud capabilities by creating the VirtualMachineInstance resource under it.
```

When you encounter this error message, you'll be able to perform the **Link to vCenter** operation in 10 minutes. Alternatively, you can use the following Azure CLI command to link an existing Arc-enabled Server machine to vCenter:

```azurecli-interactive
az connectedvmware vm create --subscription XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXX --location eastus --resource-group rg-contoso --custom-location /providers/microsoft.extendedlocation/customlocations/contoso-cl --name contoso-hcrp-machine-name --inventory-item /subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXX/resourceGroups/contoso-rg/providers/Microsoft.ConnectedVMwarevSphere/VCenters/contoso-vcenter/InventoryItems/vm-142359
```

## Next steps

[Set up and manage self-service access to VMware resources through Azure RBAC](setup-and-manage-self-service-access.md).

