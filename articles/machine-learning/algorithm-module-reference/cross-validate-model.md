---
title: "Cross Validate Model: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Cross-Validate Model module in Azure Machine Learning service to cross-validates parameter estimates for classification or regression models by partitioning the data.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/10/2019
---
# Cross Validate Model

This article describes how to use the **Cross Validate Model** module in Azure Machine Learning designer (preview). *Cross-validation* is an important technique often used in machine learning to assess both the variability of a dataset and the reliability of any model trained using that data.  

The **Cross Validate Model** module takes as input a labeled dataset, together with an untrained classification or regression model. It divides the dataset into some number of subsets (*folds*), builds a model on each fold, and then returns a set of accuracy statistics for each fold. By comparing the accuracy statistics for all the folds, you can interpret the quality of the data set and understand whether the model is susceptible to variations in the data.  

Cross-validate also returns predicted results and probabilities for the dataset, so that you can assess the reliability of the predictions.  

### How cross validation works

1. Cross validation randomly divides the training data into a number of partitions, also called *folds*. 

    + The algorithm defaults to 10 folds if you have not previously partitioned the dataset. 
    + To divide the dataset into a different number of folds, you can use the [Partition and Sample](partition-and-sample.md) module and indicate how many folds to use.  

2.  The module sets aside the data in fold 1 to use for validation (this is sometimes called the *holdout fold*), and uses the remaining folds to train a model. 

    For example, if you create five folds, the module would generate five models during cross-validation, each model trained using 4/5 of the data, and tested on the remaining 1/5.  

3.  During testing of the model for each fold, multiple accuracy statistics are evaluated. Which statistics are used depends on the type of model that you are evaluating. Different statistics are used to evaluate classification models vs. regression models.  

4.  When the building and evaluation process is complete for all folds, **Cross Validate Model** generates a set of performance metrics and scored results for all the data. You should review these metrics to see whether any single fold has particularly high or low accuracy 

### Advantages of cross validation

A different, and common way of evaluating a model is to divide the data into a training and test set using [Split Data](split-data.md), and then validate the model on the training data. However, cross-validation offers some advantages:  

-   Cross-validation uses more test data.

     Cross-validation measures the performance of the model with the specified parameters in a bigger data space. That is, cross-validation uses the entire training dataset for both training and evaluation, instead of some portion. In contrast, if you validate a model by using data generated from a random split, typically you evaluate the model only on 30% or less of the available data.  

     However, because cross-validation trains and validates the model multiple times over a larger dataset, it is much more computationally intensive and takes much longer than validating on a random split.  

-   Cross-validation evaluates the dataset as well as the model.

     Cross-validation does not simply measure the accuracy of a model, but also gives you some idea of how representative the dataset is and how sensitive the model might be to variations in the data.  

## How to use Cross Validate Model

Cross-validation can take a long time to run if your dataset is large.  Therefore, you might use **Cross Validate Model** in the initial phase of building and testing your model, to evaluate the goodness of the model parameters (assuming that computation time is tolerable), and then train and evaluate your model using the established parameters with the [Train Model](train-model.md) and [Evaluate Model](evaluate-model.md) modules.

In this scenario, you both train and test the model using **Cross Validate Model**.

1. Add the **Cross Validate Model** module to your pipeline. You can find it in Azure Machine Learning designer, in the **Model Scoring & Evaluation** category. 

2. Connect the output of any **classification** or **regression** model. 

    For example, if you are using a **Two Class Bayes Point Machine** for classification, configure the model with the parameters you want, and then drag a connector from the **Untrained model** port of the classifier to the matching port of **Cross Validate Model**. 

    > [!TIP] 
    > The model need not be trained because **Cross-Validate Model** automatically trains the model as part of evaluation.  
3.  On the **Dataset** port of **Cross Validate Model**, connect any labeled training dataset.  

4.  In the **Properties** pane of **Cross Validate Model**, click **Launch column selector** and choose the single column that contains the class label, or the predictable value. 

5. Set a value for the **Random seed** parameter if you want to be able to repeat the results of cross-validation across successive runs on the same data.  

6.  Run the pipeline.

7. See the [Results](#results) section for a description of the reports.

    To get a copy of the model for reuse later, right-click the output of the module that contains the algorithm (for example, the **Two Class Bayes Point Machine**), and click **Save as Trained Model**.

## Results

After all iterations are complete, **Cross Validate Model** creates scores for the entire dataset, as well as performance metrics you can use to assess the quality of the model.

### Scored results

The first output of the module provides the source data for each row, together with some predicted values and related probabilities. 

To view these results, in the pipeline, right-click the **Cross Validate Model** module, select **Scored results**, and click **Visualize**.

| New column name      | Description                              |
| -------------------- | ---------------------------------------- |
| Scored Labels        | This column is added at the end of the dataset, and contains the predicted value for each row |
| Scored Probabilities | This column is added at the end of the dataset, and indicates the estimated probability of the value in **Scored Labels**. |
| Fold Number          | Indicates the 0-based index of the fold each row of data was assigned to during cross-validation. |

 ### Evaluation results

The second report is grouped by folds. Remember that, during execution, **Cross Validate Model** randomly splits the training data into *n* folds (by default, 10). In each iteration over the dataset, **Cross Validate Model** uses one fold as a validation dataset, and uses the remaining *n-1* folds to train a model. Each of the *n* models is tested against the data in all the other folds.

In this report, the folds are listed by index value, in ascending order.  To order on any other column, you can save the results as a dataset.

To view these results, in the pipeline, right-click the **Cross Validate Model** module, select **Evaluation results by fold**, and click **Visualize**.


|Column name| Description|
|----|----|
|Fold number| An identifier for each fold. If you created 5 folds, there would be 5 subsets of data, numbered 0 to 4.
|Number of examples in fold|The number of rows assigned to each fold. They should be roughly equal. |


Additionally, the following metrics are included for each fold, depending on the type of model that you are evaluating. 

+ **Classification models**: Precision, recall, F-score, AUC, accuracy  

+ **Regression models**: Mean absolute error, root mean squared error, relative absolute error, relative squared error, and coefficient of determination


## Technical notes  

+ It is a best practice to normalize datasets before using them for cross-validation. 

+ Because **Cross Validate Model** trains and validates the model multiple times, it is much more computationally intensive and takes longer to complete than if you validated the model using a randomly divided dataset. 

+ There is no need to split the dataset into training and testing sets when you use cross validation to measure the accuracy of the model. 


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 

