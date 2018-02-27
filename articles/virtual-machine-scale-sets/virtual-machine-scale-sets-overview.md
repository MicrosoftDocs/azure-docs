---
title: Azure virtual machine scale sets overview | Microsoft Docs
description: Learn about what Azure virtual machine scale sets provide and how to automatically scale your applications
services: virtual-machine-scale-sets
documentationcenter: ''
author: gatneil
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.custom: mvc
ms.date: 02/27/2018
ms.author: negat

---
# What are virtual machine scale sets?
Virtual machine scale sets are an Azure compute resource that you can use to deploy and manage a set of identical VMs. With all VMs configured the same, scale sets are designed to support true autoscale, and no pre-provisioning of VMs is required. So it's easier to build large-scale services that target large compute, big data, and container workloads.


## Why use virtual machine scale sets?
To provide redundancy and improved performance, applications are typically distributed across multiple instances. Customers access your application through a load balancer that distribute requests to one of the application instances. If you need to perform maintenance or update an application instance, your customers must be distributed to another available application instance. To keep up with additional customer demand, you may need to increase the number of application instances that run your application.

Azure virtual machine scale sets provide this level of automated distribution of application instances, scaling of resources, and load balancing of traffic. All VM instances in a scale set are created from the same OS image and automated application installs. The scale set can automatically increase or decrease the number of VM instances as customer demand changes at different times of the day.

Scale sets provide the following key benefits:

- **Easy to create and manage multiple VMs**
    - When you have many VMs that run your application, it's important to maintain a consistent configuration across your environment. For reliable performance of your application, the VM size, disk configuration, and application installs should match across all VMs. With scale sets, all VM instances are created from the same base OS image and configuration. This approach lets you easily manage hundreds of VMs without additional configuration tasks or network management.

- **Provides high availability and application resiliency**
    - Scale sets are used to run multiple instances of your application. If one of these instances has a problem, customers continue to access your application through one of the other VM instances with minimal interruption. For additional availability, you can automatically distribute VM instances in a scale set within a single datacenter or across multiple datacenters.

- **Allows your application to automatically scale as resource demand changes**
    - Customer demand for your application may change throughout the day or week. To reduce billing costs, scale sets can automatically increase the number of VM instances as application demand increases, then reduce the number of VM instances as demand decreases. This autoscale ability minimizes the number of unnecessary VMs that run your application while customers continue to receive an acceptable level of performance as demand grows and additional VM instances are automatically added.

- **Works at large-scale**
    -Scale sets support up to 1,000 VM instances. If you create and upload your own custom VM images, the limit is 300 VM instances.


## Improve application availability and redundancy
To increase the availability of your applications and services, VM instances in your scale sets can be distributed across Availability Zones or Availability Sets.

- **Availability Zones** distribute your VM instances across separate physical datacenters. Each datacenter has its own independent power source, network, and cooling. You can create a single-zone scale set, or create a zone-redundant scale set that automatically distributes VM instances across multiple zones. With a zone-redundant scale set, your applications continue to run if there is a datacenter outage.

- **Availability Sets** distribute your VM instances across logical fault and upgrade domains within a single datacenter. These logical domains make sure that your VM instances run on hardware distributed across a single datacenter, and that maintenance updates are not applied at the same time. Your applications continue run if there are maintenance events within a datacenter, but do not protect you against an entire datacenter outage.


## Automatically scale as your application demand changes
To maintain consistent application performance, you can automatically increase or decrease the number of VM instances in your scale set. This autoscale ability reduces the management overhead to monitor and tune your scale set as customer demand changes over time. You define rules based on performance metrics, application response, or a fixed schedule, and your scale set autoscales as needed.

For basic autoscale rules, you can use host-based performance metrics such as CPU usage or disk I/O. These host-based metrics are available automatically, with no additional agents or extensions to install and configure. Autoscale rules that use host-based metrics can be created in the [Azure portal](virtual-machine-scale-sets-autoscale-portal.md), with [Azure PowerShell](virtual-machine-scale-sets-autoscale-powershell.md), and with the [Azure CLI 2.0](virtual-machine-scale-sets-autoscale-cli.md).

### In-guest metrics for autoscale
To use more granular performance metrics, you can install and configure the Azure diagnostic extension on VM instances in your scale set. The Azure diagnostic extension allows you to collect additional performance metrics, such as memory consumption, from inside of each VM instance. These performance metrics are streamed to an Azure storage account, and you create autoscale rules to consume this data. For more information, see the articles for how to enable the Azure diagnostics extension on a [Linux VM](../virtual-machines/linux/diagnostic-extension.md) or [Windows VM](../virtual-machines/windows/ps-extensions-diagnostics.md).

### Use Application Insights
To monitor the application performance itself, you can install and configure a small instrumentation package in to your application for App Insights. Detailed performance metrics for the application response time or number of sessions can then be streamed back from your app. You can then create autoscale rules with defined thresholds for the application-level performance itself. For more information about App Insights, see [What is Application Insights](../application-insights/app-insights-overview.md).


## Performance and scale guidance
* A scale set supports up to 1,000 VMs. If you create and upload your own custom VM images, the limit is 300. For considerations in using large scale sets, see [Working with large virtual machine scale sets](virtual-machine-scale-sets-placement-groups.md).
* You do not have to pre-create Azure storage accounts to use scale sets. Scale sets support Azure-managed disks, which negate performance concerns about the number of disks per storage account. For more information, see [Azure virtual machine scale sets and managed disks](virtual-machine-scale-sets-managed-disks.md).
* Consider using Azure Premium Storage instead of Azure Storage for faster, more predictable VM provisioning times, and improved I/O performance.
* The vCPU quota in the region in which you are deploying limits the number of VMs you can create. You might need to contact Customer Support to increase your compute quota limit, even if you have a high limit of vCPUs for use with Azure Cloud Services today. To query your quota, run this Azure CLI command: `az vm list-usage`. Or, run this PowerShell command: `Get-AzureRmVMUsage`.


## Next steps
To get started, create your first virtual machine scale set in the Azure portal.

> [!div class="nextstepaction"]
> [Create a scale set in the Azure portal](virtual-machine-scale-sets-create-portal.md)
