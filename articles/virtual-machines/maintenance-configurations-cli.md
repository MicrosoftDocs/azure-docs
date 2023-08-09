---
title: Maintenance Configurations for Azure virtual machines using CLI 
description: Learn how to control when maintenance is applied to your Azure VMs using Maintenance configurations and CLI.
author: cynthn
ms.service: virtual-machines
ms.subservice: maintenance
ms.topic: how-to
ms.workload: infrastructure-services
ms.custom: devx-track-azurecli
ms.date: 11/20/2020
ms.author: cynthn
#pmcontact: shants
---

# Control updates with Maintenance Configurations and the Azure CLI

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Maintenance Configurations lets you decide when to apply platform updates to various Azure resources. This topic covers the Azure CLI options for using this service. For more about benefits of using Maintenance Configurations, its limitations, and other management options, see [Managing platform updates with Maintenance Configurations](maintenance-configurations.md).

> [!IMPORTANT]
> There are different **scopes** which support certain machine types and schedules, so please ensure you are selecting the right scope for your virtual machine.

## Create a maintenance configuration

The first step to creating a maintenance configuration is creating a resource group as a container for your configuration. In this example, a resource group named *myMaintenanceRG* is created in *eastus*. If you already have a resource group that you want to use, you can skip this part and replace the resource group name with your own in the rest of the examples.

```azurecli-interactive
az group create \
   --location eastus \
   --name myMaintenanceRG
```

After creating the resource group, use `az maintenance configuration create` to create a maintenance configuration. 

### Host

This example creates a maintenance configuration named *myConfig* scoped to host machines with a scheduled window of 5 hours on the fourth Monday of every month.

```azurecli-interactive
az maintenance configuration create \
   --resource-group myMaintenanceRG \
   --resource-name myConfig \
   --maintenance-scope host \
   --location eastus \
   --maintenance-window-duration "05:00" \
   --maintenance-window-recur-every "Month Fourth Monday" \
   --maintenance-window-start-date-time "2020-12-30 08:00" \
   --maintenance-window-time-zone "Pacific Standard Time" 
```
 
Using `--maintenance-scope host` ensures that the maintenance configuration is used for controlling updates to the host infrastructure. If you try to create a configuration with the same name, but in a different location, you will get an error. Configuration names must be unique to your resource group.

You can check if you have created the maintenance configuration successfully by querying for available maintenance configurations using `az maintenance configuration list`. 

```azurecli-interactive
az maintenance configuration list 
   --query "[].{Name:name, ID:id}" 
   --output table 
```

> [!NOTE]
> Maintenance recurrence can be expressed as daily, weekly or monthly. Some examples are:
> - **daily**- maintenance-window-recur-every: "Day" **or** "3Days"
> - **weekly**- maintenance-window-recur-every: "3Weeks" **or** "Week Saturday,Sunday"
> - **monthly**- maintenance-window-recur-every: "Month day23,day24" **or** "Month Last Sunday" **or** "Month Fourth Monday"

### Virtual Machine Scale Sets 

This example creates a maintenance configuration named *myConfig* with the osimage scope for virtual machine scale sets with a scheduled window of 5 hours on the fourth Monday of every month.

```azurecli-interactive
az maintenance configuration create \
   --resource-group myMaintenanceRG \
   --resource-name myConfig \
   --maintenance-scope osimage \
   --location eastus \
   --maintenance-window-duration "05:00" \
   --maintenance-window-recur-every "Month Fourth Monday" \
   --maintenance-window-start-date-time "2020-12-30 08:00" \
   --maintenance-window-time-zone "Pacific Standard Time" 
```

### Guest VMs

This example creates a maintenance configuration named *myConfig* scoped to guest machines (VMs and Arc enabled servers) with a scheduled window of 2 hours every 20 days. To learn more about this maintenance configurations on guest VMs see [Guest](maintenance-configurations.md#guest).

```azurecli-interactive
az maintenance configuration create \
   --resource-group myMaintenanceRG \
   --resource-name myConfig \
   --maintenance-scope InGuestPatch \
   --location eastus \
   --maintenance-window-duration "02:00" \
   --maintenance-window-recur-every "20days" \
   --maintenance-window-start-date-time "2022-12-30 07:00" \
   --maintenance-window-time-zone "Pacific Standard Time" \
   --install-patches-linux-parameters package-name-masks-to-exclude="ppt" package-name-masks-to-include="apt" classifications-to-include="Other" \
   --install-patches-windows-parameters kb-numbers-to-exclude="KB123456" kb-numbers-to-include="KB123456" classifications-to-include="FeaturePack" \
   --reboot-setting "IfRequired" \
   --extension-properties InGuestPatchMode="User"
```

## Assign the configuration

Use `az maintenance assignment create` to assign the configuration to your machine.

### Isolated VM

Apply the configuration to an isolated host VM using the ID of the configuration. Specify `--resource-type virtualMachines` and supply the name of the VM for `--resource-name`, and the resource group for to the VM in `--resource-group`, and the location of the VM for `--location`. 

```azurecli-interactive
az maintenance assignment create \
   --resource-group myMaintenanceRG \
   --location eastus \
   --resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute \
   --configuration-assignment-name myConfig \
   --maintenance-configuration-id "/subscriptions/{subscription ID}/resourcegroups/myMaintenanceRG/providers/Microsoft.Maintenance/maintenanceConfigurations/myConfig"
```

### Dedicated host

To apply a configuration to a dedicated host, you need to include `--resource-type hosts`, `--resource-parent-name` with the name of the host group, and `--resource-parent-type hostGroups`. 

The parameter `--resource-id` is the ID of the host. You can use [az-vm-host-get-instance-view](/cli/azure/vm/host#az-vm-host-get-instance-view) to get the ID of your dedicated host.

```azurecli-interactive
az maintenance assignment create \
   --resource-group myDHResourceGroup \
   --resource-name myHost \
   --resource-type hosts \
   --provider-name Microsoft.Compute \
   --configuration-assignment-name myConfig \
   --maintenance-configuration-id "/subscriptions/{subscription ID}/resourcegroups/myDhResourceGroup/providers/Microsoft.Maintenance/maintenanceConfigurations/myConfig" \
   --location eastus \
   --resource-parent-name myHostGroup \
   --resource-parent-type hostGroups 
```

### Virtual Machine Scale Sets

```azurecli-interactive
az maintenance assignment create \
   --resource-group myMaintenanceRG \
   --location eastus \
   --resource-name myVMSS \
   --resource-type virtualMachineScaleSets \
   --provider-name Microsoft.Compute \
   --configuration-assignment-name myConfig \
   --maintenance-configuration-id "/subscriptions/{subscription ID}/resourcegroups/myMaintenanceRG/providers/Microsoft.Maintenance/maintenanceConfigurations/myConfig"
```

### Guest VMs

```azurecli-interactive
az maintenance assignment create \
   --resource-group myMaintenanceRG \
   --location eastus \
   --resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute \
   --configuration-assignment-name myConfig \
   --maintenance-configuration-id "/subscriptions/{subscription ID}/resourcegroups/myMaintenanceRG/providers/Microsoft.Maintenance/maintenanceConfigurations/myConfig"
```

## Check configuration

You can verify that the configuration was applied correctly, or check to see what configuration is currently applied using `az maintenance assignment list`.

### Isolated VM

```azurecli-interactive
az maintenance assignment list \
   --provider-name Microsoft.Compute \
   --resource-group myMaintenanceRG \
   --resource-name myVM \
   --resource-type virtualMachines \
   --query "[].{resource:resourceGroup, configName:name}" \
   --output table
```

### Dedicated host 

```azurecli-interactive
az maintenance assignment list \
   --resource-group myDHResourceGroup \
   --resource-name myHost \
   --resource-type hosts \
   --provider-name Microsoft.Compute \
   --resource-parent-name myHostGroup \
   --resource-parent-type hostGroups \
   --query "[].{ResourceGroup:resourceGroup,configName:name}" \
   --output table
```

### Virtual Machine Scale Sets 

```azurecli-interactive
az maintenance assignment list \
   --provider-name Microsoft.Compute \
   --resource-group myMaintenanceRG \
   --resource-name myVMSS \
   --resource-type virtualMachines \
   --query "[].{resource:resourceGroup, configName:name}" \
   --output table
```

### Guest VMs

```azurecli-interactive
az maintenance assignment list \
   --provider-name Microsoft.Compute \
   --resource-group myMaintenanceRG \
   --resource-name myVM \
   --resource-type virtualMachines \
   --query "[].{resource:resourceGroup, configName:name}" \
   --output table
```

## Check for pending updates

Use `az maintenance update list` to see if there are pending updates. Update --subscription to be the ID for the subscription that contains the VM.

If there are no updates, the command will return an error message, which will contain the text: `Resource not found...StatusCode: 404`.

If there are updates, only one will be returned, even if there are multiple updates pending. The data for this update will be returned in an object:

```text
[
  {
    "impactDurationInSec": 9,
    "impactType": "Freeze",
    "maintenanceScope": "Host",
    "notBefore": "2020-03-03T07:23:04.905538+00:00",
    "resourceId": "/subscriptions/9120c5ff-e78e-4bd0-b29f-75c19cadd078/resourcegroups/DemoRG/providers/Microsoft.Compute/hostGroups/demoHostGroup/hosts/myHost",
    "status": "Pending"
  }
]
  ```

### Isolated VM

Check for pending updates for an isolated VM. In this example, the output is formatted as a table for readability.

```azurecli-interactive
az maintenance update list \
   --subscription {subscription ID} \
   --resourcegroup myMaintenanceRg \
   --resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute \
   --output table
```

### Dedicated host

To check for pending updates for a dedicated host. In this example, the output is formatted as a table for readability. Replace the values for the resources with your own.

```azurecli-interactive
az maintenance update list \
   --subscription {subscription ID} \
   --resourcegroup myHostResourceGroup \
   --resource-name myHost \
   --resource-type hosts \
   --provider-name Microsoft.Compute \
   --resource-parentname myHostGroup \
   --resource-parent-type hostGroups \
   --output table
```

## Apply updates

Use `az maintenance apply update` to apply pending updates. On success, this command will return JSON containing the details of the update. Apply update calls can take up to 2 hours to complete.

### Isolated VM

Create a request to apply updates to an isolated VM.

```azurecli-interactive
az maintenance applyupdate create \
   --subscription {subscriptionID} \
   --resource-group myMaintenanceRG \
   --resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute
```


### Dedicated host

Apply updates to a dedicated host.

```azurecli-interactive
az maintenance applyupdate create \
   --subscription {subscriptionID} \
   --resource-group myHostResourceGroup \
   --resource-name myHost \
   --resource-type hosts \
   --provider-name Microsoft.Compute \
   --resource-parent-name myHostGroup \
   --resource-parent-type hostGroups
```

### Virtual Machine Scale Sets

Apply update to a scale set

```azurecli-interactive
az maintenance applyupdate create \
   --subscription {subscriptionID} \
   --resource-group myMaintenanceRG \
   --resource-name myVMSS \
   --resource-type virtualMachineScaleSets \
   --provider-name Microsoft.Compute
```

## Check the status of applying updates 

You can check on the progress of the updates using `az maintenance applyupdate get`. 

You can use `default` as the update name to see results for the last update, or replace `myUpdateName` with the name of the update that was returned when you ran `az maintenance applyupdate create`.

```text
Status         : Completed
ResourceId     : /subscriptions/12ae7457-4a34-465c-94c1-17c058c2bd25/resourcegroups/TestShantS/providers/Microsoft.Comp
ute/virtualMachines/DXT-test-04-iso
LastUpdateTime : 1/1/2020 12:00:00 AM
Id             : /subscriptions/12ae7457-4a34-465c-94c1-17c058c2bd25/resourcegroups/TestShantS/providers/Microsoft.Comp
ute/virtualMachines/DXT-test-04-iso/providers/Microsoft.Maintenance/applyUpdates/default
Name           : default
Type           : Microsoft.Maintenance/applyUpdates
```
LastUpdateTime will be the time when the update got complete, either initiated by you or by the platform in case self-maintenance window was not used. If there has never been an update applied through maintenance control it will show default value.

### Isolated VM

```azurecli-interactive
az maintenance applyupdate get \
   --subscription {subscriptionID} \ 
   --resource-group myMaintenanceRG \
   --resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute \
   --apply-update-name myUpdateName \
   --query "{LastUpdate:lastUpdateTime, Name:name, ResourceGroup:resourceGroup, Status:status}" \
   --output table
```

### Dedicated host

```azurecli-interactive
az maintenance applyupdate get \
   --subscription {subscriptionID} \ 
   --resource-group myMaintenanceRG \
   --resource-name myHost \
   --resource-type hosts \
   --provider-name Microsoft.Compute \
   --resource-parent-name myHostGroup \ 
   --resource-parent-type hostGroups \
   --apply-update-name myUpdateName \
   --query "{LastUpdate:lastUpdateTime, Name:name, ResourceGroup:resourceGroup, Status:status}" \
   --output table
```

### Virtual Machine Scale Sets

```azurecli-interactive
az maintenance applyupdate get \
   --subscription {subscriptionID} \ 
   --resource-group myMaintenanceRG \
   --resource-name myVMSS \
   --resource-type virtualMachineScaleSets \
   --provider-name Microsoft.Compute \
   --apply-update-name myUpdateName \
   --query "{LastUpdate:lastUpdateTime, Name:name, ResourceGroup:resourceGroup, Status:status}" \
   --output table
```

## Delete a maintenance configuration

Use `az maintenance configuration delete` to delete a maintenance configuration. Deleting the configuration removes the maintenance control from the associated resources.

```azurecli-interactive
az maintenance configuration delete \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -resource-group myResourceGroup \
   --resource-name myConfig
```

## Next steps
To learn more, see [Maintenance and updates](maintenance-and-updates.md).
