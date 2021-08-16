---
title: Create a codeless connector for Azure Sentinel
description: Learn how to create a codeless connector in Azure Sentinel using the Codeless Connector Platform (CCP).
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 08/16/2021
---

# Create a codeless connector for Azure Sentinel (Public preview)

> [!IMPORTANT]
> The Codeless Connector Platform (CCP) is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

This article describes how to create a codeless connector for Azure Sentinel using the Codeless Connector Platform (CCP).

The Codeless Connector Platform (CCP) provides a JSON configuration file that can be used by both customers and partners to create a connector, including both the back-end connection and the user interface displayed in Azure Sentinel. Deploy the connector to your own Azure Sentinel workspace via an ARM template or an API call, or as a solution to Azure Sentinel's solution's gallery.

Connectors created using the CCP are fully SaaS, without any requirements for service installations, and also include health monitoring and full support from Azure Sentinel.

> [!NOTE]
> - The CCP supports connections that can be polled via REST API and provide a JSON log format. Data connetions require a publicly accessibly REST API endpoint.
>
> - Issues due to authentication errors or the data source's REST API availability are the customers' responsibility. Azure Sentinel provides built-in health data, and you can open a support ticket to request detailed health audit records as needed.
>

## Data source authentication

Codeless data connectors pull data from publicly accessible APIs. To pull data, Azure Sentinel must authenticate to the data source service using an authentication method supported by both the data source's API and the CCP.

Authentication data isn't included in the codeless connector's configuration, but provided when you connect your data connector from Azure Sentinel. This connection is performed using the [CONNECT](#connect) action, with connection data stored in an encrypted keystore residing in the customer region.

Supported authentication methods include:

- **Basic authentication**. Passes a username and password to authenticate to the REST API.

- **API key**. Provides an API key to the API.

- **OAuth2**. Uses an open standard for access delegation intended to grant access from applications to an API without supporting the actual authentication data.

    Using OAuth2 requires app registration, authentication, and then getting a token and access by the application using the registration and authentication data. When connecting a codeless data connector, register Azure Sentinel as your application, and then interact directly with your data source's API authentication process for the required keys. Provide the keys to the connector when you need to connect.

For more information, see [Connect to your data connector from Azure Sentinel](#connect-to-your-data-connector-from-azure-sentinel).


## Supported REST API actions

This section describes the API actions supported by the CCP, and the REST API endpoints provided to manage the connector:

### GET

Retrieves the connector configuration file for the specified connector ID.

**Method**: GET

**Endpoint URL**:

```rest
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/providers/Microsoft.SecurityInsights/dataConnectors/{connector-name-GUID}/?api-version={apiVersion}`
```

### UPSERT

Creates a new connector, or updates an existing connector, for the specified connector ID. New connectors are created by pushing the connector configuration in the body of the UPSERT action.

**Method**: PUT

**Endpoint URL**:

```rest
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/providers/Microsoft.SecurityInsights/dataConnectors/{connector-name-GUID}/?api-version={apiVersion}
```

### CONNECT

Initiates the connector data pulling mechanism for the specified connector ID. Connect using credentials, by passing configurations, or by using UI.

**Method**: POST

**Endpoint URL**:

```rest
subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/providers/Microsoft.SecurityInsights/dataConnectors/{connector-name-GUID}/connect?api-version={apiVersion}
```

### DISCONNECT

Deactivates the connector specified by the connector ID.

**Method**: POST

**Endpoint URL**:

```rest
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/providers/Microsoft.SecurityInsights/dataConnectors/{connector-name-GUID}/disconnect?api-version={apiVersion}
```

### DELETE

**Method**: DELETE

Deletes a connector specified by the connector ID.

```rest
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/providers/Microsoft.SecurityInsights/dataConnectors/{connector-name-GUID}/?api-version={apiVersion}
```

For more information, see the [DataConnectors.json](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/securityinsights/resource-manager/Microsoft.SecurityInsights/stable/2020-01-01/DataConnectors.json) file in the Azure REST API specs GitHub repository.


## Connector configuration

The following code shows the basic syntax of the CCP configuration file:

```rest
{
    "kind": "APIPolling",
    "properties": {
        "connectorUiConfig": {...
        },
        "pollingConfig": {...
        }
    }
}
```

Your connector uses the `connectorUiConfig` section to define the visual elements and text displayed on the data connector page in Azure Sentinel, and the `pollingConfig` section to define how Azure Sentinel collects data from your data source.

For more information, see:

- [User interface configuration](#user-interface-configuration)
- [Polling configuration](#polling-configuration)

## User interface configuration

This section describes the configuration for how the user interface on the data connector page appears in Azure Sentinel.

Each data connector page in Azure Sentinel has the following areas, configured using the `connectorUiConfig` section of the [data connector configuration file](#connector-configuration).

- **Title**: The title displayed for your data connector

- **Icon**: The icon displayed for your data connector

- **Status**: Displays whether or not your data connector is connected to Azure Sentinel

- **Data charts**: Displays relevant queries and the amount of ingested data in the last two weeks.

- **Instructions tab**: Includes the following sections:
    - Prerequisites: A list of minimal validations before the user can enable the connector.
    - Instructions: A list of instructions to guide the user in enabling the connector. This section can include text, buttons, forms, tables, and other common widgets to simplify the process.

- **Next steps tab**: Includes useful information for understanding how to find data in the event logs, such as sample queries.

The `connectorUiConfig` section of the configuration file includes the following properties:

|Name  |Type  |Description  |
|---------|---------|---------|
|**id**     |  GUID       |  A distinct ID for the connector       |
|**title**     |  String       |Title displayed in the data connector page         |
|**publisher**     |    String     |  Your company name       |
|**descriptionMarkdown**     |  String, in markdown       |   A description for the connector      |
|**additionalRequirementBanner**     |   String, in markdown      |    Text for the **Prerequisites** section of the **Instructions** tab     |
|**graphQueries**     |   [GraphQuery[]](#graphquery)      |   Queries that present data ingestion over the last two weeks in the **Data charts** pane.<br><br>Provide either one query for all of the data connector's data types, or a different query for each data type.     |
|**sampleQueries**     | [SampleQuery[]](#samplequery)       | Sample queries for the customer to understand how to find the data in the event log, to be displayed in the **Next steps** tab.        |
|**dataTypes**     | [DataTypes[]](#datatypes)        | A list of all data types for your connector, and a query to fetch the time of the last event for each data type.        |
|**connectivityCriterias**     |   [ConnectivityCriteria[]](#connectivitycriteria)      |An object that defines how to verify if the connector is correctly defined.          |
|**availability**     | `{`<br>`  status: Number,`<br>`  isPreview: Boolean`<br>`}`        |  One of the following values: <br><br>- **1**: Connector is available to customers <br>- **isPreview**: Indicates that the connector is not yet generally available.       |
|**permissions**     | [RequiredConnectorPermissions[]](#requiredconnectorpermissions)        | Lists the permissions required to enable or disable the connector.        |
|**instructionsSteps**     | [InstructionStep[]](#instructionstep)        |     An array of widget parts that explain how to install the connector, displayed on the **Instructions** tab.    |
|**metadata**     |   [Metadata](#metadata)      |  ARM template metadata, for deploying the connector as an ARM template.       |
|     |         |         |

### GraphQuery

|Name  |Type  |Description  |
|---------|---------|---------|
|**metricName**     |   String      |  A meaningful name for your graph       |
|**legend**     |     String    |   The string that appears in the legend to the right of the chart      |
|**baseQuery**     | String        |    The query that filters for relevant events. For example: `TableName | where ProviderName == “myprovider”`     |
|     |         |         |


### SampleQuery

|Name  |Type  |Description  |
|---------|---------|---------|
| **Description** | String | A meaningful description for the sample query |
| **Query** | String | Sample query used to fetch the data type's data |
| | | |

### DataTypes

|Name  |Type  |Description  |
|---------|---------|---------|
| **dataTypeName** | String | A meaningful description for the`lastDataReceivedQuery` query |
| **lastDataReceivedQuery** | String | A query that returns one row, and indicates the last time data was received, or no data if there is no relevant data.
| | | |

For example:

```kql
TableName
| summarize Time = max(TimeGenerated)
| where isnotempty(Time)`
```

### ConnectivityCriteria

|Name  |Type  |Description  |
|---------|---------|---------|
| **type** | ENUM | Always use `SentinelKindsV2` |
| **value** | deprecated |<!--unclear about this one, seems identical to above?--> |
| | | |

For example:

```kql
TableName
| summarize Time = max(TimeGenerated)
| where isnotempty(Time)
```
 

### RequiredConnectorPermissions

|Name  |Type  |Description  |
|---------|---------|---------|
| **tenant** | ENUM | Lists required permissions as one or more of the following values: `GlobalAdmin`, `SecurityAdmin`,  `SecurityReader`, `InformationProtection` <br><br>For example, the **tenant** value displays displays in Azure Sentinel as: **Tenant Permissions: Requires `Global Administrator` or `Security Administrator` on the workspace's tenant**|
| **licenses** | ENUM | Lists required licenses as one of the following values: `OfficeIRM`,`OfficeATP`, `Office365`, `AadP1P2`, `Mcas`, `Aatp`, `Mdatp`, `Mtp`, `IoT` <br><br>For example, the **licenses** value displays in Azure Sentinel as: **License: Required Azure AD Premium P2**|
| **customs** | `{`<br>`  name:string,`<br>` description:string`<br>`}` | Description of any custom permissions required for your data connection. <br><br>For example, the **customs** value displays in Azure Sentinel as: **Subscription: Contributor permissions to the subscription of your IoT Hub.** |
| **resourceProvider**	| [ResourceProviderPermissions](#resourceproviderpermissions) | Description of prerequisites for your Azure resource. <br><br>For example, the **resourceProvider** value displays in Azure Sentinel as: <br>**Workspace: write permission is required. **<br>**Keys: read permissions to shared keys for the workspace are required.**|
| | |

#### ResourceProviderPermissions

|Name  |Type  |Description  |
|---------|---------|---------|
| **provider** | 	ENUM	| Resource provider, one of the following values: <br>`Microsoft.OperationalInsights/workspaces` <br>`Microsoft.OperationalInsights/solutions`<br>`Microsoft.OperationalInsights/workspaces/datasources`<br>`microsoft.aadiam/diagnosticSettings`<br>`Microsoft.OperationalInsights/workspaces/sharedKeys`<br>`Microsoft.Authorization/policyAssignments` |
| **providerDisplayName** | 	String	| Query that should return one row, indicating the last time that data was received, or no data if there is no relevant data. |
| **permissionsDisplayText** | 	String	| Display text for *Read*, *Write*, or *Read and Write* permissions |
| **requiredPermissions** | 	[RequiredPermissionSet](#requiredpermissionset) | Describes the minimum permissions required for the connector. One of the following values: `read`, `write`, `delete`, `action` |
| **Scope** | 	ENUM	 | One of the following values: `Subscription`, `ResourceGroup`, `Workspace` |
| | | |

### RequiredPermissionSet

|Name  |Type  |Description  |
|---------|---------|---------|
|**read**	| boolean | Determines whether *read* permissions are required |
| **write** | boolean | Determines whether *write* permissions are required |
| **delete** | boolean | Determines whether *delete* permissions are required |
| **action** | 	boolean	| Determines whether *action* permissions are required |
| | | |

### Metadata

|Name  |Type  |Description  |
|---------|---------|---------|
| **id** | 	String | <!--description--> |
| **kind** 	| String | 	`dataConnector`<!--description--> |
| **source** | 	`{`<br>`  kind:string`<br>`  name:string`<br>`}`|<!--description-->|
| **author** | `{`<br>`  name:string`<br>`}`| <!--description-->|
| **support** |	`{`<br>`      "tier": string,`<br>`      "name": string,`<br>`"email": string,`<br>      `"link": string`<br>`    }`| <!--description-->|
| | | |

### InstructionStep

|Name  |Type  |Description  |
|---------|---------|---------|
| **title**	| String | A title for your instructions (optional) |
| **description** | 	String	| A meaningful description for your instructions (optional) |
| **instructions** |	[ConnectorInstructionModelBase[]](#connectorinstructionmodelbase---abstract-type)	| An array of instruction widgets |
| **innerSteps**	| [InstructionStep[]](#instructionstep) | An array of inner instruction steps (Optional) |
| **bottomBorder** | 	Boolean	| When `true`, adds a bottom border to the instructions area on the connector page in Azure Sentinel |
| **isComingSoon** |	Boolean	| When `true`, adds a **Coming soon** title on the connector page in Azure Sentinel |
| | | |

#### ConnectorInstructionModelBase - abstract type

|Name  |Type  |Description  |
|---------|---------|---------|
| **type** | 	ENUM	| A widget type as listed in [Supported widgets](#supported-widgets). |
| **parameters** | 	T	| Parameters required by each widget, as listed in [Supported widgets](#supported-widgets). |
| | | |

#### Supported widgets

The following widgets are implemented in the [ConnectorInstructionModelBase- abstract type](#connectorinstructionmodelbase---abstract-type) attribute.

|Type  |Parameters Object  |Description  |
|---------|---------|---------|
|**[CopyableLabel](#copyablelabel)**     |`CopyableLabelInstructionParameters`         | Code block with a *Copy* button        |
|**OmsSolution**     |         |         |
|**InstallAgent**     |         |         |
|**InstructionStepsGroup**     | `InstructionStepsGroupModelParameters`  |         |
|**[InfoMessage](#infomessage)**     | `InfoMessageInstructionModelParameters`        |         |
|**OmsDatasource**     |         |         |
|**AwsS3**     |         |         |
|**OAuth2**     |    `OAuthInstructionModelParameters`     |The parameters required to authenticate with OAuth2         |
|**BasicAuth**     |   `BasicAuthInstructionParameters`      |         |
|**APIKey**     |  `ApiKeyAuthInstructionParameters`       |  An array of API keys       |
|**[LinkInstructionModel](#linkinstructionmodel)**     | `LinkInstructionModelParameters`        | Links to another page in the Azure portal, displayed as a button or a link. |
|     |         |         |

#### CopyableLabel

Shows a field with a button on the right to copy the field value. For example:

:::image type="content" source="media/create-codeless-connector/copy-field-value.png" alt-text="Screenshot of a copy value button in a field.":::

**Sample code**:

```json
Implementation:
instructions: [
                new CopyableLabelInstructionModel({
                    fillWith: [“MicrosoftAwsAccount”],
                    label: “Microsoft Account ID”,
                }),
                new CopyableLabelInstructionModel({
                    fillWith: [“workspaceId”],
                    label: “External ID (WorkspaceId)”,
                }),
            ]
```
 
**Parameters**: `CopyableLabelInstructionParameters`

|Name  |Type  |Description  |
|---------|---------|---------|
|**fillWith**     |  ENUM []       | Optional. Array of environment variables used to populate a placeholder. Separate multiple placeholders with commas. For example: `{0},{1}`  <br><br>Supported values: `workspaceId`, `workspaceName`, `primaryKey`, `MicrosoftAwsAccount`, `subscriptionId`      |
|**label**     |  String       |   The label above the text box      |
|**value**     |  String       |  The value to present, supports placeholders       |
|**rows**     |   Rows      |  Optional. Defines the rows in the user interface area. By default, set to **1**.       |
|**wideLabel**     |Boolean         | Optional. Determines a wide label for long strings. By default, set to `false`.        |
|    |         |         |


#### InfoMessage

Defines an inline information message. For example:

:::image type="content" source="media/create-codeless-connector/inline-information-message.png" alt-text="Screenshot of an inline information message.":::

In contrast, the following image shows a *non*-inline information message:

:::image type="content" source="media/create-codeless-connector/non-inline-information-message.png" alt-text="Screenshot of a non-inline information message.":::

**Sample code**:

```json
instructions: [
                new InfoMessageInstructionModel({
                    text:”Microsoft Defender for Endpoint… “,
                    visible: true,
                    inline: true,
                }),
                new InfoMessageInstructionModel({
                    text:”In order to export… “,
                    visible: true,
                    inline: false,
                }),

            ]
```
**Parameters**: `InfoMessageInstructionModelParameters`


|Name  |Type  |Description  |
|---------|---------|---------|
|**text**     |    String     |   The text to display in the message.      |
|**visible**     |   Boolean      |    Determines whether the message is displayed.     |
|**inline**     |   Boolean      |   Setting to `true` shows the information message embedded in the instructions (recommended). Setting to `false` adds a blue background.     |
|     |         |         |



#### LinkInstructionModel

Displays a link to other pages in the Azure portal, as a button or a link. For example:

:::image type="content" source="media/create-codeless-connector/link-by-button.png" alt-text="Screenshot of a link added as a button.":::

:::image type="content" source="media/create-codeless-connector/link-by-text.png" alt-text="Screenshot of a link added as inline text.":::

**Sample code**:

```json
new LinkInstructionModel({linkType: “OpenPolicyAssignment”, policyDefinitionGuid: <GUID>, assignMode = “Policy”})

new LinkInstructionModel({ linkType: LinkType.OpenAzureActivityLog } )
```

**Parameters**: `InfoMessageInstructionModelParameters`

|Name  |Type  |Description  |
|---------|---------|---------|
|**linkType**     |   ENUM      |  One of the following values: <br><br>`InstallAgentOnWindowsVirtualMachine`<br>`InstallAgentOnWindowsNonAzure`<br> `InstallAgentOnLinuxVirtualMachine`<br> `InstallAgentOnLinuxNonAzure`<br>`OpenSyslogSettings`<br>`OpenCustomLogsSettings`<br>`OpenWaf`<br> `OpenAzureFirewall` `OpenMicrosoftAzureMonitoring` <br> `OpenFrontDoors` <br>`OpenCdnProfile` <br>`AutomaticDeploymentCEF` <br> `OpenAzureInformationProtection` <br> `OpenAzureActivityLog` <br> `OpenIotPricingModel` <br> `OpenPolicyAssignment` <br> `OpenAllAssignmentsBlade` <br> `OpenCreateDataCollectionRule`       |
|**policyDefinitionGuid**     | String        |  Optional. For policy-based connectors, the GUID of the built-in policy definition.        |
|**assignMode**     |   ENUM      |   Optional. For policy-based connectors, the assign mode. One of the following values: `Initiative`, `Policy`      |
|**dataCollectionRuleType**     |  ENUM       |   Optional. For DCR-based connectors. One of the following: `SecurityEvent`,  `ForwardEvent`       |
|     |         |         |

To define an inline link using markdown, use the following example as a guide:

```markdown
<value>Follow the instructions found on article [Connect Azure Sentinel to your threat intelligence platform]({0}). Once the application is created you will need to record the Tenant ID, Client ID and Client Secret.</value>
```

The code sample listed above shows an inline link that looks like the following image:

:::image type="content" source="media/create-codeless-connector/sample-markdown-link-text.png" alt-text="Screenshot of the link text created by the earlier sample markdown.":::

To define a link as an ARM template, use the following example as a guide:

```markdown
    <value>1. Click the **Deploy to Azure** button below.
[![Deploy To Azure]({0})]({1})
```

The code sample listed above shows a link button that looks like the following image:

 :::image type="content" source="media/create-codeless-connector/sample-markdown-link-button.png" alt-text="Screenshot of the link button created by the earlier sample markdown.":::
#### Instruction steps group

Displays a group of instructions, expandable (accordion) or non-expandable, separate from the main instructions section.

For example:

:::image type="content" source="media/create-codeless-connector/accordion-instruction-area.png" alt-text="Screenshot of an expandable, extra instruction group.":::

**Parameters**: `InstructionStepsGroupModelParameters`

|Name  |Type  |Description  |
|---------|---------|---------|
|**title**     |    String     |         |
|**instructionSteps**     |  [InstructionStep[]](#instructionstep)       | An array of inner instruction steps (Optional)        |
|**canCollapseAllSections**     |  Boolean       |  Optional. Determines whether the section is a collapsible accordion or not.       |
|**noFxPadding**     |   Boolean      |  Optional. If `true`, reduces the height padding to save space.       |
|**expanded**     |   Boolean      |   Optional. If `true`, shows as expanded by default.      |
|     |         |         |



## Polling configuration

This section describes the configuration for how data is polled from your data source for a codeless data connector.

The following code shows the syntax of the `pollingConfig` section of the [CCP configuration](#connector-configuration) file.

```rest
"pollingConfig": {
    auth": {
        "authType": <string>,
    },
    "request": {…
    },
    "response": {…
    },
    "paging": {…
    }
 }
```

The `pollingConfig` section includes the following properties:

|Name  |Description  |Options  |
|---------|---------|---------|
|**id**     |   Uniquely identifies a rule / configuration entry, using one of the following values: <br><br>- A GUID (recommended) <br>- A document ID, if the data source resides in a Cosmos DB       |  Mandatory, string       |
|**auth**     |   Describes the authentication properties for polling the data.     |    For more information, see  [auth configuration](#auth-configuration).   |
|<a name="authtype"></a>**auth.authType**     |   Defines the type of authentication, nested inside the `auth` object.       |  Mandatory, supports the following values: `Basic`, `APIKey`, `OAuth2`, `Session`        |
|**request**     |  Describes the request payload for polling the data, such as the API endpoint.       | Mandatory, nested JSON. For more information, see [request configuration](#request-configuration).         |
|**response**     |  Describes the response object and nested message returned from the API when polling the data.      |    Mandatory, nested JSON. For more information, see [response configuration](#response-configuration).     |
|**paging**     |  Describe tha pagination payload when polling the data.       | Optional, nested JSON. For more information, see [paging configuration](#paging-configuration).         |
|**TargetExtra**     |   Data enrichments for polled data, as relevant.       | Optional, nested JSON. For more information, see [targetExtra configuration](#targetextra-configuration).        |
|     |         |         |

For more information, see [Sample pollingConfig code](#sample-pollingconfig-code).

### auth configuration

The `auth` section of the `[pollingConfig](#polling-configuration)` configuration includes the following parameters, depending on the type defined in the [authType](#authtype) element:

#### APIKey authType parameters

|Name  |Description  |Options  |
|---------|---------|---------|
|**APIKeyName**     |Defines the name of your API key as one of the following values: <br><br>- `XAuthToken` <br>- `Authorization`        | Optional, string        |
|**IsAPIKeyInPostPayload**     |    <!--description-->     |   Boolean: false/true      |
|**APIKeyIdentifier**     |  Defines the name of the identifier for the API key. <br><br>For example, where the authorization is defined as  `"Authorization": "token <secret>"`, this parameter is defined as: `{APIKeyIdentifier: “token”})`     |   Optional, string      |
| | | |

#### Session authType parameters

|Name  |Description  |Options  |
|---------|---------|---------|
|**QueryParameters**     |     <!--description-->      |   Optional, string      |
|**IsPostPayloadJson**     |    <!--should options be boolean?-->Define this parameter as `true` if the query parameters are in JSON format       |   Optional, string      |
|**Headers**     |    Header used when calling the endpoint to get the session ID, and when calling the endpoint API.     |   <!---tbd-->      |
|**SessionTimeoutInMinutes**     |    <!--description-->     |  Optional, string       |
|**SessionIdName**     |    <!--description-->     |      Optional, string   |
|**SessionLoginRequestUri**     |  <!--description-->       |   Optional, string      |
| | | |


#### OAuth2 authType parameters

|Name  |Description  |Options  |
|---------|---------|---------|
|**AccessToken** |<!--description--> |Optional, string |
|**RefreshToken** |<!--description--> |Optional, string |
|**TokenEndpoint** |<!--description--> | Optional, string|
|**AuthorizationEndpoint** |<!--description--> | Optional, string|
|**RedirectionEndpoint** |<!--description--> | Optional, string|
| **AccessTokenExpirationDateTimeInUtc**|<!--description--> | Optional, string|
| **RefreshTokenExpirationDateTimeInUtc**|<!--description--> | Optional, string|
|**TokenEndpointHeaders** | <!--description-->| Optional, string|
|**AuthorizationEndpointHeaders** |<!--description--> | Optional, string|
|**AuthorizationEndpointQueryParameters** | <!--description-->| Optional, string in the following syntax: `{<attr_name>: <val>}`|
|**TokenEndpointQueryParameters** | <!--description-->| Optional, string in the following syntax: `{<attr_name>: <val>}`|
|**IsTokenEndpointPostPayloadJson** | If true, determines that query parameters are in JSON format | Optional, boolean|
| **IsClientSecretInHeader**| If true, when the **client_id** and **client_secret** is defined in the header, as in the Basic authentication schema instead of in the POST payload| Optional, boolean|
|**RefreshTokenLifetimeinSecAttributeName** |The attribute name from the token endpoint response, specifying the lifetime of the refresh token, in seconds | Optional, string in the following syntax: `{<attr_name>: <val>}`|
|**IsJwtBearFlow** | Set to `true` if using JWT | Optional, boolean|
|**JwtHeaderInJson** |<!--description--> | Optional, string in the following syntax: `{<attr_name>: <val>}`|
|**JwtClaimsInJson** | <!--description-->| Optional, string in the following syntax: `{<attr_name>: <val>}`|
|**JwtPem** |<!--description--> | Optional, a secret key in PEM Pkcs8 format|
| | | |


### request configuration

The `request` section of the [pollingConfig](#polling-configuration) configuration includes the following parameters:

|Name  |Description  |Options  |
|---------|---------|---------|
|**apiEndpoint**     |   The endpoint to pull data from.      |   Mandatory, string      |
|**httpMethod**     | The API method: `GET` or `POST`       |    Mandatory, string.     |
|**queryTimeFormat**     |   The format used to define the query time.      |    Mandatory, string     |
|**startTimeAttributeName**     |  The name of the attribute that defines the query start time.        |   Mandatory<sup>*</sup>, string      |
|**endTimeAttributeName**     |   The name of the attribute that defines the query end time.      |   Mandatory<sup>*</sup>, string      |
|**queryTimeIntervalAttributeName**     |  The name of the attribute that defines the query time interval       |  Optional, string       |
|**queryTimeIntervalDelimiter**     |    The query time interval delimiter     |   Optional, string      |
|**queryWindowInMin**     |  The available query window, in minutes       |  Optional, string <br><br>Minimum: 5 minutes       |
|**queryParameters**     |   Parameters passed in the query (`eventsJsonPaths`)     |   Optional, string in the following syntax:  `dictionary<string, string>`     |
|**queryParametersTemplate**     | The query parameters template, to use when passing query parameters in advanced scenarios <br><br>For example: `"queryParametersTemplate": "{'cid': 1234567, 'cmd': 'reporting', 'format': 'siem', 'data': { 'from': '{_QueryWindowStartTime}', 'to': '{_QueryWindowEndTime}'}, '{_APIKeyName}': '{_APIKey}'}"`      |   Optional, string object      |
|**isPostPayloadJson**     | Set to `true` if the POST payload is in JSON format        |   Optional, boolean      |
|**rateLimitQPS**     |   <!--description tbd-->      |    Optional, double     |
|**timeoutInSeconds**     |  The request timeout, in seconds       |   Optional, integer      |
|**retryCount**     |   The number of request retries to try if needed      |  Optional, integer       |
|**headers**     |  Request header value       |  Optional, string in the following format: `dictionary<string, string>`        |
|     |         |         |


### response configuration

The `response` section of the [pollingConfig](#polling-configuration) configuration includes the following parameters:

|Name  |Description  |Options  |
|---------|---------|---------|
|   **eventsJsonPaths**  |    Defines the path to the message in the response JSON     |  Mandatory, list of strings       |
| **successStatusJsonPath**    |  Defines the path to the success message in the response JSON       |   Optional, string      |
|  **successStatusValue**   |  Defines the path to the success message value in the response JSON       |   Optional, string      |
|  **isGzipCompressed**   |   Determines whether the response is compressed in a zip file       |  Optional, boolean       |
|     |         |         |


### paging configuration

The `paging` section of the [pollingConfig](#polling-configuration) configuration includes the following parameters:

|Name  |Description  |Options  |
|---------|---------|---------|
|  **pagingType**   | Determines the paging type to use in results        |    Mandatory, string. One of the following values: `None`, `PageToken`, `PageCount`, `TimeStamp`     |
| **nextPageParaName**    |  Defines the name of a next page attribute       |     Optional, string     |
| **nextPageTokenJsonPath**    |  Defines the path to a next page token JSON       |   Optional, string       |
|  **pageCountAttributePath**   |   Defines the path to a page count attribute      |    Optional, string      |
| **pageTotalCountAttributePath**    |Defines the path to a page total count attribute|  Optional, string        |
|  **pageTimeStampAttributePath**   | Defines the path to a paging time stamp attribute        |   Optional, string       |
| **searchTheLatestTimeStampFromEventsList**    |   Determines whether to search for the latest time stamp in the events list   | Optional, boolean        |
|  **pageSizeParaName**   |    Defines the name of the page size parameter     |   Optional, string      |
| **PageSize**    |     Defines the paging size    | Optional, integer        |
|     |         |         |


### targetExtra configuration

The `targetExtra` section of the `[pollingConfig](#polling-configuration)` configuration includes the following parameters:

|Name  |Description  |Options  |
|---------|---------|---------|
| **metadata**    |  A stamp of static attributes defined in the target/metadata section for each event before publishing to Log Analytics      | Optional, string in the following syntax: `{<attr_name>: <val>}`        |
|     |         |         |


### Sample pollingConfig code

The following code shows an example of the `pollingConfig` section of the CCP configuration file:

```rest
"pollingConfig": {
    "auth": {
        "authType": "APIKey",
        "APIKeyIdentifier": "token",
        "APIKeyName": "Authorization"
     },
     "request": {
        "apiEndpoint": "https://api.github.com/../{{placeHolder1}}/audit-log",
        "rateLimitQPS": 50,
        "queryWindowInMin": 15,
        "httpMethod": "Get",
        "queryTimeFormat": "yyyy-MM-ddTHH:mm:ssZ",
        "retryCount": 2,
        "timeoutInSeconds": 60,
        "headers": {
           "Accept": "application/json",
           "User-Agent": "Scuba"
        },
        "queryParameters": {
           "phrase": "created:{_QueryWindowStartTime}..{_QueryWindowEndTime}"
        }
     },
     "paging": {
        "pagingType": "LinkHeader",
        "pageSizeParaName": "per_page"
     },
     "response": {
        "eventsJsonPaths": [
          "$"
        ]
     }
}
```

## Connect to your data connector from Azure Sentinel

After you've configured your CCP connector JSON file, use the [UPSERT](#upsert) API or an ARM template to deploy an instance of your connector to your workspace.

Then connect by passing credentials with one of the following methods:

- **Connect via the user interface**: In your Azure Sentinel data connector page, follow the instructions you've provided to connect to your data connector.

    The data connector page in Azure Sentinel is controlled by the `instructionSteps` configuration in the `connectorUiConfig` element of the CCP configuration file.  If you have issues with the user interface connection, make sure that you have the correct configuration for your authentication type.

- **Connect via API**: Use the [CONNECT](#connect) endpoint to send a PUT method and pass the JSON configuration directly in the body of the message. For more information, see [auth configuration](#auth-configuration).

    Use the following API attributes, depending on the [authType](#authtype) defined. For each authType, all listed parameters are mandatory and strings.

    |authType  |Attributes  |
    |---------|---------|
    |**Basic**     |  Define: <br>- `kind` as `Basic` <br>- `userName` as your username, in quotes <br>- `password` as your password, in quotes     |
    |**APIKey**     |Define: <br>- `kind` as `APIKey` <br>- `APIKey` as your full API key string, in quotes|
    |**OAuth2**     |   Define: <br>- `kind` as `OAuth2`<br>- `authorizationCode` as your full authorization code, in quotes <br>- `clientSecret` and `clientId` as your client secret and ID values, each in quotes      |
    |     |         |

    > [!TIP]
    > The parameters required for each authType are defined in the [auth configuration](#auth-configuration) area of the CCP configuration file.

If you're connecting via API, and you've defined the `userRequestPlaceHoldersInput` value in the `instructionsSteps` > `instructions` section, you'll also need to send those parameters in the API call. For example:

```rest
"requestConfigUserInputValues":
"requestConfigUserInputValues": [
    {
       "displayText": "<The_Display_Name>",
       "placeHolderName": "<The_Place_Holder_Name_You_Choosed>",
       "placeHolderValue": "<Some_Value>",
       "requestObjectKey": "<The_Request_Property_You_Want_To_Set>"
     }
]
```

## Disconnect your connector

If you no longer need your connector's data, disconnect the connector to stop the data flow.

Use one of the following methods:

- **Disconnect via the user interface**: In your Azure Sentinel data connector page, select **Disconnect**.

- **Disconnect via API** Use the [DISCONNECT](#disconnect) API to send a PUT call with an empty body to the following URL:

    ```rest
    https://management.azure.com /subscriptions/{{SUB}}/resourceGroups/{{RG}}/providers/Microsoft.OperationalInsights/workspaces/{{WS-NAME}}/providers/Microsoft.SecurityInsights/dataConnectors/{{Connector_Id}}/disconnect?api-version=2021-03-01-preview
    ```

## Next steps

Share your new codeless data connector with the Azure Sentinel community! Create a solution for your data connector and share it in the Azure Sentinel Marketplace.

For more information, see [About Azure Sentinel solutions](sentinel-solutions.md).