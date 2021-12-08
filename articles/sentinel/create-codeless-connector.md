---
title: Create a codeless connector for Microsoft Sentinel
description: Learn how to create a codeless connector in Microsoft Sentinel using the Codeless Connector Platform (CCP).
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 12/07/2021
---

# Create a codeless connector for Microsoft Sentinel (Public preview)

> [!IMPORTANT]
> The Codeless Connector Platform (CCP) is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

The Codeless Connector Platform (CCP) provides partners, advanced users, and developers with the ability to create custom connectors, connect them, and ingest data to Microsoft Sentinel. Connectors created via the CCP can be deployed via API, an ARM template, or as a solution in the the Microsoft Sentinel [content hub](sentinel-solutions.md).

Connectors created using CCP are fully SaaS, without any requirements for service installations, and also include health monitoring and full support from Microsoft Sentinel.

This article describes the syntax used in the JSON configuration file that defines how your connector works, and procedures for deploying your connector via API, an ARM template, or a Microsoft Sentinel solution.

## Define your connector JSON configuration

A codeless connector JSON configuration file defines both the user interface displayed for the connector in Microsoft Sentinel, and the back-end polling connection between Microsoft Sentinel and your data source.

The following sample shows the basic syntax of the JSON configuration file:

```json
{
    "kind": "<name>",
    "properties": {
        "connectorUiConfig": {...
        },
        "pollingConfig": {...
        }
    }
}
```

Your connector uses the `connectorUiConfig` section to define the [visual elements and text](#configure-your-connectors-user-interface) displayed on the data connector page in Microsoft Sentinel, and the `pollingConfig` section to define [how Microsoft Sentinel collects data](#configure-your-connectors-polling-settings) from your data source.

> [!TIP]
> Before building a connector, we recommend that you learn and understand how the source behaves and exactly what it expects to be connected to. For example, the types of authentication, pagination, and API endpoints are required for successful connections.
>

## Configure your connector's user interface

This section describes the configuration for how the user interface on the data connector page appears in Microsoft Sentinel.

Each data connector page in Microsoft Sentinel has the following areas, configured using the `connectorUiConfig` section of the [data connector configuration file](#connector-configuration).

|UI area  |Description  |
|---------|---------|
|**Title**     |   The title displayed for your data connector      |
|**Icon**     |   The icon displayed for your data connector      |
|**Status**     |  Displays whether or not your data connector is connected to Microsoft Sentinel       |
|**Data charts**     |    Displays relevant queries and the amount of ingested data in the last two weeks.     |
|**Instructions tab**     | Includes a **Prerequisites** section, with a list of minimal validations before the user can enable the connector, and an **Instructions**, with a list of instructions to guide the user in enabling the connector. This section can include text, buttons, forms, tables, and other common widgets to simplify the process.        |
|**Next steps tab**     |   Includes useful information for understanding how to find data in the event logs, such as sample queries.     |
|     |         |

For example, see: TBD

The `connectorUiConfig` section of the configuration file includes the following properties:


|Name  |Type  |Description  |
|---------|---------|---------|
|**id**     |  GUID       |  A distinct ID for the connector       |
|**title**     |  String       |Title displayed in the data connector page         |
|**publisher**     |    String     |  Your company name       |
|**descriptionMarkdown**     |  String, in markdown       |   A description for the connector      |
|**additionalRequirementBanner**     |   String, in markdown      |    Text for the **Prerequisites** section of the **Instructions** tab     |
| **graphQueriesTableName** | Defines the name of the Log Analytics table from which data for your queries is pulled. <br><br>The table name can be any string, but must end in `_CL`. For example: `TableName_CL`
|**graphQueries**     |   [GraphQuery[]](#graphquery)      |   Queries that present data ingestion over the last two weeks in the **Data charts** pane.<br><br>Provide either one query for all of the data connector's data types, or a different query for each data type.     |
|**sampleQueries**     | [SampleQuery[]](#samplequery)       | Sample queries for the customer to understand how to find the data in the event log, to be displayed in the **Next steps** tab.        |
|**dataTypes**     | [DataTypes[]](#datatypes)        | A list of all data types for your connector, and a query to fetch the time of the last event for each data type.        |
|**connectivityCriteria**     |   [ConnectivityCriteria[]](#connectivitycriteria)      |An object that defines how to verify if the connector is correctly defined.          |
|**availability**     | `{`<br>`  status: Number,`<br>`  isPreview: Boolean`<br>`}`        |  One of the following values: <br><br>- **1**: Connector is available to customers <br>- **isPreview**: Indicates that the connector is not yet generally available.       |
|**permissions**     | [RequiredConnectorPermissions[]](#requiredconnectorpermissions)        | Lists the permissions required to enable or disable the connector.        |
|**instructionsSteps**     | [InstructionStep[]](#instructionstep)        |     An array of widget parts that explain how to install the connector, displayed on the **Instructions** tab.    |
|**metadata**     |   [Metadata](#metadata)      |  ARM template metadata, for deploying the connector as an ARM template.       |
|     |         |         |

### GraphQuery

Defines a query that presents data ingestion over the last two weeks in the **Data charts** pane.

Provide either one query for all of the data connector's data types, or a different query for each data type.   

|Name  |Type  |Description  |
|---------|---------|---------|
|**metricName**     |   String      |  A meaningful name for your graph. <br><br>Example: `Total data received`       |
|**legend**     |     String    |   The string that appears in the legend to the right of the chart, including a variable reference.<br><br>Example: `{{graphQueriesTableName}}`      |
|**baseQuery**     | String        |    The query that filters for relevant events, including a variable reference. <br><br>Example: `TableName | where ProviderName == “myprovider”` or `{{graphQueriesTableName}}`     |
|     |         |         |


### SampleQuery

|Name  |Type  |Description  |
|---------|---------|---------|
| **Description** | String | A meaningful description for the sample query <br><br>Example: `Top 10 vulnerabilities detected` |
| **Query** | String | Sample query used to fetch the data type's data <br><br>Example: `{{graphQueriesTableName}}\n | sort by TimeGenerated\n | take 10` |
| | | |

### DataTypes

|Name  |Type  |Description  |
|---------|---------|---------|
| **dataTypeName** | String | A meaningful description for the`lastDataReceivedQuery` query, including support for a variable. <br><br>Example: `{{graphQueriesTableName}}` |
| **lastDataReceivedQuery** | String | A query that returns one row, and indicates the last time data was received, or no data if there is no relevant data. <br><br>Example: {{graphQueriesTableName}}\n | summarize Time = max(TimeGenerated)\n | where isnotempty(Time)
| | | |


### ConnectivityCriteria

|Name  |Type  |Description  |
|---------|---------|---------|
| **type** | ENUM | Always use `SentinelKindsV2` |
| **value** | deprecated ||
| | | |

### Availability

|Name  |Type  |Description  |
|---------|---------|---------|
| **status** | Boolean | Determines whether or not the data connector is available in your workspace. <br><br>Example: `1`|
| **isPreview** | Boolean |Determines whether the data connector is supported as Preview or not. <br><br>Example: `false` |
| | | |

### RequiredConnectorPermissions

|Name  |Type  |Description  |
|---------|---------|---------|
| **tenant** | ENUM | Lists required permissions as one or more of the following values: `GlobalAdmin`, `SecurityAdmin`,  `SecurityReader`, `InformationProtection` <br><br>Example: The **tenant** value displays displays in Microsoft Sentinel as: **Tenant Permissions: Requires `Global Administrator` or `Security Administrator` on the workspace's tenant**|
| **licenses** | ENUM | Lists required licenses as one of the following values: `OfficeIRM`,`OfficeATP`, `Office365`, `AadP1P2`, `Mcas`, `Aatp`, `Mdatp`, `Mtp`, `IoT` <br><br>Example: The **licenses** value displays in Microsoft Sentinel as: **License: Required Azure AD Premium P2**|
| **customs** | `{`<br>`  name:string,`<br>` description:string`<br>`}` | Description of any custom permissions required for your data connection. <br><br>Example: The **customs** value displays in Microsoft Sentinel as: **Subscription: Contributor permissions to the subscription of your IoT Hub.** |
| **resourceProvider**	| [ResourceProviderPermissions](#resourceproviderpermissions) | Description of prerequisites for your Azure resource. <br><br>Example: The **resourceProvider** value displays in Microsoft Sentinel as: <br>**Workspace: write permission is required. **<br>**Keys: read permissions to shared keys for the workspace are required.**|
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

This section provides metadata used when you're [deploying your data connector as an ARM template](#tab/arm-template).

|Name  |Type  |Description  |
|---------|---------|---------|
| **id** | 	String | Define a GUID for your ARM tempalte.  |
| **kind** 	| String | Define as	`dataConnector` |
| **source** | 	String |Describe your data source using the following syntax: <br><br>`{`<br>`  kind:string`<br>`  name:string`<br>`}`|
| **author** |	String | Describe the data connector author using the following syntax: `{`<br>`  name:string`<br>`}`| 
| **support** |	String | Describe the support provided for the data connector using the following syntax: 	`{`<br>`      "tier": string,`<br>`      "name": string,`<br>`"email": string,`<br>      `"link": string`<br>`    }`| 
| | | |

### Instructions

This section provides parameters that define the set of instructions that appear on your data connector page in Microsoft Sentinel.

|Name  |Type  |Description  |
|---------|---------|---------|
| **title**	| String | A title for your instructions (optional) |
| **description** | 	String	| A meaningful description for your instructions (optional) |
| **innerSteps**	| [InstructionStep](#instructionstep) | An array of inner instruction steps (optional) |
| **bottomBorder** | 	Boolean	| When `true`, adds a bottom border to the instructions area on the connector page in Microsoft Sentinel |
| **isComingSoon** |	Boolean	| When `true`, adds a **Coming soon** title on the connector page in Microsoft Sentinel |
| | | |


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
<value>Follow the instructions found on article [Connect Microsoft Sentinel to your threat intelligence platform]({0}). Once the application is created you will need to record the Tenant ID, Client ID and Client Secret.</value>
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
#### InstructionStep

Displays a group of instructions, expandable (accordion) or non-expandable, separate from the main instructions section.

For example:

:::image type="content" source="media/create-codeless-connector/accordion-instruction-area.png" alt-text="Screenshot of an expandable, extra instruction group.":::

**Parameters**: `InstructionStepsGroupModelParameters`

|Name  |Type  |Description  |
|---------|---------|---------|
|**title**     |    String     |  Defines the title for the instruction step.       |
|**instructionSteps**     |  [InstructionStep[]](#instructionstep)       | An array of inner instruction steps (Optional)        |
|**canCollapseAllSections**     |  Boolean       |  Optional. Determines whether the section is a collapsible accordion or not.       |
|**noFxPadding**     |   Boolean      |  Optional. If `true`, reduces the height padding to save space.       |
|**expanded**     |   Boolean      |   Optional. If `true`, shows as expanded by default.      |
|     |         |         |




## Configure your connector's polling settings

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
|**queryTimeFormat**     |   The format used to define the query time.    <br><br>This value can be a string, or in *UnixTimestamp* or *UnixTimestampInMills* format to indicate the query start and end time in the UnixTimestamp.  |    Mandatory, string     |
|**startTimeAttributeName**     |  The name of the attribute that defines the query start time.        |   Mandatory<sup>*</sup>, string      |
|**endTimeAttributeName**     |   The name of the attribute that defines the query end time.      |   Mandatory<sup>*</sup>, string      |
|**queryTimeIntervalAttributeName**     |  The name of the attribute that defines the query time interval       |  Optional, string       |
|**queryTimeIntervalDelimiter**     |    The query time interval delimiter     |   Optional, string      |
|**queryWindowInMin**     |  The available query window, in minutes       |  Optional, string <br><br>Minimum: 5 minutes       |
|**queryParameters**     |   Parameters passed in the query in the [`eventsJsonPaths`](#eventsjsonpaths) path.     |   Optional, string in the following syntax:  `dictionary<string, string>`     |
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
|  <a name="eventsjsonpaths"></a> **eventsJsonPaths**  |    Defines the path to the message in the response JSON     |  Mandatory, list of strings       |
| **successStatusJsonPath**    |  Defines the path to the success message in the response JSON       |   Optional, string      |
|  **successStatusValue**   |  Defines the path to the success message value in the response JSON       |   Optional, string      |
|  **isGzipCompressed**   |   Determines whether the response is compressed in a zip file       |  Optional, boolean       |
|     |         |         |

The following code shows an example of the [eventsJsonPaths](#eventsjsonpaths) value for a top-level message:

```json
"eventsJsonPaths": [
              "$"
            ]
```


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

## Create a connector configuration template with placeholders

You may want to create a JSON configuration file template, with placeholders parameters, to reuse across multiple connectors, or even to create a connector with data that you don't currently have.

To create placeholder parameters, define an additional array named `userRequestPlaceHoldersInput` in the [Instructions](#instructions) section of your JSON file, using the following syntax:

```json
"instructions": [
                {
                  "parameters": {
                    "enable": "true",
                    "userRequestPlaceHoldersInput": [
                      {
                        "displayText": "Organization Name",
                        "requestObjectKey": "apiEndpoint",
                        "placeHolderName": "{{placeHolder1}}"
                      }
                    ]
                  },
                  "type": "APIKey"
                }
              ]
```

The `userRequestPlaceHoldersInput` parameter includes the following attributes:

|Name  |Type  |Description  |
|---------|---------|---------|
|**DisplayText**     |  String       | The text box display value, which is displayed to the user when connecting.       |
|**RequestObjectKey** |String | The ID used to identify where in the request section of the API call to replace the placeholder value with a user value. <br><br>If you don't use this attribute, use the `PollingKeyPaths` attribute instead. |
|**PollingKeyPaths** |String |An array of [JsonPath](https://www.npmjs.com/package/JSONPath) objects that directs the API call to anywhere in the template, to replace a placeholder value with a user value.<br><br>**Example**: `"pollingKeyPaths":["$.request.queryParameters.test1"]` <br><br>If you don't use this attribute, use the `RequestObjectKey` attribute instead.  |
|**PlaceHolderName** |String |The name of the placeholder parameter in the JSON template file. This can be any unique value, such as {{placeHolder}}. |
| | |


## Deploy your connector in Microsoft Sentinel and start ingesting data

After creating your [JSON configuration file](#connector-configuration), including both the [user interface](#configure-your-connectors-user-interface) and [polling](#configure-your-connectors-polling-settings) configuration, deploy your connector in your Microsoft Sentinel workspace.

1. Use one of the following options to deploy your data connector:

    # [ARM template](#tab/arm-template)

    Use your JSON configuration file to create an Azure Resource Manager (ARM) template to use when deploying your connector.

    The advantage of deploying via an ARM template is that several values are built-in to the template, and you don't need to define them manually in an API call.

    TBD on procedure

    > [!TIP]
    > Make sure to either define the workspace for the ARM template to deploy, or select the workspace when you deploy the ARM template, to make sure that your data connector is deployed in the correct workspace.
    >
    # [API](#tab/api)

    1. Authenticate to the Azure API. For more information, see [Getting started with REST](/rest/api/azure/).

    1. Invoke an [UPSERT](#upsert) API call to Microsoft Sentinel to deploy your new connector. Your data connector is deployed to your Microsoft Sentinel workspace, and is available on the **Data connectors** page.

    ---

1. Configure your data connector to connect your data source and start ingesting data into Microsoft Sentinel. You can connect to your data source either via the portal, as with out-of-the-box data connectors, or via API.

    When you use the Azure portal to connect, user data is sent automatically. When you connect via API, you'll need to send the relevant authentication parameters in the API call.

    # [Azure portal](#tab/azure-portal)

    In your Microsoft Sentinel data connector page, follow the instructions you've provided to connect to your data connector.

    The data connector page in Microsoft Sentinel is controlled by the `instructionSteps` configuration in the `connectorUiConfig` element of the CCP JSON configuration file.  If you have issues with the user interface connection, make sure that you have the correct configuration for your authentication type.

    # [API](#tab/api)

    Use the [CONNECT](#connect) endpoint to send a PUT method and pass the JSON configuration directly in the body of the message. For more information, see [auth configuration](#auth-configuration).

    Use the following API attributes, depending on the [authType](#authtype) defined. For each `authType` parameter, all listed attributes are mandatory and are string values.

    |authType  |Attributes  |
    |---------|---------|
    |**Basic**     |  Define: <br>- `kind` as `Basic` <br>- `userName` as your username, in quotes <br>- `password` as your password, in quotes     |
    |**APIKey**     |Define: <br>- `kind` as `APIKey` <br>- `APIKey` as your full API key string, in quotes|
    |**OAuth2**     |   Define: <br>- `kind` as `OAuth2`<br>- `authorizationCode` as your full authorization code, in quotes <br>- `clientSecret` and `clientId` as your client secret and ID values, each in quotes      |
    |     |         |

    If you're using a [template configuration file with placeholder data](#connector-configuration-with-placeholders), send the data together with the `placeHolderValue` attributes that hold the user data. For example:

    ```rest
    "requestConfigUserInputValues": [
        {
           "displayText": "<A display name>",
           "placeHolderName": "<A placeholder name>",
           "placeHolderValue": "<A value for the placeholder>",
           "pollingKeyPaths": "<Array of items to use in place of the placeHolderName>"
         }
    ]
    ```

    ---

1. In Microsoft Sentinel, go to the **Logs** page and verify that you see the logs from your data source flowing in to your workspace.

If you don't see data flowing into Microsoft Sentinel, check your data source documentation and troubleshooting resources, check the configuration details, and check the connectivity.

### Disconnect your connector

If you no longer need your connector's data, disconnect the connector to stop the data flow.

Use one of the following methods:

# [Azure portal](#tab/arm-template)

In your Microsoft Sentinel data connector page, select **Disconnect**.
# [API](#tab/api)

Use the [DISCONNECT](#disconnect) API to send a PUT call with an empty body to the following URL:

```rest
https://management.azure.com /subscriptions/{{SUB}}/resourceGroups/{{RG}}/providers/Microsoft.OperationalInsights/workspaces/{{WS-NAME}}/providers/Microsoft.SecurityInsights/dataConnectors/{{Connector_Id}}/disconnect?api-version=2021-03-01-preview
```

---


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

Initiates the connector data pulling mechanism for the specified connector ID.

Codeless data connectors pull data from publicly accessible APIs. To pull data, Microsoft Sentinel must authenticate to the data source service using an authentication method supported by both the data source's API and the CCP.

Authentication data isn't included in the codeless connector's configuration, but provided when you [connect your data connector from Microsoft Sentinel](#connect-to-your-data-connector-from-microsoft-sentinel). This connection is performed using the **CONNECT** action, with connection data stored in an encrypted keystore residing in the customer region.

Connect using one of the following authentication methods:

- **Basic authentication**. Passes a username and password to authenticate to the REST API.

- **API key**. Provides an API key to the API.

- **OAuth2**. Uses an open standard for access delegation intended to grant access from applications to an API without supporting the actual authentication data.

    Using OAuth2 requires app registration, authentication, and then getting a token and access by the application using the registration and authentication data. When connecting a codeless data connector, register Microsoft Sentinel as your application, and then interact directly with your data source's API authentication process for the required keys. Provide the keys to the connector when you need to connect.


**Method**: POST

**Endpoint URL**:

```rest
subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/providers/Microsoft.SecurityInsights/dataConnectors/{connector-name-GUID}/connect?api-version={apiVersion}
```


### DISCONNECT

[Disconnects the connector](#disconnect-your-connector) specified by the connector ID from Microsoft Sentinel.

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





## Next steps

If you haven't yet, share your new codeless data connector with the Microsoft Sentinel community! Create a solution for your data connector and share it in the Microsoft Sentinel Marketplace.

For more information, see [About Microsoft Sentinel solutions](sentinel-solutions.md).
