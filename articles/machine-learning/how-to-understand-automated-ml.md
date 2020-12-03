---
title: Evaluate automated machine learning experiment results
titleSuffix: Azure Machine Learning
description: Learn how to view and evaluate charts and metrics for each of your automated machine learning experiment runs. 
services: machine-learning
author: gregorybchris
ms.author: chgrego
ms.reviewer: nibaccam
ms.service: machine-learning
ms.subservice: core
ms.date: 11/30/2020
ms.topic: conceptual
ms.custom: how-to, contperfq2, automl
---

# Evaluate automated machine learning experiment results

In this article, learn how to evaluate and compare models trained during your automated machine learning (automated ML) experiment. Over the course of an automated ML experiment many runs will be created, each run training a model and then generating evaluation metrics and charts that help you measure the model's performance. 

## Prerequisites

- An Azure subscription. (If you don't have an Azure subscription, [create a free account](https://aka.ms/AMLFree) before you begin)
- An Azure Machine Learning experiment created with either:
  - The [Azure Machine Learning studio](how-to-use-automated-ml-for-ml-models.md) (no code required)
  - The [Azure Machine Learning Python SDK](how-to-configure-auto-train.md)

## View run results

After your automated ML experiment completes, a history of the runs can be found using:
  - A browser with [Azure Machine Learning studio](overview-what-is-machine-learning-studio.md)
  - A Jupyter notebook using the [RunDetails Jupyter widget](/python/api/azureml-widgets/azureml.widgets.rundetails?view=azure-ml-py&preserve-view=true)

To view the run history and model evaluation metrics and charts in the studio:

1. [Sign into the studio](https://ml.azure.com/) and navigate to your workspace
1. In the left menu, select **Experiments**
1. Select your experiment from the list of experiments
1. In the table at the bottom of the page, select an automated ML run
1. In the **Models** tab, select the **Algorithm name** for the model you want to evaluate
1. In the **Metrics** tab, use the checkboxes on the left to view metrics and charts

![Steps to view metrics in studio](./media/how-to-understand-automated-ml/how-to-studio-metrics.gif)

## Charts/metrics overview

Automated ML supports model evaluation metrics and charts for classification, regression, and forecasting tasks. Regression and forecasting metrics are the same. This section offers an overview of all metrics and charts supported by automated ML. Clicking on any of these links will direct you to more details within this page. 

### Charts

| Classification                                              | Regression/forecasting                   |
| ----------------------------------------------------------- | ---------------------------------------- |
| [Confusion matrix](#confusion-matrix)                       | [Residuals histogram](#residuals)        |
| [Receiver operating characteristic (ROC) curve](#roc-curve) | [Predicted vs. true](#predicted-vs-true) |
| [Precision-recall (PR) curve](#precision-recall-curve)      |                                          |
| [Lift curve](#lift-curve)                                   |                                          |
| [Cumulative gains curve](#cumulative-gains-curve)           |                                          |
| [Calibration curve](#calibration-curve)                     |                                          |

### Metrics

| Classification                                         | Objective | Range      | Regression/forecasting                                     | Objective | Range       |
| ------------------------------------------------------ | --------- | ---------- | ---------------------------------------------------------- | --------- | ----------- |
| [AUC_macro](#auc)                                      | Max       | `[0, 1]`   | [explained_variance](#explained-variance)                  | Max       | `(-inf, 1]` |
| [AUC_micro](#auc)                                      | Max       | `[0, 1]`   | [r2_score](#r2)                                            | Max       | `(-inf, 1]` |
| [AUC_weighted](#auc)                                   | Max       | `[0, 1]`   | [spearman_correlation](#spearman-correlation)              | Max       | `[-1, 1]`   |
| [accuracy](#accuracy)                                  | Max       | `[0, 1]`   | [mean_absolute_error](#mean-absolute-error)                | Min       | `[0, inf)`  |
| [average_precision_score_macro](#average-precision)    | Max       | `[0, 1]`   | [normalized_mean_absolute_error](#mean-absolute-error)     | Min       | `[0, inf)`  |
| [average_precision_score_micro](#average-precision)    | Max       | `[0, 1]`   | [median_absolute_error](#median-absolute-error)            | Min       | `[0, inf)`  |
| [average_precision_score_weighted](#average-precision) | Max       | `[0, 1]`   | [normalized_median_absolute_error](#median-absolute-error) | Min       | `[0, inf)`  |
| [balanced_accuracy](#balanced-accuracy)                | Max       | `[0, 1]`   | [root_mean_squared_error](#rmse)                           | Min       | `[0, inf)`  |
| [f1_score_macro](#f1)                                  | Max       | `[0, 1]`   | [normalized_root_mean_squared_error](#rmse)                | Min       | `[0, inf)`  |
| [f1_score_micro](#f1)                                  | Max       | `[0, 1]`   | [root_mean_squared_log_error](#rmsle)                      | Min       | `[0, inf)`  |
| [f1_score_weighted](#f1)                               | Max       | `[0, 1]`   | [normalized_root_mean_squared_log_error](#rmsle)           | Min       | `[0, inf)`  |
| [log_loss](#log-loss)                                  | Min       | `[0, inf)` | [mean_absolute_percentage_error](#mape)                    | Min       | `[0, inf)`  |
| [matthews_correlation](#matthews-correlation)          | Max       | `[-1, 1]`  |                                                            |           |             |
| [norm_macro_recall](#normalized-macro-recall)          | Max       | `[0, 1]`   |                                                            |           |             |
| [precision_score_macro](#precision)                    | Max       | `[0, 1]`   |                                                            |           |             |
| [precision_score_micro](#precision)                    | Max       | `[0, 1]`   |                                                            |           |             |
| [precision_score_weighted](#precision)                 | Max       | `[0, 1]`   |                                                            |           |             |
| [recall_score_macro](#recall)                          | Max       | `[0, 1]`   |                                                            |           |             |
| [recall_score_micro](#recall)                          | Max       | `[0, 1]`   |                                                            |           |             |
| [recall_score_weighted](#recall)                       | Max       | `[0, 1]`   |                                                            |           |             |
| [weighted_accuracy](#weighted-accuracy)                | Max       | `[0, 1]`   |                                                            |           |             |

## Classification metrics

> Note: Groups of classification metrics may differ only in how the classes are weighted. Please see the section on [class averaged metrics](#class-averaged-metrics) to learn more.

### AUC

AUC is the area under the receiver operating characteristic (ROC) curve.

Actual supported metric names are `AUC_macro`, `AUC_micro`, and `AUC_weighted`
> Based on the [scikit-learn implementation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html)

### Accuracy

Accuracy is the ratio of predictions that exactly match the true class labels.

Actual supported metric names are `AUC_macro`, `AUC_micro`, and `AUC_weighted`

> Based on the [scikit-learn implementation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html)

### Average precision

Average precision summarizes a precision-recall curve as the weighted mean of precisions achieved at each threshold, with the increase in recall from the previous threshold used as the weight.

Actual supported metric names are `average_precision_score_macro`, `average_precision_score_micro`, and `average_precision_score_weighted`.

> Based on the [scikit-learn implementation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html)

### Balanced accuracy

Balanced accuracy is equivalent to the macro-averaged [recall](#recall).

> Based on the [scikit-learn implementation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)

### F1

F1 is the harmonic mean of precision and recall. It is a good balanced measure of both false positives and false negatives. However, it does not take true negatives into account.

Actual supported metric names are `f1_score_macro`, `f1_score_micro`, and `f1_score_weighted`.

> Based on the [scikit-learn implementation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html)

### Log loss

Log loss is the loss function used in (multinomial) logistic regression - and extensions of it such as neural networks - defined as the negative log-likelihood of the true labels given a probabilistic classifier's predictions.

For a single sample with true label `yt` in `{0, 1}` and estimated probability `yp` that `yt = 1`, the log loss is `-log P(yt|yp) = -(yt log(yp) + (1 - yt) log(1 - yp))`.
> Based on the [scikit-learn implementation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.log_loss.html)

### Matthews correlation

The Matthews correlation coefficient is a balanced measure of accuracy, which can be used even if one class has many more samples than another. A coefficient of 1 indicates perfect prediction, 0 random prediction, and -1 inverse prediction.
> Based on the [scikit-learn implementation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.matthews_corrcoef.html)

### Normalized macro recall

Normalized macro recall is recall macro-averaged and normalized so that random performance has a score of 0 and perfect performance has a score of 1.

The metric is calculated with `norm_macro_recall := (recall_score_macro - R) / (1 - R)`, where `R` is the expected value of `recall_score_macro` for random predictions (`R = 0.5` for binary classification and `R = (1 / C)` for C-class classification problems).

### Precision

Precision is the ability of a model to avoid labeling negative samples as positive. Precision for binary classification is calculated as `precision = tp / (tp + fp)` where tp = number of true positives, fp = number of false positives.

Actual supported metric names are `precision_score_macro`, `precision_score_micro`, and `precision_score_weighted`.

> Based on the [scikit-learn implementation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html)

### Recall

Recall is the ability of a model to detect all positive samples. Recall for binary classification is calculated as `recall = tp / (tp + fn)` where tp = number of true positives, fn = number of false negatives.

Actual supported metric names are `recall_score_macro`, `recall_score_micro`, and `recall_score_weighted`.

> Based on the [scikit-learn implementation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)

### Weighted accuracy

Weighted accuracy is accuracy where each sample is weighted by the total number of samples belonging to the same class.
> Based on the [scikit-learn implementation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html)

## Class-averaged metrics

Many classification metrics are defined for binary classification on two classes and require averaging over classes to produce one score for multiclass classification. Scikit-learn provides several averaging methods, three of which automated ML exposes: **macro**, **micro**, and **weighted**.

- **Macro** - Calculate the metric for each class and take the unweighted average
- **Micro** - Calculate the metric globally by counting the total true positives, false negatives, and false positives (independent of classes).
- **Weighted** - Calculate the metric for each class and take the weighted average based on the number of samples per class.

While each averaging method has its benefits, one common consideration when selecting the appropriate method is class imbalance. If classes have different numbers of samples, it might be more informative to use a macro average where minority classes are given equal weighting to majority classes.

## Binary vs. multiclass classification metrics

Automated ML doesn't differentiate between binary and multiclass metrics. The same validation metrics are reported whether a dataset has two classes or more than two classes. However, some metrics are intended for multiclass classification. When applied to a binary dataset, these metrics won't treat any class as the `true` class, as you might expect. Metrics that are clearly meant for multiclass are suffixed with `micro`, `macro`, or `weighted`. Examples include `average_precision_score`, `f1_score`, `precision_score`, `recall_score`, and `AUC`.

For example, instead of calculating recall as `tp / (tp + fn)`, the multiclass averaged recall (`micro`, `macro`, or `weighted`) averages over both classes of a binary classification dataset. This is equivalent to calculating the recall for the `true` class and the `false` class separately, and then taking the average of the two.

## Classification charts

> Note: Each of the line charts produced for automated ML models can be used to evaluate the model per-class or averaged over all classes. You can switch between these different views by clicking on class labels in the legend to the right of the chart. Please see the section on [class averaged metrics](#class-averaged-metrics) to learn more about averaging methods.


### Confusion matrix

Confusion matrices provide a visual intuition for how a machine learning model is making systematic errors in its predictions. The word "confusion" in the name comes from a model "confusing" or mislabeling samples. A cell at row `i` and column `j` in a confusion matrix contains the number of samples in the evaluation dataset that belong to class `C_i` and were classified by the model as class `C_j`.

In the studio, a darker cell indicates a higher number of samples. Selecting **Normalized** view in the dropdown will normalize over each matrix row to show the percent of class `C_i` predicted to be class `C_j`. The benefit of the default **Raw** view is that you can see whether imbalance in the distribution of actual classes caused the model to misclassify samples from the minority class, a common issue in imbalanced datasets.

The confusion matrix of a good model will have most samples along the diagonal.

#### Confusion matrix for a good model 
![Confusion matrix for a good model ](./media/how-to-understand-automated-ml/chart-confusion-matrix-good.png)

#### Confusion matrix for a bad model
![Confusion matrix for a bad model](./media/how-to-understand-automated-ml/chart-confusion-matrix-bad.png)

### ROC curve

The receiver operating characteristic (ROC) curve plots the relationship between true positive rate (TPR) and false positive rate (FPR) as the decision threshold changes. The ROC curve can be less informative when training models on datasets with high class imbalance, as the majority class can drown out contributions from minority classes.

The area under the curve (AUC) can be interpreted as the proportion of correctly classified samples. More precisely, the AUC is the probability that the classifier ranks a randomly chosen positive sample higher than a randomly chosen negative sample. The shape of the curve gives an intuition for relationship between TPR and FPR as a function of the classification threshold or decision boundary.

A curve that approaches the top-left corner of the chart is approaching a 100% TPR and 0% FPR, the best possible model. A random model would produce an ROC curve along the `y = x` line from the bottom-left corner to the top-right. A worse than random model would have an ROC curve that dips below the `y = x` line.

#### ROC curve for a good model
![ROC curve for a good model](./media/how-to-understand-automated-ml/chart-roc-curve-good.png)

#### ROC curve for a bad model
![ROC curve for a bad model](./media/how-to-understand-automated-ml/chart-roc-curve-bad.png)

### Precision-recall curve

The precision-recall curve plots the relationship between precision and recall as the decision threshold changes. Recall is the ability of a model to detect all positive samples and precision is the ability of a model to avoid labeling negative samples as positive. Some business problems might require higher recall and some higher precision depending on the relative importance of avoiding false negatives vs false positives.

#### Precision-recall curve for a good model
![Precision-recall curve for a good model](./media/how-to-understand-automated-ml/chart-precision-recall-curve-good.png)

#### Precision-recall curve for a bad model
![Precision-recall curve for a bad model](./media/how-to-understand-automated-ml/chart-precision-recall-curve-bad.png)

### Cumulative gains curve

The cumulative gains curve plots the percent of positive samples correctly classified as a function of the percent of samples considered where we consider samples in the order of predicted probability.

To calculate gain, first sort all samples from highest to lowest probability predicted by the model. Then take `x%` of the highest confidence predictions. Divide the number of positive samples detected in that `x%` by the total number of positive samples to get the gain. Cumulative gain is the percent of positive samples we detect when considering some percent of the data that is most likely to belong to the positive class.

A perfect model will rank all positive samples above all negative samples giving a cumulative gains curve made up of two straight segments. The first is a line with slope `1 / x` from `(0, 0)` to `(x, 1)` where `x` is the fraction of samples that belong to the positive class (`1 / num_classes` if classes are balanced). The second is a horizontal line from `(x, 1)` to `(1, 1)`. In the first segment, all positive samples are classified correctly and cumulative gain goes to `100%` within the first `x%` of samples considered.

The baseline random model will have a cumulative gains curve following `y = x` where for `x%` of samples considered only about `x%` of the total positive samples were detected. A perfect model will have a micro average curve that touches the top-left corner and a macro average line that has slope `1 / num_classes` until cumulative gain is 100% and then horizontal until the data percent is 100.

#### Cumulative gains curve for a good model
![Cumulative gains curve for a good model](./media/how-to-understand-automated-ml/chart-cumulative-gains-curve-good.png)

#### Cumulative gains curve for a bad model
![Cumulative gains curve for a bad model](./media/how-to-understand-automated-ml/chart-cumulative-gains-curve-bad.png)

### Lift curve

The lift curve shows how many times better a model performs compared to a random model. Lift is defined as the ratio of cumulative gain to the cumulative gain of a random model.

This relative performance takes into account the fact that classification gets harder as you increase the number of classes. (A random model incorrectly predicts a higher fraction of samples from a dataset with 10 classes compared to a dataset with two classes)

The baseline lift curve is the `y = 1` line where the model performance is consistent with that of a random model. In general, the lift curve for a good model will be higher on that chart and farther from the x-axis, showing that when the model is most confident in its predictions it performs many times better than random guessing.

#### Lift curve for a good model
![Lift curve for a good model](./media/how-to-understand-automated-ml/chart-lift-curve-good.png)
 
#### Lift curve for a bad model
![Lift curve for a bad model](./media/how-to-understand-automated-ml/chart-lift-curve-bad.png)

### Calibration curve

The calibration curve plots a model's confidence in its predictions against the proportion of positive samples at each confidence level. A well-calibrated model will correctly classify 100% of the predictions to which it assigns 100% confidence, 50% of the predictions it assigns 50% confidence, 20% of the predictions it assigns a 20% confidence, and so on. A perfectly calibrated model will have a calibration curve following the `y = x` line where the model perfectly predicts the probability that samples belong to each class.

An over-confident model will over-predict probabilities close to zero and one, rarely being uncertain about the class of each sample and the calibration curve will look similar to backward "S". An under-confident model will assign a lower probability on average to the class it predicts and the associated calibration curve will look similar to an "S". The calibration curve does not depict a model's ability to classify correctly, but instead its ability to correctly assign confidence to its predictions. A bad model can still have a good calibration curve if the model correctly assigns low confidence and high uncertainty.

> Note: the calibration curve is sensitive to the number of samples, so a small validation set can produce noisy results that can be hard to interpret. This does not necessarily mean 

#### Calibration curve for a good model
![Calibration curve for a good model](./media/how-to-understand-automated-ml/chart-calibration-curve-good.png)

#### Calibration curve for a bad model
![Calibration curve for a bad model](./media/how-to-understand-automated-ml/chart-calibration-curve-bad.png)

## Regression/forecasting metrics

> Note: Pairs of regression/forecasting metrics may differ only in the normalization. Please see the section on [metric normalization](#metric-normalization) to learn more.

### Explained variance

Explained variance measures the extent to which a model accounts for the variation in the target variable. It is the percent decrease in variance of the original data to the variance of the errors. When the mean of the errors is 0, it is equal to the coefficient of determination (see [R^2](#r2) below).
> Based on the [scikit-learn implementation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.explained_variance_score.html)

### R^2

R^2 is the coefficient of determination or the percent reduction in squared errors compared to a baseline model that predicts the mean.
> Based on the [scikit-learn implementation](https://scikit-learn.org/0.16/modules/generated/sklearn.metrics.r2_score.html)

### Spearman correlation

Spearman correlation is a nonparametric measure of the monotonicity of the relationship between two datasets. Unlike the Pearson correlation, the Spearman correlation does not assume that both datasets are normally distributed. Like other correlation coefficients, Spearman varies between -1 and 1 with 0 implying no correlation. Correlations of -1 or 1 imply an exact monotonic relationship.

Spearman is a rank-order correlation metric meaning that changes to predicted or actual values will not change the Spearman result if they do not change the rank order of predicted or actual values.
> Based on the [scipy implementation](https://docs.scipy.org/doc/scipy-0.16.1/reference/generated/scipy.stats.spearmanr.html)

### Mean absolute error

Mean absolute error is the expected value of absolute value of difference between the target and the prediction.

Actual supported metric names are `mean_absolute_error` and `normalized_mean_absolute_error`.

> Based on the [scikit-learn implementation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_absolute_error.html)

### Median absolute error

Median absolute error is the median of all absolute differences between the target and the prediction. This loss is robust to outliers.

Actual supported metric names are `median_absolute_error` and `normalized_median_absolute_error`.

> Based on the [scikit-learn implementation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.median_absolute_error.html)

### RMSE

Root mean squared error (RMSE) is the square root of the expected squared difference between the target and the prediction. For an unbiased estimator, RMSE is equal to the standard deviation.

Actual supported metric names are `root_mean_squared_error` and `normalized_root_mean_squared_error`.

> Based on the [scikit-learn implementation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html)

### RMSLE

Root mean squared log error (RMSLE) is the square root of the expected squared logarithmic error.

Actual supported metric names are `root_mean_squared_log_error` and `normalized_root_mean_squared_log_error`.

> Based on the [scikit-learn implementation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_log_error.html)

### MAPE

Mean absolute percentage error (MAPE) is a measure of the average difference between a predicted value and the actual value.

## Metric normalization

Normalizing regression and forecasting metrics enables comparison between models trained on data with different ranges. A model trained on a data with a larger range will have higher error than the same model trained on data with a smaller range unless that error is normalized.

While there is no standard method of normalizing error metrics, automated ML takes the common approach of dividing the error by the range of the data: `normalized_error = error / (y_max - y_min)`

When evaluating a forecasting model on time series data automated ML takes extra steps to ensure that normalization happens per time series ID (grain) as each time series will likely have a different distribution of target values.

## Regression/forecasting charts

## Residuals

The residuals chart is a histogram of the prediction errors (residuals). Residuals are calculated as `y_predicted - y_true` for all samples and then displayed as a histogram to show model bias.

In this example, note that both models are slightly biased to predict lower than the actual value. This is not uncommon for a dataset with a skewed distribution of actual targets, but indicates worse model performance. A good model will have a residuals distribution that peaks at zero with few residuals at the extremes. A worse model will have a spread out residuals distribution with fewer samples around zero.

#### Residuals chart for a good model
![Residuals chart for a good model](./media/how-to-understand-automated-ml/chart-residuals-good.png)

#### Residuals chart for a bad model
![Residuals chart for a bad model](./media/how-to-understand-automated-ml/chart-residuals-bad.png)

### Predicted vs. true

The predicted vs. true chart plots the relationship between the target feature (true/actual values) and the model's predictions. The true values are binned along the x-axis and for each bin the mean predicted value is plotted with error bars. This allows you to see if a model is biased toward predicting certain values. The line displays the average prediction and the shaded area indicates the variance of predictions around that mean.

Often, the most common true value will have the most accurate predictions with the lowest variance. The distance of the trend line from the ideal `y = x` line where there are few true values is a good measure of model performance on outliers. You can use the histogram at the bottom of the chart to reason about the actual data distribution. Including more data samples where the distribution is sparse can improve model performance on unseen data.

In this example, note that the better model has a predicted vs. true line that is closer to the ideal `y = x` line.

#### Predicted vs. true chart for a good model
![Predicted vs. true chart for a good model](./media/how-to-understand-automated-ml/chart-predicted-true-good.png)

#### Predicted vs. true chart for a bad model
![Predicted vs. true chart for a bad model](./media/how-to-understand-automated-ml/chart-predicted-true-bad.png)

## Model explanations and feature importances

While model evaluation metrics/charts are good for measuring the general quality of a model, inspecting which dataset features a model used to make its predictions is essential when practicing responsible AI. That's why automated ML provides a model interpretability dashboard to measure and report the relative contributions of dataset features.

![Feature importances](./media/how-to-understand-automated-ml/how-to-feature-importance.gif)

To view the interpretability dashboard in the studio:

1. [Sign into the studio](https://ml.azure.com/) and navigate to your workspace
2. In the left menu, select **Experiments**
3. Select your experiment from the list of experiments
4. In the table at the bottom of the page, select an AutoML run
5. In the **Models** tab, select the **Algorithm name** for the model you want to explain
6. In the **Explanations** tab, you may see an explanation was already created if the model was the best
7. To create a new explanation, click **Explain model** and select the remote compute with which to compute explanations

For more information, see the documentation on [responsible AI offerings in automated ML](how-to-machine-learning-interpretability-automl.md).

> Note: The ForecastTCN model is not currently supported by automated ML explanations and other forecasting models may have limited access to interpretability tools.
