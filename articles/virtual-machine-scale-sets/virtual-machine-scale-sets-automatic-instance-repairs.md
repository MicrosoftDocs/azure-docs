---
title: Automatic instance repairs with Azure virtual machine scale sets
description: Learn how to configure automatic repairs policy for VM instances in a scale set
author: avirishuv
manager: vashan
tags: azure-resource-manager

ms.service: virtual-machine-scale-sets
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm
ms.topic: conceptual
ms.date: 02/28/2019
ms.author: avverma

---
# Preview: Automatic instance repairs for Azure virtual machine scale sets

Enabling automatic instance repairs for Azure virtual machine scale sets helps achieve high availability for applications by maintaining a set of healthy instances. If an instance in the scale set is found to be unhealthy as reported by [Application Health extension](./virtual-machine-scale-sets-health-extension.md) or [Load balancer health probes](../load-balancer/load-balancer-custom-probe-overview.md), then this feature automatically performs instance repair by deleting the unhealthy instance and creating a new one to replace it.

> [!NOTE]
> This preview feature is provided without a service level agreement, and it's not recommended for production workloads.

## Requirements for using automatic instance repairs

**Opt-in to the preview for automatic instance repairs**

Use either of the following ways to opt-in to the preview for automatic instance repairs. These steps will prepare your subscription for enabling the preview feature. 

REST API [Features - Register](./rest/api/resources/features/register) 

```
POST on '/subscriptions/{subscriptionId}/providers/Microsoft.Features/providers/{resourceProviderNamespace}/features/{featureName}/register?api-version=2015-12-01'
```

Azure PowerShell cmdlet [Register-AzureRmProviderFeature](./powershell/module/azurerm.resources/register-azurermproviderfeature)

```azurepowershell-interactive
Register-AzureRmProviderFeature `
 -ProviderNamespace Microsoft.Compute `
 -FeatureName RepairVMScaleSetInstancesPreview
```

Wait for a few minutes to ensure that the *RegistrationState* changes to *Registered* and then run the following cmdlet.

```azurepowershell-interactive
Register-AzureRmResourceProvider `
 -ProviderNamespace Microsoft.Compute
 ```

**Enable application health monitoring for scale set**

The scale set should have application health monitoring for instances enabled. This can be done using either [Application Health extension](./virtual-machine-scale-sets-health-extension.md) or [Load balancer health probes](../load-balancer/load-balancer-custom-probe-overview.md). Only one of these can be enabled at a time. The application health extension or the load balancer probes ping the application endpoint configured on virtual machine instances to determine the application health status. This health status is used by the scale set orchestrator to monitor instance health and perform repairs when required.

**Configure endpoint to provide health status**

Before enabling automatic instance repairs policy, ensure that the scale set instances have application endpoint configured to emit the application health status. When an instance returns status 200 (OK) on this application endpoint, then the instance is marked as “Healthy”. In all other cases, the instance is marked “Unhealthy”, including the following scenarios:

- When there is no application endpoint configured inside the virtual machine instances to provide application health status
- When the application endpoint is incorrectly configured
- When the application endpoint is not reachable

For instances marked as “Unhealthy”, automatic repairs are triggered by the scale set. Ensure the application endpoint is correctly configured before enabling the automatic repairs policy in order to avoid unintended instance repairs, while the endpoint is getting configured.

**Enable single placement group**

This preview is currently available only for scale sets deployed as single placement group. The property *singlePlacementGroup* should be set to *true* for your scale set to use automatic instance repairs feature. This feature is currently not supported for scale sets with multi placement group. Learn more about [placement groups](./virtual-machine-scale-sets-placement-groups.md#placement-groups).

**API version**

Automatic repairs policy is supported for compute API version 2018-10-01 or higher.

**Restrictions on resource or subscription moves**

As part of this preview, resource or subscription moves are currently not supported for scale sets when automatic repairs policy is enabled.

**Restriction for service fabric scale sets**

This preview feature is currently not supported for service fabric scale sets.

## How do automatic instance repairs work?

Automatic instance repair feature relies on health monitoring of individual instances in a scale set. VM instances in a scale set can be configured to emit application health status using either the [Application Health extension](./virtual-machine-scale-sets-health-extension.md) or [Load balancer health probes](../load-balancer/load-balancer-custom-probe-overview.md). If an instance is found to be unhealthy, then the scale set performs repair action by deleting the unhealthy instance and creating a new one to replace it. This feature can be enabled in the virtual machine scale set model by using the *automaticRepairsPolicy* object.

### Batching

The automatic instance repair operations are performed in batches. At any given time, no more than 5% of the instances in the scale set are repaired through the automatic repairs policy. This helps avoid simultaneous deletion and re-creation of a large number of instances if found unhealthy at the same time.

### Grace period

When an instance goes through a state change operation because of a PUT, PATCH or POST action performed on the scale set (for example reimage, redeploy, update, etc.), then any repair action on that instance is performed only after waiting for the grace period. Grace period is the amount of time to allow the instance to return to healthy state. The grace period starts after the state change has completed. This helps avoid any premature or accidental repair operations. The grace period is honored for any newly created instance in the scale set (including the one created as a result of repair operation). Grace period is specified in minutes in ISO 8601 format and can be set using the property *automaticRepairsPolicy.gracePeriod*. Grace period can range between 30 minutes and 90 minutes, and has a default value of 30 minutes.

The automatic instance repairs process works as follows:

1. [Application Health extension](./virtual-machine-scale-sets-health-extension.md) or [Load balancer health probes](../load-balancer/load-balancer-custom-probe-overview.md) ping the application endpoint inside each virtual machine in the scale set to get application health status for each instance.
2. If the endpoint responds with a status 200 (OK), then the instance is marked as “Healthy”. In all the other cases (including if the endpoint is unreachable), the instance is marked “Unhealthy”.
3. When an instance is found to be unhealthy, the scale set triggers a repair action by deleting the unhealthy instance and creating a new one to replace it.
4. Instance repairs are performed in batches. At any given time, no more than 5% of the total instances in the scale set are repaired. If a scale set has fewer than 20 instances, the repairs are done for one unhealthy instance at a time.
5. The above process continues until all unhealthy instance in the scale set are repaired.

## Instance protection and automatic repairs

If an instance in a scale set is protected by applying one of the [protection policies](./virtual-machine-scale-sets-instance-protection.md), then automatic repairs are not performed on that instance. This applies to both the protection policies: *Protect from scale-in* and *Protect from scale-set actions*.

## Terminate notification and automatic repairs

If the [terminate notification](./virtual-machine-scale-sets-terminate-notification.md) feature is enabled on a scale set, then during automatic repair operation, the deletion of unhealthy instance follow the properties configured under this feature. A terminate notification is sent through Azure metadata service – scheduled events – and instance deletion is delayed for the duration of the predefined delay timeout, as configured under the terminate notification feature. However, the creation of a new instance to replace the unhealthy one does not wait for the delay timeout to complete. 

## Enabling automatic repairs policy when creating a new scale set

For enabling automatic repairs policy while creating a new scale set, ensure that all the [requirements](#requirements-for-using-automatic-instance-repairs) for opting in to this feature are met. The application endpoint should be correctly configured for scale set instances to avoid triggering unintended repairs while the endpoint is getting configured. For newly created scale sets, any instance repairs are performed only after waiting for the duration of grace period. To enable the automatic instance repair in a scale set, use *automaticRepairsPolicy* object in the virtual machine scale set model.

### REST API

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

### Azure PowerShell

The automatic instance repair feature can be enabled while creating a new scale set by using the [New-AzVmssConfig](/powershell/module/az.compute/new-azvmssconfig) cmdlet. This sample script walks through the creation of a scale set and associated resources using the configuration file: [Create a complete virtual machine scale set](./scripts/powershell-sample-create-complete-scale-set.md). You can configure automatic instance repairs policy by adding the parameters *EnableAutomaticRepair* and *AutomaticRepairGracePeriod* to the configuration object for creating the scale set. The following example enables the feature with a grace period of 30 minutes.

```azurepowershell-interactive
New-AzVmssConfig `
 -Location "EastUS" `
 -SkuCapacity 2 `
 -SkuName "Standard_DS2" `
 -UpgradePolicyMode "Automatic" `
 -EnableAutomaticRepair $true `
 -AutomaticRepairGracePeriod "PT30M"
```

## Enabling automatic repairs policy when updating an existing scale set

Before enabling automatic repairs policy in an existing scale set, ensure that all the [requirements](#requirements-for-using-automatic-instance-repairs) for opting in to this feature are met. The application endpoint should be correctly configured for scale set instances to avoid triggering unintended repairs while the endpoint is getting configured. To enable the automatic instance repair in a scale set, use *automaticRepairsPolicy* object in the virtual machine scale set model.

### REST API

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

### Azure PowerShell

Use the [Update-AzVmss](/powershell/module/az.compute/update-azvmss) cmdlet to modify the configuration of automatic instance repair feature in an existing scale set. The following example updates the grace period to 40 minutes.

```azurepowershell-interactive
Update-AzVmss `
 -ResourceGroupName "myResourceGroup" `
 -VMScaleSetName "myScaleSet" `
 -EnableAutomaticRepair $true `
 -AutomaticRepairGracePeriod "PT40M"
```

## Troubleshoot

**Failure to enable automatic repairs policy**

If you get a ‘BadRequest’ error with a message stating “Could not find member ‘automaticRepairsPolicy’ on object of type ‘properties’”, then check the API version used for virtual machine scale set. API version 2018-10-01 or higher is required for this feature.

**Instance not getting repaired even when policy is enabled**

The instance could be in grace period. This is the amount of time to wait after any state change on the instance before performing repairs. This is to avoid any premature or accidental repairs. The repair action should happen once the grace period is completed for the instance.

**Viewing application health status for scale set instances**

You can use the [Get Instance View API](/rest/api/compute/virtualmachinescalesetvms/getinstanceview) for instances in a virtual machine scale set to view the application health status. With Azure PowerShell, you can use the cmdlet [Get-AzVmssVM](./powershell/module/az.compute/get-azvmssvm) with the *-InstanceView* flag. The application health status is provided under the property *vmHealth*.

## Next steps

Learn how to configure [Application Health extension](./virtual-machine-scale-sets-health-extension.md) or [Load balancer health probes](../load-balancer/load-balancer-custom-probe-overview.md) for your scale sets.
