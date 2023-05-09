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
ms.date: 05/09/2023
ms.custom: devplatv2
---

# Monitor performance of models deployed to production (preview)

Once a machine learning model is in production, it's important to critically evaluate the inherent risks associated with it and identify blind spots that could adversely affect your business. Azure Machine Learning's model monitoring continuously tracks the performance of models in production by providing a broad view of monitoring signals and alerting you to potential issues. In this article, you'll learn to perform out-of box and advanced monitoring setup for models that are deployed to Azure Machine Learning online endpoints. You'll also learn to set up model monitoring for models that are deployed outside Azure Machine Learning or deployed to Azure Machine Learning batch endpoints.

[!INCLUDE [machine-learning-preview-generic-disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [basic prereqs cli](../../includes/machine-learning-cli-prereqs.md)]

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

# [Python](#tab/python)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!INCLUDE [basic prereqs sdk](../../includes/machine-learning-sdk-v2-prereqs.md)]

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

---

## Set up out-of-box model monitoring

If you deploy your model to production in an Azure Machine Learning online endpoint, Azure Machine Learning collects production inference data automatically and uses it for continuous monitoring.

You can use Azure CLI, the Python SDK, or Azure Machine Learning studio for out-of-box setup of model monitoring.

# [Azure CLI](#tab/azure-cli)

Azure Machine Learning model monitoring uses `az ml schedule` for model monitoring setup. You can create out-of-box model monitoring setup with the following CLI command and YAML definition:

```azurecli
az ml schedule -f ./out-of-box-monitoring.yaml
```

The following YAML contains the definition for out-of-box model monitoring.

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
    instance_type: standard_e8s_v3
    runtime_version: 3.2
  monitoring_target:
    endpoint_deployment_id: azureml:fraud-detection-endpoint:fraud-detection-deployment
```

Once you set up model monitoring using the previous CLI command and YAML definition, you'll have the following out-of-box model monitoring capabilities:

* Azure Machine Learning will automatically detect the production inference dataset associated with a deployment to an Azure Machine Learning online endpoint and use the dataset for model monitoring.
* The recent past production inference dataset is used as the comparison baseline dataset.
* Monitoring setup automatically includes and tracks the built-in monitoring signals: **data drift**, **prediction drift**, and **data quality**. For each monitoring signal, Azure Machine Learning uses:
  * the recent past production inference dataset as the comparison baseline dataset.
  * smart defaults for metrics and thresholds.
* A monitoring job is scheduled to run daily at 3:15am to acquire monitoring signals and evaluate each metric result against its corresponding threshold. By default, when any threshold is exceeded, an alert email is sent to the user who set up the monitoring.

# [Python](#tab/python)

You can use the following code to set up out-of-box model monitoring:

```python
#get a handle to the workspace
from azure.identity import DefaultAzureCredential, InteractiveBrowserCredential

from azure.ai.ml import MLClient, Input
from azure.ai.ml.constants import TimeZone
from azure.ai.ml.dsl import pipeline
from azure.ai.ml.entities import (
    MonitorSchedule,
    RecurrencePattern,
    RecurrenceTrigger
)

ml_client = MLClient(InteractiveBrowserCredential(), subscription_id, resource_group, workspace)

cpu_cluster = ml_client.computes.get("my_spark_compute")

monitoring_target = MonitoringTarget(endpoint_deployment_id="azureml:fraud_detection_endpoint:fraund_detection_deployment")

monitor_definition = MonitorDefinition(compute=cpu_cluster, monitoring_target=monitoring_target)

recurrence_trigger = RecurrenceTrigger(
    frequency="day",
    interval=1,
    schedule=RecurrencePattern(hours=3, minutes=15)
)

model_monitor = MonitorSchedule(name="fraud_detection_model_monitoring", 
                                trigger=recurrence_trigger, 
                                create_monitor=monitor_definition)

ml_client.schedules.begin_create_or_update(model_monitor)

```

# [Studio](#tab/azure-studio)

---

## Set up advanced model monitoring

Azure Machine Learning provides many capabilities for continuous model monitoring. See [Capabilities of model monitoring](concept-model-monitoring.md#capabilities-of-model-monitoring) for a list of these capabilities. In many cases, you'll need to set up model monitoring with advanced monitoring capabilities. In the following example, we'll set up model monitoring with these capabilities:

* Use of multiple monitoring signals for a broad view
* Use of historical model training data or validation data as the comparison baseline dataset
* Monitoring of top N features and individual features
* Monitoring data drift for a specific subset of the population

You can use Azure CLI, the Python SDK, or Azure Machine Learning studio for advanced setup of model monitoring.

# [Azure CLI](#tab/azure-cli)

You can create advanced model monitoring setup with the following CLI command and YAML definition:

```azurecli
az ml schedule -f ./advanced-model-monitoring.yaml
```

The following YAML contains the definition for advanced model monitoring.

```yaml
# advanced-model-monitoring.yaml
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
  compute: 
    instance_type: standard_e8s_v3
    runtime_version: 3.2
  monitoring_target:
    endpoint_deployment_id: azureml:fraud-detection-endpoint:fraud-detection-deployment
  
  monitoring_signals:
    advanced_data_drift: # monitoring signal name, any user defined name works
      type: data_drift
      # target_dataset is optional. By default target dataset is the production inference data associated with AzureML online depoint
      baseline_dataset:
        input_dataset:
          path: azureml:my_model_training_data:1 # use training data as comparison baseline
          type: mltable
        dataset_context: training
      features: 
        top_n_feature_importance: 20 # monitor drift for top 20 features
      metric_thresholds:
        - applicable_feature_type: numerical
          metric_name: jensen_shannon_distance
          threshold: 0.01
        - applicable_feature_type: categorical
          metric_name: chi_squared_test
          threshhod: 0.02
    advanced_data_drift_subpopulation:
      type: data_drift
      # target_dataset is optional. By default target dataset is the production inference data associated with AzureML online depoint
      baseline_dataset:
        input_dataset:
          path: azureml:my_model_training_data:1
          type: mltable
        dataset_context: training
        # features: by default monitor top 10 features with training dataset available
      data_segment:
        feature_name: state # monitor data drift for Washington and California state data
        feature_values:
          - WA
          - CA
      metric_thresholds:
        - applicable_feature_type: numerical
          metric_name: jensen_shannon_distance
          threshold: 0.01
       - applicable_feature_type: categorical
          metric_name: chi_squared_test
          threshhod: 0.02
    advanced_data_quality:
      type: data_quality
      # target_dataset is optional. By default target dataset is the production inference data associated with AzureML online depoint
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
        - metric_name: null_value_rate
          # use default threshold from training data baseline
        - metric_name: out_of_bounds_rate
          # use default threshold from training data baseline
    feature_attribution_drift_signal:
      type: feature_attribution_drift
      # target_dataset is optional. By default target dataset is the production inference data associated with AzureML online depoint
      baseline_dataset:
        input_dataset:
          path: azureml:my_model_training_data:1
          type: mltable
          target_column_name: fraud_detected
      model_type: classification
      # if no metric_thresholds defined, use the default metric_thresholds
      metric_thresholds:
        - metric_name: normalized_discounted_cumulative_gain
          threshold: 0.05
  
  alert_notification:
    emails:
      - abc@example.com
      - def@example.com
```

# [Python](#tab/python)

You can use the following code for advanced model monitoring setup:

```python
#get a handle to the workspace
from azure.identity import DefaultAzureCredential, InteractiveBrowserCredential

from azure.ai.ml import MLClient, Input
from azure.ai.ml.constants import TimeZone
from azure.ai.ml.dsl import pipeline
from azure.ai.ml.entities import (
    MonitorSchedule,
    RecurrencePattern,
    RecurrenceTrigger
)
from azure.ai.ml.entities.monitoring import (
    MonitorSchedule,
    RecurrencePattern,
    RecurrenceTrigger
)

ml_client = MLClient(InteractiveBrowserCredential(), subscription_id, resource_group, workspace)

cpu_cluster = ml_client.computes.get("cpu_cluster")

monitoring_target = MonitoringTarget(endpoint_deployment_id="azureml:fraud_detection_endpoint:fraund_detection_deployment")

# training data to be used as baseline dataset
monitor_input_data = MonitorInputData(input_dataset=Input(type="mltable, path="azureml:my_model_training_data:1"))

# create an advanced data drift signal
features = MonitorFeatureFilter(top_n_feature_importance=20)
numerical_metric_threshold = DataDriftMetricThreshold(applicable_feature_type="numerical", metric_name="jensen_shannon_distance", threshold=0.01)
categorical_metric_threshold = DataDriftMetricThreshold(applicable_feature_type="categorical", metric_name="chi_squared_test", threshold=0.02)
metric_thresholds = [numberical_metric_threshold, categorical_metric_threshold]

advanced_data_drift = DataDriftSignal(baseline_dataset=monitor_input_data, features=features, metric_thresholds=metric_thresholds)

# create another advanced data drift signal with subpopulation
data_segment = DataSegment(feature_name="state", feature_values=['WA', 'CA'])
advanced_data_drift_subpopulation = DataDriftSignal(baseline_dataset=monitor_input_data, features=features, data_segment=data_segment, metric_thresholds=metric_thresholds)

# create an advanced data quality signal
features = ['feature_A', 'feature_B', 'feature_C']
numerical_metric_threshold = DataQualityMetricThreshold(applicable_feature_type="numerical", metric_name="null_value_rate", threshold=0.01)
categorical_metric_threshold = DataQualityMetricThreshold(applicable_feature_type="categorical", metric_name="out_of_bound_rate", threshold=0.02)
metric_thresholds = [numberical_metric_threshold, categorical_metric_threshold]

advanced_data_quality = DataQualitySignal(baseline_dataset=monitor_input_data, features=features, metric_thresholds=metric_thresholds, alert_enabled="False")

# create feature attribution drift signal
monitor_input_data = MonitorInputData(input_dataset=Input(type="mltable, path="azureml:my_model_training_data:1"), target_column_name="fraud_detected")
metric_thresholds = FeatureAttributionDriftMetricThreshold(threshold=0.05)

feature_attribution_drift = FeatureAttributionDriftSignal(baseline_dataset=monitor_input_data, model_type="classification", metric_thresholds=metric_thresholds, alert_enabled="False")

# put all monitoring signals in a dictionary
monitoring_signals = {'data_drift_advanced':advanced_data_drift, 'data_drift_subpopulation':advanced_data_drift_subpopulation, 'data_quality_advanced':advanced_data_quality, 'feature_attribution_drift':feature_attribution_drift}

# create alert notification object
alert_notification = AlertNotification(['abc@example.com', 'def@example.com'])

# Finally monitor definition
monitor_definition = MonitorDefinition(compute=cpu_cluster, monitoring_target=monitoring_target, monitoring_signals=monitoring_signals, alert_notification=alert_notification)

recurrence_trigger = RecurrenceTrigger(
    frequency="day",
    interval=1,
    schedule=RecurrencePattern(hours=3, minutes=15)
)

model_monitor = MonitorSchedule(name="fraud_detection_model_monitoring", 
                                trigger=recurrence_trigger, 
                                create_monitor=monitor_definition)

ml_client.schedules.begin_create_or_update(model_monitor)

```

# [Studio](#tab/azure-studio)

---

## Set up model monitoring with your own production inference data

# [Azure CLI](#tab/azure-cli)


# [Python](#tab/python)


# [Studio](#tab/azure-studio)

---
## Next steps

- [Explore out-of-box model monitoring example with Azure Machine Learning online endpoint](https://github.com/Azure/azureml-examples) 
- [Explore advanced model monitoring setup with training data as comparison baseline](https://github.com/Azure/azureml-examples)
- [Data collection from models in production (preview)](concept-data-collection.md)
- [Collect production data from models deployed for real-time inferencing](how-to-collect-production-data.md)
- [CLI (v2) schedule YAML schema for model monitoring (preview)](reference-yaml-monitor.md)