---
title: "Classification: Predict churn"
titleSuffix: Azure Machine Learning service
description: This visual interface sample experiment shows binary classifier prediction of churn, a common task for customer relationship management (CRM).
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: article
author: xiaoharper
ms.author: zhanxia
ms.reviewer: sgilley
ms.date: 05/06/2019
---

# Sample 5 - Classification: Predict churn

This visual interface sample experiment shows binary classifier prediction of churn, a common task for customer relationship management (CRM).

## Prerequisites

[!INCLUDE [aml-ui-prereq](../../../includes/aml-ui-prereq.md)]

4. Select the **Open** button for the Sample 5 experiment.

    ![Open the experiment](media/sample-classification-predict-churn/open-sample5.png)

## Data

The data we use for this experiment is from KDD Cup 2009. The dataset has 50,000 rows and 230 feature columns. The task is to predict churn, appetency, and up-selling for customers who use these features. Refer to the [KDD website](https://www.kdd.org/kdd-cup/view/kdd-cup-2009) for further details about the data and the task.

## Experiment summary

Here's the complete experiment graph:

![Experiment graph](./media/sample-classification-predict-churn/experiment-graph.png)

First, we do some simple data processing.

- The raw dataset contains lots of missing values. We use the **Clean Missing Data** module to replace the missing values with 0.

    ![Clean the dataset](./media/sample-classification-predict-churn/cleaned-dataset.png)

- The features and the corresponding churn, appetency, and up-selling labels are in different datasets. We use the **Add Columns** module to append the label columns to the feature columns. The first column, **Col1**, is the label column. The rest of the columns, **Var1**, **Var2**, and so on, are the feature columns.
 
    ![Add the column dataset](./media/sample-classification-predict-churn/added-column1.png)

- We use the **Split** module split the dataset into train and test sets.


    We then use the Boosted Decision Tree binary classifier with the default parameters to build the prediction models. Build one model per task, that is, one model each to predict up-selling, appetency, and churn.

## Results

Visualize the output of the **Evaluate Model** module to see the performance of the model on the test set. For the up-selling task, the ROC curve shows that the model does better than a random model. The area under the curve (AUC) is 0.857. At threshold 0.5, the precision is 0.664, recall is 0.463, and F1 score is 0.545.

![Evaluate the results](./media/sample-classification-predict-churn/evaluate-result.png)

 You can move the **Threshold** slider and see the metrics change for the binary classification task.

## Clean up resources

[!INCLUDE [aml-ui-cleanup](../../../includes/aml-ui-cleanup.md)]

## Next steps

Explore the other samples available for the visual interface:

- [Sample 1 - Regression: Predict an automobile's price](sample-regression-predict-automobile-price-basic.md)
- [Sample 2 - Regression: Compare algorithms for automobile price prediction](sample-regression-predict-automobile-price-compare-algorithms.md)
- [Sample 3 - Classification: Predict credit risk](sample-classification-predict-credit-risk-basic.md)
- [Sample 4 - Classification: Predict credit risk (cost sensitive)](sample-classification-predict-credit-risk-cost-sensitive.md)
