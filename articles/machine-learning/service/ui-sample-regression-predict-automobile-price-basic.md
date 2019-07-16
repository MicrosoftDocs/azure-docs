---
title: "Regression: Predict price"
titleSuffix: Azure Machine Learning service
description: Learn how to build a machine learning model to predict an automobile's price without writing a single line of code.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: article
author: xiaoharper
ms.author: zhanxia
ms.reviewer: sgilley
ms.date: 05/10/2019
---

# Sample 1 - Regression: Predict price

Learn how to build a machine learning regression model without writing a single line of code using the visual interface.

This experiment trains a **decision forest regressor** to predict a car's price based on technical features such as make, model, horsepower, and size. Because we're trying to answer the question "How much?" this is called a regression problem. However, you can apply the same fundamental steps in this experiment to tackle any type of machine learning problem whether it be regression, classification, clustering, and so on.

The fundamental steps of a training machine learning model are:

1. Get the data
1. Pre-process the data
1. Train the model
1. Evaluate the model

Here's the final, completed graph of the experiment we'll be working on. We'll provide the rationale for all the modules so you can make similar decisions on your own.

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

Explore the other samples available for the visual interface:

- [Sample 2 - Regression: Compare algorithms for automobile price prediction](ui-sample-regression-predict-automobile-price-compare-algorithms.md)
- [Sample 3 - Classification: Predict credit risk](ui-sample-classification-predict-credit-risk-basic.md)
- [Sample 4 - Classification: Predict credit risk (cost sensitive)](ui-sample-classification-predict-credit-risk-cost-sensitive.md)
- [Sample 5 - Classification: Predict churn](ui-sample-classification-predict-churn.md)
- [Sample 6 - Classification: Predict flight delays](ui-sample-classification-predict-flight-delay.md)