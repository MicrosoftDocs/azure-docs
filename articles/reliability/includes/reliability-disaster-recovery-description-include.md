---
 title: Description of disaster recovery
 description: Description of disaster recovery
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 03/07/2025
 ms.author: anaharris
 ms.custom: include file
---


Disaster recovery (DR) refers to practices that organizations use to recover from high-impact events, such as natural disasters or failed deployments that result in downtime and data loss. Regardless of the cause, the best remedy for a disaster is a well-defined and tested DR plan and an application design that actively supports DR. Before you start creating your disaster recovery plan, see [Recommendations for designing a disaster recovery strategy](/azure/well-architected/reliability/disaster-recovery). 

For DR, Microsoft uses the [shared responsibility model](../concept-shared-responsibility.md). In this model, Microsoft ensures that the baseline infrastructure and platform services are available. However, many Azure services don't automatically replicate data or fall back from a failed region to cross-replicate to another enabled region. For those services, you're responsible for setting up a disaster recovery plan that works for your workload. Most services that run on Azure platform as a service (PaaS) offerings provide features and guidance to support DR. You can use [service-specific features to support fast recovery](../reliability-guidance-overview.md) to help develop your DR plan.
