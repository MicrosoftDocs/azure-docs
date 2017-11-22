---
title: Execute of data science tasks - Azure  | Microsoft Docs
description: How a data scientist can execute a data science project in a trackable, version controlled, and collaborative way.
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
ms.date: 11/22/2017
ms.author: bradsev;

---


# Execute of data science tasks

This article shows how to use utilities to complete several common data science tasks such as interactive data exploration, data analysis, reporting, and model creation.


## 1. <a name='DataQualityReportUtility-1'></a>Interactive Data Exploration, Analysis, and Reporting (IDEAR) Utility

This R markdown-based utility provides a flexible and interactive tool to evaluate and explore data sets. Users can quickly generate reports from the data set with minimal coding. Users can click buttons to export the exploration results in the interactive tool to a final report, which can be delivered to clients or used to make decisions on which variables to include in the subsequent modeling step.

At this time, the tool only works on data-frames in memory. A .yaml file is needed to specify the parameters of the data-set to be explored. For more information, see [IDEAR in TDSP Data Science Utilities](https://github.com/Azure/Azure-TDSP-Utilities/tree/master/DataScienceUtilities/DataReport-Utils).


## 2. <a name='ModelingUtility-2'></a>Baseline Modeling and Reporting Utility

This utility provides a customizable, semi-automated tool to perform model creation with hyper-parameter sweeping, to and compare the accuracy of those models. 

The model creation utility is an R markdown file that can be run to produce self-contained HTML output with a table of contents for easy navigation through its different sections. Three algorithms are executed when the markdown file is run (knit): regularized regression using the glmnet package, random forest using the randomForest package, and boosting trees using the xgboost package). Each of these algorithms produces a trained model. The accuracy of these models is then compared and the relative feature importance plots are reported. Currently, there are two utilities: one is for a binary classification task and one is for a regression task. The primary differences between them is the way control parameters and accuracy metrics are specified for these learning tasks. 

A Yaml file is used to specify:

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


 
## Next steps

[Track progress of data science projects](track-progress.md) shows how a data scientist can track the progress of a data science project.

Walkthroughs that demonstrate all the steps in the process for **specific scenarios** are also provided. They are listed and linked with thumbnail descriptions in the [Example walkthroughs](walkthroughs.md) article. They illustrate how to combine cloud, on-premises tools, and services into a workflow or pipeline to create an intelligent application. 

