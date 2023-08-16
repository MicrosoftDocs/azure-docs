---
title: Monitor performance of models deployed to production (preview)
titleSuffix: Azure Machine Learning
description: Monitor the performance of models deployed to production on Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: how-to
author: Bozhong68
ms.author: bozhlin
ms.reviewer: mopeakande
reviewer: msakande
ms.date: 05/23/2023
ms.custom: devplatv2
---

# Monitor performance of models deployed to production (preview)

Once a machine learning model is in production, it's important to critically evaluate the inherent risks associated with it and identify blind spots that could adversely affect your business. Azure Machine Learning's model monitoring continuously tracks the performance of models in production by providing a broad view of monitoring signals and alerting you to potential issues. In this article, you'll learn to perform out-of box and advanced monitoring setup for models that are deployed to Azure Machine Learning online endpoints. You'll also learn to set up model monitoring for models that are deployed outside Azure Machine Learning or deployed to Azure Machine Learning batch endpoints.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [basic prereqs cli](includes/machine-learning-cli-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

[!INCLUDE [basic prereqs sdk](includes/machine-learning-sdk-v2-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

# [Studio](#tab/azure-studio)

Before following the steps in this article, make sure you have the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace and a compute instance. If you don't have these, use the steps in the [Quickstart: Create workspace resources](quickstart-create-resources.md) article to create them.

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

---

*  For monitoring a model that is deployed to an Azure Machine Learning online endpoint (Managed Online Endpoint or Kubernetes Online Endpoint):

    * A model deployed to an Azure Machine Learning online endpoint. Both Managed Online Endpoint and Kubernetes Online Endpoint are supported. If you don't have a model deployed to an Azure Machine Learning online endpoint, see [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md).

    * Data collection enabled for your model deployment. You can enable data collection during the deployment step for Azure Machine Learning online endpoints. For more information, see [Collect production data from models deployed to a real-time endpoint](how-to-collect-production-data.md).

*  For monitoring a model that is deployed to an Azure Machine Learning batch endpoint or deployed outside of Azure Machine Learning:

    * A way to collect production data and register it as an Azure Machine Learning data asset.
    * The registered Azure Machine Learning data asset is continuously updated for model monitoring.
    * (Recommended) The model should be registered in Azure Machine Learning workspace, for lineage tracking.



> [!IMPORTANT]
>
> Model monitoring jobs are scheduled to run on serverless Spark compute pool with `Standard_E4s_v3` VM instance type support only. More VM instance type support will come in the future roadmap.

## Set up out-of-the-box model monitoring

If you deploy your model to production in an Azure Machine Learning online endpoint, Azure Machine Learning collects production inference data automatically and uses it for continuous monitoring.

You can use Azure CLI, the Python SDK, or Azure Machine Learning studio for out-of-box setup of model monitoring. The out-of-box model monitoring provides following monitoring capabilities:

* Azure Machine Learning will automatically detect the production inference dataset associated with a deployment to an Azure Machine Learning online endpoint and use the dataset for model monitoring.
* The recent past production inference dataset is used as the comparison baseline dataset.
* Monitoring setup automatically includes and tracks the built-in monitoring signals: **data drift**, **prediction drift**, and **data quality**. For each monitoring signal, Azure Machine Learning uses:
  * the recent past production inference dataset as the comparison baseline dataset.
  * smart defaults for metrics and thresholds.
* A monitoring job is scheduled to run daily at 3:15am (for this example) to acquire monitoring signals and evaluate each metric result against its corresponding threshold. By default, when any threshold is exceeded, an alert email is sent to the user who set up the monitoring.

## Configure feature importance

For feature importance to be enabled with any of your signals (such as data drift or data quality,) you need to provide both the 'baseline_dataset' (typically training) dataset and 'target_column_name' fields. 

# [Azure CLI](#tab/azure-cli)

Azure Machine Learning model monitoring uses `az ml schedule` for model monitoring setup. You can create out-of-box model monitoring setup with the following CLI command and YAML definition:

```azurecli
az ml schedule create -f ./out-of-box-monitoring.yaml
```

The following YAML contains the definition for out-of-the-box model monitoring.

```yaml
# out-of-box-monitoring.yaml
$schema:  http://azureml/sdk-2-0/Schedule.json
name: fraud_detection_model_monitoring
display_name: Fraud detection model monitoring
description: Loan approval model monitoring setup with minimal configurations

trigger:
  # perform model monitoring activity daily at 3:15am
  type: recurrence
  frequency: day #can be minute, hour, day, week, month
  interval: 1 # #every day
  schedule: 
    hours: 3 # at 3am
    minutes: 15 # at 15 mins after 3am

create_monitor:
  compute: # specify a spark compute for monitoring job
    instance_type: standard_e4s_v3
    runtime_version: 3.2
  monitoring_target:
    endpoint_deployment_id: azureml:fraud-detection-endpoint:fraud-detection-deployment
```


# [Python](#tab/python)

You can use the following code to set up out-of-the-box model monitoring:

```python

from azure.identity import InteractiveBrowserCredential
from azure.ai.ml import MLClient
from azure.ai.ml.entities import (
    MonitoringTarget,
    MonitorDefinition,
    MonitorSchedule,
    RecurrencePattern,
    RecurrenceTrigger,
    SparkResourceConfiguration,
)

# get a handle to the workspace
ml_client = MLClient(InteractiveBrowserCredential(), subscription_id, resource_group, workspace)

spark_configuration = SparkResourceConfiguration(
    instance_type="standard_e4s_v3",
    runtime_version="3.2"
)

monitoring_target = MonitoringTarget(endpoint_deployment_id="azureml:fraud_detection_endpoint:fraund_detection_deployment")

monitor_definition = MonitorDefinition(compute=spark_configuration, monitoring_target=monitoring_target)

recurrence_trigger = RecurrenceTrigger(
    frequency="day",
    interval=1,
    schedule=RecurrencePattern(hours=3, minutes=15)
)

model_monitor = MonitorSchedule(name="fraud_detection_model_monitoring", 
                                trigger=recurrence_trigger, 
                                create_monitor=monitor_definition)

poller = ml_client.schedules.begin_create_or_update(model_monitor)
created_monitor = poller.result()

```

# [Studio](#tab/azure-studio)

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com).
1. Under **Manage**, select **Monitoring**.
1. Select **Add**.

   :::image type="content" source="media/how-to-monitor-models/add-model-monitoring.png" alt-text="Screenshot showing how to add model monitoring." lightbox="media/how-to-monitor-models/add-model-monitoring.png":::

1. Select the model to monitor. The "Select deployment" dropdown list should be automatically populated if the model is deployed to an Azure Machine Learning online endpoint.
1. Select the deployment in the **Select deployment** box.
1. Select the training data to use as the comparison baseline in the **(Optional) Select training data** box.
1. Enter a name for the monitoring in **Monitor name**.
1. Select VM instance type for Spark pool in the **Select compute type** box.
1. Select  "Spark 3.2" for the **Spark runtime version**. 
1. Select your **Time zone** for monitoring the job run.
1. Select "Recurrence" or "Cron expression" scheduling.
1. For "Recurrence" scheduling, specify the repeat frequency, day, and time. For "Cron expression" scheduling, you would have to enter cron expression for monitoring run.
1. Select **Finish**.

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-basic-setup.png" alt-text="Screenshot of settings for model monitoring." lightbox="media/how-to-monitor-models/model-monitoring-basic-setup.png":::

---

## Set up advanced model monitoring

Azure Machine Learning provides many capabilities for continuous model monitoring. See [Capabilities of model monitoring](concept-model-monitoring.md#capabilities-of-model-monitoring) for a list of these capabilities. In many cases, you'll need to set up model monitoring with advanced monitoring capabilities. In the following example, we'll set up model monitoring with these capabilities:

* Use of multiple monitoring signals for a broad view
* Use of historical model training data or validation data as the comparison baseline dataset
* Monitoring of top N features and individual features

You can use Azure CLI, the Python SDK, or Azure Machine Learning studio for advanced setup of model monitoring.

# [Azure CLI](#tab/azure-cli)

You can create advanced model monitoring setup with the following CLI command and YAML definition:

```azurecli
az ml schedule create -f ./advanced-model-monitoring.yaml
```

The following YAML contains the definition for advanced model monitoring.

```yaml
# advanced-model-monitoring.yaml
$schema:  http://azureml/sdk-2-0/Schedule.json
name: fraud_detection_model_monitoring
display_name: Fraud detection model monitoring
description: Fraud detection model monitoring with advanced configurations

trigger:
  # perform model monitoring activity daily at 3:15am
  type: recurrence
  frequency: day #can be minute, hour, day, week, month
  interval: 1 # #every day
  schedule: 
    hours: 3 # at 3am
    minutes: 15 # at 15 mins after 3am

create_monitor:
  compute: 
    instance_type: standard_e4s_v3
    runtime_version: 3.2
  monitoring_target:
    endpoint_deployment_id: azureml:fraud-detection-endpoint:fraud-detection-deployment
  
  monitoring_signals:
    advanced_data_drift: # monitoring signal name, any user defined name works
      type: data_drift
      # target_dataset is optional. By default target dataset is the production inference data associated with Azure Machine Learning online endpoint
      baseline_dataset:
        input_dataset:
          path: azureml:my_model_training_data:1 # use training data as comparison baseline
          type: mltable
        dataset_context: training
        target_column_name: fraud_detected
      features: 
        top_n_feature_importance: 20 # monitor drift for top 20 features
      metric_thresholds:
        - applicable_feature_type: numerical
          metric_name: jensen_shannon_distance
          threshold: 0.01
        - applicable_feature_type: categorical
          metric_name: pearsons_chi_squared_test
          threshold: 0.02
    advanced_data_quality:
      type: data_quality
      # target_dataset is optional. By default target dataset is the production inference data associated with Azure Machine Learning online depoint
      baseline_dataset:
        input_dataset:
          path: azureml:my_model_training_data:1
          type: mltable
        dataset_context: training
      features: # monitor data quality for 3 individual features only
        - feature_A
        - feature_B
        - feature_C
      metric_thresholds:
        - applicable_feature_type: numerical
          metric_name: null_value_rate
          # use default threshold from training data baseline
        - applicable_feature_type: categorical
          metric_name: out_of_bounds_rate
          # use default threshold from training data baseline
    feature_attribution_drift_signal:
      type: feature_attribution_drift
      target_dataset:
         dataset:
            input_dataset:
               path: azureml:my_model_production_data:1
               type: uri_folder
            dataset_context: model_inputs_outputs
      baseline_dataset:
        input_dataset:
          path: azureml:my_model_training_data:1
          type: mltable
        dataset_context: training
        target_column_name: fraud_detected
      model_type: classification
      # if no metric_thresholds defined, use the default metric_thresholds
      metric_thresholds:
         threshold: 0.9
  
  alert_notification:
    emails:
      - abc@example.com
      - def@example.com
```

# [Python](#tab/python)

You can use the following code for advanced model monitoring setup:

```python
from azure.identity import InteractiveBrowserCredential
from azure.ai.ml import Input, MLClient
from azure.ai.ml.constants import (
    MonitorFeatureType,
    MonitorMetricName,
    MonitorDatasetContext,
)
from azure.ai.ml.entities import (
    AlertNotification,
    FeatureAttributionDriftSignal,
    FeatureAttributionDriftMetricThreshold,
    DataDriftSignal,
    DataQualitySignal,
    DataDriftMetricThreshold,
    DataQualityMetricThreshold,
    MonitorFeatureFilter,
    MonitorInputData,
    MonitoringTarget,
    MonitorDefinition,
    MonitorSchedule,
    RecurrencePattern,
    RecurrenceTrigger,
    SparkResourceConfiguration,
    TargetDataset,
)

# get a handle to the workspace
ml_client = MLClient(InteractiveBrowserCredential(), subscription_id, resource_group, workspace)

spark_configuration = SparkResourceConfiguration(
    instance_type="standard_e4s_v3",
    runtime_version="3.2"
)

monitoring_target = MonitoringTarget(endpoint_deployment_id="azureml:fraud_detection_endpoint:fraund_detection_deployment")

# training data to be used as baseline dataset
monitor_input_data = MonitorInputData(
    input_dataset=Input(
        type="mltable",
        path="azureml:my_model_training_data:1"
    ),
    dataset_context=MonitorDatasetContext.TRAINING,
)

# create an advanced data drift signal
features = MonitorFeatureFilter(top_n_feature_importance=20)
numerical_metric_threshold = DataDriftMetricThreshold(
    applicable_feature_type=MonitorFeatureType.NUMERICAL,
    metric_name=MonitorMetricName.JENSEN_SHANNON_DISTANCE,
    threshold=0.01
)
categorical_metric_threshold = DataDriftMetricThreshold(
    applicable_feature_type=MonitorFeatureType.CATEGORICAL,
    metric_name=MonitorMetricName.PEARSONS_CHI_SQUARED_TEST,
    threshold=0.02
)
metric_thresholds = [numerical_metric_threshold, categorical_metric_threshold]

advanced_data_drift = DataDriftSignal(
    baseline_dataset=monitor_input_data,
    features=features,
    metric_thresholds=metric_thresholds
)


# create an advanced data quality signal
features = ['feature_A', 'feature_B', 'feature_C']
numerical_metric_threshold = DataQualityMetricThreshold(
    applicable_feature_type=MonitorFeatureType.NUMERICAL,
    metric_name=MonitorMetricName.NULL_VALUE_RATE,
    threshold=0.01
)
categorical_metric_threshold = DataQualityMetricThreshold(
    applicable_feature_type=MonitorFeatureType.CATEGORICAL,
    metric_name=MonitorMetricName.OUT_OF_BOUND_RATE,
    threshold=0.02
)
metric_thresholds = [numerical_metric_threshold, categorical_metric_threshold]

advanced_data_quality = DataQualitySignal(
    baseline_dataset=monitor_input_data,
    features=features,
    metric_thresholds=metric_thresholds,
    alert_enabled=False
)

# create feature attribution drift signal
monitor_target_data = TargetDataset(
    dataset=MonitorInputData(
        input_dataset=Input(
            type="uri_folder",
            path="azureml:endpoint_name-deployment_name-model_inputs_outputs:1"
        ),
        dataset_context=MonitorDatasetContext.MODEL_INPUTS_OUTPUTS,
    )
)
monitor_baseline_data = MonitorInputData(
    input_dataset=Input(
        type="mltable",
        path="azureml:my_model_training_data:1"
    ),
    target_column_name="fraud_detected",
    dataset_context=MonitorDatasetContext.TRAINING,
)
metric_thresholds = FeatureAttributionDriftMetricThreshold(threshold=0.9)

feature_attribution_drift = FeatureAttributionDriftSignal(
    target_dataset=monitor_target_data,
    baseline_dataset=monitor_baseline_data,
    model_type="classification",
    metric_thresholds=metric_thresholds,
    alert_enabled=False
)

# put all monitoring signals in a dictionary
monitoring_signals = {
    'data_drift_advanced':advanced_data_drift,
    'data_quality_advanced':advanced_data_quality,
    'feature_attribution_drift':feature_attribution_drift
}

# create alert notification object
alert_notification = AlertNotification(
    emails=['abc@example.com', 'def@example.com']
)

# Finally monitor definition
monitor_definition = MonitorDefinition(
    compute=spark_configuration,
    monitoring_target=monitoring_target,
    monitoring_signals=monitoring_signals,
    alert_notification=alert_notification
)

recurrence_trigger = RecurrenceTrigger(
    frequency="day",
    interval=1,
    schedule=RecurrencePattern(hours=3, minutes=15)
)

model_monitor = MonitorSchedule(
    name="fraud_detection_model_monitoring_complex",
    trigger=recurrence_trigger,
    create_monitor=monitor_definition
)

poller = ml_client.schedules.begin_create_or_update(model_monitor)
created_monitor = poller.result()

```

# [Studio](#tab/azure-studio)

1. Complete the entires on the basic settings page as described in the [Set up out-of-box model monitoring](#set-up-out-of-the-box-model-monitoring) section.
1. Select **More options** to open the advanced setup wizard.

1. In the "Configure dataset" section, add a dataset to be used as the comparison baseline. We recommend using the model training data as the comparison baseline for data drift and data quality, and using the model validation data as the comparison baseline for prediction drift.

1. Select **Next**.

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-advanced-config-data.png" alt-text="Screenshot showing how to add datasets for the monitoring signals to use." lightbox="media/how-to-monitor-models/model-monitoring-advanced-config-data.png":::

1. In the "Select monitoring signals" section, you'll see three monitoring signals already added if you have selected Azure Machine Learning online deployment earlier. These signals are: data drift, prediction drift, and data quality. All these prepopulated monitoring signals use recent past production data as the comparison baseline and use smart defaults for metrics and threshold.
1. Select **Edit** next to the data drift signal.

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-advanced-select-signals.png" alt-text="Screenshot showing how to select monitoring signals." lightbox="media/how-to-monitor-models/model-monitoring-advanced-select-signals.png":::

1. In the data drift "Edit signal" window, configure following:
    1. Change the baseline dataset to use training data.
    1. Monitor drift for top 1-20 important features, or monitor drift for specific set of features.
    1. Select your preferred metrics and set thresholds.
1. Select **Save** to return to the "Select monitoring signals" section. 

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-advanced-config-edit-signal.png" alt-text="Screenshot showing how to edit signal settings for model monitoring." lightbox="media/how-to-monitor-models/model-monitoring-advanced-config-edit-signal.png":::

1. Select **Add** to add another signal.
1. In the "Add Signal" screen, select the **Feature Attribution Drift** panel.
1. Enter a name for Feature Attribution Drift signal. Feature attribution drift currently requires a few additional steps:
1. Configure your data assets for Feature Attribution Drift
   1. In your model creation wizard, add your custom data asset from your [custom data collection](how-to-collect-production-data.md) called 'model inputs and outputs' which combines your joined model inputs and data assets as a separate data context. 
   
      :::image type="content" source="media/how-to-monitor-models/feature-attribution-drift-inputs-outputs.png" alt-text="Screenshot showing how to configure a custom data asset with inputs and outputs joined." lightbox="media/how-to-monitor-models/feature-attribution-drift-inputs-outputs.png":::
      
   1. Specify your training reference dataset that will be used in the feature attribution drift component, and select your 'target column name' field, which is required to enable feature importance. 
   1. Confirm your parameters are correct
1. Adjust the data window size according to your business case.
1. Adjust the threshold according to your need.
1. Select **Save** to return to the "Select monitoring signals" section.
1. If you're done with editing or adding signals, select **Next**.

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-advanced-config-add-signal.png" alt-text="Screenshot showing settings for adding signals." lightbox="media/how-to-monitor-models/model-monitoring-advanced-config-add-signal.png":::

1. In the "Notification" screen, enable alert notification for each signal.
1. Select **Next**.

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-advanced-config-notification.png" alt-text="Screenshot of settings on the notification screen." lightbox="media/how-to-monitor-models/model-monitoring-advanced-config-notification.png":::

1. Review your settings on the "Review monitoring settings" page.
1. Select **Create** to confirm your settings for advanced model monitoring.

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-advanced-config-review.png" alt-text="Screenshot showing review page of the advanced configuration for model monitoring." lightbox="media/how-to-monitor-models/model-monitoring-advanced-config-review.png":::

---

## Set up model monitoring by bringing your own production data to Azure Machine Learning

You can also set up model monitoring for models deployed to Azure Machine Learning batch endpoints or deployed outside of Azure Machine Learning. If you have production data but no deployment, you can use the data to perform continuous model monitoring. To monitor these models, you must meet the following requirements:

* You have a way to collect production inference data from models deployed in production.
* You can register the collected production inference data as an Azure Machine Learning data asset, and ensure continuous updates of the data.
* You can provide a data preprocessing component and register it as an Azure Machine Learning component. The Azure Machine Learning component must have these input and output signatures:

  | input/output | signature name | type | description | example value |
  |---|---|---|---|---|
  | input | data_window_start | literal, string | data window start-time in ISO8601 format. | 2023-05-01T04:31:57.012Z |
  | input | data_window_end | literal, string | data window end-time in ISO8601 format. | 2023-05-01T04:31:57.012Z |
  | input | input_data | uri_folder | The collected production inference data, which is registered as Azure Machine Learning data asset. | azureml:myproduction_inference_data:1 |
  | output | preprocessed_data | mltable | A tabular dataset, which matches a subset of baseline data schema. | |

# [Azure CLI](#tab/azure-cli)

Once you've satisfied the previous requirements, you can set up model monitoring with the following CLI command and YAML definition:

```azurecli
az ml schedule create -f ./model-monitoring-with-collected-data.yaml
```

The following YAML contains the definition for model monitoring with production inference data that you've collected.

```yaml
# model-monitoring-with-collected-data.yaml
$schema:  http://azureml/sdk-2-0/Schedule.json
name: fraud_detection_model_monitoring
display_name: Fraud detection model monitoring
description: Fraud detection model monitoring with your own production data

trigger:
  # perform model monitoring activity daily at 3:15am
  type: recurrence
  frequency: day #can be minute, hour, day, week, month
  interval: 1 # #every day
  schedule: 
    hours: 3 # at 3am
    minutes: 15 # at 15 mins after 3am

create_monitor:
  compute: 
    instance_type: standard_e4s_v3
    runtime_version: 3.2
  
  monitoring_signals:
    advanced_data_drift: # monitoring signal name, any user defined name works
      type: data_drift
      # define target dataset with your collected data
      target_dataset:
        dataset:
          input_dataset:
            path: azureml:my_production_inference_data_model_inputs:1  # your collected data is registered as Azure Machine Learning asset
            type: uri_folder
          dataset_context: model_inputs
          pre_processing_component: azureml:production_data_preprocessing:1
      baseline_dataset:
        input_dataset:
          path: azureml:my_model_training_data:1 # use training data as comparison baseline
          type: mltable
        dataset_context: training
        target_column_name: fraud_detected
      features: 
        top_n_feature_importance: 20 # monitor drift for top 20 features
      metric_thresholds:
        - applicable_feature_type: numerical
          metric_name: jensen_shannon_distance
          threshold: 0.01
        - applicable_feature_type: categorical
          metric_name: pearsons_chi_squared_test
          threshold: 0.02
    advanced_prediction_drift: # monitoring signal name, any user defined name works
      type: prediction_drift
      # define target dataset with your collected data
      target_dataset:
        dataset:
          input_dataset:
            path: azureml:my_production_inference_data_model_outputs:1  # your collected data is registered as Azure Machine Learning asset
            type: uri_folder
          dataset_context: model_outputs
          pre_processing_component: azureml:production_data_preprocessing:1
      baseline_dataset:
        input_dataset:
          path: azureml:my_model_validation_data:1 # use training data as comparison baseline
          type: mltable
        dataset_context: validation
      metric_thresholds:
        - applicable_feature_type: categorical
          metric_name: pearsons_chi_squared_test
          threshold: 0.02
    advanced_data_quality:
      type: data_quality
      target_dataset:
        dataset:
          input_dataset:
            path: azureml:my_production_inference_data_model_inputs:1  # your collected data is registered as Azure Machine Learning asset
            type: uri_folder
          dataset_context: model_inputs
          pre_processing_component: azureml:production_data_preprocessing:1
      baseline_dataset:
        input_dataset:
          path: azureml:my_model_training_data:1
          type: mltable
        dataset_context: training
      metric_thresholds:
        - applicable_feature_type: numerical
          metric_name: null_value_rate
          # use default threshold from training data baseline
        - applicable_feature_type: categorical
          metric_name: out_of_bounds_rate
          # use default threshold from training data baseline
  
  alert_notification:
    emails:
      - abc@example.com
      - def@example.com

```

# [Python](#tab/python)

Once you've satisfied the previous requirements, you can set up model monitoring using the following Python code:

```python
from azure.identity import InteractiveBrowserCredential
from azure.ai.ml import Input, MLClient
from azure.ai.ml.constants import (
    MonitorFeatureType,
    MonitorMetricName,
    MonitorDatasetContext
)
from azure.ai.ml.entities import (
    AlertNotification,
    DataDriftSignal,
    DataQualitySignal,
    DataDriftMetricThreshold,
    DataQualityMetricThreshold,
    MonitorFeatureFilter,
    MonitorInputData,
    MonitoringTarget,
    MonitorDefinition,
    MonitorSchedule,
    RecurrencePattern,
    RecurrenceTrigger,
    SparkResourceConfiguration,
    TargetDataset
)

# get a handle to the workspace
ml_client = MLClient(
   InteractiveBrowserCredential(),
   subscription_id,
   resource_group,
   workspace
)

spark_configuration = SparkResourceConfiguration(
    instance_type="standard_e4s_v3",
    runtime_version="3.2"
)

#define target dataset (production dataset)
input_data = MonitorInputData(
    input_dataset=Input(
        type="uri_folder",
        path="azureml:my_model_production_data:1"
    ),
    dataset_context=MonitorDatasetContext.MODEL_INPUTS,
    pre_processing_component="azureml:production_data_preprocessing:1"
)

input_data_target = TargetDataset(dataset=input_data)

# training data to be used as baseline dataset
input_data_baseline = MonitorInputData(
    input_dataset=Input(
        type="mltable",
        path="azureml:my_model_training_data:1"
    ),
    dataset_context=MonitorDatasetContext.TRAINING
)

# create an advanced data drift signal
features = MonitorFeatureFilter(top_n_feature_importance=20)
numerical_metric_threshold = DataDriftMetricThreshold(
    applicable_feature_type=MonitorFeatureType.NUMERICAL,
    metric_name=MonitorMetricName.JENSEN_SHANNON_DISTANCE,
    threshold=0.01
)
categorical_metric_threshold = DataDriftMetricThreshold(
    applicable_feature_type=MonitorFeatureType.CATEGORICAL,
    metric_name=MonitorMetricName.PEARSONS_CHI_SQUARED_TEST,
    threshold=0.02
)
metric_thresholds = [numerical_metric_threshold, categorical_metric_threshold]

advanced_data_drift = DataDriftSignal(
    target_dataset=input_data_target,
    baseline_dataset=input_data_baseline,
    features=features,
    metric_thresholds=metric_thresholds
)


# create an advanced data quality signal
features = ['feature_A', 'feature_B', 'feature_C']
numerical_metric_threshold = DataQualityMetricThreshold(
    applicable_feature_type=MonitorFeatureType.NUMERICAL,
    metric_name=MonitorMetricName.NULL_VALUE_RATE,
    threshold=0.01
)
categorical_metric_threshold = DataQualityMetricThreshold(
    applicable_feature_type=MonitorFeatureType.CATEGORICAL,
    metric_name=MonitorMetricName.OUT_OF_BOUND_RATE,
    threshold=0.02
)
metric_thresholds = [numerical_metric_threshold, categorical_metric_threshold]

advanced_data_quality = DataQualitySignal(
    target_dataset=input_data_target,
    baseline_dataset=input_data_baseline,
    features=features,
    metric_thresholds=metric_thresholds,
    alert_enabled="False"
)

# put all monitoring signals in a dictionary
monitoring_signals = {
    'data_drift_advanced': advanced_data_drift,
    'data_quality_advanced': advanced_data_quality
}

# create alert notification object
alert_notification = AlertNotification(
    emails=['abc@example.com', 'def@example.com']
)

# Finally monitor definition
monitor_definition = MonitorDefinition(
    compute=spark_configuration,
    monitoring_signals=monitoring_signals,
    alert_notification=alert_notification
)

recurrence_trigger = RecurrenceTrigger(
    frequency="day",
    interval=1,
    schedule=RecurrencePattern(hours=3, minutes=15)
)

model_monitor = MonitorSchedule(
    name="fraud_detection_model_monitoring_advanced",
    trigger=recurrence_trigger,
    create_monitor=monitor_definition
)

poller = ml_client.schedules.begin_create_or_update(model_monitor)
created_monitor = poller.result()

```

# [Studio](#tab/azure-studio)

The studio currently doesn't support monitoring for models that are deployed outside of Azure Machine Learning. See the Azure CLI or Python tabs instead.

---

## Set up model monitoring with custom signals and metrics

With Azure Machine Learning model monitoring, you have the option to define your own custom signal and implement any metric of your choice to monitor your model. You can register this signal as an Azure Machine Learning component. When your Azure Machine Learning model monitoring job runs on the specified schedule, it will compute the metric(s) you have defined within your custom signal, just as it does for the prebuilt signals (data drift, prediction drift, data quality, & feature attribution drift). To get started with defining your own custom signal, you must meet the following requirement:

* You must define your custom signal and register it as an Azure Machine Learning component. The Azure Machine Learning component must have these input and output signatures:

### Component input signature

The component input DataFrame should contain a `mltable` with the processed data from the preprocessing component and any number of literals, each representing an implemented metric as part of the custom signal component. For example, if you have implemented one metric, `std_deviation`, then you will need an input for `std_deviation_threshold`. Generally, there should be one input per metric with the name {metric_name}_threshold.

  | signature name | type | description | example value |
  |---|---|---|---|
  | production_data | mltable | A tabular dataset, which matches a subset of baseline data schema. | |
  | std_deviation_threshold | literal, string | Respective threshold for the implemented metric. | 2 |

### Component output signature

The component output DataFrame should contain four columns: `group`, `metric_name`, `metric_value`, and `threshold_value`:

  | signature name | type | description | example value |
  |---|---|---|---|
  | group | literal, string | Top level logical grouping to be applied to this custom metric. | TRANSACTIONAMOUNT |
  | metric_name | literal, string | The name of the custom metric. | std_deviation |
  | metric_value | mltable | The value of the custom metric. | 44,896.082 |
  | threshold_value | | The threshold for the custom metric. | 2 |

Here is an example output from a custom signal component computing the metric, `std_deviation`:

  | group | metric_value | metric_name | threshold_value |
  |---|---|---|---|
  | TRANSACTIONAMOUNT | 44,896.082 | std_deviation | 2 |
  | LOCALHOUR | 3.983 | std_deviation | 2 |
  | TRANSACTIONAMOUNTUSD | 54,004.902 | std_deviation | 2 |
  | DIGITALITEMCOUNT | 7.238 | std_deviation | 2 |
  | PHYSICALITEMCOUNT | 5.509 | std_deviation | 2 |

An example custom signal component definition and metric computation code can be found in our GitHub repo at [https://github.com/Azure/azureml-examples/tree/main/cli/monitoring/components/custom_signal](https://github.com/Azure/azureml-examples/tree/main/cli/monitoring/components/custom_signal).

# [Azure CLI](#tab/azure-cli)

Once you've satisfied the previous requirements, you can set up model monitoring with the following CLI command and YAML definition:

```azurecli
az ml schedule create -f ./custom-monitoring.yaml
```

The following YAML contains the definition for model monitoring with a custom signal. It is assumed that you have already created and registered your component with the custom signal definition to Azure Machine Learning. In this example, the `component_id` of the registered custom signal component is `azureml:my_custom_signal:1.0.0`:

```yaml
# custom-monitoring.yaml
$schema:  http://azureml/sdk-2-0/Schedule.json
name: my-custom-signal
trigger:
  type: recurrence
  frequency: day # can be minute, hour, day, week, month
  interval: 7 # #every day
create_monitor:
  compute:
    instance_type: "standard_e8s_v3"
    runtime_version: "3.2"
  monitoring_signals:
    customSignal:
      type: custom
      data_window_size: 360
      component_id: azureml:my_custom_signal:1.0.0
      input_datasets:
        production_data:
          input_dataset:
            type: uri_folder
            path: azureml:custom_without_drift:1
          dataset_context: test
          pre_processing_component: azureml:custom_preprocessor:1.0.0
      metric_thresholds:
        - metric_name: std_dev
          threshold: 2
  alert_notification:
    emails:
      - abc@example.com
```

# [Python](#tab/python)

The Python SDK currently doesn't support monitoring for custom signals. See the Azure CLI tab instead.

# [Studio](#tab/azure-studio)

The studio currently doesn't support monitoring for custom signals. See the Azure CLI tab instead.

---

## Next steps

- [Data collection from models in production (preview)](concept-data-collection.md)
- [Collect production data from models deployed for real-time inferencing](how-to-collect-production-data.md)
- [CLI (v2) schedule YAML schema for model monitoring (preview)](reference-yaml-monitor.md)
