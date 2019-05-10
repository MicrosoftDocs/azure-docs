---
title: "Regression: Predict price"
titleSuffix: Azure Machine Learning service
description: Learn how to build a machine learning model that predicts an automobile's price without writing a single line of code.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: article
author: xiaoharper
ms.author: zhanxia
ms.reviewer: sgilley
ms.date: 05/10/2019
---

# Sample - Regression: Predict price

Learn how to build a machine learning model that predicts an automobile's price without writing a single line of code.

You will use the visual interface to perform the basic steps of any machine learning model development project:

1. Get the data
1. Pre-process the data
1. Train the model
1. Evaluate the model

Here's the final, completed graph of the experiment. This article provides the rationale  for every module so you can make similar decisions when creating your own models.

![Graph of the experiment](media/ui-sample-regression-predict-automobile-price-basic/overall-graph.png)

## Prerequisites

[!INCLUDE [aml-ui-prereq](../../../includes/aml-ui-prereq.md)]

4. Select the **Open** button for the Sample 1 experiment:

    ![Open the experiment](media/ui-sample-regression-predict-automobile-price-basic/open-sample1.png)

## Get the data

In this experiment, we use the **Automobile price data (Raw)** dataset, which is from the UCI Machine Learning Repository. The dataset contains 26 columns that contain information about automobiles, including make, model, price, vehicle features (like the number of cylinders), MPG, and an insurance risk score. The goal of this experiment is to predict the price of the car.

## Pre-process the data

The main data preparation tasks include data cleaning, integration, transformation, reduction, and discretization or quantization. In the visual interface, you can find modules to perform these operations and other data pre-processing tasks in the **Data Transformation** group in the left panel.

We use the **Select Columns in Dataset** module to exclude normalized-losses that have many missing values. We then use **Clean Missing Data** to remove the rows that have missing values. This helps to create a clean set of training data.

![Data pre-processing](./media/ui-sample-regression-predict-automobile-price-basic/data-processing.png)

## Train the model

Machine learning problems vary. Common machine learning tasks include classification, clustering, regression, and recommender systems, each of which might require a different algorithm. Your choice of algorithm often depends on the requirements of the use case. After you pick an algorithm, you need to tune its parameters to train a more accurate model. You then need to evaluate all models based on metrics like accuracy, intelligibility, and efficiency.

Because the goal of this experiment is to predict automobile prices, and because the label column (price) contains real numbers, a regression model is a good choice. Considering that the number of features is relatively small (less than 100) and these features aren't sparse, the decision boundary is likely to be nonlinear. So we use **Decision Forest Regression** for this experiment.

We use the **Split Data** module to randomly divide the input data so that the training dataset contains 70% of the original data and the testing dataset contains 30% of the original data.

## Test, evaluate, and compare

 We split the dataset and use different datasets to train and test the model to make the evaluation of the model more objective.

After the model is trained, we use the **Score Model** and **Evaluate Model** modules to generate predicted results and evaluate the models.

**Score Model** generates predictions for the test dataset by using the trained model. To check the result, select the output port of **Score Model** and then select **Visualize**.

![Score result](./media/ui-sample-regression-predict-automobile-price-basic/score-result.png)

We then pass the scores to the **Evaluate Model** module to generate evaluation metrics. To check the result, select the output port of the **Evaluate Model** and then select **Visualize**.

![Evaluate result](./media/ui-sample-regression-predict-automobile-price-basic/evaluate-result.png)

## Clean up resources

[!INCLUDE [aml-ui-cleanup](../../../includes/aml-ui-cleanup.md)]

## Next steps

Explore the advanced sample to learn how to build a classifier and compare potential algorithms:

- [Predict credit risk (cost sensitive)](ui-sample-classification-predict-credit-risk-cost-sensitive.md)
