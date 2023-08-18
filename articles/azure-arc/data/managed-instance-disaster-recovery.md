---
title: Disaster recovery - Azure Arc-enabled SQL Managed Instance
description: Describes disaster recovery for Azure Arc-enabled SQL Managed Instance
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 08/02/2023
ms.topic: conceptual
---

# Azure Arc-enabled SQL Managed Instance - disaster recovery 

To configure disaster recovery in Azure Arc-enabled SQL Managed Instance, set up Azure failover groups. This article explains failover groups.

## Background

Azure failover groups use the same distributed availability groups technology that is in SQL Server. Because Azure Arc-enabled SQL Managed Instance runs on Kubernetes, there's no Windows failover cluster involved.  For more information, see [Distributed availability groups](/sql/database-engine/availability-groups/windows/distributed-availability-groups).

> [!NOTE]
> - The Azure Arc-enabled SQL Managed Instance in both geo-primary and geo-secondary sites need to be identical in terms of their compute & capacity, as well as service tiers they are deployed in.
> - Distributed availability groups can be set up for either General Purpose or Business Critical service tiers. 

You can configure failover groups in with the CLI or in the portal. For prerequisites and instructions see the respective content below:

- [Configure failover group - portal](managed-instance-disaster-recovery-portal.md)
- [Configure failover group - CLI](managed-instance-disaster-recovery-cli.md)

## Next steps

- [Overview: Azure Arc-enabled SQL Managed Instance business continuity](managed-instance-business-continuity-overview.md)
