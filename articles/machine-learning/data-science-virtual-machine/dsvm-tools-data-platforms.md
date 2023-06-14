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
ms.date: 10/04/2022

---

# Data platforms supported on the Data Science Virtual Machine

With a Data Science Virtual Machine (DSVM), you can build your analytics against a wide range of data platforms. In addition to interfaces to remote data platforms, the DSVM provides a local instance for rapid development and prototyping.

The following data platform tools are supported on the DSVM.

## SQL Server Developer Edition

| Category | Value |
| ------------- | ------------- |
| What is it?   | A local relational database instance      |
| Supported DSVM editions      | Windows 2019, Linux (SQL Server 2019)   |
| Typical uses      | <ul><li>Rapid development locally with smaller dataset</li><li>Run In-database R</li></ul> |
| Links to samples      | <ul><li>A small sample of a New York City dataset is loaded into the SQL database:<br/>  `nyctaxi`</li><li>Jupyter sample showing Microsoft Machine Learning Server and in-database analytics can be found at:<br/> `~notebooks/SQL_R_Services_End_to_End_Tutorial.ipynb`</li></ul> |
| Related tools on the DSVM       | <ul><li>SQL Server Management Studio</li><li>ODBC/JDBC drivers</li><li>pyodbc, RODBC</li></ul> |

> [!NOTE]
> SQL Server Developer Edition can be used only for development and test purposes. You need a license or one of the SQL Server VMs to run it in production.

> [!NOTE]
> Support for Machine Learning Server Standalone will end July 1, 2021. We will remove it from the DSVM images after
> June, 30. Existing deployments will continue to have access to the software but due to the reached support end date,
> there will be no support for it after July 1, 2021.

> [!NOTE]
> We will remove SQL Server Developer Edition from DSVM images by end of November, 2021. Existing deployments will continue to have SQL Server Developer Edition installed. In new deployemnts, if you would like to have access to SQL Server Developer Edition you can install and use via Docker support see [Quickstart: Run SQL Server container images with Docker](/sql/linux/quickstart-install-connect-docker?view=sql-server-ver15&pivots=cs1-bash&preserve-view=true)

### Windows

#### Setup

The database server is already preconfigured and the Windows services related to SQL Server (like `SQL Server (MSSQLSERVER)`) are set to run automatically. The only manual step involves enabling In-database analytics by using Microsoft Machine Learning Server. You can enable analytics by running the following command as a one-time action in SQL Server Management Studio (SSMS). Run this command after you log in as the machine administrator, open a new query in SSMS, and make sure the selected database is `master`:

```sql
CREATE LOGIN [%COMPUTERNAME%\SQLRUserGroup] FROM WINDOWS 
```

(Replace %COMPUTERNAME% with your VM name.)

To run SQL Server Management Studio, you can search for "SQL Server Management Studio" on the program list, or use Windows Search to find and run it. When prompted for credentials, select **Windows Authentication** and use the machine name or ```localhost``` in the **SQL Server Name** field.

#### How to use and run it

By default, the database server with the default database instance runs automatically. You can use tools like SQL Server Management Studio on the VM to access the SQL Server database locally. Local administrator accounts have admin access on the database.

Also, the DSVM comes with ODBC and JDBC drivers to talk to SQL Server, Azure SQL databases, and Azure Synapse Analytics from applications written in multiple languages, including Python and Machine Learning Server.

#### How is it configured and installed on the DSVM? 

 SQL Server is installed in the standard way. It can be found at `C:\Program Files\Microsoft SQL Server`. The In-database Machine Learning Server instance is found at `C:\Program Files\Microsoft SQL Server\MSSQL13.MSSQLSERVER\R_SERVICES`. The DSVM also has a separate standalone Machine Learning Server instance, which is installed at `C:\Program Files\Microsoft\R Server\R_SERVER`. These two Machine Learning Server instances don't share libraries.


### Ubuntu

To use SQL Server Developer Edition on an Ubuntu DSVM, you need to install it first. [Quickstart: Install SQL Server and create a database on Ubuntu](/sql/linux/quickstart-install-connect-ubuntu) tells you how.



## Apache Spark 2.x (Standalone)

| Category | Value |
| ------------- | ------------- |
| What is it?   | A standalone (single node in-process) instance of the popular Apache Spark platform; a system for fast, large-scale data processing and machine-learning     |
| Supported DSVM editions      | Linux     |
| Typical uses      | <ul><li>Rapid development of Spark/PySpark applications locally with a smaller dataset and later deployment on large Spark clusters such as Azure HDInsight</li><li>Test Microsoft Machine Learning Server Spark context</li><li>Use SparkML or Microsoft's open-source [MMLSpark](https://github.com/Azure/mmlspark) library to build ML applications</li></ul> |
| Links to samples      |    Jupyter sample:<ul><li>~/notebooks/SparkML/pySpark</li><li>~/notebooks/MMLSpark</li></ul><p>Microsoft Machine Learning Server (Spark context): /dsvm/samples/MRS/MRSSparkContextSample.R</p> |
| Related tools on the DSVM       | <ul><li>PySpark, Scala</li><li>Jupyter (Spark/PySpark Kernels)</li><li>Microsoft Machine Learning Server, SparkR, Sparklyr</li><li>Apache Drill</li></ul> |

### How to use it
You can submit Spark jobs on the command line by running the `spark-submit` or `pyspark` command. You can also create a Jupyter notebook by creating a new notebook with the Spark kernel.

You can use Spark from R by using libraries like SparkR, Sparklyr, and Microsoft Machine Learning Server, which are available on the DSVM. See pointers to samples in the preceding table.

### Setup
Before running in a Spark context in Microsoft Machine Learning Server on Ubuntu Linux DSVM edition, you must complete a one-time setup step to enable a local single node Hadoop HDFS and Yarn instance. By default, Hadoop services are installed but disabled on the DSVM. To enable them, run the following commands as root the first time:

```bash
echo -e 'y\n' | ssh-keygen -t rsa -P '' -f ~hadoop/.ssh/id_rsa
cat ~hadoop/.ssh/id_rsa.pub >> ~hadoop/.ssh/authorized_keys
chmod 0600 ~hadoop/.ssh/authorized_keys
chown hadoop:hadoop ~hadoop/.ssh/id_rsa
chown hadoop:hadoop ~hadoop/.ssh/id_rsa.pub
chown hadoop:hadoop ~hadoop/.ssh/authorized_keys
systemctl start hadoop-namenode hadoop-datanode hadoop-yarn
```

You can stop the Hadoop-related services when you no longer need them by running ```systemctl stop hadoop-namenode hadoop-datanode hadoop-yarn```.

A sample that demonstrates how to develop and test MRS in a remote Spark context (which is the standalone Spark instance on the DSVM) is provided and available in the `/dsvm/samples/MRS` directory.


### How is it configured and installed on the DSVM? 
|Platform|Install Location ($SPARK_HOME)|
|:--------|:--------|
|Linux   | /dsvm/tools/spark-X.X.X-bin-hadoopX.X|


Libraries to access data from Azure Blob storage or Azure Data Lake Storage, using the Microsoft MMLSpark machine-learning libraries, are preinstalled in $SPARK_HOME/jars. These JARs are automatically loaded when Spark starts up. By default, Spark uses data on the local disk. 

For the Spark instance on the DSVM to access data stored in Blob storage or Azure Data Lake Storage, you must create and configure the `core-site.xml` file based on the template found in $SPARK_HOME/conf/core-site.xml.template. You must also have the appropriate credentials to access Blob storage and Azure Data Lake Storage. (Note that the template files use placeholders for Blob storage and Azure Data Lake Storage configurations.)

For more detailed info about creating Azure Data Lake Storage service credentials, see [Authentication with Azure Data Lake Storage Gen1](../../data-lake-store/data-lake-store-service-to-service-authenticate-using-active-directory.md). After the credentials for Blob storage or Azure Data Lake Storage are entered in the core-site.xml file, you can reference the data stored in those sources through the URI prefix of wasb:// or adl://.
