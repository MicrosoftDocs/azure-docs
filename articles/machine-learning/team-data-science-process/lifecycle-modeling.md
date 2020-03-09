---
title: Modeling stage of the Team Data Science Process lifecycle
description: The goals, tasks, and deliverables for the modeling stage of your data-science projects
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
# Modeling stage of the Team Data Science Process lifecycle

This article outlines the goals, tasks, and deliverables associated with the modeling stage of the Team Data Science Process (TDSP). This process provides a recommended lifecycle that you can use to structure your data-science projects. The lifecycle outlines the major stages that projects typically execute, often iteratively:

   1. **Business understanding**
   2. **Data acquisition and understanding**
   3. **Modeling**
   4. **Deployment**
   5. **Customer acceptance**

Here is a visual representation of the TDSP lifecycle:

![TDSP lifecycle](./media/lifecycle/tdsp-lifecycle2.png) 


## Goals
* Determine the optimal data features for the machine-learning model.
* Create an informative machine-learning model that predicts the target most accurately.
* Create a machine-learning model that's suitable for production.

## How to do it
There are three main tasks addressed in this stage:

  * **Feature engineering**: Create data features from the raw data to facilitate model training.
  * **Model training**: Find the model that answers the question most accurately by comparing their success metrics.
  * Determine if your model is **suitable for production.**

### Feature engineering
Feature engineering involves the inclusion, aggregation, and transformation of raw variables to create the features used in the analysis. If you want insight into what is driving a model, then you need to understand how the features relate to each other and how the machine-learning algorithms are to use those features. 

This step requires a creative combination of domain expertise and the insights obtained from the data exploration step. Feature engineering is a balancing act of finding and including informative variables, but at the same time trying to avoid too many unrelated variables. Informative variables improve your result; unrelated variables introduce unnecessary noise into the model. You also need to generate these features for any new data obtained during scoring. As a result, the generation of these features can only depend on data that's available at the time of scoring. 

For technical guidance on feature engineering when make use of various Azure data technologies, see [Feature engineering in the data science process](create-features.md). 

### Model training
Depending on the type of question that you're trying to answer, there are many modeling algorithms available. For guidance on choosing the algorithms, see [How to choose algorithms for Microsoft Azure Machine Learning](../studio/algorithm-choice.md). Although this article uses Azure Machine Learning, the guidance it provides is useful for any machine-learning projects. 

The process for model training includes the following steps: 

   * **Split the input data** randomly for modeling into a training data set and a test data set.
   * **Build the models** by using the training data set.
   * **Evaluate** the training and the test data set. Use a series of competing machine-learning algorithms along with the various associated tuning parameters (known as a *parameter sweep*) that are geared toward answering the question of interest with the current data.
   * **Determine the “best” solution** to answer the question by comparing the success metrics between alternative methods.

> [!NOTE]
> **Avoid leakage**: You can cause data leakage if you include data from outside the training data set that allows a model or machine-learning algorithm to make unrealistically good predictions. Leakage is a common reason why data scientists get nervous when they get predictive results that seem too good to be true. These dependencies can be hard to detect. To avoid leakage often requires iterating between building an analysis data set, creating a model, and evaluating the accuracy of the results. 
> 
> 

We provide an [automated modeling and reporting tool](https://github.com/Azure/Azure-TDSP-Utilities/blob/master/DataScienceUtilities/Modeling) with TDSP that's able to run through multiple algorithms and parameter sweeps to produce a baseline model. It also produces a baseline modeling report that summarizes the performance of each model and parameter combination including variable importance. This process is also iterative as it can drive further feature engineering. 

## Artifacts
The artifacts produced in this stage include:

   * [Feature sets](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Data_Report/Data%20Defintion.md): The features developed for the modeling are described in the **Feature sets** section of the **Data definition** report. It contains pointers to the code to generate the features and a description of how the feature was generated.
   * [Model report](https://github.com/Azure/Azure-TDSP-ProjectTemplate/blob/master/Docs/Model/Model%201/Model%20Report.md): For each model that's tried, a standard, template-based report that provides details on each experiment is produced.
   * **Checkpoint decision**: Evaluate whether the model performs sufficiently for production. Some key questions to ask are:
     * Does the model answer the question with sufficient confidence given the test data? 
     * Should you try any alternative approaches? Should you collect additional data, do more feature engineering, or experiment with other algorithms?

## Next steps

Here are links to each step in the lifecycle of the TDSP:

   1. [Business understanding](lifecycle-business-understanding.md)
   2. [Data acquisition and understanding](lifecycle-data.md)
   3. [Modeling](lifecycle-modeling.md)
   4. [Deployment](lifecycle-deployment.md)
   5. [Customer acceptance](lifecycle-acceptance.md)

We provide full end-to-end walkthroughs that demonstrate all the steps in the process for specific scenarios. The [Example walkthroughs](walkthroughs.md) article provides a list of the scenarios with links and thumbnail descriptions. The walkthroughs illustrate how to combine cloud, on-premises tools, and services into a workflow or pipeline to create an intelligent application. 

For examples of how to execute steps in TDSPs that use Azure Machine Learning Studio, see [Use the TDSP with Azure Machine Learning](https://docs.microsoft.com/azure/machine-learning/team-data-science-process/). 
