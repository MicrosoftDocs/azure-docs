---
title: Geo-replication in Azure App Configuration
description: Details of the geo-replication feature in Azure App Configuration. 
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.custom: 
ms.topic: conceptual
ms.date: 08/01/2022
---

# Geo-replication overview

For application developers and IT engineers, a common goal is to build and run resilient applications. Resiliency is defined as the ability of your application to react to failure and still remain functional. To achieve resilience in the face of regional failures in the cloud, the first step is to build in redundancy to avoid a single point of failure. This redundancy can be achieved with geo-replication.

The App Configuration geo-replication feature allows you to replicate your configuration store at-will to the regions of your choice. Each new **replica** will be in a different region and creates a new endpoint for your applications to send requests to. The original endpoint of your configuration store is called the **Origin**. The origin can't be removed, but otherwise behaves like any replica. 

Changing or updating your key-values can be done in any replica. These changes will be synchronized with all other replicas following an eventual consistency model. 

Replicating your configuration store adds the following benefits:
- **Added resiliency for Azure outages:** In the event of a regional outage, replicas are individually affected. If one region has an outage, all replicas located in unaffected regions will still be accessible and continuously synchronize. Once the outage has been mitigated, all affected replicas will be synced to the most recent state. Note that geo-replication only offers automatic failover functionalities through App Configuration's configuration providers. Otherwise, you can also build your own custom failover mechanisms in your application's configuration to switch between different replica endpoints to mitigate the impact of an Azure outage. 
- **Redistribution of Request Limits:**  You can customize in code which replica endpoint your application uses letting you distribute your request load to avoid exhausting request limits. For example, if your applications run in multiple regions and only send requests to one region, you may begin exhausting App Configuration request limits. You can help redistribute this load by creating replicas in the regions your applications are running in. Each replica has isolated request limits, equal in size to the request limits of the origin. Exhausting the request limits in one replica has no impact on the request limits in another replica. 
- **Regional Compartmentalization:** Accessing multiple regions can improve latency between your application and configuration store, leading to faster request responses and better performance if an application sends requests to its closest replica. Specifying replica access also allows you to limit data storage and flow between different regions based on your preferences. 

To enable this feature in your store, reference the [how-to to enable geo-replication document](./howto-geo-replication.md).

## Sample use case

A developer team is building a system consisting of multiple applications and currently has one Azure App Configuration store in the West US region. Usage of their system is rapidly growing, and they're looking to scale and meet their customer needs in: Sweden Central, West US, North Europe, and East Asia. All applications they have are currently using the West US configuration store, creating a single point of failure. If there was a regional outage in West US, and they had no other failover mechanisms or default behaviors, their system would be unavailable to customers. Also, globally all applications are currently restricted by the request limit of one configuration store. As the team scales to more regions, this limit will be unsustainable. 

This team would benefit from geo-replication. They can create a replica of their configuration store in each region where their application will be running. Then their applications can send requests to a replica in the same region, rather than all applications sending requests to West US. This will provide two benefits: improved request latency and better load distribution. Having a well distributed request load will help avoid exhaustion of request quota. Additionally, having multiple replicas enables the team to configure their applications to fail over in the case of a regional outage. For example, the team can configure applications running in Sweden Central to pull configuration from that region, but fallback to North Europe if Sweden Central is experiencing an outage. Even if App Configuration is unavailable in a given region, the team's system is unaffected.

## Considerations

- Geo-replication isn't available in the free tier.  
- Each replica has limits, as outlined in the [App Configuration pricing page](https://azure.microsoft.com/pricing/details/app-configuration/). These limits are isolated per replica. 
- Azure App Configuration also supports Azure availability zones to create a resilient and highly available store within an Azure Region. Availability zone support is automatically included for a replica if the replica's region has availability zone support. The combination of availability zones for redundancy within a region, and geo-replication across multiple regions, enhances both the availability and performance of a configuration store.
<!--
To add once these links become available: 
 - Request handling for replicas will vary by configuration provider, for further information reference [.NET Geo-replication Reference](https://azure.microsoft.com/pricing/details/app-configuration/) and [Java Geo-replication Reference](https://azure.microsoft.com/pricing/details/app-configuration/). 
 -  -->

## Cost and billing 

Each replica created will add extra charges. Reference the [App Configuration pricing page](https://azure.microsoft.com/pricing/details/app-configuration/) for details. As an example, if your origin is a standard tier configuration store and you have five replicas, you would be charged the rate of six standard tier configuration stores for your system, but each of your replica's isolated quota and requests are included in this charge.

## Next steps

> [!div class="nextstepaction"]
> [How to enable Geo replication](./howto-geo-replication.md)  

> [Resiliency and Disaster Recovery](./concept-disaster-recovery.md)
