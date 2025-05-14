---
title: BCDR Recommendations for Working With Microsoft Sentinel
description: Learn about Business Continuity and Disaster Recovery (BCDR) in Microsoft Sentinel, including availability zones and cross-region disaster recovery strategies.
author: batamig
ms.author: bagol
ms.topic: concept-article
ms.date: 02/04/2025
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security

#customerIntent: As a security administrator, I want to understand and implement Business Continuity and Disaster Recovery (BCDR) strategies in Microsoft Sentinel in order to ensure high availability and resilience of my security operations.

---

# Business continuity and disaster recovery for Microsoft Sentinel

This article describes reliability support in Microsoft Sentinel and covers both regional resiliency with availability zones, and cross-region resiliency with business continuity and disaster recovery (BCDR). While this article is mainly directed at Microsoft Sentinel customers working in the Azure portal, this guidance also covers data currently managed by Azure services after onboarding to the [Microsoft Defender portal](/unified-secops-platform/overview-unified-security).

For more information, see [Azure reliability](/azure/well-architected/resiliency/).

## Availability zone support

Availability zones are physically separate groups of data centers within each region. When one zone fails, services fail over to one of the remaining zones.

Microsoft Sentinel uses availability zones in regions where they're available to provide high availability protection for your applications and data from data center failures.

For more information, see [What are availability zones?](/azure/reliability/availability-zones-overview)

## Cross-region disaster recovery

Disaster recovery (DR) is about recovering from high-impact events, such as natural disasters or failed deployments that result in downtime and data loss. Regardless of the cause, the best remedy for a disaster is a well-defined and tested DR plan and an application design that actively supports DR. Before you create your disaster recovery plan, see [Recommendations for designing a disaster recovery strategy](/azure/well-architected/reliability/disaster-recovery).

When it comes to DR, Microsoft uses the shared responsibility model. In this model:

- Microsoft ensures that the baseline infrastructure and platform services are available.
- Many Azure services don't automatically replicate data or fall back from a failed region to cross-replicate to another enabled region. For those services, customers are responsible for setting up a DR plan that works for their environment.

Most services that run on Azure platform as a service (PaaS) offerings provide features and guidance to support DR. You can [use service-specific features](/azure/reliability/reliability-guidance-overview) to support fast recovery and help develop your DR plan.

For more information, see [Shared responsibility for reliability](/azure/reliability/concept-shared-responsibility).

## BCDR implementation for Microsoft Sentinel

Microsoft Sentinel uses Microsoft's best practices for resiliency, safe deployment, and BCDR with Azure Availability Zones (AZs).

To support BCDR in a regional outage, Microsoft Sentinel uses a customer-enabled BCDR approach, which means customers are responsible for setting up disaster recovery. To ensure continuous business operations, customers must configure their Microsoft Sentinel environment in an active-active (mirrored) fashion across the two paired regions relevant to them, depending on the cloud environment.

Customer-enabled BCDR involves:

- Creating two identical Log Analytics workspaces that are enabled for Microsoft Sentinel in the appropriate regions. For more information, see [Quickstart: Onboard Microsoft Sentinel](quickstart-onboard.md).

    In the backup workspace, focus on the data sources, analytic rules, and other configurations that are critical for your business continuity.

- Ensuring that your business-critical data sources are configured to ingest data into both workspaces. For more information, see [Connect your data sources to Microsoft Sentinel by using data connectors](configure-data-connector.md).

- Manually defining your business-critical analytic rules and other configurations in both workspaces, maintaining them consistently throughout the continuous operations. For more information, see [Threat detection in Microsoft Sentinel](threat-detection.md).

These activities must be configured manually by the customer and don't happen automatically. No future actions during an actual outage are required or expected.

A customer-enabled BCDR setup ensures that if an Azure regional outage occurs in one of the customer's regions, the other paired region, which is geographically and physically separate from the impacted region, remains unaffected. As a result, continuous business operations can proceed without any downtime or data loss.

## Regional and cloud support

The following table describes the recommended actions for setting up BCDR in different regions and cloud environments:

|Cloud type  |Guidance  |
|---------|---------|
|**Public** | We recommend customers outside of Europe create one workspace in their local region and another in any of the supported European regions. |
|**Azure Government** | We recommend customers in US government clouds create two workspaces, one in each of their relevant regions. For details about air-gapped clouds, contact your account team.|


The following geographical regions aren't currently supported for the customer-enabled BCDR approach described in this article:

- EU customers, due to EUDB compliance limitations
- Israel
- Azure China 21Vianet

For more information, see [Geographical availability and data residency in Microsoft Sentinel](geographical-availability-data-residency.md).


## Related content

For more information, see:

- [Geographical availability and data residency in Microsoft Sentinel](geographical-availability-data-residency.md) 
- [Microsoft Sentinel feature support for Azure commercial / other clouds](feature-availability.md)
