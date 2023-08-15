---
title: Avoid overfitting & imbalanced data with Automated machine learning
titleSuffix: Azure Machine Learning
description: Identify and manage common pitfalls of ML models with Azure Machine Learning's Automated ML solutions. 
services: machine-learning
ms.service: machine-learning
ms.subservice: automl
ms.custom: ignite-2022
ms.topic: conceptual
author: manashgoswami 
ms.author: magoswam
ms.reviewer: ssalgado 
ms.date: 06/15/2023
---

# Prevent overfitting and imbalanced data with Automated ML

Overfitting and imbalanced data are common pitfalls when you build machine learning models. By default, Azure Machine Learning's Automated ML provides charts and metrics to help you identify these risks, and implements best practices to help mitigate them. 

## Identify overfitting

Overfitting in machine learning occurs when a model fits the training data too well, and as a result can't accurately predict on unseen test data. In other words, the model has memorized specific patterns and noise in the training data, but is not flexible enough to make predictions on real data.

Consider the following trained models and their corresponding train and test accuracies.

| Model | Train accuracy | Test accuracy |
|-------|----------------|---------------|
| A | 99.9% | 95% |
| B | 87% | 87% |
| C | 99.9% | 45% |

Consider model **A**, there is a common misconception that if test accuracy on unseen data is lower than training accuracy, the model is overfitted. However, test accuracy should always be less than training accuracy, and the distinction for overfit vs. appropriately fit comes down to *how much* less accurate. 

Compare models **A** and **B**, model **A** is a better model because it has higher test accuracy, and although the test accuracy is slightly lower at 95%, it is not a significant difference that suggests overfitting is present. You wouldn't choose model **B** because the train and test accuracies are closer together.

Model **C** represents a clear case of overfitting; the training accuracy is high but the test accuracy isn't anywhere near as high. This distinction is subjective, but comes from knowledge of your problem and data, and what magnitudes of error are acceptable.

## Prevent overfitting

In the most egregious cases, an overfitted model assumes that the feature value combinations seen during training always results in the exact same output for the target.

The best way to prevent overfitting is to follow ML best practices including:

* Using more training data, and eliminating statistical bias
* Preventing target leakage
* Using fewer features
* **Regularization and hyperparameter optimization**
* **Model complexity limitations**
* **Cross-validation**

In the context of Automated ML, the first three ways lists best practices you implement. The last three bolded items are **best practices Automated ML implements** by default to protect against overfitting. In settings other than Automated ML, all six best practices are worth following to avoid overfitting models.

## Best practices you implement

### Use more data

Using more data is the simplest and best possible way to prevent overfitting, and as an added bonus typically increases accuracy. When you use more data, it becomes harder for the model to memorize exact patterns, and it is forced to reach solutions that are more flexible to accommodate more conditions. It's also important to recognize statistical bias, to ensure your training data doesn't include isolated patterns that don't exist in live-prediction data. This scenario can be difficult to solve, because there could be overfitting present when compared to live test data.

### Prevent target leakage

Target leakage is a similar issue, where you may not see overfitting between train/test sets, but rather it appears at prediction-time. Target leakage occurs when your model "cheats" during training by having access to data that it shouldn't normally have at prediction-time. For example, to predict on Monday what a commodity price will be on Friday, if your features accidentally included data from Thursdays, that would be data the model won't have at prediction-time since it can't see into the future. Target leakage is an easy mistake to miss, but is often characterized by abnormally high accuracy for your problem. If you're attempting to predict stock price and trained a model at 95% accuracy, there's likely target leakage somewhere in your features.

### Use fewer features

Removing features can also help with overfitting by preventing the model from having too many fields to use to memorize specific patterns, thus causing it to be more flexible. It can be difficult to measure quantitatively, but if you can remove features and retain the same accuracy, you have likely made the model more flexible and have reduced the risk of overfitting.

## Best practices Automated ML implements

### Regularization and hyperparameter tuning

**Regularization** is the process of minimizing a cost function to penalize complex and overfitted models. There's different types of regularization functions, but in general they all penalize model coefficient size, variance, and complexity. Automated ML uses L1 (Lasso), L2 (Ridge), and ElasticNet (L1 and L2 simultaneously) in different combinations with different model hyperparameter settings that control overfitting. Automated ML varies how much a model is regulated and choose the best result.

### Model complexity limitations

Automated ML also implements explicit model complexity limitations to prevent overfitting. In most cases, this implementation is specifically for decision tree or forest algorithms, where individual tree max-depth is limited, and the total number of trees used in forest or ensemble techniques are limited.

### Cross-validation

Cross-validation (CV) is the process of taking many subsets of your full training data and training a model on each subset. The idea is that a model could get "lucky" and have great accuracy with one subset, but by using many subsets the model won't achieve this high accuracy every time. When doing CV, you provide a validation holdout dataset, specify your CV folds (number of subsets) and Automated ML trains your model and tune hyperparameters to minimize error on your validation set. One CV fold could be overfitted, but by using many of them it reduces the probability that your final model is overfitted. The tradeoff is that CV results in longer training times and greater cost, because you train a model once for each *n* in the CV subsets. 

> [!NOTE]
> Cross-validation isn't enabled by default; it must be configured in Automated machine learning settings. However, after cross-validation is configured and a validation data set has been provided, the process is automated for you. 

<a name="imbalance"></a>

## Identify models with imbalanced data

Imbalanced data is commonly found in data for machine learning classification scenarios, and refers to data that contains a disproportionate ratio of observations in each class. This imbalance can lead to a falsely perceived positive effect of a model's accuracy, because the input data has bias towards one class, which results in the trained model to mimic that bias. 

In addition, Automated ML jobs generate the following charts automatically. These charts help you understand the correctness of the classifications of your model, and identify models potentially impacted by imbalanced data.

Chart| Description
---|---
[Confusion Matrix](how-to-understand-automated-ml.md#confusion-matrix)| Evaluates the correctly classified labels against the actual labels of the data. 
[Precision-recall](how-to-understand-automated-ml.md#precision-recall-curve)| Evaluates the ratio of correct labels against the ratio of found label instances of the data 
[ROC Curves](how-to-understand-automated-ml.md#roc-curve)| Evaluates the ratio of correct labels against the ratio of false-positive labels.

## Handle imbalanced data 

As part of its goal of simplifying the machine learning workflow, Automated ML has built in capabilities to help deal with imbalanced data such as, 

- A weight column: Automated ML creates a column of weights as input to cause rows in the data to be weighted up or down, which can be used to make a class more or less "important."

- The algorithms used by Automated ML detect imbalance when the number of samples in the minority class is equal to or fewer than 20% of the number of samples in the majority class, where minority class refers to the one with fewest samples and majority class refers to the one with most samples. Subsequently, automated machine learning will run an experiment with subsampled data to check if using class weights would remedy this problem and improve performance. If it ascertains a better performance through this experiment, then this remedy is applied.

- Use a performance metric that deals better with imbalanced data. For example, the AUC_weighted is a primary metric that calculates the contribution of every class based on the relative number of samples representing that class, hence is more robust against imbalance.

The following techniques are additional options to handle imbalanced data outside of Automated ML. 

- Resampling to even the class imbalance, either by up-sampling the smaller classes or down-sampling the larger classes. These methods require expertise to process and analyze.

- Review performance metrics for imbalanced data. For example, the F1 score is the harmonic mean of precision and recall. Precision measures a classifier's exactness, where higher precision indicates fewer false positives, while recall measures a classifier's completeness, where higher recall indicates fewer false negatives.

## Next steps

See examples and learn how to build models using Automated ML:

+ Follow the [Tutorial: Train an object detection model with automated machine learning and Python](tutorial-auto-train-image-models.md).

+ Configure the settings for automatic training experiment:
  + In Azure Machine Learning studio, [use these steps](how-to-use-automated-ml-for-ml-models.md).
  + With the Python SDK, [use these steps](how-to-configure-auto-train.md).
