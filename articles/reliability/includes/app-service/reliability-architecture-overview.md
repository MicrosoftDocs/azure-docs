---
 title: include file
 description: include file
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/17/2025
 ms.author: anaharris
 ms.custom: include file
---

App Service offers the following redundancy features:

- **Distribution across fault domains:** At the platform level - without any configuration from you - Azure automatically distributes your App Service plan’s VM instances across [fault domains](/azure/virtual-machines/availability-set-overview#fault-domains) within the Azure region. This distribution minimizes the risk of localized hardware failures by grouping virtual machines that share a common power source and network switch. 

- **Distribution across availability zones:** If you enable zone redundancy on an App Service **Premium v2-4** plan, Azure also distributes your instances across availability zones within the region, offering higher resiliency in the event of a zone outage. To learn more about zone redundancy, see [Availability zone support](#availability-zone-support).

- **Scaling apps:**. If you configure your App Service plan to run five VM instances, then all apps in the plan run on all five instances by default. However, if you configure your plan for autoscaling, then all apps in the plan scale out together, based on the autoscale settings. You can customize how many plan instances run a specific app by using [per-app scaling](/azure/app-service/manage-scale-per-app).

- **Scale units:** Behind the scenes - without any configuration from you - Azure App Service runs on a platform infrastructure called *scale units* (also known as *stamps*). A scale unit includes all the components needed to host and run App Service, including compute, storage, networking, and load balancing. Azure manages scale units to ensure balanced workload distribution, perform routine maintenance, and maintain overall platform reliability.

    Certain capabilities might be applied to some scale units and not others. For example, zone redundancy might be supported by some App Service scale units but not by other scale units in the same region.
