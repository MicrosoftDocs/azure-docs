---
title: Maintenance Configurations for Azure virtual machines using the Azure CLI
description: Learn how to control when maintenance is applied to your Azure VMs by using Maintenance Configurations and the Azure CLI.
author: ju-shim
ms.service: virtual-machines
ms.subservice: maintenance
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 11/20/2020
ms.author: jushiman
#pmcontact: shants
---

# Control updates with Maintenance Configurations and the Azure CLI

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

You can use the Maintenance Configurations feature to control when to apply platform updates to various Azure resources. This article covers the Azure CLI options for using this feature. For more information about the benefits of using Maintenance Configurations, its limitations, and other management options, see [Managing platform updates with Maintenance Configurations](maintenance-configurations.md).

> [!IMPORTANT]
> Specific *scopes* support certain machine types and schedules. Be sure to select the right scope for your virtual machine (VM).

## Create a maintenance configuration

The first step in creating a maintenance configuration is creating a resource group as a container for your configuration. This example creates a resource group named *myMaintenanceRG* in *eastus*. If you already have a resource group that you want to use, you can skip this part and replace the resource group name with your own in the rest of the examples.

```azurecli-interactive
az group create \
   --location eastus \
   --name myMaintenanceRG
```

After you create the resource group, use `az maintenance configuration create` to create a maintenance configuration.

### Host

This example creates a maintenance configuration named *myConfig* scoped to host machines, with a scheduled window of 5 hours on the fourth Monday of every month:

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

Using `--maintenance-scope host` ensures that the maintenance configuration is used for controlling updates to the host infrastructure. If you try to create a configuration with the same name but in a different location, you'll get an error. Configuration names must be unique to your resource group.

To check if you successfully created the maintenance configuration, you can query for available maintenance configurations by using `az maintenance configuration list`:

```azurecli-interactive
az maintenance configuration list 
   --query "[].{Name:name, ID:id}" 
   --output table 
```

You can express maintenance recurrence as daily, weekly, or monthly. Here are some examples:

- **Daily**: A `maintenance-window-recur-every` value of `"Day"` or `"3Days"`.
- **Weekly**: A `maintenance-window-recur-every` value of `"3Weeks"` or `"Week Saturday,Sunday"`.
- **Monthly**: A `maintenance-window-recur-every` value of `"Month day23,day24"` or `"Month Last Sunday"` or `Month Fourth Monday`.

### Virtual machine scale sets

This example creates a maintenance configuration named *myConfig* with the OS image scope for virtual machine scale sets, with a scheduled window of 5 hours on the fourth Monday of every month:

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

This example creates a maintenance configuration named *myConfig* scoped to guest machines (VMs and Azure Arc-enabled servers), with a scheduled window of 2 hours every 20 days. [Learn more about maintenance configurations on guest VMs](maintenance-configurations.md#guest).

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

Apply the configuration to an isolated host VM by using the ID of the configuration. Specify `--resource-type virtualMachines`. Supply the name of the VM for `--resource-name`, the VM's resource group for `--resource-group`, and the location of the VM for `--location`.

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

### Virtual machine scale sets

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

## Check the configuration

You can verify that the configuration was applied correctly, or check to see what configuration is currently applied, by using `az maintenance assignment list`.

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

### Virtual machine scale sets

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

Use `az maintenance update list` to see if there are pending updates. Update `--subscription` to be the ID for the subscription that contains the VM.

If there are no updates, the command returns an error message that contains the text `Resource not found...StatusCode: 404`.

If there are updates, the command returns only one, even if multiple updates are pending. The data for this update is returned in an object:

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

Check for pending updates for an isolated VM. In this example, the output is formatted as a table for readability:

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

Check for pending updates for a dedicated host. In this example, the output is formatted as a table for readability. Replace the values for the resources with your own.

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

Use `az maintenance apply update` to apply pending updates. On success, this command returns JSON that contains the details of the update. Calls to apply updates can take up to 2 hours to complete.

### Isolated VM

Create a request to apply updates to an isolated VM:

```azurecli-interactive
az maintenance applyupdate create \
   --subscription {subscriptionID} \
   --resource-group myMaintenanceRG \
   --resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute
```

### Dedicated host

Apply updates to a dedicated host:

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

### Virtual machine scale sets

Apply updates to a scale set:

```azurecli-interactive
az maintenance applyupdate create \
   --subscription {subscriptionID} \
   --resource-group myMaintenanceRG \
   --resource-name myVMSS \
   --resource-type virtualMachineScaleSets \
   --provider-name Microsoft.Compute
```

## Check the status of applying updates

You can check on the progress of the updates by using `az maintenance applyupdate get`.

To see results for the last update, use `default` as the update name. Or replace `myUpdateName` with the name of the update that was returned when you ran `az maintenance applyupdate create`.

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

`LastUpdateTime` is the time when the update finished, whether you initiated the update or the platform initiated it because you didn't use the self-maintenance window. If an update was never applied through Maintenance Configurations, `LastUpdateTime` shows the default value.

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

### Virtual machine scale sets

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

To delete a maintenance configuration, use `az maintenance configuration delete`. Deleting the configuration removes the maintenance control from the associated resources.

```azurecli-interactive
az maintenance configuration delete \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -resource-group myResourceGroup \
   --resource-name myConfig
```

## Next steps

To learn more, see [Maintenance for virtual machines in Azure](maintenance-and-updates.md).
