---
title:  "Evaluate Model: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Evaluate Model module in Azure Machine Learning service to measure the accuracy of a trained model.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 05/06/2019
ROBOTS: NOINDEX
---
# Evaluate Model module

This article describes a module of the visual interface (preview) for Azure Machine Learning service.

Use this module to measure the accuracy of a trained model. You provide a dataset containing scores generated from a model, and the **Evaluate Model** module computes a set of industry-standard evaluation metrics.
  
 The metrics returned by **Evaluate Model** depend on the type of model that you are evaluating:  
  
-   **Classification Models**    
-   **Regression Models**    



> [!TIP]
> If you are new to model evaluation, we recommend the video series by Dr. Stephen Elston, as part of the [machine learning course](https://blogs.technet.microsoft.com/machinelearning/2015/09/08/new-edx-course-data-science-machine-learning-essentials/) from EdX. 


There are three ways to use the **Evaluate Model** module:

+ Generate scores over your training data, and evaluate the model based on these scores
+ Generate scores on the model, but compare those scores to scores on a reserved testing set
+ Compare scores for two different but related models, using the same set of data

## Use the training data

To evaluate a model, you must connect a dataset that contains a set of input columns and scores.  If no other data is available, you can use your original dataset.

1. Connect the **Scored dataset** output of the [Score Model](./score-model.md) to the input of **Evaluate Model**. 
2. Click **Evaluate Model** module, and run the experiment to generate the evaluation scores.

## Use testing data

A common scenario in machine learning is to separate your original data set into training and testing datasets, using the [Split](./split-data.md) module, or the [Partition and Sample](./partition-and-sample.md) module. 

1. Connect the **Scored dataset** output of the [Score Model](score-model.md) to the input of **Evaluate Model**. 
2. Connect the output of the Split Data module that contains the testing data to the right-hand input of **Evaluate Model**.
2. Click **Evaluate Model** module, and select **Run selected** to generate the evaluation scores.

## Compare scores from two models

You can also connect a second set of scores to **Evaluate Model**.  The scores might be a shared evaluation set that has known results, or a set of results from a different model for the same data.

This feature is useful because you can easily compare results from two different models on the same data. Or, you might compare scores from two different runs over the same data with different parameters.

1. Connect the **Scored dataset** output of the [Score Model](score-model.md) to the input of **Evaluate Model**. 
2. Connect the output of the Score Model module for the second model to the right-hand input of **Evaluate Model**.
3. Right-click **Evaluate Model**, and select **Run selected** to generate the evaluation scores.

## Results

After you run **Evaluate Model**, right-click the module and select **Evaluation results** to see the results. You can:

+ Save the results as a dataset, for easier analysis with other tools
+ Generate a visualization in the interface

If you connect datasets to both inputs of **Evaluate Model**, the results will contain metrics for both set of data, or both models.
The model or data attached to the left port is presented first in the report, followed by the metrics for the dataset, or model attached on the right port.  

For example, the following image represents a comparison of results from two clustering models that were built on the same data, but with different parameters.  

![AML&#95;Comparing2Models](media/module/aml-comparing2models.png "AML_Comparing2Models")  

Because this is a clustering model, the evaluation results are different than if you compared scores from two regression models, or compared two classification models. However, the overall presentation is the same. 

## Metrics

This section describes the metrics returned for the specific types of models supported for use with **Evaluate Model**:

+ [classification models](#bkmk_classification)
+ [regression models](#bkmk_regression)

###  <a name="bkmk_classification"></a> Metrics for classification models

The following metrics are reported when evaluating classification models. If you compare models, they are ranked by the metric you select for evaluation.  
  
-   **Accuracy** measures the goodness of a classification model as the proportion of true results to total cases.  
  
-   **Precision** is the proportion of true results over all positive results.  
  
-   **Recall** is the fraction of all correct results returned by the model.  
  
-   **F-score** is computed as the weighted average of precision and recall between 0 and 1, where the ideal F-score value is 1.  
  
-   **AUC** measures the area under the curve plotted with true positives on the y axis and false positives on the x axis. This metric is useful because it provides a single number that lets you compare models of different types.  
  
- **Average log loss** is a single score used to express the penalty for wrong results. It is calculated as the difference between two probability distributions – the true one, and the one in the model.  
  
- **Training log loss** is a single score that represents the advantage of the classifier over a random prediction. The log loss measures the uncertainty of your model by comparing the probabilities it outputs to the known values (ground truth) in the labels. You want to minimize log loss for the model as a whole.

##  <a name="bkmk_regression"></a> Metrics for regression models
 
The metrics returned for regression models are generally designed to estimate the amount of error.  A model is considered to fit the data well if the difference between observed and predicted values is small. However, looking at the pattern of the residuals (the difference between any one predicted point and its corresponding actual value) can tell you a lot about potential bias in the model.  
  
 The following metrics are reported for evaluating regression models. When you compare models, they are ranked by the metric you select for evaluation.  
  
- **Mean absolute error (MAE)** measures how close the predictions are to the actual outcomes; thus, a lower score is better.  
  
- **Root mean squared error (RMSE)** creates a single value that summarizes the error in the model. By squaring the difference, the metric disregards the difference between over-prediction and under-prediction.  
  
- **Relative absolute error (RAE)** is the relative absolute difference between expected and actual values; relative because the mean difference is divided by the arithmetic mean.  
  
- **Relative squared error (RSE)** similarly normalizes the total squared error of the predicted values by dividing by the total squared error of the actual values.  
  
- **Mean Zero One Error (MZOE)** indicates whether the prediction was correct or not.  In other words: `ZeroOneLoss(x,y) = 1` when `x!=y`; otherwise `0`.
  
- **Coefficient of determination**, often referred to as R<sup>2</sup>, represents the predictive power of the model as a value between 0 and 1. Zero means the model is random (explains nothing); 1 means there is a perfect fit. However, caution should be used in interpreting  R<sup>2</sup> values, as low values can be entirely normal and high values can be suspect.
  

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 