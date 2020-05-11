---
title: Execute data science tasks - Team Data Science Process
description: How a data scientist can execute a data science project in a trackable, version controlled, and collaborative way.
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


# Execute data science tasks: exploration, modeling, and deployment

Typical data science tasks include data exploration, modeling, and deployment. This article shows how to use the **Interactive Data Exploration, Analysis, and Reporting (IDEAR)** and **Automated Modeling and Reporting (AMAR)** utilities to complete several common data science tasks such as interactive data exploration, data analysis, reporting, and model creation. Options for deploying a model into a production environment may include:

- [Azure Machine Learning](../index.yml)
- [SQL-Server with ML services](https://docs.microsoft.com/sql/advanced-analytics/r/r-services)
- [Microsoft Machine Learning Server](https://docs.microsoft.com/machine-learning-server/what-is-machine-learning-server)


## 1. <a name='DataQualityReportUtility-1'></a> Exploration 

A data scientist can perform exploration and reporting in a variety of ways: by using libraries and packages available for Python (matplotlib for example) or with R (ggplot or lattice for example). Data scientists can customize such code to fit the needs of data exploration for specific scenarios. The needs for dealing with structured data are different that for unstructured data such as text or images. 

Products such as Azure Machine Learning also provide [advanced data preparation](../how-to-create-register-datasets.md) for data wrangling and exploration, including feature creation. The user should decide on the tools, libraries, and packages that best suite their needs. 

The deliverable at the end of this phase is a data exploration report. The report should provide a fairly comprehensive view of the data to be used for modeling and an assessment of whether the data is suitable to proceed to the modeling step. The Team Data Science Process (TDSP) utilities discussed in the following sections for semi-automated exploration, modeling, and reporting also provide standardized data exploration and modeling reports. 

### Interactive data exploration, analysis, and reporting using the IDEAR utility

This R markdown-based or Python notebook-based utility provides a flexible and interactive tool to evaluate and explore data sets. Users can quickly generate reports from the data set with minimal coding. Users can click buttons to export the exploration results in the interactive tool to a final report, which can be delivered to clients or used to make decisions on which variables to include in the subsequent modeling step.

At this time, the tool only works on data-frames in memory. A YAML file is needed to specify the parameters of the data-set to be explored. For more information, see [IDEAR in TDSP Data Science Utilities](https://github.com/Azure/Azure-TDSP-Utilities/tree/master/DataScienceUtilities/DataReport-Utils).


## 2. <a name='ModelingUtility-2'></a> Modeling

There are numerous toolkits and packages for training models in a variety of languages. Data scientists should feel free to use which ever ones they are comfortable with, as long as performance considerations regarding accuracy and latency are satisfied for the relevant business use cases and production scenarios.

The next section shows how to use an R-based TDSP utility for semi-automated modeling. This AMAR utility can be used to generate base line models quickly as well as the parameters that need to be tuned to provide a better performing model.
The following model management section shows how to have a system for registering and managing multiple models.


### Model training: modeling and reporting using the AMAR utility

The [Automated Modeling and Reporting (AMAR) Utility](https://github.com/Azure/Azure-TDSP-Utilities/tree/master/DataScienceUtilities/Modeling) provides a customizable, semi-automated tool to perform model creation with hyper-parameter sweeping and to compare the accuracy of those models. 

The model creation utility is an R Markdown file that can be run to produce self-contained HTML output with a table of contents for easy navigation through its different sections. Three algorithms are executed when the Markdown file is run (knit): regularized regression using the glmnet package, random forest using the randomForest package, and boosting trees using the xgboost package). Each of these algorithms produces a trained model. The accuracy of these models is then compared and the relative feature importance plots are reported. Currently, there are two utilities: one is for a binary classification task and one is for a regression task. The primary differences between them is the way control parameters and accuracy metrics are specified for these learning tasks. 

A YAML file is used to specify:

- the data input (a SQL source or an R-Data file) 
- what portion of the data is used for training and what portion for testing
- which algorithms to run 
- the choice of control parameters for model optimization:
    - cross-validation 
    - bootstrapping
    - folds of cross-validation
- the hyper-parameter sets for each algorithm. 

The number of algorithms, the number of folds for optimization, the hyper-parameters, and the number of hyper-parameter sets to sweep over can also be modified in the Yaml file to run the models quickly. For example, they can be run with a lower number of CV folds, a lower number of parameter sets. If it is warranted, they can also be run more comprehensively with a higher number of CV folds or a larger number of parameter sets.

For more information, see [Automated Modeling and Reporting Utility in TDSP Data Science Utilities](https://github.com/Azure/Azure-TDSP-Utilities/tree/master/DataScienceUtilities/Modeling).

### Model management
After multiple models have been built, you usually need to have a system for registering and managing the models. Typically you need a combination of scripts or APIs and a backend database or versioning system. A few options that you can consider for these management tasks are:

1. [Azure Machine Learning - model management service](../index.yml)
2. [ModelDB from MIT](http://modeldb.csail.mit.edu:3000/projects) 
3. [SQL-server as a model management system](https://blogs.technet.microsoft.com/dataplatforminsider/2016/10/17/sql-server-as-a-machine-learning-model-management-system/)
4. [Microsoft Machine Learning Server](https://docs.microsoft.com/sql/advanced-analytics/r/r-server-standalone)

## 3. <a name='Deployment-3'></a> Deployment

Production deployment enables a model to play an active role in a business. Predictions from a deployed model can be used for business decisions.

### Production platforms
There are various approaches and platforms to put models into production. Here are a few options:


- [Model deployment in Azure Machine Learning](../how-to-deploy-and-where.md)
- [Deployment of a model in SQL-server](https://docs.microsoft.com/sql/advanced-analytics/tutorials/sqldev-py6-operationalize-the-model)
- [Microsoft Machine Learning Server](https://docs.microsoft.com/sql/advanced-analytics/r/r-server-standalone)

> [!NOTE]
> Prior to deployment, one has to insure the latency of model scoring is low enough to use in production.
>
>

Further examples are available in walkthroughs that demonstrate all the steps in the process for **specific scenarios**. They are listed and linked with thumbnail descriptions in the [Example walkthroughs](walkthroughs.md) article. They illustrate how to combine cloud, on-premises tools, and services into a workflow or pipeline to create an intelligent application.

> [!NOTE]
> For deployment using Azure Machine Learning Studio, see [Deploy an Azure Machine Learning web service](../studio/deploy-a-machine-learning-web-service.md).
>
>

### A/B testing
When multiple models are in production, it can be useful to perform [A/B testing](https://en.wikipedia.org/wiki/A/B_testing) to compare performance of the models. 

 
## Next steps

[Track progress of data science projects](track-progress.md) shows how a data scientist can track the progress of a data science project.

[Model operation and CI/CD](ci-cd-flask.md) shows how CI/CD can be performed with developed models.


