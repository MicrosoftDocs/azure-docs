---
title: Supported data platforms
titleSuffix: Azure Data Science Virtual Machine 
description: Learn about the supported data platforms and tools for the Azure Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: data-science-vm

author: jesscioffi
ms.author: jcioffi
ms.topic: conceptual
ms.reviewer: franksolomon
ms.date: 04/16/2024

---

# Data platforms supported on the Data Science Virtual Machine

With a Data Science Virtual Machine (DSVM), you can build your analytics resources against a wide range of data platforms. In addition to interfaces to remote data platforms, the DSVM provides a local instance for rapid development and prototyping.

The DSVM supports these data platform tools:

## SQL Server Developer Edition

| Category | Value |
| ------------- | ------------- |
| What is it?   | A local relational database instance      |
| Supported DSVM editions      | Windows 2019, Linux (SQL Server 2019)   |
| Typical uses      | <ul><li>Rapid local development, with a smaller dataset</li><li>Run In-database R</li></ul> |
| Links to samples      | <ul><li>A small sample of a New York City dataset is loaded into the SQL database:<br/>  `nyctaxi`</li><li>Find a Jupyter sample that shows Microsoft Machine Learning Server and in-database analytics at:<br/> `~notebooks/SQL_R_Services_End_to_End_Tutorial.ipynb`</li></ul> |
| Related tools on the DSVM       | <ul><li>SQL Server Management Studio</li><li>ODBC/JDBC drivers</li><li>pyodbc, RODBC</li></ul> |

> [!NOTE]
> SQL Server Developer Edition can be used only for development and test purposes. You need a license or one of the SQL Server VMs to run it in production.

> [!NOTE]
> Support for Machine Learning Server Standalone ended on July 1, 2021. We will remove it from the DSVM images after
> June 30. Existing deployments will continue to have access to the software but due to the reached support end date,
> support for it ended after July 1, 2021.

> [!NOTE]
> We will remove SQL Server Developer Edition from DSVM images by end of November, 2021. Existing deployments will continue to have SQL Server Developer Edition installed. In new deployemnts, if you would like to have access to the SQL Server Developer Edition, you can install and use the SQL Server Developer Edition via Docker support. Visit [Quickstart: Run SQL Server container images with Docker](/sql/linux/quickstart-install-connect-docker?view=sql-server-ver15&pivots=cs1-bash&preserve-view=true) for more information.

### Windows

#### Setup

The database server is already preconfigured, and the Windows services related to SQL Server (for example, `SQL Server (MSSQLSERVER)`) are set to run automatically. The only manual step involves enabling in-database analytics through use of Microsoft Machine Learning Server. Run the following command to enable analytics as a one-time action in SQL Server Management Studio (SSMS). Run this command after you log in as the machine administrator, open a new query in SSMS, and select the `master` database:

```sql
CREATE LOGIN [%COMPUTERNAME%\SQLRUserGroup] FROM WINDOWS 
```

(Replace %COMPUTERNAME% with your VM name.)

To run SQL Server Management Studio, you can search for "SQL Server Management Studio" on the program list, or use Windows Search to find and run it. When prompted for credentials, select **Windows Authentication**, and use either the machine name or ```localhost``` in the **SQL Server Name** field.

#### How to use and run it

By default, the database server with the default database instance runs automatically. You can use tools like SQL Server Management Studio on the VM to access the SQL Server database locally. Local administrator accounts have admin access on the database.

Additionally, the DSVM comes with ODBC and JDBC drivers to talk to
- SQL Server
- Azure SQL databases
- Azure Synapse Analytics
resources from applications written in multiple languages, including Python and Machine Learning Server.

#### How is it configured and installed on the DSVM?

 SQL Server is installed in the standard way. You can find it at `C:\Program Files\Microsoft SQL Server`. You can find the In-database Machine Learning Server instance at `C:\Program Files\Microsoft SQL Server\MSSQL13.MSSQLSERVER\R_SERVICES`. The DSVM also has a separate standalone Machine Learning Server instance, installed at `C:\Program Files\Microsoft\R Server\R_SERVER`. These two Machine Learning Server instances don't share libraries.

### Ubuntu

You must first install SQL Server Developer Edition on an Ubuntu DSVM before you use it. Visit [Quickstart: Install SQL Server and create a database on Ubuntu](/sql/linux/quickstart-install-connect-ubuntu) for more information.

## Apache Spark 2.x (Standalone)

| Category | Value |
| ------------- | ------------- |
| What is it?   | A standalone (single node in-process) instance of the popular Apache Spark platform; a system for fast, large-scale data processing and machine-learning     |
| Supported DSVM editions      | Linux     |
| Typical uses      | <ul><li>Rapid development of Spark/PySpark applications locally with a smaller dataset, and later deployment on large Spark clusters such as Azure HDInsight</li><li>Test Microsoft Machine Learning Server Spark context</li><li>Use SparkML or the Microsoft open-source [MMLSpark](https://github.com/Azure/mmlspark) library to build ML applications</li></ul> |
| Links to samples      |    Jupyter sample:<ul><li>~/notebooks/SparkML/pySpark</li><li>~/notebooks/MMLSpark</li></ul><p>Microsoft Machine Learning Server (Spark context): /dsvm/samples/MRS/MRSSparkContextSample.R</p> |
| Related tools on the DSVM       | <ul><li>PySpark, Scala</li><li>Jupyter (Spark/PySpark Kernels)</li><li>Microsoft Machine Learning Server, SparkR, Sparklyr</li><li>Apache Drill</li></ul> |

### How to use it
You can run the `spark-submit` or `pyspark` command to submit Spark jobs on the command line. You can also create a new notebook with the Spark kernel to create a Jupyter notebook.

To use Spark from R, you use libraries like SparkR, Sparklyr, and Microsoft Machine Learning Server, which are available on the DSVM. See links to samples in the preceding table.

### Setup
Before you run in a Spark context in Microsoft Machine Learning Server on Ubuntu Linux DSVM edition, you must complete a one-time setup step to enable a local single node Hadoop HDFS and Yarn instance. By default, Hadoop services are installed but disabled on the DSVM. To enable them, run these commands as root the first time:

```bash
echo -e 'y\n' | ssh-keygen -t rsa -P '' -f ~hadoop/.ssh/id_rsa
cat ~hadoop/.ssh/id_rsa.pub >> ~hadoop/.ssh/authorized_keys
chmod 0600 ~hadoop/.ssh/authorized_keys
chown hadoop:hadoop ~hadoop/.ssh/id_rsa
chown hadoop:hadoop ~hadoop/.ssh/id_rsa.pub
chown hadoop:hadoop ~hadoop/.ssh/authorized_keys
systemctl start hadoop-namenode hadoop-datanode hadoop-yarn
```

To stop the Hadoop-related services when you no longer need them, run ```systemctl stop hadoop-namenode hadoop-datanode hadoop-yarn```.

A sample that demonstrates how to develop and test MRS in a remote Spark context (the standalone Spark instance on the DSVM) is provided and available in the `/dsvm/samples/MRS` directory.

### How is it configured and installed on the DSVM? 
|Platform|Install Location ($SPARK_HOME)|
|:--------|:--------|
|Linux   | /dsvm/tools/spark-X.X.X-bin-hadoopX.X|

Libraries to access data from Azure Blob storage or Azure Data Lake Storage, using the Microsoft MMLSpark machine-learning libraries, are preinstalled in $SPARK_HOME/jars. These JARs are automatically loaded when Spark launches. By default, Spark uses data located on the local disk.

The Spark instance on the DSVM can access data stored in Blob storage or Azure Data Lake Storage. You must first create and configure the `core-site.xml` file, based on the template found in $SPARK_HOME/conf/core-site.xml.template. You must also have the appropriate credentials to access Blob storage and Azure Data Lake Storage. The template files use placeholders for Blob storage and Azure Data Lake Storage configurations.

For more information about creation of Azure Data Lake Storage service credentials, visit [Authentication with Azure Data Lake Storage Gen1](../../data-lake-store/data-lake-store-service-to-service-authenticate-using-active-directory.md). After you enter the credentials for Blob storage or Azure Data Lake Storage in the core-site.xml file, you can reference the data stored in those sources through the URI prefix of wasb:// or adl://.