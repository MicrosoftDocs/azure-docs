<properties 
	pageTitle="How to identify scenarios and plan for advanced analytics data processing | Microsoft Azure" 
	description="Plan for advanced analytics by considering a series of key questions." 
	services="machine-learning" 
	documentationCenter="" 
	authors="bradsev"
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/14/2016" 
	ms.author="bradsev" /> 


# How to identify scenarios and plan for advanced analytics data processing

What resources should you plan to include when setting up an environment to do advanced analytics processing on a dataset? This article suggests a series of questions to ask that will help identify the tasks and resources relevant your scenario. The order of high-level steps for predictive analytics is outlined in the [What is the Team Data Science Process (TDSP)?](data-science-process-overview.md) document. Each of these steps will require specific resources for the  tasks relevant to your particular scenario. The key questions to identify your scenario concern data logistics, characteristics, the quality of the datasets, and the tools and languages you prefer to do the analysis.

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]

## Logistic questions: data locations and movement
The logistic questions concern the location of the **data source**, the **target destination** in Azure, and requirements for moving the data, including the schedule, amount and resources involved. The data may need to be moved several times during the analytics process. A common scenario is to move local data into some form of storage on Azure and then into Machine Learning Studio.

1. **What is your data source?** Is it local or in the cloud? For example:
	- The data is publicly available at an HTTP address.
	- The data resides in a local/network file location.
	- The data is in a SQL Server database.
	- The data is stored in an Azure storage container

2. **What is the Azure destination?** Where does it need to be for processing or modeling? For example:
	- Azure Blob Storage
	- SQL Azure databases
	- SQL Server on Azure VM
	- HDInsight (Hadoop on Azure) or Hive tables
	- Azure Machine Learning
	- Mountable Azure virtual hard disks.

3. **How are you going to move the data?** The procedures and resources available to ingest or load data into a variety of different storage and processing environments are outlined in the following topics.

	-  [Load data into storage environments for analytics](machine-learning-data-science-ingest-data.md) 
	-  [Import your training data into Azure Machine Learning Studio from various data sources](machine-learning-data-science-import-data,md).

4. **Does the data need to be moved on a regular schedule or modified during migration?** Consider using Azure Data Factory (ADF) when data needs to be continually migrated, particularly if a hybrid scenario that accesses both on-premise and cloud resources is involved, or when the data is transacted or needs to be modified or have business logic added to it in the course of being migrated. For further information, see [Move data from an on-premise SQL server to SQL Azure with Azure Data Factory](machine-learning-data-science-move-sql-azure-adf.md)

5. **How much of the data is to be moved to Azure?** Datasets that are very large may exceed the storage capacity of certain environments. For an example, see the discussion of size limits for Machine Learning Studio in the next section. In such cases a sample of the data may be used during the analysis. For details of how to down-sample a dataset in various Azure environments, see [Sample data in the Team Data Science Process](machine-learning-data-science-sample-data.md).


## Data characteristics questions: type, format and size
These questions are key to planning your storage and processing environments, each of which are appropriate to various types of data and each of which have certain restrictions. 

1. **What are the data types?** For Example: 
	- Numerical
	- Categorical
	- Strings
	- Binary

2. **How is your data formatted?** For Example:
    - Comma-separated (CSV) or tab-separated (TSV) flat files
    - Compressed or uncompressed
	- Azure blobs
	- Hadoop Hive tables
	- SQL Server tables

2. **How large is your data?**
    - Small: Less than 2GB
    - Medium: Greater than 2GB and less than 10GB
	- Large: Greater than 10GB

Take the Azure Machine Learning Studio environment for example:

- For a list of the data formats and types supported by Azure Machine Learning Studio, see
[Data formats and data types supported](machine-learning-data-science-import-data.md#data-formats-and-data-types-supported) section.
- For information on data limitations for Azure Machine Learning Studio, see the **How large can the data set be for my modules?** section of [Importing and exporting data for Machine Learning](machine-learning-faq.md#machine-learning-studio-questions)

For information on the limitations of other Azure services used in the analytics process, see [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md).

## Data quality questions: exploration and pre-processing

1. **What do you know about your data?** Explore data when you need to gain an understand its basic characteristics. What patterns or trends it exhibits, what outliers is has or how many values are missing. This step is important for determining the extent of pre-processing needed, for formulating hypotheses that could suggest the most appropriate features or type of analysis, and for formulating plans for additional data collection. Calculating descriptive statistics and plotting visualizations are useful techniques for data inspection. For details of how to explore a dataset in various Azure environments, see [Explore data in the Team Data Science Process](machine-learning-data-science-explore-data.md).

2. **Does the data require pre-processing or cleaning?**
Pre-processing and cleaning data are important tasks that typically must be conducted before dataset can be used effectively for machine learning. Raw data is often noisy and unreliable, and may be missing values. Using such data for modeling can produce misleading results. For a description, see [Tasks to prepare data for enhanced machine learning](machine-learning-data-science-prepare-data.md).

## Tools and languages questions
There are lots of options here depending on what languages and development environments or tools you need or are most conformable using.
 
1. **What languages do you prefer to use for analysis?**  
	- R
	- Python
	- SQL

2. **What tools should you use for data analysis?**
	- [Microsoft Azure Powershell](powershell-install-configure.md) - a script language used to administer your Azure resources in a script language.
	- [Azure Machine Learning Studio](machine-learning-what-is-ml-studio/)
	- [Revolution Analytics](http://www.revolutionanalytics.com/revolution-r-open)
	- [RStudio](http://www.rstudio.com)
	- [Python Tools for Visual Studio](http://microsoft.github.io/PTVS/)
	- [Anaconda](https://www.continuum.io/why-anaconda)
	- [Jupiter notebooks](http://jupyter.org/)
	- [Microsoft Power BI](http://powerbi.microsoft.com) 


## Identify your advanced analytics scenario
Once you have answered the questions in the previous section, you are ready to determine which scenario best fits your case. The sample scenarios are outlined in [Scenarios for advanced analytics in Azure Machine Learning](machine-learning-data-science-plan-sample-scenarios.md).







 