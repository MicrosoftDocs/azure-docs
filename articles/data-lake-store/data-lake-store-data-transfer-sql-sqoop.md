<properties 
   pageTitle="Copy data between Data Lake Store and Azure SQL database using Sqoop | Microsoft Azure"
   description="Use Sqoop to copy data between Azure SQL Database and Data Lake Store" 
   services="data-lake-store" 
   documentationCenter="" 
   authors="nitinme" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="05/11/2016"
   ms.author="nitinme"/>

# Copy data between Data Lake Store and Azure SQL database using Sqoop

Learn how to use Apache Sqoop to import and export data between Azure SQL Database and Data Lake Store.
 

## What is Sqoop?

Big data applications are a natural choice for processing unstructured and semi-structured data, such as logs and files. However, there may also be a need to process structured data that is stored in relational databases.

[Apache Sqoop](https://sqoop.apache.org/docs/1.4.4/SqoopUserGuide.html) is a tool designed to transfer data between  relational databases and a big data repository, such as Data Lake Store. You can use it to import data from a relational database management system (RDBMS) such as Azure SQL Database into Data Lake Store. You can then transform and analyze the data using big data workloads and then export the data back into an RDBMS. In this tutorial, you use an Azure SQL Database as your relational database to import/export from.
 

## Prerequisites

Before you begin this article, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
- **Enable your Azure subscription** for Data Lake Store public preview. See [instructions](data-lake-store-get-started-portal.md#signup). 
- **Azure HDInsight cluster** with access to a Data Lake Store account. See [Create an HDInsight cluster with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md). This article assumes you have an HDInsight Linux cluster with Data Lake Store access.
- **Azure SQL Database**. For instructions on how to create one, see [Create an Azure SQL database](../sql-database/sql-database-get-started.md)

## Do you learn fast with videos?

[Watch this video](https://mix.office.com/watch/1butcdjxmu114) on how to copy data between Azure Storage Blobs and Data Lake Store using DistCp.

## Create sample tables in the Azure SQL Database

1. To start with, create two sample tables in the Azure SQL Database. Use [SQL Server Management Studio](../sql-database/sql-database-connect-query-ssms.md) or Visual Studio to connect to the Azure SQL Database and then run the following queries.

	**Create Table1**

		CREATE TABLE [dbo].[Table1]( 
	    [ID] [int] NOT NULL, 
	    [FName] [nvarchar](50) NOT NULL, 
	    [LName] [nvarchar](50) NOT NULL, 
	 	CONSTRAINT [PK_Table_4] PRIMARY KEY CLUSTERED 
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
	 	CONSTRAINT [PK_Table_4] PRIMARY KEY CLUSTERED 
			( 
		   		[ID] ASC 
			) 
		) ON [PRIMARY] 
		GO

2. In **Table1**, add some sample data. Leave **Table2** empty. We will import data from **Table1** into Data Lake Store. Then, we will export data from Data Lake Store into **Table2**. Run the following snippet.

		 
		INSERT INTO [dbo].[Table1] VALUES (1,'Neal','Kell'), (2,'Lila','Fulton'), (3, 'Erna','Myers'), (4,'Annette','Simpson'); 
  

## Use Sqoop from an HDInsight cluster with access to Data Lake Store

An HDInsight cluster already has the Sqoop packages available. If you have configured the HDInsight cluster to use Data Lake Store as an additional storage, you can use Sqoop (without any configuration changes) to import/export data between a relational database (in this example, Azure SQL Database) and a Data Lake Store account. 

1. For this tutorial, we assume you created a Linux cluster so you should use SSH to connect to the cluster. See [Connect to a Linux-based HDInsight cluster](hdinsight-hadoop-linux-use-ssh-unix.md#connect-to-a-linux-based-hdinsight-cluster).

2. Verify whether you can access the Data Lake Store account from the cluster. Run the following command from the SSH prompt:

		
		hdfs dfs -ls adl://<data_lake_store_account>.azuredatalakestore.net/

	This should provide a list of files/folders in the Data Lake Store account.

### Import data from Azure SQL Database into Data Lake Store

3. Navigate to the directory where Sqoop packages are available. Typically, this will be at `/usr/hdp/<version>/sqoop/bin`. 

4. Import the data from **Table1** into the Data Lake Store account. Use the following syntax:

		
		sqoop-import --connect "jdbc:sqlserver://<sql-database-server-name>.database.windows.net:1433;username=<username>@<sql-database-server-name>;password=<password>;database=<sql-database-name>" --table Table1 --target-dir adl://<data-lake-store-name>.azuredatalakestore.net/Sqoop/SqoopImportTable1

	Note that **sql-database-server-name** placeholder represents the name of the server where the Azure SQL database is running. **sql-database-name** placeholder represents the actual database name.

	For example,

		
		sqoop-import --connect "jdbc:sqlserver://mysqoopserver.database.windows.net:1433;username=nitinme@mysqoopserver;password=<password>;database=mysqoopdatabase" --table Table1 --target-dir adl://myadlstore.azuredatalakestore.net/Sqoop/SqoopImportTable1

5. Verify that the data has been transferred to the Data Lake Store account. Run the following command:

		
		hdfs dfs -ls adl://hdiadlstore.azuredatalakestore.net/Sqoop/SqoopImportTable1/

	You should see the following output.

		
		-rwxrwxrwx   0 sshuser hdfs          0 2016-02-26 21:09 adl://hdiadlstore.azuredatalakestore.net/Sqoop/SqoopImportTable1/_SUCCESS
		-rwxrwxrwx   0 sshuser hdfs         12 2016-02-26 21:09 adl://hdiadlstore.azuredatalakestore.net/Sqoop/SqoopImportTable1/part-m-00000
		-rwxrwxrwx   0 sshuser hdfs         14 2016-02-26 21:09 adl://hdiadlstore.azuredatalakestore.net/Sqoop/SqoopImportTable1/part-m-00001
		-rwxrwxrwx   0 sshuser hdfs         13 2016-02-26 21:09 adl://hdiadlstore.azuredatalakestore.net/Sqoop/SqoopImportTable1/part-m-00002
		-rwxrwxrwx   0 sshuser hdfs         18 2016-02-26 21:09 adl://hdiadlstore.azuredatalakestore.net/Sqoop/SqoopImportTable1/part-m-00003

	Each **part-m-*** file corresponds to a row in the source table, **Table1**. You can view the contents of the part-m-* files to verify.


### Export data from Data Lake Store into Azure SQL Database

6. Export the data from Data Lake Store account to the empty table, **Table2**, in the Azure SQL Database. Use the following syntax.

		
		sqoop-export --connect "jdbc:sqlserver://<sql-database-server-name>.database.windows.net:1433;username=<username>@<sql-database-server-name>;password=<password>;database=<sql-database-name>" --table Table2 --export-dir adl://<data-lake-store-name>.azuredatalakestore.net/Sqoop/SqoopImportTable1 --input-fields-terminated-by ","

	For example,

		
		sqoop-export --connect "jdbc:sqlserver://mysqoopserver.database.windows.net:1433;username=nitinme@mysqoopserver;password=<password>;database=mysqoopdatabase" --table Table2 --export-dir adl://myadlstore.azuredatalakestore.net/Sqoop/SqoopImportTable1 --input-fields-terminated-by ","

6. Verify that the data was uploaded to the SQL Database table. Use [SQL Server Management Studio](../sql-database/sql-database-connect-query-ssms.md) or Visual Studio to connect to the Azure SQL Database and then run the following query.

		
		SELECT * FROM TABLE2

	This should have the following output.

	 	ID  FName   LName
		------------------
		1	Neal	Kell
		2	Lila	Fulton
		3	Erna	Myers
		4	Annette	Simpson

## See also

- [Copy data from Azure Storage Blobs to Data Lake Store](data-lake-store-copy-data-azure-storage-blob.md)
- [Secure data in Data Lake Store](data-lake-store-secure-data.md)
- [Use Azure Data Lake Analytics with Data Lake Store](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
- [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)
