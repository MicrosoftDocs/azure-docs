---
title:  Enable additional capabilities on Arc-enabled Server machines by linking to vCenter
description: Enable additional capabilities on Arc-enabled Server machines by linking to vCenter.
ms.topic: how-to 
ms.date: 03/13/2024
ms.service: azure-arc
ms.subservice: azure-arc-vmware-vsphere
ms.custom: devx-track-azurecli
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri
---

# Enable additional capabilities on Arc-enabled Server machines by linking to vCenter

If you have VMware machines connected to Azure via Arc-enabled Servers route, you can seamlessly get additional capabilities by deploying resource bridge and connecting vCenter to Azure. The additional capabilities include the ability to perform virtual machine lifecycle operations, such as create, resize, and power cycle operations such as start, stop, and so on. You can get additional capabilities without any disruption, retaining the VM extensions configured on the Arc-enabled Server machines.   

Follow these steps [here](./quick-start-connect-vcenter-to-arc-using-script.md) to deploy the Arc Resource Bridge and connect vCenter to Azure.

>[!IMPORTANT]
> This article applies only if you've directly installed Arc agents on the VMware machines, and those machines are onboarded as *Microsoft.HybridCompute/machines* ARM resources before connecting vCenter to Azure by deploying Resource Bridge. 

## Prerequisites

- An Azure subscription and resource group where you have *Azure Arc VMware Administrator role*. 
- Your vCenter instance must be [onboarded](quick-start-connect-vcenter-to-arc-using-script.md) to Azure Arc.
- Arc-enabled Servers machines and vCenter resource must be in the same Azure region.

## Link Arc-enabled Servers machines to vCenter from Azure portal

1. Navigate to the Virtual machines inventory page of your vCenter in the Azure portal. 

2. The Virtual machines that have Arc agent installed via Arc-enabled Servers route have **Link to vCenter** status under virtual hardware management.  

3. Select **Link to vCenter** to open a pane that lists all the machines under vCenter with Arc agent installed but not linked to vCenter in Azure Arc.  

4. Choose all the machines and select the option to link machines to vCenter.

    :::image type="content" source="media/enable-virtual-hardware/link-machine-to-vcenter.png" alt-text="Screenshot that shows the Link to vCenter page." lightbox="media/enable-virtual-hardware/link-machine-to-vcenter.png":::

5.	After linking to vCenter, the virtual hardware status reflects as **Enabled** for all the VMs, and you can perform [virtual hardware operations](./perform-vm-ops-through-azure.md). 

    :::image type="content" source="media/enable-virtual-hardware/perform-virtual-hardware-operations.png" alt-text="Screenshot that shows the page for performing virtual hardware operations." lightbox="media/enable-virtual-hardware/perform-virtual-hardware-operations.png":::

    After linking to vCenter, virtual lifecycle operations and power cycle operations are enabled on the machines, and the kind property of Hybrid Compute Machine is updated as VMware.

## Link Arc-enabled Server machines to vCenter using Azure CLI

Use the following az commands to link Arc-enabled Server machines to vCenter at scale.  

**Create VMware resources from the specified Arc for Server machines in the vCenter** 

```azurecli-interactive
az connectedvmware vm create-from-machines --resource-group contoso-rg --name contoso-vm --vcenter-id /subscriptions/fedcba98-7654-3210-0123-456789abcdef/resourceGroups/contoso-rg-2/providers/Microsoft.HybridCompute/vcenters/contoso-vcenter
```

**Create VMware resources from all Arc for Server machines in the specified resource group belonging to that vCenter**

```azurecli-interactive
az connectedvmware vm create-from-machines --resource-group contoso-rg --vcenter-id /subscriptions/fedcba98-7654-3210-0123-456789abcdef/resourceGroups/contoso-rg-2/providers/Microsoft.HybridCompute/vcenters/contoso-vcenter
```

**Create VMware resources from all Arc for Server machines in the specified subscription belonging to that vCenter**

```azurecli-interactive
az connectedvmware vm create-from-machines --subscription contoso-sub --vcenter-id /subscriptions/fedcba98-7654-3210-0123-456789abcdef/resourceGroups/contoso-rg-2/providers/Microsoft.HybridCompute/vcenters/contoso-vcenter
```

### Required Parameters 

**--vcenter-id -v**

ARM ID of the vCenter to which the machines will be linked. 

### Optional Parameters 

**--ids**

One or more resource IDs (space-delimited). It must be a complete resource ID containing all the information of *Resource Id* arguments. You must provide either *--ids* or other *Resource Id* arguments. 

**--name -n**

Name of the Microsoft.HybridCompute Machine resource. Provide this parameter if you want to convert a single machine to a VMware VM. 

**--resource-group -g**

Name of the resource group that will be scanned for HCRP machines. 

>[!NOTE]
>The default group configured using `az configure --defaults group=` is not used, and it must be specified explicitly.

**--subscription**

Name or ID of subscription. You can configure the default subscription using `az account set -s NAME_OR_ID`. 

#### Known issue
 
During the first scan of the vCenter inventory after onboarding to Azure Arc-enabled VMware vSphere, Arc-enabled Servers machines will be discovered under vCenter inventory. If the Arc-enabled Server machines aren't discovered and you try to perform the **Enable in Azure** operation, you'll encounter the following error:<br>

*A machine '/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXX/resourceGroups/rg-contoso/providers/Microsoft.HybridCompute/machines/testVM1' already exists with the specified virtual machine MoRefId: 'vm-4441'. The existing machine resource can be extended with private cloud capabilities by creating the VirtualMachineInstance resource under it.*

When you encounter this error message, you'll be able to perform the **Link to vCenter** operation in 10 minutes. Alternatively, you can use any of the Azure CLI commands listed above to link an existing Arc-enabled Server machine to vCenter.

## Next steps

[Set up and manage self-service access to VMware resources through Azure RBAC](setup-and-manage-self-service-access.md).
