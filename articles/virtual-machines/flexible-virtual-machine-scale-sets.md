---
title: Flexible orchestration for virtual machine scale sets in Azure
description: Learn how to use Flexible orchestration mode for virtual machine scale sets in Azure.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: flexible-scale-sets
ms.date: 10/13/2021
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Flexible orchestration for virtual machine scale sets in Azure

**Applies to:** :heavy_check_mark: Flexible scale sets

> [!IMPORTANT]
> This article is about virtual machine scale sets in Flexible orchestration mode, which we recommend using for all new scale set deployments. To access information about Uniform scale sets, go to [virtual machine scale sets in Uniform orchestration mode](../virtual-machine-scale-sets/overview.md) documentation. 


Virtual machine scale sets with Flexible orchestration allows you to combine the scalability of [virtual machine scale sets](../virtual-machine-scale-sets/overview.md) with the regional availability guarantees of [availability sets](availability-set-overview.md).

Azure virtual machine scale sets let you create and manage a group of load balanced VMs. The number of VM instances can automatically increase or decrease in response to demand or a defined schedule. Scale sets provide the following key benefits:
- Easy to create and manage multiple VMs
- Provides high availability and application resiliency by distributing VMs across fault domains
- Allows your application to automatically scale as resource demand changes
- Works at large-scale

With Flexible orchestration, Azure provides a unified experience across the Azure VM ecosystem. Flexible orchestration offers high availability guarantees (up to 1000 VMs) by spreading VMs across fault domains in a region or within an Availability Zone. This enables you to scale out your application while maintaining fault domain isolation that is essential to run quorum-based or stateful workloads, including:
- Quorum-based workloads
- Open-source databases
- Stateful applications
- Services that require high availability and large scale
- Services that want to mix virtual machine types or leverage Spot and on-demand VMs together
- Existing Availability Set applications

Learn more about the differences between Uniform scale sets and Flexible scale sets in [Orchestration Modes](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md).

> [!CAUTION]
> The orchestration mode is defined when you create the scale set and cannot be changed or updated later.


## Why use virtual machine scale sets?
To provide redundancy and improved performance, applications are typically distributed across multiple instances. Customers may access your application through a load balancer that distributes requests to one of the application instances. If you need to perform maintenance or update an application instance, your customers must be distributed to another available application instance. To keep up with extra customer demand, you may need to increase the number of application instances that run your application.

Azure virtual machine scale sets provide the management capabilities for applications that run across many VMs, automatic scaling of resources, and load balancing of traffic. Scale sets provide the following key benefits:

- **Easy to create and manage multiple VMs**
    - When you have many VMs that run your application, it's important to maintain a consistent configuration across your environment. For reliable performance of your application, the VM size, disk configuration, and application installs should match across all VMs.
    - With scale sets, all VM instances are created from the same base OS image and configuration. This approach lets you easily manage hundreds of VMs without extra configuration tasks or network management.
    - Scale sets support the use of the [Azure load balancer](../load-balancer/load-balancer-overview.md) for basic layer-4 traffic distribution, and [Azure Application Gateway](../application-gateway/overview.md) for more advanced layer-7 traffic distribution and TLS termination.

- **Provides high availability and application resiliency**
    - Scale sets are used to run multiple instances of your application. If one of these VM instances has a problem, customers continue to access your application through one of the other VM instances with minimal interruption.
    - For more availability, you can use [Availability Zones](../availability-zones/az-overview.md) to automatically distribute VM instances in a scale set within a single datacenter or across multiple datacenters.

- **Allows your application to automatically scale as resource demand changes**
    - Customer demand for your application may change throughout the day or week. To match customer demand, scale sets can automatically increase the number of VM instances as application demand increases, then reduce the number of VM instances as demand decreases.
    - Autoscale also minimizes the number of unnecessary VM instances that run your application when demand is low, while customers continue to receive an acceptable level of performance as demand grows and additional VM instances are automatically added. This ability helps reduce costs and efficiently create Azure resources as required.

- **Works at large-scale**
    - Scale sets support up to 1,000 VM instances for standard marketplace images and custom images through the Shared Image Gallery. If you create a scale set using a managed image, the limit is 600 VM instances.
    - For the best performance with production workloads, use [Azure Managed Disks](../virtual-machines/managed-disks-overview.md).



## Get started with Flexible orchestration mode

Get started with Flexible orchestration mode for your scale sets through the [Azure portal](flexible-virtual-machine-scale-sets-portal.md), [Azure CLI](flexible-virtual-machine-scale-sets-cli.md), [Azure PowerShell](flexible-virtual-machine-scale-sets-powershell.md), or [ARM Template](flexible-virtual-machine-scale-sets-rest-api.md). 


## Add instances with autoscaling or manually
Virtual machine scale sets with Flexible orchestration works as a thin orchestration layer to manage multiple VMs. There are several ways you can add VMs to be managed by the scale set:

- **Set instance count**

    When you create the scale set with Flexible orchestration, define a VM profile or template which describes the template to be used to scale out. You can then set the capacity parameter to increase or decrease the number of VM instances managed by the scale set. 

- **Autoscaling with Metrics or Schedule** 

    Alternatively, you can set up autoscale rules to increase or decrease the capacity based on metrics or a schedule. See [Virtual machine scale sets with Autoscaling](..\virtual-machine-scale-sets\virtual-machine-scale-sets-autoscale-overview.md). 

- **Specify a scale set when creating a VM**

    When you create a VM, you can optionally specify that it is added to a virtual machine scale set. A VM can only be added to a scale set at time of VM creation. The newly created VM must be in the same resource group as the Flexible scale set regardless of deployment methods.

Flexible orchestration mode can be used with VM SKUs that support [memory preserving updates or live migration](../virtual-machines/maintenance-and-updates.md#maintenance-that-doesnt-require-a-reboot), which includes 90% of all IaaS VMs that are deployed in Azure. Broadly this includes general purpose size families such as B-, D-, E- and F-series VMs. Currently, the Flexible mode cannot orchestrate over VM SKUs or families which do not support memory preserving updates, including G-, H-, L-, M-, N- series VMs. You can use the [Compute Resource SKUs API](/rest/api/compute/resource-skus/list) to determine whether a specific VM SKU is supported.

```azurecli-interactive
az vm list-skus -l eastus --size standard_d2s_v3 --query "[].capabilities[].[name, value]" -o table
```

## Explicit Network Outbound Connectivity required 

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


## Assign fault domain during VM creation
You can choose the number of fault domains for the Flexible orchestration scale set. By default, when you add a VM to a Flexible scale set, Azure evenly spreads instances across fault domains. While it is recommended to let Azure assign the fault domain, for advanced or troubleshooting scenarios you can override this default behavior and specify the fault domain where the instance will land.

```azurecli-interactive
az vm create –vmss "myVMSS"  –-platform_fault_domain 1
```

## Instance naming
When you create a VM and add it to a Flexible scale set, you have full control over instance names within the Azure Naming convention rules. When VMs are automatically added to the scale set via autoscaling, you provide a prefix and Azure appends a unique number to the end of the name. 

## List scale sets VM API changes
Virtual Machine Scale Sets allows you to list the instances that belong to the scale set. With Flexible orchestration, the list Virtual Machine Scale Sets VM command provides a list of scale sets VM IDs. You can then call the GET Virtual Machine Scale Sets VM commands to get more details on how the scale set is working with the VM instance. To get the full details of the VM, use the standard GET VM commands or [Azure Resource Graph](../governance/resource-graph/overview.md).


## Query instances for power state
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


## Scale sets VM Batch operations
Use the standard VM commands to start, stop, restart, delete instances, instead of the Virtual Machine Scale Set VM APIs. The Virtual Machine Scale Set VM Batch operations (start all, stop all, reimage all, etc.) are not used with Flexible orchestration mode.


## Monitor application health
Application health monitoring allows your application to provide Azure with a heartbeat to determine whether your application is healthy or unhealthy. Azure can automatically replace VM instances that are unhealthy. For Flexible scale set instances, you must install and configure the Application Health Extension on the virtual machine. For Uniform scale set instances, you can use either the Application Health Extension, or measure health with an Azure Load Balancer Custom Health Probe.


## Retrieve boot diagnostics data
Use the standard VM APIs and commands to retrieve instance Boot Diagnostics data and screenshots. The Virtual Machine Scale Sets VM boot diagnostic APIs and commands are not used with Flexible orchestration mode instances.


## VM extensions
Use extensions targeted for standard virtual machines, instead of extensions targeted for Uniform orchestration mode instances.


## Features
The following tables list the Flexible orchestration mode features and links to the appropriate documentation.

### Basic Setup

| Feature | Supported by Flexible orchestration for scale sets |
|---|---|
| Virtual machine type  | Standard Azure IaaS VM (Microsoft.compute/virtualmachines)  |
| Maximum Instance Count  | 1000  |
| SKUs supported  | D series, E series, F series, A series, B series, Intel, AMD; Specialty SKUs (G, H, L, M, N) are not supported |
| Full control over VM, NICs, Disks  | Yes  |
| RBAC Permissions Required  | Compute VMSS Write, Compute VM Write, Network |
| Accelerated networking  | Yes  |
| Spot instances and pricing   | Yes, you can have both Spot and Regular priority instances  |
| Mix operating systems  | Yes, Linux and Windows can reside in the same Flexible scale set  |
| Disk Types  | Managed disks only, all storage types  |
| Write Accelerator   | No  |
| Proximity Placement Groups   | Yes, read [Proximity Placement Groups documentation](../virtual-machine-scale-sets/proximity-placement-groups.md) |
| Azure Dedicated Hosts   | No  |
| Managed Identity  | User Assigned Identity Only  |
| Add/remove existing VM to the group  | No  |
| Service Fabric  | No  |
| Azure Kubernetes Service (AKS) / AKE / k8s node pool  | No  |
| UserData  | Partial, UserData can be specified for individual VMs |


### Autoscaling and Instance Orchestration

| Feature | Supported by Flexible orchestration for scale sets |
|---|---|
| List VMs in Set | Yes |
| Automatic Scaling (manual, metrics based, schedule based) | Yes |
| Auto-Remove NICs and Disks when deleting VM instances | Yes |
| Upgrade Policy (VM scale sets) | No, upgrade policy must be null or [] during create |
| Automatic OS Updates (VM scale sets) | No |
| In Guest Security Patching | Yes |
| Terminate Notifications (VM scale sets) | Yes, read [Terminate Notifications documentation](../virtual-machine-scale-sets/virtual-machine-scale-sets-terminate-notification.md) |
| Monitor Application Health | Application health extension |
| Instance Repair (VM scale sets) | Yes, read [Instance Repair documentation](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-instance-repairs.md) |
| Instance Protection | No |
| Scale In Policy | No |
| VMSS Get Instance View | No |
| Perform Maintenance | No (can trigger maintenance on each instance using VM API) |
| VM Batch Operations (Start all, Stop all, delete subset, etc) | No (can trigger operations on each instance using VM API) |

### High Availability 

| Feature | Supported by Flexible orchestration for scale sets |
|---|---|
| Availability SLA | 99.95% |
| Availability Zones | Specify instances land across 1, 2 or 3 availability zones |
| Assign VM to a Specific Availability Zone | Yes |
| Fault Domain – Max Spreading (Azure will maximally spread instances) | Yes |
| Fault Domain – Fixed Spreading | 2-3 FDs (depending on regional maximum FD Count); 1 for zonal deployments |
| Assign VM to a Specific Fault Domain | Yes |
| Update Domains | None (platform maintenance performed FD by FD) |
| Maintenance Control | No |

### Networking 

| Feature | Supported by Flexible orchestration for scale sets |
|---|---|
| Default outbound connectivity | No, must have explicit outbound connectivity |
| Azure Load Balancer Standard SKU | Yes |
| Application Gateway | Yes |
| Infiniband Networking | No |
| Basic SLB | No |
| Network Port Forwarding | Yes (NAT Rules for individual instances) |

### Backup and Recovery 

| Feature | Supported by Flexible orchestration for scale sets |
|---|---|
| Azure Backup  | Yes |
| Azure Site Recovery | Yes (via Powershell) |
| Azure Alerts  | Yes |
| VM Insights  | No |


## Troubleshoot scale sets with Flexible orchestration
Find the right solution to your troubleshooting scenario.

<!-- error -->
### InvalidParameter. The specified fault domain count 2 must fall in the range 1 to 1.

```
InvalidParameter. The specified fault domain count 2 must fall in the range 1 to 1.
```

**Cause:** The `platformFaultDomainCount` parameter is invalid for the region or zone selected.

**Solution:** You must select a valid `platformFaultDomainCount` value. For zonal deployments, the maximum `platformFaultDomainCount` value is 1. For regional deployments where no zone is specified, the maximum `platformFaultDomainCount` varies depending on the region. See [Manage the availability of VMs for scripts](../virtual-machines/availability.md) to determine the maximum fault domain count per region.


<!-- error -->
### OperationNotAllowed. Deletion of Virtual Machine Scale Set is not allowed as it contains one or more VMs. Please delete or detach the VM(s) before deleting the Virtual Machine Scale Set.

```
OperationNotAllowed. Deletion of Virtual Machine Scale Set is not allowed as it contains one or more VMs. Please delete or detach the VM(s) before deleting the Virtual Machine Scale Set.
```

**Cause:** Trying to delete a scale set in Flexible orchestration mode that is associated with one or more virtual machines.

**Solution:** Delete all of the virtual machines associated with the scale set in Flexible orchestration mode, then you can delete the scale set.


<!-- error -->
### InvalidParameter. The value 'True' of parameter 'singlePlacementGroup' is not allowed. Allowed values are: False.

```
InvalidParameter. The value 'True' of parameter 'singlePlacementGroup' is not allowed. Allowed values are: False.
```
**Cause:** The `singlePlacementGroup` parameter is set to *True*.

**Solution:** The `singlePlacementGroup` must be set to *False*.


## Next steps
> [!div class="nextstepaction"]
> [Flexible orchestration mode for your scale sets with Azure portal.](flexible-virtual-machine-scale-sets-portal.md)