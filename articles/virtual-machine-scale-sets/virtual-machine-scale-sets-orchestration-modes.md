---
title: Orchestration modes for virtual machine scale sets in Azure
description: Learn how to use Flexible and Uniform orchestration modes for virtual machine scale sets in Azure.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.date: 08/04/2021
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Preview: Orchestration modes for virtual machine scale sets in Azure

Virtual Machines Scale Sets provide a logical grouping of platform-managed virtual machines. With scale sets, you create a virtual machine configuration model, automatically add or remove additional instances based on CPU or memory load, and automatically upgrade to the latest OS version. Traditionally, scale sets allow you to create virtual machines using a VM configuration model provided at the time of scale set creation, and the scale set can only manage virtual machines that are implicitly created based on the configuration model.

Scale set orchestration modes allow you to have greater control over how virtual machine instances are managed by the scale set.

> [!IMPORTANT]
> The orchestration mode is defined when you create the scale set and cannot be changed or updated later.


## Scale sets with Uniform orchestration
Optimized for large-scale stateless workloads with identical instances.

Virtual machine scale sets with Uniform orchestration use a virtual machine profile or template to scale up to desired capacity. While there is some ability to manage or customize individual virtual machine instances, Uniform uses identical VM instances. Individual Uniform VM instances are exposed via the virtual machine scale set VM API commands. Individual instances are not compatible with the standard Azure IaaS VM API commands, Azure management features such as Azure Resource Manager resource tagging RBAC permissions, Azure Backup, or Azure Site Recovery. Uniform orchestration provides fault domain high availability guarantees when configured with fewer than 100 instances. Uniform orchestration is generally available and supports a full range of scale set management and orchestration, including metrics-based autoscaling, instance protection, and automatic OS upgrades.


## Scale sets with Flexible orchestration
Achieve high availability at scale with identical or multiple virtual machine types.

With Flexible orchestration, Azure provides a unified experience across the Azure VM ecosystem. Flexible orchestration offers high availability guarantees (up to 1000 VMs) by spreading VMs across fault domains in a region or within an Availability Zone. This enables you to scale out your application while maintaining fault domain isolation that is essential to run quorum-based or stateful workloads, including:
- Quorum-based workloads
- Open-Source databases
- Stateful applications
- Services that require High Availability and large scale
- Services that want to mix virtual machine types, or leverage Spot and on-demand VMs together
- Existing Availability Set applications

> [!IMPORTANT]
> Virtual machine scale sets in Flexible orchestration mode is currently in public preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## What has changed with Flexible orchestration mode?
One of the main advantages of Flexible orchestration is that it provides orchestration features over standard Azure IaaS VMs, instead of scale set child virtual machines. This means you can use all of the standard VM APIs when managing Flexible orchestration instances, instead of the virtual machine scale set VM APIs you use with Uniform orchestration. During the preview period, there are several differences between managing instances in Flexible orchestration versus Uniform orchestration. In general, we recommend that you use the standard Azure IaaS VM APIs when possible. In this section, we highlight examples of best practices for managing VM instances with Flexible orchestration.

### Assign fault domain during VM creation
You can choose the number of fault domains for the Flexible orchestration scale set. By default, when you add a VM to a Flexible scale set, Azure evenly spreads instances across fault domains. While it is recommended to let Azure assign the fault domain, for advanced or troubleshooting scenarios you can override this default behavior and specify the fault domain where the instance will land.

```azurecli-interactive
az vm create –vmss "myVMSS"  –-platform_fault_domain 1
```

### Instance naming
When you create a VM and add it to a Flexible scale set, you have full control over instance names within the Azure Naming convention rules. When VMs are automatically added to the scale set via autoscaling, you provide a prefix and Azure appends a unique number to the end of the name.

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

### List scale sets VM API changes
Virtual Machine Scale Sets allows you to list the instances that belong to the scale set. With Flexible orchestration, the list Virtual Machine Scale Sets VM command provides a list of scale sets VM IDs. You can then call the GET Virtual Machine Scale Sets VM commands to get more details on how the scale set is working with the VM instance. To get the full details of the VM, use the standard GET VM commands or [Azure Resource Graph](../governance/resource-graph/overview.md).

### Retrieve boot diagnostics data
Use the standard VM APIs and commands to retrieve instance Boot Diagnostics data and screenshots. The Virtual Machine Scale Sets VM boot diagnostic APIs and commands are not used with Flexible orchestration mode instances.

### VM extensions
Use extensions targeted for standard virtual machines, instead of extensions targeted for Uniform orchestration mode instances.


## A comparison of Flexible, Uniform, and Availability Sets
The following table compares the Flexible orchestration mode, Uniform orchestration mode, and Availability Sets by their features.

| Feature  | Supported by Flexible orchestration (Preview)  | Supported by Uniform orchestration (General Availability)  | Supported by AvSets (General Availability)  |
|-|-|-|-|
| Virtual machine type  | Standard Azure IaaS VM (Microsoft.compute /virtualmachines)  | Scale Set specific VMs (Microsoft.compute /virtualmachinescalesets/virtualmachines)  | Standard Azure IaaS VM (Microsoft.compute /virtualmachines)  |
| Maximum Instance Count  | 1000  | 3000 (1000 per Availability Zone)  | 200  |
| SKUs supported  | D series, E series, F series, A series, B series, Intel, AMD  | All SKUs  | All SKUs  |
| Availability Zones  | Optionally specify all instances land in a single availability zone  | Specify instances land across 1, 2 or 3 availability zones  | Not supported  |
| Fault Domain – Max Spreading (Azure will maximally spread instances)  | Yes  | Yes  | No  |
| Fault Domain – Fixed Spreading  | 2-3 FDs (depending on regional maximum); 1 for zonal deployments  | 2, 3, 5 FDs; 1, 5 for zonal deployments  | 2-3 FDs (depending on regional maximum)  |
| Update Domains  | None, platform maintenance performed FD by FD | 5 update domains  | Up to 20 update domains  |
| Availability SLA  | Not at this time  | 99.95% for FD>1 in Single Placement Group; 99.99% for instances spread across multiple zones  | 99.95%  |
| Full control over VM, NICs, Disks  | Yes  | Limited control with virtual machine scale sets VM API  | Yes  |
| Automatic Scaling (manual, metrics based, schedule based)  | Yes  | Yes  | No  |
| Assign VM to a Specific Fault Domain  | Yes  | No  | No  |
| Auto-Remove NICs and Disks when deleting VM instances  | Yes  | Yes  | No  |
| Upgrade Policy (VM scale sets)  | No, upgrade policy must be null or [] during create  | Automatic, Rolling, Manual  | N/A  |
| Automatic OS Updates (VM scale sets)  | No  | Yes  | N/A  |
| In Guest Security Patching  | Yes  | No  | Yes  |
| Terminate Notifications (VM scale sets)  | Yes  | Yes  | N/A  |
| Instance Repair (VM scale sets)  | Yes  | Yes  | N/A  |
| Accelerated networking  | Yes  | Yes  | Yes  |
| Spot instances and pricing   | Yes, you can have both Spot and Regular priority instances  | Yes, instances must either be all Spot or all Regular  | No, Regular priority instances only  |
| Mix operating systems  | Yes, Linux and Windows can reside in the same Flexible scale set  | No, instances are the same operating system  | Yes, Linux and Windows can reside in the same Flexible scale set  |
| Monitor Application Health  | Application health extension  | Application health extension or Azure Load balancer probe  | Application health extension  |
| UltraSSD Disks   | Yes  | Yes, for zonal deployments only  | No  |
| Infiniband   | No  | Yes, single placement group only  | Yes  |
| Write Accelerator   | No  | Yes  | Yes  |
| Proximity Placement Groups   | Yes  | Yes  | Yes  |
| Azure Dedicated Hosts   | No  | Yes  | Yes  |
| Basic SLB   | No  | Yes  | Yes  |
| Azure Load Balancer Standard SKU  | Yes  | Yes  | Yes  |
| Application Gateway  | Yes  | Yes  | Yes  |
| Maintenance Control   | No  | Yes  | Yes  |
| List VMs in Set  | Yes  | Yes  | Yes, list VMs in AvSet  |
| Azure Alerts  | No  | Yes  | Yes  |
| VM Insights  | No  | Yes  | Yes  |
| Azure Backup  | Yes  | No  | Yes  |
| Azure Site Recovery  | Yes (via Powershell)  | No  | Yes  |
| Add/remove existing VM to the group  | No  | No  | No  |
| Service Fabric  | No  | Yes  | No  |
| Azure Kubernetes Service (AKS) / AKE / k8s node pool  | No  | Yes  | No  |


## Get started with Flexible orchestration mode

Register and get started with [Flexible orchestration mode](..\virtual-machines\flexible-virtual-machine-scale-sets.md) for your virtual machine scale sets. 


## Frequently asked questions

**How much scale does Flexible orchestration support?**

You can add up to 1000 VMs to a scale set in Flexible orchestration mode.

**How does availability with Flexible orchestration compare to Availability Sets or Uniform orchestration?**

| Availability attribute  | Flexible orchestration  | Uniform orchestration  | Availability Sets  |
|-|-|-|-|
| Deploy across availability zones  | No  | Yes  | No  |
| Fault domain availability guarantees within a region  | Yes, up to 1000 instances can be spread across up to 3 fault domains in the region. Maximum fault domain count varies by region  | Yes, up to 100 instances  | Yes, up to 200 instances  |
| Placement groups  | Flexible mode always uses multiple placement groups (singlePlacementGroup = false)  | You can choose Single Placement Group or Multiple Placement Groups | N/A  |
| Update domains  | None, maintenance or host updates are done fault domain by fault domain  | Up to 5 update domains  | Up to 20 update domains  |


## Troubleshoot scale sets with Flexible orchestration
Find the right solution to your troubleshooting scenario.

```
InvalidParameter. The value 'False' of parameter 'singlePlacementGroup' is not allowed. Allowed values are: True
```

**Cause:** The subscription is not registered for the Flexible orchestration mode Public Preview.

**Solution:** Follow the instructions above to register for the Flexible orchestration mode Public Preview.

```
InvalidParameter. The specified fault domain count 2 must fall in the range 1 to 1.
```

**Cause:** The `platformFaultDomainCount` parameter is invalid for the region or zone selected.

**Solution:** You must select a valid `platformFaultDomainCount` value. For zonal deployments, the maximum `platformFaultDomainCount` value is 1. For regional deployments where no zone is specified, the maximum `platformFaultDomainCount` varies depending on the region. See [Manage the availability of VMs for scripts](../virtual-machines/availability.md) to determine the maximum fault domain count per region.

```
OperationNotAllowed. Deletion of Virtual Machine Scale Set is not allowed as it contains one or more VMs. Please delete or detach the VM(s) before deleting the Virtual Machine Scale Set.
```

**Cause:** Trying to delete a scale set in Flexible orchestration mode that is associated with one or more virtual machines.

**Solution:** Delete all of the virtual machines associated with the scale set in Flexible orchestration mode, then you can delete the scale set.

```
InvalidParameter. The value 'True' of parameter 'singlePlacementGroup' is not allowed. Allowed values are: False.
```
**Cause:** The subscription is registered for the Flexible orchestration mode preview; however, the `singlePlacementGroup` parameter is set to *True*.

**Solution:** The `singlePlacementGroup` must be set to *False*.


## Next steps
> [!div class="nextstepaction"]
> [Learn how to deploy your application on scale set.](virtual-machine-scale-sets-deploy-app.md)
