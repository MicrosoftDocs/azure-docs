---
title: Set up automatic sensor disconnection notifications
description: This tutorial describes how to create a playbook in Microsoft Sentinel that automatically sends an email notification when a sensor disconnects.
ms.topic: tutorial
ms.date: 01/06/2025
ms.subservice: sentinel-integration
---

# Tutorial: Set up automatic sensor disconnection notifications with Microsoft Defender for IoT and Microsoft Sentinel

This tutorial shows you how to create a [playbook](../../sentinel/tutorial-respond-threats-playbook.md) in Microsoft Sentinel that automatically sends an email notification when a sensor disconnects from the cloud.

In this tutorial, you:

> [!div class="checklist"]
>
> * Create a playbook to send automatic sensor disconnection notifications
> * Paste the playbook code into the editor and modify fields
> * Set up managed identity for your subscription 
> * Run a query to confirm that the sensor is offline

## Prerequisites

Before you start, make sure you have:

- Completed [Tutorial: Connect Microsoft Defender for IoT with Microsoft Sentinel](iot-solution.md).

- The subscription ID for the relevant subscription. In the Azure portal **Subscriptions** page, copy the subscription ID and save it for a later stage.

- The resource group for the relevant subscription. Learn more about [resource groups](../../azure-resource-manager/management/manage-resource-groups-portal.md).

## Create the playbook

1. In Microsoft Sentinel, select **Automation**.
1. In the **Automation** page, select **Create > Playbook with alert trigger**.

    :::image type="content" source="media/automate-sensor-disconnection-alerts/sentinel-create-playbook.png" alt-text="Screenshot of creating a playbook for Defender for IoT sensor disconnection." lightbox="media/automate-sensor-disconnection-alerts/sentinel-create-playbook.png":::

1. In the **Create playbook** page **Basics** tab, select the subscription and resource group running Microsoft Sentinel, and give the playbook a name.
1. Select **Next: Connections**.
1. In the **Connections** tab, select **Microsoft Sentinel > Connect with managed identity**.
1. Review the playbook information and select **Create playbook**.

    :::image type="content" source="media/automate-sensor-disconnection-alerts/sentinel-save-playbook.png" alt-text="Screenshot of reviewing a playbook for Defender for IoT sensor disconnection.":::
    
    When the playbook is ready, Microsoft Sentinel displays a **Deployment successful** message and navigates to the **Logic app designer** page.

    :::image type="content" source="media/automate-sensor-disconnection-alerts/sentinel-playbook-successful-message.png" alt-text="Screenshot of a Deployment successful message for a playbook that sends Defender for IoT sensor disconnection alerts.":::

## Paste the playbook code and modify fields

1. Select **Logic app code view**, and paste the [playbook code](#playbook-code) into the editor.     
1. Modify these fields in the code:

    - Under the `post` body, in the `To` field, type the email to which you want to receive the notifications.
    - Under the `office365` parameter:
        - Under the `id` field, replace `Replace with subscription` with the ID of the subscription running Microsoft Sentinel, for example:  
    
        ```json                      
        "id": "/subscriptions/exampleID/providers/Microsoft.Web/locations/eastus/managedApis/office365"
        ```

        - Under the `connectionId` field, replace `Replace with subscription` with your subscription ID, and replace `Replace with RG name` with your resource group name, for example:

        ```json           
         "connectionId": "/subscriptions/exampleID/resourceGroups/ExampleResourceGroup/providers/Microsoft.Web/connections/office365"
        ```

1. Select **Save**.
1. Go back to the **Logic app designer** to view the logic that the playbook follows.  

## Set up a managed identity for your subscription

To give the playbook permission to run Keyword Query Language (KQL) queries and get relevant sensor data:

1. In the Azure portal, select **Subscriptions**.
1. Select the subscription running Microsoft Sentinel and select **Access Control (IAM)**.
1. Select **Add > Add Role Assignment**.
1. Search for the **Reader** role. 
1. In the **Role** tab, select **Next**.
1. In the **Members** tab, under **Assign access to**, select **Managed Identity**.
1. In the **Select Managed identities** window: 
    - Under **Subscription**, select the subscription running Microsoft Sentinel. 
    - The **Managed identity** field is automatically selected.    
    - Under **Select**, select the name of the playbook you created.

    :::image type="content" source="media/automate-sensor-disconnection-alerts/playbook-permissions-managed-identity-members.png" alt-text="Screenshot showing setting up members for a managed identity while creating a Defender for IoT sensor disconnection alerts playbook." lightbox="media/automate-sensor-disconnection-alerts/playbook-permissions-managed-identity-members.png":::

1. In the editor, select **HTTP2** and verify that the **Authentication Type** is set to **Managed Identity**. 

## Run a query to confirm that the sensor is offline

If you can't create the playbook successfully, run a KQL query in Azure Resource Graph to confirm that the sensor is offline. 

1. In the Azure portal, search for *Azure resource graph explorer*.
1. Run the following query:

    ```kusto    
    iotsecurityresources  
    
    | where type =='microsoft.iotsecurity/locations/sites/sensors'  
    
    |extend Status=properties.sensorStatus  
    
    |extend LastConnectivityTime=properties.connectivityTime  
    
    |extend Status=iif(LastConnectivityTime<ago(5m),'Disconnected',Status)  
    
    |project SensorName=name, Status, LastConnectivityTime  
    
    |where Status == 'Disconnected' 
    ```

If the sensor has been offline for at least five minutes, the sensor status is **Disconnected**. 

> [!NOTE]
> It takes up to 15 minutes for the sensor to synchronize the status update with the cloud. This means that the sensor needs to be offline for at least 15 minutes before the status is updated.

### Playbook code

Copy this code and return to the [paste the playbook code](#paste-the-playbook-code-and-modify-fields) step.

```json
        { 

    "definition": { 

        "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#", 

        "contentVersion": "1.0.0.0", 

        "triggers": { 

            "Recurrence": { 

                "type": "Recurrence", 

                "recurrence": { 

                    "frequency": "Minute", 

                    "interval": 5, 

                    "startTime": "2024-11-12T19:00:00Z" 

                } 

            } 

        }, 

        "actions": { 

            "For_each": { 

                "type": "Foreach", 

                "foreach": "@body('Parse_JSON_2')", 

                "actions": { 

                    "Condition": { 

                        "type": "If", 

                        "expression": { 

                            "and": [ 

                                { 

                                    "equals": [ 

                                        "@items('For_each')['Status']", 

                                        "Disconnected" 

                                    ] 

                                }, 

                                { 

                                    "less": [ 

                                        "@items('For_each')['LastConnectivityTime']", 

                                        "@getPastTime(5, 'Minute')" 

                                    ] 

                                } 

                            ] 

                        }, 

                        "actions": { 

                            "Send_an_email_(V2)-copy": { 

                                "type": "ApiConnection", 

                                "inputs": { 

                                    "host": { 

                                        "connection": { 

                                            "name": "@parameters('$connections')['office365']['connectionId']" 

                                        } 

                                    }, 

                                    "method": "post", 

                                    "body": { 

                                        "To": [Please add your email], 

                                        "Subject": "Sensor disconnected - True", 

                                        "Body": "<p class=\"editor-paragraph\"><br>True</p>", 

                                        "Importance": "Normal" 

                                    }, 

                                    "path": "/v2/Mail" 

                                } 

                            } 

                        }, 

                        "else": { 

                            "actions": {} 

                        } 

                    } 

                }, 

                "runAfter": { 

                    "Parse_JSON_2": [ 

                        "Succeeded" 

                    ] 

                } 

            }, 

            "HTTP_2": { 

                "type": "Http", 

                "inputs": { 

                    "uri": "https://management.azure.com/providers/Microsoft.ResourceGraph/resources", 

                    "method": "POST", 

                    "headers": { 

                        "Content-Type": "application/json" 

                    }, 

                    "queries": { 

                        "api-version": "2021-03-01" 

                    }, 

                    "body": { 

                        "query": "iotsecurityresources | where type =='microsoft.iotsecurity/locations/sites/sensors' |extend Status=properties.sensorStatus |extend LastConnectivityTime=properties.connectivityTime |extend Status=iif(LastConnectivityTime<ago(5m),'Disconnected',Status) |project SensorName=name, Status, LastConnectivityTime | where Status == 'Disconnected'" 

                    }, 

                    "authentication": { 

                        "type": "ManagedServiceIdentity" 

                    } 

                }, 

                "runAfter": {} 

            }, 

            "Parse_JSON": { 

                "type": "ParseJson", 

                "inputs": { 

                    "content": "@body('HTTP_2')", 

                    "schema": { 

                        "properties": { 

                            "count": { 

                                "type": "integer" 

                            }, 

                            "data": { 

                                "items": { 

                                    "properties": { 

                                        "LastConnectivityTime": { 

                                            "type": "string" 

                                        }, 

                                        "SensorName": { 

                                            "type": "string" 

                                        }, 

                                        "Status": { 

                                            "type": "string" 

                                        } 

                                    }, 

                                    "required": [ 

                                        "SensorName", 

                                        "Status", 

                                        "LastConnectivityTime" 

                                    ], 

                                    "type": "object" 

                                }, 

                                "type": "array" 

                            }, 

                            "facets": { 

                                "type": "array" 

                            }, 

                            "resultTruncated": { 

                                "type": "string" 

                            }, 

                            "totalRecords": { 

                                "type": "integer" 

                            } 

                        }, 

                        "type": "object" 

                    } 

                }, 

                "runAfter": { 

                    "HTTP_2": [ 

                        "Succeeded" 

                    ] 

                } 

            }, 

            "Parse_JSON_2": { 

                "type": "ParseJson", 

                "inputs": { 

                    "content": "@body('Parse_JSON')?['data']", 

                    "schema": { 

                        "items": { 

                            "properties": { 

                                "LastConnectivityTime": { 

                                    "type": "string" 

                                }, 

                                "SensorName": { 

                                    "type": "string" 

                                }, 

                                "Status": { 

                                    "type": "string" 

                                } 

                            }, 

                            "required": [ 

                                "SensorName", 

                                "Status", 

                                "LastConnectivityTime" 

                            ], 

                            "type": "object" 

                        }, 

                        "type": "array" 

                    } 

                }, 

                "runAfter": { 

                    "Parse_JSON": [ 

                        "Succeeded" 

                    ] 

                } 

            } 

        }, 

        "outputs": {}, 

        "parameters": { 

            "$connections": { 

                "type": "Object", 

                "defaultValue": {} 

            } 

        } 

    }, 

    "parameters": { 

        "$connections": { 

            "value": { 

                "office365": { 

                    "id": "/subscriptions/[Replace with Subscription ID]/providers/Microsoft.Web/locations/eastus/managedApis/office365", 

                    "connectionId": "/subscriptions/[Replace with Subscription ID]/resourceGroups/[replace with RG name]/providers/Microsoft.Web/connections/office365", 

                    "connectionName": "office365" 

                } 

            } 

        } 

    } 

} 
```
## Next steps

> [!div class="nextstepaction"]
> [Visualize data](../../sentinel/get-visibility.md)

> [!div class="nextstepaction"]
> [Create custom analytics rules](../../sentinel/detect-threats-custom.md)

> [!div class="nextstepaction"]
> [Investigate incidents](../../sentinel/investigate-cases.md)

> [!div class="nextstepaction"]
> [Investigate entities](../../sentinel/entity-pages.md)

> [!div class="nextstepaction"]
> [Use playbooks with automation rules](../../sentinel/tutorial-respond-threats-playbook.md)

For more information, see our blog: [Defending Critical Infrastructure with the Microsoft Sentinel: IT/OT Threat Monitoring Solution](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/defending-critical-infrastructure-with-the-microsoft-sentinel-it/ba-p/3061184)
