---
title: Reliability and Availability in Azure Deployment Environments
description: Learn how Azure Deployment Environments ensure reliability with availability zones and disaster recovery strategies. Discover best practices for resiliency.
#customer intent: As a cloud architect, I want to understand how availability zones support reliability in Azure Deployment Environments so that I can ensure high availability for my applications.
author: RoseHJM
ms.author: rosemalcolm
ms.reviewer: rosemalcolm
ms.date: 01/08/2026
ms.topic: concept-article
---

# Reliability and availability zones in Azure Deployment Environments
This article describes reliability support in Azure Deployment Environments. It covers intra-regional resiliency with availability zones and inter-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/well-architected/reliability/).

## Availability zone support
[Availability zones](/azure/reliability/availability-zones-overview?tabs=azure-cli) are physically separate groups of datacenters within an Azure region. When one zone fails, services can fail over to one of the remaining zones. To improve the availability of your applications, architect your solutions to use multiple availability zones within a region. For more information about Azure regions where availability zones are available, see [Azure regions list](../reliability/regions-list.md).

When you deploy Azure Deployment Environments in a region that supports availability zones, the environments automatically support availability zones for all resources. Check the regions that support Deployment Environments by using the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=deployment-environments) page.


## Cross-region disaster recovery and business continuity
Disaster recovery (DR) refers to practices that organizations use to recover from high-impact events, such as natural disasters or failed deployments that result in downtime and data loss. Regardless of the cause, the best remedy for a disaster is a well-defined and tested DR plan and an application design that actively supports DR. Before you start creating your disaster recovery plan, see [Recommendations for designing a disaster recovery strategy](/azure/well-architected/reliability/disaster-recovery).

For DR, Microsoft uses the [shared responsibility model](/azure/reliability/concept-shared-responsibility). In this model, Microsoft ensures that the baseline infrastructure and platform services are available. However, many Azure services don't automatically replicate data or fall back from a failed region to cross-replicate to another enabled region. For those services, you're responsible for setting up a disaster recovery plan that works for your workload. Most services that run on Azure platform as a service (PaaS) offerings provide features and guidance to support DR. You can use [service-specific features to support fast recovery](/azure/reliability/overview-reliability-guidance) to help develop your DR plan.

You can replicate the following Deployment Environments resources in an alternate region to prevent data loss if a cross-region failover occurs:

- Dev centers
- Projects
- Catalogs
- Catalog items
- Dev center environment types
- Project environment types
- Environments

For more information, see [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture).

## Related content
- To learn more about how Azure supports reliability, see [Azure reliability](/azure/well-architected/reliability/).
- To learn more about Deployment Environments resources, see [Azure Deployment Environments key concepts](/azure/deployment-environments/concept-environments-key-concepts).
- To get started with Deployment Environments, see [Quickstart: Configure Azure Deployment Environments](quickstart-create-and-configure-devcenter.md).