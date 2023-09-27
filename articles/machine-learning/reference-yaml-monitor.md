---
title: 'CLI (v2) schedule YAML schema for model monitoring'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) schedule YAML schema for model monitoring.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: reference
ms.custom: cliv2
author: bozhong68
ms.author: bozhlin
ms.date: 09/15/2023
ms.reviewer: mopeakande
reviewer: msakande
---

# CLI (v2) schedule YAML schema for model monitoring (preview)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The YAML syntax detailed in this document is based on the JSON schema for the latest version of the ML CLI v2 extension. This syntax is guaranteed only to work with the latest version of the ML CLI v2 extension.
You can find the schemas for older extension versions at [https://azuremlschemasprod.azureedge.net/](https://azuremlschemasprod.azureedge.net/).

## YAML syntax

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `$schema` | string | The YAML schema. | |
| `name` | string | **Required.** Name of the schedule. | |
| `version` | string | Version of the schedule. If omitted, Azure Machine Learning will autogenerate a version. | |
| `description` | string | Description of the schedule. | |
| `tags` | object | Dictionary of tags for the schedule. | |
| `trigger` | object | **Required.** The trigger configuration to define rule when to trigger job. **One of `RecurrenceTrigger` or `CronTrigger` is required.** | |
| `create_monitor` | object | **Required.** The definition of the monitor that will be triggered by a schedule. **`MonitorDefinition` is required.**| |

### Trigger configuration

#### Recurrence trigger

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | string | **Required.** Specifies the schedule type. |recurrence|
|`frequency`| string | **Required.** Specifies the unit of time that describes how often the schedule fires.|`minute`, `hour`, `day`, `week`, `month`|
|`interval`| integer | **Required.** Specifies the interval at which the schedule fires.| |
|`start_time`| string |Describes the start date and time with timezone. If `start_time` is omitted, the first job will run instantly and the future jobs will be triggered based on the schedule, saying `start_time` will be equal to the job created time. If the start time is in the past, the first job will run at the next calculated run time.|
|`end_time`| string |Describes the end date and time with timezone. If `end_time` is omitted, the schedule will continue to run until it's explicitly disabled.|
|`timezone`| string |Specifies the time zone of the recurrence. If omitted, by default is UTC. |See [appendix for timezone values](#timezone)|
|`pattern`|object|Specifies the pattern of the recurrence. If pattern is omitted, the job(s) will be triggered according to the logic of start_time, frequency and interval.| |

#### Recurrence schedule

Recurrence schedule defines the recurrence pattern, containing `hours`, `minutes`, and `weekdays`.

- When frequency is `day`, pattern can specify `hours` and `minutes`.
- When frequency is `week` and `month`, pattern can specify `hours`, `minutes` and `weekdays`.

| Key | Type | Allowed values |
| --- | ---- | -------------- |
|`hours`|integer or array of integer|`0-23`|
|`minutes`|integer or array of integer|`0-59`|
|`week_days`|string or array of string|`monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`|


#### CronTrigger

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | string | **Required.** Specifies the schedule type. |cron|
| `expression` | string | **Required.** Specifies the cron expression to define how to trigger jobs. expression uses standard crontab expression to express a recurring schedule. A single expression is composed of five space-delimited fields:`MINUTES HOURS DAYS MONTHS DAYS-OF-WEEK`||
|`start_time`| string |Describes the start date and time with timezone. If start_time is omitted, the first job will run instantly and the future jobs will be triggered based on the schedule, saying start_time will be equal to the job created time. If the start time is in the past, the first job will run at the next calculated run time.|
|`end_time`| string |Describes the end date and time with timezone. If end_time is omitted, the schedule will continue to run until it's explicitly disabled.|
|`timezone`| string |Specifies the time zone of the recurrence. If omitted, by default is UTC. |See [appendix for timezone values](#timezone)|

### Monitor definition

| Key | Type | Description | Allowed values | Default value |
| --- | -----| -----------  | -------------- | -------------|
| `compute` | Object | **Required**. Description of compute resources for Spark pool to run monitoring job. | | |
| `compute.instance_type` | String |**Required**. The compute instance type to be used for Spark pool. | 'standard_e4s_v3', 'standard_e8s_v3', 'standard_e16s_v3', 'standard_e32s_v3', 'standard_e64s_v3' | n/a |
| `compute.runtime_version` | String | **Optional**. Defines Spark runtime version. | `3.1`, `3.2` | `3.2`|
| `monitoring_target` | Object | Azure Machine Learning asset(s) associated with model monitoring. | | |
| `monitoring_target.ml_task` | String | Machine learning task for the model. | Allowed values are: `classification`, `regression`, `question_answering`| |
| `monitoring_target.endpoint_deployment_id` | String | **Optional**. The associated Azure Machine Learning endpoint/deployment ID in format of `azureml:myEndpointName:myDeploymentName`. This field is required if your endpoint/deployment has enabled model data collection to be used for model monitoring. | | |
| `monitoring_target.model_id` | String | **Optional**. The associated model ID for model monitoring. | | |
| `monitoring_signals` | Object | Dictionary of monitoring signals to be included. The key is a name for monitoring signal within the context of monitor and the value is an object containing a [monitoring signal specification](#monitoring-signals). **Optional** for basic model monitoring that uses recent past production data as comparison baseline and has 3 monitoring signals: data drift, prediction drift, and data quality. | | |
| `alert_notification` | String or Object | Description of alert notification recipients. | One of two alert destinations is allowed: String `azmonitoring` or Object `emails` containing an array of email recipients |  |
| `alert_notification.emails` | Object | List of email addresses to receive alert notification. | | |

### Monitoring signals

#### Data drift

As the data used to train the model evolves in production, the distribution of the data can shift, resulting in a mismatch between the training data and the real-world data that the model is being used to predict. Data drift is a phenomenon that occurs in machine learning when the statistical properties of the input data used to train the model change over time.


| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ------------| ---------------| ------------- |
| `type` | String | **Required**. Type of monitoring signal. Prebuilt monitoring signal processing component is automatically loaded according to the `type` specified here. | `data_drift` | `data_drift` |
| `production_data` | Object | **Optional**. Description of production data to be analyzed for monitoring signal. | | |
| `production_data.input_data` | Object | **Optional**. Description of input data source, see [job input data](./reference-yaml-job-command.md#job-inputs) specification. | | |
| `production_data.data_context` | String | The context of data, it refers model production data and could be model inputs or model outputs | `model_inputs` |  |
| `production_data.pre_processing_component` | String | Component ID in the format of `azureml:myPreprocessing@latest` for a registered component. This is required if `production_data.data.input_data.type` is `uri_folder`, see [preprocessing component specification](./how-to-monitor-model-performance.md#set-up-model-monitoring-by-bringing-your-own-production-data-to-azure-machine-learning). | | |
| `production_data.data_window_size` | ISO8601 format |**Optional**. Data window size in days with ISO8601 format, for example `P7D`. This is the production data window to be computed for data drift. | By default the data window size is the last monitoring period. | |
| `reference_data` | Object | **Optional**. Recent past production data is used as comparison baseline data if this isn't specified. Recommendation is to use training data as comparison baseline. | | |
| `reference_data.input_data` | Object | Description of input data source, see [job input data](./reference-yaml-job-command.md#job-inputs) specification. | | |
| `reference_data.data_context` | String | The context of data, it refers to the context that dataset was used before | `model_inputs`, `training`, `test`, `validation` |  |
| `reference_data.target_column_name` | Object | **Optional**. If the 'reference_data' is training data, this property is required for monitoring top N features for data drift. | | |
| `reference_data.data_window` | Object | **Optional**. Data window of the reference data to be used as comparison baseline data. | Allow either rolling data window or fixed data window only. For using rolling data window, please specify `reference_data.data_window.trailing_window_offset` and  `reference_data.data_window.trailing_window_size` properties. For using fixed data windows, please specify `reference_data.data_window.window_start` and `reference_data.data_window.window_end` properties. All property values must be in ISO8601 format | |
| `reference_data_data.pre_processing_component` | String | Component ID in the format of `azureml:myPreprocessing@latest` for a registered component. This is **required** if `reference_data.input_data.type` is `uri_folder`, see [preprocessing component specification](./how-to-monitor-model-performance.md#set-up-model-monitoring-by-bringing-your-own-production-data-to-azure-machine-learning). | | |
| `features` | Object | **Optional**. Target features to be monitored for data drift. Some models might have hundreds or thousands of features, it's always recommended to specify interested features for monitoring. | One of following values: list of feature names, `features.top_n_feature_importance`, or `all_features` | Default `features.top_n_feature_importance = 10` if `production_data.data_context` is `training`, otherwise, default is `all_features` |
| `alert_enabled` | Boolean | Turn on/off alert notification for the monitoring signal. `True` or `False` | | |
| `metric_thresholds` | Object | List of metrics and thresholds properties for the monitoring signal. When threshold is exceeded and `alert_enabled` is `true`, user will receive alert notification. | | |
| `metric_thresholds.numerical` | Object | Optional. List of metrics and thresholds in `key:value` format, `key` is the metric name, `value` is the threshold. | Allowed numerical metric names: `jensen_shannon_distance`, `normalized_wasserstein_distance`, `population_stability_index`, `two_sample_kolmogorov_smirnov_test`| |
| `metric_thresholds.categorical` | Object | Optional. List of metrics and thresholds in 'key:value' format, 'key' is the metric name, 'value' is the threshold. | Allowed `categorical` metric names: `jensen_shannon_distance`, `chi_squared_test`, `population_stability_index`| |


#### Prediction drift

Prediction drift tracks changes in the distribution of a model's prediction outputs by comparing it to validation or test labeled data or recent past production data.

| Key | Type | Description | Allowed values | Default value |
| --- | --- | ------------| --------------| ----------|
| `type` | String | **Required**. Type of monitoring signal. Prebuilt monitoring signal processing component is automatically loaded according to the `type` specified here | `prediction_drift` | `prediction_drift`|
| `production_data` | Object | **Optional**. Description of production data to be analyzed for monitoring signal. | | |
| `production_data.input_data` | Object | **Optional**. Description of input data source,  see [job input data](./reference-yaml-job-command.md#job-inputs) specification.| | |
| `production_data.data_context` | String | The context of data, it refers model production data and could be model inputs or model outputs | `model_outputs` |  |
| `production_data.pre_processing_component` | String | Component ID in the format of `azureml:myPreprocessing@latest` for a registered component. This is required if `production_data.input_data.type` is `uri_folder`, see [preprocessing component specification](./how-to-monitor-model-performance.md#set-up-model-monitoring-by-bringing-your-own-production-data-to-azure-machine-learning). | | |
| `production_data.data_window_size` |  ISO8601 format |**Optional**. Data window size in days with ISO8601 format, for example `P7D`. This is the production data window to be computed for prediction drift. | By default the data window size is the last monitoring period.| |
| `reference_data` | Object | **Optional**. Recent past production data is used as comparison baseline data if this isn't specified. Recommendation is to use validation or testing data as comparison baseline. | | |
| `reference_data.input_data` | Object | Description of input data source, see [job input data](./reference-yaml-job-command.md#job-inputs) specification. | | |
| `reference_data.data_context` | String | The context of data, it refers to the context that dataset come from. | `model_outputs`, `testing`, `validation` |  |
| `reference_data.target_column_name` | String | The name of target column, **Required** if the `reference_data.data_context` is `testing` or `validation` | | |
| `reference_data.data_window` | Object | **Optional**. Data window of the reference data to be used as comparison baseline data. | Allow either rolling data window or fixed data window only. For using rolling data window, please specify `reference_data.data_window.trailing_window_offset` and  `reference_data.data_window.trailing_window_size` properties. For using fixed data windows, please specify `reference_data.data_window.window_start` and `reference_data.data_window.window_end` properties. All property values must be in ISO8601 format | |
| `reference_data.pre_processing_component` | String | Component ID in the format of `azureml:myPreprocessing@latest` for a registered component. **Required** if `reference_data.input_data.type` is `uri_folder`, see [preprocessing component specification](./how-to-monitor-model-performance.md#set-up-model-monitoring-by-bringing-your-own-production-data-to-azure-machine-learning). | | |
| `alert_enabled` | Boolean | Turn on/off alert notification for the monitoring signal. `True` or `False` | | |
| `metric_thresholds` | Object | List of metrics and thresholds properties for the monitoring signal. When threshold is exceeded and `alert_enabled` is `true`, user will receive alert notification. | | |
| `metric_thresholds.numerical` | Object | Optional. List of metrics and thresholds in `key:value` format, `key` is the metric name, `value` is the threshold. | Allowed numerical metric names: `jensen_shannon_distance`, `normalized_wasserstein_distance`, `population_stability_index`, `two_sample_kolmogorov_smirnov_test`| |
| `metric_thresholds.categorical` | Object | Optional. List of metrics and thresholds in `key:value` format, `key` is the metric name, `value` is the threshold. | Allowed `categorical` metric names: `jensen_shannon_distance`, `chi_squared_test`, `population_stability_index`| |


#### Data quality

Data quality signal tracks data quality issues in production by comparing to training data or recent past production data.

| Key | Type | Description | Allowed values | Default value |
| --- | --- | ------------ | -------------- | ----------  |
| `type` | String | **Required**. Type of monitoring signal. Prebuilt monitoring signal processing component is automatically loaded according to the `type` specified here |`data_quality` | `data_quality`|
| `production_data` | Object | **Optional**. Description of production data to be analyzed for monitoring signal. | | |
| `production_data.input_data` | Object | **Optional**. Description of input data source,  see [job input data](./reference-yaml-job-command.md#job-inputs) specification.| | |
| `production_data.data_context` | String | The context of data, it refers model production data and could be model inputs or model outputs | `model_inputs`, `model_outputs` | |
| `production_data.pre_processing_component` | String | Component ID in the format of `azureml:myPreprocessing@latest` for a registered component. This is required if `production_data.input_data.type` is `uri_folder`, see [preprocessing component specification](./how-to-monitor-model-performance.md#set-up-model-monitoring-by-bringing-your-own-production-data-to-azure-machine-learning). | | |
| `production_data.data_window_size` | ISO8601 format |**Optional**. Data window size in days with ISO8601 format, for example `P7D`. This is the production data window to be computed for data quality issues. | By default the data window size is the last monitoring period.| |
| `reference_data` | Object | **Optional**. Recent past production data is used as comparison baseline data if this isn't specified. Recommendation is to use training data as comparison baseline. | | |
| `reference_data.input_data` | Object | Description of input data source, see [job input data](./reference-yaml-job-command.md#job-inputs) specification. | | |
| `reference_data.data_context` | String | The context of data, it refers to the context that dataset was used before | `model_inputs`, `model_outputs`, `training`, `test`, `validation` |  |
| `reference_data.target_column_name` | Object | **Optional**. If the 'reference_data' is training data, this property is required for monitoring top N features for data drift. | | |
| `reference_data.data_window` | Object | **Optional**. Data window of the reference data to be used as comparison baseline data. | Allow either rolling data window or fixed data window only. For using rolling data window, please specify `reference_data.data_window.trailing_window_offset` and  `reference_data.data_window.trailing_window_size` properties. For using fixed data windows, please specify `reference_data.data_window.window_start` and `reference_data.data_window.window_end` properties. All property values must be in ISO8601 format | |
| `reference_data.pre_processing_component` | String | Component ID in the format of `azureml:myPreprocessing@latest` for a registered component. This is required if `reference_data.input_data.type` is `uri_folder`, see [preprocessing component specification](./how-to-monitor-model-performance.md#set-up-model-monitoring-by-bringing-your-own-production-data-to-azure-machine-learning). | | |
| `features` | Object | **Optional**. Target features to be monitored for data quality. Some models might have hundreds or thousands of features. It's always recommended to specify interested features for monitoring. | One of following values: list of feature names, `features.top_n_feature_importance`, or `all_features` | Default to `features.top_n_feature_importance = 10` if `reference_data.data_context` is `training`, otherwise default is `all_features` |
| `alert_enabled` | Boolean | Turn on/off alert notification for the monitoring signal. `True` or `False` | | |
| `metric_thresholds` | Object | List of metrics and thresholds properties for the monitoring signal. When threshold is exceeded and `alert_enabled` is `true`, user will receive alert notification. | | |
| `metric_thresholds.numerical` | Object | **Optional** List of metrics and thresholds in `key:value` format, `key` is the metric name, `value` is the threshold. | Allowed numerical metric names: `data_type_error_rate`, `null_value_rate`, `out_of_bounds_rate`| |
| `metric_thresholds.categorical` | Object | **Optional** List of metrics and thresholds in `key:value` format, `key` is the metric name, `value` is the threshold. | Allowed `categorical` metric names: `data_type_error_rate`, `null_value_rate`, `out_of_bounds_rate`| |

#### Feature attribution drift

The feature attribution of a model may change over time due to changes in the distribution of data, changes in the relationships between features, or changes in the underlying problem being solved. Feature attribution drift is a phenomenon that occurs in machine learning models when the importance or contribution of features to the prediction output changes over time.

| Key | Type | Description | Allowed values | Default value |
| --- | --- | ------------| --------------| ----------|
| `type` | String | **Required**. Type of monitoring signal. Prebuilt monitoring signal processing component is automatically loaded according to the `type` specified here | `feature_attribution_drift` |  `feature_attribution_drift` |
| `production_data` | Array | **Optional**, default to collected data associated with Azure Machine Learning endpoint if this is not provided. The `production_data` is a list of dataset and its associated meta data, it must include both model inputs and model outputs data. It could be a single dataset with both model inputs and outputs, or it could be two separate datasets containing one model inputs and one model outputs.| | |
| `production_data.input_data` | Object | **Optional**. Description of input data source,  see [job input data](./reference-yaml-job-command.md#job-inputs) specification.| | |
| `production_data.data_context` | String | The context of data. It refers to production model inputs data. | `model_inputs`, `model_outputs`, `model_inputs_outputs` |  |
| `production_data.data_column_names` | Object | Correlation column name and prediction column names in `key:value` format, needed for data joining. | Allowed keys are: `correlation_id`, `prediction`, `prediction_probability`  |
| `production_data.pre_processing_component` | String | Component ID in the format of `azureml:myPreprocessing@latest` for a registered component. This is required if `production_data.input_data.type` is `uri_folder`, see [preprocessing component specification](./how-to-monitor-model-performance.md#set-up-model-monitoring-by-bringing-your-own-production-data-to-azure-machine-learning). | | |
| `production_data.data_window_size` | String |**Optional**. Data window size in days with ISO8601 format, for example `P7D`. This is the production data window to be computed for data quality issues. | By default the data window size is the last monitoring period.| |
| `reference_data` | Object | **Optional**. Recent past production data is used as comparison baseline data if this isn't specified. Recommendation is to use training data as comparison baseline. | | |
| `reference_data.input_data` | Object | Description of input data source, see [job input data](./reference-yaml-job-command.md#job-inputs) specification. | | |
| `reference_data.data_context` | String | The context of data, it refers to the context that dataset was used before. Fro feature attribution drift, only `training` data allowed. | `training` |  |
| `reference_data.target_column_name` | String | **Required**. | | |
| `reference_data.pre_processing_component` | String | Component ID in the format of `azureml:myPreprocessing@latest` for a registered component. This is required if `reference_data.input_data.type` is `uri_folder`, see [preprocessing component specification](./how-to-monitor-model-performance.md#set-up-model-monitoring-by-bringing-your-own-production-data-to-azure-machine-learning). | | |
| `alert_enabled` | Boolean | Turn on/off alert notification for the monitoring signal. `True` or `False` | | |
| `metric_thresholds` | Object | Metric name and threshold for feature attribution drift in `key:value` format, where `key` is the metric name, and `value` is the threshold. When threshold is exceeded and `alert_enabled` is on, user will receive alert notification. | Allowed metric name: `normalized_discounted_cumulative_gain` | |



## Remarks

The `az ml schedule` command can be used for managing Azure Machine Learning models.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/schedules). A couple are as follows:

## YAML: Schedule with recurrence pattern

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="yaml" source="~/azureml-examples-main/cli/schedules/recurrence-job-schedule.yml":::

## YAML: Schedule with cron expression

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="yaml" source="~/azureml-examples-main/cli/schedules/cron-job-schedule.yml":::

## Appendix

### Timezone

Current schedule supports the following timezones. The key can be used directly in the Python SDK, while the value can be used in the YAML job. The table is organized by UTC(Coordinated Universal Time).

| UTC         | Key                             | Value                             |
|-------------|---------------------------------|-----------------------------------|
| UTC -12:00  | DATELINE_STANDARD_TIME          | "Dateline Standard Time"          |
| UTC -11:00  | UTC_11                          | "UTC-11"                          |
| UTC - 10:00 | ALEUTIAN_STANDARD_TIME          | Aleutian Standard Time            |
| UTC - 10:00 | HAWAIIAN_STANDARD_TIME          | "Hawaiian Standard Time"          |
| UTC -09:30  | MARQUESAS_STANDARD_TIME         | "Marquesas Standard Time"         |
| UTC -09:00  | ALASKAN_STANDARD_TIME           | "Alaskan Standard Time"           |
| UTC -09:00  | UTC_09                          | "UTC-09"                          |
| UTC -08:00  | PACIFIC_STANDARD_TIME_MEXICO    | "Pacific Standard Time (Mexico)"  |
| UTC -08:00  | UTC_08                          | "UTC-08"                          |
| UTC -08:00  | PACIFIC_STANDARD_TIME           | "Pacific Standard Time"           |
| UTC -07:00  | US_MOUNTAIN_STANDARD_TIME       | "US Mountain Standard Time"       |
| UTC -07:00  | MOUNTAIN_STANDARD_TIME_MEXICO   | "Mountain Standard Time (Mexico)" |
| UTC -07:00  | MOUNTAIN_STANDARD_TIME          | "Mountain Standard Time"          |
| UTC -06:00  | CENTRAL_AMERICA_STANDARD_TIME   | "Central America Standard Time"   |
| UTC -06:00  | CENTRAL_STANDARD_TIME           | "Central Standard Time"           |
| UTC -06:00  | EASTER_ISLAND_STANDARD_TIME     | "Easter Island Standard Time"     |
| UTC -06:00  | CENTRAL_STANDARD_TIME_MEXICO    | "Central Standard Time (Mexico)"  |
| UTC -06:00  | CANADA_CENTRAL_STANDARD_TIME    | "Canada Central Standard Time"    |
| UTC -05:00  | SA_PACIFIC_STANDARD_TIME        | "SA Pacific Standard Time"        |
| UTC -05:00  | EASTERN_STANDARD_TIME_MEXICO    | "Eastern Standard Time (Mexico)"  |
| UTC -05:00  | EASTERN_STANDARD_TIME           | "Eastern Standard Time"           |
| UTC -05:00  | HAITI_STANDARD_TIME             | "Haiti Standard Time"             |
| UTC -05:00  | CUBA_STANDARD_TIME              | "Cuba Standard Time"              |
| UTC -05:00  | US_EASTERN_STANDARD_TIME        | "US Eastern Standard Time"        |
| UTC -05:00  | TURKS_AND_CAICOS_STANDARD_TIME  | "Turks And Caicos Standard Time"  |
| UTC -04:00  | PARAGUAY_STANDARD_TIME          | "Paraguay Standard Time"          |
| UTC -04:00  | ATLANTIC_STANDARD_TIME          | "Atlantic Standard Time"          |
| UTC -04:00  | VENEZUELA_STANDARD_TIME         | "Venezuela Standard Time"         |
| UTC -04:00  | CENTRAL_BRAZILIAN_STANDARD_TIME | "Central Brazilian Standard Time" |
| UTC -04:00  | SA_WESTERN_STANDARD_TIME        | "SA Western Standard Time"        |
| UTC -04:00  | PACIFIC_SA_STANDARD_TIME        | "Pacific SA Standard Time"        |
| UTC -03:30  | NEWFOUNDLAND_STANDARD_TIME      | "Newfoundland Standard Time"      |
| UTC -03:00  | TOCANTINS_STANDARD_TIME         | "Tocantins Standard Time"         |
| UTC -03:00  | E_SOUTH_AMERICAN_STANDARD_TIME  | "E. South America Standard Time"  |
| UTC -03:00  | SA_EASTERN_STANDARD_TIME        | "SA Eastern Standard Time"        |
| UTC -03:00  | ARGENTINA_STANDARD_TIME         | "Argentina Standard Time"         |
| UTC -03:00  | GREENLAND_STANDARD_TIME         | "Greenland Standard Time"         |
| UTC -03:00  | MONTEVIDEO_STANDARD_TIME        | "Montevideo Standard Time"        |
| UTC -03:00  | SAINT_PIERRE_STANDARD_TIME      | "Saint Pierre Standard Time"      |
| UTC -03:00  | BAHIA_STANDARD_TIM              | "Bahia Standard Time"             |
| UTC -02:00  | UTC_02                          | "UTC-02"                          |
| UTC -02:00  | MID_ATLANTIC_STANDARD_TIME      | "Mid-Atlantic Standard Time"      |
| UTC -01:00  | AZORES_STANDARD_TIME            | "Azores Standard Time"            |
| UTC -01:00  | CAPE_VERDE_STANDARD_TIME        | "Cape Verde Standard Time"        |
| UTC         | UTC                             | UTC                               |
| UTC +00:00  | GMT_STANDARD_TIME               | "GMT Standard Time"               |
| UTC +00:00  | GREENWICH_STANDARD_TIME         | "Greenwich Standard Time"         |
| UTC +01:00  | MOROCCO_STANDARD_TIME           | "Morocco Standard Time"           |
| UTC +01:00  | W_EUROPE_STANDARD_TIME          | "W. Europe Standard Time"         |
| UTC +01:00  | CENTRAL_EUROPE_STANDARD_TIME    | "Central Europe Standard Time"    |
| UTC +01:00  | ROMANCE_STANDARD_TIME           | "Romance Standard Time"           |
| UTC +01:00  | CENTRAL_EUROPEAN_STANDARD_TIME  | "Central European Standard Time"  |
| UTC +01:00  | W_CENTRAL_AFRICA_STANDARD_TIME  | "W. Central Africa Standard Time" |
| UTC +02:00  | NAMIBIA_STANDARD_TIME           | "Namibia Standard Time"           |
| UTC +02:00  | JORDAN_STANDARD_TIME            | "Jordan Standard Time"            |
| UTC +02:00  | GTB_STANDARD_TIME               | "GTB Standard Time"               |
| UTC +02:00  | MIDDLE_EAST_STANDARD_TIME       | "Middle East Standard Time"       |
| UTC +02:00  | EGYPT_STANDARD_TIME             | "Egypt Standard Time"             |
| UTC +02:00  | E_EUROPE_STANDARD_TIME          | "E. Europe Standard Time"         |
| UTC +02:00  | SYRIA_STANDARD_TIME             | "Syria Standard Time"             |
| UTC +02:00  | WEST_BANK_STANDARD_TIME         | "West Bank Standard Time"         |
| UTC +02:00  | SOUTH_AFRICA_STANDARD_TIME      | "South Africa Standard Time"      |
| UTC +02:00  | FLE_STANDARD_TIME               | "FLE Standard Time"               |
| UTC +02:00  | ISRAEL_STANDARD_TIME            | "Israel Standard Time"            |
| UTC +02:00  | KALININGRAD_STANDARD_TIME       | "Kaliningrad Standard Time"       |
| UTC +02:00  | LIBYA_STANDARD_TIME             | "Libya Standard Time"             |
| UTC +03:00  | TÜRKIYE_STANDARD_TIME           | "Türkiye Standard Time"           |
| UTC +03:00  | ARABIC_STANDARD_TIME            | "Arabic Standard Time"            |
| UTC +03:00  | ARAB_STANDARD_TIME              | "Arab Standard Time"              |
| UTC +03:00  | BELARUS_STANDARD_TIME           | "Belarus Standard Time"           |
| UTC +03:00  | RUSSIAN_STANDARD_TIME           | "Russian Standard Time"           |
| UTC +03:00  | E_AFRICA_STANDARD_TIME          | "E. Africa Standard Time"         |
| UTC +03:30  | IRAN_STANDARD_TIME              | "Iran Standard Time"              |
| UTC +04:00  | ARABIAN_STANDARD_TIME           | "Arabian Standard Time"           |
| UTC +04:00  | ASTRAKHAN_STANDARD_TIME         | "Astrakhan Standard Time"         |
| UTC +04:00  | AZERBAIJAN_STANDARD_TIME        | "Azerbaijan Standard Time"        |
| UTC +04:00  | RUSSIA_TIME_ZONE_3              | "Russia Time Zone 3"              |
| UTC +04:00  | MAURITIUS_STANDARD_TIME         | "Mauritius Standard Time"         |
| UTC +04:00  | GEORGIAN_STANDARD_TIME          | "Georgian Standard Time"          |
| UTC +04:00  | CAUCASUS_STANDARD_TIME          | "Caucasus Standard Time"          |
| UTC +04:30  | AFGHANISTAN_STANDARD_TIME       | "Afghanistan Standard Time"       |
| UTC +05:00  | WEST_ASIA_STANDARD_TIME         | "West Asia Standard Time"         |
| UTC +05:00  | EKATERINBURG_STANDARD_TIME      | "Ekaterinburg Standard Time"      |
| UTC +05:00  | PAKISTAN_STANDARD_TIME          | "Pakistan Standard Time"          |
| UTC +05:30  | INDIA_STANDARD_TIME             | "India Standard Time"             |
| UTC +05:30  | SRI_LANKA_STANDARD_TIME         | "Sri Lanka Standard Time"         |
| UTC +05:45  | NEPAL_STANDARD_TIME             | "Nepal Standard Time"             |
| UTC +06:00  | CENTRAL_ASIA_STANDARD_TIME      | "Central Asia Standard Time"      |
| UTC +06:00  | BANGLADESH_STANDARD_TIME        | "Bangladesh Standard Time"        |
| UTC +06:30  | MYANMAR_STANDARD_TIME           | "Myanmar Standard Time"           |
| UTC +07:00  | N_CENTRAL_ASIA_STANDARD_TIME    | "N. Central Asia Standard Time"   |
| UTC +07:00  | SE_ASIA_STANDARD_TIME           | "SE Asia Standard Time"           |
| UTC +07:00  | ALTAI_STANDARD_TIME             | "Altai Standard Time"             |
| UTC +07:00  | W_MONGOLIA_STANDARD_TIME        | "W. Mongolia Standard Time"       |
| UTC +07:00  | NORTH_ASIA_STANDARD_TIME        | "North Asia Standard Time"        |
| UTC +07:00  | TOMSK_STANDARD_TIME             | "Tomsk Standard Time"             |
| UTC +08:00  | CHINA_STANDARD_TIME             | "China Standard Time"             |
| UTC +08:00  | NORTH_ASIA_EAST_STANDARD_TIME   | "North Asia East Standard Time"   |
| UTC +08:00  | SINGAPORE_STANDARD_TIME         | "Singapore Standard Time"         |
| UTC +08:00  | W_AUSTRALIA_STANDARD_TIME       | "W. Australia Standard Time"      |
| UTC +08:00  | TAIPEI_STANDARD_TIME            | "Taipei Standard Time"            |
| UTC +08:00  | ULAANBAATAR_STANDARD_TIME       | "Ulaanbaatar Standard Time"       |
| UTC +08:45  | AUS_CENTRAL_W_STANDARD_TIME     | "Aus Central W. Standard Time"    |
| UTC +09:00  | NORTH_KOREA_STANDARD_TIME       | "North Korea Standard Time"       |
| UTC +09:00  | TRANSBAIKAL_STANDARD_TIME       | "Transbaikal Standard Time"       |
| UTC +09:00  | TOKYO_STANDARD_TIME             | "Tokyo Standard Time"             |
| UTC +09:00  | KOREA_STANDARD_TIME             | "Korea Standard Time"             |
| UTC +09:00  | YAKUTSK_STANDARD_TIME           | "Yakutsk Standard Time"           |
| UTC +09:30  | CEN_AUSTRALIA_STANDARD_TIME     | "Cen. Australia Standard Time"    |
| UTC +09:30  | AUS_CENTRAL_STANDARD_TIME       | "AUS Central Standard Time"       |
| UTC +10:00  | E_AUSTRALIAN_STANDARD_TIME      | "E. Australia Standard Time"      |
| UTC +10:00  | AUS_EASTERN_STANDARD_TIME       | "AUS Eastern Standard Time"       |
| UTC +10:00  | WEST_PACIFIC_STANDARD_TIME      | "West Pacific Standard Time"      |
| UTC +10:00  | TASMANIA_STANDARD_TIME          | "Tasmania Standard Time"          |
| UTC +10:00  | VLADIVOSTOK_STANDARD_TIME       | "Vladivostok Standard Time"       |
| UTC +10:30  | LORD_HOWE_STANDARD_TIME         | "Lord Howe Standard Time"         |
| UTC +11:00  | BOUGAINVILLE_STANDARD_TIME       | "Bougainville Standard Time"     |
| UTC +11:00  | RUSSIA_TIME_ZONE_10             | "Russia Time Zone 10"             |
| UTC +11:00  | MAGADAN_STANDARD_TIME           | "Magadan Standard Time"           |
| UTC +11:00  | NORFOLK_STANDARD_TIME           | "Norfolk Standard Time"           |
| UTC +11:00  | SAKHALIN_STANDARD_TIME          | "Sakhalin Standard Time"          |
| UTC +11:00  | CENTRAL_PACIFIC_STANDARD_TIME   | "Central Pacific Standard Time"   |
| UTC +12:00  | RUSSIA_TIME_ZONE_11             | "Russia Time Zone 11"             |
| UTC +12:00  | NEW_ZEALAND_STANDARD_TIME       | "New Zealand Standard Time"       |
| UTC +12:00  | UTC_12                          | "UTC+12"                          |
| UTC +12:00  | FIJI_STANDARD_TIME              | "Fiji Standard Time"              |
| UTC +12:00  | KAMCHATKA_STANDARD_TIME         | "Kamchatka Standard Time"         |
| UTC +12:45  | CHATHAM_ISLANDS_STANDARD_TIME   | "Chatham Islands Standard Time"   |
| UTC +13:00  | TONGA__STANDARD_TIME            | "Tonga Standard Time"             |
| UTC +13:00  | SAMOA_STANDARD_TIME             | "Samoa Standard Time"             |
| UTC +14:00  | LINE_ISLANDS_STANDARD_TIME      | "Line Islands Standard Time"      |

