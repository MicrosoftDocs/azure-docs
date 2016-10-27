<properties
	pageTitle="Team Data Science Process Lifecycle | Microsoft Azure" 
	description="An outline of the key components of the Team Data Science Team Lifecycle."  
	services="machine-learning"
	documentationCenter=""
	authors="bradsev"
	manager="jhubbard"
	editor="cgronlun" />

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/27/2016"
	ms.author="bradsev;hangzh;gokuma"/>
    
# Team Data Science Process lifecycle 

The Team Data Science Process (TDSP) provides a recommended lifecycle that you can use to structure the development your data science projects. The lifecycle outlines the steps that projects follow, from start to finish, when they are executed using the TDSP. If you are using another lifecycle, such as [CRISP-DM](https://wikipedia.org/wiki/Cross_Industry_Standard_Process_for_Data_Mining), [KDD](https://wikipedia.org/wiki/Data_mining#Process) or your organization's own custom process, you can still use the TDSP in the context of those development lifecycles. This lifecycle has been designed for data science projects that lead to building data products and intelligent applications that include predictive analytics using machine learning or artificial intelligence (AI) models that are productionized. Exploratory data science projects and ad hoc / on-off analytics projects can also use this process, but some steps of this lifecycle may not be needed.    

Here is a visual representation of the TDSP lifecycle. 

![TDSP_LIFECYCLE](./media/data-science-process-overview/tdsp-lifecycle.png) 

The TDSP data science lifecycle is composed of five major stages that are executed iteratively. This includes:

* Business Understanding
* Data Acquisition and Understanding
* Modeling
* Deployment
* Customer Acceptance

We describe each stage in detail. 

## 1. Business Understanding

### Goals

The goals of this stage are:

* Clearly and explicitly specify each of the model targets as a 'sharp' question which is used to drive the customer engagement.
* Clearly specifying where to find the data sources of interest. Define the predictive model target in this step and determine if we need to bring in ancillary data from other sources.

### How to do it 

In this stage, you work with your customer and stakeholder to understand the business problems that can be greatly enhanced with predictive analytics. A central objective of this step is to identify the key business variables (sales forecast or the probability of an order being fraudulent, for example) that the analysis needs to predict (also known as model targets) to satisfy these requirements. In this stage, you also to develop an understanding of the data sources needed to address the objectives of the project from an analytical perspective. There are two main aspects of this stage - Define Objectives and Identify data sources. 

#### 1.1 Define Objectives

1. Understand the customer business domain, key variables by which success is defined in that space. Then understand what business problems are we trying to address using data science to affect those key metrics?
2. Define the project goals with 'sharp' question(s). A fine description of what a sharp question is, and how you can ask it, can be found in this [article](https://blogs.technet.microsoft.com/machinelearning/2016/03/28/how-to-do-data-science/). As per the article, here is a useful tip to ask a sharp question - "When choosing your question, imagine that you are approaching an oracle that can tell you anything in the universe, as long as the answer is a number or a name". Data science / machine learning is typically used to answer these five types of questions:
 * How much or how many? (regression)
 * Which category? (classification)
 * Which group? (clustering)
 * Is this weird? (anomaly detection)
 * Which option should be taken? (recommendation)
3. Define the project team, the role, and responsibilities. Develop a high-level milestone plan that you iterate upon as more information is discovered.  

4. Define success metrics. The metrics must be SMART (Specific, Measurable, Achievable, Relevant, and Time-bound). For example: Achieve customer churn prediction accuracy of X% by the end of this 3-month project so that we can offer promotions to reduce churn. 

#### 1.2 Identify Data Sources

Identify data sources that contain known examples of answers to the sharp questions. Look for the following data:
 * Data that is **Relevant** to the question. Do we have measures of the target and features that are related to the target?
 * Data that is an **Accurate** measure of our model target and the features of interest.
 
 It is not uncommon, for example, to find that existing systems need to collect and log additional kinds of data to address the problem and achieve the project goals. In this case, you may want to look for external data sources or update your systems to collect newer data.


### Artifacts

The following are the deliverables in this stage.

 * **[Charter Document](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Project/Charter.md)**: A standard template is provided in the TDSP project structure  definition. This is a living document that is updated throughout the project as new discoveries are made and as business requirements change. The key is to iterate upon this document with finer details as you progress through the discovery process. Be sure to keep the customer and stakeholders involved in the changes and clearly communicate the reasons for the change.  
 * **[Data Sources](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/DataReport/Data%20Defintion.md#raw-data-sources)**: This is part of the Data Report that is found in the TDSP project structure. It describes the sources for the raw data. In later stages, you fill in additional details like scripts to move the data to your analytic environment.  
 * **[Data 
 * ](https://github.com/Azure/Azure-TDSP-ProjectTemplate/tree/master/Docs/DataDictionaries)**: This document provides the descriptions and the schema (data types, information on any validation rules) of the data which 
 * be used to answer the question. If available, the entity-relation diagrams or descriptions are included too.
 
## 2. Data Acquisition and Understanding

### Goals 

The goals for this stage are:
 * Ingest the data into the target analytic environment
 * To determine if the data we have can be used to answer the question. 
 
### How to do it

In this stage, you start developing the process to move the data from the source location to the target locations where the analytics operations like training and predictions (also known as scoring) are to be run. For technical details and options on how to do this on various Azure data services, see [Load data into storage environments for analytics](https://azure.microsoft.com/documentation/articles/machine-learning-data-science-ingest-data/). 

Before you train your models, you need to develop a deep understanding about the data. Real world data is often messy with incomplete or incorrect data. By data summarization and visualization of the data, you can quickly identify the quality of your data and inform how to deal with the data quality. For guidance on cleaning the data, see this [article](https://azure.microsoft.com/documentation/articles/machine-learning-data-science-prepare-data/).

Data visualization can be particularly useful to answer questions like - Have we measured the features consistently enough for them to be useful or are there a lot of missing values in the data? Has the data been consistently collected over the time period of interest or are there blocks of missing observations? If the data does not pass this quality check, we may need to go back to the previous step to correct or get more data. 

Otherwise, you can start to better understand the inherent patterns in the data that help you develop a sound predictive model for your target. Specifically you look for evidence for how well connected is the data to the target and whether the data is large enough to move forward with next steps.  As we determine if the data is connected or if we have enough data, we may need to find new data sources with more accurate or more relevant data to complete the data set initially identified in the previous stage. TDSP also provides automated utility called [IDEAR](https://github.com/Azure/Azure-TDSP-Utilities/blob/master/DataScienceUtilities/DataReport-Utils) to help visualize the data and prepare data summary reports. We recommend starting with IDEAR first to explore the data to help develop initial data understanding interactively with no coding and then write custom code for data exploration and visualization.  

In addition to the initial ingestion of data, you typically need to set up a process to score new data or refresh the data regularly as part of an ongoing learning process. This can be done by setting up a data pipeline or workflow. Here is an [example](https://azure.microsoft.com/documentation/articles/machine-learning-data-science-move-sql-azure-adf/) of how to setup a pipeline with [Azure Data Factory](https://azure.microsoft.com/services/data-factory/). A solution architecture of the data pipeline is developed in this stage. The pipeline is developed in parallel in the following stages of the data science project. The pipeline may be batch-based or a streaming/real-time or a hybrid depending on your business need and the constraints of your existing systems into which this solution is being integrated. 

### Artifacts

The following are the deliverables in this stage.

 * **[Data Quality Report](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/DataReport/DataSummaryReport.md)**: This report contains data summaries, relationships between each attribute and target, variable ranking etc. The [IDEAR](https://github.com/Azure/Azure-TDSP-Utilities/blob/master/DataScienceUtilities/DataReport-Utils) tool provided as part of TDSP can help with the quickly generating this report on any tabular dataset like a CSV or relational table. 
 
 * Solution Architecture: This can be a diagram and/or description of your data pipeline used to run scoring or predictions on new data once you have built a model. It also contains the pipeline to retrain your model based on new data. The document is stored in this [directory](https://github.com/Azure/Azure-TDSP-ProjectTemplate/tree/master/Docs/Project) when using the TDSP directory structure template.   
 
 
**Checkpoint Decision**: Before we begin to do the full feature engineering and model building process, we can reevaluate the project to determine value in continuing this effort. We may be ready to proceed, need to collect more data, or it’s possible the data does not exist to answer the question.

## 3. Modeling
 
### Goals

The goals for this stage are:
  * Develop new attributes or data features (also known as feature engineering), for building the machine learning model.
  * Construct and evaluate an informative model to predict the target.
  * Determine if we have a model that is suitable for production use
  

### How to do it

There are two main aspects in this stage - Feature Engineering and Model training. They are described in following sub-sections. 


#### 3.1 Feature Engineering

Feature engineering involves inclusion, aggregation and transformation of raw variables to create the features used in the analysis. If we want insight into what is driving the model, then we need to understand how features are related to each other, and how the machine learning method is be using those features. This step requires a creative combination of domain expertise and the insights obtained from the data exploration step. This is a balancing act of including informative variables without including too many unrelated variables. Informative variables improve our result; unrelated variables introduce unnecessary noise into the model. You also need to be able to generate these features for new data during scoring. So there should not be any dependency on generating these features on any piece of data that is unavailable at the time of scoring. For technical guidance on feature engineering when using various Azure data technologies, see this [article](https://azure.microsoft.com/documentation/articles/machine-learning-data-science-create-features/). 


#### 3.2 Model Training

Depending on type of question you are trying answer, there are multiple modeling algorithms options available. For guidance on choosing the algorithms, see this [article](https://azure.microsoft.com/documentation/articles/machine-learning-algorithm-choice/). NOTE: Though this article is written for Azure Machine Learning, it should be generally useful even when using other frameworks. 

The process for model training is: 

 * The input data for modeling is usually split randomly into a training data set and a test data set. 
 * The models are built using the training data set.
 * Evaluate (training and test dataset) a series of competing machine learning algorithms along with the various associated tuning parameters (also known as parameter sweep) that are geared toward answering the question of interest with the data we currently have at hand. 
 * Determine the “best” solution to answer the question by comparing the success metric between alternative methods.
 
 >[NOTE] Avoid leakage: Leakage is caused by including variables that can perfectly predict the target. These are usually variables that may have been used to detect the target initially. As the target is redefined, these dependencies can be hidden from the original definition. To avoid this often requires iterating between building an analysis data set, and creating a model and evaluating the accuracy. Leakage is a major reason data scientists get nervous when they get really good predictive results.

We provide an [Automated Modeling and Reporting tool](https://github.com/Azure/Azure-TDSP-Utilities/blob/master/DataScienceUtilities/Modeling) with TDSP that is able to run through multiple algorithms and parameter sweeps to produce a baseline model. It also produces a baseline modeling report summarizing performance of each model and parameter combination including variable importance. This can further drive further feature engineering. 

### Artifacts
The artifacts produced in this stage include:

 * **[Feature Sets](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/DataReport/Data%20Defintion.md#feature-sets)**: The features developed for the modeling are described in the Feature Set section of the Data Definition report. It contains pointers to the code to generate the features and description on how the feature was generated.  
 
 * **[Modeling Report](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Model/Model%201/Model%20Report.md)**: For each model that is tried, a standard report following a specified TDSP template is produced.  

**Checkpoint Decision**: We evaluate whether the model performing is acceptable enough to deploy it to a production system here. Some questions to ask are:
 * Does the model answer the question sufficiently given the test data? 
 * Should we go back and collect more data or do more feature engineering or try other algorithms?

## 4. Deployment

### Goal
Deploy models and pipeline to a production or production-like environment for final user acceptance. 

### How to do it

Once we have a set of models that perform well, they can be operationalized for other applications to consume. Depending on the business requirements, predictions are made either in real time or on a batch basis. To be operationalized, the models have to be exposed with an open API interface that is easily consumed from various applications such online website, spreadsheets, dashboards, or line of business and backend applications. See example of model operationalization with Azure Machine Learning web service in this [article](https://azure.microsoft.com/documentation/articles/machine-learning-publish-a-machine-learning-web-service/). It is also a good idea to build in telemetry and monitoring of the production model deployment and the data pipeline to help with system status reporting and troubleshooting.  

### Artifacts
 
  * Status dashboard of system health and key metrics
  * Final modeling report with deployment details
  * Final solution architecture document
  
## 5. Customer Acceptance

### Goal
To finalize the project deliverables by confirming the pipeline, the model, and their deployment in a production environment.


###How to do it

The customer would validate that the system meets their business needs and the answers the questions with acceptable accuracy to deploy the system to production for use by their client application. All the documentation is finalized and reviewed. A hand-off of the project to the entity responsible for operations is done. This could be an IT or data science team at the customer or an agent of the customer that is responsible for running the system in production. 


###Artifacts

The main artifact produced in this final stage is the **[Project Final Report](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Project/Exit%20Report.md)**. This is the project technical report containing all details of the project that useful to learn and operate the system. A [template](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Project/Exit%20Report.md) is provided by TDSP that can be used as is or customized for specific client needs. 


## Summary

The [Team Data Science Process lifecycle](https://azure.microsoft.com/documentation/learning-paths/data-science-process/) is modeled as a sequence of iterated steps that provide guidance on the tasks needed to use predictive models that can be deployed in a production environment to be leveraged to build intelligent applications. The goal of this process lifecycle is to continue to move a data science project forward towards a clear engagement end point. While it is true that data science is an exercise in research and discovery, being able to clearly communicate this to customers using a well defined set of artifacts in a standardized template can help avoid misunderstanding and increase the odds of success.


## Next steps

Full end-to-end walkthroughs that demonstrate all the steps in the process for **specific scenarios** are also provided. They are listed with thumbnail descriptions in the [Team Data Science Process walkthroughs](data-science-process-walkthroughs.md) topic.
