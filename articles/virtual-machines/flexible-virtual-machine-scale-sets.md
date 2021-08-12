---
title: Flexible orchestration for virtual machine scale sets in Azure
description: Learn how to use Flexible orchestration mode for virtual machine scale sets in Azure.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: flexible-scale-sets
ms.date: 08/11/2021
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Preview: Flexible orchestration for virtual machine scale sets in Azure

**Applies to:** :heavy_check_mark: Flexible scale sets

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


> [!IMPORTANT]
> Virtual machine scale sets in Flexible orchestration mode is currently in public preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


> [!CAUTION]
> The orchestration mode is defined when you create the scale set and cannot be changed or updated later.


## Register for Flexible orchestration mode
Before you can deploy virtual machine scale sets in Flexible orchestration mode, you must first register your subscription for the preview feature. The registration may take several minutes to complete. You can use Azure portal, Azure PowerShell, or Azure CLI to register.

### Azure portal

1. Log into the Azure portal at https://portal.azure.com.
1. Go to your **Subscriptions**.
1. Navigate to the details page for the subscription you would like to create a scale set in Flexible orchestration mode by selecting the name of the subscription.
1. In the menu under **Settings**, select **Preview features**.
1. Select the four orchestrator features to enable: *VMOrchestratorSingleFD*, *VMOrchestratorMultiFD*, *VMScaleSetFlexPreview*, and *SkipPublicIpWriteRBACCheckForVMNetworkInterfaceConfigurationsPublicPreview*.
1. Select **Register**.

Once the features have been registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider. 

1. In the menu under **Settings**, select **Resource providers**.
1. Select `Microsoft.compute`.
1. Select **Re-register**.


### Azure PowerShell
Use the [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) cmdlet to enable the preview for your subscription.

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName VMOrchestratorMultiFD -ProviderNamespace Microsoft.Compute `
Register-AzProviderFeature -FeatureName VMOrchestratorSingleFD -ProviderNamespace Microsoft.Compute `
Register-AzProviderFeature -FeatureName VMScaleSetFlexPreview -ProviderNamespace Microsoft.Compute `
Register-AzProviderFeature -FeatureName SkipPublicIpWriteRBACCheckForVMNetworkInterfaceConfigurationsPublicPreview -ProviderNamespace Microsoft.Compute
```

Feature registration can take up to 15 minutes. To check the registration status:

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName VMOrchestratorMultiFD -ProviderNamespace Microsoft.Compute
```

### Azure CLI 2.0
Use [az feature register](/cli/azure/feature#az_feature_register) to enable the preview for your subscription.

```azurecli-interactive
az feature register --namespace Microsoft.Compute --name VMOrchestratorMultiFD
az feature register --namespace microsoft.compute --name VMOrchestratorSingleFD
az feature register --namespace Microsoft.Compute --name VMScaleSetFlexPreview 
az feature register --namespace Microsoft.Compute --name SkipPublicIpWriteRBACCheckForVMNetworkInterfaceConfigurationsPublicPreview
```

Feature registration can take up to 15 minutes. To check the registration status:

```azurecli-interactive
az feature show --namespace Microsoft.Compute --name VMOrchestratorMultiFD
```


## Get started with Flexible orchestration mode

Get started with Flexible orchestration mode for your scale sets through the [Azure portal](flexible-virtual-machine-scale-sets-portal.md), [Azure CLI](flexible-virtual-machine-scale-sets-cli.md), [Azure PowerShell](flexible-virtual-machine-scale-sets-powershell.md), or [REST API](flexible-virtual-machine-scale-sets-rest-api.md). 


## Add instances manually or with autoscaling 
Virtual machine scale sets with Flexible orchestration works as a thin orchestration layer to manage multiple VMs. There are two ways you can add VMs to be managed by the scale set:

1. **Manual scaling (recommended)**

    When you create the scale set with Flexible orchestration, define a VM profile or template which describes the template to be used to scale out. You can then set the capacity parameter to increase or decrease the number of VM instances managed by the scale set. 

1. **Autoscaling with Metrics or Schedule** 

    Alternatively, you can set up autoscale rules to increase or decrease the capacity based on metrics or a schedule. See [Flexible virtual machine scale sets with Autoscaling](flexible-virtual-machine-scale-sets-autoscaling.md). 


## Explicit Network Outbound Connectivity required 

In order to enhance default network security, Virtual machine scale sets with Flexible orchestration will require that instances created implicitly via the autoscaling profile have outbound connectivity defined explicitly through one of the following methods: 

- For most scenarios, we recommend [NAT Gateway attached to the subnet](https://docs.microsoft.com/azure/virtual-network/nat-gateway/tutorial-create-nat-gateway-portal).
- For scenarios with high security requirements or when using Azure Firewall or Network Virtual Appliance (NVA), you can specify a custom User Defined Route as next hop through firewall. 
- Instances are in the backend pool of a Standard SKU Azure Load Balancer. 
- Attach a Public IP Address to the instance network interface. 

With single instance VMs and Virtual machine scale sets with Uniform orchestration, outbound connectivity is provided automatically. 

Common scenarios that will require explicit outbound connectivity include: 

- Windows VM activation will require that you have defined outbound connectivity from the VM instance to the Windows Activation Key Management Service (KMS). See [Troubleshoot Windows VM activation problems](https://docs.microsoft.com/troubleshoot/azure/virtual-machines/troubleshoot-activation-problems) for more information.  
- Access to storage accounts or Key Vault. Connectivity to Azure services can also be established via [Private Link](https://docs.microsoft.com/azure/private-link/private-link-overview). 

See [Default outbound access in Azure](https://aka.ms/defaultoutboundaccess) for more details on defining secure outbound connections.


## Specify a scale set when creating a VM
When you create a VM, you can optionally specify that it is added to a virtual machine scale set. A VM can only be added to a scale set at time of VM creation.


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
The following table lists the Flexible orchestration mode features and links to the appropriate documentation.

| Feature | Supported by Flexible orchestration (Preview) |
|-|-|
| Virtual machine type | Standard Azure IaaS VM (Microsoft.compute /virtualmachines) |
| Maximum Instance Count | 1000 |
| SKUs supported | D series, E series, F series, A series, B series, Intel, AMD |
| Availability Zones | Optionally specify all instances land in   a single availability zone |
| Fault Domain - Max spreading (Azure will maximally spread instances) | Yes |
| Fault Domain - Fixed spreading | 2-3 FDs (depending on regional maximum FD Count), 1 FD for zonal deployments |
| Update Domains | None (platform maintenance performed FD by FD) |
| Availability SLA | None (during preview) |
| Full control over VM, NICs, Disks | Yes |
| Assign VM to a Specific Fault Domain | Yes |
| Accelerated networking | No (during preview) |
| In Guest Security Patching | Yes |
| Spot instances and pricing  | Yes, you can have both Spot and Regular priority instances |
| Mix operating systems | Yes, Linux and Windows can reside in the same Flexible scale set |
| Monitor Application Health | Application health extension |
| UltraSSD Disks  | Yes |
| Proximity Placement Groups  | Yes, read [Proximity Placement Groups documentation](../virtual-machine-scale-sets/proximity-placement-groups.md) |
| Azure Load Balancer Standard SKU | Yes |
| List VMs in Set | Yes |
| Azure Backup | Yes |
| Terminate Notifications (VM scale sets) | Yes, read [Terminate Notifications documentation](../virtual-machine-scale-sets/virtual-machine-scale-sets-terminate-notification.md) |
| Instance Repair (VM scale sets) | Yes, read [Instance Repair documentation](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-instance-repairs.md) |
| Automatic Scaling | Yes |
| Remove NICs and Disks when deleting VM instances | Yes |
| Upgrade Policy (VM scale sets) | No |
| Automatic OS Updates (VM scale sets) | No |
| Infiniband  | No |
| Write Accelerator  | No |
| Azure Dedicated Hosts  | No |
| Basic SLB  | No |
| Application Gateway | Yes |
| Maintenance Control  | No |
| Azure Alerts | No |
| VM Insights | No |
| Azure Site Recovery |  Yes, via PowerShell |
| Add/remove existing VM to the group | No |
| Service Fabric | No |
| Azure Kubernetes Service (AKS) | No |



## Troubleshoot scale sets with Flexible orchestration
Find the right solution to your troubleshooting scenario.

<!-- error -->
### InvalidParameter. The value 'False' of parameter 'singlePlacementGroup' is not allowed. Allowed values are: True

```
InvalidParameter. The value 'False' of parameter 'singlePlacementGroup' is not allowed. Allowed values are: True
```

**Cause:** The subscription is not registered for the Flexible orchestration mode Public Preview.

**Solution:** Follow the instructions above to register for the Flexible orchestration mode Public Preview.

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
**Cause:** The subscription is registered for the Flexible orchestration mode preview; however, the `singlePlacementGroup` parameter is set to *True*.

**Solution:** The `singlePlacementGroup` must be set to *False*.


## Next steps
> [!div class="nextstepaction"]
> [Flexible orchestration mode for your scale sets with Azure portal.](flexible-virtual-machine-scale-sets-portal.md)
