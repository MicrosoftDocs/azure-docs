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
ms.date: 01/29/2024
ms.custom: devplatv2, update-code
---

# Monitor performance of models deployed to production

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Learn to use Azure Machine Learning's model monitoring to continuously track the performance of machine learning models in production. Model monitoring provides you with a broad view of monitoring signals and alerts you to potential issues. When you monitor signals and performance metrics of models in production, you can critically evaluate the inherent risks associated with them and identify blind spots that could adversely affect your business.

In this article you, learn to perform the following tasks:

> [!div class="checklist"]
> * Set up out-of box and advanced monitoring for models that are deployed to Azure Machine Learning online endpoints
> * Monitor performance metrics for models in production
> * Monitor models that are deployed outside Azure Machine Learning or deployed to Azure Machine Learning batch endpoints
> * Set up model monitoring with custom signals and metrics
> * Interpret monitoring results
> * Integrate Azure Machine Learning model monitoring with Azure Event Grid

## Prerequisites

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [basic prereqs cli](includes/machine-learning-cli-prereqs.md)]

# [Python SDK](#tab/python)

[!INCLUDE [basic prereqs sdk](includes/machine-learning-sdk-v2-prereqs.md)]

# [Studio](#tab/azure-studio)

Before following the steps in this article, make sure you have the following prerequisites:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* An Azure Machine Learning workspace and a compute instance. If you don't have these resources, use the steps in the [Quickstart: Create workspace resources](quickstart-create-resources.md) article to create them.

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

Suppose you deploy your model to production in an Azure Machine Learning online endpoint and enable [data collection](how-to-collect-production-data.md) at deployment time. In this scenario, Azure Machine Learning collects production inference data, and automatically stores it in Microsoft Azure Blob Storage. You can then use Azure Machine Learning model monitoring to continuously monitor this production inference data.

You can use the Azure CLI, the Python SDK, or the studio for an out-of-box setup of model monitoring. The out-of-box model monitoring configuration provides the following monitoring capabilities:

* Azure Machine Learning automatically detects the production inference dataset associated with an Azure Machine Learning online deployment and uses the dataset for model monitoring.
* The comparison reference dataset is set as the recent, past production inference dataset.
* Monitoring setup automatically includes and tracks the built-in monitoring signals: **data drift**, **prediction drift**, and **data quality**. For each monitoring signal, Azure Machine Learning uses:
  * the recent, past production inference dataset as the comparison reference dataset.
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
from azure.identity import DefaultAzureCredential
from azure.ai.ml import MLClient
from azure.ai.ml.entities import (
    AlertNotification,
    MonitoringTarget,
    MonitorDefinition,
    MonitorSchedule,
    RecurrencePattern,
    RecurrenceTrigger,
    ServerlessSparkCompute
)

# get a handle to the workspace
ml_client = MLClient(
    DefaultAzureCredential(),
    subscription_id="subscription_id",
    resource_group_name="resource_group_name",
    workspace_name="workspace_name",
)

# create the compute
spark_compute = ServerlessSparkCompute(
    instance_type="standard_e4s_v3",
    runtime_version="3.3"
)

# specify your online endpoint deployment
monitoring_target = MonitoringTarget(
    ml_task="classification",
    endpoint_deployment_id="azureml:credit-default:main"
)


# create alert notification object
alert_notification = AlertNotification(
    emails=['abc@example.com', 'def@example.com']
)

# create the monitor definition
monitor_definition = MonitorDefinition(
    compute=spark_compute,
    monitoring_target=monitoring_target,
    alert_notification=alert_notification
)

# specify the schedule frequency
recurrence_trigger = RecurrenceTrigger(
    frequency="day",
    interval=1,
    schedule=RecurrencePattern(hours=3, minutes=15)
)

# create the monitor
model_monitor = MonitorSchedule(
    name="credit_default_monitor_basic",
    trigger=recurrence_trigger,
    create_monitor=monitor_definition
)

poller = ml_client.schedules.begin_create_or_update(model_monitor)
created_monitor = poller.result()
```

# [Studio](#tab/azure-studio)

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com).
1. Go to your workspace.
1. Select **Monitoring** from the **Manage** section
1. Select **Add**.

   :::image type="content" source="media/how-to-monitor-models/add-model-monitoring.png" alt-text="Screenshot showing how to add model monitoring." lightbox="media/how-to-monitor-models/add-model-monitoring.png":::

1. On the **Basic settings** page, use **(Optional) Select model** to choose the model to monitor.
1. The **(Optional) Select deployment with data collection enabled** dropdown list should be automatically populated if the model is deployed to an Azure Machine Learning online endpoint. Select the deployment from the dropdown list.
1. Select the training data to use as the comparison reference in the **(Optional) Select training data** box.
1. Enter a name for the monitoring in **Monitor name** or keep the default name.
1. Notice that the virtual machine size is already selected for you.
1. Select your **Time zone**. 
1. Select **Recurrence** or **Cron expression** scheduling.
1. For **Recurrence** scheduling, specify the repeat frequency, day, and time. For **Cron expression** scheduling, enter a cron expression for monitoring run.

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-basic-setup.png" alt-text="Screenshot of basic settings page for model monitoring." lightbox="media/how-to-monitor-models/model-monitoring-basic-setup.png":::

1. Select **Next** to go to the **Advanced settings** section. 
1. Select **Next** on the **Configure data asset** page to keep the default datasets.
1. Select **Next** to go to the **Select monitoring signals** page.
1. Select **Next** to go to the **Notifications** page. Add your email to receive email notifications.
1. Review your monitoring details and select **Create** to create the monitor.

---

## Set up advanced model monitoring

Azure Machine Learning provides many capabilities for continuous model monitoring. See [Capabilities of model monitoring](concept-model-monitoring.md#capabilities-of-model-monitoring) for a comprehensive list of these capabilities. In many cases, you need to set up model monitoring with advanced monitoring capabilities. In the following sections, you set up model monitoring with these capabilities:

* Use of multiple monitoring signals for a broad view.
* Use of historical model training data or validation data as the comparison reference dataset.
* Monitoring of top N most important features and individual features.

### Configure feature importance

Feature importance represents the relative importance of each input feature to a model's output. For example, `temperature` might be more important to a model's prediction compared to `elevation`. Enabling feature importance can give you visibility into which features you don't want drifting or having data quality issues in production. 

To enable feature importance with any of your signals (such as data drift or data quality), you need to provide:

- Your training dataset as the `reference_data` dataset.
- The `reference_data.data_column_names.target_column` property, which is the name of your model's output/prediction column. 
 
After enabling feature importance, you'll see a feature importance for each feature you're monitoring in the Azure Machine Learning model monitoring studio UI.

You can use Azure CLI, the Python SDK, or the studio for advanced setup of model monitoring.

# [Azure CLI](#tab/azure-cli)

Create advanced model monitoring setup with the following CLI command and YAML definition:

```azurecli
az ml schedule create -f ./advanced-model-monitoring.yaml
```

The following YAML contains the definition for advanced model monitoring.

:::code language="yaml" source="~/azureml-examples-main/cli/monitoring/advanced-model-monitoring.yaml":::

# [Python SDK](#tab/python)

Use the following code for advanced model monitoring setup:

```python
from azure.identity import DefaultAzureCredential
from azure.ai.ml import Input, MLClient
from azure.ai.ml.constants import (
    MonitorDatasetContext,
)
from azure.ai.ml.entities import (
    AlertNotification,
    BaselineDataRange,
    DataDriftSignal,
    DataQualitySignal,
    PredictionDriftSignal,
    DataDriftMetricThreshold,
    DataQualityMetricThreshold,
    FeatureAttributionDriftMetricThreshold,
    FeatureAttributionDriftSignal,
    PredictionDriftMetricThreshold,
    NumericalDriftMetrics,
    CategoricalDriftMetrics,
    DataQualityMetricsNumerical,
    DataQualityMetricsCategorical,
    MonitorFeatureFilter,
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
    DefaultAzureCredential(),
    subscription_id="subscription_id",
    resource_group_name="resource_group_name",
    workspace_name="workspace_name",
)

# create your compute
spark_compute = ServerlessSparkCompute(
    instance_type="standard_e4s_v3",
    runtime_version="3.3"
)

# specify the online deployment (if you have one)
monitoring_target = MonitoringTarget(
    ml_task="classification",
    endpoint_deployment_id="azureml:credit-default:main"
)

# specify a lookback window size and offset, or omit this to use the defaults, which are specified in the documentation
data_window = BaselineDataRange(lookback_window_size="P1D", lookback_window_offset="P0D")

production_data = ProductionData(
    input_data=Input(
        type="uri_folder",
        path="azureml:credit-default-main-model_inputs:1"
    ),
    data_window=data_window,
    data_context=MonitorDatasetContext.MODEL_INPUTS,
)

# training data to be used as reference dataset
reference_data_training = ReferenceData(
    input_data=Input(
        type="mltable",
        path="azureml:credit-default-reference:1"
    ),
    data_column_names={
        "target_column":"DEFAULT_NEXT_MONTH"
    },
    data_context=MonitorDatasetContext.TRAINING,
)

# create an advanced data drift signal
features = MonitorFeatureFilter(top_n_feature_importance=10)

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

# create an advanced prediction drift signal
metric_thresholds = PredictionDriftMetricThreshold(
    categorical=CategoricalDriftMetrics(
        jensen_shannon_distance=0.01
    )
)

advanced_prediction_drift = PredictionDriftSignal(
    reference_data=reference_data_training,
    metric_thresholds=metric_thresholds
)

# create an advanced data quality signal
features = ['SEX', 'EDUCATION', 'AGE']

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
    'feature_attribution_drift':feature_attribution_drift,
}

# create alert notification object
alert_notification = AlertNotification(
    emails=['abc@example.com', 'def@example.com']
)

# create the monitor definition
monitor_definition = MonitorDefinition(
    compute=spark_compute,
    monitoring_target=monitoring_target,
    monitoring_signals=monitoring_signals,
    alert_notification=alert_notification
)

# specify the frequency on which to run your monitor
recurrence_trigger = RecurrenceTrigger(
    frequency="day",
    interval=1,
    schedule=RecurrencePattern(hours=3, minutes=15)
)

# create your monitor
model_monitor = MonitorSchedule(
    name="credit_default_monitor_advanced",
    trigger=recurrence_trigger,
    create_monitor=monitor_definition
)

poller = ml_client.schedules.begin_create_or_update(model_monitor)
created_monitor = poller.result()
```

# [Studio](#tab/azure-studio)

To set up advanced monitoring:

1. Complete the entires on the **Basic settings** page as described earlier in the [Set up out-of-box model monitoring](#set-up-out-of-box-model-monitoring) section.
1. Select **Next** to open the **Configure data asset** page of the **Advanced settings** section.
1. **Add** a dataset to be used as the reference dataset. We recommend that you use the model training data as the comparison reference dataset for data drift and data quality. Also, use the model validation data as the comparison reference dataset for prediction drift.

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-advanced-configuration-data.png" alt-text="Screenshot showing how to add datasets for the monitoring signals to use." lightbox="media/how-to-monitor-models/model-monitoring-advanced-configuration-data.png":::

1. Select **Next** to go to the **Select monitoring signals** page. On this page, you see some monitoring signals already added (if you selected an Azure Machine Learning online deployment earlier).  The signals (data drift, prediction drift, and data quality) use recent, past production data as the comparison reference dataset and use smart defaults for metrics and thresholds.

    :::image type="content" source="media/how-to-monitor-models/model-monitoring-monitoring-signals.png" alt-text="Screenshot showing default monitoring signals." lightbox="media/how-to-monitor-models/model-monitoring-monitoring-signals.png":::

1. Select **Edit** next to the data drift signal.
1. Configure the data drift in the **Edit signal** window as follows:

    1. In step 1, for the production data asset, select your model inputs dataset. Also, make the following selection:
        - Select the desired lookback window size.
    1. In step 2, for the reference data asset, select your training dataset. Also, make the following selection:
        - Select the target (output) column.
    1. In step 3, select to monitor drift for the top N most important features, or monitor drift for a specific set of features.
    1. In step 4, select your preferred metric and thresholds to use for numerical features.
    1. In step 5, select your preferred metric and thresholds to use for categorical features.

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-configure-signals.png" alt-text="Screenshot showing how to configure selected monitoring signals." lightbox="media/how-to-monitor-models/model-monitoring-configure-signals.png":::

1. Select **Save** to return to the **Select monitoring signals** page.
1. Select **Add** to open the **Edit Signal** window.
1. Select **Feature attribution drift (preview)** to configure the feature attribution drift signal as follows:

    1. In step 1, select the production data asset that has your model inputs
        - Also, select the desired lookback window size.
    1. In step 2, select the production data asset that has your model outputs.
        - Also, select the common column between these data assets to join them on. If the data was collected with the [data collector](how-to-collect-production-data.md), the common column is `correlationid`.
    1. (Optional)  If you used the data collector to collect data that has your model inputs and outputs already joined, select the joined dataset as your production data asset (in step 1) 
        - Also, **Remove** step 2 in the configuration panel.  
    1. In step 3, select your training dataset to use as the reference dataset.
        - Also, select the target (output) column for your training dataset.
    1. In step 4, select your preferred metric and threshold.

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-configure-feature-attribution-drift.png" alt-text="Screenshot showing how to configure feature attribution drift signal." lightbox="media/how-to-monitor-models/model-monitoring-configure-feature-attribution-drift.png":::

1. Select **Save** to return to the **Select monitoring signals** page.

    :::image type="content" source="media/how-to-monitor-models/model-monitoring-configured-signals.png" alt-text="Screenshot showing the configured signals." lightbox="media/how-to-monitor-models/model-monitoring-configured-signals.png":::

1. When you're finished with your monitoring signals configuration, select **Next** to go to the **Notifications** page.
1. On the **Notifications** page, enable alert notifications for each signal and select **Next**.
1. Review your settings on the **Review monitoring settings** page.

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-advanced-configuration-review.png" alt-text="Screenshot showing review page of the advanced configuration for model monitoring." lightbox="media/how-to-monitor-models/model-monitoring-advanced-configuration-review.png":::

1. Select **Create** to create your advanced model monitor.

---

## Set up model performance monitoring

Azure Machine Learning model monitoring enables you to track the performance of your models in production by calculating their performance metrics. The following model performance metrics are currently supported:

For classification models:

- Precision
- Accuracy
- Recall

For regression models:

- Mean Absolute Error (MAE)
- Mean Squared Error (MSE)
- Root Mean Squared Error (RMSE)

### More prerequisites for model performance monitoring

You must satisfy the following requirements for you to configure your model performance signal:

* Have output data for the production model (the model's predictions) with a unique ID for each row. If you collect production data with the [Azure Machine Learning data collector](how-to-collect-production-data.md), a `correlation_id` is provided for each inference request for you. With the data collector, you also have the option to log your own unique ID from your application.

    > [!NOTE]
    >
    > For Azure Machine Learning model performance monitoring, we recommend that you log your unique ID in its own column, using the [Azure Machine Learning data collector](how-to-collect-production-data.md).

* Have ground truth data (actuals) with a unique ID for each row. The unique ID for a given row should match the unique ID for the model outputs for that particular inference request. This unique ID is used to join your ground truth dataset with the model outputs.

  Without having ground truth data, you can't perform model performance monitoring. Since ground truth data is encountered at the application level, it's your responsibility to collect it as it becomes available. You should also maintain a data asset in Azure Machine Learning that contains this ground truth data.

* (Optional) Have a pre-joined tabular dataset with model outputs and ground truth data already joined together.

### Monitor model performance requirements when using data collector

If you use the [Azure Machine Learning data collector](concept-data-collection.md) to collect production inference data without supplying your own unique ID for each row as a separate column, a `correlationid` will be autogenerated for you and included in the logged JSON object. However, the data collector will [batch rows](how-to-collect-production-data.md#data-collector-batching) that are sent within short time intervals of each other. Batched rows will fall within the same JSON object and will thus have the same `correlationid`.

In order to differentiate between the rows in the same JSON object, Azure Machine Learning model performance monitoring uses indexing to determine the order of the rows in the JSON object. For example, if three rows are batched together, and the `correlationid` is `test`, row one will have an ID of `test_0`, row two will have an ID of `test_1`, and row three will have an ID of `test_2`. To ensure that your ground truth dataset contains unique IDs that match to the collected production inference model outputs, ensure that you index each `correlationid` appropriately. If your logged JSON object only has one row, then the `correlationid` would be `correlationid_0`.

To avoid using this indexing, we recommend that you log your unique ID in its own column within the pandas DataFrame that you're logging with the [Azure Machine Learning data collector](how-to-collect-production-data.md). Then, in your model monitoring configuration, you specify the name of this column to join your model output data with your ground truth data. As long as the IDs for each row in both datasets are the same, Azure Machine Learning model monitoring can perform model performance monitoring.

### Example workflow for monitoring model performance

To understand the concepts associated with model performance monitoring, consider this example workflow. Suppose you're deploying a model to predict whether credit card transactions are fraudulent or not, you can follow these steps to monitor the model's performance:

1. Configure your deployment to use the data collector to collect the model's production inference data (input and output data). Let's say that the output data is stored in a column `is_fraud`.
1. For each row of the collected inference data, log a unique ID. The unique ID can come from your application, or you can use the `correlationid` that Azure Machine Learning uniquely generates for each logged JSON object.
1. Later, when the ground truth (or actual) `is_fraud` data becomes available, it also gets logged and mapped to the same unique ID that was logged with the model's outputs.
1. This ground truth `is_fraud` data is also collected, maintained, and registered to Azure Machine Learning as a data asset.
1. Create a model performance monitoring signal that joins the model's production inference and ground truth data assets, using the unique ID columns.
1. Finally, compute the model performance metrics.

# [Azure CLI](#tab/azure-cli)

Once you've satisfied the [prerequisites for model performance monitoring](#more-prerequisites-for-model-performance-monitoring), you can set up model monitoring with the following CLI command and YAML definition:

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

Once you've satisfied the [prerequisites for model performance monitoring](#more-prerequisites-for-model-performance-monitoring), you can set up model monitoring with the following Python code:

```python
from azure.identity import DefaultAzureCredential
from azure.ai.ml import Input, MLClient
from azure.ai.ml.constants import (
    MonitorDatasetContext,
)
from azure.ai.ml.entities import (
    AlertNotification,
    BaselineDataRange,
    ModelPerformanceMetricThreshold,
    ModelPerformanceSignal,
    ModelPerformanceClassificationThresholds,
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
    DefaultAzureCredential(),
    subscription_id="subscription_id",
    resource_group_name="resource_group_name",
    workspace_name="workspace_name",
)

# create your compute
spark_compute = ServerlessSparkCompute(
    instance_type="standard_e4s_v3",
    runtime_version="3.3"
)

# reference your azureml endpoint and deployment
monitoring_target = MonitoringTarget(
    ml_task="classification",
)

# MDC-generated production data with data column names 
production_data = ProductionData(
    input_data=Input(
        type="uri_folder",
        path="azureml:credit-default-main-model_outputs:1"
    ),
    data_column_names={
        "target_column": "DEFAULT_NEXT_MONTH",
        "join_column": "correlationid"
    },
    data_window=BaselineDataRange(
        lookback_window_offset="P0D",
        lookback_window_size="P10D",
    )
)

# ground truth reference data 
reference_data_ground_truth = ReferenceData(
    input_data=Input(
        type="mltable",
        path="azureml:credit-ground-truth:1"
    ),
    data_column_names={
        "target_column": "ground_truth",
        "join_column": "correlationid"
    },
    data_context=MonitorDatasetContext.GROUND_TRUTH_DATA,
)

# create the model performance signal
metric_thresholds = ModelPerformanceMetricThreshold(
    classification=ModelPerformanceClassificationThresholds(
        accuracy=0.50,
        precision=0.50,
        recall=0.50
    ),
)

model_performance = ModelPerformanceSignal(
    production_data=production_data,
    reference_data=reference_data_ground_truth,
    metric_thresholds=metric_thresholds
)

# put all monitoring signals in a dictionary
monitoring_signals = {
    'model_performance':model_performance,
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
    name="credit_default_model_performance",
    trigger=recurrence_trigger,
    create_monitor=monitor_definition
)

poller = ml_client.schedules.begin_create_or_update(model_monitor)
created_monitor = poller.result()
```

# [Studio](#tab/azure-studio)

To set up model performance monitoring:

1. Complete the entries on the **Basic settings** page as described earlier in the [Set up out-of-box model monitoring](#set-up-out-of-box-model-monitoring) section.
1. Select **Next** to open the **Configure data asset** page of the **Advanced settings** section.
1. Select **+ Add** to add a dataset for use as the ground truth dataset.

    Ensure that your model outputs dataset is also included in the list of added datasets. The ground truth dataset you add should have a unique ID column.
    The values in the unique ID column for both the ground truth dataset and the model outputs dataset must match in order for both datasets to be joined together prior to metric computation.

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-advanced-configuration-data-2.png" alt-text="Screenshot showing how to add datasets to use for model performance monitoring." lightbox="media/how-to-monitor-models/model-monitoring-advanced-configuration-data-2.png":::

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-added-ground-truth-dataset.png" alt-text="Screenshot showing the ground truth dataset and the model outputs and inputs datasets for the monitoring signals to connect to." lightbox="media/how-to-monitor-models/model-monitoring-added-ground-truth-dataset.png":::

1. Select **Next** to go to the **Select monitoring signals** page. On this page, you will see some monitoring signals already added (if you selected an Azure Machine Learning online deployment earlier).
1. Delete the existing monitoring signals on the page, since you're only interested in creating a model performance monitoring signal.
1. Select **Add** to open the **Edit Signal** window.
1. Select **Model performance (preview)** to configure the model performance signal as follows:

    1. In step 1, for the production data asset, select your model outputs dataset. Also, make the following selections:
        - Select the appropriate target column (for example, `is_fraud`).
        - Select the desired lookback window size and lookback window offset.
    1. In step 2, for the reference data asset, select the ground truth data asset that you added earlier. Also, make the following selections:
        - Select the appropriate target column.
        - Select the column on which to perform the join with the model outputs dataset. The column used for the join should be the column that is common between the two datasets and which has a unique ID for each row in the dataset (for example, `correlationid`).
    1. In step 3, select your desired performance metrics and specify their respective thresholds.

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-configure-model-performance.png" alt-text="Screenshot showing how to configure a model performance signal." lightbox="media/how-to-monitor-models/model-monitoring-configure-model-performance.png":::

1. Select **Save** to return to the **Select monitoring signals** page.

    :::image type="content" source="media/how-to-monitor-models/model-monitoring-configured-model-performance-signal.png" alt-text="Screenshot showing the configured model performance signal." lightbox="media/how-to-monitor-models/model-monitoring-configured-model-performance-signal.png":::

1. Select **Next** to go to the **Notifications** page.
1. On the **Notifications** page, enable alert notification for the model performance signal and select **Next**.
1. Review your settings on the **Review monitoring settings** page.

   :::image type="content" source="media/how-to-monitor-models/model-monitoring-review-monitoring-details.png" alt-text="Screenshot showing review page that includes the configured model performance signal." lightbox="media/how-to-monitor-models/model-monitoring-review-monitoring-details.png":::

1. Select **Create** to create your model performance monitor.

---

## Set up model monitoring by bringing in your production data to Azure Machine Learning

You can also set up model monitoring for models deployed to Azure Machine Learning batch endpoints or deployed outside of Azure Machine Learning. If you don't have a deployment, but you have production data, you can use the data to perform continuous model monitoring. To monitor these models, you must be able to:

* Collect production inference data from models deployed in production.
* Register the production inference data as an Azure Machine Learning data asset, and ensure continuous updates of the data.
* Provide a custom data preprocessing component and register it as an Azure Machine Learning component. 

You must provide a custom data preprocessing component if your data isn't collected with the [data collector](how-to-collect-production-data.md). Without this custom data preprocessing component, the Azure Machine Learning model monitoring system won't know how to process your data into tabular form with support for time windowing.

Your custom preprocessing component must have these input and output signatures:

  | Input/Output | Signature name | Type | Description | Example value |
  |---|---|---|---|---|
  | input | `data_window_start` | literal, string | data window start-time in ISO8601 format. | 2023-05-01T04:31:57.012Z |
  | input | `data_window_end` | literal, string | data window end-time in ISO8601 format. | 2023-05-01T04:31:57.012Z |
  | input | `input_data` | uri_folder | The collected production inference data, which is registered as an Azure Machine Learning data asset. | azureml:myproduction_inference_data:1 |
  | output | `preprocessed_data` | mltable | A tabular dataset, which matches a subset of the reference data schema. | |

For an example of a custom data preprocessing component, see [custom_preprocessing in the azuremml-examples GitHub repo](https://github.com/Azure/azureml-examples/tree/main/cli/monitoring/components/custom_preprocessing).

# [Azure CLI](#tab/azure-cli)

Once you've satisfied the previous requirements, you can set up model monitoring with the following CLI command and YAML definition:

```azurecli
az ml schedule create -f ./model-monitoring-with-collected-data.yaml
```

The following YAML contains the definition for model monitoring with production inference data that you've collected.

:::code language="yaml" source="~/azureml-examples-main/cli/monitoring/model-monitoring-with-collected-data.yaml":::

# [Python SDK](#tab/python)

Once you've satisfied the previous requirements, you can set up model monitoring with the following Python code:

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


# training data to be used as reference dataset
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

The studio currently doesn't support configuring monitoring for models that are deployed outside of Azure Machine Learning. See the Azure CLI or Python SDK tabs instead. 

Once you've configured your monitor with the CLI or SDK, you can view the monitoring results in the studio. For more information on interpreting monitoring results, see [Interpreting monitoring results](how-to-monitor-model-performance.md#interpret-monitoring-results).

---

## Set up model monitoring with custom signals and metrics

With Azure Machine Learning model monitoring, you can define a custom signal and implement any metric of your choice to monitor your model. You can register this custom signal as an Azure Machine Learning component. When your Azure Machine Learning model monitoring job runs on the specified schedule, it computes the metric(s) you've defined within your custom signal, just as it does for the prebuilt signals (data drift, prediction drift, and data quality).

To set up a custom signal to use for model monitoring, you must first define the custom signal and register it as an Azure Machine Learning component. The Azure Machine Learning component must have these input and output signatures:

### Component input signature

The component input DataFrame should contain the following items:

- An `mltable` with the processed data from the preprocessing component
- Any number of literals, each representing an implemented metric as part of the custom signal component. For example, if you've implemented the metric, `std_deviation`, then you'll need an input for `std_deviation_threshold`. Generally, there should be one input per metric with the name `<metric_name>_threshold`.

| Signature name | Type | Description | Example value |
|---|---|---|---|
| production_data | mltable | A tabular dataset that matches a subset of the reference data schema. | |
| std_deviation_threshold | literal, string | Respective threshold for the implemented metric. | 2 |

### Component output signature

The component output port should have the following signature.

  | Signature name | Type | Description |
  |---|---|---|
  | signal_metrics | mltable | The mltable that contains the computed metrics. The schema is defined in the next section [signal_metrics schema](#signal_metrics-schema). |
  
#### signal_metrics schema

The component output DataFrame should contain four columns: `group`, `metric_name`, `metric_value`, and `threshold_value`.

  | Signature name | Type | Description | Example value |
  |---|---|---|---|
  | group | literal, string | Top-level logical grouping to be applied to this custom metric. | TRANSACTIONAMOUNT |
  | metric_name | literal, string | The name of the custom metric. | std_deviation |
  | metric_value | numerical | The value of the custom metric. | 44,896.082 |
  | threshold_value | numerical | The threshold for the custom metric. | 2 |

The following table shows an example output from a custom signal component that computes the `std_deviation` metric:

  | group | metric_value | metric_name | threshold_value |
  |---|---|---|---|
  | TRANSACTIONAMOUNT | 44,896.082 | std_deviation | 2 |
  | LOCALHOUR | 3.983 | std_deviation | 2 |
  | TRANSACTIONAMOUNTUSD | 54,004.902 | std_deviation | 2 |
  | DIGITALITEMCOUNT | 7.238 | std_deviation | 2 |
  | PHYSICALITEMCOUNT | 5.509 | std_deviation | 2 |

To see an example custom signal component definition and metric computation code, see [custom_signal in the azureml-examples repo](https://github.com/Azure/azureml-examples/tree/main/cli/monitoring/components/custom_signal).

# [Azure CLI](#tab/azure-cli)

Once you've satisfied the requirements for using custom signals and metrics, you can set up model monitoring with the following CLI command and YAML definition:

```azurecli
az ml schedule create -f ./custom-monitoring.yaml
```

The following YAML contains the definition for model monitoring with a custom signal. Some things to notice about the code:

- It assumes that you've already created and registered your component with the custom signal definition in Azure Machine Learning.
- The `component_id` of the registered custom signal component is `azureml:my_custom_signal:1.0.0`.
- If you've collected your data with the [data collector](how-to-collect-production-data.md), you can omit the `pre_processing_component` property. If you wish to use a preprocessing component to preprocess production data not collected by the data collector, you can specify it.

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

## Interpret monitoring results

After you've configured your model monitor and the first run has completed, you can navigate back to the **Monitoring** tab in Azure Machine Learning studio to view the results.

- From the main **Monitoring** view, select the name of your model monitor to see the Monitor overview page. This page shows the corresponding model, endpoint, and deployment, along with details regarding the signals you configured. The next image shows a monitoring dashboard that includes data drift and data quality signals. Depending on the monitoring signals you configured, your dashboard might look different.

   :::image type="content" source="media/how-to-monitor-models/monitoring-dashboard.png" alt-text="Screenshot showing a monitoring dashboard." lightbox="media/how-to-monitor-models/monitoring-dashboard.png":::

- Look in the **Notifications** section of the dashboard to see, for each signal, which features breached the configured threshold for their respective metrics:

- Select the **data_drift** to go to the data drift details page. On the details page, you can see the data drift metric value for each numerical and categorical feature that you included in your monitoring configuration. When your monitor has more than one run, you'll see a trendline for each feature.

   :::image type="content" source="media/how-to-monitor-models/data-drift-details-page.png" alt-text="Screenshot showing the details page of the data drift signal." lightbox="media/how-to-monitor-models/data-drift-details-page.png":::

- To view an individual feature in detail, select the name of the feature to view the production distribution compared to the reference distribution. This view also allows you to track drift over time for that specific feature.

   :::image type="content" source="media/how-to-monitor-models/data-drift-individual-feature.png" alt-text="Screenshot showing the data drift details for an individual feature." lightbox="media/how-to-monitor-models/data-drift-individual-feature.png":::

- Return to the monitoring dashboard and select **data_quality** to view the data quality signal page. On this page, you can see the null value rates, out-of-bounds rates, and data type error rates for each feature you're monitoring.

   :::image type="content" source="media/how-to-monitor-models/data-quality-details-page.png" alt-text="Screenshot showing the details page of the data quality signal." lightbox="media/how-to-monitor-models/data-quality-details-page.png":::

Model monitoring is a continuous process. With Azure Machine Learning model monitoring, you can configure multiple monitoring signals to obtain a broad view into the performance of your models in production.


## Integrate Azure Machine Learning model monitoring with Azure Event Grid

You can use events generated by Azure Machine Learning model monitoring to set up event-driven applications, processes, or CI/CD workflows with [Azure Event Grid](how-to-use-event-grid.md). You can consume events through various event handlers, such as Azure Event Hubs, Azure functions, and logic apps. Based on the drift detected by your monitors, you can take action programmatically, such as by setting up a machine learning pipeline to re-train a model and re-deploy it.

To get started with integrating Azure Machine Learning model monitoring with Event Grid:

1. Follow the steps in see [Set up in Azure portal](how-to-use-event-grid.md#set-up-in-azure-portal). Give your **Event Subscription** a name, such as MonitoringEvent, and select only the **Run status changed** box under **Event Types**. 

    > [!WARNING]
    >
    > Be sure to select **Run status changed** for the event type. Don't select **Dataset drift detected**, as it applies to data drift v1, rather than Azure Machine Learning model monitoring.

1. Follow the steps in [Filter & subscribe to events](how-to-use-event-grid.md#filter--subscribe-to-events) to set up event filtering for your scenario. Navigate to the **Filters** tab and add the following **Key**, **Operator**, and **Value** under **Advanced Filters**:

    - **Key**: `data.RunTags.azureml_modelmonitor_threshold_breached`
    - **Value**: has failed due to one or more features violating metric thresholds
    - **Operator**: String contains

    With this filter, events are generated when the run status changes (from Completed to Failed, or from Failed to Completed) for any monitor within your Azure Machine Learning workspace.

1. To filter at the monitoring level, use the following **Key**, **Operator**, and **Value** under **Advanced Filters**:

    - **Key**: `data.RunTags.azureml_modelmonitor_threshold_breached`
    - **Value**: `your_monitor_name_signal_name`
    - **Operator**: String contains

    Ensure that `your_monitor_name_signal_name` is the name of a signal in the specific monitor you want to filter events for. For example, `credit_card_fraud_monitor_data_drift`. For this filter to work, this string must match the name of your monitoring signal. You should name your signal with both the monitor name and the signal name for this case.

1. When you've completed your **Event Subscription** configuration, select the desired endpoint to serve as your event handler, such as Azure Event Hubs.
1. After events have been captured, you can view them from the endpoint page:

   :::image type="content" source="media/how-to-monitor-models/events-on-endpoint-page.png" alt-text="Screenshot showing events viewed from the endpoint page." lightbox="media/how-to-monitor-models/events-on-endpoint-page.png":::

You can also view events in the Azure Monitor **Metrics** tab: 

   :::image type="content" source="media/how-to-monitor-models/events-in-azure-monitor-metrics-tab.png" alt-text="Screenshot showing events viewed from the Azure monitor metrics tab." lightbox="media/how-to-monitor-models/events-in-azure-monitor-metrics-tab.png":::

---

## Related content

- [Data collection from models in production (preview)](concept-data-collection.md)
- [Collect production data from models deployed for real-time inferencing](how-to-collect-production-data.md)
- [CLI (v2) schedule YAML schema for model monitoring (preview)](reference-yaml-monitor.md)
- [Model monitoring for generative AI applications](./prompt-flow/how-to-monitor-generative-ai-applications.md)
