---
title: Create a codeless connector for Microsoft Sentinel
description: Learn how to create a codeless connector in Microsoft Sentinel using the Codeless Connector Platform (CCP).
author: austinmccollum
ms.author: austinmc
ms.topic: how-to
ms.date: 10/19/2023
---
# Create a codeless connector for Microsoft Sentinel (Public preview)

The Codeless Connector Platform (CCP) provides partners, advanced users, and developers the ability to create custom connectors for ingesting data to Microsoft Sentinel.

Connectors created using the CCP are fully SaaS, with no requirements for service installations. They also include [health monitoring](monitor-data-connector-health.md) and full support from Microsoft Sentinel.

> [!IMPORTANT]
> The Codeless Connector Platform (CCP) is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

**Use the following steps to create your CCP connector and connect your data source from Microsoft Sentinel**

> [!div class="checklist"]
> * Build the data connector
> * Create the solution deployment template
> * Deploy the solution
> * Connect Microsoft Sentinel to your data source and start ingesting data

This article will show you how to complete each step and provide an [example codeless connector](#example) to build along the way.

## How is this CCP different from the previous version?

The initial version of the CCP was [announced](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/the-codeless-connector-platform/ba-p/3095455) in January of 2022. Since then, we've improved upon the platform and the [previous release](create-codeless-connector-legacy.md) is now deprecated. Reference this new article for the most recent version of the CCP which has these key improvements:

1. Better support for various authentication and pagination types.
1. The user interface and connection configuration portions of the codeless connector are separate now. This allows the creation of connectors with multiple connections which wasn't possible previously.

## Prerequisites

Before building a connector, understand your data source and how Microsoft Sentinel needs to connect.

1. Data Collection Endpoint (DCE)
   
   The Data Collection Rule (DCR) you create for your connector needs a DCE. For more information on how to create one or whether you need a new one, see [Data collection endpoints in Azure Monitor](../azure-monitor/essentials/data-collection-endpoint-overview.md).

1. Schema of the output table(s).  

   It's important to understand the shape of your data stream and the fields you want to include in the output table. Reference your data source documentation or analyze sufficient output examples.

Research the following components and verify support for them in the [Data Connector API reference](restapipoller-data-connector-reference.md):

1. HTTP request and response structure to the data source
1. Authentication required by the data source. For example, if your data source requires a token signed with a certificate, the data connector API reference specifies cert authentication isn't supported. 
1. Pagination options to the data source

We also recommend a tool like Postman to validate the data connector components. For more information, see [Use Postman with the Microsoft Graph API](/graph/use-postman).

## Build the data connector

There are 4 components you must build for the CCP data connector.

1. [Output table definition](#output-table-definition)
1. [Data Collection Rule (DCR)](#data-collection-rule)
1. [Data connector user interface](#data-connector-user-interface)
1. [Data connector connection rules](#data-connection-rules)

### Output table definition

>[!TIP]
>Skip this step if your data is only ingested to standard Log Analytics tables. Examples of standard tables include *CommonSecurityLog* and *ASimDnsActivityLogs*. For more information about the full list of supported standard data types, see [Data transformation support for custom data connectors](data-transformation.md#data-ingestion-flow-in-microsoft-sentinel).

If your data source doesn't conform to the schema of a standard table, you have two options:

1. create a custom table for all the data
1. create a custom table for some data and split conforming data out to a standard table

Use the Log Analytics UI for a straight forward method to create a custom table together with a DCR. For more information, see [Create a custom table](../azure-monitor/logs/create-custom-table.md#create-a-custom-table).

For more information on splitting your data to more than one table, see the [example section](#example-custom-table).

### Data collection rule 

Reference the latest information on DCRs in these articles:
- [Data collection rules overview](../azure-monitor/essentials/data-collection-rule-overview.md)
- [Structure of a data collections rule](../azure-monitor//essentials/data-collection-rule-structure.md)

For a tutorial demonstrating the creation of a DCE, including using sample data to create the custom table and DCR, see [Tutorial: Send data to Azure Monitor Logs with Logs ingestion API (Azure portal)](../azure-monitor/logs/tutorial-logs-ingestion-portal.md). Use the process in this tutorial to verify data is ingested correctly to your table with your DCR.

To understand how to create a complex DCR with multiple data flows, see the [example section](#example-data-collection-rule).

### Data connector user interface

The data connector user interface uses the [**Data Connector Definition**](/rest/api/securityinsights/preview/data-connector-definitions/create-or-update) API to configure the elements Microsoft Sentinel users experience when viewing the CCP data connector. Build this resource with the [Data connector definitions reference](connectorUIConfig-supplemental-reference.md).

Notes: 
1)	The `kind` property for API polling connector should always be `Customizable`.
2)	Since this is a type of API polling connector, set the `connectivityCriteria` type to `hasDataConnectors`
3)	The example `instructionsSteps` include a button of type `ConnectionToggleButton`. This button helps trigger the deployment of data connector rules based on the connection parameters specified.

Use Postman to call the data connector definitions API to create the data connector UI in order to validate it in the data connectors gallery.

To learn from an example, see the [Data connector definitions reference example section](connectorUIConfig-supplemental-reference.md#example-data-connector-definition).

### Data connection rules

This portion defines the connection rules including:
- polling
- authentication
- paging

For more information on building this section, see the [Data connector connection rules reference](restapipoller-data-connector-reference.md).

To learn from an example, see the [Data connector connection rules reference example](restapipoller-data-connector-reference.md#example-ccp-data-connector).

Use Postman to call the data connector API to create the data connector which combines the connection rules and previous components. Verify the connector is now connected in the UI.

## Create the solution deployment template

Manually package the deployment using the [example template](#example-deployment-solution-template) as your guide.

## Deploy the solution

Deploy your codeless connector solution as a custom template. 

>[!TIP]
>Delete resources you created in previous steps. The DCR and custom table is created with the deployment. If you don't remove those resources before deploying, it is more difficult to verify your template.

1. Copy the contents of the [solution deployment template](#create-the-solution-deployment-template).
1. Follow the **Edit and deploy the template** instructions from the article, [Quickstart: Create and deploy ARM templates by using the Azure portal](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md#edit-and-deploy-the-template).

## Verify the codeless connector

View your codeless connector in the data connector gallery. Open the data connector and complete any authentication parameters required to connect. Once successfully connected, the DCR and custom tables are created. View the DCR resource in your resource group and any custom tables from the logs analytics workspace.

## Example

Each step in building the codeless connector is represented in the following example sections. 

- [Example data](#example-data)
- [Example custom table](#example-custom-table)
- [Example data collection rule](#example-data-collection-rule)
- [Example data connector UI definition](connectorUIConfig-supplemental-reference.md#example-data-connector-definition)
- [Example data connection rules](restapipoller-data-connector-reference.md#example-ccp-data-connector)
- [Use example data with example template](#example-deployment-solution-template)

To demonstrate a complex data source with ingestion to more than one table, this example features an output table schema and a DCR with multiple output streams. The DCR example puts these together along with its KQL transforms. The data connector UI definition and connection rules examples continue from this same example data source. Finally, the solution template uses all these example components to show end to end how to create the example CCP data connector.

### Example data

A data source returns the following JSON when connecting to its endpoint.

```json
[
        {
        "ts": "3/6/2023 8:15:15 AM",
        "eventType": "Alert",
        "deviceMac": "bc:27:c6:21:1c:70",
        "clientMac": "",
        "srcIp": "10.12.11.106",
        "destIp": "121.93.178.13",
        "protocol": "tcp/ip",
        "priority": "0",
        "message": "This is an alert message"
        },
        {
        "ts": "3/6/2023 8:14:54 AM",
        "eventType": "File",
        "srcIp": "178.175.128.249",
        "destIp": "234.113.125.105",
        "fileType": "MS_EXE",
        "fileSizeBytes": 193688,
        "disposition": "Malicious"
        }
]
```

This response contains `eventType` of **Alert** and **File**. The file events are to be ingested into the normalized standard table, **AsimFileEventLogs**, while the alert events are to be ingested into a custom table.

### Example custom table

For more information on the structure of this table, see [Tables API](/rest/api/loganalytics/tables/create-or-update).

```json
{
"properties": {
    "schema": {
        "name": "ExampleConnectorAlerts_CL",
        "columns": [
        {
          "name": "TimeGenerated",
          "type": "datetime"
        },
        {
          "name": "SourceIP",
          "type": "string"
        },
        {
          "name": "DestIP",
          "type": "string"
        },
        {
          "name": "Message",
          "type": "string"
        },
        {
          "name": "Priority",
          "type": "int"
        }
        ]
      }
    }
}
```

### Example data collection rule

The following DCR defines a single stream `{{Custom-ExampleConnectorInput}}` using the example data source and transforms the output into two tables.

1. The first dataflow directs `eventType` = **Alert** to the custom `ExampleConnectorAlerts_CL` table.
1. the second dataflow directs `eventType` = **File** to the normalized standard table,`ASimFileEventLogs`.

For more information on the structure of this example, see [Data collection rules - custom logs](../azure-monitor/essentials/data-collection-rule-structure.md#custom-logs).

To create this connector in a test environment, follow the [Data Collection Rules API](/rest/api/monitor/data-collection-rules/create). Elements of the example in `{{double curly braces}}` indicate variables.

```json
{
  "location": "{{location}}",
  "properties": {
    "dataCollectionEndpointId": "/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroupName}}/providers/Microsoft.Insights/dataCollectionEndpoints/{{dataCollectionEndpointName}}",
    "streamDeclarations": {
      "Custom-ExampleConnectorInput": {
        "columns": [
          {
            "name": "ts",
            "type": "datetime"
          },
          {
            "name": "eventType",
            "type": "string"
          },
          {
            "name": "deviceMac",
            "type": "string"
          },
          {
            "name": "clientMac",
            "type": "string"
          },
          {
            "name": "srcIp",
            "type": "string"
          },
          {
            "name": "destIp",
            "type": "string"
          },
          {
            "name": "protocol",
            "type": "string"
          },
          {
            "name": "priority",
            "type": "string"
          },
          {
            "name": "message",
            "type": "string"
          },
          {
            "name": "fileType",
            "type": "string"
          },
          {
            "name": "fileSizeBytes",
            "type": "int"
          },
          {
            "name": "disposition",
            "type": "string"
          }
        ]
      }
    },
    "destinations": {
      "logAnalytics": [
        {
          "workspaceResourceId": "/subscriptions/{{subscriptionId}}/resourcegroups/{{resourceGroupName}}/providers/microsoft.operationalinsights/workspaces/{{workspaceName}}",
          "name": "{{uniqueFriendlyDestinationName}}"
        }
      ]
    },
    "dataFlows": [
      {
        "streams": [
          "Custom-ExampleConnectorInput"
        ],
        "destinations": [
          "{{uniqueFriendlyDestinationName}}"
        ],
        "transformKql": "source | where eventType == \"Alert\" | project TimeGenerated = ts, SourceIP = srcIp, DestIP = destIp, Message = message, Priority = priority \n",
        "outputStream": "Custom-ExampleConnectorAlerts_CL"
      },
      {
        "streams": [
          "Custom-ExampleConnectorInput"
        ],
        "destinations": [
          "{{uniqueFriendlyDestinationName}}"
        ],
        "transformKql": "source | where eventType == \"File\" | project-rename TimeGenerated = ts, EventOriginalType = eventType, SrcIpAddr = srcIp, DstIpAddr = destIp, FileContentType = fileType, FileSize = fileSizeBytes, EventOriginalSeverity = disposition \n",
        "outputStream": "Microsoft-ASimFileEventLogs"
      }
    ]
  }
}

```

### Example deployment solution template

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0", 
    "parameters": {
        "location": {
            "type": "string",
            "minLength": 1,
            "defaultValue": "[resourceGroup().location]",
            "metadata": {
                "description": "Not used, but needed to pass arm-ttk test `Location-Should-Not-Be-Hardcoded`.  We instead use the `workspace-location` which is derived from the LA workspace"
            }
        },
        "workspace-location": {
            "type": "string",
            "defaultValue": "",
            "metadata": {
                "description": "[concat('Region to deploy solution resources -- separate from location selection',parameters('location'))]"
            }
        },
        "subscription": {
            "defaultValue": "[last(split(subscription().id, '/'))]",
            "type": "string",
            "metadata": {
                "description": "subscription id where Microsoft Sentinel is setup"
            }
        },
        "resourceGroupName": {
            "defaultValue": "[resourceGroup().name]",
            "type": "string",
            "metadata": {
                "description": "resource group name where Microsoft Sentinel is setup"
            }
        },
        "workspace": {
            "defaultValue": "",
            "type": "string",
            "metadata": {
                "description": "Workspace name for Log Analytics where Microsoft Sentinel is setup"
            }
        }
    },
    "variables": {
        "workspaceResourceId": "[resourceId('microsoft.OperationalInsights/Workspaces', parameters('workspace'))]",
        "_solutionName": "Solution name", // Enter your solution name 
        "_solutionVersion": "3.0.0", // ??? What are the rules regarding the solution version. Is it always 3.0.0
        "_solutionAuthor": "Microsoft", // Enter the name of the author
        "_packageIcon": "icon icon icon icon", // Enter the solution icen (??? What are the options here?)
        "_solutionId": "azuresentinel.azure-sentinel-solution-azuresentinel.azure-sentinel-MySolution", //Enter the _solutionId (??? What should be the format?)
        "dataConnectorVersionConnectorDefinition": "1.0.0", //Is this a fixed value? (When does this change?
        "dataConnectorVersionConnections": "1.0.0", //Is this a fixed value? (When does this change?)
        "_solutionTier": "Microsoft", //Enter the solution tier (??? What are the options?)
        "_dataConnectorContentIdConnectorDefinition": "MySolutionTemplateConnectorDefinition", //Enter the _dataConnectorContentIdConnectorDefinition (??? What is this?) 
        "dataConnectorTemplateNameConnectorDefinition": "[concat(parameters('workspace'),'-dc-',uniquestring(variables('_dataConnectorContentIdConnectorDefinition')))]",
        "_dataConnectorContentIdConnections": "MySolutionTemplateConnections", //Enter the _dataConnectorContentIdConnections (??? What is this?) 
        "dataConnectorTemplateNameConnections": "[concat(parameters('workspace'),'-dc-',uniquestring(variables('_dataConnectorContentIdConnections')))]",
        "_logAnalyticsTableId1": "MyCustomTableName_CL" //Enter the custom table name (Not needed if you are ingesting data into standard tables)
		//Enter more variables as needed"":""
    },
    "resources": [
        {
            "type": "Microsoft.OperationalInsights/workspaces/providers/contentTemplates",
            "apiVersion": "2023-04-01-preview",
            "name": "[concat(parameters('workspace'),'/Microsoft.SecurityInsights/', variables('dataConnectorTemplateNameConnectorDefinition'), variables('dataConnectorVersionConnectorDefinition'))]",
            "location": "[parameters('workspace-location')]",
            "dependsOn": [
                "[extensionResourceId(resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspace')), 'Microsoft.SecurityInsights/contentPackages', variables('_solutionId'))]"
            ],
            "properties": {
                "contentId": "[variables('_dataConnectorContentIdConnectorDefinition')]",
                "displayName": "[concat(variables('_solutionName'), variables('dataConnectorTemplateNameConnectorDefinition'))]",
                "contentKind": "DataConnector",
                "mainTemplate": {
                    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
                    "contentVersion": "[variables('dataConnectorVersionConnectorDefinition')]",
                    "parameters": {
                        
                    },
                    "variables": {
                        
                    },
                    "resources": [
                        {
                            "name": "[concat(parameters('workspace'),'/Microsoft.SecurityInsights/',concat('DataConnector-', variables('_dataConnectorContentIdConnectorDefinition')))]",
                            "apiVersion": "2022-01-01-preview",
                            "type": "Microsoft.OperationalInsights/workspaces/providers/metadata",
                            "properties": {
                                "parentId": "[extensionResourceId(resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspace')), 'Microsoft.SecurityInsights/dataConnectorDefinitions', variables('_dataConnectorContentIdConnectorDefinition'))]",
                                "contentId": "[variables('_dataConnectorContentIdConnectorDefinition')]",
                                "kind": "DataConnector",
                                "version": "[variables('dataConnectorVersionConnectorDefinition')]",
                                "source": {
                                    "sourceId": "[variables('_solutionId')]",
                                    "name": "[variables('_solutionName')]",
                                    "kind": "Solution"
                                },
                                "author": {
                                    "name": "[variables('_solutionAuthor')]"
                                },
                                "support": {
                                    "name": "[variables('_solutionAuthor')]",
                                    "tier": "[variables('_solutionTier')]"
                                },
                                "dependencies": {
                                    "criteria": [
                                        {
                                            "version": "[variables('dataConnectorVersionConnections')]",
                                            "contentId": "[variables('_dataConnectorContentIdConnections')]",
                                            "kind": "ResourcesDataConnector"
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            "name": "[concat(parameters('workspace'),'/Microsoft.SecurityInsights/',variables('_dataConnectorContentIdConnectorDefinition'))]",
                            "apiVersion": "2022-09-01-preview",
                            "type": "Microsoft.OperationalInsights/workspaces/providers/dataConnectorDefinitions",
                            "location": "[parameters('workspace-location')]",
                            "kind": "Customizable",
                            "properties": {
                                //Enter your data connector definition properties here
								//For example
								//"connectorUiConfig": {
								//    "title": " Title (Preview)",
								//    "publisher": "Publisher",
								//	"descriptionMarkdown": "..."
								//	"graphQueriesTableName": "[variables('_logAnalyticsTableId1')]",
								//   "graphQueries": [
								//        {
								//            "metricName": "Total data received",
								//            "legend": "My Events",
								//           "baseQuery": "{{graphQueriesTableName}}"
								//        }
								//    ],
								//    "sampleQueries": [
								//        {
								//            "description": "Get Sample of events",
								//            "query": "{{graphQueriesTableName}}\n | take 10"
								//        },
								//        {
								//            "description": "Total Events by uuid",
								//            "query": "{{graphQueriesTableName}}\n | summarize count() by OriginalEventUid"
								//        }
								//    ],
								//    "dataTypes": [
								//        {
								//            "name": "{{graphQueriesTableName}}",
								//            "lastDataReceivedQuery": "{{graphQueriesTableName}}|summarize Time = max  (TimeGenerated)\n|where isnotempty(Time)"
								//        }
								//    ],
								//    "connectivityCriteria": [
								//        {
								//            "type": "HasDataConnectors"
								//        }
								//    ],
								//    "availability": {
								//        "isPreview": false
								//    },
								//    "permissions": {
								//        "resourceProvider": [
								//            {
								//                "provider": "Microsoft.OperationalInsights/workspaces",
								//                "permissionsDisplayText": "Read and Write permissions are required.",
								//                "providerDisplayName": "Workspace",
								//                "scope": "Workspace",
								//                "requiredPermissions": {
								//                    "write": true,
								//                    "read": true,
								//                    "delete": true
								//                }
								//            }
								//        ],
								//    },
								//    "instructionSteps": 
								//	[
								//        {
								//        }            
								//    ]   
                            }
                        },
                        {
                            "name": "MyDCRV1", //Enter your DCR name
                            "apiVersion": "2021-09-01-preview",
                            "type": "Microsoft.Insights/dataCollectionRules",
                            "location": "[parameters('workspace-location')]",
                            "kind": null,
                            "properties": 
							{
								//Enter your DCR properties here
								//For example
								//"streamDeclarations": {
                                //    "Custom-InputStream_CL": { 
                                //        "columns": [
                                //            {
                                //                "name": "uuid",
                                //                "type": "string"
                                //            },
                                //            {
                                //                "name": "published",
                           	    //                 "type": "datetime"
                                //            },
                                //         ]
                                //    }
                                //},
                                //"dataSources": {
                                //    
                                //},
                                //"destinations": {
                                //    "logAnalytics": [
                                //        {
                                //            "workspaceResourceId": "[variables('workspaceResourceId')]",
                                //            "workspaceId": "12312312312-1231-123123123123123",
                                //            "name": "clv2ws1"
                                //        }
                                //    ]
                                //},
                                //"dataFlows": [
                                //    {
                                //        "streams": [
                                //            "Custom-InputStream_CL" //Note this should be the same as the streamDeclarations property value
                                //        ],
                                //        "destinations": [
                                //            "clv2ws1"
                                //        ],
                                //        "transformKql": "source | where ... | project ...",
                                //        "outputStream": "Custom-TableName_CL"
                                //    }
                                //],
                                //"provisioningState": "Succeeded",
                                //"dataCollectionEndpointId": "[concat('/subscriptions/',parameters('subscription'),'/resourceGroups/',parameters('resourceGroupName'),'/providers/Microsoft.Insights/dataCollectionEndpoints/',parameters('workspace'))]"
							}
                        },
                        {
                            "name": "[variables('_logAnalyticsTableId1')]",
                            "apiVersion": "2021-03-01-privatepreview",
                            "type": "Microsoft.OperationalInsights/workspaces/tables",
                            "location": "[parameters('workspace-location')]",
                            "kind": null,
                            "properties": 
							{
								//Enter your log anlytics table properties here
								"totalRetentionInDays": 30,
                                "archiveRetentionInDays": 0,
                                "plan": "Analytics",
                                "lastPlanModifiedDate": "2023-06-08T15:01:07.6198976Z",
                                "retentionInDaysAsDefault": false,
                                "totalRetentionInDaysAsDefault": false,
                                "schema": {
                                    "tableSubType": "DataCollectionRuleBased",
                                    "name": "[variables('_logAnalyticsTableId1')]",
                                    "tableType": "CustomLog",
                                    "columns": [
                                        {
                                            "name": "Field1",
                                            "type": "string",
                                            "isDefaultDisplay": false,
                                            "isHidden": false
                                        },
                                        {
                                            "name": "Field2",
                                            "type": "string",
                                            "isDefaultDisplay": false,
                                            "isHidden": false
                                        }
                                    ],
                                    "standardColumns": [
                                        {
                                            "name": "TenantId",
                                            "type": "guid",
                                            "isDefaultDisplay": false,
                                            "isHidden": false
                                        }
                                    ],
                                    "solutions": [
                                        "LogManagement"
                                    ],
                                    "isTroubleshootingAllowed": true
                                }
							}			
                        }
						//Enter more tables if needed
                    ]
                },
                "packageKind": "Solution",
                "packageVersion": "[variables('_solutionVersion')]",
                "packageName": "[variables('_solutionName')]",
                "contentProductId": "[concat(substring(variables('_solutionId'), 0, 50),'-','dc','-', uniqueString(concat(variables('_solutionId'),'-','DataConnector','-',variables('_dataConnectorContentIdConnectorDefinition'),'-', variables('dataConnectorVersionConnectorDefinition'))))]",
                "packageId": "[variables('_solutionId')]",
                "contentSchemaVersion": "3.0.0",
                "version": "[variables('_solutionVersion')]"
            }
        },
        {
            "name": "[concat(parameters('workspace'),'/Microsoft.SecurityInsights/',variables('_dataConnectorContentIdConnectorDefinition'))]",
            "apiVersion": "2022-09-01-preview",
            "type": "Microsoft.OperationalInsights/workspaces/providers/dataConnectorDefinitions",
            "location": "[parameters('workspace-location')]",
            "kind": "Customizable",
            "properties": 
			{
				//Enter your data connector definition properties here
				//For example
				//"connectorUiConfig": {
                //    "title": " Title (Preview)",
                //    "publisher": "Publisher",
				//	"descriptionMarkdown": "..."
				//	"graphQueriesTableName": "[variables('_logAnalyticsTableId1')]",
                //   "graphQueries": [
                //        {
                //            "metricName": "Total data received",
                //            "legend": "My product Events",
                //           "baseQuery": "{{graphQueriesTableName}}"
                //        }
                //    ],
                //    "sampleQueries": [
                //        {
                //            "description": "Get Sample of events",
                //            "query": "{{graphQueriesTableName}}\n | take 10"
                //        },
                //        {
                //            "description": "Total Events by uuid",
                //            "query": "{{graphQueriesTableName}}\n | summarize count() by OriginalEventUid"
                //        }
                //    ],
                //    "dataTypes": [
                //        {
                //            "name": "{{graphQueriesTableName}}",
                //            "lastDataReceivedQuery": "{{graphQueriesTableName}}|summarize Time = max  (TimeGenerated)\n|where isnotempty(Time)"
                //        }
                //    ],
                //    "connectivityCriteria": [
                //        {
                //            "type": "HasDataConnectors"
                //        }
                //    ],
                //    "availability": {
                //        "isPreview": false
                //    },
                //    "permissions": {
                //        "resourceProvider": [
                //            {
                //                "provider": "Microsoft.OperationalInsights/workspaces",
                //                "permissionsDisplayText": "Read and Write permissions are required.",
                //                "providerDisplayName": "Workspace",
                //                "scope": "Workspace",
                //                "requiredPermissions": {
                //                    "write": true,
                //                    "read": true,
                //                    "delete": true
                //                }
                //            }
                //        ],
                //    },
                //    "instructionSteps": 
				//	[
                //        {
                //        }            
				//    ]   
			}
        },
        {
            "name": "[concat(parameters('workspace'),'/Microsoft.SecurityInsights/',concat('DataConnector-', variables('_dataConnectorContentIdConnectorDefinition')))]",
            "apiVersion": "2022-01-01-preview",
            "type": "Microsoft.OperationalInsights/workspaces/providers/metadata",
            "properties": {
                "parentId": "[extensionResourceId(resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspace')), 'Microsoft.SecurityInsights/dataConnectorDefinitions', variables('_dataConnectorContentIdConnectorDefinition'))]",
                "contentId": "[variables('_dataConnectorContentIdConnectorDefinition')]",
                "kind": "DataConnector",
                "version": "[variables('dataConnectorVersionConnectorDefinition')]",
                "source": {
                    "sourceId": "[variables('_solutionId')]",
                    "name": "[variables('_solutionName')]",
                    "kind": "Solution"
                },
                "author": {
                    "name": "[variables('_solutionAuthor')]"
                },
                "support": {
                    "name": "[variables('_solutionAuthor')]",
                    "tier": "[variables('_solutionTier')]"
                },
                "dependencies": {
                    "criteria": [
                        {
                            "version": "[variables('dataConnectorVersionConnections')]",
                            "contentId": "[variables('_dataConnectorContentIdConnections')]",
                            "kind": "ResourcesDataConnector"
                        }
                    ]
                }
            }
        },
        {
            "type": "Microsoft.OperationalInsights/workspaces/providers/contentTemplates",
            "apiVersion": "2023-04-01-preview",
            "name": "[concat(parameters('workspace'),'/Microsoft.SecurityInsights/', variables('dataConnectorTemplateNameConnections'), variables('dataConnectorVersionConnections'))]",
            "location": "[parameters('workspace-location')]",
            "dependsOn": [
                "[extensionResourceId(resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspace')), 'Microsoft.SecurityInsights/contentPackages', variables('_solutionId'))]"
            ],
            "properties": {
                "contentId": "[variables('_dataConnectorContentIdConnections')]",
                "displayName": "[concat(variables('_solutionName'), variables('dataConnectorTemplateNameConnections'))]",
                "contentKind": "ResourcesDataConnector",
                "mainTemplate": {
                    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
                    "contentVersion": "[variables('dataConnectorVersionConnections')]",
                    "parameters": 
					{
                        "connectorDefinitionName": {
                            "defaultValue": "connectorDefinitionName",
                            "type": "string",
                            "minLength": 1
                        },
                        "workspace": {
                            "defaultValue": "[parameters('workspace')]",
                            "type": "string"
                        },
                        "dcrConfig": {
                            "defaultValue": {
                                "dataCollectionEndpoint": "data collection Endpoint",
                                "dataCollectionRuleImmutableId": "data collection rule immutableId"
                            },
                            "type": "object"
                        }
						//Enter additional parameters that are used by the data connector (there parameters are mainly properties that the user enters in the UI when configuring the connector
						//For example:
						//"domainname": {
                        //    "defaultValue": "domain name",
                        //    "type": "string",
                        //    "minLength": 1
                        //},
                        //"apikey": {
                        //    "defaultValue": "API Key",
                        //    "type": "string",
                        //    "minLength": 1
                        //}
                    },
                    "variables": {
                        "_dataConnectorContentIdConnections": "[variables('_dataConnectorContentIdConnections')]"
                    },
                    "resources": [
                        {
                            "name": "[concat(parameters('workspace'),'/Microsoft.SecurityInsights/',concat('DataConnector-', variables('_dataConnectorContentIdConnections')))]",
                            "apiVersion": "2022-01-01-preview",
                            "type": "Microsoft.OperationalInsights/workspaces/providers/metadata",
                            "properties": {
                                "parentId": "[extensionResourceId(resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspace')), 'Microsoft.SecurityInsights/dataConnectors', variables('_dataConnectorContentIdConnections'))]",
                                "contentId": "[variables('_dataConnectorContentIdConnections')]",
                                "kind": "ResourcesDataConnector",
                                "version": "[variables('dataConnectorVersionConnections')]",
                                "source": {
                                    "sourceId": "[variables('_solutionId')]",
                                    "name": "[variables('_solutionName')]",
                                    "kind": "Solution"
                                },
                                "author": {
                                    "name": "[variables('_solutionAuthor')]"
                                },
                                "support": {
                                    "name": "[variables('_solutionAuthor')]",
                                    "tier": "[variables('_solutionTier')]"
                                }
                            }
                        },
                        {
                            "name": "[concat(parameters('workspace'),'/Microsoft.SecurityInsights/', 'MyDataConnector')]", //Replace the last part of the name with your data connector name (if you want to be able to create several connection using this template you need to make this name dynamic (e.g., by concatentanating GUID)
                            "apiVersion": "2022-12-01-preview",
                            "type": "Microsoft.OperationalInsights/workspaces/providers/dataConnectors",
                            "location": "[parameters('workspace-location')]",
                            "kind": "RestApiPoller",
                            "properties": 
							{
								// Enter your data connector properties here. If you want to use UI parameter use them in the following format "[[[paramters('paramName')]" (see example below)
								//Use parameters as needed. For example
								//For example:	
                                //"dataType": "My product security event API",
                                //"response": {
                                //   "eventsJsonPaths": [
                                //        "$"
                                //    ],
                                //    "format": "json"
                                //},
                                //"paging": {
                                //    "pagingType": "LinkHeader"
                                //},
                                //"connectorDefinitionName": "[[parameters('connectorDefinitionName')]",
                                //"auth": {
                                //   "apiKeyName": "Authorization",
                                //    "ApiKey": "[[parameters('apikey')]",
                                //    "apiKeyIdentifier": "SSWS",
                                //    "type": "APIKey"
                                //},
                                // "request": {
                                //   "apiEndpoint": "[[concat('https://',parameters('domainname'),'/api/v1/logs')]",
                                //    "rateLimitQPS": 10,
                                //   "queryWindowInMin": 5,
                                //   "httpMethod": "GET",
                                //    "retryCount": 3,
                                //    "timeoutInSeconds": 60,
                                //    "headers": {
                                //        "Accept": "application/json",
                                //        "User-Agent": "Scuba"
                                //    },
                                //    "startTimeAttributeName": "since",
								//    "endTimeAttributeName": "until"		     
                                //},
                                //"dcrConfig": {
                                //    "dataCollectionEndpoint": "[[parameters('dcrConfig').dataCollectionEndpoint]",
                                //    "dataCollectionRuleImmutableId": "[[parameters('dcrConfig').dataCollectionRuleImmutableId]",
                                //    "streamName": "Custom-InputStream_CL" //This input stream should be the same as the inputStream property configured for the DataCollectionRule 
                                //},
                                //"isActive": true
                            }
                        }
                    ]
                },
                "packageKind": "Solution",
                "packageVersion": "[variables('_solutionVersion')]",
                "packageName": "[variables('_solutionName')]",
                "contentProductId": "[concat(substring(variables('_solutionId'), 0, 50),'-','rdc','-', uniqueString(concat(variables('_solutionId'),'-','ResourcesDataConnector','-',variables('_dataConnectorContentIdConnections'),'-', variables('dataConnectorVersionConnections'))))]",
                "packageId": "[variables('_solutionId')]",
                "contentSchemaVersion": "3.0.0",
                "version": "[variables('_solutionVersion')]"
            }
        },
        {
            "type": "Microsoft.OperationalInsights/workspaces/providers/contentPackages",
            "name": "[concat(parameters('workspace'),'/Microsoft.SecurityInsights/', variables('_solutionId'))]",
            "location": "[parameters('workspace-location')]",
            "apiVersion": "2023-04-01-preview",
            "properties": {
                "version": "[variables('_solutionVersion')]",
                "kind": "Solution",
                "contentSchemaVersion": "3.0.0",
                "contentId": "[variables('_solutionId')]",
                "source": {
                    "kind": "Solution",
                    "name": "[variables('_solutionName')]",
                    "sourceId": "[variables('_solutionId')]"
                },
                "author": {
                    "name": "[variables('_solutionAuthor')]"
                },
                "support": {
                    "name": "[variables('_solutionAuthor')]"
                },
                "dependencies": {
                    "operator": "AND",
                    "criteria": [
                        {
                            "kind": "DataConnector",
                            "contentId": "[variables('dataConnectorVersionConnectorDefinition')]",
                            "version": "[variables('_dataConnectorContentIdConnectorDefinition')]"
                        }
                    ]
                },
                "firstPublishDate": "2022-06-24",
                "providers": [
                    "[variables('_solutionAuthor')]"
                ],
                "contentKind": "Solution",
                "packageId": "[variables('_solutionId')]",
                "contentProductId": "[concat(substring(variables('_solutionId'), 0, 50),'-','sl','-', uniqueString(concat(variables('_solutionId'),'-','Solution','-',variables('_solutionId'),'-', variables('_solutionVersion'))))]",
                "displayName": "[variables('_solutionName')]",
                "publisherDisplayName": "[variables('_solutionId')]",
                "descriptionHtml": "test",
                "icon": "[variables('_packageIcon')]"
            }
        }
    ]
}
```

## Next steps

For more information, see 
- [About Microsoft Sentinel solutions](sentinel-solutions.md).
- [Data connector ARM template reference](/azure/templates/microsoft.securityinsights/dataconnectors#dataconnectors-objects-1)
