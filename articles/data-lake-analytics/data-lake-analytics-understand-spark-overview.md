---
title: Understanding Apache Spark for U-SQL Developers Overview
description: Understanding Apache Spark for U-SQL Developers Overview
author: guyhay
ms.author: guyhay
ms.reviewer: jasonh
ms.service: data-lake-analytics
ms.topic: conceptual
ms.custom: understand-apache-spark-overview
ms.date: 10/15/2019
---

# Understanding Apache Spark for U-SQL developers

Microsoft supports several Analytics services such as [Azure Databricks](../azure-databricks/what-is-azure-databricks.md) and [Azure HDInsight](../hdinsight/hdinsight-overview.md) as well as Azure Data Lake Analytics.  We hear from developers that they have a clear preference for open-source-solutions as they build analytics pipelines.  To help U-SQL developers understand Apache Spark, and how you might transform your U-SQL scripts to Apache Spark, we've created this guidance.  

It includes a number of steps you can take, and several alternatives.

## Steps to transform U-SQL to Apache Spark

1. Transform your job orchestration pipelines.

   If you use [Azure Data Factory](../data-factory/introduction.md) to orchestrate your Azure Data Lake Analytics scripts, you'll have to adjust them to orchestrate the new Spark programs.
2. Understand the differences between how U-SQL and Spark manage data

   If you want to move your data from [Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-overview.md) to [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md), you will have to copy both the file data and the catalog maintained data. See [Understand data format differences](data-lake-analytics-understand-spark-data.md)
3. Transform your U-SQL scripts to Spark

   Before transforming your U-SQL scripts, you will have to choose an analytics service. Some of the available compute services available are:
      - [Azure Data Factory DataFlow](../data-factory/concepts-data-flow-overview.md)
      Mapping data flows are visually designed data transformations that allow data engineers to develop a graphical data transformation logic without writing code. While not suited to execute complex user code, they can easily represent traditional SQL-like dataflow transformations
      - [Azure HDInsight Hive](../hdinsight/hadoop/apache-hadoop-using-apache-hive-as-an-etl-tool.md)
      Apache Hive on HDInsight is suited to Extract, Transform, and Load (ETL) operations.  This means you are going to translate your U-SQL scripts to Apache Hive.
      - Apache Spark Engines such as [Azure HDInsight Spark](../hdinsight/spark/apache-spark-overview.md) or [Azure Databricks](../azure-databricks/what-is-azure-databricks.md)
      This means you are going to translate your U-SQL scripts to Spark. For more information, see [Understand Spark data formats](data-lake-analytics-understand-spark-data.md)

Both [Azure Databricks](../azure-databricks/what-is-azure-databricks.md) and [Azure HDInsight Spark](../hdinsight/spark/apache-spark-overview.md) are cluster services and not serverless jobs like Azure Data Lake Analytics. Therefore, you will have to consider how to provision the clusters to get the appropriate cost/performance ratio and how to manage their lifetime to minimize your costs.  Also, these services are not supporting to scale user code written in .NET, so you will have to either write wrappers or rewrite your code in a supported language. For more information, see [Understand Spark data formats](data-lake-analytics-understand-spark-data.md)

## Next steps

- [Understand Spark data formats](data-lake-analytics-understand-spark-data.md).
- [.NET for Apache Spark](https://docs.microsoft.com/dotnet/spark/what-is-apache-spark-dotnet)
- [Transform data using Hadoop Hive activity in Azure Data Factory](../data-factory/transform-data-using-hadoop-hive.md)
- [Transform data using Spark activity in Azure Data Factory](../data-factory/transform-data-using-spark.md)
- [What is Apache Spark in Azure HDInsight](../hdinsight/spark/apache-spark-overview.md)
