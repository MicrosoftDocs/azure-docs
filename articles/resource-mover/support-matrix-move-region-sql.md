---
title: Support for moving Azure SQL resources between regions with Azure Resource Mover.
description: Review support for moving Azure SQL resources between regions with Azure Resource Mover.
author: rayne-wiselman
manager: evansma
ms.service: resource-move
ms.topic: conceptual
ms.date: 09/07/2020
ms.author: raynew

---
# Support for moving Azure SQL resources between Azure regions

This article summarizes support and prerequisites for moving Azure SQL resources between Azure regions with Azure Resource Mover.

## Requirements

Requirements are summarized in the following table.

**Feature** | **Supported/Not supported** | **Details**
--- | --- | ---
**Azure SQL Database Hyperscale** | Not supported | Can't move databases in the Azure SQL Hyperscale service tier with Resource Mover.
**Zone redundancy** | Supported |  Supported move options:<br/><br/> - Between regions that support zone redundancy.<br/><br/> - Between regions that don't support zone redundancy.<br/><br/> - Between a region that supports zone redundancy to a region that doesn't support zone redundancy.<br/><br/> - Between a region that doesn't support zone redundancy to a region that does support zone redundancy. 
**Data sync** | Hub/sync database: Not supported<br/><br/> Sync member: Supported. | If a sync member is moved, you need to set up data sync to the new target database.
**Existing geo-replication** | Supported | Existing geo replicas are remapped to the new primary in the target region.<br/><br/> Seeding must be initialized after the move. [Learn more](../azure-sql/database/active-geo-replication-configure-portal.md)
**Transparent Data Encryption (TDE) with Bring Your Own Key (BYOK)** | Supported | [Learn more](../key-vault/general/move-region.md) about moving key vaults across regions.
**TDE with service-managed key** | Supported. |  [Learn more](../key-vault/general/move-region.md) about moving key vaults across regions.
**Dynamic data masking rules** | Supported. | Rules are automatically copied over to the target region as part of the move. [Learn more](../azure-sql/database/dynamic-data-masking-configure-portal.md).
**Advanced data security** | Not supported. | Workaround: Set up at the SQL Server level in the target region. [Learn more](../azure-sql/database/azure-defender-for-sql.md).
**Firewall rules** | Not supported. | Workaround: Set up firewall rules for SQL Server in the target region. Database-level firewall rules are copied from the source server to the target server. [Learn more](../azure-sql/database/firewall-create-server-level-portal-quickstart.md).
**Auditing policies** | Not supported. | Policies will reset to default after the move. [Learn](../azure-sql/database/auditing-overview.md) how to reset.
**Backup retention** | Supported. | Backup retention policies for the source database are carried over to the target database. [Learn](../azure-sql/database/long-term-backup-retention-configure.md) how to modify settings after the move.
**Auto tuning** | Not supported. | Workaround: Set auto tuning settings after the move. [Learn more](../azure-sql/database/automatic-tuning-enable.md).
**Database alerts** | Not supported. | Workaround: Set alerts after the move. [Learn more](../azure-sql/database/alerts-insights-configure-portal.md).
**Azure SQL Server stretch database** | Not Supported | Can't move SQL server stretch databases with Resource Mover.
**Azure Synapse Analytics** | Not Supported | Can’t move Azure Synapse Analytics with Resource Mover.
## Next steps

Try [Azure SQL resources](tutorial-move-region-sql.md) to another region with Resource Mover.