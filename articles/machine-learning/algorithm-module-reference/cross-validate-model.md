---
title: "Cross Validate Model: Module reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Cross-Validate Model module in Azure Machine Learning to cross-validate parameter estimates for classification or regression models by partitioning the data.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 02/11/2020
---
# Cross Validate Model

This article describes how to use the Cross Validate Model module in Azure Machine Learning designer (preview). *Cross-validation* is a technique often used in machine learning to assess both the variability of a dataset and the reliability of any model trained through that data.  

The Cross Validate Model module takes as input a labeled dataset, together with an untrained classification or regression model. It divides the dataset into some number of subsets (*folds*), builds a model on each fold, and then returns a set of accuracy statistics for each fold. By comparing the accuracy statistics for all the folds, you can interpret the quality of the data set. You can then understand whether the model is susceptible to variations in the data.  

Cross Validate Model also returns predicted results and probabilities for the dataset, so that you can assess the reliability of the predictions.  

### How cross-validation works

1. Cross-validation randomly divides training data into folds. 

   The algorithm defaults to 10 folds if you have not previously partitioned the dataset. To divide the dataset into a different number of folds, you can use the [Partition and Sample](partition-and-sample.md) module and indicate how many folds to use.  

2.  The module sets aside the data in fold 1 to use for validation. (This is sometimes called the *holdout fold*.) The module uses the remaining folds to train a model. 

    For example, if you create five folds, the module generates five models during cross-validation. The module trains each model by using four-fifths of the data. It tests each model on the remaining one-fifth.  

3.  During testing of the model for each fold, the module evaluates multiple accuracy statistics. Which statistics the module uses depends on the type of model that you're evaluating. Different statistics are used to evaluate classification models versus regression models.  

4.  When the building and evaluation process is complete for all folds, Cross Validate Model generates a set of performance metrics and scored results for all the data. Review these metrics to see whether any single fold has high or low accuracy. 

### Advantages of cross-validation

A different and common way of evaluating a model is to divide the data into a training and test set by using [Split Data](split-data.md), and then validate the model on the training data. But cross-validation offers some advantages:  

-   Cross-validation uses more test data.

    Cross-validation measures the performance of the model with the specified parameters in a bigger data space. That is, cross-validation uses the entire training dataset for both training and evaluation, instead of a portion. In contrast, if you validate a model by using data generated from a random split, typically you evaluate the model on only 30 percent or less of the available data.  

    However, because cross-validation trains and validates the model multiple times over a larger dataset, it's much more computationally intensive. It takes much longer than validating on a random split.  

-   Cross-validation evaluates both the dataset and the model.

    Cross-validation doesn't simply measure the accuracy of a model. It also gives you some idea of how representative the dataset is and how sensitive the model might be to variations in the data.  

## How to use Cross Validate Model

Cross-validation can take a long time to run if your dataset is large.  So, you might use Cross Validate Model in the initial phase of building and testing your model. In that phase, you can evaluate the goodness of the model parameters (assuming that computation time is tolerable). You can then train and evaluate your model by using the established parameters with the [Train Model](train-model.md) and [Evaluate Model](evaluate-model.md) modules.

In this scenario, you both train and test the model by using Cross Validate Model.

1. Add the Cross Validate Model module to your pipeline. You can find it in Azure Machine Learning designer, in the **Model Scoring & Evaluation** category. 

2. Connect the output of any classification or regression model. 

    For example, if you're using **Two Class Boosted Decision Tree** for classification, configure the model with the parameters that you want. Then, drag a connector from the **Untrained model** port of the classifier to the matching port of Cross Validate Model. 

    > [!TIP] 
    > You don't have to train the model, because Cross-Validate Model automatically trains the model as part of evaluation.  
3.  On the **Dataset** port of Cross Validate Model, connect any labeled training dataset.  

4.  In the right panel of Cross Validate Model, click **Edit column**. Select the single column that contains the class label, or the predictable value. 

5. Set a value for the **Random seed** parameter if you want to repeat the results of cross-validation across successive runs on the same data.  

6. Submit the pipeline.

7. See the [Results](#results) section for a description of the reports.

## Results

After all iterations are complete, Cross Validate Model creates scores for the entire dataset. It also creates performance metrics that you can use to assess the quality of the model.

### Scored results

The first output of the module provides the source data for each row, together with some predicted values and related probabilities. 

To view the results, in the pipeline, right-click the Cross Validate Model module. Select **Visualize Scored results**.

| New column name      | Description                              |
| -------------------- | ---------------------------------------- |
| Scored Labels        | This column is added at the end of the dataset. It contains the predicted value for each row. |
| Scored Probabilities | This column is added at the end of the dataset. It indicates the estimated probability of the value in **Scored Labels**. |
| Fold Number          | Indicates the zero-based index of the fold that each row of data was assigned to during cross-validation. |

 ### Evaluation results

The second report is grouped by folds. Remember that during execution, Cross Validate Model randomly splits the training data into *n* folds (by default, 10). In each iteration over the dataset, Cross Validate Model uses one fold as a validation dataset. It uses the remaining *n-1* folds to train a model. Each of the *n* models is tested against the data in all the other folds.

In this report, the folds are listed by index value, in ascending order.  To order on any other column, you can save the results as a dataset.

To view the results, in the pipeline, right-click the Cross Validate Model module. Select **Visualize Evaluation results by fold**.


|Column name| Description|
|----|----|
|Fold number| An identifier for each fold. If you created five folds, there would be five subsets of data, numbered 0 to 4.
|Number of examples in fold|The number of rows assigned to each fold. They should be roughly equal. |


The module also includes the following metrics for each fold, depending on the type of model that you're evaluating: 

+ **Classification models**: Precision, recall, F-score, AUC, accuracy  

+ **Regression models**: Mean absolute error, root mean squared error, relative absolute error, relative squared error, and coefficient of determination


## Technical notes  

+ It's a best practice to normalize datasets before you use them for cross-validation. 

+ Cross Validate Model is much more computationally intensive and takes longer to complete than if you validated the model by using a randomly divided dataset. The reason is that Cross Validate Model trains and validates the model multiple times.

+ There's no need to split the dataset into training and testing sets when you use cross-validation to measure the accuracy of the model. 


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 

