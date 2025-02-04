---
title: BCDR recommendations for working with Microsoft Sentinel
description: Learn about Business Continuity and Disaster Recovery (BCDR) in Microsoft Sentinel, including availability zones and cross-region disaster recovery strategies.
author: batamig
ms.author: bagol
ms.topic: concept-article
ms.date: 02/04/2025
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security

#customerIntent: As a security administrator, I want to understand and implement Business Continuity and Disaster Recovery (BCDR) strategies in Microsoft Sentinel in order to ensure high availability and resilience of my security operations.

---

# Business continuity and disaster recovery for Microsoft Sentinel

This article describes reliability support in Microsoft Sentinel and covers both regional resiliency with availability zones and cross-region resiliency with business continuity and disaster recovery (BCDR). While this article is mainly directed at Microsoft Sentinel customers working in the Azure portal, this guidance also covers data currently covered by Azure services after having onboarded to the [Microsoft Defender portal](/unified-secops-platform/overview-unified-security). <!--last sentence i added-->

For more information, see [Azure reliability](/azure/well-architected/resiliency/).

## Availability zone support

Availability zones are physically separate groups of data centers within each region. When one zone fails, services can fail over to one of the remaining zones.

Microsoft Sentinel uses availability zones in regions where they're available to provide high-availability protection for your applications and data from data center failures.

For more information, see [What are availability zones?](/azure/reliability/availability-zones-overview).

## Cross-region disaster recovery

Disaster recovery (DR) is about recovering from high-impact events, such as natural disasters or failed deployments that result in downtime and data loss. Regardless of the cause, the best remedy for a disaster is a well-defined and tested DR plan and an application design that actively supports DR. Before you begin to think about creating your disaster recovery plan, see [Recommendations for designing a disaster recovery strategy](/azure/well-architected/reliability/disaster-recovery).

When it comes to DR, Microsoft uses the [shared responsibility model](/azure/reliability/concept-shared-responsibility). In a shared responsibility model, Microsoft ensures that the baseline infrastructure and platform services are available. At the same time, many Azure services don't automatically replicate data or fall back from a failed region to cross-replicate to another enabled region. For those services, customers are responsible for setting up a disaster recovery plan that works for their environment. <!--changed from workload-->Most services that run on Azure platform as a service (PaaS) offerings provide features and guidance to support DR and you can [use service-specific features](/azure/reliability/reliability-guidance-overview) to support fast recovery to help develop your DR plan.

In the unlikely event of a full region outage, customers have the option of using one of two strategies:

- **Manual recovery:** Manually deploy to a new region, or wait for the region to recover, and then manually redeploy all environments and apps.
- **Resilient recovery:** First, deploy your container apps in advance to multiple regions. Next, use Azure Front Door or Azure Traffic Manager to handle incoming requests, pointing traffic to your primary region. Then, should an outage occur, customers can redirect traffic away from the affected region. For more information, see [Cross-region replication in Azure](/azure/reliability/cross-region-replication-azure).

<!--removed business continuity from title - here we only talk about dr-->

## BCDR implementation for Microsoft Sentinel

Microsoft Sentinel uses Microsoft best practices for resiliency, safe deployment, and BCDR with Azure Availability Zones (AZs).

To support BCDR in case of a regional outage, Microsoft Sentinel employs a customer-enabled BCDR approach, which means that customers are responsible for setting up disaster recovery. To ensure continuous business operations, customers must configure their Microsoft Sentinel environment in an active-active or mirrored fashion across the two paired regions relevant to them, depending on the cloud environment.

Customer-enabled BCDR involves:

- Creating two identical Log Analytics workspaces enabled for Microsoft Sentinel in the appropriate regions. For more information, see [Quickstart: Onboard Microsoft Sentinel](quickstart-onboard.md).
- Ensuring that the same data sources, analytic rules, and all other settings and configurations are mirrored between the regions, and maintained consistently throughout the continuous operations of these workspaces.

These activities must be done manually by the customer and do not happen automatically.

A customer-enabled BCDR setup ensures that if an Azure regional outage occurs in one of the customer's regions, the other paired region, which is geographically and physically separate from the impacted region, will remain unaffected. As a result, continuous business operations can proceed without any downtime or data loss.

## Regional and cloud support

The following table describes the recommended actions for setting up BCDR in different regions and cloud environments:

|Cloud type  |Guidance  |
|---------|---------|
|Public     | We recommend that customers outside of Europe create one workspace in their local region and another in any of the supported European regions.        |
|Azure Government    |  We recommend that customers in US government clouds create one workspace in Arizona and another in Virginia.       |
|Air-gapped clouds     | We recommend that customers in air-gapped US government clouds create one workspace in USSEC East and another workspace in USSEC West, or in USNAT East and USNAT West.        |

For more information, see [Geographical availability and data residency in Microsoft Sentinel](geographical-availability-data-residency.md). 

The following geographical regions are not currently supported for the customer-enabled BCDR approach described in this artice:

- EU customers, due to EUDB compliance limitations
- Israel
- Azure China 21Vianet

## Related content

For more information, see:

- [Geographical availability and data residency in Microsoft Sentinel](geographical-availability-data-residency.md)
- [Microsoft Sentinel feature support for Azure commercial/other clouds](feature-availability.md)