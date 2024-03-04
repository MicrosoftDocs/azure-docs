---
title: Set up AutoML with Python (v2)
titleSuffix: Azure Machine Learning
description: Learn how to set up an AutoML training run for tabular data with the Azure Machine Learning CLI and Python SDK v2.
ms.author: rasavage
author: rsavage2
ms.reviewer: ssalgado
services: machine-learning
ms.service: machine-learning
ms.subservice: automl
ms.date: 08/01/2023
ms.topic: how-to
ms.custom: devx-track-python, automl, sdkv2, event-tier1-build-2022, ignite-2022
show_latex: true
---

# Set up AutoML training for tabular data with the Azure Machine Learning CLI and Python SDK 

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this guide, learn how to set up an automated machine learning, AutoML, training job with the [Azure Machine Learning Python SDK v2](/python/api/overview/azure/ml/intro). Automated ML picks an algorithm and hyperparameters for you and generates a model ready for deployment. This guide provides details of the various options that you can use to configure automated ML experiments.

If you prefer a no-code experience, you can also [Set up no-code AutoML training in the Azure Machine Learning studio](how-to-use-automated-ml-for-ml-models.md).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).
* An Azure Machine Learning workspace. If you don't have one, you can use the steps in the [Create resources to get started](quickstart-create-resources.md) article.

# [Python SDK](#tab/python)

To use the **SDK** information, install the Azure Machine Learning [SDK v2 for Python](https://aka.ms/sdk-v2-install).

To install the SDK you can either, 
* Create a compute instance, which already has installed the latest Azure Machine Learning Python SDK and is pre-configured for ML workflows. See [Create an Azure Machine Learning compute instance](how-to-create-compute-instance.md) for more information.
* Install the SDK on your local machine 

# [Azure CLI](#tab/azurecli)

To use the **CLI** information, install the [Azure CLI and extension for machine learning](how-to-configure-cli.md).

---

## Set up your workspace 

To connect to a workspace, you need to provide a subscription, resource group and workspace name. 

# [Python SDK](#tab/python)

The Workspace details are used in the `MLClient` from `azure.ai.ml` to get a handle to the required Azure Machine Learning workspace. 

In the following example, the default Azure authentication is used along with the default workspace configuration or from any `config.json` file you might have copied into the folders structure. If no `config.json` is found, then you need to manually introduce the subscription_id, resource_group and workspace when creating `MLClient`.

```Python
from azure.identity import DefaultAzureCredential
from azure.ai.ml import MLClient

credential = DefaultAzureCredential()
ml_client = None
try:
    ml_client = MLClient.from_config(credential)
except Exception as ex:
    print(ex)
    # Enter details of your Azure Machine Learning workspace
    subscription_id = "<SUBSCRIPTION_ID>"
    resource_group = "<RESOURCE_GROUP>"
    workspace = "<AZUREML_WORKSPACE_NAME>"
    ml_client = MLClient(credential, subscription_id, resource_group, workspace)

```

# [Azure CLI](#tab/azurecli)

In the CLI, you begin by logging into your Azure account. You may also need to [set the subscription](/cli/azure/manage-azure-subscriptions-azure-cli#change-the-active-subscription) if your account is associated with multiple subscriptions. 

```azurecli
az login
```

You can also set default values for your Workspace to avoid typing these flags into every CLI command:

```azurecli
az configure --defaults group=<RESOURCE_GROUP> workspace=<AZUREML_WORKSPACE_NAME> location=<LOCATION>
```

For more information, see the [CLI setup](how-to-configure-cli.md#set-up) article section.

---

## Data source and format

In order to provide training data to AutoML in SDK v2 you need to upload it into the cloud through an **MLTable**.

Requirements for loading data into an MLTable:
- Data must be in tabular form.
- The value to predict, target column, must be in the data.

Training data must be accessible from the remote compute. Automated ML v2 (Python SDK and CLI/YAML) accepts MLTable data assets (v2), although for backwards compatibility it also supports v1 Tabular Datasets from v1 (a registered Tabular Dataset) through the same input dataset properties. However the recommendation is to use MLTable available in v2. In this example, we assume the data is stored at the local path, `./train_data/bank_marketing_train_data.csv`

# [Python SDK](#tab/python)

You can create an MLTable using the [mltable Python SDK](/python/api/mltable) as in the following example:

```python
import mltable

paths = [
    {'file': './train_data/bank_marketing_train_data.csv'}
]

train_table = mltable.from_delimited_files(paths)
train_table.save('./train_data')
```

This code creates a new file, `./train_data/MLTable`, which contains the file format and loading instructions.

# [Azure CLI](#tab/azurecli)

The following YAML code is the definition of a MLTable that is placed in a local folder or a remote folder in the cloud, along with the data file (.CSV or Parquet file). In this case, we write the YAML text to the local file, `./train_data/MLTable`.

```yml
$schema: https://azuremlschemas.azureedge.net/latest/MLTable.schema.json

paths:
  - file: ./bank_marketing_train_data.csv
transformations:
  - read_delimited:
        delimiter: ','
        encoding: 'ascii'
```

---

Now the `./train_data` folder has the MLTable definition file plus the data file, `bank_marketing_train_data.csv`.

For more information on MLTable, see the [mltable how-to](how-to-mltable.md) article

### Training, validation, and test data

You can specify separate **training data and validation data sets**, however training data must be provided to the `training_data` parameter in the factory function of your automated ML job.

If you don't explicitly specify a `validation_data` or `n_cross_validation` parameter, automated ML applies default techniques to determine how validation is performed. This determination depends on the number of rows in the dataset assigned to your `training_data` parameter. 

|Training&nbsp;data&nbsp;size| Validation technique |
|---|-----|
|**Larger&nbsp;than&nbsp;20,000&nbsp;rows**| Train/validation data split is applied. The default is to take 10% of the initial training data set as the validation set. In turn, that validation set is used for metrics calculation.
|**Smaller&nbsp;than&nbsp;or&nbsp;equal&nbsp;to&nbsp;20,000&nbsp;rows**| Cross-validation approach is applied. The default number of folds depends on the number of rows. <br> **If the dataset is fewer than 1,000 rows**, 10 folds are used. <br> **If the rows are equal to or between 1,000 and 20,000**, then three folds are used.

## Compute to run experiment

Automated ML jobs with the Python SDK v2 (or CLI v2) are currently only supported on Azure Machine Learning remote compute (cluster or compute instance).

[Learn more about creating compute with the Python SDKv2 (or CLIv2).](./how-to-train-model.md).

## Configure your experiment settings

There are several options that you can use to configure your automated ML experiment. These configuration parameters are set in your task method. You can also set job training settings and [exit criteria](#exit-criteria) with the `training` and `limits` settings.

The following example shows the required parameters for a classification task that specifies accuracy as the [primary metric](#primary-metric) and 5 cross-validation folds.

# [Python SDK](#tab/python)

```python
from azure.ai.ml.constants import AssetTypes
from azure.ai.ml import automl, Input

# note that this is a code snippet -- you might have to modify the variable values to run it successfully

# make an Input object for the training data
my_training_data_input = Input(
    type=AssetTypes.MLTABLE, path="./data/training-mltable-folder"
)

# configure the classification job
classification_job = automl.classification(
    compute=my_compute_name,
    experiment_name=my_exp_name,
    training_data=my_training_data_input,
    target_column_name="y",
    primary_metric="accuracy",
    n_cross_validations=5,
    enable_model_explainability=True,
    tags={"my_custom_tag": "My custom value"}
)

# Limits are all optional
classification_job.set_limits(
    timeout_minutes=600, 
    trial_timeout_minutes=20, 
    max_trials=5,
    enable_early_termination=True,
)

# Training properties are optional
classification_job.set_training(
    blocked_training_algorithms=["logistic_regression"], 
    enable_onnx_compatible_models=True
)
```

# [Azure CLI](#tab/azurecli)

```yml
$schema: https://azuremlsdk2.blob.core.windows.net/preview/0.0.1/autoMLJob.schema.json
type: automl

experiment_name: <my_exp_name>
description: A classification AutoML job
task: classification

training_data:
    path: "./train_data"
    type: mltable

compute: azureml:<my_compute_name>
primary_metric: accuracy  
target_column_name: y
n_cross_validations: 5
enable_model_explainability: True

tags:
    <my_custom_tag>: <My custom value>

limits:
    timeout_minutes: 600 
    trial_timeout_minutes: 20 
    max_trials: 5
    enable_early_termination: True

training:
    blocked_training_algorithms: ["logistic_regression"] 
    enable_onnx_compatible_models: True
```

---

### Select your machine learning task type (ML problem)

Before you can submit your automated ML job, you need to determine the kind of machine learning problem you're solving. This problem determines which function your automated ML job uses and what model algorithms it applies.

Automated ML supports tabular data based tasks (classification, regression, forecasting), computer vision tasks (such as Image Classification and Object Detection), and natural language processing tasks (such as Text classification and Entity Recognition tasks). See our article on [task types](concept-automated-ml.md#when-to-use-automl-classification-regression-forecasting-computer-vision--nlp) for more information. See our [time series forecasting guide](how-to-auto-train-forecast.md) for more details on setting up forecasting jobs.


### Supported algorithms

Automated machine learning tries different models and algorithms during the automation and tuning process. As a user, you don't need to specify the algorithm. 

The task method determines the list of algorithms/models, to apply. Use the `allowed_training_algorithms` or `blocked_training_algorithms` parameters in the `training` configuration of the AutoML job to further modify iterations with the available models to include or exclude. 

In the following list of links you can explore the supported algorithms per machine learning task listed below.

Classification | Regression | Time Series Forecasting
|-- |-- |--
[Logistic Regression](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.classification#logisticregression----logisticregression-)* | [Elastic Net](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.regression#elasticnet----elasticnet-)* | [AutoARIMA](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.forecasting#autoarima----autoarima-)
[Light GBM](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.classification#lightgbmclassifier----lightgbm-)* | [Light GBM](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.regression#lightgbmregressor----lightgbm-)* | [Prophet](/python/api/azureml-automl-core/azureml.automl.core.shared.constants.supportedmodels.forecasting#prophet----prophet-)
[Gradient Boosting](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.classification#gradientboosting----gradientboosting-)* | [Gradient Boosting](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.regression#gradientboostingregressor----gradientboosting-)* | [Elastic Net](https://scikit-learn.org/stable/modules/linear_model.html#elastic-net)
[Decision Tree](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.classification#decisiontree----decisiontree-)* |[Decision Tree](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.regression#decisiontreeregressor----decisiontree-)* |[Light GBM](https://lightgbm.readthedocs.io/en/latest/index.html)
[K Nearest Neighbors](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.classification#knearestneighborsclassifier----knn-)* |[K Nearest Neighbors](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.regression#knearestneighborsregressor----knn-)* | K Nearest Neighbors
[Linear SVC](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.classification#linearsupportvectormachine----linearsvm-)* |[LARS Lasso](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.regression#lassolars----lassolars-)* | [Decision Tree](https://scikit-learn.org/stable/modules/tree.html#regression)
[Support Vector Classification (SVC)](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.classification#supportvectormachine----svm-)* |[Stochastic Gradient Descent (SGD)](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.regression#sgdregressor----sgd-)* | [Arimax](/python/api/azureml-automl-core/azureml.automl.core.shared.constants.supportedmodels.forecasting#arimax----arimax-)
[Random Forest](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.classification#randomforest----randomforest-)* | [Random Forest](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.regression#randomforestregressor----randomforest-) | [LARS Lasso](https://scikit-learn.org/stable/modules/linear_model.html#lars-lasso)
[Extremely Randomized Trees](https://scikit-learn.org/stable/modules/ensemble.html#extremely-randomized-trees)* | [Extremely Randomized Trees](https://scikit-learn.org/stable/modules/ensemble.html#extremely-randomized-trees)* | [Extremely Randomized Trees](https://scikit-learn.org/stable/modules/ensemble.html#extremely-randomized-trees)*
[Xgboost](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.classification#xgboostclassifier----xgboostclassifier-)* |[Xgboost](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.regression#xgboostregressor----xgboostregressor-)* | [Random Forest](https://scikit-learn.org/stable/modules/ensemble.html#random-forests)
[Naive Bayes](https://scikit-learn.org/stable/modules/naive_bayes.html#bernoulli-naive-bayes)* | [Xgboost](https://xgboost.readthedocs.io/en/latest/parameter.html)  | [TCNForecaster](concept-automl-forecasting-deep-learning.md#introduction-to-tcnforecaster)
[Stochastic Gradient Descent (SGD)](/python/api/azureml-train-automl-client/azureml.train.automl.constants.supportedmodels.classification#sgdclassifier----sgd-)* |[Stochastic Gradient Descent (SGD)](https://scikit-learn.org/stable/modules/sgd.html#regression) | [Gradient Boosting](https://scikit-learn.org/stable/modules/ensemble.html#regression)
||| [ExponentialSmoothing](/python/api/azureml-automl-core/azureml.automl.core.shared.constants.supportedmodels.forecasting#exponentialsmoothing----exponentialsmoothing-)
||| SeasonalNaive
||| Average
||| Naive
||| SeasonalAverage


With additional algorithms below.

* [Image Classification Multi-class Algorithms](how-to-auto-train-image-models.md#supported-model-architectures)
* [Image Classification Multi-label Algorithms](how-to-auto-train-image-models.md#supported-model-architectures)
* [Image Object Detection Algorithms](how-to-auto-train-image-models.md#supported-model-architectures)
* [NLP Text Classification Multi-label Algorithms](how-to-auto-train-nlp-models.md#language-settings)
* [NLP Text Named Entity Recognition (NER) Algorithms](how-to-auto-train-nlp-models.md#language-settings)

Follow [this link](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/automl-standalone-jobs) for example notebooks of each task type.

### Primary metric

The `primary_metric` parameter determines the metric to be used during model training for optimization. The available metrics you can select is determined by the task type you choose.

Choosing a primary metric for automated ML to optimize depends on many factors. We recommend your primary consideration be to choose a metric that best represents your business needs. Then consider if the metric is suitable for your dataset profile (data size, range, class distribution, etc.). The following sections summarize the recommended primary metrics based on task type and business scenario. 

Learn about the specific definitions of these metrics in [Understand automated machine learning results](how-to-understand-automated-ml.md).

#### Metrics for classification multi-class scenarios 

These metrics apply for all classification scenarios, including tabular data, images/computer-vision and NLP-Text.

Threshold-dependent metrics, like `accuracy`, `recall_score_weighted`, `norm_macro_recall`, and `precision_score_weighted` may not optimize as well for datasets that are small, have large class skew (class imbalance), or when the expected metric value is very close to 0.0 or 1.0. In those cases, `AUC_weighted` can be a better choice for the primary metric. After automated ML completes, you can choose the winning model based on the metric best suited to your business needs.

| Metric | Example use case(s) |
| ------ | ------- |
| `accuracy` | Image classification, Sentiment analysis, Churn prediction |
| `AUC_weighted` | Fraud detection, Image classification, Anomaly detection/spam detection |
| `average_precision_score_weighted` | Sentiment analysis |
| `norm_macro_recall` | Churn prediction |
| `precision_score_weighted` |  |

#### Metrics for classification multi-label scenarios 

- For Text classification, multi-label currently 'Accuracy' is the only primary metric supported.

- For Image classification multi-label, the primary metrics supported are defined in the ClassificationMultilabelPrimaryMetrics Enum

#### Metrics for NLP Text NER (Named Entity Recognition) scenarios 

- For NLP Text NER (Named Entity Recognition) currently 'Accuracy' is the only primary metric supported.

#### Metrics for regression scenarios

`r2_score`, `normalized_mean_absolute_error` and `normalized_root_mean_squared_error` are all trying to minimize prediction errors. `r2_score` and `normalized_root_mean_squared_error` are both minimizing average squared errors while `normalized_mean_absolute_error` is minimizing the average absolute value of errors. Absolute value treats errors at all magnitudes alike and squared errors will have a much larger penalty for errors with larger absolute values. Depending on whether larger errors should be punished more or not, one can choose to optimize squared error or absolute error.

The main difference between `r2_score` and `normalized_root_mean_squared_error` is the way they're normalized and their meanings. `normalized_root_mean_squared_error` is root mean squared error normalized by range and can be interpreted as the average error magnitude for prediction. `r2_score` is mean squared error normalized by an estimate of variance of data. It's the proportion of variation that can be captured by the model. 

> [!NOTE]
> `r2_score` and `normalized_root_mean_squared_error` also behave similarly as primary metrics. If a fixed validation set is applied, these two metrics are optimizing the same target, mean squared error, and will be optimized by the same model. When only a training set is available and cross-validation is applied, they would be slightly different as the normalizer for `normalized_root_mean_squared_error` is fixed as the range of training set, but the normalizer for `r2_score` would vary for every fold as it's the variance for each fold.

If the rank, instead of the exact value is of interest, `spearman_correlation` can be a better choice as it measures the rank correlation between real values and predictions.

AutoML does not currently support any primary metrics that measure _relative_ difference between predictions and observations. The metrics `r2_score`, `normalized_mean_absolute_error`, and `normalized_root_mean_squared_error` are all measures of absolute difference. For example, if a prediction differs from an observation by 10 units, these metrics compute the same value if the observation is 20 units or 20,000 units. In contrast, a percentage difference, which is a relative measure, gives errors of 50% and 0.05%, respectively! To optimize for relative difference, you can run AutoML with a supported primary metric and then select the model with the best `mean_absolute_percentage_error` or `root_mean_squared_log_error`. Note that these metrics are undefined when any observation values are zero, so they may not always be good choices. 

| Metric | Example use case(s) |
| ------ | ------- |
| `spearman_correlation` | |
| `normalized_root_mean_squared_error` | Price prediction (house/product/tip), Review score prediction |
| `r2_score` | Airline delay, Salary estimation, Bug resolution time |
| `normalized_mean_absolute_error` |  |

#### Metrics for Time Series Forecasting scenarios

The recommendations are similar to those noted for regression scenarios. 

| Metric | Example use case(s) |
| ------ | ------- |
| `normalized_root_mean_squared_error` | Price prediction (forecasting), Inventory optimization, Demand forecasting | 
| `r2_score` | Price prediction (forecasting), Inventory optimization, Demand forecasting |
| `normalized_mean_absolute_error` | |

#### Metrics for Image Object Detection scenarios 

- For Image Object Detection, the primary metrics supported are defined in the ObjectDetectionPrimaryMetrics Enum

#### Metrics for Image Instance Segmentation scenarios 

- For Image Instance Segmentation scenarios, the primary metrics supported are defined in the InstanceSegmentationPrimaryMetrics Enum

### Data featurization

In every automated ML experiment, your data is automatically transformed to numbers and vectors of numbers and also scaled and normalized to help algorithms that are sensitive to features that are on different scales. These data transformations are called _featurization_. 

> [!NOTE]
> Automated machine learning featurization steps (feature normalization, handling missing data, converting text to numeric, etc.) become part of the underlying model. When using the model for predictions, the same featurization steps applied during training are applied to your input data automatically.

When configuring your automated ML jobs, you can enable/disable the `featurization` settings. 

The following table shows the accepted settings for featurization. 

|Featurization Configuration | Description |
| ------------- | ------------- |
|`"mode": 'auto'`| Indicates that as part of preprocessing, [data guardrails and featurization steps](./v1/how-to-configure-auto-features.md#featurization) are performed automatically. **Default setting**.|
|`"mode": 'off'`| Indicates featurization step shouldn't be done automatically.|
|`"mode":`&nbsp;`'custom'`| Indicates customized featurization step should be used.|

The following code shows how custom featurization can be provided in this case for a regression job.

# [Python SDK](#tab/python)

```python
from azure.ai.ml.automl import ColumnTransformer

transformer_params = {
    "imputer": [
        ColumnTransformer(fields=["CACH"], parameters={"strategy": "most_frequent"}),
        ColumnTransformer(fields=["PRP"], parameters={"strategy": "most_frequent"}),
    ],
}
regression_job.set_featurization(
    mode="custom",
    transformer_params=transformer_params,
    blocked_transformers=["LabelEncoding"],
    column_name_and_types={"CHMIN": "Categorical"},
)
```

# [Azure CLI](#tab/azurecli)

```yml
$schema: https://azuremlsdk2.blob.core.windows.net/preview/0.0.1/autoMLJob.schema.json
type: automl

experiment_name: <my_exp_name>
description: A classification AutoML job
task: classification

training_data:
    path: "./train_data"
    type: mltable

compute: azureml:<my_compute_name>
primary_metric: accuracy  
target_column_name: y
n_cross_validations: 5
enable_model_explainability: True

featurization:
    mode: custom
    column_name_and_types:
        CHMIN: Categorical
    blocked_transformers: ["label_encoder"]
    transformer_params:
        imputer:
            - fields: ["CACH", "PRP"]
            parameters:
                strategy: most_frequent

limits:
    # limit settings

training:
    # training settings
```

---

### Exit criteria

There are a few options you can define in the `set_limits()` function to end your experiment prior to job completion. 

|Criteria| description
|----|----
No&nbsp;criteria | If you don't define any exit parameters the experiment continues until no further progress is made on your primary metric.
`timeout`| Defines how long, in minutes, your experiment should continue to run. If not specified, the default job's total timeout is 6 days (8,640 minutes). To specify a timeout less than or equal to 1 hour (60 minutes), make sure your dataset's size isn't greater than 10,000,000 (rows times column) or an error results. <br><br> This timeout includes setup, featurization and training runs but doesn't include the ensembling and model explainability runs at the end of the process since those actions need to happen once all the trials (children jobs) are done. 
`trial_timeout_minutes` | Maximum time in minutes that each trial (child job) can run for before it terminates. If not specified, a value of 1 month or 43200 minutes is used
`enable_early_termination`|Whether to end the job if the score is not improving in the short term
`max_trials`| The maximum number of trials/runs each with a different combination of algorithm and hyper-parameters to try during an AutoML job. If not specified, the default is 1000 trials. If using `enable_early_termination` the number of trials used can be smaller.
`max_concurrent_trials`| Represents the maximum number of trials (children jobs) that would be executed in parallel. It's a good practice to match this number with the number of nodes your cluster

## Run experiment
> [!NOTE]
> If you run an experiment with the same configuration settings and primary metric multiple times, you'll likely see variation in each experiments final metrics score and generated models. The algorithms automated ML employs have inherent randomness that can cause slight variation in the models output by the experiment and the recommended model's final metrics score, like accuracy. You'll likely also see results with the same model name, but different hyper-parameters used. 

> [!WARNING]
> If you have set rules in firewall and/or Network Security Group over your workspace, verify that required permissions are given to inbound and outbound network traffic as defined in [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md).

Submit the experiment to run and generate a model. With the `MLClient` created in the prerequisites, you can run the following command in the workspace.

# [Python SDK](#tab/python)

```python

# Submit the AutoML job
returned_job = ml_client.jobs.create_or_update(
    classification_job
)  # submit the job to the backend

print(f"Created job: {returned_job}")

# Get a URL for the status of the job
returned_job.services["Studio"].endpoint

```

# [Azure CLI](#tab/azurecli)

In following CLI command, we assume the job YAML configuration is at the path, `./automl-classification-job.yml`:

```azurecli
run_id=$(az ml job create --file automl-classification-job.yml -w <Workspace> -g <Resource Group> --subscription <Subscription>)
```

You can use the stored run ID to return information about the job. The `--web` parameter opens the Azure Machine Learning studio web UI where you can drill into details on the job:

```azurecli
az ml job show -n $run_id --web
```

---

### Multiple child runs on clusters

Automated ML experiment child runs can be performed on a cluster that is already running another experiment. However, the timing depends on how many nodes the cluster has, and if those nodes are available to run a different experiment.

Each node in the cluster acts as an individual virtual machine (VM) that can accomplish a single training run; for automated ML this means a child run. If all the nodes are busy, a new experiment is queued. But if there are free nodes, the new experiment will run automated ML child runs in parallel in the available nodes/VMs.

To help manage child runs and when they can be performed, we recommend you create a dedicated cluster per experiment, and match the number of `max_concurrent_iterations` of your experiment to the number of nodes in the cluster. This way, you use all the nodes of the cluster at the same time with the number of concurrent child runs/iterations you want.

Configure `max_concurrent_iterations` in the `limits` configuration. If it is not configured, then by default only one concurrent child run/iteration is allowed per experiment.
In case of compute instance, `max_concurrent_trials` can be set to be the same as number of cores on the compute instance VM.

## Explore models and metrics

Automated ML offers options for you to monitor and evaluate your training results. 

* For definitions and examples of the performance charts and metrics provided for each run, see [Evaluate automated machine learning experiment results](how-to-understand-automated-ml.md).

* To get a featurization summary and understand what features were added to a particular model, see [Featurization transparency](./v1/how-to-configure-auto-features.md#featurization-transparency). 

From Azure Machine Learning UI at the model's page you can also view the hyper-parameters used when training a particular model and also view and customize the internal model's training code used. 

## Register and deploy models

After you test a model and confirm you want to use it in production, you can register it for later use.


> [!TIP]
> For registered models, one-click deployment is available via the [Azure Machine Learning studio](https://ml.azure.com). See [how to deploy registered models from the studio](how-to-use-automated-ml-for-ml-models.md#deploy-your-model). 

## AutoML in pipelines

To leverage AutoML in your MLOps workflows, you can add AutoML Job steps to your [Azure Machine Learning Pipelines](./how-to-create-component-pipeline-python.md). This allows you to automate your entire workflow by hooking up your data prep scripts to AutoML and then registering and validating the resulting best model.

Below is a [sample pipeline](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/pipelines/1h_automl_in_pipeline/automl-classification-bankmarketing-in-pipeline) with an AutoML classification component and a command component that shows the resulting AutoML output. Note how the inputs (training & validation data) and the outputs (best model) are referenced in different steps.

# [Python SDK](#tab/python)

``` python
# Define pipeline
@pipeline(
    description="AutoML Classification Pipeline",
    )
def automl_classification(
    classification_train_data,
    classification_validation_data
):
    # define the automl classification task with automl function
    classification_node = classification(
        training_data=classification_train_data,
        validation_data=classification_validation_data,
        target_column_name="y",
        primary_metric="accuracy",
        # currently need to specify outputs "mlflow_model" explictly to reference it in following nodes 
        outputs={"best_model": Output(type="mlflow_model")},
    )
    # set limits and training
    classification_node.set_limits(max_trials=1)
    classification_node.set_training(
        enable_stack_ensemble=False,
        enable_vote_ensemble=False
    )

    command_func = command(
        inputs=dict(
            automl_output=Input(type="mlflow_model")
        ),
        command="ls ${{inputs.automl_output}}",
        environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:latest"
    )
    show_output = command_func(automl_output=classification_node.outputs.best_model)


pipeline_job = automl_classification(
    classification_train_data=Input(path="./training-mltable-folder/", type="mltable"),
    classification_validation_data=Input(path="./validation-mltable-folder/", type="mltable"),
)

# set pipeline level compute
pipeline_job.settings.default_compute = compute_name

# submit the pipeline job
returned_pipeline_job = ml_client.jobs.create_or_update(
    pipeline_job,
    experiment_name=experiment_name
)
returned_pipeline_job

# ...
# Note that this is a snippet from the bankmarketing example you can find in our examples repo -> https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/pipelines/1h_automl_in_pipeline/automl-classification-bankmarketing-in-pipeline

```

For more examples on how to include AutoML in your pipelines, please check out our [examples repo](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/pipelines/1h_automl_in_pipeline/).

# [Azure CLI](#tab/azurecli)

```yml
$schema: https://azuremlschemas.azureedge.net/latest/pipelineJob.schema.json
type: pipeline

description: AutoML Classification Pipeline
experiment_name: <exp_name>

# set the default compute for the pipeline steps
settings:
    default_compute: azureml:<my_compute>

# pipeline inputs
inputs:
    classification_train_data:
        type: mltable
        path: "./train_data"
    classification_validation_data:
        type: mltable
        path: "./valid_data"

jobs:
    # Configure the automl training node of the pipeline 
    classification_node:
        type: automl
        task: classification
        primary_metric: accuracy
        target_column_name: y
        training_data: ${{parent.inputs.classification_train_data}}
        validation_data: ${{parent.inputs.classification_validation_data}}
        training:
            max_trials: 1
        limits:
            enable_stack_ensemble: False
            enable_vote_ensemble: False
        outputs:
            best_model:
                type: mlflow_model

    show_output:
        type: command
        inputs:
            automl_output: ${{parent.jobs.classification_node.outputs.best_model}}
        environment: "AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:latest"
        command: >-
            ls ${{inputs.automl_output}}
        
```

Now, you launch the pipeline run using the following command, assuming the pipeline configuration is at the path `./automl-classification-pipeline.yml`:

```azurecli
> run_id=$(az ml job create --file automl-classification-pipeline.yml -w <Workspace> -g <Resource Group> --subscription <Subscription>)
> az ml job show -n $run_id --web
```

---

## AutoML at scale: distributed training

For large data scenarios, AutoML supports distributed training for a limited set of models:

Distributed algorithm | Supported tasks | Data size limit (approximate)
--|--|--  
[LightGBM](https://lightgbm.readthedocs.io/en/latest/Parallel-Learning-Guide.html) | Classification, regression | 1TB
[TCNForecaster](concept-automl-forecasting-deep-learning.md#introduction-to-tcnforecaster) | Forecasting | 200GB

Distributed training algorithms automatically partition and distribute your data across multiple compute nodes for model training.

> [!NOTE]
> Cross-validation, ensemble models, ONNX support, and code generation are not currently supported in the distributed training mode. Also, AutoML may make choices such as restricting available featurizers and sub-sampling data used for validation, explainability and model evaluation.

### Distributed training for classification and regression

To use distributed training for classification or regression, you need to set the `training_mode` and `max_nodes` properties of the job object. 

Property | Description
-- | --
training_mode | Indicates training mode; `distributed` or `non_distributed`. Defaults to `non_distributed`.
max_nodes | The number of nodes to use for training by each AutoML trial. This setting must be greater than or equal to 4.

The following code sample shows an example of these settings for a classification job:

# [Python SDK](#tab/python)

```python
from azure.ai.ml.constants import TabularTrainingMode

# Set the training mode to distributed
classification_job.set_training(
    allowed_training_algorithms=["LightGBM"],
    training_mode=TabularTrainingMode.DISTRIBUTED
)

# Distribute training across 4 nodes for each trial
classification_job.set_limits(
    max_nodes=4,
    # other limit settings
)
```

# [Azure CLI](#tab/azurecli)

```yml
# Set the training mode to distributed
training:
    allowed_training_algorithms: ["LightGBM"]
    training_mode: distributed

# Distribute training across 4 nodes for each trial
limits:
    max_nodes: 4
```

---

> [!NOTE]
> Distributed training for classification and regression tasks does not currently support multiple concurrent trials. Model trials execute sequentially with each trial using `max_nodes` nodes. The `max_concurrent_trials` limit setting is currently ignored. 

### Distributed training for forecasting

To learn how distributed training works for forecasting tasks, see our [forecasting at scale](concept-automl-forecasting-at-scale.md#distributed-dnn-training) article. To use distributed training for forecasting, you need to set the `training_mode`, `enable_dnn_training`, `max_nodes`, and optionally the `max_concurrent_trials` properties of the job object.

Property | Description
-- | --
training_mode | Indicates training mode; `distributed` or `non_distributed`. Defaults to `non_distributed`.
enable_dnn_training | Flag to enable deep neural network models.
max_concurrent_trials | This is the maximum number of trial models to train in parallel. Defaults to 1.
max_nodes | The total number of nodes to use for training. This setting must be greater than or equal to 2. For forecasting tasks, each trial model is trained using $\text{max}\left(2, \text{floor}( \text{max\_nodes} / \text{max\_concurrent\_trials}) \right)$ nodes.

The following code sample shows an example of these settings for a forecasting job:

# [Python SDK](#tab/python)

```python
from azure.ai.ml.constants import TabularTrainingMode

# Set the training mode to distributed
forecasting_job.set_training(
    enable_dnn_training=True,
    allowed_training_algorithms=["TCNForecaster"],
    training_mode=TabularTrainingMode.DISTRIBUTED
)

# Distribute training across 4 nodes
# Train 2 trial models in parallel => 2 nodes per trial
forecasting_job.set_limits(
    max_concurrent_trials=2,
    max_nodes=4,
    # other limit settings
)
```

# [Azure CLI](#tab/azurecli)

```yml
# Set the training mode to distributed
training:
    allowed_training_algorithms: ["TCNForecaster"]
    training_mode: distributed

# Distribute training across 4 nodes
# Train 2 trial models in parallel => 2 nodes per trial
limits:
    max_concurrent_trials: 2
    max_nodes: 4
```

---

See previous sections on [configuration](#configure-your-experiment-settings) and [job submission](#run-experiment) for samples of full configuration code.

## Next steps

+ Learn more about [how and where to deploy a model](./how-to-deploy-online-endpoints.md).
+ Learn more about [how to set up AutoML to train a time-series forecasting model](./how-to-auto-train-forecast.md).