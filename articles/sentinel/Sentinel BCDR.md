# BCDR in Azure Sentinel

# **Introduction**

This article describes reliability support in Microsoft Sentinel and covers both regional resiliency with availability zones and cross-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](https://learn.microsoft.com/en-us/azure/well-architected/resiliency/).

## **Availability zone support**

Availability zones are physically separate groups of datacenters within each region. When one zone fails, services can fail over to one of the remaining zones.

For more information on availability zones in Azure, see [What are availability zones?](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview)

Microsoft Sentinel uses [availability zones](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview#zonal-and-zone-redundant-services) in regions where they're available to provide high-availability protection for your applications and data from data center failures.

##  **Cross-region disaster recovery and business continuity**

Disaster recovery (DR) is about recovering from high-impact events, such as natural disasters or failed deployments that result in downtime and data loss. Regardless of the cause, the best remedy for a disaster is a well-defined and tested DR plan and an application design that actively supports DR. Before you begin to think about creating your disaster recovery plan, see [Recommendations for designing a disaster recovery strategy](https://learn.microsoft.com/en-us/azure/well-architected/reliability/disaster-recovery).

When it comes to DR, Microsoft uses the [shared responsibility model](https://learn.microsoft.com/en-us/azure/reliability/concept-shared-responsibility). In a shared responsibility model, Microsoft ensures that the baseline infrastructure and platform services are available. At the same time, many Azure services don't automatically replicate data or fall back from a failed region to cross-replicate to another enabled region. For those services, you're responsible for setting up a disaster recovery plan that works for your workload. Most services that run on Azure platform as a service (PaaS) offerings provide features and guidance to support DR and you can use [service-specific features to support fast recovery](https://learn.microsoft.com/en-us/azure/reliability/reliability-guidance-overview) to help develop your DR plan.

In the unlikely event of a full region outage, you have the option of using one of two strategies:

> **Manual recovery**: Manually deploy to a new region, or wait for the region to recover, and then manually redeploy all environments and apps.
>
> **Resilient recovery**: First, deploy your container apps in advance to multiple regions. Next, use Azure Front Door or Azure Traffic Manager to handle incoming requests, pointing traffic to your primary region. Then, should an outage occur, you can redirect traffic away from the affected region. For more information, see [Cross-region replication in Azure](https://learn.microsoft.com/en-us/azure/reliability/cross-region-replication-azure).

**BCDR for** **Microsoft Sentinel**

Sentinel is leveraging Microsoft best practices for resiliency, Safe Deployment, and Business Continuity and Disaster Recovery (BCDR) with Azure Availability Zones (AZs).

To support BCDR in case of a regional outage, Sentinel employs a customer-enabled Business Continuity and Disaster Recovery (BCDR) approach, meaning customers are responsible for setting up disaster recovery. To ensure continuous business operations, customers should configure their Sentinel environment in an active-active or mirrored fashion across the two paired regions relevant to them, depending on the cloud environment.

This involves not only creating the workspaces in these regions but also ensuring that the same data sources, analytic rules, and all other settings and configurations are mirrored between the regions and maintained consistently throughout the continuous operations of these workspaces. This needs to be done manually by the customer and does not happen automatically.

This setup ensures that if an Azure regional outage occurs in one of these regions, the other paired region, which is geographically and physically separate from the impacted region, will remain unaffected. As a result, continuous business operations can proceed without any downtime or data loss.

**How to configure Azure Sentinel for BCDR**

To configure the Sentinel environment as active-active, customers need to create two identical Log Analytics and Sentinel workspaces in the appropriate regions. See here for more information: [Quickstart: Onboard to Microsoft Sentinel \| Microsoft Learn](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard)

For the public cloud, if the customer is outside of Europe, they should create one workspace in their local region and another in any of the supported regions in Europe. See here for more information about supported regions: [Geographical availability and data residency in Microsoft Sentinel \| Microsoft Learn](https://review.learn.microsoft.com/en-us/azure/sentinel/geographical-availability-data-residency?branch=main&branchFallbackFrom=pr-en-us-289729)

**Gov regions:**

For the government cloud (FFX), customers should create one workspace in Arizona and another in Virginia.

For the air gapped cloud (AGC), customers should create one workspace in USSEC East and one workspace in USSEC West (same thing for USNAT East and West).

**Unsupported geos:**  
\*Due to EUDB compliance limitations this capability is currently not supported for EU customers but will be available in the future.

\*Israel region and Mooncake cloud currently do not support that capability as well but will also be available in the future.
