---
title: Migration from Data Collector API to DCR-based custom log collection
description: This ariticle discusses in detail the steps required to migrate ingestion of custom logs from Data Collector API to DCR-based Log Ingestion API.
ms.topic: tutorial
ms.date: 01/29/2023

---

# Why to migrate

# Differences between Data Collector API and DCR-based log ingestion

# Migration steps

## Collect workspace details

Start by gathering information that you'll need from your workspace.

    :::image type="content" source="media/tutorial-custom-logs-api/workspace-resource-id.png" lightbox="media/tutorial-custom-logs-api/workspace-resource-id.png" alt-text="Screenshot showing workspace resource ID.":::

Go to your workspace in the Log Analytics workspaces menu in the Azure portal. On the Properties page, copy the Resource ID and save it for later use. Also note in which Azure region the workspace is located.


## Configure an application

You will require application idenity to use with your application ingesting logs. You can choose one which already exists (and skip current section), or create a new one follwing the steps below.

Start by registering an Azure Active Directory application to authenticate against the API. Any Resource Manager authentication scheme is supported, but this tutorial follows the [Client Credential Grant Flow scheme](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow).

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

1. On the **Custom deployment** screen, specify a **Subscription** and **Resource group** to store the DCE and then provide values like a **Name** for the DCE. The **Location** should be the same location as the workspace. The **Region** will already be populated and will be used for the location of the DCE.

    :::image type="content" source="media/tutorial-logs-ingestion-api/data-collection-endpoint-custom-deploy.png" lightbox="media/tutorial-logs-ingestion-api/data-collection-endpoint-custom-deploy.png" alt-text="Screenshot to edit custom deployment values.":::

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

## Prepare you table for use with DCR-based log ingestion
Issue the following API call against your table. This call is idempotent, so there will be no effect if the table has already been migrated.

```
POST https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}/migrate?api-version=2021-12-01-preview
```

## Configure your applciation to send data using new API

You will need to configure AAD authentication within the application sending logs. 
Data should be sent using HTTP POST requests to the following URI:

```
{DCE URI}/dataCollectionRules/{DCR Immutable ID}/streams/Custom-{Custom Log Stream name}?api-version=2021-11-01-preview
```