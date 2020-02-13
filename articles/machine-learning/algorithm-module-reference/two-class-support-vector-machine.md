---
title:  "Two-Class Support Vector Machine: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the **Two-Class Support Vector Machine** module in Azure Machine Learning to create a model that is based on the support vector machine algorithm. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 10/22/2019
---

# Two-Class Support Vector Machine module

This article describes a module in Azure Machine Learning designer (preview).

Use this module to create a model that is based on the support vector machine algorithm. 

Support vector machines (SVMs) are a well-researched class of supervised learning methods. This particular implementation is suited to prediction of two possible outcomes, based on either continuous or categorical variables.

After defining the model parameters, train the model by using the training modules, and providing a *tagged dataset* that includes a label or outcome column.

## About support vector machines

Support vector machines are among the earliest of machine learning algorithms, and SVM models have been used in many applications, from information retrieval to text and image classification. SVMs can be used for both classification and regression tasks.

This SVM model is a supervised learning model that requires labeled data. In the training process, the algorithm analyzes input data and recognizes patterns in a multi-dimensional feature space called the *hyperplane*.  All input examples are represented as points in this space, and are mapped to output categories in such a way that categories are divided by as wide and clear a gap as possible.

For prediction, the SVM algorithm assigns new examples into one category or the other, mapping them into that same space. 

## How to configure 

For this model type, it is recommended that you normalize the dataset before using it to train the classifier.
  
1.  Add the **Two-Class Support Vector Machine** module to your pipeline.  
  
2.  Specify how you want the model to be trained, by setting the **Create trainer mode** option.  
  
    -   **Single Parameter**: If you know how you want to configure the model, you can provide a specific set of values as arguments.  

3.  For **Number of iterations**, type a number that denotes the number of iterations used when building the model.  
  
     This parameter can be used to control trade-off between training speed and accuracy.  
  
4.  For **Lambda**, type a value to use as the weight for L1 regularization.  
  
     This regularization coefficient can be used to tune the model. Larger values penalize more complex models.  
  
5.  Select the option, **Normalize features**, if you want to normalize features before training.
  
     If you apply normalization, before training, data points are centered at the mean and scaled to have one unit of standard deviation.
  
6.  Select the option, **Project to the unit sphere**, to normalize coefficients.
  
     Projecting values to unit space means that before training, data points are centered at 0 and scaled to have one unit of standard deviation.
  
7.  In **Random number seed**, type an integer value to use as a seed if you want to ensure reproducibility across runs.  Otherwise, a system clock value is used as a seed, which can result in slightly different results across runs.
  
9. Connect a labeled dataset, and one of the [training modules](module-reference.md):
  
    -   If you set **Create trainer mode** to **Single Parameter**, use the [Train Model](train-model.md) module.
  
10. Run the pipeline.

## Results

After training is complete:

+ To save a snapshot of the trained model, select the **Outputs** tab in the right panel of the **Train model** module. Select the **Register dataset** icon to save the model as a reusable module.

+ To use the model for scoring, add the **Score Model** module to a pipeline.


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 