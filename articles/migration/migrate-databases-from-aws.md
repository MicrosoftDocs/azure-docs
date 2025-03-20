---
title: Migrate Databases from Amazon Web Services (AWS)
description: Concepts, how-tos, best practices for migrating databases from Amazon Web Services (AWS) to Microsoft Azure.
author: markingmyname
ms.author: maghan
ms.reviewer: robbymillsap
ms.date: 03/31/2025
ms.topic: concept-article
---

# Migrate databases and data from Amazon Web Services (AWS) to Microsoft Azure

Many workloads contain databases, such as transactional databases, data warehouses, caches, search indexes, or specialized NoSQL stores. These databases contain the data for custom applications, AI/ML context/training, business intelligence operations, or commercial off-the-shelf (COTS) solutions. Microsoft Azure has guidance to help you migrate a workload that involves the components that hold and secure your data.

The articles on this page outline scenarios for migrating Amazon Web Services (AWS) databases to Microsoft Azure. These cloud resources offer the processing power, memory, and storage necessary for running computational tasks. The migration process involves transitioning these services from AWS to Azure, focusing on keeping feature parity.

## Azure service awareness

If you haven't yet selected your application platform in Azure, review the [Azure for AWS professionals guide](/azure/architecture/aws-professional/). This guide has a service mapping available for databases and data. It's a list that maps similar services between the two cloud providers.

For more information, visit the [Azure database services map](/azure/architecture/aws-professional/databases) and the [Azure data and AI services map](/azure/architecture/aws-professional/data-ai).

## Scenarios and component guides

Microsoft publishes guidance for select services to help architects, developers, and database administrators plan their migration efforts. Combine these guides with guidance available for your other components to assess, plan, and perform your migration.

## Compare components

The first step in the migration process is to compare the AWS database services used in the workload to their closest Azure counterparts. This helps identify the most suitable Azure services for your migration needs.

1. Identify the AWS database services used in your workload.
2. Match each AWS database service to its closest Azure counterpart.
3. Evaluate the features and capabilities of the Azure services.
4. Select the most suitable Azure services for your migration needs.

## Database services comparison

Schema types of structured and nonstructured data models categorize the list:

- Relational database services
  - Amazon RDS for PostgreSQL
  - Amazon Aurora (PostgreSQL-compatible)
  - Amazon RDS for MySQL
  - Amazon RDS for SQL Server

> [!NOTE]
> This comparison shouldn't be considered an exact representation of these services' functionality in your workload.*

## Migration scenarios

Refer to these scenarios as examples for framing your migration process.

### Example scenario 1

- **AWS Service**: Amazon RDS for PostgreSQL
- **Azure Service**: Azure Database for PostgreSQL
- **Description**: This scenario involves migrating an Amazon RDS for PostgreSQL instance to Azure Database for PostgreSQL, ensuring minimal downtime and data integrity.

### Example scenario 2

- **AWS Service**: Amazon Aurora (PostgreSQL-compatible)
- **Azure Service**: Azure Database for PostgreSQL - Hyperscale (Citus)
- **Description**: This scenario covers migrating an Amazon Aurora PostgreSQL-compatible database to Azure Database for PostgreSQL, focusing on scaling horizontally to handle large datasets.

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
