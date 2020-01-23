---
title: Debug and troubleshoot machine learning pipelines in Application Insights
titleSuffix: Azure Machine Learning
description: Add logging to your training and batch scoring pipelines and view the logged results in Application Insights.
services: machine-learning
author: aburek
ms.author: anrode
ms.service: machine-learning
ms.subservice: core
ms.workload: data-services
ms.topic: conceptual
ms.date: 01/16/2020

ms.custom: seodec18
---
# Debug and troubleshoot machine learning pipelines in Application Insights
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

The [OpenCensus](https://opencensus.io/quickstart/python/) python library can be used to route logs to Application Insights from your scripts. It can be used to query all logs for pipeline runs in once place. Application Insights will allow you to track logs over time and compare pipeline logs across runs with different parameters and inputs.

Having your logs in once place will provide a history of exceptions and error messages. Since Application Insights integrates with Azure Alerts, you can also create alerts based on Application Insights queries.

## Prerequisites

* Follow the steps to create an [Azure Machine Learning](./how-to-manage-workspace.md) workspace and [create your first pipeline](./how-to-create-your-first-pipeline.md)
* [Configure your development environment](./how-to-configure-environment.md) to install the Azure Machine Learning SDK
* Install the [OpenCensus Azure Monitor Exporter](https://pypi.org/project/opencensus-ext-azure/) using `pip install opencensus-ext-azure`. Then import the `AzureLogHandler` from the library using `from opencensus.ext.azure.log_exporter import AzureLogHandler` at the top of your Python script
* Create an [Application Insights instance](../azure-monitor/app/opencensus-python.md#create-an-application-insights-resource-in-azure-monitor) (this doc also contains information on getting the connection string for the resource)

## Getting Started

This section is an introduction specific to using OpenCensus from an Azure Machine Learning pipeline. For a detailed tutorial, see [OpenCensus Azure Monitor Exporters](https://github.com/census-instrumentation/opencensus-python/tree/master/contrib/opencensus-ext-azure)

After installing the OpenCensus Python library, import the AzureLogHandler class to route logs to Application Insights. You'll also need to import the Python Logging library.

```python
from opencensus.ext.azure.log_exporter import AzureLogHandler
import logging
```

Next, create a Python logger with an AzureLogHandler added. Be sure to set the required `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable or provide the instrumentation key inline.

```python
# Use OpenCensus Logging

# If you do not want to use env variable, instantiate handler this way:
handler = AzureLogHandler(connection_string='<connection string>')
logger.addHandler(handler)

#   Otherwise, you must set the env variable APPLICATIONINSIGHTS_CONNECTION_STRING
try:        
    logger.addHandler(AzureLogHandler()).
except ValueError as ex:
    logger.warning("Could not find application insights key. Either set the APPLICATIONINSIGHTS_CONNECTION_STRING " \
        "environment variable or pass in a connection_string to AzureLogHandler.")
```

## Logging with Custom Dimensions
 
Plaintext string logs are helpful for engineers or data scientists diagnosing a specific pipeline step when they have some context about the experiment area. By default, logs forwarded to Application Insights will not have context to trace back to the run or experiment.

To add these fields, Custom Dimensions can be added to provide context to a log message. One example is when someone wants to view logs across multiple steps that share a parent run ID.

Custom Dimensions make up a dictionary of key-value (stored as string, string) pairs. The dictionary is then sent to Application Insights and displayed as a column in the query results. Its individual dimensions can be used as [query parameters](#additional-helpful-queries)

### Helpful dimensions to include

| Field                          | Reasoning/Example                                                                                                                                                                       |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| parent_run_id                  | Can query logs for ones with the same parent_run_id to see logs over time for all steps, instead of having to dive into each individual step                                        |
| step_id                        | Can query logs for ones with the same step_id to see where an issue occurred with a narrow scope to just the individual step                                                        |
| step_name                      | Can query logs to see step performance over time. Also helps to find a step_id for recent runs without diving into the portal UI                                          |
| experiment_name                | Can query across logs to see experiment performance over time. Also helps find a parent_run_id or step_id for recent runs without diving into the portal UI                   |
| run_url                 | Can provide a link directly back to the run for investigation. |
| run_type                       | Can differentiate between different model types, or training vs. scoring runs                                                                                                           |

**Other helpful fields**

May require additional code instrumentation, and are not provided by the run context.

| Field                   | Reasoning/Example                                                                                                                                                                                                           |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| build_url/build_version | If using CI/CD to deploy, this field can correlate logs to the code version that provided the step and pipeline logic. This link can further help to diagnose issues, or identify models with specific traits (log/metric values) |

### Creating a custom dimensions dictionary

```python
run = Run.get_context(allow_offline=False)

custom_dimensions = {
    "parent_run_id": run.parent.id,
    "step_id": run.id,
    "step_name": run.name,
    "experiment_name": run.experiment.name,
    "run_url": run.parent.get_portal_url(),
    "run_type": "training"
}

# logger has AzureLogHandler registered previously
logger.info("Info for application insights", custom_dimensions) 

```

## OpenCensus Python logging considerations

The OpenCensus AzureLogHandler is used to route Python logs to Application Insights. As a result, Python logging nuances should be considered. When a logger is created, it has a default log level and will show logs greater than or equal to that level. A good reference for using Python logging features is the [Logging Cookbook](https://docs.python.org/3/howto/logging-cookbook.html).

The `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable is needed for the OpenCensus library. We recommend setting this environment variable instead of passing it in as a pipeline parameter to avoid passing around plaintext connection strings.

## Querying logs in Application Insights

The logs routed to Application Insights will show up under 'traces' or 'exceptions'. Be sure to adjust your time window to include your pipeline run.

![Application Insights Query result](./media/how-to-debug-pipelines-application-insights/traces-application-insights-query.png)

The result in Application Insights will show the log message and level, file path, and code line number the log is from, as well as any custom dimensions included. In this image, the customDimensions dictionary shows the key/value pairs from the previous [code sample](#creating-a-custom-dimensions-dictionary).

## Additional helpful queries

Some of the queries below use 'severityLevel'. For more information on Application Insights severity levels, see this [reference](https://docs.microsoft.com/dotnet/api/microsoft.applicationinsights.datacontracts.severitylevel?view=azure-dotnet). These severity levels correspond to the level the Python log was originally sent with. For additional query information, see [Azure Monitor Log Queries](https://docs.microsoft.com/azure/azure-monitor/log-query/query-language). You can also query on `customDimensions.Level`, which is included as an option in the table below.

| Use case                                                               | Query                                                                                              |
|------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| Log results for specific custom dimension, for example 'parent_run_id' | `traces | where customDimensions.parent_run_id == '931024c2-3720-11ea-b247-c49deda841c1'` |
| Log results for training runs over the last 7 days                     | `traces | where timestamp > ago(7d) and customDimensions.run_type == 'training'`           |
| Log results with severityLevel Error from the last 7 days              | `traces | where timestamp > ago(7d) and customDimensions.Level == 'WARNING'`<br>`traces | where timestamp > ago(7d) and severityLevel == 3`                                     |
| Count of log results with severityLevel Error over the last 7 days     | `traces | where timestamp > ago(7d) and customDimensions.Level == 'WARNING' | summarize count()`<br>`traces | where timestamp > ago(7d) and severityLevel == 3 | summarize count()`          |
