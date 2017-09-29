---
title: Data acquisition and understanding stage of Team Data Science Process Lifecycle - Azure | Microsoft Docs
description: The goals, tasks, and deliverables for the data acquisition and understanding stage of your data science projects.
services: machine-learning
documentationcenter: ''
author: bradsev
manager: cgronlun
editor: cgronlun

ms.assetid: 
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/02/2017
ms.author: bradsev;

---
# Data acquisition and understanding

This topic outlines the goals, tasks, and deliverables associated with the **data acquisition and understanding stage** of the Team Data Science Process. This process provides a recommended lifecycle that you can use to structure your data science projects. The lifecycle outlines the major stages that projects typically execute, often iteratively:

* **Business Understanding**
* **Data Acquisition and Understanding**
* **Modeling**
* **Deployment**
* **Customer Acceptance**

Here is a visual representation of the **Team Data Science Process lifecycle**. 

![TDSP-Lifecycle2](./media/lifecycle/tdsp-lifecycle2.png) 


## Goals
* A clean, high-quality dataset whose relations to the target variables are understood that are located in the appropriate analytics environment, ready to model.
* A solution architecture of the data pipeline to refresh and score data regularly has been developed.

## How to do it
There are three main tasks addressed in this stage:

* **Ingest the data** into the target analytic environment.
* **Explore the data** to determine if the data quality is adequate to answer the question. 
* **Set up a data pipeline** to score new or regularly refreshed data.

### 2.1 Ingest the data
Set up the process to move the data from source locations to the target locations where analytics operations like training and predictions are to be executed. For technical details and options on how to do this with various Azure data services, see [Load data into storage environments for analytics](ingest-data.md). 

### 2.2 Explore the data
Before you train your models, you need to develop a sound understanding of the data. Real-world datasets are often noisy or are missing values or have a host of other discrepancies. Data summarization and visualization can be used to audit the quality of your data and provide the information needed to process the data before it is ready for modeling. This process is often iterative.

TDSP provides an automated utility called [IDEAR](https://github.com/Azure/Azure-TDSP-Utilities/blob/master/DataScienceUtilities/DataReport-Utils) to help visualize the data and prepare data summary reports. We recommend starting with IDEAR first to explore the data to help develop initial data understanding interactively with no coding and then write custom code for data exploration and visualization. For guidance on cleaning the data, see [Tasks to prepare data for enhanced machine learning](prepare-data.md).  

Once you are satisfied with the quality of the cleansed data, the next step is to better understand the patterns that are inherent in the data that help you choose and develop an appropriate predictive model for your target. Look for evidence for how well connected the data is to the target and whether there is sufficient data to move forward with the next modeling steps. Again, this process is often iterative. You may need to find new data sources with more accurate or more relevant data to augment the dataset initially identified in the previous stage.  

### 2.3 Set up a data pipeline
In addition to the initial ingestion and cleaning of the data, you typically need to set up a process to score new data or refresh the data regularly as part of an ongoing learning process. This can be done by setting up a data pipeline or workflow. Here is an [example](move-sql-azure-adf.md) of how to set up a pipeline with [Azure Data Factory](https://azure.microsoft.com/services/data-factory/). 

A solution architecture of the data pipeline is developed in this stage. The pipeline is also developed in parallel with the following stages of the data science project. The pipeline may be batch-based or streaming/real-time or a hybrid depending on your business needs and the constraints of your existing systems into which this solution is being integrated. 

## Artifacts
The following are the deliverables in this stage.

* [**Data Quality Report**](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/DataReport/DataSummaryReport.md): This report contains data summaries, relationships between each attribute and target, variable ranking etc. The [IDEAR](https://github.com/Azure/Azure-TDSP-Utilities/blob/master/DataScienceUtilities/DataReport-Utils) tool provided as part of TDSP can quickly generate this report on any tabular dataset such as a CSV file or a relational table. 
* **Solution Architecture**: This can be a diagram or description of your data pipeline used to run scoring or predictions on new data once you have built a model. It also contains the pipeline to retrain your model based on new data. The document is stored in the [Project](https://github.com/Azure/Azure-TDSP-ProjectTemplate/tree/master/Docs/Project) directory when using the TDSP directory structure template.
* **Checkpoint Decision**: Before you begin full feature engineering and model building, you can reevaluate the project to determine whether the value expected is sufficient to continue pursing it. You may, for example, be ready to proceed, need to collect more data, or abandon the project as the data does not exist to answer the question.

## Next steps

Here are links to each step in the lifecycle of the Team Data Science Process:

* [1. Business Understanding](lifecycle-business-understanding.md)
* [2. Data Acquisition and Understanding](lifecycle-data.md)
* [3. Modeling](lifecycle-modeling.md)
* [4. Deployment](lifecycle-deployment.md)
* [5. Customer Acceptance](lifecycle-acceptance.md)

Full end-to-end walkthroughs that demonstrate all the steps in the process for **specific scenarios** are also provided. They are listed and linked with thumbnail descriptions in the [Example walkthroughs](walkthroughs.md) topic. They illustrate how to combine cloud, on-premises tools, and services into a workflow or pipeline to create an intelligent application.  

For examples executing steps in the Team Data Science Process that use Azure Machine Learning Studio, see the [With Azure ML](http://aka.ms/datascienceprocess) learning path.