---
title: "Tutorial - Deploy Azure Stream Analytics as an IoT Edge module"
description: "In this tutorial, you deploy Azure Stream Analytics as a module to an IoT Edge device."
author: PatAltimore
ms.author: patricka
ms.date: 3/10/2023
ms.topic: tutorial
ms.service: iot-edge
ms.custom: mvc
---

# Tutorial: Deploy Azure Stream Analytics as an IoT Edge module

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

In this tutorial, you create an Azure Stream Analytics job in the Azure portal and then deploy it as an IoT Edge module with no extra code.

You learn how to:
> [!div class="checklist"]
>
> * Create an Azure Stream Analytics job to process data on the edge.
> * Connect the new Azure Stream Analytics job with other IoT Edge modules.
> * Deploy the Azure Stream Analytics job to an IoT Edge device from the Azure portal.

:::image type="content" source="./media/tutorial-deploy-stream-analytics/asa-architecture.png" alt-text="Diagram of stream architecture, showing the staging and deploying of an Azure Stream Analytics job.":::

The Stream Analytics module in this tutorial calculates the average temperature over a rolling 30-second window. When that average reaches 70, the module sends an alert for the device to take action. In this case, that action is to reset the simulated temperature sensor. In a production environment, you might use this functionality to shut off a machine or take preventative measures when the temperature reaches dangerous levels.

## Why use Azure Stream Analytics in IoT Edge?

Many IoT solutions use analytics services to gain insight about data as it arrives in the cloud from IoT devices. With Azure IoT Edge, you can take [Azure Stream Analytics](../stream-analytics/index.yml) logic and move it onto the device itself. By processing telemetry streams at the edge, you can reduce the amount of uploaded data and reduce the time it takes to react to actionable insights. Azure IoT Edge and Azure Stream Analytics are integrated to simplify your workload development. 

Azure Stream Analytics provides a richly structured query syntax for data analysis, both in the cloud and on IoT Edge devices. For more information, see [Azure Stream Analytics documentation](../stream-analytics/stream-analytics-edge.md).

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

* An Azure IoT Edge device.

   You can use an Azure virtual machine as an IoT Edge device by following the steps in the quickstart for [Linux](quickstart-linux.md) or [Windows devices](quickstart.md).

* A free or standard-tier [IoT Hub](../iot-hub/iot-hub-create-through-portal.md) in Azure.

## Create an Azure Stream Analytics job

In this section, you create an Azure Stream Analytics job that does the following steps:

* Receive data from your IoT Edge device.
* Query the telemetry data for values outside a set range.
* Take action on the IoT Edge device based on the query results.

### Create a storage account

When you create an Azure Stream Analytics job to run on an IoT Edge device, it needs to be stored in a way that can be called from the device. You can use an existing Azure Storage account, or create a new one now.

1. In the Azure portal, go to **Create a resource** > **Storage** > **Storage account**.

1. Provide the following values to create your storage account:

   | Field | Value |
   | ----- | ----- |
   | Subscription | Choose the same subscription as your IoT hub. |
   | Resource group | We recommend that you use the same resource group for all of your test resources for the IoT Edge quickstarts and tutorials. For example, **IoTEdgeResources**. |
   | Name | Provide a unique name for your storage account. |
   | Location | Choose a location close to you. |

1. Keep the default values for the other fields and select **Review + Create**.

1. Review your settings then select **Create**.

### Create a new job

1. In the [Azure portal](https://portal.azure.com/#home), select:
    1. **Create a resource**
    1. **Internet of Things** from the menu on the left
    1. Type **Stream Analytics** in the search bar to find it in the Marketplace
    1. Select **Create**, then **Stream Analytics job** from the dropdown menu
   
   :::image type="content" source="media/tutorial-deploy-stream-analytics/select-stream-analytics-job.png" alt-text="Screenshot showing where to find the Stream Analytics job service in the Marketplace and where to create a new job.":::

1. Provide the following values to create your new Stream Analytics job:

   | Field | Value |
   | ----- | ----- |
   | Name | Provide a name for your job. For example, **IoTEdgeJob** |
   | Subscription | Choose the same subscription as your IoT hub. |
   | Resource group | We recommend using the same resource group for all test resources you create during the IoT Edge quickstarts and tutorials. For example, a resource named **IoTEdgeResources**. |
   | Region | Choose a location close to you. |
   | Hosting environment | Select **Edge**. This option means deployment goes to an IoT Edge device instead of being hosted in the cloud. |

1. Select **Review + create**.

1. Confirm your options, then select **Create**.

### Configure your job

Once your Stream Analytics job is created in the Azure portal, you can configure it with an *input*, an *output*, and a *query* to run on the data that passes through.

This section creates a job that receives temperature data from an IoT Edge device. It analyzes that data in a rolling, 30-second window. If the average temperature in that window goes over 70 degrees, an alert is sent to the IoT Edge device. 

> [!NOTE]
> You specify exactly where the data comes from and goes to in the next section, [Configure IoT Edge settings](#configure-iot-edge-settings), when you deploy the job.  

#### Set your input and output

1. Navigate to your Stream Analytics job in the Azure portal.

1. Under **Job topology**, select **Inputs** then **Add input**.

   :::image type="content" source="./media/tutorial-deploy-stream-analytics/add-input.png" alt-text="Screenshot showing where to add stream input in the Azure portal.":::

1. Choose **Edge Hub** from the drop-down list.

   If you don't see the **Edge Hub** option in the list, then you may have created your Stream Analytics job as a cloud-hosted job. Try creating a new job and be sure to select **Edge** as the hosting environment.

1. In the **New input** pane, enter **temperature** as the **Input alias**.

1. Keep the default values for the other fields, and select **Save**.

1. Under **Job Topology**, open **Outputs** then select **Add**.

   :::image type="content" source="./media/tutorial-deploy-stream-analytics/add-output.png" alt-text="Screenshot showing where to add stream output in the Azure portal.":::

1. Choose **Edge Hub** from the drop-down list.

1. In the **New output** pane, enter **alert** as the output alias.

1. Keep the default values for the other fields, and select **Save**.

#### Create a query

1. Under **Job Topology**, select **Query**.

1. Replace the default text with the following query. 

    ```sql
    SELECT  
        'reset' AS command
    INTO
       alert
    FROM
       temperature TIMESTAMP BY timeCreated
    GROUP BY TumblingWindow(second,30)
    HAVING Avg(machine.temperature) > 70
    ```

   In this query, the SQL code sends a reset command to the alert output if the average machine temperature in a 30-second window reaches 70 degrees. The reset command has been preprogrammed into the sensor as an action that can be taken.

1. Select **Save query**.

### Configure IoT Edge settings

To prepare your Stream Analytics job to be deployed on an IoT Edge device, you need to associate your Azure Stream Analytics job with a storage account. When you deploy your job, the job definition is exported to the storage account in the form of a container.

1. In your Stream Analytics service under the **Settings** menu, select **Storage account settings**. 

1. Choose the **Select Blob storage/ADLS Gen 2 from your subscriptions** option.

1. Your Azure storage account automatically shows on the page. If you don't see one, make sure you [create a storage](#create-a-storage-account). Or if you need to choose a different storage than the one listed in the **Storage account** field, select it from the dropdown menu.

1. Select **Save**, if you had to make any changes.

   :::image type="content" source="./media/tutorial-deploy-stream-analytics/add-storage-account.png" alt-text="Screenshot of where to add a storage account in your Stream Analytics job in the Azure portal." lightbox="./media/tutorial-deploy-stream-analytics/add-storage-account.png":::

## Deploy the job

You're now ready to deploy the Azure Stream Analytics job on your IoT Edge device.

In this section, you use the **Set Modules** wizard in the Azure portal to create a *deployment manifest*. A deployment manifest is a JSON file that describes all the modules that get deployed to a device. The manifest also shows the container registries that store the module images, how the modules should be managed, and how the modules can communicate with each other. Your IoT Edge device retrieves its deployment manifest from IoT Hub, then uses the information in it to deploy and configure all of its assigned modules.

For this tutorial, you deploy two modules. The first is **SimulatedTemperatureSensor**, which is a module that simulates a temperature and humidity sensor. The second is your Stream Analytics job. The sensor module provides the stream of data that your job query analyzes.

1. In the Azure portal, navigate to your IoT hub.

1. Select **Devices** under the **Device management** menu, and then select your IoT Edge device to open it.

1. Select **Set modules**.  

1. If you previously deployed the SimulatedTemperatureSensor module on this device, it might autopopulate. If it doesn't, add the module with the following steps:

   1. Select **+ Add** and choose **IoT Edge Module**.
   1. For the name, type **SimulatedTemperatureSensor**.
   1. For the image URI, enter **mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.4**.
   1. Leave the other default settings, then select **Add**.

1. Add your Azure Stream Analytics Edge job with the following steps:

   1. Select **+ Add** and choose **Azure Stream Analytics Module**.
   1. Select your subscription and the Azure Stream Analytics Edge job that you created.
   1. Select **Save**.

   Once you save your changes, the details of your Stream Analytics job are published to the storage container that you created.

1. After your Stream Analytics addition finishes deployment, confirm that two new modules appear on your **Set modules** page.

   :::image type="content" source="media/tutorial-deploy-stream-analytics/two-new-modules.png" alt-text="Screenshot confirming that two new modules are on your device. The screenshot also shows where the Review + create button is located." lightbox="media/tutorial-deploy-stream-analytics/two-new-modules.png":::

1. Select **Review + create**. The deployment manifest appears.

1. Select **Create**.

1. On your **Set modules** page of your device, after a few minutes, you should see the modules listed and running. Refresh the page if you don't see modules, or wait a few more minutes then refresh it again.

   :::image type="content" source="media/tutorial-deploy-stream-analytics/module-confirmation.png" alt-text="Screenshot that shows your modules list of your device in the Azure portal." lightbox="media/tutorial-deploy-stream-analytics/module-confirmation.png":::

### Understand the two new modules

1. From the **Set modules** tab of your device, select your Stream Analytics module name to take you to the **Update IoT Edge Module** page. Here you can update the settings.

   The **Settings** tab has the **Image URI** that points to a standard Azure Stream Analytics image. This single image is used for every Stream Analytics module that gets deployed to an IoT Edge device.

   The **Module Twin Settings** tab shows the JSON that defines the Azure Stream Analytics (ASA) property called **ASAJobInfo**. The value of that property points to the job definition in your storage container. This property is how the Stream Analytics image is configured with your specific job details.

   By default, the Stream Analytics module takes the same name as the job it's based on. You can change the module name on this page if you like, but it's not necessary.

1. Select **Apply** if you made changes or **Cancel** if you didn't make any changes.

### Assign routes to your modules

1. On the **Set modules on device:\<your-device-name\>** page, select **Next: Routes**.

1. On the **Routes** tab, you define how messages are passed between modules and the IoT Hub. Messages are constructed using name and value pairs. 
 
   Add the route names and values with the pairs shown in following table. Replace instances of `{moduleName}` with the name of your Azure Stream Analytics module. This module should be the same name you see in the modules list of your device on the **Set modules** page, as shown in the Azure portal.

   :::image type="content" source="media/tutorial-deploy-stream-analytics/stream-analytics-module-name.png" alt-text="Screenshot showing the name of your Stream Analytics modules in your I o T Edge device in the Azure portal." lightbox="media/tutorial-deploy-stream-analytics/stream-analytics-module-name.png":::

    | Name | Value |
    | --- | --- |
    | telemetryToCloud | `FROM /messages/modules/SimulatedTemperatureSensor/* INTO $upstream` |
    | alertsToCloud | `FROM /messages/modules/{moduleName}/* INTO $upstream` |
    | alertsToReset | `FROM /messages/modules/{moduleName}/* INTO BrokeredEndpoint("/modules/SimulatedTemperatureSensor/inputs/control")` |
    | telemetryToAsa | `FROM /messages/modules/SimulatedTemperatureSensor/* INTO BrokeredEndpoint("/modules/{moduleName}/inputs/temperature")`|

    The routes you declare here define the flow of data through the IoT Edge device. The telemetry data from SimulatedTemperatureSensor are sent to IoT Hub and to the **temperature** input that was configured in the Stream Analytics job. The **alert** output messages are sent to IoT Hub and to the SimulatedTemperatureSensor module to trigger the reset command.

1. Select **Next: Review + Create**.

1. In the **Review + Create** tab, you can see how the information you provided in the wizard is converted into a JSON deployment manifest. 
 
1. When you're done reviewing the manifest, select **Create** to finish setting your module.

## View data

Now you can go to your IoT Edge device to see the interaction between the Azure Stream Analytics module and the SimulatedTemperatureSensor module.

> [!NOTE]
> If you're using a virtual machine for a device, you can use the [Azure Cloud Shell](/azure/cloud-shell/overview) to directly access all Azure authenticated services.

1. Check that all the modules are running in Docker:

   ```cmd/sh
   iotedge list  
   ```

1. View all system logs and metrics data. Replace *{moduleName}* with the name of your Azure Stream Analytics module:

   ```cmd/sh
   iotedge logs -f {moduleName}  
   ```

1. See how the reset command affects the SimulatedTemperatureSensor by viewing the sensor logs:

   ```cmd/sh
   iotedge logs SimulatedTemperatureSensor
   ```

   You can watch the machine's temperature gradually rise until it reaches 70 degrees for 30 seconds. Then the Stream Analytics module triggers a reset, and the machine temperature drops back to 21.

   :::image type="content" source="./media/tutorial-deploy-stream-analytics/docker-log.png" alt-text="Screenshot that shows the reset command in your output from your module logs." lightbox="./media/tutorial-deploy-stream-analytics/docker-log.png":::

## Clean up resources

If you plan to continue to the next recommended article, you can keep the resources and configurations that you created and reuse them. You can also keep using the same IoT Edge device as a test device.

Otherwise, you can delete the local configurations and the Azure resources that you used in this article to avoid charges.

[!INCLUDE [iot-edge-clean-up-cloud-resources](includes/iot-edge-clean-up-cloud-resources.md)]

## Next steps

In this tutorial, you configured an Azure Streaming Analytics job to analyze data from your IoT Edge device. You then loaded this Azure Stream Analytics module on your IoT Edge device to process and react to temperature increase locally, and sending the aggregated data stream to the cloud. To see how Azure IoT Edge can create more solutions for your business, continue on to the other tutorials.

> [!div class="nextstepaction"]
> [Deploy an Azure Machine Learning model as a module](tutorial-deploy-machine-learning.md)