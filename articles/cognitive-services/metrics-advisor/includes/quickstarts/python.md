---
title: Metrics Advisor Python quickstart
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: metrics-advisor
ms.topic: include
ms.date: 10/14/2020
ms.author: mbullwin
---

[Reference documentation](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-metricsadvisor/latest/azure.ai.metricsadvisor.html) | [Library source code](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/metricsadvisor/azure-ai-metricsadvisor/README.md) | [Package (PiPy)](https://pypi.org/project/azure-ai-metricsadvisor/) | [Samples](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/metricsadvisor/azure-ai-metricsadvisor/samples/README.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* [Python 3.x](https://www.python.org/)
* Once you have your Azure subscription, <a href="https://go.microsoft.com/fwlink/?linkid=2142156"  title="Create a Metrics Advisor resource"  target="_blank">create a Metrics Advisor resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to deploy your Metrics Advisor instance.  
  
> [!TIP]
> * You can find Python Metrics Advisor samples on [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/metricsadvisor/azure-ai-metricsadvisor/samples).
> * It may take 10 to 30 minutes for your Metrics Advisor resource to deploy a service instance for you to use. Click **Go to resource** once it successfully deploys. After deployment, you can start using your Metrics Advisor instance with both the web portal and REST API.
> * You can find the URL for the REST API in Azure portal, in the **Overview** section of your resource. It will look like this:
>    * `https://<instance-name>.cognitiveservices.azure.com/` 
 
## Setting up

### Install the client library

After installing Python, you can install the client library with:

```console
pip install azure-ai-metricsadvisor --pre
```

### Create a new python application

Create a new Python file and import the following libraries.

```python
import os
import datetime
```

Create variables for your resource's Azure endpoint and key.

> [!IMPORTANT]
> Go to the Azure portal. In the Metrics Advisor resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your subscription keys and endpoint in the resource's **Key and Endpoint** page, under **Resource Management**. <br><br>To retrieve your API key you must go to [https://metricsadvisor.azurewebsites.net](https://metricsadvisor.azurewebsites.net). Select the appropriate: **Directory**, **Subscriptions**, and **Workspace** for your resource and choose **Get started**. You will then be able to retrieve your API keys from [https://metricsadvisor.azurewebsites.net/api-key](https://metricsadvisor.azurewebsites.net/api-key).   
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. See the Cognitive Services [security](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-security) article for more information.

```python
subscription_key = "<paste-your-metrics-advisor-subscription-key-here>"
api_key = "<paste-your-metrics-advisor-api-key-here>"
service_endpoint = "<paste-your-metrics-advisor-endpoint-here>"
```

## Object model

The following classes handle some of the major features of the Metrics Advisor Python SDK.

|Name|Description|
|---|---|
| [MetricsAdvisorClient](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-metricsadvisor/latest/azure.ai.metricsadvisor.html#azure.ai.metricsadvisor.MetricsAdvisorClient) | **Used for**: <br> - Listing incidents <br> - Listing root cause of incidents <br> - Retrieving original time series data and time series data enriched by the service. <br> - Listing alerts <br> - Adding feedback to tune your model |
| [MetricsAdvisorAdministrationClient](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-metricsadvisor/latest/azure.ai.metricsadvisor.html?highlight=metricsadvisoradministrationclient#azure.ai.metricsadvisor.MetricsAdvisorAdministrationClient)| **Allows you to:** <br> - Manage data feeds <br> - Create, configure, retrieve, list, and delete anomaly detection configurations <br> - Create, configure, retrieve, list, and delete anomaly alerting configurations <br> - Manage hooks  | |
| [DataFeed](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-metricsadvisor/latest/azure.ai.metricsadvisor.models.html?highlight=datafeed#azure.ai.metricsadvisor.models.DataFeed)| **What Metrics Advisor ingests from your datasource. A `DataFeed` contains rows of:** <br> - Timestamps <br> - Zero or more dimensions <br> - One or more measures  |
| [Metric](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-metricsadvisor/latest/azure.ai.metricsadvisor.models.html?highlight=metric#azure.ai.metricsadvisor.models.Metric) | A `Metric` is a quantifiable measure that is used to monitor and assess the status of a specific business process. It can be a combination of multiple time series values divided into dimensions. For example a web health metric might contain dimensions for user count and the en-us market. |

## Code examples

These code snippets show you how to do the following with the Metrics Advisor client library for Python:

* [Authenticate the client](#authenticate-the-client)
* [Add a data feed](#add-a-data-feed)
* [Check ingestion status](#check-the-ingestion-status)
* [Setup detection configuration and alert configuration](#create-an-anomaly-detection-configuration)
* [Create an alert configuration](#create-an-alert-configuration)
* [Query anomaly detection results](#query-the-alert)

### Authenticate the client

The client in this example is a `MetricsAdvisorAdministrationClient` object that uses your endpoint a `MetricsAdvisorKeyCredential` object that contains your keys. You don't need to copy this code sample. The methods you create later will instantiate the client. The alternate client is called `MetricsAdvisorClient` more information on this client can be found in the [reference documentation](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-metricsadvisor/latest/azure.ai.metricsadvisor.html#azure.ai.metricsadvisor.MetricsAdvisorClient).

```python
client = MetricsAdvisorAdministrationClient(service_endpoint,
                                MetricsAdvisorKeyCredential(subscription_key, api_key))
```

## Add a data feed

In a new method, create import statements like the example below. Replace `sql_server_connection_string` with your own SQL server connection string, and replace `query` with a query that returns your data at a single timestamp. You will also need to adjust the `metric` and `dimension` values based on your custom data.

> [!IMPORTANT]
> The query should return at most one record for each dimension combination, at each timestamp. And all records returned by the query must have the same timestamps. Metrics Advisor will run this query for each timestamp to ingest your data. See the [FAQ section on queries](../../faq.md#how-do-i-write-a-valid-query-for-ingesting-my-data) for more information, and examples. 

Create a client with your keys and endpoint, and use `client.create_data_feed()` to configure the name, source, granularity, and schema. You can also set the ingestion time, rollup settings and more.


```python
def sample_create_data_feed():
    from azure.ai.metricsadvisor import MetricsAdvisorKeyCredential, MetricsAdvisorAdministrationClient
    from azure.ai.metricsadvisor.models import (
        SQLServerDataFeed,
        DataFeedSchema,
        Metric,
        Dimension,
        DataFeedOptions,
        DataFeedRollupSettings,
        DataFeedMissingDataPointFillSettings
    )
    sql_server_connection_string = "<replace-with-your-sql-server-connection-string>"
    query = "<replace-with-metrics-advisor-sql-server-query>"

    client = MetricsAdvisorAdministrationClient(service_endpoint,
                                  MetricsAdvisorKeyCredential(subscription_key, api_key))

    data_feed = client.create_data_feed(
        name="My data feed",
        source=SQLServerDataFeed(
            connection_string=sql_server_connection_string,
            query=query,
        ),
        granularity="Daily",
        schema=DataFeedSchema(
            metrics=[
                Metric(name="cost", display_name="Cost"),
                Metric(name="revenue", display_name="Revenue")
            ],
            dimensions=[
                Dimension(name="category", display_name="Category"),
                Dimension(name="city", display_name="City")
            ],
            timestamp_column="Timestamp"
        ),
        ingestion_settings=datetime.datetime(2019, 10, 1),
        options=DataFeedOptions(
            data_feed_description="cost/revenue data feed",
            rollup_settings=DataFeedRollupSettings(
                rollup_type="AutoRollup",
                rollup_method="Sum",
                rollup_identification_value="__CUSTOM_SUM__"
            ),
            missing_data_point_fill_settings=DataFeedMissingDataPointFillSettings(
                fill_type="SmartFilling"
            ),
            access_mode="Private"
        )
    )

    return data_feed
sample_create_data_feed()
```

## Check the ingestion status

In a new method, create an import statement like the example below. Replace `data_feed_id` with the ID for the data feed you created. Create a client with your keys and endpoint, and use `client.get_data_feed_ingestion_progress()` to get the ingestion progress. Print out the details, such as the last active and successful timestamps.


```python
def sample_get_data_feed_ingestion_progress():
    from azure.ai.metricsadvisor import MetricsAdvisorKeyCredential, MetricsAdvisorAdministrationClient

    data_feed_id = "<replace-with-your-metrics-advisor-data-feed-id>"

    client = MetricsAdvisorAdministrationClient(service_endpoint,
                                  MetricsAdvisorKeyCredential(subscription_key, api_key))

    progress = client.get_data_feed_ingestion_progress(data_feed_id)

    print("Latest active timestamp: {}".format(progress.latest_active_timestamp))
    print("Latest successful timestamp: {}".format(progress.latest_success_timestamp))
sample_get_data_feed_ingestion_progress()
```

## Create an anomaly detection configuration 

In a new method, create import statements like the example below. Replace `metric_id` with the ID for the metric you want to configure. Create a client with your keys and endpoint, and use `client.create_metric_anomaly_detection_configuration` to create a new detection configuration. The threshold conditions specify the parameters for anomaly detection.

```python
def sample_create_detection_config():
    from azure.ai.metricsadvisor import MetricsAdvisorKeyCredential, MetricsAdvisorAdministrationClient
    from azure.ai.metricsadvisor.models import (
        ChangeThresholdCondition,
        HardThresholdCondition,
        SmartDetectionCondition,
        SuppressCondition,
        MetricDetectionCondition,
    )
    metric_id = "replace-with-your-metric-id"

    client = MetricsAdvisorAdministrationClient(service_endpoint,
                                  MetricsAdvisorKeyCredential(subscription_key, api_key))

    change_threshold_condition = ChangeThresholdCondition(
        anomaly_detector_direction="Both",
        change_percentage=20,
        shift_point=10,
        within_range=True,
        suppress_condition=SuppressCondition(
            min_number=5,
            min_ratio=2
        )
    )
    hard_threshold_condition = HardThresholdCondition(
        anomaly_detector_direction="Up",
        upper_bound=100,
        suppress_condition=SuppressCondition(
            min_number=2,
            min_ratio=2
        )
    )
    smart_detection_condition = SmartDetectionCondition(
        anomaly_detector_direction="Up",
        sensitivity=10,
        suppress_condition=SuppressCondition(
            min_number=2,
            min_ratio=2
        )
    )

    detection_config = client.create_metric_anomaly_detection_configuration(
        name="my_detection_config",
        metric_id=metric_id,
        description="anomaly detection config for metric",
        whole_series_detection_condition=MetricDetectionCondition(
            cross_conditions_operator="OR",
            change_threshold_condition=change_threshold_condition,
            hard_threshold_condition=hard_threshold_condition,
            smart_detection_condition=smart_detection_condition
        )
    )

    return detection_config
sample_create_detection_config()
```


### Create a hook

In a new method, create import statements like the example below. Create a client with your keys and endpoint, and use `client.create_hook()` to create a hook. Enter a description, a list of emails to send the alert to, and an external link for receiving the alert.  

```python
def sample_create_hook():

    from azure.ai.metricsadvisor import MetricsAdvisorKeyCredential, MetricsAdvisorAdministrationClient
    from azure.ai.metricsadvisor.models import EmailHook

    client = MetricsAdvisorAdministrationClient(service_endpoint,
                                  MetricsAdvisorKeyCredential(subscription_key, api_key))

    hook = client.create_hook(
        name="email hook",
        hook=EmailHook(
            description="my email hook",
            emails_to_alert=["alertme@contoso.com"],
            external_link="https://adwiki.azurewebsites.net/articles/howto/alerts/create-hooks.html"
        )
    )

    return hook
sample_create_hook()
```

##  Create an alert configuration

In a new method, create import statements like the example below. Replace `anomaly_detection_configuration_id` with the ID for your anomaly detection configuration, and replace `hook_id` with the hook that you created earlier. Create a client with your keys and endpoint, and use `client.create_anomaly_alert_configuration()` to create an alert configuration. `metric_alert_configurations` is a list of `MetricAlertConfiguration` objects that specify the conditions and scope for each configuration.

```python
def sample_create_alert_config():
    from azure.ai.metricsadvisor import MetricsAdvisorKeyCredential, MetricsAdvisorAdministrationClient
    from azure.ai.metricsadvisor.models import (
        MetricAlertConfiguration,
        MetricAnomalyAlertScope,
        TopNGroupScope,
        MetricAnomalyAlertConditions,
        SeverityCondition,
        MetricBoundaryCondition,
        MetricAnomalyAlertSnoozeCondition
    )
    anomaly_detection_configuration_id = "<replace-with-your-detection-configuration-id"
    hook_id = "<replace-with-your-hook-id>"

    client = MetricsAdvisorAdministrationClient(service_endpoint,
                                  MetricsAdvisorKeyCredential(subscription_key, api_key))

    alert_config = client.create_anomaly_alert_configuration(
        name="my alert config",
        description="alert config description",
        cross_metrics_operator="AND",
        metric_alert_configurations=[
            MetricAlertConfiguration(
                detection_configuration_id=anomaly_detection_configuration_id,
                alert_scope=MetricAnomalyAlertScope(
                    scope_type="WholeSeries"
                ),
                alert_conditions=MetricAnomalyAlertConditions(
                    severity_condition=SeverityCondition(
                        min_alert_severity="Low",
                        max_alert_severity="High"
                    )
                )
            ),
            MetricAlertConfiguration(
                detection_configuration_id=anomaly_detection_configuration_id,
                alert_scope=MetricAnomalyAlertScope(
                    scope_type="TopN",
                    top_n_group_in_scope=TopNGroupScope(
                        top=10,
                        period=5,
                        min_top_count=5
                    )
                ),
                alert_conditions=MetricAnomalyAlertConditions(
                    metric_boundary_condition=MetricBoundaryCondition(
                        direction="Up",
                        upper=50
                    )
                ),
                alert_snooze_condition=MetricAnomalyAlertSnoozeCondition(
                    auto_snooze=2,
                    snooze_scope="Metric",
                    only_for_successive=True
                )
            ),
        ],
        hook_ids=[hook_id]
    )

    return alert_config
```

### Query the alert

In a new method, create an import statement like the example below. Replace `alert_id` with the ID for your alert, and replace `alert_config_id` with the alert configuration ID. Create a client with your keys and endpoint, and use `client.list_anomalies_for_alert()` to list an alert configuration. 

```python
def sample_list_anomalies_for_alert(alert_config_id, alert_id):

    from azure.ai.metricsadvisor import MetricsAdvisorKeyCredential, MetricsAdvisorClient
    
    alert_id = "<replace-with-your-alert-id>"
    alert_config_id = "<replace-with-your-alert-configuration-id"
    client = MetricsAdvisorClient(service_endpoint,
                                  MetricsAdvisorKeyCredential(subscription_key, api_key))

    results = client.list_anomalies_for_alert(
            alert_configuration_id=alert_config_id,
            alert_id=alert_id,
        )
    for result in results:
        print("Create on: {}".format(result.created_on))
        print("Severity: {}".format(result.severity))
        print("Status: {}".format(result.status))
```

## Run the application

Run the application with the `python` command on your quickstart file.

```console
python quickstart-file.py
```