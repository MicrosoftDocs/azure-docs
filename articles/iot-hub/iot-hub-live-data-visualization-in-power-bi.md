---
title: Real-time data visualization of data from Azure IoT Hub – Power BI
description: Use Power BI to visualize temperature and humidity data that is collected from the sensor and sent to your Azure IoT hub.
author: robinsh
keywords: real time data visualization, live data visualization, sensor data visualization
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.tgt_pltfrm: arduino
ms.date: 7/23/2021
ms.author: robinsh
---

# Tutorial: Visualize real-time sensor data from Azure IoT Hub using Power BI

You can use Microsoft Power BI to visualize real-time sensor data that your Azure IoT hub receives. To do so, you configure an Azure Stream Analytics job to consume the data from IoT Hub and route it to a dataset in Power BI. 

:::image type="content" source="./media/iot-hub-live-data-visualization-in-power-bi/end-to-end-diagram.png" alt-text="End-to-end diagram" border="false":::

 [Microsoft Power BI](https://powerbi.microsoft.com/) is a data visualization tool that you can use to perform self-service and enterprise business intelligence (BI) over large data sets. [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/#overview) is a fully managed, real-time analytics service designed to help you analyze and process fast moving streams of data that can be used to get insights, build reports or trigger alerts and actions. 

In this tutorial, you perform the following tasks:

> [!div class="checklist"]
> * Create a consumer group on your IoT hub.
> * Create and configure an Azure Stream Analytics job to read temperature telemetry from your consumer group and send it to Power BI.
> * Create a report of the temperature data in Power BI and share it to the web.

## Prerequisites

* Complete the one of the [Send telemetry](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-csharp) quickstarts in the development language of your choice. Alternatively, you can use any device app that sends temperature telemetry; for example, the [Raspberry Pi online simulator](iot-hub-raspberry-pi-web-simulator-get-started.md) or one of the [Embedded device](../iot-develop/quickstart-devkit-mxchip-az3166.md) quickstarts. These articles cover the following requirements:
  
  * An active Azure subscription.
  * An Azure IoT hub in your subscription.
  * A client app that sends messages to your Azure IoT hub.

* A Power BI account. ([Try Power BI for free](https://powerbi.microsoft.com/))

[!INCLUDE [iot-hub-get-started-create-consumer-group](../../includes/iot-hub-get-started-create-consumer-group.md)]

## Create, configure, and run a Stream Analytics job

Let's start by creating a Stream Analytics job. After you create the job, you define the inputs, outputs, and the query used to retrieve the data.

### Create a Stream Analytics job

1. In the [Azure portal](https://portal.azure.com), select **Create a resource**. Type *Stream Analytics Job* in the search box and select it from the drop-down list. On the **Stream Analytics job** overview page, select **Create**

2. Enter the following information for the job.

   **Job name**: The name of the job. The name must be globally unique.

   **Resource group**: Use the same resource group that your IoT hub uses.

   **Location**: Use the same location as your resource group.

   :::image type="content" source="./media/iot-hub-live-data-visualization-in-power-bi/create-stream-analytics-job.png" alt-text="Create a Stream Analytics job in Azure":::

3. Select **Create**.

### Add an input to the Stream Analytics job

1. Open the Stream Analytics job.

2. Under **Job topology**, select **Inputs**.

3. In the **Inputs** pane, select **Add stream input**, then select **IoT Hub** from the drop-down list. On the new input pane, enter the following information:

   **Input alias**: Enter a unique alias for the input.

   **Select IoT Hub from your subscription**: Select this radio button.

   **Subscription**: Select the Azure subscription you're using for this tutorial.

   **IoT Hub**: Select the IoT Hub you're using for this tutorial.

   **Endpoint**: Select **Messaging**.

   **Shared access policy name**: Select the name of the shared access policy you want the Stream Analytics job to use for your IoT hub. For this tutorial, you can select *service*. The *service* policy is created by default on new IoT hubs and grants permission to send and receive on cloud-side endpoints exposed by the IoT hub. To learn more, see [Access control and permissions](iot-hub-dev-guide-sas.md#access-control-and-permissions).

   **Shared access policy key**: This field is autofilled based on your selection for the shared access policy name.

   **Consumer group**: Select the consumer group you created previously.

   Leave all other fields at their defaults.

   :::image type="content" source="./media/iot-hub-live-data-visualization-in-power-bi/add-input-to-stream-analytics-job.png" alt-text="Add an input to a Stream Analytics job in Azure":::

4. Select **Save**.

### Add an output to the Stream Analytics job

1. Under **Job topology**, select **Outputs**.

2. In the **Outputs** pane, select **Add**, and then select **Power BI** from the drop-down list.

3. On the **Power BI - New output** pane, select **Authorize** and follow the prompts to sign in to your Power BI account.

4. After you've signed in to Power BI, enter the following information:

   **Output alias**: A unique alias for the output.

   **Group workspace**: Select your target group workspace.

   **Dataset name**: Enter a dataset name.

   **Table name**: Enter a table name.

   **Authentication mode**: Leave at the default.

   :::image type="content" source="./media/iot-hub-live-data-visualization-in-power-bi/add-output-to-stream-analytics-job.png" alt-text="Add an output to a Stream Analytics job in Azure":::

5. Select **Save**.

### Configure the query of the Stream Analytics job

1. Under **Job topology**, select **Query**.

2. Replace `[YourInputAlias]` with the input alias of the job.

3. Replace `[YourOutputAlias]` with the output alias of the job.

1. Add the following `WHERE` clause as the last line of the query. This line ensures that only messages with a **temperature** property will be forwarded to Power BI.

    ```sql
    WHERE temperature IS NOT NULL
    ```
1. Your query should look similar to the following screenshot. Select **Save query**.

    :::image type="content" source="./media/iot-hub-live-data-visualization-in-power-bi/add-query-to-stream-analytics-job.png" alt-text="Add a query to a Stream Analytics job":::

### Run the Stream Analytics job

In the Stream Analytics job, select **Overview**, then select **Start** > **Now** > **Start**. Once the job successfully starts, the job status changes from **Stopped** to **Running**.

:::image type="content" source="./media/iot-hub-live-data-visualization-in-power-bi/run-stream-analytics-job.png" alt-text="Run a Stream Analytics job in Azure":::

## Create and publish a Power BI report to visualize the data

The following steps show you how to create and publish a report using the Power BI service. You can follow these steps, with some modification, if you want to use the "new look" in Power BI. To understand the differences and how to navigate in the "new look", see [The 'new look' of the Power BI service](/power-bi/fundamentals/desktop-latest-update).

1. Make sure the client app is running on your device.

2. Sign in to your [Power BI](https://powerbi.microsoft.com/) account and select **Power BI service** from the top menu.

3. Select the workspace you used from the side menu, **My Workspace**.

4. Under the **All** tab or the **Datasets + dataflows** tab, you should see the dataset that you specified when you created the output for the Stream Analytics job.

5. Hover over the dataset you created, select **More options** menu (the three dots to the right of the dataset name), and then select **Create report**.

    :::image type="content" source="./media/iot-hub-live-data-visualization-in-power-bi/power-bi-create-report.png" alt-text="Create a Microsoft Power BI report":::

6. Create a line chart to show real-time temperature over time.

   1. On the **Visualizations** pane of the report creation page, select the line chart icon to add a line chart. Use the guides located on the sides and corners of the chart to adjust its size and position.

   2. On the **Fields** pane, expand the table that you specified when you created the output for the Stream Analytics job.

   3. Drag **EventEnqueuedUtcTime** to **Axis** on the **Visualizations** pane.

   4. Drag **temperature** to **Values**.

      A line chart is created. The x-axis displays date and time in the UTC time zone. The y-axis displays temperature from the sensor.

      :::image type="content" source="./media/iot-hub-live-data-visualization-in-power-bi/power-bi-add-temperature.png" alt-text="Add a line chart for temperature to a Microsoft Power BI report":::

     > [!NOTE]
     > Depending on the device or simulated device that you use to send telemetry data, you may have a slightly different list of fields.
     >

8. Select **Save** to save the report. When prompted, enter a name for your report. When prompted for a sensitivity label, you can select **Public** and then select **Save**.

10. Still on the report pane, select **File** > **Embed report** > **Website or portal**.

    :::image type="content" source="./media/iot-hub-live-data-visualization-in-power-bi/power-bi-select-embed-report.png" alt-text="Select embed report website for the Microsoft Power BI report":::

    > [!NOTE]
    > If you get a notification to contact your administrator to enable embed code creation, you may need to contact them. Embed code creation must be enabled before you can complete this step.
    >
    > :::image type="content" source="./media/iot-hub-live-data-visualization-in-power-bi/contact-admin.png" alt-text="Contact your administrator notification":::


11. You're provided the report link that you can share with anyone for report access and a code snippet that you can use to integrate the report into a blog or website. Copy the link in the **Secure embed code** window and then close the window.

    :::image type="content" source="./media/iot-hub-live-data-visualization-in-power-bi/copy-secure-embed-code.png" alt-text="Copy the embed report link":::

12. Open a web browser and paste the link into the address bar.

    :::image type="content" source="./media/iot-hub-live-data-visualization-in-power-bi/power-bi-web-output.png" alt-text="Publish a Microsoft Power BI report":::

Microsoft also offers the [Power BI mobile apps](https://powerbi.microsoft.com/documentation/powerbi-power-bi-apps-for-mobile-devices/) for viewing and interacting with your Power BI dashboards and reports on your mobile device.

## Cleanup resources

In this tutorial, you've created a resource group, an IoT hub, a Stream Analytics job, and a dataset in Power BI. 

If you plan to complete other tutorials, you may want to leave the resource group and IoT hub and reuse them later. 

If you don't need the IoT hub or the other resources you created any longer, you can delete the resource group in the portal. To do so, select the resource group and then select **Delete resource group**. If you want to keep the IoT hub, you can delete other resources from the **Overview** pane of the resource group. To do so, right-click the resource, select **Delete** from the context menu, and follow the prompts. 

### Use the Azure CLI to clean up Azure resources

To remove the resource group and all of its resources, use the [az group delete](/cli/azure/group#az_group_delete) command.

```azurecli-interactive
az group delete --name {your resource group}
```

### Clean up Power BI resources

You created a dataset, **PowerBiVisualizationDataSet**, in Power BI. To remove it, sign in to your [Power BI](https://powerbi.microsoft.com/) account. On the left-hand menu under **Workspaces**, select **My workspace**. In the list of datasets under the **DataSets + dataflows** tab, hover over the **PowerBiVisualizationDataSet** dataset. Select the three vertical dots that appear to the right of the dataset name to open the **More options** menu, then select **Delete** and follow the prompts. When you remove the dataset, the report is removed as well.

## Next steps

In this tutorial, you learned how to use Power BI to visualize real-time sensor data from your Azure IoT hub by performing the following tasks:

> [!div class="checklist"]
> * Create a consumer group on your IoT hub.
> * Create and configure an Azure Stream Analytics job to read temperature telemetry from your consumer group and send it to Power BI.
> * Configure a report for the temperature data in Power BI and share it to the web.

For another way to visualize data from Azure IoT Hub, see the following article.

> [!div class="nextstepaction"]
> [Use a web app to visualize real-time sensor data from Azure IoT Hub](iot-hub-live-data-visualization-in-web-apps.md).