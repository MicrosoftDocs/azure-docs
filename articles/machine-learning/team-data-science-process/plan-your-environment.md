---
title: Identify scenarios and plan the analytics process - Team Data Science Process | Azure Machine Learning 
description: Identify scenarios and plan for advanced analytics data processing by considering a series of key questions.
services: machine-learning
author: marktab
manager: marktab
editor: marktab
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 01/10/2020
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---

# How to identify scenarios and plan for advanced analytics data processing

What resources are required for you to create an environment that can perform advanced analytics processing on a dataset? This article suggests a series of questions to ask that can help identify tasks and resources relevant your scenario.

To learn about the order of high-level steps for predictive analytics, see [What is the Team Data Science Process (TDSP)](overview.md). Each step requires specific resources for the tasks relevant to your particular scenario.

Answer key questions in the following areas to identify your scenario:

* data logistics
* data characteristics
* dataset quality
* preferred tools and languages

## Logistic questions: data locations and movement

The logistic questions cover the following items:

* data source location
* target destination in Azure
* requirements for moving the data, including the schedule, amount, and resources involved

You may need to move the data several times during the analytics process. A common scenario is to move local data into some form of storage on Azure and then into Machine Learning Studio.

### What is your data source?

Is your data local or in the cloud? Possible locations include:

* a publicly available HTTP address
* a local or network file location
* a SQL Server database
* an Azure Storage container

### What is the Azure destination?

Where does your data need to be for processing or modeling? 

* Azure Blob Storage
* SQL Azure databases
* SQL Server on Azure VM
* HDInsight (Hadoop on Azure) or Hive tables
* Azure Machine Learning
* Mountable Azure virtual hard disks

### How are you going to move the data?

For procedures and resources to ingest or load data into a variety of different storage and processing environments, see:

* [Load data into storage environments for analytics](ingest-data.md)
* [Import your training data into Azure Machine Learning Studio (classic) from various data sources](../studio/import-data.md)

### Does the data need to be moved on a regular schedule or modified during migration?

Consider using Azure Data Factory (ADF) when data needs to be continually migrated. ADF can be helpful for:

* a hybrid scenario that involves both on-premises and cloud resources
* a scenario where the data is transacted, modified, or changed by business logic in the course of being migrated

For more information, see [Move data from an on-premises SQL server to SQL Azure with Azure Data Factory](move-sql-azure-adf.md).

### How much of the data is to be moved to Azure?

Large datasets may exceed the storage capacity of certain environments. For an example, see the discussion of size limits for Machine Learning Studio (classic) in the next section. In such cases, you might use a sample of the data during the analysis. For details of how to down-sample a dataset in various Azure environments, see [Sample data in the Team Data Science Process](sample-data.md).

## Data characteristics questions: type, format, and size

These questions are key to planning your storage and processing environments. They will help you choose the appropriate scenario for your data type and understand any restrictions.

### What are the data types?

* Numerical
* Categorical
* Strings
* Binary

### How is your data formatted?

* Comma-separated (CSV) or tab-separated (TSV) flat files
* Compressed or uncompressed
* Azure blobs
* Hadoop Hive tables
* SQL Server tables

### How large is your data?

* Small: Less than 2 GB
* Medium: Greater than 2 GB and less than 10 GB
* Large: Greater than 10 GB

Take the Azure Machine Learning Studio (classic) environment for example:

* For a list of the data formats and types supported by Azure Machine Learning Studio, see
  [Data formats and data types supported](../studio/import-data.md#supported-data-formats-and-data-types) section.
* For information on the limitations of other Azure services used in the analytics process, see [Azure Subscription and Service Limits, Quotas, and Constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).

## Data quality questions: exploration and pre-processing

### What do you know about your data?

Understand the basic characteristics about your data:

* What patterns or trends it exhibits
* What outliers it has
* How many values are missing

This step is important to help you:

* Determine how much pre-processing is needed
* Formulate hypotheses that suggest the most appropriate features or type of analysis
* Formulate plans for additional data collection

Useful techniques for data inspection include descriptive statistics calculation and visualization plots. For details of how to explore a dataset in various Azure environments, see [Explore data in the Team Data Science Process](explore-data.md).

### Does the data require preprocessing or cleaning?

You might need to preprocess and clean your data before you can use the dataset effectively for machine learning. Raw data is often noisy and unreliable. It might be missing values. Using such data for modeling can produce misleading results. For a description, see [Tasks to prepare data for enhanced machine learning](prepare-data.md).

## Tools and languages questions

There are many options for languages, development environments, and tools. Be aware of your needs and preferences.

### What languages do you prefer to use for analysis?

* R
* Python
* SQL

### What tools should you use for data analysis?

* [Microsoft Azure Powershell](/powershell/azure/overview) - a script language used to administer your Azure resources in a script language
* [Azure Machine Learning Studio](../studio/what-is-ml-studio.md)
* [Revolution Analytics](https://www.microsoft.com/sql-server/machinelearningserver)
* [RStudio](https://www.rstudio.com)
* [Python Tools for Visual Studio](https://aka.ms/ptvsdocs)
* [Anaconda](https://www.continuum.io/why-anaconda)
* [Jupyter notebooks](https://jupyter.org/)
* [Microsoft Power BI](https://powerbi.microsoft.com)

## Identify your advanced analytics scenario

After you have answered the questions in the previous section, you are ready to determine which scenario best fits your case. The sample scenarios are outlined in [Scenarios for advanced analytics in Azure Machine Learning](plan-sample-scenarios.md).

## Next steps

> [!div class="nextstepaction"]
> [What is the Team Data Science Process (TDSP)?](overview.md)
