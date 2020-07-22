---
title: Data acquisition and understanding of Team Data Science Process
description: The goals, tasks, and deliverables for the data acquisition and understanding stage of your data-science projects
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
# Data acquisition and understanding stage of the Team Data Science Process

This article outlines the goals, tasks, and deliverables associated with the data acquisition and understanding stage of the Team Data Science Process (TDSP). This process provides a recommended lifecycle that you can use to structure your data-science projects. The lifecycle outlines the major stages that projects typically execute, often iteratively:

   1. **Business understanding**
   2. **Data acquisition and understanding**
   3. **Modeling**
   4. **Deployment**
   5. **Customer acceptance**

Here is a visual representation of the TDSP lifecycle: 

![TDSP lifecycle](./media/lifecycle/tdsp-lifecycle2.png) 


## Goals
* Produce a clean, high-quality data set whose relationship to the target variables is understood. Locate the data set in the appropriate analytics environment so you are ready to model.
* Develop a solution architecture of the data pipeline that refreshes and scores the data regularly.

## How to do it
There are three main tasks addressed in this stage:

   * **Ingest the data** into the target analytic environment.
   * **Explore the data** to determine if the data quality is adequate to answer the question. 
   * **Set up a data pipeline** to score new or regularly refreshed data.

### Ingest the data
Set up the process to move the data from the source locations to the target locations where you run analytics operations, like training and predictions. For technical details and options on how to move the data with various Azure data services, see [Load data into storage environments for analytics](ingest-data.md). 

### Explore the data
Before you train your models, you need to develop a sound understanding of the data. Real-world data sets are often noisy, are missing values, or have a host of other discrepancies. You can use data summarization and visualization to audit the quality of your data and provide the information you need to process the data before it's ready for modeling. This process is often iterative.

TDSP provides an automated utility, called [IDEAR](https://github.com/Azure/Azure-TDSP-Utilities/blob/master/DataScienceUtilities/DataReport-Utils), to help visualize the data and prepare data summary reports. We recommend that you start with IDEAR first to explore the data to help develop initial data understanding interactively with no coding. Then you can write custom code for data exploration and visualization. For guidance on cleaning the data, see [Tasks to prepare data for enhanced machine learning](prepare-data.md).  

After you're satisfied with the quality of the cleansed data, the next step is to better understand the patterns that are inherent in the data. This data analysis helps you choose and develop an appropriate predictive model for your target. Look for evidence for how well connected the data is to the target. Then determine whether there is sufficient data to move forward with the next modeling steps. Again, this process is often iterative. You might need to find new data sources with more accurate or more relevant data to augment the data set initially identified in the previous stage. 

### Set up a data pipeline
In addition to the initial ingestion and cleaning of the data, you typically need to set up a process to score new data or refresh the data regularly as part of an ongoing learning process. Scoring may be completed with a data pipeline or workflow. The [Move data from a SQL Server instance to Azure SQL Database with Azure Data Factory](move-sql-azure-adf.md) article gives an example of how to set up a pipeline with [Azure Data Factory](https://azure.microsoft.com/services/data-factory/). 

In this stage, you develop a solution architecture of the data pipeline. You develop the pipeline in parallel with the next stage of the data science project. Depending on your business needs and the constraints of your existing systems into which this solution is being integrated, the pipeline can be one of the following options: 

   * Batch-based
   * Streaming or real time 
   * A hybrid 

## Artifacts
The following are the deliverables in this stage:

   * [Data quality report](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Data_Report/DataSummaryReport.md): This report includes data summaries, the relationships between each attribute and target, variable ranking, and more. The [IDEAR](https://github.com/Azure/Azure-TDSP-Utilities/blob/master/DataScienceUtilities/DataReport-Utils) tool provided as part of TDSP can quickly generate this report on any tabular data set, such as a CSV file or a relational table. 
   * **Solution architecture**: The solution architecture can be a diagram or description of your data pipeline that you use to run scoring or predictions on new data after you have built a model. It also contains the pipeline to retrain your model based on new data. Store the document in the [Project](https://github.com/Azure/Azure-TDSP-ProjectTemplate/tree/master/Docs/Project) directory when you use the TDSP directory structure template.
   * **Checkpoint decision**: Before you begin full-feature engineering and model building, you can reevaluate the project to determine whether the value expected is sufficient to continue pursuing it. You might, for example, be ready to proceed, need to collect more data, or abandon the project as the data does not exist to answer the question.

## Next steps

Here are links to each step in the lifecycle of the TDSP:

   1. [Business understanding](lifecycle-business-understanding.md)
   2. [Data acquisition and understanding](lifecycle-data.md)
   3. [Modeling](lifecycle-modeling.md)
   4. [Deployment](lifecycle-deployment.md)
   5. [Customer acceptance](lifecycle-acceptance.md)

We provide full walkthroughs that demonstrate all the steps in the process for specific scenarios. The [Example walkthroughs](walkthroughs.md) article provides a list of the scenarios with links and thumbnail descriptions. The walkthroughs illustrate how to combine cloud, on-premises tools, and services into a workflow or pipeline to create an intelligent application. 

For examples of how to execute steps in TDSPs that use Azure Machine Learning Studio, see [Use the TDSP with Azure Machine Learning](https://docs.microsoft.com/azure/machine-learning/team-data-science-process/lifecycle-data).
