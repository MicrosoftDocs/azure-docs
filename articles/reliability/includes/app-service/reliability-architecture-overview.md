---
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/17/2025
 ms.author: anaharris
 ms.custom: include file
---

App Service provides the following redundancy features:

- **Distribution across fault domains:** At the platform level, Azure automatically distributes your App Service plan's VM instances across [fault domains](/azure/virtual-machines/availability-set-overview#fault-domains) within the Azure region. This distribution minimizes the risk of localized hardware failures by grouping VMs that share a common power source and network switch. 

- **Distribution across availability zones:** If you enable zone redundancy on a supported App Service plan, Azure distributes your instances across availability zones within the region. This configuration provides higher resiliency if a zone outage occurs. For more information about zone redundancy, see [Availability zone support](#availability-zone-support).

- **App scaling:** When you configure your App Service plan to run multiple VM instances, all apps in the plan run on all instances by default. If you configure your plan for autoscaling, all apps scale out together based on the autoscale settings. However, you can customize how many plan instances run a specific app by using [per-app scaling](/azure/app-service/manage-scale-per-app).

- **Scale units:** App Service runs on a platform infrastructure called *scale units*, also known as *stamps*. A scale unit includes all components needed to host and run App Service, including compute, storage, networking, and load balancing. Azure manages scale units to ensure balanced workload distribution, perform routine maintenance, and maintain overall platform reliability.

    Some capabilities might only be applied on specific scale units. For example, some App Service scale units might support zone redundancy, while other scale units in the same region don't.
