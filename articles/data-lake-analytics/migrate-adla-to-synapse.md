---
title: Migrate Azure Data Analytics to Azure Synapse Analytics.
description: This article describes how to migrate from Azure Data Analytics to Azure Synapse Analytics.
ms.reviewer: 
ms.service: data-lake-analytics
ms.topic: how-to
ms.custom: migrate-adla-to-synapse
ms.date: 08/15/2021
---

# Migrate Azure Data Analytics to Azure Synapse Analytics

Microsoft launched the Azure Synapse Analytics which aims at bringing both data lakes and data warehouse together for a unique big data analytics experience. It will help customers gather and analyze all the varying data, to solve data inefficiency, and work together. Moreover, Synapse’s integration with Azure Machine Learning and Power BI will allow the improved ability for organizations to get insights from its data as well as execute machine learning to all its smart apps. 

The document shows you how to do the migration from ADLA to Azure Synapse Analytics. 

## Recommended approach
- Step 1: Assess readiness
- Step 2: Prepare to migrate
- Step 3: Migrate data and application workloads
- Step 4: Cutover from ADLA to Azure Synapse Analytics

### Step 1: Assess readiness

1. Look at  [Apache Spark on Azure Synapse Analytics](../synapse-analytics/spark/apache-spark-overview.md), and understand key differences of ADLA and Spark on Azure Synapse Analytics. 

|Item | ADLA | Spark on Synapse |
| --- | --- |--- |
| Pricing  |Per Analytic Unit-hour |Per vCore-hour|
|Engine 	|Azure Data Lake Analytics 	|Apache Spark
|Default Programing Language 	|U-SQL	 |T-SQL, Python, Scala, Spark SQL and .Net
|Data Sources 	|Azure Data Lake Storage	|Azure Blob Storage, Azure Data Lake Storage

2. Review the <a href="#questionnaire">Questionnaire for Migration Assessment</a> and list those possible risks for considering. 

### Step 2: Prepare to migrate

1.	Identify jobs and data that you'll migrate.
-	Take this opportunity to clean up those jobs that you no longer use. Unless you plan to migrate all your jobs at one time, take this time to identify logical groups of jobs that you can migrate in phases.
-	Evaluate the size of the data and understand Apache Spark data format. Review your U-SQL scripts and evaluate the scripts re-writing efforts and understand the Apache Spark code concept.

2.	Determine the impact that a migration will have on your business. For example, whether you can afford any downtime while migration takes place.

3.	Create a migration plan.

### Step 3: Migrate data and application workload

1.	Migrate your data from Azure Data Lake Storage Gen1 to Azure Data Lake Storage Gen2. <br></br>
    Azure Data Lake Storage Gen1 retirement will be in February 2024, see the [official announcement](https://azure.microsoft.com/updates/action-required-switch-to-azure-data-lake-storage-gen2-by-29-february-2024/). We’d suggest migrating the data to Gen2 in the first place. See [Understand Apache Spark data formats for Azure Data Lake Analytics U-SQL developers](understand-spark-data-formats.md) and move both the file and the data stored in U-SQL tables to make them accessible to Azure Synapse Analytics.  More details of the migration guide can be found [here](../storage/blobs/data-lake-storage-migrate-gen1-to-gen2.md). 

2.	Transform your U-SQL scripts to Spark. 
    Refer to [Understand Apache Spark code concepts for Azure Data Lake Analytics U-SQL developers](understand-spark-code-concepts.md) to transform your U-SQL scripts to Spark. 

3.	Transform or re-create your job orchestration pipelines to new Spark program.

### Step 4: Cutover from ADLA to new Azure Analytics Services

After you're confident that your applications and workloads are stable, you can begin using Azure Synapse Analytics to satisfy your business scenarios. Turn off any remaining pipelines that are running on ADLA and decommission your ADLA accounts.

<a name="questionnaire"></a>
## Questionnaire for Migration Assessment 

|Category	|Questions 	|Reference|
| --- | --- |--- |
|Evaluate the size of the Migration	|How many ADLA accounts do you have? How many pipelines are in use? How many U-SQL scripts are in use?| The more data and scripts to be migrated, the more UDO/UDF are used in scripts, the more difficult it is to migrate. The time and resources required for migration need to be well planned according to the scale of the project.|
|Data source |What’s the size of the data source? What kinds of data format for processing?	|[Understand Apache Spark data formats for Azure Data Lake Analytics U-SQL developers](understand-spark-data-formats.md)|
|Data output |Will you keep the output data for later use? If the output data is saved in U-SQL tables, how to handle it? | If the output data will be used often and saved in U-SQL tables, you need change the scripts and change the output data to Spark supported data format.|
|Data migration	|Have you made the storage migration plan? |[Migrate Azure Data Lake Storage from Gen1 to Gen2](../storage/blobs/data-lake-storage-migrate-gen1-to-gen2.md) |
|U-SQL scripts transform|Do you use UDO/UDF (.Net, python, etc.)?If above answer is yes, which language do you use in your UDO/UDF and any problems for the transform during the transform?Is the federated query being used in U-SQL?|[Understand Apache Spark code concepts for Azure Data Lake Analytics U-SQL developers](understand-spark-code-concepts.md)|
