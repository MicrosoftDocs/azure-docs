---
title: Data connector definitions reference for the Codeless Connector Platform
description: This article provides a supplemental reference for creating the connectorUIConfig JSON section for the Data Connector Definitions API as part of the Codeless Connector Platform.
services: sentinel
author: austinmccollum
ms.topic: reference
ms.date: 11/13/2023
ms.author: austinmc

---

# Data connector definitions reference for the Codeless Connector Platform

To create a data connector with the Codeless Connector Platform (CCP), use this document as a supplement to the [Microsoft Sentinel REST API for Data Connector Definitions](/rest/api/securityinsights/data-connector-definitions) reference docs. Specifically this reference document expands on the following details:

- `connectorUiConfig` - defines the visual elements and text displayed on the data connector page in Microsoft Sentinel.
- `connectionsConfig` - defines the template name, usually the dataConnectors ARM templates.

## Data connector definitions - Create or update

Reference the [Create Or Update](/rest/api/securityinsights/data-connector-definitions/create-or-update) operation in the REST API docs to find the latest stable or preview API version. The difference between the `create` and the `update` operation is the update requires the `etag` value.

**PUT** method
```http
https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroupName}}/providers/Microsoft.OperationalInsights/workspaces/{{workspaceName}}/providers/Microsoft.SecurityInsights/dataConnectorDefinitions/{{dataConnectorDefinitionName}}?api-version=
```

## URI parameters

For more information, see [Data Connector Definitions - Create or Update URI Parameters](/rest/api/securityinsights/data-connectors/create-or-update#uri-parameters)

|Name  | Description  |
|---------|---------|
| **dataConnectorDefinition** | The data connector definition must be a unique name and is the same as the `name` parameter in the [request body](#request-body).|
| **resourceGroupName** | The name of the resource group, not case sensitive.  |
| **subscriptionId** | The ID of the target subscription. |
| **workspaceName** | The *name* of the workspace, not the ID.<br>Regex pattern: `^[A-Za-z0-9][A-Za-z0-9-]+[A-Za-z0-9]$` |
| **api-version** | The API version to use for this operation. |

## Request body

The request body for creating a CCP data connector definition with the API has the following structure:

```json
{
    "kind": "Customizable",
    "properties": {
        "connectorUIConfig": {}, 
        "connectionsConfig": {}
    }
}
```

**dataConnectorDefinition** has the following properties:

|Name	|Required	|Type	|Description |
| ---- | ---- | ---- | ---- |
| **Kind** | True | String	|`Customizable` for API polling data connector or `Static` otherwise| 
|properties.**connectorUiConfig**	| True	|Nested JSON<br>[connectorUiConfig](#configure-your-connectors-user-interface) |The UI configuration properties of the data connector|
|properties.**connectionsConfig**	| Optional for `Customizable`	| Nested JSON<br>[connectionsConfig](#connections-configure-template-spec) |The template spec of the data connector|

## Configure your connector's user interface

This section describes the configuration options available to customize the user interface of the data connector page.

The following screenshot shows a sample data connector page, highlighted with numbers that correspond to notable areas of the user interface.

:::image type="content" source="media/create-codeless-connector/sample-data-connector-page.png" alt-text="Screenshot of a sample data connector page with sections labeled 1 through 9.":::

Each of the following elements of the `connectorUiConfig` section needed to configure the user interface correspond to the [CustomizableConnectorUiConfig](/rest/api/securityinsights/data-connector-definitions/create-or-update#customizableconnectoruiconfig) portion of the API.

|Field | Required | Type | Description | Screenshot notable area #|
| ---- | ---- | ---- | ---- | ---- |
| **title** | True | string | Title displayed in the data connector page | 1 |
| **id** | | string | Sets custom connector ID for internal usage | |
| **logo** | | string | Path to image file in SVG format. If no value is configured, a default logo is used. | 2 |
| **publisher** | True | string | The provider of the connector | 3 |
| **descriptionMarkdown** | True | string in markdown | A description for the connector with the ability to add markdown language to enhance it. | 4 |
| **sampleQueries** | True | Nested JSON<br>[sampleQueries](#samplequeries) | Queries for the customer to understand how to find the data in the event log. | |
| **graphQueries** | True | Nested JSON<br>[graphQueries](#graphqueries) | Queries that present data ingestion over the last two weeks.<br><br>Provide either one query for all of the data connector's data types, or a different query for each data type. | 5 |
| **graphQueriesTableName** | | Sets the name of the table the connector inserts data to. This name can be used in other queries by specifying `{{graphQueriesTableName}}` placeholder in `graphQueries` and `lastDataReceivedQuery` values.|
| **dataTypes** | True | Nested JSON<br>[dataTypes](#datatypes) | A list of all data types for your connector, and a query to fetch the time of the last event for each data type. | 6 |
| **connectivityCriteria** | True | Nested JSON<br>[connectivityCriteria](#connectivitycriteria) | An object that defines how to verify if the connector is connected. | 7 |
| **permissions** | True | Nested JSON<br>[permissions](#permissions) | The information displayed under the **Prerequisites** section of the UI, which lists the permissions required to enable or disable the connector. | 8 |
| **instructionSteps** | True | Nested JSON<br>[instructions](#instructionsteps) | An array of widget parts that explain how to install the connector, displayed on the **Instructions** tab. | 9 |

### connectivityCriteria

| Field | Required | Type | Description |
|---|---|---|---|
|Type | True | String | One of the two following options: `HasDataConnectors` – this value is best for API polling data connectors such as the CCP. The connector is considered connected with at least one active connection.<br><br>`isConnectedQuery` – this value is best for other types of data connectors. The connector is considered connected when the provided query returns data. | 
|Value | True when type is `isConnectedQuery` | String | A query to determine if data is received within a certain time period. For example: `CommonSecurityLog | where DeviceVendor == \"Vectra Networks\"\n| where DeviceProduct == \"X Series\"\n  | summarize LastLogReceived = max(TimeGenerated)\n | project IsConnected = LastLogReceived > ago(7d)"` |

### dataTypes

|Array Value  |Type  |Description  |
|---------|---------|---------|
| **name** | String | A meaningful description for the`lastDataReceivedQuery`, including support for the `graphQueriesTableName` variable. <br><br>Example: `{{graphQueriesTableName}}` |
| **lastDataReceivedQuery** | String | A KQL query that returns one row, and indicates the last time data was received, or no data if there are no results. <br><br>Example: `{{graphQueriesTableName}}\n | summarize Time = max(TimeGenerated)\n | where isnotempty(Time)` |

### graphQueries

Defines a query that presents data ingestion over the last two weeks.

Provide either one query for all of the data connector's data types, or a different query for each data type.

|Array Value  |Type  |Description  |
|---------|---------|---------|
|**metricName**     |   String      |  A meaningful name for your graph. <br><br>Example: `Total data received`       |
|**legend**     |     String    |   The string that appears in the legend to the right of the chart, including a variable reference.<br><br>Example: `{{graphQueriesTableName}}`      |
|**baseQuery**     | String        |    The query that filters for relevant events, including a variable reference. <br><br>Example: `TableName_CL | where ProviderName == "myprovider"` or `{{graphQueriesTableName}}` |

### instructionSteps

This section provides parameters that define the set of instructions that appear on your data connector page in Microsoft Sentinel and has the following structure:

```json
"instructionSteps": [
    {
        "title": "",
        "description": "",
        "instructions": [
        {
            "type": "",
            "parameters": {}
        }
        ],
        "innerSteps": {}
    }
]
```

|Array Property  |Type  |Description  |
|---------|---------|---------|
| **title**	| String | Optional. Defines a title for your instructions. |
| **description** | 	String	| Optional. Defines a meaningful description for your instructions. |
| **innerSteps**	| Array | Optional. Defines an array of inner instruction steps. |
| **instructions**  | Array of [instructions](#instructions) | Required. Defines an array of instructions of a specific parameter type. | 

#### instructions

Displays a group of instructions, with various parameters and the ability to nest more instructionSteps in groups.

| Type | Array property | Description |
|-----------|--------------|-------------|
| **OAuthForm** | [OAuthForm](#oauthform) | Connect with OAuth |
| **APIKey** | [APIKey](#apikey) | Add placeholders to the API secrets for your connector's UI configuration file. |
| **BasicAuth** | [BasicAuth](#apikey) | Same format as APIKey, but type is `BasicAuth` |
| **Textbox** | [Textbox](#textbox) | Basic text and labels |
| **ConnectionToggleButton** | [ConnectionToggleButton](#connectiontogglebutton) | Trigger the deployment of the DCR based on the connection information provided through placeholder parameters. |
| **CopyableLabel** | [CopyableLabel](#copyablelabel) | Shows a text field with a copy button at the end. When the button is selected, the field's value is copied.|
| **InfoMessage** | [InfoMessage](#infomessage) | Defines an inline information message.
| **InstructionStepsGroup** | [InstructionStepsGroup](#instructionstepsgroup) | Displays a group of instructions, optionally expanded or collapsible, in a separate instructions section.|
| **InstallAgent** | [InstallAgent](#installagent) | Displays a link to other portions of Azure to accomplish various installation requirements. |

#### OAuthForm

```json
"instructions": [
{
  "type": "OAuthForm",
  "parameters": {
    "clientIdLabel": "Client ID",
    "clientSecretLabel": "Client Secret",
    "connectButtonLabel": "Connect",
    "disconnectButtonLabel": "Disconnect"
  }          
}
]
```
#### Textbox

Here are some examples of the `Textbox` type. These examples correspond to the parameters used in the example `auth` section in [Data connectors reference for the Codeless Connector Platform](restapipoller-data-connector-reference.md#authentication-configuration).

```json
"instructions": [
{
  "type": "Textbox",
  "parameters": {
      {
        "label": "User name",
        "placeholder": "User name",
        "type": "text",
        "name": "username"
      }
  }
},
{
  "type": "Textbox",
  "parameters": {
      "label": "Secret",
      "placeholder": "Secret",
      "type": "password",
      "name": "password"
  }
}
]
```
#### ConnectionToggleButton

```json
"instructions": [
{
  "type": "ConnectionToggleButton",
  "parameters": {
    "label": "toggle",
    "name": "toggle"
  }          
}
]
```

#### APIKey

Create the configuration with placeholders parameters, to reuse across multiple connectors, or to create a connector with data that you don't currently have.

To create placeholder parameters, define another array named `userRequestPlaceHoldersInput` in the [Instructions](#instructions) section of your [CCP JSON configuration] file, using the following syntax:

```json
"instructions": [
{
  "type": "APIKey",
  "parameters": {
    "enable": "true",
    "userRequestPlaceHoldersInput": [
      {
        "displayText": "Organization Name",
        "requestObjectKey": "apiEndpoint",
        "placeHolderName": "apikey",
        "placeHolderValue": ""
      }
    ]
  }
}
]
```
The `userRequestPlaceHoldersInput` parameter includes the following attributes:

|Name  |Type  |Description  |
|---------|---------|---------|
|**DisplayText**     |  String       | Defines the text box display value, which is displayed to the user when connecting. |
|**RequestObjectKey** |String | Defines the ID in the request section of the **pollingConfig** to substitute the placeholder value with the user provided value. <br><br>If you don't use this attribute, use the `PollingKeyPaths` attribute instead. |
|**PollingKeyPaths** |String | Defines an array of [JsonPath](https://www.npmjs.com/package/JSONPath) objects that directs the API call to anywhere in the template, to replace a placeholder value with a user value.<br><br>**Example**: `"pollingKeyPaths":["$.request.queryParameters.test1"]` <br><br>If you don't use this attribute, use the `RequestObjectKey` attribute instead. |
|**PlaceHolderName** |String | Defines the name of the placeholder parameter in the JSON template file as a unique value, such as `apikey`. |

#### CopyableLabel

 Example:

:::image type="content" source="media/create-codeless-connector/copy-field-value.png" alt-text="Screenshot of a copy value button in a field.":::

**Sample code**:

```json
{
    "parameters": {
        "fillWith": [
            "WorkspaceId",
            "PrimaryKey"
            ],
        "label": "Here are some values you'll need to proceed.",
        "value": "Workspace is {0} and PrimaryKey is {1}"
    },
    "type": "CopyableLabel"
}
```

| Array Value  |Type  |Description  |
|---------------|------|-------------|
|**fillWith**     |  ENUM       | Optional. Array of environment variables used to populate a placeholder. Separate multiple placeholders with commas. For example: `{0},{1}`  <br><br>Supported values: `workspaceId`, `workspaceName`, `primaryKey`, `MicrosoftAwsAccount`, `subscriptionId` |
|**label**     |  String       |  Defines the text for the label above a text box.      |
|**value**     |  String       |  Defines the value to present in the text box, supports placeholders.       |
|**rows**     |   Rows      |  Optional. Defines the rows in the user interface area. By default, set to **1**.       |
|**wideLabel**     |Boolean         | Optional. Determines a wide label for long strings. By default, set to `false`.        |

#### InfoMessage

Here's an example of an inline information message:

:::image type="content" source="media/create-codeless-connector/inline-information-message.png" alt-text="Screenshot of an inline information message.":::

In contrast, the following image shows an information message that's not inline:

:::image type="content" source="media/create-codeless-connector/non-inline-information-message.png" alt-text="Screenshot of an information message that's not inline.":::

|Array Value  |Type  |Description  |
|---------|---------|---------|
|**text**     |    String     |   Define the text to display in the message.      |
|**visible**     |   Boolean      |    Determines whether the message is displayed.     |
|**inline**     |   Boolean      |   Determines how the information message is displayed. <br><br>- `true`: (Recommended) Shows the information message embedded in the instructions. <br>- `false`: Adds a blue background.     |

#### InstructionStepsGroup

Here's an example of an expandable instruction group:

:::image type="content" source="media/create-codeless-connector/accordion-instruction-area.png" alt-text="Screenshot of an expandable, extra instruction group.":::

|Array Value  |Type  |Description  |
|---------|---------|---------|
|**title**     |    String     |  Defines the title for the instruction step.       |
|**canCollapseAllSections**     |  Boolean       |  Optional. Determines whether the section is a collapsible accordion or not.       |
|**noFxPadding**     |   Boolean      |  Optional. If `true`, reduces the height padding to save space.       |
|**expanded**     |   Boolean      |   Optional. If `true`, shows as expanded by default.      |

For a detailed example, see the configuration JSON for the [Windows DNS connector](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Windows%20Server%20DNS/Data%20Connectors/template_DNS.JSON).

#### InstallAgent

Some **InstallAgent** types appear as a button, others appear as a link. Here are examples of both:

:::image type="content" source="media/create-codeless-connector/link-by-button.png" alt-text="Screenshot of a link added as a button.":::

:::image type="content" source="media/create-codeless-connector/link-by-text.png" alt-text="Screenshot of a link added as inline text.":::

|Array Values  |Type  |Description  |
|---------|---------|---------|
|**linkType**     |   ENUM      |  Determines the link type, as one of the following values: <br><br>`InstallAgentOnWindowsVirtualMachine`<br>`InstallAgentOnWindowsNonAzure`<br> `InstallAgentOnLinuxVirtualMachine`<br> `InstallAgentOnLinuxNonAzure`<br>`OpenSyslogSettings`<br>`OpenCustomLogsSettings`<br>`OpenWaf`<br> `OpenAzureFirewall` `OpenMicrosoftAzureMonitoring` <br> `OpenFrontDoors` <br>`OpenCdnProfile` <br>`AutomaticDeploymentCEF` <br> `OpenAzureInformationProtection` <br> `OpenAzureActivityLog` <br> `OpenIotPricingModel` <br> `OpenPolicyAssignment` <br> `OpenAllAssignmentsBlade` <br> `OpenCreateDataCollectionRule`       |
|**policyDefinitionGuid**     | String        |  Required when using the **OpenPolicyAssignment** linkType. For policy-based connectors, defines the GUID of the built-in policy definition.        |
|**assignMode**     |   ENUM      |   Optional. For policy-based connectors, defines the assign mode, as one of the following values: `Initiative`, `Policy`      |
|**dataCollectionRuleType**     |  ENUM       |   Optional. For DCR-based connectors, defines the type of data collection rule type as either `SecurityEvent`, or `ForwardEvent`.     |

### permissions

|Array value  |Type  |Description  |
|---------|---------|---------|
| **customs** | String | Describes any custom permissions required for your data connection, in the following syntax: <br>`{`<br>`"name":`string`,`<br>`"description":`string<br>`}` <br><br>Example: The **customs** value displays in Microsoft Sentinel **Prerequisites** section with a blue informational icon. In the GitHub example, this value correlates to the line  **GitHub API personal token Key: You need access to GitHub personal token...** |
| **licenses** | ENUM | Defines the required licenses, as one of the following values: `OfficeIRM`,`OfficeATP`, `Office365`, `AadP1P2`, `Mcas`, `Aatp`, `Mdatp`, `Mtp`, `IoT` <br><br>Example: The **licenses** value displays in Microsoft Sentinel as: **License: Required Azure AD Premium P2**|
| **resourceProvider**	| [resourceProvider](#resourceprovider) | Describes any prerequisites for your Azure resource. <br><br>Example: The **resourceProvider** value displays in Microsoft Sentinel **Prerequisites** section as: <br>**Workspace: read and write permission is required.**<br>**Keys: read permissions to shared keys for the workspace are required.**|
| **tenant** | array of ENUM values<br>Example:<br><br>`"tenant": [`<br>`"GlobalADmin",`<br>`"SecurityAdmin"`<br>`]`<br> | Defines the required permissions, as one or more of the following values: `"GlobalAdmin"`, `"SecurityAdmin"`, `"SecurityReader"`, `"InformationProtection"` <br><br>Example:  displays the **tenant** value in Microsoft Sentinel as: **Tenant Permissions: Requires `Global Administrator` or `Security Administrator` on the workspace's tenant**|

#### resourceProvider

|sub array value |Type  |Description  |
|---------|---------|---------|
| **provider** | 	ENUM	| Describes the resource provider, with one of the following values: <br>- `Microsoft.OperationalInsights/workspaces` <br>- `Microsoft.OperationalInsights/solutions`<br>- `Microsoft.OperationalInsights/workspaces/datasources`<br>- `microsoft.aadiam/diagnosticSettings`<br>- `Microsoft.OperationalInsights/workspaces/sharedKeys`<br>- `Microsoft.Authorization/policyAssignments` |
| **providerDisplayName** | 	String	| A list item under **Prerequisites** that displays a red "x" or green checkmark when the **requiredPermissions** are validated in the connector page. Example, `"Workspace"` |
| **permissionsDisplayText** | 	String	| Display text for *Read*, *Write*, or *Read and Write* permissions that should correspond to the values configured in **requiredPermissions** |
| **requiredPermissions** | `{`<br>`"action":`Boolean`,`<br>`"delete":`Boolean`,`<br>`"read":`Boolean`,`<br>`"write":`Boolean<br>`}` | Describes the minimum permissions required for the connector. |
| **scope** | 	ENUM	 | Describes the scope of the data connector, as one of the following values: `"Subscription"`, `"ResourceGroup"`, `"Workspace"` |

### sampleQueries

|array value  |Type  |Description  |
|---------|---------|---------|
| **description** | String | A meaningful description for the sample query.<br><br>Example: `Top 10 vulnerabilities detected` |
| **query** | String | Sample query used to fetch the data type's data. <br><br>Example: `{{graphQueriesTableName}}\n | sort by TimeGenerated\n | take 10` |

### Configure other link options

To define an inline link using markdown, use the following example.

```json
{
   "title": "",
   "description": "Make sure to configure the machine's security according to your organization's security policy\n\n\n[Learn more >](https://aka.ms/SecureCEF)"
}
```

To define a link as an ARM template, use the following example as a guide:

```json
{
   "title": "Azure Resource Manager (ARM) template",
   "description": "1. Click the **Deploy to Azure** button below.\n\n\t[![Deploy To Azure](https://aka.ms/deploytoazurebutton)]({URL to custom ARM template})"
}
```

## Connections configure template spec

This object includes the template spec name and version of the different connections of the data connector.

|Field |Required |Type |Description |
|---|---|---|---|
| **TemplateSpecName** |	True  |String | The name of the template spec which contains the data connector connections. The template includes ARM templates created by the connector, usually the dataConnectors ARM templates.<br><br>Example: `/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.Resources/templateSpecs/dataConnectorTemplateSpecName2`|
| **TemplateSpecVersion** | True | String | The version of the template spec which contains the data connectors connections. The format of the version is "major.minor.patch" (for example, "1.0.0") |

## Example data connector definition

The following example brings together some of the components defined in this article as a JSON body format to use with the [Create Or Update](/rest/api/securityinsights/data-connector-definitions/create-or-update) data connector API.

For more examples of the `connectorUiConfig` review [other CCP data connectors](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors#codeless-connector-platform-ccp-preview--native-microsoft-sentinel-polling). Even connectors using the legacy CCP have valid examples of the UI creation.

```json
{
    "kind": "Customizable",
    "properties": {
        "connectorUiConfig": {
          "title": "Example CCP Data Connector",
          "publisher": "My Company",
          "descriptionMarkdown": "This is an example of data connector",
          "graphQueriesTableName": "ExampleConnectorAlerts_CL",
          "graphQueries": [
            {
              "metricName": "Alerts received",
              "legend": "My data connector alerts",
              "baseQuery": "{{graphQueriesTableName}}"
            },   
           {
              "metricName": "Events received",
              "legend": "My data connector events",
              "baseQuery": "ASIMFileEventLogs"
            }
          ],
            "sampleQueries": [
            {
                "description": "All alert logs",
                "query": "{{graphQueriesTableName}} \n | take 10"
            }
          ],
          "dataTypes": [
            {
              "name": "{{graphQueriesTableName}}",
              "lastDataReceivedQuery": "{{graphQueriesTableName}} \n | summarize Time = max(TimeGenerated)\n | where isnotempty(Time)"
            },
             {
              "name": "ASIMFileEventLogs",
              "lastDataReceivedQuery": "ASIMFileEventLogs \n | summarize Time = max(TimeGenerated)\n | where isnotempty(Time)"
             }
          ],
          "connectivityCriteria": [
            {
              "type": "HasDataConnectors"
            }
          ],
          "permissions": {
            "resourceProvider": [
              {
                "provider": "Microsoft.OperationalInsights/workspaces",
                "permissionsDisplayText": "Read and Write permissions are required.",
                "providerDisplayName": "Workspace",
                "scope": "Workspace",
                "requiredPermissions": {
                  "write": true,
                  "read": true,
                  "delete": true
                }
              },
            ],
            "customs": [
              {
                "name": "Example Connector API Key",
                "description": "The connector API key username and password is required"
              }
            ] 
        },
          "instructionSteps": [
            {
              "title": "Connect My Connector to Microsoft Sentinel",
              "description": "To enable the connector provide the required information below and click on Connect.\n>",
              "instructions": [
               {
                  "type": "Textbox",
                  "parameters": {
                    "label": "User name",
                    "placeholder": "User name",
                    "type": "text",
                    "name": "username"
                  }
                },
                {
                  "type": "Textbox",
                  "parameters": {
                    "label": "Secret",
                    "placeholder": "Secret",
                    "type": "password",
                    "name": "password"
                  }
                },
                {
                  "parameters": {
                    "label": "toggle",
                    "name": "toggle"
                  },
                  "type": "ConnectionToggleButton"
                }
              ]
            }
          ]
        }
    }
}
```