---
title: Metrics Advisor Python quickstart
titleSuffix: Azure AI services
author: mrbullwinkle
manager: nitinme
ms.service: applied-ai-services
ms.subservice: metrics-advisor
ms.topic: include
ms.date: 11/04/2022
ms.author: mbullwin
---

[Reference documentation](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-metricsadvisor/latest/azure.ai.metricsadvisor.html) | [Library source code](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/metricsadvisor/azure-ai-metricsadvisor/README.md) | [Package (PiPy)](https://pypi.org/project/azure-ai-metricsadvisor/) | [Samples](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/metricsadvisor/azure-ai-metricsadvisor/samples/README.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* [Python 3.x](https://www.python.org/)
* Once you have your Azure subscription, <a href="https://go.microsoft.com/fwlink/?linkid=2142156"  title="Create a Metrics Advisor resource"  target="_blank">create a Metrics Advisor resource </a> in the Azure portal to deploy your Metrics Advisor instance.  
* Your own SQL database with time series data.
  
> [!TIP]
> * You can find Python Metrics Advisor samples on [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/metricsadvisor/azure-ai-metricsadvisor/samples).
> * It may take 10 to 30 minutes for your Metrics Advisor resource to deploy a service instance for you to use. Select **Go to resource** once it successfully deploys. After deployment, you can start using your Metrics Advisor instance with both the web portal and REST API.
> * You can find the URL for the REST API in Azure portal, in the **Overview** section of your resource. It will look like this:
> * `https://<instance-name>.cognitiveservices.azure.com/`

## Set up

### Install the client library

Install the client library. You can install the client library with:

```console
pip install azure-ai-metricsadvisor --pre
```

## Environment variables

To successfully make a call against the Anomaly Detector service, you'll need the following values:

|Variable name | Value |
|--------------------------|-------------|
| `METRICS_ADVISOR_ENDPOINT` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Example endpoint: `https://YOUR_RESOURCE_NAME.cognitiveservices.azure.com/`|
| `METRICS_ADVISOR_KEY` | The key value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|
|`METRICS_ADVISOR_API_KEY` |The key value can be found under **Settings** >  **API keys** when examining your resource from the [Metrics Advisor portal](https://metricsadvisor.azurewebsites.net/). You can use either `KEY1` or `KEY2`.  |
|`SQL_CONNECTION_STRING` | This quickstart requires you to have your own SQL Database + connection string. An example connection string would look similar to the following example:`Data Source=<Server>;Initial Catalog=<db-name>;User ID=<user-name>;Password=<password>` for more information on constructing SQL connection strings, see the [SQL documentation](../../data-feeds-from-different-sources.md#azure-sql-database--sql-server).  |
|`SQL_QUERY`| Unique query specific to your dataset.|

### Create environment variables

Create and assign persistent environment variables for your key and endpoint.

# [Command Line](#tab/command-line)

```CMD
setx METRICS_ADVISOR_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE" 
setx METRICS_ADVISOR_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
setx METRICS_ADVISOR_API_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
setx SQL_CONNECTION_STRING "REPLACE_WITH_YOUR_UNIQUE_SQL_CONNECTION_STRING" 
setx SQL_QUERY "REPLACE_WITH_YOUR_UNIQUE_SQL_QUERY_BASED_ON_THE_UNDERLYING_STRUCTURE_OF_YOUR_DATA" 
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('METRICS_ADVISOR_ENDPOINT', 'REPLACE_WITH_YOUR_ENDPOINT_HERE', 'User')
[System.Environment]::SetEnvironmentVariable('METRICS_ADVISOR_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
[System.Environment]::SetEnvironmentVariable('METRICS_ADVISOR_API_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
[System.Environment]::SetEnvironmentVariable('SQL_CONNECTION_STRING', 'REPLACE_WITH_YOUR_UNIQUE_SQL_CONNECTION_STRING', 'User')
[System.Environment]::SetEnvironmentVariable('SQL_QUERY', 'REPLACE_WITH_YOUR_UNIQUE_SQL_QUERY_BASED_ON_THE_UNDERLYING_STRUCTURE_OF_YOUR_DATA', 'User')
```

# [Bash](#tab/bash)

```Bash
echo export METRICS_ADVISOR_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment && source /etc/environment
echo export METRICS_ADVISOR_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
echo export METRICS_ADVISOR_API_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
echo export SQL_CONNECTION_STRING="REPLACE_WITH_YOUR_UNIQUE_SQL_CONNECTION_STRING" >> /etc/environment && source /etc/environment
echo export SQL_QUERY="REPLACE_WITH_YOUR_UNIQUE_SQL_QUERY_BASED_ON_THE_UNDERLYING_STRUCTURE_OF_YOUR_DATA" >> /etc/environment && source /etc/environment
```

---

## Create your application

Create a python application based off the follow code:

```python
"""
FILE: sample_data_feeds.py
DESCRIPTION:
    This sample demonstrates how to create, get, list, update, and delete datafeeds under your Metrics Advisor account.
USAGE:
    python sample_data_feeds.py
    Set the environment variables with your own values before running the sample:
    1) METRICS_ADVISOR_ENDPOINT - the endpoint of your Azure AI Metrics Advisor service
    2) METRICS_ADVISOR_KEY - Metrics Advisor service subscription key
    3) METRICS_ADVISOR_API_KEY - Metrics Advisor service API key
    4) SQL_CONNECTION_STRING - Used in this sample for demonstration, but you should
       add your own credentials specific to the data source type you're using
    5) SQL_QUERY - Used in this sample for demonstration, but you should
       add your own query specific to the structure of the data in your datasource.
"""

import os
import datetime


def sample_create_data_feed():
    from azure.ai.metricsadvisor import MetricsAdvisorKeyCredential, MetricsAdvisorAdministrationClient
    from azure.ai.metricsadvisor.models import (
        SqlServerDataFeedSource,
        DataFeedSchema,
        DataFeedMetric,
        DataFeedDimension,
        DataFeedRollupSettings,
        DataFeedMissingDataPointFillSettings,
    )

    service_endpoint = os.getenv("METRICS_ADVISOR_ENDPOINT")
    subscription_key = os.getenv("METRICS_ADVISOR_KEY")
    api_key = os.getenv("METRICS_ADVISOR_API_KEY")
    sql_server_connection_string = os.getenv("SQL_CONNECTION_STRING")
    query = os.getenv("SQL_QUERY")

    client = MetricsAdvisorAdministrationClient(service_endpoint,
                                  MetricsAdvisorKeyCredential(subscription_key, api_key))

    data_feed = client.create_data_feed(
        name="My data feed",
        source=SqlServerDataFeedSource(
            connection_string=sql_server_connection_string,
            query=query,
        ),
        granularity="Daily",
        schema=DataFeedSchema(
            metrics=[
                DataFeedMetric(name="cost", display_name="Cost"),
                DataFeedMetric(name="revenue", display_name="Revenue")
            ],
            dimensions=[
                DataFeedDimension(name="category", display_name="Category"),
                DataFeedDimension(name="region", display_name="region")
            ],
            timestamp_column="Timestamp"
        ),
        ingestion_settings=datetime.datetime(2019, 10, 1),
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

    return data_feed

def sample_get_data_feed(data_feed_id):
    from azure.ai.metricsadvisor import MetricsAdvisorKeyCredential, MetricsAdvisorAdministrationClient

    service_endpoint = os.getenv("METRICS_ADVISOR_ENDPOINT")
    subscription_key = os.getenv("METRICS_ADVISOR_KEY")
    api_key = os.getenv("METRICS_ADVISOR_API_KEY")

    client = MetricsAdvisorAdministrationClient(service_endpoint,
                                  MetricsAdvisorKeyCredential(subscription_key, api_key))

    data_feed = client.get_data_feed(data_feed_id)

    print("ID: {}".format(data_feed.id))
    print("Data feed name: {}".format(data_feed.name))
    print("Created time: {}".format(data_feed.created_time))
    print("Status: {}".format(data_feed.status))
    print("Source type: {}".format(data_feed.source.data_source_type))
    print("Granularity type: {}".format(data_feed.granularity.granularity_type))
    print("Data feed metrics: {}".format([metric.name for metric in data_feed.schema.metrics]))
    print("Data feed dimensions: {}".format([dimension.name for dimension in data_feed.schema.dimensions]))
    print("Data feed timestamp column: {}".format(data_feed.schema.timestamp_column))
    print("Ingestion data starting on: {}".format(data_feed.ingestion_settings.ingestion_begin_time))
    print("Data feed description: {}".format(data_feed.data_feed_description))
    print("Data feed rollup type: {}".format(data_feed.rollup_settings.rollup_type))
    print("Data feed rollup method: {}".format(data_feed.rollup_settings.rollup_method))
    print("Data feed fill setting: {}".format(data_feed.missing_data_point_fill_settings.fill_type))
    print("Data feed access mode: {}".format(data_feed.access_mode))

def sample_list_data_feeds():
    from azure.ai.metricsadvisor import MetricsAdvisorKeyCredential, MetricsAdvisorAdministrationClient

    service_endpoint = os.getenv("METRICS_ADVISOR_ENDPOINT")
    subscription_key = os.getenv("METRICS_ADVISOR_SUBSCRIPTION_KEY")
    api_key = os.getenv("METRICS_ADVISOR_API_KEY")

    client = MetricsAdvisorAdministrationClient(service_endpoint,
                                  MetricsAdvisorKeyCredential(subscription_key, api_key))

    data_feeds = client.list_data_feeds()

    for feed in data_feeds:
        print("Data feed name: {}".format(feed.name))
        print("ID: {}".format(feed.id))
        print("Created time: {}".format(feed.created_time))
        print("Status: {}".format(feed.status))
        print("Source type: {}".format(feed.source.data_source_type))
        print("Granularity type: {}".format(feed.granularity.granularity_type))

        print("\nFeed metrics:")
        for metric in feed.schema.metrics:
            print(metric.name)

        print("\nFeed dimensions:")
        for dimension in feed.schema.dimensions:
            print(dimension.name)

def sample_update_data_feed(data_feed):
    from azure.ai.metricsadvisor import MetricsAdvisorKeyCredential, MetricsAdvisorAdministrationClient

    service_endpoint = os.getenv("METRICS_ADVISOR_ENDPOINT")
    subscription_key = os.getenv("METRICS_ADVISOR_KEY")
    api_key = os.getenv("METRICS_ADVISOR_API_KEY")

    client = MetricsAdvisorAdministrationClient(service_endpoint,
                                  MetricsAdvisorKeyCredential(subscription_key, api_key))

    # update data feed on the data feed itself or by using available keyword arguments
    data_feed.name = "updated name"
    data_feed.data_feed_description = "updated description for data feed"

    updated = client.update_data_feed(
        data_feed,
        access_mode="Public",
        fill_type="CustomValue",
        custom_fill_value=1
    )
    print("Updated name: {}".format(updated.name))
    print("Updated description: {}".format(updated.data_feed_description))
    print("Updated access mode: {}".format(updated.access_mode))
    print("Updated fill setting, value: {}, {}".format(
        updated.missing_data_point_fill_settings.fill_type,
        updated.missing_data_point_fill_settings.custom_fill_value,
    ))

def sample_delete_data_feed(data_feed_id):
    from azure.core.exceptions import ResourceNotFoundError
    from azure.ai.metricsadvisor import MetricsAdvisorKeyCredential, MetricsAdvisorAdministrationClient

    service_endpoint = os.getenv("METRICS_ADVISOR_ENDPOINT")
    subscription_key = os.getenv("METRICS_ADVISOR_KEY")
    api_key = os.getenv("METRICS_ADVISOR_API_KEY")

    client = MetricsAdvisorAdministrationClient(service_endpoint,
                                  MetricsAdvisorKeyCredential(subscription_key, api_key))

    client.delete_data_feed(data_feed_id)

    try:
        client.get_data_feed(data_feed_id)
    except ResourceNotFoundError:
        print("Data feed successfully deleted.")

if __name__ == '__main__':
    print("---Creating data feed...")
    data_feed = sample_create_data_feed()
    print("Data feed successfully created...")
    print("\n---Get a data feed...")
    sample_get_data_feed(data_feed.id)
    print("\n---List data feeds...")
    sample_list_data_feeds()
    print("\n---Update a data feed...")
    sample_update_data_feed(data_feed)
    print("\n---Delete a data feed...")
    sample_delete_data_feed(data_feed.id)
```

### Run the application

Run the application with the `python` command on your quickstart file.

```console
python quickstart-file.py
```
