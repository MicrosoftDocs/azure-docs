---
title: "Permutation Feature Importance: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Permutation Feature Importance module in Azure Machine Learning service to compute the permutation feature importance scores of feature variables given a trained model and a test dataset.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/10/2019
---
# Permutation Feature Importance

This article describes how to use the [Permutation Feature Importance](permutation-feature-importance.md) module in Azure Machine Learning designer (preview), to compute a set of feature importance scores for your dataset. You use these scores to help you determine the best features to use in a model.

In this module, feature values are randomly shuffled, one column at a time, and the performance of the model is measured before and after. You can choose one of the standard metrics provided to measure performance.

The scores that the module returns represent the **change** in the performance of a trained model, after permutation. Important features are usually more sensitive to the shuffling process, and will thus result in higher importance scores. 

This article provides a good general overview of permutation feature importance, its theoretical basis, and its applications in machine learning: [Permutation feature importance](http://blogs.technet.com/b/machinelearning/archive/2015/04/14/permutation-feature-importance.aspx)  

## How to use Permutation Feature Importance

To generate a set of feature scores requires that you have an already trained model, as well as a test dataset.  

1.  Add the **Permutation Feature Importance** module to your pipeline. You can find this module in the **Feature Selection** category. 

2.  Connect a trained model to the left input. The model must be a regression model or classification model.  

3.  On the right input, connect a dataset, preferably one that is different from the dataset used for training the model. This dataset is used for scoring based on the trained model, and for evaluating the model after feature values have been changed.  

4.  For **Random seed**, type a value to use as seed for randomization. If you specify 0 (the default), a number is generated based on the system clock.

     A seed value is optional, but you should provide a value if you want reproducibility across runs of the same pipeline.  

5.  For **Metric for measuring performance**, select a single metric to use when computing model quality after permutation.  

     Azure Machine Learning designer supports the following metrics, depending on whether you are evaluating a classification or regression model:  

    -   **Classification**

        Accuracy, Precision, Recall, Average Log Loss  

    -   **Regression**

        Precision, Recall, Mean Absolute Error, Root Mean Squared Error, Relative Absolute Error, Relative Squared Error, Coefficient of Determination  

     For a more detailed description of these evaluation metrics, and how they are calculated, see [Evaluate Model](evaluate-model.md).  

6.  Run the pipeline.  

7.  The module outputs a list of feature columns and the scores associated with them, ranked in order of the scores, descending.  


##  Technical notes

This section provides implementation details, tips, and answers to frequently asked questions.

### How does this compare to other feature selection methods?

Permutation feature importance works by randomly changing the values of each feature column, one column at a time, and then evaluating the model. 

The rankings provided by permutation feature importance are often different from the ones you get from [Filter Based Feature Selection](filter-based-feature-selection.md), which calculates scores **before** a model is created. 

This is because permutation feature importance doesn’t measure the association between a feature and a target value, but instead captures how much influence each feature has on predictions from the model.
  
## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 
