---
title: Use custom scale-in policies with Azure virtual machine scale sets | Microsoft Docs
description: Learn how to use custom scale-in policies with Azure virtual machine scale sets that use Autoscale configuration to manage instance count
services: virtual-machine-scale-sets
documentationcenter: ''
author: avverma
manager: vashan
editor:
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machine-scale-sets
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm
ms.devlang: na
ms.topic: article
ms.date: 10/11/2019
ms.author: avverma

---

# Use custom scale-in policies with Azure virtual machine scale sets (Preview)

A virtual machine scale set deployment can be scaled-out or scaled-in based on an array of metrics, including platform and user-defined custom metrics. While a scale-out creates new Virtual Machines based on the scale set model, a scale-in affects running virtual machines that may have different configurations and/or functions as the VMSS workload evolves. 

The scale-in policy feature provides users a way to configure the order in which virtual machines are scaled-in. The Preview introduces three scale-in configurations: 

1. NewestVM
2. OldestVM
3. Default

***This feature preview is under Microsoft NDA and no SLA is provided for the trial. Please do not use this preview feature on any production and/or critical environments.***

## Default scale-in policy

By default, virtual machine scale set applies a ‘Default’ scale-in policy to determine which instance(s) will be scaled in. Under the ‘Default’ policy, VMs are selected for scale-in in the following order:

1. Balance virtual machines across Availability Zones (if the scale set is deployed in zonal configuration)
2. Balance virtual machines across Fault Domains (best effort)
3. Delete virtual machine with the highest instance ID

Users do not need to specify a scale-in policy if they just want the default ordering to be followed.

Note that balancing across AZs or FDs does not move instances across AZs or FDs. The balancing is achieved through deletion of virtual machines from the unbalanced AZs/FDs till all AZs/FDs have an equal distribution of VMs.

## Other scale-in policies

In addition to the ‘Default’ policy above, users can better control the order of scaling in through 2 additional policies:

1. NewestVM – This policy will delete the newest created VM in the scale set, after balancing VMs across Availability Zones (for zonal deployments). Enabling this policy requires a configuration change on the virtual machine scale set model.

2. OldestVM – This policy will delete the oldest created VM in the scale set, after balancing VMs across Availability Zones (for zonal deployments). Enabling this policy requires a configuration change on the virtual machine scale set model.

## Enabling scale-in policy

A scale-in policy is defined in the virtual machine scale set model. As noted in the sections above, a scale-in policy definition is needed when using the ‘NewestVM’ and ‘OldestVM’ policies. Virtual machine scale set will automatically use the ‘Default’ scale-in policy if there is no scale-in policy definition found on the scale set model. 

A scale-in policy can be defined on the VMSS model in the following ways:

### Through API

Execute a PUT on the virtual machine scale set using VMSS API 2019-03-01:

```put
https://management.azure.com/subscriptions/<sub-id>/resourceGroups/<myRG>/providers/Microsoft.Compute/virtualMachineScaleSets/<myVMSS>?api-version=2019-03-01

{ 
"location": "<VMSS location>", 
    "properties": { 
        "scaleInPolicy": {  
            "rules": ["OldestVM"]  
        } 
    }    
} 
```

### Through Template

In your template, under “properties”, add the following:

```json
"scaleInPolicy": {  
      "rules": ["OldestVM"]  
}
```

The above blocks specify that the virtual machine scale set will delete the Oldest VM in a zone-balanced scale set, when a scale-in is triggered (through Autoscale or manual delete).

When a virtual machine scale set is not zone balanced, the scale set will first delete VMs across the imbalanced zone(s). Within the imbalanced zones, the scale set will use the scale-in policy specified above to determine which VM to scale in. In this case, within an imbalanced zone, VMSS will select the Oldest VM in that zone to be deleted.

For non-zonal virtual machine scale set, the policy selects the oldest VM across the scale set for deletion.

The same process applies when using ‘NewestVM’ in the above scale-in policy.

## Modifying scale-in policies

Modifying the scale-in policy follows the same process as applying the scale-in policy. For example, if in the above example, you want to change the policy from ‘OldestVM’ to ‘NewestVM’, you can do so by:

### Through API

Execute a PUT on the virtual machine scale set using VMSS API 2019-03-01:

```put
https://management.azure.com/subscriptions/<sub-id>/resourceGroups/<myRG>/providers/Microsoft.Compute/virtualMachineScaleSets/<myVMSS>?api-version=2019-03-01 

{ 
"location": "<VMSS location>", 
    "properties": { 
        "scaleInPolicy": {  
            "rules": ["NewestVM"]  
        } 
    }    
}
```

### Through Template

In your template, under “properties”, modify the template as below and redeploy: 

```json
"scaleInPolicy": {  
      "rules": ["NewestVM"]  
} 
```

The same process will apply if you decide to change ‘NewestVM’ to ‘Default’ or ‘OldestVM’

## Instance protection and scale-in policy

Virtual machine scale sets provide two types of [instance protection](./virtual-machine-scale-sets-instance-protection.md#types-of-instance-protection):

1. Protect from scale-in
2. Protect from scale-set actions

A protected virtual machine is not deleted through a scale-in action, regardless of the scale-in policy applied. For example, if VM_0 (oldest VM in the scale set) is protected from scale-in, and VMSS has ‘OldestVM’ scale-in policy enabled, VM_0 will not be considered for being scaled in, even though it is the oldest VM in the scale set. 

A protected virtual machine can be manually deleted by the user at any time, regardless of the scale-in policy enabled on the scale set. 

## Usage examples 

The below examples demonstrate how a virtual machine scale set will select VMs to be deleted when a scale-in event is triggered. Virtual machines with the highest instance IDs are assumed to be the newest VMs in the scale set and the VMs with the smallest instance IDs are assumed to be the oldest VMs in the scale set. 

### OldestVM

| Event    | Instance IDs in Zone1  | Instance IDs in Zone2  | Instance IDs in Zone3  | Scale-in Selection                                                                                                               |
|----------|------------------------|------------------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| Initial  | 3, 4, 5, 10            | 2, 6, 9, 11            | 1, 7, 8                |                                                                                                                                  |
| Scale-in | 3, 4, 5, 10            | **2**, 6, 9, 11        | 1, 7, 8                | Choose between Zone 1 and 2, even though Zone 3 has the oldest VM. Delete VM2 from Zone 2 as it is the oldest VM in that zone.   |
| Scale-in | **3**, 4, 5, 10        | 6, 9, 11               | 1, 7, 8                | Choose Zone 1 even though Zone 3 has the oldest VM. Delete VM3 from Zone 1 as it is the oldest VM in that zone.                  |
| Scale-in | 4, 5, 10               | 6, 9, 11               | **1**, 7, 8            | Zones are balanced. Delete VM1 in Zone 3 as it is the oldest VM  in the scale set.                                               |
| Scale-in | **4**, 5, 10           | 6, 9, 11               | 7, 8                   | Choose between Zone 1 and Zone 2. Delete VM4 in Zone 1 as it is the oldest VM across the two Zones.                              |
| Scale-in | 5, 10                  | **6**, 9, 11           | 7, 8                   | Choose Zone 2 even though Zone 1 has the oldest VM. Delete VM6 in Zone 1 as it is the oldest VM in that zone.                    |
| Scale-in | **5**, 10              | 9, 11                  | 7, 8                   | Zones are balanced. Delete VM5 in Zone 1 as it is the oldest VM in the scale set.                                                |

For non-zonal virtual machine scale sets, the policy selects the oldest VM across the scale set for deletion. Any “protected” VM will be skipped for deletion.

### NewestVM

| Event    | Instance IDs in Zone1  | Instance IDs in Zone2  | Instance IDs in Zone3  | Scale-in Selection                                                                                                               |
|----------|------------------------|------------------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| Initial  | 3, 4, 5, 10            | 2, 6, 9, 11            | 1, 7, 8                |                                                                                                                                  |
| Scale-in | 3, 4, 5, 10            | 2, 6, 9, **11**        | 1, 7, 8                | Choose between Zone 1 and 2. Delete VM11 from Zone 2 as it is the newest VM across the two zones.                                |
| Scale-in | 3, 4, 5, **10**        | 2, 6, 9                | 1, 7, 8                | Choose Zone 1 as it has more VMs than the other two zones. Delete VM10 from Zone 1 as it is the newest VM in that Zone.          |
| Scale-in | 3, 4, 5                | 2, 6, **9**            | 1, 7, 8                | Zones are balanced. Delete VM9 in Zone 2 as it is the newest VM in the scale set.                                                |
| Scale-in | 3, 4, 5                | 2, 6                   | 1, 7, **8**            | Choose between Zone 1 and Zone 3. Delete VM8 in Zone 3 as it is the newest VM in that Zone.                                      |
| Scale-in | 3, 4, **5**            | 2, 6                   | 1, 7                   | Choose Zone 1 even though Zone 3 has the newest VM. Delete VM5 in Zone 1 as it is the newest VM in that Zone.                    |
| Scale-in | 3, 4                   | 2, 6                   | 1, 7                   | Zones are balanced. Delete VM7 in Zone 3 as it is the newest VM in the scale set.                                                |

For non-zonal virtual machine scale sets, the policy selects the newest VM across the scale set for deletion. Any “protected” VM will be skipped for deletion. 

## Troubleshoot

1. Failure to enable scaleInPolicy
    If you get a ‘BadRequest’ error with an error message stating "Could not find member 'scaleInPolicy' on object of type 'properties'”, then check the API version used for virtual machine scale set. VMSS API version 2019-03-01 or higher is required for this preview.

2. Wrong selection of VMs for scale-in
    Refer to the examples above. If your virtual machine scale set is a Zonal deployment, scale-in policy is applied first to the imbalanced Zones and then across the scale set once it is zone balanced. If the order of scale-in is not consistent with the examples above, raise a query with the virtual machine scale set team for troubleshooting.

