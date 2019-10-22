---
title: "One-vs-All Multiclass"
titleSuffix: Azure Machine Learning service
description: Learn how to use the One-vs-All Multiclass module in Azure Machine Learning service to create a multiclass classification model from an ensemble of binary classification models.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/16/2019
---
# One-vs-All Multiclass

This article describes how to use the **One-vs-All Multiclass** module inAzure Machine Learning designer (preview), to create a classification model that can predict multiple classes, using the "one vs. all" approach.

This module is useful for creating models that predict three or more possible outcomes, when the outcome depends on continuous or categorical predictor variables. This method also lets you use binary classification methods for issues that require multiple output classes.

### More about One-vs-All models

While some classification algorithms permit the use of more than two classes by design, others restrict the possible outcomes to one of two values (a binary, or two-class model). However, even binary classification algorithms can be adapted for multi-class classification tasks using a variety of strategies. 

This module implements the *one vs. all method*, in which a binary model is created for each of the multiple output classes. Each of these binary models for the individual classes is assessed against its complement (all other classes in the model) as though it were a binary classification issue. Prediction is then performed by running these binary classifiers, and choosing the prediction with the highest confidence score.  

In essence, an ensemble of individual models is created and the results are then merged, to create a single model that predicts all classes. Thus, any binary classifier can be used as the basis for a one-vs-all model.  

 For example, let’s say you configure a [Two-Class Support Vector Machine](two-class-support-vector-machine.md) model and provide that as input to the **One-vs-All Multiclass** module. The module would create two-class support vector machine models for all members of the output class and then apply the one-vs-all method to combine the results for all classes.  

## How to Configure the One-vs-All Classifier  

This module creates an ensemble of binary classification models to analyze multiple classes. Therefore, to use this module, you need to configure and train a **binary classification** model first. 

You then connect the binary model to **One-vs-All Multiclass** module, and train the ensemble of models by using [Train Model](train-model.md) with a labeled training dataset.

When you combine the models, even though the training dataset might have multiple class values, the **One-vs-All Multiclass** creates multiple binary classification models, optimizes the algorithm for each class, and then merges the models.

1. Add the **One-vs-All Multiclass** to your pipeline in the designer. You can find this module under Machine Learning - Initialize, in the **Classification** category.

    The **One-vs-All Multiclass** classifier has no configurable parameters of its own. Any customizations must be done in the binary classification model that is provided as input.

2. Add a binary classification model to the pipeline, and configure that model. For example, you might use a [Two-Class Support Vector Machine](two-class-support-vector-machine.md) or [Two-Class Boosted Decision Tree](two-class-boosted-decision-tree.md).

3. Add the [Train Model](train-model.md) module to your pipeline, and connect the untrained classifier that is the output of **One-vs-All Multiclass**.

4. On the other input of [Train Model](train-model.md), connect a labeled training data set that has multiple class values.

5. Run the pipeline.

## Results

After training is complete, you can use the model to make multiclass predictions.

Alternatively, you can pass the untrained classifier to [Cross-Validate Model](cross-validate-model.md) for cross-validation against a labeled validation data set.


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 
