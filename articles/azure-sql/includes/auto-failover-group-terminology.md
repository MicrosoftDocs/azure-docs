---
title: Auto-failover group overview
description: De-duplicating content between SQL Database and SQL Managed Instance, in this case using an include for the terminology for auto-failover groups that overlap between both products. 
ms.topic: include
author: MashaMSFT
ms.author: mathoma
ms.reviewer: kendralittle, emlisa, mlandzic
ms.date: 03/01/2022
---

- **Automatic failover policy**

  By default, a failover group is configured with an automatic failover policy. The system triggers a geo-failover after the failure is detected and the grace period has expired. The system must verify that the outage cannot be mitigated by the built-in [high availability infrastructure](../database/high-availability-sla.md), for example due to the scale of the impact. If you want to control the geo-failover workflow from the application or manually, you can turn off automatic failover policy.
  
  > [!NOTE]
  > Because verification of the scale of the outage and how quickly it can be mitigated involves human actions, the grace period cannot be set below one hour. This limitation applies to all databases in the failover group regardless of their data synchronization state.

- **Read-only failover policy**

  By default, the failover of the read-only listener is disabled. It ensures that the performance of the primary is not impacted when the secondary is offline. However, it also means the read-only sessions will not be able to connect until the secondary is recovered. If you cannot tolerate downtime for the read-only sessions and can use the primary for both read-only and read-write traffic at the expense of the potential performance degradation of the primary, you can enable failover for the read-only listener by configuring the `AllowReadOnlyFailoverToPrimary` property. In that case, the read-only traffic will be automatically redirected to the primary if the secondary is not available.

  > [!NOTE]
  > The `AllowReadOnlyFailoverToPrimary` property only has effect if automatic failover policy is enabled and an automatic geo-failover has been triggered. In that case, if the property is set to True, the new primary will serve both read-write and read-only sessions.

- **Planned failover**

  Planned failover performs full data synchronization between primary and secondary databases before the secondary switches to the primary role. This guarantees no data loss. Planned failover is used in the following scenarios:

  - Perform disaster recovery (DR) drills in production when data loss is not acceptable
  - Relocate the databases to a different region
  - Return the databases to the primary region after the outage has been mitigated (failback)

- **Unplanned failover**

  Unplanned or forced failover immediately switches the secondary to the primary role without waiting for recent changes to propagate from the primary. This operation may result in data loss. Unplanned failover is used as a recovery method during outages when the primary is not accessible. When the outage is mitigated, the old primary will automatically reconnect and become a new secondary. A planned failover may be executed to fail back, returning the replicas to their original primary and secondary roles.

- **Manual failover**

  You can initiate a geo-failover manually at any time regardless of the automatic failover configuration. During an outage that impacts the primary, if automatic failover policy is not configured, a manual failover is required to promote the secondary to the primary role. You can initiate a forced (unplanned) or friendly (planned) failover. A friendly failover is only possible when the old primary is accessible, and can be used to relocate the primary to the secondary region without data loss. When a failover is completed, the DNS records are automatically updated to ensure connectivity to the new primary.

- **Grace period with data loss**

  Because the data is replicated to the secondary database using asynchronous replication, an automatic geo-failover may result in data loss. You can customize the automatic failover policy to reflect your application’s tolerance to data loss. By configuring `GracePeriodWithDataLossHours`, you can control how long the system waits before initiating a forced failover, which may result in data loss.