---
title:  "Two-Class Boosted Decision Tree: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Two-Class Boosted Decision Tree module in Azure Machine Learning to create a machine learning model that is based on the boosted decision trees algorithm. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 10/22/2019
---
# Two-Class Boosted Decision Tree module

This article describes a module in Azure Machine Learning designer (preview).

Use this module to create a machine learning model that is based on the boosted decision trees algorithm. 

A boosted decision tree is an ensemble learning method in which the second tree corrects for the errors of the first tree, the third tree corrects for the errors of the first and second trees, and so forth.  Predictions are based on the entire ensemble of trees together that makes the prediction.
  
Generally, when properly configured, boosted decision trees are the easiest methods with which to get top performance on a wide variety of machine learning tasks. However, they are also one of the more memory-intensive learners, and the current implementation holds everything in memory. Therefore, a boosted decision tree model might not be able to process the large datasets that some linear learners can handle.

## How to configure

This module creates an untrained classification model. Because classification is a supervised learning method, to train the model, you need a *tagged dataset* that includes a label column with a value for all rows.

You can train this type of model using [Train Model](././train-model.md). 

1.  In Azure Machine Learning, add the **Boosted Decision Tree** module to your pipeline.
  
2.  Specify how you want the model to be trained, by setting the **Create trainer mode** option.
  
    + **Single Parameter**: If you know how you want to configure the model, you can provide a specific set of values as arguments.
  
  
3.  For **Maximum number of leaves per tree**, indicate the maximum number of terminal nodes (leaves) that can be created in any tree.
  
     By increasing this value, you potentially increase the size of the tree and get better precision, at the risk of overfitting and longer training time.
  
4.  For **Minimum number of samples per leaf node**, indicate the number of cases required to create any terminal node (leaf) in a tree.  
  
     By increasing this value, you increase the threshold for creating new rules. For example, with the default value of 1, even a single case can cause a new rule to be created. If you increase the value to 5, the training data would have to contain at least five cases that meet the same conditions.
  
5.  For **Learning rate**, type a number between 0 and 1 that defines the step size while learning.  
  
     The learning rate determines how fast or slow the learner converges on the optimal solution. If the step size is too large, you might overshoot the optimal solution. If the step size is too small, training takes longer to converge on the best solution.
  
6.  For **Number of trees constructed**, indicate the total number of decision trees to create in the ensemble. By creating more decision trees, you can potentially get better coverage, but training time will increase.
  
     This value also controls the number of trees displayed when visualizing the trained model. if you want to see or print a single tree, set the value to 1. However, when you do so, only one tree is produced (the tree with the initial set of parameters) and no further iterations are performed.
  
7.  For **Random number seed**, optionally type a non-negative integer to use as the random seed value. Specifying a seed ensures reproducibility across runs that have the same data and parameters.  
  
     The random seed is set by default to 0, which means the initial seed value is obtained from the system clock.  Successive runs using a random seed can have different results.
  

9. Train the model.
  
    + If you set **Create trainer mode** to **Single Parameter**, connect a tagged dataset and the [Train Model](./train-model.md) module.  
   
## Results

After training is complete:

+ To save a snapshot of the trained model, select the **Outputs** tab in the right panel of the **Train model** module. Select the **Register dataset** icon to save the model as a reusable module.

+ To use the model for scoring, add the **Score Model** module to a pipeline.

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 