---
title: Difference between Azure Synapse (formerly SQL DW) and Azure Synapse Analytics workspaces
description: Learn about the history and difference between Azure Synapse (formerly SQL DW) and Azure Synapse Analytics workspaces.
author: WilliamDAssafMSFT 
ms.author: wiassaf
ms.service: azure-synapse-analytics
ms.topic: conceptual
ms.subservice: sql
ms.date: 10/06/2024
---

# Difference between Azure Synapse (formerly SQL DW) and Azure Synapse Analytics workspaces

*Originally posted as a techcommunity blog at: https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/what-s-the-difference-between-azure-synapse-formerly-sql-dw-and/ba-p/3597772*

There has been confusion for a while when it comes to Microsoft Docs and the two distinct sets of documentation for dedicated SQL pools. When you do an internet search for an Azure Synapse related doc and land on Microsoft Learn Docs site, the Table of Contacts has a toggle switch between two sets of documentation.

This article clarifies which documentation applies to your Synapse Analytics environment.

|Azure Synapse Analytics  |Dedicated SQL pools (formerly SQL DW)  |
|---------|---------|
|:::image type="content" source="media/overview-difference-between-formerly-sql-dw-workspace/switch-to-azure-synapse.png" alt-text="Screenshot from the Microsoft Learn Docs site showing the Azure Synapse Analytics table of contents."::: | :::image type="content" source="media/overview-difference-between-formerly-sql-dw-workspace/switch-to-dedicated-sql-pool-formerly-sql-dw.png" alt-text="Screenshot from the Microsoft Learn Docs site showing the older dedicated SQL pool (formerly SQL DW) table of contents."::: |

You'll also see notes in many docs trying to highlight which Synapse implementation of dedicated SQL pools the document is referencing.

## Dedicated SQL pools exist in two different modalities

Standalone or existing SQL Data Warehouses were renamed to "dedicated SQL pools (formerly SQL DW)" in November 2020. Ever since, dedicated SQL pools created within Synapse Analytics are "dedicated SQL pools in Synapse workspaces."

Circa 2016, Microsoft adapted its massively parallel processing (MPP) on-premises appliance to the cloud as "Azure SQL Data Warehouse" or "SQL DW" for short.

Historians remember the appliance was named parallel data warehouse (PDW) and then Analytics Platform System (APS) which still powers many on-premises data warehousing solutions today.

Azure SQL Data Warehouse adopted the constructs of Azure SQL DB such as a logical server where administration and networking are controlled. SQL DW could exist on the same server as other SQL DBs. This implementation made it easy for current Azure SQL DB administrators and practitioners to apply the same concepts to data warehouse.

However, the analytics and insights space has gone through massive changes since 2016. We made a paradigm shift in how data warehousing would be delivered. As SQL DW handled the warehousing, the Synapse workspace expanded upon that and rounded out the analytics portfolio. The new Synapse Workspace experience became generally available in 2020.

:::image type="content" source="media/overview-difference-between-formerly-sql-dw-workspace/synapse-workspace.png" alt-text="Diagram of the Azure Synapse Analytics workspace, experience, and platform.":::

The original SQL DW component is just one part of this. It became known as a dedicated SQL pool. 

:::image type="content" source="media/overview-difference-between-formerly-sql-dw-workspace/dedicated-sql-pool.png" alt-text="Diagram of the differences for a dedicated SQL pool from a Synapse workspace.":::

This was a big change and with more capabilities. The whole platform received a fitting new name: Synapse Analytics.

But what about all the existing SQL DWs? Would they automatically become Synapse Workspaces?

## Rebranding and migration

Azure SQL DW instances weren't automatically upgraded to Synapse Analytics workspaces. 

Many factors play into big platform upgrades, and it was best to allow customers to opt in for this. Azure SQL DW was rebranded as "Dedicated SQL pool (formerly SQL DW)" with intention to create clear indication that the former SQL DW is in fact the same artifact that lives within Synapse Analytics.

:::image type="content" source="media/overview-difference-between-formerly-sql-dw-workspace/dedicated-sql-pool-vs-azure-synapse-analytics-workspace.png" alt-text="Diagram of the feature differences between dedicated SQL pool (formerly SQL DW) and Azure Synapse Analytics.":::

In documentation, you'll also see "Dedicated SQL pool (formerly SQL DW)" referred to as "standalone dedicated SQL pool".

[Migration of a dedicated SQL pool (formerly SQL DW)](../sql-data-warehouse/workspace-connected-create.md) in relative terms is easy with just a few steps from the Azure portal. However, it isn't quite a full migration. There's a subtle difference which is noticed from the toast that pops up in the Azure portal.

:::image type="content" source="media/overview-difference-between-formerly-sql-dw-workspace/accessed-from-a-synapse-workspace.png" alt-text="Screenshot from the Azure portal of the purple ribbon alerting you that your dedicated SQL pool (formerly SQL DW) can now be accessed from a Synapse workspace.":::

In a migration, the dedicated SQL pool (formerly SQL DW) never really is migrated. It stays on the logical server it was originally on. The server DNS `server-123.database.windows.net` never becomes `server-123.sql.azuresynapse.net`. Customers that "upgraded" or "migrated" a SQL DW to Synapse Analytics still have a full logical server that could be shared in an Azure SQL Database logical server.

## The Migrated SQL DW and Synapse workspace

The upgrade or migration path described in the previous section is connected to a Synapse workspace. For migrated environments, use documentation in [dedicated SQL pool (formerly SQL DW)](../sql-data-warehouse/sql-data-warehouse-overview-what-is.md) for dedicated SQL pool scenarios. All of the other components of Synapse Analytics would be accessed from the [Synapse Analytics documentation](../overview-what-is.md).

A quick way to visualize this as a "blend" of all the additional Synapse Analytics workspace capabilities and the original SQL DW follows.

:::image type="content" source="media/overview-difference-between-formerly-sql-dw-workspace/migrated-dedicated-sql-pool-vs-azure-synapse-analytics-workspace.png" alt-text="Diagram of the feature differences between a migrated dedicated SQL pool (formerly SQL DW) and Azure Synapse Analytics.":::

If you never migrated a SQL DW and you started your journey with creating a Synapse Analytics Workspace, then you simply use [Synapse Analytics documentation](../overview-what-is.md).


## PowerShell differences

One of the biggest areas of confusion in documentation between "dedicated SQL pool (formerly SQL DW)" and "Synapse Analytics" dedicated SQL pools is PowerShell.

The original SQL DW implementation uses a logical server that is the same as Azure SQL Database. There's a shared PowerShell module named [Az.Sql](/powershell/module/az.sql). In this module, to create a new dedicated SQL pool (formerly SQL DW), the cmdlet [New-AzSqlDatabase](/powershell/module/az.sql/new-azsqldatabase) has a parameter for `Edition` that is used to distinguish that you want a `DataWarehouse`.

When Synapse Analytics was released, it came with a different PowerShell module of [Az.Synapse](/powershell/module/az.synapse). To create a dedicated SQL pool in a Synapse Analytics Workspace, you would use [New-AzSynapseSqlPool](/powershell/module/az.synapse/new-azsynapsesqlpool). In this PowerShell module, there's no need to include an "Edition" parameter, as it's exclusively used for Synapse.

These two modules ARE NOT equal in all cases. There are some actions that can be done in `Az.Sql` that can't be done in `Az.Synapse`. For instance, performing a restore for a dedicated SQL pool (formerly SQL DW) uses `Restore-AzSqlDatabase` cmdlet while Synapse Analytics uses `Restore-AzSynapseSqlPool`. However, the action to [restore across a subscription boundary](../sql-data-warehouse/sql-data-warehouse-restore-active-paused-dw.md#restore-an-existing-dedicated-sql-pool-formerly-sql-dw-to-a-different-subscription-through-powershell) is only available in `Az.Sql` module with `Restore-AzSqlDatabase`.

## Related content

- [What is Azure Synapse Analytics?](../overview-what-is.md)
- [What is dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics?](../sql-data-warehouse/sql-data-warehouse-overview-what-is.md)

