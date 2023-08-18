---
title: Data splits and cross-validation in automated machine learning 
titleSuffix: Azure Machine Learning
description: Learn how to configure training, validation, cross-validation and test data for automated machine learning experiments.
services: machine-learning
ms.service: machine-learning
ms.subservice: automl
ms.topic: how-to
ms.custom: UpdateFrequency5, automl, sdkv1, event-tier1-build-2022, ignite-2022
ms.author: cesardl
author: CESARDELATORRE
ms.reviewer: ssalgado
ms.date: 11/15/2021
monikerRange: 'azureml-api-1'
---

# Configure training, validation, cross-validation and test data in automated machine learning

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

In this article, you learn the different options for configuring training data and validation data splits along with cross-validation settings for your automated machine learning, automated ML, experiments.

In Azure Machine Learning, when you use automated ML to build multiple ML models, each child run needs to validate the related model by calculating the quality metrics for that model, such as accuracy or AUC weighted. These metrics are calculated by comparing the predictions made with each model with real labels from past observations in the validation data. [Learn more about how metrics are calculated based on validation type](#metric-calculation-for-cross-validation-in-machine-learning). 

Automated ML experiments perform model validation automatically. The following sections describe how you can further customize validation settings with the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/). 

For a low-code or no-code experience, see [Create your automated machine learning experiments in Azure Machine Learning studio](../how-to-use-automated-ml-for-ml-models.md#create-and-run-experiment). 

## Prerequisites

For this article you need,

* An Azure Machine Learning workspace. To create the workspace, see [Create workspace resources](../quickstart-create-resources.md).

* Familiarity with setting up an automated machine learning experiment with the Azure Machine Learning SDK. Follow the [tutorial](../tutorial-auto-train-image-models.md) or [how-to](how-to-configure-auto-train.md) to see the fundamental automated machine learning experiment design patterns.

* An understanding of train/validation data splits and cross-validation as machine learning concepts. For a high-level explanation,

    * [About training, validation and test data in machine learning](https://towardsdatascience.com/train-validation-and-test-sets-72cb40cba9e7)

    * [Understand Cross Validation in machine learning](https://towardsdatascience.com/understanding-cross-validation-419dbd47e9bd) 

[!INCLUDE [automl-sdk-version](../includes/machine-learning-automl-sdk-version.md)]

## Default data splits and cross-validation in machine learning

Use the [AutoMLConfig](/python/api/azureml-train-automl-client/azureml.train.automl.automlconfig.automlconfig) object to define your experiment and training settings. In the following code snippet, notice that only the required parameters are defined, that is the parameters for `n_cross_validations` or `validation_data` are **not** included.

> [!NOTE]
> The default data splits and cross-validation are not supported in forecasting scenarios. 

```python
data = "https://automlsamplenotebookdata.blob.core.windows.net/automl-sample-notebook-data/creditcard.csv"

dataset = Dataset.Tabular.from_delimited_files(data)

automl_config = AutoMLConfig(compute_target = aml_remote_compute,
                             task = 'classification',
                             primary_metric = 'AUC_weighted',
                             training_data = dataset,
                             label_column_name = 'Class'
                            )
```

If you do not explicitly specify either a `validation_data` or `n_cross_validations` parameter, automated ML applies default techniques depending on the number of rows provided in the single dataset `training_data`.

|Training&nbsp;data&nbsp;size| Validation technique |
|---|-----|
|**Larger&nbsp;than&nbsp;20,000&nbsp;rows**| Train/validation data split is applied. The default is to take 10% of the initial training data set as the validation set. In turn, that validation set is used for metrics calculation.
|**Smaller&nbsp;than&nbsp;20,000&nbsp;rows**| Cross-validation approach is applied. The default number of folds depends on the number of rows. <br> **If the dataset is less than 1,000 rows**, 10 folds are used. <br> **If the rows are between 1,000 and 20,000**, then three folds are used.


## Provide validation data

In this case, you can either start with a single data file and split it into training data and validation data sets or you can provide a separate data file for the validation set. Either way, the `validation_data` parameter in your `AutoMLConfig` object assigns which data to use as your validation set. This parameter only accepts data sets in the form of an [Azure Machine Learning dataset](how-to-create-register-datasets.md) or pandas dataframe.   

> [!NOTE]
> The `validation_data` parameter requires the `training_data` and `label_column_name` parameters to be set as well. You can only set one validation parameter, that is you can only specify either `validation_data` or `n_cross_validations`, not both.

The following code example explicitly defines which portion of the provided data in `dataset` to use for training and validation.

```python
data = "https://automlsamplenotebookdata.blob.core.windows.net/automl-sample-notebook-data/creditcard.csv"

dataset = Dataset.Tabular.from_delimited_files(data)

training_data, validation_data = dataset.random_split(percentage=0.8, seed=1)

automl_config = AutoMLConfig(compute_target = aml_remote_compute,
                             task = 'classification',
                             primary_metric = 'AUC_weighted',
                             training_data = training_data,
                             validation_data = validation_data,
                             label_column_name = 'Class'
                            )
```

## Provide validation set size

In this case, only a single dataset is provided for the experiment. That is, the `validation_data` parameter is **not** specified, and the provided dataset is assigned to the  `training_data` parameter.  

In your `AutoMLConfig` object, you can set the `validation_size` parameter to hold out a portion of the training data for validation. This means that the validation set will be split by automated ML from the initial `training_data` provided. This value should be between 0.0 and 1.0 non-inclusive (for example, 0.2 means 20% of the data is held out for validation data).

> [!NOTE]
> The `validation_size` parameter is not supported in forecasting scenarios. 

See the following code example:

```python
data = "https://automlsamplenotebookdata.blob.core.windows.net/automl-sample-notebook-data/creditcard.csv"

dataset = Dataset.Tabular.from_delimited_files(data)

automl_config = AutoMLConfig(compute_target = aml_remote_compute,
                             task = 'classification',
                             primary_metric = 'AUC_weighted',
                             training_data = dataset,
                             validation_size = 0.2,
                             label_column_name = 'Class'
                            )
```

## K-fold cross-validation

To perform k-fold cross-validation, include the `n_cross_validations` parameter and set it to a value. This parameter sets how many cross validations to perform, based on the same number of folds.

> [!NOTE]
> The `n_cross_validations` parameter is not supported in classification scenarios that use deep neural networks.
> For forecasting scenarios, see how cross validation is applied in [Set up AutoML to train a time-series forecasting model](how-to-auto-train-forecast.md#training-and-validation-data).
 
In the following code, five folds for cross-validation are defined. Hence, five different trainings, each training using 4/5 of the data, and each validation using 1/5 of the data with a different holdout fold each time.

As a result, metrics are calculated with the average of the five validation metrics.

```python
data = "https://automlsamplenotebookdata.blob.core.windows.net/automl-sample-notebook-data/creditcard.csv"

dataset = Dataset.Tabular.from_delimited_files(data)

automl_config = AutoMLConfig(compute_target = aml_remote_compute,
                             task = 'classification',
                             primary_metric = 'AUC_weighted',
                             training_data = dataset,
                             n_cross_validations = 5
                             label_column_name = 'Class'
                            )
```
## Monte Carlo cross-validation

To perform Monte Carlo cross validation, include both the `validation_size` and `n_cross_validations` parameters in your `AutoMLConfig` object. 

For Monte Carlo cross validation, automated ML sets aside the portion of the training data specified by the `validation_size` parameter for validation, and then assigns the rest of the data for training. This process is then repeated based on the value specified in the `n_cross_validations` parameter; which generates new training and validation splits, at random, each time.

> [!NOTE]
> The Monte Carlo cross-validation is not supported in forecasting scenarios.

The follow code defines, 7 folds for cross-validation and 20% of the training data should be used for validation. Hence, 7 different trainings, each training uses 80% of the data, and each validation uses 20% of the data with a different holdout fold each time.

```python
data = "https://automlsamplenotebookdata.blob.core.windows.net/automl-sample-notebook-data/creditcard.csv"

dataset = Dataset.Tabular.from_delimited_files(data)

automl_config = AutoMLConfig(compute_target = aml_remote_compute,
                             task = 'classification',
                             primary_metric = 'AUC_weighted',
                             training_data = dataset,
                             n_cross_validations = 7
                             validation_size = 0.2,
                             label_column_name = 'Class'
                            )
```

## Specify custom cross-validation data folds

You can also provide your own cross-validation (CV) data folds. This is considered a more advanced scenario because you are specifying which columns to split and use for validation.  Include custom CV split columns in your training data, and specify which columns by populating the column names in the `cv_split_column_names` parameter. Each column represents one cross-validation split, and is filled with integer values 1 or 0--where 1 indicates the row should be used for training and 0 indicates the row should be used for validation.

> [!NOTE]
> The `cv_split_column_names` parameter is not supported in forecasting scenarios. 


The following code snippet contains bank marketing data with two CV split columns 'cv1' and 'cv2'.

```python
data = "https://automlsamplenotebookdata.blob.core.windows.net/automl-sample-notebook-data/bankmarketing_with_cv.csv"

dataset = Dataset.Tabular.from_delimited_files(data)

automl_config = AutoMLConfig(compute_target = aml_remote_compute,
                             task = 'classification',
                             primary_metric = 'AUC_weighted',
                             training_data = dataset,
                             label_column_name = 'y',
                             cv_split_column_names = ['cv1', 'cv2']
                            )
```

> [!NOTE]
> To use `cv_split_column_names` with `training_data` and `label_column_name`, please upgrade your Azure Machine Learning Python SDK version 1.6.0 or later. For previous SDK versions, please refer to using `cv_splits_indices`, but note that it is used with `X` and `y` dataset input only. 


## Metric calculation for cross validation in machine learning

When either k-fold or Monte Carlo cross validation is used, metrics are computed on each validation fold and then aggregated. The aggregation operation is an average for scalar metrics and a sum for charts. Metrics computed during cross validation are based on all folds and therefore all samples from the training set. [Learn more about metrics in automated machine learning](../how-to-understand-automated-ml.md).

When either a custom validation set or an automatically selected validation set is used, model evaluation metrics are computed from only that validation set, not the  training data.

## Provide test data (preview)

[!INCLUDE [preview disclaimer](../includes/machine-learning-preview-generic-disclaimer.md)]

You can also provide test data to evaluate the recommended model that automated ML generates for you upon completion of the experiment. When you provide test data it's considered a separate from training and validation, so as to not bias the results of the test run of the recommended model. [Learn more about training, validation and test data in automated ML.](concept-automated-ml.md#training-validation-and-test-data)

> [!WARNING]
> This feature is not available for the following automated ML scenarios
>  * [Computer vision tasks](../how-to-auto-train-image-models.md)
>  * [Many models and hiearchical time series forecasting training (preview)](how-to-auto-train-forecast.md)
>  * [Forecasting tasks where deep learning neural networks (DNN) are enabled](how-to-auto-train-forecast.md#enable-deep-learning)
>  * [Automated ML runs from local computes or Azure Databricks clusters](how-to-configure-auto-train.md#compute-to-run-experiment)

Test datasets must be in the form of an [Azure Machine Learning TabularDataset](how-to-create-register-datasets.md#tabulardataset). You can specify a test dataset with the `test_data` and `test_size` parameters in your `AutoMLConfig` object.  These parameters are mutually exclusive and can not be specified at the same time or with `cv_split_column_names` or `cv_splits_indices`.

With the `test_data` parameter, specify an existing dataset to pass into your `AutoMLConfig` object. 

```python
automl_config = AutoMLConfig(task='forecasting',
                             ...
                             # Provide an existing test dataset
                             test_data=test_dataset,
                             ...
                             forecasting_parameters=forecasting_parameters)
```

To use a train/test split instead of providing test data directly, use the `test_size` parameter when creating the `AutoMLConfig`. This parameter must be a floating point value between 0.0 and 1.0 exclusive, and specifies the percentage of the training dataset that should be used for the test dataset.

```python
automl_config = AutoMLConfig(task = 'regression',
                             ...
                             # Specify train/test split
                             training_data=training_data,
                             test_size=0.2)
```

> [!Note]
> For regression tasks, random sampling is used.<br>
> For classification tasks, stratified sampling is used, but random sampling is used as a fall back when stratified sampling is not feasible. <br>
> Forecasting does not currently support specifying a test dataset using a train/test split with the `test_size` parameter.


Passing the `test_data` or `test_size` parameters into the `AutoMLConfig`, automatically triggers a remote test run upon completion of your experiment. This test run uses the provided test data to evaluate the best model that automated ML recommends. Learn more about [how to get the predictions from the test run](how-to-configure-auto-train.md#test-models-preview).

## Next steps

* [Prevent imbalanced data and overfitting](../concept-manage-ml-pitfalls.md).

* How to [Auto-train a time-series forecast model](how-to-auto-train-forecast.md).
