---
title: Create a codeless connector for Microsoft Sentinel
description: Learn how to create a codeless connector in Microsoft Sentinel using the Codeless Connector Platform (CCP).
author: austinmccollum
ms.author: austinmc
ms.topic: how-to
ms.date: 03/06/2024
---
# Create a codeless connector for Microsoft Sentinel (Public preview)

The Codeless Connector Platform (CCP) provides partners, advanced users, and developers the ability to create custom connectors for ingesting data to Microsoft Sentinel.

Connectors created using the CCP are fully SaaS, with no requirements for service installations. They also include [health monitoring](monitor-data-connector-health.md) and full support from Microsoft Sentinel.

> [!IMPORTANT]
> The Codeless Connector Platform (CCP) is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

**Use the following steps to create your CCP connector and connect your data source to Microsoft Sentinel**

> [!div class="checklist"]
> * Build the data connector
> * Create the ARM template
> * Deploy the connector
> * Connect Microsoft Sentinel to your data source and start ingesting data

This article will show you how to complete each step and provide an [example codeless connector](#example) to build along the way.

## How is this CCP different from the previous version?

The initial version of the CCP was [announced](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/the-codeless-connector-platform/ba-p/3095455) in January of 2022. Since then, we've improved upon the platform and the [legacy release](create-codeless-connector-legacy.md) is no longer recommended. This new version of the CCP has the following key improvements:

1. Better support for various authentication and pagination types.

1. Supports standard data collection rules (DCRs).

1. The user interface and connection configuration portions of the codeless connector are separate now. This allows the creation of connectors with multiple connections which wasn't possible previously.

## Prerequisites

Before building a connector, understand your data source and how Microsoft Sentinel needs to connect.

1. Data Collection Endpoint (DCE)
   
   A DCE is a requirement for a DCR. Only one DCE is created per log analytics workspace DCR deployment. Every DCR deployed for a Microsoft Sentinel workspace uses the same DCE. For more information on how to create one or whether you need a new one, see [Data collection endpoints in Azure Monitor](../azure-monitor/essentials/data-collection-endpoint-overview.md).

1. Schema of the output table(s).  

   It's important to understand the shape of your data stream and the fields you want to include in the output table. Reference your data source documentation or analyze sufficient output examples.

Research the following components and verify support for them in the [Data Connector API reference](data-connector-connection-rules-reference.md):

1. HTTP request and response structure to the data source

1. Authentication required by the data source.<br>For example, if your data source requires a token signed with a certificate, the data connector API reference specifies cert authentication isn't supported. 

1. Pagination options to the data source

We also recommend a tool like Postman to validate the data connector components. For more information, see [Use Postman with the Microsoft Graph API](/graph/use-postman).

## Build the data connector

There are 4 components required to build the CCP data connector.

1. [Output table definition](#output-table-definition)
1. [Data Collection Rule (DCR)](#data-collection-rule)
1. [Data connector user interface](#data-connector-user-interface)
1. [Data connector connection rules](#data-connection-rules)

Each component has a section detailing the process to create and validate. Take the JSON from each component for the final packaging of the ARM template.

### Output table definition

>[!TIP]
>Skip this step if your data is only ingested to standard Log Analytics tables. Examples of standard tables include *CommonSecurityLog* and *ASimDnsActivityLogs*. For more information about the full list of supported standard data types, see [Data transformation support for custom data connectors](data-transformation.md#data-ingestion-flow-in-microsoft-sentinel).

If your data source doesn't conform to the schema of a standard table, you have two options:

- Create a custom table for all the data
- Create a custom table for some data and split conforming data out to a standard table

Use the Log Analytics UI for a straight forward method to create a custom table together with a DCR. If you create the custom table using the [Tables API](/rest/api/loganalytics/tables/create-or-update) or another programmatic method, add the `_CL` suffix manually to the table name. For more information, see [Create a custom table](../azure-monitor/logs/create-custom-table.md#create-a-custom-table).

For more information on splitting your data to more than one table, see the [example data](#example-data) and the [example custom table](#example-custom-table) created for that data.

### Data collection rule 

Data collection rules (DCRs) define the data collection process in Azure Monitor. DCRs specify what data should be collected, how to transform that data, and where to send that data. 

- There is only one DCR that gets deployed per data connector.
- A DCR must have a corresponding DCE in the same region.
- When the CCP data connector is deployed, the DCR is created if it doesn't already exist.

Reference the latest information on DCRs in these articles:
- [Data collection rules overview](../azure-monitor/essentials/data-collection-rule-overview.md)
- [Structure of a data collections rule](../azure-monitor//essentials/data-collection-rule-structure.md)

For a tutorial demonstrating the creation of a DCE, including using sample data to create the custom table and DCR, see [Tutorial: Send data to Azure Monitor Logs with Logs ingestion API (Azure portal)](../azure-monitor/logs/tutorial-logs-ingestion-portal.md). Use the process in this tutorial to verify data is ingested correctly to your table with your DCR.

To understand how to create a complex DCR with multiple data flows, see the [DCR example section](#example-data-collection-rule).

### Data connector user interface

This component renders the UI for the data connector in the Microsoft Sentinel data connector gallery. Each data connector may have only one UI definition. 

Build the data connector user interface with the [**Data Connector Definition** API](/rest/api/securityinsights/data-connector-definitions). Use the [Data connector definitions reference](data-connector-ui-definitions-reference.md) as a supplement to explain the API elements in greater detail.

Notes: 
1)	The `kind` property for API polling connector should always be `Customizable`.
2)	Since this is a type of API polling connector, set the `connectivityCriteria` type to `hasDataConnectors`
3)	The example `instructionsSteps` include a button of type `ConnectionToggleButton`. This button helps trigger the deployment of data connector rules based on the connection parameters specified.

Use Postman to call the data connector definitions API to create the data connector UI in order to validate it in the data connectors gallery.

To learn from an example, see the [Data connector definitions reference example section](data-connector-ui-definitions-reference.md#example-data-connector-definition).

### Data connection rules

This portion defines the connection rules including:
- polling
- authentication
- paging

For more information on building this section, see the [Data connector connection rules reference](data-connector-connection-rules-reference.md).

To learn from an example, see the [Data connector connection rules reference example](data-connector-connection-rules-reference.md#example-ccp-data-connector).

Use Postman to call the data connector API to create the data connector which combines the connection rules and previous components. Verify the connector is now connected in the UI.

## Secure confidential input

Whatever authentication is used by your CCP data connector, take these steps to ensure confidential information is kept secure. The goal is to pass along credentials from the ARM template to the CCP without leaving readable confidential objects in your deployments history.

### Create label

The data connector definition creates a UI element to prompt for security credentials. For example, if your data connector authenticates to a log source with OAuth, your data connector definition section includes the `OAuthForm` type in the instructions. This sets up the ARM template to prompt for the credentials.  

```json
"instructions": [
    {
        "type": "OAuthForm",
        "parameters": {
        "UsernameLabel": "Username",
        "PasswordLabel": "Password",
        "connectButtonLabel": "Connect",
        "disconnectButtonLabel": "Disconnect"
        }
    }
],
```

### Store confidential input

A section of the ARM deployment template provides a place for the administrator deploying the data connector to enter the password. Use `securestring` to keep the confidential information secured in an object that isn't readable after deployment. For more information, see [Security recommendations for parameters](../azure-resource-manager/templates/best-practices.md#security-recommendations-for-parameters).

```json
"mainTemplate": {
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "[variables('dataConnectorCCPVersion')]",
    "parameters": {
        "Username": {
            "type": "securestring",
            "minLength": 1,
            "metadata": {
                "description": "Enter the username to connect to your data source."
        },
        "Password": {
            "type": "securestring",
            "minLength": 1,
            "metadata": {
                "description": "Enter the API key, client secret or password required to connect."
            }
        },
    // more deployment template information
    }
}
```

### Use the securestring objects

Finally, the CCP utilizes the credential objects in the data connector section. 

```json
"auth": {
    "type": "OAuth2",
    "ClientSecret": "[[parameters('Password')]",
    "ClientId": "[[parameters('Username')]",
    "GrantType": "client_credentials",
    "TokenEndpoint": "https://api.contoso.com/oauth/token",
    "TokenEndpointHeaders": {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    "TokenEndpointQueryParameters": {
        "grant_type": "client_credentials"
    }
},
```

>[!Note]
> The strange syntax for the credential object, `"ClientSecret": "[[parameters('Password')]",` isn't a typo! 
> In order to create the deployment template which also uses parameters, you need to escape the parameters in that section with an extra starting`[`. This allows the parameters to assign a value based on the user interaction with the connector.
>
> For more information, see [Template expressions escape characters](../azure-resource-manager/templates/template-expressions.md#escape-characters).
  

## Create the deployment template

Manually package an Azure Resource Management (ARM) template using the [example template](#example-arm-template) as your guide.

In addition to the example template, published solutions available in the Microsoft Sentinel content hub use the CCP for their data connector. Review the following solutions as more examples of how to stitch the components together into an ARM template.

- [Ermes Browser Security](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Ermes%20Browser%20Security/Package/mainTemplate.json)
- [Palo Alto Prisma Cloud CWPP](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Ermes%20Browser%20Security/Package/mainTemplate.json)

## Deploy the connector

Deploy your codeless connector as a custom template. 

>[!TIP]
>Delete resources you created in previous steps. The DCR and custom table is created with the deployment. If you don't remove those resources before deploying, it's more difficult to verify your template.

1. Copy the contents of the ARM [deployment template](#create-the-deployment-template).
1. Follow the **Edit and deploy the template** instructions from the article, [Quickstart: Create and deploy ARM templates by using the Azure portal](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md#edit-and-deploy-the-template).

### Maintain network isolation for logging source

If your logging source requires network isolation, configure an allowlist of public IP addresses used by the CCP.

Azure virtual networks use service tags to define network access controls. For the CCP, that service tag is [**Scuba**](/azure/virtual-network/service-tags-overview#available-service-tags).

To find the current IP range associated with the **Scuba** service tag, see [Use the Service Tag Discovery API](/azure/virtual-network/service-tags-overview#use-the-service-tag-discovery-api).

## Verify the codeless connector

View your codeless connector in the data connector gallery. Open the data connector and complete any authentication parameters required to connect. Once successfully connected, the DCR and custom tables are created. View the DCR resource in your resource group and any custom tables from the logs analytics workspace.

>[!NOTE]
>It may take up to 30 minutes to see data begin ingesting.


## Example

Each step in building the codeless connector is represented in the following example sections. 

- [Example data](#example-data)
- [Example custom table](#example-custom-table)
- [Example data collection rule](#example-data-collection-rule)
- [Example data connector UI definition](data-connector-ui-definitions-reference.md#example-data-connector-definition)
- [Example data connection rules](data-connector-connection-rules-reference.md#example-ccp-data-connector)
- [Use example data with example template](#example-arm-template)

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

For more information on the structure of this table, see [Tables API](/rest/api/loganalytics/tables/create-or-update). Custom log table names should have a `_CL` suffix.

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

The following DCR defines a single stream `Custom-ExampleConnectorInput` using the example data source and transforms the output into two tables.

1. The first dataflow directs `eventType` = **Alert** to the custom `ExampleConnectorAlerts_CL` table.
1. the second dataflow directs `eventType` = **File** to the normalized standard table,`ASimFileEventLogs`.

For more information on the structure of this example, see [Structure of a data collection rule](../azure-monitor/essentials/data-collection-rule-structure.md).

To create this DCR in a test environment, follow the [Data Collection Rules API](/rest/api/monitor/data-collection-rules/create). Elements of the example in `{{double curly braces}}` indicate variables that require values with ease of use for Postman. When you create this resource in the ARM template, the variables expressed here are exchanged for parameters.

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

### Example data connector UI definition

This example is located in the [Data connector definitions reference](data-connector-ui-definitions-reference.md#example-data-connector-definition).

### Example data connector connection rules

This example is located in the [Data connectors reference](data-connector-connection-rules-reference.md#example-ccp-data-connector).

### Example ARM template

Build the ARM deployment template with the following structure, which includes the 4 sections of JSON components required to build the CCP data connector:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {},
    "variables": {},
    "resources": [],
}
```

Stitch the sections together with a JSON-aware editor like Visual Code to minimize syntax errors like commas and closing brackets and parentheses.

To guide the template building process, comments appear in the **metadata** `description` or inline with `//` comment notation. For more information, see [ARM template best practices - comments](../azure-resource-manager/templates/best-practices.md#comments).

Consider using the ARM template test toolkit (arm-ttk) to validate the template you build. For more information, see [arm-ttk](../azure-resource-manager/templates/test-toolkit.md).

#### Example ARM template - parameters

For more information, see [Parameters in ARM templates](../azure-resource-manager/templates/parameters.md).

>[!Warning]
> Use `securestring` for all passwords and secrets in objects readable after resource deployment.
> For more information, see [Secure confidential input](#secure-confidential-input) and [Security recommendations for parameters](../azure-resource-manager/templates/best-practices.md#security-recommendations-for-parameters).


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
                "description": "Not used, but needed to pass the arm-ttk test, 'Location-Should-Not-Be-Hardcoded'. Instead the `workspace-location` derived from the log analytics workspace is used."
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
                "description": "subscription id where Microsoft Sentinel is configured"
            }
        },
        "resourceGroupName": {
            "defaultValue": "[resourceGroup().name]",
            "type": "string",
            "metadata": {
                "description": "resource group name where Microsoft Sentinel is configured"
            }
        },
        "workspace": {
            "defaultValue": "",
            "type": "string",
            "metadata": {
                "description": "the log analytics workspace enabled for Microsoft Sentinel"
            }
        }
    },
    // Next is the variables section here
}
```

#### Example ARM template - variables

These recommended variables help simplify the template. Use more or less as needed. For more information, see [Variables in ARM templates](../azure-resource-manager/templates/variables.md).

```json
    "variables": {
        "workspaceResourceId": "[resourceId('microsoft.OperationalInsights/Workspaces', parameters('workspace'))]",
        "_solutionName": "Solution name", // Enter your solution name 
        "_solutionVersion": "3.0.0", // must be 3.0.0 or above
        "_solutionAuthor": "Contoso", // Enter the name of the author
        "_packageIcon": "<img src=\"{LogoLink}\" width=\"75px\" height=\"75px\">", // Enter the http link for the logo. NOTE: This field is only recommended for Azure Global Cloud.
        "_solutionId": "azuresentinel.azure-sentinel-solution-azuresentinel.azure-sentinel-MySolution", // Enter a name for your solution with this format but exchange the 'MySolution' portion
        "dataConnectorVersionConnectorDefinition": "1.0.0",
        "dataConnectorVersionConnections": "1.0.0",
        "_solutionTier": "Community", // This designates the appropriate support - all custom data connectors are "Community"
        "_dataConnectorContentIdConnectorDefinition": "MySolutionTemplateConnectorDefinition", // Enter a name for the connector
        "dataConnectorTemplateNameConnectorDefinition": "[concat(parameters('workspace'),'-dc-',uniquestring(variables('_dataConnectorContentIdConnectorDefinition')))]",
        "_dataConnectorContentIdConnections": "MySolutionTemplateConnections", // Enter a name for the connections this connector makes
        "dataConnectorTemplateNameConnections": "[concat(parameters('workspace'),'-dc-',uniquestring(variables('_dataConnectorContentIdConnections')))]",
        "_logAnalyticsTableId1": "ExampleConnectorAlerts_CL" // Enter the custom table name - not needed if you are ingesting data into standard tables
		// Enter more variables as needed "":""
    },
    // Next is the resources sections here
```
#### Example ARM template - resources

There are 5 ARM deployment resources in this template guide which house the 4 CCP data connector building components. 

1. **contentTemplates** (a parent resource)
    - metadata
    - dataCollectionRules - For more information, see [Data collection rule](#data-collection-rule).
    - tables - For more information, see [Output table definition](#output-table-definition).
1. **dataConnectorDefinitions** - For more information, see [Data connector user interface](#data-connector-user-interface).
1. **metadata**
1. **contentTemplates**
    - metadata
    - RestApiPoller - For more information, see [Data connection rules](#data-connection-rules).
1. **contentPackages**

```json
    "resources": [
        // resource section 1 - contentTemplates
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
                    "parameters": {},
                    "variables": {},
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
                            "name": "MyDCRV1", // Enter your DCR name
                            "apiVersion": "2021-09-01-preview",
                            "type": "Microsoft.Insights/dataCollectionRules",
                            "location": "[parameters('workspace-location')]",
                            "kind": null,
                            "properties": 
							{ 
                                // Enter your DCR properties here.
                                //  Consider using these variables:
                                //  "dataCollectionEndpointId": "[concat('/subscriptions/',parameters('subscription'),'/resourceGroups/',parameters('resourceGroupName'),'/providers/Microsoft.Insights/dataCollectionEndpoints/',parameters('workspace'))]",
                                //  "workspaceResourceId": "[variables('workspaceResourceId')]",
							}
                        },
                        {
                            "name": "[variables('_logAnalyticsTableId1')]",
                            "apiVersion": "2022-10-01",
                            "type": "Microsoft.OperationalInsights/workspaces/tables",
                            "location": "[parameters('workspace-location')]",
                            "kind": null,
                            "properties": 
							{
								// Enter your log analytics table schema here. 
                                //  Consider using this variable for the name property:
                                //  "name": "[variables('_logAnalyticsTableId1')]",
							}			
                        }
						// Enter more tables if needed.
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
        // resource 2 section here
```

```json
        // resource section 2 - dataConnectorDefinitions
        {
            "name": "[concat(parameters('workspace'),'/Microsoft.SecurityInsights/',variables('_dataConnectorContentIdConnectorDefinition'))]",
            "apiVersion": "2022-09-01-preview",
            "type": "Microsoft.OperationalInsights/workspaces/providers/dataConnectorDefinitions",
            "location": "[parameters('workspace-location')]",
            "kind": "Customizable",
            "properties": 
			{
				//Enter your data connector definition properties here
				//"connectorUiConfig": {
				//	"graphQueriesTableName": "[variables('_logAnalyticsTableId1')]",
                //}, 
			}
        },
        // resource 3 section here
```

```json
        // resource section 3 - metadata
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
        // resource 4 section here
```

```json
        // resource section 4 - contentTemplates
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
                    // These parameters are used by the data connector primarily as properties for the administrator to enter in the UI when configuring the connector
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
						// Enter additional parameters, for example:
						//"domainname": {
                        //    "defaultValue": "domain name",
                        //    "type": "string",
                        //    "minLength": 1
                        //},
                        //"apikey": {
                        //    "defaultValue": "",
                        //    "type": "securestring",
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
                            "name": "[concat(parameters('workspace'),'/Microsoft.SecurityInsights/', 'MyDataConnector')]", // Replace the last part of the name with your data connector name
                            //  To create several connections using this template, make the name dynamic. For example, use the 'concat' function to add the connector name with a GUID using the 'guid' function.
                            "apiVersion": "2022-12-01-preview",
                            "type": "Microsoft.OperationalInsights/workspaces/providers/dataConnectors",
                            "location": "[parameters('workspace-location')]",
                            "kind": "RestApiPoller",
                            "properties": 
							{
								// Enter your data connector properties here. If you want to use UI parameters remember to escape the parameter like this: "[[parameters('paramName')]"
								//  Use parameters as needed. For example:	
                                // "dataType": "My product security event API",
                                // "response": {
                                //   "eventsJsonPaths": [
                                //        "$"
                                //    ],
                                //    "format": "json"
                                // },
                                // "paging": {
                                //    "pagingType": "LinkHeader"
                                // },
                                // "connectorDefinitionName": "[[parameters('connectorDefinitionName')]",
                                // "auth": {
                                //   "apiKeyName": "Authorization",
                                //    "ApiKey": "[[parameters('apikey')]",
                                //    "apiKeyIdentifier": "SSWS",
                                //    "type": "APIKey"
                                //} ,
                                // "request": {
                                //   "apiEndpoint": "[[concat('https://',parameters('domainname'),'/api/v1/logs')]",
                                //    "rateLimitQPS": 10,
                                //   "queryWindowInMin": 5,
                                //   "httpMethod": "GET",
                                //    "retryCount": 3,
                                //    "timeoutInSeconds": 60,
                                //    "headers": {
                                //        "Accept": "application/json",
                                //        "User-Agent": "My-Data-Source"
                                //    },
                                //    "startTimeAttributeName": "since",
								//    "endTimeAttributeName": "until"		     
                                // },
                                // "dcrConfig": {
                                //    "dataCollectionEndpoint": "[[parameters('dcrConfig').dataCollectionEndpoint]",
                                //    "dataCollectionRuleImmutableId": "[[parameters('dcrConfig').dataCollectionRuleImmutableId]",
                                //    "streamName": "Custom-ExampleConnectorAlerts_CL" //This input stream should be the same as the inputStream property configured for the DataCollectionRule 
                                // },
                                // "isActive": true
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
        // resource 5 section here
```

```json
        // resource section 5 - contentPackages
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
                "firstPublishDate": "2023-12-05",
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
        // that's the end!
    ]
}
```

## Next steps

For more information, see 
- [About Microsoft Sentinel solutions](sentinel-solutions.md).
- [Data connector ARM template reference](/azure/templates/microsoft.securityinsights/dataconnectors#dataconnectors-objects-1)
