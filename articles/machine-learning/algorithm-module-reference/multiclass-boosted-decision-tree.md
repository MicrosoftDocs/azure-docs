---
title:  "Multiclass Boosted Decision Tree: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Multiclass Boosted Decision Tree module in Azure Machine Learning to create a classifier using labeled data.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 02/19/2020
---

# Multiclass Boosted Decision Tree

This article describes a module in Azure Machine Learning designer (preview).

Use this module to create a machine learning model that is based on the boosted decision trees algorithm.

A boosted decision tree is an ensemble learning method in which the second tree corrects for the errors of the first tree, the third tree corrects for the errors of the first and second trees, and so forth. Predictions are based on the ensemble of trees together.

## How to configure 

This module creates an untrained classification model. Because classification is a supervised learning method, you need a *labeled dataset* that includes a label column with a value for all rows.

You can train this type of model by using the [Train Model](././train-model.md). 

1.  Add the **Multiclass Boosted Decision Tree** module to your pipeline.

1.  Specify how you want the model to be trained by setting the **Create trainer mode** option.

    + **Single Parameter**: If you know how you want to configure the model, you can provide a specific set of values as arguments.
    
    + **Parameter Range**: Select this option if you are not sure of the best parameters, and want to run a parameter sweep. Select a range of values to iterate over, and the [Tune Model Hyperparameters](tune-model-hyperparameters.md) iterates over all possible combinations of the settings you provided to determine the hyperparameters that produce the optimal results.  

1. **Maximum number of leaves per tree** limits the maximum number of terminal nodes (leaves) that can be created in any tree.
    
        By increasing this value, you potentially increase the size of the tree and achieve higher precision, at the risk of overfitting and longer training time.
  
1. **Minimum number of samples per leaf node** indicates the number of cases required to create any terminal node (leaf) in a tree.  

         By increasing this value, you increase the threshold for creating new rules. For example, with the default value of 1, even a single case can cause a new rule to be created. If you increase the value to 5, the training data would have to contain at least five cases that meet the same conditions.

1. **Learning rate** defines the step size while learning. Enter a number between 0 and 1.

         The learning rate determines how fast or slow the learner converges on an optimal solution. If the step size is too large, you might overshoot the optimal solution. If the step size is too small, training takes longer to converge on the best solution.

1. **Number of trees constructed** indicates the total number of decision trees to create in the ensemble. By creating more decision trees, you can potentially get better coverage, but training time will increase.

1. **Random number seed** optionally sets a non-negative integer to use as the random seed value. Specifying a seed ensures reproducibility across runs that have the same data and parameters.  

         The random seed is set by default to 42. Successive runs using different random seeds can have different results.

1. Train the model:

    + If you set **Create trainer mode** to **Single Parameter**, connect a tagged dataset and the [Train Model](train-model.md) module.  
  
    + If you set **Create trainer mode** to **Parameter Range**, connect a tagged dataset and train the model by using [Tune Model Hyperparameters](tune-model-hyperparameters.md).  
  
    > [!NOTE]
    > 
    > If you pass a parameter range to [Train Model](train-model.md), it uses only the default value in the single parameter list.  
    > 
    > If you pass a single set of parameter values to the [Tune Model Hyperparameters](tune-model-hyperparameters.md) module, when it expects a range of settings for each parameter, it ignores the values, and uses the default values for the learner.  
    > 
    > If you select the **Parameter Range** option and enter a single value for any parameter, that single value you specified is used throughout the sweep, even if other parameters change across a range of values.

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 
