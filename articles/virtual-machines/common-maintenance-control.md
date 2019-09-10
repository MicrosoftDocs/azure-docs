---
title: include file
description: include file
services: virtual-machines
author: cynthn

ms.service: virtual-machines
ms.topic: article
ms.workload: infrastructure-services
ms.date: 09/05/2019
ms.author: cynthn
---

<1-- Is it limited to isolated VM types for public preview? Isolated and Dedicated Hosts. What does "--maintenanceScope Host" do - does it make all VMs on that host have the same maintenance config? Yes. Azure functions? Separate dedicated hosts from isolated sizes? Other maintenance docs - what needs to be updated? What are the other options for --maintenancescope and how are they different? -->


Manage platform updates that don't require a reboot using maintenance control. Azure frequently updates its infrastructure to improve reliability, performance, security or launch new features. Most updates are transparent to users. But customers with sensitive workloads like gaming, media streaming, and financial transactions can’t tolerate even few seconds of a VM freezing or disconnecting for maintenance. Maintenance control gives customers the option to wait on platform updates and apply them within a 35-day rolling window.  

Maintenance control lets you decide when to apply updates to your isolated VMs.

With maintenance control, you can:
- Batch updates into one update package.
- Wait up to 35 days to apply updates. 
- Automate platform updates for your maintenance window using Azure Functions.
- Maintenance configurations work across subscriptions and resource groups. 

## Limitations

- VMs must be on a dedicated host, be created using an isolated VM size or on a Dedicated Node Group (DNG).
- After 35 days, an update will automatically be applied and availability constraints will not be respected.
- User must have **Resource Owner** access.


## Enable preview

Remove any old versions of the maintenance extension, and install the preview version. 

```azurecli-interactive
az extension remove -n maintenance 
az extension add -y --source https://mrpcliextension.blob.core.windows.net/cliextension/maintenance-1.0.0-py2.py3-none-any.whl
```


## Create a maintenance configuration

Use [az maintenance configuration create]() to create a maintenance configuration. This example creates a maintenance configuration named *myConfig* scoped to the host. Replace the example subscription ID with your own. 

```bash
az group create \
   --location eastus \
   --name myMaintenanceRG
az maintenance configuration create \
   -g myMaintenanceRG \
   --name myConfig \
   --maintenanceScope host\
   --location  eastus
```

Copy the configuration ID from the output to use later.

For dedicated hosts, you can use `--maintenanceScope host` to have the configuration scoped to a dedicated host. Using `--maintenanceScope host` will ensure that all VMs on a host will follow the same maintenance configuration.

## Apply the configuration

Use [az maintenance assignment create]() to apply the configuration.

### VM

To apply the configuration to a VM, use `--resource-type virtualMachines` and supply the name of the VM for `--resource-name` and the resource group for `-g`.

```bash
az maintenance assignment create \
   --provider-name Microsoft.Compute \
   -g myMaintenanceRG \
   -l eastus \
   --resource-name myVM \
   --resource-type virtualMachines \
   --configuration-assignment-name myConfig \
   --maintenance-configuration-id '/subscriptions/f679944f-bdad-45da-98fb-6097116fd136/resourcegroups/myMaintenanceRG/providers/Microsoft.Maintenance/maintenanceConfigurations/myConfig'
```

### Dedicate host

To apply a configuration to a dedicated host, you need to include `--resource-type hosts`, `--resource-parent-name` with the name of the host group, and `--resource-parent-type hostGroups`. 

The parameter `--resource-id` is the ID of the host. You can use [az vm host get-instance-view](/cli/azure/vm/host#az-vm-host-get-instance-view) to get the ID of your dedicated host.

```bash
az maintenance assignment create \
   -g myDHResourceGroup \
   --resource-name myHost \
   --resource-type hosts \
   --provider-name Microsoft.Compute \
   --configuration-assignment-name myConfig \
   --maintenance-configuration-id "/subscriptions/1111abcd-1a11-1a2b-1a12-123456789abc/resourcegroups/myDhResourceGroup/providers/Microsoft.Maintenance/maintenanceConfigurations/myConfig" \
   -l eastus \
   --resource-parent-name myHostGroup \
   --resource-parent-type hostGroups \
   --resource-id /subscriptions/1111abcd-1a11-1a2b-1a12-123456789abc/re
sourceGroups/myResourceGroup/providers/Microsoft.Compute/hostGroups/myHostGroup/hosts
/myHost
```

## Check for pending updates

Use [az maintenance update list]() to see if there are pending updates. Update --subscription to be the ID for the subscription that contains the VM.

## VM

Check for pending updates for a VM. In this example, the output is formatted as a table for readability.

```bash
az maintenance update list \
   -g myMaintenanceRg \
   --resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute \
   -o table
```

### Dedicated host

To check for pending updates for a dedicated host. In this example, the output is formatted as a table for readability. Replace the values for the resources with your own.

```bash
az maintenance update list \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -g myHostResourceGroup \
   --resource-name myHost \
   --resource-type hosts \
   --provider-name Microsoft.Compute \
   --resource-parentname myHostGroup \
   --resource-parent-type hostGroups \
   -o table
```

## Apply updates

Use [az maintenance apply update]() to apply pending updates.

## VM

Create a request to apply updates to a single VM.

```bash
az maintenance applyupdate create \
   -g myMaintenanceRG\
   --resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute
```

### Dedicated host

Apply updates to a dedicated host.

```bash
az maintenance applyupdate create \
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

