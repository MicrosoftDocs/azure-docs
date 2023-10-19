---
title: connectorUIConfig supplemental reference for the Data Connector Definition
description: This article provides a supplemental reference for creating connectorUIConfig JSON for the Data Connector Definition API as part of the Codeless Connector Platform.
services: sentinel
author: austinmccollum
ms.topic: reference
ms.date: 10/19/2023
ms.author: austinmc

---

# 

Your custom CCP connector has two primary JSON sections needed for deployment. Fill in these areas to define how your connector is displayed in the Azure portal and how it connects Microsoft Sentinel to your data source.

- `connectorUiConfig`. Defines the visual elements and text displayed on the data connector page in Microsoft Sentinel. For more information, see [Configure your connector's user interface](#configure-your-connectors-user-interface).

- `pollingConfig`. Defines how Microsoft Sentinel collects data from your data source. For more information, see [Configure your connector's polling settings](#configure-your-connectors-polling-settings).

Then, if you deploy your codeless connector via ARM, you'll wrap these sections in the ARM template for data connectors.

Review [other CCP data connectors](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors#codeless-connector-platform-ccp-preview--native-microsoft-sentinel-polling) as examples or download the example template, [DataConnector_API_CCP_template.json (Preview)](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors#build-the-connector).

## Configure your connector's user interface

This section describes the configuration options available to customize the user interface of the data connector page.

The following image shows a sample data connector page, highlighted with numbers that correspond to notable areas of the user interface:

:::image type="content" source="media/create-codeless-connector/sample-data-connector-page.png" alt-text="Screenshot of a sample data connector page.":::

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
|**fillWith**     |  ENUM       | Optional. Array of environment variables used to populate a placeholder. Separate multiple placeholders with commas. For example: `{0},{1}`  <br><br>Supported values: `workspaceId`, `workspaceName`, `primaryKey`, `MicrosoftAwsAccount`, `subscriptionId`      |
|**label**     |  String       |  Defines the text for the label above a text box.      |
|**value**     |  String       |  Defines the value to present in the text box, supports placeholders.       |
|**rows**     |   Rows      |  Optional. Defines the rows in the user interface area. By default, set to **1**.       |
|**wideLabel**     |Boolean         | Optional. Determines a wide label for long strings. By default, set to `false`.        |

#### InfoMessage

Here's an example of an inline information message:

:::image type="content" source="media/create-codeless-connector/inline-information-message.png" alt-text="Screenshot of an inline information message.":::

In contrast, the following image shows a *non*-inline information message:

:::image type="content" source="media/create-codeless-connector/non-inline-information-message.png" alt-text="Screenshot of a non-inline information message.":::


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

Some **InstallAgent** types appear as a button, others will appear as a link. Here are examples of both:

:::image type="content" source="media/create-codeless-connector/link-by-button.png" alt-text="Screenshot of a link added as a button.":::

:::image type="content" source="media/create-codeless-connector/link-by-text.png" alt-text="Screenshot of a link added as inline text.":::

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

