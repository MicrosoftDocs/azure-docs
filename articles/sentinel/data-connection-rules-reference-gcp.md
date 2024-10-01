---
title: GCP data connector reference for the Codeless Connector Platform
titleSuffix: Microsoft Sentinel
description: This article provides reference JSON fields and properties for creating the GCP data connector type and its data connection rules as part of the Codeless Connector Platform.
services: sentinel
author: austinmccollum
ms.topic: reference
ms.date: 9/30/2024
ms.author: austinmc

---

# GCP data connector reference for the Codeless Connector Platform

To create a Google Cloud Platform (GCP) data connector with the Codeless Connector Platform (CCP), use this reference as a supplement to the [Microsoft Sentinel REST API for Data Connectors](/rest/api/securityinsights/data-connectors/create-or-update?view=rest-securityinsights-2024-01-01-preview&tabs=HTTP#gcpdataconnector&preserve-view=true) docs.

Each `dataConnector` represents a specific *connection* of a Microsoft Sentinel data connector. One data connector might have multiple connections, which fetch data from different endpoints. The JSON configuration built using this reference document is used to complete the deployment template for the CCP data connector. 

For more information, see [Create a codeless connector for Microsoft Sentinel](create-codeless-connector.md#create-the-deployment-template).

## Build the GCP CCP data connector

Simplify the development of connecting your GCP data source with a sample GCP CCP data connector deployment template.

[**GCP CCP example template**](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/Templates/Connector_GCP_CCP_template.json)

With most of the deployment template sections filled out, you only need to build the first two components, the output table and the DCR. For more information, see the [Output table definition](create-codeless-connector.md#output-table-definition) and [Data Collection Rule (DCR)](create-codeless-connector.md#data-collection-rule) sections.

## Data Connectors - Create or update 

Reference the [Create or Update](/rest/api/securityinsights/data-connectors/create-or-update) operation in the REST API docs to find the latest stable or preview API version. The difference between the *create* and the *update* operation is the update requires the **etag** value.

**PUT** method
```http
https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroupName}}/providers/Microsoft.OperationalInsights/workspaces/{{workspaceName}}/providers/Microsoft.SecurityInsights/dataConnectors/{{dataConnectorId}}?api-version={{apiVersion}}
```

## URI parameters

For more information about the latest API version, see [Data Connectors - Create or Update URI Parameters](/rest/api/securityinsights/data-connectors/create-or-update#uri-parameters).

|Name  | Description  |
|---------|---------|
| **dataConnectorId** | The data connector ID must be a unique name and is the same as the `name` parameter in the [request body](#request-body).|
| **resourceGroupName** | The name of the resource group, not case sensitive.  |
| **subscriptionId** | The ID of the target subscription. |
| **workspaceName** | The *name* of the workspace, not the ID.<br>Regex pattern: `^[A-Za-z0-9][A-Za-z0-9-]+[A-Za-z0-9]$` |
| **api-version** | The API version to use for this operation. |

## Request body

The request body for a `GCP` CCP data connector has the following structure:

```json
{
   "name": "{{dataConnectorId}}",
   "kind": "GCP",
   "etag": "",
   "properties": {
        "connectorDefinitionName": "",
        "auth": {},
        "request": {},
        "dcrConfig": ""
   }
}

```

### GCP

**GCP** represents a CCP data connector where the paging and expected response payloads for your Google Cloud Platform (GCP) data source has already been configured. Configuring your GCP service to send data to a GCP Pub/Sub must be done separately. For more information, see [Publish message in Pub/Sub overview](https://cloud.google.com/pubsub/docs/publish-message-overview).

| Name | Required | Type | Description |
| ---- | ---- | ---- | ---- |
| **name** | True | string | The unique name of the connection matching the URI parameter |
| **kind** | True | string | Must be `GCP` |
| **etag** |  | GUID | Leave empty for creation of new connectors. For update operations, the etag must match the existing connector's etag (GUID). |
| properties.connectorDefinitionName |  | string | The name of the DataConnectorDefinition resource that defines the UI configuration of the data connector. For more information, see [Data Connector Definition](create-codeless-connector.md#data-connector-user-interface). |
| properties.**auth**	| True | Nested JSON | Describes the credentials for polling the GCP data. For more information, see [authentication configuration](#authentication-configuration). |
| properties.**request** | True | Nested JSON | Describes the GCP project Id and GCP subscription for polling the data. For more information, see [request configuration](#request-configuration). |
| properties.**dcrConfig** |  | Nested JSON | Required parameters when the data is sent to a Data Collection Rule (DCR). For more information, see [DCR configuration](#dcr-configuration). |

## Authentication configuration

Authentication to GCP from Microsoft Sentinel uses a GCP Pub/Sub. You must configure the authentication separately. Use the Terraform scripts [here](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/GCP/Terraform/sentinel_resources_creation/GCPInitialAuthenticationSetup/GCPInitialAuthenticationSetup.tf). For more information, see [GCP Pub/Sub authentication from another cloud provider](https://cloud.google.com/docs/authentication/provide-credentials-adc#wlif).

As a best practice, use parameters in the auth section instead of hard-coding credentials. For more information, see [Secure confidential input](create-codeless-connector.md#secure-confidential-input).

In order to create the deployment template which also uses parameters, you need to escape the parameters in this section with an extra starting `[`. This allows the parameters to assign a value based on the user interaction with the connector. For more information, see [Template expressions escape characters](../azure-resource-manager/templates/template-expressions.md#escape-characters).

To enable the credentials to be entered from the UI, the `connectorUIConfig` section requires `instructions` with the desired parameters. For more information, see [Data connector definitions reference for the Codeless Connector Platform](data-connector-ui-definitions-reference.md#instructions).

GCP auth example:
```json
"auth": {
    "serviceAccountEmail": "[[parameters('GCPServiceAccountEmail')]",
    "projectNumber": "[[parameters('GCPProjectNumber')]",
    "workloadIdentityProviderId": "[[parameters('GCPWorkloadIdentityProviderId')]"
}
``` 

## Request configuration

The request section requires the `projectId` and `subscriptionNames` from the GCP Pub/Sub.

GCP request example:
```json
"request": {
    "projectId": "[[parameters('GCPProjectId')]",
    "subscriptionNames": [
        "[[parameters('GCPSubscriptionName')]"
    ]
}
```

## DCR configuration

| Field | Required | Type | Description |
|----|----|----|----|
| **DataCollectionEndpoint** | True | String | DCE (Data Collection Endpoint) for example: `https://example.ingest.monitor.azure.com`. |
| **DataCollectionRuleImmutableId** | True | String | The DCR immutable ID. Find it by viewing the DCR creation response or using the [DCR API](/rest/api/monitor/data-collection-rules/get) |
| **StreamName** | True | string | This value is the `streamDeclaration` defined in the DCR (prefix must begin with *Custom-*) |

## Example CCP data connector

Here's an example of all the components of the `GCP` CCP data connector JSON together.

```json
{
    "kind": "GCP",
    "properties": {
        "connectorDefinitionName": "[[parameters('connectorDefinitionName')]",
        "dcrConfig": {
            "streamName": "[variables('streamName')]",
            "dataCollectionEndpoint": "[[parameters('dcrConfig').dataCollectionEndpoint]",
            "dataCollectionRuleImmutableId": "[[parameters('dcrConfig').dataCollectionRuleImmutableId]"
        },
    "dataType": "[variables('dataType')]",
    "auth": {
        "serviceAccountEmail": "[[parameters('GCPServiceAccountEmail')]",
        "projectNumber": "[[parameters('GCPProjectNumber')]",
        "workloadIdentityProviderId": "[[parameters('GCPWorkloadIdentityProviderId')]"
    },
    "request": {
        "projectId": "[[parameters('GCPProjectId')]",
        "subscriptionNames": [
            "[[parameters('GCPSubscriptionName')]"
            ]
        }
    }
}
```

For more information, see [Create GCP data connector REST API example](/rest/api/securityinsights/data-connectors/create-or-update?view=rest-securityinsights-2024-01-01-preview&tabs=HTTP#creates-or-updates-a-gcp-data-connector&preserve-view=true).
