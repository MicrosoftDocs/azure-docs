---
title:  "Two-Class Support Vector Machine: Component Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Two-Class Support Vector Machine component in Azure Machine Learning to create a binary classifier.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 04/22/2020
---

# Two-Class Support Vector Machine component

This article describes a component in Azure Machine Learning designer.

Use this component to create a model that is based on the support vector machine algorithm. 

Support vector machines (SVMs) are a well-researched class of supervised learning methods. This particular implementation is suited to prediction of two possible outcomes, based on either continuous or categorical variables.

After defining the model parameters, train the model by using the training components, and providing a *tagged dataset* that includes a label or outcome column.

## About support vector machines

Support vector machines are among the earliest of machine learning algorithms, and SVM models have been used in many applications, from information retrieval to text and image classification. SVMs can be used for both classification and regression tasks.

This SVM model is a supervised learning model that requires labeled data. In the training process, the algorithm analyzes input data and recognizes patterns in a multi-dimensional feature space called the *hyperplane*.  All input examples are represented as points in this space, and are mapped to output categories in such a way that categories are divided by as wide and clear a gap as possible.

For prediction, the SVM algorithm assigns new examples into one category or the other, mapping them into that same space. 

## How to configure 

For this model type, it is recommended that you normalize the dataset before using it to train the classifier.
  
1.  Add the **Two-Class Support Vector Machine** component to your pipeline.  
  
2.  Specify how you want the model to be trained, by setting the **Create trainer mode** option.  
  
    -   **Single Parameter**: If you know how you want to configure the model, you can provide a specific set of values as arguments.  

    -   **Parameter Range**: If you are not sure of the best parameters, you can find the optimal parameters by using the [Tune Model Hyperparameters](tune-model-hyperparameters.md) component. You provide some range of values, and the trainer iterates over multiple combinations of the settings to determine the combination of values that produces the best result.

3.  For **Number of iterations**, type a number that denotes the number of iterations used when building the model.  
  
     This parameter can be used to control trade-off between training speed and accuracy.  
  
4.  For **Lambda**, type a value to use as the weight for L1 regularization.  
  
     This regularization coefficient can be used to tune the model. Larger values penalize more complex models.  
  
5.  Select the option, **Normalize features**, if you want to normalize features before training.
  
     If you apply normalization, before training, data points are centered at the mean and scaled to have one unit of standard deviation.
  
6.  Select the option, **Project to the unit sphere**, to normalize coefficients.
  
     Projecting values to unit space means that before training, data points are centered at 0 and scaled to have one unit of standard deviation.
  
7.  In **Random number seed**, type an integer value to use as a seed if you want to ensure reproducibility across runs.  Otherwise, a system clock value is used as a seed, which can result in slightly different results across runs.
  
9. Connect a labeled dataset, and train the model:

    + If you set **Create trainer mode** to **Single Parameter**, connect a tagged dataset and the [Train Model](train-model.md) component.  
  
    + If you set **Create trainer mode** to **Parameter Range**, connect a tagged dataset and train the model by using [Tune Model Hyperparameters](tune-model-hyperparameters.md).  
  
    > [!NOTE]
    > 
    > If you pass a parameter range to [Train Model](train-model.md), it uses only the default value in the single parameter list.  
    > 
    > If you pass a single set of parameter values to the [Tune Model Hyperparameters](tune-model-hyperparameters.md) component, when it expects a range of settings for each parameter, it ignores the values, and uses the default values for the learner.  
    > 
    > If you select the **Parameter Range** option and enter a single value for any parameter, that single value you specified is used throughout the sweep, even if other parameters change across a range of values.
  
10. Submit the pipeline.

## Results

After training is complete:

+ To save a snapshot of the trained model, select the **Outputs** tab in the right panel of the **Train model** component. Select the **Register dataset** icon to save the model as a reusable component.

+ To use the model for scoring, add the **Score Model** component to a pipeline.


## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 