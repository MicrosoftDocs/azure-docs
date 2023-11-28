---
title: Automatic instance repairs with Azure Virtual Machine Scale Sets
description: Learn how to configure automatic repairs policy for VM instances in a scale set
author: ju-shim
ms.author: jushiman
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.subservice: instance-protection
ms.date: 07/25/2023
ms.reviewer: mimckitt
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-linux
--- 

# Automatic instance repairs for Azure Virtual Machine Scale Sets

> [!IMPORTANT]
> The **Reimage** and **Restart** repair actions are currently in PREVIEW. 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. Some aspects of this feature may change prior to general availability (GA).


Enabling automatic instance repairs for Azure Virtual Machine Scale Sets helps achieve high availability for applications by maintaining a set of healthy instances. If an unhealthy instance is found by [Application Health extension](./virtual-machine-scale-sets-health-extension.md) or [Load balancer health probes](../load-balancer/load-balancer-custom-probe-overview.md), automatic instance repairs will attempt to recover the instance by triggering repair actions such as deleting the unhealthy instance and creating a new one to replace it, reimaging the unhealthy instance (Preview), or restarting the unhealthy instance (Preview).

## Requirements for using automatic instance repairs

**Enable application health monitoring for scale set**

The scale set should have application health monitoring for instances enabled. Health monitoring can be done using either [Application Health extension](./virtual-machine-scale-sets-health-extension.md) or [Load balancer health probes](../load-balancer/load-balancer-custom-probe-overview.md), where only one can be enabled at a time. The application health extension or the load balancer probes ping the application endpoint configured on virtual machine instances to determine the application health status. This health status is used by the scale set orchestrator to monitor instance health and perform repairs when required.

**Configure endpoint to provide health status**

Before enabling automatic instance repairs policy, ensure that your scale set instances have an application endpoint configured to emit the application health status. To configure health status on Application Health extension, you can use either [Binary Health States](./virtual-machine-scale-sets-health-extension.md#binary-health-states) or [Rich Health States](./virtual-machine-scale-sets-health-extension.md#rich-health-states). To configure health status using Load balancer health probes, see [probe up behavior](../load-balancer/load-balancer-custom-probe-overview.md).

For instances marked as "Unhealthy" or "Unknown" (*Unknown* state is only available with [Application Health extension - Rich Health States](./virtual-machine-scale-sets-health-extension.md#unknown-state)), automatic repairs are triggered by the scale set. Ensure the application endpoint is correctly configured before enabling the automatic repairs policy in order to avoid unintended instance repairs, while the endpoint is getting configured.

**API version**

Automatic repairs policy is supported for compute API version 2018-10-01 or higher.

The `repairAction` setting for Reimage (Preview) and Restart (Preview) is supported for compute API versions 2021-11-01 or higher. 

**Restrictions on resource or subscription moves**

Resource or subscription moves are currently not supported for scale sets when automatic repairs feature is enabled.

**Restriction for service fabric scale sets**

This feature is currently not supported for service fabric scale sets.

**Restriction for VMs with provisioning errors**

Automatic repairs currently do not support scenarios where a VM instance is marked *Unhealthy* due to a provisioning failure. VMs must be successfully initialized to enable health monitoring and automatic repair capabilities.

## How do automatic instance repairs work?

Automatic instance repair feature relies on health monitoring of individual instances in a scale set. VM instances in a scale set can be configured to emit application health status using either the [Application Health extension](./virtual-machine-scale-sets-health-extension.md) or [Load balancer health probes](../load-balancer/load-balancer-custom-probe-overview.md). If an instance is found to be unhealthy, the scale set will perform a preconfigured repair action on the unhealthy instance. Automatic instance repairs can be enabled in the Virtual Machine Scale Set model by using the `automaticRepairsPolicy` object. 

The automatic instance repairs process goes as follows:

1. [Application Health extension](./virtual-machine-scale-sets-health-extension.md) or [Load balancer health probes](../load-balancer/load-balancer-custom-probe-overview.md) ping the application endpoint inside each virtual machine in the scale set to get application health status for each instance.
2. If the endpoint responds with a status 200 (OK), then the instance is marked as "Healthy". In all the other cases (including if the endpoint is unreachable), the instance is marked "Unhealthy".
3. When an instance is found to be unhealthy, the scale set applies the configured repair action (default is *Replace*) to the unhealthy instance.
4. Instance repairs are performed in batches. At any given time, no more than 5% of the total instances in the scale set are repaired. If a scale set has fewer than 20 instances, the repairs are done for one unhealthy instance at a time.
5. The above process continues until all unhealthy instance in the scale set are repaired.

### Available repair actions

> [!CAUTION]
> The `repairAction` setting, is currently under PREVIEW and not suitable for production workloads. To preview the **Restart** and **Reimage** repair actions, you must register your Azure subscription with the AFEC flag `AutomaticRepairsWithConfigurableRepairActions` and your compute API version must be 2021-11-01 or higher. 
> For more information, see [set up preview features in Azure subscription](../azure-resource-manager/management/preview-features.md).

There are three available repair actions for automatic instance repairs – Replace, Reimage (Preview), and Restart (Preview). The default repair action is Replace, but you can switch to Reimage (Preview) or Restart (Preview) by enrolling in the preview and modifying the `repairAction` setting under `automaticRepairsPolicy` object.

- **Replace** deletes the unhealthy instance and creates a new instance to replace it. The latest Virtual Machine Scale Set model is used to create the new instance. This repair action is the default.

- **Reimage** applies the reimage operation to the unhealthy instance. 

- **Restart** applies the restart operation to the unhealthy instance.   

The following table compares the differences between all three repair actions: 

| Repair action | VM instance ID preserved? | Private IP preserved? | Managed data disk preserved? | Managed OS disk preserved? | Local (temporary) disk preserved? |
|--|--|--|--|--|--|
| Replace | No | No | No | No | No |
| Reimage | Yes | Yes | Yes | No | Yes |
| Restart | Yes | Yes | Yes | Yes | Yes |

For details on updating your repair action under automatic repairs policy, see the [configure a repair action on automatic repairs policy](#configure-a-repair-action-on-automatic-repairs-policy) section.

### Batching

The automatic instance repair operations are performed in batches. At any given time, no more than 5% of the instances in the scale set are repaired through the automatic repairs policy. This process helps avoid simultaneous deletion and re-creation of a large number of instances if found unhealthy at the same time.

### Grace period

When an instance goes through a state change operation because of a PUT, PATCH, or POST action performed on the scale set, then any repair action on that instance is performed only after the grace period ends. Grace period is the amount of time to allow the instance to return to healthy state. The grace period starts after the state change has completed, which helps avoid any premature or accidental repair operations. The grace period is honored for any newly created instance in the scale set, including the one created as a result of repair operation. Grace period is specified in minutes in ISO 8601 format and can be set using the property *automaticRepairsPolicy.gracePeriod*. Grace period can range between 10 minutes and 90 minutes, and has a default value of 30 minutes.

### Suspension of Repairs

Virtual Machine Scale Sets provide the capability to temporarily suspend automatic instance repairs if needed. The *serviceState* for automatic repairs under the property *orchestrationServices* in instance view of Virtual Machine Scale Set shows the current state of the automatic repairs. When a scale set is opted into automatic repairs, the value of parameter *serviceState* is set to *Running*. When the automatic repairs are suspended for a scale set, the parameter *serviceState* is set to *Suspended*. If *automaticRepairsPolicy* is defined on a scale set but the automatic repairs feature isn't enabled, then the parameter *serviceState* is set to *Not Running*.

If newly created instances for replacing the unhealthy ones in a scale set continue to remain unhealthy even after repeatedly performing repair operations, then as a safety measure the platform updates the *serviceState* for automatic repairs to *Suspended*. You can resume the automatic repairs again by setting the value of *serviceState* for automatic repairs to *Running*. Detailed instructions are provided in the section on [viewing and updating the service state of automatic repairs policy](#viewing-and-updating-the-service-state-of-automatic-instance-repairs-policy) for your scale set.

You can also set up Azure Alert Rules to monitor *serviceState* changes and get notified if automatic repairs becomes suspended on your scale set. For details, see [use azure alert rules to monitor changes in automatic instance repairs service state](./alert-rules-automatic-repairs-service-state.md).

## Instance protection and automatic repairs

If an instance in a scale set is protected by applying one of the [protection policies](./virtual-machine-scale-sets-instance-protection.md), then automatic repairs aren't performed on that instance. This behavior applies to both the protection policies: *Protect from scale-in* and *Protect from scale-set* actions.

## Terminate notification and automatic repairs

If the [terminate notification](./virtual-machine-scale-sets-terminate-notification.md) feature is enabled on a scale set, then during a *Replace* operation, the deletion of an unhealthy instance follows the terminate notification configuration. A terminate notification is sent through Azure metadata service – scheduled events – and instance deletion is delayed during the configured delay timeout. However, the creation of a new instance to replace the unhealthy one doesn't wait for the delay timeout to complete. 

## Enabling automatic repairs policy when creating a new scale set

For enabling automatic repairs policy while creating a new scale set, ensure that all the [requirements](#requirements-for-using-automatic-instance-repairs) for opting in to this feature are met. The application endpoint should be correctly configured for scale set instances to avoid triggering unintended repairs while the endpoint is getting configured. For newly created scale sets, any instance repairs are performed only after the grace period completes. To enable the automatic instance repair in a scale set, use *automaticRepairsPolicy* object in the Virtual Machine Scale Set model.

You can also use this [quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vmss-automatic-repairs-slb-health-probe) to deploy a Virtual Machine Scale Set. The scale set has a load balancer health probe and automatic instance repairs enabled with a grace period of 30 minutes.

### [Azure portal](#tab/portal-1)

The following steps enabling automatic repairs policy when creating a new scale set.

1. Go to **Virtual Machine Scale Sets**.
1. Select **+ Add** to create a new scale set.
1. Go to the **Health** tab.
1. Locate the **Health** section.
1. Enable the **Monitor application health** option.
1. Locate the **Automatic repair policy** section.
1. Turn **On** the **Automatic repairs** option.
1. In **Grace period (min)**, specify the grace period in minutes, allowed values are between 10 and 90 minutes.
1. When you're done creating the new scale set, select **Review + create** button.

### [REST API](#tab/rest-api-1)

The following example shows how to enable automatic instance repair in a scale set model. Use API version 2018-10-01 or higher.

```
PUT or PATCH on '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}?api-version=2019-07-01'
```

```json
{
  "properties": {
    "automaticRepairsPolicy": {
            "enabled": "true",
            "gracePeriod": "PT30M"
        }
    }
}
```

### [Azure PowerShell](#tab/powershell-1)

The automatic instance repair feature can be enabled while creating a new scale set by using the [New-AzVmssConfig](/powershell/module/az.compute/new-azvmssconfig) cmdlet. This sample script walks through the creation of a scale set and associated resources using the configuration file: [Create a complete Virtual Machine Scale Set](./scripts/powershell-sample-create-complete-scale-set.md). You can configure automatic instance repairs policy by adding the parameters *EnableAutomaticRepair* and *AutomaticRepairGracePeriod* to the configuration object for creating the scale set. The following example enables the feature with a grace period of 30 minutes.

```azurepowershell-interactive
New-AzVmssConfig `
 -Location "EastUS" `
 -SkuCapacity 2 `
 -SkuName "Standard_DS2" `
 -UpgradePolicyMode "Automatic" `
 -EnableAutomaticRepair $true `
 -AutomaticRepairGracePeriod "PT30M"
```

### [Azure CLI 2.0](#tab/cli-1)

The following example enables the automatic repairs policy while creating a new scale set using *[az vmss create](/cli/azure/vmss#az-vmss-create)*. First create a resource group, then create a new scale set with automatic repairs policy grace period set to 30 minutes.

```azurecli-interactive
az group create --name <myResourceGroup> --location <VMSSLocation>
az vmss create \
  --resource-group <myResourceGroup> \
  --name <myVMScaleSet> \
  --image RHELRaw8LVMGen2 \
  --admin-username <azureuser> \
  --generate-ssh-keys \
  --load-balancer <existingLoadBalancer> \
  --health-probe <existingHealthProbeUnderLoaderBalancer> \
  --automatic-repairs-grace-period 30
```

The above example uses an existing load balancer and health probe for monitoring application health status of instances. If you prefer using an application health extension for monitoring, you can do the following instead: create a scale set, configure the application health extension, and enable the automatic instance repairs policy. You can enable that policy by using the *az vmss update*, as explained in the next section.

---

## Enabling automatic repairs policy when updating an existing scale set

Before enabling automatic repairs policy in an existing scale set, ensure that all the [requirements](#requirements-for-using-automatic-instance-repairs) for opting in to this feature are met. The application endpoint should be correctly configured for scale set instances to avoid triggering unintended repairs while the endpoint is getting configured. To enable the automatic instance repair in a scale set, use *automaticRepairsPolicy* object in the Virtual Machine Scale Set model.

After updating the model of an existing scale set, ensure that the latest model is applied to all the instances of the scale. Refer to the instruction on [how to bring VMs up-to-date with the latest scale set model](./virtual-machine-scale-sets-upgrade-policy.md).

### [Azure portal](#tab/portal-2)

You can modify the automatic repairs policy of an existing scale set through the Azure portal.

> [!NOTE]
> Enable the [Application Health extension](./virtual-machine-scale-sets-health-extension.md) or [Load Balancer health probes](../load-balancer/load-balancer-custom-probe-overview.md) on your Virtual Machine Scale Sets before you start the next steps.

1. Go to an existing Virtual Machine Scale Set.0
1. Under **Settings** in the menu on the left, select **Health and repair**.
1. Enable the **Monitor application health** option.

If you're monitoring your scale set by using the Application Health extension:

1. Choose **Application Health extension** from the Application Health monitor dropdown list.
1. From the **Protocol** dropdown list, choose the network protocol used by your application to report health. Select the appropriate protocol based on your application requirements. Protocol options are **HTTP, HTTPS**, or **TCP**.
1. In the **Port number** configuration box, type the network port used to monitor application health.
1. For **Path**, provide the application endpoint path (for example, "/") used to report application health.

   > [!NOTE]
   > The Application Health extension will ping this path inside each virtual machine in the scale set to get application health status for each instance. If you're using [Binary Health States](./virtual-machine-scale-sets-health-extension.md#binary-health-states) and the endpoint responds with a status 200 (OK), then the instance is marked as "Healthy". In all the other cases (including if the endpoint is unreachable), the instance is marked "Unhealthy". For more health state options, explore [Rich Health States](./virtual-machine-scale-sets-health-extension.md#binary-versus-rich-health-states).

If you're monitoring your scale set using SLB Health probes:

- Choose **Load balancer probe** from the Application Health monitor dropdown list.- For the Load Balancer health probe, select an existing health probe or create a new health probe for monitoring.

To enable automatic repairs:

1. Locate the **Automatic repair policy** section.
1. Turn **On** the **Automatic repairs** option.
1. In **Grace period (min)**, specify the grace period in minutes. Allowed values are between 10 and 90 minutes.
1. When you're done, select **Save**.

### [REST API](#tab/rest-api-2)

The following example enables the policy with grace period of 40 minutes. Use API version 2018-10-01 or higher.

```
PUT or PATCH on '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}?api-version=2019-07-01'
```

```json
{
  "properties": {
    "automaticRepairsPolicy": {
            "enabled": "true",
            "gracePeriod": "PT40M"
        }
    }
}
```

### [Azure PowerShell](#tab/powershell-2)

Use the [Update-AzVmss](/powershell/module/az.compute/update-azvmss) cmdlet to modify the configuration of automatic instance repair feature in an existing scale set. The following example updates the grace period to 40 minutes.

```azurepowershell-interactive
Update-AzVmss `
 -ResourceGroupName "myResourceGroup" `
 -VMScaleSetName "myScaleSet" `
 -EnableAutomaticRepair $true `
 -AutomaticRepairGracePeriod "PT40M"
```

### [Azure CLI 2.0](#tab/cli-2)

The following example demonstrates how to update the automatic instance repairs policy of an existing scale set, using *[az vmss update](/cli/azure/vmss#az-vmss-update)*.

```azurecli-interactive
az vmss update \
  --resource-group <myResourceGroup> \
  --name <myVMScaleSet> \
  --enable-automatic-repairs true \
  --automatic-repairs-grace-period 30
```

---

## Configure a repair action on automatic repairs policy

> [!CAUTION]
> The `repairAction` setting, is currently under PREVIEW and not suitable for production workloads. To preview the **Restart** and **Reimage** repair actions, you must register your Azure subscription with the AFEC flag `AutomaticRepairsWithConfigurableRepairActions` and your compute API version must be 2021-11-01 or higher. 
> For more information, see [set up preview features in Azure subscription](../azure-resource-manager/management/preview-features.md).

The `repairAction` setting under `automaticRepairsPolicy` allows you to specify the desired repair action performed in response to an unhealthy instance. If you are updating the repair action on an existing automatic repairs policy, you must first disable automatic repairs on the scale set and re-enable with the updated repair action. This process is illustrated in the examples below.  

### [REST API](#tab/rest-api-3)

This example demonstrates how to update the repair action on a scale set with an existing automatic repairs policy. Use API version 2021-11-01 or higher. 

**Disable the existing automatic repairs policy on your scale set** 
```
PUT or PATCH on '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}?api-version=2021-11-01' 
```

```json
{
  "properties": {
    "automaticRepairsPolicy": {
            "enabled": "false"
        }
    }
}
```

**Re-enable automatic repairs policy with the desired repair action**
```
PUT or PATCH on '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}?api-version=2021-11-01' 
```
```json
{
  "properties": {
    "automaticRepairsPolicy": {
            "enabled": "true", 
            "gracePeriod": "PT40M", 
            "repairAction": "Reimage"
        }
    }
}
```

### [Azure CLI](#tab/cli-3)

This example demonstrates how to update the repair action on a scale set with an existing automatic repairs policy, using *[az vmss update](/cli/azure/vmss#az-vmss-update)*.

**Disable the existing automatic repairs policy on your scale set**
```azurecli-interactive
az vmss update \ 
  --resource-group <myResourceGroup> \ 
  --name <myVMScaleSet> \ 
  --enable-automatic-repairs false
```

**Re-enable automatic repairs policy with the desired repair action** 
```azurecli-interactive
az vmss update \ 
  --resource-group <myResourceGroup> \ 
  --name <myVMScaleSet> \ 
  --enable-automatic-repairs true \ 
  --automatic-repairs-grace-period 30 \ 
  --automatic-repairs-action Replace 
```

### [Azure PowerShell](#tab/powershell-3)

This example demonstrates how to update the repair action on a scale set with an existing automatic repairs policy, using [Update-AzVmss](/powershell/module/az.compute/update-azvmss). Use PowerShell Version 7.3.6 or higher. 

**Disable the existing automatic repairs policy on your scale set**
```azurepowershell-interactive 
 -ResourceGroupName "myResourceGroup" ` 
 -VMScaleSetName "myScaleSet" ` 
 -EnableAutomaticRepair $false  
```

**Re-enable automatic repairs policy with the desired repair action** 
```azurepowershell-interactive
Update-AzVmss ` 
 -ResourceGroupName "myResourceGroup" ` 
 -VMScaleSetName "myScaleSet" ` 
 -EnableAutomaticRepair $true ` 
 -AutomaticRepairGracePeriod "PT40M" ` 
 -AutomaticRepairAction "Restart" 
```

---

## Viewing and updating the service state of automatic instance repairs policy

### [REST API](#tab/rest-api-4)

Use [Get Instance View](/rest/api/compute/virtualmachinescalesets/getinstanceview) with API version 2019-12-01 or higher for Virtual Machine Scale Set to view the *serviceState* for automatic repairs under the property *orchestrationServices*.

```http
GET '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/instanceView?api-version=2019-12-01'
```

```json
{
  "orchestrationServices": [
    {
      "serviceName": "AutomaticRepairs",
      "serviceState": "Running"
    }
  ]
}
```

Use [Set Orchestration Service State](/rest/api/compute/virtual-machine-scale-sets/set-orchestration-service-state) to suspend or resume the *serviceState* for automatic repairs.

```http
POST '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/instanceView?api-version=2023-07-01'

{
  "serviceName": "AutomaticRepairs",
  "action": "Suspend"
}
```

### [Azure CLI](#tab/cli-4)

Use [get-instance-view](/cli/azure/vmss#az-vmss-get-instance-view) cmdlet to view the *serviceState* for automatic instance repairs.

```azurecli-interactive
az vmss get-instance-view \
    --name MyScaleSet \
    --resource-group MyResourceGroup
```

Use [set-orchestration-service-state](/cli/azure/vmss#az-vmss-set-orchestration-service-state) cmdlet to update the *serviceState* for automatic instance repairs. Once the scale set is opted into the automatic repair feature, then you can use this cmdlet to suspend or resume automatic repairs for your scale set.

```azurecli-interactive
az vmss set-orchestration-service-state \
    --service-name AutomaticRepairs \
    --action Resume \
    --name MyScaleSet \
    --resource-group MyResourceGroup
```
### [Azure PowerShell](#tab/powershell-4)

Use [Get-AzVmss](/powershell/module/az.compute/get-azvmss) cmdlet with parameter *InstanceView* to view the *ServiceState* for automatic instance repairs.

```azurepowershell-interactive
Get-AzVmss `
    -ResourceGroupName "myResourceGroup" `
    -VMScaleSetName "myScaleSet" `
    -InstanceView
```

Use Set-AzVmssOrchestrationServiceState cmdlet to update the *serviceState* for automatic instance repairs. Once the scale set is opted into the automatic repair feature, you can use this cmdlet to suspend or resume automatic repairs for your scale set.

```azurepowershell-interactive
Set-AzVmssOrchestrationServiceState `
    -ResourceGroupName "myResourceGroup" `
    -VMScaleSetName "myScaleSet" `
    -ServiceName "AutomaticRepairs" `
    -Action "Suspend"
```

---

## Troubleshoot

**Failure to enable automatic repairs policy**

If you get a 'BadRequest' error with a message stating "Couldn't find member 'automaticRepairsPolicy' on object of type 'properties'", then check the API version used for Virtual Machine Scale Set. API version 2018-10-01 or higher is required for this feature.

**Instance not getting repaired even when policy is enabled**

The instance could be in grace period. This period is the amount of time to wait after any state change on the instance before performing repairs, which helps avoid any premature or accidental repairs. The repair action should happen once the grace period is completed for the instance.

**Viewing application health status for scale set instances**

You can use the [Get Instance View API](/rest/api/compute/virtualmachinescalesetvms/getinstanceview) for instances in a Virtual Machine Scale Set to view the application health status. With Azure PowerShell, you can use the cmdlet [Get-AzVmssVM](/powershell/module/az.compute/get-azvmssvm) with the *-InstanceView* flag. The application health status is provided under the property *vmHealth*.

In the Azure portal, you can see the health status as well. Go to an existing scale set, select **Instances** from the menu on the left, and look at the **Health state** column for the health status of each scale set instance.

## Next steps

Learn how to configure [Application Health extension](./virtual-machine-scale-sets-health-extension.md) or [Load balancer health probes](../load-balancer/load-balancer-custom-probe-overview.md) for your scale sets.
