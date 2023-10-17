---
title: How to optimize costs in Azure Database for Postgres Flexible Server
description: This article provides a list of cost optimization recommendations 
author: varun-dhawan
ms.author: varundhawan
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 4/13/2023
---

# How to optimize costs in Azure Database for Postgres Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL is a relational database service in the Microsoft cloud based on the [PostgreSQL Community Edition.](https://www.postgresql.org/).  It's a fully managed database as a service offering that can handle mission-critical workloads with predictable performance and dynamic scalability.

This article provides a list of recommendations for optimizing Azure Postgres Flexible Server cost. The list includes design considerations, a configuration checklist, and recommended database settings to help you optimize your workload.

>[!div class="checklist"]
> * Leverage reserved capacity pricing.
> * Scale compute Up/Down.
> * Using Azure advisor recommendations.
> * Evaluate HA (high availability) and DR (disaster recovery) requirements.
> * Consolidate databases and servers.
> * Place test servers in cost-efficient geo-regions.
> * Starting and Stopping servers.
> * Archive old data for cold storage.

## 1. Use reserved capacity pricing

Azure Postgres reserved capacity pricing allows committing to a specific capacity for **1-3** **years**, saving costs for customers using Azure Database for PostgreSQL service. The cost savings compared to pay-as-you-go pricing can be significant, depending on the amount of capacity reserved and the length of the term. Customers can purchase reserved capacity in increments of vCores and storage. Reserved capacity can cover costs for Azure Database for PostgreSQL servers in the same region, applied to the customer's Azure subscription. Reserved Pricing for Azure Postgres Flexible Server offers cost savings up to 40% for 1 year and up to 60% for 3-year commitments, for customers who reserve capacity. For more details, please refer Pricing Calculator | Microsoft Azure
To learn more, refer [What are Azure Reservations?](../../cost-management-billing/reservations/save-compute-costs-reservations.md)

## 2. Scale compute up/down

Scaling up or down the resources of an Azure Database for PostgreSQL server can help you optimize costs. Adjust the vCores and storage as needed to only pay for necessary resources. Scaling can be done through the Azure portal, Azure CLI, or Azure REST API. Scaling compute resources up or down can be done at any time and requires server restart. It's good practice to monitor your database usage patterns and adjust the resources accordingly to optimize costs and ensure performance. For more details, please refer Compute and Storage options in Azure Database for PostgreSQL - Flexible Server.

Configure Non-prod environments conservatively - Configure idle dev/test/stage environments to have cost-efficient SKUs. Choosing Burstable SKUs is ideal for workloads that don't need continuous full capacity.

To learn more, refer [Scale operations in Flexible Server](how-to-scale-compute-storage-portal.md)

## 3. Using Azure advisor recommendations

Azure Advisor is a free service that provides recommendations to help optimize your Azure resources. It analyzes your resource configuration and usage patterns and provides recommendations on how to improve the performance, security, high availability, and cost-effectiveness of your Azure resources. The recommendations cover various Azure services including compute, storage, networking, and databases.

For Azure Database for PostgreSQL, Azure Advisor can provide recommendations on how to improve the performance, availability, and cost-effectiveness of your database. For example, it can suggest scaling the database up or down, using read-replicas to offload read-intensive workloads, or switching to reserved capacity pricing to reduce costs. Azure Advisor can also recommend security best practices, such as enabling encryption at rest, or enabling network security rules to limit incoming traffic to the database.

You can access the recommendations provided by Azure Advisor through the Azure portal, where you can view and implement the recommendations with just a few clicks. Implementing Azure Advisor recommendations can help you optimize your Azure resources and reduce costs. For more details, refer Azure Advisor for PostgreSQL - Flexible Server.

To learn more, refer [Azure Advisor for PostgreSQL](concepts-azure-advisor-recommendations.md)

## 4. Evaluate HA (high availability) and DR (disaster recovery) requirements

Azure database for PostgreSQL – Flexible Server has **built-in** node and storage resiliency at no extra cost to you. Node resiliency allows your Flexible Server to automatically failover to a healthy VM with no data loss (that is, RPO zero) and with no connection string changes except that your application must reconnect. Similarly, the data and transaction logs are stored in three synchronous copies, and it automatically detects storage corruption and takes the corrective action. For most Dev/Test workloads, and for many production workloads, this configuration should suffice. 

If your workload requires AZ resiliency and lower RTO, you can enable High Availability (HA) with in-zone or cross-AZ standby. This doubles your deployment costs, but it also provides a higher SLA. To achieve geo-resiliency for your application, you can set up GeoBackup for a lower cost but with a higher RTO. Alternatively, you can set up GeoReadReplica for double the cost, which offers an RTO in minutes if there was a geo-disaster.

Key take away is to evaluate the requirement of your full application stack and then choose the right configuration for the Flexible Server. For example, if your application isn't AZ resilient, there's nothing to be gained by configuring Flexible Server in AZ resilient configuration.

To learn more, refer [High availability architecture in Flexible Server](concepts-high-availability.md)

## 5. Consolidate databases and servers

Consolidating databases can be a cost-saving strategy for Azure Database for PostgreSQL Flexible Server. Consolidating multiple databases into a single Flexible Server instance can reduce the number of instances and overall cost of running Azure Database for PostgreSQL. Follow these steps to consolidate your databases and save costs:

1. Access your server: Identify the server that can be consolidated, considering database's size, geo-region, configuration (CPU, memory, IOPS), performance requirements, workload type and data consistency needs.
1. Create a new Flexible Server instance: Create a new Flexible Server instance with enough vCPUs, memory, and storage to support the consolidated databases.
1. Reuse an existing Flexible Server instance: In case you already have an existing server, make sure it has enough vCPUs, memory, and storage to support the consolidated databases.
1. Migrate the databases: Migrate the databases to the new Flexible Server instance. You can use tools such as pg_dump and pg_restore to export and import databases.
1. Monitor performance: Monitor the performance of the consolidated Flexible Server instance and adjust the resources as needed to ensure optimal performance.

Consolidating databases can help you save costs by reducing the number of Flexible Server instances you need to run and by enabling you to use larger instances that are more cost-effective than smaller instances. It is important to evaluate the impact of consolidation on your databases' performance and ensure that the consolidated Flexible Server instance is appropriately sized to meet all database needs.

To learn more, refer [Improve the performance of Azure applications by using Azure Advisor](/azure/advisor/advisor-reference-performance-recommendations.md)

## 6. Place test servers in cost-efficient geo-regions

Creating a test server in a cost-efficient Azure region can be a cost-saving strategy for Azure Database for PostgreSQL Flexible Server. By creating a test server in a region with lower cost of computing resources, you can reduce the cost of running your test server and minimize the cost of running Azure Database for PostgreSQL. Here are a few steps to help you create a test server in a cost-efficient Azure region:

1. Identify a cost-efficient region: Identify an Azure region with lower cost of computing resources.
1. Create a new Flexible Server instance: Create a new Flexible Server instance in the cost-efficient region with the right configuration for your test environment.
1. Migrate test data: Migrate the test data to the new Flexible Server instance. You can use tools such as pg_dump and pg_restore to export and import databases.
1. Monitor performance: Monitor the performance of the test server and adjust the resources as needed to ensure optimal performance.

By creating a test server in a cost-efficient Azure region, you can reduce the cost of running your test server and minimize the cost of running Azure Database for PostgreSQL. It is important to evaluate the impact of the region on your test server's performance and your organization's specific regional requirements. This ensures that network latency and data transfer costs are acceptable for your use case.

To learn more, refer [Azure regions](/azure/architecture/framework/cost/design-regions)

## 7. Starting and stopping servers

Starting and stopping servers can be a cost-saving strategy for Azure Database for PostgreSQL Flexible Server. By only running the server when you need it, you can reduce the cost of running Azure Database for PostgreSQL. Here are a few steps to help you start and stop servers and save costs:

1. Identify the server: Identify the Flexible Server instance that you want to start and stop.
1. Start the server: Start the Flexible Server instance when you need it. You can start the server using the Azure portal, Azure CLI, or Azure REST API.
1. Stop the server: Stop the Flexible Server instance when you don't need it. You can stop the server using the Azure portal, Azure CLI, or Azure REST API.
1. Also, if a server has been in a stopped (or idle) state for several continuous weeks, you can consider dropping the server after the required due diligence.

By starting and stopping the server as needed, you can reduce the cost of running Azure Database for PostgreSQL. To ensure smooth database performance, it is crucial to evaluate the impact of starting and stopping the server and have a reliable process in place for these actions as required. To learn more, refer Stop/Start an Azure Database for PostgreSQL - Flexible Server.

To learn more, refer [Stop/Start Flexible Server Instance](how-to-stop-start-server-portal.md)

## 8. Archive old data for cold storage

Archiving infrequently accessed data to Azure archive store (while still keeping access) can help reduce costs. Export data from PostgreSQL to Azure Archived Storage and store it in a lower-cost storage tier. 

1. Setup Azure Blob Storage account and create a container for your database backups.
1. Use `pg_dump` to export the old data to a file.
1. Use the Azure CLI or PowerShell to upload the exported file to your Blob Storage container.
1. Set up a retention policy on the Blob Storage container to automatically delete old backups.
1. Modify the backup script to export the old data to Blob Storage instead of local storage.
1. Test the backup and restore process to ensure that the archived data can be restored if needed.

You can also use Azure Data Factory to automate this process.

To learn more, refer [Migrate your PostgreSQL database by using dump and restore](../migrate/how-to-migrate-using-dump-and-restore.md)

## Tradeoffs for cost

As you design your application database on Azure Database for PostgerSQL Flexible Server, consider tradeoffs between cost optimization and other aspects of the design, such as security, scalability, resilience, and operability.

**Cost vs reliability**
> Cost has a direct correlation with reliability.

**Cost vs performance efficiency**
> Boosting performance will lead to higher cost.

**Cost vs security**
> Increasing security of the workload will increase cost.

**Cost vs operational excellence**
> Investing in systems monitoring and automation might increase the cost initially but over time will reduce cost.

## Next steps

To learn more about cost optimization, see:

* [Overview of the cost optimization pillar](/azure/architecture/framework/cost/overview)
* [Tradeoffs for cost](/azure/architecture/framework/cost/tradeoffs)
* [Checklist - Optimize cost](/azure/architecture/framework/cost/optimize-checklist)
* [Checklist - Monitor cost](/azure/architecture/framework/cost/monitor-checklist)

