---
title: Azure Team Data Science Process overview | Microsoft Docs
description: Provides a data science methodology to deliver predictive analytics solutions and intelligent applications.
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
ms.date: 08/17/2017
ms.author: bradsev;

---
# Team Data Science Process overview

The Team Data Science Process (TDSP) is an agile, iterative data science methodology to deliver predictive analytics solutions and intelligent applications efficiently. TDSP helps improve team collaboration and learning. It contains a distillation of the best practices and structures from Microsoft and others in the industry that facilitate the successful implementation of data science initiatives. The goal is to help companies fully realize the benefits of their analytics program.

This article provides an overview of TDSP and its main components. We provide a generic description of the process here that can be implemented with a variety of tools. A more detailed description of the project tasks and roles involved in the lifecycle of the process is provided in additional linked topics. Guidance on how to implement the TDSP using a specific set of Microsoft tools and infrastructure that we use to implement the TDSP in our teams is also provided.

## Key components of the TDSP

TDSP comprises of the following key components:

- A **data science lifecycle** definition
- A **standardized project structure**
- **Infrastructure and resources** for data science projects
- **Tools and utilities** for project execution


## Data science lifecycle

The Team Data Science Process (TDSP) provides a lifecycle to structure the development of your data science projects. The lifecycle outlines the steps, from start to finish, that projects usually follow when they are executed.

If you are using another data science lifecycle, such as [CRISP-DM](https://wikipedia.org/wiki/Cross_Industry_Standard_Process_for_Data_Mining), [KDD](https://wikipedia.org/wiki/Data_mining#Process) or your organization's own custom process, you can still use the task-based TDSP in the context of those development lifecycles. At a high level, these different methodologies have much in common. 

This lifecycle has been designed for data science projects that ship as part of intelligent applications. These applications deploy machine learning or artificial intelligence models for predictive analytics. Exploratory data science projects or ad hoc analytics projects can also benefit from using this process. But in such cases some of the steps described may not be needed.    

The TDSP lifecycle is composed of five major stages that are executed iteratively:

<<<<<<< HEAD:articles/machine-learning/team-data-science-process/process-overview.md
### Goals
* A clean, high-quality dataset whose relations to the target variables are understood that are located in the appropriate analytics environment, ready to model.
* A solution architecture of the data pipeline to refresh and score data regularly has been developed.

### How to do it
There are three main tasks addressed in this stage:

* **Ingest the data** into the target analytic environment.
* **Explore the data** to determine if the data quality is adequate to answer the question. 
* **Set up a data pipeline** to score new or regularly refreshed data.

#### 2.1 Ingest the data
Set up the process to move the data from source locations to the target locations where analytics operations like training and predictions are to be executed. For technical details and options on how to do this with various Azure data services, see [Load data into storage environments for analytics](data-science-ingest-data.md). 

#### 2.2 Explore the data
Before you train your models, you need to develop a sound understanding of the data. Real-world datasets are often noisy or are missing values or have a host of other discrepancies. Data summarization and visualization can be used to audit the quality of your data and provide the information needed to process the data before it is ready for modeling. This process is often iterative.

TDSP provides an automated utility called [IDEAR](https://github.com/Azure/Azure-TDSP-Utilities/blob/master/DataScienceUtilities/DataReport-Utils) to help visualize the data and prepare data summary reports. We recommend starting with IDEAR first to explore the data to help develop initial data understanding interactively with no coding and then write custom code for data exploration and visualization. For guidance on cleaning the data, see [Tasks to prepare data for enhanced machine learning](data-science-prepare-data.md).  

Once you are satisfied with the quality of the cleansed data, the next step is to better understand the patterns that are inherent in the data that help you choose and develop an appropriate predictive model for your target. Look for evidence for how well connected the data is to the target and whether there is sufficient data to move forward with the next modeling steps. Again, this process is often iterative. You may need to find new data sources with more accurate or more relevant data to augment the dataset initially identified in the previous stage.  

#### 2.3 Set up a data pipeline
In addition to the initial ingestion and cleaning of the data, you typically need to set up a process to score new data or refresh the data regularly as part of an ongoing learning process. This can be done by setting up a data pipeline or workflow. Here is an [example](data-science-move-sql-azure-adf.md) of how to set up a pipeline with [Azure Data Factory](https://azure.microsoft.com/services/data-factory/). 

A solution architecture of the data pipeline is developed in this stage. The pipeline is also developed in parallel with the following stages of the data science project. The pipeline may be batch-based or streaming/real-time or a hybrid depending on your business needs and the constraints of your existing systems into which this solution is being integrated. 

### Artifacts
The following are the deliverables in this stage.

* [**Data Quality Report**](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/DataReport/DataSummaryReport.md): This report contains data summaries, relationships between each attribute and target, variable ranking etc. The [IDEAR](https://github.com/Azure/Azure-TDSP-Utilities/blob/master/DataScienceUtilities/DataReport-Utils) tool provided as part of TDSP can quickly generate this report on any tabular dataset such as a CSV file or a relational table. 
* **Solution Architecture**: This can be a diagram or description of your data pipeline used to run scoring or predictions on new data once you have built a model. It also contains the pipeline to retrain your model based on new data. The document is stored in the [Project](https://github.com/Azure/Azure-TDSP-ProjectTemplate/tree/master/Docs/Project) directory when using the TDSP directory structure template.
* **Checkpoint Decision**: Before you begin full feature engineering and model building, you can reevaluate the project to determine whether the value expected is sufficient to continue pursing it. You may, for example, be ready to proceed, need to collect more data, or abandon the project as the data does not exist to answer the question.


## 3. Modeling

### Goals
* Optimal data features for the machine learning model.
* An informative ML model that predicts the target most accurately.
* An ML model that is suitable for production.

### How to do it
There are three main tasks addressed in this stage:
=======
* **Business Understanding**
* **Data Acquisition and Understanding**
* **Modeling**
* **Deployment**
* **Customer Acceptance**
>>>>>>> 8872f10c9756b18e8c7687601aafb164f4453ca7:articles/machine-learning/data-science-process-overview.md

Here is a visual representation of the **Team Data Science Process lifecycle**. 

<<<<<<< HEAD:articles/machine-learning/team-data-science-process/process-overview.md
#### 3.1 Feature Engineering
Feature engineering involves inclusion, aggregation and transformation of raw variables to create the features used in the analysis. If you want insight into what is driving a model, then you need to understand how features are related to each other and how the machine learning algorithms are to use those features. This step requires a creative combination of domain expertise and insights obtained from the data exploration step. This is a balancing act of finding and including informative variables while avoiding too many unrelated variables. Informative variables improve our result; unrelated variables introduce unnecessary noise into the model. You also need to generate these features for any new data obtained during scoring. So the generation of these features can only depend on data that is available at the time of scoring. For technical guidance on feature engineering when using various Azure data technologies, see [Feature engineering in the Data Science Process](data-science-create-features.md). 

#### 3.2 Model Training
Depending on type of question you are trying answer, there are many modeling algorithms available. For guidance on choosing the algorithms, see [How to choose algorithms for Microsoft Azure Machine Learning](algorithm-choice.md). Although this article is written for Azure Machine Learning, the guidance it provides is useful for any machine learning projects. 
=======
![TDSP-Lifecycle](./media/process-overview/tdsp-lifecycle.png) 

The goals, tasks, and documentation artifacts for each stage of the lifecycle in TDSP are described in the [Team Data Science Process lifecycle](data-science-process-lifecycle.md) topic. These tasks and artifacts are associated with project roles:
>>>>>>> 8872f10c9756b18e8c7687601aafb164f4453ca7:articles/machine-learning/data-science-process-overview.md

- Solution architect
- Project manager
- Data scientist
- Project lead 

The following diagram provides a grid view of the tasks (in blue) and artifacts (in green) associated with each stage of the lifecycle (on the horizontal axis) for these roles (on the vertical axis). 

![TDSP-roles-and-tasks](./media/process-overview/tdsp-tasks-by-roles.png)

## Standardized project structure

Having all projects share a directory structure and use templates for project documents makes it easy for the team members to find information about their projects. All code and documents are stored in a version control system (VCS) like Git, TFS, or Subversion to enable team collaboration. Tracking tasks and features in an agile project tracking system like Jira, Rally, Visual Studio Team Services allows closer tracking of the code for individual features. Such tracking also enables teams to obtain better cost estimates. TDSP recommends creating a separate repository for each project on the VCS for versioning, information security, and collaboration. The standardized structure for all projects helps build institutional knowledge across the organization.

We provide templates for the folder structure and required documents in standard locations. This folder structure organizes the files that contain code for data exploration and feature extraction, and that record model iterations. These templates make it easier for team members to understand work done by others and to add new members to teams. It is easy to view and update document templates in markdown format. Use templates to provide checklists with key questions for each project to insure that the problem is well-defined and that deliverables meet the quality expected. Examples include:

- a project charter to document the business problem and scope of the project
- data reports to document the structure and statistics of the raw data
- model reports to document the derived features
- model performance metrics such as ROC curves or MSE


![TDSP-directories](./media/process-overview/tdsp-dir-structure.png)

The directory structure can be cloned from [Github](https://github.com/Azure/Azure-TDSP-ProjectTemplate).

## Infrastructure and resources for data science projects

<<<<<<< HEAD:articles/machine-learning/team-data-science-process/process-overview.md
#### 4.1 Operationalize a model
Once you have a set of models that perform well, they can be operationalized for other applications to consume. Depending on the business requirements, predictions are made either in real-time or on a batch basis. To be operationalized, the models have to be exposed with an open API interface that is easily consumed from various applications such as online websites, spreadsheets, dashboards, or line of business and backend applications. For examples of model operationalization with an Azure Machine Learning web service, see [Deploy an Azure Machine Learning web service](publish-a-machine-learning-web-service.md). It is also a best practice to build telemetry and monitoring into the production model and the data pipeline deployed to help with subsequent system status reporting and troubleshooting.  
=======
TDSP provides recommendations for managing shared analytics and storage infrastructure such as:
>>>>>>> 8872f10c9756b18e8c7687601aafb164f4453ca7:articles/machine-learning/data-science-process-overview.md

- cloud file systems for storing datasets, 
- databases
- big data (Hadoop or Spark) clusters 
- machine learning services. 

The analytics and storage infrastructure can be in the cloud or on-premises. This is where raw and processed datasets are stored. This infrastructure enables reproducible analysis. It also avoids duplication, which can lead to inconsistencies and unnecessary infrastructure costs. Tools are provided to provision the shared resources, track them, and allow each team member to connect to those resources securely. It is also a good practice have project members create a consistent compute environment. Different team members can then replicate and validate experiments.

Here is an example of a team working on multiple projects and sharing various cloud analytics infrastructure components.

![TDSP-infrastructure](./media/process-overview/tdsp-analytics-infra.png)


## Tools and utilities for project execution

Introducing processes in most organizations is challenging. Tools provided to implement the data science process and lifecycle help lower the barriers to and increase the consistency of their adoption. TDSP provides an initial set of tools and scripts to jump-start adoption of TDSP within a team. It also helps automate some of the common tasks in the data science lifecycle such as data exploration and baseline modeling. There is a well-defined structure provided for individuals to contribute shared tools and utilities into their team’s shared code repository. These resources can then be leveraged by other projects within the team or the organization. TDSP also plans to enable the contributions of tools and utilities to the whole community. The TDSP utilities can be cloned from [Github](https://github.com/Azure/Azure-TDSP-Utilities).


## Next steps

[Team Data Science Process: Roles and tasks](https://github.com/Azure/Microsoft-TDSP/blob/master/Docs/roles-tasks.md) Outlines the key personnel roles and their associated tasks for a data science team that standardizes on this process. 
