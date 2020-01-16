---
title: Debug and troubleshoot Machine Learning Pipelines in Application Insights
titleSuffix: Azure Machine Learning
description: Add logging to your training and batch scoring pipelines and view the logged results in application insights.
services: machine-learning
author: anrode
ms.author: anrode
ms.reviewer: anrode
ms.service: machine-learning
ms.subservice: core
ms.workload: data-services
ms.topic: conceptual
ms.date: 01/15/2020

ms.custom: seodec18
---
# Debug and troubleshoot Machine Learning Pipelines in Application Insights
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

The [OpenCensus](https://opencensus.io/quickstart/python/) python library can be used to route logs to Application Insights from your scripts. The benefit of having all logs for multiple pipeline runs in Application Insights is that you can track trends over time across similar pipeline runs, or compare pipeline runs with different parameters and data.

In addition, it can provide history of exceptions and error messages. Since Application Insights integrates with Azure Alerts, you can also create alerts based on Application Insights queries.

## Prerequisites

* Follow the steps to create an [Azure Machine Learning](./how-to-manage-workspace.md) workspace and [create your first pipeline](./how-to-create-your-first-pipeline.md)
* [Configure your development environment](./how-to-configure-environment.md) to install the Azure Machine Learning SDK. We used Visual Studio Code to write the python scripts in this example
  * Follow this [guide](https://code.visualstudio.com/docs/python/python-tutorial) to set up your Visual Studio Code Python environment
  * We recommend creating a virtual environment and [installing new packages](https://code.visualstudio.com/docs/python/python-tutorial#_install-and-use-packages) there
* Install the [Python OpenCensus package](https://pypi.org/project/opencensus/)
* Create an [Application Insights instance](../azure-monitor/app/opencensus-python.md)(this doc also contains information on getting the connection string for the resource)

## Getting Started

The following is a quickstart for using OpenCensus specific to this use case. For a detailed tutorial, see [OpenCensus Azure Monitor Exporters](https://github.com/census-instrumentation/opencensus-python/tree/master/contrib/opencensus-ext-azure)

After you install the OpenCensus Python library, import the AzureLogHandler class. This helps to route logs to Application Insights. You will also need the Python Logging library.

```python
from opencensus.ext.azure.log_exporter import AzureLogHandler
import logging
```

Then, create a Python logger, and add an AzureLogHandler to it. You will also need to set the required `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable or provide the instrumentation key inline.

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
 
Plaintext strings as logs are helpful in the case where an engineer or data scientist is diagnosing one specific pipeline step, and is already has context of the experiment, parent pipeline, and step that is being evaluated.
In other cases, like when someone is managing several models, a model's performance over time, or doesn't have the time to dive into each individual step and download the logs to view progress, Custom Dimensions can provide helpful context to a log message.
 
Custom Dimensions are a dictionary of key-value (stored as string, string) pairs that is sent to Application Insights and displayed as a column in the query results. Its individual dimensions can be queried on.
 
### Helpful dimensions to include

| Field                          | Reasoning/Example                                                                                                                                                                       |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| parent_run_id                  | Can query across logs for those with same parent_run_id to see logs over time for all steps, instead of having to dive into each individual step                                        |
| step_id                        | Can query across logs for those with same step_id to see where an issue occurred with a narrow scope to just the individual step                                                        |
| step_name                      | Can query across logs to find how a specific step has performed over time, or find a step_id for recent runs without diving into the portal UI                                          |
| experiment_name                | Can query across logs to find how a specific experiment has performed over time, or find a parent_run_id or step_id for recent runs without diving into the portal UI                   |
| experiment_url                 | Can provide a link directly back to the experiment run for further investigation with less clicks, or to use to drill into from a dashboard                                             |
| build_url and/or build_version | Can correlate logs to the code version that provided the step and pipeline logic. This can further help to diagnose issues, or identify models with specific traits (log/metric values) |
| run_type                       | Can differentiate between different model types, or training vs. scoring runs                                                                                                           |

### Creating the custom dimensions dictionary

```python
run = Run.get_context(allow_offline=False)

# get value from environment variable
build_id = os.environ["BUILD_ID"]

custom_dimensions = {
    "parent_run_id": run.parent.id,
    "step_id": run.id,
    "step_name": run.name,
    "experiment_name": run.experiment.name,
    "run_url": run.parent.get_portal_url(),
    "build_id": build_id, 
    # construct Azure DevOps url from helper given this id
    "build_url": "https://dev.azure.com/<your org here>/<your project here>/_build/results?buildId={build_id}&view=results",
    "run_type": "training"
}

# logger has AzureLogHandler registered previously
logger.info("Info for application insights", custom_dimensions) 

```

## OpenCensus Python logging considerations

The OpenCensus AuzreLogHandler is used to normal traditional Python logs to Application Insights. Due to this behavior, normal Python logging nuances should be considered. For example, when a logger is created, it has a default log level and will show logs greater than or equal to that level. A good reference for understanding and effectively utilizing the Python logging features is the [Logging Cookbook](https://docs.python.org/3/howto/logging-cookbook.html).

The `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable is needed for the OpenCensus library. Consider setting this environment variable instead of passing it in as a pipeline parameter to reduce the amount of parameters needed and avoid passing around plaintext connection strings. # TODO: How to

## Querying logs in Application Insights

The logs routed to Application Insights will show up under 'traces'. Be sure to adjust your time window to include your pipeline run.

![Application Insights Query result](./media/how-to-debug-pipelines-application-insights/traces-application-insights-query.png)

The result in Application Insights will show the log message and level, file path and code line number the log is from, as well as any custom dimensions included. In this image, the customDimensions dictionary shows the key/value pairs from the previous [code sample](#creating-custom-dimensions-dictionary).

## Additional helpful queries

This section contains helpful queries besides just the 'traces' query we initially used as en example to verify that logs are being piped to your Application Insights instance.

Some of the queries below use ‘severityLevel’. For more information on Application Insights severity levels, see this [reference](https://docs.microsoft.com/en-us/dotnet/api/microsoft.applicationinsights.datacontracts.severitylevel?view=azure-dotnet). These severity levels correspond to the level the Python log was originally sent with. For additional query information, see [Azure Monitor Log Queries](https://docs.microsoft.com/en-us/azure/azure-monitor/log-query/query-language).

| Use case                                                               | Query                                                                                              |
|------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| Log results for specific custom dimension, for example 'parent_run_id' | `traces`<br>`| where customDimensions.['parent_run_id'] == '931024c2-3720-11ea-b247-c49deda841c1'` |
| Log results for training runs over the last 7 days                     | `traces`<br>`| where timestamp > ago(7d) and customDimensions['run_type'] == 'training'`           |
| Log results with severityLevel Error from the last 7 days              | `traces`<br>`| where timestamp > ago(7d) and severityLevel == 3`                                   |
| Count of log results with severityLevel Error over the last 7 days     | `traces`<br>`| where timestamp > ago(7d) and severityLevel == 3`<br>`| summarize count()`          |
