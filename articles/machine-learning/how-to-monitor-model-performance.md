---
title: Monitor performance of models deployed to production
titleSuffix: Azure Machine Learning
description: Monitor the performance of models deployed to production in Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: how-to
author: ahughes-msft
ms.author: alehughes
ms.reviewer: mopeakande
reviewer: msakande
ms.date: 01/21/2024
ms.custom: devplatv2
---

# Monitor performance of models deployed to production

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

In this article, you learn to perform out-of box and advanced monitoring setup for models that are deployed to Azure Machine Learning online endpoints. You also learn to set up monitoring for models that are deployed outside Azure Machine Learning or deployed to Azure Machine Learning batch endpoints.

Once a machine learning model is in production, it's important to critically evaluate the inherent risks associated with it and identify blind spots that could adversely affect your business. Azure Machine Learning's model monitoring continuously tracks the performance of models in production by providing a broad view of monitoring signals and alerting you to potential issues.

## Prerequisites

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [basic prereqs cli](includes/machine-learning-cli-prereqs.md)]

# [Python SDK](#tab/python)

[!INCLUDE [basic prereqs sdk](includes/machine-learning-sdk-v2-prereqs.md)]

# [Studio](#tab/azure-studio)

Before following the steps in this article, make sure you have the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace and a compute instance. If you don't have these, use the steps in the [Quickstart: Create workspace resources](quickstart-create-resources.md) article to create them.

---

* Azure role-based access controls (Azure RBAC) are used to grant access to operations in Azure Machine Learning. To perform the steps in this article, your user account must be assigned the __owner__ or __contributor__ role for the Azure Machine Learning workspace, or a custom role allowing `Microsoft.MachineLearningServices/workspaces/onlineEndpoints/*`. For more information, see [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md).

*  For monitoring a model that is deployed to an Azure Machine Learning online endpoint (managed online endpoint or Kubernetes online endpoint), be sure to:

    * Have a model already deployed to an Azure Machine Learning online endpoint. Both managed online endpoint and Kubernetes online endpoint are supported. If you don't have a model deployed to an Azure Machine Learning online endpoint, see [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md).

    * Enable data collection for your model deployment. You can enable data collection during the deployment step for Azure Machine Learning online endpoints. For more information, see [Collect production data from models deployed to a real-time endpoint](how-to-collect-production-data.md).

*  For monitoring a model that is deployed to an Azure Machine Learning batch endpoint or deployed outside of Azure Machine Learning, be sure to:

    * Have a means to collect production data and register it as an Azure Machine Learning data asset.
    * Update the registered data asset continuously for model monitoring.
    * (Recommended) Register the model in an Azure Machine Learning workspace, for lineage tracking.

> [!IMPORTANT]
>
> Model monitoring jobs are scheduled to run on serverless Spark compute pools with support for the following VM instance types: `Standard_E4s_v3`, `Standard_E8s_v3`, `Standard_E16s_v3`, `Standard_E32s_v3`, and `Standard_E64s_v3`. You can select the VM instance type with the `create_monitor.compute.instance_type` property in your YAML configuration or from the dropdown in the Azure Machine Learning studio.

## Set up out-of-box model monitoring

If you deploy your model to production in an Azure Machine Learning online endpoint and enable [data collection](how-to-collect-production-data.md) at deployment time, Azure Machine Learning collects production inference data and automatically stores it in Microsoft Azure Blob Storage. You can then use Azure Machine Learning model monitoring to continuously monitor this production inference data.

You can use the Azure CLI, the Python SDK, or the studio for an out-of-box setup of model monitoring. The out-of-box model monitoring configuration provides the following monitoring capabilities:

* Azure Machine Learning automatically detects the production inference dataset that's associated with an Azure Machine Learning online deployment and uses the dataset for model monitoring.
* The comparison baseline dataset is set as the recent, past production inference dataset.
* Monitoring setup automatically includes and tracks the built-in monitoring signals: **data drift**, **prediction drift**, and **data quality**. For each monitoring signal, Azure Machine Learning uses:
  * the recent, past production inference dataset as the comparison baseline dataset.
  * smart defaults for metrics and thresholds.
* A monitoring job is scheduled to run daily at 3:15am (for this example) to acquire monitoring signals and evaluate each metric result against its corresponding threshold. By default, when any threshold is exceeded, Azure Machine Learning sends an alert email to the user that set up the monitor.

# [Azure CLI](#tab/azure-cli)

Azure Machine Learning model monitoring uses `az ml schedule` to schedule a monitoring job. You can create the out-of-box model monitor with the following CLI command and YAML definition:

```azurecli
az ml schedule create -f ./out-of-box-monitoring.yaml
```

The following YAML contains the definition for the out-of-box model monitoring.

:::code language="yaml" source="~/azureml-examples-main/cli/monitoring/out-of-box-monitoring.yaml":::

# [Python SDK](#tab/python)

You can use the following code to set up the out-of-box model monitoring:

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

spark_compute = ServerlessSparkCompute(
    instance_type="standard_e4s_v3",
    runtime_version="3.3"
)

monitoring_target = MonitoringTarget(endpoint_deployment_id="azureml:fraud_detection_endpoint:fraud_detection_deployment")

monitor_definition = MonitorDefinition(compute=spark_compute, monitoring_target=monitoring_target)

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
1. Go to your workspace.
1. Select **Monitoring** from the **Manage** section
1. Select **Add**.

   :::image type="content" source="media/how-to-monitor-models/add-model-monitoring.png" alt-text="Screenshot showing how to add model monitoring." lightbox="media/how-to-monitor-models/add-model-monitoring.png":::

1. Select the model to monitor. The **Select deployment** dropdown list should be automatically populated if the model is deployed to an Azure Machine Learning online endpoint.
1. Select the deployment in the **Select deployment** box.
1. Select the training data to use as the comparison baseline in the **(Optional) Select training data** box.
1. Enter a name for the monitoring in **Monitor name**.
1. Select VM instance type for Spark pool in the **Select compute type** box.
1. Select your **Time zone**. 
1. Select **Recurrence** or **Cron expression** scheduling.
1. For **Recurrence** scheduling, specify the repeat frequency, day, and time. For **Cron expression** scheduling, you would have to enter cron expression for monitoring run.

   :::image type="content" source="media/how-to-monitor-models/monitoring-2.png" alt-text="Screenshot of settings for model monitoring." lightbox="media/how-to-monitor-models/model-monitoring-basic-setup.png":::

1. Select **Next**, leave the **Configure data asset** and **Select monitoring signals** sections as they are. 
1. Add your email in the **Notifications** section.
1. Review your monitoring details and select **Create** to create the monitor.

---

## Set up advanced model monitoring

Azure Machine Learning provides many capabilities for continuous model monitoring. See [Capabilities of model monitoring](concept-model-monitoring.md#capabilities-of-model-monitoring) for a comprehensive list of these capabilities. In many cases, you need to set up model monitoring with advanced monitoring capabilities. In the following example, we set up model monitoring with these capabilities:

* Use of multiple monitoring signals for a broad view
* Use of historical model training data or validation data as the comparison baseline dataset
* Monitoring of top N most important features and individual features

## Configure feature importance

Feature importance represents the relative importance of each input feature to a model's output. For example, `temperature` might be more important to a model's prediction compared `elevation`. Enabling feature importance can give you visibility into which features you do not want drifting or having data quality issues in production. To enable feature importance with any of your signals (such as data drift or data quality), you need to provide a `reference_data` dataset, which must be your training dataset. You must also provide the `reference_data.target_column_name` property, which is the name of your model's output/prediction column. After enabling feature importance, you will see a feature importance for each feature you are monitoring in the Azure Machine Learning model monitoring studio UI. 

You can use Azure CLI, the Python SDK, or Azure Machine Learning studio for advanced setup of model monitoring.

# [Azure CLI](#tab/azure-cli)

You can create advanced model monitoring setup with the following CLI command and YAML definition:

```azurecli
az ml schedule create -f ./advanced-model-monitoring.yaml
```

The following YAML contains the definition for advanced model monitoring.

:::code language="yaml" source="~/azureml-examples-main/cli/monitoring/advanced-model-monitoring.yaml":::

# [Python SDK](#tab/python)

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
    NumericalDriftMetrics,
    CategoricalDriftMetrics,
    DataQualityMetricsNumerical,
    DataQualityMetricsCategorical,
    MonitorFeatureFilter,
    MonitorInputData,
    MonitoringTarget,
    MonitorDefinition,
    MonitorSchedule,
    RecurrencePattern,
    RecurrenceTrigger,
    ServerlessSparkCompute,
    ReferenceData
)

# get a handle to the workspace
ml_client = MLClient(InteractiveBrowserCredential(), subscription_id, resource_group, workspace)

spark_compute = ServerlessSparkCompute(
    instance_type="standard_e4s_v3",
    runtime_version="3.3"
)

monitoring_target = MonitoringTarget(
    ml_task="classification",
    endpoint_deployment_id="azureml:fraud_detection_endpoint:fraund_detection_deployment"
)

# training data to be used as baseline dataset
reference_data_training = ReferenceData(
    input_data=Input(
        type="mltable",
        path="azureml:my_model_training_data:1"
    ),
    target_column_name="fraud_detected",
    data_context=MonitorDatasetContext.TRAINING,
)

# create an advanced data drift signal
features = MonitorFeatureFilter(top_n_feature_importance=20)
metric_thresholds = DataDriftMetricThreshold(
    numerical=NumericalDriftMetrics(
        jensen_shannon_distance=0.01
    ),
    categorical=CategoricalDriftMetrics(
        pearsons_chi_squared_test=0.02
    )
)

advanced_data_drift = DataDriftSignal(
    reference_data=reference_data_training,
    features=features,
    metric_thresholds=metric_thresholds
)


# create an advanced data quality signal
features = ['feature_A', 'feature_B', 'feature_C']

metric_thresholds = DataQualityMetricThreshold(
    numerical=DataQualityMetricsNumerical(
        null_value_rate=0.01
    ),
    categorical=DataQualityMetricsCategorical(
        out_of_bounds_rate=0.02
    )
)

advanced_data_quality = DataQualitySignal(
    reference_data=reference_data_training,
    features=features,
    metric_thresholds=metric_thresholds,
    alert_enabled=False
)

# create feature attribution drift signal
metric_thresholds = FeatureAttributionDriftMetricThreshold(normalized_discounted_cumulative_gain=0.9)

feature_attribution_drift = FeatureAttributionDriftSignal(
    reference_data=reference_data_training,
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
    compute=spark_compute,
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
1. Select **Next** to open the **Configure data asset** section.

1. In the **Configure dataset** section, add a dataset to be used as the reference dataset. We recommend using the model training data as the comparison reference dataset for data drift and data quality, and using the model validation data as the comparison reference dataset for prediction drift.

1. Select **Next**.

   :::image type="content" source="media/how-to-monitor-models/monitoring-4.png" alt-text="Screenshot showing how to add datasets for the monitoring signals to use." lightbox="media/how-to-monitor-models/model-monitoring-advanced-config-data.png":::

1. In the **Select monitoring signals** section, you see three monitoring signals already added if you have selected an Azure Machine Learning online deployment earlier. These signals are: data drift, prediction drift, and data quality. All three of these prepopulated monitoring signals use recent past production data as the comparison reference dataset and use smart defaults for metrics and thresholds.

   :::image type="content" source="media/how-to-monitor-models/monitoring-5.png" alt-text="Screenshot showing how to select monitoring signals." lightbox="media/how-to-monitor-models/model-monitoring-advanced-select-signals.png":::

1. Select **Edit** next to the data drift signal.

   :::image type="content" source="media/how-to-monitor-models/monitoring-6.png" alt-text="Screenshot showing how to select monitoring signals." lightbox="media/how-to-monitor-models/model-monitoring-advanced-select-signals.png":::

1. In the data drift **Edit signal** window, configure the following:
    1. Select the production data asset with your model inputs and the desired lookback window size. 
    1. Select your training dataset to use as the reference dataset. 
    1. Select the target (output) column and select monitor drift for the top N most important features, or monitor drift for a specific set of features.
    1. Select your preferred metrics and thresholds.
1. Select **Save** to return to the **Select monitoring signals** section. 
1. Select **Edit** next to the feature attribution drift (preview) signal.

   :::image type="content" source="media/how-to-monitor-models/monitoring-7.png" alt-text="Screenshot showing how to select monitoring signals." lightbox="media/how-to-monitor-models/model-monitoring-advanced-select-signals.png":::

1. In the feature attribution drift (preview) **Edit signal** window, configure the following:
    1. Select the production data asset with your model inputs and the desired lookback window size. 
    1. Select the production data asset with your model outputs.
    1. Select the common column between these data assets to join them on. If the data was collected with the [Data collector](#how-to-collect-production-data.md), the common column is `correlationid`. 
    1. (Optional)  If you used the [Data collector](how-to-collect-production-data.md) to collect data where your model inputs and outputs are already joined, select the joined dataset as your production data asset and **Remove** step 2 in the configuration panel.  
    1. Select your training dataset to use as the reference dataset. 
    1. Select the target (output) column for your training dataset. 
    1. Select your preferred metric and threshold. 
1. Select **Save** to return to the **Select monitoring signals** section.
1. When you are finished with your monitoring signals configuration, select **Next**. 

:::image type="content" source="media/how-to-monitor-models/monitoring-8.png" alt-text="Screenshot showing how to configure a custom data asset with inputs and outputs joined." lightbox="media/how-to-monitor-models/feature-attribution-drift-inputs-outputs.png":::
      
1. Select **Save** to return to the **Select monitoring signals** section.
1. When you are done with editing or adding signals, select **Next**.
1. In the **Notifications** section, enable alert notifications for each signal and select **Next**.

   :::image type="content" source="media/how-to-monitor-models/monitoring-9.png" alt-text="Screenshot of settings on the notification screen." lightbox="media/how-to-monitor-models/model-monitoring-advanced-config-notification.png":::

1. Review your settings on the **Review monitoring settings** page.

   :::image type="content" source="media/how-to-monitor-models/monitoring-10.png" alt-text="Screenshot showing review page of the advanced configuration for model monitoring." lightbox="media/how-to-monitor-models/model-monitoring-advanced-config-review.png":::

   :::image type="content" source="media/how-to-monitor-models/monitoring-11.png" alt-text="Screenshot showing review page of the advanced configuration for model monitoring." lightbox="media/how-to-monitor-models/model-monitoring-advanced-config-review.png":::

1. Select **Create** to create your advanced model monitor.
---

## Set up model performance monitoring

Azure Machine Learning model monitoring enables you to track the objective performance of your models in production by calculating model performance metrics, such as Accuracy for classification models and RMSE for regression models. To configure your model performance signal, you will need to first satisfy the following requirements: 

* Production model output data (your model's predictions) with unique id for each row
* Ground truth data / actuals with unique id for each row to join with production data
* (Optional) A prejoined dataset with model outputs and ground truth data

The key requirement for enabling model performance is having collected ground truth data. Since ground truth data is encountered at the application-level, it is your responsibility to collect it as it made available and maintain a data asset in Azure Machine Learning with this ground truth data. 

For example, let's suppose you have a deployed model to predict if a credit card transaction is fraudulent (1) or not fraudulent (0). As this model is utilized in production, the model output data can be collected with the [Data collector](how-to-collect-production-data.md). Ground truth data will be made available when a credit card holder specifies whether or not the transaction was fraudulent or not. This `is_fraud` ground truth should be collected at the application-level and maintained within an Azure Machine Learning data asset to be used by the model performance monitoring signal. 

# [Azure CLI](#tab/azure-cli)

Once you've satisfied the previous requirements, you can set up model monitoring with the following CLI command and YAML definition:

```azurecli
az ml schedule create -f ./model-performance-monitoring.yaml
```

The following YAML contains the definition for model monitoring with production inference data that you've collected.

```YAML 
$schema:  http://azureml/sdk-2-0/Schedule.json
name: model_performance_monitoring
display_name: Credit card fraud model performance
description: Credit card fraud model performance

trigger:
  type: recurrence
  frequency: day
  interval: 7 
  schedule: 
    hours: 10
    minutes: 15
  
create_monitor:
  compute: 
    instance_type: standard_e8s_v3
    runtime_version: "3.3"
  monitoring_target:
    ml_task: classification
    endpoint_deployment_id: azureml:loan-approval-endpoint:loan-approval-deployment

  monitoring_signals:
    fraud_detection_model_performance: 
      type: model_performance 
      production_data:
        data_column_names:
          prediction: is_fraud
          correlation_id: correlation_id
      reference_data:
        input_data:
          path: azureml:my_model_ground_truth_data:1
          type: mltable
        data_column_names:
          actual: is_fraud
          correlation_id: correlation_id
        data_context: actuals
      alert_enabled: true
      metric_thresholds: 
        tabular_classification:
          accuracy: 0.95
          precision: 0.8
  alert_notification: 
      emails: 
        - abc@example.com
```

# [Python SDK](#tab/python)

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
    NumericalDriftMetrics,
    CategoricalDriftMetrics,
    DataQualityMetricsNumerical,
    DataQualityMetricsCategorical,
    MonitorFeatureFilter,
    MonitorInputData,
    MonitoringTarget,
    MonitorDefinition,
    MonitorSchedule,
    RecurrencePattern,
    RecurrenceTrigger,
    ServerlessSparkCompute,
    ReferenceData,
    ProductionData
)

# get a handle to the workspace
ml_client = MLClient(
   InteractiveBrowserCredential(),
   subscription_id,
   resource_group,
   workspace
)

spark_compute = ServerlessSparkCompute(
    instance_type="standard_e4s_v3",
    runtime_version="3.2"
)

#define target dataset (production dataset)
production_data = ProductionData(
    input_data=Input(
        type="uri_folder",
        path="azureml:my_model_production_data:1"
    ),
    data_context=MonitorDatasetContext.MODEL_INPUTS,
    pre_processing_component="azureml:production_data_preprocessing:1"
)


# training data to be used as baseline dataset
reference_data_training = ReferenceData(
    input_data=Input(
        type="mltable",
        path="azureml:my_model_training_data:1"
    ),
    data_context=MonitorDatasetContext.TRAINING
)

# create an advanced data drift signal
features = MonitorFeatureFilter(top_n_feature_importance=20)
metric_thresholds = DataDriftMetricThreshold(
    numerical=NumericalDriftMetrics(
        jensen_shannon_distance=0.01
    ),
    categorical=CategoricalDriftMetrics(
        pearsons_chi_squared_test=0.02
    )
)

advanced_data_drift = DataDriftSignal(
    production_data=production_data,
    reference_data=reference_data_training,
    features=features,
    metric_thresholds=metric_thresholds
)


# create an advanced data quality signal
features = ['feature_A', 'feature_B', 'feature_C']
metric_thresholds = DataQualityMetricThreshold(
    numerical=DataQualityMetricsNumerical(
        null_value_rate=0.01
    ),
    categorical=DataQualityMetricsCategorical(
        out_of_bounds_rate=0.02
    )
)

advanced_data_quality = DataQualitySignal(
    production_data=production_data,
    reference_data=reference_data_training,
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
    compute=spark_compute,
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

The studio currently doesn't support model performance monitoring. Support will be coming shortly. 

---

## Set up model monitoring by bringing your own production data to Azure Machine Learning

You can also set up model monitoring for models deployed to Azure Machine Learning batch endpoints or deployed outside of Azure Machine Learning. If you have production data but no deployment, you can use the data to perform continuous model monitoring. To monitor these models, you must meet the following requirements:

* You have a way to collect production inference data from models deployed in production.
* You can register the collected production inference data as an Azure Machine Learning data asset, and ensure continuous updates of the data.
* You must provide a custom data preprocessing component and register it as an Azure Machine Learning component. This is a requirement because, if your data is not collected with the [Data collector](#how-to-collect-production-data.md), the Azure Machine Learning model monitoring system doesn't know how to process it into tabular data with support for time windowing.

Your Azure Machine Learning custom preprocessing component must have these input and output signatures:

  | input/output | signature name | type | description | example value |
  |---|---|---|---|---|
  | input | data_window_start | literal, string | data window start-time in ISO8601 format. | 2023-05-01T04:31:57.012Z |
  | input | data_window_end | literal, string | data window end-time in ISO8601 format. | 2023-05-01T04:31:57.012Z |
  | input | input_data | uri_folder | The collected production inference data, which is registered as Azure Machine Learning data asset. | azureml:myproduction_inference_data:1 |
  | output | preprocessed_data | mltable | A tabular dataset, which matches a subset of baseline data schema. | |

For an example of a custom data preprocessing component, please see our GitHub repo: [https://github.com/Azure/azureml-examples/tree/main/cli/monitoring/components/custom_preprocessing](https://github.com/Azure/azureml-examples/tree/main/cli/monitoring/components/custom_preprocessing).

# [Azure CLI](#tab/azure-cli)

Once you've satisfied the previous requirements, you can set up model monitoring with the following CLI command and YAML definition:

```azurecli
az ml schedule create -f ./model-monitoring-with-collected-data.yaml
```

The following YAML contains the definition for model monitoring with production inference data that you've collected.

:::code language="yaml" source="~/azureml-examples-main/cli/monitoring/model-monitoring-with-collected-data.yaml":::

# [Python SDK](#tab/python)

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
    NumericalDriftMetrics,
    CategoricalDriftMetrics,
    DataQualityMetricsNumerical,
    DataQualityMetricsCategorical,
    MonitorFeatureFilter,
    MonitorInputData,
    MonitoringTarget,
    MonitorDefinition,
    MonitorSchedule,
    RecurrencePattern,
    RecurrenceTrigger,
    ServerlessSparkCompute,
    ReferenceData,
    ProductionData
)

# get a handle to the workspace
ml_client = MLClient(
   InteractiveBrowserCredential(),
   subscription_id,
   resource_group,
   workspace
)

spark_compute = ServerlessSparkCompute(
    instance_type="standard_e4s_v3",
    runtime_version="3.2"
)

#define target dataset (production dataset)
production_data = ProductionData(
    input_data=Input(
        type="uri_folder",
        path="azureml:my_model_production_data:1"
    ),
    data_context=MonitorDatasetContext.MODEL_INPUTS,
    pre_processing_component="azureml:production_data_preprocessing:1"
)


# training data to be used as baseline dataset
reference_data_training = ReferenceData(
    input_data=Input(
        type="mltable",
        path="azureml:my_model_training_data:1"
    ),
    data_context=MonitorDatasetContext.TRAINING
)

# create an advanced data drift signal
features = MonitorFeatureFilter(top_n_feature_importance=20)
metric_thresholds = DataDriftMetricThreshold(
    numerical=NumericalDriftMetrics(
        jensen_shannon_distance=0.01
    ),
    categorical=CategoricalDriftMetrics(
        pearsons_chi_squared_test=0.02
    )
)

advanced_data_drift = DataDriftSignal(
    production_data=production_data,
    reference_data=reference_data_training,
    features=features,
    metric_thresholds=metric_thresholds
)


# create an advanced data quality signal
features = ['feature_A', 'feature_B', 'feature_C']
metric_thresholds = DataQualityMetricThreshold(
    numerical=DataQualityMetricsNumerical(
        null_value_rate=0.01
    ),
    categorical=DataQualityMetricsCategorical(
        out_of_bounds_rate=0.02
    )
)

advanced_data_quality = DataQualitySignal(
    production_data=production_data,
    reference_data=reference_data_training,
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
    compute=spark_compute,
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

The studio currently doesn't support configuring monitoring for models that are deployed outside of Azure Machine Learning. See the Azure CLI or Python tabs instead. Once you have configured your monitor with the CLI or SDK, you can view the monitoring results in the studio. For more information on interpreting monitoring results, see [Interpreting monitoring results](how-to-monitor-model-performance.md#interpreting-monitoring-results).

---

## Set up model monitoring with custom signals and metrics

With Azure Machine Learning model monitoring, you have the option to define your own custom signal and implement any metric of your choice to monitor your model. You can register this signal as an Azure Machine Learning component. When your Azure Machine Learning model monitoring job runs on the specified schedule, it computes the metric(s) you have defined within your custom signal, just as it does for the prebuilt signals (data drift, prediction drift, data quality, & feature attribution drift). To get started with defining your own custom signal, you must meet the following requirement:

* You must define your custom signal and register it as an Azure Machine Learning component. The Azure Machine Learning component must have these input and output signatures:

### Component input signature

The component input DataFrame should contain a `mltable` with the processed data from the preprocessing component and any number of literals, each representing an implemented metric as part of the custom signal component. For example, if you have implemented one metric, `std_deviation`, then you'll need an input for `std_deviation_threshold`. Generally, there should be one input per metric with the name {metric_name}_threshold.

  | signature name | type | description | example value |
  |---|---|---|---|
  | production_data | mltable | A tabular dataset, which matches a subset of baseline data schema. | |
  | std_deviation_threshold | literal, string | Respective threshold for the implemented metric. | 2 |

### Component output signature

The component output port should have the following signature.

  | signature name | type | description | 
  |---|---|---|
  | signal_metrics | mltable | The ml table that contains the computed metrics. The schema is defined in the signal_metrics schema section in the next section. |
  
#### signal_metrics schema
The component output DataFrame should contain four columns: `group`, `metric_name`, `metric_value`, and `threshold_value`:

  | signature name | type | description | example value |
  |---|---|---|---|
  | group | literal, string | Top level logical grouping to be applied to this custom metric. | TRANSACTIONAMOUNT |
  | metric_name | literal, string | The name of the custom metric. | std_deviation |
  | metric_value | numerical | The value of the custom metric. | 44,896.082 |
  | threshold_value | numerical | The threshold for the custom metric. | 2 |

Here's an example output from a custom signal component computing the metric, `std_deviation`:

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

The following YAML contains the definition for model monitoring with a custom signal. It's assumed that you have already created and registered your component with the custom signal definition to Azure Machine Learning. In this example, the `component_id` of the registered custom signal component is `azureml:my_custom_signal:1.0.0`. If you have collected your data with the [Data collector](how-to-collect-production-data.md), you can omit the `pre_processing_component` property. If you wish you use a preprocessing component to preprocess your production data not collected by MDC, you can specify it. 

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
    instance_type: "standard_e4s_v3"
    runtime_version: "3.3"
  monitoring_signals:
    customSignal:
      type: custom
      component_id: azureml:my_custom_signal:1.0.0
      input_data:
        production_data:
          input_data:
            type: uri_folder
            path: azureml:my_production_data:1
          data_context: test
          data_window:
            lookback_window_size: P30D
            lookback_window_offset: P7D
          pre_processing_component: azureml:custom_preprocessor:1.0.0
      metric_thresholds:
        - metric_name: std_deviation
          threshold: 2
  alert_notification:
    emails:
      - abc@example.com
```

# [Python SDK](#tab/python)

The Python SDK currently doesn't support monitoring for custom signals. See the Azure CLI tab instead.

# [Studio](#tab/azure-studio)

The studio currently doesn't support monitoring for custom signals. See the Azure CLI tab instead.

---

## Interpreting monitoring results

After you have configured your model monitor and the first run has completed, you can navigate back to the **Monitoring** tab in your Azure Machine Learning studio to view the results. From the main **Monitoring** view, click on the name of your model monitor and you will see the Monitor overview page. In this view you can see the corresponding model, endpoint, and deployment, along with details regarding the signals you have configured:

> [!NOTE]
>
> The nature of your monitoring dashboard will depend on the monitoring signals you included in your monitoring configuration. In this example, we included both data drift and data quality. 

   :::image type="content" source="media/how-to-monitor-models/monitoring-12.png" alt-text="Screenshot showing how to add model monitoring." lightbox="media/how-to-monitor-models/add-model-monitoring.png":::

In the **Notifications** menu, you can see, for each signal, which features breached the configured threshold for their respective metrics:

   :::image type="content" source="media/how-to-monitor-models/monitoring-13.png" alt-text="Screenshot showing how to add model monitoring." lightbox="media/how-to-monitor-models/add-model-monitoring.png":::

By clicking into the **data drift** signal, you will arrive at the data drift details page. In this view you can see the data drift metric value for each numerical and categorical feature you have included in your monitoring configuration. When your monitor has more than one run, you will see a trendline for each feature.

   :::image type="content" source="media/how-to-monitor-models/monitoring-14.png" alt-text="Screenshot showing how to add model monitoring." lightbox="media/how-to-monitor-models/add-model-monitoring.png":::

To view an individual feature in detail, click on the name of the feature to view the production distribution compared to the reference distribution. This view also affords you the ability to track drift over time for that specific feature. 

   :::image type="content" source="media/how-to-monitor-models/monitoring-15.png" alt-text="Screenshot showing how to add model monitoring." lightbox="media/how-to-monitor-models/add-model-monitoring.png":::

Lastly, from the monitoring dashboard, click on **data quality** to view the data quality signal page. In this view you can see the null value rates, out-of-bounds rates, and data type error rates for each feature you are monitoring. 

   :::image type="content" source="media/how-to-monitor-models/monitoring-16.png" alt-text="Screenshot showing how to add model monitoring." lightbox="media/how-to-monitor-models/add-model-monitoring.png":::

Model monitoring is a continuous process. With Azure Machine Learning model monitoring, you can configure multiple monitoring signals to obtain a broad view into the performance of your models in production.

---

## Integrate Azure Machine Learning model monitoring with Azure EventGrid

You can use events generated by Azure Machine Learning model monitoring to set up event driven applications, processes, or CI/CD workflows with [Azure EventGrid](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-use-event-grid?view=azureml-api-2). You can consume events through various event handlers such as Azure EventHubs, Azure Functions, Logic Apps, and others. Based on drift detected by your monitors, you can take action programmatically, such as setting up an ML pipeline to re-train a model and re-deploy it. 

To get started with integrating Azure Machine Learning model monitoring with Azure EventGrid, follow the steps in [Set up in Azure portal](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-use-event-grid?view=azureml-api-2#set-up-in-azure-portal). Give your **Event Subscription** a name, such as MonitoringEvent, and select only the **Run status changed** box under **Event Types**. 

> [!WARNING]
>
> Unintutively, you do not want to select **Dataset drift detected**, as it applies to data drift v1, rather than Azure Machine Learning model monitoring. Make sure you select **Run status changed**. 

Next, follow the steps in [Filter and subscribe to events](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-use-event-grid?view=azureml-api-2#filter--subscribe-to-events) to set up event filtering for your scenario. Navigate to the **Filters** tab and add the following **Key**, **Operator**, and **Value** under **Advanced Filters**:

- **Key**: data.RunTags.azureml_modelmonitor_threshold_breached
- **Value**: has failed due to one or more features violating metric thresholds 
- **Operator**: String contains  

With this filter, events will be generated when the run status has changed (from Completed to Failed, or from Failed to Completed) for any monitor within your Azure Machine Learning workspace. To filter at the monitoring level, use the following **Key**, **Operator**, and **Value** under **Advanced Filters**:

- **Key**: data.RunTags.azureml_modelmonitor_threshold_breached
- **Value**: `your_monitor_name_signal_name`
- **Operator**: String contains

Ensure that `your_monitor_name_signal_name` is the name of a signal in the specific monitor you want to filter events for. For example, `credit_card_fraud_monitor_data_drift`. For this filter to work, this string must match the name of your monitoring signal. You should name your signal with both the monitor name and the signal name for this case.

When you have completed your **Event Subscription** configuration, select the desired endpoint to serve as your event handler, such as Azure Event Hub. 

After events have been captured, you can view them from the endpoint page:

   :::image type="content" source="media/how-to-monitor-models/monitoring-event-grid1.png" alt-text="Screenshot showing how to add model monitoring." lightbox="media/how-to-monitor-models/add-model-monitoring.png":::

You can also view events in the Azure Monitor **Metrics** tab: 

   :::image type="content" source="media/how-to-monitor-models/monitoring-event-grid2.png" alt-text="Screenshot showing how to add model monitoring." lightbox="media/how-to-monitor-models/add-model-monitoring.png":::

---

## Next steps

- [Data collection from models in production (preview)](concept-data-collection.md)
- [Collect production data from models deployed for real-time inferencing](how-to-collect-production-data.md)
- [CLI (v2) schedule YAML schema for model monitoring (preview)](reference-yaml-monitor.md)
- [Model monitoring for generative AI applications](./prompt-flow/how-to-monitor-generative-ai-applications.md)
