---
title: "Migrate Databases from Amazon Web Services (AWS)"
description: Concepts, how-tos, best practices for migrating databases from Amazon Web Services (AWS) to Microsoft Azure.
author: markingmyname
ms.author: maghan
ms.reviewer: prwilk, chkittel
ms.date: 03/24/2025
ms.topic: concept-article
---

# Migrate databases from Amazon Web Services (AWS) to Microsoft Azure

Migrating data is a critical part when moving from Amazon Web Services (AWS) to Microsoft Azure. This process involves transitioning your databases while making sure they work similarly in the new environment. The scope of this migration covers various database types, including relational databases, NoSQL databases, and data warehouses. For example, a workload that involves migrating an Amazon Relational Database Service (RDS) for PostgreSQL database to Azure Database for PostgreSQL.

## Component comparison

Start the process by comparing the Amazon Web Services (AWS) database and services used in the workload to their closest Azure counterparts. The goal is to identify the most suitable Azure services for your workload.

- [Azure for AWS Data and AI professionals](/azure/architecture/aws-professional/data-ai)
- [Compare AWS and Azure database technology](azure/architecture/aws-professional/databases)

> [!NOTE]
> This comparison shouldn't be considered an exact representation of these services' functionality in your workload.

## Migration scenarios

Refer to these scenarios as examples for framing your migration process.

| Scenario | Key services | Description |
| --- | --- | --- |
| [Amazon RDS for PostgreSQL to Azure Database for PostgreSQL](/azure/postgresql/migrate/migration-service/tutorial-migration-service-aws-offline?tabs=portal) | Amazon RDS for PostgreSQL -> Azure Database for PostgreSQL | This scenario involves migrating an Amazon RDS for PostgreSQL instance to Azure Database for PostgreSQL, ensuring minimal downtime and data integrity. |
| [Amazon Aurora PostgreSQL to Azure Database for PostgreSQL](/azure/postgresql/migrate/migration-service/tutorial-migration-service-aurora-offline?tabs=azure-portal) | Amazon Aurora for PostgreSQL -> Azure Database for PostgreSQL | This scenario covers migrating an Amazon Aurora PostgreSQL-compatible database to Azure Database for PostgreSQL, focusing on scaling horizontally to handle large datasets. |
| [Amazon RDS for MySQL to Azure Database for MySQL](/azure/mysql/flexible-server/how-to-migrate-rds-mysql-data-in-replication) | Amazon RDS for MySQL -> Azure Database for MySQL | Provides a managed MySQL database with flexible scaling options and high availability. It supports private endpoints and virtual network integration, ensuring secure and isolated communication. |
| [Amazon SQL Server to Azure SQL Database](/data-migration/sql-server/database/guide) | Amazon RDS for SQL Server -> Azure SQL Database | This scenario involves migrating an Amazon RDS instance to Azure SQL Database, ensuring minimal downtime and data integrity. |
| [Amazon DynamoDB application to Azure Cosmos DB for NoSQL](/azure/cosmos-db/nosql/dynamodb-data-migration-cosmos-db) | Amazon DynamoDB application -> Azure Cosmos DB for NoSQL | This scenario involves migrating an Amazon DynamoDB application to Azure Cosmos DB, ensuring minimal downtime and data integrity. |
| [Amazon DynamoDB data to Azure Cosmos DB for NoSQL](/azure/cosmos-db/nosql/dynamodb-data-migration-cosmos-db) | Amazon DynamoDB data -> Azure Cosmos DB for NoSQL | This scenario involves migrating an Amazon DynamoDB data to Azure Cosmos DB, ensuring minimal downtime and data integrity. |
| [Amazon ElastiCache to Azure Cache for Redis](/azure/azure-cache-for-redis/cache-migration-guide) | Amazon ElastiCache -> Azure Cache for Redis | This scenario involves migrating an Amazon ElastiCache to Azure Cache for Redis, ensuring minimal downtime and data integrity. |
| [CouchBase on AWS to Azure Cosmos DB for NoSQL](/azure/cosmos-db/nosql/couchbase-cosmos-migration) | CouchBase on AWS -> Azure Cosmos DB for NoSQL] | This scenario involves migrating Java applications that are connected to Couchbase on AWS to an API for NoSQL account in Azure Cosmos DB, ensuring minimal downtime and data integrity. |

## Related workload components

Databases are only one of the components of your workload. Explore other components that are part of the migration process:

- [Compute](./migrate-compute-from-aws.md)
- [Storage](./migrate-storage-from-aws.md)

Use the table of contents to explore other articles related to your workload's architecture.
