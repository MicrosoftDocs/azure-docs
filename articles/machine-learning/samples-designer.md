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
ms.date: 03/10/2020
---
# Designer sample pipelines

Use the built-in examples in Azure Machine Learning designer to quickly get started building your own machine learning pipelines. The Azure Machine Learning designer [GitHub repository](https://github.com/Azure/MachineLearningDesigner) contains detailed documentation to help you understand some common  machine learning scenarios.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://aka.ms/AMLFree).
* An Azure Machine Learning workspace with the Enterprise SKU.


## How to use sample pipelines

The designer saves a copy of the sample pipelines to your studio workspace. You can edit the pipeline to adapt it to your needs and save it as your own. Use them as a starting point to jumpstart your projects.

1. Sign in to <a href="https://ml.azure.com?tabs=jre" target="_blank">ml.azure.com</a>, and select the workspace you want to work with.

1. Select **Designer**.

1. Select a sample pipeline under the **New pipeline** section.

    Select **Show more samples** for a complete list of samples.

## Regression samples

Learn more about the built-in regression samples.

| Sample title | Description | 
| --- | --- |
| [Sample 1: Regression - Automobile Price Prediction (Basic)](https://github.com/Azure/MachineLearningDesigner/blob/master/articles/samples/how-to-designer-sample-regression-automobile-price-basic.md) | Predict car prices using linear regression. |
| [Sample 2: Regression - Automobile Price Prediction (Advanced)](https://github.com/Azure/MachineLearningDesigner/blob/master/articles/samples/how-to-designer-sample-regression-automobile-price-compare-algorithms.md) | Predict car prices using decision forest and boosted decision tree regressors. Compare models to find the best algorithm.

## Classification samples

Learn more about the built-in classification samples. You can learn more about the samples without documentation links by opening the samples and viewing the module comments instead.

| Sample title | Description | 
| --- | --- |
| [Sample 3: Binary Classification with Feature Selection - Income Prediction](https://github.com/Azure/MachineLearningDesigner/blob/master/articles/samples/how-to-designer-sample-classification-predict-income.md) | Predict income as high or low, using a two-class boosted decision tree. Use Pearson correlation to select features.
| [Sample 4: Binary Classification with custom Python script - Credit Risk Prediction](https://github.com/Azure/MachineLearningDesigner/blob/master/articles/samples/how-to-designer-sample-classification-credit-risk-cost-sensitive.md) | Classify credit applications as high or low risk. Use the Execute Python Script module to weight your data.
| [Sample 5: Binary Classification - Customer Relationship Prediction](https://github.com/Azure/MachineLearningDesigner/blob/master/articles/samples/how-to-designer-sample-classification-churn.md) | Predict customer churn using two-class boosted decision trees. Use SMOTE to sample biased data.
| [Sample 7: Text Classification - Wikipedia SP 500 Dataset](https://github.com/Azure/MachineLearningDesigner/blob/master/articles/samples/how-to-designer-sample-text-classification.md) | Classify company types from Wikipedia articles with multiclass logistic regression. |
| Sample 12: Multiclass Classification - Letter Recognition | Create an ensemble of binary classifiers to classify written letters. |

## Recommender samples

Learn more about the built-in recommender samples. You can learn more about the samples without documentation links by opening the samples and viewing the module comments instead.

| Sample title | Description | 
| --- | --- |
| Sample 10: Recommendation - Movie Rating Tweets | Build a movie recommender engine from movie titles and rating. |

## Utility samples

Learn more about the samples that demonstrate machine learning utilities and features. You can learn more about the samples without documentation links by opening the samples and viewing the module comments instead.

| Sample title | Description | 
| --- | --- |
| [Sample 6: Use custom R script - Flight Delay Prediction](https://github.com/Azure/MachineLearningDesigner/blob/master/articles/samples/how-to-designer-sample-classification-flight-delay.md) |
| Sample 8: Cross Validation for Binary Classification - Adult Income Prediction | Use cross validation to build a binary classifier for adult income.
| Sample 9: Permutation Feature Importance | Use permutation feature importance to compute importance scores for the test dataset. 
| Sample 11: Tune Parameters for Binary Classification - Adult Income Prediction | Use Tune Model Hyperparameters to find optimal hyperparameters to build a binary classifier. |

## Clean up resources

[!INCLUDE [aml-ui-cleanup](../../includes/aml-ui-cleanup.md)]

## Next steps

Learn how to build and deploy machine learning models with [Tutorial: Predict automobile price with the designer](tutorial-designer-automobile-price-train-score.md)
