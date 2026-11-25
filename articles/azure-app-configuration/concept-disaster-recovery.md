---
title: Azure App Configuration resiliency and disaster recovery
description: Learn how to implement resiliency and disaster recovery with Azure App Configuration.
author: avanigupta
ms.author: avgupta
ms.service: azure-app-configuration
ms.topic: concept-article
ms.date: 9/1/2026
ai-usage: ai-assisted
---

# Resiliency and disaster recovery

Azure App Configuration is a regional service. You create each configuration store in a specific Azure region. A region-wide outage affects all stores in that region, and failover between regions isn't available by default. However, Azure App Configuration supports [geo-replication](./concept-geo-replication.md). You can enable replicas of your data across multiple locations for enhanced resiliency to regional outages. Using geo-replication is the recommended solution for high availability.

This article provides general guidance on how you can use multiple replicas across Azure regions to increase the geo-resiliency of your application.

> [!TIP]
> See [best practices](./howto-best-practices.md#building-applications-with-high-resiliency) for building applications with high resiliency.

## High-availability architecture

The original App Configuration store is also considered a replica, so to achieve cross-region redundancy, you need to create at least one new replica in a different region. You can create multiple App Configuration replicas in different regions based on your requirements. You can then use these replicas in your application in your preferred order. With this setup, your application has at least one additional replica to fall back on if the primary replica becomes inaccessible.

The following diagram illustrates the topology between your application and two replicas:

:::image type="content" source="./media/concept-disaster-recovery/geo-redundant-app-configuration-replicas.png" alt-text="Diagram of geo-redundant replicas." lightbox="./media/concept-disaster-recovery/geo-redundant-app-configuration-replicas.png":::

Your application loads its configuration from the more preferred replica. If the preferred replica is not available, configuration is loaded from the less preferred replica. This increases the chance of successfully getting the configuration data. The data in both replicas is always in sync. 

## Failover between replicas

If you want to leverage automatic failover between replicas, follow [these instructions](./howto-geo-replication.md#scale-and-failover-with-replicas) to set up failover using App Configuration provider libraries. This is the recommended approach for building resiliency in your application.

If the App Configuration provider libraries don't meet your requirements, you can still implement your own failover strategy. When geo-replication is enabled and one replica isn't accessible, your application can fail over to another replica to access your configuration.

## Next steps

In this article, you learned how to augment your application to achieve geo-resiliency during runtime for App Configuration. You also can embed configuration data from App Configuration at build or deployment time. For more information, see [Integrate with a CI/CD pipeline](./integrate-ci-cd-pipeline.md).
