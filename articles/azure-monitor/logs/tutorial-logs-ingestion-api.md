---
title: 'Tutorial: Send data to Azure Monitor Logs using REST API (Resource Manager templates)'
description: Tutorial on how to send data to a Log Analytics workspace in Azure Monitor by using the REST API Azure Resource Manager template version.
ms.topic: tutorial
ms.date: 07/15/2022
---

# Tutorial: Send data to Azure Monitor Logs using REST API (Resource Manager templates)
The [Logs Ingestion API (preview)](logs-ingestion-api-overview.md) in Azure Monitor allows you to send external data to a Log Analytics workspace with a REST API. This tutorial uses Azure Resource Manager templates (ARM templates) to walk through configuration of a new table and a sample application to send log data to Azure Monitor.

> [!NOTE]
> This tutorial uses ARM templates and a REST API to configure custom logs. For a similar tutorial using the Azure portal, see [Tutorial: Send data to Azure Monitor Logs using REST API (Azure portal)](tutorial-logs-ingestion-portal.md).

In this tutorial, you learn to:

> [!div class="checklist"]
> * Create a custom table in a Log Analytics workspace.
> * Create a data collection endpoint (DCE) to receive data over HTTP.
> * Create a data collection rule (DCR) that transforms incoming data to match the schema of the target table.
> * Create a sample application to send custom data to Azure Monitor.

> [!NOTE]
> This tutorial uses PowerShell from Azure Cloud Shell to make REST API calls by using the Azure Monitor **Tables** API and the Azure portal to install ARM templates. You can use any other method to make these calls.

## Prerequisites
To complete this tutorial, you need:

- A Log Analytics workspace where you have at least [contributor rights](manage-access.md#azure-rbac).
- [Permissions to create DCR objects](../essentials/data-collection-rule-overview.md#permissions) in the workspace.

## Collect workspace details
Start by gathering information that you'll need from your workspace.

Go to your workspace in the **Log Analytics workspaces** menu in the Azure portal. On the **Properties** page, copy the **Resource ID** and save it for later use.

:::image type="content" source="media/tutorial-logs-ingestion-api/workspace-resource-id.png" lightbox="media/tutorial-logs-ingestion-api/workspace-resource-id.png" alt-text="Screenshot that shows the workspace resource ID.":::

## Configure an application
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

## Create a new table in a Log Analytics workspace
The custom table must be created before you can send data to it. The table for this tutorial will include three columns, as described in the following schema. The `name`, `type`, and `description` properties are mandatory for each column. The properties `isHidden` and `isDefaultDisplay` both default to `false` if not explicitly specified. Possible data types are `string`, `int`, `long`, `real`, `boolean`, `dateTime`, `guid`, and `dynamic`.

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
                        "name": "ExtendedColumn",
                        "type": "string",
                        "description": "An additional column extended at ingestion time"
                    }
                ]
            }
        }
    }
    '@

    Invoke-AzRestMethod -Path "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/microsoft.operationalinsights/workspaces/{workspace}/tables/MyTable_CL?api-version=2021-12-01-preview" -Method PUT -payload $tableParams
    ```

## Create a data collection endpoint
A [DCE](../essentials/data-collection-endpoint-overview.md) is required to accept the data being sent to Azure Monitor. After you configure the DCE and link it to a DCR, you can send data over HTTP from your application. The DCE must be located in the same region as the Log Analytics workspace where the data will be sent.

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

    :::image type="content" source="media/tutorial-workspace-transformations-api/custom-deployment-values.png" lightbox="media/tutorial-workspace-transformations-api/custom-deployment-values.png" alt-text="Screenshot to edit custom deployment values.":::

1. Select **Review + create** and then select **Create** after you review the details.

1. After the DCE is created, select it so that you can view its properties. Note the **Logs ingestion URI** because you'll need it in a later step.

    :::image type="content" source="media/tutorial-logs-ingestion-api/data-collection-endpoint-overview.png" lightbox="media/tutorial-logs-ingestion-api/data-collection-endpoint-overview.png" alt-text="Screenshot that shows the DCE URI.":::

1. Select **JSON View** to view other details for the DCE. Copy the **Resource ID** because you'll need it in a later step.

    :::image type="content" source="media/tutorial-logs-ingestion-api/data-collection-endpoint-json.png" lightbox="media/tutorial-logs-ingestion-api/data-collection-endpoint-json.png" alt-text="Screenshot that shows the DCE resource ID.":::

## Create a data collection rule
The [DCR](../essentials/data-collection-rule-overview.md) defines the schema of data that's being sent to the HTTP endpoint. It also defines the transformation that will be applied to it. The DCR also defines the destination workspace and table the transformed data will be sent to.

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
    - `dataFlows`: Matches the stream with the destination workspace and specifies the transformation query and the destination table.

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
                "defaultValue": "westus2",
                "allowedValues": [
                    "westus2",
                    "eastus2",
                    "eastus2euap"
                ],
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
                            "transformKql": "source | extend jsonContext = parse_json(AdditionalContext) | project TimeGenerated = Time, Computer, AdditionalContext = jsonContext, ExtendedColumn=tostring(jsonContext.CounterName)",
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

1. Copy the **Resource ID** for the DCR. You'll use it in the next step.

    :::image type="content" source="media/tutorial-workspace-transformations-api/data-collection-rule-json-view.png" lightbox="media/tutorial-workspace-transformations-api/data-collection-rule-json-view.png" alt-text="Screenshot that shows DCR JSON view.":::

    > [!NOTE]
    > All the properties of the DCR, such as the transformation, might not be displayed in the Azure portal even though the DCR was successfully created with those properties.

## Assign permissions to a DCR
After the DCR has been created, the application needs to be given permission to it. Permission will allow any application using the correct application ID and application key to send data to the new DCE and DCR.

1. From the DCR in the Azure portal, select **Access Control (IAM)** > **Add role assignment**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-create.png" alt-text="Screenshot that shows adding a custom role assignment to DCR.":::

1. Select **Monitoring Metrics Publisher** and select **Next**. You could instead create a custom action with the `Microsoft.Insights/Telemetry/Write` data action.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment-select-role.png" lightbox="media/tutorial-logs-ingestion-portal/add-role-assignment-select-role.png" alt-text="Screenshot that shows selecting a role for DCR role assignment.":::

1. Select **User, group, or service principal** for **Assign access to** and choose **Select members**. Select the application that you created and choose **Select**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment-select-member.png" lightbox="media/tutorial-logs-ingestion-portal/add-role-assignment-select-member.png" alt-text="Screenshot that shows selecting members for the DCR role assignment.":::

1. Select **Review + assign** and verify the details before you save your role assignment.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment-save.png" lightbox="media/tutorial-logs-ingestion-portal/add-role-assignment-save.png" alt-text="Screenshot that shows saving the DCR role assignment.":::

## Send sample data
The following PowerShell code sends data to the endpoint by using HTTP REST fundamentals.

> [!NOTE]
> This tutorial uses commands that require PowerShell v7.0 or later. Make sure your local installation of PowerShell is up to date or execute this script by using Azure Cloud Shell.

1. Run the following PowerShell command, which adds a required assembly for the script.

    ```powershell
    Add-Type -AssemblyName System.Web
    ```

1. Replace the parameters in the **Step 0** section with values from the resources that you created. You might also want to replace the sample data in the **Step 2** section with your own.

    ```powershell
    ##################
    ### Step 0: Set parameters required for the rest of the script.
    ##################
    #information needed to authenticate to AAD and obtain a bearer token
    $tenantId = "00000000-0000-0000-0000-000000000000"; #Tenant ID the data collection endpoint resides in
    $appId = "00000000-0000-0000-0000-000000000000"; #Application ID created and granted permissions
    $appSecret = "00000000000000000000000"; #Secret created for the application

    #information needed to send data to the DCR endpoint
    $dcrImmutableId = "dcr-000000000000000"; #the immutableId property of the DCR object
    $dceEndpoint = "https://my-dcr-name.westus2-1.ingest.monitor.azure.com"; #the endpoint property of the Data Collection Endpoint object

    ##################
    ### Step 1: Obtain a bearer token used later to authenticate against the DCE.
    ##################
    $scope= [System.Web.HttpUtility]::UrlEncode("https://monitor.azure.com//.default")   
    $body = "client_id=$appId&scope=$scope&client_secret=$appSecret&grant_type=client_credentials";
    $headers = @{"Content-Type"="application/x-www-form-urlencoded"};
    $uri = "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token"

    $bearerToken = (Invoke-RestMethod -Uri $uri -Method "Post" -Body $body -Headers $headers).access_token

    ##################
    ### Step 2: Load up some sample data. 
    ##################
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

    ##################
    ### Step 3: Send the data to Log Analytics via the DCE.
    ##################
    $body = $staticData;
    $headers = @{"Authorization"="Bearer $bearerToken";"Content-Type"="application/json"};
    $uri = "$dceEndpoint/dataCollectionRules/$dcrImmutableId/streams/Custom-MyTableRawData?api-version=2021-11-01-preview"

    $uploadResponse = Invoke-RestMethod -Uri $uri -Method "Post" -Body $body -Headers $headers
    ```

    > [!NOTE]
    > If you receive an `Unable to find type [System.Web.HttpUtility].` error, run the last line in section 1 of the script for a fix and execute it. Executing it uncommented as part of the script won't resolve the issue. The command must be executed separately.

1. After you execute this script, you should see an `HTTP - 204` response. In a few minutes, the data arrives to your Log Analytics workspace.

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
