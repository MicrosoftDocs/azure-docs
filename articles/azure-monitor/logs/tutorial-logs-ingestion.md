---
title: 'Tutorial: Send data to Azure Monitor using Logs ingestion API (Resource Manager templates)'
description: Tutorial on how to send custom data to a Log Analytics workspace in Azure Monitor by using the Logs ingestion API. Required configuration performed with Azure Resource Manager templates.
ms.topic: tutorial
ms.date: 02/01/2023
---

# Tutorial: Send data to Azure Monitor using Logs ingestion API
The [Logs Ingestion API](logs-ingestion-api-overview.md) in Azure Monitor allows you to send custom data to a Log Analytics workspace. This tutorial uses Azure Resource Manager templates (ARM templates) to walk through configuration of the components required to support the API and then provides a sample application using both the REST API and client libraries.

> [!NOTE]
> This tutorial uses ARM templates to configure custom logs. For a similar tutorial using the Azure portal, see [Tutorial: Send data to Azure Monitor Logs using Logs ingestion API (Azure portal)](tutorial-logs-ingestion-portal.md).

In this tutorial, you learn to:

> [!div class="checklist"]
> * Create a custom table in a Log Analytics workspace.
> * Create a data collection endpoint (DCE) to receive data over HTTP.
> * Create a data collection rule (DCR) that transforms incoming data to match the schema of the target table.
> * Create a sample application to send custom data to Azure Monitor using both REST API and client libraries.

> [!NOTE]
> This tutorial uses PowerShell from Azure Cloud Shell to make REST API calls by using the Azure Monitor **Tables** API and the Azure portal to install ARM templates. You can use any other method to make these calls.
> 
> See [.NET](/dotnet/api/overview/azure/Monitor.Ingestion-readme), [Java](/java/api/overview/azure/monitor-ingestion-readme), [JavaScript](/javascript/api/overview/azure/monitor-ingestion-readme), or [Python](/python/api/overview/azure/monitor-ingestion-readme) for guidance on using the Logs ingestion API client libraries for other languages.


## Prerequisites
To complete this tutorial, you need:

- A Log Analytics workspace where you have at least [contributor rights](manage-access.md#azure-rbac).
- [Permissions to create DCR objects](../essentials/data-collection-rule-overview.md#permissions) in the workspace.


## Collect workspace details
Start by gathering information that you'll need from your workspace.

Go to your workspace in the **Log Analytics workspaces** menu in the Azure portal. On the **Properties** page, copy the **Resource ID** and save it for later use.

:::image type="content" source="media/tutorial-logs-ingestion-api/workspace-resource-id.png" lightbox="media/tutorial-logs-ingestion-api/workspace-resource-id.png" alt-text="Screenshot that shows the workspace resource ID.":::

## Create an Active Directory application
Start by registering an Azure Active Directory application to authenticate against the API. Any Resource Manager authentication scheme is supported, but this tutorial follows the [Client Credential Grant Flow scheme](../../active-directory/develop/v2-oauth2-client-creds-grant-flow.md).

1. On the **Azure Active Directory** menu in the Azure portal, select **App registrations** > **New registration**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-app-registration.png" lightbox="media/tutorial-logs-ingestion-portal/new-app-registration.png" alt-text="Screenshot that shows the app registration screen.":::

1. Give the application a name and change the tenancy scope if the default isn't appropriate for your environment. A **Redirect URI** isn't required.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-app-name.png" lightbox="media/tutorial-logs-ingestion-portal/new-app-name.png" alt-text="Screenshot that shows app details.":::

1. After registration, you can view the details of the application. Note the **Application (client) ID** and the **Directory (tenant) ID**. You'll need these values later in the process.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-app-id.png" lightbox="media/tutorial-logs-ingestion-portal/new-app-id.png" alt-text="Screenshot that shows the app ID.":::

1. Generate an application client secret, which is similar to creating a password to use with a username. Select **Certificates & secrets** > **New client secret**. Give the secret a name to identify its purpose and select an **Expires** duration. The option **12 months** is selected here. For a production implementation, you would follow best practices for a secret rotation procedure or use a more secure authentication mode, such as a certificate.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-app-secret.png" lightbox="media/tutorial-logs-ingestion-portal/new-app-secret.png" alt-text="Screenshot that shows the secret for the new app.":::

1. Select **Add** to save the secret and then note the **Value**. Ensure that you record this value because you can't recover it after you leave this page. Use the same security measures as you would for safekeeping a password because it's the functional equivalent.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-app-secret-value.png" lightbox="media/tutorial-logs-ingestion-portal/new-app-secret-value.png" alt-text="Screenshot that shows the secret value for the new app.":::


## Create a data collection endpoint
A [DCE](../essentials/data-collection-endpoint-overview.md) is required to accept the data being sent to Azure Monitor. After you configure the DCE and link it to a DCR, you can send data over HTTP from your application. The DCE must be located in the same region as the Log Analytics workspace where the data will be sent.

## [Azure portal](#tab/portal)

1. To create a new DCE, go to the **Monitor** menu in the Azure portal. Select **Data Collection Endpoints** and then select **Create**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-data-collection-endpoint.png" lightbox="media/tutorial-logs-ingestion-portal/new-data-collection-endpoint.png" alt-text="Screenshot that shows new DCE.":::

1. Provide a name for the DCE and ensure that it's in the same region as your workspace. Select **Create** to create the DCE.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/data-collection-endpoint-details.png" lightbox="media/tutorial-logs-ingestion-portal/data-collection-endpoint-details.png" alt-text="Screenshot that shows DCE details.":::

1. After the DCE is created, select it so that you can view its properties. Note the **Logs ingestion** URI because you'll need it in a later step.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/data-collection-endpoint-uri.png" lightbox="media/tutorial-logs-ingestion-portal/data-collection-endpoint-uri.png" alt-text="Screenshot that shows DCE URI.":::


## [ARM template](#tab/arm)


1. In the Azure portal's search box, enter **template** and then select **Deploy a custom template**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/deploy-custom-template.png" lightbox="media/tutorial-workspace-transformations-api/deploy-custom-template.png" alt-text="Screenshot that shows how to deploy a custom template.":::

1. Select **Build your own template in the editor**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/build-custom-template.png" lightbox="media/tutorial-workspace-transformations-api/build-custom-template.png" alt-text="Screenshot that shows how to build a template in the editor.":::

1. Paste the following ARM template into the editor and then select **Save**. You don't need to modify this template because you'll provide values for its parameters.

    :::image type="content" source="media/tutorial-workspace-transformations-api/edit-template.png" lightbox="media/tutorial-workspace-transformations-api/edit-template.png" alt-text="Screenshot that shows how to edit an ARM template.":::


    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "dataCollectionEndpointName": {
                "type": "string",
                "metadata": {
                    "description": "Specifies the name of the Data Collection Endpoint to create."
                }
            },
            "location": {
                "type": "string",
                "defaultValue": "westus2",
                "allowedValues": [
                    "westus2",
                    "eastus2",
                    "eastus2euap"
                ],
                "metadata": {
                    "description": "Specifies the location in which to create the Data Collection Endpoint."
                }
            }
        },
        "resources": [
            {
                "type": "Microsoft.Insights/dataCollectionEndpoints",
                "name": "[parameters('dataCollectionEndpointName')]",
                "location": "[parameters('location')]",
                "apiVersion": "2021-04-01",
                "properties": {
                    "networkAcls": {
                    "publicNetworkAccess": "Enabled"
                    }
                }
            }
        ],
        "outputs": {
            "dataCollectionEndpointId": {
                "type": "string",
                "value": "[resourceId('Microsoft.Insights/dataCollectionEndpoints', parameters('dataCollectionEndpointName'))]"
            }
        }
    }
    ```

1. On the **Custom deployment** screen, specify a **Subscription** and **Resource group** to store the DCR and then provide values like a **Name** for the DCE. The **Location** should be the same location as the workspace. The **Region** will already be populated and will be used for the location of the DCE.

    :::image type="content" source="media/tutorial-logs-ingestion-api/data-collection-endpoint-custom-deploy.png" lightbox="media/tutorial-logs-ingestion-api/data-collection-endpoint-custom-deploy.png" alt-text="Screenshot to edit custom deployment values.":::

1. Select **Review + create** and then select **Create** after you review the details.

1. After the DCE is created, select it so that you can view its properties. Note the **Logs ingestion URI** because you'll need it in a later step.

    :::image type="content" source="media/tutorial-logs-ingestion-api/data-collection-endpoint-overview.png" lightbox="media/tutorial-logs-ingestion-api/data-collection-endpoint-overview.png" alt-text="Screenshot that shows the DCE URI.":::

1. Select **JSON View** to view other details for the DCE. Copy the **Resource ID** because you'll need it in a later step.

    :::image type="content" source="media/tutorial-logs-ingestion-api/data-collection-endpoint-json.png" lightbox="media/tutorial-logs-ingestion-api/data-collection-endpoint-json.png" alt-text="Screenshot that shows the DCE resource ID.":::

---


## Create a new table and data collection rule
The custom table must be created before you can send data to it. 

### [Azure portal](#tab/portal)

### Create a new table
1. Go to the **Log Analytics workspaces** menu in the Azure portal and select **Tables**. The tables in the workspace will appear. Select **Create** > **New custom log (DCR based)**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-custom-log.png" lightbox="media/tutorial-logs-ingestion-portal/new-custom-log.png" alt-text="Screenshot that shows the new DCR-based custom log.":::

1. Specify a name for the table. You don't need to add the *_CL* suffix required for a custom table because it will be automatically added to the name you specify.

1. Select **Create a new data collection rule** to create the DCR that will be used to send data to this table. If you have an existing DCR, you can choose to use it instead. Specify the **Subscription**, **Resource group**, and **Name** for the DCR that will contain the custom log configuration.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-data-collection-rule.png" lightbox="media/tutorial-logs-ingestion-portal/new-data-collection-rule.png" alt-text="Screenshot that shows the new DCR.":::

1. Select the DCE that you created, and then select **Next**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-table-name.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-table-name.png" alt-text="Screenshot that shows the custom log table name.":::

### Parse and filter sample data
Instead of directly configuring the schema of the table, you can upload a file with a sample JSON array of data through the portal, and Azure Monitor will set the schema automatically. The sample JSON file must contain one or more log records structured as an array, in the same way they data is sent in the body of an HTTP request of the logs ingestion API call.

1. Select **Browse for files** and locate the *data_sample.json* file that you previously created.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-browse-files.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-browse-files.png" alt-text="Screenshot that shows custom log browse for files.":::

1. Data from the sample file is displayed with a warning that `TimeGenerated` isn't in the data. All log tables within Azure Monitor Logs are required to have a `TimeGenerated` column populated with the timestamp of the logged event. In this sample, the timestamp of the event is stored in the field called `Time`. You'll add a transformation that will rename this column in the output.

1. Select **Transformation editor** to open the transformation editor to add this column. You'll add a transformation that will rename this column in the output. The transformation editor lets you create a transformation for the incoming data stream. This is a KQL query that's run against each incoming record. The results of the query will be stored in the destination table. For more information on transformation queries, see [Data collection rule transformations in Azure Monitor](../essentials//data-collection-transformations.md).

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-data-preview.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-data-preview.png" alt-text="Screenshot that shows the custom log data preview.":::

1. Add the following query to the transformation editor to add the `TimeGenerated` column to the output:

    ```kusto
    source
    | extend TimeGenerated = todatetime(Time)
    ```

1. Select **Run** to view the results. You can see that the `TimeGenerated` column is now added to the other columns. Most of the interesting data is contained in the `RawData` column, though.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-query-01.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-query-01.png" alt-text="Screenshot that shows the initial custom log data query.":::

1. Modify the query to the following example, which extracts the client IP address, the HTTP method, the address of the page being accessed, and the response code from each log entry.

    ```kusto
    source
    | extend TimeGenerated = todatetime(Time)
    | parse RawData with 
    ClientIP:string
    ' ' *
    ' ' *
    ' [' * '] "' RequestType:string
    " " Resource:string
    " " *
    '" ' ResponseCode:int
    " " *
    ```

1. Select **Run** to view the results. This action extracts the contents of `RawData` into the separate columns `ClientIP`, `RequestType`, `Resource`, and `ResponseCode`.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-query-02.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-query-02.png" alt-text="Screenshot that shows the custom log data query with parse command.":::

1. The query can be optimized more though by removing the `RawData` and `Time` columns because they aren't needed anymore. You can also filter out any records with `ResponseCode` of 200 because you're only interested in collecting data for requests that weren't successful. This step reduces the volume of data being ingested, which reduces its overall cost.

    ```kusto
    source
    | extend TimeGenerated = todatetime(Time)
    | parse RawData with 
    ClientIP:string
    ' ' *
    ' ' *
    ' [' * '] "' RequestType:string
    " " Resource:string
    " " *
    '" ' ResponseCode:int
    " " *
    | where ResponseCode != 200
    | project-away Time, RawData
    ```

1. Select **Run** to view the results.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-query-03.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-query-03.png" alt-text="Screenshot that shows a custom log data query with a filter.":::

1. Select **Apply** to save the transformation and view the schema of the table that's about to be created. Select **Next** to proceed.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-final-schema.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-final-schema.png" alt-text="Screenshot that shows a custom log final schema.":::

1. Verify the final details and select **Create** to save the custom log.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-create.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-create.png" alt-text="Screenshot that shows custom log create.":::


## [ARM template](#tab/arm)

### Create a new table

Use the **Tables - Update** API to create the table with the following PowerShell code.

> [!IMPORTANT]
> Custom tables must use a suffix of `_CL`.

1. Select the **Cloud Shell** button in the Azure portal and ensure the environment is set to **PowerShell**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/open-cloud-shell.png" lightbox="media/tutorial-workspace-transformations-api/open-cloud-shell.png" alt-text="Screenshot that shows opening Cloud Shell.":::

1. Copy the following PowerShell code and replace the **Path** parameter with the appropriate values for your workspace in the `Invoke-AzRestMethod` command. Paste it into the Cloud Shell prompt to run it.

    ```PowerShell
    $tableParams = @'
    {
        "properties": {
            "schema": {
                "name": "MyTable_CL",
                "columns": [
                    {
                        "name": "TimeGenerated",
                        "type": "datetime",
                        "description": "The time at which the data was generated"
                    },
                    {
                        "name": "AdditionalContext",
                        "type": "dynamic",
                        "description": "Additional message properties"
                    },
                    {
                        "name": "CounterName",
                        "type": "string",
                        "description": "Name of the counter"
                    },
                    {
                        "name": "CounterValue",
                        "type": "real",
                        "description": "Value collected for the counter"
                    }
                ]
            }
        }
    }
    '@

    Invoke-AzRestMethod -Path "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/microsoft.operationalinsights/workspaces/{workspace}/tables/MyTable_CL?api-version=2021-12-01-preview" -Method PUT -payload $tableParams
    ```


### Create a data collection rule
The [DCR](../essentials/data-collection-rule-overview.md) defines the schema of data that's being sent to the HTTP endpoint and the [transformation](../essentials/data-collection-transformations.md) that will be applied to it before it's sent to the workspace. The DCR also defines the destination workspace and table the transformed data will be sent to.

1. In the Azure portal's search box, enter **template** and then select **Deploy a custom template**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/deploy-custom-template.png" lightbox="media/tutorial-workspace-transformations-api/deploy-custom-template.png" alt-text="Screenshot that shows how to deploy a custom template.":::

1. Select **Build your own template in the editor**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/build-custom-template.png" lightbox="media/tutorial-workspace-transformations-api/build-custom-template.png" alt-text="Screenshot that shows how to build a template in the editor.":::

1. Paste the following ARM template into the editor and then select **Save**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/edit-template.png" lightbox="media/tutorial-workspace-transformations-api/edit-template.png" alt-text="Screenshot that shows how to edit an ARM template.":::

    Notice the following details in the DCR defined in this template:

    - `dataCollectionEndpointId`: Identifies the Resource ID of the data collection endpoint.
    - `streamDeclarations`: Defines the columns of the incoming data.
    - `destinations`: Specifies the destination workspace.
    - `dataFlows`: Matches the stream with the destination workspace and specifies the transformation query and the destination table. The output of the destination query is what will be sent to the destination table.

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "dataCollectionRuleName": {
                "type": "string",
                "metadata": {
                    "description": "Specifies the name of the Data Collection Rule to create."
                }
            },
            "location": {
                "type": "string",
                "metadata": {
                    "description": "Specifies the location in which to create the Data Collection Rule."
                }
            },
            "workspaceResourceId": {
                "type": "string",
                "metadata": {
                    "description": "Specifies the Azure resource ID of the Log Analytics workspace to use."
                }
            },
            "endpointResourceId": {
                "type": "string",
                "metadata": {
                    "description": "Specifies the Azure resource ID of the Data Collection Endpoint to use."
                }
            }
        },
        "resources": [
            {
                "type": "Microsoft.Insights/dataCollectionRules",
                "name": "[parameters('dataCollectionRuleName')]",
                "location": "[parameters('location')]",
                "apiVersion": "2021-09-01-preview",
                "properties": {
                    "dataCollectionEndpointId": "[parameters('endpointResourceId')]",
                    "streamDeclarations": {
                        "Custom-MyTableRawData": {
                            "columns": [
                                {
                                    "name": "Time",
                                    "type": "datetime"
                                },
                                {
                                    "name": "Computer",
                                    "type": "string"
                                },
                                {
                                    "name": "AdditionalContext",
                                    "type": "string"
                                },
                                {
                                    "name": "CounterName",
                                    "type": "string"
                                },
                                {
                                    "name": "CounterValue",
                                    "type": "real"
                                }
                            ]
                        }
                    },
                    "destinations": {
                        "logAnalytics": [
                            {
                                "workspaceResourceId": "[parameters('workspaceResourceId')]",
                                "name": "clv2ws1"
                            }
                        ]
                    },
                    "dataFlows": [
                        {
                            "streams": [
                                "Custom-MyTableRawData"
                            ],
                            "destinations": [
                                "clv2ws1"
                            ],
                            "transformKql": "source | extend jsonContext = parse_json(AdditionalContext) | project TimeGenerated = Time, Computer, AdditionalContext = jsonContext, CounterName=tostring(jsonContext.CounterName), CounterValue=toreal(jsonContext.CounterValue)",
                            "outputStream": "Custom-MyTable_CL"
                        }
                    ]
                }
            }
        ],
        "outputs": {
            "dataCollectionRuleId": {
                "type": "string",
                "value": "[resourceId('Microsoft.Insights/dataCollectionRules', parameters('dataCollectionRuleName'))]"
            }
        }
    }
    ```

1. On the **Custom deployment** screen, specify a **Subscription** and **Resource group** to store the DCR. Then provide values defined in the template. The values include a **Name** for the DCR and the **Workspace Resource ID** that you collected in a previous step. The **Location** should be the same location as the workspace. The **Region** will already be populated and will be used for the location of the DCR.

    :::image type="content" source="media/tutorial-workspace-transformations-api/custom-deployment-values.png" lightbox="media/tutorial-workspace-transformations-api/custom-deployment-values.png" alt-text="Screenshot that shows how to edit custom deployment values.":::

1. Select **Review + create** and then select **Create** after you review the details.

1. When the deployment is complete, expand the **Deployment details** box and select your DCR to view its details. Select **JSON View**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/data-collection-rule-details.png" lightbox="media/tutorial-workspace-transformations-api/data-collection-rule-details.png" alt-text="Screenshot that shows DCR details.":::

1. Copy the **Immutable ID** for the DCR. You'll use it in a later step when you send sample data using the API.

    :::image type="content" source="media/tutorial-logs-ingestion-api/data-collection-rule-json-view.png" lightbox="media/tutorial-workspace-transformations-api/data-collection-rule-json-view.png" alt-text="Screenshot that shows DCR JSON view.":::

    > [!NOTE]
    > All the properties of the DCR, such as the transformation, might not be displayed in the Azure portal even though the DCR was successfully created with those properties.

---


## Assign permissions to a DCR
After the DCR has been created, the application needs to be given permission to it. Permission will allow any application using the correct application ID and application key to send data to the new DCE and DCR.

## [Azure portal](#tab/portal)

1. On the **Monitor** menu in the Azure portal, select **Data collection rules** and select the DCR you created. From **Overview** for the DCR, select **JSON View**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/data-collection-rule-json-view.png" lightbox="media/tutorial-logs-ingestion-portal/data-collection-rule-json-view.png" alt-text="Screenshot that shows the DCR JSON view.":::

1. Copy the **immutableId** value.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/data-collection-rule-immutable-id.png" lightbox="media/tutorial-logs-ingestion-portal/data-collection-rule-immutable-id.png" alt-text="Screenshot that shows collecting the immutable ID from the JSON view.":::

1. Select **Access Control (IAM)** for the DCR and then select **Add role assignment**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-create.png" alt-text="Screenshot that shows adding the custom role assignment to the DCR.":::

1. Select **Monitoring Metrics Publisher** > **Next**. You could instead create a custom action with the `Microsoft.Insights/Telemetry/Write` data action.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment-select-role.png" lightbox="media/tutorial-logs-ingestion-portal/add-role-assignment-select-role.png" alt-text="Screenshot that shows selecting the role for the DCR role assignment.":::

1. Select **User, group, or service principal** for **Assign access to** and choose **Select members**. Select the application that you created and then choose **Select**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment-select-member.png" lightbox="media/tutorial-logs-ingestion-portal/add-role-assignment-select-member.png" alt-text="Screenshot that shows selecting members for the DCR role assignment.":::

1. Select **Review + assign** and verify the details before you save your role assignment.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment-save.png" lightbox="media/tutorial-logs-ingestion-portal/add-role-assignment-save.png" alt-text="Screenshot that shows saving the DCR role assignment.":::

## [ARM template](#tab/arm)

1. From the DCR in the Azure portal, select **Access Control (IAM)** > **Add role assignment**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-create.png" alt-text="Screenshot that shows adding a custom role assignment to DCR.":::

1. Select **Monitoring Metrics Publisher** and select **Next**. You could instead create a custom action with the `Microsoft.Insights/Telemetry/Write` data action.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment-select-role.png" lightbox="media/tutorial-logs-ingestion-portal/add-role-assignment-select-role.png" alt-text="Screenshot that shows selecting a role for DCR role assignment.":::

1. Select **User, group, or service principal** for **Assign access to** and choose **Select members**. Select the application that you created and choose **Select**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment-select-member.png" lightbox="media/tutorial-logs-ingestion-portal/add-role-assignment-select-member.png" alt-text="Screenshot that shows selecting members for the DCR role assignment.":::

1. Select **Review + assign** and verify the details before you save your role assignment.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment-save.png" lightbox="media/tutorial-logs-ingestion-portal/add-role-assignment-save.png" alt-text="Screenshot that shows saving the DCR role assignment.":::

---

## Sample code

## [PowerShell](#tab/powershell)

The following PowerShell code sends data to the endpoint by using HTTP REST fundamentals.

> [!NOTE]
> This tutorial uses commands that require PowerShell v7.0 or later. Make sure your local installation of PowerShell is up to date or execute this script by using Azure Cloud Shell.

1. Run the following PowerShell command, which adds a required assembly for the script.

    ```powershell
    Add-Type -AssemblyName System.Web
    ```

1. Replace the parameters in the **Step 0** section with values from the resources that you created. You might also want to replace the sample data in the **Step 2** section with your own.

    ```powershell
    ### Step 0: Set variables required for the rest of the script.
    
    # information needed to authenticate to AAD and obtain a bearer token
    $tenantId = "00000000-0000-0000-00000000000000000" #Tenant ID the data collection endpoint resides in
    $appId = " 100000000-0000-0000-00000000000000000" #Application ID created and granted permissions
    $appSecret = "0000000000000000000000000000000000000000" #Secret created for the application
    
    # information needed to send data to the DCR endpoint
    $dceEndpoint = "https://logs-ingestion-rzmk.eastus2-1.ingest.monitor.azure.com" #the endpoint property of the Data Collection Endpoint object
    $dcrImmutableId = "dcr-00000000000000000000000000000000" #the immutableId property of the DCR object
    $streamName = "Custom-MyTableRawData" #name of the stream in the DCR that represents the destination table
    
    
    ### Step 1: Obtain a bearer token used later to authenticate against the DCE.
    
    $scope= [System.Web.HttpUtility]::UrlEncode("https://monitor.azure.com//.default")   
    $body = "client_id=$appId&scope=$scope&client_secret=$appSecret&grant_type=client_credentials";
    $headers = @{"Content-Type"="application/x-www-form-urlencoded"};
    $uri = "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token"
    
    $bearerToken = (Invoke-RestMethod -Uri $uri -Method "Post" -Body $body -Headers $headers).access_token
    
    
    ### Step 2: Create some sample data. 
    
    $currentTime = Get-Date ([datetime]::UtcNow) -Format O
    $staticData = @"
    [
    {
        "Time": "$currentTime",
        "Computer": "Computer1",
        "AdditionalContext": {
            "InstanceName": "user1",
            "TimeZone": "Pacific Time",
            "Level": 4,
            "CounterName": "AppMetric1",
            "CounterValue": 15.3    
        }
    },
    {
        "Time": "$currentTime",
        "Computer": "Computer2",
        "AdditionalContext": {
            "InstanceName": "user2",
            "TimeZone": "Central Time",
            "Level": 3,
            "CounterName": "AppMetric1",
            "CounterValue": 23.5     
        }
    }
    ]
    "@;
    
    
    ### Step 3: Send the data to the Log Analytics workspace via the DCE.
    
    $body = $staticData;
    $headers = @{"Authorization"="Bearer $bearerToken";"Content-Type"="application/json"};
    $uri = "$dceEndpoint/dataCollectionRules/$dcrImmutableId/streams/$($streamName)?api-version=2021-11-01-preview"
    
    $uploadResponse = Invoke-RestMethod -Uri $uri -Method "Post" -Body $body -Headers $headers
    ```

    > [!NOTE]
    > If you receive an `Unable to find type [System.Web.HttpUtility].` error, run the last line in section 1 of the script for a fix and execute it. Executing it uncommented as part of the script won't resolve the issue. The command must be executed separately.

1. After you execute this script, you should see an `HTTP - 204` response. In a few minutes, the data arrives to your Log Analytics workspace.

## [Python](#tab/python)

The following script uses the [Azure Monitor Ingestion client library for Python](/python/api/overview/azure/monitor-ingestion-readme).

```python
### Step 0: Set variables and get modules required for the rest of the script.

# information needed to authenticate to AAD and obtain a bearer token
tenant_id = "00000000-0000-0000-00000000000000000" # tenant ID the data collection endpoint resides in
client_id = "00000000-0000-0000-00000000000000000" # application ID created and granted permission to the DCR
secret_value = "0000000000000000000000000000000000000000" # value of the secret created for the application

# information needed to send data to the DCR endpoint
dce_endpoint = "https://logs-ingestion-rzmk.eastus2-1.ingest.monitor.azure.com" # ingestion endpoint of the Data Collection Endpoint object
dcr_immutableid = "dcr-00000000000000000000000000000000" # immutableId property of the Data Collection Rule
stream_name = "Custom-MyTableRawData" #name of the stream in the DCR that represents the destination table

# Import required modules
import os
from azure.identity import DefaultAzureCredential
from azure.monitor.ingestion import LogsIngestionClient
from azure.core.exceptions import HttpResponseError

### Step 1: Create credential and client 

# Set environment variables for the application used by DefaultAzureCredential
os.environ["AZURE_TENANT_ID"] = tenant_id
os.environ["AZURE_CLIENT_ID"] = client_id
os.environ["AZURE_CLIENT_SECRET"] = secret_value

credential = DefaultAzureCredential()
client = LogsIngestionClient(endpoint=dce_endpoint, credential=credential, logging_enable=True)

### Step 2: Create some sample data. 

body = [
        {
        "Time": "2023-03-12T15:04:48.423211Z",
        "Computer": "Computer3",
            "AdditionalContext": {
                "InstanceName": "user3",
                "TimeZone": "Pacific Time",
                "Level": 4,
                "CounterName": "AppMetric2",
                "CounterValue": 35.3    
            }
        },
        {
            "Time": "2023-03-12T15:04:48.794972Z",
            "Computer": "Computer4",
            "AdditionalContext": {
                "InstanceName": "user4",
                "TimeZone": "Central Time",
                "Level": 3,
                "CounterName": "AppMetric2",
                "CounterValue": 43.5     
            }
        }
    ]


### Step 3: Send the data to the Log Analytics workspace via the DCE.

try:
    client.upload(rule_id=dcr_immutableid, stream_name=stream_name, logs=body)
except HttpResponseError as e:
    print(f"Upload failed: {e}")
```
---



## Troubleshooting
This section describes different error conditions you might receive and how to correct them.

### Script returns error code 403
Ensure that you have the correct permissions for your application to the DCR. You might also need to wait up to 30 minutes for permissions to propagate.

### Script returns error code 413 or warning of TimeoutExpired with the message ReadyBody_ClientConnectionAbort in the response
The message is too large. The maximum message size is currently 1 MB per call.

### Script returns error code 429
API limits have been exceeded. For information on the current limits, see [Service limits for the Logs Ingestion API](../service-limits.md#logs-ingestion-api).

### Script returns error code 503
Ensure that you have the correct permissions for your application to the DCR. You might also need to wait up to 30 minutes for permissions to propagate.

### You don't receive an error, but data doesn't appear in the workspace
The data might take some time to be ingested, especially if this is the first time data is being sent to a particular table. It shouldn't take longer than 15 minutes.

### IntelliSense in Log Analytics doesn't recognize the new table
The cache that drives IntelliSense might take up to 24 hours to update.

## Next steps

- [Complete a similar tutorial using the Azure portal](tutorial-logs-ingestion-portal.md)
- [Read more about custom logs](logs-ingestion-api-overview.md)
- [Learn more about writing transformation queries](../essentials//data-collection-transformations.md)
