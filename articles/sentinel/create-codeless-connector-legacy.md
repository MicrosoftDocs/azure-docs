---
title: Legacy codeless connector for Microsoft Sentinel
description: Legacy codeless connector instructions in Microsoft Sentinel using the Codeless Connector Platform (CCP).
author: austinmccollum
ms.author: austinmc
ms.topic: how-to
ms.custom: ignite-2022
ms.date: 11/22/2023
---
# Create a legacy codeless connector for Microsoft Sentinel

The Codeless Connector Platform (CCP) provides partners, advanced users, and developers with the ability to create custom connectors, connect them, and ingest data to Microsoft Sentinel. Connectors created via the CCP can be deployed via API, an ARM template, or as a solution in the Microsoft Sentinel [content hub](sentinel-solutions.md).

Connectors created using CCP are fully SaaS, without any requirements for service installations, and also include [health monitoring](monitor-data-connector-health.md) and full support from Microsoft Sentinel.

Create your data connector by defining JSON configurations, with settings for how the data connector page in Microsoft Sentinel looks along with polling settings that define how the connection functions.

> [!IMPORTANT]
> This version of Codeless Connector Platform (CCP) was in PREVIEW, but is now considered LEGACY. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

For more information on the **new CCP**, see [Create a codeless connector](create-codeless-connector.md).

**Use the following steps to create your CCP connector and connect to your data source from Microsoft Sentinel**:

> [!div class="checklist"]
> * Configure the connector's user interface
> * Configure the connector's polling settings
> * Deploy your connector to your Microsoft Sentinel workspace
> * Connect Microsoft Sentinel to your data source and start ingesting data

This article describes the syntax used in the CCP JSON configurations and procedures for deploying your connector via API, an ARM template, or a Microsoft Sentinel solution.

## Prerequisites

Before building a connector, we recommend that you understand how your data source behaves and exactly how Microsoft Sentinel will need to connect.

For example, you'll need to know the types of authentication, pagination, and API endpoints that are required for successful connections.

## Create a connector JSON configuration file

Your custom CCP connector has two primary JSON sections needed for deployment. Fill in these areas to define how your connector is displayed in the Azure portal and how it connects Microsoft Sentinel to your data source.

- `connectorUiConfig`. Defines the visual elements and text displayed on the data connector page in Microsoft Sentinel. For more information, see [Configure your connector's user interface](#configure-your-connectors-user-interface).

- `pollingConfig`. Defines how Microsoft Sentinel collects data from your data source. For more information, see [Configure your connector's polling settings](#configure-your-connectors-polling-settings).

Then, if you deploy your codeless connector via ARM, you'll wrap these sections in the ARM template for data connectors.

Review [other CCP data connectors](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors#codeless-connector-platform-ccp-preview--native-microsoft-sentinel-polling) as examples or download the example template, [DataConnector_API_CCP_template.json (Preview)](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors#build-the-connector).

## Configure your connector's user interface

This section describes the configuration options available to customize the user interface of the data connector page.

The following image shows a sample data connector page, highlighted with numbers that correspond to notable areas of the user interface:

:::image type="content" source="media/create-codeless-connector-legacy/sample-data-connector-page.png" alt-text="Screenshot of a sample data connector page.":::

1. **Title**.  The title displayed for your data connector.
1. **Logo**.   The icon displayed for your data connector. Customizing this is only possible when deploying as part of a solution. 
1. **Status**.  Indicates whether or not your data connector is connected to Microsoft Sentinel.
1. **Data charts**. Displays relevant queries and the amount of ingested data in the last two weeks.
1. **Instructions tab**. Includes a **Prerequisites** section, with a list of minimal validations before the user can enable the connector, and **Instructions**, to guide the user enablement of the connector. This section can include text, buttons, forms, tables, and other common widgets to simplify the process.  
1. **Next steps tab**.   Includes useful information for understanding how to find data in the event logs, such as sample queries.

Here's the `connectorUiConfig` sections and syntax needed to configure the user interface:

|Property Name  |Type  |Description  |
|:---------|:---------|---------|
|**availability**     | `{`<br>`"status": 1,`<br>`"isPreview":` Boolean<br>`}` | <br> **status**: **1** Indicates connector is generally available to customers. <br>**isPreview** Indicates whether to include (Preview) suffix to connector name. |
|**connectivityCriteria**     |   `{`<br>`"type": SentinelKindsV2,`<br>`"value": APIPolling`<br>`}` | An object that defines how to verify if the connector is correctly defined. Use the values indicated here.|
|**dataTypes**     | [dataTypes[]](#datatypes) | A list of all data types for your connector, and a query to fetch the time of the last event for each data type. |
|**descriptionMarkdown**     |  String     |   A description for the connector with the ability to add markdown language to enhance it.      |
|**graphQueries**     |   [graphQueries[]](#graphqueries)      |   Queries that present data ingestion over the last two weeks in the **Data charts** pane.<br><br>Provide either one query for all of the data connector's data types, or a different query for each data type.     |
|**graphQueriesTableName** | String | Defines the name of the Log Analytics table from which data for your queries is pulled. <br><br>The table name can be any string, but must end in `_CL`. For example: `TableName_CL`|
|**instructionsSteps**     | [instructionSteps[]](#instructionsteps)        |     An array of widget parts that explain how to install the connector, displayed on the **Instructions** tab.    |
|**metadata**     |   [metadata](#metadata)      |  Metadata displayed under the connector description.       |
|**permissions**     | [permissions[]](#permissions)        | The information displayed under the **Prerequisites** section of the UI which Lists the permissions required to enable or disable the connector. |
|**publisher**     |    String     |  This is the text shown in the **Provider** section.  |
|**sampleQueries**     | [sampleQueries[]](#samplequeries)       | Sample queries for the customer to understand how to find the data in the event log, to be displayed in the **Next steps** tab.        |
|**title**     |  String       |Title displayed in the data connector page.         |

Putting all these pieces together is complicated. Use the [connector page user experience validation tool](#validate-the-data-connector-page-user-experience) to test out the components you put together.

### dataTypes

|Array Value  |Type  |Description  |
|---------|---------|---------|
| **name** | String | A meaningful description for the`lastDataReceivedQuery`, including support for a variable. <br><br>Example: `{{graphQueriesTableName}}` |
| **lastDataReceivedQuery** | String | A KQL query that returns one row, and indicates the last time data was received, or no data if there is no relevant data. <br><br>Example: `{{graphQueriesTableName}}\n | summarize Time = max(TimeGenerated)\n | where isnotempty(Time)` |

### graphQueries

Defines a query that presents data ingestion over the last two weeks in the **Data charts** pane.

Provide either one query for all of the data connector's data types, or a different query for each data type.

|Array Value  |Type  |Description  |
|---------|---------|---------|
|**metricName**     |   String      |  A meaningful name for your graph. <br><br>Example: `Total data received`       |
|**legend**     |     String    |   The string that appears in the legend to the right of the chart, including a variable reference.<br><br>Example: `{{graphQueriesTableName}}`      |
|**baseQuery**     | String        |    The query that filters for relevant events, including a variable reference. <br><br>Example: `TableName_CL | where ProviderName == "myprovider"` or `{{graphQueriesTableName}}`     |

### instructionSteps

This section provides parameters that define the set of instructions that appear on your data connector page in Microsoft Sentinel.

|Array Property  |Type  |Description  |
|---------|---------|---------|
| **title**	| String | Optional. Defines a title for your instructions. |
| **description** | 	String	| Optional. Defines a meaningful description for your instructions. |
| **innerSteps**	| Array | Optional. Defines an array of inner instruction steps. |
| **instructions**  | Array of [instructions](#instructions) | Required. Defines an array of instructions of a specific parameter type. | 
| **bottomBorder** | 	Boolean	| Optional. When `true`, adds a bottom border to the instructions area on the connector page in Microsoft Sentinel |
| **isComingSoon** |	Boolean	| Optional. When `true`, adds a **Coming soon** title on the connector page in Microsoft Sentinel |

#### instructions

Displays a group of instructions, with various options as parameters and the ability to nest more instructionSteps in groups.

| Parameter | Array property | Description |
|-----------|--------------|-------------|
| **APIKey** | [APIKey](#apikey) | Add placeholders to your connector's JSON configuration file. |
| **CopyableLabel** | [CopyableLabel](#copyablelabel) | Shows a text field with a copy button at the end. When the button is selected, the field's value is copied.|
| **InfoMessage** | [InfoMessage](#infomessage) | Defines an inline information message.
| **InstructionStepsGroup** | [InstructionStepsGroup](#instructionstepsgroup) | Displays a group of instructions, optionally expanded or collapsible, in a separate instructions section.|
| **InstallAgent** | [InstallAgent](#installagent) | Displays a link to other portions of Azure to accomplish various installation requirements. |

#### APIKey

You may want to create a JSON configuration file template, with placeholders parameters, to reuse across multiple connectors, or even to create a connector with data that you don't currently have.

To create placeholder parameters, define an additional array named `userRequestPlaceHoldersInput` in the [Instructions](#instructions) section of your [CCP JSON configuration](#create-a-connector-json-configuration-file) file, using the following syntax:

```json
"instructions": [
                {
                  "parameters": {
                    "enable": "true",
                    "userRequestPlaceHoldersInput": [
                      {
                        "displayText": "Organization Name",
                        "requestObjectKey": "apiEndpoint",
                        "placeHolderName": "{{placeHolder}}"
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
|**DisplayText**     |  String       | Defines the text box display value, which is displayed to the user when connecting.       |
|**RequestObjectKey** |String | Defines the ID in the request section of the **pollingConfig** to substitute the placeholder value with the user provided value. <br><br>If you don't use this attribute, use the `PollingKeyPaths` attribute instead. |
|**PollingKeyPaths** |String |Defines an array of [JsonPath](https://www.npmjs.com/package/JSONPath) objects that directs the API call to anywhere in the template, to replace a placeholder value with a user value.<br><br>**Example**: `"pollingKeyPaths":["$.request.queryParameters.test1"]` <br><br>If you don't use this attribute, use the `RequestObjectKey` attribute instead.  |
|**PlaceHolderName** |String |Defines the name of the placeholder parameter in the JSON template file. This can be any unique value, such as `{{placeHolder}}`. |

#### CopyableLabel

 Example:

:::image type="content" source="media/create-codeless-connector-legacy/copy-field-value.png" alt-text="Screenshot of a copy value button in a field.":::

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
|**fillWith**     |  ENUM       | Optional. Array of environment variables used to populate a placeholder. Separate multiple placeholders with commas. For example: `{0},{1}`  <br><br>Supported values: `workspaceId`, `workspaceName`, `primaryKey`, `MicrosoftAwsAccount`, `subscriptionId`      |
|**label**     |  String       |  Defines the text for the label above a text box.      |
|**value**     |  String       |  Defines the value to present in the text box, supports placeholders.       |
|**rows**     |   Rows      |  Optional. Defines the rows in the user interface area. By default, set to **1**.       |
|**wideLabel**     |Boolean         | Optional. Determines a wide label for long strings. By default, set to `false`.        |

#### InfoMessage

Here's an example of an inline information message:

:::image type="content" source="media/create-codeless-connector-legacy/inline-information-message.png" alt-text="Screenshot of an inline information message.":::

In contrast, the following image shows a *non*-inline information message:

:::image type="content" source="media/create-codeless-connector-legacy/non-inline-information-message.png" alt-text="Screenshot of a non-inline information message.":::


|Array Value  |Type  |Description  |
|---------|---------|---------|
|**text**     |    String     |   Define the text to display in the message.      |
|**visible**     |   Boolean      |    Determines whether the message is displayed.     |
|**inline**     |   Boolean      |   Determines how the information message is displayed. <br><br>- `true`: (Recommended) Shows the information message embedded in the instructions. <br>- `false`: Adds a blue background.     |

#### InstructionStepsGroup

Here's an example of an expandable instruction group:

:::image type="content" source="media/create-codeless-connector-legacy/accordion-instruction-area.png" alt-text="Screenshot of an expandable, extra instruction group.":::

|Array Value  |Type  |Description  |
|---------|---------|---------|
|**title**     |    String     |  Defines the title for the instruction step.       |
|**canCollapseAllSections**     |  Boolean       |  Optional. Determines whether the section is a collapsible accordion or not.       |
|**noFxPadding**     |   Boolean      |  Optional. If `true`, reduces the height padding to save space.       |
|**expanded**     |   Boolean      |   Optional. If `true`, shows as expanded by default.      |

For a detailed example, see the configuration JSON for the [Windows DNS connector](https://github.com/Azure/Azure-Sentinel/blob/master/Solutions/Windows%20Server%20DNS/Data%20Connectors/template_DNS.JSON).

#### InstallAgent

Some **InstallAgent** types appear as a button, others will appear as a link. Here are examples of both:

:::image type="content" source="media/create-codeless-connector-legacy/link-by-button.png" alt-text="Screenshot of a link added as a button.":::

:::image type="content" source="media/create-codeless-connector-legacy/link-by-text.png" alt-text="Screenshot of a link added as inline text.":::

|Array Values  |Type  |Description  |
|---------|---------|---------|
|**linkType**     |   ENUM      |  Determines the link type, as one of the following values: <br><br>`InstallAgentOnWindowsVirtualMachine`<br>`InstallAgentOnWindowsNonAzure`<br> `InstallAgentOnLinuxVirtualMachine`<br> `InstallAgentOnLinuxNonAzure`<br>`OpenSyslogSettings`<br>`OpenCustomLogsSettings`<br>`OpenWaf`<br> `OpenAzureFirewall` `OpenMicrosoftAzureMonitoring` <br> `OpenFrontDoors` <br>`OpenCdnProfile` <br>`AutomaticDeploymentCEF` <br> `OpenAzureInformationProtection` <br> `OpenAzureActivityLog` <br> `OpenIotPricingModel` <br> `OpenPolicyAssignment` <br> `OpenAllAssignmentsBlade` <br> `OpenCreateDataCollectionRule`       |
|**policyDefinitionGuid**     | String        |  Required when using the **OpenPolicyAssignment** linkType. For policy-based connectors, defines the GUID of the built-in policy definition.        |
|**assignMode**     |   ENUM      |   Optional. For policy-based connectors, defines the assign mode, as one of the following values: `Initiative`, `Policy`      |
|**dataCollectionRuleType**     |  ENUM       |   Optional. For DCR-based connectors, defines the type of data collection rule type as one of the following: `SecurityEvent`,  `ForwardEvent`       |


### metadata

This section provides metadata in the data connector UI under the **Description** area.

| Collection Value  |Type  |Description  |
|---------|---------|---------|
| **kind** 	| String | Defines the kind of ARM template you're creating. Always use `dataConnector`. |
| **source** | 	String | Describes your data source, using the following syntax: <br>`{`<br>`"kind":`string<br>`"name":`string<br>`}`|
| **author** |	String | Describes the data connector author, using the following syntax: <br>`{`<br>`"name":`string<br>`}`|
| **support** |	String | Describe the support provided for the data connector using the following syntax: <br>`{`<br>`"tier":`string,<br>`"name":`string,<br>`"email":`string,<br>`"link":`URL string<br>`}`|

### permissions

|Array value  |Type  |Description  |
|---------|---------|---------|
| **customs** | String | Describes any custom permissions required for your data connection, in the following syntax: <br>`{`<br>`"name":`string`,`<br>`"description":`string<br>`}` <br><br>Example: The **customs** value displays in Microsoft Sentinel **Prerequisites** section with a blue informational icon. In the GitHub example, this correlates to the line  **GitHub API personal token Key: You need access to GitHub personal token...** |
| **licenses** | ENUM | Defines the required licenses, as one of the following values: `OfficeIRM`,`OfficeATP`, `Office365`, `AadP1P2`, `Mcas`, `Aatp`, `Mdatp`, `Mtp`, `IoT` <br><br>Example: The **licenses** value displays in Microsoft Sentinel as: **License: Required Azure AD Premium P2**|
| **resourceProvider**	| [resourceProvider](#resourceprovider) | Describes any prerequisites for your Azure resource. <br><br>Example: The **resourceProvider** value displays in Microsoft Sentinel **Prerequisites** section as: <br>**Workspace: read and write permission is required.**<br>**Keys: read permissions to shared keys for the workspace are required.**|
| **tenant** | array of ENUM values<br>Example:<br><br>`"tenant": [`<br>`"GlobalADmin",`<br>`"SecurityAdmin"`<br>`]`<br> | Defines the required permissions, as one or more of the following values: `"GlobalAdmin"`, `"SecurityAdmin"`, `"SecurityReader"`, `"InformationProtection"` <br><br>Example:  displays the **tenant** value in Microsoft Sentinel as: **Tenant Permissions: Requires `Global Administrator` or `Security Administrator` on the workspace's tenant**|

#### resourceProvider

|sub array value |Type  |Description  |
|---------|---------|---------|
| **provider** | 	ENUM	| Describes the resource provider, with one of the following values: <br>- `Microsoft.OperationalInsights/workspaces` <br>- `Microsoft.OperationalInsights/solutions`<br>- `Microsoft.OperationalInsights/workspaces/datasources`<br>- `microsoft.aadiam/diagnosticSettings`<br>- `Microsoft.OperationalInsights/workspaces/sharedKeys`<br>- `Microsoft.Authorization/policyAssignments` |
| **providerDisplayName** | 	String	| A list item under **Prerequisites** that will display a red "x" or green checkmark when the **requiredPermissions** are validated in the connector page. Example, `"Workspace"` |
| **permissionsDisplayText** | 	String	| Display text for *Read*, *Write*, or *Read and Write* permissions that should correspond to the values configured in **requiredPermissions** |
| **requiredPermissions** | `{`<br>`"action":`Boolean`,`<br>`"delete":`Boolean`,`<br>`"read":`Boolean`,`<br>`"write":`Boolean<br>`}` | Describes the minimum permissions required for the connector. |
| **scope** | 	ENUM	 | Describes the scope of the data connector, as one of the following values: `"Subscription"`, `"ResourceGroup"`, `"Workspace"` |

### sampleQueries

|array value  |Type  |Description  |
|---------|---------|---------|
| **description** | String | A meaningful description for the sample query.<br><br>Example: `Top 10 vulnerabilities detected` |
| **query** | String | Sample query used to fetch the data type's data. <br><br>Example: `{{graphQueriesTableName}}\n | sort by TimeGenerated\n | take 10` |

### Configure other link options

To define an inline link using markdown, use the following example. Here a link is provided in an instruction description:

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

### Validate the data connector page user experience 
Follow these steps to render and validate the connector user experience.

1. The test utility can be accessed by this URL - https://aka.ms/sentineldataconnectorvalidateurl
1. Go to Microsoft Sentinel -> Data Connectors
1. Click the "import" button and select a json file that only contains the `connectorUiConfig` section of your data connector.

For more information on this validation tool, see the [Build the connector](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors#build-the-connector) instructions in our GitHub build guide.

> [!NOTE]
> Because the **APIKey** instruction parameter is specific to the codeless connector, temporarily remove this section to use the validation tool, or it will fail.
>

## Configure your connector's polling settings

This section describes the configuration for how data is polled from your data source for a codeless data connector.

The following code shows the syntax of the `pollingConfig` section of the [CCP configuration](#create-a-connector-json-configuration-file) file.

```json
"pollingConfig": {
    "auth": {
    },
    "request": {
    },
    "response": {
    },
    "paging": {
    }
 }
```

The `pollingConfig` section includes the following properties:

| Name         | Type        | Description  |
| ------------ | ----------- | ------------ |
| **auth**     | String      | Describes the authentication properties for polling the data. For more information, see [auth configuration](#auth-configuration). |
| <a name="authtype"></a>**auth.authType** | String | Mandatory. Defines the type of authentication, nested inside the `auth` object, as  one of the following values: `Basic`, `APIKey`, `OAuth2` |
| **request**  | Nested JSON | Mandatory. Describes the request payload for polling the data, such as the API endpoint.     For more information, see [request configuration](#request-configuration). |
| **response** | Nested JSON | Mandatory. Describes the response object and nested message returned from the API when polling the data. For more information, see [response configuration](#response-configuration). |
| **paging**   | Nested JSON | Optional. Describes the pagination payload when polling the data.  For more information, see [paging configuration](#paging-configuration). |

For more information, see [Sample pollingConfig code](#sample-pollingconfig-code).

### auth configuration

The `auth` section of the [pollingConfig](#configure-your-connectors-polling-settings) configuration includes the following parameters, depending on the type defined in the [authType](#authtype) element:

#### Basic authType parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| **Username** | String | Mandatory. Defines user name. |
| **Password** | String | Mandatory. Defines user password. |

#### APIKey authType parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
|**APIKeyName**     |String | Optional. Defines the name of your API key, as one of the following values: <br><br>- `XAuthToken` <br>- `Authorization`        |
|**IsAPIKeyInPostPayload**     |Boolean | Determines where your API key is defined. <br><br>True: API key is defined in the POST request payload <br>False: API key is defined in the header     |
|**APIKeyIdentifier**     |  String | Optional. Defines the name of the identifier for the API key. <br><br>For example, where the authorization is defined as  `"Authorization": "token <secret>"`, this parameter is defined as: `{APIKeyIdentifier: “token”})`     |

#### OAuth2 authType parameters

The Codeless Connector Platform supports OAuth 2.0 authorization code grant.

The Authorization Code grant type is used by confidential and public clients to exchange an authorization code for an access token.

After the user returns to the client via the redirect URL, the application will get the authorization code from the URL and use it to request an access token.


| Name | Type | Description |
| ---- | ---- | ----------- |
| **FlowName** | String | Mandatory. Defines an OAuth2 flow.<br><br>Supported value: `AuthCode` - requires an authorization flow |
| **AccessToken** | String | Optional. Defines an OAuth2 access token, relevant when the access token doesn't expire. |
| **AccessTokenPrepend** | String | Optional. Defines an OAuth2 access token prepend. Default is `Bearer`. |
| **RefreshToken** | String | Mandatory for OAuth2 auth types. Defines the OAuth2 refresh token. |
| **TokenEndpoint** | String | Mandatory for OAuth2 auth types. Defines the OAuth2 token service endpoint. |
| **AuthorizationEndpoint** | String | Optional. Defines the OAuth2 authorization service endpoint. Used only during onboarding or when renewing a refresh token. |
| **RedirectionEndpoint** | String | Optional. Defines a redirection endpoint during onboarding. |
| **AccessTokenExpirationDateTimeInUtc** | String | Optional. Defines an access token expiration datetime, in UTC format. Relevant for when the access token doesn't expire, and therefore has a large datetime in UTC, or when the access token has a large expiration datetime. |
| **RefreshTokenExpirationDateTimeInUtc** | String | Mandatory for OAuth2 auth types. Defines the refresh token expiration datetime in UTC format. |
| **TokenEndpointHeaders** | Dictionary<string, object> | Optional. Defines the headers when calling an OAuth2 token service endpoint.<br><br>Define a string in the serialized `dictionary<string, string>` format: `{'<attr_name>': '<val>', '<attr_name>': '<val>'... }` |
| **AuthorizationEndpointHeaders** | Dictionary<string, object> | Optional. Defines the headers when calling an OAuth2 authorization service endpoint. Used only during onboarding or when renewing a refresh token.<br><br>Define a string in the serialized `dictionary<string, object>` format: `{'<attr_name>': <serialized val>, '<attr_name>': <serialized val>, ... }` |
| **AuthorizationEndpointQueryParameters** | Dictionary<string, object> | Optional. Defines query parameters when calling an OAuth2 authorization service endpoint. Used only during onboarding or when renewing a refresh token.<br><br>Define a string in the serialized `dictionary<string, object>` format: `{'<attr_name>': <serialized val>, '<attr_name>': <serialized val>, ... }` |
| **TokenEndpointQueryParameters** | Dictionary<string, object> | Optional. Define query parameters when calling OAuth2 token service endpoint.<br><br>Define a string in the serialized `dictionary<string, object>` format: `{'<attr_name>': <serialized val>, '<attr_name>': <serialized val>, ... }` |
| **IsTokenEndpointPostPayloadJson** | Boolean | Optional, default is false. Determines whether query parameters are in JSON format and set in the request POST payload. |
| **IsClientSecretInHeader** | Boolean | Optional, default is false. Determines whether the `client_id` and `client_secret` values are defined in the header, as is done in the Basic authentication schema, instead of in the POST payload. |
| **RefreshTokenLifetimeinSecAttributeName** | String | Optional. Defines the attribute name from the token endpoint response, specifying the lifetime of the refresh token, in seconds. |
| **IsJwtBearerFlow** | Boolean | Optional, default is false. Determines whether you are using JWT. |
| **JwtHeaderInJson** | Dictionary<string, object> | Optional. Define the JWT headers in JSON format.<br><br>Define a string in the serialized `dictionary<string, object>` format: `{'<attr_name>': <serialized val>, '<attr_name>': <serialized val>...}` |
| **JwtClaimsInJson** | Dictionary<string, object> | Optional. Defines JWT claims in JSON format.<br><br>Define a string in the serialized `dictionary<string, object>` format: `{'<attr_name>': <serialized val>, '<attr_name>': <serialized val>, ...}` |
| **JwtPem** | String | Optional. Defines a secret key, in PEM Pkcs1 format: `'-----BEGIN RSA PRIVATE KEY-----\r\n{privatekey}\r\n-----END RSA PRIVATE KEY-----\r\n'`<br><br>Make sure to keep the `'\r\n'` code in place. |
| **RequestTimeoutInSeconds** | Integer | Optional. Determines timeout in seconds when calling token service endpoint. Default is 180 seconds |

Here's an example of how an OAuth2 configuration might look:

```json
"pollingConfig": {
    "auth": {
        "authType": "OAuth2",
        "authorizationEndpoint": "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent",
        "redirectionEndpoint": "https://portal.azure.com/TokenAuthorize",
        "tokenEndpoint": "https://oauth2.googleapis.com/token",
        "authorizationEndpointQueryParameters": {},
        "tokenEndpointHeaders": {
            "Accept": "application/json"
        },
        "TokenEndpointQueryParameters": {},
        "isClientSecretInHeader": false,
        "scope": "https://www.googleapis.com/auth/admin.reports.audit.readonly",
        "grantType": "authorization_code",
        "contentType": "application/x-www-form-urlencoded",
        "FlowName": "AuthCode"
    },
```

#### Session authType parameters

| Name                        | Type                       | Description  |
| --------------------------- | -------------------------- | ------------ |
| **QueryParameters**         | Dictionary<string, object> | Optional. A list of query parameters, in the serialized `dictionary<string, string>` format: <br><br>`{'<attr_name>': '<val>', '<attr_name>': '<val>'... }` |
| **IsPostPayloadJson**       | Boolean                    | Optional. Determines whether the query parameters are in JSON format.  |
| **Headers**                 | Dictionary<string, object> | Optional. Defines the header used when calling the endpoint to get the session ID, and when calling the endpoint API.  <br><br> Define the string in the serialized `dictionary<string, string>` format: `{'<attr_name>': '<val>', '<attr_name>': '<val>'... }`        |
| **SessionTimeoutInMinutes** | String                     | Optional. Defines a session timeout, in minutes.       |
| **SessionIdName**           | String                     | Optional. Defines an ID name for the session.  |
| **SessionLoginRequestUri**  | String                     | Optional. Defines a session login request URI. |

### Request configuration

The `request` section of the [pollingConfig](#configure-your-connectors-polling-settings) configuration includes the following parameters:

| Name                               | Type    | Description                                        |
| ---------------------------------- | ------- | -------------------------------------------------- |
| **apiEndpoint**                    | String  | Mandatory. Defines the endpoint to pull data from. |
| **httpMethod**                     | String  | Mandatory. Defines the API method: `GET` or `POST` |
| **queryTimeFormat**                | String, or *UnixTimestamp* or *UnixTimestampInMills* | Mandatory.  Defines the format used to define the query time.    <br><br>This value can be a string, or in *UnixTimestamp* or *UnixTimestampInMills* format to indicate the query start and end time in the UnixTimestamp. |
| **startTimeAttributeName**         | String  | Optional. Defines the name of the attribute that defines the query start time. |
| **endTimeAttributeName**           | String  | Optional. Defines the name of the attribute that defines the query end time. |
| **queryTimeIntervalAttributeName** | String  | Optional. Defines the name of the attribute that defines the query time interval. |
| **queryTimeIntervalDelimiter**     | String  | Optional. Defines the query time interval delimiter. |
| **queryWindowInMin**               | Integer | Optional. Defines the available query window, in minutes. <br><br>Minimum value: `5` |
| **queryParameters**                | Dictionary<string, object> | Optional. Defines the parameters passed in the query in the [`eventsJsonPaths`](#eventsjsonpaths) path. <br><br>Define the string in the serialized `dictionary<string, string>` format: `{'<attr_name>': '<val>', '<attr_name>': '<val>'... }`. |
| **queryParametersTemplate**        | String  | Optional. Defines the query parameters template to use when passing query parameters in advanced scenarios. <br><br>For example: `"queryParametersTemplate": "{'cid': 1234567, 'cmd': 'reporting', 'format': 'siem', 'data': { 'from': '{_QueryWindowStartTime}', 'to': '{_QueryWindowEndTime}'}, '{_APIKeyName}': '{_APIKey}'}"` <br><br>`{_QueryWindowStartTime}` and `{_QueryWindowEndTime}` are only supported in the `queryParameters` and `queryParametersTemplate` request parameters.  <br><br>`{_APIKeyName}` and `{_APIKey}` are only supported in the `queryParametersTemplate` request parameter. |
| **isPostPayloadJson**              | Boolean | Optional. Determines whether the POST payload is in JSON format. |
| **rateLimitQPS**                   | Double  | Optional. Defines the number of calls or queries allowed in a second. |
| **timeoutInSeconds**               | Integer | Optional. Defines the request timeout, in seconds. |
| **retryCount**                     | Integer | Optional. Defines the number of request retries to try if needed. |
| **headers**                        |  Dictionary<string, object> | Optional. Defines the request header value, in the serialized `dictionary<string, object>` format: `{'<attr_name>': '<serialized val>', '<attr_name>': '<serialized val>'... }` |

### Response configuration

The `response` section of the [pollingConfig](#configure-your-connectors-polling-settings) configuration includes the following parameters:

|Name  |Type  |Description  |
|---------|---------|---------|
|  <a name="eventsjsonpaths"></a> **eventsJsonPaths**  |   List of strings | Mandatory.  Defines the path to the message in the response JSON. <br><br>A JSON path expression specifies a path to an element, or a set of elements, in a JSON structure |
| **successStatusJsonPath**    |  String | Optional. Defines the path to the success message in the response JSON. |
|  **successStatusValue**   | String | Optional. Defines the path to the success message value in the response JSON    |
|  **isGzipCompressed**   |   Boolean | Optional. Determines whether the response is compressed in a gzip file.      |


The following code shows an example of the [eventsJsonPaths](#eventsjsonpaths) value for a top-level message:

```json
"eventsJsonPaths": [
              "$"
            ]
```


### Paging configuration

The `paging` section of the [pollingConfig](#configure-your-connectors-polling-settings) configuration includes the following parameters:

|Name  |Type  |Description  |
|---------|---------|---------|
|  **pagingType**   | String | Mandatory. Determines the paging type to use in results, as one of the following values: `None`, `LinkHeader`, `NextPageToken`, `NextPageUrl`, `Offset`     |
| **linkHeaderTokenJsonPath**    |  String | Optional. Defines the JSON path to link header in the response JSON, if the `LinkHeader` isn't defined in the response header. |
| **nextPageTokenJsonPath**    |  String | Optional. Defines the path to a next page token JSON. |
| **hasNextFlagJsonPath**    |String | Optional. Defines the path to the `HasNextPage` flag attribute. |
|  **nextPageTokenResponseHeader**   | String | Optional. Defines the *next page* token header name in the response. |
| **nextPageParaName**    |  String | Optional.  Determines the *next page* name in the request. |
| **nextPageRequestHeader**    |   String | Optional. Determines the *next page* header name in the request.   |
| **nextPageUrl**    |   String | Optional. Determines the *next page* URL, if it's different from the initial request URL. |
| **nextPageUrlQueryParameters**    |  String | Optional.  Determines the *next page* URL's query parameters if it's different from the initial request's URL. <br><br>Define the string in the serialized `dictionary<string, object>` format: `{'<attr_name>': <val>, '<attr_name>': <val>... }`        |
|  **offsetParaName**   |    String | Optional. Defines the name of the offset parameter. |
|  **pageSizeParaName**   |   String | Optional. Defines the name of the page size parameter. |
| **PageSize**    |     Integer | Defines the paging size. |



### Sample pollingConfig code

The following code shows an example of the `pollingConfig` section of the [CCP configuration](#create-a-connector-json-configuration-file) file:

```json
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


## Deploy your connector in Microsoft Sentinel and start ingesting data

After creating your [JSON configuration file](#create-a-connector-json-configuration-file), including both the [user interface](#configure-your-connectors-user-interface) and [polling](#configure-your-connectors-polling-settings) configuration, deploy your connector in your Microsoft Sentinel workspace.

1. Use one of the following options to deploy your data connector.

    > [!TIP]
    > The advantage of deploying via an Azure Resource Manager (ARM) template is that several values are built-in to the template, and you don't need to define them manually in an API call.
    >

    # [Deploy via ARM template](#tab/deploy-via-arm-template)

    Wrap your JSON configuration collections in an ARM template to deploy your connector. To ensure that your data connector gets deployed to the correct workspace, make sure to either define the workspace in the ARM template, or select the workspace when deploying the ARM template.

    1. Prepare an [ARM template JSON file](/azure/templates/microsoft.securityinsights/dataconnectors) for your connector. For example, see the following ARM template JSON files:

        - Data connector in the [Slack solution](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SlackAudit/Data%20Connectors/SlackNativePollerConnector/azuredeploy_Slack_native_poller_connector.json)
        - Data connector in the [GitHub solution](https://github.com/Azure/Azure-Sentinel/blob/3d324aed163c1702ba0cab6de203ac0bf4756b8c/Solutions/GitHub/Data%20Connectors/azuredeploy_GitHub_native_poller_connector.json)

    1. In the Azure portal, search for **Deploy a custom template**.

    1. On the **Custom deployment** page, select **Build your own template in the editor** > **Load file**. Browse to and select your local ARM template, and then save your changes.

    1. Select your subscription and resource group, and then enter the Log Analytics workspace where you want to deploy your custom connector.

    1. Select **Review + create** to deploy your custom connector to Microsoft Sentinel.

    1. In Microsoft Sentinel, go to the **Data connectors** page, search for your new connector. Configure it to start ingesting data.

    For more information, see [Deploy a local template](../azure-resource-manager/templates/deployment-tutorial-local-template.md?tabs=azure-powershell) in the Azure Resource Manager documentation.

    # [Deploy via API](#tab/deploy-via-api)

    1. Authenticate to the Azure API. For more information, see [Getting started with REST](/rest/api/azure/).

    1. Invoke a [CREATE or UPDATE](/rest/api/securityinsights/preview/data-connectors/create-or-update) API call to Microsoft Sentinel to deploy your new connector. In the request body, define the `kind` value as `APIPolling`.
    
    Your data connector is deployed to your Microsoft Sentinel workspace, and is available on the **Data connectors** page.

    ---

1. Configure your data connector to connect your data source and start ingesting data into Microsoft Sentinel. You can connect to your data source either via the portal, as with out-of-the-box data connectors, or via API.

    When you use the Azure portal to connect, user data is sent automatically. When you connect via API, you'll need to send the relevant authentication parameters in the API call.

    # [Connect via the Azure portal](#tab/connect-via-the-azure-portal)

    In your Microsoft Sentinel data connector page, follow the instructions you've provided to connect to your data connector.

    The data connector page in Microsoft Sentinel is controlled by the [InstructionSteps](#instructionsteps) configuration in the `connectorUiConfig` element of the [CCP JSON configuration](#create-a-connector-json-configuration-file) file.  If you have issues with the user interface connection, make sure that you have the correct configuration for your authentication type.

    # [Connect via API](#tab/connect-via-api)

    Use the [CONNECT](/rest/api/securityinsights/preview/data-connectors/connect) endpoint to send a PUT method and pass the JSON configuration directly in the body of the message. For more information, see [auth configuration](#auth-configuration).

    Use the following API attributes, depending on the [authType](#authtype) defined. For each `authType` parameter, all listed attributes are mandatory and are string values.

    |authType  |Attributes  |
    |---------|---------|
    |**Basic**     |  Define: <br>- `kind` as `Basic` <br>- `userName` as your username, in quotes <br>- `password` as your password, in quotes     |
    |**APIKey**     |Define: <br>- `kind` as `APIKey` <br>- `APIKey` as your full API key string, in quotes|


    If you're using a [placeholder data in your template](#apikey), send the data together with the `placeHolderValue` attributes that hold the user data. For example:

    ```json
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

If you don't see data flowing into Microsoft Sentinel, check your data source documentation and troubleshooting resources, check the configuration details, and check the connectivity. For more information, see [Monitor the health of your data connectors](monitor-data-connector-health.md).

### Disconnect your connector

If you no longer need your connector's data, disconnect the connector to stop the data flow.

Use one of the following methods:

- **Azure portal**: In your Microsoft Sentinel data connector page, select **Disconnect**.

- **API**: Use the [DISCONNECT](/rest/api/securityinsights/preview/data-connectors/disconnect) API to send a PUT call with an empty body to the following URL:

    ```http
    https://management.azure.com /subscriptions/{{SUB}}/resourceGroups/{{RG}}/providers/Microsoft.OperationalInsights/workspaces/{{WS-NAME}}/providers/Microsoft.SecurityInsights/dataConnectors/{{Connector_Id}}/disconnect?api-version=2021-03-01-preview
    ```

## Next steps

If you haven't yet, share your new codeless data connector with the Microsoft Sentinel community! Create a solution for your data connector and share it in the Microsoft Sentinel Marketplace.

For more information, see 
- [About Microsoft Sentinel solutions](sentinel-solutions.md).
- [Data connector ARM template reference](/azure/templates/microsoft.securityinsights/dataconnectors#dataconnectors-objects-1)
