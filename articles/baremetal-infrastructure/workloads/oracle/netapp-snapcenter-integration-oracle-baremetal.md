---
title: SnapCenter integration for Oracle on BareMetal Infrastructure 
description: Learn how to use snapshot technologies from Oracle and NetApp to create operational recovery backups for Oracle databases on BareMetal Infrastructure.
ms.topic: how-to
ms.subservice: baremetal-oracle
ms.date: 05/05/2021
---

# SnapCenter integration for Oracle on BareMetal Infrastructure

This how-to guide helps you with snapshot technologies from Oracle and NetApp to create operational recovery backups for Oracle databases. The use of snapshots is just one of several data protection approaches for Oracle. Snapshots can mitigate downtime and data loss when running an Oracle database on BareMetal Infrastructure. 

>[!IMPORTANT]
>SnapCenter supports Oracle for SAP applications, but it does not provide SAP BR\*Tools integration.

Although Oracle offers two different backup methods for snapshots, SnapCenter from NetApp only supports one method: hot backup mode. The hot backup mode is the traditional version of backing up and creating Oracle snapshots. It requires interaction with the Oracle host to temporarily place the database into a hot backup mode to catalog the archive logs properly. Hot backup mode also enables greater interaction with the RMAN database to keep closer track of available snapshots for recovery. 

The articles in this guide walk you through creating an operational recovery and disaster recovery framework for Oracle in hot backup mode. Disaster recovery is recovery of a database, or part of a database, following a disaster. An example might be a bad drive or a corrupt database. Operational recovery is recovery from something other than a disaster. An example might be the loss of a few rows of data that doesn't impede your business.

## SnapCenter database organization
SnapCenter organizes databases into resource groups. A resource group can be one or many databases with the same protection policy. So you don't have to select  individual volumes that are part of the backup.

:::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/snapcenter-database-resource-group.png" alt-text="Diagram showing how SnapCenter organizes databases into resource groups" border="false":::

## Oracle disaster recovery architecture

Oracle hot-backups are divided into two different backups to roll forward using archive logs after restoring the datafiles. Protection of the datafiles and control files is on an "hourly" basis, but a longer backup frequency is acceptable. The longer the intervals between backups, the longer the recovery time.  

SnapCenter creates local snapshots of the database in the default datafile locations (nfs01). Snapshots get created on each file system that hosts either datafiles or control files. These backups ensure the database's fast recovery. It doesn't protect data in a multi-disk failure or site failure. 

The number of "hourly" snapshots is dependent on the backup policies set. An Oracle database has 2-5 days of operational recovery capability from snapshots.
 
Enough archive logs must exist and are required to roll forward the Oracle database from the most recent, viable datafiles recovery point. Use snapshots of archive logs to lessen the recovery point objective (RPO) for an Oracle database. The shorter the frequency of snapshots on the archive logs, the less the RPO. The recommended snapshot interval for the archive logs is either five minutes or 15 minutes. The shorter interval of 5 minutes has the shortest RPO.  The shorter interval does increase the complexity, because more snapshots must be managed as part of the recovery process.

## Next steps

Learn to set up NetApp SnapCenter to route traffic from Azure to Oracle BareMetal Infrastructure servers.

> [!div class="nextstepaction"]
> [Set up SnapCenter to route traffic](set-up-snapcenter-to-route-traffic.md)
