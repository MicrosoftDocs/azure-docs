---
title: Orchestration modes for Virtual Machine Scale Sets in Azure
description: Learn how to use Flexible and Uniform orchestration modes for Virtual Machine Scale Sets in Azure.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.date: 11/22/2022
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Orchestration modes for Virtual Machine Scale Sets in Azure

Virtual Machines Scale Sets provide a logical grouping of platform-managed virtual machines. With scale sets, you create a virtual machine configuration model, automatically add or remove additional instances based on CPU or memory load, and automatically upgrade to the latest OS version. Traditionally, scale sets allow you to create virtual machines using a VM configuration model provided at the time of scale set creation, and the scale set can only manage virtual machines that are implicitly created based on the configuration model. 

Scale set orchestration modes allow you to have greater control over how virtual machine instances are managed by the scale set.

> [!IMPORTANT]
> The orchestration mode is defined when you create the scale set and cannot be changed or updated later.

## Scale sets with Uniform orchestration

Optimized for large-scale stateless workloads with identical instances.

Virtual Machine Scale Sets with Uniform orchestration use a virtual machine profile or template to scale up to desired capacity. While there is some ability to manage or customize individual virtual machine instances, Uniform uses identical VM instances. Individual Uniform VM instances are exposed via the Virtual Machine Scale Set VM API commands. Individual instances aren't compatible with the standard Azure IaaS VM API commands, Azure management features such as Azure Resource Manager resource tagging RBAC permissions, Azure Backup, or Azure Site Recovery. Uniform orchestration provides fault domain high availability guarantees when configured with fewer than 100 instances. Uniform orchestration is generally available and supports a full range of scale set management and orchestration, including metrics-based autoscaling, instance protection, and automatic OS upgrades.


## Scale sets with Flexible orchestration

Achieve high availability at scale with identical or multiple virtual machine types.

With Flexible orchestration, Azure provides a unified experience across the Azure VM ecosystem. Flexible orchestration offers high availability guarantees (up to 1000 VMs) by spreading VMs across fault domains in a region or within an Availability Zone. This enables you to scale out your application while maintaining fault domain isolation that is essential to run quorum-based or stateful workloads, including:
- Quorum-based workloads
- Open-Source databases
- Stateful applications
- Services that require High Availability and large scale
- Services that want to mix virtual machine types or Spot and on-demand VMs together
- Existing Availability Set applications


## What has changed with Flexible orchestration mode?

One of the main advantages of Flexible orchestration is that it provides orchestration features over standard Azure IaaS VMs, instead of scale set child virtual machines. This means you can use all of the standard VM APIs when managing Flexible orchestration instances, instead of the Virtual Machine Scale Set VM APIs you use with Uniform orchestration. There are several differences between managing instances in Flexible orchestration versus Uniform orchestration. In general, we recommend that you use the standard Azure IaaS VM APIs when possible. In this section, we highlight examples of best practices for managing VM instances with Flexible orchestration.

Flexible orchestration mode can be used with all VM sizes. Flexible orchestration mode provides the highest scale and configurability for VM sizes that support memory preserving updates or live migration such as when using the B, D, E and F-series or when the scale set is configured for maximum spreading between instances `platformFaultDomainCount=1`. Currently, the Flexible orchestration mode has additional constraints for VM sizes that don't support memory preserving updates including the G, H, L, M, and N-series VMs and instances are spread across multiple fault domains. You can use the Compute Resource SKUs API to determine whether a specific VM SKU support memory preserving updates. 

 
| Feature | Memory Preserving Updates Supported **or** Scale set with Max Spreading (`platformFaultDomainCount=1`) | Memory Preserving Updates Not Supported **and** Fixed Spreading (`platformFaultDomainCount > 1`) | 
|---|---|---|
|Maximum Virtual Machine Scale Sets Instance Count | 1000 | 200 | 
| Mix operating systems | Yes | Yes |
| Mix Spot and On-demand instances | Yes | No | 
| Mix General Purpose and Specialty SKU Types | Yes (`FDCount = 1`) | No | 
| Maximum Fault Domain Count | Regional – 3 (depending on the regional fault domain max count) <br> Zonal – 1  | Regional – 3 <br> Zonal – 1  |
| Spread instances across zones | Yes | Yes | 
| Assign VM to a Specific Zone | Yes | Yes | 
| Assign VM to a Specific Fault domain | Yes | No | 
| Update Domains | No | No | 
| Single Placement Group | Optional. This will be set to false based on first VM deployed | Optional. This will be set to true based on first VM deployed | 

### Scale out with standard Azure virtual machines

Virtual Machine Scale Sets in Flexible Orchestration mode manage standard Azure VMs. You have full control over the virtual machine lifecycle, as well as network interfaces and disks using the standard Azure APIs and commands. Virtual machines created with Uniform orchestration mode are exposed and managed via the Virtual Machine Scale Set VM API commands. Individual instances aren't compatible with the standard Azure IaaS VM API commands, Azure management features such as Azure Resource Manager resource tagging RBAC permissions, Azure Backup, or Azure Site Recovery.

### Assign fault domain during VM creation

You can choose the number of fault domains for the Flexible orchestration scale set. By default, when you add a VM to a Flexible scale set, Azure evenly spreads instances across fault domains. While it is recommended to let Azure assign the fault domain, for advanced or troubleshooting scenarios you can override this default behavior and specify the fault domain where the instance will land.

```azurecli-interactive
az vm create –vmss "myVMSS"  –-platform-fault-domain 1
```

### Instance naming

When you create a VM and add it to a Flexible scale set, you have full control over instance names within the Azure Naming convention rules. When VMs are automatically added to the scale set via autoscaling, you provide a prefix and Azure appends a unique number to the end of the name.

### Query instances for power state

The preferred method is to use Azure Resource Graph to query for all VMs in a Virtual Machine Scale Set. Azure Resource Graph provides efficient query capabilities for Azure resources at scale across subscriptions.

```
resources
| where type =~ 'Microsoft.Compute/virtualMachines'
| where properties.virtualMachineScaleSet.id contains "demo"
| extend powerState = properties.extended.instanceView.powerState.code
| project name, resourceGroup, location, powerState
| order by resourceGroup desc, name desc
```

Querying resources with [Azure Resource Graph](../governance/resource-graph/overview.md) is a convenient and efficient way to query Azure resources and minimizes API calls to the resource provider. Azure Resource Graph is an eventually consistent cache where new or updated resources may not be reflected for up to 60 seconds. You can:
- List VMs in a resource group or subscription.
- Use the expand option to retrieve the instance view (fault domain assignment, power and provisioning states) for all VMs in your subscription.
- Use the Get VM API and commands to get model and instance view for a single instance.

### Monitor application health

Application health monitoring allows your application to provide Azure with a heartbeat to determine whether your application is healthy or unhealthy. Azure can automatically replace VM instances that are unhealthy. For Flexible scale set instances, you must install and configure the Application Health Extension on the virtual machine. For Uniform scale set instances, you can use either the Application Health Extension, or measure health with an Azure Load Balancer Custom Health Probe.

### List scale sets VM API changes

Virtual Machine Scale Sets allows you to list the instances that belong to the scale set. With Flexible orchestration, the list Virtual Machine Scale Sets VM command provides a list of scale sets VM IDs. You can then call the GET Virtual Machine Scale Sets VM commands to get more details on how the scale set is working with the VM instance. To get the details for many VMs in the scale set, use [Azure Resource Graph](../governance/resource-graph/overview.md) or the standard List VM API and commands. Use the standard GET VM API and commands to get information on a single instance.

### Retrieve boot diagnostics data

Use the standard VM APIs and commands to retrieve instance Boot Diagnostics data and screenshots. The Virtual Machine Scale Sets VM boot diagnostic APIs and commands aren't used with Flexible orchestration mode instances.

### VM extensions

Use extensions targeted for standard virtual machines, instead of extensions targeted for Uniform orchestration mode instances.





## A comparison of Flexible, Uniform, and availability sets

The following table compares the Flexible orchestration mode, Uniform orchestration mode, and Availability Sets by their features.

### Basic setup

| Feature | Supported by Flexible orchestration for scale sets | Supported by Uniform orchestration for scale sets | Supported by Availability Sets |
|---|---|---|---|
| Virtual machine type  | Standard Azure IaaS VM (Microsoft.compute/virtualmachines)  | Scale Set specific VMs (Microsoft.compute/virtualmachinescalesets/virtualmachines)  | Standard Azure IaaS VM (Microsoft.compute/virtualmachines) |
|Minimum API Version Required|2021-03-01|2015-06-01|2015-06-01|
| Maximum Instance Count (with FD guarantees)  | 1000  | 100  | 200 |
| SKUs supported  | All SKUs | All SKUs  | All SKUs |
| Full control over VM, NICs, Disks  | Yes  | Limited control with Virtual Machine Scale Sets VM API  | Yes  |
| RBAC Permissions Required  | Compute Virtual Machine Scale Sets Write, Compute VM Write, Network | Compute Virtual Machine Scale Sets Write  | N/A |
| Cross tenant shared image gallery | Yes | Yes | Yes |
| Accelerated networking  | Yes  | Yes  | Yes |
| Spot instances and pricing   | Yes, you can have both Spot and Regular priority instances  | Yes, instances must either be all Spot or all Regular  | No, Regular priority instances only |
| Mix operating systems  | Yes, Linux and Windows can reside in the same Flexible scale set  | No, instances are the same operating system  | Yes, Linux and Windows can reside in the same availability set |
| Disk Types  | Managed disks only, all storage types  | Managed and unmanaged disks  | Managed and unmanaged disks. Ultradisk not supported |
| Disk Server Side Encryption with Customer Managed Keys | Yes | Yes | Yes |
| Write Accelerator   | Yes  | Yes  | Yes |
| Proximity Placement Groups   | Yes, when using one Availability Zone or none. Cannot be changed after deployment. Read [Proximity Placement Groups documentation](../virtual-machine-scale-sets/proximity-placement-groups.md) | Yes, when using one Availability Zone or none. Can be changed after deployment stopping all instances. Read [Proximity Placement Groups documentation](../virtual-machine-scale-sets/proximity-placement-groups.md) | Yes |
| Azure Dedicated Hosts   | Yes  | Yes  | Yes |
| Managed Identity  | [User Assigned Identity](../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vmss.md#user-assigned-managed-identity) only<sup>1</sup>  | System Assigned or User Assigned  | N/A (can specify Managed Identity on individual instances) |
| Add/remove existing VM to the group  | No  | No  | No |
| Service Fabric  | No  | Yes  | No |
| Azure Kubernetes Service (AKS) / AKE  | No  | Yes  | No |
| UserData  | Yes | Yes  | UserData can be specified for individual VMs |
| Option to delete or retain VM NIC and Disks | Yes | No (always delete) | Yes |
| Ultra Disks | Yes | Yes | No |

<sup>1</sup> For Uniform scale sets, the `GET VMSS` response will have a reference to the *identity*, *clientID*, and *principalID*. For Flexible scale sets, the response will only get a reference the *identity*. You can make a call to `Identity` to get the *clientID* and *PrincipalID*. 

### Autoscaling and instance orchestration

| Feature | Supported by Flexible orchestration for scale sets | Supported by Uniform orchestration for scale sets | Supported by Availability Sets |
|---|---|---|---|
| List VMs in Set | Yes | Yes | Yes, list VMs in AvSet |
| Automatic Scaling (manual, metrics based, schedule based) | Yes | Yes | No |
| Auto-Remove NICs and Disks when deleting VM instances | Yes | Yes | No |
| Upgrade Policy (Virtual Machine Scale Set) | No, upgrade policy must be null or [] during create | Automatic, Rolling, Manual | N/A |
| Automatic OS Updates (Virtual Machine Scale Set) | No | Yes | N/A |
| In Guest Security Patching | Yes, read [Auto VM Guest Patching](../virtual-machines/automatic-vm-guest-patching.md) | No | Yes |
| Terminate Notifications (Virtual Machine Scale Set) | Yes, read [Terminate Notifications documentation](../virtual-machine-scale-sets/virtual-machine-scale-sets-terminate-notification.md) | Yes, read [Terminate Notifications documentation](../virtual-machine-scale-sets/virtual-machine-scale-sets-terminate-notification.md) | N/A |
| Monitor Application Health | Application health extension | Application health extension or Azure load balancer probe | Application health extension |
| Instance Repair (Virtual Machine Scale Set) | Yes, read [Instance Repair documentation](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-instance-repairs.md) | Yes, read [Instance Repair documentation](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-instance-repairs.md) | N/A |
| Instance Protection | No, use [Azure resource lock](../azure-resource-manager/management/lock-resources.md) | Yes | No |
| Scale In Policy | Yes | Yes | No |
| VMSS Get Instance View | No | Yes | N/A |
| VM Batch Operations (Start all, Stop all, delete subset, etc.) | Yes | Yes | No |

### High availability 

| Feature | Supported by Flexible orchestration for scale sets | Supported by Uniform orchestration for scale sets | Supported by Availability Sets |
|---|---|---|---|
| Availability SLA | 99.95% for instances spread across fault domains; 99.99% for instances spread across multiple zones | 99.95% for FD>1 in Single Placement Group; 99.99% for instances spread across multiple zones | 99.95% |
| Availability Zones | Specify instances land across 1, 2 or 3 availability zones | Specify instances land across 1, 2 or 3 availability zones | Not supported |
| Assign VM to a Specific Availability Zone | Yes | No | No |
| Fault Domain – Max Spreading (Azure will maximally spread instances) | Yes | Yes | No |
| Fault Domain – Fixed Spreading | 2-3 FDs (depending on regional maximum FD Count); 1 for zonal deployments | 2, 3, 5 FDs; 1, 5 for zonal deployments | 2-3 FDs (depending on regional maximum FD Count) |
| Assign VM to a Specific Fault Domain | Yes | No | No |
| Update Domains | Depreciated (platform maintenance performed FD by FD) | 5 update domains | Up to 20 update domains |
| Perform Maintenance | Trigger maintenance on each instance using VM API | Yes | N/A |
| [Capacity Reservation](../virtual-machines/capacity-reservation-overview.md) | Yes | Yes | Yes |

### Networking 

| Feature | Supported by Flexible orchestration for scale sets | Supported by Uniform orchestration for scale sets | Supported by Availability Sets |
|---|---|---|---|
| Default outbound connectivity | No, must have [explicit outbound connectivity](../virtual-network/ip-services/default-outbound-access.md) | Yes | Yes |
| Azure Load Balancer Standard SKU | Yes | Yes | Yes |
| Application Gateway | Yes | Yes | Yes |
| Infiniband Networking | No | Yes, single placement group only | Yes |
| Basic LB | No | Yes | Yes |
| Network Port Forwarding | Yes (NAT Rules for individual instances) | Yes (NAT Pool) | Yes (NAT Rules for individual instances) |

### Backup and recovery 

| Feature | Supported by Flexible orchestration for scale sets | Supported by Uniform orchestration for scale sets | Supported by Availability Sets |
|---|---|---|---|
| Azure Backup  | Yes | No | Yes |
| Azure Site Recovery | Yes (via PowerShell) | No | Yes |
| Azure Alerts  | Yes | Yes | Yes |
| VM Insights  | Can be installed into individual VMs | Yes | Yes |





### Unsupported parameters

The following Virtual Machine Scale Set parameters aren't currently supported with Virtual Machine Scale Sets in Flexible orchestration mode:
- Single placement group - this can be set to `null` and the platform will select the correct value
- Ultra disk configuration: `diskIOPSReadWrite`, `diskMBpsReadWrite`
- Virtual Machine Scale Set Overprovisioning
- Image-based Automatic OS Upgrades
- Application health via SLB health probe - use Application Health Extension on instances
- Virtual Machine Scale Set upgrade policy - must be null or empty
- Unmanaged disks
- Virtual Machine Scale Set Instance Protection
- Basic Load Balancer
- Port Forwarding via Standard Load Balancer NAT Pool - you can configure NAT rules
- System assigned Managed Identity - Use User assigned Managed Identity instead

## Get started with Flexible orchestration mode

Register and get started with [Flexible orchestration mode](..\virtual-machines\flexible-virtual-machine-scale-sets.md) for your Virtual Machine Scale Sets. 





## Frequently asked questions

- **How much scale does Flexible orchestration support?**

    You can add up to 1000 VMs to a scale set in Flexible orchestration mode.

- **How does availability with Flexible orchestration compare to Availability Sets or Uniform orchestration?**

    | Availability attribute  | Flexible orchestration  | Uniform orchestration  | Availability Sets  |
    |-|-|-|-|
    | Deploy across availability zones  | Yes  | Yes  | No  |
    | Fault domain availability guarantees within a region  | Yes, up to 1000 instances can be spread across up to 3 fault domains in the region. Maximum fault domain count varies by region  | Yes, up to 100 instances  | Yes, up to 200 instances  |
    | Placement groups  | N/A  | You can choose Single Placement Group or Multiple Placement Groups | N/A  |
    | Update domains  | None, maintenance or host updates are done fault domain by fault domain  | Up to 5 update domains  | Up to 20 update domains  |

- **What is the absolute max instance count with guaranteed fault domain availability?**

    | Feature  | Supported by Flexible orchestration  | Supported by Uniform orchestration (General Availability)  | Supported by AvSets (General Availability)  |
    |-|-|-|-|
    | Maximum Instance Count (with FD availability guarantee)  | 1000  | 3000  | 200  |

## Next steps

> [!div class="nextstepaction"]
> [Learn how to deploy your application on scale set.](virtual-machine-scale-sets-deploy-app.md)




