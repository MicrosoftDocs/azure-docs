---
title: Supported data platforms
titleSuffix: Azure Data Science Virtual Machine 
description: Learn about the supported data platforms and tools for the Azure Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: machine-learning
ms.subservice: data-science-vm

author: vijetajo
ms.author: vijetaj
ms.topic: conceptual
ms.date: 03/16/2018

---

# Data platforms supported on the Data Science Virtual Machine

With the Data Science Virtual Machine (DSVM), you can build your analytics against a wide range of data platforms. In addition to interfaces to remote data platforms, the DSVM provides a local instance for rapid development and prototyping.

The following data platform tools are supported on the DSVM.

## SQL Server 2016 Developer Edition

| | |
| ------------- | ------------- |
| What is it?   | A local relational database instance      |
| Supported DSVM editions      | Windows      |
| Typical uses      | Rapid development locally with smaller dataset. <br/> Run in-database R.   |
| Links to samples      |    A small sample of New York City dataset is loaded into the SQL database `nyctaxi`. <br/> Jupyter sample showing Microsoft R and in-database analytics can be found at:<br/> `~notebooks/SQL_R_Services_End_to_End_Tutorial.ipynb`  |
| Related tools on the DSVM       | SQL Server Management Studio <br/> ODBC/JDBC drivers<br/> pyodbc, RODBC<br />Apache Drill      |

> [!NOTE]
> Microsoft SQL Server 2016 Developer Edition can be used only for development and test purposes. You need a license or one of the SQL Server VMs to run it in production.


### Setup

The database server is already preconfigured and the Windows services related to SQL Server (like `SQL Server (MSSQLSERVER)`) are set to run automatically. The only manual step involves enabling In-database analytics through Microsoft R. You can do this by running the following command as a one-time action in SQL Server Management Studio (SSMS). After you log in as the machine administrator, open a new query in SSMS, make sure the selected database is `master`, and then run: 

        CREATE LOGIN [%COMPUTERNAME%\SQLRUserGroup] FROM WINDOWS 

        (Please replace the %COMPUTERNAME% with your VM name)
       
To run SQL Server Management Studio, you can search for "SQL Server Management Studio" on the program list or use Windows Search to find and run it. When prompted for credentials, select **Windows Authentication** and use the machine name or ```localhost``` in the **SQL Server Name** field.

### How to use and run it

By default, the database server with the default database instance runs automatically. You can use tools like SQL Server Management Studio on the VM to access the SQL Server database locally. Local administrator accounts have admin access on the database.

Also, the DSVM comes with ODBC and JDBC drivers to talk to SQL Server, Azure SQL databases, and Azure SQL Data Warehouse from applications written in multiple languages, including Python and R.

### How is it configured and installed on the DSVM? 

 SQL Server is installed in the standard way. It can be found at `C:\Program Files\Microsoft SQL Server`. The In-database R instance is found at `C:\Program Files\Microsoft SQL Server\MSSQL13.MSSQLSERVER\R_SERVICES`. The DSVM also has a separate standalone R Server instance installed at `C:\Program Files\Microsoft\R Server\R_SERVER`. These two-R instances don't share libraries.


## Apache Spark 2.x (Standalone)

| | |
| ------------- | ------------- |
| What is it?   | A standalone (single node in-process) instance of the popular Apache Spark platform, a system for fast, large-scale data processing and machine learning     |
| Supported DSVM editions      | Linux <br /> Windows (Experimental)      |
| Typical uses      | * Rapid development of Spark/PySpark applications locally with smaller dataset; later deploy it on large Spark clusters such as Azure HDInsight.<br/> * Test Microsoft R Server Spark Context .<br />* Use SparkML or the Microsoft open source [MMLSpark](https://github.com/Azure/mmlspark) library to build ML applications.  |
| Links to samples      |    Jupyter sample: <br />&nbsp;&nbsp;* ~/notebooks/SparkML/pySpark <br /> &nbsp;&nbsp;* ~/notebooks/MMLSpark <br /> Microsoft R Server (Spark context): /dsvm/samples/MRS/MRSSparkContextSample.R |
| Related tools on the DSVM       | PySpark, Scala<br/>Jupyter (Spark/PySpark Kernels)<br/>Microsoft R Server, SparkR, Sparklyr <br />Apache Drill      |

### How to use it
You run Spark by submitting Spark jobs on the command line and by using  `spark-submit` or `pyspark` commands. You can also create a Jupyter notebook by creating a new notebook with the Spark kernel.

You can use Spark from R by using libraries like SparkR, Sparklyr, and Microsoft R Server that are available on the DSVM. See pointers to samples in the preceding table.

> [!NOTE]
> Running Microsoft R Server in Spark context of the DSVM is supported only on the Ubuntu Linux DSVM edition.



### Setup
Before running in Spark context in Microsoft R Server on Ubuntu Linux DSVM edition, you must do a one-time setup step to enable a local single node Hadoop HDFS and Yarn instance. By default, Hadoop services are installed but disabled on the DSVM. To enable it, run the following commands as root the first time:

    echo -e 'y\n' | ssh-keygen -t rsa -P '' -f ~hadoop/.ssh/id_rsa
    cat ~hadoop/.ssh/id_rsa.pub >> ~hadoop/.ssh/authorized_keys
    chmod 0600 ~hadoop/.ssh/authorized_keys
    chown hadoop:hadoop ~hadoop/.ssh/id_rsa
    chown hadoop:hadoop ~hadoop/.ssh/id_rsa.pub
    chown hadoop:hadoop ~hadoop/.ssh/authorized_keys
    systemctl start hadoop-namenode hadoop-datanode hadoop-yarn

You can stop the Hadoop-related services when you no longer need them by running ```systemctl stop hadoop-namenode hadoop-datanode hadoop-yarn```.
A sample demonstrating how to develop and test MRS in a remote Spark context (which is the standalone Spark instance on the DSVM) is provided in the `/dsvm/samples/MRS` directory.


### How is it configured and installed on the DSVM? 
|Platform|Install location ($SPARK_HOME)|
|:--------|:--------|
|Windows | c:\dsvm\tools\spark-X.X.X-bin-hadoopX.X|
|Linux   | /dsvm/tools/spark-X.X.X-bin-hadoopX.X|


Libraries to access data from Azure Blob storage and Azure Data Lake storage (ADLS), and to use the Microsoft MMLSpark machine-learning libraries, are preinstalled in $SPARK_HOME/jars. These JARs are automatically loaded when Spark starts up. By default, Spark uses data on the local disk. 

To enable access by the Spark instance on the DSVM to data stored in Blob storage or ADLS, you must create and configure the `core-site.xml` file. The settings to use are based on the template found in $SPARK_HOME/conf/core-site.xml.template (where there are placeholders for Blob storage and ADLS configurations), and you also need appropriate credentials to Blob storage and ADLS. For more detailed steps about creating ADLS service credentials, see [Authentication with Azure Data Lake Storage Gen1](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-authenticate-using-active-directory). After the credentials for Blob storage or ADLS are entered in the core-site.xml file, you can reference the data stored in those sources through the URI prefix of wasb:// or adl://.

