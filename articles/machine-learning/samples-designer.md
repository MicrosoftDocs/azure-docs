---
title: Example designer pipelines
titleSuffix: Azure Machine Learning
description: Use samples in Azure Machine Learning designer to jumps-start your machine learning pipelines.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: sample

author: peterclu
ms.author: peterlu
ms.date: 03/06/2020
---
# Designer sample pipelines

Use the built-in example in Azure Machine Learning designer to quickly get started building your own machine learning pipelines.

The Azure Machine Learning designer [GitHub repository](https://github.com/Azure/MachineLearningDesigner) contains the latest pipeline samples to help you get started with common machine learning scenarios. This article shows the following:

- Instructions for using designer samples
- Links to the sample pipeline documentation

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://aka.ms/AMLFree).
* An Azure Machine Learning workspace with the Enterprise SKU.


## How to use the sample pipelines

Use the sample pipelines as a starting point to quickly get started with common machine learning scenarios.

1. Sign in to <a href="https://ml.azure.com?tabs=jre" target="_blank">ml.azure.com</a>, and select the workspace you want to work with.

1. Select **Designer**.

1. Select a sample pipeline under the **New pipeline** section.

    Select **Show more samples** for a complete list of samples.

The designer saves a copy of the sample to your studio workspace. You can edit the pipeline to adapt it to your needs and save it as your own. 

## Regression samples

Learn more about the built-in regression samples.

| Sample title | Description | 
| --- | --- |
| [Sample 1: Regression - Automobile Price Prediction (Basic)]() | Predict car prices using linear regression. |
| [Sample 2: Regression - Automobile Price Prediction (Advanced)]() | Predict car prices using decision forest and boosted decision tree regressors. Compare models to find the best algorithm.

## Classification samples

Learn more about the built-in classification samples.

| Sample title | Description | 
| --- | --- |
| [Sample 3: Binary Classification with Feature Selection - Income Prediction]() | Predict income as high or low, using a two-class boosted decision tree. Use Pearson correlation to select features.
| [Sample 4: Binary Classification with custom Python script - Credit Risk Prediction]() | Classify credit applications as high or low risk. Use the Execute Python Script module to weight your data.
| [Sample 5: Binary Classification - Customer Relationship Prediction]() | Predict customer churn using two-class boosted decision trees. Use SMOTE to sample biased data.
| [Sample 7: Text Classification - Wikipedia SP 500 Dataset]() | Classify company types from Wikipedia articles with multiclass logistic regression. |
| [Sample 12: Multiclass Classification - Letter Recognition]() | Create an ensemble of binary classifiers to classify written letters. |

## Recommender samples

Learn more about the built-in recommender samples.

| Sample title | Description | 
| --- | --- |
| [Sample 10: Recommendation - Movie Rating Tweets]() | Build a movie recommender engine from movie titles and rating. |

## Utility samples

Learn more about the samples that demonstrate machine learning utilities and features.

| Sample title | Description | 
| --- | --- |
| [Sample 6: Use custom R script - Flight Delay Prediction]() |
| [Sample 8: Cross Validation for Binary Classification - Adult Income Prediction]() | Use cross validation to build a binary classifier for adult income.
| [Sample 9: Permutation Feature Importance]() | Use permutation feature importance to compute importance scores for the test dataset. 
| [Sample 11: Tune Parameters for Binary Classification - Adult Income Prediction]() | Use Tune Model Hyperparameters to find optimal hyperparameters to build a binary classifier. |

## Clean up resources

[!INCLUDE [aml-ui-cleanup](../../includes/aml-ui-cleanup.md)]

## Next steps


