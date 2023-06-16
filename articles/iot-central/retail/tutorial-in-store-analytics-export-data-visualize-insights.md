---
title: Tutorial - Visualize data from Azure IoT Central
description: In this tutorial, learn how to export data from IoT Central, and visualize insights in a Power BI dashboard.
ms.author: dobett
author: dominicbetts
ms.date: 06/12/2023
services: iot-central
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
ms.custom: [iot-storeAnalytics-checkout, iot-p0-scenario]
---

# Tutorial: Export data from Azure IoT Central and visualize insights in Power BI

In the two previous tutorials, you created and customized an IoT Central application using the **In-store analytics - checkout** application template. In this tutorial, you configure your IoT Central application to export telemetry collected from the devices. You then use Power BI to create a custom dashboard for the store manager to visualize the insights derived from the telemetry.

In this tutorial, you learn how to:
> [!div class="checklist"]

> * Configure an IoT Central application to export telemetry to an event hub.
> * Use Logic Apps to send data from an event hub to a Power BI streaming dataset.
> * Create a Power BI dashboard to visualize data in the streaming dataset.

## Prerequisites

To complete this tutorial, you need:

* To complete the previous two tutorials, [Create an in-store analytics application in Azure IoT Central](./tutorial-in-store-analytics-create-app.md) and [Customize the dashboard and manage devices in Azure IoT Central](./tutorial-in-store-analytics-customize-dashboard.md).
* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A Power BI account. If you don't have a Power BI account, sign up for a [free Power BI Pro trial](https://app.powerbi.com/signupredirect?pbi_source=web) before you begin.

## Create a resource group

Before you create your event hub and logic app, you need to create a resource group to manage them. The resource group should be in the same location as your **In-store analytics - checkout** IoT Central application. To create a resource group:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the left navigation, select **Resource groups**. Then select **Add**.
1. For **Subscription**, select the name of the Azure subscription you used to create your IoT Central application.
1. For the **Resource group** name, enter _retail-store-analysis_.
1. For the **Region**, select the same region you chose for the IoT Central application.
1. Select **Review + Create**.
1. On the **Review + Create** page, select **Create**.

You now have a resource group called **retail-store-analysis** in your subscription.

## Create an event hub

Before you can configure the retail monitoring application to export telemetry, you need to create an event hub to receive the exported data. The following steps show you how to create your event hub:

1. In the Azure portal, select **Create a resource** at the top left of the screen.
1. In **Search the Marketplace**, enter _Event Hubs_, and then press **Enter**.
1. On the **Event Hubs** page, select **Create**.
1. On the **Create Namespace** page, take the following steps:
    * Enter a unique name for the namespace such as _yourname-retail-store-analysis_. The system checks to see if this name is available.
    * Choose the **Basic** pricing tier.
    * Select the same **Subscription** you used to create your IoT Central application.
    * Select the **retail-store-analysis** resource group.
    * Select the same location you used for your IoT Central application.
    * Select **Create**. You may have to wait a few minutes for the system to provision the resources.
1. In the portal, navigate to the **retail-store-analysis** resource group. Wait for the deployment to complete. You may need to select **Refresh** to update the deployment status. You can also check the status of the event hub namespace creation in the **Notifications**.
1. In the **retail-store-analysis** resource group, select the **Event Hubs Namespace**. You see the home page for your **Event Hubs Namespace** in the portal.

You need a connection string with send permissions to connect from IoT Central. To create a connection string:

1. In your Event Hubs namespace in the Azure portal, select **Shared access policies**. The list of policies includes the default **RootManageSharedAccessKey** policy.
1. Select **+ Add**.
1. Enter *SendPolicy* as the policy name, select **Send**, and then select **Create**.
1. Select **SendPolicy** in the list of policies.
1. Make a note of the **Connection string-primary key** value. You use it when you configure the export destination in IoT Central.

You need a connection string with manage and listen permissions to connect to the event hub from your logic app. To retrieve a connection string:

1. In your Event Hubs namespace in the Azure portal, select **Shared access policies**. The list of policies includes the default **RootManageSharedAccessKey** policy.
1. Select **RootManageSharedAccessKey** in the list of policies.
1. Make a note of the **Connection string-primary key** value. You use it when you configure the logic app to fetch telemetry from your event hub.

Now you have an **Event Hubs Namespace**, you can create an event hub to use with your IoT Central application:

1. On the home page for your **Event Hubs Namespace** in the portal, select **+ Event Hub**.
1. On the **Create Event Hub** page, enter _store-telemetry_ as the name, and then select **Create**.

You now have an event hub you can use when you configure data export from your IoT Central application:

:::image type="content" source="media/tutorial-in-store-analytics-visualize-insights/event-hub.png" alt-text="Screenshot that shows the Event hub namespace in the Azure portal.":::

## Configure data export

Now you have an event hub, you can configure your **In-store analytics - checkout** application to export telemetry from the connected devices. The following steps show you how to configure the export:

1. Sign in to your **In-store analytics - checkout** IoT Central application.
1. Select **Data export** in the left pane.
1. Select **+ New export**.
1. Enter _Telemetry export_ as the **export name**.
1. Select **Telemetry** as type of data to export.
1. In the **Destinations** section, select **create a new one**.
1. Enter _Store data event hub_ as the **Destination name**.
1. Select **Azure Event Hubs** as the destination type.
1. Select **Connection string** as the authorization type.
1. Paste in the connection string for the **SendPolicy** you saved when you create the event hub.
1. Enter *store-telemetry* as the **Event Hub**.
1. Select **Create** and then **Save**.
1. On the **Telemetry export** page, wait for the export status to change to **Healthy**.

The data export may take a few minutes to start sending telemetry to your event hub. You can see the status of the export on the **Data exports** page.

## Create the Power BI datasets

Your Power BI dashboard displays data from your retail monitoring application. In this solution, you use Power BI streaming datasets as the data source for the Power BI dashboard. In this section, you define the schema of the streaming datasets so that the logic app can forward data from the event hub. The following steps show you how to create two streaming datasets for the environmental sensors and one streaming dataset for the occupancy sensor:

1. Sign in to your **Power BI** account.
1. Select **Workspaces**, and then select **Create a workspace**.
1. On the **Create a workspace** page, enter _In-store analytics - checkout_ as the **Workspace name**. Select **Save**.
1. On the workspace page, select **+ New > Streaming dataset**.
1. On the **New streaming dataset** page, choose **API**, and then select **Next**.
1. Enter _Zone 1 sensor_ as the **Dataset name**.
1. Enter the three **Values from stream** in following table:

    | Value name  | Value type |
    | ----------- | ---------- |
    | Timestamp   | DateTime   |
    | Humidity    | Number     |
    | Temperature | Number     |

1. Switch **Historic data analysis** on.
1. Select **Create** and then **Done**.
1. Create another streaming dataset called **Zone 2 sensor** with the same schema and settings as the **Zone 1 sensor** streaming dataset.

You now have two streaming datasets. The logic app routes telemetry from the two environmental sensors connected to your **In-store analytics - checkout** application to these two datasets:

:::image type="content" source="media/tutorial-in-store-analytics-visualize-insights/dataset-1.png" alt-text="Screenshot that shows the zone one sensor dataset definition in Power B I.":::

This solution uses one streaming dataset for each sensor because it's not possible to apply filters to streaming data in Power BI.

You also need a streaming dataset for the occupancy telemetry:

1. On the workspace page, select **Create > Streaming dataset**.
1. On the **New streaming dataset** page, choose **API**, and then select **Next**.
1. Enter _Occupancy sensor_ as the **Dataset name**.
1. Enter the five **Values from stream** in following table:

    | Value name     | Value type |
    | -------------- | ---------- |
    | Timestamp      | DateTime   |
    | Queue Length 1 | Number     |
    | Queue Length 2 | Number     |
    | Dwell Time 1   | Number     |
    | Dwell Time 2   | Number     |

1. Switch **Historic data analysis** on.
1. Select **Create** and then **Done**.

You now have a third streaming dataset that stores values from the simulated occupancy sensor. This sensor reports the queue length at the two checkouts in the store, and how long customers are waiting in these queues:

:::image type="content" source="media/tutorial-in-store-analytics-visualize-insights/dataset-2.png" alt-text="Screenshot that shows the occupancy dataset definition in Power B I.":::

## Create a logic app

In this solution, the logic app reads telemetry from the event hub, parses the data, and then sends it to the Power BI streaming datasets you created.

Before you create the logic app, you need the device IDs of the two RuuviTag sensors you connected to your IoT Central application in the [Create an in-store analytics application in Azure IoT Central](./tutorial-in-store-analytics-create-app.md) tutorial:

1. Sign in to your **In-store analytics - checkout** IoT Central application.
1. Select **Devices** in the left pane. Then select **RuuviTag**.
1. Make a note of the **Device IDs**. In the following screenshot, the IDs are **8r6vfyiv1x** and **1rvfk4ymk6z**:

:::image type="content" source="media/tutorial-in-store-analytics-visualize-insights/device-ids.png" alt-text="Screenshot that shows the device IDs in the device list in an IoT Central application." lightbox="media/tutorial-in-store-analytics-visualize-insights/device-ids.png":::

The following steps show you how to create the logic app in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Create a resource** at the top left of the screen.
1. In **Search the Marketplace**, enter _Logic App_, and then press **Enter**.
1. On the **Logic App** page, select **Create**.
1. On the **Create** page:
    * Enter a unique name for your logic app such as _yourname-retail-store-analysis_.
    * Select the same **Subscription** you used to create your IoT Central application.
    * Select the **retail-store-analysis** resource group.
    * Select the **Type** as **Consumption**.
    * Select the same location you used for your IoT Central application.
    * Select **Create**. You may have to wait a few minutes for the system to provision the resources.
1. In the Azure portal, navigate to your new logic app.
1. On the **Logic Apps Designer** page, scroll down and select **Blank Logic App**.
1. In **Search connectors and triggers**, enter _Event Hubs_.
1. In **Triggers**, select **When events are available in Event Hub**.
1. Enter _Store telemetry_ as the **Connection name**.
1. Select **Access key** as the authentication type.
1. Paste in the event hub connection string for the **RootManageSharedAccessKey** policy you made a note of previously, and select **Create**.
1. In the **When events are available in Event Hub** action:
    * In **Event Hub name**, select **store-telemetry**.
    * In **Content type**, select **application/json**.
    * Set the **Interval** to three and the **Frequency** to seconds
1. Select **Save** to save your logic app.

To add the logic to your logic app design, select **Code view**:

1. Replace `"actions": {},` with the following JSON. Then replace the two placeholders `[YOUR RUUVITAG DEVICE ID 1]` and `[YOUR RUUVITAG DEVICE ID 2]` with the IDs of your two RuuviTag devices. You made a note of these IDs previously:

    ```json
    "actions": {
        "Initialize_Device_ID_variable": {
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
        "Parse_Telemetry": {
            "inputs": {
                "content": "@triggerBody()?['ContentData']",
                "schema": {
                    "properties": {
                        "deviceId": {
                            "type": "string"
                        },
                        "enqueuedTime": {
                            "type": "string"
                        },
                        "telemetry": {
                            "properties": {
                                "DwellTime1": {
                                    "type": "number"
                                },
                                "DwellTime2": {
                                    "type": "number"
                                },
                                "count1": {
                                    "type": "integer"
                                },
                                "count2": {
                                    "type": "integer"
                                },
                                "humidity": {
                                    "type": "number"
                                },
                                "temperature": {
                                    "type": "number"
                                }
                            },
                            "type": "object"
                        },
                        "templateId": {
                            "type": "string"
                        }
                    },
                    "type": "object"
                }
            },
            "runAfter": {
                "Initialize_Device_ID_variable": [
                    "Succeeded"
                ]
            },
            "type": "ParseJson"
        },
        "Set_Device_ID_variable": {
            "inputs": {
                "name": "DeviceID",
                "value": "@body('Parse_Telemetry')?['deviceId']"
            },
            "runAfter": {
                "Parse_Telemetry": [
                    "Succeeded"
                ]
            },
            "type": "SetVariable"
        },
        "Switch_by_DeviceID": {
            "cases": {
                "Occupancy": {
                    "actions": {},
                    "case": "Occupancy"
                },
                "Zone 2 environment": {
                    "actions": {},
                    "case": "[YOUR RUUVITAG DEVICE ID 2]"
                },
                "Zone_1_environment": {
                    "actions": {},
                    "case": "[YOUR RUUVITAG DEVICE ID 1]"
                }
            },
            "default": {
                "actions": {}
            },
            "expression": "@variables('DeviceID')",
            "runAfter": {
                "Set_Device_ID_variable": [
                    "Succeeded"
                ]
            },
            "type": "Switch"
        }
    },
    ```

1. Select **Save** and then select **Designer** to see the visual version of the logic you added:

    :::image type="content" source="media/tutorial-in-store-analytics-visualize-insights/logic-app.png" alt-text="Screenshot of the Logic Apps Designer in the Azure portal with the initial logic app.":::

1. Select **Switch by DeviceID** to expand the action. Then select **Zone 1 environment**, and select **Add an action**.
1. In **Search connectors and actions**, enter **Add rows to a dataset**.
1. Select the Power BI **Add rows to a dataset** action.
1. Select **Sign in** and follow the prompts to sign in to your Power BI account.
1. After the sign-in process is complete, in the **Add rows to a dataset** action:
    * Select **In-store analytics - checkout** as the workspace.
    * Select **Zone 1 sensor** as the dataset.
    * Select **RealTimeData** as the table.
    * Select **Add new parameter** and then select the **Timestamp**, **Humidity**, and **Temperature** fields.
    * Select the **Timestamp** field, and then select **enqueuedTime** from the **Dynamic content** list.
    * Select the **Humidity** field, and then select **See more** next to **Parse Telemetry**. Then select **humidity**.
    * Select the **Temperature** field, and then select **See more** next to **Parse Telemetry**. Then select **temperature**.

    Select **Save** to save your changes. The **Zone 1 environment** action looks like the following screenshot:

    :::image type="content" source="media/tutorial-in-store-analytics-visualize-insights/zone-1-action.png" alt-text="Screenshot that shows the zone one environment action in the Logic Apps Designer.":::

1. Select the **Zone 2 environment** action, and select **Add an action**.
1. In **Search connectors and actions**, enter **Add rows to a dataset**.
1. Select the Power BI **Add rows to a dataset** action.
1. In the **Add rows to a dataset 2** action:
    * Select **In-store analytics - checkout** as the workspace.
    * Select **Zone 2 sensor** as the dataset.
    * Select **RealTimeData** as the table.
    * Select **Add new parameter** and then select the **Timestamp**, **Humidity**, and **Temperature** fields.
    * Select the **Timestamp** field, and then select **enqueuedTime** from the **Dynamic content** list.
    * Select the **Humidity** field, and then select **See more** next to **Parse Telemetry**. Then select **humidity**.
    * Select the **Temperature** field, and then select **See more** next to **Parse Telemetry**. Then select **temperature**.

    Select **Save** to save your changes.

1. Select the **Occupancy** action, and select **Add an action**.
1. In **Search connectors and actions**, enter **Add rows to a dataset**.
1. Select the Power BI **Add rows to a dataset** action.
1. In the **Add rows to a dataset 3** action:
    * Select **In-store analytics - checkout** as the workspace.
    * Select **Occupancy sensor** as the dataset.
    * Select **RealTimeData** as the table.
    * Select **Add new parameter** and then select the **Timestamp**, **Queue Length 1**, **Queue Length 2**, **Dwell Time 1**, and **Dwell Time 2** fields.
    * Select the **Timestamp** field, and then select **enqueuedTime** from the **Dynamic content** list.
    * Select the **Queue Length 1** field, and then select **See more** next to **Parse Telemetry**. Then select **count1**.
    * Select the **Queue Length 2** field, and then select **See more** next to **Parse Telemetry**. Then select **count2**.
    * Select the **Dwell Time 1** field, and then select **See more** next to **Parse Telemetry**. Then select **DwellTime1**.
    * Select the **Dwell Time 2** field, and then select **See more** next to **Parse Telemetry**. Then select **DwellTime2**.

    Select **Save** to save your changes. The **Occupancy** action looks like the following screenshot:

    :::image type="content" source="media/tutorial-in-store-analytics-visualize-insights/occupancy-action.png" alt-text="Screenshot that shows the occupancy action in the Logic Apps Designer.":::

The logic app runs automatically. To see the status of each run, navigate to the **Overview** page for the logic app in the Azure portal and select **Runs history**. Select **Refresh** to update the list of runs.

## Create a Power BI dashboard

Now you have telemetry flowing from your IoT Central application through your event hub. Then your logic app parses the event hub messages and adds them to a Power BI streaming dataset. Now, you can create a Power BI dashboard to visualize the telemetry:

1. Sign in to your **Power BI** account.
1. Select **Workspaces > In-store analytics - checkout**.
1. Select **+ New > Dashboard**.
1. Enter **Store analytics** as the dashboard name, and select **Create**.

### Add line charts

Add four line chart tiles to show the temperature and humidity from the two environmental sensors. Use the information in the following table to create the tiles. To add each tile, start by selecting **Edit > Add a tile**. Select **Custom Streaming Data**, and then select **Next**:

| Setting | Chart #1 | Chart #2 | Chart #3 | Chart #4 |
| ------- | -------- | -------- | -------- | -------- |
| Dataset | Zone 1 sensor | Zone 1 sensor | Zone 2 sensor | Zone 2 sensor |
| Visualization type | Line chart | Line chart | Line chart | Line chart |
| Axis | Timestamp | Timestamp | Timestamp | Timestamp |
| Values | Temperature | Humidity | Temperature | Humidity |
| Time window | 60 minutes | 60 minutes | 60 minutes | 60 minutes |
| Title | Temperature (1 hour) | Humidity (1 hour) | Temperature (1 hour) | Humidity (1 hour) |
| Subtitle | Zone 1 | Zone 1 | Zone 2 | Zone 2 |

The following screenshot shows the settings for the first chart:

:::image type="content" source="media/tutorial-in-store-analytics-visualize-insights/line-chart.png" alt-text="Screenshot that shows the line chart definition in the Power B I dashboard.":::

### Add cards to show environmental data

Add four card tiles to show the most recent temperature and humidity values from the two environmental sensors. Use the information in the following table to create the tiles. To add each tile, start by selecting **Edit > Add a tile**. Select **Custom Streaming Data**, and then select **Next**:

| Setting | Card #1 | Card #2 | Card #3 | Card #4 |
| ------- | ------- | ------- | ------- | ------- |
| Dataset | Zone 1 sensor | Zone 1 sensor | Zone 2 sensor | Zone 2 sensor |
| Visualization type | Card | Card | Card | Card |
| Fields | Temperature | Humidity | Temperature | Humidity |
| Title | Temperature (F) | Humidity (%) | Temperature (F) | Humidity (%) |
| Subtitle | Zone 1 | Zone 1 | Zone 2 | Zone 2 |

The following screenshot shows the settings for the first card:

:::image type="content" source="media/tutorial-in-store-analytics-visualize-insights/card-settings.png" alt-text="Screenshot that shows the card definition in the Power B I dashboard.tings.":::

### Add tiles to show checkout occupancy data

Add four card tiles to show the queue length and dwell time for the two checkouts in the store. Use the information in the following table to create the tiles. To add each tile, start by selecting **Edit > Add a tile**. Select **Custom Streaming Data**, and then select **Next**:

| Setting | Card #1 | Card #2 | Card #3 | Card #4 |
| ------- | ------- | ------- | ------- | ------- |
| Dataset | Occupancy sensor | Occupancy sensor | Occupancy sensor | Occupancy sensor |
| Visualization type | Clustered column chart | Clustered column chart | Gauge | Gauge |
| Axis    | Timestamp | Timestamp | N/A | N/A |
| Value | Dwell Time 1 | Dwell Time 2 | Queue Length 1 | Queue Length 2 |
| Time window | 60 minutes | 60 minutes |  N/A | N/A |
| Title | Dwell Time | Dwell Time | Queue Length | Queue Length |
| Subtitle | Checkout 1 | Checkout 2 | Checkout 1 | Checkout 2 |

Resize and rearrange the tiles on your dashboard to look like the following screenshot:

:::image type="content" source="media/tutorial-in-store-analytics-visualize-insights/pbi-dashboard.png" alt-text="Screenshot that shows the Power BI dashboard with resized and rearranged tiles.":::

You could add some graphics resources to further customize the dashboard:

:::image type="content" source="media/tutorial-in-store-analytics-visualize-insights/pbi-dashboard-graphics.png" alt-text="Screenshot that shows the Power BI dashboard with additional graphics.":::

## Clean up resources

If you've finished with your IoT Central application, you can delete it by signing in to the application and navigating to the **Management** page in the **Application** section.

If you want to keep the application but reduce the costs associated with it, disable the data export that's sending telemetry to your event hub.

You can delete the event hub and logic app in the Azure portal by deleting the resource group called **retail-store-analysis**.

You can delete your Power BI datasets and dashboard by deleting the workspace from the Power BI settings page for the workspace.

## Next Steps

These three tutorials have shown you an end-to-end solution that uses the **In-store analytics - checkout** IoT Central application template. You've connected devices to the application, used IoT Central to monitor the devices, and used Power BI to build a dashboard to view insights from the device telemetry. A recommended next step is to explore one of the other IoT Central application templates:

> [!div class="nextstepaction"]
> [Build energy solutions with IoT Central](../energy/overview-iot-central-energy.md)
