---
title: Azure virtual machine scale sets overview
description: Learn about Azure virtual machine scale sets and how to automatically scale your applications
author: mayanknayar
tags: azure-resource-manager
ms.service: virtual-machine-scale-sets
ms.topic: overview
ms.custom: mvc
ms.date: 09/26/2019
ms.author: manayar

---
# What are virtual machine scale sets?
Azure virtual machine scale sets let you create and manage a group of identical, load balanced VMs. The number of VM instances can automatically increase or decrease in response to demand or a defined schedule. Scale sets provide high availability to your applications, and allow you to centrally manage, configure, and update a large number of VMs. With virtual machine scale sets, you can build large-scale services for areas such as compute, big data, and container workloads.


## Why use virtual machine scale sets?
To provide redundancy and improved performance, applications are typically distributed across multiple instances. Customers may access your application through a load balancer that distributes requests to one of the application instances. If you need to perform maintenance or update an application instance, your customers must be distributed to another available application instance. To keep up with additional customer demand, you may need to increase the number of application instances that run your application.

Azure virtual machine scale sets provide the management capabilities for applications that run across many VMs, [automatic scaling of resources](virtual-machine-scale-sets-autoscale-overview.md), and load balancing of traffic. Scale sets provide the following key benefits:

- **Easy to create and manage multiple VMs**
    - When you have many VMs that run your application, it's important to maintain a consistent configuration across your environment. For reliable performance of your application, the VM size, disk configuration, and application installs should match across all VMs.
    - With scale sets, all VM instances are created from the same base OS image and configuration. This approach lets you easily manage hundreds of VMs without additional configuration tasks or network management.
    - Scale sets support the use of the [Azure load balancer](../load-balancer/load-balancer-overview.md) for basic layer-4 traffic distribution, and [Azure Application Gateway](../application-gateway/application-gateway-introduction.md) for more advanced layer-7 traffic distribution and SSL termination.

- **Provides high availability and application resiliency**
    - Scale sets are used to run multiple instances of your application. If one of these VM instances has a problem, customers continue to access your application through one of the other VM instances with minimal interruption.
    - For additional availability, you can use [Availability Zones](../availability-zones/az-overview.md) to automatically distribute VM instances in a scale set within a single datacenter or across multiple datacenters.

- **Allows your application to automatically scale as resource demand changes**
    - Customer demand for your application may change throughout the day or week. To match customer demand, scale sets can automatically increase the number of VM instances as application demand increases, then reduce the number of VM instances as demand decreases.
    - Autoscale also minimizes the number of unnecessary VM instances that run your application when demand is low, while customers continue to receive an acceptable level of performance as demand grows and additional VM instances are automatically added. This ability helps reduce costs and efficiently create Azure resources as required.

- **Works at large-scale**
    - Scale sets support up to 1,000 VM instances. If you create and upload your own custom VM images, the limit is 600 VM instances.
    - For the best performance with production workloads, use [Azure Managed Disks](../virtual-machines/windows/managed-disks-overview.md).


## Differences between virtual machines and scale sets
Scale sets are built from virtual machines. With scale sets, the management and automation layers are provided to run and scale your applications. You could instead manually create and manage individual VMs, or integrate existing tools to build a similar level of automation. The following table outlines the benefits of scale sets compared to manually managing multiple VM instances.

| Scenario                           | Manual group of VMs                                                                    | Virtual machine scale set |
|------------------------------------|----------------------------------------------------------------------------------------|---------------------------|
| Add additional VM instances        | Manual process to create, configure, and ensure compliance                             | Automatically create from central configuration |
| Traffic balancing and distribution | Manual process to create and configure Azure load balancer or Application Gateway      | Can automatically create and integrate with Azure load balancer or Application Gateway |
| High availability and redundancy   | Manually create Availability Set or distribute and track VMs across Availability Zones | Automatic distribution of VM instances across Availability Zones or Availability Sets |
| Scaling of VMs                     | Manual monitoring and Azure Automation                                                 | Autoscale based on host metrics, in-guest metrics, Application Insights, or schedule |

There is no additional cost to scale sets. You only pay for the underlying compute resources such as the VM instances, load balancer, or Managed Disk storage. The management and automation features, such as autoscale and redundancy, incur no additional charges over the use of VMs.

## How to monitor your scale sets

Use [Azure Monitor for VMs](../azure-monitor/insights/vminsights-overview.md), which has a simple onboarding process and will automate the collection of important CPU, memory, disk, and network performance counters from the VMs in your scale set. It also includes additional monitoring capabilities and pre-defined visualizations that help you focus on the availability and performance of your scale sets.

Enable monitoring for your [virtual machine scale set application](../azure-monitor/app/azure-vm-vmss-apps.md) with Application Insights to collect detailed information about your application including page views, application requests, and exceptions. Further verify the availability of your application by configuring an [availability test](../azure-monitor/app/monitor-web-app-availability.md) to simulate user traffic.

## Next steps
To get started, create your first virtual machine scale set in the Azure portal.

> [!div class="nextstepaction"]
> [Create a scale set in the Azure portal](quick-create-portal.md)
