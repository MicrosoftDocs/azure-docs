---
title: Migrate deployments and resources to virtual machine scale sets in Flexible orchestration
description: Learn how to migrate deployments and resources to virtual machine scale sets in Flexible orchestration.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: conceptual
ms.service: virtual-machines
ms.subservice: flexible-scale-sets
ms.date: 10/14/2021
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Migrate deployments and resources to virtual machine scale sets in Flexible orchestration 

**Applies to:** :heavy_check_mark: Flexible scale sets

You can update from using [availability sets](availability-set-overview.md) and [virtual machine scale sets in Uniform orchestration mode](../virtual-machine-scale-sets/overview.md) to using virtual machine scale sets in Flexible orchestration. This article goes over migration considerations for both scenarios and other things to think about when switching to Flexible orchestration mode for virtual machine scale sets. 

## Update Availability Set deployments templates and scripts

First, you need to create a virtual machine scale set with no auto scaling profile via [Azure CLI](flexible-virtual-machine-scale-sets-cli.md), [Azure PowerShell](flexible-virtual-machine-scale-sets-powershell.md), or [ARM Template](flexible-virtual-machine-scale-sets-rest-api.md). Azure portal only allows creating a virtual machine scale set with an autoscaling profile. If you do not want or need an autoscaling profile and you want to create a scale set using [Azure portal](flexible-virtual-machine-scale-sets-portal.md), you can set the initial capacity to 0. 
 
You must specify the fault domain count for the virtual machine scale set. For regional (non-zonal) deployments, virtual machine scale sets offers the same fault domain guarantees as availability sets. However, you can scale up to 1000 instances. 

Update domains have been deprecated in Flexible Orchestration mode. Most platform updates with general purpose SKUs are performed with Live Migration and do not require instance reboot. On the occasion that a platform maintenance requires instances to be rebooted, updates are applied fault domain by fault domain.  
    
Flexible orchestration for virtual machine scale sets also supports deploying instances across multiple availability zones. You may want to consider updating your VM deployments to spread across multiple availability zones. 

The last step in this process is to create a virtual machine. Instead of specifying an availability set, specify the virtual machine scale set. Optionally, you can specify the availability zone or fault domain in which you wish to place the VM. 


## Migrate existing Availability Set VMs 

There is currently no automated tooling to directly move existing instances in an Availability Set to a virtual machine scale set. However, there are several strategies you can utilize to migrate existing instances to a Flexible scale set: 

### Blue/Green or Side by side migration 

1. Bring up new scale set virtual machine instances with similar configuration into the same resource group, virtual network, load balancer, etc as the VMs in the availability 
1. Migrate data, network traffic, etc to use the new scale set instances 
1. Deallocate or remove the original Availability Set virtual machines, leaving the scale set VMs running for your application

### Replace VM Instances 

1. Note the parameters you want to keep from the virtual machine (name, NIC id, OS and data disk IDs, VM configuration settings, fault domain placement, etc) 
1. Delete the availability set virtual machine. The NICs and disks for the VM will not be deleted  
1. Create a new virtual machine object, using the parameters from the original VM 
    1. NIC id 
    1. OS and Data disks 
    1. Fault domain placement 
    1. Other VM settings 


## Update Uniform scale sets deployment templates and scripts

Update Uniform virtual machine scale sets deployment templates and scripts to use Flexible orchestration. Change the following elements in your templates to successfully complete the process. 

- Remove `LoadBalancerNATPool` (not valid for flex) 
- Remove overprovisioning parameter (not valid for flex) 
- Remove `upgradePolicy` (not valid for flex, yet) 
- Update compute API version to **2021-03-01** 
- Add orchestration mode `flexible` 
- `platformFaultDomainCount` required 
- `singlePlacementGroup`=false required 
- Add network API version to **2021-11-01** or higher 
- Set IP `configuration.properties.primary` to *true* (required for Outbound rules)


## Migrate existing Uniform scale sets 

There is currently no automated tooling to directly move existing instances or upgrade a Uniform scale set to a Flexible virtual machine scale set. However, here is a strategy you can utilize to migrate existing instances to a Flexible scale set:

### Blue/Green or Side by side migration 

1. Bring up new Flexible orchestration mode scale set with similar configuration into the same resource group, virtual network, load balancer, etc as the original scale set in Uniform orchestration mode
1. Migrate data, network traffic, etc to use the new scale set instances 
1. Scale down or remove the original Uniform scale set virtual machines, leaving the scale set virtual machines running for your application


## Flexible scale sets considerations 

Virtual machine scale sets with Flexible orchestration allows you to combine the scalability of [virtual machine scale sets in Uniform orchestration](../virtual-machine-scale-sets/overview.md) with the regional availability guarantees of availability sets. The following are key considerations when deciding to work with the Flexible orchestration mode. 

### Explicit Network Outbound Connectivity required 

In order to enhance default network security, Virtual machine scale sets with Flexible orchestration will require that instances created implicitly via the autoscaling profile have outbound connectivity defined explicitly through one of the following methods: 

- For most scenarios, we recommend [NAT Gateway attached to the subnet](../virtual-network/nat-gateway/tutorial-create-nat-gateway-portal.md).
- For scenarios with high security requirements or when using Azure Firewall or Network Virtual Appliance (NVA), you can specify a custom User Defined Route as next hop through firewall. 
- Instances are in the backend pool of a Standard SKU Azure Load Balancer. 
- Attach a Public IP Address to the instance network interface. 

With single instance VMs and Virtual machine scale sets with Uniform orchestration, outbound connectivity is provided automatically. 

Common scenarios that will require explicit outbound connectivity include: 

- Windows VM activation will require that you have defined outbound connectivity from the VM instance to the Windows Activation Key Management Service (KMS). See [Troubleshoot Windows VM activation problems](/troubleshoot/azure/virtual-machines/troubleshoot-activation-problems) for more information.  
- Access to storage accounts or Key Vault. Connectivity to Azure services can also be established via [Private Link](../private-link/private-link-overview.md). 

See [Default outbound access in Azure](https://aka.ms/defaultoutboundaccess) for more details on defining secure outbound connections.

> [!IMPORTANT]
> Confirm that you have explicit outbound network connectivity. Learn more about this in [virtual networks and virtual machines in Azure](../virtual-network/network-overview.md) and make sure you are following Azure's networking [best practices](../virtual-network/concepts-and-best-practices.md). 


### Assign fault domain during VM creation
You can choose the number of fault domains for the Flexible orchestration scale set. By default, when you add a VM to a Flexible scale set, Azure evenly spreads instances across fault domains. While it is recommended to let Azure assign the fault domain, for advanced or troubleshooting scenarios you can override this default behavior and specify the fault domain where the instance will land.

```azurecli-interactive
az vm create –vmss "myVMSS"  –-platform_fault_domain 1
```

### Instance naming
When you create a VM and add it to a Flexible scale set, you have full control over instance names within the Azure Naming convention rules. When VMs are automatically added to the scale set via autoscaling, you provide a prefix and Azure appends a unique number to the end of the name. 

### List scale sets VM API changes
Virtual Machine Scale Sets allows you to list the instances that belong to the scale set. With Flexible orchestration, the list Virtual Machine Scale Sets VM command provides a list of scale sets VM IDs. You can then call the GET Virtual Machine Scale Sets VM commands to get more details on how the scale set is working with the VM instance. To get the full details of the VM, use the standard GET VM commands or [Azure Resource Graph](../governance/resource-graph/overview.md).


### Query instances for power state
The preferred method is to use Azure Resource Graph to query for all VMs in a Virtual Machine Scale Set. Azure Resource Graph provides efficient query capabilities for Azure resources at scale across subscriptions.

```
| where type =~ 'Microsoft.Compute/virtualMachines'
| where properties.virtualMachineScaleSet contains "demo"
| extend powerState = properties.extended.instanceView.powerState.code
| project name, resourceGroup, location, powerState
| order by resourceGroup desc, name desc
```

Querying resources with [Azure Resource Graph](../governance/resource-graph/overview.md) is a convenient and efficient way to query Azure resources and minimizes API calls to the resource provider. Azure Resource Graph is an eventually consistent cache where new or updated resources may not be reflected for up to 60 seconds. You can:
- List VMs in a resource group or subscription.
- Use the expand option to retrieve the instance view (fault domain assignment, power and provisioning states) for all VMs in your subscription.
- Use the Get VM API and commands to get model and instance view for a single instance.


### Scale sets VM Batch operations
Use the standard VM commands to start, stop, restart, delete instances, instead of the Virtual Machine Scale Set VM APIs. The Virtual Machine Scale Set VM Batch operations (start all, stop all, reimage all, etc.) are not used with Flexible orchestration mode.


### Monitor application health
Application health monitoring allows your application to provide Azure with a heartbeat to determine whether your application is healthy or unhealthy. Azure can automatically replace VM instances that are unhealthy. For Flexible scale set instances, you must install and configure the Application Health Extension on the virtual machine. For Uniform scale set instances, you can use either the Application Health Extension, or measure health with an Azure Load Balancer Custom Health Probe.


### Retrieve boot diagnostics data
Use the standard VM APIs and commands to retrieve instance Boot Diagnostics data and screenshots. The Virtual Machine Scale Sets VM boot diagnostic APIs and commands are not used with Flexible orchestration mode instances.


### VM extensions
Use extensions targeted for standard virtual machines, instead of extensions targeted for Uniform orchestration mode instances.
















## Next steps
> [!div class="nextstepaction"]
> [Compare the API differences between Uniform and Flexible orchestration modes.](../virtual-machine-scale-sets/orchestration-modes-api-comparison.md)