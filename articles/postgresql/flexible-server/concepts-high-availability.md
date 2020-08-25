---
title: Overview of zone redundant high availability with Azure Database for PostgreSQL - Flexible Server
description: Learn about the concepts of zone redundant high availability with Azure Database for PostgreSQL - Flexible Server
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: conceptual
ms.date: 08/24/2020
---
# High availability concepts in Azure Database for PostgreSQL -- Flexible Server

Azure Database for PostgreSQL - Flexible Server is currently in public
preview. It provides high availability with automatic failover using
zone redundant high availability. When deployed with zone redundancy,
Azure Database for PostgreSQL - Flexible Server automatically provisions
and manages a standby replica in an availability zone that is different
than the primary database server. The data is replicated using
PostgreSQL streaming replication in synchronous mode to enable zero data
loss after a failover.

Zone redundant configuration provides high availability and automatic
failover capability during planned events such as user-initiated scale
compute operation, and also when unplanned events such as underlying
hardware and software faults, network failures, and even availability
zone failures.

![view of zone redundant high availability](./media/concepts-business-continuity/concepts-zr-ha-architecture.png)

## Zone redundant high availability -- Architecture

Primary database server is deployed in the availability zone of your
choice. When the zone redundancy is chosen for high availability, a
standby database server with the same configuration as that of primary
server is automatically deployed. You can even add zone redundancy on an
existing Flexible server. Write ahead logs (WAL) files are replicated in
synchronous mode to the standby replica. Automatic backups are performed
from the primary database server. WAL files are continuously archived to
the backup storage from the standby replica.

## Steady-state operations

Applications can be connected to the primary server using the DB server
end point. Commits are confirmed to the application only after the logs
are persisted on the disk at the standby replica and an acknowledgement
is received. Due to this additional round-trip requirement, applications
writing to the HA enabled database server can expect elevated latency.
However, this enables standby replica to be on sync with the primary
server. You can monitor the health of the high availability on the
portal.

## Failover process

In the event of a planned or unplanned outage, Azure Database for
PostgreSQL Flexible Server determines to perform a failover based on the
type of outage. It severs the replication and promotes the standby
replica to be the primary database which includes recovery of data. DNS
entry is then updated and the new primary will be ready to accept client
connections. The overall failover time is expected to be 60-120s.
However, depending on the activity in the primary database server at the
time of the failover such as large transactions and recovery time, the
failover may take longer.

Not all outages trigger a failover. The failed database server will be
attempted to be restarted. If that is not successful, then the failover
is initiated. Other unplanned events such as AZ failure, storage fault,
networking issues can cause the failover. Similarly, planned downtime
activities such as scale compute, scale storage, periodic OS patching,
service patching, and minor version upgrades are applied in the standby
replica first. Then the applications are directed to the standby
replica. A new primary is then brought up with updated patches, database
versions, and scaled resources.

> [!IMPORTANT]
> Zone redundant high availability is not enabled for burstable compute tier.

> [!IMPORTANT]
> Standby replica cannot be used for query purposes.

## Reducing downtime with managed maintenance window

Flexible servers offer maintenance scheduling capability wherein you can
choose a 30 minute window during which the Azure maintenance works such
as patches or minor version upgrades would happen. For your flexible
servers configured with zone redundancy, the maintenance work are
performed on the standby replica first. Once that is complete, the
flexible server fails over to the replica before the primary is patched
or upgraded. In this model, the downtime to your application is limited
to the failover time to the standby replica.

## Point in time restore 

Flexible servers configured in zone redundancy provides a failover
capability to the standby replica. However, with synchronous
replication, the standby is in lockstep with the primary. Any user
errors on the primary -- such as an accidental drop of a table will drop
the table in the standby too. To recover from such cases, you can use
the point-in-time recovery to restore data as of earlier point in time
before the error occurred. The database server will be restored as a
single zone flexible server with a different user-provided name. You can
then export the object from the database server and import it to your
production database server. Similarly, if you want to clone your
database server for testing and development purposes, you can either
choose the latest time or the data as at a particular point of time. The
restore will create a single zone flexible server.

## Zone redundant high availability - features

-   Standby replica will be deployed in an exact VM configuration as
    that of primary. This includes vCores, storage, network settings
    (VNET, Firewall), etc.

-   Ability to add zone redundant high availability for an existing
    database server.

-   Ability to remove standby replica by disabling zone redundancy.

-   Ability to choose your availability zone for your primary database
    server.

-   Ability to stop, start, and restart both primary and standby
    database servers.

-   Automatic backups are performed from the primary database server.

-   In the event of a failover, a new standby replica is provisioned in
    the original primary availability zone.

-   Clients always connect to the primary database server.

-   In the event of a database crash or node failure, restarting will be
    attempted first on the same node. If that fails, then the automatic
    failover is triggered.

-   Ability to restart the server to pick up any static server parameter
    changes.

## Zone redundant high availability - considerations

-   Due to synchronous replication to another availability zone, primary
    database server can experience elevated write and commit latency.

-   Standby replica cannot be used for read-only queries.

-   Depending on the activity on the primary server at the time of
    failover, it might take up to 2 minutes or longer for the failover
    to complete.

-   Restarting the primary database server to pick up static parameter
    changes also restarts standby replica.

-   Logical decoding is not supported when configured in zone
    redundancy.

-   Configuring read replicas are not supported

-   Configuring customer initiated management tasks cannot be scheduled
    during managed maintenance window.

-   Planned events such as scale compute and minor version upgrades
    happen in both primary and standby at the same time. This incurs
    downtime.

Next steps

-   Learn about [Azure regions]()
-   Learn about [handling transient connectivity errors]()