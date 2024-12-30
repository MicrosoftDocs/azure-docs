---
 title: Description of disaster recovery
 description: Description of disaster recovery
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 08/25/2023
 ms.author: anaharris
 ms.custom: include file
---


Disaster recovery (DR) is about recovering from high-impact events, such as natural disasters or failed deployments that result in downtime and data loss. Regardless of the cause, the best remedy for a disaster is a well-defined and tested DR plan and an application design that actively supports DR. Before you begin to think about creating your disaster recovery plan, see [Recommendations for designing a disaster recovery strategy](/azure/well-architected/reliability/disaster-recovery). 


When it comes to DR, Microsoft uses the [shared responsibility model](../concept-shared-responsibility.md). In a shared responsibility model, Microsoft ensures that the baseline infrastructure and platform services are available. At the same time, many Azure services don't automatically replicate data or fall back from a failed region to cross-replicate to another enabled region. For those services, you're responsible for setting up a disaster recovery plan that works for your workload. Most services that run on Azure platform as a service (PaaS) offerings provide features and guidance to support DR and you can use [service-specific features to support fast recovery](../reliability-guidance-overview.md) to help develop your DR plan.




