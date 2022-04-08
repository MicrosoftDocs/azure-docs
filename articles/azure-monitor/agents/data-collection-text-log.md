---
title: 
description: 
ms.topic: conceptual
ms.date: 04/08/2022

---

# Collect text logs with Azure Monitor agent
With the [Azure Monitor agent](azure-monitor-agent-overview.md), you can collect text logs from an agent computer and send to a custom log table in a Log Analytics workspace. This same process can be used for IIS logs since they're stored in text files.

## Log files supported
The log file being collected must not allow circular logging, log rotation where the file is overwritten with new entries, or the file is renamed and the same file name is reused for continued logging.

## Steps to collect text logs

1. Create a new table in your workspace to receive the collected data.
2. Create a data collection endpoint for the Azure Monitor agent to connect.
3. Create a data collection rule to define the structure of the log file and destination of the collected data.
4. Assign Resources and Create Associations


## Prerequisites
To complete this tutorial, you need the following: 

- Log Analytics workspace where you have at least [contributor rights](manage-access.md#manage-access-using-azure-permissions) .
- [Permissions to create Data Collection Rule objects](/azure/azure-monitor/essentials/data-collection-rule-overview#permissions) in the workspace.


## Collect workspace details
Start by gathering information that you'll need from your workspace.

1. Navigate to your workspace in the **Log Analytics workspaces** menu in the Azure Portal. From the **Properties** page, copy the **Resource ID** and save it for later use.

    :::image type="content" source="media/tutorial-custom-logs-api/workspace-resource-id.png" lightbox="media/tutorial-custom-logs-api/workspace-resource-id.png" alt-text="Screenshot showing workspace resource ID.":::


## Create new table in Log Analytics workspace
The custom table must be created before you can send data to it. This tutorial includes two *MyTable_CL* and *MyIISTable_CL*. 

Use the **Tables - Update** API to create the table with the PowerShell code below. 

> [!IMPORTANT]
> Custom tables must use a suffix of *_CL*.

1. Click the **Cloud Shell** button in the Azure portal and ensure the environment is set to **PowerShell**.

    :::image type="content" source="media/tutorial-ingestion-time-transformations-api/open-cloud-shell.png" lightbox="media/tutorial-ingestion-time-transformations-api/open-cloud-shell.png" alt-text="Screenshot of opening cloud shell":::

2. Copy the following PowerShell code and replace the **Path** parameter with the appropriate values for your workspace in the `Invoke-AzRestMethod` command. Paste it into the cloud shell prompt to run it.

    ```PowerShell
    $tableParams = @'
    {
        "properties": {
            "schema": {
                "name": "<myLogFileTableName>",
                "columns": [
            {
                                    "name": "TimeGenerated",
                                    "type": "DateTime"
                            }, 
                        {
                                    "name": "RawData",
                                    "type": "String"
                        }
                ]
            }
        }
    }
    '@

    Invoke-AzRestMethod -Path "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/microsoft.operationalinsights/workspaces/{workspace}/tables/MyTable_CL?api-version=2021-12-01-preview" -Method PUT -payload $tableParams
    ```


## Create data collection endpoint
A [data collection endpoint (DCE)](../essentials/data-collection-endpoint-overview.md) is required to accept the data being sent to Azure Monitor. Once you configure the DCE and link it to a data collection rule, you can send data over HTTP from your application. The DCE must be located in the same region as the Log Analytics Workspace where the data will be sent. 

1. In the Azure portal's search box, type in *template* and then select **Deploy a custom template**.

    :::image type="content" source="media/tutorial-ingestion-time-transformations-api/deploy-custom-template.png" lightbox="media/tutorial-ingestion-time-transformations-api/deploy-custom-template.png" alt-text="Screenshot to deploy custom template.":::

2. Click **Build your own template in the editor**.

    :::image type="content" source="media/tutorial-ingestion-time-transformations-api/build-custom-template.png" lightbox="media/tutorial-ingestion-time-transformations-api/build-custom-template.png" alt-text="Screenshot to build template in the editor.":::

3. Paste the resource manager template below into the editor and then click **Save**. You don't need to modify this template since you will provide values for its parameters.

    :::image type="content" source="media/tutorial-ingestion-time-transformations-api/edit-template.png" lightbox="media/tutorial-ingestion-time-transformations-api/edit-template.png" alt-text="Screenshot to edit resource manager template.":::


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

4. On the **Custom deployment** screen, specify a **Subscription** and **Resource group** to store the data collection rule and then provide values a **Name** for the data collection endpoint. The **Location** should be the same location as the workspace. The **Region** will already be populated and is used for the location of the data collection endpoint.

    :::image type="content" source="media/tutorial-ingestion-time-transformations-api/custom-deployment-values.png" lightbox="media/tutorial-ingestion-time-transformations-api/custom-deployment-values.png" alt-text="Screenshot to edit  custom deployment values.":::

5. Click **Review + create** and then **Create** when you review the details. 

6. Once the DCE is created, select it so you can view its properties. Note the **Logs ingestion URI** since you'll need this in a later step.

    :::image type="content" source="media/tutorial-custom-logs-api/data-collection-endpoint-overview.png" lightbox="media/tutorial-custom-logs-api/data-collection-endpoint-overview.png" alt-text="Screenshot for data collection endpoint uri.":::

7. Click **JSON View** to view other details for the DCE. Copy the **Resource ID** since you'll need this in a later step.

    :::image type="content" source="media/tutorial-custom-logs-api/data-collection-endpoint-json.png" lightbox="media/tutorial-custom-logs-api/data-collection-endpoint-json.png" alt-text="Screenshot for data collection endpoint resource ID.":::


## Create data collection rule
The [data collection rule (DCR)](../essentials/data-collection-rule-overview.md) defines the schema of data that being sent to the HTTP endpoint, the transformation that will be applied to it, and the destination workspace and table the transformed data will be sent to.

1. In the Azure portal's search box, type in *template* and then select **Deploy a custom template**.

    :::image type="content" source="media/tutorial-ingestion-time-transformations-api/deploy-custom-template.png" lightbox="media/tutorial-ingestion-time-transformations-api/deploy-custom-template.png" alt-text="Screenshot to deploy custom template.":::

2. Click **Build your own template in the editor**.

    :::image type="content" source="media/tutorial-ingestion-time-transformations-api/build-custom-template.png" lightbox="media/tutorial-ingestion-time-transformations-api/build-custom-template.png" alt-text="Screenshot to build template in the editor.":::

3. Paste the resource manager template below into the editor and then click **Save**.

    :::image type="content" source="media/tutorial-ingestion-time-transformations-api/edit-template.png" lightbox="media/tutorial-ingestion-time-transformations-api/edit-template.png" alt-text="Screenshot to edit resource manager template.":::

    Notice the following details in the DCR defined in this template:

    - `dataCollectionEndpointId`: Resource ID of the data collection endpoint.
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
                        "Custom-MyLogFileFormat": {
                            "columns": [
                                {
                                    "name": "TimeGenerated",
                                    "type": "datetime"
                                },
                                {
                                    "name": "RawData",
                                    "type": "string"
                                }
                            ]
                        }
                    },
                    "dataSources": {
                        "logFiles   ": [
                            {
                                "streams": [
                                    "Custom-MyLogFileFormat "
                                ],
                                "filePatterns": [
                                    "C:\\JavaLogs\\*.log"
                                ],
                                "format": "text",
                                "settings": {
                                    "text": {
                                        "recordStartTimestampFormat": "ISO 8601"
                                    }
                                },
                                "name": "myLogFileFormat-Windows"
                            },
                            {
                                "streams": [
                                    "Custom-MyLogFileFormat" 
                                ],
                                "filePatterns": [
                                    "/var/*.log"
                                ],
                                "format": "text",
                                "settings": {
                                    "text": {
                                        "recordStartTimestampFormat": "ISO 8601"
                                    }
                                },
                                "name": "myLogFileFormat-Linux"
                            }

                        ],
                    "iisLogs": [
                            {
                                "streams": [
                                    "Microsoft-W3CIISLog"
                                ],
                                "logDirectories": [
                                    "C:\\IISlogdemo\\W3SVC1"
                                ],
                                "name": "myIisLogsDataSource"
                            }
                        ]
                    },
                    "destinations": {
                        "logAnalytics": [
                            {
                                "workspaceResourceId": "[parameters('workspaceResourceId')]",
                                "name": "<myWorkSpaceName>"
                            }
                        ]
                    },
                    "dataFlows": [
                        {
                            "streams": [
                                "Custom-MyLogFileFormat"
                            ],
                            "destinations": [
                                "<myWorkSpaceName>"
                            ],
                            "transformKql": "source",
                            "outputStream": "Custom-<myLogFileTableName>"
                        },
                        {
                            "streams": [
                                "Microsoft-W3CIISLog"
                            ],
                            "destinations": [
                                "<myWorkSpaceName>"
                            ],
                            "transformKql": "source"
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

4. On the **Custom deployment** screen, specify a **Subscription** and **Resource group** to store the data collection rule and then provide values defined in the template. This includes a **Name** for the data collection rule and the **Workspace Resource ID** that you collected in a previous step. The **Location** should be the same location as the workspace. The **Region** will already be populated and is used for the location of the data collection rule.

    :::image type="content" source="media/tutorial-ingestion-time-transformations-api/custom-deployment-values.png" lightbox="media/tutorial-ingestion-time-transformations-api/custom-deployment-values.png" alt-text="Screenshot to edit  custom deployment values.":::

5. Click **Review + create** and then **Create** when you review the details.

6. When the deployment is complete, expand the **Deployment details** box and click on your data collection rule to view its details. Click **JSON View**.

    :::image type="content" source="media/tutorial-ingestion-time-transformations-api/data-collection-rule-details.png" lightbox="media/tutorial-ingestion-time-transformations-api/data-collection-rule-details.png" alt-text="Screenshot for data collection rule details.":::

7. Copy the **Resource ID** for the data collection rule. You'll use this in the next step.

    :::image type="content" source="media/tutorial-ingestion-time-transformations-api/data-collection-rule-json-view.png" lightbox="media/tutorial-ingestion-time-transformations-api/data-collection-rule-json-view.png" alt-text="Screenshot for data collection rule JSON view.":::

    > [!NOTE]
    > All of the properties of the DCR, such as the transformation, may not be displayed in the Azure portal even though the DCR was successfully created with those properties.


## Create association between DCR and agent computer
 

## Next steps