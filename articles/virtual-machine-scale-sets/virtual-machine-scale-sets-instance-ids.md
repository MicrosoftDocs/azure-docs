---
title: Understand instance IDs for Azure virtual machine scale set VMs
description: Understand instance IDs for Azure virtual machine scale sets virtual machines and the various ways that they surface.
author: mimckitt
ms.author: mimckitt
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.subservice: management
ms.date: 02/22/2018
ms.reviewer: jushiman
ms.custom: mimckitt

---
# Understand names and instance IDs for Azure virtual machine scale set VMs


Each VM in a scale set gets a name and instance ID that uniquely identifies it. These are used in the scale set APIs to do operations on a specific VM in the scale set. This article describes instance IDs for scale sets and the various ways they surface.

## Scale set VM names

VMSS will generate a unique name for each VM in the scale set. The naming convention differs by orchestration mode:

* Flexible orchestration Mode: {scale-set-name}_{8-char-guid}
* VMSS Uniform orchestration mode: {scale-set-name}_{instance-id}

## Scale set instance ID for Flexible Orchestration Mode

For VMSS in Flexible Orchestration mode, the instance ID is simply the name of the virtual machine.

## Scale set instance ID for Uniform Orchestration Mode

For scale sets in Uniform orchestration mode, the instance id a decimal number. The instance IDs may be reused for new instances once old instances are deleted.

>[!NOTE]
> There is **no guarantee** on the way instance IDs are assigned to the VMs in the scale set. They might seem sequentially increasing at times, but this is not always the case. Do not take a dependency on the specific way in which instance IDs are assigned to the VMs.

You can get the list of instance IDs by listing all instances in a scale set:

REST API: `GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/virtualMachines?api-version={apiVersion}` (for more information, see the [REST API documentation](/rest/api/compute/virtualmachinescalesetvms/list))

PowerShell: `Get-AzVmssVM -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName}` (for more information, see the [PowerShell documentation](/powershell/module/az.compute/get-azvmssvm))

CLI: `az vmss list-instances -g {resourceGroupName} -n {vmScaleSetName}` (for more information, see the [CLI documentation](/cli/azure/vmss)).


You can specify a specific instance ID to reimage when using the reimage API:

REST API: `POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/virtualmachines/{instanceId}/reimage?api-version={apiVersion}` (for more information, see the [REST API documentation](/rest/api/compute/virtualmachinescalesetvms/reimage))

PowerShell: `Set-AzVmssVM -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName} -InstanceId {instanceId} -Reimage` (for more information, see the [PowerShell documentation](/powershell/module/az.compute/set-azvmssvm))

CLI: `az vmss reimage -g {resourceGroupName} -n {vmScaleSetName} --instance-id {instanceId}` (for more information, see the [CLI documentation](/cli/azure/vmss)).


## Instance Metadata VM name


If you query the [instance metadata](../virtual-machines/windows/instance-metadata-service.md) from within a scale set VM, you see a "name" in the output:

```output
{
  "compute": {
    "location": "westus",
    "name": "nsgvmss_85",
    .
    .
    .
```



## Scale set VM computer name

Each VM in a scale set also gets a computer name assigned to it. This computer name is the hostname of the VM in the [Azure-provided DNS name resolution within the virtual network](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md). The computer name naming convention differs by orchestration mode:

* Flexible orchestration mode: {computer-name-prefix}{6-char-guid}
* Uniform orchestraiton mode: {computer-name-prefix}{base-36-instance-id}

The computer name prefix is a property of the scale set model that you can set, so it can be different from the scale set name itself. The scale set VM computer name can also be changed from inside the guest OS once the VM has been created.
