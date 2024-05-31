---
title: Geo-replication
description: This article describes the Geo-replication in Azure Database for PostgreSQL - Flexible Server.
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.custom:
  - ignite-2023
---

# Geo-replication in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

A read replica can be created in the same region as the primary server and in a different one. Geo-replication can be helpful for scenarios like disaster recovery planning or bringing data closer to your users.

You can have a primary server in any [Azure Database for PostgreSQL flexible server region](https://azure.microsoft.com/global-infrastructure/services/?products=postgresql). A primary server can also have replicas in any global region of Azure that supports Azure Database for PostgreSQL flexible server. Additionally, we support special regions [Azure Government](../../azure-government/documentation-government-welcome.md) and [Microsoft Azure operated by 21Vianet](/azure/china/overview-operations). The special regions now supported are:

- **Azure Government regions**:
  - US Gov Arizona
  - US Gov Texas
  - US Gov Virginia

- **Microsoft Azure operated by 21Vianet regions**:
  - China North 3
  - China East 3

> [!NOTE]
> [Virtual endpoints](concepts-read-replicas-virtual-endpoints.md) and [promote to primary server features](concepts-read-replicas-promote.md) - are not currently supported in the special regions listed above.

## Paired regions for disaster recovery purposes

While creating replicas in any supported region is possible, there are notable benefits when opting for replicas in paired regions, especially when architecting for disaster recovery purposes:

- **Region Recovery Sequence**: In a geography-wide outage, recovery of one region from every paired set is prioritized, ensuring that applications across paired regions always have a region expedited for recovery.

- **Sequential Updating**: Paired regions' updates are staggered chronologically, minimizing the risk of downtime from update-related issues.

- **Physical Isolation**: A minimum distance of 300 miles is maintained between data centers in paired regions, reducing the risk of simultaneous outages from significant events.

- **Data Residency**: With a few exceptions, regions in a paired set reside within the same geography, meeting data residency requirements.

- **Performance**: While paired regions typically offer low network latency, enhancing data accessibility and user experience, they might not always be the regions with the absolute lowest latency. If the primary objective is to serve data closer to users rather than prioritize disaster recovery, it's crucial to evaluate all available regions for latency. In some cases, a nonpaired region might exhibit the lowest latency. For a comprehensive understanding, you can reference [Azure's round-trip latency figures](../../networking/azure-network-latency.md#round-trip-latency-figures) to make an informed choice.

For a deeper understanding of the advantages of paired regions, refer to [Azure's documentation on cross-region replication](../../reliability/cross-region-replication-azure.md#azure-paired-regions).


## Regional Failures and Recovery

Azure facilities across various regions are designed to be highly reliable. However, under rare circumstances, an entire region can become inaccessible due to reasons ranging from network failures to severe scenarios like natural disasters. Azure's capabilities allow for creating applications that are distributed across multiple regions, ensuring that a failure in one region doesn't affect others.

### Prepare for Regional Disasters

Being prepared for potential regional disasters is critical to ensure the uninterrupted operation of your applications and services. If you're considering a robust contingency plan for your Azure Database for PostgreSQL flexible server instance, here are the key steps and considerations:

1.  **Establish a geo-replicated read replica**: It's essential to have a read replica set up in a separate region from your primary. This ensures continuity in case the primary region faces an outage. 
2.  **Ensure server symmetry**: The "promote to primary server" action is the most recommended for handling regional outages, but it comes with a [server symmetry](concepts-read-replicas.md#configuration-management) requirement. This means both the primary and replica servers must have identical configurations of specific settings. The advantages of using this action include:
     * No need to modify application connection strings if you use [virtual endpoints](concepts-read-replicas-virtual-endpoints.md).
     * It provides a seamless recovery process where, once the affected region is back online, the original primary server automatically resumes its function, but in a new replica role.
3.  **Set up virtual endpoints**: Virtual endpoints allow for a smooth transition of your application to another region if there is an outage. They eliminate the need for any changes in the connection strings of your application.
4.  **Configure the read replica**: Not all settings from the primary server are replicated over to the read replica. It's crucial to ensure that all necessary configurations and features (for example, PgBouncer) are appropriately set up on your read replica. For more information, see the [Configuration management](concepts-read-replicas-promote.md#configuration-management) section.
5.  **Prepare for High Availability (HA)**: If your setup requires high availability, it won't be automatically enabled on a promoted replica. Be ready to activate it post-promotion. Consider automating this step to minimize downtime.
6.  **Regular testing**: Regularly simulate regional disaster scenarios to validate existing thresholds, targets, and configurations. Ensure that your application responds as expected during these test scenarios.
7.  **Follow Azure's general guidance**: Azure provides comprehensive guidance on [reliability and disaster preparedness](../../reliability/overview.md). It's highly beneficial to consult these resources and integrate best practices into your preparedness plan.

Being proactive and preparing in advance for regional disasters ensure the resilience and reliability of your applications and data.

### When outages impact your SLA

In the event of a prolonged outage with Azure Database for PostgreSQL flexible server in a specific region that threatens your application's service-level agreement (SLA), be aware that both the actions discussed below aren't service-driven. User intervention is required for both. It's a best practice to automate the entire process as much as possible and to have robust monitoring in place. For more information about what information is provided during an outage, see the [Service outage](concepts-business-continuity.md#service-outage) page. Only a **forced** promote is possible in a region down scenario, meaning the amount of data loss is roughly equal to the current lag between the replica and primary. Hence, it's crucial to [monitor the lag](concepts-read-replicas.md#monitor-replication). Consider the following steps:

**Promote to primary server**

This option won't require updating the connection strings in your application, provided virtual endpoints are configured. Once activated, the writer endpoint will repoint to the new primary in a different region and the [replication state](concepts-read-replicas.md#monitor-replication) column in the Azure portal will display "Reconfiguring". Once the affected region is restored, the former primary server will automatically resume, but now in a replica role.

**Promote to independent server and remove from replication**

In that case, this is the only viable option. After promoting the server, you'll need to update your application's connection strings. Once the original region is restored, the old primary might become active again. Ensure to remove it to avoid incurring unnecessary costs. If you wish to maintain the previous topology, recreate the read replica.


## Related content

- [Read replicas - overview](concepts-read-replicas.md)
- [Promote read replicas](concepts-read-replicas-promote.md)
- [Virtual endpoints](concepts-read-replicas-virtual-endpoints.md)
- [Create and manage read replicas in the Azure portal](how-to-read-replicas-portal.md)
- [Cross-region replication with virtual network](concepts-networking.md#replication-across-azure-regions-and-virtual-networks-with-private-networking)
