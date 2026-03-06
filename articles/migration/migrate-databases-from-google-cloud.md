---
title: Migrate Databases from Google Cloud to Azure
description: Learn how to migrate databases from Google Cloud Platform (GCP) to Azure with concepts, best practices, and step-by-step guides.
author: reginahack
ms.author: rhackenberg
ms.date: 02/18/2026
ms.topic: concept-article
ms.service: azure
ms.collection:
 - migration
 - gcp-to-azure
ms.custom: migration-hub
---

# Migrate databases from Google Cloud Platform (GCP) to Azure

Migrating data from Google Cloud Platform (GCP) to Azure is a critical step in ensuring a seamless transition to Azure. This article covers how to migrate relational databases, NoSQL databases, and data warehouses effectively. For example, learn how to migrate a Google Cloud SQL for PostgreSQL database to Azure Database for PostgreSQL.

## Component comparison

Start the migration process by comparing the GCP database and services used in the workload to their closest Azure counterparts. The goal is to identify the most suitable Azure services for your workload. For more information, see [Compare Google Cloud and Azure database](/azure/architecture/gcp-professional/services#data-platform).

> [!NOTE]
> This comparison isn't an exact representation of the functionality that these services provide in your workload.

## Migration scenarios

Use the following migration guides as examples to help structure your migration strategy.

| Scenario | Key services | Description |
| --- | --- | --- |
| [Migrate to Azure Database for PostgreSQL offline](/azure/postgresql/migrate/migration-service/tutorial-migration-service-cloud-sql-offline). | Google Cloud SQL for PostgreSQL to Azure Database for PostgreSQL | This scenario migrates a Google Cloud SQL for PostgreSQL instance to Azure Database for PostgreSQL offline. This approach helps ensure minimal downtime and data integrity. |
| [Migrate to Azure Database for PostgreSQL online](/azure/postgresql/migrate/migration-service/tutorial-migration-service-cloud-sql-online). | Google Cloud SQL for PostgreSQL to Azure Database for PostgreSQL | This article describes how to migrate your PostgreSQL database from Google Cloud SQL for PostgreSQL to Azure Database for PostgreSQL online. |
| [Migrate MySQL on Google Cloud to Azure Database for MySQL](/azure/azure-sql/migration-guides/database/mysql-to-sql-database-guide). | Google Cloud SQL for MySQL to Azure Database for MySQL | This article describes how to migrate your MySQL database to an Azure SQL database by using SQL Server Migration Assistant for MySQL.|

## Related workload components

The following list includes platform-agnostic articles that have general guidance about how to migrate databases and security components to GCP.

- [Plan your migration to Microsoft Sentinel](/azure/sentinel/migration)
- [Google Cloud Platform Identity and Access Management connector for Microsoft Sentinel](/azure/sentinel/connect-google-cloud-platform)

Use the table of contents to explore other articles that relate to your workload's architecture.