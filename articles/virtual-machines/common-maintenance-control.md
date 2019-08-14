---
title: include file
description: include file
services: virtual-machines
author: cynthn

ms.service: virtual-machines
ms.topic: article
ms.workload: infrastructure-services
ms.date: 08/13/2019
ms.author: cynthn


<1-- Is it limited to isolated VM types for public preview? What does "--maintenanceScope Host" do - does it make all VMs on that host have the same maintenance config? -->

Maintenance control lets you decide when to apply updates to your VMs.

With maintenance control, you can:
- Batch of updates into one update package 
- Wait up to 35 days to apply updates from the time it becomes available. 
- You can automate platform updates for your maintenance window using Azure Functions to start updating
- Maintenance configurations are work across subscriptions and resource groups. You can manage all of your maintenance configurations together and use them across subscriptions.

## Preview limitations


After 35-days update will automatically be applied and availability constraints will not be respected.

To perform above operations user must have Resource Owner access.


## Enable preview

For each subscription, register Maintenance Resource Provide (MRP) armclient post /subscriptions/<subscription id>/providers/Microsoft.Maintenance/register?api-version=2014-04-01-preview

Machine level settings (required once on each machine from where MRP commands will be executed): 
1. Install ARMClient used to invoke Azure Resource Manager API. You can install it from Chocolatey by running: choco source enable -n=chocolatey choco install armclient
1. Install Azure CLI from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest 
1. Add “Maintenance” extension az login az extension remove -n maintenance az extension add -y --source https://mrpcliextension.blob.core.windows.net/cliextension/maintenance-1.0.0-py2.py3-none-any.whl


## Create a maintenance configuration

Use [az maintenance configuration create]() to create a maintenance configuration. This example creates a maintance configuration named *myConfig* scoped to the host. Replace the example subscription ID with your own. 

```bash
az maintenance configuration create \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -g {resourceGroupName} \
   --name myConfig \
   --maintenanceScope Host \
   --location  eastus
```

Copy the configuration ID from the output to use later.

## Apply the configuration

Use [az maintenance assignment create]() to apply the configuration.

To apply the configuration to a VM, use `--resource-type virtualMachines` and supply the name of the VM for `--resource-name` and the resource group for `-g`.

```bash
az maintenance assignment create \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -g myResourceGroup \
   --resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute \
   --configuration-assignment-name myConfig \
   -maintenance-configuration-id "/subscriptions/1111abcd-1a11-1a2b-1a12-123456789abc/resourcegroups/myResourceGroup/providers/Microsoft.Maintenance/maintenanceConfigura tions/myConfig" \
   -l eastus
```

To apply a configuration to a dedicated host, use `--resource-type hosts`. You will also need to supply the following

- `-g` is the resource group for the host
- `--resource-name` the name of the host
-  `--resource-parent-name` the name of the host group 
- `--resource-parent-type` should be set to `hostGroups` 
- `--resource-id` is the ID of the host. You can use [az vm host get-instance-view](/cli/azure/vm/host#az-vm-host-get-instance-view) to get the ID of your dedicated host.

```bash
az maintenance assignment create \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -g myHostResourceGroup \
   --resource-name myHost \
   --resource-type hosts \
   --provider-name Microsoft.Compute \
   --configuration-assignment-name myConfig \
   --maintenanceconfiguration-id "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Maintenance/maintenanceConfigura tions/{config-name}" \
   -l {location} \
   --resource-parent-name myHostGroup \
   --resource-parent-type hostGroups \
   --resource-id /subscriptions/1111abcd-1a11-1a2b-1a12-123456789abc/re
sourceGroups/myResourceGroup/providers/Microsoft.Compute/hostGroups/myHostGroup/hosts
/myHost
```

## Check for pending updates

Use [az maintenance update list]() to see if there are pending updates. Update --subscription to be the ID for the subscription that contains the VM.

```bash
az maintenance update list \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -g myResourceGroup \
   -resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute
```

To check for pending updates 

```bash
az maintenance update list \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -g myHostResourceGroup \
  --resource-name myHost \
  --resource-type hosts \
  --provider-name Microsoft.Compute \
  --resource-parentname myHostGroup \
  --resource-parent-type hostGroups
```

## Apply updates

Use [az maintenance apply update]() to apply pending updates.

```bash
az maintenance apply update \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -g myResourceGroup\
   --resource-name myVM \
   --resource-type virtualMachines \
   --providername Microsoft.Compute
```

To apply updates to a dedicated host.

```bash
az maintenance apply update \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -g myHostResourceGroup \
   --resource-name myHost \
   --resource-type hosts \
   --provider-name Microsoft.Compute \
   --resource-parent-name myHostGroup \
   --resource-parent-type hostGroups
```

## Delete a maintenance configuration

Use [az maintenance configuration delete]() to delete a maintenance configuration.

```bash
az maintenance configuration delete \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -g myResourceGroup \
   --name myConfig
```


