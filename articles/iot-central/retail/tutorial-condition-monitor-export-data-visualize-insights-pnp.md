---
title: Export data and visualize insights in Azure IoT Central | Microsoft Docs
description: In this tutorial, learn how to export data from IoT Central, and visual insights in a Power BI dashboard.
services: iot-central
ms.service: iot-central
ms.topic: tutorial
ms.custom: [iot-storeAnalytics-conditionMonitor, iot-p0-scenario]
ms.author: dobett
author: dominicbetts
ms.date: 10/13/2019
---

# Tutorial: Export data from Azure IoT Central and visualize insights in Power BI

In the two previous tutorials, you created and customized an IoT Central application using  the **Store Analytics - Condition Monitoring** application template. In this tutorial, you configure your IoT Central application to export telemetry collected from the devices. You then use Power BI to create a custom dashboard for the store manager to visualize the insights derived from the telemetry.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Configure an IoT Central application to export telemetry to an event hub.
> * Use Logic Apps to send data from an event hub to a Power BI streaming dataset.
> * Create a Power BI dashboard to visualize data in the streaming dataset.

## Prerequisites

To complete this tutorial, you need:

* To complete the previous two tutorials, [Create a condition monitoring retail application in Azure IoT Central](./tutorial-condition-monitor-create-app-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json) and [Customize the operator dashboard and manage devices in Azure IoT Central](./tutorial-condition-monitor-customize-dashboard-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).
* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A Power BI account. If you don't have a Power BI account, sign up for a [free Power BI Pro trial](https://app.powerbi.com/signupredirect?pbi_source=web) before you begin.

## Create a resource group

Before you create your event hub and logic app, you need to create a resource group to manage them. The resource group should be in the same location as your **Store Analytics - Condition Monitoring** IoT Central application. To create a resource group:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the left navigation, select **Resource groups**. Then select **+ Add**.
1. For **Subscription**, select the name of the Azure subscription you used to create your IoT Central application.
1. For the **Resource group** name, enter _retail-store-analysis_**_.
1. For the **Region**, select the same region you chose for the IoT Central application.
1. Select **Review + Create**.
1. On the **Review + Create** page, select **Create**.

You now have a resource group called **retail-store-analysis** in your subscription.

## Create an event hub

Before you can configure the retail monitoring application to export telemetry, you need to create the event hub that receives the exported data. The following steps show you how to create your event hub:

1. In the Azure portal, click **Create a resource** at the top left of the screen.
1. In **Search the marketplace**, enter _Event Hubs_, and then press **Enter**.
1. On the **Event Hubs** page, select **Create**.
1. On the **Create Namespace** page, take the following steps:
    * Enter a unique name for the namespace such as _yourname-retail-store-analysis_. The system checks to see if this name is available.
    * Choose the **Basic** pricing tier.
    * Select the same **Subscription** you used to create your IoT Central application.
    * Select the **retail-store-analysis** resource group.
    * Select the same location you used for your IoT Central application.
    * Select **Create**. You may have to wait a few minutes for the system to provision the resources.
1. In the portal, navigate to the **retail-store-analysis** resource group. Wait for the deployment to finish. You may need to select **Refresh** to update the deployment status. You can also check the status of the event hub namespace creation in the **Notifications**.
1. In the **retail-store-analysis** resource group, select the **Event Hubs Namespace**. You see the home page for your **Event Hubs Namespace** in the portal.

Now you have an **Event Hubs Namespace**, you can create an **Event Hub** to use with your IoT Central application:

1. On the home page for your **Event Hubs Namespace** in the portal, select **+ Event Hub**.
1. On the **Create Event Hub** page, enter _store-telemetry_ as the name, and then select **Create**.

## Configure data export

Now you have an event hub, you can configure your **Store Analytics - Condition Monitoring** application to export telemetry from the connected devices. The following steps show you how to configure the export:

1. Sign in to your **Store Analytics - Condition Monitoring** IoT Central application.
1. Select **Data export** in the primary navigation.
1. Select **+ New**, and then select **Azure Event Hubs**.
1. Enter _Telemetry export_ as the **Display Name**.
1. Select your **Event Hubs namespace**.
1. Select the **store-telemetry** event hub.
1. Switch off **Devices** and **Device Templates** in the **Data to export** section.
1. Select **Save**.

The data export may take a few minutes to start sending telemetry to your event hub. You can see the status of the export on the **Data exports** page.

## Create a Power BI dataset

Your Power BI dashboard will display data from your retail monitoring application. In this solution, you use Power BI streaming datasets as the data source for the Power BI dashboard. In this section, you define the schema of the streaming datasets so that the logic app can forward data from the event hub. The following steps show you how to create the Power BI streaming datasets:

1. Sign in to your **Power BI** account.
1. Select **Workspaces**, and then select **Create a workspace**.
1. On the **Create a workspace** page, enter _Store Analytics - Condition Monitoring_ as the **Workspace name**.
1. Scroll to the bottom of the **Welcome to the Store Analytics - Condition Monitoring workspace** page, and select **Skip**.
1. On the workspace page, select **+ Create -> Streaming dataset**.
1. On the **New streaming dataset** page, choose **API**, and then select **Next**.
1. Enter _Sensor #1_ as the **Dataset name**.
1. Enter the three **Values from stream** in following table:

    | Value name  | Value type |
    | ----------- | ---------- |
    | Timestamp   | DateTime   |
    | Humidity    | Number     |
    | Temperature | Number     |

1. Switch **Historic data analysis** on.
1. Select **Create** and then **Done**.
1. Create two more streaming datasets called **Sensor #2** and **Sensor #3** with the same schema as the **Sensor #1** streaming dataset.

You now have three streaming datasets. The logic app will route telemetry from the three sensors connected to your **Store Analytics - Condition Monitoring** IoT Central application to these three datasets.

This solution uses one streaming dataset for each sensor because it's not possible to apply filters to streaming data in Power BI.

## Create a logic app

In this solution, the logic app reads the telemetry from the event hub, parses the data, and then sends it to the Power BI streaming datasets you created. The following steps show you how to create the logic app in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com) and click **Create a resource** at the top left of the screen.
1. In **Search the marketplace**, enter _Logic App_, and then press **Enter**.
1. On the **Logic App** page, select **Create**.
1. On the **Logic App** create page:
    * Enter a unique name for your logic app such as _yourname-retail-store-analysis_.
    * Select the same **Subscription** you used to create your IoT Central application.
    * Select the **retail-store-analysis** resource group.
    * Select the same location you used for your IoT Central application.
    * Select **Create**. You may have to wait a few minutes for the system to provision the resources.
1. In the Azure portal, navigate to your new logic app.
1. On the **Logic Apps Designer** page, scroll down and select **Blank Logic App**.
1. In **Search connectors and triggers**, enter _Event Hubs_.
1. In **Triggers**, select **When events are available in Event Hub**.
1. Enter _Store telemetry_ as the **Connection name**, and select your **Event Hubs Namespace**.
1. Select the **RootManageSharedAccess** policy, and select **Create**.
1. In **Event Hub name**, select **store-telemetry**.
1. In **Content type**, select **application/json**.
1. Select **Save** to save your logic app.

To add the logic to your logic app design, select **Code view**:

1. Replace `"actions": {},` with the following JSON:

    ```json
    "actions": {
        "Initialize_variable": {
            "inputs": {
                "variables": [
                    {
                        "name": "DeviceID",
                        "type": "String"
                    }
                ]
            },
            "runAfter": {},
            "type": "InitializeVariable"
        },
        "Parse_Properties": {
            "inputs": {
                "content": "@triggerBody()?['Properties']",
                "schema": {
                    "properties": {
                        "iothub-connection-auth-generation-id": {
                            "type": "string"
                        },
                        "iothub-connection-auth-method": {
                            "type": "string"
                        },
                        "iothub-connection-device-id": {
                            "type": "string"
                        },
                        "iothub-enqueuedtime": {
                            "type": "string"
                        },
                        "iothub-message-source": {
                            "type": "string"
                        },
                        "x-opt-enqueued-time": {
                            "type": "string"
                        },
                        "x-opt-offset": {
                            "type": "string"
                        },
                        "x-opt-sequence-number": {
                            "type": "integer"
                        }
                    },
                    "type": "object"
                }
            },
            "runAfter": {
                "Initialize_variable": [
                    "Succeeded"
                ]
            },
            "type": "ParseJson"
        },
        "Parse_Telemetry": {
            "inputs": {
                "content": "@triggerBody()?['ContentData']",
                "schema": {
                    "properties": {
                        "humid": {
                            "type": "number"
                        },
                        "temp": {
                            "type": "number"
                        }
                    },
                    "type": "object"
                }
            },
            "runAfter": {
                "Initialize_variable": [
                    "Succeeded"
                ]
            },
            "type": "ParseJson"
        },
        "Set_variable": {
            "inputs": {
                "name": "DeviceID",
                "value": "@body('Parse_Properties')?['iothub-connection-device-id']"
            },
            "runAfter": {
                "Parse_Properties": [
                    "Succeeded"
                ]
            },
            "type": "SetVariable"
        },
        "Switch_by_DeviceID": {
            "cases": {
                "Sensor_#1": {
                    "actions": {
                    },
                    "case": "sensor-001"
                },
                "Sensor_#2": {
                    "actions": {
                    },
                    "case": "sensor-002"
                },
                "Sensor_#3": {
                    "actions": {
                     },
                    "case": "sensor-003"
                }
            },
            "default": {
                "actions": {}
            },
            "expression": "@variables('DeviceID')",
            "runAfter": {
                "Parse_Telemetry": [
                    "Succeeded"
                ],
                "Set_variable": [
                    "Succeeded"
                ]
            },
            "type": "Switch"
        }
    },
    ```

1. Select **Save** and then select **Designer** to see the visual version of the logic you added.
1. Select **Switch by DeviceID** to expand the action. Then select **Sensor #1**, and select **Add an action**.
1. In **Search connectors and actions**, enter **Power BI**, and then press **Enter**.
1. Select the **Add rows to a dataset (preview)** action.
1. Select **Sign in** and follow the prompts to sign in to your Power BI account.
1. After the sign-in process is complete, in the **Add rows to a dataset** action:
    * Select **Store Analytics - Condition Monitoring** as the workspace.
    * Select **Sensor #1** as the dataset.
    * Select **RealTimeData** as the table.
    * Select **Add new parameter** and then select the **Timestamp**, **Humidity**, and **Temperature** fields.
    * Select the **Timestamp** field, and then select **iothub-enqueuedtime** from the **Dynamic content** list.
    * Select the **Humidity** field, and then select **See more** next to **Parse Telemetry**. Then select **humid**.
    * Select the **Temperature** field, and then select **See more** next to **Parse Telemetry**. Then select **temp**.
1. Select the **Sensor #2** action, and select **Add an action**.
1. In **Search connectors and actions**, enter **Power BI**, and then press **Enter**.
1. Select the **Add rows to a dataset (preview)** action.
1. In the **Add rows to a dataset 2** action:
    * Select **Store Analytics - Condition Monitoring** as the workspace.
    * Select **Sensor #2** as the dataset.
    * Select **RealTimeData** as the table.
    * Select **Add new parameter** and then select the **Timestamp**, **Humidity**, and **Temperature** fields.
    * Select the **Timestamp** field, and then select **iothub-enqueuedtime** from the **Dynamic content** list.
    * Select the **Humidity** field, and then select **See more** next to **Parse Telemetry**. Then select **humid**.
    * Select the **Temperature** field, and then select **See more** next to **Parse Telemetry**. Then select **temp**.
1. Select the **Sensor #3** action, and select **Add an action**.
1. In **Search connectors and actions**, enter **Power BI**, and then press **Enter**.
1. Select the **Add rows to a dataset (preview)** action.
1. In the **Add rows to a dataset 3** action:
    * Select **Store Analytics - Condition Monitoring** as the workspace.
    * Select **Sensor #3** as the dataset.
    * Select **RealTimeData** as the table.
    * Select **Add new parameter** and then select the **Timestamp**, **Humidity**, and **Temperature** fields.
    * Select the **Timestamp** field, and then select **iothub-enqueuedtime** from the **Dynamic content** list.
    * Select the **Humidity** field, and then select **See more** next to **Parse Telemetry**. Then select **humid**.
    * Select the **Temperature** field, and then select **See more** next to **Parse Telemetry**. Then select **temp**.
1. Select **Save** to save your logic app design.

To start the logic app, navigate to the **Overview** page and select **Run Trigger -> When_events_are_available_in_Event_Hub**.

<!-- TODO - check if you do actually need to start the logic app -->

## Create a Power BI dashboard

Now you have telemetry flowing from your IoT Central application through your event hub. Then your logic app parses the event hub messages and adds them to a Power BI streaming dataset. Now, you can create a Power BI dashboard to visualize the telemetry:

1. Sign in to your **Power BI** account.
1. Select **Workspaces -> Store Analytics - Condition Monitoring**.
1. Select **+ Create -> Dashboard**.
1. Enter **Store analytics** as the dashboard name, and select **Create**.
1. Select **...(More options) -> Add Tile**. Select **Custom Streaming Data**, and then select **Next**.
1. Select **Sensor #1**, and then select **Next**.
1. On the **Visualization design** step:
    * Select **Line chart** as the visualization type.
    * Select **Timestamp** as the axis.
    * Add **Temperature** and **Humidity** as values.
    * Choose 10 minutes as the time window to display.
1. Select **Next**.
1. On the **Details** step, enter **Sensor #1** as the title. Then select **Apply**.
1. Add two more tiles to display the telemetry for **Sensor #2** and **Sensor #3**.

## Clean up resources

If you've finished with your IoT Central application, you can delete it by signing in to the application and navigating to the **Application Settings** page in the **Administration** section.

If you want to keep the application but reduce the costs associated with it, disable the data export that's sending telemetry to your event hub.

You can delete the event hub and logic app in the Azure portal by deleting the resource group called **retail-store-analysis**.

You can delete your Power BI datasets and dashboard by deleting the workspace from the Power BI settings page for the workspace.

## Next Steps

These three tutorials have shown you an end-to-end solution that uses the **Store Analytics - Condition Monitoring** IoT Central application template. You've connected devices to the application, used IoT Central to monitor the devices, and used Power BI to build a dashboard view insights. A recommended next step is to explore one of the other IoT Central application templates:

> [!div class="nextstepaction"]
> * [Build energy solutions with IoT Central](../energy/overview-iot-central-energy.md)
> * [Build government solutions with IoT Central](../government/overview-iot-central-government.md)
> * [Build healthcare solutions with IoT Central](../healthcare/overview-iot-central-healthcare.md)
