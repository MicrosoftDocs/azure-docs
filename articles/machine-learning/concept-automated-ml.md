---
title: What is automated ML / AutoML
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning can automatically pick an algorithm for you, and generate a model from it to save you time by using the parameters and criteria you provide to select the best algorithm for your model.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: jmartens
author: cartacioS
ms.author: sacartac
ms.date: 11/04/2019
---

# What is automated machine learning?

Automated machine learning, also referred to as automated ML, is the process of automating the time consuming, iterative tasks of machine learning model development. It allows data scientists, analysts, and developers to build ML models with high scale, efficiency, and productivity all while sustaining model quality. Automated ML is based on a breakthrough from our [Microsoft Research division](https://arxiv.org/abs/1705.05355).

Traditional machine learning model development is resource-intensive, requiring significant domain knowledge and time to produce and compare dozens of models. Apply automated ML when you want Azure Machine Learning to train and tune a model for you using the target metric you specify. The service then iterates through ML algorithms paired with feature selections, where each iteration produces a model with a training score. The higher the score, the better the model is considered to "fit" your data.

With automated machine learning, you'll accelerate the time it takes to get production-ready ML models with great ease and efficiency.

## When to use automated ML

Automated ML democratizes the machine learning model development process, and empowers its users, no matter their data science expertise, to identify an end-to-end machine learning pipeline for any problem.

Data scientists, analysts, and developers across industries can use automated ML to:

+ Implement machine learning solutions without extensive programming knowledge
+ Save time and resources
+ Leverage data science best practices
+ Provide agile problem-solving

The following table lists common automated ML use cases. 

Classification| Time series forecasting | Regression
---|---|---
[Fraud Detection](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/classification-credit-card-fraud/auto-ml-classification-credit-card-fraud.ipynb)|[Sales Forecasting](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-orange-juice-sales/auto-ml-forecasting-orange-juice-sales.ipynb)|[CPU Performance Prediction](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/regression-hardware-performance-explanation-and-featurization/auto-ml-regression-hardware-performance-explanation-and-featurization.ipynb)
|[Marketing Prediction](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/classification-bank-marketing-all-features/auto-ml-classification-bank-marketing-all-features.ipynb)|[Demand Forecasting](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-energy-demand/auto-ml-forecasting-energy-demand.ipynb)|
|[Newsgroup Data Classification](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/classification-text-dnn/auto-ml-classification-text-dnn.ipynb)|[Beverage Production Forecast](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-beer-remote/auto-ml-forecasting-beer-remote.ipynb)|

## How automated ML works

Using **Azure Machine Learning**, you can design and run your automated ML training experiments with these steps:

1. **Identify the ML problem** to be solved: classification, forecasting, or regression

1. **Specify the source and format of the labeled training data**: Numpy arrays or Pandas dataframe

1. **Configure the compute target for model training**, such as your [local computer, Azure Machine Learning Computes, remote VMs, or Azure Databricks](how-to-set-up-training-targets.md).  Learn about automated training [on a remote resource](how-to-auto-train-remote.md).

1. **Configure the automated machine learning parameters** that determine how many iterations over different models, hyperparameter settings, advanced preprocessing/featurization, and what metrics to look at when determining the best model.  You can configure the settings for automatic training experiment in [Azure Machine Learning studio](https://ml.azure.com), or [with the SDK](how-to-configure-auto-train.md). 

    [!INCLUDE [aml-applies-to-enterprise-sku](../../includes/aml-applies-to-enterprise-sku-inline.md)]

1. **Submit the training run.**

  ![Automated Machine learning](./media/concept-automated-ml/automl-concept-diagram2.png)

During training, Azure Machine Learning creates a number of in parallel pipelines that try different algorithms and parameters. It will stop once it hits the exit criteria defined in the experiment.

You can also inspect the logged run information, which [contains metrics](how-to-understand-automated-ml.md) gathered during the run. The training run produces a Python serialized object (`.pkl` file) that contains the model and data preprocessing.

While model building is automated, you can also [learn how important or relevant features are](how-to-configure-auto-train.md#explain) to the generated models.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE2Xc9t]

<a name="preprocess"></a>

## Preprocessing

In every automated machine learning experiment, your data is preprocessed using the default methods and optionally through advanced preprocessing.

> [!NOTE]
> Automated machine learning pre-processing steps (feature normalization, handling missing data,
> converting text to numeric, etc.) become part of the underlying model. When using the model for
> predictions, the same pre-processing steps applied during training are applied to
> your input data automatically.

### Automatic preprocessing (standard)

In every automated machine learning experiment, your data is automatically scaled or normalized to help algorithms perform well.  During model training, one of the following scaling or normalization techniques will be applied to each model.

|Scaling&nbsp;&&nbsp;normalization| Description |
| ------------- | ------------- |
| [StandardScaleWrapper](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html)  | Standardize features by removing the mean and scaling to unit variance  |
| [MinMaxScalar](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MinMaxScaler.html)  | Transforms features by scaling each feature by that column’s minimum and maximum  |
| [MaxAbsScaler](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MaxAbsScaler.html#sklearn.preprocessing.MaxAbsScaler) |Scale each feature by its maximum absolute value |
| [RobustScalar](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html) |This Scaler features by their quantile range |
| [PCA](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html) |Linear dimensionality reduction using Singular Value Decomposition of the data to project it to a lower dimensional space |
| [TruncatedSVDWrapper](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html) |This transformer performs linear dimensionality reduction by means of truncated singular value decomposition (SVD). Contrary to PCA, this estimator does not center the data before computing the singular value decomposition, which means it can work with scipy.sparse matrices efficiently |
| [SparseNormalizer](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.Normalizer.html) | Each sample (that is, each row of the data matrix) with at least one non-zero component is rescaled independently of other samples so that its norm (l1 or l2) equals one |

### Advanced preprocessing: optional featurization

Additional advanced preprocessing and featurization are also available, such as data guardrails, encoding, and transforms. [Learn more about what featurization is included](how-to-create-portal-experiments.md#featurization). 
Enable this setting with:

+ Azure Machine Learning studio: Enable **Automatic featurization** in the **View additional configuration** section [with these steps](how-to-create-portal-experiments.md#create-and-run-experiment).

+ Python SDK: Specifying `"feauturization": 'auto' / 'off' / 'FeaturizationConfig'` for the [`AutoMLConfig` class](/python/api/azureml-train-automl-client/azureml.train.automl.automlconfig.automlconfig). 

## Prevent over-fitting

Over-fitting in machine learning occurs when a model fits the training data too well, and as a result can't accurately predict on unseen test data. In other words, the model has simply memorized specific patterns and noise in the training data, but is not flexible enough to make predictions on real data. In the most egregious cases, an over-fitted model will assume that the feature value combinations seen during training will always result in the exact same output for the target. 

The best way to prevent over-fitting is to follow ML best-practices including:

* Using more training data, and eliminating statistical bias
* Preventing target leakage
* Using fewer features
* **Regularization and hyperparameter optimization**
* **Model complexity limitations**
* **Cross-validation**

In the context of automated ML, the first three items above are **best-practices you implement**. The last three bolded items are **best-practices automated ML implements** by default to protect against over-fitting. In settings other than automated ML, all six best-practices are worth following to avoid over-fitting models.

### Best practices you implement

Using **more data** is the simplest and best possible way to prevent over-fitting, and as an added bonus typically increases accuracy. When you use more data, it becomes harder for the model to memorize exact patterns, and it is forced to reach solutions that are more flexible to accommodate more conditions. It's also important to recognize **statistical bias**, to ensure your training data doesn't include isolated patterns that won't exist in live-prediction data. This scenario can be difficult to solve, because there may not be over-fitting between your train and test sets, but there may be over-fitting present when compared to live test data.

Target leakage is a similar issue, where you may not see over-fitting between train/test sets, but rather it appears at prediction-time. Target leakage occurs when your model "cheats" during training by having access to data that it shouldn't normally have at prediction-time. For example, if your problem is to predict on Monday what a commodity price will be on Friday, but one of your features accidentally included data from Thursdays, that would be data the model won't have at prediction-time since it cannot see into the future. Target leakage is an easy mistake to miss, but is often characterized by abnormally high accuracy for your problem. If you are attempting to predict stock price and trained a model at 95% accuracy, there is likely target leakage somewhere in your features.

Removing features can also help with over-fitting by preventing the model from having too many fields to use to memorize specific patterns, thus causing it to be more flexible. It can be difficult to measure quantitatively, but if you can remove features and retain the same accuracy, you have likely made the model more flexible and have reduced the risk of over-fitting.

### Best-practices automated ML implements

Regularization is the process of minimizing a cost function to penalize complex and over-fitted models. There are different types of regularization functions, but in general they all penalize model coefficient size, variance, and complexity. Automated ML uses L1 (Lasso), L2 (Ridge), and ElasticNet (L1 and L2 simultaneously) in different combinations with different model hyperparameter settings that control over-fitting. In simple terms, automated ML will vary how much a model is regulated and choose the best result.

Automated ML also implements explicit model complexity limitations to prevent over-fitting. In most cases this implementation is specifically for decision tree or forest algorithms, where individual tree max-depth is limited, and the total number of trees used in forest or ensemble techniques are limited.

Cross-validation (CV) is the process of taking many subsets of your full training data and training a model on each subset. The idea is that a model could get "lucky" and have great accuracy with one subset, but by using many subsets the model won't achieve this high accuracy every time. When doing CV, you provide a validation holdout dataset, specify your CV folds (number of subsets) and automated ML will train your model and tune hyperparameters to minimize error on your validation set. One CV fold could be over-fit, but by using many of them it reduces the probability that your final model is over-fit. The tradeoff is that CV does result in longer training times and thus greater cost, because instead of training a model once, you train it once for each *n* CV subsets.

> [!NOTE]
> Cross-validation is not enabled by default; it must be configured in automated ML settings. However, after
> CV is configured and a validation data set has been provided, the process is automated for you.

### Identifying over-fitting

Consider the following trained models and their corresponding train and test accuracies.

| Model | Train accuracy | Test accuracy |
|-------|----------------|---------------|
| A | 99.9% | 95% |
| B | 87% | 87% |
| C | 99.9% | 45% |

Considering model **A**, there is a common misconception that if test accuracy on unseen data is lower than training accuracy, the model is over-fitted. However, test accuracy should always be less than training accuracy, and the distinction for over-fit vs. appropriately fit comes down to *how much* less accurate. 

When comparing models **A** and **B**, model **A** is a better model because it has higher test accuracy, and although the test accuracy is slightly lower at 95%, it is not a significant difference that suggests over-fitting is present. You wouldn't choose model **B** simply because the train and test accuracies are closer together.

Model **C** represents a clear case of over-fitting; the training accuracy is very high but the test accuracy isn't anywhere near as high. This distinction is subjective, but comes from knowledge of your problem and data, and what magnitudes of error are acceptable. 

## Time-series forecasting

Building forecasts is an integral part of any business, whether it’s revenue, inventory, sales, or customer demand. You can use automated ML to combine techniques and approaches and get a recommended, high-quality time-series forecast.

An automated time-series experiment is treated as a multivariate regression problem. Past time-series values are “pivoted” to become additional dimensions for the regressor together with other predictors. This approach, unlike classical time series methods, has an advantage of naturally incorporating multiple contextual variables and their relationship to one another during training. Automated ML learns a single, but often internally branched model for all items in the dataset and prediction horizons. More data is thus available to estimate model parameters and generalization to unseen series becomes possible.

Learn more and see an example of [automated machine learning for time series forecasting](how-to-auto-train-forecast.md). Or, see the [energy demand notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-energy-demand/auto-ml-forecasting-energy-demand.ipynb) for detailed code examples of advanced forecasting configuration including:

* holiday detection and featurization
* time-series and DNN learners (Auto-ARIMA, Prophet, ForecastTCN)
* many models support through grouping
* rolling-origin cross validation
* configurable lags
* rolling window aggregate features

## <a name="ensemble"></a> Ensemble models

Automated machine learning supports ensemble models, which are enabled by default. Ensemble learning improves machine learning results and predictive performance by combining multiple models as opposed to using single models. The ensemble iterations appear as the final iterations of your run. Automated machine learning uses both voting and stacking ensemble methods for combining models:

* **Voting**: predicts based on the weighted average of predicted class probabilities (for classification tasks) or predicted regression targets (for regression tasks).
* **Stacking**: stacking combines heterogenous models and trains a meta-model based on the output from the individual models. The current default meta-models are LogisticRegression for classification tasks and ElasticNet for regression/forecasting tasks.

The [Caruana ensemble selection algorithm](http://www.niculescu-mizil.org/papers/shotgun.icml04.revised.rev2.pdf) with sorted ensemble initialization is used to decide which models to use within the ensemble. At a high level, this algorithm initializes the ensemble with up to five models with the best individual scores, and verifies that these models are within 5% threshold of the best score to avoid a poor initial ensemble. Then for each ensemble iteration, a new model is added to the existing ensemble and the resulting score is calculated. If a new model improved the existing ensemble score, the ensemble is updated to include the new model.

See the [how-to](how-to-configure-auto-train.md#ensemble) for changing default ensemble settings in automated machine learning.

## <a name="imbalance"></a> Imbalanced data

Imbalanced data is commonly found in data for machine learning classification scenarios, and refers to data that contains a disproportionate ratio of observations in each class. This imbalance can lead to a falsely perceived positive effect of a model's accuracy, because the input data has bias towards one class, which results in the trained model to mimic that bias. 

As part of its goal of simplifying the machine learning workflow, automated ML has built in capabilities to help deal with imbalanced data such as, 

- A **weight column**: automated ML supports a weighted column as input, causing rows in the data to be weighted up or down, which can make a class more or less “important”.

- The algorithms used by automated ML can properly handle imbalance of up to 20:1, meaning the most common class can have 20 times more rows in the data than the least common class.

### Identify models with imbalanced data

As classification algorithms are commonly evaluated by accuracy, checking a model's accuracy score is a good way to identify if it was impacted by imbalanced data. Did it have really high accuracy or really low accuracy for certain classes?

In addition, automated ML runs generate the following charts automatically, which can help you understand the correctness of the classifications of your model, and identify models potentially impacted by imbalanced data.

Chart| Description
---|---
[Confusion Matrix](how-to-understand-automated-ml.md#confusion-matrix)| Evaluates the correctly classified labels against the actual labels of the data. 
[Precision-recall](how-to-understand-automated-ml.md#precision-recall-chart)| Evaluates the ratio of correct labels against the ratio of found label instances of the data 
[ROC Curves](how-to-understand-automated-ml.md#roc)| Evaluates the ratio of correct labels against the ratio of false-positive labels.

### Handle imbalanced data 

The following techniques are additional options to handle imbalanced data outside of automated ML. 

- Resampling to even the class imbalance, either by up-sampling the smaller classes or down-sampling the larger classes. These methods require expertise to process and analyze.

- Use a performance metric that deals better with imbalanced data. For example, the F1 score is a weighted average of precision and recall. Precision measures a classifier’s exactness-- low precision indicates a high number of false positives--, while recall measures a classifier’s completeness-- low recall indicates a high number of false negatives. 

## Use with ONNX in C# apps

With Azure Machine Learning, you can use automated ML to build a Python model and have it converted to the ONNX format. The ONNX runtime supports  C#, so you can use the model built automatically in your C# apps without any need for recoding or any of the network latencies that REST endpoints introduce. Try an example of this flow [in this Jupyter notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/classification-bank-marketing-all-features/auto-ml-classification-bank-marketing-all-features.ipynb).

## Automated ML across Microsoft

Automated ML is also available in other Microsoft solutions such as:

|Integrations|Description|
|------------|-----------|
|[ML.NET](https://docs.microsoft.com/dotnet/machine-learning/automl-overview)|Automatic model selection and training in .NET apps using Visual Studio and Visual Studio Code with ML.NET automated ML.|
|[HDInsight](../hdinsight/spark/apache-spark-run-machine-learning-automl.md)|Scale out your automated ML training jobs on Spark in HDInsight clusters in parallel.|
|[Power BI](https://docs.microsoft.com/power-bi/service-machine-learning-automated)|Invoke machine learning models directly in Power BI.|
|[SQL Server](https://cloudblogs.microsoft.com/sqlserver/2019/01/09/how-to-automate-machine-learning-on-sql-server-2019-big-data-clusters/)|Create new machine learning models over your data in SQL Server 2019 big data clusters.|

## Next steps

See examples and learn how to build models using automated machine learning:

+ Follow the [Tutorial: Automatically train a regression model with Azure Automated Machine Learning](tutorial-auto-train-models.md)

+ Configure the settings for automatic training experiment:
  + In Azure Machine Learning studio, [use these steps](how-to-create-portal-experiments.md).
  + With the Python SDK, [use these steps](how-to-configure-auto-train.md).

+ Learn how to auto train using time series data, [use these steps](how-to-auto-train-forecast.md).

+ Try out [Jupyter Notebook samples for automated machine learning](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/)
