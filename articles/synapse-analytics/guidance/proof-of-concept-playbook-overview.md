---
title: Synapse proof of concept playbook
description: TODO
author: peter-myers
ms.author: v-petermyers
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 04/30/2022
---

# Synapse proof of concept playbook

Whether it is an enterprise data warehouse migration, a big data re-platforming, or a green field implementation; each project traditionally starts with a proof of concept.

This Proof of Concept playbook provides a high-level methodology for planning, preparing, and running an effective proof of concept project. An effective proof of concept validates the fact that certain concepts have the potential for real-world production application. The overall objective of a proof of concept is to validate potential solutions to technical problems, such as how systems can be integrated or how results can be achieved through a specific configuration.

This playbook will help you to evaluate the use of Azure Synapse Analytics for the migration of an existing workload. It has been designed with the following readers in mind:

- Technical experts planning their own in-house Azure Synapse proof of concept project.
- Business owners who will be part of the execution or evaluation of an Azure Synapse proof of concept project.
- Anyone looking to learn more about data warehousing proof of concept projects.

The playbook will deliver the following:

- Guidance on what makes an effective proof of concept.
- Guidance on how to make valid comparisons between systems.
- Guidance on the technical aspects of running an Azure Synapse proof of concept.
- A road map to relevant technical content from Azure Synapse.
- Guidance on how to evaluate proof of concept results to back business decisions.
- Guidance on how to find additional help.

It covers three subjects:

- [Data warehousing with dedicated SQL pool](proof-of-concept-playbook-dedicated-sql-pool.md)
- [Data lake exploration with serverless SQL pool](proof-of-concept-playbook-serverless-sql-pool.md)
- [Big data analytics with Apache Spark pool](proof-of-concept-playbook-apache-spark-pool.md)

## Conclusion

An effective data proof of concept projects start with a well-designed plan and concludes with measurable test results that can be used to make data backed business decisions.

Azure Synapse is a limitless cloud-based analytics service with unmatched time to insight that accelerates the delivery of BI, AI, and intelligent applications for enterprise. You will gain many benefits from Azure Synapse, including performance, speed, improved security and compliance, elasticity, managed infrastructure, scalability, and cost savings.

This guide has provided a high-level methodology to prepare for, and execute a proof of concept to help you use Azure Synapse as a data warehouse with dedicated SQL pool, a data lake with serverless SQL pool, and/or for big data analytics with Apache Spark pool.
All the best with your proof of concept journey!

## Next steps

- [Automatically scale Azure Synapse Analytics Apache Spark pools](../spark/apache-spark-autoscale.md)
- [Transferring data to and from Azure](../../architecture/data-guide/scenarios/data-transfer.md)
- [Copy performance and scalability achievable using ADF](../../data-factory/copy-activity-performance#copy-performance-and-scalability-achievable-using-adf.md)
- [Import and Export data with Apache Spark](../spark/synapse-spark-sql-pool-import-export.md)
- [Monitor - Apache Spark Activities](../get-started-monitor#apache-spark-activities.md)
- [Monitor - Spark UI or Spark History Server](https://spark.apache.org/docs/3.0.0-preview/web-ui.html)
- [Monitoring resource utilization and query activity in Azure Synapse Analytics](../../sql-data-warehouse/sql-data-warehouse-concept-resource-utilization-query-activity.md)
- [Manage libraries for Apache Spark in Azure Synapse Analytics](../spark/apache-spark-azure-portal-add-libraries.md)
- [Azure Cosmos DB Connector for Apache Spark](https://github.com/Azure/azure-cosmosdb-spark)
- [Accelerate big data analytics by using the Apache Spark to Azure Cosmos DB connector](../../cosmos-db/spark-connector.md)
- [What is Azure Synapse Link for Azure Cosmos DB](../../cosmos-db/synapse-link.md)
- [Azure Synapse Apache Spark to Synapse SQL connector](../spark/synapse-spark-sql-pool-import-export.md)
- [Choose the data abstraction](../spark/apache-spark-performance.md#choose-the-data-abstraction)
- [Optimize joins and shuffles](../spark/apache-spark-performance.md#optimize-joins-and-shuffles)
