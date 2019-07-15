---
title: Training accuracy metrics in automated ML
titleSuffix: Azure Machine Learning service
description: Learn about automated machine learning accuracy metrics for each of your runs. 
author: j-martens
ms.author: jmartens
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.date: 06/20/2019
---

# Evaluate training accuracy in automated ML with metrics

There are multiple ways to view training accuracy metrics for each run iteration.

* Use [a Jupyter widget](how-to-track-experiments.md#view-run-details)
* Use [the `get_metrics()` function](how-to-track-experiments.md#query-run-metrics) on any `Run` object
* View [the experiment metrics in the Azure portal](how-to-track-experiments.md#view-the-experiment-in-the-azure-portal)

## Classification metrics

The following metrics are saved in each run iteration for a classification task.

|Metric|Description|Calculation|Extra Parameters
--|--|--|--|
AUC_Macro| AUC is the Area under the Receiver Operating Characteristic Curve. Macro is the arithmetic mean of the AUC for each class.  | [Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html) | average="macro"|
AUC_Micro| AUC is the Area under the Receiver Operating Characteristic Curve. Micro is computed globally by combining the true positives and false positives from each class| [Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html) | average="micro"|
AUC_Weighted  | AUC is the Area under the Receiver Operating Characteristic Curve. Weighted is the arithmetic mean of the score for each class, weighted by the number of true instances in each class| [Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html)|average="weighted"
accuracy|Accuracy is the percent of predicted labels that exactly match the true labels. |[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html) |None|
average_precision_score_macro|Average precision summarizes a precision-recall curve as the weighted mean of precisions achieved at each threshold, with the increase in recall from the previous threshold used as the weight. Macro is the arithmetic mean of the average precision score of each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html)|average="macro"|
average_precision_score_micro|Average precision summarizes a precision-recall curve as the weighted mean of precisions achieved at each threshold, with the increase in recall from the previous threshold used as the weight. Micro is computed globally by combing the true positives and false positives at each cutoff|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html)|average="micro"|
average_precision_score_weighted|Average precision summarizes a precision-recall curve as the weighted mean of precisions achieved at each threshold, with the increase in recall from the previous threshold used as the weight. Weighted is the arithmetic mean of the average precision score for each class, weighted by the number of true instances in each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html)|average="weighted"|
balanced_accuracy|Balanced accuracy is the arithmetic mean of recall for each class.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|average="macro"|
f1_score_macro|F1 score is the harmonic mean of precision and recall. Macro is the arithmetic mean of F1 score for each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html)|average="macro"|
f1_score_micro|F1 score is the harmonic mean of precision and recall. Micro is computed globally by counting the total true positives, false negatives, and false positives|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html)|average="micro"|
f1_score_weighted|F1 score is the harmonic mean of precision and recall. Weighted mean by class frequency of F1 score for each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html)|average="weighted"|
log_loss|This is the loss function used in (multinomial) logistic regression and extensions of it such as neural networks, defined as the negative log-likelihood of the true labels given a probabilistic classifier’s predictions. For a single sample with true label yt in {0,1} and estimated probability yp that yt = 1, the log loss is -log P(yt&#124;yp) = -(yt log(yp) + (1 - yt) log(1 - yp))|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.log_loss.html)|None|
norm_macro_recall|Normalized Macro Recall is Macro Recall normalized so that random performance has a score of 0 and perfect performance has a score of 1. This is achieved by norm_macro_recall := (recall_score_macro - R)/(1 - R), where R is the expected value of recall_score_macro for random predictions (i.e., R=0.5 for binary classification and R=(1/C) for C-class classification problems)|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|average = "macro" and then (recall_score_macro - R)/(1 - R), where R is the expected value of recall_score_macro for random predictions (i.e., R=0.5 for binary classification and R=(1/C) for C-class classification problems)|
precision_score_macro|Precision is the percent of elements labeled as a certain class that actually are in that class. Macro is the arithmetic mean of precision for each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html)|average="macro"|
precision_score_micro|Precision is the percent of elements labeled as a certain class that actually are in that class. Micro is computed globally by counting the total true positives and false positives|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html)|average="micro"|
precision_score_weighted|Precision is the percent of elements labeled as a certain class that actually are in that class. Weighted is the arithmetic mean of precision for each class, weighted by number of true instances in each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html)|average="weighted"|
recall_score_macro|Recall is the percent of elements actually in a certain class that are correctly labeled. Macro is the arithmetic mean of recall for each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|average="macro"|
recall_score_micro|Recall is the percent of elements actually in a certain class that are correctly labeled. Micro is computed globally by counting the total true positives, false negatives|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|average="micro"|
recall_score_weighted|Recall is the percent of elements actually in a certain class that are correctly labeled. Weighted is the arithmetic mean of recall for each class, weighted by number of true instances in each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|average="weighted"|
weighted_accuracy|Weighted accuracy is accuracy where the weight given to each example is equal to the proportion of true instances in that example's true class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html)|sample_weight is a vector equal to the proportion of that class for each element in the target|

## Regression and forecasting metrics

The following metrics are saved in each run iteration for a regression or forecasting task.

|Metric|Description|Calculation|Extra Parameters
--|--|--|--|
explained_variance|Explained variance is  the proportion to which a mathematical model accounts for the variation of a given data set. It is the percent decrease in variance of the original data to the variance of the errors. When the mean of the errors is 0, it is equal to explained variance.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.explained_variance_score.html)|None|
r2_score|R2 is the coefficient of determination or the percent reduction in squared errors compared to a baseline model that outputs the mean. When the mean of the errors is 0, it is equal to explained variance.|[Calculation](https://scikit-learn.org/0.16/modules/generated/sklearn.metrics.r2_score.html)|None|
spearman_correlation|Spearman correlation is a nonparametric measure of the monotonicity of the relationship between two datasets. Unlike the Pearson correlation, the Spearman correlation does not assume that both datasets are normally distributed. Like other correlation coefficients, this one varies between -1 and +1 with 0 implying no correlation. Correlations of -1 or +1 imply an exact monotonic relationship. Positive correlations imply that as x increases, so does y. Negative correlations imply that as x increases, y decreases.|[Calculation](https://docs.scipy.org/doc/scipy-0.16.1/reference/generated/scipy.stats.spearmanr.html)|None|
mean_absolute_error|Mean absolute error is the expected value of absolute value of difference between the target and the prediction|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_absolute_error.html)|None|
normalized_mean_absolute_error|Normalized mean absolute error is mean Absolute Error divided by the range of the data|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_absolute_error.html)|Divide by range of the data|
median_absolute_error|Median absolute error is the median of all absolute differences between the target and the prediction. This loss is robust to outliers.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.median_absolute_error.html)|None|
normalized_median_absolute_error|Normalized median absolute error is median absolute error divided by the range of the data|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.median_absolute_error.html)|Divide by range of the data|
root_mean_squared_error|Root mean squared error is the square root of the expected squared difference between the target and the prediction|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html)|None|
normalized_root_mean_squared_error|Normalized root mean squared error is root mean squared error divided by the range of the data|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html)|Divide by range of the data|
root_mean_squared_log_error|Root mean squared log error is the square root of the expected squared logarithmic error|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_log_error.html)|None|
normalized_root_mean_squared_log_error|Normalized Root mean squared log error is root mean squared log error divided by the range of the data|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_log_error.html)|Divide by range of the data|
