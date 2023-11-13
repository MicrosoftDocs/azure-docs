---
title: 'Tutorial: Send data to Azure Monitor Logs with Logs ingestion API (Resource Manager templates)'
description: Tutorial on how sending data to a Log Analytics workspace in Azure Monitor using the Logs ingestion API. Supporting components configured using Resource Manager templates.
ms.topic: tutorial
ms.custom:
author: bwren
ms.author: bwren
ms.date: 10/27/2023
---

# Tutorial: Send data to Azure Monitor using Logs ingestion API (Resource Manager templates)
The [Logs Ingestion API](logs-ingestion-api-overview.md) in Azure Monitor allows you to send custom data to a Log Analytics workspace. This tutorial uses Azure Resource Manager templates (ARM templates) to walk through configuration of the components required to support the API and then provides a sample application using both the REST API and client libraries for [.NET](/dotnet/api/overview/azure/Monitor.Ingestion-readme), [Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/monitor/azingest), [Java](/java/api/overview/azure/monitor-ingestion-readme), [JavaScript](/javascript/api/overview/azure/monitor-ingestion-readme), and [Python](/python/api/overview/azure/monitor-ingestion-readme).

> [!NOTE]
> This tutorial uses ARM templates to configure the components required to support the Logs ingestion API. See [Tutorial: Send data to Azure Monitor Logs with Logs ingestion API (Azure portal)](tutorial-logs-ingestion-portal.md) for a similar tutorial that uses the Azure portal UI to configure these components.

The steps required to configure the Logs ingestion API are as follows:

1. [Create a Microsoft Entra application](#create-azure-ad-application) to authenticate against the API.
3. [Create a data collection endpoint (DCE)](#create-data-collection-endpoint) to receive data.
2. [Create a custom table in a Log Analytics workspace](#create-new-table-in-log-analytics-workspace). This is the table you'll be sending data to.
4. [Create a data collection rule (DCR)](#create-data-collection-rule) to direct the data to the target table. 
5. [Give the Microsoft Entra application access to the DCR](#assign-permissions-to-a-dcr).
6. See [Sample code to send data to Azure Monitor using Logs ingestion API](tutorial-logs-ingestion-code.md) for sample code to send data to using the Logs ingestion API.

## Prerequisites
To complete this tutorial, you need:

- A Log Analytics workspace where you have at least [contributor rights](manage-access.md#azure-rbac).
- [Permissions to create DCR objects](../essentials/data-collection-rule-create-edit.md#permissions) in the workspace.


## Collect workspace details
Start by gathering information that you'll need from your workspace.

Go to your workspace in the **Log Analytics workspaces** menu in the Azure portal. On the **Properties** page, copy the **Resource ID** and save it for later use.

:::image type="content" source="media/tutorial-logs-ingestion-api/workspace-resource-id.png" lightbox="media/tutorial-logs-ingestion-api/workspace-resource-id.png" alt-text="Screenshot that shows the workspace resource ID.":::

<a name='create-azure-ad-application'></a>

## Create Microsoft Entra application
Start by registering a Microsoft Entra application to authenticate against the API. Any Resource Manager authentication scheme is supported, but this tutorial follows the [Client Credential Grant Flow scheme](../../active-directory/develop/v2-oauth2-client-creds-grant-flow.md).

1. On the **Microsoft Entra ID** menu in the Azure portal, select **App registrations** > **New registration**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-app-registration.png" lightbox="media/tutorial-logs-ingestion-portal/new-app-registration.png" alt-text="Screenshot that shows the app registration screen.":::

1. Give the application a name and change the tenancy scope if the default isn't appropriate for your environment. A **Redirect URI** isn't required.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-app-name.png" lightbox="media/tutorial-logs-ingestion-portal/new-app-name.png" alt-text="Screenshot that shows app details.":::

1. After registration, you can view the details of the application. Note the **Application (client) ID** and the **Directory (tenant) ID**. You'll need these values later in the process.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-app-id.png" lightbox="media/tutorial-logs-ingestion-portal/new-app-id.png" alt-text="Screenshot that shows the app ID.":::

1. Generate an application client secret, which is similar to creating a password to use with a username. Select **Certificates & secrets** > **New client secret**. Give the secret a name to identify its purpose and select an **Expires** duration. The option **12 months** is selected here. For a production implementation, you would follow best practices for a secret rotation procedure or use a more secure authentication mode, such as a certificate.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-app-secret.png" lightbox="media/tutorial-logs-ingestion-portal/new-app-secret.png" alt-text="Screenshot that shows the secret for the new app.":::

1. Select **Add** to save the secret and then note the **Value**. Ensure that you record this value because you can't recover it after you leave this page. Use the same security measures as you would for safekeeping a password because it's the functional equivalent.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-app-secret-value.png" lightbox="media/tutorial-logs-ingestion-portal/new-app-secret-value.png" alt-text="Screenshot that shows the secret value for the new app.":::

## Create data collection endpoint
A [DCE](../essentials/data-collection-endpoint-overview.md) is required to accept the data being sent to Azure Monitor. After you configure the DCE and link it to a DCR, you can send data over HTTP from your application. The DCE must be located in the same region as the DCR and the Log Analytics workspace where the data will be sent.

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
                "metadata": {
                    "description": "Specifies the location for the Data Collection Endpoint."
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

1. Select **JSON View** to view other details for the DCE. Copy the **Resource ID** and the **logsIngestion endpoint** which you'll need in a later step.

    :::image type="content" source="media/tutorial-logs-ingestion-api/data-collection-endpoint-json.png" lightbox="media/tutorial-logs-ingestion-api/data-collection-endpoint-json.png" alt-text="Screenshot that shows the DCE resource ID.":::


## Create new table in Log Analytics workspace
The custom table must be created before you can send data to it. The table for this tutorial will include five columns shown in the schema below. The `name`, `type`, and `description` properties are mandatory for each column. The properties `isHidden` and `isDefaultDisplay` both default to `false` if not explicitly specified. Possible data types are `string`, `int`, `long`, `real`, `boolean`, `dateTime`, `guid`, and `dynamic`.

> [!NOTE]
> This tutorial uses PowerShell from Azure Cloud Shell to make REST API calls by using the Azure Monitor **Tables** API. You can use any other valid method to make these calls.

> [!IMPORTANT]
> Custom tables must use a suffix of `_CL`.

1. Select the **Cloud Shell** button in the Azure portal and ensure the environment is set to **PowerShell**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/open-cloud-shell.png" lightbox="media/tutorial-workspace-transformations-api/open-cloud-shell.png" alt-text="Screenshot that shows opening Cloud Shell.":::

1. Copy the following PowerShell code and replace the variables in the **Path** parameter with the appropriate values for your workspace in the `Invoke-AzRestMethod` command. Paste it into the Cloud Shell prompt to run it.

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
                        "name": "Computer",
                        "type": "string",
                        "description": "The computer that generated the data"
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

## Create data collection rule
The [DCR](../essentials/data-collection-rule-overview.md) defines how the data will be handled once it's received. This includes:

- Schema of data that's being sent to the endpoint
- [Transformation](../essentials/data-collection-transformations.md) that will be applied to the data before it's sent to the workspace
- Destination workspace and table the transformed data will be sent to

1. In the Azure portal's search box, enter **template** and then select **Deploy a custom template**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/deploy-custom-template.png" lightbox="media/tutorial-workspace-transformations-api/deploy-custom-template.png" alt-text="Screenshot that shows how to deploy a custom template.":::

2. Select **Build your own template in the editor**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/build-custom-template.png" lightbox="media/tutorial-workspace-transformations-api/build-custom-template.png" alt-text="Screenshot that shows how to build a template in the editor.":::

3. Paste the following ARM template into the editor and then select **Save**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/edit-template.png" lightbox="media/tutorial-workspace-transformations-api/edit-template.png" alt-text="Screenshot that shows how to edit an ARM template.":::

    Notice the following details in the DCR defined in this template:

    - `dataCollectionEndpointId`: Resource ID of the data collection endpoint.
    - `streamDeclarations`: Column definitions of the incoming data.
    - `destinations`: Destination workspace.
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
                                "name": "myworkspace"
                            }
                        ]
                    },
                    "dataFlows": [
                        {
                            "streams": [
                                "Custom-MyTableRawData"
                            ],
                            "destinations": [
                                "myworkspace"
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

4. On the **Custom deployment** screen, specify a **Subscription** and **Resource group** to store the DCR. Then provide values defined in the template. The values include a **Name** for the DCR and the **Workspace Resource ID** that you collected in a previous step. The **Location** should be the same location as the workspace. The **Region** will already be populated and will be used for the location of the DCR.

    :::image type="content" source="media/tutorial-workspace-transformations-api/custom-deployment-values.png" lightbox="media/tutorial-workspace-transformations-api/custom-deployment-values.png" alt-text="Screenshot that shows how to edit custom deployment values.":::

5. Select **Review + create** and then select **Create** after you review the details.

6. When the deployment is complete, expand the **Deployment details** box and select your DCR to view its details. Select **JSON View**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/data-collection-rule-details.png" lightbox="media/tutorial-workspace-transformations-api/data-collection-rule-details.png" alt-text="Screenshot that shows DCR details.":::

1. Copy the **Immutable ID** for the DCR. You'll use it in a later step when you send sample data using the API.

    :::image type="content" source="media/tutorial-logs-ingestion-api/data-collection-rule-json-view.png" lightbox="media/tutorial-workspace-transformations-api/data-collection-rule-json-view.png" alt-text="Screenshot that shows DCR JSON view.":::

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


## Sample code
See [Sample code to send data to Azure Monitor using Logs ingestion API](tutorial-logs-ingestion-code.md) for sample code using the components created in this tutorial.


## Next steps

- [Complete a similar tutorial using the Azure portal](tutorial-logs-ingestion-portal.md)
- [Read more about custom logs](logs-ingestion-api-overview.md)
- [Learn more about writing transformation queries](../essentials//data-collection-transformations.md)
