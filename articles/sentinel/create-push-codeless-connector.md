---
title: Microsoft Sentinel CCF push connectors (preview) - Getting started guide
description: Learn how to create and deploy push-based codeless connectors for Microsoft Sentinel that sends data in real-time.
author: EdB-MSFT
ms.service: microsoft-sentinel
ms.author: edbaynash
ms.topic: how-to
ms.date: 01/28/2026
# customer intent: As a security engineer or ISV partner, I want to understand how CCF Push connectors work and how to build one so I can send real-time data from my application to Microsoft Sentinel.
---

# Microsoft Sentinel CCF push connectors (preview) - Getting started guide

This guide helps you understand, build, and deploy push-based codeless connectors for Microsoft Sentinel using the Codeless Connector Framework (CCF) Push (preview).

## What is CCF push?

CCF Push connectors enable your applications to send security events directly to Microsoft Sentinel in real-time. Unlike traditional polling-based connectors that periodically fetch data from APIs, push connectors let you push data to Sentinel as events occur in your system.

CCF Push provides several key benefits:

- **Application-controlled data flow:** Your application controls when and how to send data, enabling intelligent batching strategies and optimized network usage.
- **Real-time ingestion:** Send data immediately as events happen, without waiting for polling intervals.
- **Simplified architecture:** No need to maintain API endpoints for Sentinel to poll.
- **Template-based provisioning:** Deployment creates ARM templates for DCRs, custom tables, Entra application registration, and client secrets - you receive the connection details to configure in your sending application.
- **Secure authentication:** Uses Microsoft Entra applications with OAuth 2.0 for secure data submission.

### Prerequisites

- Before you begin, you must have access to the Azure-Sentinel GitHub repository for packaging tools.
- Microsoft Entra permissions:
    - Permission to create an app registration in Microsoft Entra ID. Typically requires Entra ID Application Developer role or higher.
    - Permission to create an application with secrets. If you don't grant this permission, the connector fails due to security reasons.
    - The publisher must have the appropriate role to retrieve tokens from the Microsoft Entra application. These tokens are required for authenticating requests to the Data Collection Endpoint (DCE), which is the endpoint where the connector ultimately pushes its data. If the provider can't retrieve tokens, data can't be sent to the DCE.
- Microsoft Azure permissions:
    - Permission to assign Monitoring Metrics Publisher role on data collection rule (DCR). Typically requires Azure RBAC Owner or User Access Administrator role.


## How CCF push works


### The push model vs pull model

Understanding the difference between push and pull data ingestion models helps you choose the right connector type for your scenario.

**CCF pull connectors - Polling-based:**

In the pull model, Microsoft Sentinel periodically polls your API to retrieve data:

- Microsoft Sentinel initiates connections to your data source API on a configured schedule.
- Data arrives at regular polling intervals, such as every five minutes.
- You must maintain a publicly accessible API endpoint.
- Sentinel's polling infrastructure manages the data collection process.

**CCF push connectors - Event-driven:**

In the push model, your application sends data directly to Microsoft Sentinel:

- Your application initiates data submission when events occur.
- Data arrives in near real-time as events are generated.
- You don't need to maintain an API endpoint.
- Your application controls batching, timing, and data flow optimization.

### The push data flow

The CCF push data flow consists of five main steps:

1. You deploy the connector in Microsoft Sentinel.

1. Azure automatically creates the following resources:
    - Microsoft Entra application with credentials
    - Data Collection Rule (DCR) - defines how to process your data
    - Data Collection Endpoint (DCE) - the URL where you send data
    - Custom log table - where your data is stored
    - Role assignments - permissions for the Entra app

1. You receive the following connection details:
    - Tenant ID
    - Application (Client) ID
    - Client Secret
    - DCE URI (endpoint URL)
    - DCR Immutable ID
    - Stream Name

1. Your application sends the following data:
    - Gets an OAuth 2.0 token using the CCF generated Entra app credentials. For more information, see [OAuth 2.0 client credentials flow](/entra/identity-platform/v2-oauth2-client-creds-grant-flow)
    - Formats events as JSON matching your table schema
    - POSTs data to the DCE endpoint

1. Azure processes and stores data:
    - DCRs transforms the data (optional KQL transformations)
    - Data is written to the custom table in Log Analytics
    - The data is available for queries, analytics, and alerts in Sentinel


## CCF push artifacts

A CCF Push connector solution consists of four main components:
- Custom table definition
- Data collection rule (DCR)
- Connector definition (UI)
- Push Connector Configuration

### Custom table definition

**What it is:** The schema that defines the structure of your data in Log Analytics.

**Key requirements:**
- Table name must end with `_CL` (custom log suffix).
- Must include a `TimeGenerated` column (datetime type).
- Column types: string, int, long, real, bool, datetime, dynamic, guid.
- Use API version `2025-07-01` or later.
- For more information, see [Create a custom table in Azure Monitor Logs](/azure/azure-monitor/logs/create-custom-table).

**Example:**

```json
{
  "name": "ContosoSecurityAlerts_CL",
  "type": "Microsoft.OperationalInsights/workspaces/tables",
  "apiVersion": "2025-07-01",
  "properties": {
     "schema": {
        "name": "ContosoSecurityAlerts_CL",
        "columns": [
          {
             "name": "TimeGenerated",
             "type": "datetime"
          },
          {
             "name": "EventSeverity",
             "type": "string"
          },
          {
             "name": "EventType",
             "type": "string"
          },
          {
             "name": "UserName",
             "type": "string"
          },
          {
             "name": "SourceIP",
             "type": "string"
          },
          {
             "name": "DeviceId",
             "type": "string"
          },
          {
             "name": "AlertMessage",
             "type": "string"
          }
        ]
     }
  }
}
```


### Data collection rule (DCR)

**What it is:** Defines how Azure Monitor ingests and processes your data. For more information, see [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview).

**What it does:**
- Specifies the input stream name (what your app uses when sending data)
- Defines optional KQL transformations to shape and enrich data
- Routes data to the destination table
- Links to the Data Collection Endpoint (DCE)

**Key components:**
- `streamDeclarations`: Defines the structure of incoming data (must match what your app sends)
- `destinations`: Where the data goes (your Log Analytics workspace)
- `dataFlows`: The transformation pipeline from input stream to output table
- `dataCollectionEndpointId`: Links to the DCE for data ingestion

**Example:**

```json
{
  "name": "ContosoSecurityAlertsPushDCR",
  "apiVersion": "2021-09-01-preview",
  "type": "Microsoft.Insights/dataCollectionRules",
  "location": "[parameters('workspace-location')]",
  "properties": {
     "streamDeclarations": {
        "Custom-ContosoSecurityAlerts": {
          "columns": [
             {
                "name": "EventSeverity",
                "type": "string"
             },
             {
                "name": "EventType",
                "type": "string"
             },
             {
                "name": "UserName",
                "type": "string"
             },
             {
                "name": "SourceIP",
                "type": "string"
             },
             {
                "name": "DeviceId",
                "type": "string"
             },
             {
                "name": "AlertMessage",
                "type": "string"
             }
          ]
        }
     },
     "destinations": {
        "logAnalytics": [
          {
             "workspaceResourceId": "[variables('workspaceResourceId')]",
             "name": "clv2ws1"
          }
        ]
     },
     "dataFlows": [
        {
          "streams": [
             "Custom-ContosoSecurityAlerts"
          ],
          "destinations": [
             "clv2ws1"
          ],
          "transformKql": "source | extend TimeGenerated = now()",
          "outputStream": "Custom-ContosoSecurityAlerts_CL"
        }
     ],
     "dataCollectionEndpointId": "[concat('/subscriptions/',parameters('subscription'),'/resourceGroups/',parameters('resourceGroupName'),'/providers/Microsoft.Insights/dataCollectionEndpoints/',parameters('workspace'))]"
  }
}
```

> [!IMPORTANT]
> - Stream name must start with `Custom-` prefix.
> - The `transformKql` can be simply `"source"` for pass-through, or include KQL logic for data transformation.
> - `outputStream` must match your table name with `Custom-` prefix and `_CL` suffix.

### Connector definition (UI)

The connector definition controls how the connector appears in the Microsoft Sentinel data connector gallery. For more information, see [Data Connector Definitions API reference](/rest/api/securityinsights/data-connector-definitions).

The connector definition includes:

- Connector title, description, and branding
- Prerequisites and permissions required, such as workspace access and Entra permissions
- Instruction steps for deployment
- UI controls for displaying connection details to users

Key UI elements:
- `DeployPushConnectorButton`: Triggers automated resource deployment
- `CopyableLabel`: Displays connection details after deployment (uses `fillWith` parameter)
- `Markdown`: Provides formatted instructions and context
- `IsConnectedQuery`: Validates connector connectivity based on recent data

Example structure (abbreviated for clarity): 
```json 
{
    "name": "ContosoSecurityAlertsPush",
    "apiVersion": "2022-09-01-preview",
    "type": "Microsoft.SecurityInsights/dataConnectorDefinitions",
    "location": "[parameters('workspace-location')]",
    "kind": "Customizable",
    "properties": {
        "connectorUiConfig": {
            "id": "ContosoSecurityAlertsPush",
            "title": "Contoso Security Alerts (Push)",
            "publisher": "Contoso Corporation",
            "descriptionMarkdown": "The [Contoso Security Alerts](https://www.contoso.com/) connector provides the capability to push real-time security alerts from your Contoso application directly into Microsoft Sentinel using the Codeless Connector Framework (CCF) Push pattern. This connector ingests alert severity, event types, user information, and network details into a custom Log Analytics table for analysis, alerting, and visualization.",
            "graphQueries": [
                {
                    "metricName": "Security Alerts",
                    "legend": "ContosoSecurityAlerts_CL",
                    "baseQuery": "ContosoSecurityAlerts_CL"
                }
            ],
            "sampleQueries": [
                {
                    "description": "All security alerts",
                    "query": "ContosoSecurityAlerts_CL\n | sort by TimeGenerated desc"
                },
                {
                    "description": "Critical and High severity alerts",
                    "query": "ContosoSecurityAlerts_CL\n | where EventSeverity in ('Critical', 'High')\n | sort by TimeGenerated desc"
                }
            ],
            "dataTypes": [
                {
                    "name": "ContosoSecurityAlerts_CL",
                    "lastDataReceivedQuery": "ContosoSecurityAlerts_CL\n| summarize Time = max(TimeGenerated)\n| where isnotempty(Time)"
                }
            ],
            "connectivityCriteria": [
                {
                    "type": "IsConnectedQuery",
                    "value": [
                        "ContosoSecurityAlerts_CL\n| summarize LastLogReceived = max(TimeGenerated)\n| project IsConnected = LastLogReceived > ago(7d)"
                    ]
                }
            ],
            "availability": {
                "status": 1
            },
            "permissions": {
                "resourceProvider": [
                    {
                        "provider": "Microsoft.OperationalInsights/workspaces",
                        "permissionsDisplayText": "read and write permissions are required.",
                        "providerDisplayName": "Workspace",
                        "scope": "Workspace",
                        "requiredPermissions": {
                            "write": true,
                            "read": true,
                            "delete": true
                        }
                    }
                ],
                "customs": [
                    {
                        "name": "Microsoft Entra",
                        "description": "Permission to create an app registration in Microsoft Entra ID. Typically requires Entra ID Application Developer role or higher."
                    },
                    {
                        "name": "Microsoft Azure",
                        "description": "Permission to assign Monitoring Metrics Publisher role on data collection rule (DCR). Typically requires Azure RBAC Owner or User Access Administrator role."
                    }
                ]
            },
            "instructionSteps": [
                {
                    "title": "1. Create ARM Resources and Provide the Required Permissions",
                    "description": "This connector enables your Contoso application to push security alerts directly to Microsoft Sentinel via the Azure Monitor Ingestion API.",
                    "instructions": [
                        {
                            "type": "Markdown",
                            "parameters": {
                                "content": "#### Automated Configuration and Secure Data Ingestion with Entra Application \nClicking on \"Deploy\" will trigger the creation of a Log Analytics table and a Data Collection Rule (DCR). \nIt will then create an Entra application, link the DCR to it, and set the entered secret in the application. This setup enables data to be sent securely to the DCR using an Entra token."
                            }
                        },
                        {
                            "type": "DeployPushConnectorButton",
                            "parameters": {
                                "label": "Deploy Contoso Push connector resources",
                                "applicationDisplayName": "Contoso Security Alerts Push Connector Application"
                            }
                        }
                    ]
                },
                {
                    "title": "2. Configure Your Contoso Application",
                    "description": "Use the following parameters to configure your Contoso application to push security alerts to the workspace.",
                    "instructions": [
                        {
                            "type": "CopyableLabel",
                            "parameters": {
                                "label": "Tenant ID (Directory ID)",
                                "fillWith": [
                                    "TenantId"
                                ]
                            }
                        },
                        {
                            "type": "CopyableLabel",
                            "parameters": {
                                "label": "Entra App Registration Application ID",
                                "fillWith": [
                                    "ApplicationId"
                                ],
                                "placeholder": "Deploy push connector to get the App Registration Application ID"
                            }
                        },
                        {
                            "type": "CopyableLabel",
                            "parameters": {
                                "label": "Entra App Registration Secret",
                                "fillWith": [
                                    "ApplicationSecret"
                                ],
                                "placeholder": "Deploy push connector to get the App Registration Secret"
                            }
                        },
                        {
                            "type": "CopyableLabel",
                            "parameters": {
                                "label": "Data Collection Endpoint Uri",
                                "fillWith": [
                                    "DataCollectionEndpoint"
                                ],
                                "placeholder": "Deploy push connector to get the Data Collection Endpoint Uri"
                            }
                        },
                        {
                            "type": "CopyableLabel",
                            "parameters": {
                                "label": "Data Collection Rule Immutable ID",
                                "fillWith": [
                                    "DataCollectionRuleId"
                                ],
                                "placeholder": "Deploy push connector to get the Data Collection Rule Immutable ID"
                            }
                        },
                        {
                            "type": "CopyableLabel",
                            "parameters": {
                                "label": "Stream Name",
                                "value": "Custom-ContosoSecurityAlerts"
                            }
                        },
                        {
                            "type": "Markdown",
                            "parameters": {
                                "content": "#### Configure Contoso Application\nUpdate your Contoso application configuration with the above credentials to enable security alert push to Microsoft Sentinel.\n\nExample configuration:\njson\n{\n \"azure\": {\n \"tenant_id\": \"<Tenant ID>\",\n \"client_id\": \"<Application ID>\",\n \"client_secret\": \"<Application Secret>\",\n \"dce_endpoint\": \"<Data Collection Endpoint Uri>\",\n \"dcr_immutable_id\": \"<Data Collection Rule Immutable ID>\",\n \"stream_name\": \"Custom-ContosoSecurityAlerts\"\n }\n}\n"
                            }
                        }
                    ]
                }
            ]
        }
    }
}
```
> [!IMPORTANT]
> - The `id` in `connectorUiConfig` must be unique and match references in the data connector configuration.
> - Use `IsConnectedQuery` for production connectors (validates recent data), or `hasDataConnectors` for simpler validation.
> - The `fillWith` parameters in `CopyableLabel` are automatically populated after deployment.
> - Fixed values, like stream name, use the `value` parameter instead of `fillWith`.

### Push connector configuration

The push connector configuration is the data connector instance that links the connector definition to deployed resources.

The push connector configuration 
- Links the connector definition (UI) to the deployed DCR and Entra app 
- Stores authentication details (app ID, service principal ID) 
- Records DCR configuration (endpoint, immutable ID, stream name) 
- Enables the UI to retrieve and display connection details to users

Key properties: 
- `connectorDefinitionName`: Must match the `id` in your connector definition 
- `dcrConfig`: Contains DCR endpoint, rule ID, and stream name 
- `auth`: Contains the Entra application ID and service principal ID 
- `kind`: Must be "Push" for push connectors

Example:
```json
{
  "name": "ContosoSecurityAlertsPushDCR",
  "apiVersion": "2021-09-01-preview",
  "type": "Microsoft.Insights/dataCollectionRules",
  "location": "[parameters('workspace-location')]",
  "properties": {
    "streamDeclarations": {
      "Custom-ContosoSecurityAlerts": {
        "columns": [
          {
            "name": "EventSeverity",
            "type": "string"
          },
          {
            "name": "EventType",
            "type": "string"
          },
          {
            "name": "UserName",
            "type": "string"
          },
          {
            "name": "SourceIP",
            "type": "string"
          },
          {
            "name": "DeviceId",
            "type": "string"
          },
          {
            "name": "AlertMessage",
            "type": "string"
          }
        ]
      }
    },
    "destinations": {
      "logAnalytics": [
        {
          "workspaceResourceId": "[variables('workspaceResourceId')]",
          "name": "clv2ws1"
        }
      ]
    },
    "dataFlows": [
      {
        "streams": [
          "Custom-ContosoSecurityAlerts"
        ],
        "destinations": [
          "clv2ws1"
        ],
        "transformKql": "source | extend TimeGenerated = now()",
        "outputStream": "Custom-ContosoSecurityAlerts_CL"
      }
    ],
    "dataCollectionEndpointId": "[concat('/subscriptions/',parameters('subscription'),'/resourceGroups/',parameters('resourceGroupName'),'/providers/Microsoft.Insights/dataCollectionEndpoints/',parameters('workspace'))]"
  }
}
```

> [!IMPORTANT]
> - The `connectorDefinitionName` must exactly match the connector definition's `id`.
> - The `streamName` must match the stream declared in your DCR.
> - This resource is automatically created during deployment when users select the **DeployPushConnector** button.



## Building your first push connector

In this example, you build a simple push connector that sends security alerts from your application to Sentinel.

**Goal:** Send security alerts from your application to Sentinel in real-time

Your application sends the event structure:
```json
{
  "TimeGenerated": "2025-11-21T10:30:00Z",
  "EventSeverity": "Medium",
  "EventType": "LoginAlert",
  "UserName": "alice@contoso.com",
  "SourceIP": "192.168.1.100",
  "DeviceId": "device-12345",
  "AlertMessage": "Multiple failed login attempts detected"
}
```

### Step-by-step guide to create the push connector

1.  Clone the Azure-Sentinel Repository

    Fork then clone the official Azure-Sentinel repository to your local machine. This repository contains the packaging tools and provides the standard solution structure.

    1. Clone the repository  
    `git clone https://github.com/<YOUR_FORK>/Azure-Sentinel.git`

    1. Navigate to the Solutions directory
    `cd Azure-Sentinel/Solutions`  
    The repository structure includes: 
    - Tools/Create-Azure-Sentinel-Solution/V3/ 
    - Contains the createSolutionV3.ps1 packaging script 
    - Solutions/  Where you'll create your connector solution

1. Create Your Solution Folder Structure
    Create a new solution directory within the Solutions/ folder following the standard naming convention.
    Create solution directories (from Azure-Sentinel/Solutions/)
    ```bash
    mkdir ContosoSecurityAlerts
    cd ContosoSecurityAlerts
    mkdir Data
    mkdir "Data Connectors"
    mkdir "Data Connectors/ContosoSecurityAlerts_ccf"
    ```
    Your folder structure looks like the following:

    Azure-Sentinel/  
    &nbsp;└── Solutions/   
    &nbsp;&nbsp;&nbsp;&nbsp;└── ContosoSecurityAlerts/  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── Data/  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Data Connectors/  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── ContosoSecurityAlerts_ccf/  


1.  Define Your Table

    In the ContosoSecurityAlerts_ccf folder, create a file named table.json with your custom table definition:

    ```json
    {
      "name": "ContosoSecurityAlerts_CL",
      "type": "Microsoft.OperationalInsights/workspaces/tables",
      "apiVersion": "2025-07-01",
      "properties": {
        "schema": {
          "name": "ContosoSecurityAlerts_CL",
          "columns": [
            {
              "name": "TimeGenerated",
              "type": "datetime"
            },
            {
              "name": "EventSeverity",
              "type": "string"
            },
            {
              "name": "EventType",
              "type": "string"
            },
            {
              "name": "UserName",
              "type": "string"
            },
            {
              "name": "SourceIP",
              "type": "string"
            },
            {
              "name": "DeviceId",
              "type": "string"
            },
            {
              "name": "AlertMessage",
              "type": "string"
            }
          ]
        }
      }
    }
    ```

1. Create the DCR

    In the ContosoSecurityAlerts_ccf folder, create a file named DCR.json that defines the input stream and routes data to your table:

    ```json
    {
      "name": "ContosoSecurityAlertsPushDCR",
      "apiVersion": "2021-09-01-preview",
      "type": "Microsoft.Insights/dataCollectionRules",
      "location": "[parameters('workspace-location')]",
      "properties": {
        "streamDeclarations": {
          "Custom-ContosoSecurityAlerts": {
            "columns": [
              {
                "name": "EventSeverity",
                "type": "string"
              },
              {
                "name": "EventType",
                "type": "string"
              },
              {
                "name": "UserName",
                "type": "string"
              },
              {
                "name": "SourceIP",
                "type": "string"
              },
              {
                "name": "DeviceId",
                "type": "string"
              },
              {
                "name": "AlertMessage",
                "type": "string"
              }
            ]
          }
        },
        "destinations": {
          "logAnalytics": [
            {
              "workspaceResourceId": "[variables('workspaceResourceId')]",
              "name": "clv2ws1"
            }
          ]
        },
        "dataFlows": [
          {
            "streams": [
              "Custom-ContosoSecurityAlerts"
            ],
            "destinations": [
              "clv2ws1"
            ],
            "transformKql": "source | extend TimeGenerated = now()",
            "outputStream": "Custom-ContosoSecurityAlerts_CL"
          }
        ],
        "dataCollectionEndpointId": "[concat('/subscriptions/',parameters('subscription'),'/resourceGroups/',parameters('resourceGroupName'),'/providers/Microsoft.Insights/    dataCollectionEndpoints/',parameters('workspace'))]"
      }
    }
    ```

1. Create the Connector Definition

    In the ContosoSecurityAlerts_ccf folder create a file named connectorDefinition.json that defines how users interact with the connector in Sentinel:

    ```json 
    {
        "name": "ContosoSecurityAlertsPush",
        "apiVersion": "2022-09-01-preview",
        "type": "Microsoft.SecurityInsights/dataConnectorDefinitions",
        "location": "[parameters('workspace-location')]",
        "kind": "Customizable",
        "properties": {
            "connectorUiConfig": {
                "id": "ContosoSecurityAlertsPush",
                "title": "Contoso Security Alerts (Push)",
                "publisher": "Contoso Corporation",
                "descriptionMarkdown": "The [Contoso Security Alerts](https://www.contoso.com/) connector provides the capability to push real-time security alerts from your   Contoso application directly into Microsoft Sentinel using the Codeless Connector Framework (CCF) Push pattern. This connector ingests alert severity, event  types, user information, and network details into a custom Log Analytics table for analysis, alerting, and visualization.",
                "graphQueries": [
                    {
                        "metricName": "Security Alerts",
                        "legend": "ContosoSecurityAlerts_CL",
                        "baseQuery": "ContosoSecurityAlerts_CL"
                    }
                ],
                "sampleQueries": [
                    {
                        "description": "All security alerts",
                        "query": "ContosoSecurityAlerts_CL\n | sort by TimeGenerated desc"
                    },
                    {
                        "description": "Critical and High severity alerts",
                        "query": "ContosoSecurityAlerts_CL\n | where EventSeverity in ('Critical', 'High')\n | sort by TimeGenerated desc"
                    }
                ],
                "dataTypes": [
                    {
                        "name": "ContosoSecurityAlerts_CL",
                        "lastDataReceivedQuery": "ContosoSecurityAlerts_CL\n| summarize Time = max(TimeGenerated)\n| where isnotempty(Time)"
                    }
                ],
                "connectivityCriteria": [
                    {
                        "type": "IsConnectedQuery",
                        "value": [
                            "ContosoSecurityAlerts_CL\n| summarize LastLogReceived = max(TimeGenerated)\n| project IsConnected = LastLogReceived > ago(7d)"
                        ]
                    }
                ],
                "availability": {
                    "status": 1
                },
                "permissions": {
                    "resourceProvider": [
                        {
                            "provider": "Microsoft.OperationalInsights/workspaces",
                            "permissionsDisplayText": "read and write permissions are required.",
                            "providerDisplayName": "Workspace",
                            "scope": "Workspace",
                            "requiredPermissions": {
                                "write": true,
                                "read": true,
                                "delete": true
                            }
                        }
                    ],
                    "customs": [
                        {
                            "name": "Microsoft Entra",
                            "description": "Permission to create an app registration in Microsoft Entra ID. Typically requires Entra ID Application Developer role or higher."
                        },
                        {
                            "name": "Microsoft Azure",
                            "description": "Permission to assign Monitoring Metrics Publisher role on data collection rule (DCR). Typically requires Azure RBAC Owner or User   Access Administrator role."
                        }
                    ]
                },
                "instructionSteps": [
                    {
                        "title": "1. Create ARM Resources and Provide the Required Permissions",
                        "description": "This connector enables your Contoso application to push security alerts directly to Microsoft Sentinel via the Azure Monitor Ingestion  API.",
                        "instructions": [
                            {
                                "type": "Markdown",
                                "parameters": {
                                    "content": "#### Automated Configuration and Secure Data Ingestion with Entra Application \nClicking on \"Deploy\" will trigger the creation    of a Log Analytics table and a Data Collection Rule (DCR). \nIt will then create an Entra application, link the DCR to it, and set the     entered secret in the application. This setup enables data to be sent securely to the DCR using an Entra token."
                                }
                            },
                            {
                                "type": "DeployPushConnectorButton",
                                "parameters": {
                                    "label": "Deploy Contoso Push connector resources",
                                    "applicationDisplayName": "Contoso Security Alerts Push Connector Application"
                                }
                            }
                        ]
                    },
                    {
                        "title": "2. Configure Your Contoso Application",
                        "description": "Use the following parameters to configure your Contoso application to push security alerts to the workspace.",
                        "instructions": [
                            {
                                "type": "CopyableLabel",
                                "parameters": {
                                    "label": "Tenant ID (Directory ID)",
                                    "fillWith": [
                                        "TenantId"
                                    ]
                                }
                            },
                            {
                                "type": "CopyableLabel",
                                "parameters": {
                                    "label": "Entra App Registration Application ID",
                                    "fillWith": [
                                        "ApplicationId"
                                    ],
                                    "placeholder": "Deploy push connector to get the App Registration Application ID"
                                }
                            },
                            {
                                "type": "CopyableLabel",
                                "parameters": {
                                    "label": "Entra App Registration Secret",
                                    "fillWith": [
                                        "ApplicationSecret"
                                    ],
                                    "placeholder": "Deploy push connector to get the App Registration Secret"
                                }
                            },
                            {
                                "type": "CopyableLabel",
                                "parameters": {
                                    "label": "Data Collection Endpoint Uri",
                                    "fillWith": [
                                        "DataCollectionEndpoint"
                                    ],
                                    "placeholder": "Deploy push connector to get the Data Collection Endpoint Uri"
                                }
                            },
                            {
                                "type": "CopyableLabel",
                                "parameters": {
                                    "label": "Data Collection Rule Immutable ID",
                                    "fillWith": [
                                        "DataCollectionRuleId"
                                    ],
                                    "placeholder": "Deploy push connector to get the Data Collection Rule Immutable ID"
                                }
                            },
                            {
                                "type": "CopyableLabel",
                                "parameters": {
                                    "label": "Stream Name",
                                    "value": "Custom-ContosoSecurityAlerts"
                                }
                            },
                            {
                                "type": "Markdown",
                                "parameters": {
                                    "content": "#### Configure Contoso Application\nUpdate your Contoso application configuration with the above credentials to enable security     alert push to Microsoft Sentinel.\n\nExample configuration:\njson\n{\n \"azure\": {\n \"tenant_id\": \"<Tenant ID>\",\n \"client_id\":  \"<Application ID>\",\n \"client_secret\": \"<Application Secret>\",\n \"dce_endpoint\": \"<Data Collection Endpoint Uri>\",\n   \"dcr_immutable_id\": \"<Data Collection Rule Immutable ID>\",\n \"stream_name\": \"Custom-ContosoSecurityAlerts\"\n }\n}\n"
                                }
                            }
                        ]
                    }
                ]
            }
        }
    }
    ```

1. Create the Data Connector Configuration

    In the ContosoSecurityAlerts_ccf folder, create a file named dataConnector.json that links the connector definition to the deployed resources:
    ```json
    {
      "name": "ContosoSecurityAlertsPushConnectorPolling",
      "apiVersion": "2024-09-01",
      "type": "Microsoft.SecurityInsights/dataConnectors",
      "kind": "Push",
      "properties": {
        "connectorDefinitionName": "ContosoSecurityAlertsPush",
        "dcrConfig": {
          "streamName": "Custom-ContosoSecurityAlerts",
          "dataCollectionEndpoint": "[[parameters('dcrConfig').dataCollectionEndpoint]",
          "dataCollectionRuleImmutableId": "[[parameters('dcrConfig').dataCollectionRuleImmutableId]"
        },
        "auth": {
          "type": "Push",
          "AppId": "[[parameters('auth').appId]",
          "ServicePrincipalId": "[[parameters('auth').servicePrincipalId]"
        },
        "request": {
          "RetryCount": 1
        },
        "response": {
          "eventsJsonPaths": [
            "$"
          ]
        }
      }
    }
    ```

1. Create Solution Metadata Files
    1. Solution_ContosoSecurityAlerts.json
        In the Data folder, create `Solution_ContosoSecurityAlerts.json` with your solution details:

        ```json
        {
             "Name": "ContosoSecurityAlerts",
             "Author": "Contoso Corporation - support@contoso.com",
             "Logo": "<svg width=\"75px\" height=\"75px\" viewBox=\"0 0 75 75\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"75\" height=\"75\" fill=\"#FF6B35\"/><text   x=\"37.   5\" y=\"45\" font-family=\"Arial\" font-size=\"18\" fill=\"white\" text-anchor=\"middle\" font-weight=\"bold\">CONTOSO</text></svg>",
             "Description": "The Contoso Security Alerts solution provides real-time security alert ingestion from your Contoso application into Microsoft Sentinel using the       Codeless Connector Framework (CCF) Push pattern. Your application pushes alert severity, event types, user information, and network details directly to Azure   Monitor     for analysis, alerting, and visualization.",
             "Data Connectors": [
                  "Data Connectors/ContosoSecurityAlerts_ccf/connectorDefinition.json"
             ],
             "BasePath": "C:\\GitHub\\Azure-Sentinel\\Solutions\\ContosoSecurityAlerts",
             "Version": "1.0.0",
             "Metadata": "SolutionMetadata.json",
             "TemplateSpec": true,
             "Is1PConnector": false
        }
        ```

        > [!IMPORTANT]
        > Critical field requirements: 
        > - `BasePath`: Update to your actual local path to the Azure-Sentinel repository  
        > - `Metadata`: Must reference `SolutionMetadata.json` (created in Step 6B) 
        > - `Version`: Semantic versioning, for example, `3.0.0`
        > - `TemplateSpec`: Always `true` for Content Hub solutions 
        > - `Is1Pconnector`: Set to `false` for partner/custom connectors 

    1.  Create SolutionMetadata.json at solution root

        In the ContosoSecurityAlerts folder, create SolutionMetadata.json at the solution root directory (same level as Data folder):
        ```json
        {
          "publisherId": "contoso",
          "offerId": "contoso-security-alerts",
          "firstPublishDate": "2025-01-01",
          "lastPublishDate": "2025-01-01",
          "providers": [
             "Contoso"
          ],
          "categories": {
             "domains": [
                "Security - Threat Protection",
                "Security - Cloud Security"
             ]
          },
          "support": {
             "name": "Contoso Corporation",
             "tier": "Partner",
             "link": "https://www.contoso.com/support"
          }
        }
        ```

        You need the SolutionMetadata.json file for Content Hub packaging:
        - The packaging tool expects this file at the solution root
        - It contains marketplace metadata for Content Hub distribution

    1. Create ReleaseNotes.md at solution root

        | **Version** | **Date Modified (DD-MM-YYYY)** | **Change History**                          |
        |-------------|--------------------------------|---------------------------------------------|
        | 3.0.0       | DD-MM-YYYY                     | Example solution                            |

    **Validation checklist**

    Before proceeding to the next step, verify:

    - Folder name has no spaces, for example `ContosoSecurityAlerts`
    - `Name` field in Solution_ContosoSecurityAlerts.json matches folder name exactly
    - `SolutionMetadata.json` exists at solution root (not in Data folder)
    - `BasePath` points to your actual local Azure-Sentinel repository path
    - `Metadata` field references "SolutionMetadata.json"
    - `publisherId` and `offerId` match between both files

1. Verify your solution structure

    Confirm that your folder structure matches the required layout with all files in place:

    ```text
    Azure-Sentinel/
    └── Solutions/
         └── ContosoSecurityAlerts/                         Folder name (no spaces)
              ├── Data/
              │   └── Solution_ContosoSecurityAlerts.json    From Step 7A
              ├── SolutionMetadata.json                      From Step 7B (at root)
              ├── ReleaseNotes.md                            From Step 7C
              └── Data Connectors/
                    └── ContosoSecurityAlerts_ccf/
                         ├── table.json                         From Step 3
                         ├── DCR.json                           From Step 4
                         ├── connectorDefinition.json           From Step 5
                         └── dataConnector.json                 From Step 6
    ```     

1. Package your solution

    Use the createSolutionV3.ps1 packaging tool to generate the ARM deployment template.

    ```powershell
    # Navigate to the packaging tools directory (from Azure-Sentinel repository root)
    cd Tools/Create-Azure-Sentinel-Solution/V3

    # Run the packaging tool
    # When prompted for "Enter solution data folder path:", provide:
    # <REPO_ROOT>Solutions/ContosoSecurityAlerts/Data (Note! This path is absolute)
    .\createSolutionV3.ps1
    ```

    The script automatically:
    - Validates your Data/ folder structure
    - Processes connector artifacts

    **Expected output:**

    The packaging script shows a failed arm-ttk (Azure Resource Manager Template Toolkit) validation. This failure is expected and normal for CCF Push connectors:

    ```console
    Failed arm-ttk (Test-AzTemplate): Package
    Failed arm-ttk (Test-AzTemplate) on solutions: Package
    ************Validating if Package Json files are valid or not***************
    File Solutions\ContosoSecurityAlerts\Package\createUiDefinition.json is a valid Json file!
    File Solutions\ContosoSecurityAlerts\Package\mainTemplate.json is a valid Json file!
    File Solutions\ContosoSecurityAlerts\Package\testParameters.json is a valid Json file!
    ```

    The packaging succeeded if you see the three JSON validation messages confirming valid files. You can ignore the `arm-ttk` failure for CCF Push connectors.

    For more information, see the [Azure-Sentinel Solutions Tools documentation](https://github.com/Azure/Azure-Sentinel/tree/master/Tools/Create-Azure-Sentinel-Solution).

1.  Deploy the solution package

    Deploy the generated ARM template (Package/mainTemplate.json) to your Azure subscription.

    1. In the Azure portal, search for **Deploy a custom template**
    1. Select **Build your own template in the editor**
    1. Select **Load file** and select `Package/mainTemplate.json` from your output folder
    1. Select **Save**
    1. Fill in the deployment parameters:
        - **Subscription:** Your Azure subscription
        - **Resource Group:** The resource group containing your Sentinel workspace
        - **Region:** Same region as your Sentinel workspace
        - **Workspace:** Your Log Analytics workspace name
    1. Select **Review + create**, then **Create**

    This deployment makes the connector available in your Microsoft Sentinel data connectors gallery.

    For detailed steps, see [Quickstart: Create and deploy ARM templates by using the Azure portal](/azure/azure-resource-manager/templates/    quickstart-create-templates-use-the-portal).

1.  Enable the data connector

    After deploying the solution package, enable the connector to provision resources and generate credentials.

    1. In the Azure portal, navigate to your Microsoft Sentinel workspace
    1. Go to **Configuration** > **Data connectors**
    1. Search for and select **Contoso Security Alerts (Push)**
    1. Select **Open connector page**
    1. Select the **Deploy Contoso Security Alerts connector** button
    1. Wait for deployment to complete (creates custom table, DCR, DCE, Entra application with credentials)
    1. Copy the connection details that appear:
        - Tenant ID
        - Application (Client) ID
        - Client Secret
        - Data Collection Endpoint URI
        - Data Collection Rule Immutable ID
        - Stream Name: `Custom-ContosoSecurityAlerts`

1. Configure your application

    Update your application code with the credentials and resource details from Step 10. The code uses the OAuth 2.0 client credentials flow to authenticate with Azure Monitor.

    > [!CAUTION] 
    > Protect your credentials: Never hardcode credentials (Tenant ID, Application ID, Client Secret) directly in your application code or commit them to source control. 
    > Use secure credential storage solutions such as:  
    > - Azure Key Vault for production applications 
    > - Environment variables or configuration files (excluded from source control) 
    > - Managed identities where applicable 
    > - Secrets management tools that encrypt credentials at rest

    

    **Python Example Application Code:**

    The following example uses placeholder values like \<Your-Tenant-ID\>. Replace these values with secure references to your actual credentials.

    ```python
    import requests
    import json
    from datetime import datetime, timezone

    # Connection details from Step 11

    tenant_id = "<Your-Tenant-ID>"
    app_id = "<Your-Application-ID>"
    app_secret = "<Your-Client-Secret>"
    dce_uri = "<Your-DCE-URI>"
    dcr_immutable_id = "<Your-DCR-Immutable-ID>"
    stream_name = "Custom-ContosoSecurityAlerts"


    **Get OAuth token**

    token_url = f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token"
    token_data = {
         "client_id": app_id,
         "scope": "https://monitor.azure.com//.default",
         "client_secret": app_secret,
         "grant_type": "client_credentials"
    }
    token_response = requests.post(token_url, data=token_data)
    access_token = token_response.json()["access_token"]


    # Create event matching your table schema

    event = [{
         "TimeGenerated": datetime.now(timezone.utc).isoformat(),
         "EventSeverity": "Medium",
         "EventType": "LoginAlert",
         "UserName": "alice@contoso.com",
         "SourceIP": "192.168.1.100",
         "DeviceId": "device-12345",
         "AlertMessage": "Multiple failed login attempts detected"
    }]


    # Send to Sentinel

    headers = {
         "Authorization": f"Bearer {access_token}",
         "Content-Type": "application/json"
    }
    upload_url = f"{dce_uri}/dataCollectionRules/{dcr_immutable_id}/streams/{stream_name}?api-version=2023-01-01"
    response = requests.post(upload_url, headers=headers, json=event)

    print(f"Status: {response.status_code}")
    print("Security alert sent to Sentinel!")
    ```

1. Query your data

    After sending alerts, query in Sentinel. Allow 5-10 minutes for first ingestion.

    ```kusto
    // View all recent alerts
    ContosoSecurityAlerts_CL
    | where TimeGenerated > ago(1h)
    | order by TimeGenerated desc

    // High severity alerts
    ContosoSecurityAlerts_CL
    | where EventSeverity == "High"
    | project TimeGenerated, EventType, UserName, SourceIP, AlertMessage

    // Alert summary by severity
    ContosoSecurityAlerts_CL
    | where TimeGenerated > ago(7d)
    | summarize Count=count() by EventSeverity
    ```

## Next steps

Now that you understand CCF Push connectors, take the following steps:

1. **Design your data schema** - Identify the events you want to send and their fields.
1. **Create connector artifacts** - Build the four JSON files (table, DCR, connector definition, data connector).
1. **Organize solution structure** - Set up Data/ and Data Connectors/ folders with proper naming.
1. **Package your solution** - Use `createSolutionV3.ps1` to generate deployment templates.
1. **Deploy and test** - Deploy to your Sentinel workspace and validate data flow.
1. **Integrate with your application** - Add code to send events in real-time.
1. **Create alerts and workbooks** - Use your data for security monitoring.

## Additional resources

### CCF documentation

- [Create a codeless connector (CCF Pull)](/azure/sentinel/create-codeless-connector) - Polling-based connectors.
- [Data Connector Definitions API reference](/rest/api/securityinsights/data-connector-definitions) - UI configuration guide.
- [Data connector connection rules reference](/azure/sentinel/create-codeless-connector) - Connection rules for polling connectors.

### Azure Monitor and data collection

- [Azure Monitor Logs Ingestion API](/azure/azure-monitor/logs/logs-ingestion-api-overview) - Core API for sending data.
- [Data collection rules in Azure Monitor](/azure/azure-monitor/essentials/data-collection-rule-overview) - Understanding DCRs.
- [Structure of a data collection rule](/azure/azure-monitor/essentials/data-collection-rule-structure) - DCR structure details.
- [Data collection endpoints in Azure Monitor](/azure/azure-monitor/essentials/data-collection-endpoint-overview) - DCE configuration.
- [Tutorial: Send data to Azure Monitor Logs with Logs ingestion API](/azure/azure-monitor/logs/tutorial-logs-ingestion-portal) - Step-by-step tutorial.
- [Create a custom table](/azure/azure-monitor/logs/create-custom-table) - Custom table creation guide.

### Authentication and security

- [OAuth 2.0 client credentials flow](/entra/identity-platform/v2-oauth2-client-creds-grant-flow) - How app-to-service authentication works.
- [Microsoft identity platform access tokens](/entra/identity-platform/access-tokens) - Understanding OAuth tokens.
- [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app) - How to register an application in Microsoft Entra ID.
- [Best practices for Azure AD application registration](/entra/identity-platform/security-best-practices-for-app-registration) - Entra app security.
- [Assign Azure roles using Azure Resource Manager (ARM) templates](/azure/role-based-access-control/role-assignments-template) - Assign roles using templates.
- [ARM template security recommendations](/azure/azure-resource-manager/templates/best-practices#security-recommendations-for-parameters) - Securing deployment templates.
- [Azure Monitor service limits](/azure/azure-monitor/service-limits) - Rate limits and quotas.

### Microsoft Sentinel

- [About Microsoft Sentinel solutions](/azure/sentinel/sentinel-solutions) - Packaging connectors as solutions.
- [Monitor the health of your data connectors](/azure/sentinel/monitor-data-connector-health) - Health monitoring.
- [ARM template reference for data connectors](/rest/api/securityinsights/data-connectors) - Complete API reference.

## Getting help

- For ISV partners building integrations, contact: azuresentinelpartner@microsoft.com
- For technical questions, use [Microsoft Q&A](/answers/topics/azure-sentinel.html) with the tag 'azure-sentinel'.
