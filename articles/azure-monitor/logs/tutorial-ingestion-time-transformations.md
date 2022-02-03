---
title: Tutorial: Tutorial: Add ingestion-time transformation to Azure Monitor Logs
description: This article describes how to add a custom transformation to data flowing through Azure Monitor Logs using table management features of Log Analytics workspace.
ms.subservice: logs
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 01/19/2022
---

# Tutorial: Add ingestion-time transformation to Azure Monitor Logs
[Ingestion-time transformations](ingestion-time-transformations.md) allow you to manipulate incoming data before it's stored in a Log Analytics workspace. You can add data filtering, parsing and extraction and control the structure of the data that gets ingested. 

In this tutorial, you learn to:

> [!div class="checklist"]
> * Create a metric alert rule from metrics explorer
> * Configure the alert threshold
> * 


This tutorial will guide you through the process of configuring [ingestion-time transformation](ingestion-time-transformations.md) for Azure Monitor Logs. 


## Prerequisites
An Azure Monitor Logs Workspace to which you have at least contributor rights will be required. Additionally, in the same subscription, permissions to create Data Collection Rule objects will be required.
For the demonstration purposes we are going to work with `LAQueryLogs` table, but the same principles can be applied to virtually any Azure log.  

## Overview
Configuring ingestion-time transformation for a table requires the following steps to be completed:

1. (if not previously done) The workspace must be created and subject log should be enabled.
2. Table schema must be updated with desired additional columns
3. Data Collection Rule of special  `WorkspaceTransforms` kind shuld be created and linked to the Workspace. This step needs to be performed only once for each given Workspace. 
4. Ingestion-time transformation should be authored and added to the Data Collection Rule mentioned above.

Luckily, steps 2 through 4 will be performed automatically. All we have to do is to enable the log table and provide ingestion-time transformation in form of KQL statement.

For this tutorial, we will be working with the [LAQueryLogs table](https://docs.microsoft.com/azure/azure-monitor/logs/query-audit#audit-data) which captures the details of log queries run in Azure Monitor. We will be adding a transformation which accomplishes two goals: first, we will be reducing the volume of data stored by filtering out any queries run against `LAQueryLogs` table itself and "emptying" some columns we don't plan to use; second, we will be pre-parsing some dynamic columns to simplify future querying.

Let's look at the process of adding ingestion-time transformation in detail.

## Create Log Analytics Workspace and Enable Query Audit Logs

The creation of a Log Analytics Workspace is well-documented [here](https://docs.microsoft.com/azure/azure-monitor/logs/quick-create-workspace).  

> [!IMPORTANT]
> The Private Preview currently only supports Workspaces in the `West US 2`, `East US 2`, and `East US 2 EUAP ("Canary")` Regions!

In this workspace, some data should be flowing to implement the ingestion-time transformation against. Most data types will work. For the purposes of this tutorial, we'll be using query audit logs. We are going to choose our Log Analytics workspace as a destination for it's own query audit logs. Instructions to enable query audit logs for a workspace are available [here](https://docs.microsoft.com/azure/azure-monitor/logs/query-audit). 

Once query audit logs are enabled, run a couple of queries against any table in your workspace to populate `LAQueryLogs` table with some data.

## Add Ingestion-Time Transformation to the Table

### Initiate ingestion-time transformation creation

Within your Workspace, choose "Tables" menu item under Settings category.

![Chose Tables menu item under Settings category](./media/custom-logs-v2/navigating_to_tables.png) 

Once "Tables" page opens, locate `LAQueryLogs` table in the list. Select "Create transformation" in the context menu.

![Chose Create Transformation in the context menu](./media/custom-logs-v2/tables_page.png) 

### Designate default Data Collection Rule (once per Workspace)

Since this is the first transformation, we are adding to a table in a given Workspace, new workspace transformations Data Collection Rule (DCR) needs to be created and set as default for the workspace. 
Click on "Create a new data collection rule" and provide a name for DCR to be created. When it is done, proceed to the next step.

![Create a new data collection rule](./media/custom-logs-v2/default_dcr.png) 

Note that when default DCR has been already assigned to the Workspace, you don't have to create or specify it every time. The system will locate and select it by default.

### Author ingestion-time transformation

Once we have decided how to name default DCR for the Workspace we can work on the transformation logic. The page displays the sample of data obtained from the table we are working with. As we are going to define the transformation, the result of it will be applied to the sample, so that we can evaluate the outcome before we complete the configuration and apply the transformation to real data. Proceed by clicking "Transformation editor" button.

![Schema and transformation](./media/custom-logs-v2/scenario4_step2.png) 

In the transformation editor window we can see the transformation currently applied to the data prior to its ingestion into our table. The stream of data bound to table is represented by the virtual table `source`, which has the same set of columns as the destination table itself. By default, the transformation just passes through the data from the input stream to the destination table.

Let us modify the transformation, so that it accomplishes our goals:

1. We want to drop the rows related to querying the `LAQueryLogs` table itself to save space and declutter logs
2. We want to have a separate column for the Workspace queried
3. Once we extract that information, we want to empty RequestContext column, so it does not take up space 

The resulting transformation code will look like the following:

```kusto
source
| where QueryText !contains 'LAQueryLogs'
| extend Context = parse_json(RequestContext)
| extend Workspace_CF = tostring(Context['workspaces'][0])
| project-away RequestContext, Context
```

Note, that the output of the transformation will inform the changes to the table schema. Additional columns will be added to the table as needed to accommodate the outcome of the transformation. Each custom column to be added to an Azure table must have "_CF" suffix added to its name (e.g. `Workspace_CF`). Removing interim columns from the transformation result (here, `project-away Context` statement) is recommended practice to prevent confusion between custom data to be stored versus dropped.

It is also worth mentioning, that dropping standard columns from an Azure table (e.g. `project-away RequestContext`) will not remove the column from the table, but will prevent data ingestion into the column.

After we put our transformation into the transformation editor window and press "Run" we can see the result of its application to the sample data in the results pane.

![Transformation editor](./media/custom-logs-v2/transform_editor.png) 

### Review
Let us click "Apply" and proceed to the review step.

![Transformation editor](./media/custom-logs-v2/scenario4_step3.png)

Once you click "Create", default DCR will be updated with ingestion-time transformation for the table of your choice. If you navigate to logs and query the table immediately after completion of the setup process, you will see custom columns added to the table schema, although allow approximately 30 minutes for your transformation to take effect.

## Known issues and workarounds  
**Problem**: The DCR object, when viewed via the Azure Portal, does not appear to have properties such as the transform KQL in it, even though provisioning it with those properties was successful  
**Solution**: The Azure Portal UI for DCRs does not use the latest version of the API. Until the UI is updated to reflect this new API version, please call a GET against the DCR object directly using API version `2021-09-01-preview` or later.  

**Problem**: I sent the data, but I don't see it in my workspace  
**Solution**: Please give the data some time to arrive, especially if this is the first time data is being sent to a particular table. If data takes longer than ~15min to arrive, contact the support email provided to you as part of onboarding.  

**Problem**: I see the new columns I created showing up in the schema browser, but IntelliSense is not working
**Solution**: The cache that drives IntelliSense takes some time to update. Please give the system up to a day for these changes to be reflected.  

**Problem**: I added a transformation to a `Dynamic` column, but the transformation doesn't work
**Solution**: There is currently a bug affecting dynamic columns. A temporary workaround is to explicitly parse dynamic column data using `parse_json()` prior to performing any operations against them.   


