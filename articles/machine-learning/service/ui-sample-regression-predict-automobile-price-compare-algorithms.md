---
title: "Regression: Predict price and compare algorithms"
titleSuffix: Azure Machine Learning service
description: This article shows you how to build a complex machine learning experiment without writing a single line of code using the visual interface. Learn how to train and compare multiple regression models to predict a car's price based on technical features
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: article
author: xiaoharper
ms.author: zhanxia
ms.reviewer: sgilley
ms.date: 05/10/2019
---

# Sample 2 - Regression: Predict price and compare algorithms

Learn how to build a complex machine learning experiment without writing a single line of code using the visual interface. This sample trains and compares multiple regression models to predict a car's price based on its technical features. We'll provide the rationale for the choices made in this experiment so you can tackle your own machine learning problems.

If you're just getting started with machine learning, you can take a look at the [basic version](ui-sample-regression-predict-automobile-price-basic.md) of this experiment to see a basic regression experiment.

Here's the completed graph for this experiment:

[![Graph of the experiment](media/ui-sample-regression-predict-automobile-price-compare-algorithms/graph.png)](media/ui-sample-classification-predict-credit-risk-cost-sensitive/graph.png#lightbox)

## Prerequisites

[!INCLUDE [aml-ui-prereq](../../../includes/aml-ui-prereq.md)]

4. Select the **Open** button for the Sample 2 experiment:

    ![Open the experiment](media/ui-sample-regression-predict-automobile-price-compare-algorithms/open-sample2.png)

## Experiment summary

We use these steps to build the experiment:

1. Get the data.
1. Pre-process the data.
1. Train the model.
1. Test, evaluate, and compare the models.

## Get the data

In this experiment, we use the **Automobile price data (Raw)** dataset, which is from the UCI Machine Learning Repository. This dataset contains 26 columns that contain information about automobiles, including make, model, price, vehicle features (like the number of cylinders), MPG, and an insurance risk score. The goal of this experiment is to predict the price of a car.

## Pre-process the data

The main data preparation tasks include data cleaning, integration, transformation, reduction, and discretization or quantization. In visual interface, you can find modules to perform these operations and other data pre-processing tasks in the **Data Transformation** group in the left panel.

In this experiment, we use the **Select Columns in Dataset** module to exclude normalized-losses that have many missing values. We then use **Clean Missing Data** to remove the rows that have missing values. This helps to create a clean set of training data.

![Data pre-processing](media/ui-sample-regression-predict-automobile-price-compare-algorithms/data-processing.png)

## Train the model

Machine learning problems vary. Common machine learning tasks include classification, clustering, regression, and recommender systems, each of which might require a different algorithm. Your choice of algorithm often depends on the requirements of the use case. After you pick an algorithm, you need to tune its parameters to train a more accurate model. You then need to evaluate all models based on metrics like accuracy, intelligibility, and efficiency.

Because the goal of this experiment is to predict automobile prices, and because the label column (price) contains real numbers, a regression model is a good choice. Considering that the number of features is relatively small (less than 100) and these features aren't sparse, the decision boundary is likely to be nonlinear.

To compare the performance of different algorithms, we use two nonlinear algorithms, **Boosted Decision Tree Regression** and **Decision Forest Regression**, to build models. Both algorithms have parameters that you can change, but we use the default values for this experiment.

We use the **Split Data** module to randomly divide the input data so that the training dataset contains 70% of the original data and the testing dataset contains 30% of the original data.

## Test, evaluate, and compare the models

We use two different sets of randomly chosen data to train and then test the model, as described in the previous section. We split the dataset and use different datasets to train and test the model to make the  evaluation of the model more objective.

After the model is trained, we use the **Score Model** and **Evaluate Model** modules to generate predicted results and evaluate the models. **Score Model** generates predictions for the test dataset by using the trained model. We then pass the scores to **Evaluate Model** to generate evaluation metrics.

In this experiment, we use two instances of **Evaluate Model** to compare two pairs of models.

First, we compare two algorithms on the training dataset.
Second, we compare two algorithms on the testing dataset.
Here are the results:

![Compare the results](media/ui-sample-regression-predict-automobile-price-compare-algorithms/result.png)

These results show that the model built with **Boosted Decision Tree Regression** has a lower root mean squared error than the model built on **Decision Forest Regression**.

Both algorithms have a lower error on the training dataset than on the unseen testing dataset.

## Clean up resources

[!INCLUDE [aml-ui-cleanup](../../../includes/aml-ui-cleanup.md)]

## Next steps

Explore the other samples available for the visual interface:

- [Sample 1 - Regression: Predict an automobile's price](ui-sample-regression-predict-automobile-price-basic.md)
- [Sample 3 - Classification: Predict credit risk](ui-sample-classification-predict-credit-risk-basic.md)
- [Sample 4 - Classification: Predict credit risk (cost sensitive)](ui-sample-classification-predict-credit-risk-cost-sensitive.md)
- [Sample 5 - Classification: Predict churn](ui-sample-classification-predict-churn.md)
- [Sample 6 - Classification: Predict flight delays](ui-sample-classification-predict-flight-delay.md)
