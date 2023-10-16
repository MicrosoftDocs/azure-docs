---
author: croblesm
ms.author: roblescarlos
ms.date: 03/21/2023
ms.service: dms
ms.topic: include
ms.custom:
  - sql-migration-content
---

Azure SQL Database offline migration utilizes Azure Data Factory (ADF) pipelines for data movement and thus abides by ADF limitations. A corresponding ADF is created when a database migration service is also created. Thus factory limits apply per service.

- The machine where the SHIR is installed acts as the compute for migration. Make sure this machine can handle the cpu and memory load of the data copy. To learn more, review [SHIR recommendations](/azure/data-factory/create-self-hosted-integration-runtime). 
- 100,000 table per database limit.
- 10,000 concurrent database migrations per service.
- Migration speed heavily depends on the target Azure SQL Database SKU and the self-hosted Integration Runtime host.
- Azure SQL Database migration scales poorly with table numbers due to ADF overhead in starting activities. If a database has thousands of tables, the startup process of each table might take a couple of seconds, even if they're composed of one row with 1 bit of data.
- Azure SQL Database table names with double-byte characters currently aren't supported for migration. Mitigation is to rename tables before migration; they can be changed back to their original names after successful migration.
- Tables with large blob columns may fail to migrate due to timeout.
- Database names with SQL Server reserved are currently not supported.
- Database names that include semicolons are currently not supported.
- Computed columns don't get migrated.
