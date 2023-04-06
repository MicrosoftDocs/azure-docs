---
title: Set up AutoML with Python (v2)
titleSuffix: Azure Machine Learning
description: Learn how to set up an AutoML training run with the Azure Machine Learning Python SDK v2 using Azure Machine Learning automated ML.
ms.author: shoja
author: shouryaj
ms.reviewer: ssalgado
services: machine-learning
ms.service: machine-learning
ms.subservice: automl
ms.date: 04/20/2022
ms.topic: how-to
ms.custom: devx-track-python, automl, sdkv2, event-tier1-build-2022, ignite-2022
---

# Set up AutoML training with the Azure Machine Learning Python SDK v2

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)] 
> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning Python you are using:"]
> * [v1](./v1/how-to-configure-auto-train-v1.md)
> * [v2 (current version)](how-to-configure-auto-train.md)

In this guide, learn how to set up an automated machine learning, AutoML, training job with the [Azure Machine Learning Python SDK v2](/python/api/overview/azure/ml/intro). Automated ML picks an algorithm and hyperparameters for you and generates a model ready for deployment. This guide provides details of the various options that you can use to configure automated ML experiments.

If you prefer a no-code experience, you can also [Set up no-code AutoML training in the Azure Machine Learning studio](how-to-use-automated-ml-for-ml-models.md).

If you prefer to submit training jobs with the Azure Machine Learning CLI v2 extension, see [Train models](how-to-train-model.md).

## Prerequisites

For this article you need: 
* An Azure Machine Learning workspace. To create the workspace, see [Create workspace resources](quickstart-create-resources.md).

* The Azure Machine Learning Python SDK v2 installed.
    To install the SDK you can either, 
    * Create a compute instance, which already has installed the latest Azure Machine Learning Python SDK and is pre-configured for ML workflows. See [Create and manage an Azure Machine Learning compute instance](how-to-create-manage-compute-instance.md) for more information. 

    * Use the followings commands to install Azure Machine Learning Python SDK v2:
       * Uninstall previous preview version:
       ```Python
       pip uninstall azure-ai-ml
       ```
       * Install the Azure Machine Learning Python SDK v2:
       ```Python
       pip install azure-ai-ml azure-identity
       ```

    [!INCLUDE [automl-sdk-version](../../includes/machine-learning-automl-sdk-version.md)]

## Set up your workspace 

To connect to a workspace, you need to provide a subscription, resource group and workspace name. These details are used in the `MLClient` from `azure.ai.ml` to get a handle to the required Azure Machine Learning workspace. 

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

## Data source and format

In order to provide training data to AutoML in SDK v2 you need to upload it into the cloud through an **MLTable**.

Requirements for loading data into an MLTable:
- Data must be in tabular form.
- The value to predict, target column, must be in the data.

Training data must be accessible from the remote compute. Automated ML v2 (Python SDK and CLI/YAML) accepts MLTable data assets (v2), although for backwards compatibility it also supports v1 Tabular Datasets from v1 (a registered Tabular Dataset) through the same input dataset properties. However the recommendation is to use MLTable available in v2.

The following YAML code is the definition of a MLTable that could be placed in a local folder or a remote folder in the cloud, along with the data file (.CSV or Parquet file).

```
# MLTable definition file

paths:
  - file: ./bank_marketing_train_data.csv
transformations:
  - read_delimited:
        delimiter: ','
        encoding: 'ascii'
```

Therefore, the MLTable folder would have the MLTable definition file plus the data file (the bank_marketing_train_data.csv file in this case).

The following shows two ways of creating an MLTable.
- A. Providing your training data and MLTable definition file from your local folder and it will be automatically uploaded into the cloud (default Workspace Datastore)
- B. Providing a MLTable already registered and uploaded into the cloud.

```Python
from azure.ai.ml.constants import AssetTypes
from azure.ai.ml import automl, Input

# A. Create MLTable for training data from your local directory
my_training_data_input = Input(
    type=AssetTypes.MLTABLE, path="./data/training-mltable-folder"
)

# B. Remote MLTable definition
my_training_data_input  = Input(type=AssetTypes.MLTABLE, path="azureml://datastores/workspaceblobstore/paths/Classification/Train")
```

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
 
<a name='configure-experiment'></a>

## Configure your experiment settings

There are several options that you can use to configure your automated ML experiment. These configuration parameters are set in your task method. You can also set job training settings and [exit criteria](#exit-criteria) with the `set_training()` and `set_limits()` functions, respectively. 

The following example shows the required parameters for a classification task that specifies accuracy as the [primary metric](#primary-metric) and 5 cross-validation folds.

```python
# note that the below is a code snippet -- you might have to modify the variable values to run it successfully
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
    blocked_training_algorithms=["LogisticRegression"], 
    enable_onnx_compatible_models=True
)
```

### Select your machine learning task type (ML problem)

Before you can submit your automated ML job, you need to determine the kind of machine learning problem you're solving. This problem determines which function your automated ML job uses and what model algorithms it applies.

Automated ML supports tabular data based tasks (classification, regression, forecasting), computer vision tasks (such as Image Classification and Object Detection), and natural language processing tasks (such as Text classification and Entity Recognition tasks). Learn more about [task types](concept-automated-ml.md#when-to-use-automl-classification-regression-forecasting-computer-vision--nlp).


### Supported algorithms

Automated machine learning tries different models and algorithms during the automation and tuning process. As a user, there's no need for you to specify the algorithm. 

The task method determines the list of algorithms/models, to apply. Use the `allowed_training_algorithms` or `blocked_training_algorithms` parameters in the `set_training()` setter function to further modify iterations with the available models to include or exclude. 

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
[Naive Bayes](https://scikit-learn.org/stable/modules/naive_bayes.html#bernoulli-naive-bayes)* | [Xgboost](https://xgboost.readthedocs.io/en/latest/parameter.html)  | [ForecastTCN](/python/api/azureml-automl-core/azureml.automl.core.shared.constants.supportedmodels.forecasting#tcnforecaster----tcnforecaster-)
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

`r2_score`, `normalized_mean_absolute_error` and `normalized_root_mean_squared_error` are all trying to minimize prediction errors. `r2_score` and `normalized_root_mean_squared_error` are both minimizing average squared errors while `normalized_mean_absolute_error` is minizing the average absolute value of errors. Absolute value treats errors at all magnitudes alike and squared errors will have a much larger penalty for errors with larger absolute values. Depending on whether larger errors should be punished more or not, one can choose to optimize squared error or absolute error.

The main difference between `r2_score` and `normalized_root_mean_squared_error` is the way they're normalized and their meanings. `normalized_root_mean_squared_error` is root mean squared error normalized by range and can be interpreted as the average error magnitude for prediction. `r2_score` is mean squared error normalized by an estimate of variance of data. It's the proportion of variation that can be captured by the model. 

> [!Note]
> `r2_score` and `normalized_root_mean_squared_error` also behave similarly as primary metrics. If a fixed validation set is applied, these two metrics are optimizing the same target, mean squared error, and will be optimized by the same model. When only a training set is available and cross-validation is applied, they would be slightly different as the normalizer for `normalized_root_mean_squared_error` is fixed as the range of training set, but the normalizer for `r2_score` would vary for every fold as it's the variance for each fold.

If the rank, instead of the exact value is of interest, `spearman_correlation` can be a better choice as it measures the rank correlation between real values and predictions.

However, currently no primary metrics for regression addresses relative difference. All of `r2_score`, `normalized_mean_absolute_error`, and `normalized_root_mean_squared_error` treat a $20k prediction error the same for a worker with a $30k salary as a worker making $20M, if these two data points belongs to the same dataset for regression, or the same time series specified by the time series identifier. While in reality, predicting only $20k off from a $20M salary is very close (a small 0.1% relative difference), whereas $20k off from $30k isn't close (a large 67% relative difference). To address the issue of relative difference, one can train a model with available primary metrics, and then select the model with best `mean_absolute_percentage_error` or `root_mean_squared_log_error`.

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

In every automated ML experiment, your data is automatically transformed to numbers and vectors of numbers plus (i.e. converting text to numeric) also scaled and normalized to help *certain* algorithms that are sensitive to features that are on different scales. This data transformation, scaling and normalization is referred to as featurization. 

> [!NOTE]
> Automated machine learning featurization steps (feature normalization, handling missing data, converting text to numeric, etc.) become part of the underlying model. When using the model for predictions, the same featurization steps applied during training are applied to your input data automatically.

When configuring your automated ML jobs, you can enable/disable the `featurization` settings by using the `.set_featurization()` setter function. 

The following table shows the accepted settings for featurization. 

|Featurization Configuration | Description |
| ------------- | ------------- |
|`"mode": 'auto'`| Indicates that as part of preprocessing, [data guardrails and featurization steps](how-to-configure-auto-features.md#featurization) are performed automatically. **Default setting**.|
|`"mode": 'off'`| Indicates featurization step shouldn't be done automatically.|
|`"mode":`&nbsp;`'custom'`| Indicates customized featurization step should be used.|

The following code shows how custom featurization can be provided in this case for a regression job.

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

<a name="exit"></a> 

### Exit criteria

There are a few options you can define in the `set_limits()` function to end your experiment prior to job completion. 

|Criteria| description
|----|----
No&nbsp;criteria | If you don't define any exit parameters the experiment continues until no further progress is made on your primary metric.
`timeout`| Defines how long, in minutes, your experiment should continue to run. If not specified, the default job's total timeout is 6 days (8,640 minutes). To specify a timeout less than or equal to 1 hour (60 minutes), make sure your dataset's size isn't greater than 10,000,000 (rows times column) or an error results. <br><br> This timeout includes setup, featurization and training runs but doesn't include the ensembling and model explainability runs at the end of the process since those actions need to happen once all the trials (children jobs) are done. 
`trial_timeout_minutes` | Maximum time in minutes that each trial (child job) can run for before it terminates. If not specified, a value of 1 month or 43200 minutes is used
`enable_early_termination`|Whether to end the job if the score is not improving in the short term
`max_trials`| The maximum number of trials/runs each with a different combination of algorithm and hyperparameters to try during an AutoML job. If not specified, the default is 1000 trials. If using `enable_early_termination` the number of trials used can be smaller.
`max_concurrent_trials`| Represents the maximum number of trials (children jobs) that would be executed in parallel. It's a good practice to match this number with the number of nodes your cluster

## Run experiment
> [!NOTE]
> If you run an experiment with the same configuration settings and primary metric multiple times, you'll likely see variation in each experiments final metrics score and generated models. The algorithms automated ML employs have inherent randomness that can cause slight variation in the models output by the experiment and the recommended model's final metrics score, like accuracy. You'll likely also see results with the same model name, but different hyperparameters used. 

> [!WARNING]
> If you have set rules in firewall and/or Network Security Group over your workspace, verify that required permissions are given to inbound and outbound network traffic as defined in [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md).

Submit the experiment to run and generate a model. With the `MLClient` created in the prerequisites, you can run the following command in the workspace.

```python

# Submit the AutoML job
returned_job = ml_client.jobs.create_or_update(
    classification_job
)  # submit the job to the backend

print(f"Created job: {returned_job}")

# Get a URL for the status of the job
returned_job.services["Studio"].endpoint

```

### Multiple child runs on clusters

Automated ML experiment child runs can be performed on a cluster that is already running another experiment. However, the timing depends on how many nodes the cluster has, and if those nodes are available to run a different experiment.

Each node in the cluster acts as an individual virtual machine (VM) that can accomplish a single training run; for automated ML this means a child run. If all the nodes are busy, the new experiment is queued. But if there are free nodes, the new experiment will run automated ML child runs in parallel in the available nodes/VMs.

To help manage child runs and when they can be performed, we recommend you create a dedicated cluster per experiment, and match the number of `max_concurrent_iterations` of your experiment to the number of nodes in the cluster. This way, you use all the nodes of the cluster at the same time with the number of concurrent child runs/iterations you want.

Configure `max_concurrent_iterations` in the .set_limits() setter function. If it is not configured, then by default only one concurrent child run/iteration is allowed per experiment.
In case of compute instance, `max_concurrent_trials` can be set to be the same as number of cores on the compute instance VM.

## Explore models and metrics

Automated ML offers options for you to monitor and evaluate your training results. 

* For definitions and examples of the performance charts and metrics provided for each run, see [Evaluate automated machine learning experiment results](how-to-understand-automated-ml.md).

* To get a featurization summary and understand what features were added to a particular model, see [Featurization transparency](how-to-configure-auto-features.md#featurization-transparency). 

From Azure Machine Learning UI at the model's page you can also view the hyperparameters used when training a particular model and also view and customize the internal model's training code used. 

## Register and deploy models

After you test a model and confirm you want to use it in production, you can register it for later use.


> [!TIP]
> For registered models, one-click deployment is available via the [Azure Machine Learning studio](https://ml.azure.com). See [how to deploy registered models from the studio](how-to-use-automated-ml-for-ml-models.md#deploy-your-model). 

## AutoML in pipelines

To leverage AutoML in your MLOps workflows, you can add AutoML Job steps to your [Azure Machine Learning Pipelines](./how-to-create-component-pipeline-python.md). This allows you to automate your entire workflow by hooking up your data prep scripts to AutoML and then registering and validating the resulting best model.

Below is a [sample pipeline](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/pipelines/1h_automl_in_pipeline/automl-classification-bankmarketing-in-pipeline) with an AutoML classification component and a command component that shows the resulting AutoML output. Note how the inputs (training & validation data) and the outputs (best model) are referenced in different steps.

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
    classification_node.set_training(enable_stack_ensemble=False, enable_vote_ensemble=False)

    command_func = command(
        inputs=dict(
            automl_output=Input(type="mlflow_model")
        ),
        command="ls ${{inputs.automl_output}}",
        environment="AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:latest"
    )
    show_output = command_func(automl_output=classification_node.outputs.best_model)


pipeline_classification = automl_classification(
    classification_train_data=Input(path="./training-mltable-folder/", type="mltable"),
    classification_validation_data=Input(path="./validation-mltable-folder/", type="mltable"),
)

# ...
# Note that the above is only a snippet from the bankmarketing example you can find in our examples repo -> https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/pipelines/1h_automl_in_pipeline/automl-classification-bankmarketing-in-pipeline

```

For more examples on how to do include AutoML in your pipelines, please check out our [examples repo](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/pipelines/1h_automl_in_pipeline/).

## Next steps

+ Learn more about [how and where to deploy a model](./how-to-deploy-online-endpoints.md).