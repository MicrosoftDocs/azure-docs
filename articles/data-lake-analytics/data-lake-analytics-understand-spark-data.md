---
title: Understand differences between U-SQL and Spark data formats
description: Understand the differences between U-SQL and Spark data formats
author: guyhay
ms.author: guyhay
ms.reviewer: jasonh
ms.service: data-lake-analytics
ms.topic: conceptual
ms.custom: migration-guide
ms.date: 01/31/2019
---

# Understand differences between U-SQL and Spark data formats

If you want to use either [Azure Databricks](../azure-databricks/what-is-azure-databricks.md) or [Azure HDInsight Spark](../hdinsight/spark/apache-spark-overview.md), we recommend that you migrate your data from [Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-overview.md) to an [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md).

We recommend that you review the article [Upgrade your big data analytics solutions from Azure Data Lake Storage Gen1 to Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-upgrade.md)

In addition to moving your files, you also want to make the data stored in U-SQL tables accessible to Spark.

## Move data stored in files

Data stored in files can be moved in various ways:

- Write an Azure Data Factory pipeline to copy the data from the Gen1 account to the Gen2 account.
- Write a Spark job that reads the data from the Gen1 account and writes it to the Gen2 account. Based on your use case, you may want to write it in a different format such as Parquet if you do not need to preserve the original file format.

## Move data stored in U-SQL tables

U-SQL tables are not understood by Spark. If you have data stored in U-SQL tables, you'll run a U-SQL job that extracts the table data and saves it in a format that Spark understands. The most appropriate format is to create a set of Parquet files following the Hive metastore's folder layout.

The output can be achieved in U-SQL with the built-in Parquet outputter and using the dynamic output partitioning with file sets to create the partition folders. [Process more files than ever and use Parquet](https://blogs.msdn.microsoft.com/azuredatalake/2018/06/11/process-more-files-than-ever-and-use-parquet-with-azure-data-lake-analytics) provides an example of how to create such Spark consumable data.

After this transformation, you copy the data as outlined in the chapter [Move "unstructured" data stored in files](#move-data-stored-in-files).

## Some caveats

- Data semantics
    When copying files, the copy will occur at the byte level.  So the same data should be appearing in the ADLS Gen2 storage.  Note however, Spark may interpret some characters differently.  For example, it may use a different default for a row-delimiter in a CSV file.
    Furthermore, if you're copying typed data (from tables), then Parquet and Spark may have different precision and scale for some of the typed values (for example, a float) and may treat null values differently. For example, U-SQL has the C# semantics for null values, while Spark has a three-valued logic for null values.

- Data organization (partitioning)
    U-SQL tables provide two level partitioning. The outer level (`PARTITIONED BY`) is by value and maps mostly into the Hive/Spark partitioning scheme using folder hierarchies. You will need to ensure that the null values are mapped to the right folder. The inner level (`DISTRIBUTED BY`) in U-SQL offers 4 distribution schemes: round robin, range, hash, and direct hash.
    Hive/Spark tables only support value partitioning or hash partitioning, using a different hash function than U-SQL. When you output your U-SQL table data, you will probably only be able to map into the value partitioning for Spark and may need to do further tuning of your data layout depending on your final Spark queries.

## Next steps

* For more information, see [Migration of code](migrate-code.md)
