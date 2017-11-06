---
title: Modeling stage of Team Data Science Process Lifecycle - Azure | Microsoft Docs
description: The goals, tasks, and deliverables for the modeling stage of your data science projects.
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
# Modeling

This topic outlines the goals, tasks, and deliverables associated with the **modeling stage** of the Team Data Science Process. This process provides a recommended lifecycle that you can use to structure your data science projects. The lifecycle outlines the major stages that projects typically execute, often iteratively:

* **Business Understanding**
* **Data Acquisition and Understanding**
* **Modeling**
* **Deployment**
* **Customer Acceptance**

Here is a visual representation of the **Team Data Science Process lifecycle**. 

![TDSP-Lifecycle2](./media/lifecycle/tdsp-lifecycle2.png) 


## Goals
* Optimal data features for the machine learning model.
* An informative ML model that predicts the target most accurately.
* An ML model that is suitable for production.

## How to do it
There are three main tasks addressed in this stage:

* **Feature Engineering**: create data features from the raw data to facilitate model training.
* **Model training**: find the model that answers the question most accurately by comparing their success metrics.
* Determine if your model is **suitable for production**.

### 3.1 Feature engineering
Feature engineering involves inclusion, aggregation and transformation of raw variables to create the features used in the analysis. If you want insight into what is driving a model, then you need to understand how features are related to each other and how the machine learning algorithms are to use those features. This step requires a creative combination of domain expertise and insights obtained from the data exploration step. This is a balancing act of finding and including informative variables while avoiding too many unrelated variables. Informative variables improve our result; unrelated variables introduce unnecessary noise into the model. You also need to generate these features for any new data obtained during scoring. So the generation of these features can only depend on data that is available at the time of scoring. For technical guidance on feature engineering when using various Azure data technologies, see [Feature engineering in the Data Science Process](create-features.md). 

### 3.2 Model training
Depending on type of question that you are trying answer, there are many modeling algorithms available. For guidance on choosing the algorithms, see [How to choose algorithms for Microsoft Azure Machine Learning](../studio/algorithm-choice.md). Although this article is written for Azure Machine Learning, the guidance it provides is useful for any machine learning projects. 

The process for model training includes the following steps: 

* **Split the input data** randomly for modeling into a training data set and a test data set.
* **Build the models** using the training data set.
* **Evaluate** (training and test dataset) a series of competing machine learning algorithms along with the various associated tuning parameters (known as parameter sweep) that are geared toward answering the question of interest with the current data.
* **Determine the “best” solution** to answer the question by comparing the success metric between alternative methods.

> [!NOTE]
> **Avoid leakage**: Data leakage can be caused by the inclusion of data from outside the training dataset that allows a model or machine learning algorithm to make unrealistically good predictions. Leakage is a common reason why data scientists get nervous when they get predictive results that seem too good to be true. These dependencies can be hard to detect. To avoid leakage often requires iterating between building an analysis data set, creating a model, and evaluating the accuracy. 
> 
> 

We provide an [Automated Modeling and Reporting tool](https://github.com/Azure/Azure-TDSP-Utilities/blob/master/DataScienceUtilities/Modeling) with TDSP that is able to run through multiple algorithms and parameter sweeps to produce a baseline model. It also produces a baseline modeling report summarizing performance of each model and parameter combination including variable importance. This process is also iterative as it can drive further feature engineering. 

## Artifacts
The artifacts produced in this stage include:

* [**Feature Sets**](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/DataReport/Data%20Defintion.md#feature-sets): The features developed for the modeling are described in the **Feature Sets** section of the **Data Definition** report. It contains pointers to the code to generate the features and description on how the feature was generated.
* [**Model Report**](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Model/Model%201/Model%20Report.md): For each model that is tried, a standard, template-based report that provides details on each experiment is produced.
* **Checkpoint Decision**: Evaluate whether the model is performing well enough to deploy it to a production system. Some key questions to ask are:
  * Does the model answer the question with sufficient confidence given the test data? 
  * Should try any alternative approaches: collect additional data, do more feature engineering, or experiment with other algorithms?

## Next steps

Here are links to each step in the lifecycle of the Team Data Science Process:

* [1. Business Understanding](lifecycle-business-understanding.md)
* [2. Data Acquisition and Understanding](lifecycle-data.md)
* [3. Modeling](lifecycle-modeling.md)
* [4. Deployment](lifecycle-deployment.md)
* [5. Customer Acceptance](lifecycle-acceptance.md)

Full end-to-end walkthroughs that demonstrate all the steps in the process for **specific scenarios** are also provided. They are listed and linked with thumbnail descriptions in the [Example walkthroughs](walkthroughs.md) topic. They illustrate how to combine cloud, on-premises tools, and services into a workflow or pipeline to create an intelligent application. 

For examples executing steps in the Team Data Science Process that use Azure Machine Learning Studio, see the [With Azure ML](http://aka.ms/datascienceprocess) learning path. 