---
title: "One-vs-All Multiclass"
titleSuffix: Azure Machine Learning
description: Learn how to use the One-vs-All Multiclass module in Azure Machine Learning to create a multiclass classification model from an ensemble of binary classification models.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/16/2019
---
# One-vs-All Multiclass

This article describes how to use the One-vs-All Multiclass module in Azure Machine Learning designer (preview). The goal is to create a classification model that can predict multiple classes, by using the *one-versus-all* approach.

This module is useful for creating models that predict three or more possible outcomes, when the outcome depends on continuous or categorical predictor variables. This method also lets you use binary classification methods for issues that require multiple output classes.

### More about one-versus-all models

Some classification algorithms permit the use of more than two classes by design. Others restrict the possible outcomes to one of two values (a binary, or two-class model). But even binary classification algorithms can be adapted for multi-class classification tasks through a variety of strategies. 

This module implements the one-versus-all method, in which a binary model is created for each of the multiple output classes. The module assesses each of these binary models for the individual classes against its complement (all other classes in the model) as though it's a binary classification issue. The module then performs prediction by running these binary classifiers and choosing the prediction with the highest confidence score.  

In essence, the module creates an ensemble of individual models and then merges the results, to create a single model that predicts all classes. Any binary classifier can be used as the basis for a one-versus-all model.  

For example, let’s say you configure a [Two-Class Support Vector Machine](two-class-support-vector-machine.md) model and provide that as input to the One-vs-All Multiclass module. The module would create two-class support vector machine models for all members of the output class. It would then apply the one-versus-all method to combine the results for all classes.  

## How to configure the One-vs-All Multiclass classifier  

This module creates an ensemble of binary classification models to analyze multiple classes. To use this module, you need to configure and train a *binary classification* model first. 

You connect the binary model to the One-vs-All Multiclass module. You then train the ensemble of models by using [Train Model](train-model.md) with a labeled training dataset.

When you combine the models, One-vs-All Multiclass creates multiple binary classification models, optimizes the algorithm for each class, and then merges the models. The module does these tasks even though the training dataset might have multiple class values.

1. Add the One-vs-All Multiclass module to your pipeline in the designer. You can find this module under **Machine Learning - Initialize**, in the **Classification** category.

   The One-vs-All Multiclass classifier has no configurable parameters of its own. Any customizations must be done in the binary classification model that's provided as input.

2. Add a binary classification model to the pipeline, and configure that model. For example, you might use [Two-Class Support Vector Machine](two-class-support-vector-machine.md) or [Two-Class Boosted Decision Tree](two-class-boosted-decision-tree.md).

3. Add the [Train Model](train-model.md) module to your pipeline. Connect the untrained classifier that is the output of One-vs-All Multiclass.

4. On the other input of [Train Model](train-model.md), connect a labeled training dataset that has multiple class values.

5. Run the pipeline.

## Results

After training is complete, you can use the model to make multiclass predictions.

Alternatively, you can pass the untrained classifier to [Cross-Validate Model](cross-validate-model.md) for cross-validation against a labeled validation dataset.


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 
