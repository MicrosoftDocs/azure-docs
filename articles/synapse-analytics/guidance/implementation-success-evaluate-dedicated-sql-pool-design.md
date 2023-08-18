---
title: "Synapse implementation success methodology: Evaluate dedicated SQL pool design"
description: "Learn how to evaluate your dedicated SQL pool design to identify issues and validate that it meets guidelines and requirements."
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 05/31/2022
---

# Synapse implementation success methodology: Evaluate dedicated SQL pool design

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

You should evaluate your [dedicated SQL pool](../sql-data-warehouse/sql-data-warehouse-overview-what-is.md) design to identify issues and validate that it meets guidelines and requirements. By evaluating the design *before solution development begins*, you can avoid blockers and unexpected design changes. That way, you protect the project's timeline and budget.

Synapse SQL has a scale-out architecture that distributes computational data processing across multiple nodes. Compute is separate from storage, which enables you to scale compute independently of the data in your system. For more information, see [Dedicated SQL pool (formerly SQL DW) architecture in Azure Synapse Analytics](../sql-data-warehouse/massively-parallel-processing-mpp-architecture.md).

## Assessment analysis

During the [assessment stage](implementation-success-assess-environment.md), you collected information about how the original system was deployed and details of the structures that were implemented. That information can now help you to identify gaps between what's implemented and what needs to be developed. For example, now's the time to consider the impact of designing round-robin tables instead of hash distributed tables, or the performance benefits of correctly using replicated tables.

## Review the target architecture

To successfully deploy a dedicated SQL pool, it's important to adopt an architecture that's aligned with business requirements. For more information, see [Data warehousing in Microsoft Azure](/azure/architecture/data-guide/relational-data/data-warehousing).

## Migration path

A migration project for Azure Synapse is similar to any other database migration. You should consider that there might be differences between the original system and Azure Synapse.

Ensure that you have a clear migration path established for:

- Database objects, scripts, and queries
- Data transfer (export from source and transit to the cloud)
- Initial data load into Azure Synapse
- Logins and users
- Data access control (row-level security)

For more information, see [Migrate a data warehouse to a dedicated SQL pool in Azure Synapse Analytics](../migration-guides/migrate-to-synapse-analytics-guide.md).

## Feature gaps

Determine whether the original system depends on features that aren't supported by Azure Synapse. Unsupported features in dedicated SQL pools include certain data types, like XML and spatial data types, and cursors.

For more information, see:

- [Table data types for dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics](../sql-data-warehouse/sql-data-warehouse-tables-data-types.md#identify-unsupported-data-types)
- [Transact-SQL features supported in Azure Synapse SQL](../sql/overview-features.md)

## Dedicated SQL pool testing 

As with any other project, you should conduct tests to ensure that your dedicated SQL pool delivers the required business needs. It's critical to test data quality, data integration, security, and performance.

## Next steps

In the [next article](implementation-success-evaluate-serverless-sql-pool-design.md) in the *Azure Synapse success by design* series, learn how to evaluate your Spark pool design to identify issues and validate that it meets guidelines and requirements.
