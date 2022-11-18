---
title: Data collection transformations
description: Use transformations in a data collection rule in Azure Monitor to filter and modify incoming data.
ms.topic: conceptual
ms.date: 06/29/2022
ms.reviwer: nikeist

---

# Data collection transformations in Azure Monitor (preview)
Transformations in Azure Monitor allow you to filter or modify incoming data before it's sent to a Log Analytics workspace. This article provides a basic description of transformations and how they are implemented. It provides links to other content for actually creating a transformation.

## When to use transformations
Transformations are useful for a variety of scenarios, including those described below. 

**Reduce data costs**
Since you're charged ingestion cost for any data sent to a Log Analytics workspace, you want to filter out any data that you don't require to reduce your costs.

| Scenario | Details |
|:---|:---|
Remove entire rows | For example, you might have a diagnostic setting to collect resource logs from a particular resource but not require all of the log entries that it generates. Create a transformation that filters out records that match a certain criteria. |
| Remove a column from each row | For example, your data may include columns with data that's redundant or has minimal value. Create a transformation that filters out columns that aren't required. |
| Parse important data from a column | You may have a table with valuable data buried in a particular column. Use a transformation to parse the valuable data into a new column and remove the original. |


**Remove sensitive data**
You may have a data source that sends information you don't want stored for privacy or compliancy reasons.

| Scenario | Details |
|:---|:---|
| Filter sensitive information | Filter out entire rows or just particular columns that contain sensitive information. |
| Obfuscate sensitive information | For example, you might replace digits with a common character in an IP address or telephone number. |


**Enrich data with additional or calculated information**
Use a transformation to add information to data that provides business context or simplifies querying the data later.

- **Add a column with additional information.** For example, you might add a column identifying whether an IP address in another column is internal or external.

- **Add business specific information.** For example, you might add a column indicating a company division based on location information in other columns. 
Use a transformation to add information to data that provides business context or simplifies querying the data later.

| Scenario | Details |
|:---|:---|
| Add a column with additional information | For example, you might add a column identifying whether an IP address in another column is internal or external. |
| Add business specific information | For example, you might add a column indicating a company division based on location information in other columns. |


**Send data to multiple tables**
Using a transformation, you can send data from a single data input to multiple tables in a workspace.

| Scenario | Details |
|:---|:---|
| Store a normalized version of data together with the original | For example, you may want to parse Syslog messages into a custom table with a more readable format, but you need to retain the original syslog data for audit. |
| Separate full telemetry from filtered data | You may want to keep the full telemetry with very verbose detail for a short time period, but send as smaller set of the data to a separate table with longer data retention. | 
| Separate different dimensions of data according to security | You may have data with different dimensions that have different organizational security implications. You can send different records or columns of the data to different tables each with specific access levels. For example, AAD login data may go to one table with any user details anonymized for usage information, while data with full user information is sent to a table used by the security team. |


## Supported tables
Transformations may be applied to the following tables in a Log Analytics workspace. 

- Any Azure table listed in [Tables that support time transformations in Azure Monitor Logs (preview)](../logs/tables-feature-support.md)
- Any custom table


## How transformations work
Transformations are performed in Azure Monitor in the [data ingestion pipeline](../essentials/data-collection.md) after the data source delivers the data and before it's sent to the destination. The data source may perform its own filtering before sending data but then rely on the transformation for further manipulation for it's sent to the destination.

Transformations are defined in a [data collection rule (DCR)](data-collection-rule-overview.md) and use a [Kusto Query Language (KQL) statement](data-collection-transformations-structure.md) that is applied individually to each entry in the incoming data. It must understand the format of the incoming data and create output in the structure expected by the destination.

For example, a DCR that collects data from a virtual machine using Azure Monitor agent would specify particular data to collect from the client operating system. It could also include a transformation that would get applied to that data after it's sent to the data ingestion pipeline that further filters the data or adds a calculated column. This workflow is shown in the following diagram.

:::image type="content" source="media/data-collection-transformations/transformation-azure-monitor-agent.png" lightbox="media/data-collection-transformations/transformation-azure-monitor-agent.png" alt-text="Diagram of ingestion-time transformation for Azure Monitor agent." border="false":::

Another example is data sent from a custom application using the [logs ingestion API](../logs/logs-ingestion-api-overview.md). In this case, the application sends the data to a [data collection endpoint](data-collection-endpoint-overview.md) and specifies a data collection rule in the REST API call. The DCR includes the transformation and the destination workspace and table.

:::image type="content" source="media/data-collection-transformations/transformation-data-ingestion-api.png" lightbox="media/data-collection-transformations/transformation-data-ingestion-api.png" alt-text="Diagram of ingestion-time transformation for custom application using logs ingestion API." border="false":::

## Workspace transformation DCR
The workspace transformation DCR is a special DCR that's applied directly to a Log Analytics workspace. It includes default transformations for one more [supported tables](../logs/tables-feature-support.md). These transformations are applied to any data sent to these tables unless that data came from another DCR.

For example, if you create a transformation in the workspace transformation DCR for the `Event` table, it would be applied to events collected by virtual machines running the [Log Analytics agent](../agents/log-analytics-agent.md) since this agent doesn't use a DCR. The transformation would be ignored by any data sent from the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) though since it uses a DCR and would be expected to provide its own transformation.

A common use of the workspace transformation DCR is collection of [resource logs](resource-logs.md) which are configured with a [diagnostic setting](diagnostic-settings.md). This is shown in the example below. 

:::image type="content" source="media/data-collection-transformations/transformation-diagnostic-settings.png" lightbox="media/data-collection-transformations/transformation-diagnostic-settings.png" alt-text="Diagram of workspace transformation for resource logs configured with diagnostic settings." border="false":::

## Multiple destinations

Transformations allow you to send data to multiple tables in a Log Analytics workspace in a single DCR. For example, you may send data into Azure Monitor using the Logs ingestion API that should be separated between two different tables depending on particular criteria. You provide a KQL query for each destination, and the results of each query are sent to their corresponding tables. For example, you might want to send only information or audit events from a particular data source to a custom table configured for [basic logs]() to reduce your cost. Other events would be send to an [analytics table](). 

To use multiple destinations, you must currently either manually create a new DCR or edit an existing one. See the [Samples](#samples) section for examples of DCRs using multiple destinations.

> [!IMPORTANT]
> Currently, the tables in the DCR must be in the same Log Analytics workspace. To send to multiple workspaces from a single data source, use multiple DCRs.

:::image type="content" source="media/data-collection-transformations/transformation-multiple-destinations.png" lightbox="media/data-collection-transformations/transformation-multiple-destinations.png" alt-text="Diagram of transformation sending data to multiple tables." border="false":::



## Creating a transformation
There are multiple methods to create transformations depending on the data collection method. The following table lists guidance for different methods for creating transformations. 

| Type | Reference |
|:---|:---|
| Logs ingestion API with transformation | [Send data to Azure Monitor Logs using REST API (Azure portal)](../logs/tutorial-logs-ingestion-portal.md)<br>[Send data to Azure Monitor Logs using REST API (Resource Manager templates)](../logs/tutorial-logs-ingestion-api.md) |
| Transformation in workspace DCR | [Add workspace transformation to Azure Monitor Logs using the Azure portal (preview)](../logs/tutorial-workspace-transformations-portal.md)<br>[Add workspace transformation to Azure Monitor Logs using resource manager templates (preview)](../logs/tutorial-workspace-transformations-api.md) |
| Edit |  |



## Samples

### Single destination

The following example is a DCR for Azur Monitor agent that sends data to the `Syslog` table. In this example, the transformation filters the data for records with *error* in the message.

```json
{ 
    "location": "eastus", 
    "properties": { 
      "dataSources": { 
        "syslog": [ 
          { 
            "name": "sysLogsDataSource", 
            "streams": [ 
              "Microsoft-Syslog" 
            ], 
            "facilityNames": [ 
              "auth",
              "authpriv",
              "cron",
              "daemon",
              "mark",
              "kern",
              "mail",
              "news",
              "syslog",
              "user",
              "uucp"
            ], 
            "logLevels": [ 
              "Debug", 
              "Critical", 
              "Emergency" 
            ] 
          } 
        ] 
      }, 
      "destinations": { 
        "logAnalytics": [ 
          { 
            "workspaceResourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.OperationalInsights/workspaces/my-workspace", 
            "name": "centralWorkspace" 
          } 
        ] 
      }, 
      "dataFlows": [ 
        { 
          "streams": [ 
            "Microsoft-Syslog" 
          ], 
          "transformKql": "source | where message contains 'error'", 
          "destinations": [ 
            "centralWorkspace" 
          ] 
        } 
      ] 
    } 
} 
```

### Multiple Azure tables

The following example is a DCR for data from Logs Ingestion API that sends data to both the `Syslog` and `SecurityEvents` table. This requires a separate `dataFlow` for each with a different `transformKql` and `OutputStream` for each. In this example, all incoming data is sent to the `Syslog` table while malicious data is also sent to the `SecurityEvents` table. If you didn't want to replicate the malicious data in both tables, you could add a `where` statement to first query to remove those records.

```json
{ 
    "type": "Microsoft.Insights/dataCollectionRules", 
    "name": "multiDestinationDCR", 
    "location": "eastus", 
    "apiVersion": "2021-09-01-preview", 
    "properties": { 
        "dataCollectionEndpointId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers//Microsoft.Insights/dataCollectionEndpoints/my-dce",
        "streamDeclarations": { 
            "Custom-MyTableRawData": { 
                "columns": [ 
                    { 
                        "name": "Time", 
                        "type": "datetime" 
                    }, 
                    { 
                        "name": "Computer", 
                        "type": "string" 
                    }, 
                    { 
                        "name": "AdditionalContext", 
                        "type": "string" 
                    } 
                ] 
            } 
        }, 
        "destinations": { 
            "logAnalytics": [ 
                { 
                    "workspaceResourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.OperationalInsights/workspaces/my-workspace", 
                    "name": "clv2ws1" 
                }, 
            ] 
        }, 
        "dataFlows": [ 
            { 
                "streams": [ 
                    "Custom-MyTableRawData" 
                ], 
                "destinations": [ 
                    "clv2ws1" 
                ], 
                "transformKql": "source | project TimeGenerated = Time, Computer, Message = AdditionalContext", 
                "outputStream": "Microsoft-Syslog" 
            }, 
            { 
                "streams": [ 
                    "Custom-MyTableRawData" 
                ], 
                "destinations": [ 
                    "clv2ws1" 
                ], 
                "transformKql": "source | where (AdditionalContext contains 'malicious traffic!' | project TimeGenerated = Time, Computer, Subject = AdditionalContext", 
                "outputStream": "Microsoft-SecurityEvents" 
            } 
        ] 
    } 
} 
```

### Combination of Azure and custom tables

The following example is a DCR for data from Logs Ingestion API that sends data to both the `Syslog` table and a custom table with the data in a different format. This requires a separate `dataFlow` for each with a different `transformKql` and `OutputStream` for each. 


```json
{ 
    "type": "Microsoft.Insights/dataCollectionRules", 
    "name": "multiDestinationDCR", 
    "location": "eastus", 
    "apiVersion": "2021-09-01-preview", 
    "properties": { 
        "dataCollectionEndpointId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers//Microsoft.Insights/dataCollectionEndpoints/my-dce",
        "streamDeclarations": { 
            "Custom-MyTableRawData": { 
                "columns": [ 
                    { 
                        "name": "Time", 
                        "type": "datetime" 
                    }, 
                    { 
                        "name": "Computer", 
                        "type": "string" 
                    }, 
                    { 
                        "name": "AdditionalContext", 
                        "type": "string" 
                    } 
                ] 
            } 
        }, 
        "destinations": { 
            "logAnalytics": [ 
                { 
                    "workspaceResourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.OperationalInsights/workspaces/my-workspace", 
                    "name": "clv2ws1" 
                }, 
            ] 
        }, 
        "dataFlows": [ 
            { 
                "streams": [ 
                    "Custom-MyTableRawData" 
                ], 
                "destinations": [ 
                    "clv2ws1" 
                ], 
                "transformKql": "source | project TimeGenerated = Time, Computer, Message = AdditionalContext", 
                "outputStream": "Microsoft-Syslog" 
            }, 
            { 
                "streams": [ 
                    "Custom-MyTableRawData" 
                ], 
                "destinations": [ 
                    "clv2ws1" 
                ], 
                "transformKql": "source | extend jsonContext = parse_json(AdditionalContext) | project TimeGenerated = Time, Computer, AdditionalContext = jsonContext, ExtendedColumn=tostring(jsonContext.CounterName)", 
                "outputStream": "Custom-MyTable_CL" 
            } 
        ] 
    } 
} 
```



## Next steps

- [Create a data collection rule](../agents/data-collection-rule-azure-monitor-agent.md) and an association to it from a virtual machine using the Azure Monitor agent.
