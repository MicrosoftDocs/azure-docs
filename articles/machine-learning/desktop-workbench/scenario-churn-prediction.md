---
title: Customer Churn Prediction using Azure Machine Learning | Microsoft Docs
description: How to perform churn analytics using Azure ML Workbench.
services: machine-learning
documentationcenter: ''
author: miprasad
manager: kristin.tolle
editor: miprasad

ms.assetid: 
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/17/2017
ms.author: miprasad

ROBOTS: NOINDEX
---


# Customer churn prediction using Azure Machine Learning

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 



On average, keeping existing customers is five times cheaper than the cost of recruiting new ones. As a result, marketing executives often find themselves trying to estimate the likelihood of customer churn and finding the necessary actions to minimize the churn rate.

The aim of this solution is to demonstrate predictive churn analytics using Azure Machine Learning Workbench. This solution provides an easy to use template to develop churn predictive data pipelines for retailers. The template can be used with different datasets and different definitions of churn. The aim of the hands-on example is to:

1. Understand Azure Machine Learning Workbench's Data Preparation tools to clean and ingest customer relationship data for churn analytics.

2. Perform feature transformation to handle noisy heterogeneous data.

3. Integrate third-party libraries (such as `scikit-learn` and `azureml`) to develop Bayesian and Tree-based classifiers for predicting churn.

4. Deploy.

## Link of the gallery GitHub repository
Following is the link to the public GitHub repository where all the code is hosted:

[https://github.com/Azure/MachineLearningSamples-ChurnPrediction](https://github.com/Azure/MachineLearningSamples-ChurnPrediction)

## Use case overview
Companies need an effective strategy for managing customer churn. Customer churn includes customers stopping the use of a service, switching to a competitor service, switching to a lower-tier experience in the service or reducing engagement with the service.

In this use case, we look at data from French telecom company Orange to identify customers who are likely to churn in the near term in order to improve the service and create custom outreach campaigns that help retain customers.

Telecom companies face a competitive market. Many carriers lose revenue from postpaid customers due to churn. Hence the ability to accurately identify customer churn can be a huge competitive advantage.

Some of the factors contributing to telecom customer churn include:

* Perceived frequent service disruptions
* Poor customer service experiences in online/retail stores
* Offers from other competing carriers (better family plan, data plan, etc.).

In this solution, we will use a concrete example of building a predictive customer churn model for telecom companies.

## Prerequisites

* An [Azure account](https://azure.microsoft.com/free/) (free trials are available)

* An installed copy of [Azure Machine Learning Workbench](../service/overview-what-is-azure-ml.md) following the [quick start installation guide](quickstart-installation.md) to install the program and create a workspace

* For operationalization, it is best if you have Docker engine installed and running locally. If not, you can use the cluster option but be aware that running an Azure Container Service (ACS) can be expensive.

* This Solution assumes that you are running Azure Machine Learning Workbench on Windows 10 with Docker engine locally installed. If you are using macOS the instruction is largely the same.

## Create a new Workbench project

Create a new project using this example as a template:
1.	Open Azure Machine Learning Workbench
2.	On the **Projects** page, click the **+** sign and select **New Project**
3.	In the **Create New Project** pane, fill in the information for your new project
4.	In the **Search Project Templates** search box, type "Customer Churn Prediction" and select the template
5.	Click **Create**

## Data description

The data set used in the solution is from the SIDKDD 2009 competition. It is called `CATelcoCustomerChurnTrainingSample.csv` and is located in the [`data`](https://github.com/Azure/MachineLearningSamples-ChurnPrediction/tree/master/data) folder. The dataset consists of heterogeneous noisy data (numerical/categorical variables) from French Telecom company Orange and is anonymized.

The variables capture customer demographic information, call statistics (such as average call duration, call failure rate, etc.), contract information, complaint statistics. Churn variable is binary (0 - did not churn, 1 - did churn).

## Scenario structure

The folder structure is arranged as follows:

__data__: Contains the dataset used in the solution  

__docs__: Contains all the hands-on labs

The order of Hands-on Labs to carry out the solution is as follows:
1. Data Preparation:
The main file related to Data Preparation in the data folder is `CATelcoCustomerChurnTrainingSample.csv`
2. Modeling and Evaluation:
The main file related to modeling and evaluation in the root folder is `CATelcoCustomerChurnModeling.py`
3. Modeling and Evaluation without .dprep:
The main file for this task in the root folder is `CATelcoCustomerChurnModelingWithoutDprep.py`
4. Operationalization:
The main files for deloyment are the model (`model.pkl`) and `churn_schema_gen.py`

| Order| File Name | Realted Files |
|--|-----------|------|
| 1 | [`DataPreparation.md`](https://github.com/Azure/MachineLearningSamples-ChurnPrediction/blob/master/docs/DataPreparation.md) | 'data/CATelcoCustomerChurnTrainingSample.csv' |
| 2 | [`ModelingAndEvaluation.md`](https://github.com/Azure/MachineLearningSamples-ChurnPrediction/blob/master/docs/ModelingAndEvaluation.md) | 'CATelcoCustomerChurnModeling.py' |
| 3 | [`ModelingAndEvaluationWithoutDprep.md`](https://github.com/Azure/MachineLearningSamples-ChurnPrediction/blob/master/docs/ModelingAndEvaluationWithoutDprep.md) | 'CATelcoCustomerChurnModelingWithoutDprep.py' |
| 4 | [`Operationalization.md`](https://github.com/Azure/MachineLearningSamples-ChurnPrediction/blob/master/docs/Operationalization.md) | 'model.pkl'<br>'churn_schema_gen.py' |

Follow the Labs in the sequential manner described above.

## Conclusion
This hands on scenario demonstrated how to perform churn prediction using Azure Machine Learning Workbench. We first performed data cleaning to handle noisy and heterogeneous data, followed by feature engineering using Data Preparation tools. We then used open source machine learning tools to create and evaluate a classification model, then used local docker container to deploy the model making it ready for production.
