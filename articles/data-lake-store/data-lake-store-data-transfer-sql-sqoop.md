---
title: Copy data between Data Lake Storage Gen1 and Azure SQL - Sqoop | Microsoft Docs
description: Use Sqoop to copy data between Azure SQL Database and Azure Data Lake Storage Gen1
services: data-lake-store
author: twooley

ms.service: data-lake-store
ms.topic: how-to
ms.date: 07/30/2019
ms.author: twooley

---
# Copy data between Data Lake Storage Gen1 and Azure SQL Database using Sqoop

Learn how to use Apache Sqoop to import and export data between Azure SQL Database and Azure Data Lake Storage Gen1.

## What is Sqoop?

Big data applications are a natural choice for processing unstructured and semi-structured data, such as logs and files. However, you may also have a need to process structured data that's stored in relational databases.

[Apache Sqoop](https://sqoop.apache.org/docs/1.4.4/SqoopUserGuide.html) is a tool designed to transfer data between  relational databases and a big data repository, such as Data Lake Storage Gen1. You can use it to import data from a relational database management system (RDBMS) such as Azure SQL Database into Data Lake Storage Gen1. You can then transform and analyze the data using big data workloads, and then export the data back into an RDBMS. In this article, you use a database in Azure SQL Database as your relational database to import/export from.

## Prerequisites

Before you begin, you must have the following:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **An Azure Data Lake Storage Gen1 account**. For instructions on how to create the account, see [Get started with Azure Data Lake Storage Gen1](data-lake-store-get-started-portal.md)
* **Azure HDInsight cluster** with access to a Data Lake Storage Gen1 account. See [Create an HDInsight cluster with Data Lake Storage Gen1](data-lake-store-hdinsight-hadoop-use-portal.md). This article assumes you have an HDInsight Linux cluster with Data Lake Storage Gen1 access.
* **Azure SQL Database**. For instructions on how to create a database in Azure SQL Database, see [Create a database in Azure SQL Database](../sql-database/sql-database-get-started.md)

## Create sample tables in the database

1. To start, create two sample tables in the database. Use [SQL Server Management Studio](../azure-sql/database/connect-query-ssms.md) or Visual Studio to connect to the database and then run the following queries.

    **Create Table1**

       CREATE TABLE [dbo].[Table1](
       [ID] [int] NOT NULL,
       [FName] [nvarchar](50) NOT NULL,
       [LName] [nvarchar](50) NOT NULL,
        CONSTRAINT [PK_Table_1] PRIMARY KEY CLUSTERED
           (
                  [ID] ASC
           )
       ) ON [PRIMARY]
       GO

    **Create Table2**

       CREATE TABLE [dbo].[Table2](
       [ID] [int] NOT NULL,
       [FName] [nvarchar](50) NOT NULL,
       [LName] [nvarchar](50) NOT NULL,
        CONSTRAINT [PK_Table_2] PRIMARY KEY CLUSTERED
           (
                  [ID] ASC
           )
       ) ON [PRIMARY]
       GO

1. Run the following command to add some sample data to **Table1**. Leave **Table2** empty. Later, you'll import data from **Table1** into Data Lake Storage Gen1. Then, you'll export data from Data Lake Storage Gen1 into **Table2**.

       INSERT INTO [dbo].[Table1] VALUES (1,'Neal','Kell'), (2,'Lila','Fulton'), (3, 'Erna','Myers'), (4,'Annette','Simpson');

## Use Sqoop from an HDInsight cluster with access to Data Lake Storage Gen1

An HDInsight cluster already has the Sqoop packages available. If you've configured the HDInsight cluster to use Data Lake Storage Gen1 as additional storage, you can use Sqoop (without any configuration changes) to import/export data between a relational database such as Azure SQL Database, and a Data Lake Storage Gen1 account.

1. For this article, we assume you created a Linux cluster so you should use SSH to connect to the cluster. See [Connect to a Linux-based HDInsight cluster](../hdinsight/hdinsight-hadoop-linux-use-ssh-unix.md).

1. Verify whether you can access the Data Lake Storage Gen1 account from the cluster. Run the following command from the SSH prompt:

       hdfs dfs -ls adl://<data_lake_storage_gen1_account>.azuredatalakestore.net/

   This command provides a list of files/folders in the Data Lake Storage Gen1 account.

### Import data from Azure SQL Database into Data Lake Storage Gen1

1. Navigate to the directory where Sqoop packages are available. Typically, this location is `/usr/hdp/<version>/sqoop/bin`.

1. Import the data from **Table1** into the Data Lake Storage Gen1 account. Use the following syntax:

       sqoop-import --connect "jdbc:sqlserver://<sql-database-server-name>.database.windows.net:1433;username=<username>@<sql-database-server-name>;password=<password>;database=<sql-database-name>" --table Table1 --target-dir adl://<data-lake-storage-gen1-name>.azuredatalakestore.net/Sqoop/SqoopImportTable1

   The **sql-database-server-name** placeholder represents the name of the server where the database is running. **sql-database-name** placeholder represents the actual database name.

   For example,

       sqoop-import --connect "jdbc:sqlserver://mysqoopserver.database.windows.net:1433;username=twooley@mysqoopserver;password=<password>;database=mysqoopdatabase" --table Table1 --target-dir adl://myadlsg1store.azuredatalakestore.net/Sqoop/SqoopImportTable1

1. Verify that the data has been transferred to the Data Lake Storage Gen1 account. Run the following command:

       hdfs dfs -ls adl://hdiadlsg1store.azuredatalakestore.net/Sqoop/SqoopImportTable1/

   You should see the following output.

       -rwxrwxrwx   0 sshuser hdfs          0 2016-02-26 21:09 adl://hdiadlsg1store.azuredatalakestore.net/Sqoop/SqoopImportTable1/_SUCCESS
       -rwxrwxrwx   0 sshuser hdfs         12 2016-02-26 21:09 adl://hdiadlsg1store.azuredatalakestore.net/Sqoop/SqoopImportTable1/part-m-00000
       -rwxrwxrwx   0 sshuser hdfs         14 2016-02-26 21:09 adl://hdiadlsg1store.azuredatalakestore.net/Sqoop/SqoopImportTable1/part-m-00001
       -rwxrwxrwx   0 sshuser hdfs         13 2016-02-26 21:09 adl://hdiadlsg1store.azuredatalakestore.net/Sqoop/SqoopImportTable1/part-m-00002
       -rwxrwxrwx   0 sshuser hdfs         18 2016-02-26 21:09 adl://hdiadlsg1store.azuredatalakestore.net/Sqoop/SqoopImportTable1/part-m-00003

   Each **part-m-*** file corresponds to a row in the source table, **Table1**. You can view the contents of the part-m-* files to verify.

### Export data from Data Lake Storage Gen1 into Azure SQL Database

1. Export the data from the Data Lake Storage Gen1 account to the empty table, **Table2**, in the Azure SQL Database. Use the following syntax.

       sqoop-export --connect "jdbc:sqlserver://<sql-database-server-name>.database.windows.net:1433;username=<username>@<sql-database-server-name>;password=<password>;database=<sql-database-name>" --table Table2 --export-dir adl://<data-lake-storage-gen1-name>.azuredatalakestore.net/Sqoop/SqoopImportTable1 --input-fields-terminated-by ","

   For example,

       sqoop-export --connect "jdbc:sqlserver://mysqoopserver.database.windows.net:1433;username=twooley@mysqoopserver;password=<password>;database=mysqoopdatabase" --table Table2 --export-dir adl://myadlsg1store.azuredatalakestore.net/Sqoop/SqoopImportTable1 --input-fields-terminated-by ","

1. Verify that the data was uploaded to the SQL Database table. Use [SQL Server Management Studio](../azure-sql/database/connect-query-ssms.md) or Visual Studio to connect to the Azure SQL Database and then run the following query.

       SELECT * FROM TABLE2

   This command should have the following output.

        ID  FName    LName
       -------------------
       1    Neal     Kell
       2    Lila     Fulton
       3    Erna     Myers
       4    Annette  Simpson

## Performance considerations while using Sqoop

For information about performance tuning your Sqoop job to copy data to Data Lake Storage Gen1, see the [Sqoop performance blog post](https://blogs.msdn.microsoft.com/bigdatasupport/2015/02/17/sqoop-job-performance-tuning-in-hdinsight-hadoop/).

## Next steps

* [Copy data from Azure Storage Blobs to Data Lake Storage Gen1](data-lake-store-copy-data-azure-storage-blob.md)
* [Secure data in Data Lake Storage Gen1](data-lake-store-secure-data.md)
* [Use Azure Data Lake Analytics with Data Lake Storage Gen1](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
* [Use Azure HDInsight with Data Lake Storage Gen1](data-lake-store-hdinsight-hadoop-use-portal.md)
