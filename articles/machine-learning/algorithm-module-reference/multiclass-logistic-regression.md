---
title:  "Multiclass Logistic Regression: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Multiclass Logistic Regression module in Azure Machine Learning to create a logistic regression model that can be used to predict multiple values.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 10/22/2019
---
# Multiclass Logistic Regression module

This article describes a module in Azure Machine Learning designer.

Use this module to create a logistic regression model that can be used to predict multiple values.

Classification using logistic regression is a supervised learning method, and therefore requires a labeled dataset. You train the model by providing the model and the labeled dataset as an input to a module such as [Train Model](./train-model.md). The trained model can then be used to predict values for new input examples.

Azure Machine Learning also provides a [Two-Class Logistic Regression](./two-class-logistic-regression.md) module, which is suited for classification of binary or dichotomous variables.

## About multiclass logistic regression

Logistic regression is a well-known method in statistics that is used to predict the probability of an outcome, and is popular for classification tasks. The algorithm predicts the probability of occurrence of an event by fitting data to a logistic function. 

In multiclass logistic regression, the classifier can be used to predict multiple outcomes.

## Configure a multiclass logistic regression

1. Add the **Multiclass Logistic Regression** module to the pipeline.

2. Specify how you want the model to be trained, by setting the **Create trainer mode** option.

    + **Single Parameter**: Use this option if you know how you want to configure the model, and provide a specific set of values as arguments.

    + **Parameter Range**: Use this option if you are not sure of the best parameters, and want to use a parameter sweep.

3. **Optimization tolerance**, specify the threshold value for optimizer convergence. If the improvement between iterations is less than the threshold, the algorithm stops and returns the current model.

4. **L1 regularization weight**, **L2 regularization weight**: Type a value to use for the regularization parameters L1 and L2. A non-zero value is recommended for both.

    Regularization is a method for preventing overfitting by penalizing models with extreme coefficient values. Regularization works by adding the penalty that is associated with coefficient values to the error of the hypothesis. An accurate model with extreme coefficient values would be penalized more, but a less accurate model with more conservative values would be penalized less.

     L1 and L2 regularization have different effects and uses. L1 can be applied to sparse models, which is useful when working with high-dimensional data. In contrast, L2 regularization is preferable for data that is not sparse.  This algorithm supports a linear combination of L1 and L2 regularization values: that is, if `x = L1` and `y = L2`, `ax + by = c` defines the linear span of the regularization terms.

     Different linear combinations of L1 and L2 terms have been devised for logistic regression models, such as [elastic net regularization](https://wikipedia.org/wiki/Elastic_net_regularization).

6. **Random number seed**: Type an integer value to use as the seed for the algorithm if you want the results to be repeatable over runs. Otherwise, a system clock value is used as the seed, which can produce slightly different results in runs of the same pipeline.

8. Connect a labeled dataset, and one of the train modules:

    + If you set **Create trainer mode** to **Single Parameter**, use the [Train Model](./train-model.md) module.

9. Run the pipeline.



## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 