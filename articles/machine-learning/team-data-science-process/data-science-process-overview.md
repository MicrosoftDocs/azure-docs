---
title: Team Data Science Process Lifecycle | Microsoft Docs
description: Lifecycle steps and components to structure your data science projects.
services: machine-learning
documentationcenter: ''
author: bradsev
manager: jhubbard
editor: cgronlun

ms.assetid: b1f677bb-eef5-4acb-9b3b-8a5819fb0e78
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/08/2017
ms.author: bradsev;hangzh;gokuma

---
# Team Data Science Process lifecycle
The Team Data Science Process (TDSP) provides a recommended lifecycle that you can use to structure the development of your data science projects. The lifecycle outlines the steps, from start to finish, that projects usually follow when they are executed. If you are using another data science lifecycle, such as [CRISP-DM](https://wikipedia.org/wiki/Cross_Industry_Standard_Process_for_Data_Mining), [KDD](https://wikipedia.org/wiki/Data_mining#Process) or your organization's own custom process, you can still use the task-based TDSP in the context of those development lifecycles. 

This lifecycle has been designed for data science projects that are intended to ship as part of intelligent applications. These applications deploy machine learning or artificial intelligence models for predictive analytics. Exploratory data science projects and ad hoc or on-off analytics projects can also benefit from using this process, but in such cases some steps described may not be needed.    

Here is a visual representation of the **Team Data Science Process lifecycle**. 

![TDSP-Lifecycle](./media/data-science-process-overview/tdsp-lifecycle.png) 

The TDSP lifecycle is composed of five major stages that are executed iteratively. These include:

* **Business Understanding**
* **Data Acquisition and Understanding**
* **Modeling**
* **Deployment**
* **Customer Acceptance**

For each stage, we provide the following information:

* **Goals**: the specific objectives itemized.
* **How to do it**: the specific tasks outlined and guidance provided on completing them.
* **Artifacts**: the deliverables and the support for producing them.

## 1. Business Understanding
### Goals
* The **key variables** are specified that are to serve as the **model targets** and whose related metrics are used determine the success for the project.
* The relevant **data sources** are identified that the business has access to and or from other sources when needed.

### How to do it
There are two main tasks addressed in this stage: 

* **Define Objectives**: Work with your customer and other stakeholders to understand and identify the business problems. Formulate questions that define the business goals and that data science techniques can target.
* **Identify data sources**: Find the relevant data that helps you answer the questions that define the objectives of the project.

#### 1.1 Define Objectives
1. A central objective of this step is to identify the key **business variables** that the analysis needs to predict. These variables are referred to as the **model targets** and the metrics associated with them are used to determine the success of the project. Sales forecast or the probability of an order being fraudulent are examples of such targets.
2. Define the **project goals** by asking and refining "sharp" questions that are relevant and specific and unambiguous. Data science is the process of using names and numbers to answer such questions. "*When choosing your question, imagine that you are approaching an oracle that can tell you anything in the universe, as long as the answer is a number or a name*". For additional guidance, see the **Ask a Sharp Question** section of the [How to do Data Science](https://blogs.technet.microsoft.com/machinelearning/2016/03/28/how-to-do-data-science/) blog.   Data science / machine learning is typically used to answer five types of questions:
   * How much or how many? (regression)
   * Which category? (classification)
   * Which group? (clustering)
   * Is this weird? (anomaly detection)
   * Which option should be taken? (recommendation)
3. Define the **project team** by specifying the roles and responsibilities of its members. Develop a high-level milestone plan that you iterate on as more information is discovered.  
4. **Define success metrics**. For example: Achieve customer churn prediction accuracy of X% by the end of this 3-month project, so that we can offer promotions to reduce churn. The metrics must be **SMART**: 
   * **S**pecific 
   * **M**easurable
   * **A**chievable 
   * **R**elevant 
   * **T**ime-bound 

#### 1.2 Identify Data Sources
Identify data sources that contain known examples of answers to your sharp questions. Look for the following data:

* Data that is **Relevant** to the question. Do we have measures of the target and features that are related to the target?
* Data that is an **Accurate measure** of our model target and the features of interest.

It is not uncommon, for example, to find that existing systems need to collect and log additional kinds of data to address the problem and achieve the project goals. In this case, you may want to look for external data sources or update your systems to collect newer data.

### Artifacts
Here are the deliverables in this stage:

* [**Charter Document**](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Project/Charter.md): A standard template is provided in the TDSP project structure definition. This is a living document that is updated throughout the project as new discoveries are made and as business requirements change. The key is to iterate upon this document, adding more detail, as you progress through the discovery process. Keep the customer and other stakeholders involved in making the changes and clearly communicate the reasons for the changes to them.  
* [**Data Sources**](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/DataReport/Data%20Defintion.md#raw-data-sources): This is part of the Data Report that is found in the TDSP project structure. It describes the sources for the raw data. In later stages, you fill in additional details like scripts to move the data to your analytic environment.  
* [**Data**](https://github.com/Azure/Azure-TDSP-ProjectTemplate/tree/master/Docs/DataDictionaries): This document provides the descriptions and the schema (data types, information on validation rules, if any) for the data that is used to answer the question. The entity-relation diagrams or descriptions are included too, if available.

## 2. Data Acquisition and Understanding
### Goals
* A clean, high-quality dataset whose relations to the target variables are understood that are located in the analytics environment, ready to model.
* A solution architecture of the data pipeline to refresh and score data regularly has been developed.

### How to do it
There are three main tasks addressed in this stage:

* **Ingest the data** into the target analytic environment.
* **Explore the data** to determine if the data quality is adequate to answer the question. 
* **Set up a data pipeline** to score new or regularly refreshed data.

#### 2.1 Ingest the data
Set up the process to move the data from source locations to the target locations where analytics operations like training and predictions are to be executed. For technical details and options on how to do this with various Azure data services, see [Load data into storage environments for analytics](machine-learning-data-science-ingest-data.md). 

#### 2.2 Explore the data
Before you train your models, you need to develop a sound understanding of the data. Real-world datasets are often noisy or are missing values or have a host of other discrepancies. Data summarization and visualization can be used to audit the quality of your data and provide the information needed to process the data before it is ready for modeling. For guidance on cleaning the data, see [Tasks to prepare data for enhanced machine learning](machine-learning-data-science-prepare-data.md). This process is often iterative. 

TDSP provides an automated utility called [IDEAR](https://github.com/Azure/Azure-TDSP-Utilities/blob/master/DataScienceUtilities/DataReport-Utils) to help visualize the data and prepare data summary reports. We recommend starting with IDEAR first to explore the data to help develop initial data understanding interactively with no coding and then write custom code for data exploration and visualization. 

Once you are satisfied with the quality of the cleansed data, the next step is to better understand the patterns that are inherent in the data that help you choose and develop an appropriate predictive model for your target. Look for evidence for how well connected the data is to the target and whether there is sufficient data to move forward with the next modeling steps. Again, this process is often iterative. You may need to find new data sources with more accurate or more relevant data to augment the dataset initially identified in the previous stage.  

#### 2.3 Set up a data pipeline
In addition to the initial ingestion and cleaning of the data, you typically need to set up a process to score new data or refresh the data regularly as part of an ongoing learning process. This can be done by setting up a data pipeline or workflow. Here is an [example](machine-learning-data-science-move-sql-azure-adf.md) of how to set up a pipeline with [Azure Data Factory](https://azure.microsoft.com/services/data-factory/). A solution architecture of the data pipeline is developed in this stage. The pipeline is also developed in parallel with the following stages of the data science project. The pipeline may be batch-based or a streaming/real-time or a hybrid depending on your business needs and the constraints of your existing systems into which this solution is being integrated. 

### Artifacts
The following are the deliverables in this stage.

* [**Data Quality Report**](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/DataReport/DataSummaryReport.md): This report contains data summaries, relationships between each attribute and target, variable ranking etc. The [IDEAR](https://github.com/Azure/Azure-TDSP-Utilities/blob/master/DataScienceUtilities/DataReport-Utils) tool provided as part of TDSP can quickly generate this report on any tabular dataset such as a CSV file or a relational table. 
* **Solution Architecture**: This can be a diagram or description of your data pipeline used to run scoring or predictions on new data once you have built a model. It also contains the pipeline to retrain your model based on new data. The document is stored in this [directory](https://github.com/Azure/Azure-TDSP-ProjectTemplate/tree/master/Docs/Project) when using the TDSP directory structure template.
* **Checkpoint Decision**: Before you begin full feature engineering and model building, you can reevaluate the project to determine whether there is sufficient value expected to continue pursing it. You may, for example, be ready to proceed, need to collect more data, or abandon the project as the data does not exist to answer the question.

## 3. Modeling
### Goals
* Optimal data features for the machine learning model.
* An informative ML model that predicts the target most accurately.
* An ML model that is suitable for production.

### How to do it
There are three main tasks addressed in this stage:

* **Feature Engineering**: create data features from the raw data to facilitate model training.
* **Model training**: find the model that answers the question most accurately by comparing their success metrics.
* Determine if your model is **suitable for production**.

#### 3.1 Feature Engineering
Feature engineering involves inclusion, aggregation and transformation of raw variables to create the features used in the analysis. If you want insight into what is driving a model, then you need to understand how features are related to each other and how the machine learning algorithms are to use those features. This step requires a creative combination of domain expertise and insights obtained from the data exploration step. This is a balancing act of finding and including informative variables while avoiding too many unrelated variables. Informative variables improve our result; unrelated variables introduce unnecessary noise into the model. You also need to generate these features for any new data obtained during scoring. So the generation of these features can only depend on data that is available at the time of scoring. For technical guidance on feature engineering when using various Azure data technologies, see [Feature engineering in the Data Science Process](machine-learning-data-science-create-features.md). 

#### 3.2 Model Training
Depending on type of question you are trying answer, there are many modeling algorithms available. For guidance on choosing the algorithms, see [How to choose algorithms for Microsoft Azure Machine Learning](machine-learning-algorithm-choice.md). Although this article is written for Azure Machine Learning, the guidance it provides is useful for other ML frameworks. 

The process for model training includes the following steps: 

* Split the input data randomly for modeling into a training data set and a test data set.
* Build the models using the training data set.
* Evaluate (training and test dataset) a series of competing machine learning algorithms along with the various associated tuning parameters (known as parameter sweep) that are geared toward answering the question of interest with the current data.
* Determine the “best” solution to answer the question by comparing the success metric between alternative methods.

> [!NOTE]
> **Avoid leakage**: Data Leakage can be caused by the inclusion of data from outside the training dataset that allows a model or machine learning algorithm to make unrealistically good predictions. Leakage is a common reason why data scientists get nervous when they get predictive results that seem too good to be true. These dependencies can be hard to detect. To avoid this often requires iterating between building an analysis data set, creating a model, and evaluating the accuracy. 
> 
> 

We provide an [Automated Modeling and Reporting tool](https://github.com/Azure/Azure-TDSP-Utilities/blob/master/DataScienceUtilities/Modeling) with TDSP that is able to run through multiple algorithms and parameter sweeps to produce a baseline model. It also produces a baseline modeling report summarizing performance of each model and parameter combination including variable importance. This process is also iterative as it can drive further feature engineering. 

### Artifacts
The artifacts produced in this stage include:

* [**Feature Sets**](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/DataReport/Data%20Defintion.md#feature-sets): The features developed for the modeling are described in the Feature Set section of the Data Definition report. It contains pointers to the code to generate the features and description on how the feature was generated.
* [**Modeling Report**](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Model/Model%201/Model%20Report.md): For each model that is tried, a standard report following a specified TDSP template is produced.
* **Checkpoint Decision**: Evaluate whether the model is performing well enough to deploy it to a production system. Some key questions to ask are:
  * Does the model answer the question with sufficient confidence given the test data? 
  * Should try any alternative approaches: collect additional data, do more feature engineering, or experiment with other algorithms?

## 4. Deployment
### Goal
* Models and pipeline are deployed to a production or production-like environment for final user acceptance. 

### How to do it
The main task addressed in this stage:

* **Operationalize the model**: Deploy the model and pipeline to a production or production-like environment for application consumption.

#### 4.1 Operationalize a model
Once you have a set of models that perform well, they can be operationalized for other applications to consume. Depending on the business requirements, predictions are made either in real-time or on a batch basis. To be operationalized, the models have to be exposed with an open API interface that is easily consumed from various applications such online website, spreadsheets, dashboards, or line of business and backend applications. For examples of model operationalization with an Azure Machine Learning web service, see [Deploy an Azure Machine Learning web service](machine-learning-publish-a-machine-learning-web-service.md). It is also a good idea to build telemetry and monitoring into the production model and the data pipeline deployed to help with system status reporting and troubleshooting.  

### Artifacts
* Status dashboard of system health and key metrics.
* Final modeling report with deployment details.
* Final solution architecture document.

## 5. Customer Acceptance
### Goal
* **Finalize the project deliverables**: confirm that the pipeline, the model, and their deployment in a production environment are satisfying customer objectives.

### How to do it
There are three main tasks addressed in this stage:

* **System validation**: confirm the deployed model and pipeline are meeting customer needs.
* **Project hand-off**: to the entity that will run the system in production.

The customer would validate that the system meets their business needs and the answers the questions with acceptable accuracy to deploy the system to production for use by their client application. All the documentation is finalized and reviewed. A hand-off of the project to the entity responsible for operations is completed. This could be, for example, an IT or customer data science team or an agent of the customer that is responsible for running the system in production. 

### Artifacts
The main artifact produced in this final stage is the [**Project Final Report**](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Project/Exit%20Report.md). This is the project technical report containing all details of the project that useful to learn and operate the system. A [template](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Project/Exit%20Report.md) is provided by TDSP that can be used as is or customized for specific client needs. 

## Summary
The [Team Data Science Process lifecycle](http://aka.ms/datascienceprocess) is modeled as a sequence of iterated steps that provide guidance on the tasks needed to use predictive models. These models can be deployed in a production environment to be leveraged to build intelligent applications. The goal of this process lifecycle is to continue to move a data science project forward towards a clear engagement end point. While it is true that data science is an exercise in research and discovery, being able to clearly communicate this to your team and your customers using a well defined set of artifacts that employees standardized templates can help avoid misunderstanding and increase the chance of a successful completion of a complex data science project.

## Next steps
Full end-to-end walkthroughs that demonstrate all the steps in the process for **specific scenarios** are also provided. They are listed and linked with thumbnail descriptions in the [Team Data Science Process walkthroughs](data-science-process-walkthroughs.md) topic.

