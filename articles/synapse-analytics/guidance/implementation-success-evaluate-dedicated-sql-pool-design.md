---
title: Evaluate dedicated SQL pool design
description: TODO (solution-evaluation)
author: peter-myers
ms.author: v-petermyers
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 02/28/2022
---

# Evaluate dedicated SQL pool design

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

The purpose of this evaluation is to validate the solution design's dedicated SQL Pool components and to identify early on any design issues and, to validate the design meets common guidelines. By evaluating the design before solution development begins blockers and unexpected design changes will be avoided and protect the project's timeline and budget.

Dedicated SQL pool refers to the enterprise relational data warehousing features that are available in Azure Synapse Analytics.

Synapse SQL leverages a scale out architecture to distribute computational processing of data across multiple nodes. Compute is separate from storage, which enables you to scale compute independently of the data in your system.

:::image type="content" source="media/implementation-success-evaluate-dedicated-sql-pool-design/sql-dedicated-pool.png" alt-text="TODO - image must have numbers and legend.":::

Review: [Dedicated SQL pool architecture - Azure Synapse Analytics \| Microsoft Docs](../sql-data-warehouse/massively-parallel-processing-mpp-architecture.md)

## Assessment analysis

During your initial assessment you collected information about how your existing system was deployed and the details of structures that were implemented.

From the assessment review, you will be able to understand what the gaps are between what is implemented and what should be in place to get optimal performance. For example, the impact of having round robin table vs Hash distributed tables or the performance benefits of correctly using replicated tables.

## Reviewing the target architecture

For the successful deployment of a dedicated SQL Pool, it is important to have an architecture well aligned with the business requirements to make sure that the system responds to all your business needs.

There are several architectural suggestions for dedicated SQL Pools in the Microsoft documentation and if necessary you can review the [Azure Data Architecture Guide](/azure/architecture/data-guide/)

## Migration

A migration project for synapse is very similar to any other Database migration. You will need to take in consideration that there might be differences between the original system and the Synapse.

Make sure that you have a clear migration path established for:

- DDL/DML/Security objects/etc.
- Data migration (export from source, transit to cloud)
- Initial Data load to Synapse
- Login/Users
- Data Access control (for ex. Row-Level Security)
- Time plan to execute

You can also review the [Migration guide](../migration-guides/migrate-to-synapse-analytics-guide.md?tabs=migratefromSQLServer).

## Feature gaps

From the information gathered during your assessment and the solution design verify that any unsupported features from the existing environment that will be required in the solution have been identified and that a solution for supportability has been designed or that there is time built into the project plan to further identify these unsupported features and develop solutions and workarounds.

Some examples of unsupported features in dedicated SQL Pools are:

- Identify unsupported data types (ex. Xml, arrays, spatial)
- Identify unsupported features (ex: Cursors)

## Dedicated SQL pool testing 

Just like any other project, your project should include the necessary set of tests to make sure that your dedicated SQL Pool responds as required to the needs of your business. It is critical to test at least for data quality, data integration, security, and performance.

## Conclusion

Taking the time to evaluate the design against the information gathered during the assessment and the capabilities of a dedicated SQL Pool will help assure that the best design for your solution will be implemented, and it will reduce the number of unexpected development or implementation issues that may be encountered during solution development.

## Next steps

TODO
