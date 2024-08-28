---
title: Prevent overfitting and imbalanced data with Automated ML
titleSuffix: Azure Machine Learning
description: Identify and manage common pitfalls of machine learning models by using Automated ML solutions in Azure Machine Learning.
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: automl
ms.topic: concept-article
author: ssalgadodev
ms.author: ssalgado
ms.reviewer: manashg
ms.date: 07/11/2024

#customer intent: As a developer, I want to use Automated ML solutions in Azure Machine Learning, so I can find and address common issues like overfitting and imbalanced data.
---

# Prevent overfitting and imbalanced data with Automated ML

Overfitting and imbalanced data are common pitfalls when you build machine learning models. By default, the Automated ML feature in Azure Machine Learning provides charts and metrics to help you identify these risks. This article describes how you can implement best practices in Automated ML to help mitigate common issues. 

## Identify overfitting

Overfitting in machine learning occurs when a model fits the training data too well. As a result, the model can't make accurate predictions on unseen test data. The model memorized specific patterns and noise in the training data, and it's not flexible enough to make predictions on real data.

Consider the following trained models and their corresponding train and test accuracies:

| Model | Train accuracy | Test accuracy |
| :---: | :---: | :---: |
| A | 99.9% | 95% |
| B | 87%   | 87% |
| C | 99.9% | 45% |

- Model **A**: The test for this model produces slightly less accuracy than the model training. There's a common misconception that if test accuracy on unseen data is lower than training accuracy, the model is overfitted. However, test accuracy should always be less than training accuracy. The distinction between overfitting versus appropriately fitting data comes down to measuring _how much_ less is the accuracy.

- Model **A** versus model **B**: Model **A** is a better model because it has higher test accuracy. Although the test accuracy is slightly lower at 95%, it's not a significant difference that suggests overfitting is present. Model **B** isn't preferred because the train and test accuracies are similar.

- Model **C**: This model represents a clear case of overfitting. The training accuracy is high and the test accuracy is low. This distinction is subjective, but comes from knowledge of your problem and data, and what are the acceptable magnitudes of error.

## Prevent overfitting

In the most egregious cases, an overfitted model assumes the feature value combinations visible during training always result in the exact same output for the target. To avoid overfitting your data, the recommendation is to follow machine learning best practices. The are several methods you can configure in your model implementation. Automated ML also provides other options by default to help prevent overfitting.

The following table summarizes common best practices:

| Best practice | Implementation | Automated ML |
| --- | :---: | :---: |
| Use more training data, and eliminate statistical bias | X | | 
| Prevent target leakage | X | | 
| Incorporate fewer features | X | | 
| Support regularization and hyperparameter optimization | | X | 
| Apply model complexity limitations | | X |
| Use cross-validation | | X |

## Apply best practices to prevent overfitting

The following sections describe best practices you can use in your machine learning model implementation to prevent overfitting.

### Use more data

Using more data is the simplest and best possible way to prevent overfitting, and this approach typically increases accuracy. When you use more data, it becomes harder for the model to memorize exact patterns. The model is forced to reach solutions that are more flexible to accommodate more conditions. It's also important to recognize statistical bias, to ensure your training data doesn't include isolated patterns that don't exist in live-prediction data. This scenario can be difficult to solve because there can be overfitting present when compared to live test data.

### Prevent target leakage

Target leakage is a similar issue. You might not see overfitting between the train and test sets, but the leakage issue appears at prediction-time. Target leakage occurs when your model "cheats" during training by accessing data that it shouldn't normally have at prediction-time. An example is for the model to predict on Monday what the commodity price is for Friday. If your features accidentally include data from Thursdays, the model has access to data not available at prediction-time because it can't see into the future. Target leakage is an easy mistake to miss. It's often visible where you have abnormally high accuracy for your problem. If you're attempting to predict stock price and trained a model at 95% accuracy, there's likely target leakage somewhere in your features.

### Incorporate fewer features

Removing features can also help with overfitting by preventing the model from having too many fields to use to memorize specific patterns, thus causing it to be more flexible. It can be difficult to measure quantitatively. If you can remove features and retain the same accuracy, your model can be more flexible and reduce the risk of overfitting.

## Review Automated ML features to prevent overfitting

The following sections describe best practices provided by default in Automated ML to help prevent overfitting.

### Support regularization and hyperparameter tuning

**Regularization** is the process of minimizing a cost function to penalize complex and overfitted models. There are different types of regularization functions. In general, all functions penalize model coefficient size, variance, and complexity. Automated ML uses L1 (Lasso), L2 (Ridge), and ElasticNet (L1 and L2 simultaneously) in different combinations with different model hyperparameter settings that control overfitting. Automated ML varies how much a model is regulated and chooses the best result.

### Apply model complexity limitations

Automated ML also implements explicit model complexity limitations to prevent overfitting. In most cases, this implementation is specifically for decision tree or forest algorithms. Individual tree max-depth is limited, and the total number of trees used in forest or ensemble techniques are limited.

### Use cross-validation

Cross-validation (CV) is the process of taking many subsets of your full training data and training a model on each subset. The idea is that a model might get "lucky" and have great accuracy with one subset, but by using many subsets, the model can't achieve high accuracy every time. When doing CV, you provide a validation holdout dataset, specify your CV folds (number of subsets) and Automated ML trains your model and tunes hyperparameters to minimize error on your validation set. One CV fold might be overfitted, but by using many of them, the process reduces the probability that your final model is overfitted. The tradeoff is that CV results in longer training times and greater cost, because you train a model one time for each *n* in the CV subsets. 

> [!NOTE]
> Cross-validation isn't enabled by default. This feature must be configured in Automated machine learning settings. However, after cross-validation is configured and a validation data set is provided, the process is automated for you. 

## Identify models with imbalanced data

Imbalanced data is commonly found in data for machine learning classification scenarios, and refers to data that contains a disproportionate ratio of observations in each class. This imbalance can lead to a falsely perceived positive effect of a model's accuracy, because the input data has bias towards one class, which results in the trained model to mimic that bias. 

In addition, Automated ML jobs generate the following charts automatically. These charts help you understand the correctness of the classifications of your model, and identify models potentially impacted by imbalanced data.

| Chart | Description |
| --- | --- |
| [Confusion matrix](how-to-understand-automated-ml.md#confusion-matrix) | Evaluates the correctly classified labels against the actual labels of the data. |
| [Precision-recall](how-to-understand-automated-ml.md#precision-recall-curve) | Evaluates the ratio of correct labels against the ratio of found label instances of the data. |
| [ROC curves](how-to-understand-automated-ml.md#roc-curve) | Evaluates the ratio of correct labels against the ratio of false-positive labels. |

## Handle imbalanced data 

As part of the goal to simplify the machine learning workflow, Automated ML offers built-in capabilities to help deal with imbalanced data: 

- Automated ML creates a **column of weights** as input to cause rows in the data to be weighted up or down, which can be used to make a class more or less "important."

- The algorithms used by Automated ML detect imbalance when the number of samples in the minority class is equal to or fewer than 20% of the number of samples in the majority class. The minority class refers to the one with fewest samples and the majority class refers to the one with most samples. Later, automated machine learning runs an experiment with subsampled data to check if using class weights can remedy this problem and improve performance. If it ascertains a better performance through this experiment, it applies the remedy.

- Use a performance metric that deals better with imbalanced data. For example, the AUC_weighted is a primary metric that calculates the contribution of every class based on the relative number of samples representing that class. This metric is more robust against imbalance.

The following techniques are other options to handle imbalanced data outside of Automated ML:

- Resample to even the class imbalance. You can up-sample the smaller classes or down-sample the larger classes. These methods require expertise to process and analyze.

- Review performance metrics for imbalanced data. For example, the F1 score is the harmonic mean of precision and recall. Precision measures a classifier's exactness, where higher precision indicates fewer false positives. Recall measures a classifier's completeness, where higher recall indicates fewer false negatives.

## Next step

> [!div class="nextstepaction"]
> [Train an object detection model with automated machine learning and Python](tutorial-auto-train-image-models.md)
