---
title: Understand Spark for U-SQL Developers Overview
description: Understanding Spark for U-SQL Developers Overview
author: guyhay
ms.author: guyhay
ms.reviewer: jasonh
ms.service: data-lake-analytics
ms.topic: conceptual
ms.custom: explore-spark-migration-guide
ms.date: 10/15/2019
---

# Understanding Spark and how to migrate U-SQL jobs to Spark or Azure Data Factory DataFlow

Microsoft supports several Analytics services such as [Azure Databricks](../azure-databricks/what-is-azure-databricks.md) and [Azure HDInsight](../hdinsight/hdinsight-overview.md) as well as Azure Data Lake Analytics.  We hear from developers that they have a clear preference for open-source-solutions as they build analytics pipelines.  To help U-SQL developers understand and migrate some of your jobs to Spark, we have created these steps.

1. Understand how to migrate your job orchestration pipelines.

   If you use [Azure Data Factory](../data-factory/introduction.md) to orchestrate your Azure Data Lake Analytics jobs, you'll have to adjust them to orchestrate the new platform jobs.
2. Understand how to migrate your data

   If you want to move your data from [Azure Data Lake Storage Gen1 to Gen2, you will have to copy both the file data and the catalog maintained data. See [Understand data format differences](data-lake-analytics-understand-spark-data.md)
3. Understand how to migrate your code

   Before migrating your code, you will have to choose an analytics service. Some of the available compute services available are:
      - [Azure Data Factory DataFlow](../data-factory/concepts-data-flow-overview.md)
      This gives a visual programming experience to generate efficient execution. While not suited to execute complex user code, but can easily represent traditional SQL like dataflow transformations
      - [Azure HDInsight Hive](../hdinsight/hadoop/apache-hadoop-using-apache-hive-as-an-etl-tool.md)
      This means you are going to translate your U-SQL scripts to Apache Hive.
      - Apache Spark Engines such as [Azure HDInsight Spark](../hdinsight/spark/apache-spark-overview.md) or [Azure Databricks](../azure-databricks/what-is-azure-databricks.md)
      This means you are going to translate your U-SQL scripts to Spark. For more information, see [Migration of code](migrate-code.md).

Both [Azure Databricks](../azure-databricks/what-is-azure-databricks.md) and [Azure HDInsight Spark](../hdinsight/spark/apache-spark-overview.md) cluster services and not serverless job-services like Azure Data Lake Analytics. Therefore, you will have to consider how to provision the clusters to get the appropriate cost/performance ratio and how to manage their lifetime to minimize your costs.  Also, these services are not supporting to scale user code written in .NET, so you will have to either write wrappers or rewrite your code in a supported language. For more information, see [Migration of code](migrate-code.md).

## Next steps

* For more information, see [Understand how to migrate data formats](migrate-data-formats.md).
* Learn about [.NET for Apache Spark](https://docs.microsoft.com/en-us/dotnet/spark/what-is-apache-spark-dotnet)