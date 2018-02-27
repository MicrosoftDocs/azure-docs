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
Azure virtual machine scale sets let you create and manage a group of identical, load balanced VMs. The number of VM instances can automatically increase or decrease in response to customer demand or a defined schedule. Scale sets provide high availability to your applications, and allow you to centrally manage, configure, and update a large number of VMs. With virtual machine scale sets, you can build large-scale services for areas such as compute, big data, and container workloads.


## Why use virtual machine scale sets?
To provide redundancy and improved performance, applications are typically distributed across multiple instances. Customers may access your application through a load balancer that distributes requests to one of the application instances. If you need to perform maintenance or update an application instance, your customers must be distributed to another available application instance. To keep up with additional customer demand, you may need to increase the number of application instances that run your application.

Azure virtual machine scale sets provide the management capabilities for applications that run across many VMs, automatic scaling of resources, and load balancing of traffic. Scale sets provide the following key benefits:

- **Easy to create and manage multiple VMs**
    - When you have many VMs that run your application, it's important to maintain a consistent configuration across your environment. For reliable performance of your application, the VM size, disk configuration, and application installs should match across all VMs.
    - With scale sets, all VM instances are created from the same base OS image and configuration. This approach lets you easily manage hundreds of VMs without additional configuration tasks or network management.

- **Provides high availability and application resiliency**
    - Scale sets run multiple instances of your application. If one of these VM instances has a problem, customers continue to access your application through one of the other VM instances with minimal interruption.
    - For additional availability, you can automatically distribute VM instances in a scale set within a single datacenter or across multiple datacenters.

- **Allows your application to automatically scale as resource demand changes**
    - Customer demand for your application may change throughout the day or week. To match customer demand, scale sets can automatically increase the number of VM instances as application demand increases, then reduce the number of VM instances as demand decreases.
    - Autoscale also minimizes the number of unnecessary VM instances that run your application when demand is low, while customers continue to receive an acceptable level of performance as demand grows and additional VM instances are automatically added. This ability helps reduce costs and efficiently create Azure resources as required.

- **Works at large-scale**
    -Scale sets support up to 1,000 VM instances. If you create and upload your own custom VM images, the limit is 300 VM instances.


## Improve application availability and redundancy
To increase the availability of your applications and services, VM instances in your scale sets can be distributed across Availability Zones or Availability Sets.

- **Availability Zones** distribute your VM instances across separate physical datacenters. Each datacenter has its own independent power source, network, and cooling. You can create a single-zone scale set, or create a zone-redundant scale set that automatically distributes VM instances across multiple zones. With a zone-redundant scale set, your applications continue to run if there is a datacenter outage.

- **Availability Sets** distribute your VM instances across logical fault and upgrade domains within a single datacenter. These logical domains make sure that your VM instances run on hardware distributed across a single datacenter, and that maintenance updates are not applied at the same time. Your applications continue run if there are maintenance events within a datacenter, but do not protect you against an entire datacenter outage.


## Automatically scale as your application demand changes
To maintain consistent application performance, you can automatically increase or decrease the number of VM instances in your scale set. This autoscale ability reduces the management overhead to monitor and tune your scale set as customer demand changes over time. You define rules based on performance metrics, application response, or a fixed schedule, and your scale set autoscales as needed.

### Host-based metrics for autoscale
For basic autoscale rules, you can use host-based performance metrics such as CPU usage or disk I/O. These host-based metrics are available automatically, with no additional agents or extensions to install and configure. The number of VM instances in your scale set automatically increase or decrease in response to these host-based metrics.

### In-guest metrics for autoscale
To use more granular performance metrics, you can install and configure the Azure diagnostic extension on VM instances in your scale set. The Azure diagnostic extension collects additional performance metrics, such as memory consumption, from inside each VM instance. These performance metrics are streamed to an Azure storage account. You then create autoscale rules to consume this data.

### Use Application Insights
To monitor the application performance itself, you can install and configure a small instrumentation package in to your application for App Insights. Detailed performance metrics for the application response time or number of sessions can then be streamed back from your app. You can then create autoscale rules with defined thresholds for the application-level performance itself.


## Performance and scale guidance
* A scale set supports up to 1,000 VMs. If you create and upload your own custom VM images, the limit is 300. For more information on these large scale sets, see [Working with large virtual machine scale sets](virtual-machine-scale-sets-placement-groups.md).
* As with regular VMs, Azure Premium Storage provides faster, more predictable VM provisioning times, and improved I/O performance for your applications. For development or test workloads, scale sets with Azure Standard Storage provide a good balance between performance and cost.
* Each Azure subscription has a default quota of resources that can be created in a region. As scale sets can automatically increase the number of VM instances in a scale set, you may need to request an increase to the vCPU quota for the region you create a scale set in.


## Next steps
To get started, create your first virtual machine scale set in the Azure portal.

> [!div class="nextstepaction"]
> [Create a scale set in the Azure portal](virtual-machine-scale-sets-create-portal.md)
