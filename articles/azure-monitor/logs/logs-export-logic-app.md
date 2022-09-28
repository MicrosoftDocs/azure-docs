---
title: Export data from Log Analytics workspace to Azure Storage Account using Logic App
description: Describes a method to use Azure Logic Apps to query data from a Log Analytics workspace and send to Azure Storage.
ms.service:  azure-monitor
ms.topic: conceptual
author: yossi-y
ms.author: yossiy
ms.date: 03/01/2022
---


# Export data from Log Analytics workspace to Azure Storage Account using Logic App
This article describes a method to use [Azure Logic App](../../logic-apps/index.yml) to query data from a Log Analytics workspace in Azure Monitor and send to Azure Storage. Use this process when you need to export your Azure Monitor Log data for auditing and compliance scenarios or to allow another service to retrieve this data.  

## Other export methods
The method described in this article describes a scheduled export from a log query using a Logic App. Other options to export data for particular scenarios include the following:

- To export data from your Log Analytics workspace to an Azure Storage Account or Event Hubs, use the Log Analytics workspace data export feature of Azure Monitor Logs. See [Log Analytics workspace data export in Azure Monitor](logs-data-export.md)
- One time export using a Logic App. See [Azure Monitor Logs connector for Logic Apps and Power Automate](logicapp-flow-connector.md).
- One time export to local machine using PowerShell script. See [Invoke-AzOperationalInsightsQueryExport](https://www.powershellgallery.com/packages/Invoke-AzOperationalInsightsQueryExport).

## Overview
This procedure uses the [Azure Monitor Logs connector](/connectors/azuremonitorlogs) which lets you run a log query from a Logic App and use its output in other actions in the workflow. The [Azure Blob Storage connector](/connectors/azureblob) is used in this procedure to send the query output to Azure storage.

[![Logic app overview](media/logs-export-logic-app/logic-app-overview.png "Screenshot of Logic app flow.")](media/logs-export-logic-app/logic-app-overview.png#lightbox)

When you export data from a Log Analytics workspace, you should limit the amount of data processed by your Logic App workflow, by filtering and aggregating your log data in query, to reduce to the required data. For example, if you need to export sign-in events, you should filter for required events and project only the required fields. For example: 

```Kusto
SecurityEvent
| where EventID == 4624 or EventID == 4625
| project TimeGenerated , Account , AccountType , Computer
```

When you export the data on a schedule, use the ingestion_time() function in your query to ensure that you don’t miss late arriving data. If data is delayed due to network or platform issues, using the ingestion time ensures that data is included in the next Logic App execution. See *Add Azure Monitor Logs action* under [Logic App procedure](#logic-app-procedure) for an example.

## Prerequisites
Following are prerequisites that must be completed before this procedure.

- Log Analytics workspace--The user who creates the Logic App must have at least read permission to the workspace. 
- Azure Storage Account--The Storage Account doesn’t have to be in the same subscription as your Log Analytics workspace. The user who creates the Logic App must have write permission to the Storage Account. 


## Connector limits
Log Analytics workspace and log queries in Azure Monitor are multitenancy services that include limits, to protect and isolate customers, and maintain quality of service. When querying for a large amount of data, you should consider the following limits, which can affect how you configure the Logic App recurrence and your log query:

- Log queries cannot return more than 500,000 rows.
- Log queries cannot return more than 64,000,000 bytes.
- Log queries cannot run longer than 10 minutes by default. 
- Log Analytics connector is limited to 100 call per minute.

## Logic App procedure

1. **Create container in the Storage Account**
   
   Use the procedure in [Create a container](../../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) to add a container to your Storage Account to hold the exported data. The name used for the container in this article is **loganalytics-data**, but you can use any name.

1. **Create Logic App**

   1. Go to **Logic Apps** in the Azure portal and click **Add**. Select a **Subscription**, **Resource group**, and **Region** to store the new Logic App and then give it a unique name. You can turn on **Log Analytics** setting to collect information about runtime data and events as described in [Set up Azure Monitor logs and collect diagnostics data for Azure Logic Apps](../../logic-apps/monitor-logic-apps-log-analytics.md). This setting isn't required for using the Azure Monitor Logs connector.
\
   [![Create Logic App](media/logs-export-logic-app/create-logic-app.png "Screenshot of Logic App resource create.")](media/logs-export-logic-app/create-logic-app.png#lightbox)

   2. Click **Review + create** and then **Create**. When the deployment is complete, click **Go to resource** to open the **Logic Apps Designer**.

2. **Create a trigger for the Logic App**
   
    1. Under **Start with a common trigger**, select **Recurrence**. This creates a Logic App that automatically runs at a regular interval. In the **Frequency** box of the action, select **Day** and in the **Interval** box, enter **1** to run the workflow once per day.
   \
    [![Recurrence action](media/logs-export-logic-app/recurrence-action.png "Screenshot of recurrence action create.")](media/logs-export-logic-app/recurrence-action.png#lightbox)

3. **Add Azure Monitor Logs action**
   
   The Azure Monitor Logs action lets you specify the query to run. The log query used in this example is optimized for hourly recurrence and collects the data ingested for the particular execution time. For example, if the workflow runs at 4:35, the time range would be 3:00 to 4:00. If you change the Logic App to run at a different frequency, you need the change the query as well. For example, if you set the recurrence to run daily, you would set startTime in the query to startofday(make_datetime(year,month,day,0,0)).

   You will be prompted to select a tenant to grant access to the Log Analytics workspace with the account that the workflow will use to run the query. 

   1. Click **+ New step** to add an action that runs after the recurrence action. Under **Choose an action**, type **azure monitor** and then select **Azure Monitor Logs**.
   \
   [![Azure Monitor Logs action](media/logs-export-logic-app/select-azure-monitor-connector.png "Screenshot of Azure Monitor Logs action create.")](media/logs-export-logic-app/select-azure-monitor-connector.png#lightbox)

   1. Click **Azure Log Analytics – Run query and list results**.
   \
      [![Azure Monitor Logs is highlighted under Choose an action.](media/logs-export-logic-app/select-query-action-list.png "Screenshot of a new action being added to a step in the Logic App Designer.")](media/logs-export-logic-app/select-query-action-list.png#lightbox)
   
   2. Select the **Subscription** and **Resource Group** for your Log Analytics workspace. Select *Log Analytics Workspace* for the **Resource Type** and then select the workspace's name under **Resource Name**.

   3. Add the following log query to the **Query** window. 
   
        ```Kusto
        let dt = now();
        let year = datetime_part('year', dt);
        let month = datetime_part('month', dt);
        let day = datetime_part('day', dt);
        let hour = datetime_part('hour', dt);
        let startTime = make_datetime(year,month,day,hour,0)-1h;
        let endTime = startTime + 1h - 1tick;
        AzureActivity
        | where ingestion_time() between(startTime .. endTime)
        | project 
            TimeGenerated,
            BlobTime = startTime, 
            OperationName ,
            OperationNameValue ,
            Level ,
            ActivityStatus ,
            ResourceGroup ,
            SubscriptionId ,
            Category ,
            EventSubmissionTimestamp ,
            ClientIpAddress = parse_json(HTTPRequest).clientIpAddress ,
            ResourceId = _ResourceId 
        ```

   4. The **Time Range** specifies the records that will be included in the query based on the **TimeGenerated** column. This should be set to a value greater than the time range selected in the query. Since this query isn't using the **TimeGenerated** column, then **Set in query** option isn't available. See [Query scope](./scope.md) for more details about the time range.  Select **Last 4 hours** for the **Time Range**. This will ensure that any records with an ingestion time larger than **TimeGenerated** will be included in the results.
   \
   [![Screenshot of the settings for the new Azure Monitor Logs action named Run query and visualize results.](media/logs-export-logic-app/run-query-list-action.png "of the settings for the new Azure Monitor Logs action named Run query and visualize results.")](media/logs-export-logic-app/run-query-list-action.png#lightbox)

4. **Add Parse JSON activity (optional)**
    
    The output from the **Run query and list results** action is formatted in JSON. You can parse this data and manipulate it as part of the preparation for **Compose** action. 

    You can provide a JSON schema that describes the payload you expect to receive. The designer parses JSON content by using this schema and generates user-friendly tokens that represent the properties in your JSON content. You can then easily reference and use those properties throughout your Logic App's workflow.
    
    You can use a sample output from **Run query and list results** step. Click **Run Trigger** in Logic App ribbon, then **Run**, download and save an output record. For the sample query in previous stem, you can use the following sample output:

    ```json
    {
        "TimeGenerated": "2020-09-29T23:11:02.578Z",
        "BlobTime": "2020-09-29T23:00:00Z",
        "OperationName": "Returns Storage Account SAS Token",
        "OperationNameValue": "MICROSOFT.RESOURCES/DEPLOYMENTS/WRITE",
        "Level": "Informational",
        "ActivityStatus": "Started",
        "ResourceGroup": "monitoring",
        "SubscriptionId": "00000000-0000-0000-0000-000000000000",
        "Category": "Administrative",
        "EventSubmissionTimestamp": "2020-09-29T23:11:02Z",
        "ClientIpAddress": "192.168.1.100",
        "ResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/monitoring/providers/microsoft.storage/storageaccounts/my-storage-account"
    }
    ```

   1. Click **+ New step**, and then click **+ Add an action**. Under **Choose an action**, type **json** and then select **Parse JSON**.
   \
   [![Select Parse JSON operator](media/logs-export-logic-app/select-parse-json.png "Screenshot of Parse JSON operator.")](media/logs-export-logic-app/select-parse-json.png#lightbox)

   1. Click in the **Content** box to display a list of values from previous activities. Select **Body** from the **Run query and list results** action. This is the output from the log query.
   \
   [![Select Body](media/logs-export-logic-app/select-body.png "Screenshot of Par JSON Content setting with output Body from previous step.")](media/logs-export-logic-app/select-body.png#lightbox)

   1. Copy the sample record saved earlier, click **Use sample payload to generate schema** and paste.
\
   [![Parse JSON payload](media/logs-export-logic-app/parse-json-payload.png "Screenshot of Parse JSON schema.")](media/logs-export-logic-app/parse-json-payload.png#lightbox)

5. **Add the Compose action**
   
    The **Compose** action takes the parsed JSON output and creates the object that you need to store in the blob.

   1. Click **+ New step**, and then click **+ Add an action**. Under **Choose an action**, type **compose** and then select the **Compose** action.
   \
   [![Select Compose action](media/logs-export-logic-app/select-compose.png "Screenshot of Compose action.")](media/logs-export-logic-app/select-compose.png#lightbox)

   1. Click the **Inputs** box display a list of values from previous activities. Select **Body** from the **Parse JSON** action. This is the parsed output from the log query.
   \
   [![Select body for Compose action](media/logs-export-logic-app/select-body-compose.png "Screenshot of body for Compose action.")](media/logs-export-logic-app/select-body-compose.png#lightbox)

6. **Add the Create Blob action**
   
    The Create Blob action writes the composed JSON to storage.

   1. Click **+ New step**, and then click **+ Add an action**. Under **Choose an action**, type **blob** and then select the **Create Blob** action.
   \
   [![Select Create blob](media/logs-export-logic-app/select-create-blob.png "Screenshot of blob storage action create.")](media/logs-export-logic-app/select-create-blob.png#lightbox)

   1. Type a name for the connection to your Storage Account in **Connection Name** and then click the folder icon in the **Folder path** box to select the container in your Storage Account. Click the **Blob name** to see a list of values from previous activities. Click **Expression** and enter an expression that matches your time interval. For this query which is run hourly, the following expression sets the blob name per previous hour: 

        ```json
        subtractFromTime(formatDateTime(utcNow(),'yyyy-MM-ddTHH:00:00'), 1,'Hour')
        ```
        \
    [![Blob expression](media/logs-export-logic-app/blob-expression.png "Screenshot of blob action connection.")](media/logs-export-logic-app/blob-expression.png#lightbox)

   2. Click the **Blob content** box to display a list of values from previous activities and then select **Outputs** in the **Compose** section.
   \
   [![Create blob expression](media/logs-export-logic-app/create-blob.png "Screenshot of blob action output configuration.")](media/logs-export-logic-app/create-blob.png#lightbox)


7. **Test the Logic App**
   
    Test the workflow by clicking **Run**. If the workflow has errors, it will be indicated on the step with the problem. You can view the executions and drill in to each step to view the input and output to investigate failures. See [Troubleshoot and diagnose workflow failures in Azure Logic Apps](../../logic-apps/logic-apps-diagnosing-failures.md) if necessary.
    \
    [![Runs history](media/logs-export-logic-app/runs-history.png "Screenshot of trigger run history.")](media/logs-export-logic-app/runs-history.png#lightbox)


8. **View logs in Storage**
 
    Go to the **Storage accounts** menu in the Azure portal and select your Storage Account. Click the **Blobs** tile and select the container you specified in the Create blob action. Select one of the blobs and then **Edit blob**.
    \
    [![Blob data](media/logs-export-logic-app/blob-data.png "Screenshot of sample data exported to blob.")](media/logs-export-logic-app/blob-data.png#lightbox)

## Next steps

- Learn more about [log queries in Azure Monitor](./log-query-overview.md).
- Learn more about [Logic Apps](../../logic-apps/index.yml)
- Learn more about [Power Automate](https://flow.microsoft.com).
