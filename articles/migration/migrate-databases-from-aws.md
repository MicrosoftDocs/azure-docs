---
title: Migrate Databases from Amazon Web Services (AWS) to Azure
description: Learn how to migrate databases from AWS to Azure. See example scenarios for relational database, NoSQL database, and data warehouse migration.
author: markingmyname
ms.author: maghan
ms.reviewer: prwilk, chkittel
ms.date: 03/24/2025
ms.topic: concept-article
ms.collection:
 - migration
 - aws-to-azure
---

# Migrate databases from Amazon Web Services (AWS) to Azure

Data migration is critical when you move from Amazon Web Services (AWS) to Microsoft Azure. You need to transition your databases and make sure that they work similarly in the new environment. The scope of this migration includes various database types, such as relational databases, NoSQL databases, and data warehouses. For example, you might have a workload that uses an Amazon Relational Database Service (RDS) for PostgreSQL database that you need to migrate to Azure Database for PostgreSQL.

## Component comparison

Start the migration process by comparing the Amazon Web Services (AWS) database and services that your workload uses to their closest Azure counterparts. The goal is to identify the most suitable Azure services for your workload.

- [Compare relational database technologies on Azure and AWS](/azure/architecture/aws-professional/databases)
- [Compare data and AI technologies on Azure and AWS](/azure/architecture/aws-professional/data-ai)

> [!NOTE]
> This comparison isn't an exact representation of the functionality that these services provide in your workload.

## Migration scenarios

Use the following scenarios as examples for your migration process.

| Scenario | Key services | Description |
| --- | --- | --- |
| [Amazon RDS for PostgreSQL to Azure Database for PostgreSQL offline](/azure/postgresql/migrate/migration-service/tutorial-migration-service-aws-offline) | Amazon RDS for PostgreSQL to Azure Database for PostgreSQL | This scenario describes an Amazon RDS for PostgreSQL instance to Azure Database for PostgreSQL offline migration. It helps ensure data integrity preservation and minimal downtime. |
| [Amazon RDS for PostgreSQL to Azure Database for PostgreSQL online](/azure/postgresql/migrate/migration-service/tutorial-migration-service-aws-online) | Amazon RDS for PostgreSQL to Azure Database for PostgreSQL | This scenario describes an Amazon RDS for PostgreSQL instance to Azure Database for PostgreSQL online migration. It helps ensure data integrity preservation and minimal downtime. |
| [Amazon Aurora PostgreSQL to Azure Database for PostgreSQL offline](/azure/postgresql/migrate/migration-service/tutorial-migration-service-aurora-offline) | Amazon Aurora for PostgreSQL to Azure Database for PostgreSQL | This scenario describes an Amazon Aurora PostgreSQL-compatible database to Azure Database for PostgreSQL offline migration. It focuses on scaling horizontally to handle large datasets. |
| [Amazon Aurora PostgreSQL to Azure Database for PostgreSQL online](/azure/postgresql/migrate/migration-service/tutorial-migration-service-aurora-online) | Amazon Aurora for PostgreSQL to Azure Database for PostgreSQL | This scenario describes an Amazon Aurora PostgreSQL-compatible database to Azure Database for PostgreSQL online migration. It focuses on scaling horizontally to handle large datasets. |
| [MySQL on AWS to Azure Database for MySQL](/azure/mysql/flexible-server/how-to-migrate-rds-mysql-data-in-replication) | Amazon RDS for MySQL to Azure Database for MySQL | This scenario describes how to migrate a managed MySQL database that has flexible scaling options and high availability. It supports private endpoints and virtual network integration to help ensure secure and isolated communication. |
| [Amazon SQL Server to Azure SQL Database](/data-migration/sql-server/database/guide) | Amazon RDS for SQL Server to Azure SQL Database | This scenario describes an Amazon RDS instance to Azure SQL Database migration. It helps ensure data integrity preservation and minimal downtime. |
| [Amazon DynamoDB application to Azure Cosmos DB for NoSQL](/azure/cosmos-db/nosql/dynamodb-data-migration-cosmos-db) | Amazon DynamoDB application to Azure Cosmos DB for NoSQL | This scenario describes an Amazon DynamoDB application to Azure Cosmos DB migration. It helps ensure data integrity preservation and minimal downtime. |
| [Amazon DynamoDB data to Azure Cosmos DB for NoSQL](/azure/cosmos-db/nosql/dynamodb-data-migration-cosmos-db) | Amazon DynamoDB data to Azure Cosmos DB for NoSQL | This scenario describes an Amazon DynamoDB data to Azure Cosmos DB migration. It helps ensure data integrity preservation and minimal downtime. |
| [Amazon ElastiCache to Azure Cache for Redis](/azure/azure-cache-for-redis/cache-migration-guide) | Amazon ElastiCache to Azure Cache for Redis | This scenario describes an Amazon ElastiCache to Azure Cache for Redis migration. It helps ensure data integrity preservation and minimal downtime. |
| [Couchbase on AWS to Azure Cosmos DB for NoSQL](/azure/cosmos-db/nosql/couchbase-cosmos-migration) | Couchbase on AWS to Azure Cosmos DB for NoSQL | This scenario describes the migration of Java applications that are connected to Couchbase on AWS to an API for NoSQL account in Azure Cosmos DB. It helps ensure data integrity preservation and minimal downtime. |

## Related workload components

Databases make up only part of your workload. Explore other components that you might migrate:

- [Compute](migrate-compute-from-aws.md)
- [Storage](migrate-storage-from-aws.md)
- [Networking](migrate-networking-from-aws.md)
- [Security](migrate-security-from-aws.md)