---
title: Data platforms for the Data Science Virtual Machine - Azure | Microsoft Docs
description: Learn about the data platforms and tools supported on the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
documentationcenter: ''
author: gopitk
manager: cgronlun
ms.custom: seodec18

ms.assetid: 
ms.service: machine-learning
ms.subservice: data-science-vm
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/16/2018
ms.author: gokuma

---

# Data platforms supported on the Data Science Virtual Machine

The Data Science Virtual Machine (DSVM) allows you to build your analytics against a wide range of data platforms. In addition to interfaces to remote data platforms, the DSVM provides a local instance for rapid development and prototyping. 

The following are the data platform tools supported on the DSVM. 

## SQL Server 2016 Developer Edition

| | |
| ------------- | ------------- |
| What is it?   | A local relational database instance      |
| Supported DSVM Editions      | Windows      |
| Typical Uses      | Rapid development locally with smaller dataset <br/> Run In-database R   |
| Links to Samples      |    A small sample of New York City Dataset is loaded into the SQL database `nyctaxi`. <br/> Jupyter sample showing Microsoft R and in-database analytics can be found at:<br/> `~notebooks/SQL_R_Services_End_to_End_Tutorial.ipynb`  |
| Related Tools on the DSVM       | SQL Server Management Studio <br/> ODBC/JDBC Drivers<br/> pyodbc, RODBC<br />Apache Drill      |

> [!NOTE]
> The SQL Server 2016 developer edition can only be used for development and test purposes. You need a license or one of the SQL Server VMs to run it in production. 


### Setup

The database server is already pre-configured and the Windows services related to SQL Server (like `SQL Server (MSSQLSERVER)`) are set to run automatically. The only manual step to be run is to enable In-database analytics using Microsoft R. You can do this by  running the following command as a one time action in SQL Server Management Studio (SSMS) after logging in as the machine administrator, open a "New Query" in SSMS, ensure the database selected is `master` and then run: 

        CREATE LOGIN [%COMPUTERNAME%\SQLRUserGroup] FROM WINDOWS 

        (Please replace the %COMPUTERNAME% with your VM name)
       
In order to run SQL Server Management Studio, you can search for "SQL Server Management Studio" on program list or use Windows Search to find and run it. When prompted for credentials, choose "Windows Authentication" and use the machine name or ```localhost``` in SQL Server Name. 

### How to use / run it?  

The database server with the default database instance is running automatically by default. You can use tools like SQL Server Management Studio on the VM to access the SQL Server database locally. Local administrators account have admin access on the database. 

Also the DSVM comes with ODBC Drivers and JDBC drivers to talk to SQL Server, Azure SQL databases, and Azure SQL Data Warehouse from applications written in multiple languages including Python, R. 

### How is it configured / installed on the DSVM? 

The SQL Server is installed in the standard way. It can be found at `C:\Program Files\Microsoft SQL Server`. The In-database R instance is found at `C:\Program Files\Microsoft SQL Server\MSSQL13.MSSQLSERVER\R_SERVICES`. The DSVM also has a separate standalone R Server instance installed at `C:\Program Files\Microsoft\R Server\R_SERVER`. These two-R instances do not share the libraries.


## Apache Spark 2.x (Standalone)

| | |
| ------------- | ------------- |
| What is it?   | A standalone (single node in-process) instance of the popular Apache Spark platform, a system for fast large-scale data processing and machine learning     |
| Supported DSVM Editions      | Linux <br /> Windows (Experimental)      |
| Typical Uses      | * Rapid development of Spark/PySpark applications locally with smaller dataset and later deploy it on large Spark clusters such as Azure HDInsight<br/> * Test Microsoft R Server Spark Context <br />* Use SparkML or Microsoft's open source [MMLSpark](https://github.com/Azure/mmlspark) library to build ML applications  |
| Links to Samples      |    Jupyter sample: <br />&nbsp;&nbsp;* ~/notebooks/SparkML/pySpark <br /> &nbsp;&nbsp;* ~/notebooks/MMLSpark <br /> Microsoft R Server (Spark Context): /dsvm/samples/MRS/MRSSparkContextSample.R |
| Related Tools on the DSVM       | PySpark, Scala<br/>Jupyter (Spark/PySpark Kernels)<br/>Microsoft R Server, SparkR, Sparklyr <br />Apache Drill      |

### How to use it
You can run Spark by submitting Spark jobs on the command line with `spark-submit` or `pyspark` commands. You can also create a Jupyter notebook by creating a new notebook with the Spark kernel. 

You can use Spark from R using libraries like SparkR, Sparklyr, or Microsoft R Server that are available on the DSVM. See pointers to samples in the preceding table. 

> [!NOTE]
> Running Microsoft R Server in Spark context of DSVM is only supported on the Ubuntu Linux DSVM edition. 



### Setup
Before running in Spark context in Microsoft R Server on Ubuntu Linux DSVM edition, you need to do a one time setup step to enable a local single node Hadoop HDFS and Yarn instance. By default, Hadoop services are installed but disabled on the DSVM. In order to enable it, you need to run the following commands as root the first time:

    echo -e 'y\n' | ssh-keygen -t rsa -P '' -f ~hadoop/.ssh/id_rsa
    cat ~hadoop/.ssh/id_rsa.pub >> ~hadoop/.ssh/authorized_keys
    chmod 0600 ~hadoop/.ssh/authorized_keys
    chown hadoop:hadoop ~hadoop/.ssh/id_rsa
    chown hadoop:hadoop ~hadoop/.ssh/id_rsa.pub
    chown hadoop:hadoop ~hadoop/.ssh/authorized_keys
    systemctl start hadoop-namenode hadoop-datanode hadoop-yarn

You can stop the Hadoop related services when you do not need them by running ```systemctl stop hadoop-namenode hadoop-datanode hadoop-yarn```
A sample demonstrating how to develop and test MRS in remote Spark context (which is the standalone Spark instance on the DSVM) is provided and available in the `/dsvm/samples/MRS` directory. 


### How is it configured / installed on the DSVM? 
|Platform|Install Location ($SPARK_HOME)|
|:--------|:--------|
|Windows | c:\dsvm\tools\spark-X.X.X-bin-hadoopX.X|
|Linux   | /dsvm/tools/spark-X.X.X-bin-hadoopX.X|


Libraries to access data from Azure Blob or Azure Data Lake storage (ADLS) and using Microsoft's MMLSpark machine learning libraries are preinstalled  in $SPARK_HOME/jars. These JARs are automatically loaded when Spark starts up. By default Spark uses data on the local disk. In order for the Spark  instance on the DSVM to access data stored on Azure blob or ADLS you need to create/configure the `core-site.xml` file based on template found in $SPARK_HOME/conf/core-site.xml.template (where there are placeholders for Blob and ADLS configurations) with proper credentials to Azure blob and Azure Data Lake Storage. You find more detailed steps on creating the ADLS service credentials [here](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-authenticate-using-active-directory). Once the credentials for Azure blob or ADLS are entered in the core-site.xml file, you can reference the data stored in those sources with the URI prefix of wasb:// or adl://. 

