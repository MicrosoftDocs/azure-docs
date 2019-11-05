---
title: Understand Apache Spark data formats for Azure Data Lake Analytics U-SQL developers.
description: This article describes Apache Spark concepts to help U_SQL developers understand differences between U-SQL and Spark data formats.
author: guyhay
ms.author: guyhay
ms.reviewer: jasonh
ms.service: data-lake-analytics
ms.topic: conceptual
ms.custom: understand-apache-spark-data-formats
ms.date: 01/31/2019
---

# Understand differences between U-SQL and Spark data formats

If you want to use either [Azure Databricks](../azure-databricks/what-is-azure-databricks.md) or [Azure HDInsight Spark](../hdinsight/spark/apache-spark-overview.md), we recommend that you migrate your data from [Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-overview.md) to [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md).

In addition to moving your files, you'll also want to make your data, stored in U-SQL tables, accessible to Spark.

## Move data stored in Azure Data Lake Storage Gen1 files

Data stored in files can be moved in various ways:

- Write an [Azure Data Factory](../data-factory/introduction.md) pipeline to copy the data from [Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-overview.md) account to the [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md) account.
- Write a Spark job that reads the data from the [Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-overview.md) account and writes it to the [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md) account. Based on your use case, you may want to write it in a different format such as Parquet if you do not need to preserve the original file format.

We recommend that you review the article [Upgrade your big data analytics solutions from Azure Data Lake Storage Gen1 to Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-upgrade.md)

## Move data stored in U-SQL tables

U-SQL tables are not understood by Spark. If you have data stored in U-SQL tables, you'll run a U-SQL job that extracts the table data and saves it in a format that Spark understands. The most appropriate format is to create a set of Parquet files following the Hive metastore's folder layout.

The output can be achieved in U-SQL with the built-in Parquet outputter and using the dynamic output partitioning with file sets to create the partition folders. [Process more files than ever and use Parquet](https://blogs.msdn.microsoft.com/azuredatalake/2018/06/11/process-more-files-than-ever-and-use-parquet-with-azure-data-lake-analytics) provides an example of how to create such Spark consumable data.

After this transformation, you copy the data as outlined in the chapter [Move data stored in Azure Data Lake Storage Gen1 files](#move-data-stored-in-azure-data-lake-storage-gen1-files).

## Caveats

- Data semantics
    When copying files, the copy will occur at the byte level. So the same data should be appearing in the [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md) account. Note however, Spark may interpret some characters differently. For example, it may use a different default for a row-delimiter in a CSV file.
    Furthermore, if you're copying typed data (from tables), then Parquet and Spark may have different precision and scale for some of the typed values (for example, a float) and may treat null values differently. For example, U-SQL has the C# semantics for null values, while Spark has a three-valued logic for null values.

- Data organization (partitioning)
    U-SQL tables provide two level partitioning. The outer level (`PARTITIONED BY`) is by value and maps mostly into the Hive/Spark partitioning scheme using folder hierarchies. You will need to ensure that the null values are mapped to the right folder. The inner level (`DISTRIBUTED BY`) in U-SQL offers 4 distribution schemes: round robin, range, hash, and direct hash.
    Hive/Spark tables only support value partitioning or hash partitioning, using a different hash function than U-SQL. When you output your U-SQL table data, you will probably only be able to map into the value partitioning for Spark and may need to do further tuning of your data layout depending on your final Spark queries.

## Next steps

- [Understand Spark code concepts for U-SQL developers](understand-spark-code-concepts.md)
- [Upgrade your big data analytics solutions from Azure Data Lake Storage Gen1 to Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-upgrade.md)
- [.NET for Apache Spark](https://docs.microsoft.com/dotnet/spark/what-is-apache-spark-dotnet)
- [Transform data using Spark activity in Azure Data Factory](../data-factory/transform-data-using-spark.md)
- [Transform data using Hadoop Hive activity in Azure Data Factory](../data-factory/transform-data-using-hadoop-hive.md)
- [What is Apache Spark in Azure HDInsight](../hdinsight/spark/apache-spark-overview.md)
