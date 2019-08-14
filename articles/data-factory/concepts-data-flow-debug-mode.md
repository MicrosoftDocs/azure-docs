---
title: Azure Data Factory Mapping Data Flow Debug Mode
description: Start an interactive debug session when building data flows
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.date: 10/04/2018
---

# Mapping Data Flow Debug Mode

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

## Overview

Azure Data Factory Mapping Data Flow's debug mode can be switched on with the "Data Flow Debug" button at the top of the design surface. When designing data flows, turning on debug mode allows you to interactively watch the data shape transform while you build and debug your data flows. The Debug session can be used both in Data Flow design sessions as well as during pipeline debug execution of data flows.

![Debug button](media/data-flow/debugbutton.png "Debug button")

When Debug mode is on, you'll interactively build your data flow with an active Spark cluster. The session will close once you turn debug off in Azure Data Factory. You should be aware of the hourly charges incurred by Azure Databricks during the time that you have the debug session turned on.

In most cases, it's a good practice to build your Data Flows in debug mode so that you can validate your business logic and view your data transformations before publishing your work in Azure Data Factory. Use the "Debug" button on the pipeline panel to test your data flow in a pipeline.

> [!NOTE]
> While the debug mode light is green on the Data Factory toolbar, you'll be charged at the Data Flow debug rate of 8 cores/hr of general compute with a 60 minute time-to-live 

## Cluster status

The cluster status indicator at the top of the design surface turns green when the cluster is ready for debug. If your cluster is already warm, then the green indicator will appear almost instantly. If your cluster wasn't already running when you entered debug mode, then you'll have to wait 5-7 minutes for the cluster to spin up. The indicator will spin until its ready.

When you are finished with your debugging, turn the Debug switch off so that your Azure Databricks cluster can terminate and you'll no longer be billed for debug activity.

## Debug settings

Debug settings can be edited by clicking "Debug Settings" on the Data Flow canvas toolbar. You can select the row limit or file source to use for each of your Source transformations here. The row limits in this setting are only for the current debug session. You can also select the staging linked service to be used for a SQL DW source. 

![Debug settings](media/data-flow/debug-settings.png "Debug settings")

If you have parameters in your Data Flow or any of its referenced datasets, you can specify what values to use during debugging by selecting the **Parameters** tab.

![Debug settings parameters](media/data-flow/debug-settings2.png "Debug settings parameters")

## Data preview

With debug on, the Data Preview tab will light-up on the bottom panel. Without debug mode on, Data Flow will show you only the current metadata in and out of each of your transformations in the Inspect tab. The data preview will only query the number of rows that you have set as your limit in your debug settings. Click **Refresh** to fetch the data preview.

![Data preview](media/data-flow/datapreview.png "Data preview")

When running in Debug Mode in Data Flow, your data will not be written to the Sink transform. A Debug session is intended to serve as a test harness for your transformations. Sinks are not required during debug and are ignored in your data flow. If you wish to test writing the data in your Sink, execute the Data Flow from an Azure Data Factory Pipeline and use the Debug execution from a pipeline.

### Quick actions

Once you see the data preview, you can generate a quick transformation to typecast, remove, or do a modification on a column. Click on the column header and then select one of the options from the data preview toolbar.

![Quick actions](media/data-flow/quick-actions1.png "Quick actions")

Once you select a modification, the data preview will immediately refresh. Click **Confirm** in the top-right corner to generate a new transformation.

![Quick actions](media/data-flow/quick-actions2.png "Quick actions")

**Typecast** and **Modify** will generate a Derived Column transformation and **Remove** will generate a Select transformation.

![Quick actions](media/data-flow/quick-actions3.png "Quick actions")

> [!NOTE]
> If you edit your Data Flow, you need to re-fetch the data preview before adding a quick transformation.

### Data profiling

Selecting a columns in your data preview tab and clicking **Statistics** in the data preview toolbar will pop up a chart on the far-right of your data grid with detailed statistics about each field. Azure Data Factory will make a determination based upon the data sampling of which type of chart to display. High-cardinality fields will default to NULL/NOT NULL charts while categorical and numeric data that has low cardinality will display bar charts showing data value frequency. You'll also see max/len length of string fields, min/max values in numeric fields, standard dev, percentiles, counts, and average.

![Column statistics](media/data-flow/stats.png "Column statistics")

## Next steps

* Once you're finished building and debugging your data flow, [execute it from a pipeline.](control-flow-execute-data-flow-activity.md)
* When testing your pipeline with a data flow, use the pipeline [Debug run execution option.](iterative-development-debugging.md)
