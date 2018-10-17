---
title: Identify advanced analytics scenarios for Azure Machine Learning | Microsoft Docs
description: Select the appropriate scenarios for doing advanced predictive analytics with the Team Data Science Process.
services: machine-learning
documentationcenter: ''
author: deguhath
manager: cgronlun
editor: cgronlun

ms.assetid: 53aecc1e-5089-42cf-8d44-77678653f92d
ms.service: machine-learning
ms.component: team-data-science-process
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/13/2017
ms.author: deguhath

---
# Scenarios for advanced analytics in Azure Machine Learning
This article outlines the variety of sample data sources and target scenarios that can be handled by the [Team Data Science Process (TDSP)](overview.md). The TDSP provides a systematic approach for teams to collaborate on building intelligent applications. The scenarios presented here illustrate options available in the data processing workflow that depend on the data characteristics, source locations, and target repositories in Azure.

The **decision tree** for selecting the sample scenarios that is appropriate for your data and objective is presented in the last section.

> [!INCLUDE [machine-learning-free-trial](../../../includes/machine-learning-free-trial.md)]
> 
> 

Each of the following sections presents a sample scenario. For each scenario, a possible data science or advanced analytics flow and supporting Azure resources are listed.

> [!NOTE]
> **For all of the following scenarios, you need to:**
> <br/>
> 
> * [Create a storage account](../../storage/common/storage-quickstart-create-account.md)
>   <br/>
> * [Create an Azure Machine Learning workspace](../studio/create-workspace.md)
> 
> 

## <a name="smalllocal"></a>Scenario \#1: Small to medium tabular dataset in a local files
![Small to medium local files][1]

#### Additional Azure resources: None
1. Sign in to the [Azure Machine Learning Studio](https://studio.azureml.net/).
1. Upload a dataset.
1. Build an Azure Machine Learning experiment flow starting with uploaded dataset(s).

## <a name="smalllocalprocess"></a>Scenario \#2: Small to medium dataset of local files that require processing
![Small to medium local files with processing][2]

#### Additional Azure resources: Azure Virtual Machine (IPython Notebook server)
1. Create an Azure Virtual Machine running IPython Notebook.
1. Upload data to an Azure storage container.
1. Pre-process and clean data in IPython Notebook, accessing data from Azure
   storage container.
1. Transform data to cleaned, tabular form.
1. Save transformed data in Azure blobs.
1. Sign in to the [Azure Machine Learning Studio](https://studio.azureml.net/).
1. Read the data from Azure blobs using the [Import Data][import-data] module.
1. Build an Azure Machine Learning experiment flow starting with ingested dataset(s).

## <a name="largelocal"></a>Scenario \#3: Large dataset of local files, targeting Azure Blobs
![Large local files][3]

#### Additional Azure resources: Azure Virtual Machine (IPython Notebook server)
1. Create an Azure Virtual Machine running IPython Notebook.
1. Upload data to an Azure storage container.
1. Pre-process and clean data in IPython Notebook, accessing data from Azure blobs.
1. Transform data to cleaned, tabular form, if needed.
1. Explore data, and create features as needed.
1. Extract a small-to-medium data sample.
1. Save the sampled data in Azure blobs.
1. Sign in to the [Azure Machine Learning Studio](https://studio.azureml.net/).
1. Read the data from Azure blobs using the [Import Data][import-data] module.
1. Build Azure Machine Learning experiment flow starting with ingested dataset(s).

## <a name="smalllocaltodb"></a>Scenario \#4: Small to medium dataset of local files, targeting SQL Server in an Azure Virtual Machine
![Small to medium local files to SQL DB in Azure][4]

#### Additional Azure resources: Azure Virtual Machine (SQL Server / IPython Notebook server)
1. Create an Azure Virtual Machine running SQL Server + IPython Notebook.
1. Upload data to an Azure storage container.
1. Pre-process and clean data in Azure storage container using IPython Notebook.
1. Transform data to cleaned, tabular form, if needed.
1. Save data to VM-local files (IPython Notebook is running on VM, local drives refer to VM drives).
1. Load data to SQL Server database running on an Azure VM.
   
   Option \#1: Using SQL Server Management Studio.
   
   * Login to SQL Server VM
   * Run SQL Server Management Studio.
   * Create database and target tables.
   * Use one of the bulk import methods to load the data from VM-local files.
   
   Option \#2: Using IPython Notebook – not advisable for medium and larger datasets
   
   <!-- -->    
   * Use ODBC connection string to access SQL Server on VM.
   * Create database and target tables.
   * Use one of the bulk import methods to load the data from VM-local files.
1. Explore data, create features as needed. Note that the features do not need to be materialized in the database tables. Only note the necessary query to create them.
1. Decide on a data sample size, if needed and/or desired.
1. Sign in to the [Azure Machine Learning Studio](https://studio.azureml.net/).
1. Read the data directly from the SQL Server using the [Import Data][import-data] module. Paste the necessary query which extracts fields, creates features, and samples data if needed directly in the [Import Data][import-data] query.
1. Build Azure Machine Learning experiment flow starting with ingested dataset(s).

## <a name="largelocaltodb"></a>Scenario \#5: Large dataset in a local files, target SQL Server in Azure VM
![Large local files to SQL DB in Azure][5]

#### Additional Azure resources: Azure Virtual Machine (SQL Server / IPython Notebook server)
1. Create an Azure Virtual Machine running SQL Server and IPython Notebook server.
1. Upload data to an Azure storage container.
1. (Optional) Pre-process and clean data.
   
   a.  Pre-process and clean data in IPython Notebook, accessing data from Azure
   
       blobs.
   
   b.  Transform data to cleaned, tabular form, if needed.
   
   c.  Save data to VM-local files (IPython Notebook is running on VM, local drives refer to VM drives).
1. Load data to SQL Server database running on an Azure VM.
   
   a.  Login to SQL Server VM.
   
   b.  If data not saved already, download data files from Azure
   
       storage container to local-VM folder.
   
   c.  Run SQL Server Management Studio.
   
   d.  Create database and target tables.
   
   e.  Use one of the bulk import methods to load the data.
   
   f.  If table joins are required, create indexes to expedite joins.
   
   > [!NOTE]
   > For faster loading of large data sizes, it is recommended that you create partitioned tables and bulk import the data in parallel. For more information, see [Parallel Data Import to SQL Partitioned Tables](parallel-load-sql-partitioned-tables.md).
   > 
   > 
1. Explore data, create features as needed. Note that the features do not need to be materialized in the database tables. Only note the necessary query to create them.
1. Decide on a data sample size, if needed and/or desired.
1. Sign in to the [Azure Machine Learning Studio](https://studio.azureml.net/).
1. Read the data directly from the SQL Server using the [Import Data][import-data] module. Paste the necessary query which extracts fields, creates features, and samples data if needed directly in the [Import Data][import-data] query.
1. Simple Azure Machine Learning experiment flow starting with uploaded dataset

## <a name="largedbtodb"></a>Scenario \#6: Large dataset in a SQL Server database on-prem, targeting SQL Server in an Azure Virtual Machine
![Large SQL DB on-prem to SQL DB in Azure][6]

#### Additional Azure resources: Azure Virtual Machine (SQL Server / IPython Notebook server)
1. Create an Azure Virtual Machine running SQL Server and IPython Notebook server.
1. Use one of the data export methods to export the data from SQL Server to dump files.
   
   > [!NOTE]
   > If you decide to move all data from the on-prem database,
   > an alternate (faster) method to move the full database to the
   > SQL Server instance in Azure. Skip the steps to export data,
   > create database, and load/import data to the target database and
   > follow the alternate method.
   > 
   > 
1. Upload dump files to Azure storage container.
1. Load the data to a SQL Server database running on an Azure Virtual Machine.
   
   a.  Login to the SQL Server VM.
   
   b.  Download data files from an Azure storage container to the local-VM folder.
   
   c.  Run SQL Server Management Studio.
   
   d.  Create database and target tables.
   
   e.  Use one of the bulk import methods to load the data.
   
   f.  If table joins are required, create indexes to expedite joins.
   
   > [!NOTE]
   > For faster loading of large data sizes, create partitioned tables and to bulk import the data in parallel. For more information, see [Parallel Data Import to SQL Partitioned Tables](parallel-load-sql-partitioned-tables.md).
   > 
   > 
1. Explore data, create features as needed. Note that the features do not need to be materialized in the database tables. Only note the necessary query to create them.
1. Decide on a data sample size, if needed and/or desired.
1. Sign in to the [Azure Machine Learning Studio](https://studio.azureml.net/).
1. Read the data directly from the SQL Server using the [Import Data][import-data] module. Paste the necessary query which extracts fields, creates features, and samples data if needed directly in the [Import Data][import-data] query.
1. Simple Azure Machine Learning experiment flow starting with uploaded dataset.

### Alternate method to copy a full database from an on-premises  SQL Server to Azure SQL Database
![Detach local DB and attach to SQL DB in Azure][7]

#### Additional Azure resources: Azure Virtual Machine (SQL Server / IPython Notebook server)
To replicate the entire SQL Server database in your SQL Server VM, you should copy a database from one location/server to another, assuming that the database can be taken temporarily offline. You do this in the SQL Server Management Studio Object Explorer, or using the equivalent Transact-SQL commands.

1. Detach the database at the source location. For more information, see [Detach a database](https://technet.microsoft.com/library/ms191491\(v=sql.110\).aspx).
1. In Windows Explorer or Windows Command Prompt window, copy the detached database file or files and log file or files to the target location on the SQL Server VM in Azure.
1. Attach the copied files to the target SQL Server instance. For more information, see [Attach a Database](https://technet.microsoft.com/library/ms190209\(v=sql.110\).aspx).

[Move a Database Using Detach and Attach (Transact-SQL)](https://technet.microsoft.com/library/ms187858\(v=sql.110\).aspx)

## <a name="largedbtohive"></a>Scenario \#7: Big data in local files, target Hive database in Azure HDInsight Hadoop clusters
![Big data in local target Hive][9]

#### Additional Azure resources: Azure HDInsight Hadoop Cluster and Azure Virtual Machine (IPython Notebook server)
1. Create an Azure Virtual Machine running IPython Notebook server.
1. Create an Azure HDInsight Hadoop cluster.
1. (Optional) Pre-process and clean data.
   
   a.  Pre-process and clean data in IPython Notebook, accessing data from Azure
   
       blobs.
   
   b.  Transform data to cleaned, tabular form, if needed.
   
   c.  Save data to VM-local files (IPython Notebook is running on VM, local drives refer to VM drives).
1. Upload data to the default container of the Hadoop cluster selected in the step 2.
1. Load data to Hive database in Azure HDInsight Hadoop cluster.
   
   a.  Log in to the head node of the Hadoop cluster
   
   b.  Open the Hadoop Command Line.
   
   c.  Enter the Hive root directory by command `cd %hive_home%\bin` in Hadoop Command Line.
   
   d.  Run the Hive queries to create database and tables, and load data from blob storage to Hive tables.
   
   > [!NOTE]
   > If the data is big, users can create the Hive table with partitions. Then, users can use a `for` loop in the Hadoop Command Line on the head node to load data into the Hive table partitioned by partition.
   > 
   > 
1. Explore data and create features as needed in Hadoop Command Line. Note that the features do not need to be materialized in the database tables. Only note the necessary query to create them.
   
   a.  Log in to the head node of the Hadoop cluster
   
   b.  Open the Hadoop Command Line.
   
   c.  Enter the Hive root directory by command `cd %hive_home%\bin` in Hadoop Command Line.
   
   d.  Run the Hive queries in Hadoop Command Line on the head node of the Hadoop cluster to explore the data and create features as needed.
1. If needed and/or desired, sample the data to fit in Azure Machine Learning Studio.
1. Sign in to the [Azure Machine Learning Studio](https://studio.azureml.net/).
1. Read the data directly from the `Hive Queries` using the [Import Data][import-data] module. Paste the necessary query which extracts fields, creates features, and samples data if needed directly in the [Import Data][import-data] query.
1. Simple Azure Machine Learning experiment flow starting with uploaded dataset.

## <a name="decisiontree"></a>Decision tree for scenario selection
- - -
The following diagram summarizes the scenarios described above and the Advanced Analytics Process and Technology choices made that take you to each of the itemized scenarios. Note that data processing, exploration, feature engineering, and sampling may take place in one or more method/environment -- at the source, intermediate, and/or target environments – and may proceed iteratively as needed. The diagram only serves as an illustration of some of possible flows and does not provide an exhaustive enumeration.

![Sample DS process walkthrough scenarios][8]

### Advanced Analytics in action Examples
For end-to-end Azure Machine Learning walkthroughs that employ the Advanced Analytics Process and Technology using public datasets, see:

* [Team Data Science Process in action: using SQL Server](sql-walkthrough.md).
* [Team Data Science Process in action: using HDInsight Hadoop clusters](hive-walkthrough.md).

[1]: ./media/plan-sample-scenarios/dsp-plan-small-in-aml.png
[2]: ./media/plan-sample-scenarios/dsp-plan-local-with-processing.png
[3]: ./media/plan-sample-scenarios/dsp-plan-local-large.png
[4]: ./media/plan-sample-scenarios/dsp-plan-local-to-db.png
[5]: ./media/plan-sample-scenarios/dsp-plan-large-to-db.png
[6]: ./media/plan-sample-scenarios/dsp-plan-db-to-db.png
[7]: ./media/plan-sample-scenarios/dsp-plan-attach-db.png
[8]: ./media/plan-sample-scenarios/dsp-plan-sample-scenarios.png
[9]: ./media/plan-sample-scenarios/dsp-plan-local-to-hive.png


<!-- Module References -->
[import-data]: https://msdn.microsoft.com/library/azure/4e1b0fe6-aded-4b3f-a36f-39b8862b9004/
