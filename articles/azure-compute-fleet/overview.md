---
title: Azure Compute Fleet overview
description: Learn about Azure Compute Fleet and how to accelerate your access to Azure's capacity.
author: rajeeshr
ms.author: rajeeshr
ms.topic: overview
ms.service: compute-fleet
ms.subservice:
ms.date: 05/07/2024
ms.reviewer: jushiman

---
# What is Azure Compute Fleet? (Preview)

> [!IMPORTANT]
> Azure Compute Fleet is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

Azure Compute Fleet is a new building block that allows you to accelerate access to Azure’s capacity in a region by launching a combination of VMs at the lowest price and highest capacity. There are be a number of ways you can use this product, whether by running a stateless web service, a big data cluster, and or continuous integration pipeline. Workloads such as financial risk analysis, log processing, or image rendering can benefit from the ability to run hundreds of concurrent core/instances.

Using Compute Fleet, you can:
- Deploy up to 10,000 VMs with a single API, using Spot and Pay-as-you-Go pricing models together.
- Get superior price-performance ratios by utilizing a blend of diverse pricing models, including Reserved Instances, Savings Plan, Spot instances, and Pay-As-You-Go (PYG) options.
- Expedite access to Azure capacity by rapidly provisioning instances from a customized SKU list tailored to customer preferences.
- Implement personalized fleet allocation strategies, catering to both OnDemand and Spot VMs, optimizing for cost, capacity, or a combination of both factors.
- Embrace the "Fire & Forget-it" model, automating the deployment, management, and monitoring of instances without requiring intricate code frameworks.
    - Streamline the initial setup process, saving valuable time and resources.
    - Alleviate concerns about scripting complexity associated with determining optimal VM pricing, available capacity, managing Spot evictions, and SKU availability.
- Attempt to maintain your Spot target capacity if your Spot VMs are evicted for price or capacity.

There is no additional charge for using Compute Fleet. You will only pay for the VMs the Compute Fleet launches per hour.


## Capacity preference 

Preferences are only available when creating a fleet using Spot VMs. 

### Maintain capacity
Enabling this preference allows your running Spot VM in a fleet to be automatically replaced with any of the VM type or size you specify in an event when the running Spot VM is evicted for price increase or VM failure. Compute Fleet will continue to goal seek replacing your evicted Spot VM until your target capacity is met. 

You may choose this preference when:
- All qualified availability zones in the region are selected.
- A minimum of 3 different VM sizes are specified.

Not enabling this preference will stop your Compute Fleet from a goal seeking to replace evicted Spot VMs even if the target capacity is not met.


## Compute Fleet strategies 

### OnDemand fleet allocation strategies 

**Lowest price (default):** Fleet launches the lowest price Pay-as-you-Go VM from the list of VM sizes specified in an attempt to fulfill the Pay-as-you-Go capacity, followed by the second and third lowest until the desired capacity is fulfilled. 

### Spot Fleet allocation strategies 

**Price capacity optimized (recommended):** Fleet launches the VM types/Sizes from the customer specified list of VMs offering the highest available Spot capacity while offering the lowest price on Spot VM in the region while attempting to fulfill the target capacity. 

Example: If multiple VMs specified by you are offering the ideal capacity to meet the specified target capacity , then fleet will prioritize deploying the VMs that’s offering  the first lowest price to in an attempt fulfill the target capacity, followed by the second lowest price if sufficient capacity wasn’t available with the first lowest price VM. Fleet will consider both price and capacity while configuring this strategy 

**Capacity optimized:** Azure fleet launches VM types/Sizes from the specified list of VMs offering the highest available Spot capacity. Customers want to prioritize choosing the VM Size offering the required Spot capacity to full fill the Spot target capacity over VM types offering the lowest prices with not enough Spot capacity. 

Example: If multiple VMs specified in your list i offering the individual required capacity to meet the specify target capacity , then fleet will prioritize deploying the VMs that’s offering first  highest capacity followed by second highest and 3 highest not considering the price point. This may end the VM having the highest availability being less expensive or not. Fleet will not factor price point while configuring this strategy 

**Lowest Price:** Fleet launches the lowest price Spot VM from the list of VM sizes specified in an attempt to fulfill the Spot capacity, followed by the second and third lowest until the desired capacity is fulfilled. 


## Target capacity 

Compute fleet allows you to set individual target capacity for Spot and Pay-as-you-Go Vm types and this capacity could be managed individually based on your workloads or application requirement.  

You can specify target capacity using VM instances 

Compute fleet allows you to modify the  target capacity for Spot and Pay-as-you-Go VM based on your fleet configuration. For more details related to modifying target capacity please refer to the section Modify fleet. 


## Minimum starting capacity 

You can set your fleet to only deploy Spot VMs, Pay-as-you-Go VMs or a combination of only if the fleet can deploy the minimum starting capacity requested against the actual target capacity. Fleet will fail the request  if capacity becomes unavailable to fulfill the minimum starting capacity 

Example: if your target capacity requested is 100 VM instances and minimum starting capacity is set to 20 VM instances,  deployment will only succeed if fleet can fulfill the starting capacity ask of 20 VM instances, otherwise the request will fail. 

You may not be able to set the minimum starting capacity if you choose to configure the fleet with capacity preference type as “Maintain capacity”. 


## Modify your compute fleet 

Your Compute Fleet in while running, allows you to modify the target capacity and Vm size selection based on how you configured your fleet. 

### Modify target capacity 

You can update your Spot target capacity of the fleet while running  if capacity preference is set to “Maintain capacity”.  

Fleet will automatically deploy new Spot VMs from the list of specified SKU’s to scale up to attain the new target capacity  

In the event of scale down (reduce current target capacity), fleet will not restore Spot VM when evicted until the new modify reduced target capacity is met, this may take time depending on the eviction rate. However it is recommended to delete the running Spot VMs, to scale down faster. 

### Modify or replace VM sizes/SKUs

While the fleet is running, you can add or delete new VM sizes or SKU to your fleet. For Spot you may delete or replace  existing VM sizes specified while configuring your fleet  when capacity preference is set to “Maintain capacity”. 

In all other scenarios requiring modification to current running fleet, you may have to delete the existing fleet and create a new fleet request.  

#### Max hourly price for Spot  

You can configure your fleet with Spot VMs to set the max hourly price you agree to pay per hour. Fleet will not deploy new Spot VMs in your specified list if the price of Spot VM increases above the specified Max Hourly price.. 

#### Spot Eviction Policy 

**Delete ( default):** Fleet will delete your running Spot VM and all other resources attached to the VM. Data stored on persistent disk storage is also deleted. 

**Deallocate:** Fleet will delete your running Spot VM, all other resources attached to the VM and data stored on persistent disk storage is not deleted. 

Note: Deallocated Spot Vm will add up to your Spot target capacity and billing will continue for resources attached to the deallocated VMs. 

#### Fleet quota 

OnDemand and Spot VM quota applies to Azure Fleet. The fleet will have an additional quota applied. 

| Header | Header |
| ------ | ------ |
| The number of Azur Fleet per Region in active, deleted_running | 500* |
| The target capacity per Azure Fleet | 10,000 VMs |
| The target capacity across all Azure Fleets in a Region | 100,000 VMs |

#### Compute Fleet limitation 

- Compute Fleet is only available through ARM template and in Azure portal.
- Compute Fleet can't span across Azure regions. You have to create separate Compute Fleets for each region.
- Compute Fleet is available in the following regions: West US, WestUS2, East US, East US2, Central US, South Central US, West Central US, North Central US, West Europe, North Europe, UK South, and France Central.
- The following VM sizes aren't supported for Azure Spot Virtual Machines: 
    - B-series 
    - Promo versions of any size (like Dv2, NV, NC, H promo sizes) 
- Azure Spot Virtual Machines can be deployed to any region, except Microsoft Azure operated by 21Vianet. 
- The following offer types are currently supported: 
    - Enterprise Agreement 
    - Pay-as-you-go offer code (003P) 
    - Sponsored (0036P and 0136P) 
    - For Cloud Service Provider (CSP), see the Partner Center or contact your partner directly. 


## Next steps
> [!div class="nextstepaction"]
> [Create an Azure Compute Fleet with Azure portal.](quickstart-create-portal.md)




































Azure Virtual Machine Scale Sets let you create and manage a group of load balanced VMs. The number of VM instances can automatically increase or decrease in response to demand or a defined schedule. Scale sets provide the following key benefits:
- Easy to create and manage multiple VMs
- Provides high availability and application resiliency by distributing VMs across availability zones or fault domains
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
> The orchestration mode is defined when you create the scale set and cannot be changed or updated later.

:::image type="content" source="media/overview/azure-virtual-machine-scale-sets-video-thumbnail.jpg" alt-text="YouTube video about Virtual Machine Scale Sets." link="https://youtu.be/lE2xJXYHnB8":::

## Why use Virtual Machine Scale Sets?
To provide redundancy and improved performance, applications are typically distributed across multiple instances. Customers may access your application through a load balancer that distributes requests to one of the application instances. If you need to perform maintenance or update an application instance, your customers must be distributed to another available application instance. To keep up with extra customer demand, you may need to increase the number of application instances that run your application.

Azure Virtual Machine Scale Sets provide the management capabilities for applications that run across many VMs, automatic scaling of resources, and load balancing of traffic. Scale sets provide the following key benefits:

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
    - Scale sets support up to 1,000 VM instances for standard marketplace images and custom images through the Azure Compute Gallery (formerly known as Shared Image Gallery). If you create a scale set using a managed image, the limit is 600 VM instances.
    - For the best performance with production workloads, use [Azure Managed Disks](../virtual-machines/managed-disks-overview.md).


## Next steps
> [!div class="nextstepaction"]
> [Flexible orchestration mode for your scale sets with Azure portal.](flexible-virtual-machine-scale-sets-portal.md)
