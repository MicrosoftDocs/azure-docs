---
title: "Permutation Feature Importance: Module reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Permutation Feature Importance module in Azure Machine Learning to compute the permutation feature importance scores of feature variables, given a trained model and a test dataset.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/10/2019
---
# Permutation Feature Importance

This article describes how to use the Permutation Feature Importance module in Azure Machine Learning designer, to compute a set of feature importance scores for your dataset. You use these scores to help you determine the best features to use in a model.

In this module, feature values are randomly shuffled, one column at a time. The performance of the model is measured before and after. You can choose one of the standard metrics to measure performance.

The scores that the module returns represent the *change* in the performance of a trained model, after permutation. Important features are usually more sensitive to the shuffling process, so they'll result in higher importance scores. 

This article provides an overview of the permutation feature, its theoretical basis, and its applications in machine learning: [Permutation Feature Importance](https://blogs.technet.com/b/machinelearning/archive/2015/04/14/permutation-feature-importance.aspx).  

## How to use Permutation Feature Importance

Generating a set of feature scores requires that you have an already trained model, as well as a test dataset.  

1.  Add the Permutation Feature Importance module to your pipeline. You can find this module in the **Feature Selection** category. 

2.  Connect a trained model to the left input. The model must be a regression model or a classification model.  

3.  On the right input, connect a dataset. Preferably, choose one that's different from the dataset that you used for training the model. This dataset is used for scoring based on the trained model. It's also used for evaluating the model after feature values have changed.  

4.  For **Random seed**, enter a value to use as a seed for randomization. If you specify 0 (the default), a number is generated based on the system clock.

     A seed value is optional, but you should provide a value if you want reproducibility across runs of the same pipeline.  

5.  For **Metric for measuring performance**, select a single metric to use when you're computing model quality after permutation.  

     Azure Machine Learning designer supports the following metrics, depending on whether you're evaluating a classification or regression model:  

    -   **Classification**

        Accuracy, Precision, Recall, Average Log Loss  

    -   **Regression**

        Precision, Recall, Mean Absolute Error, Root Mean Squared Error, Relative Absolute Error, Relative Squared Error, Coefficient of Determination  

     For a more detailed description of these evaluation metrics and how they're calculated, see [Evaluate Model](evaluate-model.md).  

6.  Run the pipeline.  

7.  The module outputs a list of feature columns and the scores associated with them. The list is ranked in descending order of the scores.  


##  Technical notes

Permutation Feature Importance works by randomly changing the values of each feature column, one column at a time. It then evaluates the model. 

The rankings that the module provides are often different from the ones you get from [Filter Based Feature Selection](filter-based-feature-selection.md). Filter Based Feature Selection calculates scores *before* a model is created. 

The reason for the difference is that Permutation Feature Importance doesn't measure the association between a feature and a target value. Instead, it captures how much influence each feature has on predictions from the model.
  
## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 
