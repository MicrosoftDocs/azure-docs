---
title: Use custom scale-in policies with Azure Virtual Machine Scale Sets
description: Learn how to use custom scale-in policies with Azure Virtual Machine Scale Sets that use autoscale configuration to manage instance count
services: virtual-machine-scale-sets
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: scale-in-policy
ms.date: 11/22/2022
ms.reviewer: mimckitt
ms.custom: avverma, devx-track-azurecli, devx-track-azurepowershell

---

# Use custom scale-in policies with Azure Virtual Machine Scale Sets

A Virtual Machine Scale Set deployment can be scaled-out or scaled-in based on an array of metrics, including platform and user-defined custom metrics. While a scale-out creates new virtual machines based on the scale set model, a scale-in affects running virtual machines that may have different configurations and/or functions as the scale set workload evolves. 

The scale-in policy feature provides users a way to configure the order in which virtual machines are scaled-in, by way of three scale-in configurations: 

1. Default
2. NewestVM
3. OldestVM

### Default scale-in policy

#### Flexible orchestration 
With this policy, virtual machines are scaled-in after balancing across availability zones (if the scale set is in zonal configuration), and the oldest virtual machine as per `createdTime` is scaled-in first. 
Note that balancing across fault domain is not available in Default policy with flexible orchestration mode. 

#### Uniform orchestration 
By default, Virtual Machine Scale Set applies this policy to determine which instance(s) will be scaled in. With the *Default* policy, VMs are selected for scale-in in the following order:

1. Balance virtual machines across availability zones (if the scale set is deployed in zonal configuration)
2. Balance virtual machines across fault domains (best effort)
3. Delete virtual machine with the highest instance ID

Users do not need to specify a scale-in policy if they just want the default ordering to be followed.

Note that balancing across availability zones or fault domains does not move instances across availability zones or fault domains. The balancing is achieved through deletion of virtual machines from the unbalanced availability zones or fault domains until the distribution of virtual machines becomes balanced.

### NewestVM scale-in policy

This policy will delete the newest created virtual machine in the scale set, after balancing VMs across availability zones (for zonal deployments). Enabling this policy requires a configuration change on the Virtual Machine Scale Set model.

### OldestVM scale-in policy

This policy will delete the oldest created virtual machine in the scale set, after balancing VMs across availability zones (for zonal deployments). Enabling this policy requires a configuration change on the Virtual Machine Scale Set model.

## Enabling scale-in policy

A scale-in policy is defined in the Virtual Machine Scale Set model. As noted in the sections above, a scale-in policy definition is needed when using the ‘NewestVM’ and ‘OldestVM’ policies. Virtual Machine Scale Set will automatically use the ‘Default’ scale-in policy if there is no scale-in policy definition found on the scale set model. 

A scale-in policy can be defined on the Virtual Machine Scale Set model in the following ways:

### Azure portal
 
The following steps define the scale-in policy when creating a new scale set. 
 
1. Go to **Virtual Machine Scale Sets**.
1. Select **+ Add** to create a new scale set.
1. Go to the **Scaling** tab. 
1. Locate the **Scale-in policy** section.
1. Select a scale-in policy from the drop-down.
1. When you are done creating the new scale set, select **Review + create** button.

### Using API

Execute a PUT on the Virtual Machine Scale Set using API 2019-03-01:

```
PUT
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
### Azure PowerShell

Create a resource group, then create a new scale set with scale-in policy set as *OldestVM*.

```azurepowershell-interactive
New-AzResourceGroup -ResourceGroupName "myResourceGroup" -Location "<VMSS location>"
New-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -Location "<VMSS location>" `
  -VMScaleSetName "myScaleSet" `
  -OrchestrationMode "Flexible" `
  -ScaleInPolicy “OldestVM”
```

### Azure CLI 2.0

The following example adds a scale-in policy while creating a new scale set. First create a resource group, then create a new scale set with scale-in policy as *OldestVM*. 

```azurecli-interactive
az group create --name <myResourceGroup> --location <VMSSLocation>
az vmss create \
  --resource-group <myResourceGroup> \
  --name <myVMScaleSet> \
  --orchestration-mode flexible \
  --image Ubuntu2204 \
  --admin-username <azureuser> \
  --generate-ssh-keys \
  --scale-in-policy OldestVM
```

### Using Template

In your template, under “properties”, add the following:

```json
"scaleInPolicy": {  
      "rules": ["OldestVM"]  
}
```

The above blocks specify that the Virtual Machine Scale Set will delete the Oldest VM in a zone-balanced scale set, when a scale-in is triggered (through Autoscale or manual delete).

When a Virtual Machine Scale Set is not zone balanced, the scale set will first delete VMs across the imbalanced zone(s). Within the imbalanced zones, the scale set will use the scale-in policy specified above to determine which VM to scale in. In this case, within an imbalanced zone, the scale set will select the Oldest VM in that zone to be deleted.

For non-zonal Virtual Machine Scale Set, the policy selects the oldest VM across the scale set for deletion.

The same process applies when using ‘NewestVM’ in the above scale-in policy.

## Modifying scale-in policies

Modifying the scale-in policy follows the same process as applying the scale-in policy. For example, if in the above example, you want to change the policy from ‘OldestVM’ to ‘NewestVM’, you can do so by:

### Azure portal

You can modify the scale-in policy of an existing scale set through the Azure portal. 
 
1. In an existing Virtual Machine Scale Set, select **Scaling** from the menu on the left.
1. Select the **Scale-In Policy** tab.
1. Select a scale-in policy from the drop-down.
1. When you are done, select **Save**. 

### Using API

Execute a PUT on the Virtual Machine Scale Set using API 2019-03-01:

```
PUT
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
### Azure PowerShell

Update the scale-in policy of an existing scale set:

```azurepowershell-interactive
Update-AzVmss `
 -ResourceGroupName "myResourceGroup" `
 -VMScaleSetName "myScaleSet" `
 -ScaleInPolicy “OldestVM”
```

### Azure CLI 2.0

The following is an example for updating the scale-in policy of an existing scale set: 

```azurecli-interactive
az vmss update \  
  --resource-group <myResourceGroup> \
  --name <myVMScaleSet> \
  --scale-in-policy OldestVM
```

### Using Template

In your template, under “properties”, modify the template as below and redeploy: 

```json
"scaleInPolicy": {  
      "rules": ["NewestVM"]  
} 
```

The same process will apply if you decide to change ‘NewestVM’ to ‘Default’ or ‘OldestVM’

## Instance protection and scale-in policy

Virtual Machine Scale Sets provide two types of [instance protection](./virtual-machine-scale-sets-instance-protection.md#types-of-instance-protection):

1. Protect from scale-in
2. Protect from scale-set actions

A protected virtual machine is not deleted through a scale-in action, regardless of the scale-in policy applied. For example, if VM_0 (oldest VM in the scale set) is protected from scale-in, and the scale set has ‘OldestVM’ scale-in policy enabled, VM_0 will not be considered for being scaled in, even though it is the oldest VM in the scale set. 

A protected virtual machine can be manually deleted by the user at any time, regardless of the scale-in policy enabled on the scale set. 

## Usage examples 

The below examples demonstrate how a Virtual Machine Scale Set will select VMs to be deleted when a scale-in event is triggered. Virtual machines with the highest instance IDs are assumed to be the newest VMs in the scale set and the VMs with the smallest instance IDs are assumed to be the oldest VMs in the scale set. 

### OldestVM scale-in policy

| Event                 | Instance IDs in Zone1  | Instance IDs in Zone2  | Instance IDs in Zone3  | Scale-in Selection                                                                                                               |
|-----------------------|------------------------|------------------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| Initial               | 3, 4, 5, 10            | 2, 6, 9, 11            | 1, 7, 8                |                                                                                                                                  |
| Scale-in              | 3, 4, 5, 10            | ***2***, 6, 9, 11      | 1, 7, 8                | Choose between Zone 1 and 2, even though Zone 3 has the oldest VM. Delete VM2 from Zone 2 as it is the oldest VM in that zone.   |
| Scale-in              | ***3***, 4, 5, 10      | 6, 9, 11               | 1, 7, 8                | Choose Zone 1 even though Zone 3 has the oldest VM. Delete VM3 from Zone 1 as it is the oldest VM in that zone.                  |
| Scale-in              | 4, 5, 10               | 6, 9, 11               | ***1***, 7, 8          | Zones are balanced. Delete VM1 in Zone 3 as it is the oldest VM  in the scale set.                                               |
| Scale-in              | ***4***, 5, 10         | 6, 9, 11               | 7, 8                   | Choose between Zone 1 and Zone 2. Delete VM4 in Zone 1 as it is the oldest VM across the two Zones.                              |
| Scale-in              | 5, 10                  | ***6***, 9, 11         | 7, 8                   | Choose Zone 2 even though Zone 1 has the oldest VM. Delete VM6 in Zone 1 as it is the oldest VM in that zone.                    |
| Scale-in              | ***5***, 10            | 9, 11                  | 7, 8                   | Zones are balanced. Delete VM5 in Zone 1 as it is the oldest VM in the scale set.                                                |

For non-zonal Virtual Machine Scale Sets, the policy selects the oldest VM across the scale set for deletion. Any “protected” VM will be skipped for deletion.

### NewestVM scale-in policy

| Event                 | Instance IDs in Zone1  | Instance IDs in Zone2  | Instance IDs in Zone3  | Scale-in Selection                                                                                                               |
|-----------------------|------------------------|------------------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| Initial               | 3, 4, 5, 10            | 2, 6, 9, 11            | 1, 7, 8                |                                                                                                                                  |
| Scale-in              | 3, 4, 5, 10            | 2, 6, 9, ***11***      | 1, 7, 8                | Choose between Zone 1 and 2. Delete VM11 from Zone 2 as it is the newest VM across the two zones.                                |
| Scale-in              | 3, 4, 5, ***10***      | 2, 6, 9                | 1, 7, 8                | Choose Zone 1 as it has more VMs than the other two zones. Delete VM10 from Zone 1 as it is the newest VM in that Zone.          |
| Scale-in              | 3, 4, 5                | 2, 6, ***9***          | 1, 7, 8                | Zones are balanced. Delete VM9 in Zone 2 as it is the newest VM in the scale set.                                                |
| Scale-in              | 3, 4, 5                | 2, 6                   | 1, 7, ***8***          | Choose between Zone 1 and Zone 3. Delete VM8 in Zone 3 as it is the newest VM in that Zone.                                      |
| Scale-in              | 3, 4, ***5***          | 2, 6                   | 1, 7                   | Choose Zone 1 even though Zone 3 has the newest VM. Delete VM5 in Zone 1 as it is the newest VM in that Zone.                    |
| Scale-in              | 3, 4                   | 2, 6                   | 1, ***7***             | Zones are balanced. Delete VM7 in Zone 3 as it is the newest VM in the scale set.                                                |

For non-zonal Virtual Machine Scale Sets, the policy selects the newest VM across the scale set for deletion. Any “protected” VM will be skipped for deletion. 

## Troubleshoot

1. Failure to enable scaleInPolicy
    If you get a ‘BadRequest’ error with an error message stating "Could not find member 'scaleInPolicy' on object of type 'properties'”, then check the API version used for Virtual Machine Scale Set. API version 2019-03-01 or higher is required for this feature.

2. Wrong selection of VMs for scale-in
    Refer to the examples above. If your Virtual Machine Scale Set is a Zonal deployment, scale-in policy is applied first to the imbalanced Zones and then across the scale set once it is zone balanced. If the order of scale-in is not consistent with the examples above, raise a query with the Virtual Machine Scale Set team for troubleshooting.

## Next steps

Learn how to [deploy your application](virtual-machine-scale-sets-deploy-app.md) on Virtual Machine Scale Sets.
