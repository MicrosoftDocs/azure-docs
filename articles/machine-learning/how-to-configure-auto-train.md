---
title: Create automated ML experiments
titleSuffix: Azure Machine Learning
description: Automated machine learning picks an algorithm for you and generates a model ready for deployment. Learn the options that you can use to configure automated machine learning experiments.
author: cartacioS
ms.author: sacartac
ms.reviewer: nibaccam
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.date: 08/10/2020
ms.topic: conceptual
ms.custom: how-to, tracking-python
---

# Configure automated ML experiments in Python
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this guide, learn how to define various configuration settings of your automated machine learning experiments with the [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py). Automated machine learning picks an algorithm and hyperparameters for you and generates a model ready for deployment. There are several options that you can use to configure automated machine learning experiments.

To view examples of an automated machine learning experiments, see [Tutorial: Train a classification model with automated machine learning](tutorial-auto-train-models.md) or [Train models with automated machine learning in the cloud](how-to-auto-train-remote.md).

Configuration options available in automated machine learning:

* Select your experiment type: Classification, Regression, or Time Series Forecasting
* Data source, formats, and fetch data
* Choose your compute target: local or remote
* Automated machine learning experiment settings
* Run an automated machine learning experiment
* Explore model metrics
* Register and deploy model

If you prefer a no code experience, you can also [Create your automated machine learning experiments in Azure Machine Learning studio](how-to-use-automated-ml-for-ml-models.md).

## Select your experiment type

Before you begin your experiment, you should determine the kind of machine learning problem you are solving. Automated machine learning supports task types of **classification, regression**, and **forecasting**. Learn more about [task types](concept-automated-ml.md#when-to-use-automl-classify-regression--forecast).

The following code uses the `task` parameter in the `AutoMLConfig` constructor to specify the experiment type as `"classification"`.

```python
from azureml.train.automl import AutoMLConfig

# task can be one of classification, regression, forecasting
automl_config = AutoMLConfig(task = "classification")
```

## Data source and format

Automated machine learning supports data that resides on your local desktop or in the cloud such as Azure Blob Storage. The data can be read into a **Pandas DataFrame** or an **Azure Machine Learning TabularDataset**.  [Learn more about datasets](how-to-create-register-datasets.md).

Requirements for training data:
- Data must be in tabular form.
- The value to predict, target column, must be in the data.

The following code examples demonstrate how to store the data in these formats.

* Azure Machine Learning TabularDataset

  ```python
  from azureml.core.dataset import Dataset
  from azureml.opendatasets import Diabetes
  
  tabular_dataset = Diabetes.get_tabular_dataset()
  train_dataset, test_dataset = tabular_dataset.random_split(percentage=0.1, seed=42)
  label = "Y"
  ```

* Pandas dataframe

  ```python
  import pandas as pd
  from sklearn.model_selection import train_test_split

  df = pd.read_csv("your-local-file.csv")
  train_data, test_data = train_test_split(df, test_size=0.1, random_state=42)
  label = "label-col-name"
  ```

## Fetch data for running experiments on remote compute

For remote experiments, training data must be accessible from the remote compute. To do so, AutoML only accepts the Azure Machine Learning dataset type, [TabularDatasets](https://docs.microsoft.com/python/api/azureml-core/azureml.data.tabulardataset?view=azure-ml-py) when working on a remote compute. For local experiments, we recommend using a pandas dataframe.  

Azure Machine Learning datasets exposes functionality to:

* easily transfer data from static files or URL sources into your workspace
* make your data available to training scripts when running on cloud compute resources

See the [how-to](how-to-train-with-datasets.md#mount-files-to-remote-compute-targets) for an example of using the `Dataset` class to mount data to your compute target.

## Training, validation and test data

You can specify separate train and validation sets directly in the `AutoMLConfig` constructor with the following options. Learn more about [how to configure data splits and cross validation](how-to-configure-cross-validation-data-splits.md) for your AutoML experiments. 

### K-Folds Cross Validation

Use `n_cross_validations` setting to specify the number of cross validations. The training data set will be randomly split into `n_cross_validations` folds of equal size. During each cross validation round, one of the folds will be used for validation of the model trained on the remaining folds. This process repeats for `n_cross_validations` rounds until each fold is used once as validation set. The average scores across all `n_cross_validations` rounds will be reported, and the corresponding model will be retrained on the whole training data set.

Learn more about how autoML applies cross validation to [prevent over-fitting models](concept-manage-ml-pitfalls.md#prevent-over-fitting).

### Monte Carlo Cross Validation (Repeated Random Sub-Sampling)

Use `validation_size` to specify the percentage of the training dataset that should be used for validation, and use `n_cross_validations` to specify the number of cross validations. During each cross validation round, a subset of size `validation_size` will be randomly selected for validation of the model trained on the remaining data. Finally, the average scores across all `n_cross_validations` rounds will be reported, and the corresponding model will be retrained on the whole training data set. Monte Carlo is not supported for time series forecasting.

### Custom validation dataset

Use custom validation dataset if random split is not acceptable, usually time series data or imbalanced data. You can specify your own validation dataset. The model will be evaluated against the validation dataset specified instead of random dataset. Learn more about [how to configure a custom validation set with the SDK](how-to-configure-cross-validation-data-splits.md#provide-validation-data).

## Compute to run experiment

Next determine where the model will be trained. An automated machine learning training experiment can run on the following compute options. Learn the [pros and cons of local and remote compute](concept-automated-ml.md#local-remote) options. 

* Your **local** machine such as a local desktop or laptop – Generally when you have small dataset and you are still in the exploration stage. See [this notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/local-run-classification-credit-card-fraud/auto-ml-classification-credit-card-fraud-local.ipynb) for a local compute example. 
 
* A **remote** machine in the cloud – [Azure Machine Learning Managed Compute](concept-compute-target.md#amlcompute) is a managed service that enables the ability to train machine learning models on clusters of Azure virtual machines. 

    See [this notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/classification-bank-marketing-all-features/auto-ml-classification-bank-marketing-all-features.ipynb) for a remote example using Azure Machine Learning Managed Compute. 

* An **Azure Databricks cluster** in your Azure subscription. You can find more details here - [Setup Azure Databricks cluster for Automated ML](how-to-configure-environment.md#azure-databricks). See this [GitHub site](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/azure-databricks/automl) for examples of notebooks with Azure Databricks.

<a name='configure-experiment'></a>

## Configure your experiment settings

There are several options that you can use to configure your automated machine learning experiment. These parameters are set by instantiating an `AutoMLConfig` object. See the [AutoMLConfig class](/python/api/azureml-train-automl-client/azureml.train.automl.automlconfig.automlconfig) for a full list of parameters.

Some examples include:

1. Classification experiment using AUC weighted as the primary metric with experiment timeout minutes set to 30 minutes and 2 cross-validation folds.

   ```python
       automl_classifier=AutoMLConfig(
       task='classification',
       primary_metric='AUC_weighted',
       experiment_timeout_minutes=30,
       blocked_models=['XGBoostClassifier'],
       training_data=train_data,
       label_column_name=label,
       n_cross_validations=2)
   ```
2. Below is an example of a regression experiment set to end after 60 minutes with five validation cross folds.

   ```python
      automl_regressor = AutoMLConfig(
      task='regression',
      experiment_timeout_minutes=60,
      allowed_models=['KNN'],
      primary_metric='r2_score',
      training_data=train_data,
      label_column_name=label,
      n_cross_validations=5)
   ```
    To help avoid  experiment timeout failures, Automated ML's validation service will require that `experiment_timeout_minutes` be set to a minimum of 15 minutes, or 60 minutes if your row by column size exceeds 10 million.

### Supported models

Automated machine learning supports different algorithms, models to try out,  during the automation and tuning process. As a user, there is no need for you to specify the algorithm. 

The three different `task` parameter values (the third task-type is `forecasting`, and uses a similar algorithm pool as `regression` tasks) determine the list of algorithms, models, to apply. Use the `allowed_models` or `blocked_models` parameters to further modify iterations with the available models to include or exclude. The list of supported models can be found on [SupportedModels Class](https://docs.microsoft.com/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels) for ([Classification](https://docs.microsoft.com/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.classification), [Forecasting](https://docs.microsoft.com/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.forecasting), and [Regression](https://docs.microsoft.com/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.regression)).


### Primary Metric
The primary metric determines the metric to be used during model training for optimization. The available metrics you can select is determined by the task type you choose, and the following table shows valid primary metrics for each task type.

Learn about the specific definitions of these metrics in [Understand automated machine learning results](how-to-understand-automated-ml.md).

|Classification | Regression | Time Series Forecasting
|-- |-- |--
|accuracy| spearman_correlation | spearman_correlation
|AUC_weighted | normalized_root_mean_squared_error | normalized_root_mean_squared_error
|average_precision_score_weighted | r2_score | r2_score
|norm_macro_recall | normalized_mean_absolute_error | normalized_mean_absolute_error
|precision_score_weighted |

### Data featurization

In every automated machine learning experiment, your data is automatically scaled and normalized to help *certain* algorithms that are sensitive to features that are on different scales. This scaling and normalization is referred to as featurization. You can also enable additional featurization, such as missing values imputation, encoding, and transforms. See [Featurization in AutoML](how-to-configure-auto-features.md#) for more detail and code examples. 

When configuring your experiments in your `AutoMLConfig` object, you can enable/disable the setting `featurization`. The following table shows the accepted settings for featurization in the [AutoMLConfig class](/python/api/azureml-train-automl-client/azureml.train.automl.automlconfig.automlconfig).

|Featurization Configuration | Description |
| ------------- | ------------- |
|`"featurization": 'auto'`| Indicates that as part of preprocessing, [data guardrails and featurization steps](how-to-configure-auto-features.md#featurization) are performed automatically. **Default setting**.|
|`"featurization": 'off'`| Indicates featurization step should not be done automatically.|
|`"featurization":`&nbsp;`'FeaturizationConfig'`| Indicates customized featurization step should be used. [Learn how to customize featurization](how-to-configure-auto-features.md#customize-featurization).|

> [!NOTE]
> Automated machine learning featurization steps (feature normalization, handling missing data,
> converting text to numeric, etc.) become part of the underlying model. When using the model for
> predictions, the same featurization steps applied during training are applied to
> your input data automatically.

### Time Series Forecasting

The time series `forecasting` task requires additional parameters in the configuration object:

1. `time_column_name`: Required parameter that defines the name of the column in your training data containing a valid time-series.
1. `forecast_horizon`: Defines how many periods forward you would like to forecast. The integer horizon is in units of the timeseries frequency. For example if you have training data with daily frequency, you define how far out in days you want the model to train for.
1. `time_series_id_column_names`: Defines the columns that uniquely identify the time series in data that has multiple rows with the same timestamp. For example, if you are forecasting sales of a particular brand by store, you would define store and brand columns as your time series identifiers. Separate forecasts will be created for each grouping. If the time series identifiers are not defined, the data set is assumed to be one time series.

For examples of the settings used below, see the [sample notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-orange-juice-sales/auto-ml-forecasting-orange-juice-sales.ipynb).

```python
# Setting Store and Brand as time series identifiers for training.
time_series_id_column_names = ['Store', 'Brand']
nseries = data.groupby(time_series_id_column_names).ngroups

# View the number of time series data with defined time series identifiers
print('Data contains {0} individual time-series.'.format(nseries))
```

```python
time_series_settings = {
    'time_column_name': time_column_name,
    'time_series_id_column_names': time_series_id_column_names,
    'drop_column_names': ['logQuantity'],
    'forecast_horizon': n_test_periods
}

automl_config = AutoMLConfig(task = 'forecasting',
                             debug_log='automl_oj_sales_errors.log',
                             primary_metric='normalized_root_mean_squared_error',
                             experiment_timeout_minutes=20,
                             training_data=train_data,
                             label_column_name=label,
                             n_cross_validations=5,
                             path=project_folder,
                             verbosity=logging.INFO,
                             **time_series_settings)
```

<a name="ensemble"></a>

### Ensemble configuration

Ensemble models are enabled by default, and appear as the final run iterations in an automated machine learning run. Currently supported ensemble methods are voting and stacking. Voting is implemented as soft-voting using weighted averages, and the stacking implementation is using a two layer implementation, where the first layer has the same models as the voting ensemble, and the second layer model is used to find the optimal combination of the models from the first layer. If you are using ONNX models, **or** have model-explainability enabled, stacking will be disabled and only voting will be utilized.

There are multiple default arguments that can be provided as `kwargs` in an `AutoMLConfig` object to alter the default ensemble behavior.

* `ensemble_download_models_timeout_sec`: During **VotingEnsemble** and **StackEnsemble** model generation, multiple fitted models from the previous child runs are downloaded. If you encounter this error: `AutoMLEnsembleException: Could not find any models for running ensembling`, then you may need to provide more time for the models to be downloaded. The default value is 300 seconds for downloading these models in parallel and there is no maximum timeout limit. Configure this parameter with a higher value than 300 secs, if more time is needed. 

  > [!NOTE]
  >  If the timeout is reached and there are models downloaded, then the ensembling proceeds with as many models it has downloaded. It's not required that all the models need to be downloaded to finish within that timeout.

The following parameters only apply to **StackEnsemble** models: 

* `stack_meta_learner_type`: the meta-learner is a model trained on the output of the individual heterogeneous models. Default meta-learners are `LogisticRegression` for classification tasks (or `LogisticRegressionCV` if cross-validation is enabled) and `ElasticNet` for regression/forecasting tasks (or `ElasticNetCV` if cross-validation is enabled). This parameter can be one of the following strings: `LogisticRegression`, `LogisticRegressionCV`, `LightGBMClassifier`, `ElasticNet`, `ElasticNetCV`, `LightGBMRegressor`, or `LinearRegression`.

* `stack_meta_learner_train_percentage`: specifies the proportion of the training set (when choosing train and validation type of training) to be reserved for training the meta-learner. Default value is `0.2`. 

* `stack_meta_learner_kwargs`: optional parameters to pass to the initializer of the meta-learner. These parameters and parameter types mirror the parameters and parameter types from the corresponding model constructor, and are forwarded to the model constructor.

The following code shows an example of specifying custom ensemble behavior in an `AutoMLConfig` object.

```python
ensemble_settings = {
    "ensemble_download_models_timeout_sec": 600
    "stack_meta_learner_type": "LogisticRegressionCV",
    "stack_meta_learner_train_percentage": 0.3,
    "stack_meta_learner_kwargs": {
        "refit": True,
        "fit_intercept": False,
        "class_weight": "balanced",
        "multi_class": "auto",
        "n_jobs": -1
    }
}

automl_classifier = AutoMLConfig(
        task='classification',
        primary_metric='AUC_weighted',
        experiment_timeout_minutes=30,
        training_data=train_data,
        label_column_name=label,
        n_cross_validations=5,
        **ensemble_settings
        )
```

Ensemble training is enabled by default, but it can be disabled by using the `enable_voting_ensemble` and `enable_stack_ensemble` boolean parameters.

```python
automl_classifier = AutoMLConfig(
        task='classification',
        primary_metric='AUC_weighted',
        experiment_timeout_minutes=30,
        training_data=data_train,
        label_column_name=label,
        n_cross_validations=5,
        enable_voting_ensemble=False,
        enable_stack_ensemble=False
        )
```

## Run experiment

For automated ML, you create an `Experiment` object, which is a named object in a `Workspace` used to run experiments.

```python
from azureml.core.experiment import Experiment

ws = Workspace.from_config()

# Choose a name for the experiment and specify the project folder.
experiment_name = 'automl-classification'
project_folder = './sample_projects/automl-classification'

experiment = Experiment(ws, experiment_name)
```

Submit the experiment to run and generate a model. Pass the `AutoMLConfig` to the `submit` method to generate the model.

```python
run = experiment.submit(automl_config, show_output=True)
```

>[!NOTE]
>Dependencies are first installed on a new machine.  It may take up to 10 minutes before output is shown.
>Setting `show_output` to `True` results in output being shown on the console.

 <a name="exit"></a> 

### Exit criteria

There are a few options you can define to end your experiment.
1. No Criteria: If you do not define any exit parameters the experiment will continue until no further progress is made on your primary metric.
1. Exit after a length of time: Using `experiment_timeout_minutes` in your settings allows you to define how long in minutes should an experiment continue in run.
1. Exit after a score has been reached: Using `experiment_exit_score` will complete the experiment after a primary metric score has been reached.

## Explore model metrics

You can view your training results in a widget or inline if you are in a notebook. See [Track and evaluate models](how-to-monitor-view-training-logs.md#monitor-automated-machine-learning-runs) for more details.

For details on how to download or register a model for deployment to a web service, see [how and where to deploy a model](how-to-deploy-and-where.md).

## Understand automated ML models


<a name="explain"></a>

## Model interpretability

Model interpretability allows you to understand why your models made predictions, and the underlying feature importance values. The SDK includes various packages for enabling model interpretability features, both at training and inference time, for local and deployed models.

See the [how-to](how-to-machine-learning-interpretability-automl.md) for code samples on how to enable interpretability features specifically within automated machine learning experiments.

For general information on how model explanations and feature importance can be enabled in other areas of the SDK outside of automated machine learning, see the [concept](how-to-machine-learning-interpretability.md) article on interpretability.

> [!NOTE]
> The ForecastTCN model is not currently supported by the Explanation Client. This model will not return an explanation dashboard if it is returned as the best model, and does not support on-demand explanation runs.

## Next steps

+ Learn more about [how and where to deploy a model](how-to-deploy-and-where.md).

+ Learn more about [how to train a regression model with Automated machine learning](tutorial-auto-train-models.md) or [how to train using Automated machine learning on a remote resource](how-to-auto-train-remote.md).
+ Learn how to train multiple models with autoML in the [Many Models Solution Accelerator](https://aka.ms/many-models).
