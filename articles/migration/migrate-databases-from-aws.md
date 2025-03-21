---
title: "Migrate Databases from Amazon Web Services (AWS)"
description: Concepts, how-tos, best practices for migrating databases from Amazon Web Services (AWS) to Microsoft Azure.
author: markingmyname
ms.author: maghan
ms.reviewer: robbymillsap
ms.date: 03/20/2025
ms.topic: concept-article
---

# Migrate databases from Amazon Web Services (AWS) to Microsoft Azure

Migrating data is a critical part when moving from Amazon Web Services (AWS) to Microsoft Azure. This process involves transitioning your databases while making sure they work similarly in the new environment.  The scope of this migration covers various database types, including relational databases, NoSQL databases, and data warehouses. For example, a workload that involves migrating an Amazon RDS for PostgreSQL database to Azure Database for PostgreSQL.

## Azure service awareness

If you haven't yet selected your application platform in Azure, review the [Azure for AWS professionals guide](/azure/architecture/aws-professional/). This guide has a service mapping available for databases and data. It's a list that maps similar services between the two cloud providers.

For more information, visit the [Azure database services map](/azure/architecture/aws-professional/databases) and the [Azure data and AI services map](/azure/architecture/aws-professional/data-ai).

## Component comparison

The first step in the migration process is to compare the Amazon Web Services (AWS) database services used in the workload to their closest Azure counterparts. This helps identify the most suitable Azure services for your migration needs.

[Migrate databases and data from Amazon Web Services (AWS) to Microsoft Azure](migrate-databases-from-aws.md)

1. Identify the AWS database services used in your workload.
1. Match each AWS database service to its closest Azure counterpart.
1. Evaluate the features and capabilities of the Azure services.
1. Select the most suitable Azure services for your migration needs.

### Database services comparison

Schema types of structured and nonstructured data models categorize the list:

- [Relational database services](/azure/architecture/aws-professional/databases)
  - Amazon RDS for PostgreSQL
  - Amazon Aurora (PostgreSQL-compatible)
  - Amazon RDS for MySQL
  - Amazon RDS for SQL Server

> [!NOTE]  
> This comparison shouldn't be considered an exact representation of these services' functionality in your workload.*

## Migration scenarios

Refer to these scenarios as examples for framing your migration process.

| Scenario | Key services | Description |
| --- | --- | --- |
| [Amazon RDS for PostgreSQL to Azure Database for PostgreSQL](/azure/postgresql/migrate/migration-service/tutorial-migration-service-aws-offline?tabs=portal) | Amazon RDS for PostgreSQL -> Azure Database for PostgreSQL | This scenario involves migrating an Amazon RDS for PostgreSQL instance to Azure Database for PostgreSQL, ensuring minimal downtime and data integrity. |
| [Amazon Aurora PostgreSQL to Azure Database for PostgreSQL](/azure/postgresql/migrate/migration-service/tutorial-migration-service-aurora-offline?tabs=azure-portal) | Amazon Aurora for PostgreSQL -> Azure Database for PostgreSQL | This scenario covers migrating an Amazon Aurora PostgreSQL-compatible database to Azure Database for PostgreSQL, focusing on scaling horizontally to handle large datasets. |
| [Amazon RDS for MySQL to Azure Database for MySQL](/azure/mysql/flexible-server/how-to-migrate-rds-mysql-data-in-replication) | Amazon RDS for MySQL -> Azure Database for MySQL | Provides a managed MySQL database with flexible scaling options and high availability. It supports private endpoints and virtual network integration, ensuring secure and isolated communication. |
| [Amazon SQL Server to Azure SQL Database](/data-migration/sql-server/database/guide) | Amazon RDS for SQL Server -> Azure SQL Database | This scenario involves migrating an Amazon RDS instance to Azure SQL Database, ensuring minimal downtime and data integrity. |
| [Amazon DynamoDB to Azure Cosmos DB for NoSQL](/azure/cosmos-db/nosql/dynamodb-data-migration-cosmos-db) | Amazon DynamoDB -> AAzure Cosmos DB for NoSQL | This scenario involves migrating an Amazon DynamoDB instance to Azure Cosmos DB, ensuring minimal downtime and data integrity. |

## Related workload components

Databases are only one of the components of your workload. Explore other components that are part of the migration process:

- [Backup and disaster recovery](./migrate-backup-from-aws.md)
- [Compute](./migrate-compute-from-aws.md)
- [Identity and access management (IAM)](./migrate-iam-from-aws.md)
- [Messaging and integration](./migrate-messaging-from-aws.md)
- [Monitoring and management](./migrate-monitoring-from-aws.md)
- [Networking](./migrate-networking-from-aws.md)
- [Security](./migrate-security-from-aws.md)
- [Storage](./migrate-storage-from-aws.md)

Use the table of contents to explore other articles related to your workload's architecture.
