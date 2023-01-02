---
title:  "Two-Class Boosted Decision Tree: Component Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Two-Class Boosted Decision Tree component in the designer to create a binary classifier.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 08/24/2020
---
# Two-Class Boosted Decision Tree component

This article describes a component in Azure Machine Learning designer.

Use this component to create a machine learning model that is based on the boosted decision trees algorithm. 

A boosted decision tree is an ensemble learning method in which the second tree corrects for the errors of the first tree, the third tree corrects for the errors of the first and second trees, and so forth. Predictions are based on the entire ensemble of trees together that makes the prediction.
  
Generally, when properly configured, boosted decision trees are the easiest methods with which to get top performance on a wide variety of machine learning tasks. However, they are also one of the more memory-intensive learners, and the current implementation holds everything in memory. Therefore, a boosted decision tree model might not be able to process the large datasets that some linear learners can handle.

This component is based on LightGBM algorithm.

## How to configure

This component creates an untrained classification model. Because classification is a supervised learning method, to train the model, you need a *tagged dataset* that includes a label column with a value for all rows.

You can train this type of model using [Train Model](././train-model.md). 

1.  In Azure Machine Learning, add the **Boosted Decision Tree** component to your pipeline.
  
2.  Specify how you want the model to be trained, by setting the **Create trainer mode** option.
  
    + **Single Parameter**: If you know how you want to configure the model, you can provide a specific set of values as arguments.
  
    + **Parameter Range**: If you are not sure of the best parameters, you can find the optimal parameters by using the [Tune Model Hyperparameters](tune-model-hyperparameters.md) component. You provide some range of values, and the trainer iterates over multiple combinations of the settings to determine the combination of values that produces the best result.
  
3.  For **Maximum number of leaves per tree**, indicate the maximum number of terminal nodes (leaves) that can be created in any tree.
  
     By increasing this value, you potentially increase the size of the tree and get better precision, at the risk of overfitting and longer training time.
  
4.  For **Minimum number of samples per leaf node**, indicate the number of cases required to create any terminal node (leaf) in a tree.  
  
     By increasing this value, you increase the threshold for creating new rules. For example, with the default value of 1, even a single case can cause a new rule to be created. If you increase the value to 5, the training data would have to contain at least five cases that meet the same conditions.
  
5.  For **Learning rate**, type a number between 0 and 1 that defines the step size while learning.  
  
     The learning rate determines how fast or slow the learner converges on the optimal solution. If the step size is too large, you might overshoot the optimal solution. If the step size is too small, training takes longer to converge on the best solution.
  
6.  For **Number of trees constructed**, indicate the total number of decision trees to create in the ensemble. By creating more decision trees, you can potentially get better coverage, but training time will increase.
  
     If you set the value to 1, only one tree is produced (the tree with the initial set of parameters) and no further iterations are performed.
  
7.  For **Random number seed**, optionally type a non-negative integer to use as the random seed value. Specifying a seed ensures reproducibility across runs that have the same data and parameters.  
  
     The random seed is set by default to 0, which means the initial seed value is obtained from the system clock.  Successive runs using a random seed can have different results.
  

9. Train the model:

    + If you set **Create trainer mode** to **Single Parameter**, connect a tagged dataset and the [Train Model](train-model.md) component.  
  
    + If you set **Create trainer mode** to **Parameter Range**, connect a tagged dataset and train the model by using [Tune Model Hyperparameters](tune-model-hyperparameters.md).  
  
    > [!NOTE]
    > 
    > If you pass a parameter range to [Train Model](train-model.md), it uses only the default value in the single parameter list.  
    > 
    > If you pass a single set of parameter values to the [Tune Model Hyperparameters](tune-model-hyperparameters.md) component, when it expects a range of settings for each parameter, it ignores the values, and uses the default values for the learner.  
    > 
    > If you select the **Parameter Range** option and enter a single value for any parameter, that single value you specified is used throughout the sweep, even if other parameters change across a range of values.  
   
## Results

After training is complete:

+ To save a snapshot of the trained model, select the **Outputs** tab in the right panel of the **Train model** component. Select the **Register dataset** icon to save the model as a reusable component.

+ To use the model for scoring, add the **Score Model** component to a pipeline.

## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 