---
title: Migrate Databases from Google Cloud
description: Concepts, how-tos, best practices for moving databases from Google Cloud to Azure.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 01/28/2025
ms.topic: conceptual
---

# Migrate databases from Google Cloud Platform (GCP) to Microsoft Azure

Migrating data is a critical part when moving from Google Cloud Platform (GCP) to Microsoft Azure. This process involves transitioning your databases while making sure they work similarly in the new environment. The scope of this migration covers various database types, including relational databases, NoSQL databases, and data warehouses. For example, a workload that involves migrating an Google Cloud SQL for PostgreSQL database to Azure Database for PostgreSQL.

## Component comparison

Start the process by comparing the Google Cloud Platform (GCP) database and services used in the workload to their closest Azure counterparts. The goal is to identify the most suitable Azure services for your workload.

- [Azure for Google Cloud Professionals](/azure/architecture/gcp-professional/)
- [Compare GCP and Azure database technology](/azure/architecture/gcp-professional/services#data-platform)

> [!NOTE]
> This comparison shouldn't be considered an exact representation of these services' functionality in your workload.

## Migration scenarios

Refer to these scenarios as examples for framing your migration process.

| Scenario | Key services | Description |
| --- | --- | --- |
| [Migrate to Azure Database for PostgreSQL (online)](/azure/postgresql/migrate/migration-service/tutorial-migration-service-cloud-sql-online) | Google Cloud SQL for PostgreSQL -> Azure Database for PostgreSQL | This scenario involves migrating a Google Cloud SQL for PostgreSQL instance to Azure Database for PostgreSQL offline, ensuring minimal downtime and data integrity. |
| [Migrate MySQL on Google Cloud to Azure Database for MySQL](/azure/azure-sql/migration-guides/database/mysql-to-sql-database-guide?view=azuresql-db&preserve-view=true) | Google Cloud SQL for MySQL -> Azure Database for MySQL | In this guide, you learn how to migrate your MySQL database to an Azure SQL database by using SQL Server Migration Assistant for MySQL (SSMA for MySQL).|

