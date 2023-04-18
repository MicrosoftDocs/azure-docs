---
title: "Synapse implementation success methodology: Evaluate Spark pool design"
description: "Learn how to evaluate your Spark pool design to identify issues and validate that it meets guidelines and requirements."
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 05/31/2022
---

# Synapse implementation success methodology: Evaluate Spark pool design

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

You should evaluate your [Apache Spark pool](../spark/apache-spark-overview.md) design to identify issues and validate that it meets guidelines and requirements. By evaluating the design *before solution development begins*, you can avoid blockers and unexpected design changes. That way, you protect the project's timeline and budget.

Apache Spark in Synapse brings the Apache Spark parallel data processing to Azure Synapse Analytics. This evaluation provides guidance on when Apache Spark in Azure Synapse is - or isn't - the right fit for your workload. It describes points to consider when you're evaluating your solution design elements that incorporate Spark pools.

## Fit gap analysis

When planning to implement Spark pools with Azure Synapse, first ensure they're the best fit for your workload.

Consider the following points.

- Does your workload require data engineering/data preparation?
    - Apache Spark works best for workloads that require:
        - Data cleaning.
        - Transforming semi-structured data, like XML into relational.
        - Complex free-text transformation, like fuzzy matching or natural language processing (NLP).
        - Data preparation for machine learning (ML).
- Does your workload for data engineering/data preparation involve complex or simple transformations? And, are you looking for a low-code/no-code approach?
    - For simple transformations, like removing columns, changing column data types, or joining datasets, consider creating an Azure Synapse pipeline by using a data flow activity.
    - Data flow activities provide a low-code/no-code approach to prepare your data.
- Does your workload require ML on big data?
    - Apache Spark works well for large datasets that will be used for ML. If you're using small datasets, consider using [Azure Machine Learning](../../machine-learning/overview-what-is-azure-ml.md) as the compute service.
- Do you plan to perform data exploration or ad hoc query analysis on big data?
    - Apache Spark in Azure Synapse provides Python/Scala/SQL/.NET-based data exploration. However, if you need a full Transact-SQL (T-SQL) experience, consider using a [serverless SQL pool](../sql/on-demand-workspace-overview.md).
- Do you have a current Spark/Hadoop workload and do you need a unified big data platform?
    - Azure Synapse provides a unified analytical platform for working with big data. There are Spark and SQL serverless pools for ad hoc queries, and the dedicated SQL pool for reporting and serving data.
    - Moving from a Spark/Hadoop workload from on-premises (or another cloud environment) may involve some refactoring that you should take into consideration.
    - If you're looking for a lift-and-shift approach of your Apache big data environment from on-premises to the cloud, and you need to meet a strict data engineering service level agreement (SLA), consider using [Azure HDInsight](../../hdinsight/hdinsight-overview.md).

## Architecture considerations

To ensure that your Apache Spark pool meets your requirements for operational excellence, performance, reliability, and security, there are key areas to validate in your architecture.

### Operational excellence

For operational excellence, evaluate the following points.

- **Environment:** When configuring your environment, design your Spark pool to take advantage of features such as [autoscale and dynamic allocation](../spark/apache-spark-autoscale.md). Also, to reduce costs, consider enabling the [automatic pause](../spark/apache-spark-pool-configurations.md#automatic-pause) feature.
- **Package management:** Determine whether required Apache Spark libraries will be used at a workspace, pool, or session level. For more information, see [Manage libraries for Apache Spark in Azure Synapse Analytics](../spark/apache-spark-azure-portal-add-libraries.md).
- **Monitoring:** Apache Spark in Azure Synapse provides built-in monitoring of [Spark pools](../monitoring/how-to-monitor-spark-pools.md) and [applications](../monitoring/apache-spark-applications.md) with the creation of each spark session. Also consider implementing application monitoring with [Azure Log Analytics](../spark/apache-spark-azure-log-analytics.md) or [Prometheus and Grafana](../spark/use-prometheus-grafana-to-monitor-apache-spark-application-level-metrics.md), which you can use to visualize metrics and logs.

### Performance efficiency

For performance efficiency, evaluate the following points.

- **File size and file type:** File size and the number of files have an impact on performance. Design the architecture to ensure that the file types are conducive to native ingestion with Apache Spark. Also, lean toward fewer large files instead of many small files.
- **Partitioning:** Identify whether partitioning at the folder and/or file level will be implemented for your workload. *Folder partitions* limit the amount of data to search and read. *File partitions* reduce the amount of data to be searched inside the file - but only apply to specific file formats that should be considered in the initial architecture.

### Reliability

For reliability, evaluate the following points.

- **Availability:** Spark pools have a start time of three to four minutes. It could take longer if there are many libraries to install. When designing batch vs. streaming workloads, identify the SLA for executing the job from your assessment information and determine which architecture best meets your needs. Also, take into consideration that each job execution creates a new Spark pool cluster.
- **Checkpointing:** Apache Spark streaming has a built-in checkpointing mechanism. Checkpointing allows your stream to recover from the last processed entry should there be a failure on a node in your pool.

### Security

For security, evaluate the following points.

- **Data access:** Data access must be considered for the Azure Data Lake Storage (ADLS) account that's attached to the Synapse workspace. In addition, determine the security levels required to access any data that isn't within the Azure Synapse environment. Refer to the information you collected during the [assessment stage](implementation-success-assess-environment.md).
- **Networking:** Review the networking information and requirements gathered during your assessment. If the design involves a managed virtual network with Azure Synapse, consider the implications this requirement will have on Apache Spark in Azure Synapse. One implication is the inability to use Spark SQL while accessing data.

## Next steps

In the [next article](implementation-success-evaluate-project-plan.md) in the *Azure Synapse success by design* series, learn how to evaluate your modern data warehouse project plan before the project starts.

For more information on best practices, see [Apache Spark for Azure Synapse Guidance](https://azuresynapsestorage.blob.core.windows.net/customersuccess/Guidance%20Video%20Series/EGUI_Synapse_Spark_Guidance.pdf).
