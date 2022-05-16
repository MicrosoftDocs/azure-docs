---
title: "Synapse implementation success methodology: Evaluate Spark pool design"
description: "Learn how to evaluate your Spark pool design to identify issues and validate that it meets guidelines and requirements."
author: peter-myers
ms.author: v-petermyers
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 05/23/2022
---

# Synapse implementation success methodology: Evaluate Spark pool design

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

Apache Spark in Synapse brings the Apache Spark parallel data processing to the Azure Synapse. This evaluation provides direction on when Apache Spark in Azure Synapse is or is not the best fit for your workload and will discusses items to consider when you are evaluating your solution design elements that incorporate Spark Pools.

## Fit gap analysis

When planning to implement Spark pools with Azure Synapse, you first need to ensure Apache Spark Pools in Azure Synapse is the best fit for your workload. These are the items to consider for utilizing Apache Spark in Synapse:

- Does your workload require data engineering/data preparation?
    - Apache Spark works best for workloads that require:
        - Data Cleaning
        - Transforming semi-structured data like XML into relational
        - Complex free-text transformation (fuzzy matching, NLP)
        - Prepping data for machine learning
- Is your workload for data engineering/data preparation complex or simple transformations? Are you looking for a low code/no code approach?
    - For simple transformations such as dropping of columns, casting of columns, or joining two datasets. Consider using Data Flows within Synapse Pipelines.
    - Data Flows also provides a low code/no code approach to your data processing.
- Does your workload require machine learning on Big Data?
    - Apache Spark works well for large datasets that will be used for machine learning. If using small datasets, consider using [Azure Machine Learning](../../machine-learning/overview-what-is-azure-ml.md) as the compute.
- Do you plan to perform data exploration and need an ad-hoc query analysis on Big Data?
    - Apache Spark in Azure Synapse provides Python/Scala/SQL/.NET based data exploration. However, if you need full T-SQL experience consider using [Synapse SQL Serverless](../sql/on-demand-workspace-overview.md).
- Do you have a current Spark/Hadoop workload and need a unified Big Data Platform?
    - Azure Synapse provides a full unified analytical platform for working with Big Data from Spark to SQL Serverless for ad-hoc queries to SQL on dedicated pools for reporting and serving of data.
    - Moving from a Spark/Hadoop workload from on-prem or another cloud environment may require refactoring and should be considered.
    - If you are looking for a lift and shift approach for your Apache Big Data environment from on-prem to the cloud and require strict data engineering SLA, consider using [HDInsight](../../hdinsight/hdinsight-overview.md)

## Architecture considerations

To ensure that your Apache Spark pool meets your requirements for operational excellence, performance, reliability, and security there are key areas to validate in your architecture.

### Operational Excellence

- **Environment:** When configuring your environment ensure that you have designed your pool to take advantage of features such as auto-scale and dynamic allocation. Also consider utilizing the automatic pause feature to reduce costs.
- **Package management:** Determine if the Apache Spark libraries to be used will be used at a Workspace, Pool, or Session level. When managing packages at each level there are different considerations to [consider](../spark/apache-spark-azure-portal-add-libraries.md).
- **Monitoring:** Apache Spark in Azure Synapse provides built-in [Spark pool](../monitoring/how-to-monitor-spark-pools.md) and [application](../monitoring/apache-spark-applications.md) monitoring with the creation of each spark session. Also consider implementing application monitoring with Azure [Log Analytics](../spark/apache-spark-azure-log-analytics.md) or [Prometheus and Grafana](../spark/use-prometheus-grafana-to-monitor-apache-spark-application-level-metrics.md) to visualize metrics and logs.

### Performance Efficiency

- **File size and file type:** The size of the file and the type of file for reading and writing to and from Apache Spark to cloud storage is key to good performance. Both should be handled prior to ingestion to Apache Spark. Design the architecture to ensure that the file types are conducive to native ingestion with Apache Spark. Also ensure that the size of the files are large files and not many small files.
- **Partitioning:** Identify if partitioning at the folder and/or file level will be implemented for your workload. Folder partitions limit the amount of data to be searched and read. File partitioning reduces the amount of data to be searched in the file but only applies to specific file formats and needs to be considered in the initial architecture.

### Reliability

- **Availability:** Spark pools have a start time of three to four minutes. Depending on the number of libraries to be installed this could take longer. When designing batch vs. streaming workloads identify the SLA for executing the job from your assessment information and determine which architecture meets your needs.
- In addition, each execution of a job creates a new Spark pool cluster. This should also be taken into consideration.
- **Checkpointing:** Apache Spark has built-in checkpointing capabilities when using streaming workloads. This allows for your stream to recover from the last processed entry when there is a failure on a node in your pool.

### Security

- **Data:** Data to be accessed must be considered for the ADLS account that is attached to the Synapse workspace. In addition, determine the security levels that should be required to access any data that is not within the Synapse environment. Refer to the information you collected during the assessment.
- **Networking:** Review the networking information and requirements gathered during your assessment. If the design specifies to use a managed virtual network with Azure Synapse, consider the implications this will have on Apache Spark in Azure Synapse. One such consideration is the inability to use Spark SQL when accessing data.

## Conclusion

Utilizing the guidance discussed in this design evaluation and validating your design against these guidelines and the information you gathered during the assessment you will help ensure your Apache Spark in Azure Synapse architecture is sound and meets your needs. You can find more guidance on best practices when using Apache Spark in Azure Synapse [here](https://azuresynapsestorage.blob.core.windows.net/customersuccess/Guidance%20Video%20Series/EGUI_Synapse_Spark_Guidance.pdf).

## Next steps

In the [next article](implementation-success-evaluate-project-plan.md) in the *Azure Synapse success by design* series, learn how to review your modern data warehouse project plan before the project starts.
