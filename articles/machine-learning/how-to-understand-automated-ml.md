---
title: Evaluate AutoML experiment results
titleSuffix: Azure Machine Learning
description: Learn how to view and evaluate charts and metrics for each of your automated machine learning experiment runs. 
services: machine-learning
author: gregorybchris
ms.author: chgrego
ms.reviewer: nibaccam
ms.service: machine-learning
ms.subservice: core
ms.date: 12/09/2020
ms.topic: conceptual
ms.custom: how-to, contperf-fy21q2, automl
---

# Evaluate automated machine learning experiment results

In this article, learn how to evaluate and compare models trained by your automated machine learning (automated ML) experiment. Over the course of an automated ML experiment, many runs are created and each run creates a model. For each model, automated ML generates evaluation metrics and charts that help you measure the model's performance. 

For example, automated ML generates the following charts based on experiment type.

| Classification| Regression/forecasting |
| ----------------------------------------------------------- | ---------------------------------------- |
| [Confusion matrix](#confusion-matrix)                       | [Residuals histogram](#residuals)        |
| [Receiver operating characteristic (ROC) curve](#roc-curve) | [Predicted vs. true](#predicted-vs-true) |
| [Precision-recall (PR) curve](#precision-recall-curve)      |                                          |
| [Lift curve](#lift-curve)                                   |                                          |
| [Cumulative gains curve](#cumulative-gains-curve)           |                                          |
| [Calibration curve](#calibration-curve)                     |                     


## Prerequisites

- An Azure subscription. (If you don't have an Azure subscription, [create a free account](https://aka.ms/AMLFree) before you begin)
- An Azure Machine Learning experiment created with either:
  - The [Azure Machine Learning studio](how-to-use-automated-ml-for-ml-models.md) (no code required)
  - The [Azure Machine Learning Python SDK](how-to-configure-auto-train.md)

## View run results

After your automated ML experiment completes, a history of the runs can be found via:
  - A browser with [Azure Machine Learning studio](overview-what-is-machine-learning-studio.md)
  - A Jupyter notebook using the [RunDetails Jupyter widget](/python/api/azureml-widgets/azureml.widgets.rundetails)

The following steps and video, show you how to view the run history and model evaluation metrics and charts in the studio:

1. [Sign into the studio](https://ml.azure.com/) and navigate to your workspace.
1. In the left menu, select **Experiments**.
1. Select your experiment from the list of experiments.
1. In the table at the bottom of the page, select an automated ML run.
1. In the **Models** tab, select the **Algorithm name** for the model you want to evaluate.
1. In the **Metrics** tab, use the checkboxes on the left to view metrics and charts.

![Steps to view metrics in studio](./media/how-to-understand-automated-ml/how-to-studio-metrics.gif)

## Classification metrics

Automated ML calculates performance metrics for each classification model generated for your experiment. These metrics are based on the scikit learn implementation. 

Many classification metrics are defined for binary classification on two classes, and require averaging over classes to produce one score for multi-class classification. Scikit-learn provides several averaging methods, three of which automated ML exposes: **macro**, **micro**, and **weighted**.

- **Macro** - Calculate the metric for each class and take the unweighted average
- **Micro** - Calculate the metric globally by counting the total true positives, false negatives, and false positives (independent of classes).
- **Weighted** - Calculate the metric for each class and take the weighted average based on the number of samples per class.

While each averaging method has its benefits, one common consideration when selecting the appropriate method is class imbalance. If classes have different numbers of samples, it might be more informative to use a macro average where minority classes are given equal weighting to majority classes. Learn more about [binary vs multiclass metrics in automated ML](#binary-vs-multiclass-classification-metrics). 

The following table summarizes the model performance metrics that automated ML calculates for each classification model generated for your experiment. For more detail, see the scikit-learn documentation linked in the **Calculation** field of each metric. 

|Metric|Description|Calculation|
|--|--|---|
|AUC | AUC is the Area under the [Receiver Operating Characteristic Curve](#roc-curve).<br><br> **Objective:** Closer to 1 the better <br> **Range:** [0, 1]<br> <br>Supported metric names include, <li>`AUC_macro`, the arithmetic mean of the AUC for each class.<li> `AUC_micro`, computed by combining the true positives and false positives from each class. <li> `AUC_weighted`, arithmetic mean of the score for each class, weighted by the number of true instances in each class.<br><br>Note: The AUC values reported by automated ML may not match the ROC chart if there are only two classes. For binary classification, the underlying scikit-learn implementation of AUC does not actually apply macro/micro/weighted averaging. Instead, the AUC of the most likely positive class is returned. The ROC chart continues to apply class averaging for binary classification just as it does for multiclass.  |[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html) | 
|accuracy| Accuracy is the ratio of predictions that exactly match the true class labels. <br> <br>**Objective:** Closer to 1 the better <br> **Range:** [0, 1]|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html)|
|average_precision|Average precision summarizes a precision-recall curve as the weighted mean of precisions achieved at each threshold, with the increase in recall from the previous threshold used as the weight. <br><br> **Objective:** Closer to 1 the better <br> **Range:** [0, 1]<br> <br>Supported metric names include,<li>`average_precision_score_macro`, the arithmetic mean of the average precision score of each class.<li> `average_precision_score_micro`, computed by combining the true positives and false positives at each cutoff.<li>`average_precision_score_weighted`, the arithmetic mean of the average precision score for each class, weighted by the number of true instances in each class.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.average_precision_score.html)|
balanced_accuracy|Balanced accuracy is the arithmetic mean of recall for each class.<br> <br>**Objective:** Closer to 1 the better <br> **Range:** [0, 1]|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|
f1_score|F1 score is the harmonic mean of precision and recall. It is a good balanced measure of both false positives and false negatives. However, it does not take true negatives into account. <br> <br>**Objective:** Closer to 1 the better <br> **Range:** [0, 1]<br> <br>Supported metric names include,<li>  `f1_score_macro`: the arithmetic mean of F1 score for each class. <li> `f1_score_micro`: computed by counting the total true positives, false negatives, and false positives. <li> `f1_score_weighted`: weighted mean by class frequency of F1 score for each class.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html)|
log_loss|This is the loss function used in (multinomial) logistic regression and extensions of it such as neural networks, defined as the negative log-likelihood of the true labels given a probabilistic classifier's predictions. <br><br> **Objective:** Closer to 0 the better <br> **Range:** [0, inf)|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.log_loss.html)|
norm_macro_recall| Normalized macro recall is recall macro-averaged and normalized, so that random performance has a score of 0, and perfect performance has a score of 1. <br> <br>**Objective:** Closer to 1 the better <br> **Range:** [0, 1] |`(recall_score_macro - R)`&nbsp;/&nbsp;`(1 - R)` <br><br>where, `R` is the expected value of `recall_score_macro` for random predictions.<br><br>`R = 0.5`&nbsp;for&nbsp; binary&nbsp;classification. <br>`R = (1 / C)` for C-class classification problems.|
matthews_correlation | Matthews correlation coefficient is a balanced measure of accuracy, which can be used even if one class has many more samples than another. A coefficient of 1 indicates perfect prediction, 0 random prediction, and -1 inverse prediction.<br><br> **Objective:** Closer to 1 the better <br> **Range:** [-1, 1]|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.matthews_corrcoef.html)|
precision|Precision is the ability of a model to avoid labeling negative samples as positive. <br><br> **Objective:** Closer to 1 the better <br> **Range:** [0, 1]<br> <br>Supported metric names include, <li> `precision_score_macro`, the arithmetic mean of precision for each class. <li> `precision_score_micro`, computed globally by counting the total true positives and false positives. <li> `precision_score_weighted`, the arithmetic mean of precision for each class, weighted by number of true instances in each class.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_score.html)|
recall| Recall is the ability of a model to detect all positive samples. <br><br> **Objective:** Closer to 1 the better <br> **Range:** [0, 1]<br> <br>Supported metric names include, <li>`recall_score_macro`: the arithmetic mean of recall for each class. <li> `recall_score_micro`: computed globally by counting the total true positives, false negatives and false positives.<li> `recall_score_weighted`: the arithmetic mean of recall for each class, weighted by number of true instances in each class.|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.recall_score.html)|
weighted_accuracy|Weighted accuracy is accuracy where each sample is weighted by the total number of samples belonging to the same class. <br><br>**Objective:** Closer to 1 the better <br>**Range:** [0, 1]|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.accuracy_score.html)|

### Binary vs. multiclass classification metrics

Automated ML doesn't differentiate between binary and multiclass metrics. The same validation metrics are reported whether a dataset has two classes or more than two classes. However, some metrics are intended for multiclass classification. When applied to a binary dataset, these metrics won't treat any class as the `true` class, as you might expect. Metrics that are clearly meant for multiclass are suffixed with `micro`, `macro`, or `weighted`. Examples include `average_precision_score`, `f1_score`, `precision_score`, `recall_score`, and `AUC`.

For example, instead of calculating recall as `tp / (tp + fn)`, the multiclass averaged recall (`micro`, `macro`, or `weighted`) averages over both classes of a binary classification dataset. This is equivalent to calculating the recall for the `true` class and the `false` class separately, and then taking the average of the two.

Automated ML doesn't calculate binary metrics, that is metrics for binary classification datasets. However, these metrics can be manually calculated using the [confusion matrix](#confusion-matrix) that Automated ML generated for that particular run. For example, you can calculate precision, `tp / (tp + fp)`,  with the true positive and false positive values shown in a 2x2 confusion matrix chart.

## Confusion matrix

Confusion matrices provide a visual for how a machine learning model is making systematic errors in its predictions for classification models. The word "confusion" in the name comes from a model "confusing" or mislabeling samples. A cell at row `i` and column `j` in a confusion matrix contains the number of samples in the evaluation dataset that belong to class `C_i` and were classified by the model as class `C_j`.

In the studio, a darker cell indicates a higher number of samples. Selecting **Normalized** view in the dropdown will normalize over each matrix row to show the percent of class `C_i` predicted to be class `C_j`. The benefit of the default **Raw** view is that you can see whether imbalance in the distribution of actual classes caused the model to misclassify samples from the minority class, a common issue in imbalanced datasets.

The confusion matrix of a good model will have most samples along the diagonal.

### Confusion matrix for a good model 
![Confusion matrix for a good model ](./media/how-to-understand-automated-ml/chart-confusion-matrix-good.png)

### Confusion matrix for a bad model
![Confusion matrix for a bad model](./media/how-to-understand-automated-ml/chart-confusion-matrix-bad.png)

## ROC curve

The receiver operating characteristic (ROC) curve plots the relationship between true positive rate (TPR) and false positive rate (FPR) as the decision threshold changes. The ROC curve can be less informative when training models on datasets with high class imbalance, as the majority class can drown out contributions from minority classes.

The area under the curve (AUC) can be interpreted as the proportion of correctly classified samples. More precisely, the AUC is the probability that the classifier ranks a randomly chosen positive sample higher than a randomly chosen negative sample. The shape of the curve gives an intuition for relationship between TPR and FPR as a function of the classification threshold or decision boundary.

A curve that approaches the top-left corner of the chart is approaching a 100% TPR and 0% FPR, the best possible model. A random model would produce an ROC curve along the `y = x` line from the bottom-left corner to the top-right. A worse than random model would have an ROC curve that dips below the `y = x` line.
> [!TIP]
> For classification experiments, each of the line charts produced for automated ML models can be used to evaluate the model per-class or averaged over all classes. You can switch between these different views by clicking on class labels in the legend to the right of the chart.

### ROC curve for a good model
![ROC curve for a good model](./media/how-to-understand-automated-ml/chart-roc-curve-good.png)

### ROC curve for a bad model
![ROC curve for a bad model](./media/how-to-understand-automated-ml/chart-roc-curve-bad.png)

## Precision-recall curve

The precision-recall curve plots the relationship between precision and recall as the decision threshold changes. Recall is the ability of a model to detect all positive samples and precision is the ability of a model to avoid labeling negative samples as positive. Some business problems might require higher recall and some higher precision depending on the relative importance of avoiding false negatives vs false positives.
> [!TIP]
> For classification experiments, each of the line charts produced for automated ML models can be used to evaluate the model per-class or averaged over all classes. You can switch between these different views by clicking on class labels in the legend to the right of the chart.
### Precision-recall curve for a good model
![Precision-recall curve for a good model](./media/how-to-understand-automated-ml/chart-precision-recall-curve-good.png)

### Precision-recall curve for a bad model
![Precision-recall curve for a bad model](./media/how-to-understand-automated-ml/chart-precision-recall-curve-bad.png)

## Cumulative gains curve

The cumulative gains curve plots the percent of positive samples correctly classified as a function of the percent of samples considered where we consider samples in the order of predicted probability.

To calculate gain, first sort all samples from highest to lowest probability predicted by the model. Then take `x%` of the highest confidence predictions. Divide the number of positive samples detected in that `x%` by the total number of positive samples to get the gain. Cumulative gain is the percent of positive samples we detect when considering some percent of the data that is most likely to belong to the positive class.

A perfect model will rank all positive samples above all negative samples giving a cumulative gains curve made up of two straight segments. The first is a line with slope `1 / x` from `(0, 0)` to `(x, 1)` where `x` is the fraction of samples that belong to the positive class (`1 / num_classes` if classes are balanced). The second is a horizontal line from `(x, 1)` to `(1, 1)`. In the first segment, all positive samples are classified correctly and cumulative gain goes to `100%` within the first `x%` of samples considered.

The baseline random model will have a cumulative gains curve following `y = x` where for `x%` of samples considered only about `x%` of the total positive samples were detected. A perfect model will have a micro average curve that touches the top-left corner and a macro average line that has slope `1 / num_classes` until cumulative gain is 100% and then horizontal until the data percent is 100.
> [!TIP]
> For classification experiments, each of the line charts produced for automated ML models can be used to evaluate the model per-class or averaged over all classes. You can switch between these different views by clicking on class labels in the legend to the right of the chart.
### Cumulative gains curve for a good model
![Cumulative gains curve for a good model](./media/how-to-understand-automated-ml/chart-cumulative-gains-curve-good.png)

### Cumulative gains curve for a bad model
![Cumulative gains curve for a bad model](./media/how-to-understand-automated-ml/chart-cumulative-gains-curve-bad.png)

## Lift curve

The lift curve shows how many times better a model performs compared to a random model. Lift is defined as the ratio of cumulative gain to the cumulative gain of a random model.

This relative performance takes into account the fact that classification gets harder as you increase the number of classes. (A random model incorrectly predicts a higher fraction of samples from a dataset with 10 classes compared to a dataset with two classes)

The baseline lift curve is the `y = 1` line where the model performance is consistent with that of a random model. In general, the lift curve for a good model will be higher on that chart and farther from the x-axis, showing that when the model is most confident in its predictions it performs many times better than random guessing.

> [!TIP]
> For classification experiments, each of the line charts produced for automated ML models can be used to evaluate the model per-class or averaged over all classes. You can switch between these different views by clicking on class labels in the legend to the right of the chart.
### Lift curve for a good model
![Lift curve for a good model](./media/how-to-understand-automated-ml/chart-lift-curve-good.png)
 
### Lift curve for a bad model
![Lift curve for a bad model](./media/how-to-understand-automated-ml/chart-lift-curve-bad.png)

## Calibration curve

The calibration curve plots a model's confidence in its predictions against the proportion of positive samples at each confidence level. A well-calibrated model will correctly classify 100% of the predictions to which it assigns 100% confidence, 50% of the predictions it assigns 50% confidence, 20% of the predictions it assigns a 20% confidence, and so on. A perfectly calibrated model will have a calibration curve following the `y = x` line where the model perfectly predicts the probability that samples belong to each class.

An over-confident model will over-predict probabilities close to zero and one, rarely being uncertain about the class of each sample and the calibration curve will look similar to backward "S". An under-confident model will assign a lower probability on average to the class it predicts and the associated calibration curve will look similar to an "S". The calibration curve does not depict a model's ability to classify correctly, but instead its ability to correctly assign confidence to its predictions. A bad model can still have a good calibration curve if the model correctly assigns low confidence and high uncertainty.

> [!NOTE]
> The calibration curve is sensitive to the number of samples, so a small validation set can produce noisy results that can be hard to interpret. This does not necessarily mean that the model is not well-calibrated.

### Calibration curve for a good model
![Calibration curve for a good model](./media/how-to-understand-automated-ml/chart-calibration-curve-good.png)

### Calibration curve for a bad model
![Calibration curve for a bad model](./media/how-to-understand-automated-ml/chart-calibration-curve-bad.png)

## Regression/forecasting metrics

Automated ML calculates the same performance metrics for each  model generated, regardless if it is a regression or forecasting experiment. These metrics also undergo normalization to enable comparison between models trained on data with different ranges. To learn more, see [metric normalization](#metric-normalization).  

The following table summarizes the model performance metrics generated for regression and forecasting experiments. Like classification metrics, these metrics are also based on the scikit learn implementations. The appropriate scikit learn documentation is linked accordingly, in the **Calculation** field.

|Metric|Description|Calculation|
--|--|--|
explained_variance|Explained variance measures the extent to which a model accounts for the variation in the target variable. It is the percent decrease in variance of the original data to the variance of the errors. When the mean of the errors is 0, it is equal to the coefficient of determination (see r2_score below). <br> <br> **Objective:** Closer to 1 the better <br> **Range:** (-inf, 1]|[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.explained_variance_score.html)|
mean_absolute_error|Mean absolute error is the expected value of absolute value of difference between the target and the prediction.<br><br> **Objective:** Closer to 0 the better <br> **Range:** [0, inf) <br><br> Types: <br>`mean_absolute_error` <br>  `normalized_mean_absolute_error`,  the mean_absolute_error divided by the range of the data. | [Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_absolute_error.html)|
mean_absolute_percentage_error|Mean absolute percentage error (MAPE) is a measure of the average difference between a predicted value and the actual value.<br><br> **Objective:** Closer to 0 the better <br> **Range:** [0, inf) ||
median_absolute_error|Median absolute error is the median of all absolute differences between the target and the prediction. This loss is robust to outliers.<br><br> **Objective:** Closer to 0 the better <br> **Range:** [0, inf)<br><br>Types: <br> `median_absolute_error`<br> `normalized_median_absolute_error`: the median_absolute_error divided by the range of the data. |[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.median_absolute_error.html)|
r2_score|R<sup>2</sup> (the coefficient of determination) measures the proportional reduction in mean squared error (MSE) relative to the total variance of the observed data. <br> <br> **Objective:** Closer to 1 the better <br> **Range:** [-1, 1]<br><br>Note: R<sup>2</sup> often has the range (-inf, 1]. The MSE can be larger than the observed variance, so R<sup>2</sup> can have arbitrarily large negative values, depending on the data and the model predictions. Automated ML clips reported R<sup>2</sup> scores at -1, so a value of -1 for R<sup>2</sup> likely means that the true R<sup>2</sup> score is less than -1. Consider the other metrics values and the properties of the data when interpreting a negative R<sup>2</sup> score.|[Calculation](https://scikit-learn.org/0.16/modules/generated/sklearn.metrics.r2_score.html)|
root_mean_squared_error |Root mean squared error (RMSE) is the square root of the expected squared difference between the target and the prediction. For an unbiased estimator, RMSE is equal to the standard deviation.<br> <br> **Objective:** Closer to 0 the better <br> **Range:** [0, inf)<br><br>Types:<br> `root_mean_squared_error` <br> `normalized_root_mean_squared_error`: the root_mean_squared_error divided by the range of the data. |[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html)|
root_mean_squared_log_error|Root mean squared log error is the square root of the expected squared logarithmic error.<br><br>**Objective:** Closer to 0 the better <br> **Range:** [0, inf) <br> <br>Types: <br>`root_mean_squared_log_error` <br> `normalized_root_mean_squared_log_error`: the root_mean_squared_log_error divided by the range of the data.  |[Calculation](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_log_error.html)|
spearman_correlation| Spearman correlation is a nonparametric measure of the monotonicity of the relationship between two datasets. Unlike the Pearson correlation, the Spearman correlation does not assume that both datasets are normally distributed. Like other correlation coefficients, Spearman varies between -1 and 1 with 0 implying no correlation. Correlations of -1 or 1 imply an exact monotonic relationship. <br><br> Spearman is a rank-order correlation metric meaning that changes to predicted or actual values will not change the Spearman result if they do not change the rank order of predicted or actual values.<br> <br> **Objective:** Closer to 1 the better <br> **Range:** [-1, 1]|[Calculation](https://docs.scipy.org/doc/scipy-0.16.1/reference/generated/scipy.stats.spearmanr.html)|

### Metric normalization

Automated ML normalizes regression and forecasting metrics which enables comparison between models trained on data with different ranges. A model trained on a data with a larger range has higher error than the same model trained on data with a smaller range, unless that error is normalized.

While there is no standard method of normalizing error metrics, automated ML takes the common approach of dividing the error by the range of the data: `normalized_error = error / (y_max - y_min)`

When evaluating a forecasting model on time series data, automated ML takes extra steps to ensure that normalization happens per time series ID (grain), because each time series likely has a different distribution of target values.
## Residuals

The residuals chart is a histogram of the prediction errors (residuals) generated for regression and forecasting experiments. Residuals are calculated as `y_predicted - y_true` for all samples and then displayed as a histogram to show model bias.

In this example, note that both models are slightly biased to predict lower than the actual value. This is not uncommon for a dataset with a skewed distribution of actual targets, but indicates worse model performance. A good model will have a residuals distribution that peaks at zero with few residuals at the extremes. A worse model will have a spread out residuals distribution with fewer samples around zero.

### Residuals chart for a good model
![Residuals chart for a good model](./media/how-to-understand-automated-ml/chart-residuals-good.png)

### Residuals chart for a bad model
![Residuals chart for a bad model](./media/how-to-understand-automated-ml/chart-residuals-bad.png)

## Predicted vs. true

For regression and forecasting experiment the predicted vs. true chart plots the relationship between the target feature (true/actual values) and the model's predictions. The true values are binned along the x-axis and for each bin the mean predicted value is plotted with error bars. This allows you to see if a model is biased toward predicting certain values. The line displays the average prediction and the shaded area indicates the variance of predictions around that mean.

Often, the most common true value will have the most accurate predictions with the lowest variance. The distance of the trend line from the ideal `y = x` line where there are few true values is a good measure of model performance on outliers. You can use the histogram at the bottom of the chart to reason about the actual data distribution. Including more data samples where the distribution is sparse can improve model performance on unseen data.

In this example, note that the better model has a predicted vs. true line that is closer to the ideal `y = x` line.

### Predicted vs. true chart for a good model
![Predicted vs. true chart for a good model](./media/how-to-understand-automated-ml/chart-predicted-true-good.png)

### Predicted vs. true chart for a bad model
![Predicted vs. true chart for a bad model](./media/how-to-understand-automated-ml/chart-predicted-true-bad.png)

## Model explanations and feature importances

While model evaluation metrics and charts are good for measuring the general quality of a model, inspecting which dataset features a model used to make its predictions is essential when practicing responsible AI. That's why automated ML provides a model explanations dashboard to measure and report the relative contributions of dataset features. See how to [view the explanations dashboard in the Azure Machine Learning studio](how-to-use-automated-ml-for-ml-models.md#model-explanations-preview).

For a code first experience, see how to set up [model explanations for automated ML experiments with the Azure Machine Learning Python SDK](how-to-machine-learning-interpretability-automl.md).

> [!NOTE]
> The ForecastTCN model is not currently supported by automated ML explanations and other forecasting models may have limited access to interpretability tools.

## Next steps
* Try the [automated machine learning model explanation sample notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/explain-model).
* For automated ML specific questions, reach out to askautomatedml@microsoft.com.
