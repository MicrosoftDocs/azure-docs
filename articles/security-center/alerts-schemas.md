---
title: Schemas for the Azure Security Center alerts
description: This article describes the different schemas used by Azure Security Center for security alerts.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/23/2020
ms.author: memildin

---

# Security alerts schemas

Azure Security Center's advanced threat detection mechanisms generate security alerts when they detect threats to your resources.

These alerts are only available to users of the standard tier.  

Security alerts can be seen in Azure Security Center's Threat Protection pages. They can also be exported to Azure Sentinel (or any other SIEM) through Azure Event Hubs, accessed via the REST API, or exported to a Log Analytics workspace. If you're using any programmatic methods to consume the alerts, you'll need the schema to find the fields that are relevant to you. In addition, when exporting to an Event Hub or when triggering Workflow automation with generic HTTP connectors, you could use the schemas to properly parse the JSON objects.

>[!IMPORTANT]
> The schema is slightly different for each of these scenarios, so make sure you select the relevant tab below.


## The schemas 


### [Azure Activity Log](#tab/schema-activitylog)

Azure Security Center audits generated Security alerts as events in Azure Activity Log.

You can easily view the security alerts events in Activity log by searching for the Activate Alert event:

[![Searching the Activity log for the Activate Alert event](media//alerts-schemas/SampleActivityLogAlert.png)](media//alerts-schemas/SampleActivityLogAlert.png#lightbox)

### Sample JSON for an alert sent to Azure Activity Log


```json
{
    "channels": "Operation",
    "correlationId": "2518250008431989649_e7313e05-edf4-466d-adfd-35974921aeff",
    "description": "PREVIEW - Role binding to the cluster-admin role detected. Kubernetes audit log analysis detected a new binding to the cluster-admin role which gives administrator privileges.\r\nUnnecessary administrator privileges might cause privilege escalation in the cluster.",
    "eventDataId": "2518250008431989649_e7313e05-edf4-466d-adfd-35974921aeff",
    "eventName": {
        "value": "PREVIEW - Role binding to the cluster-admin role detected",
        "localizedValue": "PREVIEW - Role binding to the cluster-admin role detected"
    },
    "category": {
        "value": "Security",
        "localizedValue": "Security"
    },
    "eventTimestamp": "2019-12-25T18:52:36.801035Z",
    "id": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.Security/locations/centralus/alerts/2518250008431989649_e7313e05-edf4-466d-adfd-35974921aeff/events/2518250008431989649_e7313e05-edf4-466d-adfd-35974921aeff/ticks/637128967568010350",
    "level": "Informational",
    "operationId": "2518250008431989649_e7313e05-edf4-466d-adfd-35974921aeff",
    "operationName": {
        "value": "Microsoft.Security/locations/alerts/activate/action",
        "localizedValue": "Activate Alert"
    },
    "resourceGroupName": "RESOURCE_GROUP_NAME",
    "resourceProviderName": {
        "value": "Microsoft.Security",
        "localizedValue": "Microsoft.Security"
    },
    "resourceType": {
        "value": "Microsoft.Security/locations/alerts",
        "localizedValue": "Microsoft.Security/locations/alerts"
    },
    "resourceId": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.Security/locations/centralus/alerts/2518250008431989649_e7313e05-edf4-466d-adfd-35974921aeff",
    "status": {
        "value": "Active",
        "localizedValue": "Active"
    },
    "subStatus": {
        "value": "",
        "localizedValue": ""
    },
    "submissionTimestamp": "2019-12-25T19:14:03.5507487Z",
    "subscriptionId": "SUBSCRIPTION_ID",
    "properties": {
        "clusterRoleBindingName": "cluster-admin-binding",
        "subjectName": "for-binding-test",
        "subjectKind": "ServiceAccount",
        "username": "masterclient",
        "actionTaken": "Detected",
        "resourceType": "Kubernetes Service",
        "severity": "Low",
        "intent": "[\"Persistence\"]",
        "compromisedEntity": "ASC-IGNITE-DEMO",
        "remediationSteps": "[\"Review the user in the alert details. If cluster-admin is unnecessary for this user, consider granting lower privileges to the user.\"]",
        "attackedResourceType": "Kubernetes Service"
    },
    "relatedEvents": []
}
```


### The data model of the schema

|Field|Description|
|----|----|
|channels|Constant, "Operation"|
|correlationId|The Azure Security Center alert ID|
|description|Description of the alert|
|eventDataId|See correlationId|
|eventName|The value and localizedValue sub-fields contain the alert display name|
|category|The value and localizedValue sub-fields are constant - "Security"|
|eventTimestamp|UTC timestamp for when the alert was generated|
|id|The fully qualified alert ID|
|level|Constant, "Informational"|
|operationId|See correlationId|
|operationName|The value field is constant - "Microsoft.Security/locations/alerts/activate/action", and the localized value will be "Activate Alert" (can potentially be localized par the user locale)|
|resourceGroupName|Will include the resource group name|
|resourceProviderName|The value and localizedValue sub-fields are constant - "Microsoft.Security"|
|resourceType|The value and localizedValue sub-fields are constant - "Microsoft.Security/locations/alerts"|
|resourceId|The fully qualified Azure resource ID|
|status|The value and localizedValue sub-fields are constant - "Active"|
|subStatus|The value and localizedValue sub-fields are empty|
|submissionTimestamp|The UTC timestamp of event submission to Activity Log|
|subscriptionId|The subscription ID of the compromised resource|
|properties|A JSON bag of additional properties pertaining to the alert. These can change from one alert to the other, however, the following fields will appear in all alerts:<br>- severity: The severity of the attack<br>- compromisedEntity: The name of the comrpomised resource<br>- remediationSteps: Array of remediation steps to be taken<br>- intent: The kill-chain intent of the alert. Possible intents are documented in the [Intentions table](alerts-reference.md#intentions)|
|relatedEvents|Constnt - empty array|
|||


### [Workflow or Azure Sentinel](#tab/schema-sentinel)

### Sample JSON for an alert sent to Workflow Automation or Azure Sentinel


```json
{
  "VendorName": "Microsoft",
  "AlertType": "SUSPECT_SVCHOST",
  "StartTimeUtc": "2016-12-20T13:38:00.000Z",
  "EndTimeUtc": "2019-12-20T13:40:01.733Z",
  "ProcessingEndTime": "2019-09-16T12:10:19.5673533Z",
  "TimeGenerated": "2016-12-20T13:38:03.000Z",
  "IsIncident": false,
  "Severity": "High",
  "Status": "New",
  "ProductName": "Azure Security Center",
  "SystemAlertId": "2342409243234234_F2BFED55-5997-4FEA-95BD-BB7C6DDCD061",
  "AzureResourceId": "/subscriptions/86057C9F-3CDD-484E-83B1-7BF1C17A9FF8/resourceGroups/backend-srv/providers/Microsoft.Compute/WebSrv1",
  "AzureResourceSubscriptionId": "86057C9F-3CDD-484E-83B1-7BF1C17A9FF8",
  "WorkspaceId": "077BA6B7-8759-4F41-9F97-017EB7D3E0A8",
  "WorkspaceSubscriptionId": "86057C9F-3CDD-484E-83B1-7BF1C17A9FF8",
  "WorkspaceResourceGroup": "omsrg",
  "AgentId": "5A651129-98E6-4E6C-B2CE-AB89BD815616",
  "CompromisedEntity": "WebSrv1",
  "Intent": "Execution",
  "AlertDisplayName": "Suspicious process detected",
  "Description": "Suspicious process named ‘SVCHOST.EXE’ was running from path: %{Process Path}",
  "RemediationSteps": ["contact your security information team"],
  "ExtendedProperties": {
    "Process Path": "c:\\temp\\svchost.exe",
    "Account": "Contoso\\administrator",
    "PID": 944,
    "ActionTaken": "Detected"
  },
  "Entities": [],
  "ResourceIdentifiers": [
		{
			Type: "AzureResource",
			AzureResourceId: "/subscriptions/86057C9F-3CDD-484E-83B1-7BF1C17A9FF8/resourceGroups/backend-srv/providers/Microsoft.Compute/WebSrv1"
		},
		{
			Type: "LogAnalytics",
			WorkspaceId: "077BA6B7-8759-4F41-9F97-017EB7D3E0A8",
			WorkspaceSubscriptionId: "86057C9F-3CDD-484E-83B1-7BF1C17A9FF8",
			WorkspaceResourceGroup: "omsrg",
			AgentId: "5A651129-98E6-4E6C-B2CE-AB89BD815616",
		}
  ]
}
```



### The data model of the schema

|Field|Description|
|----|----|
| AlertName | Alert display name|
| Severity | The alert severity (High/Medium/Low/Informational)|
| AlertType | unique alert identifier|
| ConfidenceLevel | (Optional) The confidence level of this alert (High/Low)|
| ConfidenceScore | (Optional) Numeric confidence indicator of the security alert|
| Description | Description text for the alert|
| DisplayName | The alert's display name|
| EndTime | The impact end time of the alert (the time of the last event contributing to the alert)|
| Entities | A list of entities related to the alert. This list can hold a mixture of entities of diverse types|
| ExtendedLinks | (Optional) A bag for all links related to the alert. This bag can hold a mixture of links for diverse types|
| ExtendedProperties | A bag of additional fields which are relevant to the alert|
| IsIncident | Determines if the alert is an incident or a regular alert. An incident is a security alert that aggregates multiple alerts into one security incident|
| ProcessingEndTime | UTC timestamp in which the alert was created|
| ProductComponentName | (Optional) The name of a component inside the product which generated the alert.|
| ProductName | constant ('Azure Security Center')|
| ProviderName | unused|
| RemediationSteps | Manual action items to take to remediate the security threat|
| ResourceId | Full identifier of the affected resource|
| SourceComputerId | a unique GUID for the affected server (if the alert is generated on the server)|
| SourceSystem | unused|
| StartTime | The impact start time of the alert (the time of the first event contributing to the alert)|
| SystemAlertId | Unique identifier of this security alert instance|
| TenantId | the identifier of the parent Azure Active directory tenant of the subscription under which the scanned resource resides|
| TimeGenerated | UTC timestamp on which the assessment took place (Security Center's scan time) (identical to DiscoveredTimeUTC)|
| Type | constant ('SecurityAlert')|
| VendorName | The name of the vendor that provided the alert (e.g. 'Microsoft')|
| VendorOriginalId | unused|
| WorkspaceResourceGroup | in case the alert is generated on a VM, Server, VMSS or App Service instance that reports to a workspace, contains that workspace resource group name|
| WorkspaceSubscriptionId | in case the alert is generated on a VM, Server, VMSS or App Service instance that reports to a workspace, contains that workspace subscriptionId|
|||

### [REST API](#tab/schema-api)

### Schema for accessing alerts via the REST API

```json
{
  "swagger": "2.0",
  "info": {
    "title": "Security Center",
    "description": "API spec for Microsoft.Security (Azure Security Center) resource provider",
    "version": "2019-01-01"
  },
  "host": "management.azure.com",
  "schemes": [
    "https"
  ],
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ],
  "security": [
    {
      "azure_auth": [
        "user_impersonation"
      ]
    }
  ],
  "securityDefinitions": {
    "azure_auth": {
      "type": "oauth2",
      "authorizationUrl": "https://login.microsoftonline.com/common/oauth2/authorize",
      "flow": "implicit",
      "description": "Azure Active Directory OAuth2 Flow",
      "scopes": {
        "user_impersonation": "impersonate your user account"
      }
    }
  },
  "paths": {
    "/subscriptions/{subscriptionId}/providers/Microsoft.Security/alerts": {
      "get": {
        "x-ms-examples": {
          "Get security alerts on a subscription": {
            "$ref": "./examples/Alerts/GetAlertsSubscription_example.json"
          }
        },
        "tags": [
          "Alerts"
        ],
        "description": "List all the alerts that are associated with the subscription",
        "operationId": "Alerts_List",
        "parameters": [
          {
            "$ref": "../../../common/v1/types.json#/parameters/ApiVersion"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/SubscriptionId"
          },
          {
            "$ref": "#/parameters/ODataFilter"
          },
          {
            "$ref": "#/parameters/ODataSelect"
          },
          {
            "$ref": "#/parameters/ODataExpand"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/AlertList"
            }
          },
          "default": {
            "description": "Error response describing why the operation failed.",
            "schema": {
              "$ref": "../../../common/v1/types.json#/definitions/CloudError"
            }
          }
        },
        "x-ms-pageable": {
          "nextLinkName": "nextLink"
        }
      }
    },
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Security/alerts": {
      "get": {
        "x-ms-examples": {
          "Get security alerts on a resource group": {
            "$ref": "./examples/Alerts/GetAlertsResourceGroup_example.json"
          }
        },
        "tags": [
          "Alerts"
        ],
        "description": "List all the alerts that are associated with the resource group",
        "operationId": "Alerts_ListByResourceGroup",
        "parameters": [
          {
            "$ref": "../../../common/v1/types.json#/parameters/ApiVersion"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/SubscriptionId"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/ResourceGroupName"
          },
          {
            "$ref": "#/parameters/ODataFilter"
          },
          {
            "$ref": "#/parameters/ODataSelect"
          },
          {
            "$ref": "#/parameters/ODataExpand"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/AlertList"
            }
          },
          "default": {
            "description": "Error response describing why the operation failed.",
            "schema": {
              "$ref": "../../../common/v1/types.json#/definitions/CloudError"
            }
          }
        },
        "x-ms-pageable": {
          "nextLinkName": "nextLink"
        }
      }
    },
    "/subscriptions/{subscriptionId}/providers/Microsoft.Security/locations/{ascLocation}/alerts": {
      "get": {
        "x-ms-examples": {
          "Get security alerts on a subscription from a security data location": {
            "$ref": "./examples/Alerts/GetAlertsSubscriptionsLocation_example.json"
          }
        },
        "tags": [
          "Alerts"
        ],
        "description": "List all the alerts that are associated with the subscription that are stored in a specific location",
        "operationId": "Alerts_ListSubscriptionLevelAlertsByRegion",
        "parameters": [
          {
            "$ref": "../../../common/v1/types.json#/parameters/ApiVersion"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/SubscriptionId"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/AscLocation"
          },
          {
            "$ref": "#/parameters/ODataFilter"
          },
          {
            "$ref": "#/parameters/ODataSelect"
          },
          {
            "$ref": "#/parameters/ODataExpand"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/AlertList"
            }
          },
          "default": {
            "description": "Error response describing why the operation failed.",
            "schema": {
              "$ref": "../../../common/v1/types.json#/definitions/CloudError"
            }
          }
        },
        "x-ms-pageable": {
          "nextLinkName": "nextLink"
        }
      }
    },
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Security/locations/{ascLocation}/alerts": {
      "get": {
        "x-ms-examples": {
          "Get security alerts on a resource group from a security data location": {
            "$ref": "./examples/Alerts/GetAlertsResourceGroupLocation_example.json"
          }
        },
        "tags": [
          "Alerts"
        ],
        "description": "List all the alerts that are associated with the resource group that are stored in a specific location",
        "operationId": "Alerts_ListResourceGroupLevelAlertsByRegion",
        "parameters": [
          {
            "$ref": "../../../common/v1/types.json#/parameters/ApiVersion"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/SubscriptionId"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/AscLocation"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/ResourceGroupName"
          },
          {
            "$ref": "#/parameters/ODataFilter"
          },
          {
            "$ref": "#/parameters/ODataSelect"
          },
          {
            "$ref": "#/parameters/ODataExpand"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/AlertList"
            }
          },
          "default": {
            "description": "Error response describing why the operation failed.",
            "schema": {
              "$ref": "../../../common/v1/types.json#/definitions/CloudError"
            }
          }
        },
        "x-ms-pageable": {
          "nextLinkName": "nextLink"
        }
      }
    },
    "/subscriptions/{subscriptionId}/providers/Microsoft.Security/locations/{ascLocation}/alerts/{alertName}": {
      "get": {
        "x-ms-examples": {
          "Get security alert on a subscription from a security data location": {
            "$ref": "./examples/Alerts/GetAlertSubscriptionLocation_example.json"
          }
        },
        "tags": [
          "Alerts"
        ],
        "description": "Get an alert that is associated with a subscription",
        "operationId": "Alerts_GetSubscriptionLevelAlert",
        "parameters": [
          {
            "$ref": "../../../common/v1/types.json#/parameters/ApiVersion"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/SubscriptionId"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/AscLocation"
          },
          {
            "$ref": "#/parameters/AlertName"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/Alert"
            }
          },
          "default": {
            "description": "Error response describing why the operation failed.",
            "schema": {
              "$ref": "../../../common/v1/types.json#/definitions/CloudError"
            }
          }
        }
      }
    },
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Security/locations/{ascLocation}/alerts/{alertName}": {
      "get": {
        "x-ms-examples": {
          "Get security alert on a resource group from a security data location": {
            "$ref": "./examples/Alerts/GetAlertResourceGroupLocation_example.json"
          }
        },
        "tags": [
          "Alerts"
        ],
        "description": "Get an alert that is associated a resource group or a resource in a resource group",
        "operationId": "Alerts_GetResourceGroupLevelAlerts",
        "parameters": [
          {
            "$ref": "../../../common/v1/types.json#/parameters/ApiVersion"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/SubscriptionId"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/AscLocation"
          },
          {
            "$ref": "#/parameters/AlertName"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/ResourceGroupName"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/Alert"
            }
          },
          "default": {
            "description": "Error response describing why the operation failed.",
            "schema": {
              "$ref": "../../../common/v1/types.json#/definitions/CloudError"
            }
          }
        }
      }
    },
    "/subscriptions/{subscriptionId}/providers/Microsoft.Security/locations/{ascLocation}/alerts/{alertName}/dismiss": {
      "post": {
        "x-ms-examples": {
          "Update security alert state on a subscription from a security data location": {
            "$ref": "./examples/Alerts/UpdateAlertSubscriptionLocation_example.json"
          }
        },
        "tags": [
          "Alerts"
        ],
        "description": "Update the alert's state",
        "operationId": "Alerts_UpdateSubscriptionLevelAlertStateToDismiss",
        "parameters": [
          {
            "$ref": "../../../common/v1/types.json#/parameters/ApiVersion"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/SubscriptionId"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/AscLocation"
          },
          {
            "$ref": "#/parameters/AlertName"
          }
        ],
        "responses": {
          "204": {
            "description": "No Content"
          },
          "default": {
            "description": "Error response describing why the operation failed.",
            "schema": {
              "$ref": "../../../common/v1/types.json#/definitions/CloudError"
            }
          }
        }
      }
    },
    "/subscriptions/{subscriptionId}/providers/Microsoft.Security/locations/{ascLocation}/alerts/{alertName}/reactivate": {
      "post": {
        "x-ms-examples": {
          "Update security alert state on a subscription from a security data location": {
            "$ref": "./examples/Alerts/UpdateAlertSubscriptionLocation_example.json"
          }
        },
        "tags": [
          "Alerts"
        ],
        "description": "Update the alert's state",
        "operationId": "Alerts_UpdateSubscriptionLevelAlertStateToReactivate",
        "parameters": [
          {
            "$ref": "../../../common/v1/types.json#/parameters/ApiVersion"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/SubscriptionId"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/AscLocation"
          },
          {
            "$ref": "#/parameters/AlertName"
          }
        ],
        "responses": {
          "204": {
            "description": "No Content"
          },
          "default": {
            "description": "Error response describing why the operation failed.",
            "schema": {
              "$ref": "../../../common/v1/types.json#/definitions/CloudError"
            }
          }
        }
      }
    },
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Security/locations/{ascLocation}/alerts/{alertName}/dismiss": {
      "post": {
        "x-ms-examples": {
          "Update security alert state on a resource group from a security data location": {
            "$ref": "./examples/Alerts/UpdateAlertResourceGroupLocation_example.json"
          }
        },
        "tags": [
          "Alerts"
        ],
        "description": "Update the alert's state",
        "operationId": "Alerts_UpdateResourceGroupLevelAlertStateToDismiss",
        "parameters": [
          {
            "$ref": "../../../common/v1/types.json#/parameters/ApiVersion"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/SubscriptionId"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/AscLocation"
          },
          {
            "$ref": "#/parameters/AlertName"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/ResourceGroupName"
          }
        ],
        "responses": {
          "204": {
            "description": "No Content"
          },
          "default": {
            "description": "Error response describing why the operation failed.",
            "schema": {
              "$ref": "../../../common/v1/types.json#/definitions/CloudError"
            }
          }
        }
      }
    },
    "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Security/locations/{ascLocation}/alerts/{alertName}/reactivate": {
      "post": {
        "x-ms-examples": {
          "Update security alert state on a resource group from a security data location": {
            "$ref": "./examples/Alerts/UpdateAlertResourceGroupLocation_example.json"
          }
        },
        "tags": [
          "Alerts"
        ],
        "description": "Update the alert's state",
        "operationId": "Alerts_UpdateResourceGroupLevelAlertStateToReactivate",
        "parameters": [
          {
            "$ref": "../../../common/v1/types.json#/parameters/ApiVersion"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/SubscriptionId"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/AscLocation"
          },
          {
            "$ref": "#/parameters/AlertName"
          },
          {
            "$ref": "../../../common/v1/types.json#/parameters/ResourceGroupName"
          }
        ],
        "responses": {
          "204": {
            "description": "No Content"
          },
          "default": {
            "description": "Error response describing why the operation failed.",
            "schema": {
              "$ref": "../../../common/v1/types.json#/definitions/CloudError"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "AlertList": {
      "type": "object",
      "description": "List of security alerts",
      "properties": {
        "value": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Alert"
          }
        },
        "nextLink": {
          "readOnly": true,
          "type": "string",
          "description": "The URI to fetch the next page."
        }
      }
    },
    "Alert": {
      "type": "object",
      "description": "Security alert",
      "properties": {
        "properties": {
          "x-ms-client-flatten": true,
          "$ref": "#/definitions/AlertProperties"
        }
      },
      "allOf": [
        {
          "$ref": "../../../common/v1/types.json#/definitions/Resource"
        }
      ]
    },
    "AlertProperties": {
      "type": "object",
      "description": "describes security alert properties.",
      "properties": {
        "state": {
          "readOnly": true,
          "type": "string",
          "description": "State of the alert (Active, Dismissed etc.)"
        },
        "reportedTimeUtc": {
          "readOnly": true,
          "type": "string",
          "format": "date-time",
          "description": "The time the incident was reported to Microsoft.Security in UTC"
        },
        "vendorName": {
          "readOnly": true,
          "type": "string",
          "description": "Name of the vendor that discovered the incident"
        },
        "alertName": {
          "readOnly": true,
          "type": "string",
          "description": "Name of the alert type"
        },
        "alertDisplayName": {
          "readOnly": true,
          "type": "string",
          "description": "Display name of the alert type"
        },
        "detectedTimeUtc": {
          "readOnly": true,
          "type": "string",
          "format": "date-time",
          "description": "The time the incident was detected by the vendor"
        },
        "description": {
          "readOnly": true,
          "type": "string",
          "description": "Description of the incident and what it means"
        },
        "remediationSteps": {
          "readOnly": true,
          "type": "string",
          "description": "Recommended steps to reradiate the incident"
        },
        "actionTaken": {
          "readOnly": true,
          "type": "string",
          "description": "The action that was taken as a response to the alert (Active, Blocked etc.)"
        },
        "reportedSeverity": {
          "readOnly": true,
          "type": "string",
          "enum": [
            "Informational",
            "Low",
            "Medium",
            "High"
          ],
          "x-ms-enum": {
            "name": "reportedSeverity",
            "modelAsString": true,
            "values": [
              {
                "value": "Informational"
              },
              {
                "value": "Low"
              },
              {
                "value": "Medium"
              },
              {
                "value": "High"
              }
            ]
          },
          "description": "Estimated severity of this alert"
        },
        "compromisedEntity": {
          "readOnly": true,
          "type": "string",
          "description": "The entity that the incident happened on"
        },
        "associatedResource": {
          "readOnly": true,
          "type": "string",
          "description": "Azure resource ID of the associated resource"
        },
        "extendedProperties": {
          "$ref": "#/definitions/AlertExtendedProperties"
        },
        "systemSource": {
          "readOnly": true,
          "type": "string",
          "description": "The type of the alerted resource (Azure, Non-Azure)"
        },
        "canBeInvestigated": {
          "readOnly": true,
          "type": "boolean",
          "description": "Whether this alert can be investigated with Azure Security Center"
        },
        "isIncident": {
          "readOnly": true,
          "type": "boolean",
          "description": "Whether this alert is for incident type or not (otherwise - single alert)"
        },
        "entities": {
          "type": "array",
          "description": "objects that are related to this alerts",
          "items": {
            "$ref": "#/definitions/AlertEntity"
          }
        },
        "confidenceScore": {
          "readOnly": true,
          "type": "number",
          "format": "float",
          "minimum": 0,
          "maximum": 1,
          "description": "level of confidence we have on the alert"
        },
        "confidenceReasons": {
          "type": "array",
          "description": "reasons the alert got the confidenceScore value",
          "items": {
            "$ref": "#/definitions/AlertConfidenceReason"
          }
        },
        "subscriptionId": {
          "readOnly": true,
          "type": "string",
          "description": "Azure subscription ID of the resource that had the security alert or the subscription ID of the workspace that this resource reports to"
        },
        "instanceId": {
          "readOnly": true,
          "type": "string",
          "description": "Instance ID of the alert."
        },
        "workspaceArmId": {
          "readOnly": true,
          "type": "string",
          "description": "Azure resource ID of the workspace that the alert was reported to."
        },
        "correlationKey": {
          "readOnly": true,
          "type": "string",
          "description": "Alerts with the same CorrelationKey will be grouped together in Ibiza."
        }
      }
    },
    "AlertConfidenceReason": {
      "type": "object",
      "description": "Factors that increase our confidence that the alert is a true positive",
      "properties": {
        "type": {
          "readOnly": true,
          "type": "string",
          "description": "Type of confidence factor"
        },
        "reason": {
          "readOnly": true,
          "type": "string",
          "description": "description of the confidence reason"
        }
      }
    },
    "AlertEntity": {
      "type": "object",
      "additionalProperties": true,
      "description": "Changing set of properties depending on the entity type.",
      "properties": {
        "type": {
          "readOnly": true,
          "type": "string",
          "description": "Type of entity"
        }
      }
    },
    "AlertExtendedProperties": {
      "type": "object",
      "additionalProperties": true,
      "description": "Changing set of properties depending on the alert type."
    }
  },
  "parameters": {
    "ODataFilter": {
      "name": "$filter",
      "in": "query",
      "required": false,
      "type": "string",
      "description": "OData filter. Optional.",
      "x-ms-parameter-location": "method"
    },
    "ODataSelect": {
      "name": "$select",
      "in": "query",
      "required": false,
      "type": "string",
      "description": "OData select. Optional.",
      "x-ms-parameter-location": "method"
    },
    "ODataExpand": {
      "name": "$expand",
      "in": "query",
      "required": false,
      "type": "string",
      "description": "OData expand. Optional.",
      "x-ms-parameter-location": "method"
    },
    "AlertName": {
      "name": "alertName",
      "in": "path",
      "required": true,
      "type": "string",
      "description": "Name of the alert object",
      "x-ms-parameter-location": "method"
    }
  }
}
```
--- 