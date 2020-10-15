---
title: Evaluate AutoML experiment results
titleSuffix: Azure Machine Learning
description: Learn how to view and evaluate charts and metrics for each of your automated machine learning experiment runs. 
services: machine-learning
author: aniththa
ms.author: anumamah
ms.reviewer: nibaccam
ms.service: machine-learning
ms.subservice: core
ms.date: 10/09/2020
ms.topic: conceptual
ms.custom: how-to, contperfq2
---

# Evaluate automated machine learning experiment results

In this article, learn how to view and evaluate the results of your automated machine learning, AutoML, experiments. These experiments consist of multiple runs, where each run creates a model. To help you evaluate each model, AutoML automatically generates performance metrics and charts specific to your experiment type. 

For example, AutoML provides different charts for classification and regression models. 

|Classification|Regression
|---|---|
|<li> [Confusion matrix](#confusion-matrix) <li>[Precision-Recall chart](#precision-recall-chart) <li> [Receiver operating characteristics (or ROC)](#roc) <li> [Lift curve](#lift-curve)<li> [Gains curve](#gains-curve)<li> [Calibration plot](#calibration-plot) | <li> [Predicted vs. True](#pvt) <li> [Histogram of residuals](#histo)|

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

* Create an experiment for your automated machine learning run, either with the SDK, or in Azure Machine Learning studio.

    * Use the SDK to build a [classification model](how-to-auto-train-remote.md) or [regression model](tutorial-auto-train-models.md)
    * Use [Azure Machine Learning studio](how-to-use-automated-ml-for-ml-models.md) to create a classification or regression model by uploading the appropriate data.

## View run results

After your automated machine learning experiment completes, a history of the runs can be found in your machine learning workspace via the [Azure Machine Learning studio](overview-what-is-machine-learning-studio.md). 

For SDK experiments, you can see these same results during a run when you use the `RunDetails` [Jupyter widget](https://docs.microsoft.com/python/api/azureml-widgets/azureml.widgets?view=azure-ml-py&preserve-view=true).

The following steps and animation show how to view the run history and performance metrics and charts of a specific model in the studio.

![Steps to view run history and model performance metrics and charts](./media/how-to-understand-automated-ml/view-run-metrics-ui.gif)

To view the run history and model performance metrics and charts in the studio: 

1. [Sign into the studio](https://ml.azure.com/) and navigate to your workspace.
1. In the left panel of the workspace, select **Runs**.
1. In the list of experiments, select the one you want to explore.
1. In the bottom table, select the **Run**.
1. In the **Models** tab, select the **Algorithm name** for the model that you want to explore.
1. On the **Metrics** tab, select what metrics and charts you want to evaluate for that model. 


<a name="classification"></a> 

## Classification performance metrics

The following table summarizes the model performance metrics that AutoML calculates for each classification model generated for your experiment. 

Metric|Description|Calculation|Extra Parameters
--|--|--|--
AUC_macro| AUC is the Area under the Receiver Operating Characteristic Curve. Macro is the arithmetic mean of the AUC for each class.  | [Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html) | average="macro"|
AUC_micro| AUC is the Area under the Receiver Operating Characteristic Curve. Micro is computed globally by combining the true positives and false positives from each class.| [Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html) | average="micro"|
AUC_weighted  | AUC is the Area under the Receiver Operating Characteristic Curve. Weighted is the arithmetic mean of the score for each class, weighted by the number of true instances in each class.| [Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html)|average="weighted"
accuracy|Accuracy is the percent of predicted labels that exactly match the true labels. |[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html) |None|
average_precision_score_macro|Average precision summarizes a precision-recall curve as the weighted mean of precisions achieved at each threshold, with the increase in recall from the previous threshold used as the weight. Macro is the arithmetic mean of the average precision score of each class.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html)|average="macro"|
average_precision_score_micro|Average precision summarizes a precision-recall curve as the weighted mean of precisions achieved at each threshold, with the increase in recall from the previous threshold used as the weight. Micro is computed globally by combining the true positives and false positives at each cutoff.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html)|average="micro"|
average_precision_score_weighted|Average precision summarizes a precision-recall curve as the weighted mean of precisions achieved at each threshold, with the increase in recall from the previous threshold used as the weight. Weighted is the arithmetic mean of the average precision score for each class, weighted by the number of true instances in each class.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html)|average="weighted"|
balanced_accuracy|Balanced accuracy is the arithmetic mean of recall for each class.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|average="macro"|
f1_score_macro|F1 score is the harmonic mean of precision and recall. Macro is the arithmetic mean of F1 score for each class.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html)|average="macro"|
f1_score_micro|F1 score is the harmonic mean of precision and recall. Micro is computed globally by counting the total true positives, false negatives, and false positives.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html)|average="micro"|
f1_score_weighted|F1 score is the harmonic mean of precision and recall. Weighted mean by class frequency of F1 score for each class|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html)|average="weighted"|
log_loss|This is the loss function used in (multinomial) logistic regression and extensions of it such as neural networks, defined as the negative log-likelihood of the true labels given a probabilistic classifier's predictions. For a single sample with true label yt in {0,1} and estimated probability yp that yt = 1, the log loss is -log P(yt&#124;yp) = -(yt log(yp) + (1 - yt) log(1 - yp)).|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.log_loss.html)|None|
norm_macro_recall|Normalized Macro Recall is Macro Recall normalized so that random performance has a score of 0 and perfect performance has a score of 1. This is achieved by norm_macro_recall := (recall_score_macro - R)/(1 - R), where R is the expected value of recall_score_macro for random predictions (i.e., R=0.5 for binary classification and R=(1/C) for C-class classification problems).|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|average = "macro" |
precision_score_macro|Precision is the percent of positively predicted elements that are correctly labeled. Macro is the arithmetic mean of precision for each class.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html)|average="macro"|
precision_score_micro|Precision is the percent of positively predicted elements that are correctly labeled. Micro is computed globally by counting the total true positives and false positives.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html)|average="micro"|
precision_score_weighted|Precision is the percent of positively predicted elements that are correctly labeled. Weighted is the arithmetic mean of precision for each class, weighted by number of true instances in each class.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html)|average="weighted"|
recall_score_macro|Recall is the percent of correctly labeled elements of a certain class. Macro is the arithmetic mean of recall for each class.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|average="macro"|
recall_score_micro|Recall is the percent of correctly labeled elements of a certain class. Micro is computed globally by counting the total true positives, false negatives and false positives|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|average="micro"|
recall_score_weighted|Recall is the percent of correctly labeled elements of a certain class. Weighted is the arithmetic mean of recall for each class, weighted by number of true instances in each class.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|average="weighted"|
weighted_accuracy|Weighted accuracy is accuracy where the weight given to each example is equal to the proportion of true instances in that example's true class.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html)|sample_weight is a vector equal to the proportion of that class for each element in the target|

### Binary vs. multiclass metrics

AutoML doesn't differentiate between binary and multiclass metrics. The same validation metrics are reported whether a dataset has two classes or more than two classes. However, some metrics are intended for multiclass classification. When applied to a binary dataset, these metrics won't treat any class as the `true` class, as you might expect. Metrics that are clearly meant for multiclass are suffixed with `micro`, `macro`, or `weighted`. Examples include `average_precision_score`, `f1_score`, `precision_score`, `recall_score`, and `AUC`.

For example, instead of calculating recall as `tp / (tp + fn)`, the multiclass averaged recall (`micro`, `macro`, or `weighted`) averages over both classes of a binary classification dataset. This is equivalent to calculating the recall for the `true` class and the `false` class separately, and then taking the average of the two.

## Confusion matrix

A confusion matrix describes the performance of a classification model. Each row displays the instances of the true, or actual class in your dataset, and each column represents the instances of the class that was predicted by the model. 

For each confusion matrix, automated ML shows the frequency of each predicted label (column) compared against the true label (row). The darker the color, the higher the count in that particular part of the matrix. 

### What does a good model look like?

A confusion matrix compares the actual value of the dataset against the predicted values that the model gave. Because of this, machine learning models have higher accuracy if the model has most of its values along the diagonal, meaning the model predicted the correct value. If a model has class imbalance, the confusion matrix helps to detect a biased model.

#### Example 1: A classification model with poor accuracy
![A classification model with poor accuracy](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-confusion-matrix1.png)

#### Example 2: A classification model with high accuracy 
![A classification model with high accuracy](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-confusion-matrix2.png)

##### Example 3: A classification model with high accuracy and high bias in model predictions
![A classification model with high accuracy and high bias in model predictions](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-biased-model.png)

<a name="precision-recall-chart"></a>

## Precision-recall chart

The precision-recall curve shows the relationship between precision and recall from a model. The term precision represents the ability for a model to label all instances correctly. Recall represents the ability for a classifier to find all instances of a particular label.

With this chart, you can compare the precision-recall curves for each model to determine which model has an acceptable relationship between precision and recall for your particular business problem. This chart shows Macro Average Precision-Recall, Micro Average Precision-Recall, and the precision-recall associated with all classes for a model. 

**Macro-average** computes the metric independently of each class and then takes the average, treating all classes equally. However, **micro-average** aggregates the contributions of all the classes to compute the average. Micro-average is preferable if there is class imbalance present in the dataset.

### What does a good model look like?
Depending on the goal of the business problem, the ideal precision-recall curve could differ. 

##### Example 1: A classification model with low precision and low recall
![A classification model with low precision and low recall](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-precision-recall1.png)

##### Example 2: A classification model with ~100% precision and ~100% recall 
![A classification model high precision and recall](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-precision-recall2.png)

<a name="roc"></a>

## ROC chart

The receiver operating characteristic (or ROC) is a plot of the correctly classified labels vs. the incorrectly classified labels for a particular model. The ROC curve can be less informative when training models on datasets with high class imbalance, as the majority class can drown out contribution from minority classes.

You can visualize the area under the ROC chart as the proportion of correctly classified samples. An advanced user of the ROC chart might look beyond the area under the curve and get an intuition for the true positive and false positive rates as a function of the classification threshold or decision boundary.

### What does a good model look like?
An ROC curve that approaches the top left corner with 100% true positive rate and 0% false positive rate will be the best model. A random model would display as a flat line from the bottom left to the top right corner. Worse than random would dip below the y=x line.

#### Example 1: A classification model with low true labels and high false labels
![Classification model with low true labels and high false labels](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-roc-1.png)

#### Example 2: A classification model with high true labels and low false labels

![a classification model with high true labels and low false labels](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-roc-2.png)


<a name="lift-curve"></a>

## Lift chart

Lift charts evaluate the performance of classification models. A lift chart shows how many times better a model performs compared to a random model. This gives you a relative performance that takes into account the fact that classification gets harder as you increase the number of classes. A random model incorrectly predicts a higher fraction of samples from a dataset with ten classes compared to a dataset with two classes.

You can compare the lift of the model built automatically with Azure Machine Learning to the baseline (random model) in order to view the value gain of that particular model.

### What does a good model look like?

A higher lift curve, that is the higher your model is above the baseline, indicates a better performing model. 

#### Example 1: A classification model that has poor lift 
![A classification model that does worse than a random selection model](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-lift-curve1.png)

#### Example 2: A classification model that performs better than a random selection model
![A classification model that performs better](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-lift-curve2.png)

<a name="gains-curve"></a>

## Cumulative gains chart

A cumulative gains chart evaluates the performance of a classification model by each portion of the data. For each percentile of the data set, the chart shows how many more samples have been accurately classified compared to a model that's always incorrect. This information provides another way of looking at the results in the accompanying lift chart.

The cumulative gains chart helps you choose the classification cutoff using a percentage that corresponds to a desired gain from the model. 
You can compare the cumulative gains chart to the baseline (incorrect model) to see the percent of samples that were correctly classified at each confidence percentile.

#### What does a good model look like?

Similar to a lift chart, the higher your cumulative gains curve is above the baseline, the better your model is performing. Additionally, the closer your cumulative gains curve is to the top left corner of the graph, the greater gain your model is achieving versus the baseline. 

##### Example 1: A classification model with minimal gain
![a classification model with minimal gain](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-gains-curve1.png)

##### Example 2: A classification model with significant gain
![A classification model with significant gain](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-gains-curve2.png)

<a name="calibration-plot"></a>

## Calibration chart

A calibration plot displays the confidence of a predictive model. It does this by showing the relationship between the predicted probability and the actual probability, where "probability" represents the likelihood that a particular instance belongs under some label.

For all classification problems, you can review the calibration line for micro-average, macro-average, and each class in a given predictive model.

**Macro-average** computes the metric independently of each class and then take the average, treating all classes equally. However, **micro-average** aggregates the contributions of all the classes to compute the average. 

### What does a good model look like?
A well-calibrated model aligns with the y=x line, where it correctly predicts the probability that samples belong to each class. An over-confident model will over-predict probabilities close to zero and one, rarely being uncertain about the class of each sample.

#### Example 1: A well-calibrated model
![ more well-calibrated model](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-calib-curve1.png)

#### Example 2: An over-confident model
![An over-confident model](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-calib-curve2.png)


<a name="regression"></a> 

## Regression performance metrics

The following table summarizes the model performance metrics that AutoML calculates for each regression or forecasting model that is generated for your experiment. 

|Metric|Description|Calculation|Extra Parameters
--|--|--|--|
explained_variance|Explained variance is  the proportion to which a mathematical model accounts for the variation of a given data set. It is the percent decrease in variance of the original data to the variance of the errors. When the mean of the errors is 0, it is equal to the coefficient of determination (see r2_score below).|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.explained_variance_score.html)|None|
r2_score|R^2 is the coefficient of determination or the percent reduction in squared errors compared to a baseline model that outputs the mean. |[Calculation](https://scikit-learn.org/0.16/modules/generated/sklearn.metrics.r2_score.html)|None|
spearman_correlation|Spearman correlation is a nonparametric measure of the monotonicity of the relationship between two datasets. Unlike the Pearson correlation, the Spearman correlation does not assume that both datasets are normally distributed. Like other correlation coefficients, this one varies between -1 and +1 with 0 implying no correlation. Correlations of -1 or +1 imply an exact monotonic relationship. Positive correlations imply that as x increases, so does y. Negative correlations imply that as x increases, y decreases.|[Calculation](https://docs.scipy.org/doc/scipy-0.16.1/reference/generated/scipy.stats.spearmanr.html)|None|
mean_absolute_error|Mean absolute error is the expected value of absolute value of difference between the target and the prediction|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_absolute_error.html)|None|
normalized_mean_absolute_error|Normalized mean absolute error is mean Absolute Error divided by the range of the data|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_absolute_error.html)|Divide by range of the data|
median_absolute_error|Median absolute error is the median of all absolute differences between the target and the prediction. This loss is robust to outliers.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.median_absolute_error.html)|None|
normalized_median_absolute_error|Normalized median absolute error is median absolute error divided by the range of the data|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.median_absolute_error.html)|Divide by range of the data|
root_mean_squared_error|Root mean squared error is the square root of the expected squared difference between the target and the prediction|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html)|None|
normalized_root_mean_squared_error|Normalized root mean squared error is root mean squared error divided by the range of the data|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html)|Divide by range of the data|
root_mean_squared_log_error|Root mean squared log error is the square root of the expected squared logarithmic error|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_log_error.html)|None|
normalized_root_mean_squared_log_error|Normalized Root mean squared log error is root mean squared log error divided by the range of the data|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_log_error.html)|Divide by range of the data|

<a name="pvt"></a>

## Predicted vs. True chart

Predicted vs. True shows the relationship between a predicted value and its correlating true value for a regression problem. 

After each run, you can see a predicted vs. true graph for each regression model. To protect data privacy, values are binned together and the size of each bin is shown as a bar graph on the bottom portion of the chart area. You can compare the predictive model, with the lighter shade area showing error margins, against the ideal value of where the model should be.

### What does a good model look like?
This graph can be used to measure performance of a model as the closer to the y=x line the predicted values are, the better the accuracy of a predictive model.

#### Example 1: A classification model with low accuracy
![A regression model with low accuracy in predictions](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-regression1.png)

#### Example 2: A regression model with high accuracy 
![A regression model with high accuracy in its predictions](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-regression2.png)

<a name="histo"></a> 

## Histogram of residuals chart

Automated ML automatically provides a residuals chart to show the distribution of errors in the predictions of a regression model. A residual is the difference between the prediction and the actual value (`y_pred - y_true`). 

### What does a good model look like?
To show a margin of error with low bias, the histogram of residuals should be shaped as a bell curve, centered around zero.

#### Example 1: A regression model with bias in its errors
![SA regression model with bias in its errors](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-regression3.png)

#### Example 2: A regression model with more even distribution of errors
![A regression model with more even distribution of errors](./media/how-to-understand-automated-ml/azure-machine-learning-auto-ml-regression4.png)

<a name="explain-model"></a>

## Model interpretability and feature importance
Automated ML provides a machine learning interpretability dashboard for your runs.

For more information on enabling interpretability features, see [Interpretability: model explanations in automated machine learning](how-to-machine-learning-interpretability-automl.md).

> [!NOTE]
> The ForecastTCN model is not currently supported by the Explanation Client. This model does not return an explanation dashboard if it is returned as the best model, and does not support on-demand explanation runs.

## Next steps

+ Learn more about [automated ml](concept-automated-ml.md) in Azure Machine Learning.
+ Try the [automated machine learning model explanation](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/explain-model) sample notebooks.
